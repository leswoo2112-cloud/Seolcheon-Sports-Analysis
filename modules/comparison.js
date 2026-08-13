/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / COMPARISON.JS
   VERSION 1.0

   ELITE PERFORMANCE COMPARISON ENGINE

   기능
   ---------------------------------------------------------
   - 엘리트 / 국가대표 기준 프로필
   - 종목별 기준값 등록
   - 선수 분석 결과 비교
   - 관절각 비교
   - 기술 지표 비교
   - 차이 계산
   - 0~100 근접도 점수
   - 6축 Radar 데이터
   - 개선 우선순위
   - 자동 피드백
   - 리포트 연동

   IMPORTANT
   ---------------------------------------------------------
   실제 국가대표 기준값이 없는 경우
   임의의 숫자를 생성하지 않는다.

   기준 데이터는 관리자 또는 검증된
   데이터셋을 통해 등록해야 한다.
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const COMPARISON_CONFIG = {

  defaultTolerance: 10,

  minimumScore: 0,

  maximumScore: 100,

  radarAxisCount: 6,

  storageKey:
    "seolcheon_elite_benchmarks"

};


/* =========================================================
   02. STATE
========================================================= */

const ComparisonManager = {

  initialized: false,

  benchmarks: {},

  selectedBenchmarkId: null,

  selectedBenchmark: null,

  latestComparison: null

};


/* =========================================================
   03. DEFAULT RADAR AXES

   종목에 따라 실제 값은 변경됨
========================================================= */

const DEFAULT_RADAR_AXES = [

  {
    id: "technique",
    name: "기술 수행"
  },

  {
    id: "symmetry",
    name: "좌우 대칭"
  },

  {
    id: "posture",
    name: "자세 안정성"
  },

  {
    id: "timing",
    name: "타이밍"
  },

  {
    id: "speed",
    name: "속도"
  },

  {
    id: "efficiency",
    name: "동작 효율"
  }

];


/* =========================================================
   04. SPORT RADAR AXES
========================================================= */

const SPORT_RADAR_AXES = {

  biathlon: [

    {
      id: "technique",
      name: "스키 기술"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "posture",
      name: "자세 안정성"
    },

    {
      id: "transition",
      name: "주법 전환"
    },

    {
      id: "speed",
      name: "구간 속도"
    },

    {
      id: "efficiency",
      name: "동작 효율"
    }

  ],


  cross_country: [

    {
      id: "technique",
      name: "주법"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "posture",
      name: "자세"
    },

    {
      id: "cycle",
      name: "사이클"
    },

    {
      id: "speed",
      name: "속도"
    },

    {
      id: "efficiency",
      name: "효율"
    }

  ],


  athletics: [

    {
      id: "acceleration",
      name: "가속"
    },

    {
      id: "stride",
      name: "보폭"
    },

    {
      id: "cadence",
      name: "케이던스"
    },

    {
      id: "posture",
      name: "러닝 자세"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "speed",
      name: "속도"
    }

  ],


  weightlifting: [

    {
      id: "barPath",
      name: "바벨 궤적"
    },

    {
      id: "posture",
      name: "자세"
    },

    {
      id: "timing",
      name: "타이밍"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "speed",
      name: "바벨 속도"
    },

    {
      id: "catch",
      name: "캐치 안정성"
    }

  ],


  skeleton: [

    {
      id: "start",
      name: "스타트"
    },

    {
      id: "push",
      name: "푸시"
    },

    {
      id: "boarding",
      name: "탑승"
    },

    {
      id: "alignment",
      name: "신체 정렬"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "speed",
      name: "속도"
    }

  ],


  swimming: [

    {
      id: "stroke",
      name: "스트로크"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "posture",
      name: "신체 정렬"
    },

    {
      id: "timing",
      name: "타이밍"
    },

    {
      id: "speed",
      name: "속도"
    },

    {
      id: "efficiency",
      name: "효율"
    }

  ],


  cycling: [

    {
      id: "cadence",
      name: "케이던스"
    },

    {
      id: "knee",
      name: "무릎 움직임"
    },

    {
      id: "hip",
      name: "고관절"
    },

    {
      id: "posture",
      name: "상체 자세"
    },

    {
      id: "symmetry",
      name: "좌우 대칭"
    },

    {
      id: "efficiency",
      name: "페달링 효율"
    }

  ]

};


