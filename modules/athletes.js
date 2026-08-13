/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / ATHLETES.JS
   VERSION 1.0

   기능
   ---------------------------------------------------------
   - 선수 등록
   - 선수 수정
   - 선수 삭제
   - 선수 검색
   - 종목 필터
   - 선수 선택
   - 분석 기록 연결
   - 리포트 연결
========================================================= */

"use strict";


/* =========================================================
   01. STATE
========================================================= */

const AthleteManager = {

  selectedAthleteId: null,

  editingAthleteId: null,

  initialized: false

};


/* =========================================================
   02. INITIALIZE
========================================================= */

function initAthletes() {

  if (AthleteManager.initialized) {
    return;
  }

  AthleteManager.initialized = true;

  bindAthleteEvents();

  renderAthletes();

  updateAthleteSelectors();

}


/* =========================================================
   03. EVENT BINDING
========================================================= */

function bindAthleteEvents() {

  document.addEventListener(
    "click",
    handleAthleteClick
  );

  document.addEventListener(
    "input",
    handleAthleteInput
  );

  document.addEventListener(
    "change",
    handleAthleteChange
  );

}


/* =========================================================
   04. CLICK EVENT
========================================================= */

function handleAthleteClick(event) {

  const registerButton =
    event.target.closest(
      "[data-action='add-athlete']"
    );

  if (registerButton) {

    openAthleteModal();

    return;
  }


  const closeButton =
    event.target.closest(
      "[data-action='close-athlete-modal']"
    );

  if (closeButton) {

    closeAthleteModal();

    return;
  }


  const saveButton =
    event.target.closest(
      "[data-action='save-athlete']"
    );

  if (saveButton) {

    submitAthleteForm();

    return;
  }


  const athleteCard =
    event.target.closest(
      "[data-athlete-id]"
    );

  if (!athleteCard) {
    return;
  }


  const athleteId =
    athleteCard.dataset.athleteId;


  const editButton =
    event.target.closest(
      "[data-action='edit-athlete']"
    );

  if (editButton) {

    event.stopPropagation();

    editAthlete(
      athleteId
    );

    return;
  }


  const deleteButton =
    event.target.closest(
      "[data-action='delete-athlete']"
    );

  if (deleteButton) {

    event.stopPropagation();

    removeAthlete(
      athleteId
    );

    return;
  }


  const analysisButton =
    event.target.closest(
      "[data-action='athlete-analysis']"
    );

  if (analysisButton) {

    event.stopPropagation();

    startAthleteAnalysis(
      athleteId
    );

    return;
  }


  const reportButton =
    event.target.closest(
      "[data-action='athlete-report']"
    );

  if (reportButton) {

    event.stopPropagation();

    openAthleteReport(
      athleteId
    );

    return;
  }


  selectAthlete(
    athleteId
  );

}


/* =========================================================
   05. SEARCH INPUT
========================================================= */

function handleAthleteInput(event) {

  if (
    event.target.matches(
      "#athlete-search"
    )
  ) {

    renderAthletes();

  }

}


/* =========================================================
   06. FILTER
========================================================= */

function handleAthleteChange(event) {

  if (
    event.target.matches(
      "#athlete-sport-filter"
    )
  ) {

    renderAthletes();

  }

}


/* =========================================================
   07. OPEN MODAL
========================================================= */

function openAthleteModal(
  athlete = null
) {

  AthleteManager.editingAthleteId =
    athlete?.id || null;


  let modal =
    document.getElementById(
      "athlete-modal"
    );


  if (!modal) {

    modal =
      createAthleteModal();

    document.body.appendChild(
      modal
    );

  }


  const title =
    modal.querySelector(
      "[data-athlete-modal-title]"
    );


  if (title) {

    title.textContent =
      athlete
        ? "선수 정보 수정"
        : "선수 등록";

  }


  fillAthleteForm(
    athlete
  );


  modal.classList.add(
    "active"
  );


  modal.removeAttribute(
    "hidden"
  );

}


/* =========================================================
   08. CREATE MODAL
========================================================= */

