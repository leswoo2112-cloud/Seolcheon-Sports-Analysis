/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / VIDEO.JS
   VERSION 1.0
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const VIDEO_CONFIG = {

  defaultFPS: 30,

  playbackRates: [
    0.25,
    0.5,
    1,
    1.5,
    2
  ],

  snapshotQuality: 0.92,

  supportedTypes: [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v"
  ]

};


/* =========================================================
   02. STATE
========================================================= */

const VideoManager = {

  initialized: false,

  video: null,

  file: null,

  objectURL: null,

  loaded: false,

  playing: false,

  duration: 0,

  currentTime: 0,

  playbackRate: 1,

  estimatedFPS:
    VIDEO_CONFIG.defaultFPS,

  segmentStart: null,

  segmentEnd: null,

  animationFrame: null

};


/* =========================================================
   03. INITIALIZE
========================================================= */

function initVideo() {

  if (VideoManager.initialized) {
    return;
  }

  VideoManager.initialized = true;

  bindVideoEvents();

  console.log(
    "[VIDEO] Video analysis module ready"
  );

}


/* =========================================================
   04. EVENT BINDING
========================================================= */

function bindVideoEvents() {

  document.addEventListener(
    "click",
    handleVideoClick
  );


  document.addEventListener(
    "change",
    handleVideoChange
  );


  document.addEventListener(
    "input",
    handleVideoInput
  );

}


/* =========================================================
   05. CLICK EVENTS
========================================================= */

function handleVideoClick(event) {

  const choose =
    event.target.closest(
      [
        "[data-action='video-select']",
        "#video-select"
      ].join(",")
    );


  if (choose) {

    event.preventDefault();

    openVideoPicker();

    return;
  }


  const play =
    event.target.closest(
      [
        "[data-action='video-play']",
        "#video-play"
      ].join(",")
    );


  if (play) {

    event.preventDefault();

    playAnalysisVideo();

    return;
  }


  const pause =
    event.target.closest(
      [
        "[data-action='video-pause']",
        "#video-pause"
      ].join(",")
    );


  if (pause) {

    event.preventDefault();

    pauseAnalysisVideo();

    return;
  }


  const toggle =
    event.target.closest(
      "[data-action='video-toggle']"
    );


  if (toggle) {

    event.preventDefault();

    toggleAnalysisVideo();

    return;
  }


  const slow025 =
    event.target.closest(
      "[data-action='speed-025']"
    );


  if (slow025) {

    setVideoSpeed(0.25);

    return;
  }


  const slow05 =
    event.target.closest(
      [
        "[data-action='speed-05']",
        "#video-slowmotion"
      ].join(",")
    );


  if (slow05) {

    setVideoSpeed(0.5);

    return;
  }


  const normal =
    event.target.closest(
      "[data-action='speed-1']"
    );


  if (normal) {

    setVideoSpeed(1);

    return;
  }


  const previousFrame =
    event.target.closest(
      "[data-action='previous-frame']"
    );


  if (previousFrame) {

    stepVideoFrame(-1);

    return;
  }


  const nextFrame =
    event.target.closest(
      "[data-action='next-frame']"
    );


  if (nextFrame) {

    stepVideoFrame(1);

    return;
  }


  const snapshot =
    event.target.closest(
      "[data-action='video-snapshot']"
    );


  if (snapshot) {

    captureVideoFrame();

    return;
  }


  const segmentStart =
    event.target.closest(
      "[data-action='segment-start']"
    );


  if (segmentStart) {

    setSegmentStart();

    return;
  }


  const segmentEnd =
    event.target.closest(
      "[data-action='segment-end']"
    );


  if (segmentEnd) {

    setSegmentEnd();

    return;
  }


  const clearSegment =
    event.target.closest(
      "[data-action='segment-clear']"
    );


  if (clearSegment) {

    clearVideoSegment();

  }

}


/* =========================================================
   06. CHANGE EVENT
========================================================= */

