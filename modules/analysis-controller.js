/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / ANALYSIS-CONTROLLER.JS

   ANALYSIS MASTER CONTROLLER

   역할
   - 종목 선택
   - 실시간 분석
   - 영상 분석
   - 슬로모션
   - 프레임 이동
   - 스켈레톤 표시
   - 관절각 표시
   - 종목별 분석 모듈 연결
   - 3D 분석 연결
   - 분석 결과 저장
   - 국가대표/엘리트 비교 연결
   - 추천 훈련 연결
   - 리포트 연결
========================================================= */

"use strict";


/* =========================================================
   01. STATE
========================================================= */

const ANALYSIS_CONTROLLER_STATE = {

  initialized: false,

  running: false,

  paused: false,

  mode: null,

  season: null,

  sport: null,

  sportName: null,

  athlete: null,

  videoFile: null,

  videoURL: null,

  stream: null,

  startTime: null,

  currentTime: 0,

  duration: 0,

  playbackRate: 1,

  skeletonEnabled: true,

  anglesEnabled: true,

  threeDEnabled: false,

  trajectoryEnabled: true,

  currentResult: null

};


/* =========================================================
   02. DOM
========================================================= */

function analysisElement(selector) {

  return document.querySelector(
    selector
  );

}


function analysisElements(selector) {

  return [
    ...document.querySelectorAll(
      selector
    )
  ];

}


/* =========================================================
   03. EVENT
========================================================= */

function dispatchAnalysisEvent(
  name,
  detail = {}
) {

  window.dispatchEvent(
    new CustomEvent(
      `seolcheon:${name}`,
      {
        detail
      }
    )
  );

}


/* =========================================================
   04. MESSAGE
========================================================= */

function showAnalysisMessage(
  message,
  type = "info"
) {

  const target =
    analysisElement(
      "[data-analysis-message]"
    );


  if (target) {

    target.textContent =
      message;

    target.dataset.type =
      type;

  }


  console.log(
    `[SEOLCHEON ANALYSIS] ${message}`
  );

}


/* =========================================================
   05. SELECT ATHLETE
========================================================= */

function selectAnalysisAthlete(
  athlete
) {

  if (!athlete) {
    return;
  }


  ANALYSIS_CONTROLLER_STATE.athlete =
    athlete;


  const name =
    analysisElement(
      "[data-analysis-athlete-name]"
    );


  if (name) {

    name.textContent =
      athlete.name ||
      "선수";

  }


  dispatchAnalysisEvent(
    "athlete-selected",
    {
      athlete
    }
  );

}


/* =========================================================
   06. SELECT SPORT
========================================================= */

function selectAnalysisSport(
  sport,
  season = "",
  sportName = ""
) {

  if (!sport) {
    return;
  }


  ANALYSIS_CONTROLLER_STATE.sport =
    sport;

  ANALYSIS_CONTROLLER_STATE.season =
    season;

  ANALYSIS_CONTROLLER_STATE.sportName =
    sportName || sport;


  analysisElements(
    "[data-analysis-sport]"
  )
  .forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.analysisSport ===
          sport
      );

    }
  );


  const title =
    analysisElement(
      "[data-current-sport-name]"
    );


  if (title) {

    title.textContent =
      ANALYSIS_CONTROLLER_STATE
        .sportName;

  }


  loadSportAnalysisProfile(
    sport
  );


  dispatchAnalysisEvent(
    "sport-selected",
    {
      sport,
      season,
      sportName
    }
  );

}


/* =========================================================
   07. SPORT PROFILE
========================================================= */

function loadSportAnalysisProfile(
  sport
) {

  /*
     sport-analysis-controller.js가
     로드되어 있다면 종목별 분석 UI를 변경.
  */

  if (
    window.SeolcheonSportAnalysis &&
    typeof window.SeolcheonSportAnalysis
      .selectSport ===
      "function"
  ) {

    window.SeolcheonSportAnalysis
      .selectSport(
        sport
      );

  }


  dispatchAnalysisEvent(
    "sport-profile",
    {
      sport
    }
  );

}


/* =========================================================
   08. ANALYSIS MODE
========================================================= */

