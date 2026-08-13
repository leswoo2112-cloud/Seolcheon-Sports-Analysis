/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   DATA / ANALYSIS-RULES.JS
   VERSION 1.0

   역할
   - 종목별 분석 프로필
   - 관절 각도 분석
   - 구간 분석
   - 기술 단계 분석
   - 궤적 분석
   - 3D 분석 설정
   - 엘리트 비교 항목
   - 피드백 기준

   주의
   ---------------------------------------------------------
   실제 측정값은 pose.js / sports-analysis.js에서 생성한다.
   이 파일은 "무엇을 측정할 것인가"를 정의한다.
========================================================= */

"use strict";


/* =========================================================
   01. COMMON ANALYSIS
========================================================= */

const COMMON_ANALYSIS_RULES = {

  pose: {
    enabled: true,
    skeleton: true,
    confidence: true,
    jointTracking: true
  },

  slowMotion: {
    enabled: true,
    speeds: [0.25, 0.5, 0.75, 1]
  },

  frameAnalysis: {
    enabled: true,
    previousFrame: true,
    nextFrame: true,
    bookmarks: true
  },

  symmetry: {
    enabled: true,
    leftRight: true
  },

  threeD: {
    enabled: true,
    skeleton: true,
    rotation: true,
    jointCoordinates: true
  },

  report: {
    enabled: true,
    score: true,
    feedback: true,
    trainingRecommendation: true,
    radarChart: true
  }

};


/* =========================================================
   02. BIATHLON
========================================================= */

const BIATHLON_RULES = {

  id: "biathlon",

  category: "winter",

  title: "바이애슬론 퍼포먼스 분석",

  modes: [
    "pose",
    "segment",
    "technique",
    "trajectory",
    "3d"
  ],

  joints: [
    "shoulder",
    "elbow",
    "wrist",
    "hip",
    "knee",
    "ankle"
  ],

  angles: [

    {
      id: "trunkLean",
      name: "상체 전경각",
      unit: "°"
    },

    {
      id: "hipAngle",
      name: "고관절 각도",
      unit: "°"
    },

    {
      id: "kneeAngle",
      name: "무릎 각도",
      unit: "°"
    },

    {
      id: "ankleAngle",
      name: "발목 각도",
      unit: "°"
    },

    {
      id: "elbowAngle",
      name: "팔꿈치 각도",
      unit: "°"
    },

    {
      id: "shoulderAngle",
      name: "어깨 각도",
      unit: "°"
    }

  ],

  segments: [

    "구간 거리",

    "구간 시간",

    "평균 속도",

    "최고 속도",

    "속도 변화",

    "오르막",

    "평지",

    "내리막"

  ],

  techniques: [

    {
      id: "v1",
      name: "V1"
    },

    {
      id: "v2",
      name: "V2"
    },

    {
      id: "v2_alternate",
      name: "V2 Alternate"
    },

    {
      id: "double_pole",
      name: "Double Pole"
    },

    {
      id: "free_skate",
      name: "Free Skate"
    }

  ],

  cycleMetrics: [

    "스트라이드 길이",

    "스트라이드 빈도",

    "사이클 시간",

    "폴 접촉 시점",

    "폴 접촉시간",

    "푸시오프 시간",

    "좌우 리듬"

  ],

  trajectory: [

    "손목 궤적",

    "발목 궤적",

    "고관절 궤적",

    "무게중심 추정 궤적"

  ],

  comparison: [

    "상체 전경각",

    "무릎 각도",

    "고관절 각도",

    "스트라이드",

    "사이클 타임",

    "폴링 타이밍",

    "좌우 대칭",

    "주법 전환"

  ],

  scoreWeights: {

    posture: 20,

    symmetry: 15,

    timing: 20,

    technique: 25,

    efficiency: 20

  }

};


/* =========================================================
   03. CROSS COUNTRY
========================================================= */