function createAthleteModal() {

  const modal =
    document.createElement(
      "div"
    );


  modal.id =
    "athlete-modal";


  modal.className =
    "athlete-modal";


  modal.innerHTML = `

    <div class="athlete-modal-backdrop"
         data-action="close-athlete-modal">
    </div>

    <section class="athlete-modal-panel">

      <div class="athlete-modal-header">

        <div>

          <span class="section-kicker">
            ATHLETE MANAGEMENT
          </span>

          <h2 data-athlete-modal-title>
            선수 등록
          </h2>

        </div>

        <button
          type="button"
          class="athlete-modal-close"
          data-action="close-athlete-modal"
          aria-label="닫기"
        >
          ×
        </button>

      </div>


      <div class="athlete-form-grid">

        <label class="athlete-field">

          <span>선수 이름 *</span>

          <input
            id="athlete-name"
            type="text"
            placeholder="선수 이름"
            autocomplete="off"
          >

        </label>


        <label class="athlete-field">

          <span>학년</span>

          <select id="athlete-grade">

            <option value="">
              선택
            </option>

            <option value="1">
              1학년
            </option>

            <option value="2">
              2학년
            </option>

            <option value="3">
              3학년
            </option>

          </select>

        </label>


        <label class="athlete-field">

          <span>성별</span>

          <select id="athlete-gender">

            <option value="">
              선택
            </option>

            <option value="male">
              남
            </option>

            <option value="female">
              여
            </option>

          </select>

        </label>


        <label class="athlete-field">

          <span>주 종목 *</span>

          <select id="athlete-sport">

            <option value="">
              종목 선택
            </option>

          </select>

        </label>


        <label class="athlete-field">

          <span>세부 종목</span>

          <input
            id="athlete-event"
            type="text"
            placeholder="예: 스프린트 / 100m / 스내치"
          >

        </label>


        <label class="athlete-field">

          <span>선수 번호</span>

          <input
            id="athlete-number"
            type="text"
            placeholder="선택 입력"
          >

        </label>


        <label class="athlete-field">

          <span>신장</span>

          <div class="athlete-input-unit">

            <input
              id="athlete-height"
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
            >

            <span>cm</span>

          </div>

        </label>


        <label class="athlete-field">

          <span>체중</span>

          <div class="athlete-input-unit">

            <input
              id="athlete-weight"
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
            >

            <span>kg</span>

          </div>

        </label>


        <label class="
          athlete-field
          athlete-field-full
        ">

          <span>메모</span>

          <textarea
            id="athlete-note"
            rows="4"
            placeholder="선수 특성, 훈련 메모 등"
          ></textarea>

        </label>

      </div>


      <div
        id="athlete-form-message"
        class="athlete-form-message"
      ></div>


      <div class="athlete-modal-actions">

        <button
          type="button"
          class="secondary-button"
          data-action="close-athlete-modal"
        >
          취소
        </button>

        <button
          type="button"
          class="primary-button"
          data-action="save-athlete"
        >
          선수 저장
        </button>

      </div>

    </section>
  `;


  populateSportSelect(
    modal.querySelector(
      "#athlete-sport"
    )
  );


  return modal;

}


/* =========================================================
   09. SPORT SELECT
========================================================= */

