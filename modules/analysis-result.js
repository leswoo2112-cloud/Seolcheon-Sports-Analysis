/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / ANALYSIS-RESULT.JS

   ANALYSIS RESULT CORE

   역할
   - 실시간 분석 결과 통합
   - 영상 분석 결과 통합
   - 종목별 분석 결과 표준화
   - 관절각 저장
   - 스켈레톤 데이터
   - 구간 / 거리 / 시간 / 속도
   - 종목별 기술 데이터
   - 3D 분석 데이터
   - 바벨 궤적
   - 엘리트 비교
   - 점수
   - 피드백
   - 추천 훈련
   - 리포트 연결
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const ANALYSIS_RESULT_CONFIG = {

  version: "1.0.0",

  storageKey:
    "seolcheon_analysis_results",

  maxHistory:
    300

};


/* =========================================================
   02. EMPTY RESULT TEMPLATE
========================================================= */

function createEmptyAnalysisResult() {

  return {

    /* 기본 정보 */

    id:
      createAnalysisResultId(),

    version:
      ANALYSIS_RESULT_CONFIG.version,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),


    /* 선수 */

    athlete: {

      id: "",

      name: "",

      school:
        "설천고",

      grade: "",

      gender: "",

      birthDate: ""

    },


    /* 분석 정보 */

    analysis: {

      mode:
        "",

      season:
        "",

      sport:
        "",

      sportName:
        "",

      event:
        "",

      cameraView:
        "",

      duration:
        0

    },


    /* 원본 미디어 */

    media: {

      type:
        "",

      videoName:
        "",

      videoURL:
        "",

      thumbnail:
        "",

      fps:
        0,

      width:
        0,

      height:
        0

    },


    /* 스켈레톤 */

    skeleton: {

      enabled:
        false,

      model:
        "",

      frames:
        [],

      keypoints:
        [],

      confidence:
        0

    },


    /* 관절각 */

    jointAngles: {

      leftShoulder:
        null,

      rightShoulder:
        null,

      leftElbow:
        null,

      rightElbow:
        null,

      leftHip:
        null,

      rightHip:
        null,

      leftKnee:
        null,

      rightKnee:
        null,

      leftAnkle:
        null,

      rightAnkle:
        null,

      trunk:
        null,

      custom:
        []

    },


    /* 좌우 대칭 */

    symmetry: {

      overall:
        null,

      shoulder:
        null,

      hip:
        null,

      knee:
        null,

      ankle:
        null

    },


    /* 이동 분석 */

    movement: {

      distance:
        0,

      duration:
        0,

      averageSpeed:
        0,

      maxSpeed:
        0,

      acceleration:
        0,

      cadence:
        0,

      strideLength:
        0

    },


    /* 구간 분석 */

    segments: [],


    /* 기술 분석 */

    technique: {

      detected:
        [],

      current:
        "",

      transitions:
        [],

      score:
        null

    },


    /* 3D */

    threeD: {

      enabled:
        false,

      coordinates:
        [],

      rotation:
        [],

      centerOfMass:
        [],

      trajectory:
        []

    },


    /* 바벨 궤적 */

    barbell: {

      enabled:
        false,

      exercise:
        "",

      trajectory:
        [],

      horizontalDeviation:
        null,

      verticalVelocity:
        null,

      peakVelocity:
        null,

      pathScore:
        null

    },


    /* 종목별 추가 데이터 */

    sportSpecific: {},


    /* 점수 */

    scores: {

      overall:
        null,

      posture:
        null,

      symmetry:
        null,

      stability:
        null,

      technique:
        null,

      power:
        null,

      speed:
        null,

      mobility:
        null,

      coordination:
        null,

      eliteSimilarity:
        null

    },


    /* 엘리트 비교 */

    eliteComparison: {

      enabled:
        false,

      reference:
        "",

      referenceType:
        "elite-standard",

      similarity:
        null,

      differences:
        [],

      metrics:
        []

    },


    /* 이미지 */

    images: {

      skeleton:
        "",

      jointAngle:
        "",

      threeD:
        "",

      trajectory:
        "",

      comparison:
        "",

      snapshots:
        []

    },


    /* 피드백 */

    feedback: {

      summary:
        "",

      strengths:
        [],

      weaknesses:
        [],

      corrections:
        []

    },


    /* 추천 훈련 */

    trainingRecommendations:
      [],


    /* 메모 */

    notes:
      ""

  };

}


