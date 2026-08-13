/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / REPORT-CONTROLLER.JS

   PERFORMANCE REPORT ENGINE

   기능
   - 선수 분석 리포트
   - 육각형 퍼포먼스 그래프
   - 자세분석 이미지
   - 관절각 이미지
   - 3D 분석 결과
   - 종목별 데이터
   - 구간 분석
   - 국가대표 / 엘리트 비교
   - 자동 피드백
   - 추천 훈련
   - 인쇄 / PDF 저장용 화면
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const REPORT_CONFIG = {

  title:
    "설천고 스포츠 퍼포먼스 분석 리포트",

  organization:
    "설천고 스포츠과학 분석센터",

  version:
    "1.0.0"

};


/* =========================================================
   02. STATE
========================================================= */

const REPORT_STATE = {

  currentResult:
    null,

  radarChart:
    null,

  initialized:
    false

};


/* =========================================================
   03. DOM
========================================================= */

function reportElement(selector) {

  return document.querySelector(
    selector
  );

}


function reportElements(selector) {

  return [
    ...document.querySelectorAll(
      selector
    )
  ];

}


/* =========================================================
   04. SAFE
========================================================= */

function reportSafe(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return "-";

  }

  return String(value);

}


/* =========================================================
   05. DATE
========================================================= */

function formatReportDate(value) {

  const date =
    value
      ? new Date(value)
      : new Date();


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return date.toLocaleString(
    "ko-KR"
  );

}


/* =========================================================
   06. SCORE
========================================================= */

function normalizeReportScore(
  value
) {

  const number =
    Number(value);


  if (
    !Number.isFinite(number)
  ) {

    return 0;

  }


  return Math.max(
    0,
    Math.min(
      100,
      number
    )
  );

}


/* =========================================================
   07. REPORT DATA
========================================================= */

function createReportData(
  result
) {

  const scores =
    result?.scores || {};


  return {

    title:
      REPORT_CONFIG.title,

    athlete:
      result?.athlete || {},

    analysis:
      result?.analysis || {},

    scores: {

      posture:
        normalizeReportScore(
          scores.posture ??
          scores.postureStability
        ),

      symmetry:
        normalizeReportScore(
          scores.symmetry
        ),

      technique:
        normalizeReportScore(
          scores.technique
        ),

      stability:
        normalizeReportScore(
          scores.stability
        ),

      efficiency:
        normalizeReportScore(
          scores.efficiency ??
          scores.coordination
        ),

      elite:
        normalizeReportScore(
          scores.elite ??
          scores.eliteSimilarity
        )

    },

    angles:
      result?.angles || {},

    images:
      result?.images || {},

    segments:
      result?.segments || [],

    sportSpecific:
      result?.sportSpecific || {},

    technique:
      result?.technique || {},

    threeD:
      result?.threeD || {},

    eliteComparison:
      result?.eliteComparison || {},

    feedback:
      result?.feedback || [],

    training:
      result?.trainingRecommendations || [],

    createdAt:
      result?.completedAt ||
      result?.createdAt ||
      new Date().toISOString()

  };

}


/* =========================================================
   08. OPEN REPORT
========================================================= */

function openReport(
  result
) {

  if (!result) {

    showReportMessage(
      "표시할 분석 결과가 없습니다.",
      "error"
    );

    return;

  }


  REPORT_STATE.currentResult =
    result;


  const data =
    createReportData(
      result
    );


  renderReport(
    data
  );


  /*
     페이지 이동
  */

  if (
    window.SeolcheonApp &&
    typeof window
      .SeolcheonApp
      .navigate ===
      "function"
  ) {

    window.SeolcheonApp
      .navigate(
        "report"
      );

  }

  else {

    reportElements(
      "[data-page]"
    )
    .forEach(
      page => {

        page.hidden =
          page.dataset.page !==
          "report";

      }
    );

  }


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:report-opened",
      {
        detail: {
          result,
          data
        }
      }
    )
  );

}


/* =========================================================
   09. RENDER
========================================================= */

