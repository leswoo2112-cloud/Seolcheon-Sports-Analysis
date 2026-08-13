/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / SPORT-ANALYSIS-CONTROLLER.JS

   SPORT SPECIFIC ANALYSIS ENGINE

   기능
   - 동계 / 하계 종목별 분석 프로필
   - 종목별 관절각
   - 종목별 기술 분석
   - 거리 / 시간 / 속도 / 구간
   - 스키 주법 분석
   - 러닝 분석
   - 점프 / 투척 분석
   - 역도 바벨 궤적
   - 구기 종목 움직임
   - 수영 / 사이클 / 조정
   - 체조 / 빙상 / 스키
   - 종목별 점수 항목 자동 변경
========================================================= */

"use strict";


/* =========================================================
   01. STATE
========================================================= */

const SPORT_ANALYSIS_STATE = {

  selectedSport: null,

  selectedProfile: null,

  liveMetrics: {},

  segments: [],

  initialized: false

};


/* =========================================================
   02. COMMON METRICS
========================================================= */

const COMMON_METRICS = [

  {
    key: "posture",
    label: "자세 안정성",
    unit: "점"
  },

  {
    key: "symmetry",
    label: "좌우 대칭성",
    unit: "점"
  },

  {
    key: "stability",
    label: "동작 안정성",
    unit: "점"
  },

  {
    key: "technique",
    label: "기술 수행",
    unit: "점"
  },

  {
    key: "coordination",
    label: "협응성",
    unit: "점"
  }

];


/* =========================================================
   03. SPORT DATABASE
========================================================= */