/* =========================================================
   03. CREATE ID
========================================================= */

function createAnalysisResultId() {

  const time =
    Date.now()
      .toString(36);

  const random =
    Math.random()
      .toString(36)
      .slice(2, 8);

  return (
    `SC-${time}-${random}`
      .toUpperCase()
  );

}


/* =========================================================
   04. SAFE NUMBER
========================================================= */

function analysisNumber(
  value,
  fallback = null
) {

  const number =
    Number(value);

  return Number.isFinite(
    number
  )
    ? number
    : fallback;

}


/* =========================================================
   05. SCORE LIMIT
========================================================= */

function normalizeScore(
  value
) {

  const number =
    analysisNumber(
      value
    );

  if (
    number ===
    null
  ) {

    return null;

  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(
        number
      )
    )
  );

}


/* =========================================================
   06. DEEP MERGE
========================================================= */

function mergeAnalysisObjects(
  target,
  source
) {

  if (
    !source ||
    typeof source !==
    "object"
  ) {

    return target;

  }


  Object.keys(
    source
  ).forEach(
    key => {

      const sourceValue =
        source[key];


      if (
        Array.isArray(
          sourceValue
        )
      ) {

        target[key] =
          [...sourceValue];

        return;

      }


      if (
        sourceValue &&
        typeof sourceValue ===
        "object"
      ) {

        if (
          !target[key] ||
          typeof target[key] !==
          "object" ||
          Array.isArray(
            target[key]
          )
        ) {

          target[key] = {};

        }


        mergeAnalysisObjects(
          target[key],
          sourceValue
        );

        return;

      }


      target[key] =
        sourceValue;

    }
  );


  return target;

}


/* =========================================================
   07. CREATE RESULT
========================================================= */

function createAnalysisResult(
  data = {}
) {

  const result =
    createEmptyAnalysisResult();


  mergeAnalysisObjects(
    result,
    data
  );


  result.updatedAt =
    new Date().toISOString();


  return normalizeAnalysisResult(
    result
  );

}


/* =========================================================
   08. NORMALIZE RESULT
========================================================= */

function normalizeAnalysisResult(
  result
) {

  if (!result) {

    return createEmptyAnalysisResult();

  }


  /* 점수 */

  Object.keys(
    result.scores || {}
  ).forEach(
    key => {

      result.scores[key] =
        normalizeScore(
          result.scores[key]
        );

    }
  );


  /* 이동 */

  result.movement.distance =
    analysisNumber(
      result.movement.distance,
      0
    );

  result.movement.duration =
    analysisNumber(
      result.movement.duration,
      0
    );

  result.movement.averageSpeed =
    analysisNumber(
      result.movement.averageSpeed,
      0
    );

  result.movement.maxSpeed =
    analysisNumber(
      result.movement.maxSpeed,
      0
    );


  /* 날짜 */

  result.updatedAt =
    new Date().toISOString();


  return result;

}


/* =========================================================
   09. CALCULATE SPEED
========================================================= */

function calculateMovementSpeed(
  distance,
  duration
) {

  const d =
    analysisNumber(
      distance,
      0
    );

  const t =
    analysisNumber(
      duration,
      0
    );


  if (
    d <= 0 ||
    t <= 0
  ) {

    return 0;

  }


  return Number(
    (d / t)
      .toFixed(2)
  );

}


/* =========================================================
   10. SET MOVEMENT
========================================================= */

function setMovementData(
  result,
  movement = {}
) {

  if (!result) {
    return null;
  }


  result.movement =
    {
      ...result.movement,
      ...movement
    };


  if (
    result.movement.distance >
      0 &&
    result.movement.duration >
      0
  ) {

    result.movement.averageSpeed =
      calculateMovementSpeed(
        result.movement.distance,
        result.movement.duration
      );

  }


  result.updatedAt =
    new Date().toISOString();


  return result;

}


