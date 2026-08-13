/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   DATA / TRAINING-LIBRARY.JS
   VERSION 1.0

   역할
   ---------------------------------------------------------
   - 분석 결과 기반 추가 훈련 추천
   - 근력 / 파워 / 코어 / 플라이오메트릭
   - 스피드 / 민첩성 / 밸런스 / 가동성
   - 러닝 / 스키 / 역도 / 점프 종목 보조훈련
   - 부족한 분석 지표와 훈련 자동 연결

   주의
   ---------------------------------------------------------
   이 파일은 훈련 "라이브러리"이다.
   실제 추천 알고리즘은 training.js에서 처리한다.
========================================================= */

"use strict";


/* =========================================================
   01. TRAINING CATEGORY
========================================================= */

const TRAINING_CATEGORIES = {

  strength: {
    id: "strength",
    name: "근력",
    english: "STRENGTH",
    icon: "🏋️"
  },

  power: {
    id: "power",
    name: "파워",
    english: "POWER",
    icon: "⚡"
  },

  core: {
    id: "core",
    name: "코어",
    english: "CORE",
    icon: "◎"
  },

  plyometric: {
    id: "plyometric",
    name: "플라이오메트릭",
    english: "PLYOMETRIC",
    icon: "↥"
  },

  speed: {
    id: "speed",
    name: "스피드",
    english: "SPEED",
    icon: "🏃"
  },

  agility: {
    id: "agility",
    name: "민첩성",
    english: "AGILITY",
    icon: "↔"
  },

  balance: {
    id: "balance",
    name: "밸런스",
    english: "BALANCE",
    icon: "⚖"
  },

  mobility: {
    id: "mobility",
    name: "가동성",
    english: "MOBILITY",
    icon: "◯"
  },

  stability: {
    id: "stability",
    name: "안정성",
    english: "STABILITY",
    icon: "◇"
  },

  running: {
    id: "running",
    name: "러닝 기술",
    english: "RUNNING",
    icon: "🏃"
  },

  ski: {
    id: "ski",
    name: "스키 기술",
    english: "SKI TECHNIQUE",
    icon: "⛷️"
  },

  weightlifting: {
    id: "weightlifting",
    name: "역도 기술",
    english: "WEIGHTLIFTING",
    icon: "🏋️"
  },

  recovery: {
    id: "recovery",
    name: "회복",
    english: "RECOVERY",
    icon: "↻"
  }

};


/* =========================================================
   02. TRAINING LIBRARY
========================================================= */

