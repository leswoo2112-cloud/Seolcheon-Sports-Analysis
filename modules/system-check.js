/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / SYSTEM-CHECK.JS

   SYSTEM DIAGNOSTIC ENGINE

   기능
   - 핵심 모듈 연결 검사
   - 선수관리 검사
   - 종목분석 검사
   - 자세분석 검사
   - 카메라 지원 검사
   - 영상 업로드 검사
   - Canvas 검사
   - 3D 분석 검사
   - 리포트 검사
   - Chart.js 검사
   - LocalStorage 검사
   - 시스템 상태 표시
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const SYSTEM_CHECK_CONFIG = {

  name:
    "설천고 스포츠 퍼포먼스 분석 시스템",

  version:
    "1.0.0",

  autoRun:
    true

};


/* =========================================================
   02. STATE
========================================================= */

const SYSTEM_CHECK_STATE = {

  initialized:
    false,

  running:
    false,

  checks:
    [],

  score:
    0,

  status:
    "waiting",

  lastCheckedAt:
    null

};


/* =========================================================
   03. CHECK RESULT
========================================================= */

function createCheckResult(
  id,
  name,
  success,
  message = "",
  critical = false
) {

  return {

    id,

    name,

    success:
      Boolean(success),

    message,

    critical,

    checkedAt:
      new Date()
        .toISOString()

  };

}


/* =========================================================
   04. ADD RESULT
========================================================= */

function addSystemCheck(
  result
) {

  SYSTEM_CHECK_STATE
    .checks
    .push(
      result
    );


  return result;

}


/* =========================================================
   05. MODULE CHECK
========================================================= */

function checkModule(
  id,
  name,
  objectName,
  critical = false
) {

  const exists =
    typeof window[
      objectName
    ] !==
    "undefined";


  return addSystemCheck(

    createCheckResult(

      id,

      name,

      exists,

      exists
        ? "정상 연결"
        : `${objectName} 모듈을 찾을 수 없습니다.`,

      critical

    )

  );

}


/* =========================================================
   06. LOCAL STORAGE
========================================================= */

function checkLocalStorage() {

  let success =
    false;


  try {

    const key =
      "__seolcheon_test__";


    localStorage.setItem(
      key,
      "1"
    );


    success =
      localStorage.getItem(
        key
      ) ===
      "1";


    localStorage.removeItem(
      key
    );

  }

  catch (error) {

    success =
      false;

  }


  return addSystemCheck(

    createCheckResult(

      "local-storage",

      "데이터 저장소",

      success,

      success
        ? "LocalStorage 사용 가능"
        : "브라우저 저장소를 사용할 수 없습니다.",

      true

    )

  );

}


/* =========================================================
   07. CAMERA
========================================================= */

function checkCameraSupport() {

  const success =
    Boolean(

      navigator.mediaDevices &&

      typeof navigator
        .mediaDevices
        .getUserMedia ===
        "function"

    );


  return addSystemCheck(

    createCheckResult(

      "camera",

      "실시간 카메라",

      success,

      success
        ? "카메라 API 지원"
        : "현재 브라우저에서 카메라 API를 사용할 수 없습니다.",

      false

    )

  );

}


/* =========================================================
   08. VIDEO
========================================================= */

function checkVideoSupport() {

  const video =
    document.createElement(
      "video"
    );


  const success =
    Boolean(
      video.canPlayType
    );


  return addSystemCheck(

    createCheckResult(

      "video",

      "영상 분석",

      success,

      success
        ? "HTML5 Video 지원"
        : "영상 재생 기능을 사용할 수 없습니다.",

      true

    )

  );

}


/* =========================================================
   09. CANVAS
========================================================= */

function checkCanvasSupport() {

  const canvas =
    document.createElement(
      "canvas"
    );


  const success =
    Boolean(
      canvas.getContext &&
      canvas.getContext(
        "2d"
      )
    );


  return addSystemCheck(

    createCheckResult(

      "canvas",

      "분석 오버레이",

      success,

      success
        ? "Canvas 2D 지원"
        : "Canvas 기능을 사용할 수 없습니다.",

      true

    )

  );

}


/* =========================================================
   10. WEBGL / 3D
========================================================= */

