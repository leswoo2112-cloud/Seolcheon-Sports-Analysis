/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / SPORTS-ANALYSIS.JS
   VERSION 1.0

   종목별 스포츠 퍼포먼스 분석 엔진

   - 하계 / 동계 종목
   - 종목별 분석 프로필
   - Pose 결과 수신
   - 구간 분석
   - 거리 / 시간 / 속도
   - 기술 지표
   - 자동 피드백
   - 훈련 추천
   - 역도 바벨 궤적 데이터 연결
   - 바이애슬론 스키 주법 데이터 연결
   - 리포트 데이터 생성
========================================================= */

"use strict";


/* =========================================================
   01. SPORT ANALYSIS DATABASE
========================================================= */

const SPORT_ANALYSIS_DATABASE = {

  /* =======================================================
     WINTER SPORTS
  ======================================================= */

  biathlon: {

    name: "바이애슬론",

    category: "winter",

    icon: "⛷",

    metrics: [
      "speed",
      "segmentTime",
      "distance",
      "gradient",
      "technique",
      "techniqueTransition",
      "cycleRate",
      "cycleLength",
      "trunkAngle",
      "kneeAngle",
      "hipAngle",
      "symmetry"
    ],

    techniques: [
      "V1",
      "V2",
      "V2 Alternate",
      "Double Pole",
      "Free Skate",
      "Transition"
    ]

  },


  cross_country: {

    name: "크로스컨트리",

    category: "winter",

    icon: "🎿",

    metrics: [
      "speed",
      "segmentTime",
      "distance",
      "gradient",
      "technique",
      "cycleRate",
      "cycleLength",
      "trunkAngle",
      "kneeAngle",
      "hipAngle",
      "symmetry"
    ]

  },


  alpine_ski: {

    name: "알파인스키",

    category: "winter",

    icon: "⛷",

    metrics: [
      "speed",
      "turnTime",
      "edgeAngle",
      "kneeAngle",
      "hipAngle",
      "trunkAngle",
      "balance",
      "symmetry"
    ]

  },


  speed_skating: {

    name: "스피드스케이팅",

    category: "winter",

    icon: "⛸",

    metrics: [
      "lapTime",
      "speed",
      "strideRate",
      "strideLength",
      "kneeAngle",
      "hipAngle",
      "trunkAngle",
      "symmetry"
    ]

  },


  short_track: {

    name: "쇼트트랙",

    category: "winter",

    icon: "⛸",

    metrics: [
      "lapTime",
      "cornerSpeed",
      "leanAngle",
      "strideRate",
      "kneeAngle",
      "hipAngle",
      "symmetry"
    ]

  },


  figure_skating: {

    name: "피겨스케이팅",

    category: "winter",

    icon: "⛸",

    metrics: [
      "jumpHeight",
      "rotation",
      "landing",
      "balance",
      "hipAngle",
      "kneeAngle",
      "symmetry"
    ]

  },


  snowboard: {

    name: "스노보드",

    category: "winter",

    icon: "🏂",

    metrics: [
      "speed",
      "turnTime",
      "edgeAngle",
      "balance",
      "trunkAngle",
      "kneeAngle"
    ]

  },


  ski_jump: {

    name: "스키점프",

    category: "winter",

    icon: "🎿",

    metrics: [
      "approachSpeed",
      "takeoffAngle",
      "flightPosition",
      "landingAngle",
      "symmetry"
    ]

  },


  skeleton: {

    name: "스켈레톤",

    category: "winter",

    icon: "🛷",

    metrics: [
      "pushTime",
      "pushFrequency",
      "startSpeed",
      "boardingTime",
      "bodyAlignment",
      "headPosition",
      "shoulderAngle",
      "hipAngle",
      "symmetry"
    ]

  },


  bobsleigh: {

    name: "봅슬레이",

    category: "winter",

    icon: "🛷",

    metrics: [
      "pushTime",
      "pushFrequency",
      "startSpeed",
      "boardingTime",
      "trunkAngle"
    ]

  },


  luge: {

    name: "루지",

    category: "winter",

    icon: "🛷",

    metrics: [
      "startTime",
      "pullPower",
      "bodyAlignment",
      "headPosition",
      "symmetry"
    ]

  },


  /* =======================================================
     SUMMER SPORTS
  ======================================================= */

  athletics: {

    name: "육상",

    category: "summer",

    icon: "🏃",

    metrics: [
      "distance",
      "segmentTime",
      "speed",
      "acceleration",
      "strideLength",
      "cadence",
      "groundContact",
      "flightTime",
      "kneeAngle",
      "hipAngle",
      "trunkAngle",
      "symmetry"
    ]

  },


  swimming: {

    name: "수영",

    category: "summer",

    icon: "🏊",

    metrics: [
      "lapTime",
      "strokeRate",
      "strokeLength",
      "speed",
      "bodyAlignment",
      "shoulderAngle",
      "elbowAngle",
      "symmetry"
    ]

  },


  cycling: {

    name: "사이클",

    category: "summer",

    icon: "🚴",

    metrics: [
      "cadence",
      "speed",
      "kneeAngle",
      "hipAngle",
      "ankleAngle",
      "trunkAngle",
      "symmetry"
    ]

  },


  weightlifting: {

    name: "역도",

    category: "summer",

    icon: "🏋",

    metrics: [
      "barPath",
      "barSpeed",
      "barHeight",
      "kneeAngle",
      "hipAngle",
      "trunkAngle",
      "catchPosition",
      "symmetry"
    ]

  },


  gymnastics: {

    name: "체조",

    category: "summer",

    icon: "🤸",

    metrics: [
      "rotation",
      "flightTime",
      "landing",
      "balance",
      "jointAngles",
      "symmetry"
    ]

  },


  rowing: {

    name: "조정",

    category: "summer",

    icon: "🚣",

    metrics: [
      "strokeRate",
      "strokeLength",
      "driveTime",
      "recoveryTime",
      "kneeAngle",
      "hipAngle",
      "trunkAngle"
    ]

  },


  canoe: {

    name: "카누",

    category: "summer",

    icon: "🛶",

    metrics: [
      "strokeRate",
      "strokeLength",
      "speed",
      "trunkRotation",
      "shoulderAngle",
      "symmetry"
    ]

  },


  triathlon: {

    name: "트라이애슬론",

    category: "summer",

    icon: "🏃",

    metrics: [
      "segmentTime",
      "speed",
      "cadence",
      "strideLength",
      "transitionTime",
      "symmetry"
    ]

  },


  football: {

    name: "축구",

    category: "summer",

    icon: "⚽",

    metrics: [
      "sprintSpeed",
      "acceleration",
      "changeOfDirection",
      "kickAngle",
      "balance",
      "symmetry"
    ]

  },


  basketball: {

    name: "농구",

    category: "summer",

    icon: "🏀",

    metrics: [
      "jumpHeight",
      "landing",
      "acceleration",
      "changeOfDirection",
      "kneeAngle",
      "hipAngle",
      "symmetry"
    ]

  },


  volleyball: {

    name: "배구",

    category: "summer",

    icon: "🏐",

    metrics: [
      "jumpHeight",
      "approach",
      "armSwing",
      "landing",
      "shoulderAngle",
      "kneeAngle",
      "symmetry"
    ]

  },


  badminton: {

    name: "배드민턴",

    category: "summer",

    icon: "🏸",

    metrics: [
      "lunge",
      "changeOfDirection",
      "shoulderAngle",
      "elbowAngle",
      "trunkRotation",
      "symmetry"
    ]

  },


  tennis: {

    name: "테니스",

    category: "summer",

    icon: "🎾",

    metrics: [
      "serve",
      "shoulderAngle",
      "elbowAngle",
      "hipRotation",
      "trunkRotation",
      "balance"
    ]

  },


  table_tennis: {

    name: "탁구",

    category: "summer",

    icon: "🏓",

    metrics: [
      "reaction",
      "trunkRotation",
      "shoulderAngle",
      "elbowAngle",
      "balance"
    ]

  },


  golf: {

    name: "골프",

    category: "summer",

    icon: "🏌",

    metrics: [
      "backswing",
      "downswing",
      "hipRotation",
      "shoulderRotation",
      "balance",
      "tempo"
    ]

  },


  baseball: {

    name: "야구",

    category: "summer",

    icon: "⚾",

    metrics: [
      "throwing",
      "batting",
      "hipRotation",
      "shoulderRotation",
      "elbowAngle",
      "balance"
    ]

  },


  archery: {

    name: "양궁",

    category: "summer",

    icon: "🏹",

    metrics: [
      "shoulderAlignment",
      "elbowAngle",
      "trunkStability",
      "headPosition",
      "symmetry"
    ]

  },


  fencing: {

    name: "펜싱",

    category: "summer",

    icon: "🤺",

    metrics: [
      "lunge",
      "reaction",
      "kneeAngle",
      "hipAngle",
      "trunkAngle",
      "balance"
    ]

  },


  taekwondo: {

    name: "태권도",

    category: "summer",

    icon: "🥋",

    metrics: [
      "kickSpeed",
      "kickHeight",
      "hipRotation",
      "balance",
      "landing",
      "symmetry"
    ]

  },


  judo: {

    name: "유도",

    category: "summer",

    icon: "🥋",

    metrics: [
      "balance",
      "hipPosition",
      "trunkAngle",
      "kneeAngle",
      "symmetry"
    ]

  },


  boxing: {

    name: "복싱",

    category: "summer",

    icon: "🥊",

    metrics: [
      "punchSpeed",
      "hipRotation",
      "shoulderRotation",
      "balance",
      "reaction"
    ]

  },


  wrestling: {

    name: "레슬링",

    category: "summer",

    icon: "🤼",

    metrics: [
      "stance",
      "hipPosition",
      "kneeAngle",
      "trunkAngle",
      "balance"
    ]

  }

};