const CROSS_COUNTRY_RULES = {

  id: "cross_country",

  category: "winter",

  title: "크로스컨트리 기술 분석",

  joints: [
    "shoulder",
    "elbow",
    "hip",
    "knee",
    "ankle"
  ],

  angles: [
    { id: "trunkLean", name: "몸통 전경각", unit: "°" },
    { id: "hipAngle", name: "고관절 각도", unit: "°" },
    { id: "kneeAngle", name: "무릎 각도", unit: "°" },
    { id: "ankleAngle", name: "발목 각도", unit: "°" },
    { id: "elbowAngle", name: "팔꿈치 각도", unit: "°" }
  ],

  segments: [
    "거리",
    "시간",
    "속도",
    "페이스",
    "경사",
    "구간별 속도"
  ],

  techniques: [
    { id: "v1", name: "V1" },
    { id: "v2", name: "V2" },
    { id: "v2_alternate", name: "V2 Alternate" },
    { id: "double_pole", name: "Double Pole" },
    { id: "diagonal", name: "Diagonal Stride" },
    { id: "kick_double_pole", name: "Kick Double Pole" }
  ],

  cycleMetrics: [
    "스트라이드 길이",
    "스트라이드 빈도",
    "사이클 시간",
    "폴링 타이밍",
    "좌우 대칭"
  ],

  scoreWeights: {
    posture: 20,
    symmetry: 15,
    timing: 20,
    technique: 25,
    efficiency: 20
  }

};


/* =========================================================
   04. ATHLETICS
========================================================= */

const ATHLETICS_RULES = {

  id: "athletics",

  category: "summer",

  title: "육상 퍼포먼스 분석",

  joints: [
    "shoulder",
    "elbow",
    "hip",
    "knee",
    "ankle"
  ],

  angles: [

    {
      id: "trunkAngle",
      name: "몸통 각도",
      unit: "°"
    },

    {
      id: "hipAngle",
      name: "고관절 각도",
      unit: "°"
    },

    {
      id: "kneeAngle",
      name: "무릎 각도",
      unit: "°"
    },

    {
      id: "ankleAngle",
      name: "발목 각도",
      unit: "°"
    },

    {
      id: "elbowAngle",
      name: "팔꿈치 각도",
      unit: "°"
    }

  ],

  phases: [

    "START",

    "ACCELERATION",

    "MAX VELOCITY",

    "MAINTENANCE",

    "FINISH"

  ],

  segments: [

    "이동 거리",

    "전체 시간",

    "10m",

    "20m",

    "30m",

    "50m",

    "100m",

    "구간 시간",

    "구간 속도",

    "평균 속도",

    "최고 속도",

    "페이스"

  ],

  runningMetrics: [

    "보폭",

    "케이던스",

    "접지시간 추정",

    "비행시간 추정",

    "무릎 드라이브",

    "팔 스윙",

    "좌우 대칭",

    "수직 움직임"

  ],

  trajectory: [

    "고관절 궤적",

    "무릎 궤적",

    "발목 궤적",

    "손목 궤적"

  ],

  scoreWeights: {

    posture: 15,

    symmetry: 15,

    timing: 20,

    technique: 20,

    efficiency: 30

  }

};


/* =========================================================
   05. WEIGHTLIFTING
========================================================= */

