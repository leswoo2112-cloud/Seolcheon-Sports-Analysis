/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / STORAGE.JS
   VERSION 1.0
========================================================= */

"use strict";


/* =========================================================
   01. STORAGE CONFIG
========================================================= */

const STORAGE_CONFIG = {

  prefix: "seolcheon_sports_",

  keys: {

    athletes: "athletes",

    analyses: "analyses",

    reports: "reports",

    settings: "settings",

    session: "session",

    trainingRecords: "training_records"

  }

};


/* =========================================================
   02. FULL KEY
========================================================= */

function getStorageKey(key) {

  return (
    STORAGE_CONFIG.prefix +
    key
  );

}


/* =========================================================
   03. SAVE DATA
========================================================= */

function saveStorage(
  key,
  data
) {

  try {

    localStorage.setItem(
      getStorageKey(key),
      JSON.stringify(data)
    );

    return true;

  }

  catch (error) {

    console.error(
      "[STORAGE] 저장 실패:",
      error
    );

    return false;

  }

}


/* =========================================================
   04. LOAD DATA
========================================================= */

function loadStorage(
  key,
  fallback = null
) {

  try {

    const raw =
      localStorage.getItem(
        getStorageKey(key)
      );


    if (raw === null) {

      return fallback;

    }


    return JSON.parse(raw);

  }

  catch (error) {

    console.error(
      "[STORAGE] 불러오기 실패:",
      error
    );

    return fallback;

  }

}


/* =========================================================
   05. REMOVE DATA
========================================================= */

function removeStorage(key) {

  try {

    localStorage.removeItem(
      getStorageKey(key)
    );

    return true;

  }

  catch (error) {

    console.error(
      "[STORAGE] 삭제 실패:",
      error
    );

    return false;

  }

}


/* =========================================================
   06. ATHLETES
========================================================= */

function getAthletes() {

  const athletes =
    loadStorage(
      STORAGE_CONFIG.keys.athletes,
      []
    );


  return Array.isArray(athletes)
    ? athletes
    : [];

}


function saveAthletes(athletes) {

  return saveStorage(
    STORAGE_CONFIG.keys.athletes,
    athletes
  );

}


/* =========================================================
   07. ANALYSIS RECORDS
========================================================= */

function getAnalysisRecords() {

  const records =
    loadStorage(
      STORAGE_CONFIG.keys.analyses,
      []
    );


  return Array.isArray(records)
    ? records
    : [];

}


function saveAnalysisRecords(records) {

  return saveStorage(
    STORAGE_CONFIG.keys.analyses,
    records
  );

}


/* =========================================================
   08. REPORTS
========================================================= */

function getReports() {

  const reports =
    loadStorage(
      STORAGE_CONFIG.keys.reports,
      []
    );


  return Array.isArray(reports)
    ? reports
    : [];

}


function saveReports(reports) {

  return saveStorage(
    STORAGE_CONFIG.keys.reports,
    reports
  );

}


/* =========================================================
   09. TRAINING RECORDS
========================================================= */

function getTrainingRecords() {

  const records =
    loadStorage(
      STORAGE_CONFIG.keys.trainingRecords,
      []
    );


  return Array.isArray(records)
    ? records
    : [];

}


function saveTrainingRecords(records) {

  return saveStorage(
    STORAGE_CONFIG.keys.trainingRecords,
    records
  );

}


/* =========================================================
   10. SETTINGS
========================================================= */

function getSettings() {

  return loadStorage(
    STORAGE_CONFIG.keys.settings,
    {}
  ) || {};

}


function saveSettings(settings) {

  return saveStorage(
    STORAGE_CONFIG.keys.settings,
    settings
  );

}


/* =========================================================
   11. LOGIN SESSION
========================================================= */

function getSession() {

  return loadStorage(
    STORAGE_CONFIG.keys.session,
    null
  );

}


function saveSession(session) {

  return saveStorage(
    STORAGE_CONFIG.keys.session,
    session
  );

}


function clearSession() {

  return removeStorage(
    STORAGE_CONFIG.keys.session
  );

}