/* =========================================================
   05. INITIALIZE
========================================================= */

function initComparison() {

  if (
    ComparisonManager.initialized
  ) {
    return;
  }


  ComparisonManager.initialized =
    true;


  loadEliteBenchmarks();


  bindComparisonEvents();


  console.log(
    "[COMPARISON] Elite comparison ready"
  );

}


/* =========================================================
   06. EVENTS
========================================================= */

function bindComparisonEvents() {

  /*
     종목 분석 완료
  */

  document.addEventListener(
    "sport:analysis-complete",
    event => {

      const analysis =
        event.detail;


      if (
        !analysis
      ) {
        return;
      }


      const benchmark =
        findBenchmarkForSport(
          analysis.sportId
        );


      if (benchmark) {

        compareWithElite(
          analysis,
          benchmark.id
        );

      }

    }
  );


  document.addEventListener(
    "click",
    handleComparisonClick
  );


  document.addEventListener(
    "change",
    handleComparisonChange
  );

}


/* =========================================================
   07. CLICK
========================================================= */

function handleComparisonClick(event) {

  const compare =
    event.target.closest(
      "[data-action='run-elite-comparison']"
    );


  if (compare) {

    runCurrentEliteComparison();

    return;
  }


  const deleteBenchmark =
    event.target.closest(
      "[data-action='delete-benchmark']"
    );


  if (deleteBenchmark) {

    const id =
      deleteBenchmark.dataset
        .benchmarkId;


    if (id) {

      removeEliteBenchmark(
        id
      );

    }

  }

}


/* =========================================================
   08. CHANGE
========================================================= */

function handleComparisonChange(event) {

  if (
    event.target.matches(
      "[data-benchmark-select]"
    )
  ) {

    selectEliteBenchmark(
      event.target.value
    );

  }

}


/* =========================================================
   09. LOAD BENCHMARKS
========================================================= */

function loadEliteBenchmarks() {

  try {

    const raw =
      localStorage.getItem(
        COMPARISON_CONFIG.storageKey
      );


    if (!raw) {

      ComparisonManager.benchmarks =
        {};

      return;
    }


    const parsed =
      JSON.parse(raw);


    ComparisonManager.benchmarks =
      parsed &&
      typeof parsed === "object"
        ? parsed
        : {};

  }

  catch (error) {

    console.error(
      "[COMPARISON] Benchmark load failed",
      error
    );


    ComparisonManager.benchmarks =
      {};

  }

}


/* =========================================================
   10. SAVE BENCHMARKS
========================================================= */

function saveEliteBenchmarks() {

  try {

    localStorage.setItem(
      COMPARISON_CONFIG.storageKey,

      JSON.stringify(
        ComparisonManager.benchmarks
      )
    );


    return true;

  }

  catch (error) {

    console.error(
      "[COMPARISON] Benchmark save failed",
      error
    );


    return false;

  }

}


/* =========================================================
   11. REGISTER BENCHMARK
========================================================= */