function populateSportSelect(
  select
) {

  if (!select) {
    return;
  }


  const currentValue =
    select.value;


  let sports = [];


  /*
     sports.js의 구조가 조금 달라도
     최대한 대응하도록 처리
  */

  if (
    Array.isArray(
      window.SPORTS_DATABASE
    )
  ) {

    sports =
      window.SPORTS_DATABASE;

  }

  else if (
    window.SPORTS_DATABASE &&
    typeof window.SPORTS_DATABASE ===
      "object"
  ) {

    sports =
      Object.values(
        window.SPORTS_DATABASE
      ).flat();

  }

  else if (
    Array.isArray(
      window.SPORTS
    )
  ) {

    sports =
      window.SPORTS;

  }


  select.innerHTML = `

    <option value="">
      종목 선택
    </option>

  `;


  sports.forEach(
    sport => {

      if (
        !sport ||
        !sport.id
      ) {
        return;
      }


      const option =
        document.createElement(
          "option"
        );


      option.value =
        sport.id;


      option.textContent =
        sport.name ||
        sport.korean ||
        sport.title ||
        sport.id;


      select.appendChild(
        option
      );

    }
  );


  /*
     데이터베이스를 못 찾은 경우에도
     핵심 종목은 선택 가능하게 함
  */

  if (
    select.options.length === 1
  ) {

    const fallbackSports = [

      ["biathlon", "바이애슬론"],
      ["cross_country", "크로스컨트리"],
      ["speed_skating", "스피드스케이팅"],
      ["short_track", "쇼트트랙"],
      ["figure_skating", "피겨스케이팅"],
      ["alpine_ski", "알파인스키"],
      ["ski_jump", "스키점프"],
      ["snowboard", "스노보드"],
      ["skeleton", "스켈레톤"],
      ["bobsleigh", "봅슬레이"],
      ["luge", "루지"],

      ["athletics", "육상"],
      ["swimming", "수영"],
      ["cycling", "사이클"],
      ["weightlifting", "역도"],
      ["gymnastics", "체조"],
      ["rowing", "조정"],
      ["canoe", "카누"],
      ["triathlon", "트라이애슬론"],
      ["archery", "양궁"],
      ["fencing", "펜싱"],
      ["taekwondo", "태권도"],
      ["judo", "유도"],
      ["boxing", "복싱"],
      ["wrestling", "레슬링"],
      ["badminton", "배드민턴"],
      ["tennis", "테니스"],
      ["table_tennis", "탁구"],
      ["basketball", "농구"],
      ["volleyball", "배구"],
      ["football", "축구"],
      ["handball", "핸드볼"],
      ["baseball", "야구"],
      ["golf", "골프"]

    ];


    fallbackSports.forEach(
      ([id, name]) => {

        const option =
          document.createElement(
            "option"
          );

        option.value =
          id;

        option.textContent =
          name;

        select.appendChild(
          option
        );

      }
    );

  }


  select.value =
    currentValue;

}


/* =========================================================
   10. FILL FORM
========================================================= */

function fillAthleteForm(
  athlete
) {

  const get =
    id =>
      document.getElementById(id);


  const sportSelect =
    get("athlete-sport");


  populateSportSelect(
    sportSelect
  );


  get("athlete-name").value =
    athlete?.name || "";

  get("athlete-grade").value =
    athlete?.grade || "";

  get("athlete-gender").value =
    athlete?.gender || "";

  get("athlete-sport").value =
    athlete?.sportId || "";

  get("athlete-event").value =
    athlete?.event || "";

  get("athlete-number").value =
    athlete?.number || "";

  get("athlete-height").value =
    athlete?.height ?? "";

  get("athlete-weight").value =
    athlete?.weight ?? "";

  get("athlete-note").value =
    athlete?.note || "";


  showAthleteFormMessage("");

}


/* =========================================================
   11. READ FORM
========================================================= */

function readAthleteForm() {

  const value =
    id =>
      document
        .getElementById(id)
        ?.value
        ?.trim() || "";


  const height =
    Number(
      value("athlete-height")
    );


  const weight =
    Number(
      value("athlete-weight")
    );


  return {

    name:
      value("athlete-name"),

    grade:
      value("athlete-grade"),

    gender:
      value("athlete-gender"),

    sportId:
      value("athlete-sport"),

    event:
      value("athlete-event"),

    number:
      value("athlete-number"),

    height:
      Number.isFinite(height) &&
      height > 0
        ? height
        : null,

    weight:
      Number.isFinite(weight) &&
      weight > 0
        ? weight
        : null,

    note:
      value("athlete-note")

  };

}


/* =========================================================
   12. VALIDATE
========================================================= */

function validateAthlete(
  athlete
) {

  if (!athlete.name) {

    return {
      valid: false,
      message: "선수 이름을 입력해주세요."
    };

  }


  if (!athlete.sportId) {

    return {
      valid: false,
      message: "주 종목을 선택해주세요."
    };

  }


  return {
    valid: true,
    message: ""
  };

}


/* =========================================================
   13. SUBMIT
========================================================= */