/* =========================================================
   02. STATE
========================================================= */

const SportsAnalysisManager = {

  initialized: false,

  sportId: null,

  sport: null,

  running: false,

  distance: null,

  gradient: null,

  startTime: null,

  results: [],

  latestResult: null,

  techniqueHistory: [],

  barPath: []

};


/* =========================================================
   03. INITIALIZE
========================================================= */

function initSportsAnalysis() {

  if (
    SportsAnalysisManager.initialized
  ) {
    return;
  }


  SportsAnalysisManager.initialized =
    true;


  bindSportsAnalysisEvents();


  console.log(
    "[SPORT ANALYSIS] Ready"
  );

}


/* =========================================================
   04. EVENTS
========================================================= */

function bindSportsAnalysisEvents() {

  /*
     pose.js 분석 결과
  */

  document.addEventListener(
    "pose:result",
    event => {

      if (
        SportsAnalysisManager.running
      ) {

        processSportPoseResult(
          event.detail
        );

      }

    }
  );


  /*
     video.js 구간 분석 완료
  */

  document.addEventListener(
    "video:segment-complete",
    event => {

      processSportSegment(
        event.detail
      );

    }
  );


  document.addEventListener(
    "click",
    handleSportsAnalysisClick
  );


  document.addEventListener(
    "change",
    handleSportsAnalysisChange
  );

}


