/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / REPORTS.JS
   VERSION 1.0

   SEOLCHEON SPORTS PERFORMANCE ANALYSIS REPORT

   기능
   ---------------------------------------------------------
   - 선수 정보
   - 종목 / 분석 유형
   - 분석 날짜
   - 종합 점수
   - 종목별 핵심 지표
   - 관절각 데이터
   - 구간 거리 / 시간 / 속도
   - 바이애슬론 주법 기록
   - 3D 분석
   - 자세분석 캡처 이미지
   - 각도 표시 이미지
   - 3D 캡처 이미지
   - 엘리트 비교
   - 육각형 Radar Chart
   - 개선 우선순위
   - 자동 피드백
   - 추가 훈련 추천
   - 인쇄 / PDF 저장용 화면
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const REPORT_CONFIG = {

  storageKey:
    "seolcheon_performance_reports",

  reportTitle:
    "설천고 스포츠 퍼포먼스 종합 분석 리포트",

  reportEnglishTitle:
    "SEOLCHEON SPORTS PERFORMANCE ANALYSIS REPORT",

  version:
    "1.0",

  maxReports:
    100

};


/* =========================================================
   02. STATE
========================================================= */

const ReportManager = {

  initialized: false,

  reports: [],

  currentReport: null,

  poseSnapshot: null,

  angleSnapshot: null,

  analysis3DSnapshot: null,

  radarChart: null

};


/* =========================================================
   03. INITIALIZE
========================================================= */

function initReports() {

  if (
    ReportManager.initialized
  ) {
    return;
  }


  ReportManager.initialized =
    true;


  loadReports();


  bindReportEvents();


  renderReportList();


  console.log(
    "[REPORT] Ready"
  );

}


/* =========================================================
   04. EVENTS
========================================================= */

function bindReportEvents() {

  document.addEventListener(
    "click",
    handleReportClick
  );


  /*
     3D 캡처
  */

  document.addEventListener(
    "analysis3d:snapshot",
    event => {

      ReportManager.analysis3DSnapshot =
        event.detail;

    }
  );


  /*
     일반 자세 캡처
  */

  document.addEventListener(
    "pose:snapshot",
    event => {

      ReportManager.poseSnapshot =
        event.detail;

    }
  );


  /*
     각도 표시 캡처
  */

  document.addEventListener(
    "pose:angle-snapshot",
    event => {

      ReportManager.angleSnapshot =
        event.detail;

    }
  );


  /*
     분석 완료 시
  */

  document.addEventListener(
    "sport:analysis-complete",
    () => {

      updateReportPreview();

    }
  );


  /*
     엘리트 비교 완료
  */

  document.addEventListener(
    "comparison:complete",
    () => {

      updateReportPreview();

    }
  );

}


/* =========================================================
   05. CLICK
========================================================= */

function handleReportClick(event) {

  const create =
    event.target.closest(
      "[data-action='create-report']"
    );


  if (create) {

    createPerformanceReport();

    return;
  }


  const print =
    event.target.closest(
      "[data-action='print-report']"
    );


  if (print) {

    printPerformanceReport();

    return;
  }


  const save =
    event.target.closest(
      "[data-action='save-report']"
    );


  if (save) {

    saveCurrentReport();

    return;
  }


  const deleteButton =
    event.target.closest(
      "[data-action='delete-report']"
    );


  if (deleteButton) {

    deleteReport(
      deleteButton.dataset.reportId
    );

    return;
  }


  const open =
    event.target.closest(
      "[data-action='open-report']"
    );


  if (open) {

    openReport(
      open.dataset.reportId
    );

  }

}


/* =========================================================
   06. LOAD REPORTS
========================================================= */

function loadReports() {

  try {

    const raw =
      localStorage.getItem(
        REPORT_CONFIG.storageKey
      );


    ReportManager.reports =
      raw
        ? JSON.parse(raw)
        : [];


    if (
      !Array.isArray(
        ReportManager.reports
      )
    ) {

      ReportManager.reports =
        [];

    }

  }

  catch (error) {

    console.error(
      "[REPORT] Load failed",
      error
    );


    ReportManager.reports =
      [];

  }

}


/* =========================================================
   07. SAVE REPORT STORAGE
========================================================= */

function saveReportsToStorage() {

  try {

    let reports =
      ReportManager.reports;


    if (
      reports.length >
      REPORT_CONFIG.maxReports
    ) {

      reports =
        reports.slice(
          0,
          REPORT_CONFIG.maxReports
        );


      ReportManager.reports =
        reports;

    }


    localStorage.setItem(
      REPORT_CONFIG.storageKey,
      JSON.stringify(
        reports
      )
    );


    return true;

  }

  catch (error) {

    console.error(
      "[REPORT] Save failed",
      error
    );


    return false;

  }

}


/* =========================================================
   08. CREATE REPORT
========================================================= */