function handleVideoChange(event) {

  if (
    event.target.matches(
      [
        "#video-file",
        "#analysis-video-file",
        "[data-video-file]"
      ].join(",")
    )
  ) {

    const file =
      event.target.files?.[0];


    if (file) {

      loadAnalysisVideo(file);

    }

  }

}


/* =========================================================
   07. TIMELINE INPUT
========================================================= */

function handleVideoInput(event) {

  if (
    event.target.matches(
      [
        "#video-timeline",
        "[data-video-timeline]"
      ].join(",")
    )
  ) {

    seekAnalysisVideo(
      Number(
        event.target.value
      )
    );

  }

}


/* =========================================================
   08. FIND VIDEO ELEMENT
========================================================= */

function findAnalysisVideo() {

  return (

    document.getElementById(
      "analysis-video"
    ) ||

    document.getElementById(
      "uploaded-video"
    ) ||

    document.querySelector(
      "[data-analysis-video]"
    )

  );

}


/* =========================================================
   09. FIND FILE INPUT
========================================================= */

function findVideoFileInput() {

  return (

    document.getElementById(
      "video-file"
    ) ||

    document.getElementById(
      "analysis-video-file"
    ) ||

    document.querySelector(
      "[data-video-file]"
    )

  );

}


/* =========================================================
   10. OPEN PICKER
========================================================= */

function openVideoPicker() {

  const input =
    findVideoFileInput();


  if (!input) {

    showVideoMessage(
      "영상 선택 입력창을 찾을 수 없습니다.",
      "error"
    );

    return;
  }


  input.click();

}


/* =========================================================
   11. LOAD VIDEO
========================================================= */

async function loadAnalysisVideo(file) {

  if (!file) {
    return false;
  }


  if (
    file.type &&
    !file.type.startsWith("video/")
  ) {

    showVideoMessage(
      "영상 파일을 선택해주세요.",
      "error"
    );

    return false;
  }


  const video =
    findAnalysisVideo();


  if (!video) {

    showVideoMessage(
      "영상 분석 화면을 찾을 수 없습니다.",
      "error"
    );

    return false;
  }


  releaseVideoURL();


  const url =
    URL.createObjectURL(file);


  VideoManager.file =
    file;

  VideoManager.objectURL =
    url;

  VideoManager.video =
    video;

  VideoManager.loaded =
    false;

  VideoManager.segmentStart =
    null;

  VideoManager.segmentEnd =
    null;


  video.src =
    url;


  video.preload =
    "metadata";


  video.playsInline =
    true;


  video.setAttribute(
    "playsinline",
    ""
  );


  showVideoMessage(
    "영상 불러오는 중...",
    "loading"
  );


  try {

    await waitForAnalysisVideo(
      video
    );


    VideoManager.loaded =
      true;


    VideoManager.duration =
      Number.isFinite(
        video.duration
      )
        ? video.duration
        : 0;


    VideoManager.currentTime =
      0;


    setVideoSpeed(1);


    updateVideoUI();


    showVideoMessage(
      "영상 분석 준비 완료",
      "success"
    );


    document.dispatchEvent(
      new CustomEvent(
        "video:loaded",
        {
          detail: {

            video,

            file,

            duration:
              VideoManager.duration,

            width:
              video.videoWidth,

            height:
              video.videoHeight

          }
        }
      )
    );


    return true;

  }

  catch (error) {

    console.error(
      "[VIDEO]",
      error
    );


    showVideoMessage(
      "영상을 불러오지 못했습니다.",
      "error"
    );


    return false;

  }

}


/* =========================================================
   12. WAIT VIDEO
========================================================= */