function checkWebGLSupport() {

  let success =
    false;


  try {

    const canvas =
      document.createElement(
        "canvas"
      );


    success =
      Boolean(

        canvas.getContext(
          "webgl2"
        ) ||

        canvas.getContext(
          "webgl"
        )

      );

  }

  catch (error) {

    success =
      false;

  }


  return addSystemCheck(

    createCheckResult(

      "webgl",

      "3D 자세분석",

      success,

      success
        ? "WebGL 지원"
        : "3D 그래픽 지원을 확인할 수 없습니다.",

      false

    )

  );

}


/* =========================================================
   11. CHART.JS
========================================================= */

function checkChartJS() {

  const success =
    typeof window.Chart !==
    "undefined";


  return addSystemCheck(

    createCheckResult(

      "chart",

      "육각형 그래프",

      success,

      success
        ? "Chart.js 정상 연결"
        : "Chart.js가 연결되지 않았습니다.",

      false

    )

  );

}


/* =========================================================
   12. FILE API
========================================================= */

function checkFileAPI() {

  const success =
    Boolean(

      window.File &&
      window.FileReader &&
      window.Blob

    );


  return addSystemCheck(

    createCheckResult(

      "file-api",

      "영상 파일 업로드",

      success,

      success
        ? "File API 지원"
        : "파일 업로드 기능을 지원하지 않습니다.",

      true

    )

  );

}


/* =========================================================
   13. FULLSCREEN
========================================================= */

function checkFullscreen() {

  const success =
    Boolean(

      document.documentElement
        .requestFullscreen ||

      document.documentElement
        .webkitRequestFullscreen

    );


  return addSystemCheck(

    createCheckResult(

      "fullscreen",

      "전체화면 분석",

      success,

      success
        ? "전체화면 사용 가능"
        : "전체화면 API 미지원",

      false

    )

  );

}


/* =========================================================
   14. PERFORMANCE API
========================================================= */

function checkPerformanceAPI() {

  const success =
    Boolean(

      window.performance &&

      typeof performance.now ===
        "function"

    );


  return addSystemCheck(

    createCheckResult(

      "performance",

      "고속 시간 측정",

      success,

      success
        ? "Performance API 지원"
        : "정밀 시간 측정 기능을 사용할 수 없습니다.",

      false

    )

  );

}


/* =========================================================
   15. MEDIA RECORDER
========================================================= */

function checkMediaRecorder() {

  const success =
    typeof window
      .MediaRecorder !==
    "undefined";


  return addSystemCheck(

    createCheckResult(

      "media-recorder",

      "실시간 영상 기록",

      success,

      success
        ? "MediaRecorder 지원"
        : "영상 녹화 기능이 제한될 수 있습니다.",

      false

    )

  );

}


/* =========================================================
   16. ATHLETE SYSTEM
========================================================= */

function checkAthleteSystem() {

  const module =
    window.SeolcheonAthletes;


  const success =
    Boolean(

      module &&

      typeof module.register ===
        "function" &&

      typeof module.select ===
        "function" &&

      typeof module.all ===
        "function"

    );


  return addSystemCheck(

    createCheckResult(

      "athlete-system",

      "선수 등록·관리",

      success,

      success
        ? "선수 관리 시스템 정상"
        : "선수 관리 모듈 연결을 확인하세요.",

      true

    )

  );

}


/* =========================================================
   17. SPORT ANALYSIS
========================================================= */

function checkSportAnalysis() {

  const module =
    window
      .SeolcheonSportAnalysis;


  const success =
    Boolean(

      module &&

      typeof module.selectSport ===
        "function" &&

      typeof module.update ===
        "function"

    );


  let sports =
    0;


  if (
    module?.profiles
  ) {

    sports =
      Object.keys(
        module.profiles
      ).length;

  }


  return addSystemCheck(

    createCheckResult(

      "sport-analysis",

      "종목별 자세분석",

      success,

      success
        ? `${sports}개 분석 프로필 연결`
        : "종목 분석 컨트롤러가 연결되지 않았습니다.",

      true

    )

  );

}


/* =========================================================
   18. ANALYSIS CONTROLLER
========================================================= */

function checkAnalysisController() {

  const module =
    window
      .SeolcheonAnalysisController;


  const success =
    Boolean(module);


  return addSystemCheck(

    createCheckResult(

      "analysis-controller",

      "통합 자세분석 엔진",

      success,

      success
        ? "분석 컨트롤러 정상 연결"
        : "분석 컨트롤러를 찾을 수 없습니다.",

      true

    )

  );

}


/* =========================================================
   19. REPORT SYSTEM
========================================================= */