function setAnalysisMode(
  mode
) {

  if (
    ![
      "realtime",
      "video"
    ].includes(
      mode
    )
  ) {

    return;
  }


  ANALYSIS_CONTROLLER_STATE.mode =
    mode;


  analysisElements(
    "[data-analysis-mode]"
  )
  .forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.analysisMode ===
          mode
      );

    }
  );


  dispatchAnalysisEvent(
    "mode-changed",
    {
      mode
    }
  );

}


/* =========================================================
   09. CAMERA SUPPORT
========================================================= */

function isCameraSupported() {

  return !!(
    navigator.mediaDevices &&
    navigator.mediaDevices
      .getUserMedia
  );

}


/* =========================================================
   10. START CAMERA
========================================================= */

async function startAnalysisCamera(
  facingMode = "environment"
) {

  if (
    !isCameraSupported()
  ) {

    showAnalysisMessage(
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다.",
      "error"
    );

    return false;

  }


  try {

    stopAnalysisCamera();


    const stream =
      await navigator.mediaDevices
        .getUserMedia({

          video: {

            facingMode: {
              ideal:
                facingMode
            },

            width: {
              ideal:
                1920
            },

            height: {
              ideal:
                1080
            }

          },

          audio:
            false

        });


    ANALYSIS_CONTROLLER_STATE.stream =
      stream;


    const video =
      analysisElement(
        "[data-analysis-video]"
      );


    if (video) {

      video.srcObject =
        stream;

      video.muted =
        true;

      video.playsInline =
        true;

      await video.play();

    }


    setAnalysisMode(
      "realtime"
    );


    showAnalysisMessage(
      "실시간 카메라가 시작되었습니다.",
      "success"
    );


    dispatchAnalysisEvent(
      "camera-started",
      {
        stream
      }
    );


    return true;

  }

  catch (error) {

    console.error(
      "[SEOLCHEON] Camera error:",
      error
    );


    let message =
      "카메라를 시작할 수 없습니다.";


    if (
      error.name ===
      "NotAllowedError"
    ) {

      message =
        "카메라 권한이 필요합니다. 브라우저에서 카메라 접근을 허용해주세요.";

    }


    if (
      error.name ===
      "NotFoundError"
    ) {

      message =
        "사용 가능한 카메라를 찾지 못했습니다.";

    }


    showAnalysisMessage(
      message,
      "error"
    );


    return false;

  }

}


/* =========================================================
   11. STOP CAMERA
========================================================= */

function stopAnalysisCamera() {

  const stream =
    ANALYSIS_CONTROLLER_STATE.stream;


  if (stream) {

    stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

  }


  ANALYSIS_CONTROLLER_STATE.stream =
    null;


  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (
    video &&
    video.srcObject
  ) {

    video.srcObject =
      null;

  }

}


/* =========================================================
   12. LOAD VIDEO FILE
========================================================= */

function loadAnalysisVideo(
  file
) {

  if (!file) {
    return false;
  }


  if (
    !file.type ||
    !file.type.startsWith(
      "video/"
    )
  ) {

    showAnalysisMessage(
      "영상 파일을 선택해주세요.",
      "error"
    );

    return false;

  }


  stopAnalysisCamera();


  if (
    ANALYSIS_CONTROLLER_STATE
      .videoURL
  ) {

    URL.revokeObjectURL(
      ANALYSIS_CONTROLLER_STATE
        .videoURL
    );

  }


  const url =
    URL.createObjectURL(
      file
    );


  ANALYSIS_CONTROLLER_STATE.videoFile =
    file;

  ANALYSIS_CONTROLLER_STATE.videoURL =
    url;


  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (video) {

    video.srcObject =
      null;

    video.src =
      url;

    video.controls =
      false;

    video.playsInline =
      true;

    video.load();

  }


  setAnalysisMode(
    "video"
  );


  showAnalysisMessage(
    `영상 불러오기 완료: ${file.name}`,
    "success"
  );


  dispatchAnalysisEvent(
    "video-loaded",
    {
      file,
      url
    }
  );


  return true;

}


/* =========================================================
   13. PLAY
========================================================= */

async function playAnalysisVideo() {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  try {

    await video.play();

    ANALYSIS_CONTROLLER_STATE.paused =
      false;

  }

  catch (error) {

    console.error(
      error
    );

  }

}


/* =========================================================
   14. PAUSE
========================================================= */

function pauseAnalysisVideo() {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  video.pause();

  ANALYSIS_CONTROLLER_STATE.paused =
    true;

}