const TRAINING_LIBRARY = [

  /* =======================================================
     LOWER BODY STRENGTH
  ======================================================= */

  {
    id: "back_squat",
    name: "백 스쿼트",
    english: "Back Squat",
    category: "strength",

    targets: [
      "lower_body_strength",
      "hip_strength",
      "knee_strength"
    ],

    relatedMetrics: [
      "무릎 각도",
      "고관절 각도",
      "푸시오프",
      "가속"
    ]
  },

  {
    id: "front_squat",
    name: "프론트 스쿼트",
    english: "Front Squat",
    category: "strength",

    targets: [
      "quad_strength",
      "core",
      "posture"
    ],

    relatedMetrics: [
      "몸통 각도",
      "무릎 각도",
      "캐치 안정성"
    ]
  },

  {
    id: "split_squat",
    name: "스플릿 스쿼트",
    english: "Split Squat",
    category: "strength",

    targets: [
      "single_leg_strength",
      "symmetry"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "무릎 안정성",
      "고관절 안정성"
    ]
  },

  {
    id: "bulgarian_split_squat",
    name: "불가리안 스플릿 스쿼트",
    english: "Bulgarian Split Squat",
    category: "strength",

    targets: [
      "single_leg_strength",
      "balance",
      "hip_strength"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "푸시오프",
      "밸런스"
    ]
  },

  {
    id: "goblet_squat",
    name: "고블릿 스쿼트",
    english: "Goblet Squat",
    category: "strength",

    targets: [
      "squat_pattern",
      "posture"
    ],

    relatedMetrics: [
      "몸통 각도",
      "무릎 각도",
      "고관절 각도"
    ]
  },

  {
    id: "step_up",
    name: "스텝업",
    english: "Step Up",
    category: "strength",

    targets: [
      "single_leg_strength",
      "hip_drive"
    ],

    relatedMetrics: [
      "무릎 드라이브",
      "푸시오프",
      "좌우 대칭"
    ]
  },

  {
    id: "reverse_lunge",
    name: "리버스 런지",
    english: "Reverse Lunge",
    category: "strength",

    targets: [
      "single_leg_strength",
      "balance"
    ],

    relatedMetrics: [
      "무릎 안정성",
      "좌우 대칭"
    ]
  },

  {
    id: "walking_lunge",
    name: "워킹 런지",
    english: "Walking Lunge",
    category: "strength",

    targets: [
      "single_leg_strength",
      "coordination"
    ],

    relatedMetrics: [
      "보폭",
      "고관절 안정성"
    ]
  },

  {
    id: "romanian_deadlift",
    name: "루마니안 데드리프트",
    english: "Romanian Deadlift",
    category: "strength",

    targets: [
      "posterior_chain",
      "hip_strength"
    ],

    relatedMetrics: [
      "고관절 각도",
      "몸통 안정성",
      "푸시오프"
    ]
  },

  {
    id: "single_leg_rdl",
    name: "싱글 레그 RDL",
    english: "Single Leg RDL",
    category: "strength",

    targets: [
      "single_leg_strength",
      "balance",
      "posterior_chain"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "밸런스",
      "고관절 안정성"
    ]
  },

  {
    id: "hip_thrust",
    name: "힙 쓰러스트",
    english: "Hip Thrust",
    category: "strength",

    targets: [
      "hip_extension",
      "glute_strength"
    ],

    relatedMetrics: [
      "고관절 신전",
      "가속",
      "푸시오프"
    ]
  },

  {
    id: "calf_raise",
    name: "카프 레이즈",
    english: "Calf Raise",
    category: "strength",

    targets: [
      "ankle_strength",
      "calf_strength"
    ],

    relatedMetrics: [
      "발목 각도",
      "푸시오프"
    ]
  },


  /* =======================================================
     UPPER BODY
  ======================================================= */

  {
    id: "bench_press",
    name: "벤치프레스",
    english: "Bench Press",
    category: "strength",

    targets: [
      "upper_body_strength"
    ],

    relatedMetrics: [
      "팔 신전",
      "어깨 안정성"
    ]
  },

  {
    id: "incline_press",
    name: "인클라인 프레스",
    english: "Incline Press",
    category: "strength",

    targets: [
      "upper_body_strength",
      "shoulder_strength"
    ],

    relatedMetrics: [
      "어깨 각도",
      "팔 신전"
    ]
  },

  {
    id: "overhead_press",
    name: "오버헤드 프레스",
    english: "Overhead Press",
    category: "strength",

    targets: [
      "shoulder_strength",
      "core"
    ],

    relatedMetrics: [
      "어깨 안정성",
      "몸통 안정성"
    ]
  },

  {
    id: "pull_up",
    name: "풀업",
    english: "Pull Up",
    category: "strength",

    targets: [
      "pull_strength",
      "lat_strength"
    ],

    relatedMetrics: [
      "폴링",
      "상체 파워"
    ]
  },

  {
    id: "lat_pulldown",
    name: "랫 풀다운",
    english: "Lat Pulldown",
    category: "strength",

    targets: [
      "pull_strength"
    ],

    relatedMetrics: [
      "폴링",
      "팔꿈치 각도"
    ]
  },

  {
    id: "seated_row",
    name: "시티드 로우",
    english: "Seated Row",
    category: "strength",

    targets: [
      "back_strength",
      "scapular_control"
    ],

    relatedMetrics: [
      "어깨 정렬",
      "상체 안정성"
    ]
  },

  {
    id: "single_arm_row",
    name: "원암 로우",
    english: "Single Arm Row",
    category: "strength",

    targets: [
      "back_strength",
      "symmetry"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "폴링"
    ]
  },


  /* =======================================================
     POWER
  ======================================================= */

  {
    id: "jump_squat",
    name: "점프 스쿼트",
    english: "Jump Squat",
    category: "power",

    targets: [
      "lower_body_power"
    ],

    relatedMetrics: [
      "점프 높이",
      "푸시오프",
      "가속"
    ]
  },

  {
    id: "trap_bar_jump",
    name: "트랩바 점프",
    english: "Trap Bar Jump",
    category: "power",

    targets: [
      "lower_body_power"
    ],

    relatedMetrics: [
      "푸시오프",
      "파워"
    ]
  },

  {
    id: "medicine_ball_throw",
    name: "메디신볼 전방 던지기",
    english: "Medicine Ball Throw",
    category: "power",

    targets: [
      "upper_body_power",
      "total_body_power"
    ],

    relatedMetrics: [
      "몸통 회전",
      "팔 가속"
    ]
  },

  {
    id: "rotational_med_ball",
    name: "메디신볼 회전 던지기",
    english: "Rotational Medicine Ball Throw",
    category: "power",

    targets: [
      "rotational_power"
    ],

    relatedMetrics: [
      "골반 회전",
      "몸통 회전"
    ]
  },

  {
    id: "overhead_med_ball",
    name: "메디신볼 오버헤드 스로우",
    english: "Overhead Medicine Ball Throw",
    category: "power",

    targets: [
      "upper_body_power",
      "core_power"
    ],

    relatedMetrics: [
      "폴링",
      "상체 파워"
    ]
  },


  /* =======================================================
     PLYOMETRIC
  ======================================================= */

  {
    id: "box_jump",
    name: "박스 점프",
    english: "Box Jump",
    category: "plyometric",

    targets: [
      "jump_power",
      "landing"
    ],

    relatedMetrics: [
      "도약",
      "착지 안정성"
    ]
  },

  {
    id: "countermovement_jump",
    name: "카운터무브먼트 점프",
    english: "Countermovement Jump",
    category: "plyometric",

    targets: [
      "jump_power"
    ],

    relatedMetrics: [
      "점프 높이",
      "도약 시간"
    ]
  },

  {
    id: "broad_jump",
    name: "제자리 멀리뛰기",
    english: "Broad Jump",
    category: "plyometric",

    targets: [
      "horizontal_power"
    ],

    relatedMetrics: [
      "푸시오프",
      "수평 추진"
    ]
  },

  {
    id: "single_leg_hop",
    name: "싱글 레그 홉",
    english: "Single Leg Hop",
    category: "plyometric",

    targets: [
      "single_leg_power",
      "symmetry"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "착지"
    ]
  },

  {
    id: "lateral_bound",
    name: "레터럴 바운드",
    english: "Lateral Bound",
    category: "plyometric",

    targets: [
      "lateral_power",
      "balance"
    ],

    relatedMetrics: [
      "스키 푸시오프",
      "좌우 이동",
      "밸런스"
    ]
  },

  {
    id: "skater_jump",
    name: "스케이터 점프",
    english: "Skater Jump",
    category: "plyometric",

    targets: [
      "lateral_power",
      "single_leg_stability"
    ],

    relatedMetrics: [
      "스키 추진",
      "좌우 대칭"
    ]
  },

  {
    id: "pogo_jump",
    name: "포고 점프",
    english: "Pogo Jump",
    category: "plyometric",

    targets: [
      "ankle_stiffness",
      "reactive_strength"
    ],

    relatedMetrics: [
      "접지시간 추정",
      "발목 안정성"
    ]
  },

  {
    id: "depth_jump",
    name: "뎁스 점프",
    english: "Depth Jump",
    category: "plyometric",

    targets: [
      "reactive_strength"
    ],

    relatedMetrics: [
      "접지시간 추정",
      "반응성"
    ]
  },


  /* =======================================================
     CORE
  ======================================================= */

  {
    id: "front_plank",
    name: "프론트 플랭크",
    english: "Front Plank",
    category: "core",

    targets: [
      "core_stability"
    ],

    relatedMetrics: [
      "몸통 안정성"
    ]
  },

  {
    id: "side_plank",
    name: "사이드 플랭크",
    english: "Side Plank",
    category: "core",

    targets: [
      "lateral_core",
      "pelvic_stability"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "골반 안정성"
    ]
  },

  {
    id: "dead_bug",
    name: "데드버그",
    english: "Dead Bug",
    category: "core",

    targets: [
      "core_control"
    ],

    relatedMetrics: [
      "몸통 안정성",
      "사지 협응"
    ]
  },

  {
    id: "bird_dog",
    name: "버드독",
    english: "Bird Dog",
    category: "core",

    targets: [
      "core_control",
      "cross_body_coordination"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "몸통 안정성"
    ]
  },

  {
    id: "pallof_press",
    name: "팔로프 프레스",
    english: "Pallof Press",
    category: "core",

    targets: [
      "anti_rotation"
    ],

    relatedMetrics: [
      "몸통 흔들림",
      "몸통 안정성"
    ]
  },

  {
    id: "cable_rotation",
    name: "케이블 로테이션",
    english: "Cable Rotation",
    category: "core",

    targets: [
      "rotational_strength"
    ],

    relatedMetrics: [
      "몸통 회전",
      "골반 회전"
    ]
  },

  {
    id: "hollow_hold",
    name: "할로우 홀드",
    english: "Hollow Hold",
    category: "core",

    targets: [
      "core_stability"
    ],

    relatedMetrics: [
      "몸통 정렬"
    ]
  },


  /* =======================================================
     SPEED
  ======================================================= */

  {
    id: "10m_acceleration",
    name: "10m 가속질주",
    english: "10m Acceleration",
    category: "speed",

    targets: [
      "acceleration"
    ],

    relatedMetrics: [
      "10m 시간",
      "가속",
      "스타트"
    ]
  },

  {
    id: "20m_acceleration",
    name: "20m 가속질주",
    english: "20m Acceleration",
    category: "speed",

    targets: [
      "acceleration"
    ],

    relatedMetrics: [
      "20m 시간",
      "가속"
    ]
  },

  {
    id: "30m_sprint",
    name: "30m 스프린트",
    english: "30m Sprint",
    category: "speed",

    targets: [
      "acceleration",
      "speed"
    ],

    relatedMetrics: [
      "30m 시간",
      "최고 속도"
    ]
  },

  {
    id: "flying_sprint",
    name: "플라잉 스프린트",
    english: "Flying Sprint",
    category: "speed",

    targets: [
      "max_velocity"
    ],

    relatedMetrics: [
      "최고 속도",
      "보폭",
      "케이던스"
    ]
  },

  {
    id: "hill_sprint",
    name: "언덕 스프린트",
    english: "Hill Sprint",
    category: "speed",

    targets: [
      "acceleration",
      "horizontal_force"
    ],

    relatedMetrics: [
      "가속",
      "푸시오프"
    ]
  },


  /* =======================================================
     RUNNING TECHNIQUE
  ======================================================= */

  {
    id: "a_skip",
    name: "A 스킵",
    english: "A-Skip",
    category: "running",

    targets: [
      "running_mechanics"
    ],

    relatedMetrics: [
      "무릎 드라이브",
      "케이던스"
    ]
  },

  {
    id: "b_skip",
    name: "B 스킵",
    english: "B-Skip",
    category: "running",

    targets: [
      "running_mechanics"
    ],

    relatedMetrics: [
      "발 회수",
      "보폭"
    ]
  },

  {
    id: "high_knee",
    name: "하이니 드릴",
    english: "High Knee Drill",
    category: "running",

    targets: [
      "knee_drive"
    ],

    relatedMetrics: [
      "무릎 드라이브",
      "케이던스"
    ]
  },

  {
    id: "wall_drill",
    name: "월 드라이브",
    english: "Wall Drill",
    category: "running",

    targets: [
      "acceleration_posture"
    ],

    relatedMetrics: [
      "몸통 각도",
      "무릎 드라이브"
    ]
  },

  {
    id: "ankling",
    name: "앵클링",
    english: "Ankling",
    category: "running",

    targets: [
      "ankle_control"
    ],

    relatedMetrics: [
      "발목 각도",
      "접지"
    ]
  },


  /* =======================================================
     AGILITY
  ======================================================= */

  {
    id: "505",
    name: "505 방향전환 드릴",
    english: "505 Drill",
    category: "agility",

    targets: [
      "change_of_direction"
    ],

    relatedMetrics: [
      "방향전환",
      "감속"
    ]
  },

  {
    id: "t_drill",
    name: "T 드릴",
    english: "T Drill",
    category: "agility",

    targets: [
      "multidirectional_agility"
    ],

    relatedMetrics: [
      "방향전환",
      "좌우 이동"
    ]
  },

  {
    id: "lateral_shuffle",
    name: "레터럴 셔플",
    english: "Lateral Shuffle",
    category: "agility",

    targets: [
      "lateral_movement"
    ],

    relatedMetrics: [
      "좌우 이동",
      "민첩성"
    ]
  },


  /* =======================================================
     BALANCE / STABILITY
  ======================================================= */

  {
    id: "single_leg_balance",
    name: "싱글 레그 밸런스",
    english: "Single Leg Balance",
    category: "balance",

    targets: [
      "single_leg_balance"
    ],

    relatedMetrics: [
      "밸런스",
      "좌우 대칭"
    ]
  },

  {
    id: "single_leg_reach",
    name: "싱글 레그 리치",
    english: "Single Leg Reach",
    category: "balance",

    targets: [
      "dynamic_balance"
    ],

    relatedMetrics: [
      "무릎 안정성",
      "고관절 안정성"
    ]
  },

  {
    id: "landing_stick",
    name: "점프 착지 홀드",
    english: "Landing Stick",
    category: "stability",

    targets: [
      "landing_control"
    ],

    relatedMetrics: [
      "착지 안정성",
      "좌우 대칭"
    ]
  },

  {
    id: "single_leg_landing",
    name: "싱글 레그 착지",
    english: "Single Leg Landing",
    category: "stability",

    targets: [
      "single_leg_stability"
    ],

    relatedMetrics: [
      "착지",
      "무릎 안정성"
    ]
  },


  /* =======================================================
     MOBILITY
  ======================================================= */

  {
    id: "ankle_mobility",
    name: "발목 가동성 드릴",
    english: "Ankle Mobility Drill",
    category: "mobility",

    targets: [
      "ankle_mobility"
    ],

    relatedMetrics: [
      "발목 각도",
      "스쿼트 깊이"
    ]
  },

  {
    id: "hip_flexor_mobility",
    name: "고관절 굴곡근 가동성",
    english: "Hip Flexor Mobility",
    category: "mobility",

    targets: [
      "hip_mobility"
    ],

    relatedMetrics: [
      "고관절 각도",
      "보폭"
    ]
  },

  {
    id: "hip_rotation",
    name: "고관절 회전 가동성",
    english: "Hip Rotation Mobility",
    category: "mobility",

    targets: [
      "hip_rotation"
    ],

    relatedMetrics: [
      "고관절 회전",
      "골반 움직임"
    ]
  },

  {
    id: "thoracic_rotation",
    name: "흉추 회전 가동성",
    english: "Thoracic Rotation",
    category: "mobility",

    targets: [
      "thoracic_mobility"
    ],

    relatedMetrics: [
      "몸통 회전",
      "상체 움직임"
    ]
  },

  {
    id: "shoulder_mobility",
    name: "어깨 가동성 드릴",
    english: "Shoulder Mobility",
    category: "mobility",

    targets: [
      "shoulder_mobility"
    ],

    relatedMetrics: [
      "어깨 각도",
      "폴링"
    ]
  },


  /* =======================================================
     SKI / BIATHLON
  ======================================================= */

  {
    id: "ski_balance_glide",
    name: "원스키 밸런스 글라이드",
    english: "Single Ski Balance Glide",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "ski_balance",
      "weight_transfer"
    ],

    relatedMetrics: [
      "좌우 대칭",
      "무게중심 이동",
      "스키 추진"
    ]
  },

  {
    id: "ski_no_pole",
    name: "노폴 스케이팅",
    english: "No Pole Skating",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "leg_drive",
      "balance"
    ],

    relatedMetrics: [
      "스키 추진",
      "무게중심 이동",
      "푸시오프"
    ]
  },

  {
    id: "ski_double_pole",
    name: "더블폴링 드릴",
    english: "Double Pole Drill",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "poling",
      "upper_body_power"
    ],

    relatedMetrics: [
      "폴링 타이밍",
      "폴 접촉시간",
      "상체 전경각"
    ]
  },

  {
    id: "ski_v1_drill",
    name: "V1 타이밍 드릴",
    english: "V1 Timing Drill",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "v1_timing"
    ],

    relatedMetrics: [
      "V1",
      "폴링 타이밍",
      "주법 전환"
    ]
  },

  {
    id: "ski_v2_drill",
    name: "V2 타이밍 드릴",
    english: "V2 Timing Drill",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "v2_timing"
    ],

    relatedMetrics: [
      "V2",
      "폴링 타이밍",
      "사이클 시간"
    ]
  },

  {
    id: "ski_v2_alt_drill",
    name: "V2 Alternate 드릴",
    english: "V2 Alternate Drill",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "v2_alternate"
    ],

    relatedMetrics: [
      "V2 Alternate",
      "주법 전환"
    ]
  },

  {
    id: "ski_uphill_transition",
    name: "오르막 주법 전환 드릴",
    english: "Uphill Technique Transition",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "technique_transition"
    ],

    relatedMetrics: [
      "오르막",
      "주법 전환",
      "속도 변화"
    ]
  },

  {
    id: "ski_downhill_position",
    name: "다운힐 포지션 드릴",
    english: "Downhill Position Drill",
    category: "ski",

    sports: [
      "biathlon",
      "cross_country"
    ],

    targets: [
      "aerodynamic_position"
    ],

    relatedMetrics: [
      "내리막",
      "몸통 각도",
      "주행 안정성"
    ]
  },


  /* =======================================================
     WEIGHTLIFTING TECHNIQUE
  ======================================================= */

  {
    id: "snatch_pull",
    name: "스내치 풀",
    english: "Snatch Pull",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "first_pull",
      "second_pull"
    ],

    relatedMetrics: [
      "1ST PULL",
      "2ND PULL",
      "바벨 궤적"
    ]
  },

  {
    id: "clean_pull",
    name: "클린 풀",
    english: "Clean Pull",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "pull_mechanics"
    ],

    relatedMetrics: [
      "바벨 속도",
      "바벨 궤적"
    ]
  },

  {
    id: "hang_snatch",
    name: "행 스내치",
    english: "Hang Snatch",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "second_pull",
      "turnover"
    ],

    relatedMetrics: [
      "2ND PULL",
      "TURNOVER"
    ]
  },

  {
    id: "hang_clean",
    name: "행 클린",
    english: "Hang Clean",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "second_pull",
      "catch"
    ],

    relatedMetrics: [
      "2ND PULL",
      "CATCH"
    ]
  },

  {
    id: "tall_snatch",
    name: "톨 스내치",
    english: "Tall Snatch",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "turnover"
    ],

    relatedMetrics: [
      "TURNOVER",
      "캐치"
    ]
  },

  {
    id: "overhead_squat",
    name: "오버헤드 스쿼트",
    english: "Overhead Squat",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "catch_stability",
      "mobility"
    ],

    relatedMetrics: [
      "캐치 안정성",
      "캐치 깊이"
    ]
  },

  {
    id: "front_squat_weightlifting",
    name: "역도 프론트 스쿼트",
    english: "Weightlifting Front Squat",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "clean_recovery"
    ],

    relatedMetrics: [
      "RECOVERY",
      "캐치 안정성"
    ]
  },

  {
    id: "jerk_balance",
    name: "저크 밸런스",
    english: "Jerk Balance",
    category: "weightlifting",

    sports: [
      "weightlifting"
    ],

    targets: [
      "jerk_footwork",
      "overhead_stability"
    ],

    relatedMetrics: [
      "저크",
      "좌우 대칭"
    ]
  },


  /* =======================================================
     RECOVERY
  ======================================================= */

  {
    id: "easy_aerobic",
    name: "저강도 유산소",
    english: "Easy Aerobic",
    category: "recovery",

    targets: [
      "recovery"
    ],

    relatedMetrics: []
  },

  {
    id: "mobility_session",
    name: "전신 모빌리티 세션",
    english: "Full Body Mobility",
    category: "recovery",

    targets: [
      "mobility",
      "recovery"
    ],

    relatedMetrics: []
  }

];


