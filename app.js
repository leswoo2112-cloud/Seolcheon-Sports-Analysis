/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   APP.JS
   VERSION 1.0

   역할
   - 시스템 시작
   - 로그인 화면 연결
   - 페이지 이동
   - 대시보드 업데이트
   - 빠른 분석
   - 분석 화면 진입
   - 공통 UI 제어
========================================================= */

"use strict";


/* =========================================================
   01. APP CONFIG
========================================================= */

const APP_CONFIG = {

  name: "설천고",

  systemName: "SPORTS PERFORMANCE ANALYSIS SYSTEM",

  version: "1.0.0",

  defaultPage: "dashboard",

  storageKeys: {

    athletes: "seolcheon_athletes",

    analyses: "seolcheon_analyses",

    reports: "seolcheon_reports",

    settings: "seolcheon_settings",

    session: "seolcheon_session"

  }

};


/* =========================================================
   02. APP STATE
========================================================= */

const APP_STATE = {

  currentPage: "dashboard",

  currentUser: null,

  selectedSeason: "winter",

  selectedSport: null,

  selectedEvent: null,

  selectedAthlete: null,

  analysisMode: "camera",

  analysisRunning: false,

  currentAnalysis: null,

  analysisTab: "2d",

  analysisView: "skeleton"

};


/* =========================================================
   03. DOM HELPERS
========================================================= */

function qs(selector, parent = document) {

  return parent.querySelector(selector);

}


function qsa(selector, parent = document) {

  return Array.from(
    parent.querySelectorAll(selector)
  );

}


function byId(id) {

  return document.getElementById(id);

}


/* =========================================================
   04. SAFE STORAGE
========================================================= */

function readStorage(key, fallback = []) {

  try {

    const value =
      localStorage.getItem(key);

    if (!value) {

      return fallback;

    }

    return JSON.parse(value);

  }

  catch (error) {

    console.warn(
      "Storage read error:",
      key,
      error
    );

    return fallback;

  }

}


function writeStorage(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;

  }

  catch (error) {

    console.warn(
      "Storage write error:",
      key,
      error
    );

    return false;

  }

}


/* =========================================================
   05. DATE
========================================================= */

function getTodayKey() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function formatDateTime(value) {

  if (!value) {

    return "-";

  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return value;

  }

  return new Intl.DateTimeFormat(
    "ko-KR",
    {

      year: "numeric",

      month: "2-digit",

      day: "2-digit",

      hour: "2-digit",

      minute: "2-digit"

    }
  ).format(date);

}


/* =========================================================
   06. PAGE TITLES
========================================================= */

const PAGE_TITLES = {

  dashboard: "대시보드",

  athletes: "선수관리",

  sports: "종목 분석",

  analysis: "자세 분석",

  comparison: "엘리트 비교",

  records: "분석기록",

  reports: "선수 분석 리포트",

  training: "추가 훈련 추천",

  settings: "설정"

};


/* =========================================================
   07. PAGE NAVIGATION
========================================================= */