/* =========================================================
   15. TOGGLE PLAY
========================================================= */

function toggleAnalysisPlayback() {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  if (
    video.paused
  ) {

    playAnalysisVideo();

  }

  else {

    pauseAnalysisVideo();

  }

}


/* =========================================================
   16. PLAYBACK RATE
========================================================= */

function setAnalysisPlaybackRate(
  rate
) {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  const value =
    Number(
      rate
    );


  if (
    !video ||
    !Number.isFinite(
      value
    ) ||
    value <= 0
  ) {

    return;
  }


  video.playbackRate =
    value;


  ANALYSIS_CONTROLLER_STATE
    .playbackRate =
      value;


  analysisElements(
    "[data-playback-rate]"
  )
  .forEach(
    button => {

      button.classList.toggle(
        "active",
        Number(
          button.dataset
            .playbackRate
        ) ===
          value
      );

    }
  );


  dispatchAnalysisEvent(
    "playback-rate",
    {
      rate:
        value
    }
  );

}


/* =========================================================
   17. FRAME STEP
========================================================= */

function stepAnalysisFrame(
  direction = 1
) {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  video.pause();


  const fps =
    Number(
      video.dataset.fps
    ) ||
    30;


  const frameTime =
    1 / fps;


  video.currentTime =
    Math.max(
      0,
      Math.min(
        video.duration || Infinity,
        video.currentTime +
          frameTime *
          direction
      )
    );


  ANALYSIS_CONTROLLER_STATE
    .currentTime =
      video.currentTime;

}


/* =========================================================
   18. SEEK
========================================================= */

function seekAnalysisVideo(
  time
) {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  const value =
    Number(
      time
    );


  if (
    !Number.isFinite(
      value
    )
  ) {
    return;
  }


  video.currentTime =
    Math.max(
      0,
      Math.min(
        video.duration || value,
        value
      )
    );

}


/* =========================================================
   19. OVERLAY
========================================================= */

function toggleAnalysisOverlay(
  type,
  enabled
) {

  const keyMap = {

    skeleton:
      "skeletonEnabled",

    angles:
      "anglesEnabled",

    threeD:
      "threeDEnabled",

    trajectory:
      "trajectoryEnabled"

  };


  const stateKey =
    keyMap[type];


  if (!stateKey) {
    return;
  }


  ANALYSIS_CONTROLLER_STATE[
    stateKey
  ] = !!enabled;


  const canvas =
    analysisElement(
      `[data-overlay="${type}"]`
    );


  if (canvas) {

    canvas.hidden =
      !enabled;

  }


  dispatchAnalysisEvent(
    "overlay-changed",
    {
      type,
      enabled:
        !!enabled
    }
  );

}


/* =========================================================
   20. CREATE ANALYSIS RESULT
========================================================= */

function createControllerResult() {

  if (
    !window.SeolcheonAnalysisResult
  ) {

    showAnalysisMessage(
      "analysis-result.js가 로드되지 않았습니다.",
      "error"
    );

    return null;

  }


  const athlete =
    ANALYSIS_CONTROLLER_STATE
      .athlete ||
    {};


  const result =
    window.SeolcheonAnalysisResult
      .start({

        athlete: {

          id:
            athlete.id ||
            "",

          name:
            athlete.name ||
            "",

          school:
            athlete.school ||
            "설천고",

          grade:
            athlete.grade ||
            "",

          gender:
            athlete.gender ||
            ""

        },


        analysis: {

          mode:
            ANALYSIS_CONTROLLER_STATE
              .mode ||
            "video",

          season:
            ANALYSIS_CONTROLLER_STATE
              .season ||
            "",

          sport:
            ANALYSIS_CONTROLLER_STATE
              .sport ||
            "",

          sportName:
            ANALYSIS_CONTROLLER_STATE
              .sportName ||
            ""

        },


        media: {

          type:
            ANALYSIS_CONTROLLER_STATE
              .mode ||
            "",

          videoName:
            ANALYSIS_CONTROLLER_STATE
              .videoFile
              ?.name ||
            ""

        }

      });


  ANALYSIS_CONTROLLER_STATE
    .currentResult =
      result;


  return result;

}


/* =========================================================
   21. START ANALYSIS
========================================================= */

