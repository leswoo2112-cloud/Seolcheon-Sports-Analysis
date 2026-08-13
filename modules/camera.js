/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / CAMERA.JS
   VERSION 1.0

   기능
   ---------------------------------------------------------
   - 실시간 카메라 시작
   - 카메라 정지
   - 전면 / 후면 카메라 전환
   - iPad / iPhone Safari 대응
   - 실시간 FPS 계산
   - Canvas 프레임 출력
   - Pose 분석 엔진 연결
   - 스냅샷 생성
   - 카메라 상태 관리
========================================================= */

"use strict";


/* =========================================================
   01. CAMERA CONFIG
========================================================= */

const CAMERA_CONFIG = {

  width: {
    ideal: 1280
  },

  height: {
    ideal: 720
  },

  frameRate: {
    ideal: 30,
    max: 60
  },

  defaultFacingMode:
    "environment",

  mirrorFrontCamera:
    true

};


/* =========================================================
   02. CAMERA STATE
========================================================= */

const CameraManager = {

  stream:
    null,

  video:
    null,

  canvas:
    null,

  context:
    null,

  running:
    false,

  facingMode:
    CAMERA_CONFIG.defaultFacingMode,

  animationFrame:
    null,

  lastFrameTime:
    0,

  fps:
    0,

  frameCount:
    0,

  fpsTimer:
    0,

  width:
    0,

  height:
    0,

  initialized:
    false

};


/* =========================================================
   03. INITIALIZE
========================================================= */

function initCamera() {

  if (
    CameraManager.initialized
  ) {
    return;
  }


  CameraManager.initialized =
    true;


  bindCameraEvents();


  console.log(
    "[CAMERA] Camera module ready"
  );

}


/* =========================================================
   04. EVENT BINDING
========================================================= */

function bindCameraEvents() {

  document.addEventListener(
    "click",
    handleCameraClick
  );


  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

}


/* =========================================================
   05. BUTTON EVENTS
========================================================= */

function handleCameraClick(
  event
) {

  const startButton =
    event.target.closest(
      [
        "[data-action='camera-start']",
        "#camera-start",
        "#start-camera"
      ].join(",")
    );


  if (startButton) {

    event.preventDefault();

    startCamera();

    return;

  }


  const stopButton =
    event.target.closest(
      [
        "[data-action='camera-stop']",
        "#camera-stop",
        "#stop-camera"
      ].join(",")
    );


  if (stopButton) {

    event.preventDefault();

    stopCamera();

    return;

  }


  const switchButton =
    event.target.closest(
      [
        "[data-action='camera-switch']",
        "#camera-switch",
        "#switch-camera"
      ].join(",")
    );


  if (switchButton) {

    event.preventDefault();

    switchCamera();

    return;

  }


  const snapshotButton =
    event.target.closest(
      [
        "[data-action='camera-snapshot']",
        "#camera-snapshot"
      ].join(",")
    );


  if (snapshotButton) {

    event.preventDefault();

    captureCameraSnapshot();

  }

}


/* =========================================================
   06. FIND VIDEO
========================================================= */

function findCameraVideo() {

  return (

    document.getElementById(
      "camera-video"
    ) ||

    document.getElementById(
      "analysis-video"
    ) ||

    document.querySelector(
      "[data-camera-video]"
    ) ||

    document.querySelector(
      ".camera-video"
    )

  );

}


/* =========================================================
   07. FIND CANVAS
========================================================= */

function findCameraCanvas() {

  return (

    document.getElementById(
      "pose-canvas"
    ) ||

    document.getElementById(
      "analysis-canvas"
    ) ||

    document.querySelector(
      "[data-analysis-canvas]"
    )

  );

}


/* =========================================================
   08. CAMERA SUPPORT
========================================================= */

function isCameraSupported() {

  return Boolean(

    navigator.mediaDevices &&

    typeof navigator.mediaDevices
      .getUserMedia ===
      "function"

  );

}


/* =========================================================
   09. START CAMERA
========================================================= */