function submitAthleteForm() {

  if (
    typeof getAthletes !==
      "function" ||
    typeof saveAthletes !==
      "function"
  ) {

    showAthleteFormMessage(
      "storage.js가 연결되지 않았습니다.",
      "error"
    );

    console.error(
      "[ATHLETES] storage.js를 먼저 불러와야 합니다."
    );

    return;
  }


  const formData =
    readAthleteForm();


  const validation =
    validateAthlete(
      formData
    );


  if (!validation.valid) {

    showAthleteFormMessage(
      validation.message,
      "error"
    );

    return;
  }


  const athletes =
    getAthletes();


  const now =
    new Date()
      .toISOString();


  if (
    AthleteManager.editingAthleteId
  ) {

    const index =
      athletes.findIndex(
        athlete =>
          athlete.id ===
          AthleteManager.editingAthleteId
      );


    if (index === -1) {

      showAthleteFormMessage(
        "수정할 선수를 찾을 수 없습니다.",
        "error"
      );

      return;
    }


    athletes[index] = {

      ...athletes[index],

      ...formData,

      updatedAt:
        now

    };

  }

  else {

    const athlete = {

      id:
        typeof createStorageId ===
        "function"
          ? createStorageId(
              "athlete"
            )
          : (
              "athlete_" +
              Date.now()
            ),

      ...formData,

      createdAt:
        now,

      updatedAt:
        now

    };


    athletes.unshift(
      athlete
    );

  }


  const saved =
    saveAthletes(
      athletes
    );


  if (!saved) {

    showAthleteFormMessage(
      "선수 저장에 실패했습니다.",
      "error"
    );

    return;
  }


  closeAthleteModal();

  renderAthletes();

  updateAthleteSelectors();

  updateAthleteDashboardCount();

}


/* =========================================================
   14. CLOSE MODAL
========================================================= */

function closeAthleteModal() {

  const modal =
    document.getElementById(
      "athlete-modal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );


  modal.setAttribute(
    "hidden",
    ""
  );


  AthleteManager.editingAthleteId =
    null;

}


/* =========================================================
   15. MESSAGE
========================================================= */

function showAthleteFormMessage(
  message,
  type = ""
) {

  const element =
    document.getElementById(
      "athlete-form-message"
    );


  if (!element) {
    return;
  }


  element.textContent =
    message;


  element.dataset.type =
    type;

}


/* =========================================================
   16. EDIT
========================================================= */

function editAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  openAthleteModal(
    athlete
  );

}


/* =========================================================
   17. DELETE
========================================================= */

function removeAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  const confirmed =
    window.confirm(
      `${athlete.name} 선수를 삭제할까요?`
    );


  if (!confirmed) {
    return;
  }


  const athletes =
    getAthletes()
      .filter(
        item =>
          item.id !== athleteId
      );


  saveAthletes(
    athletes
  );


  if (
    AthleteManager
      .selectedAthleteId ===
    athleteId
  ) {

    AthleteManager
      .selectedAthleteId =
      null;

  }


  renderAthletes();

  updateAthleteSelectors();

  updateAthleteDashboardCount();

}


/* =========================================================
   18. GET ATHLETE
========================================================= */

function getAthleteById(
  athleteId
) {

  if (
    typeof getAthletes !==
    "function"
  ) {
    return null;
  }


  return (
    getAthletes()
      .find(
        athlete =>
          athlete.id ===
          athleteId
      ) || null
  );

}


/* =========================================================
   19. SELECT ATHLETE
========================================================= */

function selectAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  AthleteManager.selectedAthleteId =
    athleteId;


  /*
     분석 화면 등 다른 모듈에서도
     현재 선수 확인 가능
  */

  window.currentAthlete =
    athlete;


  renderAthletes();


  document.dispatchEvent(
    new CustomEvent(
      "athlete:selected",
      {
        detail: {
          athlete
        }
      }
    )
  );

}


/* =========================================================
   20. GET SELECTED ATHLETE
========================================================= */

function getSelectedAthlete() {

  if (
    !AthleteManager
      .selectedAthleteId
  ) {

    return null;

  }


  return getAthleteById(
    AthleteManager
      .selectedAthleteId
  );

}


/* =========================================================
   21. START ANALYSIS
========================================================= */

function startAthleteAnalysis(
  athleteId
) {

  selectAthlete(
    athleteId
  );


  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  /*
     app.js의 페이지 이동 함수가 있으면 사용
  */

  if (
    typeof window.navigateTo ===
    "function"
  ) {

    window.navigateTo(
      "analysis"
    );

  }

  else if (
    typeof window.showPage ===
    "function"
  ) {

    window.showPage(
      "analysis"
    );

  }


  document.dispatchEvent(
    new CustomEvent(
      "athlete:start-analysis",
      {
        detail: {
          athlete
        }
      }
    )
  );

}