/* =========================================================
   11. ADD SEGMENT

   예:
   바이애슬론
   0~120m / 23.4초 / V2
========================================================= */

function addAnalysisSegment(
  result,
  segment = {}
) {

  if (!result) {
    return null;
  }


  if (
    !Array.isArray(
      result.segments
    )
  ) {

    result.segments = [];

  }


  const item = {

    id:
      `SEG-${result.segments.length + 1}`,

    name:
      segment.name ||
      `구간 ${result.segments.length + 1}`,

    startDistance:
      analysisNumber(
        segment.startDistance,
        0
      ),

    endDistance:
      analysisNumber(
        segment.endDistance,
        0
      ),

    distance:
      analysisNumber(
        segment.distance,
        0
      ),

    startTime:
      analysisNumber(
        segment.startTime,
        0
      ),

    endTime:
      analysisNumber(
        segment.endTime,
        0
      ),

    duration:
      analysisNumber(
        segment.duration,
        0
      ),

    speed:
      analysisNumber(
        segment.speed,
        0
      ),

    technique:
      segment.technique ||
      "",

    slope:
      analysisNumber(
        segment.slope,
        null
      ),

    score:
      normalizeScore(
        segment.score
      )

  };


  if (
    item.distance ===
      0 &&
    item.endDistance >
      item.startDistance
  ) {

    item.distance =
      item.endDistance -
      item.startDistance;

  }


  if (
    item.duration ===
      0 &&
    item.endTime >
      item.startTime
  ) {

    item.duration =
      item.endTime -
      item.startTime;

  }


  if (
    item.speed ===
      0 &&
    item.distance >
      0 &&
    item.duration >
      0
  ) {

    item.speed =
      calculateMovementSpeed(
        item.distance,
        item.duration
      );

  }


  result.segments.push(
    item
  );


  return item;

}


/* =========================================================
   12. BIATHLON RESULT

   사격/총기 조작이 아닌
   스키 이동 퍼포먼스 분석 데이터
========================================================= */

function setBiathlonAnalysis(
  result,
  data = {}
) {

  if (!result) {
    return null;
  }


  result.analysis.season =
    "winter";

  result.analysis.sport =
    "biathlon";

  result.analysis.sportName =
    "바이애슬론";


  result.sportSpecific.biathlon = {

    technique:
      data.technique ||
      "",

    uphillDistance:
      analysisNumber(
        data.uphillDistance,
        0
      ),

    elevationGain:
      analysisNumber(
        data.elevationGain,
        0
      ),

    glideScore:
      normalizeScore(
        data.glideScore
      ),

    balanceScore:
      normalizeScore(
        data.balanceScore
      ),

    poleTimingScore:
      normalizeScore(
        data.poleTimingScore
      ),

    techniqueTransitionScore:
      normalizeScore(
        data.techniqueTransitionScore
      ),

    uphillScore:
      normalizeScore(
        data.uphillScore
      )

  };


  return result;

}


/* =========================================================
   13. RUNNING RESULT
========================================================= */

function setRunningAnalysis(
  result,
  data = {}
) {

  if (!result) {
    return null;
  }


  result.sportSpecific.running = {

    distance:
      analysisNumber(
        data.distance,
        0
      ),

    time:
      analysisNumber(
        data.time,
        0
      ),

    cadence:
      analysisNumber(
        data.cadence,
        0
      ),

    strideLength:
      analysisNumber(
        data.strideLength,
        0
      ),

    groundContactTime:
      analysisNumber(
        data.groundContactTime,
        null
      ),

    verticalOscillation:
      analysisNumber(
        data.verticalOscillation,
        null
      ),

    startScore:
      normalizeScore(
        data.startScore
      ),

    accelerationScore:
      normalizeScore(
        data.accelerationScore
      ),

    topSpeedScore:
      normalizeScore(
        data.topSpeedScore
      )

  };


  setMovementData(
    result,
    {
      distance:
        data.distance,

      duration:
        data.time,

      cadence:
        data.cadence,

      strideLength:
        data.strideLength
    }
  );


  return result;

}