async function startCamera() {

  if (
    !isCameraSupported()
  ) {

    showCameraMessage(
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다.",
      "error"
    );

    return false;

  }


  /*
     GitHub Pages는 HTTPS이므로 정상 작동.
     로컬 테스트에서는 localhost 권장.
  */

  if (
    location.protocol !== "https:" &&
    location.hostname !== "localhost"
  ) {

    showCameraMessage(
      "카메라는 HTTPS 환경에서 실행해야 합니다.",
      "error"
    );

    return false;

  }


  const video =
    findCameraVideo();


  if (!video) {

    showCameraMessage(
      "카메라 화면을 찾을 수 없습니다.",
      "error"
    );

    console.error(
      "[CAMERA] #camera-video가 없습니다."
    );

    return false;

  }


  /*
     기존 카메라가 실행 중이면
     먼저 종료
  */

  if (
    CameraManager.stream
  ) {

    stopCameraStream();

  }


  showCameraMessage(
    "카메라 연결 중...",
    "loading"
  );


  try {

    const constraints = {

      audio:
        false,

      video: {

        facingMode: {
          ideal:
            CameraManager.facingMode
        },

        width:
          CAMERA_CONFIG.width,

        height:
          CAMERA_CONFIG.height,

        frameRate:
          CAMERA_CONFIG.frameRate

      }

    };


    const stream =
      await navigator.mediaDevices
        .getUserMedia(
          constraints
        );


    CameraManager.stream =
      stream;


    CameraManager.video =
      video;


    video.srcObject =
      stream;


    /*
       iOS Safari 대응
    */

    video.autoplay =
      true;

    video.muted =
      true;

    video.playsInline =
      true;


    video.setAttribute(
      "playsinline",
      ""
    );


    video.setAttribute(
      "webkit-playsinline",
      ""
    );


    await video.play();


    await waitForVideoMetadata(
      video
    );


    CameraManager.width =
      video.videoWidth;


    CameraManager.height =
      video.videoHeight;


    setupCameraCanvas();


    CameraManager.running =
      true;


    CameraManager.lastFrameTime =
      performance.now();


    CameraManager.frameCount =
      0;


    CameraManager.fpsTimer =
      performance.now();


    updateCameraMirror();


    startCameraRenderLoop();


    updateCameraStatus(
      "LIVE"
    );


    showCameraMessage(
      "실시간 카메라 연결 완료",
      "success"
    );


    document.dispatchEvent(
      new CustomEvent(
        "camera:started",
        {
          detail: {

            stream,

            video,

            width:
              CameraManager.width,

            height:
              CameraManager.height,

            facingMode:
              CameraManager.facingMode

          }
        }
      )
    );


    return true;

  }

  catch (error) {

    handleCameraError(
      error
    );


    return false;

  }

}


/* =========================================================
   10. WAIT VIDEO METADATA
========================================================= */

function waitForVideoMetadata(
  video
) {

  return new Promise(
    resolve => {

      if (
        video.readyState >= 1 &&
        video.videoWidth > 0
      ) {

        resolve();

        return;

      }


      video.addEventListener(
        "loadedmetadata",
        () => resolve(),
        {
          once: true
        }
      );

    }
  );

}


/* =========================================================
   11. SETUP CANVAS
========================================================= */

function setupCameraCanvas() {

  const canvas =
    findCameraCanvas();


  if (!canvas) {

    CameraManager.canvas =
      null;

    CameraManager.context =
      null;

    return;

  }


  CameraManager.canvas =
    canvas;


  canvas.width =
    CameraManager.width ||
    1280;


  canvas.height =
    CameraManager.height ||
    720;


  CameraManager.context =
    canvas.getContext(
      "2d"
    );

}


/* =========================================================
   12. CAMERA RENDER LOOP
========================================================= */

function startCameraRenderLoop() {

  cancelCameraRenderLoop();


  function render(
    timestamp
  ) {

    if (
      !CameraManager.running
    ) {

      return;

    }


    calculateCameraFPS(
      timestamp
    );


    drawCameraFrame();


    /*
       pose.js에서 이 이벤트를 받아
       스켈레톤 분석 가능
    */

    document.dispatchEvent(
      new CustomEvent(
        "camera:frame",
        {
          detail: {

            video:
              CameraManager.video,

            canvas:
              CameraManager.canvas,

            timestamp,

            fps:
              CameraManager.fps

          }
        }
      )
    );


    CameraManager.animationFrame =
      requestAnimationFrame(
        render
      );

  }


  CameraManager.animationFrame =
    requestAnimationFrame(
      render
    );

}


/* =========================================================
   13. DRAW FRAME
========================================================= */