async function startPerformanceAnalysis() {

  if (
    ANALYSIS_CONTROLLER_STATE.running
  ) {

    return;

  }


  if (
    !ANALYSIS_CONTROLLER_STATE
      .sport
  ) {

    showAnalysisMessage(
      "먼저 분석할 종목을 선택해주세요.",
      "error"
    );

    return;

  }


  if (
    !ANALYSIS_CONTROLLER_STATE
      .mode
  ) {

    showAnalysisMessage(
      "실시간 분석 또는 영상 분석을 선택해주세요.",
      "error"
    );

    return;

  }


  const result =
    createControllerResult();


  if (!result) {
    return;
  }


  ANALYSIS_CONTROLLER_STATE.running =
    true;

  ANALYSIS_CONTROLLER_STATE.startTime =
    performance.now();


  showAnalysisMessage(
    `${ANALYSIS_CONTROLLER_STATE.sportName} 분석을 시작합니다.`,
    "success"
  );


  dispatchAnalysisEvent(
    "analysis-start",
    {
      result
    }
  );


  /*
     실제 포즈 엔진 연결.

     pose.js에서 startAnalysis가
     존재하면 자동 실행.
  */

  if (
    window.SeolcheonPose &&
    typeof window.SeolcheonPose
      .startAnalysis ===
      "function"
  ) {

    try {

      await window.SeolcheonPose
        .startAnalysis({

          video:
            analysisElement(
              "[data-analysis-video]"
            ),

          sport:
            ANALYSIS_CONTROLLER_STATE
              .sport,

          mode:
            ANALYSIS_CONTROLLER_STATE
              .mode,

          result

        });

    }

    catch (error) {

      console.error(
        "[SEOLCHEON] Pose analysis error:",
        error
      );

    }

  }

}


/* =========================================================
   22. STOP ANALYSIS
========================================================= */

function stopPerformanceAnalysis() {

  if (
    !ANALYSIS_CONTROLLER_STATE.running
  ) {

    return null;

  }


  ANALYSIS_CONTROLLER_STATE.running =
    false;


  const endTime =
    performance.now();


  const duration =
    ANALYSIS_CONTROLLER_STATE
      .startTime
      ? (
          endTime -
          ANALYSIS_CONTROLLER_STATE
            .startTime
        ) / 1000
      : 0;


  ANALYSIS_CONTROLLER_STATE.duration =
    duration;


  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    result
  ) {

    result.analysis.duration =
      Number(
        duration.toFixed(2)
      );

  }


  if (
    window.SeolcheonPose &&
    typeof window.SeolcheonPose
      .stopAnalysis ===
      "function"
  ) {

    window.SeolcheonPose
      .stopAnalysis();

  }


  dispatchAnalysisEvent(
    "analysis-stop",
    {
      result,
      duration
    }
  );


  showAnalysisMessage(
    "분석이 종료되었습니다.",
    "success"
  );


  return result;

}


/* =========================================================
   23. RECEIVE POSE RESULT
========================================================= */

function receivePoseResult(
  data = {}
) {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (!result) {
    return;
  }


  if (
    data.skeleton &&
    window.SeolcheonAnalysisResult
  ) {

    window.SeolcheonAnalysisResult
      .setSkeleton(
        result,
        data.skeleton
      );

  }


  if (
    data.angles &&
    window.SeolcheonAnalysisResult
  ) {

    Object.entries(
      data.angles
    )
    .forEach(
      ([joint, angle]) => {

        window.SeolcheonAnalysisResult
          .setJointAngle(
            result,
            joint,
            angle
          );

      }
    );

  }


  if (
    data.scores
  ) {

    Object.entries(
      data.scores
    )
    .forEach(
      ([key, value]) => {

        if (
          Object.prototype
            .hasOwnProperty
            .call(
              result.scores,
              key
            )
        ) {

          result.scores[key] =
            value;

        }

      }
    );

  }


  dispatchAnalysisEvent(
    "pose-result",
    {
      data,
      result
    }
  );

}


/* =========================================================
   24. RECEIVE SPORT DATA
========================================================= */