const WEIGHTLIFTING_RULES = {

  id: "weightlifting",

  category: "summer",

  title: "역도 바벨 퍼포먼스 분석",

  objectTracking: {

    enabled: true,

    object: "barbell",

    trajectory: true,

    velocity: true,

    height: true

  },

  joints: [

    "shoulder",

    "elbow",

    "wrist",

    "hip",

    "knee",

    "ankle"

  ],

  angles: [

    {
      id: "trunkAngle",
      name: "몸통 각도",
      unit: "°"
    },

    {
      id: "hipAngle",
      name: "고관절 각도",
      unit: "°"
    },

    {
      id: "kneeAngle",
      name: "무릎 각도",
      unit: "°"
    },

    {
      id: "ankleAngle",
      name: "발목 각도",
      unit: "°"
    },

    {
      id: "elbowAngle",
      name: "팔꿈치 각도",
      unit: "°"
    },

    {
      id: "shoulderAngle",
      name: "어깨 각도",
      unit: "°"
    }

  ],

  phases: [

    {
      id: "setup",
      name: "SETUP"
    },

    {
      id: "first_pull",
      name: "1ST PULL"
    },

    {
      id: "transition",
      name: "TRANSITION"
    },

    {
      id: "second_pull",
      name: "2ND PULL"
    },

    {
      id: "turnover",
      name: "TURNOVER"
    },

    {
      id: "catch",
      name: "CATCH"
    },

    {
      id: "recovery",
      name: "RECOVERY"
    }

  ],

  barbellMetrics: [

    "바벨 X 이동",

    "바벨 Y 이동",

    "바벨 속도",

    "바벨 최고 속도",

    "바벨 최고 높이",

    "바벨-신체 거리",

    "캐치 위치",

    "캐치 깊이"

  ],

  trajectory: [

    "바벨 궤적",

    "고관절 궤적",

    "무릎 궤적"

  ],

  scoreWeights: {

    posture: 15,

    symmetry: 15,

    timing: 20,

    technique: 30,

    efficiency: 20

  }

};


/* =========================================================
   06. SPEED SKATING
========================================================= */

const SPEED_SKATING_RULES = {

  id: "speed_skating",

  category: "winter",

  title: "스피드스케이팅 분석",

  angles: [
    { id: "trunkAngle", name: "상체 각도", unit: "°" },
    { id: "hipAngle", name: "고관절 각도", unit: "°" },
    { id: "kneeAngle", name: "무릎 각도", unit: "°" },
    { id: "ankleAngle", name: "발목 각도", unit: "°" }
  ],

  segments: [
    "랩 시간",
    "구간 시간",
    "직선 속도",
    "코너 속도"
  ],

  cycleMetrics: [
    "스트라이드 빈도",
    "스트라이드 길이",
    "푸시오프 시간",
    "좌우 대칭"
  ],

  phases: [
    "스타트",
    "가속",
    "직선",
    "코너 진입",
    "코너",
    "코너 탈출"
  ],

  scoreWeights: {
    posture: 25,
    symmetry: 20,
    timing: 20,
    technique: 20,
    efficiency: 15
  }

};


/* =========================================================
   07. SKELETON
========================================================= */

const SKELETON_RULES = {

  id: "skeleton",

  category: "winter",

  title: "스켈레톤 스타트·주행 분석",

  phases: [
    "READY",
    "START",
    "PUSH",
    "ACCELERATION",
    "LOAD",
    "SLIDE"
  ],

  segments: [
    "스타트 반응",
    "5m 시간",
    "10m 시간",
    "20m 시간",
    "스타트 전체 시간",
    "탑승 시점",
    "탑승 소요시간"
  ],

  runningMetrics: [
    "보폭",
    "스텝 빈도",
    "가속",
    "몸통 전경각",
    "푸시 리듬"
  ],

  slideMetrics: [
    "머리 위치",
    "어깨 정렬",
    "몸통 정렬",
    "고관절 위치",
    "좌우 흔들림"
  ],

  slowMotionPriority: true,

  scoreWeights: {
    posture: 15,
    symmetry: 15,
    timing: 30,
    technique: 20,
    efficiency: 20
  }

};


/* =========================================================
   08. SWIMMING
========================================================= */