function registerEliteBenchmark(
  data
) {

  if (
    !data ||
    !data.sportId ||
    !data.name
  ) {

    console.warn(
      "[COMPARISON] Invalid benchmark"
    );

    return null;
  }


  const id =
    data.id ||
    (
      "benchmark_" +
      Date.now()
    );


  const benchmark = {

    id,

    name:
      data.name,

    sportId:
      data.sportId,

    level:
      data.level ||
      "elite",

    source:
      data.source ||
      "",

    sourceDate:
      data.sourceDate ||
      null,

    notes:
      data.notes ||
      "",

    metrics:
      data.metrics ||
      {},

    radar:
      data.radar ||
      {},

    createdAt:
      data.createdAt ||
      new Date()
        .toISOString(),

    updatedAt:
      new Date()
        .toISOString()

  };


  ComparisonManager
    .benchmarks[id] =
      benchmark;


  saveEliteBenchmarks();


  renderBenchmarkOptions();


  document.dispatchEvent(
    new CustomEvent(
      "comparison:benchmark-saved",
      {
        detail:
          benchmark
      }
    )
  );


  return benchmark;

}


/* =========================================================
   12. REMOVE BENCHMARK
========================================================= */

function removeEliteBenchmark(
  id
) {

  if (
    !ComparisonManager
      .benchmarks[id]
  ) {
    return false;
  }


  delete ComparisonManager
    .benchmarks[id];


  if (
    ComparisonManager
      .selectedBenchmarkId ===
    id
  ) {

    ComparisonManager
      .selectedBenchmarkId =
        null;


    ComparisonManager
      .selectedBenchmark =
        null;

  }


  saveEliteBenchmarks();


  renderBenchmarkOptions();


  return true;

}


/* =========================================================
   13. FIND BENCHMARK FOR SPORT
========================================================= */

function findBenchmarkForSport(
  sportId
) {

  return (
    Object.values(
      ComparisonManager.benchmarks
    )
      .find(
        benchmark =>
          benchmark.sportId ===
          sportId
      ) ||
    null
  );

}


/* =========================================================
   14. GET SPORT BENCHMARKS
========================================================= */

function getEliteBenchmarksForSport(
  sportId
) {

  return Object
    .values(
      ComparisonManager.benchmarks
    )
    .filter(
      benchmark =>
        benchmark.sportId ===
        sportId
    );

}


/* =========================================================
   15. SELECT BENCHMARK
========================================================= */

function selectEliteBenchmark(
  id
) {

  const benchmark =
    ComparisonManager
      .benchmarks[id];


  if (!benchmark) {

    ComparisonManager
      .selectedBenchmarkId =
        null;


    ComparisonManager
      .selectedBenchmark =
        null;


    return null;
  }


  ComparisonManager
    .selectedBenchmarkId =
      id;


  ComparisonManager
    .selectedBenchmark =
      benchmark;


  renderSelectedBenchmark(
    benchmark
  );


  return benchmark;

}


/* =========================================================
   16. RUN CURRENT COMPARISON
========================================================= */

function runCurrentEliteComparison() {

  const analysis =
    typeof getLatestSportsAnalysis ===
      "function"
        ? getLatestSportsAnalysis()
        : null;


  if (!analysis) {

    showComparisonMessage(
      "먼저 자세분석을 완료해주세요.",
      "error"
    );

    return null;
  }


  let benchmark =
    ComparisonManager
      .selectedBenchmark;


  if (
    !benchmark ||
    benchmark.sportId !==
      analysis.sportId
  ) {

    benchmark =
      findBenchmarkForSport(
        analysis.sportId
      );

  }


  if (!benchmark) {

    showComparisonMessage(
      "이 종목의 엘리트 기준 데이터가 아직 등록되지 않았습니다.",
      "warning"
    );

    return null;
  }


  return compareWithElite(
    analysis,
    benchmark.id
  );

}


/* =========================================================
   17. MAIN COMPARISON
========================================================= */