function receiveSportAnalysis(
  data = {}
) {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (!result) {
    return;
  }


  const sport =
    ANALYSIS_CONTROLLER_STATE
      .sport;


  if (
    sport ===
      "biathlon" &&
    window.SeolcheonAnalysisResult
  ) {

    window.SeolcheonAnalysisResult
      .setBiathlon(
        result,
        data
      );

  }


  if (
    [
      "sprint",
      "middleDistance",
      "longDistance",
      "hurdles"
    ].includes(
      sport
    ) &&
    window.SeolcheonAnalysisResult
  ) {

    window.SeolcheonAnalysisResult
      .setRunning(
        result,
        data
      );

  }


  if (
    sport ===
      "weightlifting" &&
    window.SeolcheonAnalysisResult
  ) {

    window.SeolcheonAnalysisResult
      .setWeightlifting(
        result,
        data
      );

  }


  if (
    !result.sportSpecific[
      sport
    ]
  ) {

    result.sportSpecific[
      sport
    ] = {};

  }


  Object.assign(
    result.sportSpecific[
      sport
    ],
    data
  );


  dispatchAnalysisEvent(
    "sport-result",
    {
      sport,
      data,
      result
    }
  );

}


/* =========================================================
   25. ADD SEGMENT
========================================================= */

function addControllerSegment(
  segment
) {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    !result ||
    !window.SeolcheonAnalysisResult
  ) {

    return null;

  }


  return window.SeolcheonAnalysisResult
    .addSegment(
      result,
      segment
    );

}


/* =========================================================
   26. 3D RESULT
========================================================= */

function receive3DAnalysis(
  data
) {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    !result ||
    !window.SeolcheonAnalysisResult
  ) {

    return;
  }


  window.SeolcheonAnalysisResult
    .set3D(
      result,
      data
    );


  ANALYSIS_CONTROLLER_STATE
    .threeDEnabled =
      true;


  dispatchAnalysisEvent(
    "3d-result",
    {
      data,
      result
    }
  );

}


/* =========================================================
   27. ELITE COMPARISON
========================================================= */

function receiveEliteComparison(
  comparison
) {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    !result ||
    !window.SeolcheonAnalysisResult
  ) {

    return;
  }


  window.SeolcheonAnalysisResult
    .setEliteComparison(
      result,
      comparison
    );


  dispatchAnalysisEvent(
    "elite-comparison",
    {
      comparison,
      result
    }
  );

}


/* =========================================================
   28. CAPTURE FRAME
========================================================= */

function captureAnalysisFrame() {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (
    !video ||
    !video.videoWidth ||
    !video.videoHeight
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


  return canvas.toDataURL(
    "image/jpeg",
    0.88
  );

}


/* =========================================================
   29. SAVE SNAPSHOT
========================================================= */

function saveAnalysisSnapshot(
  type = "snapshot"
) {

  const image =
    captureAnalysisFrame();


  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    !image ||
    !result ||
    !window.SeolcheonAnalysisResult
  ) {

    return null;

  }


  window.SeolcheonAnalysisResult
    .setImage(
      result,
      type,
      image
    );


  return image;

}


/* =========================================================
   30. COMPLETE
========================================================= */

function completePerformanceAnalysis() {

  stopPerformanceAnalysis();


  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (
    !result ||
    !window.SeolcheonAnalysisResult
  ) {

    return null;

  }


  /*
     기본 분석 이미지 저장
  */

  if (
    !result.images.snapshot
  ) {

    saveAnalysisSnapshot(
      "snapshot"
    );

  }


  const completed =
    window.SeolcheonAnalysisResult
      .finalize(
        result
      );


  window.SeolcheonAnalysisResult
    .save(
      completed
    );


  ANALYSIS_CONTROLLER_STATE
    .currentResult =
      completed;


  showAnalysisMessage(
    "분석 결과가 저장되었습니다.",
    "success"
  );


  dispatchAnalysisEvent(
    "analysis-complete",
    {
      result:
        completed
    }
  );


  return completed;

}


/* =========================================================
   31. OPEN REPORT
========================================================= */

function openAnalysisReport() {

  const result =
    ANALYSIS_CONTROLLER_STATE
      .currentResult;


  if (!result) {

    showAnalysisMessage(
      "먼저 분석을 완료해주세요.",
      "error"
    );

    return;

  }


  const completed =
    completePerformanceAnalysis() ||
    result;


  if (
    window.SeolcheonReport &&
    typeof window.SeolcheonReport
      .open ===
      "function"
  ) {

    window.SeolcheonReport
      .open(
        completed
      );

  }


  dispatchAnalysisEvent(
    "open-report",
    {
      result:
        completed
    }
  );

}