function navigateTo(pageName) {

  const page =
    byId(`page-${pageName}`);

  if (!page) {

    console.warn(
      `페이지를 찾을 수 없습니다: ${pageName}`
    );

    return;

  }


  qsa(".page").forEach(
    item => {

      item.classList.remove(
        "active"
      );

    }
  );


  page.classList.add(
    "active"
  );


  APP_STATE.currentPage =
    pageName;


  updateNavigation(
    pageName
  );


  updatePageTitle(
    pageName
  );


  runPageRefresh(
    pageName
  );


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =========================================================
   08. NAVIGATION UI
========================================================= */

function updateNavigation(pageName) {

  qsa(".nav-button").forEach(
    button => {

      button.classList.remove(
        "active"
      );


      if (
        button.dataset.page ===
        pageName
      ) {

        button.classList.add(
          "active"
        );

      }

    }
  );

}


/* =========================================================
   09. PAGE TITLE
========================================================= */

function updatePageTitle(pageName) {

  const title =
    byId("pageTitle");

  if (!title) {

    return;

  }

  title.textContent =
    PAGE_TITLES[pageName] ||
    "설천고";

}


/* =========================================================
   10. PAGE REFRESH
========================================================= */

function runPageRefresh(pageName) {

  switch (pageName) {

    case "dashboard":

      refreshDashboard();

      break;


    case "athletes":

      callModuleFunction(
        "renderAthletes"
      );

      break;


    case "sports":

      callModuleFunction(
        "renderSports"
      );

      break;


    case "records":

      renderAnalysisRecords();

      break;


    case "reports":

      callModuleFunction(
        "refreshReportPage"
      );

      break;


    case "training":

      callModuleFunction(
        "renderTrainingLibrary"
      );

      break;


    case "comparison":

      callModuleFunction(
        "refreshComparisonPage"
      );

      break;


    case "settings":

      renderSettings();

      break;

  }

}


/* =========================================================
   11. SAFE MODULE CALL

   아직 뒤 파일을 만들지 않았어도
   app.js가 멈추지 않도록 함
========================================================= */

function callModuleFunction(
  functionName,
  ...args
) {

  const fn =
    window[functionName];

  if (
    typeof fn ===
    "function"
  ) {

    try {

      return fn(...args);

    }

    catch (error) {

      console.error(
        `${functionName} 실행 오류`,
        error
      );

    }

  }

  return null;

}


/* =========================================================
   12. LOGIN STATE
========================================================= */

function showLoginScreen() {

  const login =
    byId("loginScreen");

  const app =
    byId("mainApp");


  if (login) {

    login.classList.remove(
      "hidden"
    );

  }


  if (app) {

    app.classList.add(
      "hidden"
    );

  }

}


function showMainApp() {

  const login =
    byId("loginScreen");

  const app =
    byId("mainApp");


  if (login) {

    login.classList.add(
      "hidden"
    );

  }


  if (app) {

    app.classList.remove(
      "hidden"
    );

  }


  updateCurrentUserUI();

  navigateTo(
    APP_CONFIG.defaultPage
  );

}


/* =========================================================
   13. LOGIN

   현재 GitHub Pages용 프로토타입 로그인.
   실제 보안 인증은 이후 서버/Firebase/Supabase 등을
   연결해야 함.
========================================================= */

function handleLogin(event) {

  event.preventDefault();


  const idInput =
    byId("loginId");

  const passwordInput =
    byId("loginPassword");

  const remember =
    byId("rememberLogin");

  const message =
    byId("loginMessage");


  const userId =
    idInput
      ?.value
      .trim();

  const password =
    passwordInput
      ?.value
      .trim();


  if (
    !userId ||
    !password
  ) {

    if (message) {

      message.textContent =
        "사용자 ID와 비밀번호를 입력하세요.";

    }

    return;

  }


  /*
     프로토타입 버전에서는
     입력값이 존재하면 로그인.

     비밀번호를 JS 코드에 고정 저장하지 않는다.
  */

  APP_STATE.currentUser = {

    id: userId,

    name: userId,

    role: "PERFORMANCE STAFF",

    loginAt:
      new Date().toISOString()

  };


  if (remember?.checked) {

    writeStorage(
      APP_CONFIG.storageKeys.session,
      APP_STATE.currentUser
    );

  }

  else {

    sessionStorage.setItem(
      APP_CONFIG.storageKeys.session,
      JSON.stringify(
        APP_STATE.currentUser
      )
    );

  }


  if (message) {

    message.textContent = "";

  }


  showMainApp();

}


/* =========================================================
   14. RESTORE LOGIN
========================================================= */

function restoreSession() {

  let session = null;


  try {

    const temporary =
      sessionStorage.getItem(
        APP_CONFIG.storageKeys.session
      );


    if (temporary) {

      session =
        JSON.parse(
          temporary
        );

    }

  }

  catch (error) {

    console.warn(error);

  }


  if (!session) {

    session =
      readStorage(
        APP_CONFIG.storageKeys.session,
        null
      );

  }


  if (session) {

    APP_STATE.currentUser =
      session;

    showMainApp();

    return true;

  }


  showLoginScreen();

  return false;

}


/* =========================================================
   15. LOGOUT
========================================================= */

function logout() {

  APP_STATE.currentUser =
    null;


  localStorage.removeItem(
    APP_CONFIG.storageKeys.session
  );


  sessionStorage.removeItem(
    APP_CONFIG.storageKeys.session
  );


  stopAnyActiveAnalysis();


  showLoginScreen();


  const password =
    byId("loginPassword");

  if (password) {

    password.value = "";

  }

}


/* =========================================================
   16. CURRENT USER UI
========================================================= */

function updateCurrentUserUI() {

  const name =
    byId("currentUserName");

  if (!name) {

    return;

  }


  name.textContent =
    APP_STATE.currentUser?.name ||
    "사용자";

}


/* =========================================================
   17. DASHBOARD
========================================================= */

function refreshDashboard() {

  const athletes =
    readStorage(
      APP_CONFIG.storageKeys.athletes,
      []
    );


  const analyses =
    readStorage(
      APP_CONFIG.storageKeys.analyses,
      []
    );


  const reports =
    readStorage(
      APP_CONFIG.storageKeys.reports,
      []
    );


  const today =
    getTodayKey();


  const todayAnalyses =
    analyses.filter(
      analysis => {

        if (!analysis.createdAt) {

          return false;

        }


        return (
          analysis.createdAt
            .slice(0, 10) ===
          today
        );

      }
    );


  setText(
    "statAthletes",
    athletes.length
  );


  setText(
    "statTodayAnalysis",
    todayAnalyses.length
  );


  setText(
    "statTotalAnalysis",
    analyses.length
  );


  setText(
    "statReports",
    reports.length
  );


  renderRecentAnalysis(
    analyses
  );


  renderPerformanceChart(
    analyses
  );

}


/* =========================================================
   18. SET TEXT
========================================================= */

function setText(id, value) {

  const element =
    byId(id);

  if (element) {

    element.textContent =
      String(value);

  }

}


/* =========================================================
   19. RECENT ANALYSIS
========================================================= */

function renderRecentAnalysis(
  analyses
) {

  const container =
    byId("recentAnalysisList");

  if (!container) {

    return;

  }


  if (
    !Array.isArray(analyses) ||
    analyses.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          분석 기록 없음
        </strong>

        <p>
          첫 번째 선수 분석을 시작하세요.
        </p>

      </div>

    `;

    return;

  }


  const recent =
    [...analyses]

      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )

      .slice(0, 5);


  container.innerHTML =
    recent.map(
      item => {

        const score =
          Number.isFinite(
            Number(item.score)
          )
            ? Number(item.score)
            : "-";


        return `

          <button
            class="recent-analysis-item"
            data-analysis-id="${escapeHTML(
              item.id || ""
            )}"
          >

            <div>

              <strong>
                ${escapeHTML(
                  item.athleteName ||
                  "선수"
                )}
              </strong>

              <span>
                ${escapeHTML(
                  item.sportName ||
                  item.sport ||
                  "종목"
                )}
              </span>

            </div>


            <div>

              <strong>
                ${score}
              </strong>

              <span>
                ${escapeHTML(
                  formatDateTime(
                    item.createdAt
                  )
                )}
              </span>

            </div>

          </button>

        `;

      }
    ).join("");

}


/* =========================================================
   20. PERFORMANCE CHART
========================================================= */

let performanceChartInstance =
  null;


function renderPerformanceChart(
  analyses
) {

  const canvas =
    byId("performanceChart");

  if (!canvas) {

    return;

  }


  if (
    typeof Chart ===
    "undefined"
  ) {

    return;

  }


  const recent =
    [...analyses]

      .filter(
        item =>
          Number.isFinite(
            Number(item.score)
          )
      )

      .sort(
        (a, b) =>
          new Date(
            a.createdAt || 0
          ) -
          new Date(
            b.createdAt || 0
          )
      )

      .slice(-10);


  const labels =
    recent.map(
      (_, index) =>
        `${index + 1}`
    );


  const values =
    recent.map(
      item =>
        Number(item.score)
    );


  if (
    performanceChartInstance
  ) {

    performanceChartInstance
      .destroy();

  }


  performanceChartInstance =
    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              label:
                "Performance",

              data: values,

              borderColor:
                "#51d2ff",

              backgroundColor:
                "rgba(81,210,255,0.08)",

              fill: true,

              tension: 0.35,

              pointRadius: 3,

              pointBackgroundColor:
                "#51d2ff"

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio:
            false,

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            x: {

              grid: {

                color:
                  "rgba(81,210,255,0.05)"

              },

              ticks: {

                color:
                  "#607887"

              }

            },


            y: {

              suggestedMin: 0,

              suggestedMax: 100,

              grid: {

                color:
                  "rgba(81,210,255,0.05)"

              },

              ticks: {

                color:
                  "#607887"

              }

            }

          }

        }

      }
    );

}


/* =========================================================
   21. ANALYSIS RECORDS
========================================================= */

function renderAnalysisRecords() {

  const container =
    byId("analysisRecords");

  if (!container) {

    return;

  }


  const analyses =
    readStorage(
      APP_CONFIG.storageKeys.analyses,
      []
    );


  if (
    analyses.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          저장된 분석 기록이 없습니다.
        </strong>

        <p>
          종목 분석을 완료하면
          여기에 기록이 저장됩니다.
        </p>

      </div>

    `;

    return;

  }


  const sorted =
    [...analyses].sort(
      (a, b) =>
        new Date(
          b.createdAt || 0
        ) -
        new Date(
          a.createdAt || 0
        )
    );


  container.innerHTML = `

    <div class="record-list">

      ${sorted.map(
        item => `

          <article class="record-card">

            <div>

              <span>
                ${escapeHTML(
                  item.sportName ||
                  item.sport ||
                  "SPORT"
                )}
              </span>

              <h3>
                ${escapeHTML(
                  item.athleteName ||
                  "선수"
                )}
              </h3>

              <p>
                ${escapeHTML(
                  item.eventName ||
                  item.event ||
                  ""
                )}
              </p>

            </div>


            <div>

              <strong>
                ${
                  item.score ??
                  "-"
                }
              </strong>

              <small>
                ${escapeHTML(
                  formatDateTime(
                    item.createdAt
                  )
                )}
              </small>

            </div>

          </article>

        `
      ).join("")}

    </div>

  `;

}