function checkReportSystem() {

  const module =
    window
      .SeolcheonReport;


  const success =
    Boolean(

      module &&

      typeof module.open ===
        "function" &&

      typeof module.render ===
        "function"

    );


  return addSystemCheck(

    createCheckResult(

      "report",

      "선수 분석 리포트",

      success,

      success
        ? "리포트 시스템 정상"
        : "리포트 모듈 연결을 확인하세요.",

      true

    )

  );

}


/* =========================================================
   20. ANALYSIS RESULT SYSTEM
========================================================= */

function checkAnalysisResultSystem() {

  const module =
    window
      .SeolcheonAnalysisResult;


  const success =
    Boolean(module);


  return addSystemCheck(

    createCheckResult(

      "analysis-result",

      "분석 결과 저장",

      success,

      success
        ? "분석 결과 시스템 정상"
        : "분석 결과 저장 모듈이 없습니다.",

      true

    )

  );

}


/* =========================================================
   21. SLOW MOTION
========================================================= */

function checkSlowMotionSystem() {

  const videos =
    document.querySelectorAll(
      "video"
    );


  let success =
    false;


  videos.forEach(
    video => {

      try {

        const original =
          video.playbackRate;


        video.playbackRate =
          0.5;


        success =
          video.playbackRate ===
          0.5;


        video.playbackRate =
          original;

      }

      catch (error) {

        /* ignore */

      }

    }
  );


  /*
     아직 video element가 없어도
     브라우저 기능 자체는 검사
  */

  if (
    videos.length ===
    0
  ) {

    const testVideo =
      document.createElement(
        "video"
      );


    success =
      "playbackRate" in
      testVideo;

  }


  return addSystemCheck(

    createCheckResult(

      "slow-motion",

      "슬로모션",

      success,

      success
        ? "재생속도 제어 가능"
        : "슬로모션 기능을 사용할 수 없습니다.",

      false

    )

  );

}


/* =========================================================
   22. 3D MODULE
========================================================= */

function check3DModule() {

  const candidates = [

    "Seolcheon3D",
    "SeolcheonPose3D",
    "SeolcheonThreeD"

  ];


  const success =
    candidates.some(
      key =>
        typeof window[key] !==
        "undefined"
    );


  return addSystemCheck(

    createCheckResult(

      "3d-module",

      "3D 분석 엔진",

      success,

      success
        ? "3D 분석 모듈 연결"
        : "3D 모듈이 아직 연결되지 않았거나 브라우저 3D 기능만 사용합니다.",

      false

    )

  );

}


/* =========================================================
   23. BARBELL TRACKING
========================================================= */

function checkBarbellTracking() {

  const success =
    Boolean(

      window
        .SeolcheonBarbellTracking ||

      window
        .SeolcheonTrajectory ||

      window
        .SeolcheonAnalysisController

    );


  return addSystemCheck(

    createCheckResult(

      "barbell",

      "바벨 궤적 분석",

      success,

      success
        ? "궤적 분석 연결 가능"
        : "바벨 궤적 모듈을 확인하세요.",

      false

    )

  );

}


/* =========================================================
   24. REQUIRED HTML
========================================================= */

function checkRequiredHTML() {

  const required = [

    {
      selector:
        "[data-page]",

      name:
        "페이지 컨테이너"
    },

    {
      selector:
        "[data-athlete-form], #athleteForm",

      name:
        "선수 등록 폼"
    },

    {
      selector:
        "[data-athlete-list]",

      name:
        "선수 목록"
    },

    {
      selector:
        "[data-sport-selector='winter']",

      name:
        "동계 종목 선택"
    },

    {
      selector:
        "[data-sport-selector='summer']",

      name:
        "하계 종목 선택"
    },

    {
      selector:
        "[data-report-radar]",

      name:
        "리포트 육각형 그래프"
    }

  ];


  const missing = [];


  required.forEach(
    item => {

      if (
        !document.querySelector(
          item.selector
        )
      ) {

        missing.push(
          item.name
        );

      }

    }
  );


  const success =
    missing.length ===
    0;


  return addSystemCheck(

    createCheckResult(

      "html",

      "HTML 인터페이스",

      success,

      success
        ? "필수 UI 영역 정상"
        : `누락: ${missing.join(", ")}`,

      true

    )

  );

}


/* =========================================================
   25. SCRIPT ERROR LISTENER
========================================================= */