/* =========================================================
   05. CLICK
========================================================= */

function handleSportsAnalysisClick(event) {

  const sportButton =
    event.target.closest(
      "[data-sport-id]"
    );


  if (sportButton) {

    selectAnalysisSport(
      sportButton.dataset.sportId
    );

    return;
  }


  const start =
    event.target.closest(
      "[data-action='analysis-start']"
    );


  if (start) {

    startSportsAnalysis();

    return;
  }


  const stop =
    event.target.closest(
      "[data-action='analysis-stop']"
    );


  if (stop) {

    stopSportsAnalysis();

  }

}


/* =========================================================
   06. CHANGE
========================================================= */

function handleSportsAnalysisChange(event) {

  if (
    event.target.matches(
      "[data-analysis-distance]"
    )
  ) {

    setAnalysisDistance(
      event.target.value
    );

  }


  if (
    event.target.matches(
      "[data-analysis-gradient]"
    )
  ) {

    setAnalysisGradient(
      event.target.value
    );

  }

}


/* =========================================================
   07. SELECT SPORT
========================================================= */

function selectAnalysisSport(
  sportId
) {

  const sport =
    SPORT_ANALYSIS_DATABASE[
      sportId
    ];


  if (!sport) {

    console.warn(
      "[SPORT ANALYSIS] Unknown sport:",
      sportId
    );

    return null;
  }


  SportsAnalysisManager.sportId =
    sportId;


  SportsAnalysisManager.sport =
    sport;


  /*
     선수의 선택 종목도 동기화
  */

  document
    .querySelectorAll(
      "[data-sport-id]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.sportId ===
            sportId
        );

      }
    );


  renderSportAnalysisPanel();


  document.dispatchEvent(
    new CustomEvent(
      "sport:selected",
      {
        detail: {
          sportId,
          sport
        }
      }
    )
  );


  return sport;

}


/* =========================================================
   08. GET SPORT
========================================================= */

function getAnalysisSport(
  sportId
) {

  return (
    SPORT_ANALYSIS_DATABASE[
      sportId
    ] ||
    null
  );

}


/* =========================================================
   09. CATEGORY
========================================================= */

function getSportsByCategory(
  category
) {

  return Object
    .entries(
      SPORT_ANALYSIS_DATABASE
    )
    .filter(
      ([, sport]) =>
        sport.category ===
        category
    )
    .map(
      ([id, sport]) => ({
        id,
        ...sport
      })
    );

}


/* =========================================================
   10. START
========================================================= */

function startSportsAnalysis() {

  if (
    !SportsAnalysisManager.sport
  ) {

    showSportsAnalysisMessage(
      "먼저 분석할 종목을 선택해주세요.",
      "error"
    );

    return false;
  }


  SportsAnalysisManager.running =
    true;


  SportsAnalysisManager.startTime =
    performance.now();


  SportsAnalysisManager.results =
    [];


  SportsAnalysisManager.techniqueHistory =
    [];


  SportsAnalysisManager.barPath =
    [];


  if (
    typeof clearPoseHistory ===
    "function"
  ) {

    clearPoseHistory();

  }


  updateSportsAnalysisStatus(
    "ANALYZING"
  );


  showSportsAnalysisMessage(
    `${SportsAnalysisManager.sport.name} 분석 시작`,
    "success"
  );


  return true;

}