function createPerformanceReport() {

  const analysis =
    typeof getLatestSportsAnalysis ===
      "function"
        ? getLatestSportsAnalysis()
        : null;


  if (!analysis) {

    showReportMessage(
      "먼저 자세분석을 완료해주세요.",
      "error"
    );

    return null;
  }


  const comparison =
    typeof getLatestEliteComparison ===
      "function"
        ? getLatestEliteComparison()
        : null;


  const analysis3D =
    typeof getAnalysis3DState ===
      "function"
        ? getAnalysis3DState()
        : null;


  const athlete =
    getReportAthlete(
      analysis
    );


  const now =
    new Date();


  const report = {

    id:
      "report_" +
      Date.now(),

    title:
      REPORT_CONFIG.reportTitle,

    englishTitle:
      REPORT_CONFIG.reportEnglishTitle,

    version:
      REPORT_CONFIG.version,

    createdAt:
      now.toISOString(),

    displayDate:
      formatReportDate(
        now
      ),

    athlete,

    sport: {

      id:
        analysis.sportId,

      name:
        analysis.sportName,

      category:
        analysis.category

    },

    analysis: {

      id:
        analysis.id,

      score:
        analysis.score,

      frames:
        analysis.frames,

      poseFrames:
        analysis.poseFrames,

      distance:
        analysis.distance,

      gradient:
        analysis.gradient,

      metrics:
        analysis.metrics || {},

      techniqueHistory:
        analysis.techniqueHistory || [],

      barPath:
        analysis.barPath || [],

      feedback:
        analysis.feedback || [],

      training:
        analysis.training || []

    },

    comparison:
      comparison &&
      comparison.sportId ===
        analysis.sportId
        ? comparison
        : null,

    analysis3D: {

      state:
        analysis3D,

      snapshot:
        ReportManager
          .analysis3DSnapshot

    },

    images: {

      pose:
        ReportManager
          .poseSnapshot,

      angle:
        ReportManager
          .angleSnapshot,

      analysis3D:
        ReportManager
          .analysis3DSnapshot

    }

  };


  report.summary =
    createReportSummary(
      report
    );


  report.radar =
    createReportRadarData(
      report
    );


  report.recommendations =
    createReportRecommendations(
      report
    );


  ReportManager.currentReport =
    report;


  renderPerformanceReport(
    report
  );


  document.dispatchEvent(
    new CustomEvent(
      "report:created",
      {
        detail:
          report
      }
    )
  );


  showReportMessage(
    "분석 리포트가 생성되었습니다.",
    "success"
  );


  return report;

}


/* =========================================================
   09. ATHLETE
========================================================= */

function getReportAthlete(
  analysis
) {

  if (
    analysis.athlete
  ) {

    return analysis.athlete;

  }


  if (
    typeof getSelectedAthlete ===
      "function"
  ) {

    const athlete =
      getSelectedAthlete();


    if (athlete) {

      return athlete;

    }

  }


  return {

    name:
      "선수 미선택",

    number:
      "",

    team:
      "설천고",

    sport:
      analysis.sportName

  };

}


/* =========================================================
   10. SUMMARY
========================================================= */

function createReportSummary(
  report
) {

  const score =
    report.comparison
      ?.overallScore ??
    report.analysis.score ??
    null;


  let grade =
    "DATA";


  if (
    Number.isFinite(score)
  ) {

    if (
      score >= 90
    ) {

      grade =
        "ELITE";

    }

    else if (
      score >= 80
    ) {

      grade =
        "EXCELLENT";

    }

    else if (
      score >= 70
    ) {

      grade =
        "GOOD";

    }

    else if (
      score >= 60
    ) {

      grade =
        "DEVELOPING";

    }

    else {

      grade =
        "FOCUS";

    }

  }


  return {

    score,

    grade,

    headline:
      createReportHeadline(
        report,
        score
      )

  };

}


/* =========================================================
   11. HEADLINE
========================================================= */

function createReportHeadline(
  report,
  score
) {

  const sport =
    report.sport.name;


  if (
    !Number.isFinite(score)
  ) {

    return (
      `${sport} 자세 및 퍼포먼스 분석 결과`
    );

  }


  if (
    score >= 90
  ) {

    return (
      `${sport} 주요 기술 지표가 등록된 엘리트 기준에 매우 근접합니다.`
    );

  }


  if (
    score >= 75
  ) {

    return (
      `${sport} 전체 수행은 안정적이며 일부 개선 항목이 확인되었습니다.`
    );

  }


  return (
    `${sport} 분석에서 우선적으로 개선할 기술 항목이 확인되었습니다.`
  );

}


/* =========================================================
   12. RADAR DATA
========================================================= */

function createReportRadarData(
  report
) {

  if (
    report.comparison
      ?.radar
  ) {

    return report.comparison.radar;

  }


  /*
     엘리트 비교가 없으면
     실제 확보된 분석 지표만으로 구성.
  */

  const metrics =
    report.analysis.metrics ||
    {};


  return {

    labels: [
      "자세 안정성",
      "좌우 대칭",
      "기술 수행",
      "동작 일관성",
      "분석 신뢰도",
      "퍼포먼스"
    ],

    keys: [
      "posture",
      "symmetry",
      "technique",
      "consistency",
      "confidence",
      "performance"
    ],

    athlete: [

      calculatePostureRadarScore(
        metrics
      ),

      normalizeRadarScore(
        metrics.symmetry
      ),

      normalizeRadarScore(
        report.analysis.score
      ),

      calculateConsistencyScore(
        report
      ),

      calculateAnalysisConfidence(
        report
      ),

      normalizeRadarScore(
        report.summary.score
      )

    ],

    elite: null

  };

}