function compareWithElite(
  analysis,
  benchmarkId
) {

  const benchmark =
    ComparisonManager
      .benchmarks[
        benchmarkId
      ];


  if (
    !analysis ||
    !benchmark
  ) {

    return null;
  }


  if (
    analysis.sportId !==
    benchmark.sportId
  ) {

    showComparisonMessage(
      "분석 종목과 기준 데이터의 종목이 다릅니다.",
      "error"
    );

    return null;
  }


  const metricComparison =
    compareMetrics(
      analysis,
      benchmark
    );


  const radar =
    createRadarComparison(
      analysis,
      benchmark,
      metricComparison
    );


  const priorities =
    createImprovementPriorities(
      metricComparison
    );


  const overall =
    calculateOverallEliteScore(
      metricComparison
    );


  const result = {

    id:
      "comparison_" +
      Date.now(),

    analysisId:
      analysis.id ||
      null,

    sportId:
      analysis.sportId,

    sportName:
      analysis.sportName,

    benchmarkId:
      benchmark.id,

    benchmarkName:
      benchmark.name,

    benchmarkLevel:
      benchmark.level,

    benchmarkSource:
      benchmark.source,

    metrics:
      metricComparison,

    radar,

    overallScore:
      overall,

    priorities,

    feedback:
      createEliteComparisonFeedback(
        metricComparison,
        priorities,
        overall
      ),

    createdAt:
      new Date()
        .toISOString()

  };


  ComparisonManager.latestComparison =
    result;


  renderEliteComparison(
    result
  );


  document.dispatchEvent(
    new CustomEvent(
      "comparison:complete",
      {
        detail:
          result
      }
    )
  );


  return result;

}


/* =========================================================
   18. COMPARE METRICS
========================================================= */

function compareMetrics(
  analysis,
  benchmark
) {

  const results = [];


  const benchmarkMetrics =
    benchmark.metrics ||
    {};


  Object.entries(
    benchmarkMetrics
  )
    .forEach(
      ([key, config]) => {

        const athleteValue =
          getAnalysisMetricValue(
            analysis,
            key
          );


        if (
          !Number.isFinite(
            athleteValue
          )
        ) {
          return;
        }


        const normalizedConfig =
          normalizeBenchmarkMetric(
            config
          );


        if (
          !normalizedConfig
        ) {
          return;
        }


        const comparison =
          compareMetricValue(
            key,
            athleteValue,
            normalizedConfig
          );


        if (comparison) {

          results.push(
            comparison
          );

        }

      }
    );


  return results;

}


/* =========================================================
   19. NORMALIZE BENCHMARK METRIC

   지원 형식:

   kneeAngle: 145

   또는

   kneeAngle: {
      target: 145,
      tolerance: 8,
      direction: "target"
   }

   direction:
   target = 목표값 근접
   higher = 높을수록 좋음
   lower  = 낮을수록 좋음
========================================================= */

function normalizeBenchmarkMetric(
  config
) {

  if (
    Number.isFinite(config)
  ) {

    return {

      target:
        Number(config),

      tolerance:
        COMPARISON_CONFIG
          .defaultTolerance,

      direction:
        "target"

    };

  }


  if (
    !config ||
    typeof config !==
      "object"
  ) {

    return null;
  }


  const target =
    Number(
      config.target
    );


  if (
    !Number.isFinite(target)
  ) {

    return null;
  }


  return {

    target,

    tolerance:
      Number.isFinite(
        Number(
          config.tolerance
        )
      )
        ? Number(
            config.tolerance
          )
        : COMPARISON_CONFIG
            .defaultTolerance,

    direction:
      [
        "target",
        "higher",
        "lower"
      ].includes(
        config.direction
      )
        ? config.direction
        : "target",

    unit:
      config.unit ||
      "",

    weight:
      Number.isFinite(
        Number(
          config.weight
        )
      )
        ? Number(
            config.weight
          )
        : 1

  };

}


/* =========================================================
   20. GET ATHLETE METRIC
========================================================= */