const SPORT_ANALYSIS_PROFILES = {


/* =========================================================
   WINTER
========================================================= */

biathlon: {

  name: "바이애슬론",

  season: "winter",

  icon: "🎿",

  category: "ski",

  metrics: [

    "distance",
    "time",
    "speed",
    "segmentTime",
    "elevationGain",
    "slope",
    "cadence",
    "glide",
    "poleTiming",
    "techniqueTransition"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ],

  techniques: [

    "V1",
    "V2",
    "V2 Alternate",
    "Free Skate",
    "Double Pole",
    "Tuck",
    "Transition"

  ],

  special: [

    "terrain",
    "techniqueDetection",
    "techniqueTransition",
    "segmentAnalysis",
    "uphillAnalysis",
    "downhillAnalysis",
    "cornerAnalysis"

  ]

},


crossCountry: {

  name: "크로스컨트리",

  season: "winter",

  icon: "🎿",

  category: "ski",

  metrics: [

    "distance",
    "time",
    "speed",
    "cadence",
    "glide",
    "poleTiming",
    "slope",
    "elevationGain"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftShoulder",
    "rightShoulder"

  ],

  techniques: [

    "V1",
    "V2",
    "V2 Alternate",
    "Double Pole",
    "Diagonal",
    "Tuck"

  ]

},


alpineSki: {

  name: "알파인스키",

  season: "winter",

  icon: "⛷️",

  category: "ski",

  metrics: [

    "speed",
    "turnTime",
    "edgeAngle",
    "leanAngle",
    "pressureBalance",
    "trajectory"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ],

  techniques: [

    "Carving",
    "Transition",
    "Edge Change",
    "Pressure Control"

  ]

},


snowboard: {

  name: "스노보드",

  season: "winter",

  icon: "🏂",

  category: "board",

  metrics: [

    "speed",
    "edgeAngle",
    "leanAngle",
    "turnTime",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


speedSkating: {

  name: "스피드스케이팅",

  season: "winter",

  icon: "⛸️",

  category: "skating",

  metrics: [

    "lapTime",
    "speed",
    "cadence",
    "pushTime",
    "glideTime",
    "strideLength",
    "leanAngle"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


shortTrack: {

  name: "쇼트트랙",

  season: "winter",

  icon: "⛸️",

  category: "skating",

  metrics: [

    "lapTime",
    "speed",
    "cornerSpeed",
    "leanAngle",
    "strideRate",
    "pushTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


figureSkating: {

  name: "피겨스케이팅",

  season: "winter",

  icon: "⛸️",

  category: "skating",

  metrics: [

    "rotationSpeed",
    "jumpHeight",
    "airTime",
    "landingStability",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftShoulder",
    "rightShoulder"

  ]

},


skiJumping: {

  name: "스키점프",

  season: "winter",

  icon: "🎿",

  category: "jump",

  metrics: [

    "approachSpeed",
    "takeoffAngle",
    "takeoffVelocity",
    "flightTime",
    "flightPosture",
    "landingStability"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


skeleton: {

  name: "스켈레톤",

  season: "winter",

  icon: "🛷",

  category: "sliding",

  metrics: [

    "startTime",
    "pushFrequency",
    "speed",
    "trajectory",
    "bodyAlignment",
    "cornerTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


bobsleigh: {

  name: "봅슬레이",

  season: "winter",

  icon: "🛷",

  category: "sliding",

  metrics: [

    "startTime",
    "pushFrequency",
    "speed",
    "acceleration",
    "entryTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee"

  ]

},


luge: {

  name: "루지",

  season: "winter",

  icon: "🛷",

  category: "sliding",

  metrics: [

    "startTime",
    "speed",
    "trajectory",
    "bodyAlignment"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee"

  ]

},


curling: {

  name: "컬링",

  season: "winter",

  icon: "🥌",

  category: "precision",

  metrics: [

    "deliveryTime",
    "releaseSpeed",
    "balance",
    "slideDistance",
    "releaseConsistency"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


/* =========================================================
   ATHLETICS
========================================================= */

sprint: {

  name: "단거리",

  season: "summer",

  icon: "🏃",

  category: "running",

  metrics: [

    "distance",
    "time",
    "speed",
    "acceleration",
    "cadence",
    "strideLength",
    "groundContactTime",
    "flightTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ],

  phases: [

    "start",
    "acceleration",
    "maxVelocity",
    "finish"

  ]

},


middleDistance: {

  name: "중거리",

  season: "summer",

  icon: "🏃",

  category: "running",

  metrics: [

    "distance",
    "time",
    "pace",
    "speed",
    "cadence",
    "strideLength",
    "groundContactTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


longDistance: {

  name: "장거리",

  season: "summer",

  icon: "🏃",

  category: "running",

  metrics: [

    "distance",
    "time",
    "pace",
    "speed",
    "cadence",
    "strideLength",
    "runningEconomy"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


hurdles: {

  name: "허들",

  season: "summer",

  icon: "🏃",

  category: "running",

  metrics: [

    "time",
    "speed",
    "takeoffDistance",
    "landingDistance",
    "clearanceTime",
    "stridePattern"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


raceWalking: {

  name: "경보",

  season: "summer",

  icon: "🚶",

  category: "running",

  metrics: [

    "distance",
    "time",
    "pace",
    "cadence",
    "strideLength",
    "groundContact"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


longJump: {

  name: "멀리뛰기",

  season: "summer",

  icon: "🏃",

  category: "jump",

  metrics: [

    "approachSpeed",
    "takeoffSpeed",
    "takeoffAngle",
    "jumpDistance",
    "flightTime",
    "landing"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


tripleJump: {

  name: "세단뛰기",

  season: "summer",

  icon: "🏃",

  category: "jump",

  metrics: [

    "approachSpeed",
    "hopDistance",
    "stepDistance",
    "jumpDistance",
    "contactTime",
    "takeoffAngle"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


highJump: {

  name: "높이뛰기",

  season: "summer",

  icon: "🏃",

  category: "jump",

  metrics: [

    "approachSpeed",
    "takeoffAngle",
    "jumpHeight",
    "flightTime",
    "barClearance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


poleVault: {

  name: "장대높이뛰기",

  season: "summer",

  icon: "🏃",

  category: "jump",

  metrics: [

    "approachSpeed",
    "plantTime",
    "takeoffAngle",
    "swingTime",
    "clearanceHeight"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


shotPut: {

  name: "포환던지기",

  season: "summer",

  icon: "⭕",

  category: "throw",

  metrics: [

    "releaseSpeed",
    "releaseAngle",
    "releaseHeight",
    "rotationSpeed",
    "throwDistance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


discus: {

  name: "원반던지기",

  season: "summer",

  icon: "🥏",

  category: "throw",

  metrics: [

    "releaseSpeed",
    "releaseAngle",
    "rotationSpeed",
    "throwDistance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder"

  ]

},


javelin: {

  name: "창던지기",

  season: "summer",

  icon: "➶",

  category: "throw",

  metrics: [

    "approachSpeed",
    "releaseSpeed",
    "releaseAngle",
    "throwDistance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


hammerThrow: {

  name: "해머던지기",

  season: "summer",

  icon: "🔘",

  category: "throw",

  metrics: [

    "rotationSpeed",
    "releaseSpeed",
    "releaseAngle",
    "throwDistance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


/* =========================================================
   WEIGHTLIFTING / STRENGTH
========================================================= */

weightlifting: {

  name: "역도",

  season: "summer",

  icon: "🏋️",

  category: "barbell",

  metrics: [

    "barPath",
    "horizontalDeviation",
    "peakVelocity",
    "verticalVelocity",
    "firstPull",
    "secondPull",
    "catch",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ],

  exercises: [

    "Snatch",
    "Clean",
    "Clean & Jerk",
    "Power Clean",
    "Power Snatch",
    "Hang Clean",
    "Hang Snatch",
    "Clean Pull",
    "Snatch Pull",
    "Front Squat",
    "Back Squat",
    "Overhead Squat",
    "Push Press",
    "Push Jerk",
    "Split Jerk"

  ],

  special: [

    "barbellTracking",
    "barPath",
    "velocity",
    "phaseDetection"

  ]

},


/* =========================================================
   SWIMMING
========================================================= */

swimming: {

  name: "수영",

  season: "summer",

  icon: "🏊",

  category: "aquatic",

  metrics: [

    "lapTime",
    "strokeRate",
    "strokeLength",
    "strokeCount",
    "speed",
    "turnTime",
    "streamline"

  ],

  angles: [

    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee"

  ],

  techniques: [

    "Freestyle",
    "Backstroke",
    "Breaststroke",
    "Butterfly"

  ]

},


diving: {

  name: "다이빙",

  season: "summer",

  icon: "🤿",

  category: "aquatic",

  metrics: [

    "takeoff",
    "jumpHeight",
    "rotationSpeed",
    "entryAngle",
    "bodyAlignment"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


/* =========================================================
   CYCLING / ROWING
========================================================= */

cycling: {

  name: "사이클",

  season: "summer",

  icon: "🚴",

  category: "endurance",

  metrics: [

    "cadence",
    "speed",
    "power",
    "leftRightBalance",
    "pedalCycle"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


rowing: {

  name: "조정",

  season: "summer",

  icon: "🚣",

  category: "endurance",

  metrics: [

    "strokeRate",
    "strokeLength",
    "driveTime",
    "recoveryTime",
    "power",
    "rhythm"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


canoe: {

  name: "카누",

  season: "summer",

  icon: "🛶",

  category: "endurance",

  metrics: [

    "strokeRate",
    "strokeLength",
    "strokeTime",
    "trunkRotation",
    "symmetry"

  ],

  angles: [

    "trunk",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow",
    "leftHip",
    "rightHip"

  ]

},


/* =========================================================
   TEAM SPORTS
========================================================= */

football: {

  name: "축구",

  season: "summer",

  icon: "⚽",

  category: "team",

  metrics: [

    "sprintSpeed",
    "acceleration",
    "deceleration",
    "changeDirection",
    "kickSpeed",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


basketball: {

  name: "농구",

  season: "summer",

  icon: "🏀",

  category: "team",

  metrics: [

    "acceleration",
    "deceleration",
    "jumpHeight",
    "landing",
    "changeDirection",
    "firstStep"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


volleyball: {

  name: "배구",

  season: "summer",

  icon: "🏐",

  category: "team",

  metrics: [

    "approachSpeed",
    "jumpHeight",
    "takeoff",
    "armSwing",
    "landing"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


handball: {

  name: "핸드볼",

  season: "summer",

  icon: "🤾",

  category: "team",

  metrics: [

    "throwSpeed",
    "jumpHeight",
    "approachSpeed",
    "landing",
    "rotation"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


baseball: {

  name: "야구",

  season: "summer",

  icon: "⚾",

  category: "team",

  metrics: [

    "throwVelocity",
    "batSpeed",
    "rotationSpeed",
    "strideLength",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


rugby: {

  name: "럭비",

  season: "summer",

  icon: "🏉",

  category: "team",

  metrics: [

    "sprintSpeed",
    "acceleration",
    "changeDirection",
    "contactBalance",
    "power"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee"

  ]

},


hockey: {

  name: "하키",

  season: "summer",

  icon: "🏑",

  category: "team",

  metrics: [

    "speed",
    "acceleration",
    "changeDirection",
    "stickMotion",
    "posture"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


/* =========================================================
   RACKET
========================================================= */

tennis: {

  name: "테니스",

  season: "summer",

  icon: "🎾",

  category: "racket",

  metrics: [

    "swingSpeed",
    "rotation",
    "footwork",
    "balance",
    "contactTiming"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


badminton: {

  name: "배드민턴",

  season: "summer",

  icon: "🏸",

  category: "racket",

  metrics: [

    "footwork",
    "reaction",
    "lunge",
    "swingSpeed",
    "jumpHeight"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


tableTennis: {

  name: "탁구",

  season: "summer",

  icon: "🏓",

  category: "racket",

  metrics: [

    "reaction",
    "footwork",
    "swingSpeed",
    "rotation",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


/* =========================================================
   COMBAT
========================================================= */

taekwondo: {

  name: "태권도",

  season: "summer",

  icon: "🥋",

  category: "combat",

  metrics: [

    "kickSpeed",
    "kickHeight",
    "rotation",
    "balance",
    "reaction"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


judo: {

  name: "유도",

  season: "summer",

  icon: "🥋",

  category: "combat",

  metrics: [

    "balance",
    "rotation",
    "entrySpeed",
    "power",
    "stability"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


wrestling: {

  name: "레슬링",

  season: "summer",

  icon: "🤼",

  category: "combat",

  metrics: [

    "stance",
    "entrySpeed",
    "power",
    "balance",
    "rotation"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

},


boxing: {

  name: "복싱",

  season: "summer",

  icon: "🥊",

  category: "combat",

  metrics: [

    "punchSpeed",
    "reaction",
    "rotation",
    "footwork",
    "balance"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


fencing: {

  name: "펜싱",

  season: "summer",

  icon: "🤺",

  category: "combat",

  metrics: [

    "reaction",
    "lungeDistance",
    "lungeSpeed",
    "balance",
    "recoveryTime"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftAnkle",
    "rightAnkle"

  ]

},


/* =========================================================
   GYMNASTICS
========================================================= */

gymnastics: {

  name: "체조",

  season: "summer",

  icon: "🤸",

  category: "gymnastics",

  metrics: [

    "rotation",
    "jumpHeight",
    "landing",
    "bodyAlignment",
    "balance",
    "symmetry"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow"

  ]

},


trampoline: {

  name: "트램펄린",

  season: "summer",

  icon: "🤸",

  category: "gymnastics",

  metrics: [

    "jumpHeight",
    "airTime",
    "rotation",
    "bodyAlignment",
    "landing"

  ],

  angles: [

    "trunk",
    "leftHip",
    "rightHip",
    "leftKnee",
    "rightKnee",
    "leftShoulder",
    "rightShoulder"

  ]

}

};


/* =========================================================
   04. METRIC LABELS
========================================================= */

const SPORT_METRIC_LABELS = {

  distance: ["거리", "m"],
  time: ["기록", "초"],
  speed: ["속도", "m/s"],
  pace: ["페이스", "min/km"],

  acceleration: ["가속도", "m/s²"],

  cadence: ["케이던스", "spm"],
  strideLength: ["보폭", "m"],

  groundContactTime: ["접지시간", "ms"],
  flightTime: ["비행시간", "초"],

  segmentTime: ["구간시간", "초"],

  elevationGain: ["상승고도", "m"],
  slope: ["경사도", "%"],

  glide: ["글라이드", "점"],
  poleTiming: ["폴링 타이밍", "점"],

  techniqueTransition:
    ["주법 전환", "점"],

  uphillAnalysis:
    ["오르막 수행", "점"],

  lapTime: ["랩타임", "초"],

  pushTime: ["푸시 시간", "초"],
  glideTime: ["글라이드 시간", "초"],

  cornerSpeed: ["코너 속도", "m/s"],

  strideRate: ["스트라이드율", "spm"],

  edgeAngle: ["엣지각", "°"],
  leanAngle: ["기울기각", "°"],

  pressureBalance:
    ["압력 밸런스", "%"],

  turnTime: ["턴 시간", "초"],

  trajectory: ["궤적", ""],

  rotationSpeed:
    ["회전 속도", "°/s"],

  jumpHeight: ["점프 높이", "cm"],

  landingStability:
    ["착지 안정성", "점"],

  approachSpeed:
    ["도움닫기 속도", "m/s"],

  takeoffAngle:
    ["도약각", "°"],

  takeoffVelocity:
    ["도약 속도", "m/s"],

  flightPosture:
    ["비행 자세", "점"],

  startTime: ["스타트 기록", "초"],

  pushFrequency:
    ["푸시 빈도", "회/초"],

  bodyAlignment:
    ["신체 정렬", "점"],

  cornerTime:
    ["코너 구간시간", "초"],

  releaseSpeed:
    ["릴리스 속도", "m/s"],

  releaseAngle:
    ["릴리스각", "°"],

  releaseHeight:
    ["릴리스 높이", "m"],

  throwDistance:
    ["투척 거리", "m"],

  takeoffSpeed:
    ["도약 속도", "m/s"],

  jumpDistance:
    ["점프 거리", "m"],

  barPath:
    ["바벨 궤적", ""],

  horizontalDeviation:
    ["수평 편차", "cm"],

  peakVelocity:
    ["최대 바벨 속도", "m/s"],

  verticalVelocity:
    ["수직 속도", "m/s"],

  firstPull:
    ["1차 풀", "점"],

  secondPull:
    ["2차 풀", "점"],

  catch:
    ["캐치", "점"],

  strokeRate:
    ["스트로크율", "spm"],

  strokeLength:
    ["스트로크 길이", "m"],

  strokeCount:
    ["스트로크 수", "회"],

  turnTime:
    ["턴 시간", "초"],

  streamline:
    ["스트림라인", "점"],

  power:
    ["파워", "W"],

  leftRightBalance:
    ["좌우 밸런스", "%"],

  pedalCycle:
    ["페달링 사이클", "점"],

  driveTime:
    ["드라이브 시간", "초"],

  recoveryTime:
    ["리커버리 시간", "초"],

  rhythm:
    ["리듬", "점"],

  sprintSpeed:
    ["스프린트 속도", "m/s"],

  deceleration:
    ["감속 능력", "점"],

  changeDirection:
    ["방향전환", "점"],

  kickSpeed:
    ["킥 속도", "m/s"],

  firstStep:
    ["첫 스텝", "점"],

  armSwing:
    ["암스윙", "점"],

  throwSpeed:
    ["투구 속도", "m/s"],

  batSpeed:
    ["배트 속도", "m/s"],

  swingSpeed:
    ["스윙 속도", "m/s"],

  footwork:
    ["풋워크", "점"],

  reaction:
    ["반응", "점"],

  balance:
    ["밸런스", "점"],

  rotation:
    ["회전", "점"],

  landing:
    ["착지", "점"]

};


/* =========================================================
   05. GET PROFILE
========================================================= */

function getSportAnalysisProfile(
  sport
) {

  return (
    SPORT_ANALYSIS_PROFILES[
      sport
    ] ||
    null
  );

}


/* =========================================================
   06. SELECT SPORT
========================================================= */

function selectSportAnalysis(
  sport
) {

  const profile =
    getSportAnalysisProfile(
      sport
    );


  if (!profile) {

    console.warn(
      "[SEOLCHEON] Unknown sport:",
      sport
    );

    return null;

  }


  SPORT_ANALYSIS_STATE
    .selectedSport =
      sport;


  SPORT_ANALYSIS_STATE
    .selectedProfile =
      profile;


  SPORT_ANALYSIS_STATE
    .liveMetrics =
      {};


  SPORT_ANALYSIS_STATE
    .segments =
      [];


  renderSportAnalysisProfile(
    sport,
    profile
  );


  window.dispatchEvent(
    new CustomEvent(
      "seolcheon:sport-analysis-profile",
      {
        detail: {
          sport,
          profile
        }
      }
    )
  );


  return profile;

}


/* =========================================================
   07. RENDER PROFILE
========================================================= */

function renderSportAnalysisProfile(
  sport,
  profile
) {

  const title =
    document.querySelector(
      "[data-sport-analysis-title]"
    );


  if (title) {

    title.textContent =
      `${profile.icon || ""} ${profile.name}`;

  }


  const season =
    document.querySelector(
      "[data-sport-analysis-season]"
    );


  if (season) {

    season.textContent =
      profile.season ===
        "winter"
        ? "동계 종목"
        : "하계 종목";

  }


  renderSportMetrics(
    profile
  );

  renderSportAngles(
    profile
  );

  renderSportTechniques(
    profile
  );

  renderSportSpecialPanels(
    sport,
    profile
  );

}


/* =========================================================
   08. METRICS UI
========================================================= */

function renderSportMetrics(
  profile
) {

  const container =
    document.querySelector(
      "[data-sport-metrics]"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    profile.metrics
      .map(
        metric => {

          const info =
            SPORT_METRIC_LABELS[
              metric
            ] ||
            [metric, ""];


          return `

            <div
              class="analysis-metric-card"
              data-metric-card="${metric}"
            >

              <span>
                ${info[0]}
              </span>

              <strong
                data-metric-value="${metric}"
              >
                --
              </strong>

              <small>
                ${info[1]}
              </small>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   09. ANGLES UI
========================================================= */

function renderSportAngles(
  profile
) {

  const container =
    document.querySelector(
      "[data-sport-angles]"
    );


  if (!container) {
    return;
  }


  const angleLabels = {

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
    profile.angles
      .map(
        angle => `

          <div
            class="joint-angle-item"
          >

            <span>
              ${
                angleLabels[
                  angle
                ] ||
                angle
              }
            </span>

            <strong
              data-joint-angle="${angle}"
            >
              --°
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   10. TECHNIQUE UI
========================================================= */

function renderSportTechniques(
  profile
) {

  const container =
    document.querySelector(
      "[data-sport-techniques]"
    );


  if (!container) {
    return;
  }


  if (
    !profile.techniques ||
    profile.techniques.length ===
      0
  ) {

    container.innerHTML =
      "";

    container.hidden =
      true;

    return;

  }


  container.hidden =
    false;


  container.innerHTML =
    profile.techniques
      .map(
        technique => `

          <span
            class="technique-chip"
            data-technique="${technique}"
          >
            ${technique}
          </span>

        `
      )
      .join("");

}


/* =========================================================
   11. SPECIAL PANELS
========================================================= */

function renderSportSpecialPanels(
  sport,
  profile
) {

  document
    .querySelectorAll(
      "[data-sport-special]"
    )
    .forEach(
      panel => {

        panel.hidden =
          true;

      }
    );


  /*
     바이애슬론
  */

  if (
    sport ===
    "biathlon"
  ) {

    showSportPanel(
      "ski-technique"
    );

    showSportPanel(
      "segment"
    );

    showSportPanel(
      "terrain"
    );

  }


  /*
     러닝
  */

  if (
    profile.category ===
    "running"
  ) {

    showSportPanel(
      "running"
    );

    showSportPanel(
      "segment"
    );

  }


  /*
     역도
  */

  if (
    sport ===
    "weightlifting"
  ) {

    showSportPanel(
      "barbell"
    );

    showSportPanel(
      "trajectory"
    );

  }


  /*
     점프
  */

  if (
    profile.category ===
    "jump"
  ) {

    showSportPanel(
      "jump"
    );

    showSportPanel(
      "trajectory"
    );

  }


  /*
     투척
  */

  if (
    profile.category ===
    "throw"
  ) {

    showSportPanel(
      "throw"
    );

    showSportPanel(
      "trajectory"
    );

  }


  /*
     빙상
  */

  if (
    profile.category ===
    "skating"
  ) {

    showSportPanel(
      "skating"
    );

    showSportPanel(
      "segment"
    );

  }

}


/* =========================================================
   12. SHOW PANEL
========================================================= */

function showSportPanel(
  panelName
) {

  const panel =
    document.querySelector(
      `[data-sport-special="${panelName}"]`
    );


  if (panel) {

    panel.hidden =
      false;

  }

}


/* =========================================================
   13. UPDATE METRIC
========================================================= */

function updateSportMetric(
  key,
  value
) {

  SPORT_ANALYSIS_STATE
    .liveMetrics[
      key
    ] =
      value;


  const element =
    document.querySelector(
      `[data-metric-value="${key}"]`
    );


  if (element) {

    element.textContent =
      formatSportMetric(
        key,
        value
      );

  }

}


/* =========================================================
   14. FORMAT METRIC
========================================================= */

function formatSportMetric(
  key,
  value
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return "--";

  }


  if (
    typeof value ===
    "number"
  ) {

    if (
      [
        "time",
        "segmentTime",
        "lapTime",
        "turnTime",
        "flightTime",
        "pushTime",
        "glideTime"
      ].includes(
        key
      )
    ) {

      return value.toFixed(
        2
      );

    }


    return Number(
      value.toFixed(
        2
      )
    );

  }


  return value;

}


/* =========================================================
   15. UPDATE ANGLE
========================================================= */

function updateSportAngle(
  joint,
  angle
) {

  const element =
    document.querySelector(
      `[data-joint-angle="${joint}"]`
    );


  if (element) {

    element.textContent =
      Number.isFinite(
        Number(angle)
      )
        ? `${Number(angle).toFixed(1)}°`
        : "--°";

  }

}


/* =========================================================
   16. UPDATE TECHNIQUE
========================================================= */

function updateDetectedTechnique(
  technique
) {

  document
    .querySelectorAll(
      "[data-technique]"
    )
    .forEach(
      element => {

        element.classList.toggle(
          "active",
          element.dataset
            .technique ===
            technique
        );

      }
    );


  const current =
    document.querySelector(
      "[data-current-technique]"
    );


  if (current) {

    current.textContent =
      technique ||
      "--";

  }


  const result =
    window
      .SeolcheonAnalysisController
      ?.state
      ?.currentResult;


  if (
    result &&
    result.technique
  ) {

    if (
      result.technique.current !==
      technique
    ) {

      if (
        result.technique.current
      ) {

        result.technique
          .transitions
          .push({

            from:
              result.technique.current,

            to:
              technique,

            time:
              performance.now()

          });

      }


      result.technique.current =
        technique;

    }


    if (
      technique &&
      !result.technique
        .detected
        .includes(
          technique
        )
    ) {

      result.technique
        .detected
        .push(
          technique
        );

    }

  }

}


/* =========================================================
   17. SEGMENT
========================================================= */

function addSportSegment(
  data
) {

  const segment = {

    id:
      `SPORT-SEG-${
        SPORT_ANALYSIS_STATE
          .segments
          .length + 1
      }`,

    ...data

  };


  SPORT_ANALYSIS_STATE
    .segments
    .push(
      segment
    );


  if (
    window.SeolcheonAnalysisController
  ) {

    window
      .SeolcheonAnalysisController
      .segment(
        segment
      );

  }


  renderSportSegments();


  return segment;

}


/* =========================================================
   18. SEGMENT UI
========================================================= */

function renderSportSegments() {

  const container =
    document.querySelector(
      "[data-segment-list]"
    );


  if (!container) {
    return;
  }


  if (
    SPORT_ANALYSIS_STATE
      .segments
      .length ===
      0
  ) {

    container.innerHTML =
      "<p>구간 분석 데이터가 없습니다.</p>";

    return;

  }


  container.innerHTML =
    SPORT_ANALYSIS_STATE
      .segments
      .map(
        segment => `

          <div
            class="segment-row"
          >

            <strong>
              ${
                segment.name ||
                "구간"
              }
            </strong>

            <span>
              ${
                segment.distance ??
                "-"
              } m
            </span>

            <span>
              ${
                segment.duration ??
                "-"
              } 초
            </span>

            <span>
              ${
                segment.technique ||
                "-"
              }
            </span>

            <span>
              ${
                segment.slope ??
                "-"
              } %
            </span>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   19. BIATHLON UPDATE
========================================================= */

function updateBiathlonAnalysis(
  data = {}
) {

  const keys = [

    "distance",
    "time",
    "speed",
    "segmentTime",
    "elevationGain",
    "slope",
    "cadence",
    "glide",
    "poleTiming",
    "techniqueTransition"

  ];


  keys.forEach(
    key => {

      if (
        data[key] !==
        undefined
      ) {

        updateSportMetric(
          key,
          data[key]
        );

      }

    }
  );


  if (
    data.technique
  ) {

    updateDetectedTechnique(
      data.technique
    );

  }


  window
    .SeolcheonAnalysisController
    ?.sportResult(
      data
    );

}


/* =========================================================
   20. RUNNING UPDATE
========================================================= */

function updateRunningAnalysis(
  data = {}
) {

  [

    "distance",
    "time",
    "speed",
    "pace",
    "acceleration",
    "cadence",
    "strideLength",
    "groundContactTime",
    "flightTime"

  ]
  .forEach(
    key => {

      if (
        data[key] !==
        undefined
      ) {

        updateSportMetric(
          key,
          data[key]
        );

      }

    }
  );


  window
    .SeolcheonAnalysisController
    ?.sportResult(
      data
    );

}


/* =========================================================
   21. WEIGHTLIFTING UPDATE
========================================================= */

function updateWeightliftingAnalysis(
  data = {}
) {

  [

    "horizontalDeviation",
    "peakVelocity",
    "verticalVelocity",
    "firstPull",
    "secondPull",
    "catch"

  ]
  .forEach(
    key => {

      if (
        data[key] !==
        undefined
      ) {

        updateSportMetric(
          key,
          data[key]
        );

      }

    }
  );


  if (
    Array.isArray(
      data.trajectory
    )
  ) {

    window.dispatchEvent(
      new CustomEvent(
        "seolcheon:barbell-trajectory",
        {
          detail: {
            trajectory:
              data.trajectory
          }
        }
      )
    );

  }


  window
    .SeolcheonAnalysisController
    ?.sportResult(
      data
    );

}


/* =========================================================
   22. GENERIC SPORT UPDATE
========================================================= */

function updateGenericSportAnalysis(
  data = {}
) {

  Object.entries(
    data
  )
  .forEach(
    ([key, value]) => {

      updateSportMetric(
        key,
        value
      );

    }
  );


  window
    .SeolcheonAnalysisController
    ?.sportResult(
      data
    );

}


/* =========================================================
   23. RECEIVE ANALYSIS DATA
========================================================= */

function receiveSportAnalysisData(
  data = {}
) {

  const sport =
    SPORT_ANALYSIS_STATE
      .selectedSport;


  const profile =
    SPORT_ANALYSIS_STATE
      .selectedProfile;


  if (
    !sport ||
    !profile
  ) {

    return;

  }


  if (
    data.angles
  ) {

    Object.entries(
      data.angles
    )
    .forEach(
      ([joint, angle]) => {

        updateSportAngle(
          joint,
          angle
        );

      }
    );

  }


  switch (
    sport
  ) {

    case "biathlon":

      updateBiathlonAnalysis(
        data
      );

      break;


    case "sprint":

    case "middleDistance":

    case "longDistance":

    case "hurdles":

    case "raceWalking":

      updateRunningAnalysis(
        data
      );

      break;


    case "weightlifting":

      updateWeightliftingAnalysis(
        data
      );

      break;


    default:

      updateGenericSportAnalysis(
        data
      );

      break;

  }

}


/* =========================================================
   24. GET CURRENT DATA
========================================================= */

function getCurrentSportAnalysisData() {

  return {

    sport:
      SPORT_ANALYSIS_STATE
        .selectedSport,

    profile:
      SPORT_ANALYSIS_STATE
        .selectedProfile,

    metrics: {
      ...SPORT_ANALYSIS_STATE
        .liveMetrics
    },

    segments: [
      ...SPORT_ANALYSIS_STATE
        .segments
    ]

  };

}


/* =========================================================
   25. GET SPORTS
========================================================= */

function getSportsBySeason(
  season
) {

  return Object.entries(
    SPORT_ANALYSIS_PROFILES
  )
  .filter(
    ([, profile]) =>
      profile.season ===
      season
  )
  .map(
    ([id, profile]) => ({

      id,

      ...profile

    })
  );

}


/* =========================================================
   26. SPORT PICTOGRAM DATA
========================================================= */

function createSportPictograms(
  season
) {

  return getSportsBySeason(
    season
  )
  .map(
    sport => ({

      id:
        sport.id,

      name:
        sport.name,

      icon:
        sport.icon,

      season:
        sport.season,

      category:
        sport.category

    })
  );

}


/* =========================================================
   27. RENDER SPORT SELECTOR
========================================================= */

function renderSportSelector(
  season
) {

  const container =
    document.querySelector(
      `[data-sport-selector="${season}"]`
    );


  if (!container) {

    return;

  }


  const sports =
    createSportPictograms(
      season
    );


  container.innerHTML =
    sports
      .map(
        sport => `

          <button
            type="button"
            class="sport-pictogram-card"
            data-analysis-sport="${sport.id}"
            data-season="${sport.season}"
            data-sport-name="${sport.name}"
          >

            <span
              class="sport-pictogram-icon"
            >
              ${sport.icon}
            </span>

            <strong>
              ${sport.name}
            </strong>

          </button>

        `
      )
      .join("");

}


/* =========================================================
   28. RENDER ALL SPORT SELECTORS
========================================================= */

function renderAllSportSelectors() {

  renderSportSelector(
    "winter"
  );

  renderSportSelector(
    "summer"
  );

}


/* =========================================================
   29. CLICK DELEGATION

   종목 버튼이 JS로 나중에 생성되므로
   이벤트 위임 방식 사용
========================================================= */

function bindSportSelectorEvents() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-analysis-sport]"
        );


      if (!button) {

        return;

      }


      const sport =
        button.dataset
          .analysisSport;


      const season =
        button.dataset
          .season ||
        "";


      const name =
        button.dataset
          .sportName ||
        button.textContent
          .trim();


      selectSportAnalysis(
        sport
      );


      if (
        window.SeolcheonAnalysisController
      ) {

        window
          .SeolcheonAnalysisController
          .sport(
            sport,
            season,
            name
          );

      }

    }
  );

}


/* =========================================================
   30. LISTEN POSE RESULTS
========================================================= */

function bindPoseResultListener() {

  window.addEventListener(
    "seolcheon:pose-result",
    event => {

      const data =
        event.detail?.data;


      if (!data) {

        return;

      }


      receiveSportAnalysisData(
        data
      );

    }
  );

}


/* =========================================================
   31. RESET
========================================================= */

function resetSportAnalysis() {

  SPORT_ANALYSIS_STATE
    .liveMetrics =
      {};


  SPORT_ANALYSIS_STATE
    .segments =
      [];


  document
    .querySelectorAll(
      "[data-metric-value]"
    )
    .forEach(
      element => {

        element.textContent =
          "--";

      }
    );


  document
    .querySelectorAll(
      "[data-joint-angle]"
    )
    .forEach(
      element => {

        element.textContent =
          "--°";

      }
    );


  renderSportSegments();

}


/* =========================================================
   32. INITIALIZE
========================================================= */

function initializeSportAnalysis() {

  if (
    SPORT_ANALYSIS_STATE
      .initialized
  ) {

    return;

  }


  renderAllSportSelectors();

  bindSportSelectorEvents();

  bindPoseResultListener();


  SPORT_ANALYSIS_STATE
    .initialized =
      true;


  console.log(
    "[SEOLCHEON] Sport Analysis Ready:",
    Object.keys(
      SPORT_ANALYSIS_PROFILES
    ).length,
    "sports"
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
    initializeSportAnalysis
  );

}

else {

  initializeSportAnalysis();

}


/* =========================================================
   34. PUBLIC API
========================================================= */

window.SeolcheonSportAnalysis = {

  state:
    SPORT_ANALYSIS_STATE,

  profiles:
    SPORT_ANALYSIS_PROFILES,

  metricLabels:
    SPORT_METRIC_LABELS,

  init:
    initializeSportAnalysis,

  selectSport:
    selectSportAnalysis,

  getProfile:
    getSportAnalysisProfile,

  winter:
    () =>
      getSportsBySeason(
        "winter"
      ),

  summer:
    () =>
      getSportsBySeason(
        "summer"
      ),

  pictograms:
    createSportPictograms,

  renderSelectors:
    renderAllSportSelectors,

  update:
    receiveSportAnalysisData,

  metric:
    updateSportMetric,

  angle:
    updateSportAngle,

  technique:
    updateDetectedTechnique,

  addSegment:
    addSportSegment,

  current:
    getCurrentSportAnalysisData,

  reset:
    resetSportAnalysis

};


/* =========================================================
   END
========================================================= */