/* =========================================================
   22. OPEN REPORT
========================================================= */

function openAthleteReport(
  athleteId
) {

  selectAthlete(
    athleteId
  );


  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  if (
    typeof window.navigateTo ===
    "function"
  ) {

    window.navigateTo(
      "reports"
    );

  }

  else if (
    typeof window.showPage ===
    "function"
  ) {

    window.showPage(
      "reports"
    );

  }


  document.dispatchEvent(
    new CustomEvent(
      "athlete:open-report",
      {
        detail: {
          athlete
        }
      }
    )
  );

}


/* =========================================================
   23. SPORT NAME
========================================================= */

function getAthleteSportName(
  sportId
) {

  if (
    typeof window.getSportById ===
    "function"
  ) {

    const sport =
      window.getSportById(
        sportId
      );


    if (sport) {

      return (
        sport.name ||
        sport.korean ||
        sport.title ||
        sportId
      );

    }

  }


  const fallback = {

    biathlon:
      "바이애슬론",

    cross_country:
      "크로스컨트리",

    speed_skating:
      "스피드스케이팅",

    short_track:
      "쇼트트랙",

    skeleton:
      "스켈레톤",

    athletics:
      "육상",

    swimming:
      "수영",

    cycling:
      "사이클",

    weightlifting:
      "역도",

    basketball:
      "농구",

    football:
      "축구",

    volleyball:
      "배구"

  };


  return (
    fallback[sportId] ||
    sportId ||
    "-"
  );

}


/* =========================================================
   24. FILTER ATHLETES
========================================================= */

function getFilteredAthletes() {

  let athletes =
    typeof getAthletes ===
      "function"
        ? getAthletes()
        : [];


  const search =
    document
      .getElementById(
        "athlete-search"
      )
      ?.value
      ?.trim()
      ?.toLowerCase() || "";


  const sportFilter =
    document
      .getElementById(
        "athlete-sport-filter"
      )
      ?.value || "";


  if (search) {

    athletes =
      athletes.filter(
        athlete => {

          const text = [

            athlete.name,

            athlete.event,

            athlete.number,

            getAthleteSportName(
              athlete.sportId
            )

          ]
            .join(" ")
            .toLowerCase();


          return text.includes(
            search
          );

        }
      );

  }


  if (sportFilter) {

    athletes =
      athletes.filter(
        athlete =>
          athlete.sportId ===
          sportFilter
      );

  }


  return athletes;

}


/* =========================================================
   25. FIND LIST CONTAINER
========================================================= */

function findAthleteListContainer() {

  return (
    document.getElementById(
      "athlete-list"
    ) ||

    document.querySelector(
      "[data-athlete-list]"
    ) ||

    document.querySelector(
      ".athlete-list"
    )
  );

}


/* =========================================================
   26. RENDER ATHLETES
========================================================= */