function getAnalysisMetricValue(
  analysis,
  key
) {

  /*
     summary.metrics
  */

  if (
    Number.isFinite(
      analysis.metrics?.[
        key
      ]
    )
  ) {

    return analysis.metrics[key];

  }


  /*
     summary 직접 값
  */

  if (
    Number.isFinite(
      analysis[key]
    )
  ) {

    return analysis[key];

  }


  /*
     Pose angle aliases
  */

  const aliases = {

    trunk:
      "trunkAngle",

    knee:
      "kneeAngle",

    hip:
      "hipAngle",

    symmetryScore:
      "symmetry"

  };


  const alias =
    aliases[key];


  if (
    alias &&
    Number.isFinite(
      analysis.metrics?.[
        alias
      ]
    )
  ) {

    return analysis
      .metrics[alias];

  }


  return null;

}


/* =========================================================
   21. COMPARE ONE METRIC
========================================================= */

function compareMetricValue(
  key,
  athleteValue,
  config
) {

  const target =
    config.target;


  const difference =
    athleteValue -
    target;


  const absoluteDifference =
    Math.abs(
      difference
    );


  let score = null;


  switch (
    config.direction
  ) {

    case "higher":

      if (
        athleteValue >= target
      ) {

        score = 100;

      }

      else {

        score =
          100 -
          (
            (
              target -
              athleteValue
            ) /
            Math.max(
              Math.abs(target),
              0.0001
            )
          ) *
          100;

      }

      break;


    case "lower":

      if (
        athleteValue <= target
      ) {

        score = 100;

      }

      else {

        score =
          100 -
          (
            (
              athleteValue -
              target
            ) /
            Math.max(
              Math.abs(target),
              0.0001
            )
          ) *
          100;

      }

      break;


    case "target":

    default:

      const tolerance =
        Math.max(
          config.tolerance,
          0.0001
        );


      score =
        100 -
        (
          absoluteDifference /
          tolerance
        ) *
        25;

      break;

  }


  score =
    clampComparisonScore(
      score
    );


  return {

    key,

    athleteValue:
      roundComparisonValue(
        athleteValue
      ),

    eliteValue:
      roundComparisonValue(
        target
      ),

    difference:
      roundComparisonValue(
        difference
      ),

    absoluteDifference:
      roundComparisonValue(
        absoluteDifference
      ),

    tolerance:
      config.tolerance,

    direction:
      config.direction,

    unit:
      config.unit ||
      "",

    weight:
      config.weight || 1,

    score:
      roundComparisonValue(
        score
      ),

    grade:
      getComparisonGrade(
        score
      )

  };

}


/* =========================================================
   22. OVERALL SCORE
========================================================= */

function calculateOverallEliteScore(
  metrics
) {

  if (
    !Array.isArray(metrics) ||
    metrics.length === 0
  ) {

    return null;
  }


  let total =
    0;


  let totalWeight =
    0;


  metrics.forEach(
    metric => {

      const weight =
        metric.weight || 1;


      total +=
        metric.score *
        weight;


      totalWeight +=
        weight;

    }
  );


  if (
    totalWeight === 0
  ) {
    return null;
  }


  return roundComparisonValue(
    total /
    totalWeight
  );

}


/* =========================================================
   23. GRADE
========================================================= */

function getComparisonGrade(
  score
) {

  if (
    score >= 95
  ) {
    return "ELITE";
  }


  if (
    score >= 85
  ) {
    return "EXCELLENT";
  }


  if (
    score >= 75
  ) {
    return "GOOD";
  }


  if (
    score >= 60
  ) {
    return "DEVELOPING";
  }


  return "PRIORITY";

}


/* =========================================================
   24. IMPROVEMENT PRIORITY
========================================================= */

function createImprovementPriorities(
  metrics
) {

  return [
    ...metrics
  ]
    .sort(
      (a, b) =>
        a.score -
        b.score
    )
    .slice(
      0,
      5
    )
    .map(
      (
        metric,
        index
      ) => ({

        rank:
          index + 1,

        metric:
          metric.key,

        score:
          metric.score,

        athleteValue:
          metric.athleteValue,

        eliteValue:
          metric.eliteValue,

        difference:
          metric.difference

      })
    );

}