/* =========================================================
   14. WEIGHTLIFTING RESULT
========================================================= */

function setWeightliftingAnalysis(
  result,
  data = {}
) {

  if (!result) {
    return null;
  }


  result.analysis.sport =
    "weightlifting";

  result.analysis.sportName =
    "역도";


  result.barbell.enabled =
    true;

  result.barbell.exercise =
    data.exercise ||
    "";

  result.barbell.trajectory =
    Array.isArray(
      data.trajectory
    )
      ? data.trajectory
      : [];

  result.barbell.horizontalDeviation =
    analysisNumber(
      data.horizontalDeviation,
      null
    );

  result.barbell.verticalVelocity =
    analysisNumber(
      data.verticalVelocity,
      null
    );

  result.barbell.peakVelocity =
    analysisNumber(
      data.peakVelocity,
      null
    );

  result.barbell.pathScore =
    normalizeScore(
      data.barPathScore
    );


  result.sportSpecific.weightlifting = {

    firstPullScore:
      normalizeScore(
        data.firstPullScore
      ),

    secondPullScore:
      normalizeScore(
        data.secondPullScore
      ),

    catchScore:
      normalizeScore(
        data.catchScore
      ),

    barPathScore:
      normalizeScore(
        data.barPathScore
      )

  };


  return result;

}


/* =========================================================
   15. JOINT ANGLE
========================================================= */

function setJointAngle(
  result,
  joint,
  angle
) {

  if (
    !result ||
    !joint
  ) {

    return;
  }


  const value =
    analysisNumber(
      angle
    );


  if (
    value ===
    null
  ) {

    return;
  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        result.jointAngles,
        joint
      )
  ) {

    result.jointAngles[
      joint
    ] = value;

  }

  else {

    result.jointAngles
      .custom
      .push({

        joint,

        angle:
          value

      });

  }

}


/* =========================================================
   16. SET SKELETON
========================================================= */

function setSkeletonResult(
  result,
  data = {}
) {

  if (!result) {
    return null;
  }


  result.skeleton.enabled =
    true;

  result.skeleton.model =
    data.model ||
    "";

  result.skeleton.frames =
    data.frames ||
    [];

  result.skeleton.keypoints =
    data.keypoints ||
    [];

  result.skeleton.confidence =
    analysisNumber(
      data.confidence,
      0
    );


  return result;

}


/* =========================================================
   17. SET 3D
========================================================= */

function setThreeDResult(
  result,
  data = {}
) {

  if (!result) {
    return null;
  }


  result.threeD.enabled =
    true;

  result.threeD.coordinates =
    data.coordinates ||
    [];

  result.threeD.rotation =
    data.rotation ||
    [];

  result.threeD.centerOfMass =
    data.centerOfMass ||
    [];

  result.threeD.trajectory =
    data.trajectory ||
    [];


  return result;

}


/* =========================================================
   18. SCORE AVERAGE
========================================================= */

function calculateOverallScore(
  result
) {

  if (
    !result ||
    !result.scores
  ) {

    return null;

  }


  const keys = [

    "posture",
    "symmetry",
    "stability",
    "technique",
    "power",
    "speed",
    "mobility",
    "coordination",
    "eliteSimilarity"

  ];


  const values =
    keys
      .map(
        key =>
          analysisNumber(
            result.scores[
              key
            ]
          )
      )
      .filter(
        value =>
          value !== null
      );


  if (
    values.length ===
    0
  ) {

    result.scores.overall =
      null;

    return null;

  }


  const average =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    values.length;


  result.scores.overall =
    normalizeScore(
      average
    );


  return result.scores.overall;

}


/* =========================================================
   19. FIND STRENGTHS / WEAKNESSES
========================================================= */