/* =========================================================
   32. RESET
========================================================= */

function resetAnalysisController() {

  stopAnalysisCamera();


  if (
    ANALYSIS_CONTROLLER_STATE
      .videoURL
  ) {

    URL.revokeObjectURL(
      ANALYSIS_CONTROLLER_STATE
        .videoURL
    );

  }


  ANALYSIS_CONTROLLER_STATE.running =
    false;

  ANALYSIS_CONTROLLER_STATE.paused =
    false;

  ANALYSIS_CONTROLLER_STATE.mode =
    null;

  ANALYSIS_CONTROLLER_STATE.videoFile =
    null;

  ANALYSIS_CONTROLLER_STATE.videoURL =
    null;

  ANALYSIS_CONTROLLER_STATE.startTime =
    null;

  ANALYSIS_CONTROLLER_STATE.currentTime =
    0;

  ANALYSIS_CONTROLLER_STATE.duration =
    0;

  ANALYSIS_CONTROLLER_STATE.currentResult =
    null;


  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (video) {

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.srcObject =
      null;

    video.load();

  }


  showAnalysisMessage(
    "분석 화면이 초기화되었습니다.",
    "info"
  );

}


/* =========================================================
   33. VIDEO EVENTS
========================================================= */

function bindAnalysisVideoEvents() {

  const video =
    analysisElement(
      "[data-analysis-video]"
    );


  if (!video) {
    return;
  }


  video.addEventListener(
    "loadedmetadata",
    () => {

      ANALYSIS_CONTROLLER_STATE
        .duration =
          video.duration || 0;


      const duration =
        analysisElement(
          "[data-video-duration]"
        );


      if (duration) {

        duration.textContent =
          formatAnalysisTime(
            video.duration
          );

      }

    }
  );


  video.addEventListener(
    "timeupdate",
    () => {

      ANALYSIS_CONTROLLER_STATE
        .currentTime =
          video.currentTime;


      const current =
        analysisElement(
          "[data-video-current-time]"
        );


      if (current) {

        current.textContent =
          formatAnalysisTime(
            video.currentTime
          );

      }


      const timeline =
        analysisElement(
          "[data-analysis-timeline]"
        );


      if (
        timeline &&
        video.duration
      ) {

        timeline.value =
          (
            video.currentTime /
            video.duration
          ) *
          100;

      }

    }
  );

}


/* =========================================================
   34. TIME FORMAT
========================================================= */

function formatAnalysisTime(
  seconds
) {

  if (
    !Number.isFinite(
      seconds
    )
  ) {

    return "00:00.00";

  }


  const minutes =
    Math.floor(
      seconds / 60
    );

  const remain =
    seconds -
    minutes * 60;


  return (
    String(
      minutes
    ).padStart(
      2,
      "0"
    ) +
    ":" +
    remain
      .toFixed(2)
      .padStart(
        5,
        "0"
      )
  );

}


/* =========================================================
   35. BUTTON EVENTS
========================================================= */