/* =========================================================
   13. POSTURE RADAR SCORE
========================================================= */

function calculatePostureRadarScore(
  metrics
) {

  const available = [

    metrics.trunkAngle,

    metrics.kneeAngle,

    metrics.hipAngle

  ].filter(
    value =>
      Number.isFinite(value)
  );


  if (
    available.length === 0
  ) {

    return null;

  }


  /*
     절대 관절각 자체를 임의의
     퍼포먼스 점수로 바꾸지 않는다.

     데이터가 존재한다는 의미로
     분석 완성도에만 사용.
  */

  return Math.min(
    100,
    60 +
    available.length * 10
  );

}


/* =========================================================
   14. CONSISTENCY
========================================================= */

function calculateConsistencyScore(
  report
) {

  const frames =
    Number(
      report.analysis.frames
    );


  if (
    !Number.isFinite(frames) ||
    frames <= 0
  ) {

    return null;

  }


  return Math.min(
    100,
    Math.round(
      50 +
      Math.log10(
        frames + 1
      ) *
      25
    )
  );

}


/* =========================================================
   15. CONFIDENCE
========================================================= */

function calculateAnalysisConfidence(
  report
) {

  const poseFrames =
    Number(
      report.analysis.poseFrames
    );


  if (
    !Number.isFinite(poseFrames) ||
    poseFrames <= 0
  ) {

    return null;

  }


  return Math.min(
    100,
    Math.round(
      poseFrames / 2
    )
  );

}


/* =========================================================
   16. NORMALIZE RADAR
========================================================= */

function normalizeRadarScore(
  value
) {

  if (
    !Number.isFinite(value)
  ) {

    return null;

  }


  return Math.max(
    0,
    Math.min(
      100,
      Number(
        value.toFixed(1)
      )
    )
  );

}


/* =========================================================
   17. RECOMMENDATIONS
========================================================= */

function createReportRecommendations(
  report
) {

  const recommendations =
    [];


  /*
     자세분석 피드백
  */

  if (
    Array.isArray(
      report.analysis.feedback
    )
  ) {

    report.analysis.feedback
      .forEach(
        item => {

          recommendations.push({

            type:
              "analysis",

            title:
              "자세분석",

            text:
              item

          });

        }
      );

  }


  /*
     엘리트 비교
  */

  if (
    report.comparison
      ?.priorities
  ) {

    report.comparison
      .priorities
      .slice(
        0,
        3
      )
      .forEach(
        priority => {

          recommendations.push({

            type:
              "priority",

            title:
              `개선 우선순위 ${priority.rank}`,

            text:
              `${formatReportMetricName(
                priority.metric
              )} 근접도 ${priority.score}/100`

          });

        }
      );

  }


  /*
     훈련 추천
  */

  if (
    Array.isArray(
      report.analysis.training
    )
  ) {

    report.analysis.training
      .forEach(
        training => {

          recommendations.push({

            type:
              "training",

            title:
              "추천 훈련",

            text:
              training

          });

        }
      );

  }


  return recommendations;

}


/* =========================================================
   18. RENDER REPORT
========================================================= */

function renderPerformanceReport(
  report
) {

  const container =
    document.querySelector(
      "[data-report-preview]"
    );


  if (!container) {

    console.warn(
      "[REPORT] Preview container missing"
    );

    return;

  }


  container.innerHTML = `

    <article
      class="performance-report"
      id="performance-report-print"
    >

      ${renderReportHeader(
        report
      )}

      ${renderAthleteSection(
        report
      )}

      ${renderSummarySection(
        report
      )}

      ${renderVisualAnalysisSection(
        report
      )}

      ${renderMetricSection(
        report
      )}

      ${renderSportSpecificSection(
        report
      )}

      ${renderEliteSection(
        report
      )}

      ${renderRadarSection(
        report
      )}

      ${renderPrioritySection(
        report
      )}

      ${renderFeedbackSection(
        report
      )}

      ${renderTrainingSection(
        report
      )}

      ${renderReportFooter(
        report
      )}

    </article>

  `;


  requestAnimationFrame(
    () => {

      drawReportRadarChart(
        report
      );

    }
  );

}


/* =========================================================
   19. HEADER
========================================================= */

function renderReportHeader(
  report
) {

  return `

    <header class="report-header">

      <div class="report-brand">

        <div class="report-brand-mark">
          SC
        </div>

        <div>

          <span class="report-kicker">
            SEOLCHEON HIGH SCHOOL
          </span>

          <h1>
            ${escapeReportHTML(
              report.title
            )}
          </h1>

          <p>
            ${escapeReportHTML(
              report.englishTitle
            )}
          </p>

        </div>

      </div>

      <div class="report-meta">

        <span>
          REPORT ID
        </span>

        <strong>
          ${escapeReportHTML(
            report.id
          )}
        </strong>

        <span>
          ANALYSIS DATE
        </span>

        <strong>
          ${escapeReportHTML(
            report.displayDate
          )}
        </strong>

      </div>

    </header>

  `;

}


/* =========================================================
   20. ATHLETE SECTION
========================================================= */