/* =========================================================
   25. RADAR
========================================================= */

function createRadarComparison(
  analysis,
  benchmark,
  metricComparison
) {

  const axes =
    getRadarAxesForSport(
      analysis.sportId
    );


  const athleteScores = [];


  const eliteScores = [];


  axes.forEach(
    axis => {

      let athleteScore =
        getRadarMetricScore(
          axis.id,
          analysis,
          metricComparison
        );


      /*
         benchmark.radar에 검증된 점수가
         직접 등록되어 있으면 사용 가능
      */

      const eliteRadar =
        Number(
          benchmark.radar?.[
            axis.id
          ]
        );


      if (
        !Number.isFinite(
          athleteScore
        )
      ) {

        athleteScore =
          null;

      }


      athleteScores.push(
        athleteScore
      );


      eliteScores.push(
        Number.isFinite(
          eliteRadar
        )
          ? clampComparisonScore(
              eliteRadar
            )
          : 100
      );

  });


  return {

    labels:
      axes.map(
        axis =>
          axis.name
      ),

    keys:
      axes.map(
        axis =>
          axis.id
      ),

    athlete:
      athleteScores,

    elite:
      eliteScores

  };

}


/* =========================================================
   26. RADAR SCORE
========================================================= */

function getRadarMetricScore(
  axisId,
  analysis,
  comparisons
) {

  /*
     직접 비교 항목
  */

  const direct =
    comparisons.find(
      item =>
        item.key ===
        axisId
    );


  if (direct) {

    return direct.score;

  }


  /*
     공통 매핑
  */

  switch (
    axisId
  ) {

    case "symmetry":

      if (
        Number.isFinite(
          analysis.metrics
            ?.symmetry
        )
      ) {

        return clampComparisonScore(
          analysis.metrics
            .symmetry
        );

      }

      break;


    case "posture":

      return averageComparisonScores(
        comparisons,
        [
          "trunkAngle",
          "kneeAngle",
          "hipAngle"
        ]
      );


    case "technique":

      return averageComparisonScores(
        comparisons,
        [
          "trunkAngle",
          "kneeAngle",
          "hipAngle",
          "symmetry"
        ]
      );


    case "efficiency":

      return averageComparisonScores(
        comparisons,
        [
          "symmetry",
          "trunkAngle",
          "kneeAngle"
        ]
      );


    case "knee":

      return findComparisonScore(
        comparisons,
        "kneeAngle"
      );


    case "hip":

      return findComparisonScore(
        comparisons,
        "hipAngle"
      );


    case "alignment":

      return averageComparisonScores(
        comparisons,
        [
          "trunkAngle",
          "symmetry"
        ]
      );

  }


  return null;

}


/* =========================================================
   27. FIND COMPARISON SCORE
========================================================= */

function findComparisonScore(
  comparisons,
  key
) {

  const metric =
    comparisons.find(
      item =>
        item.key === key
    );


  return metric
    ? metric.score
    : null;

}


/* =========================================================
   28. AVERAGE COMPARISON SCORES
========================================================= */

function averageComparisonScores(
  comparisons,
  keys
) {

  const values =
    keys

      .map(
        key =>
          findComparisonScore(
            comparisons,
            key
          )
      )

      .filter(
        value =>
          Number.isFinite(
            value
          )
      );


  if (
    values.length === 0
  ) {

    return null;
  }


  return roundComparisonValue(

    values.reduce(
      (a, b) =>
        a + b,
      0
    ) /
    values.length

  );

}


/* =========================================================
   29. RADAR AXES
========================================================= */

function getRadarAxesForSport(
  sportId
) {

  return (
    SPORT_RADAR_AXES[
      sportId
    ] ||
    DEFAULT_RADAR_AXES
  );

}


/* =========================================================
   30. FEEDBACK
========================================================= */