function waitForAnalysisVideo(video) {

  return new Promise(
    (resolve, reject) => {

      if (
        video.readyState >= 1 &&
        video.videoWidth > 0
      ) {

        resolve();

        return;
      }


      const loaded = () => {

        cleanup();

        resolve();

      };


      const failed = () => {

        cleanup();

        reject(
          new Error(
            "Video metadata load failed"
          )
        );

      };


      const cleanup = () => {

        video.removeEventListener(
          "loadedmetadata",
          loaded
        );

        video.removeEventListener(
          "error",
          failed
        );

      };


      video.addEventListener(
        "loadedmetadata",
        loaded
      );


      video.addEventListener(
        "error",
        failed
      );

    }
  );

}


/* =========================================================
   13. PLAY
========================================================= */

async function playAnalysisVideo() {

  const video =
    VideoManager.video ||
    findAnalysisVideo();


  if (
    !video ||
    !VideoManager.loaded
  ) {

    showVideoMessage(
      "먼저 분석할 영상을 선택해주세요.",
      "error"
    );

    return;
  }


  try {

    await video.play();


    VideoManager.playing =
      true;


    startVideoAnalysisLoop();


    updateVideoStatus(
      "PLAYING"
    );

  }

  catch (error) {

    console.error(
      "[VIDEO] 재생 실패",
      error
    );

  }

}


/* =========================================================
   14. PAUSE
========================================================= */

function pauseAnalysisVideo() {

  const video =
    VideoManager.video;


  if (!video) {
    return;
  }


  video.pause();


  VideoManager.playing =
    false;


  cancelVideoAnalysisLoop();


  updateVideoStatus(
    "PAUSED"
  );


  /*
     멈춘 정확한 프레임도 분석 가능
  */

  dispatchVideoFrame();

}


/* =========================================================
   15. TOGGLE
========================================================= */

function toggleAnalysisVideo() {

  if (
    VideoManager.playing
  ) {

    pauseAnalysisVideo();

  }

  else {

    playAnalysisVideo();

  }

}


/* =========================================================
   16. SPEED
========================================================= */

function setVideoSpeed(rate) {

  const video =
    VideoManager.video ||
    findAnalysisVideo();


  if (!video) {
    return;
  }


  const safeRate =
    VIDEO_CONFIG.playbackRates
      .includes(rate)
        ? rate
        : 1;


  video.playbackRate =
    safeRate;


  VideoManager.playbackRate =
    safeRate;


  document
    .querySelectorAll(
      "[data-video-speed]"
    )
    .forEach(
      element => {

        element.textContent =
          `${safeRate}×`;

      }
    );


  document
    .querySelectorAll(
      "[data-speed]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          Number(
            button.dataset.speed
          ) === safeRate
        );

      }
    );


  document.dispatchEvent(
    new CustomEvent(
      "video:speed-change",
      {
        detail: {
          rate:
            safeRate
        }
      }
    )
  );

}


/* =========================================================
   17. FRAME STEP

   기본 30fps 기준.
   실제 FPS 추정값이 있으면 그것 사용.
========================================================= */

function stepVideoFrame(direction = 1) {

  const video =
    VideoManager.video;


  if (
    !video ||
    !VideoManager.loaded
  ) {
    return;
  }


  pauseAnalysisVideo();


  const fps =
    VideoManager.estimatedFPS ||
    VIDEO_CONFIG.defaultFPS;


  const frameDuration =
    1 / fps;


  let target =
    video.currentTime +
    (
      frameDuration *
      direction
    );


  target =
    Math.max(
      0,
      Math.min(
        target,
        VideoManager.duration
      )
    );


  video.currentTime =
    target;


  VideoManager.currentTime =
    target;


  updateVideoUI();


  /*
     seeked 이후 프레임 분석
  */

  video.addEventListener(
    "seeked",
    () => {

      dispatchVideoFrame();

    },
    {
      once: true
    }
  );

}


/* =========================================================
   18. SEEK
========================================================= */