const SWIMMING_RULES = {

  id: "swimming",

  category: "summer",

  title: "수영 스트로크 분석",

  phases: [
    "START",
    "ENTRY",
    "CATCH",
    "PULL",
    "PUSH",
    "RECOVERY",
    "TURN"
  ],

  segments: [
    "전체 시간",
    "25m",
    "50m",
    "100m",
    "턴 시간"
  ],

  strokeMetrics: [
    "스트로크 수",
    "스트로크 빈도",
    "스트로크 길이",
    "좌우 대칭",
    "몸통 롤링"
  ],

  angles: [
    { id: "shoulderAngle", name: "어깨 각도", unit: "°" },
    { id: "elbowAngle", name: "팔꿈치 각도", unit: "°" },
    { id: "hipAngle", name: "고관절 각도", unit: "°" },
    { id: "kneeAngle", name: "무릎 각도", unit: "°" }
  ],

  scoreWeights: {
    posture: 15,
    symmetry: 20,
    timing: 20,
    technique: 25,
    efficiency: 20
  }

};


/* =========================================================
   09. CYCLING
========================================================= */

const CYCLING_RULES = {

  id: "cycling",

  category: "summer",

  title: "사이클 페달링 분석",

  angles: [
    { id: "hipAngle", name: "고관절 각도", unit: "°" },
    { id: "kneeAngle", name: "무릎 각도", unit: "°" },
    { id: "ankleAngle", name: "발목 각도", unit: "°" },
    { id: "trunkAngle", name: "몸통 각도", unit: "°" }
  ],

  cycleMetrics: [
    "케이던스",
    "페달링 주기",
    "좌우 대칭",
    "상체 안정성"
  ],

  segments: [
    "거리",
    "시간",
    "속도",
    "구간 속도"
  ],

  scoreWeights: {
    posture: 25,
    symmetry: 25,
    timing: 15,
    technique: 15,
    efficiency: 20
  }

};


/* =========================================================
   10. JUMP SPORTS
========================================================= */

const JUMP_RULES = {

  id: "jump_default",

  phases: [
    "PREPARATION",
    "COUNTERMOVEMENT",
    "TAKEOFF",
    "FLIGHT",
    "LANDING"
  ],

  metrics: [
    "도약 시간",
    "체공시간",
    "점프 높이 추정",
    "무릎 각도",
    "고관절 각도",
    "몸통 각도",
    "착지 좌우 대칭"
  ],

  scoreWeights: {
    posture: 20,
    symmetry: 20,
    timing: 20,
    technique: 20,
    efficiency: 20
  }

};


/* =========================================================
   11. THROW / SWING SPORTS
========================================================= */

const ROTATIONAL_RULES = {

  id: "rotational_default",

  phases: [
    "PREPARATION",
    "LOAD",
    "ROTATION",
    "ACCELERATION",
    "RELEASE",
    "FOLLOW THROUGH"
  ],

  metrics: [
    "골반 회전",
    "몸통 회전",
    "어깨 회전",
    "팔꿈치 각도",
    "손목 궤적",
    "체중 이동"
  ],

  scoreWeights: {
    posture: 15,
    symmetry: 10,
    timing: 25,
    technique: 30,
    efficiency: 20
  }

};


/* =========================================================
   12. DEFAULT RULE

   별도 프로필이 없는 종목도 분석 가능하게 한다.
========================================================= */

const DEFAULT_ANALYSIS_RULE = {

  id: "default",

  title: "스포츠 동작 분석",

  joints: [
    "shoulder",
    "elbow",
    "wrist",
    "hip",
    "knee",
    "ankle"
  ],

  angles: [
    { id: "shoulderAngle", name: "어깨 각도", unit: "°" },
    { id: "elbowAngle", name: "팔꿈치 각도", unit: "°" },
    { id: "hipAngle", name: "고관절 각도", unit: "°" },
    { id: "kneeAngle", name: "무릎 각도", unit: "°" },
    { id: "ankleAngle", name: "발목 각도", unit: "°" },
    { id: "trunkAngle", name: "몸통 각도", unit: "°" }
  ],

  metrics: [
    "동작 시간",
    "관절 각도",
    "좌우 대칭",
    "움직임 궤적",
    "동작 안정성"
  ],

  phases: [
    "PREPARATION",
    "EXECUTION",
    "FINISH"
  ],

  scoreWeights: {
    posture: 20,
    symmetry: 20,
    timing: 20,
    technique: 20,
    efficiency: 20
  }

};


