/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   CAMERA MODULE

   기능
   - iPad / iPhone Safari 지원
   - 카메라 시작
   - 카메라 정지
   - 전면 / 후면 카메라 전환
   - 실시간 영상 출력
   - 권한 오류 처리
   - 영상 분석과 충돌 방지
========================================================= */

"use strict";


window.SeolcheonCamera = (() => {

  /* =======================================================
     STATE
  ======================================================= */

  let stream = null;

  let facingMode = "environment";

  let running = false;


  /* =======================================================
     ELEMENTS
  ======================================================= */

  function getVideo() {

    return (
      document.querySelector(
        "[data-analysis-video]"
      ) ||

      document.getElementById(
        "analysisVideo"
      )
    );

  }


  function getErrorBox() {

    return (
      document.getElementById(
        "cameraError"
      ) ||

      document.querySelector(
        ".camera-error"
      )
    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  function showError(message) {

    console.error(
      "[CAMERA]",
      message
    );


    const box =
      getErrorBox();


    if (box) {

      box.textContent =
        message;

      box.hidden =
        false;

    }

  }


  function clearError() {

    const box =
      getErrorBox();


    if (!box) {
      return;
    }


    box.textContent =
      "";

    box.hidden =
      true;

  }


  /* =======================================================
     STOP TRACKS
  ======================================================= */

  function stopTracks() {

    if (!stream) {
      return;
    }


    stream
      .getTracks()
      .forEach(track => {

        try {

          track.stop();

        }

        catch (error) {

          console.warn(
            "[CAMERA TRACK STOP]",
            error
          );

        }

      });


    stream = null;

  }


  /* =======================================================
     CAMERA START
  ======================================================= */

  async function start() {

    clearError();


    /*
      HTTPS 확인
      GitHub Pages에서는 정상적으로 true
    */

    if (!window.isSecureContext) {

      showError(
        "카메라는 HTTPS 보안 연결에서만 사용할 수 있습니다."
      );

      return false;

    }


    /*
      브라우저 지원 확인
    */

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      showError(
        "현재 브라우저에서 카메라 기능을 지원하지 않습니다."
      );

      return false;

    }


    const video =
      getVideo();


    if (!video) {

      showError(
        "카메라 영상을 표시할 VIDEO 영역을 찾지 못했습니다."
      );

      return false;

    }


    /*
      기존 영상 분석 파일이 열려 있을 경우 정리
    */

    try {

      video.pause();

    }

    catch (error) {

      console.warn(error);

    }


    /*
      기존 object URL 제거
    */

    if (
      video.dataset.objectUrl
    ) {

      try {

        URL.revokeObjectURL(
          video.dataset.objectUrl
        );

      }

      catch (error) {

        console.warn(error);

      }


      delete video.dataset.objectUrl;

    }


    video.removeAttribute(
      "src"
    );


    video.load();


    /*
      기존 카메라 종료
    */

    stopTracks();


    /*
      iOS Safari 필수 설정
    */

    video.autoplay =
      true;

    video.muted =
      true;

    video.playsInline =
      true;


    video.setAttribute(
      "autoplay",
      ""
    );


    video.setAttribute(
      "muted",
      ""
    );


    video.setAttribute(
      "playsinline",
      ""
    );


    /* =====================================================
       CAMERA CONSTRAINTS
    ===================================================== */

    const constraints = {

      audio: false,

      video: {

        facingMode: {
          ideal: facingMode
        },

        width: {
          ideal: 1920
        },

        height: {
          ideal: 1080
        },

        frameRate: {
          ideal: 60,
          max: 60
        }

      }

    };


    try {

      console.log(
        "[CAMERA] requesting permission..."
      );


      stream =
        await navigator.mediaDevices
          .getUserMedia(
            constraints
          );


      console.log(
        "[CAMERA] stream received"
      );


      video.srcObject =
        stream;


      /*
        metadata가 준비될 때까지 대기
      */

      await new Promise(
        resolve => {

          if (
            video.readyState >= 1
          ) {

            resolve();

            return;

          }


          video.addEventListener(
            "loadedmetadata",
            resolve,
            {
              once: true
            }
          );

        }
      );


      /*
        Safari 재생
      */

      try {

        await video.play();

      }

      catch (playError) {

        console.warn(
          "[CAMERA PLAY]",
          playError
        );

      }


      running =
        true;


      document.body.classList.add(
        "camera-running"
      );


      updateStatus(
        "CAMERA ONLINE"
      );


      clearError();


      console.log(
        "[CAMERA] STARTED"
      );


      return true;

    }

    catch (error) {

      running =
        false;


      console.error(
        "[CAMERA ERROR]",
        error
      );


      handleError(
        error
      );


      return false;

    }

  }


  /* =======================================================
     CAMERA STOP
  ======================================================= */

  function stop() {

    const video =
      getVideo();


    stopTracks();


    if (video) {

      try {

        video.pause();

      }

      catch (error) {

        console.warn(error);

      }


      video.srcObject =
        null;

    }


    running =
      false;


    document.body.classList.remove(
      "camera-running"
    );


    updateStatus(
      "CAMERA OFFLINE"
    );


    console.log(
      "[CAMERA] STOPPED"
    );

  }


  /* =======================================================
     SWITCH CAMERA
  ======================================================= */

  async function switchCamera() {

    facingMode =
      facingMode === "environment"
        ? "user"
        : "environment";


    console.log(
      "[CAMERA] SWITCH",
      facingMode
    );


    return await start();

  }


  /* =======================================================
     CAMERA ERRORS
  ======================================================= */

  function handleError(error) {

    let message =
      "카메라를 시작할 수 없습니다.";


    switch (
      error?.name
    ) {

      case "NotAllowedError":

        message =
          "카메라 권한이 차단되어 있습니다. Safari에서 이 사이트의 카메라 권한을 허용해주세요.";

        break;


      case "NotFoundError":

        message =
          "사용 가능한 카메라를 찾지 못했습니다.";

        break;


      case "NotReadableError":

        message =
          "카메라를 사용할 수 없습니다. 다른 앱에서 카메라를 사용 중인지 확인해주세요.";

        break;


      case "OverconstrainedError":

        message =
          "현재 기기가 요청된 카메라 설정을 지원하지 않습니다.";

        break;


      case "SecurityError":

        message =
          "브라우저 보안 설정 때문에 카메라를 사용할 수 없습니다.";

        break;


      case "AbortError":

        message =
          "카메라 시작이 중단되었습니다.";

        break;

    }


    showError(
      message
    );


    updateStatus(
      "CAMERA ERROR"
    );

  }


  /* =======================================================
     STATUS
  ======================================================= */

  function updateStatus(
    text
  ) {

    document
      .querySelectorAll(
        "[data-camera-status]"
      )
      .forEach(
        element => {

          element.textContent =
            text;

        }
      );

  }


  /* =======================================================
     BUTTON BIND
  ======================================================= */

  function bindButtons() {

    /*
      START
    */

    document
      .querySelectorAll(
        `
        #startCameraBtn,
        [data-camera-start],
        [data-action="camera-start"]
        `
      )
      .forEach(
        button => {

          if (
            button.dataset.cameraBound ===
            "true"
          ) {

            return;

          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            async event => {

              event.preventDefault();


              await start();

            }
          );

        }
      );


    /*
      STOP
    */

    document
      .querySelectorAll(
        `
        #stopCameraBtn,
        [data-camera-stop],
        [data-action="camera-stop"]
        `
      )
      .forEach(
        button => {

          if (
            button.dataset.cameraBound ===
            "true"
          ) {

            return;

          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              stop();

            }
          );

        }
      );


    /*
      SWITCH
    */

    document
      .querySelectorAll(
        `
        #switchCameraBtn,
        [data-camera-switch],
        [data-action="camera-switch"]
        `
      )
      .forEach(
        button => {

          if (
            button.dataset.cameraBound ===
            "true"
          ) {

            return;

          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            async event => {

              event.preventDefault();


              await switchCamera();

            }
          );

        }
      );

  }


  /* =======================================================
     INIT
  ======================================================= */

  function init() {

    console.log(
      "[CAMERA] MODULE READY"
    );


    bindButtons();


    /*
      화면이 동적으로 변경돼도
      버튼 다시 연결
    */

    const observer =
      new MutationObserver(
        () => {

          bindButtons();

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

  }


  /* =======================================================
     STATE
  ======================================================= */

  function getState() {

    return {

      running,

      facingMode,

      stream

    };

  }


  /* =======================================================
     PAGE LOAD
  ======================================================= */

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


  /* =======================================================
     PUBLIC API
  ======================================================= */

  return {

    start,

    stop,

    switchCamera,

    getState

  };

})();