function bindAnalysisButtons() {

  analysisElements(
    "[data-analysis-sport]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectAnalysisSport(

            button.dataset
              .analysisSport,

            button.dataset
              .season ||
              "",

            button.dataset
              .sportName ||
              button.textContent
                .trim()

          );

        }
      );

    }
  );


  analysisElements(
    "[data-analysis-mode]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          setAnalysisMode(
            button.dataset
              .analysisMode
          );

        }
      );

    }
  );


  const camera =
    analysisElement(
      "[data-start-camera]"
    );


  if (camera) {

    camera.addEventListener(
      "click",
      () =>
        startAnalysisCamera()
    );

  }


  const upload =
    analysisElement(
      "[data-video-upload]"
    );


  if (upload) {

    upload.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];


        if (file) {

          loadAnalysisVideo(
            file
          );

        }

      }
    );

  }


  const play =
    analysisElement(
      "[data-video-play]"
    );


  if (play) {

    play.addEventListener(
      "click",
      toggleAnalysisPlayback
    );

  }


  const previous =
    analysisElement(
      "[data-frame-prev]"
    );


  if (previous) {

    previous.addEventListener(
      "click",
      () =>
        stepAnalysisFrame(
          -1
        )
    );

  }


  const next =
    analysisElement(
      "[data-frame-next]"
    );


  if (next) {

    next.addEventListener(
      "click",
      () =>
        stepAnalysisFrame(
          1
        )
    );

  }


  analysisElements(
    "[data-playback-rate]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          setAnalysisPlaybackRate(
            button.dataset
              .playbackRate
          );

        }
      );

    }
  );


  const timeline =
    analysisElement(
      "[data-analysis-timeline]"
    );


  if (timeline) {

    timeline.addEventListener(
      "input",
      () => {

        const video =
          analysisElement(
            "[data-analysis-video]"
          );


        if (
          video &&
          video.duration
        ) {

          seekAnalysisVideo(
            video.duration *
            (
              Number(
                timeline.value
              ) /
              100
            )
          );

        }

      }
    );

  }


  const start =
    analysisElement(
      "[data-start-analysis]"
    );


  if (start) {

    start.addEventListener(
      "click",
      startPerformanceAnalysis
    );

  }


  const stop =
    analysisElement(
      "[data-stop-analysis]"
    );


  if (stop) {

    stop.addEventListener(
      "click",
      stopPerformanceAnalysis
    );

  }


  const complete =
    analysisElement(
      "[data-complete-analysis]"
    );


  if (complete) {

    complete.addEventListener(
      "click",
      completePerformanceAnalysis
    );

  }


  const report =
    analysisElement(
      "[data-open-analysis-report]"
    );


  if (report) {

    report.addEventListener(
      "click",
      openAnalysisReport
    );

  }


  const reset =
    analysisElement(
      "[data-reset-analysis]"
    );


  if (reset) {

    reset.addEventListener(
      "click",
      resetAnalysisController
    );

  }

}


/* =========================================================
   36. OVERLAY EVENTS
========================================================= */

function bindAnalysisOverlayButtons() {

  analysisElements(
    "[data-toggle-overlay]"
  )
  .forEach(
    input => {

      input.addEventListener(
        "change",
        () => {

          toggleAnalysisOverlay(

            input.dataset
              .toggleOverlay,

            input.checked

          );

        }
      );

    }
  );

}


/* =========================================================
   37. INITIALIZE
========================================================= */

function initializeAnalysisController() {

  if (
    ANALYSIS_CONTROLLER_STATE
      .initialized
  ) {

    return;
  }


  bindAnalysisButtons();

  bindAnalysisOverlayButtons();

  bindAnalysisVideoEvents();


  ANALYSIS_CONTROLLER_STATE
    .initialized =
      true;


  showAnalysisMessage(
    "분석 시스템 준비 완료",
    "success"
  );


  dispatchAnalysisEvent(
    "analysis-controller-ready"
  );


  console.log(
    "[SEOLCHEON] Analysis Controller Ready"
  );

}


/* =========================================================
   38. AUTO INIT
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAnalysisController
  );

}

else {

  initializeAnalysisController();

}


/* =========================================================
   39. PUBLIC API
========================================================= */

window.SeolcheonAnalysisController = {

  state:
    ANALYSIS_CONTROLLER_STATE,

  init:
    initializeAnalysisController,

  athlete:
    selectAnalysisAthlete,

  sport:
    selectAnalysisSport,

  mode:
    setAnalysisMode,

  camera:
    startAnalysisCamera,

  stopCamera:
    stopAnalysisCamera,

  loadVideo:
    loadAnalysisVideo,

  play:
    playAnalysisVideo,

  pause:
    pauseAnalysisVideo,

  togglePlay:
    toggleAnalysisPlayback,

  playbackRate:
    setAnalysisPlaybackRate,

  frame:
    stepAnalysisFrame,

  seek:
    seekAnalysisVideo,

  overlay:
    toggleAnalysisOverlay,

  start:
    startPerformanceAnalysis,

  stop:
    stopPerformanceAnalysis,

  poseResult:
    receivePoseResult,

  sportResult:
    receiveSportAnalysis,

  segment:
    addControllerSegment,

  result3D:
    receive3DAnalysis,

  elite:
    receiveEliteComparison,

  capture:
    captureAnalysisFrame,

  snapshot:
    saveAnalysisSnapshot,

  complete:
    completePerformanceAnalysis,

  report:
    openAnalysisReport,

  reset:
    resetAnalysisController

};


/* =========================================================
   END
========================================================= */