function renderAthleteSection(
  report
) {

  const athlete =
    report.athlete || {};


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          01
        </span>

        <h2>
          선수 정보
        </h2>

      </div>

      <div class="report-info-grid">

        ${renderInfoBox(
          "선수",
          athlete.name || "-"
        )}

        ${renderInfoBox(
          "소속",
          athlete.team ||
          athlete.school ||
          "설천고"
        )}

        ${renderInfoBox(
          "종목",
          report.sport.name
        )}

        ${renderInfoBox(
          "분류",
          report.sport.category ===
            "winter"
              ? "동계"
              : "하계"
        )}

      </div>

    </section>

  `;

}


/* =========================================================
   21. SUMMARY
========================================================= */

function renderSummarySection(
  report
) {

  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          02
        </span>

        <h2>
          Performance Summary
        </h2>

      </div>

      <div class="report-summary-layout">

        <div class="report-main-score">

          <span>
            PERFORMANCE SCORE
          </span>

          <strong>
            ${
              Number.isFinite(
                report.summary.score
              )
                ? report.summary.score
                : "--"
            }
          </strong>

          <small>
            / 100
          </small>

          <b>
            ${escapeReportHTML(
              report.summary.grade
            )}
          </b>

        </div>

        <div class="report-summary-copy">

          <h3>
            ${escapeReportHTML(
              report.sport.name
            )} PERFORMANCE
          </h3>

          <p>
            ${escapeReportHTML(
              report.summary.headline
            )}
          </p>

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   22. VISUAL ANALYSIS
========================================================= */

function renderVisualAnalysisSection(
  report
) {

  const pose =
    extractReportImage(
      report.images.pose
    );


  const angle =
    extractReportImage(
      report.images.angle
    );


  const image3D =
    extractReportImage(
      report.images.analysis3D
    );


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          03
        </span>

        <h2>
          자세 시각 분석
        </h2>

      </div>

      <div class="report-image-grid">

        ${renderAnalysisImage(
          "스켈레톤 분석",
          pose
        )}

        ${renderAnalysisImage(
          "관절각 분석",
          angle
        )}

        ${renderAnalysisImage(
          "3D 자세 분석",
          image3D
        )}

      </div>

    </section>

  `;

}


/* =========================================================
   23. ANALYSIS IMAGE
========================================================= */

function renderAnalysisImage(
  title,
  src
) {

  if (!src) {

    return `

      <div class="report-analysis-image">

        <div class="report-image-placeholder">

          <span>
            NO IMAGE
          </span>

          <strong>
            ${escapeReportHTML(
              title
            )}
          </strong>

        </div>

      </div>

    `;

  }


  return `

    <figure class="report-analysis-image">

      <img
        src="${src}"
        alt="${escapeReportHTML(
          title
        )}"
      >

      <figcaption>
        ${escapeReportHTML(
          title
        )}
      </figcaption>

    </figure>

  `;

}


/* =========================================================
   24. EXTRACT IMAGE
========================================================= */

function extractReportImage(
  data
) {

  if (!data) {
    return null;
  }


  if (
    typeof data ===
      "string"
  ) {

    return data;

  }


  if (
    typeof data.image ===
      "string"
  ) {

    return data.image;

  }


  if (
    typeof data.dataURL ===
      "string"
  ) {

    return data.dataURL;

  }


  return null;

}


/* =========================================================
   25. METRIC SECTION
========================================================= */

function renderMetricSection(
  report
) {

  const metrics =
    report.analysis.metrics ||
    {};


  const entries =
    Object.entries(
      metrics
    )
      .filter(
        ([, value]) =>
          Number.isFinite(value) ||
          typeof value ===
            "string"
      );


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          04
        </span>

        <h2>
          핵심 분석 지표
        </h2>

      </div>

      <div class="report-metric-grid">

        ${
          entries.length
            ? entries
                .map(
                  ([key, value]) =>
                    renderMetricCard(
                      key,
                      value
                    )
                )
                .join("")
            : `
                <div class="report-empty">
                  분석 가능한 지표가 없습니다.
                </div>
              `
        }

      </div>

    </section>

  `;

}


/* =========================================================
   26. METRIC CARD
========================================================= */

function renderMetricCard(
  key,
  value
) {

  return `

    <div class="report-metric-card">

      <span>
        ${escapeReportHTML(
          formatReportMetricName(
            key
          )
        )}
      </span>

      <strong>
        ${escapeReportHTML(
          formatReportMetricValue(
            key,
            value
          )
        )}
      </strong>

    </div>

  `;

}


/* =========================================================
   27. SPORT SPECIFIC
========================================================= */

function renderSportSpecificSection(
  report
) {

  switch (
    report.sport.id
  ) {

    case "biathlon":

      return renderBiathlonReport(
        report
      );


    case "weightlifting":

      return renderWeightliftingReport(
        report
      );


    case "athletics":

      return renderAthleticsReport(
        report
      );


    default:

      return renderGenericSportReport(
        report
      );

  }

}


/* =========================================================
   28. BIATHLON REPORT
========================================================= */

function renderBiathlonReport(
  report
) {

  const techniques =
    report.analysis
      .techniqueHistory ||
    [];


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          05
        </span>

        <h2>
          바이애슬론 구간 분석
        </h2>

      </div>

      <div class="report-info-grid">

        ${renderInfoBox(
          "구간 거리",
          formatNullable(
            report.analysis.distance,
            "m"
          )
        )}

        ${renderInfoBox(
          "경사도",
          formatNullable(
            report.analysis.gradient,
            "%"
          )
        )}

        ${renderInfoBox(
          "주법 전환",
          `${Math.max(
            0,
            techniques.length - 1
          )}회`
        )}

        ${renderInfoBox(
          "분석 프레임",
          report.analysis.frames
        )}

      </div>

      <div class="report-technique-timeline">

        ${
          techniques.length
            ? techniques
                .map(
                  item => `

                    <div class="technique-timeline-item">

                      <strong>
                        ${escapeReportHTML(
                          item.technique
                        )}
                      </strong>

                      <span>
                        ${formatSeconds(
                          item.start
                        )}
                        -
                        ${formatSeconds(
                          item.end
                        )}
                      </span>

                    </div>

                  `
                )
                .join("")
            : `
                <div class="report-empty">
                  주법 데이터 없음
                </div>
              `
        }

      </div>

    </section>

  `;

}


