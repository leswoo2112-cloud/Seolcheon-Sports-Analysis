/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / ATHLETE-MANAGER.JS

   ATHLETE MANAGEMENT SYSTEM

   기능
   - 선수 등록
   - 선수 수정
   - 선수 삭제
   - LocalStorage 저장
   - 선수 검색
   - 종목 필터
   - 선수 선택
   - 자세분석 연결
   - 선수 리포트 연결
   - 최근 분석 기록 연결
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const ATHLETE_MANAGER_CONFIG = {

  storageKey:
    "seolcheon_athletes",

  selectedKey:
    "seolcheon_selected_athlete",

  version:
    "1.0.0"

};


/* =========================================================
   02. STATE
========================================================= */

const ATHLETE_MANAGER_STATE = {

  initialized:
    false,

  athletes:
    [],

  selectedAthlete:
    null,

  editingId:
    null,

  search:
    "",

  sportFilter:
    "all"

};


/* =========================================================
   03. ELEMENT
========================================================= */

function athleteElement(
  selector
) {

  return document.querySelector(
    selector
  );

}


function athleteElements(
  selector
) {

  return [
    ...document.querySelectorAll(
      selector
    )
  ];

}


/* =========================================================
   04. SAFE TEXT
========================================================= */

function safeAthleteText(
  value
) {

  return String(
    value ?? ""
  )
    .trim();

}


/* =========================================================
   05. ESCAPE HTML
========================================================= */