function drawCameraFrame() {

  const video =
    CameraManager.video;


  const canvas =
    CameraManager.canvas;


  const ctx =
    CameraManager.context;


  if (
    !video ||
    !canvas ||
    !ctx
  ) {

    return;

  }


  if (
    video.readyState < 2
  ) {

    return;

  }


  const width =
    canvas.width;


  const height =
    canvas.height;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  /*
     전면 카메라만 좌우 반전
  */

  if (
    CameraManager.facingMode ===
      "user" &&
    CAMERA_CONFIG.mirrorFrontCamera
  ) {

    ctx.save();

    ctx.translate(
      width,
      0
    );

    ctx.scale(
      -1,
      1
    );

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );

    ctx.restore();

  }

  else {

    ctx.drawImage(
      video,
      0,
      0,
      width,
      height
    );

  }

}


/* =========================================================
   14. FPS
========================================================= */

function calculateCameraFPS(
  timestamp
) {

  CameraManager.frameCount++;


  const elapsed =
    timestamp -
    CameraManager.fpsTimer;


  if (
    elapsed >= 1000
  ) {

    CameraManager.fps =
      Math.round(
        CameraManager.frameCount *
        1000 /
        elapsed
      );


    CameraManager.frameCount =
      0;


    CameraManager.fpsTimer =
      timestamp;


    updateFPSDisplay();

  }

}


/* =========================================================
   15. FPS DISPLAY
========================================================= */

function updateFPSDisplay() {

  document
    .querySelectorAll(
      [
        "[data-camera-fps]",
        "#camera-fps",
        "#analysis-fps"
      ].join(",")
    )
    .forEach(
      element => {

        element.textContent =
          `${CameraManager.fps} FPS`;

      }
    );

}


/* =========================================================
   16. STOP CAMERA
========================================================= */

function stopCamera() {

  CameraManager.running =
    false;


  cancelCameraRenderLoop();


  stopCameraStream();


  const video =
    CameraManager.video;


  if (video) {

    video.pause();

    video.srcObject =
      null;

  }


  CameraManager.stream =
    null;


  CameraManager.fps =
    0;


  updateFPSDisplay();


  updateCameraStatus(
    "READY"
  );


  showCameraMessage(
    "카메라가 정지되었습니다.",
    ""
  );


  document.dispatchEvent(
    new CustomEvent(
      "camera:stopped"
    )
  );

}


/* =========================================================
   17. STOP STREAM
========================================================= */

function stopCameraStream() {

  if (
    !CameraManager.stream
  ) {

    return;

  }


  CameraManager.stream
    .getTracks()
    .forEach(
      track =>
        track.stop()
    );

}


/* =========================================================
   18. CANCEL LOOP
========================================================= */

function cancelCameraRenderLoop() {

  if (
    CameraManager.animationFrame
  ) {

    cancelAnimationFrame(
      CameraManager.animationFrame
    );


    CameraManager.animationFrame =
      null;

  }

}


/* =========================================================
   19. SWITCH CAMERA
========================================================= */

async function switchCamera() {

  const wasRunning =
    CameraManager.running;


  CameraManager.facingMode =

    CameraManager.facingMode ===
      "environment"

      ? "user"

      : "environment";


  if (!wasRunning) {

    updateCameraMirror();

    return;

  }


  stopCamera();


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        200
      )
  );


  return startCamera();

}


/* =========================================================
   20. MIRROR VIDEO
========================================================= */

function updateCameraMirror() {

  const video =
    CameraManager.video ||
    findCameraVideo();


  if (!video) {
    return;
  }


  if (
    CameraManager.facingMode ===
      "user" &&
    CAMERA_CONFIG.mirrorFrontCamera
  ) {

    video.classList.add(
      "camera-mirror"
    );

  }

  else {

    video.classList.remove(
      "camera-mirror"
    );

  }

}


/* =========================================================
   21. SNAPSHOT
========================================================= */