function analyzePerformanceAreas(
  result
) {

  if (!result) {

    return {
      strengths: [],
      weaknesses: []
    };

  }


  const labels = {

    posture:
      "자세 안정성",

    symmetry:
      "좌우 대칭성",

    stability:
      "동작 안정성",

    technique:
      "기술 수행",

    power:
      "파워",

    speed:
      "스피드",

    mobility:
      "가동성",

    coordination:
      "협응성",

    eliteSimilarity:
      "엘리트 근접도"

  };


  const values =
    Object.entries(
      result.scores
    )

    .filter(
      ([key, value]) =>
        key !==
          "overall" &&
        value !==
          null
    )

    .map(
      ([key, value]) => ({

        key,

        label:
          labels[key] ||
          key,

        score:
          value

      })
    );


  const strengths =
    [...values]
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(
        0,
        3
      );


  const weaknesses =
    [...values]
      .sort(
        (a, b) =>
          a.score -
          b.score
      )
      .slice(
        0,
        3
      );


  return {
    strengths,
    weaknesses
  };

}


/* =========================================================
   20. AUTO FEEDBACK
========================================================= */

function generateAnalysisFeedback(
  result
) {

  if (!result) {
    return null;
  }


  const areas =
    analyzePerformanceAreas(
      result
    );


  result.feedback.strengths =
    areas.strengths.map(
      item =>
        `${item.label} ${item.score}점`
    );


  result.feedback.weaknesses =
    areas.weaknesses.map(
      item =>
        `${item.label} ${item.score}점`
    );


  const corrections = [];


  areas.weaknesses
    .forEach(
      item => {

        if (
          item.score >=
          85
        ) {
          return;
        }


        switch (
          item.key
        ) {

          case "posture":

            corrections.push(
              "동작 중 몸통 정렬과 중심 위치를 확인하세요."
            );

            break;


          case "symmetry":

            corrections.push(
              "좌우 관절각과 힘 전달 차이를 줄이는 훈련이 필요합니다."
            );

            break;


          case "stability":

            corrections.push(
              "착지와 단일 지지 동작에서 안정성을 강화하세요."
            );

            break;


          case "technique":

            corrections.push(
              "종목별 핵심 동작을 구간별로 나누어 기술 훈련을 진행하세요."
            );

            break;


          case "power":

            corrections.push(
              "기술을 유지하면서 폭발적인 힘을 발휘하는 능력을 보완하세요."
            );

            break;


          case "speed":

            corrections.push(
              "가속 구간과 최고속도 구간을 분리해 분석하고 훈련하세요."
            );

            break;


          case "mobility":

            corrections.push(
              "제한된 관절의 가동 범위를 확인하고 필요한 가동성 훈련을 실시하세요."
            );

            break;


          case "coordination":

            corrections.push(
              "상·하체 타이밍과 좌우 협응을 중심으로 동작을 반복하세요."
            );

            break;


          case "eliteSimilarity":

            corrections.push(
              "엘리트 기준과 차이가 큰 핵심 지표부터 우선적으로 교정하세요."
            );

            break;

        }

      }
    );


  result.feedback.corrections =
    corrections;


  const overall =
    result.scores.overall;


  if (
    overall ===
    null
  ) {

    result.feedback.summary =
      "분석 데이터가 더 필요합니다.";

  }

  else if (
    overall >= 90
  ) {

    result.feedback.summary =
      "전체 수행 수준이 매우 높습니다. 세부 기술의 일관성과 경기 상황 재현성을 중심으로 관리하세요.";

  }

  else if (
    overall >= 80
  ) {

    result.feedback.summary =
      "전반적인 수행 수준이 좋습니다. 낮게 나타난 핵심 지표를 우선 보완하면 퍼포먼스 향상을 기대할 수 있습니다.";

  }

  else if (
    overall >= 70
  ) {

    result.feedback.summary =
      "기본 수행은 확보되어 있으나 기술과 신체 능력에서 보완할 항목이 확인됩니다.";

  }

  else {

    result.feedback.summary =
      "여러 핵심 지표에서 개선 여지가 확인됩니다. 기술 정확도를 우선하고 단계적으로 보완하는 것이 좋습니다.";

  }


  return result.feedback;

}


/* =========================================================
   21. TRAINING RECOMMENDATION CONNECTION
========================================================= */