function createEliteComparisonFeedback(
  metrics,
  priorities,
  overall
) {

  const feedback = [];


  if (
    Number.isFinite(overall)
  ) {

    if (
      overall >= 90
    ) {

      feedback.push(
        "등록된 엘리트 기준과 높은 수준의 근접도를 보입니다."
      );

    }

    else if (
      overall >= 75
    ) {

      feedback.push(
        "전체적으로 안정적이지만 일부 기술 지표에서 엘리트 기준과 차이가 있습니다."
      );

    }

    else {

      feedback.push(
        "여러 기술 지표에서 기준값과 차이가 확인됩니다. 우선순위 항목부터 점검하세요."
      );

    }

  }


  priorities
    .slice(
      0,
      3
    )
    .forEach(
      priority => {

        feedback.push(

          `${formatComparisonMetricName(
            priority.metric
          )}: 현재 ${
            priority.athleteValue
          }, 기준 ${
            priority.eliteValue
          }`

        );

      }
    );


  return feedback;

}


/* =========================================================
   31. METRIC NAME
========================================================= */

function formatComparisonMetricName(
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
      "탑승 시간"

  };


  return (
    names[key] ||
    key
  );

}


/* =========================================================
   32. RENDER BENCHMARK OPTIONS
========================================================= */

function renderBenchmarkOptions() {

  document
    .querySelectorAll(
      "[data-benchmark-select]"
    )
    .forEach(
      select => {

        const sportId =
          window
            .SportsAnalysisManager
            ?.sportId ||
          null;


        const benchmarks =
          sportId
            ? getEliteBenchmarksForSport(
                sportId
              )
            : Object.values(
                ComparisonManager
                  .benchmarks
              );


        select.innerHTML = `

          <option value="">
            기준 프로필 선택
          </option>

          ${benchmarks
            .map(
              item => `

                <option
                  value="${escapeComparisonHTML(
                    item.id
                  )}"
                >
                  ${escapeComparisonHTML(
                    item.name
                  )}
                </option>

              `
            )
            .join("")}

        `;

      }
    );

}


/* =========================================================
   33. RENDER SELECTED BENCHMARK
========================================================= */

function renderSelectedBenchmark(
  benchmark
) {

  setComparisonText(
    "benchmark-name",
    benchmark.name
  );


  setComparisonText(
    "benchmark-level",
    benchmark.level
  );


  setComparisonText(
    "benchmark-source",
    benchmark.source ||
    "출처 미등록"
  );

}


/* =========================================================
   34. RENDER RESULT
========================================================= */

function renderEliteComparison(
  result
) {

  setComparisonText(
    "elite-overall-score",
    Number.isFinite(
      result.overallScore
    )
      ? `${result.overallScore}/100`
      : "--"
  );


  setComparisonText(
    "elite-benchmark-name",
    result.benchmarkName
  );


  const container =
    document.querySelector(
      "[data-comparison-results]"
    );


  if (container) {

    container.innerHTML =
      result.metrics
        .map(
          metric => `

            <div class="comparison-metric-row">

              <div class="comparison-metric-name">

                ${escapeComparisonHTML(
                  formatComparisonMetricName(
                    metric.key
                  )
                )}

              </div>

              <div class="comparison-athlete-value">

                <span>선수</span>

                <strong>
                  ${metric.athleteValue}${
                    escapeComparisonHTML(
                      metric.unit
                    )
                  }
                </strong>

              </div>

              <div class="comparison-elite-value">

                <span>ELITE</span>

                <strong>
                  ${metric.eliteValue}${
                    escapeComparisonHTML(
                      metric.unit
                    )
                  }
                </strong>

              </div>

              <div class="comparison-score">

                <strong>
                  ${metric.score}
                </strong>

                <span>
                  /100
                </span>

              </div>

            </div>

          `
        )
        .join("");

  }


  renderImprovementPriorities(
    result.priorities
  );


  /*
     reports.js / chart 모듈에서
     이 이벤트의 radar 데이터를 사용한다.
  */

  document.dispatchEvent(
    new CustomEvent(
      "comparison:radar-ready",
      {
        detail:
          result.radar
      }
    )
  );


  showComparisonMessage(
    "엘리트 비교 분석 완료",
    "success"
  );

}