function seekAnalysisVideo(time) {

  const video =
    VideoManager.video;


  if (
    !video ||
    !VideoManager.loaded
  ) {
    return;
  }


  const safeTime =
    Math.max(
      0,
      Math.min(
        Number(time) || 0,
        VideoManager.duration
      )
    );


  video.currentTime =
    safeTime;


  VideoManager.currentTime =
    safeTime;


  updateVideoUI();

}


/* =========================================================
   19. ANALYSIS LOOP
========================================================= */

function startVideoAnalysisLoop() {

  cancelVideoAnalysisLoop();


  const loop = timestamp => {

    if (
      !VideoManager.playing
    ) {
      return;
    }


    const video =
      VideoManager.video;


    if (!video) {
      return;
    }


    VideoManager.currentTime =
      video.currentTime;


    updateVideoUI();


    /*
       pose.js / sports-analysis.js가
       이 프레임을 받아 분석
    */

    document.dispatchEvent(
      new CustomEvent(
        "video:frame",
        {
          detail: {

            video,

            timestamp,

            currentTime:
              video.currentTime,

            duration:
              video.duration,

            playbackRate:
              video.playbackRate

          }
        }
      )
    );


    VideoManager.animationFrame =
      requestAnimationFrame(
        loop
      );

  };


  VideoManager.animationFrame =
    requestAnimationFrame(
      loop
    );

}


/* =========================================================
   20. DISPATCH SINGLE FRAME
========================================================= */

function dispatchVideoFrame() {

  const video =
    VideoManager.video;


  if (!video) {
    return;
  }


  document.dispatchEvent(
    new CustomEvent(
      "video:frame",
      {
        detail: {

          video,

          timestamp:
            performance.now(),

          currentTime:
            video.currentTime,

          duration:
            video.duration,

          playbackRate:
            video.playbackRate,

          paused:
            true

        }
      }
    )
  );

}


/* =========================================================
   21. CANCEL LOOP
========================================================= */

function cancelVideoAnalysisLoop() {

  if (
    VideoManager.animationFrame
  ) {

    cancelAnimationFrame(
      VideoManager.animationFrame
    );


    VideoManager.animationFrame =
      null;

  }

}


/* =========================================================
   22. SNAPSHOT
========================================================= */