/* =========================================================
   13. RULE DATABASE
========================================================= */

const ANALYSIS_RULE_DATABASE = {

  biathlon:
    BIATHLON_RULES,

  cross_country:
    CROSS_COUNTRY_RULES,

  athletics:
    ATHLETICS_RULES,

  weightlifting:
    WEIGHTLIFTING_RULES,

  speed_skating:
    SPEED_SKATING_RULES,

  skeleton:
    SKELETON_RULES,

  swimming:
    SWIMMING_RULES,

  cycling:
    CYCLING_RULES

};


/* =========================================================
   14. SPORT GROUPS

   전용 프로필이 없는 종목에
   종목 특성별 기본 분석을 추가한다.
========================================================= */

const SPORT_ANALYSIS_GROUPS = {

  jump: [
    "ski_jump",
    "figure_skating",
    "snowboard",
    "freestyle_ski",
    "gymnastics",
    "basketball",
    "volleyball"
  ],

  rotational: [
    "baseball",
    "golf",
    "tennis",
    "badminton",
    "table_tennis",
    "handball",
    "boxing",
    "taekwondo"
  ]

};


/* =========================================================
   15. GET ANALYSIS RULE
========================================================= */

function getAnalysisRule(sportId) {

  if (
    ANALYSIS_RULE_DATABASE[
      sportId
    ]
  ) {

    return mergeAnalysisRule(
      DEFAULT_ANALYSIS_RULE,
      ANALYSIS_RULE_DATABASE[
        sportId
      ]
    );

  }


  if (
    SPORT_ANALYSIS_GROUPS
      .jump
      .includes(sportId)
  ) {

    return mergeAnalysisRule(
      DEFAULT_ANALYSIS_RULE,
      JUMP_RULES,
      {
        id: sportId
      }
    );

  }


  if (
    SPORT_ANALYSIS_GROUPS
      .rotational
      .includes(sportId)
  ) {

    return mergeAnalysisRule(
      DEFAULT_ANALYSIS_RULE,
      ROTATIONAL_RULES,
      {
        id: sportId
      }
    );

  }


  return mergeAnalysisRule(
    DEFAULT_ANALYSIS_RULE,
    {
      id: sportId
    }
  );

}


/* =========================================================
   16. MERGE RULE
========================================================= */

function mergeAnalysisRule(
  ...rules
) {

  const result = {};


  rules.forEach(
    rule => {

      if (!rule) {

        return;

      }


      Object.entries(
        rule
      ).forEach(
        ([key, value]) => {

          if (
            Array.isArray(value)
          ) {

            result[key] =
              structuredCloneSafe(
                value
              );

          }

          else if (
            value &&
            typeof value === "object"
          ) {

            result[key] = {

              ...(
                result[key] ||
                {}
              ),

              ...value

            };

          }

          else {

            result[key] =
              value;

          }

        }
      );

    }
  );


  result.common =
    COMMON_ANALYSIS_RULES;


  return result;

}


/* =========================================================
   17. SAFE CLONE
========================================================= */

function structuredCloneSafe(
  value
) {

  if (
    typeof structuredClone ===
    "function"
  ) {

    return structuredClone(
      value
    );

  }


  return JSON.parse(
    JSON.stringify(
      value
    )
  );

}


/* =========================================================
   18. GET METRIC LIST
========================================================= */

function getAnalysisMetrics(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  const result = [];


  const keys = [

    "metrics",

    "segments",

    "cycleMetrics",

    "runningMetrics",

    "barbellMetrics",

    "strokeMetrics",

    "slideMetrics",

    "trajectory",

    "comparison"

  ];


  keys.forEach(
    key => {

      const values =
        rule[key];


      if (
        !Array.isArray(values)
      ) {

        return;

      }


      values.forEach(
        value => {

          const name =
            typeof value === "string"
              ? value
              : value.name;


          if (
            name &&
            !result.includes(name)
          ) {

            result.push(name);

          }

        }
      );

    }
  );


  return result;

}