/* =========================================================
   29. WEIGHTLIFTING REPORT
========================================================= */

function renderWeightliftingReport(
  report
) {

  const path =
    report.analysis.barPath ||
    [];


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          05
        </span>

        <h2>
          역도 바벨 궤적 분석
        </h2>

      </div>

      <div class="report-info-grid">

        ${renderInfoBox(
          "궤적 포인트",
          path.length
        )}

        ${renderInfoBox(
          "무릎각",
          formatNullable(
            report.analysis
              .metrics
              ?.kneeAngle,
            "°"
          )
        )}

        ${renderInfoBox(
          "고관절각",
          formatNullable(
            report.analysis
              .metrics
              ?.hipAngle,
            "°"
          )
        )}

        ${renderInfoBox(
          "몸통각",
          formatNullable(
            report.analysis
              .metrics
              ?.trunkAngle,
            "°"
          )
        )}

      </div>

      <canvas
        class="report-path-canvas"
        data-report-bar-path
        width="900"
        height="360"
      ></canvas>

    </section>

  `;

}


/* =========================================================
   30. ATHLETICS REPORT
========================================================= */

function renderAthleticsReport(
  report
) {

  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          05
        </span>

        <h2>
          육상 구간 퍼포먼스
        </h2>

      </div>

      <div class="report-info-grid">

        ${renderInfoBox(
          "거리",
          formatNullable(
            report.analysis.distance,
            "m"
          )
        )}

        ${renderInfoBox(
          "좌우 대칭",
          formatNullable(
            report.analysis
              .metrics
              ?.symmetry,
            "/100"
          )
        )}

        ${renderInfoBox(
          "무릎각",
          formatNullable(
            report.analysis
              .metrics
              ?.kneeAngle,
            "°"
          )
        )}

        ${renderInfoBox(
          "몸통각",
          formatNullable(
            report.analysis
              .metrics
              ?.trunkAngle,
            "°"
          )
        )}

      </div>

    </section>

  `;

}


/* =========================================================
   31. GENERIC SPORT
========================================================= */

function renderGenericSportReport(
  report
) {

  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          05
        </span>

        <h2>
          종목별 분석
        </h2>

      </div>

      <p class="report-body-text">

        ${escapeReportHTML(
          report.sport.name
        )} 동작에서 수집된
        관절각, 대칭성 및 기술 수행 데이터를
        기반으로 분석했습니다.

      </p>

    </section>

  `;

}


/* =========================================================
   32. ELITE COMPARISON
========================================================= */

function renderEliteSection(
  report
) {

  const comparison =
    report.comparison;


  if (!comparison) {

    return `

      <section class="report-section">

        <div class="report-section-title">

          <span>
            06
          </span>

          <h2>
            엘리트 비교
          </h2>

        </div>

        <div class="report-empty">
          이 분석에는 검증된 엘리트 기준 데이터가 연결되지 않았습니다.
        </div>

      </section>

    `;

  }


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          06
        </span>

        <h2>
          엘리트 기준 비교
        </h2>

      </div>

      <div class="report-elite-header">

        <div>

          <span>
            BENCHMARK
          </span>

          <strong>
            ${escapeReportHTML(
              comparison.benchmarkName
            )}
          </strong>

        </div>

        <div>

          <span>
            ELITE PROXIMITY
          </span>

          <strong>
            ${
              Number.isFinite(
                comparison.overallScore
              )
                ? comparison.overallScore
                : "--"
            } / 100
          </strong>

        </div>

      </div>

      <div class="report-comparison-table">

        <div class="comparison-table-head">

          <span>지표</span>
          <span>선수</span>
          <span>기준</span>
          <span>점수</span>

        </div>

        ${
          comparison.metrics
            .map(
              metric => `

                <div class="comparison-table-row">

                  <span>
                    ${escapeReportHTML(
                      formatReportMetricName(
                        metric.key
                      )
                    )}
                  </span>

                  <strong>
                    ${metric.athleteValue}
                    ${escapeReportHTML(
                      metric.unit || ""
                    )}
                  </strong>

                  <strong>
                    ${metric.eliteValue}
                    ${escapeReportHTML(
                      metric.unit || ""
                    )}
                  </strong>

                  <strong>
                    ${metric.score}
                  </strong>

                </div>

              `
            )
            .join("")
        }

      </div>

    </section>

  `;

}