function renderReport(
  data
) {

  renderReportHeader(
    data
  );

  renderReportScores(
    data
  );

  renderRadarChart(
    data
  );

  renderReportImages(
    data
  );

  renderAngleTable(
    data
  );

  renderSportSpecificData(
    data
  );

  renderSegmentData(
    data
  );

  renderTechniqueData(
    data
  );

  render3DData(
    data
  );

  renderEliteComparison(
    data
  );

  renderFeedback(
    data
  );

  renderTrainingRecommendations(
    data
  );

}


/* =========================================================
   10. HEADER
========================================================= */

function renderReportHeader(
  data
) {

  setReportText(
    "[data-report-title]",
    data.title
  );


  setReportText(
    "[data-report-athlete]",
    data.athlete.name
  );


  setReportText(
    "[data-report-school]",
    data.athlete.school ||
    "설천고"
  );


  setReportText(
    "[data-report-grade]",
    data.athlete.grade
  );


  setReportText(
    "[data-report-sport]",
    data.analysis.sportName ||
    data.analysis.sport
  );


  setReportText(
    "[data-report-date]",
    formatReportDate(
      data.createdAt
    )
  );


  setReportText(
    "[data-report-mode]",
    data.analysis.mode ===
      "realtime"
        ? "실시간 분석"
        : "영상 분석"
  );

}


/* =========================================================
   11. SET TEXT
========================================================= */

function setReportText(
  selector,
  value
) {

  reportElements(
    selector
  )
  .forEach(
    element => {

      element.textContent =
        reportSafe(
          value
        );

    }
  );

}


/* =========================================================
   12. SCORES
========================================================= */

function renderReportScores(
  data
) {

  const scores =
    data.scores;


  Object.entries(
    scores
  )
  .forEach(
    ([key, value]) => {

      reportElements(
        `[data-report-score="${key}"]`
      )
      .forEach(
        element => {

          element.textContent =
            Math.round(value);

        }
      );

    }
  );


  const values =
    Object.values(
      scores
    );


  const overall =
    values.length
      ? values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / values.length
      : 0;


  setReportText(
    "[data-report-overall]",
    Math.round(overall)
  );

}


/* =========================================================
   13. RADAR / HEXAGON CHART
========================================================= */

function renderRadarChart(
  data
) {

  const canvas =
    reportElement(
      "[data-report-radar]"
    );


  if (!canvas) {

    return;

  }


  /*
     Chart.js가 없는 경우에도
     전체 리포트는 계속 작동.
  */

  if (
    typeof Chart ===
    "undefined"
  ) {

    console.warn(
      "[SEOLCHEON] Chart.js not loaded"
    );

    return;

  }


  if (
    REPORT_STATE.radarChart
  ) {

    REPORT_STATE
      .radarChart
      .destroy();

  }


  REPORT_STATE.radarChart =
    new Chart(
      canvas,
      {

        type:
          "radar",

        data: {

          labels: [

            "자세 안정성",
            "좌우 대칭",
            "기술 수행",
            "동작 안정성",
            "효율성",
            "엘리트 근접도"

          ],

          datasets: [

            {

              label:
                "Performance",

              data: [

                data.scores
                  .posture,

                data.scores
                  .symmetry,

                data.scores
                  .technique,

                data.scores
                  .stability,

                data.scores
                  .efficiency,

                data.scores
                  .elite

              ],

              borderWidth:
                2,

              pointRadius:
                4,

              fill:
                true

            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          animation:
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
                false

            }

          }

        }

      }
    );

}


/* =========================================================
   14. IMAGES
========================================================= */

function renderReportImages(
  data
) {

  setReportImage(
    "[data-report-image='snapshot']",
    data.images.snapshot
  );


  setReportImage(
    "[data-report-image='pose']",
    data.images.pose
  );


  setReportImage(
    "[data-report-image='angles']",
    data.images.angles
  );


  setReportImage(
    "[data-report-image='trajectory']",
    data.images.trajectory
  );


  setReportImage(
    "[data-report-image='threeD']",
    data.images.threeD
  );

}


/* =========================================================
   15. IMAGE SET
========================================================= */