/* =========================================================
   11. STOP
========================================================= */

function stopSportsAnalysis() {

  if (
    !SportsAnalysisManager.running
  ) {
    return null;
  }


  SportsAnalysisManager.running =
    false;


  const summary =
    createSportAnalysisSummary();


  SportsAnalysisManager.latestResult =
    summary;


  updateSportsAnalysisStatus(
    "COMPLETE"
  );


  document.dispatchEvent(
    new CustomEvent(
      "sport:analysis-complete",
      {
        detail:
          summary
      }
    )
  );


  return summary;

}


/* =========================================================
   12. PROCESS POSE
========================================================= */

function processSportPoseResult(
  pose
) {

  if (
    !pose ||
    !SportsAnalysisManager.sport
  ) {

    return;
  }


  const frame = {

    timestamp:
      pose.timestamp,

    videoTime:
      pose.videoTime,

    angles:
      pose.angles,

    symmetry:
      pose.symmetry,

    confidence:
      pose.confidence,

    metrics: {}

  };


  switch (
    SportsAnalysisManager.sportId
  ) {

    case "biathlon":

      frame.metrics =
        analyzeBiathlonFrame(
          pose
        );

      break;


    case "cross_country":

      frame.metrics =
        analyzeSkiFrame(
          pose
        );

      break;


    case "athletics":

      frame.metrics =
        analyzeRunningFrame(
          pose
        );

      break;


    case "weightlifting":

      frame.metrics =
        analyzeWeightliftingFrame(
          pose
        );

      break;


    case "cycling":

      frame.metrics =
        analyzeCyclingFrame(
          pose
        );

      break;


    case "skeleton":

      frame.metrics =
        analyzeSkeletonFrame(
          pose
        );

      break;


    case "speed_skating":
    case "short_track":

      frame.metrics =
        analyzeSkatingFrame(
          pose
        );

      break;


    case "swimming":

      frame.metrics =
        analyzeSwimmingFrame(
          pose
        );

      break;


    default:

      frame.metrics =
        analyzeGeneralSportFrame(
          pose
        );

  }


  SportsAnalysisManager.results.push(
    frame
  );


  updateLiveSportMetrics(
    frame
  );

}


/* =========================================================
   13. BIATHLON
========================================================= */

function analyzeBiathlonFrame(
  pose
) {

  const angles =
    pose.angles;


  const technique =
    classifySkiTechnique(
      pose
    );


  if (technique) {

    recordTechnique(
      technique,
      pose.videoTime
    );

  }


  return {

    technique,

    trunkAngle:
      angles.trunk,

    leftKnee:
      angles.leftKnee,

    rightKnee:
      angles.rightKnee,

    leftHip:
      angles.leftHip,

    rightHip:
      angles.rightHip,

    symmetry:
      pose.symmetry?.score ??
      null,

    gradient:
      SportsAnalysisManager.gradient

  };

}


/* =========================================================
   14. SKI TECHNIQUE CLASSIFICATION

   현재 단계는 관절 패턴 기반 분류 구조.
   실제 정확한 주법 AI 분류는 학습된
   동작 모델을 추가 연결할 수 있도록 구성.
========================================================= */

function classifySkiTechnique(
  pose
) {

  const a =
    pose.angles;


  if (
    !Number.isFinite(
      a.leftElbow
    ) ||
    !Number.isFinite(
      a.rightElbow
    )
  ) {

    return null;
  }


  const armDifference =
    Math.abs(
      a.leftElbow -
      a.rightElbow
    );


  /*
     좌우 팔 동작이 비슷한 경우
  */

  if (
    armDifference < 15
  ) {

    if (
      Number.isFinite(
        a.trunk
      ) &&
      a.trunk > 25
    ) {

      return "V1";

    }


    return "V2";

  }


  /*
     좌우 비대칭 팔 패턴
  */

  if (
    armDifference >= 15 &&
    armDifference < 45
  ) {

    return "V2 Alternate";

  }


  return "Transition";

}


/* =========================================================
   15. SKI
========================================================= */