/* =========================================================
   03. GET TRAINING
========================================================= */

function getTrainingById(
  id
) {

  return (
    TRAINING_LIBRARY.find(
      training =>
        training.id === id
    ) || null
  );

}


/* =========================================================
   04. GET BY CATEGORY
========================================================= */

function getTrainingByCategory(
  category
) {

  return TRAINING_LIBRARY.filter(
    training =>
      training.category ===
      category
  );

}


/* =========================================================
   05. GET SPORT TRAINING
========================================================= */

function getTrainingBySport(
  sportId
) {

  return TRAINING_LIBRARY.filter(
    training => {

      if (
        !Array.isArray(
          training.sports
        )
      ) {

        return false;

      }


      return training
        .sports
        .includes(
          sportId
        );

    }
  );

}


/* =========================================================
   06. FIND TRAINING BY METRIC
========================================================= */

function getTrainingByMetric(
  metric
) {

  if (!metric) {

    return [];

  }


  const keyword =
    String(metric)
      .toLowerCase();


  return TRAINING_LIBRARY.filter(
    training => {

      return (
        training
          .relatedMetrics ||
        []
      ).some(
        item =>
          String(item)
            .toLowerCase()
            .includes(keyword) ||

          keyword.includes(
            String(item)
              .toLowerCase()
          )
      );

    }
  );

}