function bindGlobalErrorListener() {

  window.addEventListener(
    "error",
    event => {

      console.error(
        "[SEOLCHEON SYSTEM ERROR]",
        event.error ||
        event.message
      );


      updateSystemIndicator(
        "warning"
      );

    }
  );


  window.addEventListener(
    "unhandledrejection",
    event => {

      console.error(
        "[SEOLCHEON PROMISE ERROR]",
        event.reason
      );


      updateSystemIndicator(
        "warning"
      );

    }
  );

}


/* =========================================================
   26. SCORE
========================================================= */

function calculateSystemScore() {

  const checks =
    SYSTEM_CHECK_STATE
      .checks;


  if (!checks.length) {

    return 0;

  }


  let earned =
    0;

  let possible =
    0;


  checks.forEach(
    check => {

      const weight =
        check.critical
          ? 2
          : 1;


      possible +=
        weight;


      if (
        check.success
      ) {

        earned +=
          weight;

      }

    }
  );


  return Math.round(
    (
      earned /
      possible
    ) *
    100
  );

}


/* =========================================================
   27. SYSTEM STATUS
========================================================= */

function calculateSystemStatus() {

  const criticalFailure =
    SYSTEM_CHECK_STATE
      .checks
      .some(
        check =>
          check.critical &&
          !check.success
      );


  if (
    criticalFailure
  ) {

    return "error";

  }


  const score =
    SYSTEM_CHECK_STATE
      .score;


  if (
    score >=
    90
  ) {

    return "ready";

  }


  if (
    score >=
    70
  ) {

    return "warning";

  }


  return "error";

}


/* =========================================================
   28. RUN ALL
========================================================= */

function runSystemCheck() {

  if (
    SYSTEM_CHECK_STATE
      .running
  ) {

    return;
  }


  SYSTEM_CHECK_STATE
    .running =
      true;


  SYSTEM_CHECK_STATE
    .checks =
      [];


  /*
     Browser
  */

  checkLocalStorage();

  checkCameraSupport();

  checkVideoSupport();

  checkCanvasSupport();

  checkWebGLSupport();

  checkFileAPI();

  checkFullscreen();

  checkPerformanceAPI();

  checkMediaRecorder();

  checkSlowMotionSystem();


  /*
     Libraries
  */

  checkChartJS();


  /*
     HTML
  */

  checkRequiredHTML();


  /*
     Seolcheon modules
  */

  checkAthleteSystem();

  checkSportAnalysis();

  checkAnalysisController();

  checkAnalysisResultSystem();

  checkReportSystem();

  check3DModule();

  checkBarbellTracking();


  SYSTEM_CHECK_STATE
    .score =
      calculateSystemScore();


  SYSTEM_CHECK_STATE
    .status =
      calculateSystemStatus();


  SYSTEM_CHECK_STATE
    .lastCheckedAt =
      new Date()
        .toISOString();


  SYSTEM_CHECK_STATE
    .running =
      false;


  renderSystemCheck();


  updateSystemIndicator(
    SYSTEM_CHECK_STATE
      .status
  );


  window.dispatchEvent(

    new CustomEvent(
      "seolcheon:system-check",
      {

        detail: {

          score:
            SYSTEM_CHECK_STATE
              .score,

          status:
            SYSTEM_CHECK_STATE
              .status,

          checks:
            [
              ...SYSTEM_CHECK_STATE
                .checks
            ]

        }

      }
    )

  );


  console.log(
    "[SEOLCHEON] System Check:",
    SYSTEM_CHECK_STATE.score,
    "%",
    SYSTEM_CHECK_STATE.status
  );


  return {
    score:
      SYSTEM_CHECK_STATE
        .score,

    status:
      SYSTEM_CHECK_STATE
        .status,

    checks:
      [
        ...SYSTEM_CHECK_STATE
          .checks
      ]
  };

}


/* =========================================================
   29. INDICATOR
========================================================= */

function updateSystemIndicator(
  status
) {

  const indicators =
    document.querySelectorAll(
      "[data-system-status]"
    );


  indicators.forEach(
    element => {

      element.dataset.status =
        status;


      switch (
        status
      ) {

        case "ready":

          element.textContent =
            "SYSTEM ONLINE";

          break;


        case "warning":

          element.textContent =
            "SYSTEM CHECK";

          break;


        case "error":

          element.textContent =
            "SYSTEM ERROR";

          break;


        default:

          element.textContent =
            "SYSTEM STARTING";

      }

    }
  );

}