function connectTrainingRecommendations(
  result
) {

  if (!result) {
    return [];
  }


  if (
    !window.SeolcheonTraining
  ) {

    console.warn(
      "[SEOLCHEON] Training module not loaded."
    );

    return [];
  }


  const data = {

    sport:
      result.analysis.sport,

    scores:
      result.scores,

    ...(
      result.sportSpecific[
        result.analysis.sport
      ] ||
      {}
    )

  };


  const recommendations =
    window.SeolcheonTraining
      .createFull(
        data
      );


  result.trainingRecommendations =
    recommendations;


  return recommendations;

}


/* =========================================================
   22. ELITE COMPARISON
========================================================= */

function setEliteComparison(
  result,
  comparison = {}
) {

  if (!result) {
    return null;
  }


  result.eliteComparison.enabled =
    true;

  result.eliteComparison.reference =
    comparison.reference ||
    "";

  result.eliteComparison.referenceType =
    comparison.referenceType ||
    "elite-standard";

  result.eliteComparison.similarity =
    normalizeScore(
      comparison.similarity
    );

  result.eliteComparison.differences =
    comparison.differences ||
    [];

  result.eliteComparison.metrics =
    comparison.metrics ||
    [];


  if (
    result.eliteComparison
      .similarity !==
    null
  ) {

    result.scores.eliteSimilarity =
      result.eliteComparison
        .similarity;

  }


  return result;

}


/* =========================================================
   23. SAVE IMAGE
========================================================= */

function setAnalysisImage(
  result,
  type,
  imageData
) {

  if (
    !result ||
    !type
  ) {
    return;
  }


  if (
    type ===
    "snapshot"
  ) {

    result.images.snapshots.push(
      imageData
    );

    return;

  }


  if (
    Object.prototype
      .hasOwnProperty
      .call(
        result.images,
        type
      )
  ) {

    result.images[
      type
    ] =
      imageData;

  }

}


/* =========================================================
   24. FINALIZE RESULT
========================================================= */

function finalizeAnalysisResult(
  result
) {

  if (!result) {
    return null;
  }


  calculateOverallScore(
    result
  );


  generateAnalysisFeedback(
    result
  );


  connectTrainingRecommendations(
    result
  );


  result.updatedAt =
    new Date().toISOString();


  return result;

}


/* =========================================================
   25. STORAGE
========================================================= */

function loadAnalysisResults() {

  try {

    const data =
      localStorage.getItem(
        ANALYSIS_RESULT_CONFIG
          .storageKey
      );


    if (!data) {
      return [];
    }


    const parsed =
      JSON.parse(
        data
      );


    return Array.isArray(
      parsed
    )
      ? parsed
      : [];

  }

  catch (
    error
  ) {

    console.error(
      "[SEOLCHEON] Analysis load error:",
      error
    );

    return [];

  }

}


/* =========================================================
   26. SAVE RESULT
========================================================= */

function saveAnalysisResult(
  result
) {

  if (!result) {
    return false;
  }


  try {

    const history =
      loadAnalysisResults();


    const index =
      history.findIndex(
        item =>
          item.id ===
          result.id
      );


    if (
      index >= 0
    ) {

      history[index] =
        result;

    }

    else {

      history.unshift(
        result
      );

    }


    const limited =
      history.slice(
        0,
        ANALYSIS_RESULT_CONFIG
          .maxHistory
      );


    localStorage.setItem(

      ANALYSIS_RESULT_CONFIG
        .storageKey,

      JSON.stringify(
        limited
      )

    );


    return true;

  }

  catch (
    error
  ) {

    console.error(
      "[SEOLCHEON] Analysis save error:",
      error
    );

    return false;

  }

}


/* =========================================================
   27. GET RESULT
========================================================= */

function getAnalysisResult(
  id
) {

  return (
    loadAnalysisResults()
      .find(
        result =>
          result.id === id
      ) ||
    null
  );

}


/* =========================================================
   28. DELETE RESULT
========================================================= */