/* =========================================================
   07. FIND TRAINING BY TARGET
========================================================= */

function getTrainingByTarget(
  target
) {

  return TRAINING_LIBRARY.filter(
    training =>
      (
        training.targets ||
        []
      ).includes(target)
  );

}


/* =========================================================
   08. SEARCH
========================================================= */

function searchTraining(
  query
) {

  const keyword =
    String(
      query || ""
    )
      .trim()
      .toLowerCase();


  if (!keyword) {

    return TRAINING_LIBRARY;

  }


  return TRAINING_LIBRARY.filter(
    training => {

      const searchText = [

        training.name,

        training.english,

        training.category,

        ...(
          training.targets ||
          []
        ),

        ...(
          training.relatedMetrics ||
          []
        )

      ]
        .join(" ")
        .toLowerCase();


      return searchText.includes(
        keyword
      );

    }
  );

}


/* =========================================================
   09. RECOMMENDATION SCORE

   분석에서 낮은 지표가 들어오면
   해당 지표와 관련된 훈련을 찾는다.
========================================================= */

function calculateTrainingMatch(
  training,
  weaknesses = [],
  sportId = null
) {

  let score = 0;


  const relatedMetrics =
    training.relatedMetrics ||
    [];


  const targets =
    training.targets ||
    [];


  weaknesses.forEach(
    weakness => {

      const metric =
        String(
          weakness.metric ||
          weakness.name ||
          ""
        ).toLowerCase();


      relatedMetrics.forEach(
        related => {

          const text =
            String(
              related
            ).toLowerCase();


          if (
            metric.includes(text) ||
            text.includes(metric)
          ) {

            score += 5;

          }

        }
      );


      targets.forEach(
        target => {

          const text =
            String(
              target
            )
              .replaceAll(
                "_",
                " "
              )
              .toLowerCase();


          if (
            metric.includes(text)
          ) {

            score += 2;

          }

        }
      );

    }
  );


  if (
    sportId &&
    training.sports
      ?.includes(
        sportId
      )
  ) {

    score += 4;

  }


  return score;

}