/* =========================================================
   30. RENDER CHECK LIST
========================================================= */

function renderSystemCheck() {

  const container =
    document.querySelector(
      "[data-system-check-list]"
    );


  if (!container) {

    return;

  }


  container.innerHTML =
    SYSTEM_CHECK_STATE
      .checks
      .map(
        check => `

          <div
            class="
              system-check-row
              ${
                check.success
                  ? "success"
                  : "failed"
              }
            "
          >

            <span
              class="system-check-icon"
            >
              ${
                check.success
                  ? "✓"
                  : "!"
              }
            </span>


            <div
              class="system-check-info"
            >

              <strong>
                ${check.name}
              </strong>

              <small>
                ${check.message}
              </small>

            </div>


            <span
              class="system-check-state"
            >
              ${
                check.success
                  ? "정상"
                  : "확인 필요"
              }
            </span>

          </div>

        `
      )
      .join("");


  const score =
    document.querySelector(
      "[data-system-score]"
    );


  if (score) {

    score.textContent =
      `${SYSTEM_CHECK_STATE.score}%`;

  }

}


/* =========================================================
   31. SUMMARY
========================================================= */

function getSystemSummary() {

  const success =
    SYSTEM_CHECK_STATE
      .checks
      .filter(
        check =>
          check.success
      )
      .length;


  const failed =
    SYSTEM_CHECK_STATE
      .checks
      .filter(
        check =>
          !check.success
      )
      .length;


  const critical =
    SYSTEM_CHECK_STATE
      .checks
      .filter(
        check =>
          check.critical &&
          !check.success
      );


  return {

    total:
      SYSTEM_CHECK_STATE
        .checks
        .length,

    success,

    failed,

    criticalFailures:
      critical,

    score:
      SYSTEM_CHECK_STATE
        .score,

    status:
      SYSTEM_CHECK_STATE
        .status

  };

}


/* =========================================================
   32. RETRY BUTTON
========================================================= */

function bindSystemCheckButtons() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-system-check-run]"
        );


      if (!button) {

        return;

      }


      button.disabled =
        true;


      button.textContent =
        "검사 중...";


      setTimeout(
        () => {

          runSystemCheck();


          button.disabled =
            false;


          button.textContent =
            "시스템 다시 검사";

        },
        300
      );

    }
  );

}


/* =========================================================
   33. SYSTEM READY MESSAGE
========================================================= */

function showSystemReadyMessage() {

  const summary =
    getSystemSummary();


  const element =
    document.querySelector(
      "[data-system-message]"
    );


  if (!element) {

    return;

  }


  if (
    summary.status ===
    "ready"
  ) {

    element.textContent =
      "설천고 스포츠 분석 시스템이 정상적으로 준비되었습니다.";

    return;

  }


  if (
    summary.status ===
    "warning"
  ) {

    element.textContent =
      "일부 선택 기능을 확인해야 합니다. 기본 분석 기능은 사용할 수 있습니다.";

    return;

  }


  element.textContent =
    "필수 시스템 연결을 확인해주세요.";

}


/* =========================================================
   34. INITIALIZE
========================================================= */

function initializeSystemCheck() {

  if (
    SYSTEM_CHECK_STATE
      .initialized
  ) {

    return;

  }


  bindGlobalErrorListener();

  bindSystemCheckButtons();


  SYSTEM_CHECK_STATE
    .initialized =
      true;


  /*
     다른 JS 모듈들이 먼저 초기화될 시간을
     약간 준 다음 검사.
  */

  if (
    SYSTEM_CHECK_CONFIG
      .autoRun
  ) {

    window.setTimeout(
      () => {

        runSystemCheck();

        showSystemReadyMessage();

      },
      500
    );

  }


  console.log(
    "[SEOLCHEON] System Check Module Ready"
  );

}


/* =========================================================
   35. AUTO INITIALIZE
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeSystemCheck
  );

}

else {

  initializeSystemCheck();

}


/* =========================================================
   36. PUBLIC API
========================================================= */

window.SeolcheonSystemCheck = {

  config:
    SYSTEM_CHECK_CONFIG,

  state:
    SYSTEM_CHECK_STATE,

  init:
    initializeSystemCheck,

  run:
    runSystemCheck,

  summary:
    getSystemSummary,

  render:
    renderSystemCheck

};


/* =========================================================
   END
========================================================= */