/* =========================================================
   33. RADAR
========================================================= */

function renderRadarSection(
  report
) {

  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          07
        </span>

        <h2>
          퍼포먼스 육각형
        </h2>

      </div>

      <div class="report-radar-layout">

        <canvas
          id="report-radar-canvas"
          width="560"
          height="480"
        ></canvas>

        <div class="report-radar-values">

          ${report.radar.labels
            .map(
              (label, index) => `

                <div>

                  <span>
                    ${escapeReportHTML(
                      label
                    )}
                  </span>

                  <strong>
                    ${
                      Number.isFinite(
                        report.radar
                          .athlete[
                            index
                          ]
                      )
                        ? report.radar
                            .athlete[
                              index
                            ]
                        : "--"
                    }
                  </strong>

                </div>

              `
            )
            .join("")}

        </div>

      </div>

    </section>

  `;

}


/* =========================================================
   34. DRAW RADAR
   Chart.js가 있으면 Chart.js 사용
========================================================= */

function drawReportRadarChart(
  report
) {

  const canvas =
    document.getElementById(
      "report-radar-canvas"
    );


  if (!canvas) {
    return;
  }


  if (
    typeof Chart ===
      "undefined"
  ) {

    drawFallbackRadar(
      canvas,
      report.radar
    );

    return;
  }


  if (
    ReportManager.radarChart
  ) {

    ReportManager
      .radarChart
      .destroy();

  }


  const datasets = [

    {
      label:
        "선수",

      data:
        report.radar
          .athlete
          .map(
            value =>
              Number.isFinite(value)
                ? value
                : 0
          ),

      borderWidth:
        2,

      pointRadius:
        3

    }

  ];


  if (
    Array.isArray(
      report.radar.elite
    )
  ) {

    datasets.push({

      label:
        "ELITE",

      data:
        report.radar.elite
          .map(
            value =>
              Number.isFinite(value)
                ? value
                : 0
          ),

      borderWidth:
        2,

      pointRadius:
        2

    });

  }


  ReportManager.radarChart =
    new Chart(
      canvas,
      {

        type:
          "radar",

        data: {

          labels:
            report.radar.labels,

          datasets

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          scales: {

            r: {

              min:
                0,

              max:
                100,

              beginAtZero:
                true,

              ticks: {

                stepSize:
                  20

              }

            }

          },

          plugins: {

            legend: {

              display:
                true

            }

          }

        }

      }
    );

}


/* =========================================================
   35. FALLBACK RADAR
========================================================= */

function drawFallbackRadar(
  canvas,
  radar
) {

  const ctx =
    canvas.getContext("2d");


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


  const centerX =
    width / 2;


  const centerY =
    height / 2;


  const radius =
    Math.min(
      width,
      height
    ) *
    0.34;


  const count =
    radar.labels.length;


  /*
     Grid
  */

  for (
    let level = 1;
    level <= 5;
    level++
  ) {

    const r =
      radius *
      (
        level / 5
      );


    ctx.beginPath();


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const angle =
        -Math.PI / 2 +
        (
          Math.PI * 2 *
          i /
          count
        );


      const x =
        centerX +
        Math.cos(angle) *
        r;


      const y =
        centerY +
        Math.sin(angle) *
        r;


      if (
        i === 0
      ) {

        ctx.moveTo(
          x,
          y
        );

      }

      else {

        ctx.lineTo(
          x,
          y
        );

      }

    }


    ctx.closePath();


    ctx.strokeStyle =
      "rgba(100,150,170,.25)";


    ctx.stroke();

  }


  /*
     Athlete polygon
  */

  ctx.beginPath();


  radar.athlete
    .forEach(
      (value, index) => {

        const score =
          Number.isFinite(value)
            ? value
            : 0;


        const angle =
          -Math.PI / 2 +
          (
            Math.PI * 2 *
            index /
            count
          );


        const r =
          radius *
          score /
          100;


        const x =
          centerX +
          Math.cos(angle) *
          r;


        const y =
          centerY +
          Math.sin(angle) *
          r;


        if (
          index === 0
        ) {

          ctx.moveTo(
            x,
            y
          );

        }

        else {

          ctx.lineTo(
            x,
            y
          );

        }

      }
    );


  ctx.closePath();


  ctx.strokeStyle =
    "#00d9ff";


  ctx.lineWidth =
    3;


  ctx.stroke();


  ctx.fillStyle =
    "rgba(0,217,255,.12)";


  ctx.fill();


  /*
     Labels
  */

  radar.labels
    .forEach(
      (label, index) => {

        const angle =
          -Math.PI / 2 +
          (
            Math.PI * 2 *
            index /
            count
          );


        const x =
          centerX +
          Math.cos(angle) *
          (
            radius + 35
          );


        const y =
          centerY +
          Math.sin(angle) *
          (
            radius + 35
          );


        ctx.fillStyle =
          "#dcecf2";


        ctx.font =
          "12px system-ui";


        ctx.textAlign =
          "center";


        ctx.fillText(
          label,
          x,
          y
        );

      }
    );

}


/* =========================================================
   36. PRIORITIES
========================================================= */

function renderPrioritySection(
  report
) {

  const priorities =
    report.comparison
      ?.priorities ||
    [];


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          08
        </span>

        <h2>
          개선 우선순위
        </h2>

      </div>

      <div class="report-priority-list">

        ${
          priorities.length
            ? priorities
                .map(
                  item => `

                    <div class="report-priority">

                      <strong>
                        ${item.rank}
                      </strong>

                      <div>

                        <span>
                          ${escapeReportHTML(
                            formatReportMetricName(
                              item.metric
                            )
                          )}
                        </span>

                        <b>
                          ${item.score}/100
                        </b>

                      </div>

                    </div>

                  `
                )
                .join("")
            : `
                <div class="report-empty">
                  엘리트 비교 데이터가 없습니다.
                </div>
              `
        }

      </div>

    </section>

  `;

}