/* =========================================================
   12. UNIQUE ID

   선수 / 분석 / 리포트 ID 생성
========================================================= */

function createStorageId(prefix = "item") {

  const random =
    Math.random()
      .toString(36)
      .slice(2, 8);


  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    random
  );

}


/* =========================================================
   13. CREATE ANALYSIS RECORD

   자세분석 결과를 저장할 기본 구조
========================================================= */

function createAnalysisRecord({
  athleteId,
  sportId,
  analysisMode = "video"
}) {

  return {

    id:
      createStorageId(
        "analysis"
      ),

    athleteId:
      athleteId || null,

    sportId:
      sportId || null,

    analysisMode,

    createdAt:
      new Date()
        .toISOString(),


    /* -----------------------------------------
       영상 정보
    ----------------------------------------- */

    media: {

      type:
        analysisMode,

      duration:
        null,

      fps:
        null,

      width:
        null,

      height:
        null

    },


    /* -----------------------------------------
       관절 / 스켈레톤
    ----------------------------------------- */

    pose: {

      detected:
        false,

      confidence:
        null,

      frames:
        []

    },


    /* -----------------------------------------
       관절 각도
    ----------------------------------------- */

    angles: {},


    /* -----------------------------------------
       구간 분석

       바이애슬론 / 육상 등
    ----------------------------------------- */

    segments: [],


    /* -----------------------------------------
       기술 분석

       V1 / V2 / Running Phase 등
    ----------------------------------------- */

    techniques: [],


    /* -----------------------------------------
       궤적

       역도 바벨 / 손 / 발 / 고관절 등
    ----------------------------------------- */

    trajectories: {},


    /* -----------------------------------------
       3D 분석
    ----------------------------------------- */

    threeD: {

      enabled:
        false,

      joints:
        [],

      snapshot:
        null

    },


    /* -----------------------------------------
       핵심 분석 이미지

       리포트에 사용
    ----------------------------------------- */

    snapshots: [],


    /* -----------------------------------------
       대표 각도 이미지
    ----------------------------------------- */

    angleSnapshots: [],


    /* -----------------------------------------
       슬로모션 핵심 프레임
    ----------------------------------------- */

    keyFrames: [],


    /* -----------------------------------------
       점수

       육각형 그래프에 사용
    ----------------------------------------- */

    scores: {

      posture:
        null,

      symmetry:
        null,

      timing:
        null,

      technique:
        null,

      efficiency:
        null,

      eliteSimilarity:
        null,

      total:
        null

    },


    /* -----------------------------------------
       국가대표 / 엘리트 비교
    ----------------------------------------- */

    eliteComparison: {

      enabled:
        false,

      reference:
        null,

      differences:
        [],

      similarity:
        null

    },


    /* -----------------------------------------
       피드백
    ----------------------------------------- */

    feedback: {

      strengths:
        [],

      weaknesses:
        [],

      technical:
        []

    },


    /* -----------------------------------------
       추천 훈련
    ----------------------------------------- */

    recommendedTraining: []

  };

}


/* =========================================================
   14. SAVE ONE ANALYSIS
========================================================= */

function saveAnalysis(record) {

  if (
    !record ||
    !record.id
  ) {

    console.error(
      "[STORAGE] 분석 데이터가 올바르지 않습니다."
    );

    return false;

  }


  const records =
    getAnalysisRecords();


  const index =
    records.findIndex(
      item =>
        item.id ===
        record.id
    );


  if (index >= 0) {

    records[index] =
      record;

  }

  else {

    records.unshift(
      record
    );

  }


  return saveAnalysisRecords(
    records
  );

}


/* =========================================================
   15. FIND ANALYSIS
========================================================= */

function findAnalysisById(id) {

  return (
    getAnalysisRecords()
      .find(
        item =>
          item.id === id
      ) || null
  );

}


/* =========================================================
   16. ATHLETE ANALYSES
========================================================= */

function getAthleteAnalyses(
  athleteId
) {

  return getAnalysisRecords()
    .filter(
      record =>
        record.athleteId ===
        athleteId
    );

}


/* =========================================================
   17. DELETE ANALYSIS
========================================================= */