function escapeAthleteHTML(
  value
) {

  return safeAthleteText(
    value
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
   06. ID
========================================================= */

function createAthleteId() {

  return (
    "ATH-" +
    Date.now()
      .toString(36)
      .toUpperCase() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()
  );

}


/* =========================================================
   07. EMPTY ATHLETE
========================================================= */

function createEmptyAthlete() {

  return {

    id:
      createAthleteId(),

    name:
      "",

    school:
      "설천고",

    grade:
      "",

    gender:
      "",

    birthDate:
      "",

    season:
      "",

    sport:
      "",

    sportName:
      "",

    event:
      "",

    position:
      "",

    height:
      "",

    weight:
      "",

    career:
      "",

    team:
      "설천고",

    number:
      "",

    memo:
      "",

    createdAt:
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString()

  };

}


/* =========================================================
   08. LOAD
========================================================= */

function loadAthletes() {

  try {

    const raw =
      localStorage.getItem(
        ATHLETE_MANAGER_CONFIG
          .storageKey
      );


    if (!raw) {

      ATHLETE_MANAGER_STATE
        .athletes = [];

      return [];

    }


    const data =
      JSON.parse(
        raw
      );


    ATHLETE_MANAGER_STATE
      .athletes =
        Array.isArray(
          data
        )
          ? data
          : [];


    return ATHLETE_MANAGER_STATE
      .athletes;

  }

  catch (error) {

    console.error(
      "[SEOLCHEON] Athlete load error:",
      error
    );


    ATHLETE_MANAGER_STATE
      .athletes = [];


    return [];

  }

}


/* =========================================================
   09. SAVE ALL
========================================================= */

function saveAthletes() {

  try {

    localStorage.setItem(

      ATHLETE_MANAGER_CONFIG
        .storageKey,

      JSON.stringify(
        ATHLETE_MANAGER_STATE
          .athletes
      )

    );


    return true;

  }

  catch (error) {

    console.error(
      "[SEOLCHEON] Athlete save error:",
      error
    );


    showAthleteMessage(
      "선수 정보를 저장하지 못했습니다.",
      "error"
    );


    return false;

  }

}


/* =========================================================
   10. MESSAGE
========================================================= */

function showAthleteMessage(
  message,
  type = "info"
) {

  const target =
    athleteElement(
      "[data-athlete-message]"
    );


  if (target) {

    target.textContent =
      message;

    target.dataset.type =
      type;

  }


  console.log(
    `[SEOLCHEON ATHLETE] ${message}`
  );

}


/* =========================================================
   11. GET FORM
========================================================= */

function getAthleteForm() {

  return (
    athleteElement(
      "[data-athlete-form]"
    ) ||
    athleteElement(
      "#athleteForm"
    )
  );

}


/* =========================================================
   12. FORM VALUE
========================================================= */

function getAthleteField(
  name
) {

  const form =
    getAthleteForm();


  if (!form) {

    return "";

  }


  const input =
    form.querySelector(
      `[name="${name}"]`
    );


  return input
    ? safeAthleteText(
        input.value
      )
    : "";

}


/* =========================================================
   13. READ FORM
========================================================= */

function readAthleteForm() {

  const athlete =
    createEmptyAthlete();


  athlete.name =
    getAthleteField(
      "name"
    );

  athlete.school =
    getAthleteField(
      "school"
    ) ||
    "설천고";

  athlete.grade =
    getAthleteField(
      "grade"
    );

  athlete.gender =
    getAthleteField(
      "gender"
    );

  athlete.birthDate =
    getAthleteField(
      "birthDate"
    );

  athlete.season =
    getAthleteField(
      "season"
    );

  athlete.sport =
    getAthleteField(
      "sport"
    );

  athlete.sportName =
    getAthleteField(
      "sportName"
    );

  athlete.event =
    getAthleteField(
      "event"
    );

  athlete.position =
    getAthleteField(
      "position"
    );

  athlete.height =
    getAthleteField(
      "height"
    );

  athlete.weight =
    getAthleteField(
      "weight"
    );

  athlete.career =
    getAthleteField(
      "career"
    );

  athlete.team =
    getAthleteField(
      "team"
    ) ||
    "설천고";

  athlete.number =
    getAthleteField(
      "number"
    );

  athlete.memo =
    getAthleteField(
      "memo"
    );


  return athlete;

}


/* =========================================================
   14. VALIDATE
========================================================= */

function validateAthlete(
  athlete
) {

  if (
    !athlete.name
  ) {

    return {
      valid:
        false,

      message:
        "선수 이름을 입력해주세요."
    };

  }


  if (
    !athlete.sport
  ) {

    return {
      valid:
        false,

      message:
        "선수 종목을 선택해주세요."
    };

  }


  return {

    valid:
      true,

    message:
      ""

  };

}


/* =========================================================
   15. REGISTER
========================================================= */

function registerAthlete(
  event
) {

  if (
    event &&
    typeof event.preventDefault ===
      "function"
  ) {

    event.preventDefault();

  }


  const athlete =
    readAthleteForm();


  const validation =
    validateAthlete(
      athlete
    );


  if (
    !validation.valid
  ) {

    showAthleteMessage(
      validation.message,
      "error"
    );

    return null;

  }


  /* 수정 모드 */

  if (
    ATHLETE_MANAGER_STATE
      .editingId
  ) {

    return updateAthleteFromForm(
      athlete
    );

  }


  ATHLETE_MANAGER_STATE
    .athletes
    .unshift(
      athlete
    );


  const saved =
    saveAthletes();


  if (!saved) {

    return null;

  }


  selectAthlete(
    athlete.id
  );


  resetAthleteForm();


  renderAthleteList();

  updateAthleteStatistics();


  showAthleteMessage(
    `${athlete.name} 선수 등록 완료`,
    "success"
  );


  dispatchAthleteEvent(
    "athlete-created",
    {
      athlete
    }
  );


  return athlete;

}


/* =========================================================
   16. GET BY ID
========================================================= */

function getAthleteById(
  id
) {

  return (
    ATHLETE_MANAGER_STATE
      .athletes
      .find(
        athlete =>
          athlete.id === id
      ) ||
    null
  );

}


/* =========================================================
   17. SELECT
========================================================= */

function selectAthlete(
  id
) {

  const athlete =
    typeof id ===
      "object"
      ? id
      : getAthleteById(
          id
        );


  if (!athlete) {

    return null;

  }


  ATHLETE_MANAGER_STATE
    .selectedAthlete =
      athlete;


  try {

    localStorage.setItem(

      ATHLETE_MANAGER_CONFIG
        .selectedKey,

      athlete.id

    );

  }

  catch (error) {

    console.warn(
      error
    );

  }


  athleteElements(
    "[data-athlete-card]"
  )
  .forEach(
    card => {

      card.classList.toggle(

        "selected",

        card.dataset
          .athleteId ===
          athlete.id

      );

    }
  );


  updateSelectedAthleteUI(
    athlete
  );


  /*
     분석 컨트롤러 연결
  */

  if (
    window.SeolcheonAnalysisController &&
    typeof window
      .SeolcheonAnalysisController
      .athlete ===
      "function"
  ) {

    window
      .SeolcheonAnalysisController
      .athlete(
        athlete
      );

  }


  dispatchAthleteEvent(
    "athlete-selected",
    {
      athlete
    }
  );


  return athlete;

}


/* =========================================================
   18. SELECTED ATHLETE UI
========================================================= */

function updateSelectedAthleteUI(
  athlete
) {

  athleteElements(
    "[data-selected-athlete-name]"
  )
  .forEach(
    element => {

      element.textContent =
        athlete.name ||
        "선수";

    }
  );


  athleteElements(
    "[data-selected-athlete-sport]"
  )
  .forEach(
    element => {

      element.textContent =
        athlete.sportName ||
        athlete.sport ||
        "-";

    }
  );


  athleteElements(
    "[data-selected-athlete-grade]"
  )
  .forEach(
    element => {

      element.textContent =
        athlete.grade ||
        "-";

    }
  );

}


/* =========================================================
   19. RESTORE SELECTED
========================================================= */

function restoreSelectedAthlete() {

  try {

    const id =
      localStorage.getItem(
        ATHLETE_MANAGER_CONFIG
          .selectedKey
      );


    if (!id) {
      return null;
    }


    return selectAthlete(
      id
    );

  }

  catch (error) {

    return null;

  }

}


/* =========================================================
   20. EDIT
========================================================= */

function editAthlete(
  id
) {

  const athlete =
    getAthleteById(
      id
    );


  if (!athlete) {

    return;

  }


  const form =
    getAthleteForm();


  if (!form) {

    return;

  }


  ATHLETE_MANAGER_STATE
    .editingId =
      athlete.id;


  const fields = [

    "name",
    "school",
    "grade",
    "gender",
    "birthDate",
    "season",
    "sport",
    "sportName",
    "event",
    "position",
    "height",
    "weight",
    "career",
    "team",
    "number",
    "memo"

  ];


  fields.forEach(
    field => {

      const input =
        form.querySelector(
          `[name="${field}"]`
        );


      if (input) {

        input.value =
          athlete[field] ??
          "";

      }

    }
  );


  const button =
    form.querySelector(
      "[data-athlete-submit]"
    );


  if (button) {

    button.textContent =
      "선수 정보 수정";

  }


  showAthleteMessage(
    `${athlete.name} 선수 정보를 수정 중입니다.`,
    "info"
  );


  form.scrollIntoView({
    behavior:
      "smooth",

    block:
      "start"
  });

}


/* =========================================================
   21. UPDATE
========================================================= */

function updateAthleteFromForm(
  formData
) {

  const id =
    ATHLETE_MANAGER_STATE
      .editingId;


  const athlete =
    getAthleteById(
      id
    );


  if (!athlete) {

    return null;

  }


  const validation =
    validateAthlete(
      formData
    );


  if (
    !validation.valid
  ) {

    showAthleteMessage(
      validation.message,
      "error"
    );

    return null;

  }


  const preserved = {

    id:
      athlete.id,

    createdAt:
      athlete.createdAt

  };


  Object.assign(
    athlete,
    formData,
    preserved,
    {
      updatedAt:
        new Date()
          .toISOString()
    }
  );


  saveAthletes();


  ATHLETE_MANAGER_STATE
    .editingId =
      null;


  selectAthlete(
    athlete.id
  );


  resetAthleteForm();

  renderAthleteList();

  updateAthleteStatistics();


  showAthleteMessage(
    `${athlete.name} 선수 정보 수정 완료`,
    "success"
  );


  dispatchAthleteEvent(
    "athlete-updated",
    {
      athlete
    }
  );


  return athlete;

}


/* =========================================================
   22. DELETE
========================================================= */

function deleteAthlete(
  id
) {

  const athlete =
    getAthleteById(
      id
    );


  if (!athlete) {

    return false;

  }


  const confirmed =
    window.confirm(
      `${athlete.name} 선수 정보를 삭제할까요?`
    );


  if (!confirmed) {

    return false;

  }


  ATHLETE_MANAGER_STATE
    .athletes =
      ATHLETE_MANAGER_STATE
        .athletes
        .filter(
          item =>
            item.id !== id
        );


  if (
    ATHLETE_MANAGER_STATE
      .selectedAthlete
      ?.id === id
  ) {

    ATHLETE_MANAGER_STATE
      .selectedAthlete =
        null;


    localStorage.removeItem(
      ATHLETE_MANAGER_CONFIG
        .selectedKey
    );

  }


  saveAthletes();

  renderAthleteList();

  updateAthleteStatistics();


  showAthleteMessage(
    `${athlete.name} 선수 정보가 삭제되었습니다.`,
    "success"
  );


  dispatchAthleteEvent(
    "athlete-deleted",
    {
      athlete
    }
  );


  return true;

}


/* =========================================================
   23. RESET FORM
========================================================= */

function resetAthleteForm() {

  const form =
    getAthleteForm();


  if (!form) {

    return;

  }


  form.reset();


  ATHLETE_MANAGER_STATE
    .editingId =
      null;


  const school =
    form.querySelector(
      '[name="school"]'
    );


  if (school) {

    school.value =
      "설천고";

  }


  const team =
    form.querySelector(
      '[name="team"]'
    );


  if (team) {

    team.value =
      "설천고";

  }


  const button =
    form.querySelector(
      "[data-athlete-submit]"
    );


  if (button) {

    button.textContent =
      "선수 등록";

  }

}


/* =========================================================
   24. SEARCH
========================================================= */

function setAthleteSearch(
  keyword
) {

  ATHLETE_MANAGER_STATE
    .search =
      safeAthleteText(
        keyword
      )
      .toLowerCase();


  renderAthleteList();

}


/* =========================================================
   25. SPORT FILTER
========================================================= */

function setAthleteSportFilter(
  sport
) {

  ATHLETE_MANAGER_STATE
    .sportFilter =
      sport ||
      "all";


  renderAthleteList();

}


/* =========================================================
   26. FILTERED ATHLETES
========================================================= */

function getFilteredAthletes() {

  const keyword =
    ATHLETE_MANAGER_STATE
      .search;


  const sport =
    ATHLETE_MANAGER_STATE
      .sportFilter;


  return ATHLETE_MANAGER_STATE
    .athletes
    .filter(
      athlete => {

        const text = [

          athlete.name,
          athlete.school,
          athlete.grade,
          athlete.sport,
          athlete.sportName,
          athlete.event,
          athlete.team

        ]
        .join(" ")
        .toLowerCase();


        const searchMatch =
          !keyword ||
          text.includes(
            keyword
          );


        const sportMatch =
          sport ===
            "all" ||
          athlete.sport ===
            sport;


        return (
          searchMatch &&
          sportMatch
        );

      }
    );

}


/* =========================================================
   27. ANALYSIS COUNT
========================================================= */

function getAthleteAnalysisCount(
  athleteId
) {

  if (
    !window.SeolcheonAnalysisResult ||
    typeof window
      .SeolcheonAnalysisResult
      .athleteHistory !==
      "function"
  ) {

    return 0;

  }


  return window
    .SeolcheonAnalysisResult
    .athleteHistory(
      athleteId
    )
    .length;

}


/* =========================================================
   28. LAST ANALYSIS
========================================================= */

function getAthleteLastAnalysis(
  athleteId
) {

  if (
    !window.SeolcheonAnalysisResult
  ) {

    return null;

  }


  const history =
    window
      .SeolcheonAnalysisResult
      .athleteHistory(
        athleteId
      );


  return history[0] ||
    null;

}


/* =========================================================
   29. CARD
========================================================= */

function createAthleteCardHTML(
  athlete
) {

  const analysisCount =
    getAthleteAnalysisCount(
      athlete.id
    );


  const last =
    getAthleteLastAnalysis(
      athlete.id
    );


  const score =
    last?.scores?.overall ??
    "-";


  const selected =
    ATHLETE_MANAGER_STATE
      .selectedAthlete
      ?.id === athlete.id;


  return `

    <article
      class="athlete-card ${selected ? "selected" : ""}"
      data-athlete-card
      data-athlete-id="${escapeAthleteHTML(athlete.id)}"
    >

      <button
        type="button"
        class="athlete-card-main"
        data-athlete-select="${escapeAthleteHTML(athlete.id)}"
      >

        <div class="athlete-avatar">
          ${escapeAthleteHTML(
            athlete.name
              ?.slice(0, 1) ||
            "선"
          )}
        </div>

        <div class="athlete-card-info">

          <strong>
            ${escapeAthleteHTML(
              athlete.name
            )}
          </strong>

          <span>
            ${escapeAthleteHTML(
              athlete.school ||
              "설천고"
            )}
            ·
            ${escapeAthleteHTML(
              athlete.grade ||
              "-"
            )}
          </span>

          <span>
            ${escapeAthleteHTML(
              athlete.sportName ||
              athlete.sport ||
              "-"
            )}
            ${
              athlete.event
                ? " · " +
                  escapeAthleteHTML(
                    athlete.event
                  )
                : ""
            }
          </span>

        </div>

        <div class="athlete-card-score">

          <small>
            최근 점수
          </small>

          <strong>
            ${escapeAthleteHTML(
              score
            )}
          </strong>

        </div>

      </button>


      <div class="athlete-card-meta">

        <span>
          분석 ${analysisCount}회
        </span>

      </div>


      <div class="athlete-card-actions">

        <button
          type="button"
          data-athlete-analysis="${escapeAthleteHTML(athlete.id)}"
        >
          자세분석
        </button>

        <button
          type="button"
          data-athlete-report="${escapeAthleteHTML(athlete.id)}"
        >
          리포트
        </button>

        <button
          type="button"
          data-athlete-edit="${escapeAthleteHTML(athlete.id)}"
        >
          수정
        </button>

        <button
          type="button"
          data-athlete-delete="${escapeAthleteHTML(athlete.id)}"
        >
          삭제
        </button>

      </div>

    </article>

  `;

}


/* =========================================================
   30. RENDER
========================================================= */

function renderAthleteList() {

  const container =
    athleteElement(
      "[data-athlete-list]"
    );


  if (!container) {

    return;

  }


  const athletes =
    getFilteredAthletes();


  if (
    athletes.length ===
    0
  ) {

    container.innerHTML = `

      <div class="empty-state">

        <strong>
          등록된 선수가 없습니다.
        </strong>

        <p>
          선수 등록 후 자세분석을 시작할 수 있습니다.
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


  bindRenderedAthleteButtons();

}


/* =========================================================
   31. RENDERED BUTTONS
========================================================= */

function bindRenderedAthleteButtons() {

  athleteElements(
    "[data-athlete-select]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectAthlete(
            button.dataset
              .athleteSelect
          );

        }
      );

    }
  );


  athleteElements(
    "[data-athlete-analysis]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          openAthleteAnalysis(
            button.dataset
              .athleteAnalysis
          );

        }
      );

    }
  );


  athleteElements(
    "[data-athlete-report]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          openAthleteReport(
            button.dataset
              .athleteReport
          );

        }
      );

    }
  );


  athleteElements(
    "[data-athlete-edit]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          editAthlete(
            button.dataset
              .athleteEdit
          );

        }
      );

    }
  );


  athleteElements(
    "[data-athlete-delete]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          deleteAthlete(
            button.dataset
              .athleteDelete
          );

        }
      );

    }
  );

}


/* =========================================================
   32. OPEN ANALYSIS
========================================================= */

function openAthleteAnalysis(
  id
) {

  const athlete =
    selectAthlete(
      id
    );


  if (!athlete) {

    return;

  }


  /*
     선수 종목을 분석 컨트롤러에 전달
  */

  if (
    window.SeolcheonAnalysisController
  ) {

    window
      .SeolcheonAnalysisController
      .athlete(
        athlete
      );


    if (
      athlete.sport
    ) {

      window
        .SeolcheonAnalysisController
        .sport(

          athlete.sport,

          athlete.season ||
            "",

          athlete.sportName ||
            athlete.sport

        );

    }

  }


  /*
     페이지 라우터가 있으면
     자세분석 화면으로 이동
  */

  if (
    window.SeolcheonApp &&
    typeof window
      .SeolcheonApp
      .navigate ===
      "function"
  ) {

    window
      .SeolcheonApp
      .navigate(
        "analysis"
      );

  }

  else {

    const analysisPage =
      document.querySelector(
        '[data-page="analysis"]'
      );


    if (analysisPage) {

      document
        .querySelectorAll(
          "[data-page]"
        )
        .forEach(
          page => {

            page.hidden =
              true;

          }
        );


      analysisPage.hidden =
        false;

    }

  }


  dispatchAthleteEvent(
    "open-analysis",
    {
      athlete
    }
  );

}


/* =========================================================
   33. OPEN REPORT
========================================================= */

function openAthleteReport(
  id
) {

  const athlete =
    selectAthlete(
      id
    );


  if (!athlete) {

    return;

  }


  const history =
    window.SeolcheonAnalysisResult
      ?.athleteHistory(
        athlete.id
      ) ||
    [];


  const latest =
    history[0] ||
    null;


  if (!latest) {

    showAthleteMessage(
      `${athlete.name} 선수의 분석 기록이 아직 없습니다.`,
      "info"
    );

    return;

  }


  if (
    window.SeolcheonReport &&
    typeof window
      .SeolcheonReport
      .open ===
      "function"
  ) {

    window
      .SeolcheonReport
      .open(
        latest
      );

  }


  dispatchAthleteEvent(
    "open-report",
    {
      athlete,
      result:
        latest
    }
  );

}


/* =========================================================
   34. STATISTICS
========================================================= */

function updateAthleteStatistics() {

  const athletes =
    ATHLETE_MANAGER_STATE
      .athletes;


  athleteElements(
    "[data-athlete-count]"
  )
  .forEach(
    element => {

      element.textContent =
        athletes.length;

    }
  );


  const winter =
    athletes.filter(
      athlete =>
        athlete.season ===
        "winter"
    ).length;


  const summer =
    athletes.filter(
      athlete =>
        athlete.season ===
        "summer"
    ).length;


  athleteElements(
    "[data-winter-athlete-count]"
  )
  .forEach(
    element => {

      element.textContent =
        winter;

    }
  );


  athleteElements(
    "[data-summer-athlete-count]"
  )
  .forEach(
    element => {

      element.textContent =
        summer;

    }
  );

}


/* =========================================================
   35. EVENT
========================================================= */

function dispatchAthleteEvent(
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
   36. FORM EVENTS
========================================================= */

function bindAthleteForm() {

  const form =
    getAthleteForm();


  if (!form) {

    console.warn(
      "[SEOLCHEON] Athlete form not found"
    );

    return;

  }


  /*
     submit 이벤트를 form 자체에 연결.

     버튼 onclick에 의존하지 않기 때문에
     기존 '선수 등록 버튼 안 됨' 문제를
     줄일 수 있음.
  */

  form.addEventListener(
    "submit",
    registerAthlete
  );


  const cancel =
    form.querySelector(
      "[data-athlete-cancel]"
    );


  if (cancel) {

    cancel.addEventListener(
      "click",
      () => {

        resetAthleteForm();

        showAthleteMessage(
          "입력이 초기화되었습니다.",
          "info"
        );

      }
    );

  }

}


/* =========================================================
   37. SEARCH EVENTS
========================================================= */

function bindAthleteSearch() {

  const search =
    athleteElement(
      "[data-athlete-search]"
    );


  if (search) {

    search.addEventListener(
      "input",
      () => {

        setAthleteSearch(
          search.value
        );

      }
    );

  }


  const filter =
    athleteElement(
      "[data-athlete-sport-filter]"
    );


  if (filter) {

    filter.addEventListener(
      "change",
      () => {

        setAthleteSportFilter(
          filter.value
        );

      }
    );

  }

}


/* =========================================================
   38. SPORT NAME AUTO SET
========================================================= */

function bindAthleteSportName() {

  const form =
    getAthleteForm();


  if (!form) {
    return;
  }


  const sport =
    form.querySelector(
      '[name="sport"]'
    );


  const sportName =
    form.querySelector(
      '[name="sportName"]'
    );


  if (
    !sport ||
    !sportName
  ) {

    return;

  }


  sport.addEventListener(
    "change",
    () => {

      const option =
        sport.options[
          sport.selectedIndex
        ];


      sportName.value =
        option?.dataset
          ?.sportName ||
        option?.textContent
          ?.trim() ||
        "";

    }
  );

}


/* =========================================================
   39. IMPORT ATHLETE
========================================================= */

function importAthletes(
  data
) {

  if (
    !Array.isArray(
      data
    )
  ) {

    return false;

  }


  data.forEach(
    item => {

      if (
        !item ||
        !item.name
      ) {

        return;

      }


      ATHLETE_MANAGER_STATE
        .athletes
        .push({

          ...createEmptyAthlete(),

          ...item,

          id:
            item.id ||
            createAthleteId(),

          updatedAt:
            new Date()
              .toISOString()

        });

    }
  );


  saveAthletes();

  renderAthleteList();

  updateAthleteStatistics();


  return true;

}


/* =========================================================
   40. EXPORT
========================================================= */

function exportAthletes() {

  return JSON.parse(
    JSON.stringify(
      ATHLETE_MANAGER_STATE
        .athletes
    )
  );

}


/* =========================================================
   41. INITIALIZE
========================================================= */

function initializeAthleteManager() {

  if (
    ATHLETE_MANAGER_STATE
      .initialized
  ) {

    return;

  }


  loadAthletes();

  bindAthleteForm();

  bindAthleteSearch();

  bindAthleteSportName();

  renderAthleteList();

  updateAthleteStatistics();

  restoreSelectedAthlete();


  ATHLETE_MANAGER_STATE
    .initialized =
      true;


  dispatchAthleteEvent(
    "athlete-manager-ready",
    {
      athletes:
        ATHLETE_MANAGER_STATE
          .athletes
    }
  );


  console.log(
    "[SEOLCHEON] Athlete Manager Ready:",
    ATHLETE_MANAGER_STATE
      .athletes.length,
    "athletes"
  );

}


/* =========================================================
   42. AUTO INITIALIZE
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAthleteManager
  );

}

else {

  initializeAthleteManager();

}


/* =========================================================
   43. PUBLIC API
========================================================= */

window.SeolcheonAthletes = {

  config:
    ATHLETE_MANAGER_CONFIG,

  state:
    ATHLETE_MANAGER_STATE,

  init:
    initializeAthleteManager,

  all:
    () => [
      ...ATHLETE_MANAGER_STATE
        .athletes
    ],

  get:
    getAthleteById,

  selected:
    () =>
      ATHLETE_MANAGER_STATE
        .selectedAthlete,

  register:
    registerAthlete,

  select:
    selectAthlete,

  edit:
    editAthlete,

  delete:
    deleteAthlete,

  search:
    setAthleteSearch,

  filter:
    setAthleteSportFilter,

  render:
    renderAthleteList,

  analysis:
    openAthleteAnalysis,

  report:
    openAthleteReport,

  import:
    importAthletes,

  export:
    exportAthletes,

  resetForm:
    resetAthleteForm

};


/* =========================================================
   END
========================================================= */