function captureVideoFrame() {

  const video =
    VideoManager.video;


  if (
    !video ||
    !VideoManager.loaded
  ) {

    showVideoMessage(
      "먼저 영상을 선택해주세요.",
      "error"
    );

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


  const image =
    canvas.toDataURL(
      "image/jpeg",
      VIDEO_CONFIG.snapshotQuality
    );


  const snapshot = {

    id:
      "video_frame_" +
      Date.now(),

    time:
      video.currentTime,

    formattedTime:
      formatVideoTime(
        video.currentTime
      ),

    width:
      canvas.width,

    height:
      canvas.height,

    image,

    createdAt:
      new Date()
        .toISOString()

  };


  document.dispatchEvent(
    new CustomEvent(
      "video:snapshot",
      {
        detail:
          snapshot
      }
    )
  );


  showVideoMessage(
    `프레임 캡처 ${snapshot.formattedTime}`,
    "success"
  );


  return snapshot;

}


/* =========================================================
   23. SEGMENT START

   바이애슬론 / 육상 등에서
   구간 분석 시작점 지정
========================================================= */

function setSegmentStart() {

  const video =
    VideoManager.video;


  if (!video) {
    return;
  }


  VideoManager.segmentStart =
    video.currentTime;


  /*
     종료점보다 뒤에 시작점을 찍었다면
     종료점 초기화
  */

  if (
    VideoManager.segmentEnd !== null &&
    VideoManager.segmentEnd <
      VideoManager.segmentStart
  ) {

    VideoManager.segmentEnd =
      null;

  }


  updateSegmentUI();


  document.dispatchEvent(
    new CustomEvent(
      "video:segment-start",
      {
        detail: {

          time:
            VideoManager.segmentStart

        }
      }
    )
  );

}


/* =========================================================
   24. SEGMENT END
========================================================= */

function setSegmentEnd() {

  const video =
    VideoManager.video;


  if (!video) {
    return;
  }


  if (
    VideoManager.segmentStart ===
      null
  ) {

    showVideoMessage(
      "먼저 구간 시작점을 지정해주세요.",
      "error"
    );

    return;
  }


  if (
    video.currentTime <=
    VideoManager.segmentStart
  ) {

    showVideoMessage(
      "종료점은 시작점보다 뒤에 지정해주세요.",
      "error"
    );

    return;
  }


  VideoManager.segmentEnd =
    video.currentTime;


  updateSegmentUI();


  const segment =
    getCurrentVideoSegment();


  document.dispatchEvent(
    new CustomEvent(
      "video:segment-complete",
      {
        detail:
          segment
      }
    )
  );


  showVideoMessage(
    `구간 ${segment.duration.toFixed(2)}초`,
    "success"
  );

}


/* =========================================================
   25. GET SEGMENT
========================================================= */

function getCurrentVideoSegment() {

  if (
    VideoManager.segmentStart ===
      null ||
    VideoManager.segmentEnd ===
      null
  ) {

    return null;

  }


  return {

    start:
      VideoManager.segmentStart,

    end:
      VideoManager.segmentEnd,

    duration:
      VideoManager.segmentEnd -
      VideoManager.segmentStart,

    startLabel:
      formatVideoTime(
        VideoManager.segmentStart
      ),

    endLabel:
      formatVideoTime(
        VideoManager.segmentEnd
      )

  };

}


/* =========================================================
   26. CLEAR SEGMENT
========================================================= */

function clearVideoSegment() {

  VideoManager.segmentStart =
    null;


  VideoManager.segmentEnd =
    null;


  updateSegmentUI();

}


/* =========================================================
   27. SEGMENT UI
========================================================= */

function updateSegmentUI() {

  const start =
    document.querySelector(
      "[data-segment-start-time]"
    );


  const end =
    document.querySelector(
      "[data-segment-end-time]"
    );


  const duration =
    document.querySelector(
      "[data-segment-duration]"
    );


  if (start) {

    start.textContent =
      VideoManager.segmentStart !== null
        ? formatVideoTime(
            VideoManager.segmentStart
          )
        : "--:--.--";

  }


  if (end) {

    end.textContent =
      VideoManager.segmentEnd !== null
        ? formatVideoTime(
            VideoManager.segmentEnd
          )
        : "--:--.--";

  }


  const segment =
    getCurrentVideoSegment();


  if (duration) {

    duration.textContent =
      segment
        ? `${segment.duration.toFixed(2)} s`
        : "--";

  }

}


/* =========================================================
   28. VIDEO UI
========================================================= */

function updateVideoUI() {

  const video =
    VideoManager.video;


  if (!video) {
    return;
  }


  const current =
    video.currentTime || 0;


  const duration =
    Number.isFinite(
      video.duration
    )
      ? video.duration
      : 0;


  VideoManager.currentTime =
    current;


  document
    .querySelectorAll(
      "[data-video-current-time]"
    )
    .forEach(
      element => {

        element.textContent =
          formatVideoTime(
            current
          );

      }
    );


  document
    .querySelectorAll(
      "[data-video-duration]"
    )
    .forEach(
      element => {

        element.textContent =
          formatVideoTime(
            duration
          );

      }
    );


  document
    .querySelectorAll(
      [
        "#video-timeline",
        "[data-video-timeline]"
      ].join(",")
    )
    .forEach(
      slider => {

        slider.min =
          0;

        slider.max =
          duration || 0;

        slider.step =
          0.001;

        slider.value =
          current;

      }
    );


  updateFrameNumber();

}


/* =========================================================
   29. FRAME NUMBER
========================================================= */

function updateFrameNumber() {

  const frame =
    Math.round(
      VideoManager.currentTime *
      VideoManager.estimatedFPS
    );


  document
    .querySelectorAll(
      "[data-video-frame-number]"
    )
    .forEach(
      element => {

        element.textContent =
          `FRAME ${frame}`;

      }
    );

}


/* =========================================================
   30. STATUS
========================================================= */

function updateVideoStatus(status) {

  document
    .querySelectorAll(
      "[data-video-status]"
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
   31. MESSAGE
========================================================= */

function showVideoMessage(
  message,
  type = ""
) {

  const element =

    document.getElementById(
      "video-message"
    ) ||

    document.querySelector(
      "[data-video-message]"
    );


  if (!element) {

    if (message) {

      console.log(
        "[VIDEO]",
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
   32. FORMAT TIME
========================================================= */

function formatVideoTime(seconds) {

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


/* =========================================================
   33. SET ESTIMATED FPS

   향후 영상 메타데이터/분석 결과로
   60fps, 120fps 등 지정 가능
========================================================= */

function setVideoEstimatedFPS(fps) {

  const value =
    Number(fps);


  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return;
  }


  VideoManager.estimatedFPS =
    value;


  updateFrameNumber();

}


/* =========================================================
   34. RELEASE VIDEO URL
========================================================= */

function releaseVideoURL() {

  if (
    VideoManager.objectURL
  ) {

    URL.revokeObjectURL(
      VideoManager.objectURL
    );


    VideoManager.objectURL =
      null;

  }

}


/* =========================================================
   35. RESET
========================================================= */

function resetAnalysisVideo() {

  pauseAnalysisVideo();


  if (
    VideoManager.video
  ) {

    VideoManager.video.removeAttribute(
      "src"
    );


    VideoManager.video.load();

  }


  releaseVideoURL();


  VideoManager.file =
    null;

  VideoManager.loaded =
    false;

  VideoManager.duration =
    0;

  VideoManager.currentTime =
    0;

  VideoManager.segmentStart =
    null;

  VideoManager.segmentEnd =
    null;


  updateSegmentUI();


  updateVideoStatus(
    "READY"
  );

}


/* =========================================================
   36. VIDEO STATE
========================================================= */

function getVideoState() {

  return {

    loaded:
      VideoManager.loaded,

    playing:
      VideoManager.playing,

    duration:
      VideoManager.duration,

    currentTime:
      VideoManager.currentTime,

    playbackRate:
      VideoManager.playbackRate,

    fps:
      VideoManager.estimatedFPS,

    segment:
      getCurrentVideoSegment()

  };

}


/* =========================================================
   37. PAGE CLEANUP
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    releaseVideoURL();

  }
);


/* =========================================================
   38. AUTO INIT
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initVideo
  );

}

else {

  initVideo();

}


/* =========================================================
   39. GLOBAL ACCESS
========================================================= */

window.VIDEO_CONFIG =
  VIDEO_CONFIG;

window.VideoManager =
  VideoManager;

window.initVideo =
  initVideo;

window.openVideoPicker =
  openVideoPicker;

window.loadAnalysisVideo =
  loadAnalysisVideo;

window.playAnalysisVideo =
  playAnalysisVideo;

window.pauseAnalysisVideo =
  pauseAnalysisVideo;

window.toggleAnalysisVideo =
  toggleAnalysisVideo;

window.setVideoSpeed =
  setVideoSpeed;

window.stepVideoFrame =
  stepVideoFrame;

window.seekAnalysisVideo =
  seekAnalysisVideo;

window.captureVideoFrame =
  captureVideoFrame;

window.setSegmentStart =
  setSegmentStart;

window.setSegmentEnd =
  setSegmentEnd;

window.clearVideoSegment =
  clearVideoSegment;

window.getCurrentVideoSegment =
  getCurrentVideoSegment;

window.setVideoEstimatedFPS =
  setVideoEstimatedFPS;

window.getVideoState =
  getVideoState;

window.resetAnalysisVideo =
  resetAnalysisVideo;