function setReportImage(
  selector,
  source
) {

  const image =
    reportElement(
      selector
    );


  if (!image) {

    return;

  }


  if (source) {

    image.src =
      source;

    image.hidden =
      false;


    const empty =
      image.parentElement
        ?.querySelector(
          "[data-image-empty]"
        );


    if (empty) {

      empty.hidden =
        true;

    }

  }

  else {

    image.removeAttribute(
      "src"
    );

    image.hidden =
      true;


    const empty =
      image.parentElement
        ?.querySelector(
          "[data-image-empty]"
        );


    if (empty) {

      empty.hidden =
        false;

    }

  }

}


/* =========================================================
   16. ANGLES
========================================================= */

function renderAngleTable(
  data
) {

  const container =
    reportElement(
      "[data-report-angles]"
    );


  if (!container) {

    return;

  }


  const angles =
    data.angles || {};


  const entries =
    Object.entries(
      angles
    );


  if (
    entries.length ===
    0
  ) {

    container.innerHTML =
      "<p>관절각 데이터가 없습니다.</p>";

    return;

  }


  const labels = {

    trunk:
      "몸통",

    leftShoulder:
      "왼쪽 어깨",

    rightShoulder:
      "오른쪽 어깨",

    leftElbow:
      "왼쪽 팔꿈치",

    rightElbow:
      "오른쪽 팔꿈치",

    leftHip:
      "왼쪽 고관절",

    rightHip:
      "오른쪽 고관절",

    leftKnee:
      "왼쪽 무릎",

    rightKnee:
      "오른쪽 무릎",

    leftAnkle:
      "왼쪽 발목",

    rightAnkle:
      "오른쪽 발목"

  };


  container.innerHTML =
    entries
      .map(
        ([joint, value]) => `

          <div
            class="report-angle-row"
          >

            <span>
              ${labels[joint] || joint}
            </span>

            <strong>
              ${
                Number.isFinite(
                  Number(value)
                )
                  ? Number(value)
                      .toFixed(1)
                  : "-"
              }°
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   17. SPORT DATA
========================================================= */

function renderSportSpecificData(
  data
) {

  const container =
    reportElement(
      "[data-report-sport-data]"
    );


  if (!container) {

    return;

  }


  const sport =
    data.analysis.sport;


  const sportData =
    data.sportSpecific[
      sport
    ] || {};


  const entries =
    Object.entries(
      sportData
    )
    .filter(
      ([key]) =>
        ![
          "angles",
          "trajectory"
        ].includes(key)
    );


  if (
    entries.length ===
    0
  ) {

    container.innerHTML =
      "<p>종목별 분석 데이터가 없습니다.</p>";

    return;

  }


  const labels =
    window
      .SeolcheonSportAnalysis
      ?.metricLabels ||
    {};


  container.innerHTML =
    entries
      .map(
        ([key, value]) => {

          const info =
            labels[key] ||
            [key, ""];


          const printable =
            typeof value ===
            "object"
              ? JSON.stringify(
                  value
                )
              : value;


          return `

            <div
              class="report-data-card"
            >

              <span>
                ${info[0]}
              </span>

              <strong>
                ${reportSafe(printable)}
              </strong>

              <small>
                ${info[1] || ""}
              </small>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   18. SEGMENTS
========================================================= */

function renderSegmentData(
  data
) {

  const container =
    reportElement(
      "[data-report-segments]"
    );


  if (!container) {

    return;

  }


  if (
    !data.segments.length
  ) {

    container.innerHTML =
      "<p>구간 데이터가 없습니다.</p>";

    return;

  }


  container.innerHTML =
    data.segments
      .map(
        (segment, index) => `

          <div
            class="report-segment-row"
          >

            <strong>
              ${
                segment.name ||
                `구간 ${index + 1}`
              }
            </strong>

            <span>
              거리
              ${
                reportSafe(
                  segment.distance
                )
              } m
            </span>

            <span>
              시간
              ${
                reportSafe(
                  segment.duration
                )
              } 초
            </span>

            <span>
              속도
              ${
                reportSafe(
                  segment.speed
                )
              }
            </span>

            <span>
              ${
                segment.technique
                  ? `주법 ${segment.technique}`
                  : ""
              }
            </span>

            <span>
              ${
                segment.slope !==
                  undefined
                  ? `경사 ${segment.slope}%`
                  : ""
              }
            </span>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   19. TECHNIQUE
========================================================= */

function renderTechniqueData(
  data
) {

  const current =
    reportElement(
      "[data-report-current-technique]"
    );


  if (current) {

    current.textContent =
      reportSafe(
        data.technique.current
      );

  }


  const detected =
    reportElement(
      "[data-report-techniques]"
    );


  if (detected) {

    const list =
      data.technique.detected ||
      [];


    detected.innerHTML =
      list.length
        ? list
            .map(
              item =>
                `<span class="report-chip">${item}</span>`
            )
            .join("")
        : "<span>-</span>";

  }


  setReportText(
    "[data-report-transition-count]",
    data.technique
      .transitions
      ?.length ||
    0
  );

}


/* =========================================================
   20. 3D
========================================================= */

function render3DData(
  data
) {

  const container =
    reportElement(
      "[data-report-3d]"
    );


  if (!container) {

    return;

  }


  const threeD =
    data.threeD || {};


  if (
    Object.keys(
      threeD
    ).length ===
    0
  ) {

    container.innerHTML =
      "<p>3D 분석 데이터가 없습니다.</p>";

    return;

  }


  const values = [

    [
      "3D 자세 점수",
      threeD.score
    ],

    [
      "신체 정렬",
      threeD.alignment
    ],

    [
      "좌우 대칭",
      threeD.symmetry
    ],

    [
      "회전",
      threeD.rotation
    ],

    [
      "무게중심",
      threeD.centerOfMass
    ]

  ];


  container.innerHTML =
    values
      .filter(
        ([, value]) =>
          value !== undefined
      )
      .map(
        ([label, value]) => `

          <div
            class="report-data-card"
          >

            <span>
              ${label}
            </span>

            <strong>
              ${reportSafe(value)}
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   21. ELITE COMPARISON
========================================================= */

function renderEliteComparison(
  data
) {

  const container =
    reportElement(
      "[data-report-elite]"
    );


  if (!container) {

    return;

  }


  const comparison =
    data.eliteComparison ||
    {};


  const entries =
    Object.entries(
      comparison
    );


  if (
    entries.length ===
    0
  ) {

    container.innerHTML =
      "<p>엘리트 비교 데이터가 없습니다.</p>";

    return;

  }


  container.innerHTML =
    entries
      .map(
        ([key, value]) => `

          <div
            class="elite-comparison-row"
          >

            <span>
              ${key}
            </span>

            <strong>
              ${
                typeof value ===
                "object"
                  ? JSON.stringify(
                      value
                    )
                  : reportSafe(
                      value
                    )
              }
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   22. AUTO FEEDBACK
========================================================= */

function generateAutomaticFeedback(
  data
) {

  const feedback = [];


  if (
    data.scores.posture <
    70
  ) {

    feedback.push(
      "동작 중 신체 정렬과 중심 유지 능력을 우선적으로 개선할 필요가 있습니다."
    );

  }


  if (
    data.scores.symmetry <
    70
  ) {

    feedback.push(
      "좌우 동작 차이가 확인됩니다. 좌우 관절각과 힘 전달 패턴을 비교해 보세요."
    );

  }


  if (
    data.scores.technique <
    70
  ) {

    feedback.push(
      "종목 기술 수행 점수가 낮습니다. 동작을 구간별로 나누어 기술 타이밍을 교정하는 것이 좋습니다."
    );

  }


  if (
    data.scores.stability <
    70
  ) {

    feedback.push(
      "동작 안정성 향상을 위해 감속·착지·균형 제어 능력을 함께 훈련하는 것이 좋습니다."
    );

  }


  if (
    data.scores.elite >=
    85
  ) {

    feedback.push(
      "엘리트 기준과 높은 유사도를 보입니다. 작은 타이밍 차이와 효율성을 중심으로 분석하세요."
    );

  }


  /*
     바이애슬론
  */

  if (
    data.analysis.sport ===
    "biathlon"
  ) {

    feedback.push(
      "바이애슬론은 평지·오르막·내리막을 분리해 구간 속도와 주법 전환 시점을 비교하세요."
    );

  }


  /*
     역도
  */

  if (
    data.analysis.sport ===
    "weightlifting"
  ) {

    feedback.push(
      "역도는 바벨의 수직 궤적과 신체에서 떨어지는 수평 편차를 함께 확인하세요."
    );

  }


  return feedback;

}


/* =========================================================
   23. RENDER FEEDBACK
========================================================= */

function renderFeedback(
  data
) {

  const container =
    reportElement(
      "[data-report-feedback]"
    );


  if (!container) {

    return;

  }


  const automatic =
    generateAutomaticFeedback(
      data
    );


  const supplied =
    Array.isArray(
      data.feedback
    )
      ? data.feedback
      : [];


  const feedback = [
    ...supplied,
    ...automatic
  ];


  if (!feedback.length) {

    container.innerHTML =
      "<p>현재 추가 피드백이 없습니다.</p>";

    return;

  }


  container.innerHTML =
    feedback
      .map(
        item => `

          <div
            class="feedback-item"
          >
            ${reportSafe(
              typeof item ===
                "object"
                  ? item.text ||
                    item.message
                  : item
            )}
          </div>

        `
      )
      .join("");

}


/* =========================================================
   24. TRAINING DATABASE
========================================================= */

const REPORT_TRAINING_LIBRARY = {

  posture: [

    "데드버그",
    "버드독",
    "플랭크",
    "사이드 플랭크",
    "팔로프 프레스",
    "케이블 안티로테이션",
    "싱글레그 밸런스",
    "월 드릴",
    "스플릿 스탠스 안정화"

  ],

  symmetry: [

    "불가리안 스플릿 스쿼트",
    "싱글레그 RDL",
    "스텝업",
    "리버스 런지",
    "싱글암 로우",
    "싱글암 프레스",
    "싱글레그 브리지",
    "라테랄 스텝다운"

  ],

  stability: [

    "드롭 랜딩",
    "스틱 랜딩",
    "싱글레그 착지",
    "라테랄 바운드",
    "스케이터 점프",
    "밸런스 리치",
    "감속 드릴",
    "코펜하겐 플랭크"

  ],

  speed: [

    "A-Skip",
    "Wall Sprint",
    "10m 가속질주",
    "20m 가속질주",
    "Flying Sprint",
    "Resisted March",
    "Pogo Jump",
    "Ankling"

  ],

  power: [

    "박스 점프",
    "브로드 점프",
    "스쿼트 점프",
    "메디신볼 스로우",
    "점프 스쿼트",
    "하이풀",
    "푸시 프레스",
    "바운딩"

  ],

  ski: [

    "스키 밸런스 드릴",
    "싱글스키 글라이드",
    "V1 타이밍 드릴",
    "V2 타이밍 드릴",
    "V2 Alternate 드릴",
    "폴링 타이밍 드릴",
    "오르막 주법 전환 드릴",
    "평지 글라이드 드릴",
    "코너 진입 드릴",
    "다운힐 턱 자세 드릴",
    "롤러스키 테크닉 드릴",
    "더블폴링 드릴"

  ],

  running: [

    "A-March",
    "A-Skip",
    "B-Skip",
    "Straight Leg Bound",
    "High Knee",
    "Ankling",
    "Wall Drill",
    "Acceleration Drill",
    "Cadence Drill",
    "Stride Drill",
    "Wicket Run",
    "Flying Sprint"

  ],

  weightlifting: [

    "Tall Clean",
    "Tall Snatch",
    "Hang Clean",
    "Hang Snatch",
    "Clean Pull",
    "Snatch Pull",
    "High Pull",
    "Front Squat",
    "Overhead Squat",
    "Pause Squat",
    "Clean Deadlift",
    "Snatch Deadlift",
    "Push Press",
    "Power Jerk",
    "Split Jerk",
    "Jerk Balance"

  ]

};


/* =========================================================
   25. GENERATE TRAINING
========================================================= */

function generateTrainingRecommendations(
  data
) {

  const training =
    [];


  if (
    data.scores.posture <
    75
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .posture
        .slice(0, 4)
    );

  }


  if (
    data.scores.symmetry <
    75
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .symmetry
        .slice(0, 4)
    );

  }


  if (
    data.scores.stability <
    75
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .stability
        .slice(0, 4)
    );

  }


  const sport =
    data.analysis.sport;


  if (
    sport ===
    "biathlon" ||
    sport ===
    "crossCountry"
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .ski
    );

  }


  if (
    [
      "sprint",
      "middleDistance",
      "longDistance",
      "hurdles",
      "raceWalking"
    ].includes(sport)
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .running
    );

  }


  if (
    sport ===
    "weightlifting"
  ) {

    training.push(
      ...REPORT_TRAINING_LIBRARY
        .weightlifting
    );

  }


  return [
    ...new Set(
      training
    )
  ];

}


/* =========================================================
   26. RENDER TRAINING
========================================================= */

function renderTrainingRecommendations(
  data
) {

  const container =
    reportElement(
      "[data-report-training]"
    );


  if (!container) {

    return;

  }


  const automatic =
    generateTrainingRecommendations(
      data
    );


  const supplied =
    Array.isArray(
      data.training
    )
      ? data.training
      : [];


  const training = [
    ...new Set([
      ...supplied,
      ...automatic
    ])
  ];


  if (!training.length) {

    container.innerHTML =
      "<p>추가 추천 훈련이 없습니다.</p>";

    return;

  }


  container.innerHTML =
    training
      .map(
        (exercise, index) => `

          <div
            class="training-recommendation"
          >

            <span>
              ${
                String(
                  index + 1
                ).padStart(
                  2,
                  "0"
                )
              }
            </span>

            <strong>
              ${reportSafe(
                exercise
              )}
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   27. PRINT
========================================================= */

function printReport() {

  if (
    !REPORT_STATE.currentResult
  ) {

    showReportMessage(
      "출력할 리포트가 없습니다.",
      "error"
    );

    return;

  }


  window.print();

}


/* =========================================================
   28. REPORT FILE NAME
========================================================= */

function createReportFileName() {

  const result =
    REPORT_STATE.currentResult;


  if (!result) {

    return "설천고_스포츠분석리포트";

  }


  const athlete =
    result.athlete?.name ||
    "선수";


  const sport =
    result.analysis?.sportName ||
    result.analysis?.sport ||
    "종목";


  const date =
    new Date()
      .toISOString()
      .slice(0, 10);


  return (
    `설천고_${athlete}_${sport}_퍼포먼스분석_${date}`
  );

}


/* =========================================================
   29. MESSAGE
========================================================= */

function showReportMessage(
  message,
  type = "info"
) {

  const element =
    reportElement(
      "[data-report-message]"
    );


  if (element) {

    element.textContent =
      message;

    element.dataset.type =
      type;

  }


  console.log(
    `[SEOLCHEON REPORT] ${message}`
  );

}


/* =========================================================
   30. BUTTONS
========================================================= */

function bindReportButtons() {

  const print =
    reportElement(
      "[data-report-print]"
    );


  if (print) {

    print.addEventListener(
      "click",
      printReport
    );

  }


  const back =
    reportElement(
      "[data-report-back]"
    );


  if (back) {

    back.addEventListener(
      "click",
      () => {

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

      }
    );

  }

}


/* =========================================================
   31. REPORT EVENT
========================================================= */

function bindReportEvents() {

  window.addEventListener(
    "seolcheon:open-report",
    event => {

      const result =
        event.detail?.result;


      if (result) {

        openReport(
          result
        );

      }

    }
  );

}


/* =========================================================
   32. INITIALIZE
========================================================= */

function initializeReportController() {

  if (
    REPORT_STATE.initialized
  ) {

    return;

  }


  bindReportButtons();

  bindReportEvents();


  REPORT_STATE.initialized =
    true;


  console.log(
    "[SEOLCHEON] Report Controller Ready"
  );

}


/* =========================================================
   33. AUTO INIT
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeReportController
  );

}

else {

  initializeReportController();

}


/* =========================================================
   34. PUBLIC API
========================================================= */

window.SeolcheonReport = {

  config:
    REPORT_CONFIG,

  state:
    REPORT_STATE,

  init:
    initializeReportController,

  open:
    openReport,

  render:
    renderReport,

  createData:
    createReportData,

  feedback:
    generateAutomaticFeedback,

  training:
    generateTrainingRecommendations,

  print:
    printReport,

  fileName:
    createReportFileName

};


/* =========================================================
   END
========================================================= */