/* =========================================================
   35. PRIORITY UI
========================================================= */

function renderImprovementPriorities(
  priorities
) {

  const container =
    document.querySelector(
      "[data-improvement-priorities]"
    );


  if (!container) {
    return;
  }


  if (
    !priorities ||
    priorities.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        비교 가능한 지표가 없습니다.
      </div>

    `;

    return;
  }


  container.innerHTML =
    priorities
      .map(
        item => `

          <div class="priority-item">

            <span class="priority-rank">
              ${item.rank}
            </span>

            <div>

              <strong>
                ${escapeComparisonHTML(
                  formatComparisonMetricName(
                    item.metric
                  )
                )}
              </strong>

              <span>
                근접도 ${item.score}/100
              </span>

            </div>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   36. MESSAGE
========================================================= */

function showComparisonMessage(
  message,
  type = ""
) {

  const element =
    document.querySelector(
      "[data-comparison-message]"
    );


  if (!element) {

    console.log(
      "[COMPARISON]",
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
   37. TEXT
========================================================= */

function setComparisonText(
  id,
  value
) {

  const element =
    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   38. UTILITY
========================================================= */

function clampComparisonScore(
  value
) {

  return Math.max(

    COMPARISON_CONFIG
      .minimumScore,

    Math.min(

      COMPARISON_CONFIG
        .maximumScore,

      Number(value) || 0

    )

  );

}


function roundComparisonValue(
  value
) {

  return Number(
    Number(value)
      .toFixed(2)
  );

}


/* =========================================================
   39. HTML ESCAPE
========================================================= */

function escapeComparisonHTML(
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
   40. GET LATEST COMPARISON
========================================================= */

function getLatestEliteComparison() {

  return (
    ComparisonManager
      .latestComparison ||
    null
  );

}


/* =========================================================
   41. EXPORT REPORT DATA
========================================================= */

function getEliteComparisonReportData() {

  const comparison =
    getLatestEliteComparison();


  if (!comparison) {
    return null;
  }


  return {

    benchmark: {

      id:
        comparison.benchmarkId,

      name:
        comparison.benchmarkName,

      level:
        comparison.benchmarkLevel,

      source:
        comparison.benchmarkSource

    },

    overallScore:
      comparison.overallScore,

    metrics:
      comparison.metrics,

    radar:
      comparison.radar,

    priorities:
      comparison.priorities,

    feedback:
      comparison.feedback

  };

}


/* =========================================================
   42. AUTO INIT
========================================================= */

if (
  document.readyState ===
    "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initComparison
  );

}

else {

  initComparison();

}


/* =========================================================
   43. GLOBAL
========================================================= */

window.COMPARISON_CONFIG =
  COMPARISON_CONFIG;

window.ComparisonManager =
  ComparisonManager;

window.SPORT_RADAR_AXES =
  SPORT_RADAR_AXES;

window.initComparison =
  initComparison;

window.registerEliteBenchmark =
  registerEliteBenchmark;

window.removeEliteBenchmark =
  removeEliteBenchmark;

window.findBenchmarkForSport =
  findBenchmarkForSport;

window.getEliteBenchmarksForSport =
  getEliteBenchmarksForSport;

window.selectEliteBenchmark =
  selectEliteBenchmark;

window.runCurrentEliteComparison =
  runCurrentEliteComparison;

window.compareWithElite =
  compareWithElite;

window.getRadarAxesForSport =
  getRadarAxesForSport;

window.getLatestEliteComparison =
  getLatestEliteComparison;

window.getEliteComparisonReportData =
  getEliteComparisonReportData;

window.renderBenchmarkOptions =
  renderBenchmarkOptions;