function renderAthletes() {

  const container =
    findAthleteListContainer();


  /*
     현재 index.html에 선수 목록 영역이
     아직 없을 수도 있으므로 오류 발생 방지
  */

  if (!container) {

    updateAthleteDashboardCount();

    return;
  }


  const athletes =
    getFilteredAthletes();


  if (
    athletes.length === 0
  ) {

    container.innerHTML = `

      <div class="athlete-empty">

        <div class="athlete-empty-icon">
          ◎
        </div>

        <strong>
          등록된 선수가 없습니다
        </strong>

        <p>
          선수 등록 버튼을 눌러
          첫 선수를 추가하세요.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    athletes
      .map(
        createAthleteCardHTML
      )
      .join("");

}


/* =========================================================
   27. ATHLETE CARD
========================================================= */

function createAthleteCardHTML(
  athlete
) {

  const selected =
    AthleteManager
      .selectedAthleteId ===
    athlete.id;


  const analyses =
    typeof getAthleteAnalyses ===
      "function"
        ? getAthleteAnalyses(
            athlete.id
          )
        : [];


  const reports =
    typeof getAthleteReports ===
      "function"
        ? getAthleteReports(
            athlete.id
          )
        : [];


  const grade =
    athlete.grade
      ? `${athlete.grade}학년`
      : "-";


  return `

    <article
      class="
        athlete-card
        ${selected ? "selected" : ""}
      "
      data-athlete-id="${escapeHTML(
        athlete.id
      )}"
    >

      <div class="athlete-card-top">

        <div class="athlete-avatar">

          ${escapeHTML(
            athlete.name
              ?.charAt(0) ||
            "A"
          )}

        </div>


        <div class="athlete-main-info">

          <span class="athlete-sport-label">

            ${escapeHTML(
              getAthleteSportName(
                athlete.sportId
              )
            )}

          </span>

          <h3>

            ${escapeHTML(
              athlete.name
            )}

          </h3>

          <p>

            ${escapeHTML(
              grade
            )}

            ${
              athlete.event
                ? " · " +
                  escapeHTML(
                    athlete.event
                  )
                : ""
            }

          </p>

        </div>

      </div>


      <div class="athlete-card-stats">

        <div>

          <span>
            ANALYSIS
          </span>

          <strong>
            ${analyses.length}
          </strong>

        </div>


        <div>

          <span>
            REPORT
          </span>

          <strong>
            ${reports.length}
          </strong>

        </div>


        <div>

          <span>
            HEIGHT
          </span>

          <strong>

            ${
              athlete.height
                ? escapeHTML(
                    athlete.height
                  ) + " cm"
                : "-"
            }

          </strong>

        </div>

      </div>


      <div class="athlete-card-actions">

        <button
          type="button"
          data-action="athlete-analysis"
        >
          자세분석
        </button>

        <button
          type="button"
          data-action="athlete-report"
        >
          리포트
        </button>

        <button
          type="button"
          data-action="edit-athlete"
        >
          수정
        </button>

        <button
          type="button"
          data-action="delete-athlete"
        >
          삭제
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   28. UPDATE SELECTORS

   자세분석 화면 등에 있는
   선수 선택 select 자동 갱신
========================================================= */

function updateAthleteSelectors() {

  const selectors =
    document.querySelectorAll(
      "[data-athlete-select]"
    );


  if (
    selectors.length === 0
  ) {
    return;
  }


  const athletes =
    typeof getAthletes ===
      "function"
        ? getAthletes()
        : [];


  selectors.forEach(
    select => {

      const current =
        select.value;


      select.innerHTML = `

        <option value="">
          선수 선택
        </option>

      `;


      athletes.forEach(
        athlete => {

          const option =
            document.createElement(
              "option"
            );


          option.value =
            athlete.id;


          option.textContent =
            `${athlete.name} · ${getAthleteSportName(
              athlete.sportId
            )}`;


          select.appendChild(
            option
          );

      });


      if (
        athletes.some(
          athlete =>
            athlete.id === current
        )
      ) {

        select.value =
          current;

      }

    }
  );

}


/* =========================================================
   29. DASHBOARD COUNT
========================================================= */

function updateAthleteDashboardCount() {

  const athletes =
    typeof getAthletes ===
      "function"
        ? getAthletes()
        : [];


  const targets =
    document.querySelectorAll(
      [
        "[data-athlete-count]",
        "#registered-athletes-count",
        "#athlete-count"
      ].join(",")
    );


  targets.forEach(
    element => {

      element.textContent =
        athletes.length;

    }
  );

}


/* =========================================================
   30. ESCAPE HTML
========================================================= */

function escapeHTML(
  value
) {

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
   31. AUTO INIT
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initAthletes
  );

}

else {

  initAthletes();

}


/* =========================================================
   32. GLOBAL ACCESS
========================================================= */

window.AthleteManager =
  AthleteManager;

window.initAthletes =
  initAthletes;

window.openAthleteModal =
  openAthleteModal;

window.closeAthleteModal =
  closeAthleteModal;

window.submitAthleteForm =
  submitAthleteForm;

window.renderAthletes =
  renderAthletes;

window.getAthleteById =
  getAthleteById;

window.selectAthlete =
  selectAthlete;

window.getSelectedAthlete =
  getSelectedAthlete;

window.startAthleteAnalysis =
  startAthleteAnalysis;

window.openAthleteReport =
  openAthleteReport;

window.updateAthleteSelectors =
  updateAthleteSelectors;