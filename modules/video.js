/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   VIDEO ANALYSIS MODULE

   기능
   - 영상 불러오기
   - 재생 / 일시정지
   - 슬로모션
     0.1x / 0.25x / 0.5x / 0.75x / 1.0x
   - 프레임 단위 이동
   - 타임라인 이동
   - 현재시간 / 전체시간
   - 분석 장면 캡처
   - 카메라와 영상 분석 충돌 방지
========================================================= */

"use strict";


window.SeolcheonVideo = (() => {

  /* =====================================================
     STATE
  ===================================================== */

  let video = null;

  let uploadInput = null;

  let progress = null;

  let currentTimeLabel = null;

  let totalTimeLabel = null;

  let objectURL = null;

  let videoFPS = 30;

  let videoLoaded = false;


  /* =====================================================
     ELEMENT
  ===================================================== */

  function getElements() {

    video =
      document.querySelector(
        "[data-analysis-video]"
      );


    uploadInput =
      document.querySelector(
        "[data-video-upload]"
      );


    progress =
      document.querySelector(
        "[data-video-progress]"
      );


    currentTimeLabel =
      document.querySelector(
        "[data-current-time]"
      );


    totalTimeLabel =
      document.querySelector(
        "[data-total-time]"
      );

  }


  /* =====================================================
     TIME FORMAT
  ===================================================== */

  function formatTime(seconds) {

    if (
      !Number.isFinite(seconds)
    ) {

      return "00:00.00";

    }


    const minutes =
      Math.floor(
        seconds / 60
      );


    const remaining =
      seconds -
      minutes * 60;


    return (
      String(minutes)
        .padStart(2, "0") +
      ":" +
      remaining
        .toFixed(2)
        .padStart(5, "0")
    );

  }


  /* =====================================================
     CAMERA STOP
  ===================================================== */

  function stopCameraBeforeVideo() {

    try {

      if (
        window.SeolcheonCamera &&
        typeof window.SeolcheonCamera.stop ===
          "function"
      ) {

        window.SeolcheonCamera.stop();

      }

    }

    catch (error) {

      console.warn(
        "[VIDEO] camera stop error",
        error
      );

    }

  }


  /* =====================================================
     VIDEO LOAD
  ===================================================== */

  function loadVideo(file) {

    if (
      !file ||
      !video
    ) {

      return;

    }


    /*
      영상 파일인지 확인
    */

    if (
      file.type &&
      !file.type.startsWith(
        "video/"
      )
    ) {

      alert(
        "영상 파일을 선택해주세요."
      );

      return;

    }


    stopCameraBeforeVideo();


    /*
      이전 URL 제거
    */

    if (objectURL) {

      URL.revokeObjectURL(
        objectURL
      );

      objectURL = null;

    }


    /*
      camera stream 제거
    */

    video.pause();

    video.srcObject =
      null;


    objectURL =
      URL.createObjectURL(
        file
      );


    video.dataset.objectUrl =
      objectURL;


    video.src =
      objectURL;


    /*
      영상 분석에서는 autoplay OFF
    */

    video.autoplay =
      false;


    video.controls =
      false;


    video.muted =
      true;


    video.playsInline =
      true;


    video.playbackRate =
      1;


    const rateSelect =
      document.querySelector(
        "[data-playback-rate]"
      );


    if (rateSelect) {

      rateSelect.value =
        "1";

    }


    video.load();


    videoLoaded =
      true;


    console.log(
      "[VIDEO] FILE LOADED:",
      file.name
    );

  }


  /* =====================================================
     METADATA
  ===================================================== */

  function handleMetadata() {

    if (!video) {
      return;
    }


    if (totalTimeLabel) {

      totalTimeLabel.textContent =
        formatTime(
          video.duration
        );

    }


    if (currentTimeLabel) {

      currentTimeLabel.textContent =
        "00:00.00";

    }


    if (progress) {

      progress.min =
        "0";

      progress.max =
        "1000";

      progress.value =
        "0";

    }


    resizeAnalysisCanvases();

  }


  /* =====================================================
     TIME UPDATE
  ===================================================== */

  function handleTimeUpdate() {

    if (!video) {
      return;
    }


    if (currentTimeLabel) {

      currentTimeLabel.textContent =
        formatTime(
          video.currentTime
        );

    }


    if (
      progress &&
      Number.isFinite(
        video.duration
      ) &&
      video.duration > 0
    ) {

      progress.value =
        String(
          Math.round(
            (
              video.currentTime /
              video.duration
            ) * 1000
          )
        );

    }

  }


  /* =====================================================
     PLAY
  ===================================================== */

  async function play() {

    if (!video) {
      return;
    }


    /*
      카메라가 실행 중이면
      video.play()는 카메라 스트림을 재생하는 것이므로
      그대로 허용
    */

    try {

      await video.play();

    }

    catch (error) {

      console.error(
        "[VIDEO PLAY]",
        error
      );

    }

  }


  /* =====================================================
     PAUSE
  ===================================================== */

  function pause() {

    if (!video) {
      return;
    }


    video.pause();

  }


  /* =====================================================
     PLAYBACK RATE / SLOW MOTION
  ===================================================== */

  function setPlaybackRate(rate) {

    if (!video) {
      return;
    }


    const parsed =
      Number(rate);


    const allowedRates = [
      0.1,
      0.25,
      0.5,
      0.75,
      1
    ];


    if (
      !allowedRates.includes(
        parsed
      )
    ) {

      return;

    }


    /*
      MediaStream 실시간 카메라는
      playbackRate 슬로모션이 의미가 없음.

      업로드된 영상에서 사용.
    */

    if (
      video.srcObject
    ) {

      console.log(
        "[VIDEO] live camera does not support playback slow motion"
      );

      return;

    }


    video.playbackRate =
      parsed;


    console.log(
      "[VIDEO] PLAYBACK RATE:",
      parsed
    );

  }


  /* =====================================================
     FRAME STEP
  ===================================================== */

  function getFrameDuration() {

    return 1 / videoFPS;

  }


  function framePrevious() {

    if (!video) {
      return;
    }


    /*
      실시간 카메라에서는 프레임 이동 불가
    */

    if (
      video.srcObject
    ) {

      return;

    }


    video.pause();


    const frameDuration =
      getFrameDuration();


    video.currentTime =
      Math.max(
        0,
        video.currentTime -
          frameDuration
      );


    handleTimeUpdate();

  }


  function frameNext() {

    if (!video) {
      return;
    }


    if (
      video.srcObject
    ) {

      return;

    }


    video.pause();


    const frameDuration =
      getFrameDuration();


    const duration =
      Number.isFinite(
        video.duration
      )
        ? video.duration
        : Infinity;


    video.currentTime =
      Math.min(
        duration,
        video.currentTime +
          frameDuration
      );


    handleTimeUpdate();

  }


  /* =====================================================
     TIMELINE SEEK
  ===================================================== */

  function seekFromProgress() {

    if (
      !video ||
      !progress
    ) {

      return;

    }


    if (
      video.srcObject
    ) {

      return;

    }


    if (
      !Number.isFinite(
        video.duration
      )
    ) {

      return;

    }


    const percent =
      Number(
        progress.value
      ) / 1000;


    video.currentTime =
      video.duration *
      percent;

  }


  /* =====================================================
     CANVAS RESIZE
  ===================================================== */

  function resizeAnalysisCanvases() {

    if (!video) {
      return;
    }


    const width =
      video.videoWidth ||
      1280;


    const height =
      video.videoHeight ||
      720;


    document
      .querySelectorAll(
        `
        [data-analysis-canvas],
        [data-skeleton-canvas],
        [data-trajectory-canvas]
        `
      )
      .forEach(
        canvas => {

          canvas.width =
            width;

          canvas.height =
            height;

        }
      );

  }


  /* =====================================================
     SNAPSHOT
  ===================================================== */

  function captureSnapshot() {

    if (!video) {
      return null;
    }


    if (
      video.readyState < 2
    ) {

      alert(
        "먼저 카메라 또는 분석 영상을 준비해주세요."
      );

      return null;

    }


    const width =
      video.videoWidth;


    const height =
      video.videoHeight;


    if (
      !width ||
      !height
    ) {

      return null;

    }


    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      width;

    canvas.height =
      height;


    const ctx =
      canvas.getContext(
        "2d"
      );


    /*
      원본 영상
    */

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );


    /*
      분석 오버레이 합성
    */

    const overlays = [

      document.querySelector(
        "[data-analysis-canvas]"
      ),

      document.querySelector(
        "[data-skeleton-canvas]"
      ),

      document.querySelector(
        "[data-trajectory-canvas]"
      )

    ];


    overlays.forEach(
      overlay => {

        if (!overlay) {
          return;
        }


        try {

          ctx.drawImage(
            overlay,
            0,
            0,
            width,
            height
          );

        }

        catch (error) {

          console.warn(
            "[SNAPSHOT OVERLAY]",
            error
          );

        }

      }
    );


    const image =
      canvas.toDataURL(
        "image/png"
      );


    /*
      리포트에서 사용할 수 있게 저장
    */

    try {

      sessionStorage.setItem(
        "seolcheon_analysis_snapshot",
        image
      );

    }

    catch (error) {

      console.warn(
        "[SNAPSHOT STORAGE]",
        error
      );

    }


    /*
      전역 분석 데이터에도 제공
    */

    window.SeolcheonAnalysisSnapshot =
      image;


    console.log(
      "[VIDEO] SNAPSHOT CREATED"
    );


    return image;

  }


  /* =====================================================
     BUTTON BINDING
  ===================================================== */

  function bindControls() {

    /* PLAY */

    document
      .querySelectorAll(
        "[data-analysis-play]"
      )
      .forEach(
        button => {

          if (
            button.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          button.dataset.videoBound =
            "true";


          button.addEventListener(
            "click",
            play
          );

        }
      );


    /* PAUSE */

    document
      .querySelectorAll(
        "[data-analysis-pause]"
      )
      .forEach(
        button => {

          if (
            button.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          button.dataset.videoBound =
            "true";


          button.addEventListener(
            "click",
            pause
          );

        }
      );


    /* PREVIOUS FRAME */

    document
      .querySelectorAll(
        "[data-analysis-frame-prev]"
      )
      .forEach(
        button => {

          if (
            button.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          button.dataset.videoBound =
            "true";


          button.addEventListener(
            "click",
            framePrevious
          );

        }
      );


    /* NEXT FRAME */

    document
      .querySelectorAll(
        "[data-analysis-frame-next]"
      )
      .forEach(
        button => {

          if (
            button.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          button.dataset.videoBound =
            "true";


          button.addEventListener(
            "click",
            frameNext
          );

        }
      );


    /* SNAPSHOT */

    document
      .querySelectorAll(
        "[data-analysis-snapshot]"
      )
      .forEach(
        button => {

          if (
            button.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          button.dataset.videoBound =
            "true";


          button.addEventListener(
            "click",
            () => {

              const image =
                captureSnapshot();


              if (image) {

                button.textContent =
                  "분석 사진 저장됨";


                setTimeout(
                  () => {

                    button.textContent =
                      "분석 사진 저장";

                  },
                  1200
                );

              }

            }
          );

        }
      );

  }


  /* =====================================================
     EVENT BINDING
  ===================================================== */

  function bindEvents() {

    if (
      uploadInput &&
      uploadInput.dataset.videoInputBound !==
        "true"
    ) {

      uploadInput.dataset.videoInputBound =
        "true";


      uploadInput.addEventListener(
        "change",
        event => {

          const file =
            event.target.files?.[0];


          if (file) {

            loadVideo(
              file
            );

          }

        }
      );

    }


    if (
      video &&
      video.dataset.videoEventsBound !==
        "true"
    ) {

      video.dataset.videoEventsBound =
        "true";


      video.addEventListener(
        "loadedmetadata",
        handleMetadata
      );


      video.addEventListener(
        "timeupdate",
        handleTimeUpdate
      );


      video.addEventListener(
        "loadeddata",
        resizeAnalysisCanvases
      );


      video.addEventListener(
        "resize",
        resizeAnalysisCanvases
      );

    }


    document
      .querySelectorAll(
        "[data-playback-rate]"
      )
      .forEach(
        select => {

          if (
            select.dataset.videoBound ===
            "true"
          ) {

            return;

          }


          select.dataset.videoBound =
            "true";


          select.addEventListener(
            "change",
            () => {

              setPlaybackRate(
                select.value
              );

            }
          );

        }
      );


    if (
      progress &&
      progress.dataset.videoBound !==
        "true"
    ) {

      progress.dataset.videoBound =
        "true";


      progress.addEventListener(
        "input",
        seekFromProgress
      );

    }

  }


  /* =====================================================
     REFRESH
  ===================================================== */

  function refresh() {

    getElements();

    bindEvents();

    bindControls();

  }


  /* =====================================================
     INIT
  ===================================================== */

  function init() {

    refresh();


    const observer =
      new MutationObserver(
        () => {

          refresh();

        }
      );


    if (
      document.body
    ) {

      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );

    }


    console.log(
      "[VIDEO] MODULE READY"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }

  else {

    init();

  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {

    play,

    pause,

    loadVideo,

    setPlaybackRate,

    framePrevious,

    frameNext,

    captureSnapshot,

    resizeAnalysisCanvases,

    setFPS(fps) {

      const value =
        Number(fps);


      if (
        Number.isFinite(value) &&
        value > 0
      ) {

        videoFPS =
          value;

      }

    },


    getState() {

      return {

        videoLoaded,

        fps:
          videoFPS,

        playbackRate:
          video?.playbackRate || 1,

        currentTime:
          video?.currentTime || 0,

        duration:
          video?.duration || 0

      };

    }

  };

})();