/* =========================================================
   10. RECOMMEND TRAINING
========================================================= */

function recommendTraining(
  {
    sportId = null,
    weaknesses = [],
    limit = 8
  } = {}
) {

  return TRAINING_LIBRARY

    .map(
      training => ({

        ...training,

        matchScore:
          calculateTrainingMatch(
            training,
            weaknesses,
            sportId
          )

      })
    )

    .filter(
      training =>
        training.matchScore > 0
    )

    .sort(
      (a, b) =>
        b.matchScore -
        a.matchScore
    )

    .slice(
      0,
      limit
    );

}


/* =========================================================
   11. CATEGORY INFO
========================================================= */

function getTrainingCategory(
  categoryId
) {

  return (
    TRAINING_CATEGORIES[
      categoryId
    ] || null
  );

}


/* =========================================================
   12. LIBRARY STATS
========================================================= */

function getTrainingLibraryStats() {

  const categories = {};


  TRAINING_LIBRARY.forEach(
    training => {

      categories[
        training.category
      ] =
        (
          categories[
            training.category
          ] || 0
        ) + 1;

    }
  );


  return {

    total:
      TRAINING_LIBRARY.length,

    categories

  };

}


/* =========================================================
   13. GLOBAL ACCESS
========================================================= */

window.TRAINING_CATEGORIES =
  TRAINING_CATEGORIES;


window.TRAINING_LIBRARY =
  TRAINING_LIBRARY;


window.getTrainingById =
  getTrainingById;


window.getTrainingByCategory =
  getTrainingByCategory;


window.getTrainingBySport =
  getTrainingBySport;


window.getTrainingByMetric =
  getTrainingByMetric;


window.getTrainingByTarget =
  getTrainingByTarget;


window.searchTraining =
  searchTraining;


window.recommendTraining =
  recommendTraining;


window.getTrainingCategory =
  getTrainingCategory;


window.getTrainingLibraryStats =
  getTrainingLibraryStats;