function analyzeSkiFrame(
  pose
) {

  return {

    technique:
      classifySkiTechnique(
        pose
      ),

    trunkAngle:
      pose.angles.trunk,

    kneeAngle:
      averageValues(
        pose.angles.leftKnee,
        pose.angles.rightKnee
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   16. RUNNING
========================================================= */

function analyzeRunningFrame(
  pose
) {

  return {

    trunkAngle:
      pose.angles.trunk,

    leftKnee:
      pose.angles.leftKnee,

    rightKnee:
      pose.angles.rightKnee,

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   17. WEIGHTLIFTING
========================================================= */

function analyzeWeightliftingFrame(
  pose
) {

  return {

    kneeAngle:
      averageValues(
        pose.angles.leftKnee,
        pose.angles.rightKnee
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    trunkAngle:
      pose.angles.trunk,

    elbowAngle:
      averageValues(
        pose.angles.leftElbow,
        pose.angles.rightElbow
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   18. BAR PATH INPUT

   다음 분석 단계에서 바벨 검출기가
   x/y 좌표를 보내면 여기 저장.
========================================================= */

function addBarPathPoint(
  x,
  y,
  time = null
) {

  const point = {

    x:
      Number(x),

    y:
      Number(y),

    time:
      time ??
      performance.now()

  };


  if (
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {

    return;
  }


  SportsAnalysisManager.barPath.push(
    point
  );


  document.dispatchEvent(
    new CustomEvent(
      "weightlifting:bar-path",
      {
        detail:
          point
      }
    )
  );

}


/* =========================================================
   19. CYCLING
========================================================= */

function analyzeCyclingFrame(
  pose
) {

  return {

    kneeAngle:
      averageValues(
        pose.angles.leftKnee,
        pose.angles.rightKnee
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    ankleAngle:
      averageValues(
        pose.angles.leftAnkle,
        pose.angles.rightAnkle
      ),

    trunkAngle:
      pose.angles.trunk,

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   20. SKELETON
========================================================= */

function analyzeSkeletonFrame(
  pose
) {

  return {

    bodyAlignment:
      calculateBodyAlignment(
        pose
      ),

    trunkAngle:
      pose.angles.trunk,

    shoulderAngle:
      averageValues(
        pose.angles.leftShoulder,
        pose.angles.rightShoulder
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   21. SPEED SKATING
========================================================= */

function analyzeSkatingFrame(
  pose
) {

  return {

    trunkAngle:
      pose.angles.trunk,

    kneeAngle:
      averageValues(
        pose.angles.leftKnee,
        pose.angles.rightKnee
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   22. SWIMMING
========================================================= */

function analyzeSwimmingFrame(
  pose
) {

  return {

    shoulderAngle:
      averageValues(
        pose.angles.leftShoulder,
        pose.angles.rightShoulder
      ),

    elbowAngle:
      averageValues(
        pose.angles.leftElbow,
        pose.angles.rightElbow
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   23. GENERAL
========================================================= */

function analyzeGeneralSportFrame(
  pose
) {

  return {

    trunkAngle:
      pose.angles.trunk,

    kneeAngle:
      averageValues(
        pose.angles.leftKnee,
        pose.angles.rightKnee
      ),

    hipAngle:
      averageValues(
        pose.angles.leftHip,
        pose.angles.rightHip
      ),

    shoulderAngle:
      averageValues(
        pose.angles.leftShoulder,
        pose.angles.rightShoulder
      ),

    symmetry:
      pose.symmetry?.score ??
      null

  };

}


/* =========================================================
   24. BODY ALIGNMENT
========================================================= */

function calculateBodyAlignment(
  pose
) {

  if (
    !Number.isFinite(
      pose.angles.trunk
    )
  ) {

    return null;
  }


  return Number(
    Math.max(
      0,
      100 -
      pose.angles.trunk
    ).toFixed(1)
  );

}


/* =========================================================
   25. TECHNIQUE HISTORY
========================================================= */

function recordTechnique(
  technique,
  time
) {

  const history =
    SportsAnalysisManager
      .techniqueHistory;


  const previous =
    history[
      history.length - 1
    ];


  if (
    previous &&
    previous.technique ===
      technique
  ) {

    previous.end =
      time;

    return;
  }


  history.push({

    technique,

    start:
      time,

    end:
      time

  });

}


/* =========================================================
   26. SEGMENT ANALYSIS
========================================================= */

function processSportSegment(
  segment
) {

  if (!segment) {
    return null;
  }


  const distance =
    SportsAnalysisManager.distance;


  const result = {

    ...segment,

    distance,

    speed:
      calculateSegmentSpeed(
        distance,
        segment.duration
      )

  };


  document.dispatchEvent(
    new CustomEvent(
      "sport:segment-result",
      {
        detail:
          result
      }
    )
  );


  updateSegmentResultUI(
    result
  );


  return result;

}


/* =========================================================
   27. DISTANCE
========================================================= */

function setAnalysisDistance(
  distance
) {

  const value =
    Number(distance);


  SportsAnalysisManager.distance =
    Number.isFinite(value) &&
    value > 0
      ? value
      : null;

}


/* =========================================================
   28. GRADIENT
========================================================= */

function setAnalysisGradient(
  gradient
) {

  const value =
    Number(gradient);


  SportsAnalysisManager.gradient =
    Number.isFinite(value)
      ? value
      : null;

}


/* =========================================================
   29. SPEED
========================================================= */

function calculateSegmentSpeed(
  distance,
  seconds
) {

  if (
    !Number.isFinite(distance) ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {

    return null;
  }


  return Number(
    (
      distance /
      seconds
    ).toFixed(2)
  );

}


/* =========================================================
   30. AVERAGE
========================================================= */

function averageValues(
  ...values
) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(
          value
        )
    );


  if (
    valid.length === 0
  ) {

    return null;
  }


  return Number(
    (
      valid.reduce(
        (a, b) =>
          a + b,
        0
      ) /
      valid.length
    ).toFixed(1)
  );

}


/* =========================================================
   31. SUMMARY
========================================================= */

function createSportAnalysisSummary() {

  const sport =
    SportsAnalysisManager.sport;


  const frames =
    SportsAnalysisManager.results;


  const poseHistory =
    typeof getPoseHistory ===
      "function"
        ? getPoseHistory()
        : [];


  const summary = {

    id:
      "analysis_" +
      Date.now(),

    sportId:
      SportsAnalysisManager.sportId,

    sportName:
      sport?.name ||
      "",

    category:
      sport?.category ||
      "",

    athlete:
      typeof getSelectedAthlete ===
        "function"
          ? getSelectedAthlete()
          : null,

    createdAt:
      new Date()
        .toISOString(),

    frames:
      frames.length,

    distance:
      SportsAnalysisManager.distance,

    gradient:
      SportsAnalysisManager.gradient,

    techniqueHistory:
      [
        ...SportsAnalysisManager
          .techniqueHistory
      ],

    barPath:
      [
        ...SportsAnalysisManager
          .barPath
      ],

    metrics: {

      trunkAngle:
        averageMetric(
          frames,
          "trunkAngle"
        ),

      kneeAngle:
        averageMetric(
          frames,
          "kneeAngle"
        ),

      hipAngle:
        averageMetric(
          frames,
          "hipAngle"
        ),

      symmetry:
        averageMetric(
          frames,
          "symmetry"
        )

    },

    poseFrames:
      poseHistory.length

  };


  summary.score =
    calculatePerformanceScore(
      summary
    );


  summary.feedback =
    createSportFeedback(
      summary
    );


  summary.training =
    createTrainingRecommendations(
      summary
    );


  return summary;

}


/* =========================================================
   32. AVERAGE METRIC
========================================================= */

function averageMetric(
  frames,
  key
) {

  const values =
    frames

      .map(
        frame =>
          frame.metrics?.[
            key
          ]
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


  return Number(
    (
      values.reduce(
        (a, b) =>
          a + b,
        0
      ) /
      values.length
    ).toFixed(1)
  );

}


/* =========================================================
   33. PERFORMANCE SCORE

   현재는 내부 기술 지표용.
   실제 국가대표 기준 점수는
   comparison.js에서 별도 계산.
========================================================= */

function calculatePerformanceScore(
  summary
) {

  const values = [];


  if (
    Number.isFinite(
      summary.metrics.symmetry
    )
  ) {

    values.push(
      summary.metrics.symmetry
    );

  }


  if (
    summary.poseFrames > 0
  ) {

    values.push(
      Math.min(
        100,
        summary.poseFrames / 2
      )
    );

  }


  if (
    values.length === 0
  ) {

    return null;

  }


  return Number(
    (
      values.reduce(
        (a, b) =>
          a + b,
        0
      ) /
      values.length
    ).toFixed(1)
  );

}


/* =========================================================
   34. FEEDBACK
========================================================= */

function createSportFeedback(
  summary
) {

  const feedback = [];


  if (
    Number.isFinite(
      summary.metrics.symmetry
    )
  ) {

    if (
      summary.metrics.symmetry >= 90
    ) {

      feedback.push(
        "좌우 움직임의 대칭성이 안정적입니다."
      );

    }

    else if (
      summary.metrics.symmetry >= 75
    ) {

      feedback.push(
        "좌우 동작 차이가 일부 관찰됩니다. 반복 동작의 일관성을 확인하세요."
      );

    }

    else {

      feedback.push(
        "좌우 관절 움직임 차이가 크게 측정되었습니다. 촬영 각도와 동작 패턴을 함께 확인하세요."
      );

    }

  }


  if (
    summary.sportId ===
      "biathlon"
  ) {

    if (
      summary.techniqueHistory.length >
      1
    ) {

      feedback.push(
        "스키 주법 전환 구간이 기록되었습니다. 전환 전후 속도와 자세 변화를 비교할 수 있습니다."
      );

    }


    if (
      Number.isFinite(
        summary.gradient
      )
    ) {

      feedback.push(
        `경사도 ${summary.gradient}% 조건을 포함해 분석했습니다.`
      );

    }

  }


  if (
    summary.sportId ===
      "weightlifting" &&
    summary.barPath.length > 0
  ) {

    feedback.push(
      "바벨 궤적 데이터가 기록되었습니다. 3D/궤적 분석에서 신체 중심선과 비교할 수 있습니다."
    );

  }


  if (
    feedback.length === 0
  ) {

    feedback.push(
      "분석 데이터가 더 쌓이면 세부 기술 피드백을 생성할 수 있습니다."
    );

  }


  return feedback;

}


/* =========================================================
   35. TRAINING RECOMMENDATIONS
========================================================= */

function createTrainingRecommendations(
  summary
) {

  const training = [];


  if (
    Number.isFinite(
      summary.metrics.symmetry
    ) &&
    summary.metrics.symmetry < 85
  ) {

    training.push(
      "싱글 레그 밸런스"
    );

    training.push(
      "스플릿 스쿼트"
    );

    training.push(
      "싱글 레그 RDL"
    );

    training.push(
      "사이드 플랭크"
    );

  }


  switch (
    summary.sportId
  ) {

    case "biathlon":

      training.push(
        "스케이팅 밸런스 드릴",
        "무폴 스케이팅",
        "더블폴 리듬 드릴",
        "V1 기술 드릴",
        "V2 기술 드릴",
        "주법 전환 드릴",
        "오르막 기술 반복",
        "코어 안정화",
        "싱글 레그 스쿼트",
        "스키 바운드"
      );

      break;


    case "athletics":

      training.push(
        "A-Skip",
        "B-Skip",
        "High Knee",
        "Straight Leg Bound",
        "Acceleration Drill",
        "Wall Drill",
        "Pogo Jump",
        "Single Leg Hop",
        "Sprint Technique Drill"
      );

      break;


    case "weightlifting":

      training.push(
        "Clean Pull",
        "Snatch Pull",
        "Hang Clean",
        "Hang Snatch",
        "Front Squat",
        "Overhead Squat",
        "Tall Clean",
        "Tall Snatch",
        "Clean High Pull",
        "Snatch High Pull"
      );

      break;


    case "skeleton":

      training.push(
        "Acceleration Sprint",
        "Sled Push",
        "Broad Jump",
        "Bounds",
        "Hip Extension Drill",
        "Core Stability",
        "Sprint Start Drill"
      );

      break;


    case "speed_skating":
    case "short_track":

      training.push(
        "Skater Jump",
        "Lateral Bound",
        "Single Leg Squat",
        "Low Position Hold",
        "Hip Stability Drill",
        "Corner Position Drill"
      );

      break;

  }


  return [
    ...new Set(
      training
    )
  ];

}


/* =========================================================
   36. RENDER ANALYSIS PANEL
========================================================= */

function renderSportAnalysisPanel() {

  const container =
    document.querySelector(
      "[data-sport-analysis-panel]"
    );


  if (
    !container ||
    !SportsAnalysisManager.sport
  ) {

    return;
  }


  const sport =
    SportsAnalysisManager.sport;


  container.innerHTML = `

    <div class="sport-analysis-header">

      <div class="sport-analysis-icon">
        ${sport.icon}
      </div>

      <div>

        <span>
          ${
            sport.category ===
              "winter"
              ? "WINTER SPORT"
              : "SUMMER SPORT"
          }
        </span>

        <h3>
          ${sport.name}
        </h3>

      </div>

    </div>

    <div class="sport-analysis-metrics">

      ${sport.metrics
        .map(
          metric => `

            <div
              class="analysis-metric"
              data-live-metric="${metric}"
            >

              <span>
                ${formatMetricName(metric)}
              </span>

              <strong>
                --
              </strong>

            </div>

          `
        )
        .join("")}

    </div>

  `;

}


/* =========================================================
   37. LIVE METRICS
========================================================= */

function updateLiveSportMetrics(
  frame
) {

  if (!frame?.metrics) {
    return;
  }


  Object.entries(
    frame.metrics
  )
    .forEach(
      ([key, value]) => {

        const element =
          document.querySelector(
            `[data-live-metric="${key}"] strong`
          );


        if (!element) {
          return;
        }


        element.textContent =
          formatMetricValue(
            key,
            value
          );

      }
    );

}


/* =========================================================
   38. SEGMENT UI
========================================================= */

function updateSegmentResultUI(
  result
) {

  setSportUI(
    "analysis-segment-time",
    Number.isFinite(
      result.duration
    )
      ? `${result.duration.toFixed(2)} s`
      : "--"
  );


  setSportUI(
    "analysis-distance",
    Number.isFinite(
      result.distance
    )
      ? `${result.distance} m`
      : "--"
  );


  setSportUI(
    "analysis-speed",
    Number.isFinite(
      result.speed
    )
      ? `${result.speed} m/s`
      : "--"
  );

}


/* =========================================================
   39. FORMAT METRIC NAME
========================================================= */

function formatMetricName(
  metric
) {

  const names = {

    speed: "속도",
    segmentTime: "구간 시간",
    distance: "거리",
    gradient: "경사도",

    technique: "주법",
    techniqueTransition: "주법 전환",

    cycleRate: "사이클 빈도",
    cycleLength: "사이클 길이",

    strideRate: "보 빈도",
    strideLength: "보폭",

    cadence: "케이던스",

    groundContact: "지면 접촉시간",
    flightTime: "비행시간",

    trunkAngle: "몸통각",
    kneeAngle: "무릎각",
    hipAngle: "고관절각",
    ankleAngle: "발목각",

    shoulderAngle: "어깨각",
    elbowAngle: "팔꿈치각",

    symmetry: "좌우 대칭",

    barPath: "바벨 궤적",
    barSpeed: "바벨 속도",
    barHeight: "바벨 높이",

    jumpHeight: "점프 높이",

    balance: "균형",

    bodyAlignment: "신체 정렬",

    lapTime: "랩타임",

    strokeRate: "스트로크 빈도",
    strokeLength: "스트로크 길이",

    pushTime: "푸시 시간",
    pushFrequency: "푸시 빈도",

    startSpeed: "스타트 속도",
    boardingTime: "탑승 시간"

  };


  return (
    names[metric] ||
    metric
  );

}


/* =========================================================
   40. FORMAT VALUE
========================================================= */

function formatMetricValue(
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
    key === "symmetry" ||
    key === "balance" ||
    key === "bodyAlignment"
  ) {

    return `${value}/100`;
  }


  return String(value);

}


/* =========================================================
   41. UI
========================================================= */

function setSportUI(
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
   42. STATUS
========================================================= */

function updateSportsAnalysisStatus(
  status
) {

  document
    .querySelectorAll(
      "[data-analysis-status]"
    )
    .forEach(
      element => {

        element.textContent =
          status;

        element.dataset.status =
          status.toLowerCase();

      }
    );

}


/* =========================================================
   43. MESSAGE
========================================================= */

function showSportsAnalysisMessage(
  message,
  type = ""
) {

  const element =
    document.querySelector(
      "[data-analysis-message]"
    );


  if (!element) {

    if (message) {

      console.log(
        "[SPORT ANALYSIS]",
        message
      );

    }

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
   44. GET CURRENT ANALYSIS
========================================================= */

function getCurrentSportsAnalysis() {

  return {

    sportId:
      SportsAnalysisManager.sportId,

    sport:
      SportsAnalysisManager.sport,

    running:
      SportsAnalysisManager.running,

    distance:
      SportsAnalysisManager.distance,

    gradient:
      SportsAnalysisManager.gradient,

    results:
      SportsAnalysisManager.results,

    techniqueHistory:
      SportsAnalysisManager
        .techniqueHistory,

    barPath:
      SportsAnalysisManager.barPath

  };

}


/* =========================================================
   45. GET LATEST
========================================================= */

function getLatestSportsAnalysis() {

  return (
    SportsAnalysisManager.latestResult ||
    null
  );

}


/* =========================================================
   46. AUTO INIT
========================================================= */

if (
  document.readyState ===
    "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initSportsAnalysis
  );

}

else {

  initSportsAnalysis();

}


/* =========================================================
   47. GLOBAL
========================================================= */

window.SPORT_ANALYSIS_DATABASE =
  SPORT_ANALYSIS_DATABASE;

window.SportsAnalysisManager =
  SportsAnalysisManager;

window.initSportsAnalysis =
  initSportsAnalysis;

window.selectAnalysisSport =
  selectAnalysisSport;

window.getAnalysisSport =
  getAnalysisSport;

window.getSportsByCategory =
  getSportsByCategory;

window.startSportsAnalysis =
  startSportsAnalysis;

window.stopSportsAnalysis =
  stopSportsAnalysis;

window.setAnalysisDistance =
  setAnalysisDistance;

window.setAnalysisGradient =
  setAnalysisGradient;

window.calculateSegmentSpeed =
  calculateSegmentSpeed;

window.addBarPathPoint =
  addBarPathPoint;

window.getCurrentSportsAnalysis =
  getCurrentSportsAnalysis;

window.getLatestSportsAnalysis =
  getLatestSportsAnalysis;