function deleteAnalysisResult(
  id
) {

  try {

    const history =
      loadAnalysisResults()
        .filter(
          result =>
            result.id !== id
        );


    localStorage.setItem(

      ANALYSIS_RESULT_CONFIG
        .storageKey,

      JSON.stringify(
        history
      )

    );


    return true;

  }

  catch (
    error
  ) {

    console.error(
      "[SEOLCHEON] Analysis delete error:",
      error
    );

    return false;

  }

}


/* =========================================================
   29. GET ATHLETE HISTORY
========================================================= */

function getAthleteAnalysisHistory(
  athleteId
) {

  return loadAnalysisResults()
    .filter(
      result =>
        result.athlete &&
        result.athlete.id ===
          athleteId
    );

}


/* =========================================================
   30. REPORT DATA
========================================================= */

function createReportDataFromAnalysis(
  result
) {

  if (!result) {
    return null;
  }


  finalizeAnalysisResult(
    result
  );


  return {

    id:
      result.id,

    athlete:
      result.athlete,

    analysis:
      result.analysis,

    scores:
      result.scores,

    jointAngles:
      result.jointAngles,

    symmetry:
      result.symmetry,

    movement:
      result.movement,

    segments:
      result.segments,

    technique:
      result.technique,

    sportSpecific:
      result.sportSpecific,

    barbell:
      result.barbell,

    threeD:
      result.threeD,

    eliteComparison:
      result.eliteComparison,

    images:
      result.images,

    feedback:
      result.feedback,

    trainingRecommendations:
      result.trainingRecommendations,

    createdAt:
      result.createdAt

  };

}


/* =========================================================
   31. CURRENT ANALYSIS
========================================================= */

let CURRENT_ANALYSIS_RESULT =
  null;


function startNewAnalysis(
  data = {}
) {

  CURRENT_ANALYSIS_RESULT =
    createAnalysisResult(
      data
    );


  return CURRENT_ANALYSIS_RESULT;

}


function getCurrentAnalysis() {

  return CURRENT_ANALYSIS_RESULT;

}


function setCurrentAnalysis(
  result
) {

  CURRENT_ANALYSIS_RESULT =
    result;

}


/* =========================================================
   32. COMPLETE CURRENT ANALYSIS
========================================================= */

function completeCurrentAnalysis() {

  if (
    !CURRENT_ANALYSIS_RESULT
  ) {

    return null;

  }


  finalizeAnalysisResult(
    CURRENT_ANALYSIS_RESULT
  );


  saveAnalysisResult(
    CURRENT_ANALYSIS_RESULT
  );


  return CURRENT_ANALYSIS_RESULT;

}


/* =========================================================
   33. PUBLIC API
========================================================= */

window.SeolcheonAnalysisResult = {

  config:
    ANALYSIS_RESULT_CONFIG,

  create:
    createAnalysisResult,

  empty:
    createEmptyAnalysisResult,

  start:
    startNewAnalysis,

  current:
    getCurrentAnalysis,

  setCurrent:
    setCurrentAnalysis,

  complete:
    completeCurrentAnalysis,

  finalize:
    finalizeAnalysisResult,

  movement:
    setMovementData,

  addSegment:
    addAnalysisSegment,

  setJointAngle:
    setJointAngle,

  setSkeleton:
    setSkeletonResult,

  set3D:
    setThreeDResult,

  setBiathlon:
    setBiathlonAnalysis,

  setRunning:
    setRunningAnalysis,

  setWeightlifting:
    setWeightliftingAnalysis,

  setEliteComparison:
    setEliteComparison,

  setImage:
    setAnalysisImage,

  calculateScore:
    calculateOverallScore,

  feedback:
    generateAnalysisFeedback,

  connectTraining:
    connectTrainingRecommendations,

  save:
    saveAnalysisResult,

  loadAll:
    loadAnalysisResults,

  get:
    getAnalysisResult,

  delete:
    deleteAnalysisResult,

  athleteHistory:
    getAthleteAnalysisHistory,

  reportData:
    createReportDataFromAnalysis

};


/* =========================================================
   READY
========================================================= */

console.log(
  "[SEOLCHEON] Analysis Result Core Ready"
);