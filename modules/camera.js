/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   CAMERA MODULE
   - iPad / iPhone Safari 대응
   - Front / Rear Camera
   - Camera Start / Stop
   - Camera Switch
   - Error Handling
========================================================= */

"use strict";

window.SeolcheonCamera = (() => {

  let stream = null;
  let videoElement = null;

  let facingMode = "environment";
  let isRunning = false;

  /* =======================================================
     VIDEO ELEMENT 찾기
  ======================================================= */

  function findVideo() {

    const selectors = [
      "#analysisVideo",
      "#cameraVideo",
      "#motionVideo",
      "#videoPlayer",
      "video[data-camera]",
      ".motion-stage video",
      ".analysis-viewer-panel video",
      "video"
    ];

    for (const selector of selectors) {

      const element = document.querySelector(selector);

      if (element) {
        return element;
      }

    }

    return null;
  }


  /* =======================================================
     VIDEO 기본 설정
  ======================================================= */

  function prepareVideo(video) {

    if (!video) return;

    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;

    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

  }


  /* =======================================================
     카메라 지원 확인
  ======================================================= */

  function cameraSupported() {

    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );

  }


  /* =======================================================
     카메라 시작
  ======================================================= */

  async function start() {

    console.log("[CAMERA] start requested");

    if (!cameraSupported()) {

      showError(
        "이 브라우저에서는 카메라 기능을 사용할 수 없습니다."
      );

      return false;
    }


    videoElement = findVideo();

    if (!videoElement) {

      showError(
        "카메라 화면을 표시할 VIDEO 영역을 찾을 수 없습니다."
      );

      console.error(
        "[CAMERA] video element not found"
      );

      return false;
    }


    prepareVideo(videoElement);


    /* 기존 카메라가 있으면 종료 */

    stopStream();


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
        }

      }

    };


    try {

      stream =
        await navigator.mediaDevices.getUserMedia(
          constraints
        );


      videoElement.srcObject = stream;


      await videoElement.play();


      isRunning = true;


      console.log(
        "[CAMERA] started",
        stream
      );


      updateCameraStatus(
        "CAMERA ONLINE"
      );


      clearError();


      return true;

    }

    catch (error) {

      console.error(
        "[CAMERA ERROR]",
        error
      );


      isRunning = false;


      handleCameraError(error);


      return false;
    }

  }


  /* =======================================================
     STREAM만 종료
  ======================================================= */

  function stopStream() {

    if (!stream) return;


    stream
      .getTracks()
      .forEach(track => {

        try {

          track.stop();

        }

        catch (error) {

          console.warn(
            "[CAMERA] track stop error",
            error
          );

        }

      });


    stream = null;

  }


  /* =======================================================
     카메라 정지
  ======================================================= */

  function stop() {

    console.log(
      "[CAMERA] stop"
    );


    stopStream();


    if (videoElement) {

      try {

        videoElement.pause();

      }

      catch (error) {

        console.warn(error);

      }


      videoElement.srcObject = null;

    }


    isRunning = false;


    updateCameraStatus(
      "CAMERA OFFLINE"
    );

  }


  /* =======================================================
     전면 / 후면 전환
  ======================================================= */

  async function switchCamera() {

    facingMode =
      facingMode === "environment"
        ? "user"
        : "environment";


    console.log(
      "[CAMERA] switch:",
      facingMode
    );


    return await start();

  }


  /* =======================================================
     현재 카메라 정보
  ======================================================= */

  function getState() {

    return {

      running: isRunning,

      facingMode,

      stream

    };

  }


  /* =======================================================
     오류 처리
  ======================================================= */

  function handleCameraError(error) {

    let message =
      "카메라를 시작할 수 없습니다.";


    switch (error?.name) {

      case "NotAllowedError":

        message =
          "카메라 권한이 허용되지 않았습니다. Safari의 카메라 권한을 허용해주세요.";

        break;


      case "NotFoundError":

        message =
          "사용 가능한 카메라를 찾지 못했습니다.";

        break;


      case "NotReadableError":

        message =
          "카메라가 다른 앱에서 사용 중이거나 카메라를 시작할 수 없습니다.";

        break;


      case "OverconstrainedError":

        message =
          "현재 기기에서 요청한 카메라 설정을 지원하지 않습니다.";

        break;


      case "SecurityError":

        message =
          "보안 설정 때문에 카메라를 사용할 수 없습니다.";

        break;

    }


    showError(message);

  }


  /* =======================================================
     ERROR MESSAGE
  ======================================================= */

  function showError(message) {

    console.error(
      "[CAMERA]",
      message
    );


    const errorTargets = [

      "#cameraError",

      "#analysisError",

      ".camera-error",

      ".analysis-error"

    ];


    let displayed = false;


    for (const selector of errorTargets) {

      const element =
        document.querySelector(selector);


      if (element) {

        element.textContent = message;

        element.hidden = false;

        displayed = true;

      }

    }


    updateCameraStatus(
      "CAMERA ERROR"
    );


    /*
      별도 오류창이 없는 경우에만 alert
    */

    if (!displayed) {

      alert(message);

    }

  }


  function clearError() {

    const selectors = [

      "#cameraError",

      "#analysisError",

      ".camera-error",

      ".analysis-error"

    ];


    selectors.forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(element => {

          element.textContent = "";

          element.hidden = true;

        });

    });

  }


  /* =======================================================
     UI STATUS
  ======================================================= */

  function updateCameraStatus(text) {

    const selectors = [

      "#cameraStatus",

      "[data-camera-status]",

      ".camera-status"

    ];


    selectors.forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(element => {

          element.textContent = text;

        });

    });

  }


  /* =======================================================
     버튼 자동 연결
  ======================================================= */

  function bindButtons() {

    const startSelectors = [

      "#startCameraBtn",

      "#cameraStartBtn",

      "[data-action='camera-start']"

    ];


    startSelectors.forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(button => {

          if (
            button.dataset.cameraBound === "true"
          ) {
            return;
          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            async () => {

              await start();

            }
          );

        });

    });


    const stopSelectors = [

      "#stopCameraBtn",

      "#cameraStopBtn",

      "[data-action='camera-stop']"

    ];


    stopSelectors.forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(button => {

          if (
            button.dataset.cameraBound === "true"
          ) {
            return;
          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            stop
          );

        });

    });


    const switchSelectors = [

      "#switchCameraBtn",

      "#cameraSwitchBtn",

      "[data-action='camera-switch']"

    ];


    switchSelectors.forEach(selector => {

      document
        .querySelectorAll(selector)
        .forEach(button => {

          if (
            button.dataset.cameraBound === "true"
          ) {
            return;
          }


          button.dataset.cameraBound =
            "true";


          button.addEventListener(
            "click",
            async () => {

              await switchCamera();

            }
          );

        });

    });

  }


  /* =======================================================
     초기화
  ======================================================= */

  function init() {

    console.log(
      "[CAMERA] module ready"
    );


    videoElement =
      findVideo();


    if (videoElement) {

      prepareVideo(
        videoElement
      );

    }


    bindButtons();

  }


  /* 페이지가 동적으로 바뀌는 경우
     새 버튼도 자동 감지
  */

  const observer =
    new MutationObserver(() => {

      bindButtons();

      if (!videoElement) {

        videoElement =
          findVideo();


        if (videoElement) {

          prepareVideo(
            videoElement
          );

        }

      }

    });


  document.addEventListener(
    "DOMContentLoaded",
    () => {

      init();


      if (document.body) {

        observer.observe(
          document.body,
          {
            childList: true,
            subtree: true
          }
        );

      }

    }
  );


  /* =======================================================
     PUBLIC API
  ======================================================= */

  return {

    init,

    start,

    stop,

    switchCamera,

    getState

  };

})();