/* =========================================================
   37. FEEDBACK
========================================================= */

function renderFeedbackSection(
  report
) {

  const feedback = [

    ...(
      report.analysis
        .feedback ||
      []
    ),

    ...(
      report.comparison
        ?.feedback ||
      []
    )

  ];


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          09
        </span>

        <h2>
          Performance Feedback
        </h2>

      </div>

      <div class="report-feedback-list">

        ${
          feedback.length
            ? feedback
                .map(
                  item => `

                    <div class="report-feedback-item">

                      <span>
                        ANALYSIS
                      </span>

                      <p>
                        ${escapeReportHTML(
                          item
                        )}
                      </p>

                    </div>

                  `
                )
                .join("")
            : `
                <div class="report-empty">
                  피드백 데이터가 없습니다.
                </div>
              `
        }

      </div>

    </section>

  `;

}


/* =========================================================
   38. TRAINING
========================================================= */

function renderTrainingSection(
  report
) {

  const training =
    report.analysis.training ||
    [];


  return `

    <section class="report-section">

      <div class="report-section-title">

        <span>
          10
        </span>

        <h2>
          추천 훈련
        </h2>

      </div>

      <div class="report-training-grid">

        ${
          training.length
            ? training
                .map(
                  (
                    item,
                    index
                  ) => `

                    <div class="report-training-card">

                      <span>
                        ${String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <strong>
                        ${escapeReportHTML(
                          item
                        )}
                      </strong>

                    </div>

                  `
                )
                .join("")
            : `
                <div class="report-empty">
                  추천 훈련 데이터가 없습니다.
                </div>
              `
        }

      </div>

    </section>

  `;

}


/* =========================================================
   39. FOOTER
========================================================= */

function renderReportFooter(
  report
) {

  return `

    <footer class="report-footer">

      <div>

        <strong>
          설천고
        </strong>

        <span>
          SPORTS PERFORMANCE ANALYSIS SYSTEM
        </span>

      </div>

      <p>
        영상 기반 분석 결과는 촬영 조건과
        포즈 추정 정확도에 따라 달라질 수 있습니다.
        엘리트 비교값은 등록된 기준 데이터가 있는 경우에만
        표시됩니다.
      </p>

      <small>
        ${escapeReportHTML(
          report.id
        )}
      </small>

    </footer>

  `;

}


/* =========================================================
   40. INFO BOX
========================================================= */

function renderInfoBox(
  label,
  value
) {

  return `

    <div class="report-info-box">

      <span>
        ${escapeReportHTML(
          label
        )}
      </span>

      <strong>
        ${escapeReportHTML(
          value ?? "-"
        )}
      </strong>

    </div>

  `;

}


/* =========================================================
   41. FORMAT METRIC
========================================================= */

function formatReportMetricName(
  key
) {

  const names = {

    trunkAngle:
      "몸통각",

    kneeAngle:
      "무릎각",

    hipAngle:
      "고관절각",

    ankleAngle:
      "발목각",

    shoulderAngle:
      "어깨각",

    elbowAngle:
      "팔꿈치각",

    symmetry:
      "좌우 대칭",

    speed:
      "속도",

    acceleration:
      "가속도",

    cadence:
      "케이던스",

    strideLength:
      "보폭",

    cycleRate:
      "사이클 빈도",

    cycleLength:
      "사이클 길이",

    barSpeed:
      "바벨 속도",

    barHeight:
      "바벨 높이",

    pushTime:
      "푸시 시간",

    boardingTime:
      "탑승 시간",

    bodyAlignment:
      "신체 정렬"

  };


  return (
    names[key] ||
    key
  );

}


/* =========================================================
   42. FORMAT METRIC VALUE
========================================================= */

function formatReportMetricValue(
  key,
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "--";

  }


  if (
    typeof value ===
      "string"
  ) {

    return value;

  }


  if (
    !Number.isFinite(value)
  ) {

    return "--";

  }


  if (
    key.toLowerCase()
      .includes("angle")
  ) {

    return `${value}°`;

  }


  if (
    key === "symmetry"
  ) {

    return `${value}/100`;

  }


  if (
    key.toLowerCase()
      .includes("time")
  ) {

    return `${value}s`;

  }


  if (
    key.toLowerCase()
      .includes("speed")
  ) {

    return `${value} m/s`;

  }


  return String(value);

}


/* =========================================================
   43. SAVE CURRENT REPORT
========================================================= */

function saveCurrentReport() {

  const report =
    ReportManager.currentReport ||
    createPerformanceReport();


  if (!report) {
    return false;
  }


  const index =
    ReportManager.reports
      .findIndex(
        item =>
          item.id ===
          report.id
      );


  if (
    index >= 0
  ) {

    ReportManager
      .reports[index] =
        report;

  }

  else {

    ReportManager.reports
      .unshift(
        report
      );

  }


  const saved =
    saveReportsToStorage();


  if (saved) {

    renderReportList();


    showReportMessage(
      "리포트가 저장되었습니다.",
      "success"
    );

  }


  return saved;

}


/* =========================================================
   44. OPEN REPORT
========================================================= */

function openReport(
  id
) {

  const report =
    ReportManager.reports
      .find(
        item =>
          item.id === id
      );


  if (!report) {

    showReportMessage(
      "리포트를 찾을 수 없습니다.",
      "error"
    );

    return null;

  }


  ReportManager.currentReport =
    report;


  renderPerformanceReport(
    report
  );


  return report;

}


/* =========================================================
   45. DELETE REPORT
========================================================= */

function deleteReport(
  id
) {

  ReportManager.reports =
    ReportManager.reports
      .filter(
        item =>
          item.id !== id
      );


  if (
    ReportManager
      .currentReport
      ?.id === id
  ) {

    ReportManager.currentReport =
      null;

  }


  saveReportsToStorage();


  renderReportList();


  return true;

}


/* =========================================================
   46. REPORT LIST
========================================================= */

function renderReportList() {

  const container =
    document.querySelector(
      "[data-report-list]"
    );


  if (!container) {
    return;
  }


  if (
    ReportManager.reports.length ===
    0
  ) {

    container.innerHTML = `

      <div class="report-empty">
        저장된 리포트가 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML =
    ReportManager.reports
      .map(
        report => `

          <div class="saved-report-card">

            <div>

              <span>
                ${escapeReportHTML(
                  report.displayDate
                )}
              </span>

              <strong>
                ${escapeReportHTML(
                  report.athlete
                    ?.name ||
                  "선수"
                )}
              </strong>

              <small>
                ${escapeReportHTML(
                  report.sport
                    ?.name ||
                  ""
                )}
              </small>

            </div>

            <div>

              <button
                type="button"
                data-action="open-report"
                data-report-id="${escapeReportHTML(
                  report.id
                )}"
              >
                열기
              </button>

              <button
                type="button"
                data-action="delete-report"
                data-report-id="${escapeReportHTML(
                  report.id
                )}"
              >
                삭제
              </button>

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   47. UPDATE PREVIEW
========================================================= */

function updateReportPreview() {

  if (
    !ReportManager.currentReport
  ) {
    return;
  }


  createPerformanceReport();

}


/* =========================================================
   48. PRINT / PDF
========================================================= */

function printPerformanceReport() {

  if (
    !ReportManager.currentReport
  ) {

    createPerformanceReport();

  }


  if (
    !ReportManager.currentReport
  ) {

    return false;

  }


  /*
     브라우저 인쇄 창에서
     "PDF로 저장" 가능.
  */

  window.print();


  return true;

}


/* =========================================================
   49. DATE
========================================================= */

function formatReportDate(
  date
) {

  try {

    return new Intl.DateTimeFormat(
      "ko-KR",
      {
        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    ).format(
      date
    );

  }

  catch {

    return date
      .toLocaleString();

  }

}


/* =========================================================
   50. NULL FORMAT
========================================================= */

function formatNullable(
  value,
  unit = ""
) {

  if (
    !Number.isFinite(
      Number(value)
    )
  ) {

    return "--";

  }


  return (
    `${Number(value)}${unit}`
  );

}


/* =========================================================
   51. TIME FORMAT
========================================================= */

function formatSeconds(
  value
) {

  const seconds =
    Number(value);


  if (
    !Number.isFinite(seconds)
  ) {

    return "--";

  }


  return (
    `${seconds.toFixed(2)}s`
  );

}


/* =========================================================
   52. MESSAGE
========================================================= */

function showReportMessage(
  message,
  type = ""
) {

  const element =
    document.querySelector(
      "[data-report-message]"
    );


  if (!element) {

    console.log(
      "[REPORT]",
      message
    );

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
   53. ESCAPE
========================================================= */

function escapeReportHTML(
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
   54. GET CURRENT REPORT
========================================================= */

function getCurrentReport() {

  return (
    ReportManager.currentReport ||
    null
  );

}


/* =========================================================
   55. GET REPORTS
========================================================= */

function getSavedReports() {

  return [
    ...ReportManager.reports
  ];

}


/* =========================================================
   56. AUTO INIT
========================================================= */

if (
  document.readyState ===
    "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initReports
  );

}

else {

  initReports();

}


/* =========================================================
   57. GLOBAL
========================================================= */

window.REPORT_CONFIG =
  REPORT_CONFIG;

window.ReportManager =
  ReportManager;

window.initReports =
  initReports;

window.createPerformanceReport =
  createPerformanceReport;

window.renderPerformanceReport =
  renderPerformanceReport;

window.saveCurrentReport =
  saveCurrentReport;

window.openReport =
  openReport;

window.deleteReport =
  deleteReport;

window.printPerformanceReport =
  printPerformanceReport;

window.getCurrentReport =
  getCurrentReport;

window.getSavedReports =
  getSavedReports;