function deleteAnalysis(id) {

  const records =
    getAnalysisRecords()
      .filter(
        item =>
          item.id !== id
      );


  return saveAnalysisRecords(
    records
  );

}


/* =========================================================
   18. CREATE REPORT DATA
========================================================= */

function createReportRecord({
  athleteId,
  analysisId,
  sportId
}) {

  return {

    id:
      createStorageId(
        "report"
      ),

    athleteId:
      athleteId || null,

    analysisId:
      analysisId || null,

    sportId:
      sportId || null,

    createdAt:
      new Date()
        .toISOString(),

    title:
      "설천고 선수 퍼포먼스 정밀분석 리포트",

    englishTitle:
      "SEOLCHEON ATHLETE PERFORMANCE ANALYSIS REPORT",

    radar: {

      posture:
        null,

      symmetry:
        null,

      timing:
        null,

      technique:
        null,

      efficiency:
        null,

      eliteSimilarity:
        null

    },

    images: {

      representative:
        null,

      angleSnapshots:
        [],

      keyFrames:
        [],

      trajectory:
        null,

      threeD:
        null

    },

    eliteComparison: null,

    feedback: null,

    recommendedTraining: []

  };

}


/* =========================================================
   19. SAVE REPORT
========================================================= */

function saveReport(report) {

  if (
    !report ||
    !report.id
  ) {

    return false;

  }


  const reports =
    getReports();


  const index =
    reports.findIndex(
      item =>
        item.id ===
        report.id
    );


  if (index >= 0) {

    reports[index] =
      report;

  }

  else {

    reports.unshift(
      report
    );

  }


  return saveReports(
    reports
  );

}


/* =========================================================
   20. FIND REPORT
========================================================= */

function findReportById(id) {

  return (
    getReports()
      .find(
        report =>
          report.id === id
      ) || null
  );

}


/* =========================================================
   21. GET ATHLETE REPORTS
========================================================= */

function getAthleteReports(
  athleteId
) {

  return getReports()
    .filter(
      report =>
        report.athleteId ===
        athleteId
    );

}


/* =========================================================
   22. DELETE REPORT
========================================================= */

function deleteReport(id) {

  const reports =
    getReports()
      .filter(
        report =>
          report.id !== id
      );


  return saveReports(
    reports
  );

}


/* =========================================================
   23. STORAGE STATUS
========================================================= */

function getStorageStatus() {

  return {

    athletes:
      getAthletes().length,

    analyses:
      getAnalysisRecords().length,

    reports:
      getReports().length,

    trainingRecords:
      getTrainingRecords().length,

    session:
      Boolean(
        getSession()
      )

  };

}


/* =========================================================
   24. GLOBAL ACCESS
========================================================= */

window.STORAGE_CONFIG =
  STORAGE_CONFIG;

window.saveStorage =
  saveStorage;

window.loadStorage =
  loadStorage;

window.removeStorage =
  removeStorage;

window.getAthletes =
  getAthletes;

window.saveAthletes =
  saveAthletes;

window.getAnalysisRecords =
  getAnalysisRecords;

window.saveAnalysisRecords =
  saveAnalysisRecords;

window.getReports =
  getReports;

window.saveReports =
  saveReports;

window.getTrainingRecords =
  getTrainingRecords;

window.saveTrainingRecords =
  saveTrainingRecords;

window.getSettings =
  getSettings;

window.saveSettings =
  saveSettings;

window.getSession =
  getSession;

window.saveSession =
  saveSession;

window.clearSession =
  clearSession;

window.createStorageId =
  createStorageId;

window.createAnalysisRecord =
  createAnalysisRecord;

window.saveAnalysis =
  saveAnalysis;

window.findAnalysisById =
  findAnalysisById;

window.getAthleteAnalyses =
  getAthleteAnalyses;

window.deleteAnalysis =
  deleteAnalysis;

window.createReportRecord =
  createReportRecord;

window.saveReport =
  saveReport;

window.findReportById =
  findReportById;

window.getAthleteReports =
  getAthleteReports;

window.deleteReport =
  deleteReport;

window.getStorageStatus =
  getStorageStatus;