/* =========================================================
   19. GET ANGLES
========================================================= */

function getSportAngles(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  return Array.isArray(
    rule.angles
  )
    ? rule.angles
    : [];

}


/* =========================================================
   20. GET PHASES
========================================================= */

function getSportPhases(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  if (
    !Array.isArray(
      rule.phases
    )
  ) {

    return [];

  }


  return rule.phases.map(
    phase => {

      if (
        typeof phase === "string"
      ) {

        return {

          id:
            phase
              .toLowerCase()
              .replaceAll(
                " ",
                "_"
              ),

          name:
            phase

        };

      }


      return phase;

    }
  );

}


/* =========================================================
   21. GET TECHNIQUES
========================================================= */

function getSportTechniques(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  return Array.isArray(
    rule.techniques
  )
    ? rule.techniques
    : [];

}


/* =========================================================
   22. SCORE WEIGHTS
========================================================= */

function getSportScoreWeights(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  return {

    posture: 20,

    symmetry: 20,

    timing: 20,

    technique: 20,

    efficiency: 20,

    ...(
      rule.scoreWeights ||
      {}
    )

  };

}


/* =========================================================
   23. CALCULATE PERFORMANCE SCORE
========================================================= */

function calculatePerformanceScore(
  sportId,
  scores = {}
) {

  const weights =
    getSportScoreWeights(
      sportId
    );


  let weightedScore = 0;

  let totalWeight = 0;


  Object.entries(
    weights
  ).forEach(
    ([key, weight]) => {

      const value =
        Number(
          scores[key]
        );


      if (
        !Number.isFinite(value)
      ) {

        return;

      }


      const safeValue =
        Math.max(
          0,
          Math.min(
            100,
            value
          )
        );


      weightedScore +=
        safeValue * weight;


      totalWeight +=
        weight;

    }
  );


  if (
    totalWeight === 0
  ) {

    return null;

  }


  return Number(
    (
      weightedScore /
      totalWeight
    ).toFixed(1)
  );

}


/* =========================================================
   24. ANALYSIS CAPABILITIES
========================================================= */

function getAnalysisCapabilities(
  sportId
) {

  const rule =
    getAnalysisRule(
      sportId
    );


  return {

    skeleton:
      true,

    jointAngles:
      Array.isArray(
        rule.angles
      ),

    slowMotion:
      true,

    frameAnalysis:
      true,

    trajectory:
      Array.isArray(
        rule.trajectory
      ) ||
      Boolean(
        rule.objectTracking
          ?.trajectory
      ),

    technique:
      Array.isArray(
        rule.techniques
      ),

    phases:
      Array.isArray(
        rule.phases
      ),

    segments:
      Array.isArray(
        rule.segments
      ),

    threeD:
      true,

    symmetry:
      true,

    eliteComparison:
      true,

    report:
      true,

    trainingRecommendation:
      true,

    objectTracking:
      Boolean(
        rule.objectTracking
          ?.enabled
      )

  };

}


/* =========================================================
   25. GLOBAL ACCESS
========================================================= */

window.COMMON_ANALYSIS_RULES =
  COMMON_ANALYSIS_RULES;


window.ANALYSIS_RULE_DATABASE =
  ANALYSIS_RULE_DATABASE;


window.getAnalysisRule =
  getAnalysisRule;


window.getAnalysisMetrics =
  getAnalysisMetrics;


window.getSportAngles =
  getSportAngles;


window.getSportPhases =
  getSportPhases;


window.getSportTechniques =
  getSportTechniques;


window.getSportScoreWeights =
  getSportScoreWeights;


window.calculatePerformanceScore =
  calculatePerformanceScore;


window.getAnalysisCapabilities =
  getAnalysisCapabilities;