function captureCameraSnapshot() {

  const video =
    CameraManager.video;


  if (
    !video ||
    !CameraManager.running
  ) {

    showCameraMessage(
      "먼저 카메라를 시작해주세요.",
      "error"
    );

    return null;

  }


  const snapshot =
    document.createElement(
      "canvas"
    );


  snapshot.width =
    video.videoWidth;


  snapshot.height =
    video.videoHeight;


  const ctx =
    snapshot.getContext(
      "2d"
    );


  if (
    CameraManager.facingMode ===
      "user" &&
    CAMERA_CONFIG.mirrorFrontCamera
  ) {

    ctx.translate(
      snapshot.width,
      0
    );


    ctx.scale(
      -1,
      1
    );

  }


  ctx.drawImage(
    video,
    0,
    0,
    snapshot.width,
    snapshot.height
  );


  const dataURL =
    snapshot.toDataURL(
      "image/jpeg",
      0.9
    );


  const snapshotData = {

    id:
      "snapshot_" +
      Date.now(),

    createdAt:
      new Date()
        .toISOString(),

    width:
      snapshot.width,

    height:
      snapshot.height,

    image:
      dataURL

  };


  document.dispatchEvent(
    new CustomEvent(
      "camera:snapshot",
      {
        detail:
          snapshotData
      }
    )
  );


  showCameraMessage(
    "분석 프레임을 캡처했습니다.",
    "success"
  );


  return snapshotData;

}


/* =========================================================
   22. STATUS
========================================================= */

function updateCameraStatus(
  status
) {

  document
    .querySelectorAll(
      [
        "[data-camera-status]",
        "#camera-status"
      ].join(",")
    )
    .forEach(
      element => {

        element.textContent =
          status;


        element.dataset.status =
          status.toLowerCase();

      }
    );

}


/* =========================================================
   23. MESSAGE
========================================================= */

function showCameraMessage(
  message,
  type = ""
) {

  const element =

    document.getElementById(
      "camera-message"
    ) ||

    document.querySelector(
      "[data-camera-message]"
    );


  if (!element) {

    if (message) {

      console.log(
        "[CAMERA]",
        message
      );

    }

    return;

  }


  element.textContent =
    message;


  element.dataset.type =
    type;


  element.hidden =
    !message;

}


/* =========================================================
   24. CAMERA ERROR
========================================================= */

function handleCameraError(
  error
) {

  console.error(
    "[CAMERA]",
    error
  );


  let message =
    "카메라를 시작할 수 없습니다.";


  switch (
    error?.name
  ) {

    case "NotAllowedError":

      message =
        "카메라 권한이 허용되지 않았습니다. Safari의 사이트 카메라 권한을 확인해주세요.";

      break;


    case "NotFoundError":

      message =
        "사용 가능한 카메라를 찾을 수 없습니다.";

      break;


    case "NotReadableError":

      message =
        "카메라를 다른 앱에서 사용 중이거나 카메라에 접근할 수 없습니다.";

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


  CameraManager.running =
    false;


  updateCameraStatus(
    "ERROR"
  );


  showCameraMessage(
    message,
    "error"
  );

}


/* =========================================================
   25. VISIBILITY CHANGE

   Safari에서 탭을 벗어났다가 돌아올 때
   상태 관리
========================================================= */

function handleVisibilityChange() {

  if (
    document.visibilityState ===
      "hidden"
  ) {

    return;

  }


  if (
    CameraManager.running &&
    CameraManager.video
  ) {

    CameraManager.video
      .play()
      .catch(
        () => {}
      );

  }

}


/* =========================================================
   26. GET CAMERA STATE
========================================================= */

function getCameraState() {

  return {

    running:
      CameraManager.running,

    facingMode:
      CameraManager.facingMode,

    fps:
      CameraManager.fps,

    width:
      CameraManager.width,

    height:
      CameraManager.height

  };

}


/* =========================================================
   27. GET CURRENT FRAME

   다른 분석 모듈에서 현재 프레임을
   가져올 때 사용
========================================================= */

function getCurrentCameraFrame() {

  const video =
    CameraManager.video;


  if (
    !video ||
    !CameraManager.running
  ) {

    return null;

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    video.videoWidth;


  canvas.height =
    video.videoHeight;


  const ctx =
    canvas.getContext(
      "2d"
    );


  ctx.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );


  return canvas;

}


/* =========================================================
   28. AUTO INITIALIZE
========================================================= */

if (
  document.readyState ===
    "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initCamera
  );

}

else {

  initCamera();

}


/* =========================================================
   29. GLOBAL ACCESS
========================================================= */

window.CAMERA_CONFIG =
  CAMERA_CONFIG;

window.CameraManager =
  CameraManager;

window.initCamera =
  initCamera;

window.startCamera =
  startCamera;

window.stopCamera =
  stopCamera;

window.switchCamera =
  switchCamera;

window.captureCameraSnapshot =
  captureCameraSnapshot;

window.getCameraState =
  getCameraState;

window.getCurrentCameraFrame =
  getCurrentCameraFrame;