/* =========================================================
   22. SETTINGS
========================================================= */

function renderSettings() {

  const container =
    byId("settingsWorkspace");

  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="settings-content">

      <div class="settings-section">

        <span>
          SYSTEM
        </span>

        <h3>
          시스템 정보
        </h3>

        <div class="settings-row">

          <span>
            시스템
          </span>

          <strong>
            ${APP_CONFIG.systemName}
          </strong>

        </div>


        <div class="settings-row">

          <span>
            버전
          </span>

          <strong>
            ${APP_CONFIG.version}
          </strong>

        </div>


        <div class="settings-row">

          <span>
            기관
          </span>

          <strong>
            설천고
          </strong>

        </div>

      </div>


      <div class="settings-section">

        <span>
          DATA
        </span>

        <h3>
          로컬 데이터
        </h3>

        <p>
          현재 버전의 선수 및 분석 데이터는
          이 기기의 브라우저에 저장됩니다.
        </p>

      </div>

    </div>

  `;

}


/* =========================================================
   23. QUICK START
========================================================= */

function initializeQuickStart() {

  qsa("[data-go]").forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.go;

          navigateTo(target);

        }
      );

    }
  );


  qsa(
    '[data-action="live-analysis"]'
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          APP_STATE.analysisMode =
            "camera";

          navigateTo(
            "sports"
          );

        }
      );

    }
  );


  qsa(
    '[data-action="video-analysis"]'
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          APP_STATE.analysisMode =
            "video";

          navigateTo(
            "sports"
          );

        }
      );

    }
  );

}


/* =========================================================
   24. ANALYSIS MODE
========================================================= */

function initializeAnalysisModes() {

  qsa(
    ".analysis-mode"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          qsa(
            ".analysis-mode"
          ).forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          button.classList.add(
            "active"
          );


          APP_STATE.analysisMode =
            button.dataset.mode;


          callModuleFunction(
            "setAnalysisMode",
            APP_STATE.analysisMode
          );

        }
      );

    }
  );

}


/* =========================================================
   25. ANALYSIS DATA TAB
========================================================= */

function initializeAnalysisDataTabs() {

  qsa(
    ".analysis-data-tab"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          qsa(
            ".analysis-data-tab"
          ).forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          button.classList.add(
            "active"
          );


          APP_STATE.analysisTab =
            button.dataset.tab;


          callModuleFunction(
            "changeAnalysisDataTab",
            APP_STATE.analysisTab
          );

        }
      );

    }
  );

}


/* =========================================================
   26. ANALYSIS BOTTOM TAB
========================================================= */

function initializeAnalysisBottomTabs() {

  qsa(
    ".bottom-analysis-tab"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          qsa(
            ".bottom-analysis-tab"
          ).forEach(
            item =>
              item.classList.remove(
                "active"
              )
          );


          button.classList.add(
            "active"
          );


          APP_STATE.analysisView =
            button.dataset.analysisView;


          callModuleFunction(
            "changeAnalysisView",
            APP_STATE.analysisView
          );

        }
      );

    }
  );

}


/* =========================================================
   27. OPEN ANALYSIS WORKSPACE
========================================================= */

function openAnalysisWorkspace(
  sport,
  eventName = null
) {

  if (!sport) {

    return;

  }


  APP_STATE.selectedSport =
    sport;

  APP_STATE.selectedEvent =
    eventName;


  const sportName =
    typeof sport === "string"
      ? sport
      : (
          sport.name ||
          sport.nameKo ||
          "종목 분석"
        );


  setText(
    "analysisSportTitle",
    sportName
  );


  setText(
    "analysisEventName",
    eventName ||
    sportName
  );


  syncAnalysisModeButtons();


  navigateTo(
    "analysis"
  );


  callModuleFunction(
    "prepareSportAnalysis",
    sport,
    eventName
  );

}


/* =========================================================
   28. SYNC MODE BUTTON
========================================================= */

function syncAnalysisModeButtons() {

  qsa(
    ".analysis-mode"
  ).forEach(
    button => {

      button.classList.toggle(
        "active",
        button.dataset.mode ===
        APP_STATE.analysisMode
      );

    }
  );

}


/* =========================================================
   29. STOP ACTIVE ANALYSIS
========================================================= */

function stopAnyActiveAnalysis() {

  APP_STATE.analysisRunning =
    false;


  callModuleFunction(
    "stopCameraAnalysis"
  );


  callModuleFunction(
    "stopPoseAnalysis"
  );


  const camera =
    byId("cameraVideo");


  if (
    camera &&
    camera.srcObject
  ) {

    camera
      .srcObject
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );


    camera.srcObject =
      null;

  }

}


/* =========================================================
   30. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   31. NAV EVENTS
========================================================= */

function initializeNavigation() {

  qsa(
    ".nav-button"
  ).forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const page =
            button.dataset.page;

          if (!page) {

            return;

          }


          if (
            APP_STATE.currentPage ===
            "analysis"
          ) {

            stopAnyActiveAnalysis();

          }


          navigateTo(page);

        }
      );

    }
  );

}


/* =========================================================
   32. LOGIN EVENTS
========================================================= */

function initializeLogin() {

  const form =
    byId("loginForm");

  const logoutButton =
    byId("logoutButton");


  if (form) {

    form.addEventListener(
      "submit",
      handleLogin
    );

  }


  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      logout
    );

  }

}


/* =========================================================
   33. GLOBAL EVENTS
========================================================= */

function initializeGlobalEvents() {

  window.addEventListener(
    "beforeunload",
    () => {

      stopAnyActiveAnalysis();

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        qsa(".modal.open")
          .forEach(
            modal =>
              modal.classList.remove(
                "open"
              )
          );

      }

    }
  );

}


/* =========================================================
   34. SYSTEM TEST
========================================================= */

function runSystemCheck() {

  const requiredElements = [

    "loginScreen",

    "mainApp",

    "page-dashboard",

    "page-athletes",

    "page-sports",

    "page-analysis",

    "page-comparison",

    "page-records",

    "page-reports",

    "page-training",

    "page-settings"

  ];


  const missing =
    requiredElements.filter(
      id =>
        !byId(id)
    );


  if (
    missing.length > 0
  ) {

    console.warn(
      "누락된 UI:",
      missing
    );

    return false;

  }


  console.log(
    "%c설천고 PERFORMANCE SYSTEM READY",
    "color:#51d2ff;font-weight:bold;"
  );


  return true;

}


/* =========================================================
   35. INITIALIZE
========================================================= */

function initializeApp() {

  console.log(
    `${APP_CONFIG.name} ${APP_CONFIG.version}`
  );


  runSystemCheck();


  initializeLogin();

  initializeNavigation();

  initializeQuickStart();

  initializeAnalysisModes();

  initializeAnalysisDataTabs();

  initializeAnalysisBottomTabs();

  initializeGlobalEvents();


  /*
     다른 모듈들이 존재하면 초기화.
     아직 만들지 않았으면 그냥 넘어감.
  */

  callModuleFunction(
    "initializeAuth"
  );


  callModuleFunction(
    "initializeAthletes"
  );


  callModuleFunction(
    "initializeSports"
  );


  callModuleFunction(
    "initializeCamera"
  );


  callModuleFunction(
    "initializeVideoAnalysis"
  );


  callModuleFunction(
    "initializePoseAnalysis"
  );


  callModuleFunction(
    "initializeSportsAnalysis"
  );


  callModuleFunction(
    "initialize3DAnalysis"
  );


  callModuleFunction(
    "initializeComparison"
  );


  callModuleFunction(
    "initializeReports"
  );


  callModuleFunction(
    "initializeTraining"
  );


  restoreSession();

}


/* =========================================================
   36. DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}

else {

  initializeApp();

}


/* =========================================================
   37. GLOBAL ACCESS

   다른 JS 파일들이 사용할 공통 기능
========================================================= */

window.SeolcheonApp = {

  config:
    APP_CONFIG,

  state:
    APP_STATE,

  navigateTo,

  openAnalysisWorkspace,

  refreshDashboard,

  readStorage,

  writeStorage,

  formatDateTime,

  escapeHTML,

  stopAnyActiveAnalysis

};