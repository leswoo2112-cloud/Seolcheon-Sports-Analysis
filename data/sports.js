/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   DATA / SPORTS.JS
   VERSION 1.0

   역할
   - 동계 / 하계 종목 데이터
   - 종목 픽토그램
   - 세부 종목
   - 종목별 핵심 분석 항목
========================================================= */

"use strict";


/* =========================================================
   01. SPORTS DATABASE
========================================================= */

const SPORTS_DATABASE = {

  /* =======================================================
     WINTER SPORTS
  ======================================================= */

  winter: [

    {
      id: "biathlon",
      name: "바이애슬론",
      english: "BIATHLON",
      icon: "⛷️",

      description:
        "스키 주법, 구간 속도, 자세, 폴링, 좌우 대칭 및 기술 전환을 분석합니다.",

      events: [
        "스프린트",
        "개인",
        "추적",
        "집단출발",
        "계주",
        "혼성계주"
      ],

      analysis: [
        "구간 거리",
        "구간 시간",
        "평균 속도",
        "구간 속도 변화",
        "오르막 분석",
        "평지 분석",
        "내리막 분석",
        "주법 분류",
        "주법 전환 시점",
        "V1 분석",
        "V2 분석",
        "V2 Alternate 분석",
        "더블폴링 분석",
        "프리 스케이팅 분석",
        "스트라이드 길이",
        "스트라이드 빈도",
        "사이클 시간",
        "폴 접촉 타이밍",
        "폴링 지속시간",
        "상체 전경각",
        "몸통 각도",
        "고관절 각도",
        "무릎 각도",
        "발목 각도",
        "어깨 각도",
        "팔꿈치 각도",
        "좌우 대칭성",
        "무게중심 이동",
        "스키 추진 방향",
        "기술 전환 효율"
      ]
    },


    {
      id: "cross_country",
      name: "크로스컨트리",
      english: "CROSS COUNTRY",
      icon: "🎿",

      description:
        "스케이팅·클래식 주법과 구간별 퍼포먼스를 분석합니다.",

      events: [
        "스프린트",
        "거리",
        "스키애슬론",
        "팀 스프린트",
        "계주",
        "클래식",
        "프리"
      ],

      analysis: [
        "구간 거리",
        "구간 시간",
        "속도",
        "페이스",
        "경사 변화",
        "V1",
        "V2",
        "V2 Alternate",
        "더블폴링",
        "다이애거널",
        "킥 더블폴링",
        "주법 전환",
        "스트라이드",
        "사이클 시간",
        "폴링 타이밍",
        "무릎 각도",
        "고관절 각도",
        "몸통 각도",
        "좌우 대칭"
      ]
    },


    {
      id: "alpine",
      name: "알파인스키",
      english: "ALPINE SKIING",
      icon: "⛷",

      description:
        "턴, 엣지 전환, 신체 기울기와 좌우 턴 차이를 분석합니다.",

      events: [
        "회전",
        "대회전",
        "슈퍼대회전",
        "활강",
        "복합"
      ],

      analysis: [
        "턴 시작",
        "턴 종료",
        "턴 시간",
        "턴 반경",
        "엣지 전환",
        "좌우 턴 차이",
        "상체 기울기",
        "고관절 각도",
        "무릎 각도",
        "발목 각도",
        "무게중심 이동",
        "속도 변화"
      ]
    },


    {
      id: "ski_jump",
      name: "스키점프",
      english: "SKI JUMPING",
      icon: "🎿",

      description:
        "어프로치부터 도약·비행·착지까지 단계별 자세를 분석합니다.",

      events: [
        "노멀힐",
        "라지힐",
        "단체",
        "혼성단체"
      ],

      analysis: [
        "어프로치 자세",
        "인런 자세",
        "도약 타이밍",
        "도약 각도",
        "무릎 신전",
        "고관절 신전",
        "비행 자세",
        "몸통 각도",
        "스키 V 각도",
        "착지 자세",
        "착지 안정성"
      ]
    },


    {
      id: "nordic_combined",
      name: "노르딕복합",
      english: "NORDIC COMBINED",
      icon: "🏔️",

      description:
        "스키점프와 크로스컨트리 퍼포먼스를 통합 분석합니다.",

      events: [
        "개인",
        "단체",
        "팀 스프린트"
      ],

      analysis: [
        "도약 자세",
        "비행 자세",
        "착지 안정성",
        "구간 시간",
        "스키 주법",
        "주법 전환",
        "스트라이드",
        "폴링 타이밍",
        "관절 각도"
      ]
    },


    {
      id: "speed_skating",
      name: "스피드스케이팅",
      english: "SPEED SKATING",
      icon: "⛸️",

      description:
        "랩·스트라이드·푸시오프·코너링 자세를 분석합니다.",

      events: [
        "500m",
        "1000m",
        "1500m",
        "3000m",
        "5000m",
        "10000m",
        "팀추월",
        "매스스타트"
      ],

      analysis: [
        "랩 시간",
        "구간 시간",
        "속도",
        "스트라이드 빈도",
        "스트라이드 길이",
        "푸시오프",
        "무릎 각도",
        "고관절 각도",
        "상체 각도",
        "좌우 대칭",
        "코너 진입",
        "코너 탈출"
      ]
    },


    {
      id: "short_track",
      name: "쇼트트랙",
      english: "SHORT TRACK",
      icon: "⛸",

      description:
        "직선·코너·추월 구간의 움직임과 자세를 분석합니다.",

      events: [
        "500m",
        "1000m",
        "1500m",
        "계주",
        "혼성계주"
      ],

      analysis: [
        "랩 시간",
        "구간 속도",
        "코너 진입",
        "코너 탈출",
        "코너 기울기",
        "푸시오프",
        "스트라이드",
        "무릎 각도",
        "고관절 각도",
        "몸통 각도"
      ]
    },


    {
      id: "figure_skating",
      name: "피겨스케이팅",
      english: "FIGURE SKATING",
      icon: "⛸️",

      description:
        "점프·스핀·착지와 신체 정렬을 분석합니다.",

      events: [
        "싱글",
        "페어",
        "아이스댄스"
      ],

      analysis: [
        "도약 타이밍",
        "도약 높이",
        "회전",
        "공중 자세",
        "착지",
        "착지 안정성",
        "스핀 축",
        "몸통 정렬",
        "좌우 균형"
      ]
    },


    {
      id: "bobsleigh",
      name: "봅슬레이",
      english: "BOBSLEIGH",
      icon: "🛷",

      description:
        "스타트 푸시와 탑승 전환 타이밍을 분석합니다.",

      events: [
        "2인승",
        "4인승",
        "모노봅"
      ],

      analysis: [
        "스타트 반응",
        "푸시 시간",
        "푸시 보폭",
        "가속",
        "탑승 타이밍",
        "선수 간 동기화",
        "몸통 각도",
        "무릎 각도"
      ]
    },


    {
      id: "skeleton",
      name: "스켈레톤",
      english: "SKELETON",
      icon: "🛷",

      description:
        "스타트 스프린트와 썰매 탑승·주행 자세를 슬로모션으로 분석합니다.",

      events: [
        "남자",
        "여자",
        "혼성"
      ],

      analysis: [
        "스타트 반응",
        "스타트 시간",
        "스프린트 보폭",
        "스프린트 빈도",
        "푸시 가속",
        "탑승 시점",
        "탑승 소요시간",
        "머리 위치",
        "어깨 정렬",
        "몸통 정렬",
        "고관절 위치",
        "주행 안정성",
        "구간 시간"
      ]
    },


    {
      id: "luge",
      name: "루지",
      english: "LUGE",
      icon: "🛷",

      description:
        "스타트와 주행 중 신체 정렬 및 구간 시간을 분석합니다.",

      events: [
        "싱글",
        "더블",
        "팀 계주"
      ],

      analysis: [
        "스타트 동작",
        "스타트 시간",
        "상체 움직임",
        "몸통 정렬",
        "머리 위치",
        "주행 안정성",
        "구간 시간"
      ]
    },


    {
      id: "snowboard",
      name: "스노보드",
      english: "SNOWBOARD",
      icon: "🏂",

      description:
        "턴·점프·착지·보드 각도와 중심 이동을 분석합니다.",

      events: [
        "하프파이프",
        "슬로프스타일",
        "빅에어",
        "크로스",
        "평행대회전"
      ],

      analysis: [
        "턴",
        "보드 각도",
        "신체 기울기",
        "도약",
        "체공시간",
        "회전",
        "착지",
        "착지 안정성",
        "무게중심"
      ]
    },


    {
      id: "freestyle_ski",
      name: "프리스타일스키",
      english: "FREESTYLE SKIING",
      icon: "🎿",

      description:
        "도약·회전·착지와 구간 퍼포먼스를 분석합니다.",

      events: [
        "모굴",
        "에어리얼",
        "스키크로스",
        "하프파이프",
        "슬로프스타일",
        "빅에어"
      ],

      analysis: [
        "접근 속도",
        "도약",
        "체공시간",
        "회전",
        "몸통 자세",
        "착지",
        "착지 안정성"
      ]
    },


    {
      id: "ice_hockey",
      name: "아이스하키",
      english: "ICE HOCKEY",
      icon: "🏒",

      description:
        "스케이팅·가속·방향전환·슈팅 움직임을 분석합니다.",

      events: [
        "스케이팅",
        "슈팅",
        "패스",
        "방향전환"
      ],

      analysis: [
        "가속",
        "최고 속도",
        "스트라이드",
        "푸시오프",
        "방향전환",
        "슈팅 자세",
        "스틱 궤적",
        "몸통 회전"
      ]
    },


    {
      id: "curling",
      name: "컬링",
      english: "CURLING",
      icon: "🥌",

      description:
        "딜리버리 자세와 슬라이딩 밸런스를 분석합니다.",

      events: [
        "딜리버리",
        "스위핑"
      ],

      analysis: [
        "슬라이드 거리",
        "슬라이드 시간",
        "몸통 각도",
        "무릎 각도",
        "고관절 각도",
        "밸런스",
        "스톤 릴리스"
      ]
    }

  ],


  /* =======================================================
     SUMMER SPORTS
  ======================================================= */

  summer: [

    {
      id: "athletics",
      name: "육상",
      english: "ATHLETICS",
      icon: "🏃",

      description:
        "달리기·도약·투척의 종목별 구간 기록과 움직임을 분석합니다.",

      events: [
        "100m",
        "200m",
        "400m",
        "800m",
        "1500m",
        "3000m",
        "5000m",
        "10000m",
        "허들",
        "장애물",
        "계주",
        "마라톤",
        "경보",
        "멀리뛰기",
        "세단뛰기",
        "높이뛰기",
        "장대높이뛰기",
        "포환던지기",
        "원반던지기",
        "창던지기",
        "해머던지기"
      ],

      analysis: [
        "이동 거리",
        "전체 시간",
        "구간 시간",
        "구간 속도",
        "평균 속도",
        "최고 속도",
        "페이스",
        "가속",
        "감속",
        "보폭",
        "케이던스",
        "접지시간 추정",
        "비행시간 추정",
        "무릎 드라이브",
        "몸통 각도",
        "팔 스윙",
        "좌우 대칭"
      ]
    },


    {
      id: "weightlifting",
      name: "역도",
      english: "WEIGHTLIFTING",
      icon: "🏋️",

      description:
        "리프트 단계와 바벨 궤적·속도·관절각을 분석합니다.",

      events: [
        "스내치",
        "클린",
        "저크",
        "클린 앤 저크"
      ],

      analysis: [
        "바벨 X 궤적",
        "바벨 Y 궤적",
        "바벨 속도",
        "바벨 최고 높이",
        "1st Pull",
        "Transition",
        "2nd Pull",
        "Turnover",
        "Catch",
        "Recovery",
        "고관절 각도",
        "무릎 각도",
        "발목 각도",
        "몸통 각도",
        "팔꿈치 각도",
        "바벨-신체 거리",
        "캐치 깊이",
        "좌우 대칭",
        "캐치 안정성"
      ]
    },


    {
      id: "swimming",
      name: "수영",
      english: "SWIMMING",
      icon: "🏊",

      description:
        "스트로크와 구간 기록, 좌우 움직임을 분석합니다.",

      events: [
        "자유형",
        "배영",
        "평영",
        "접영",
        "개인혼영",
        "계영",
        "혼계영"
      ],

      analysis: [
        "구간 시간",
        "스트로크 수",
        "스트로크 빈도",
        "스트로크 길이",
        "몸통 롤링",
        "어깨 각도",
        "팔꿈치 각도",
        "좌우 대칭",
        "턴 시간",
        "스타트"
      ]
    },


    {
      id: "cycling",
      name: "사이클",
      english: "CYCLING",
      icon: "🚴",

      description:
        "페달링·케이던스·관절 움직임과 구간 퍼포먼스를 분석합니다.",

      events: [
        "도로",
        "트랙",
        "MTB",
        "BMX",
        "타임트라이얼"
      ],

      analysis: [
        "구간 시간",
        "속도",
        "케이던스",
        "페달링 사이클",
        "무릎 각도",
        "고관절 각도",
        "발목 각도",
        "몸통 각도",
        "좌우 대칭"
      ]
    },


    {
      id: "rowing",
      name: "조정",
      english: "ROWING",
      icon: "🚣",

      description:
        "스트로크 단계와 리듬, 관절 움직임을 분석합니다.",

      events: [
        "싱글스컬",
        "더블스컬",
        "쿼드러플",
        "페어",
        "포어",
        "에이트"
      ],

      analysis: [
        "Catch",
        "Drive",
        "Finish",
        "Recovery",
        "스트로크 빈도",
        "스트로크 시간",
        "몸통 각도",
        "무릎 각도",
        "고관절 각도",
        "좌우 대칭"
      ]
    },


    {
      id: "canoe",
      name: "카누·카약",
      english: "CANOE / KAYAK",
      icon: "🛶",

      description:
        "패들링 주기와 몸통 회전·좌우 대칭을 분석합니다.",

      events: [
        "스프린트",
        "슬라럼",
        "카약",
        "카누"
      ],

      analysis: [
        "패들링 빈도",
        "패들링 시간",
        "몸통 회전",
        "어깨 각도",
        "팔꿈치 각도",
        "좌우 대칭",
        "구간 속도"
      ]
    },


    {
      id: "gymnastics",
      name: "체조",
      english: "GYMNASTICS",
      icon: "🤸",

      description:
        "도약·회전·관절각·착지 안정성을 분석합니다.",

      events: [
        "마루",
        "도마",
        "철봉",
        "평행봉",
        "링",
        "안마",
        "이단평행봉",
        "평균대"
      ],

      analysis: [
        "도약",
        "체공시간",
        "회전",
        "몸통 정렬",
        "관절 각도",
        "착지",
        "착지 안정성",
        "좌우 대칭"
      ]
    },


    {
      id: "football",
      name: "축구",
      english: "FOOTBALL",
      icon: "⚽",

      description:
        "스프린트·방향전환·킥·점프 움직임을 분석합니다.",

      events: [
        "스프린트",
        "드리블",
        "패스",
        "슈팅",
        "점프",
        "방향전환"
      ],

      analysis: [
        "가속",
        "속도",
        "보폭",
        "방향전환",
        "킥 다리 궤적",
        "고관절 각도",
        "무릎 각도",
        "발목 각도",
        "몸통 회전"
      ]
    },


    {
      id: "basketball",
      name: "농구",
      english: "BASKETBALL",
      icon: "🏀",

      description:
        "점프·착지·스프린트·방향전환·슈팅 동작을 분석합니다.",

      events: [
        "점프",
        "착지",
        "스프린트",
        "컷",
        "레이업",
        "점프슛",
        "수비"
      ],

      analysis: [
        "점프 높이",
        "도약 시간",
        "착지",
        "착지 대칭",
        "스프린트",
        "방향전환",
        "무릎 각도",
        "고관절 각도",
        "슈팅 팔 각도"
      ]
    },


    {
      id: "volleyball",
      name: "배구",
      english: "VOLLEYBALL",
      icon: "🏐",

      description:
        "점프·스파이크·블로킹·착지 동작을 분석합니다.",

      events: [
        "스파이크",
        "블로킹",
        "서브",
        "점프",
        "착지"
      ],

      analysis: [
        "점프 높이",
        "도약",
        "팔 스윙",
        "어깨 각도",
        "몸통 회전",
        "착지",
        "좌우 대칭"
      ]
    },


    {
      id: "handball",
      name: "핸드볼",
      english: "HANDBALL",
      icon: "🤾",

      description:
        "점프슛·던지기·스프린트·방향전환을 분석합니다.",

      events: [
        "점프슛",
        "스탠딩슛",
        "패스",
        "스프린트"
      ],

      analysis: [
        "도약",
        "팔 궤적",
        "어깨 회전",
        "몸통 회전",
        "릴리스",
        "착지",
        "스프린트"
      ]
    },


    {
      id: "tennis",
      name: "테니스",
      english: "TENNIS",
      icon: "🎾",

      description:
        "서브와 스트로크의 라켓·신체 움직임을 분석합니다.",

      events: [
        "서브",
        "포핸드",
        "백핸드",
        "발리"
      ],

      analysis: [
        "라켓 궤적",
        "몸통 회전",
        "어깨 각도",
        "팔꿈치 각도",
        "무릎 각도",
        "체중 이동"
      ]
    },


    {
      id: "badminton",
      name: "배드민턴",
      english: "BADMINTON",
      icon: "🏸",

      description:
        "스매시·클리어·런지·점프 움직임을 분석합니다.",

      events: [
        "스매시",
        "클리어",
        "드롭",
        "런지",
        "점프"
      ],

      analysis: [
        "라켓 궤적",
        "팔 스윙",
        "몸통 회전",
        "런지",
        "무릎 각도",
        "점프",
        "착지"
      ]
    },


    {
      id: "table_tennis",
      name: "탁구",
      english: "TABLE TENNIS",
      icon: "🏓",

      description:
        "스윙·몸통 회전·체중 이동을 분석합니다.",

      events: [
        "포핸드",
        "백핸드",
        "서브",
        "드라이브"
      ],

      analysis: [
        "라켓 궤적",
        "팔꿈치 각도",
        "몸통 회전",
        "체중 이동",
        "무릎 각도"
      ]
    },


    {
      id: "baseball",
      name: "야구",
      english: "BASEBALL",
      icon: "⚾",

      description:
        "투구·타격·송구·주루 동작을 분석합니다.",

      events: [
        "투구",
        "타격",
        "송구",
        "주루"
      ],

      analysis: [
        "팔 궤적",
        "어깨 회전",
        "팔꿈치 각도",
        "몸통 회전",
        "골반 회전",
        "체중 이동",
        "스윙 궤적"
      ]
    },


    {
      id: "golf",
      name: "골프",
      english: "GOLF",
      icon: "🏌️",

      description:
        "스윙 단계·몸통 회전·클럽 궤적을 분석합니다.",

      events: [
        "드라이버",
        "아이언",
        "웨지",
        "퍼팅"
      ],

      analysis: [
        "어드레스",
        "백스윙",
        "탑",
        "다운스윙",
        "임팩트",
        "팔로스루",
        "클럽 궤적",
        "골반 회전",
        "몸통 회전"
      ]
    },


    {
      id: "archery",
      name: "양궁",
      english: "ARCHERY",
      icon: "🏹",

      description:
        "셋업·드로우·앵커·릴리스 자세와 안정성을 분석합니다.",

      events: [
        "리커브",
        "컴파운드"
      ],

      analysis: [
        "셋업",
        "드로우",
        "앵커",
        "어깨 정렬",
        "팔꿈치 각도",
        "몸통 흔들림",
        "릴리스"
      ]
    },


    {
      id: "fencing",
      name: "펜싱",
      english: "FENCING",
      icon: "🤺",

      description:
        "런지·풋워크·공격 동작의 속도와 관절각을 분석합니다.",

      events: [
        "플뢰레",
        "에페",
        "사브르"
      ],

      analysis: [
        "반응시간",
        "런지 거리",
        "런지 시간",
        "앞무릎 각도",
        "몸통 각도",
        "팔 신전",
        "풋워크"
      ]
    },


    {
      id: "boxing",
      name: "복싱",
      english: "BOXING",
      icon: "🥊",

      description:
        "펀치 움직임·몸통 회전·풋워크를 분석합니다.",

      events: [
        "잽",
        "스트레이트",
        "훅",
        "어퍼컷",
        "풋워크"
      ],

      analysis: [
        "펀치 궤적",
        "팔 신전",
        "어깨 회전",
        "몸통 회전",
        "골반 회전",
        "체중 이동"
      ]
    },


    {
      id: "taekwondo",
      name: "태권도",
      english: "TAEKWONDO",
      icon: "🥋",

      description:
        "발차기 궤적·회전·균형·착지를 분석합니다.",

      events: [
        "앞차기",
        "돌려차기",
        "옆차기",
        "뒤차기",
        "회전차기"
      ],

      analysis: [
        "발 궤적",
        "무릎 각도",
        "고관절 각도",
        "골반 회전",
        "몸통 회전",
        "지지발",
        "균형"
      ]
    },


    {
      id: "judo",
      name: "유도",
      english: "JUDO",
      icon: "🥋",

      description:
        "진입·회전·중심 이동과 기술 수행 단계를 분석합니다.",

      events: [
        "업어치기",
        "허리후리기",
        "밭다리",
        "안다리"
      ],

      analysis: [
        "진입",
        "무게중심",
        "골반 위치",
        "몸통 회전",
        "무릎 각도",
        "기술 타이밍"
      ]
    },


    {
      id: "wrestling",
      name: "레슬링",
      english: "WRESTLING",
      icon: "🤼",

      description:
        "스탠스·태클·중심 이동과 관절 움직임을 분석합니다.",

      events: [
        "자유형",
        "그레코로만",
        "태클"
      ],

      analysis: [
        "스탠스",
        "태클 진입",
        "무게중심",
        "고관절 각도",
        "무릎 각도",
        "몸통 각도"
      ]
    },


    {
      id: "sport_climbing",
      name: "스포츠클라이밍",
      english: "SPORT CLIMBING",
      icon: "🧗",

      description:
        "등반 동작·관절각·중심 이동과 구간 시간을 분석합니다.",

      events: [
        "스피드",
        "볼더링",
        "리드"
      ],

      analysis: [
        "구간 시간",
        "이동 경로",
        "손 위치",
        "발 위치",
        "무게중심",
        "고관절 각도",
        "무릎 각도",
        "팔꿈치 각도"
      ]
    },


    {
      id: "triathlon",
      name: "트라이애슬론",
      english: "TRIATHLON",
      icon: "🏊",

      description:
        "수영·사이클·러닝과 전환 구간을 통합 분석합니다.",

      events: [
        "수영",
        "T1",
        "사이클",
        "T2",
        "러닝"
      ],

      analysis: [
        "구간 시간",
        "전환 시간",
        "스트로크",
        "사이클 케이던스",
        "러닝 보폭",
        "러닝 케이던스",
        "속도",
        "페이스"
      ]
    }

  ]

};


/* =========================================================
   02. GET ALL SPORTS
========================================================= */

function getAllSports() {

  return [

    ...SPORTS_DATABASE.winter,

    ...SPORTS_DATABASE.summer

  ];

}


/* =========================================================
   03. FIND SPORT
========================================================= */

function getSportById(id) {

  return (
    getAllSports().find(
      sport =>
        sport.id === id
    ) || null
  );

}


/* =========================================================
   04. GET SPORTS BY SEASON
========================================================= */

function getSportsBySeason(season) {

  return (
    SPORTS_DATABASE[season] ||
    []
  );

}


/* =========================================================
   05. RENDER SPORTS
========================================================= */

function renderSports() {

  const season =
    window.SeolcheonApp
      ?.state
      ?.selectedSeason ||
    "winter";


  renderSeasonSports(
    season
  );

}


/* =========================================================
   06. RENDER SEASON
========================================================= */

function renderSeasonSports(season) {

  const grid =
    document.getElementById(
      "sportsPictogramGrid"
    );


  if (!grid) {

    return;

  }


  const sports =
    getSportsBySeason(
      season
    );


  window.SeolcheonApp
    .state
    .selectedSeason =
    season;


  const seasonLabel =
    document.getElementById(
      "seasonLabel"
    );


  const seasonTitle =
    document.getElementById(
      "seasonTitle"
    );


  if (seasonLabel) {

    seasonLabel.textContent =
      season === "winter"
        ? "WINTER SPORTS"
        : "SUMMER SPORTS";

  }


  if (seasonTitle) {

    seasonTitle.textContent =
      season === "winter"
        ? "동계 종목"
        : "하계 종목";

  }


  grid.innerHTML =
    sports.map(
      sport => `

        <button
          class="sport-card"
          data-sport-id="${sport.id}"
        >

          <div class="sport-pictogram">

            ${sport.icon}

          </div>


          <strong>

            ${sport.name}

          </strong>


          <small>

            ${sport.english}

          </small>

        </button>

      `
    ).join("");


  grid
    .querySelectorAll(
      ".sport-card"
    )
    .forEach(
      card => {

        card.addEventListener(
          "click",
          () => {

            selectSport(
              card.dataset.sportId
            );

          }
        );

      }
    );


  clearSelectedSport();

}


/* =========================================================
   07. SELECT SPORT
========================================================= */

function selectSport(sportId) {

  const sport =
    getSportById(
      sportId
    );


  if (!sport) {

    return;

  }


  window.SeolcheonApp
    .state
    .selectedSport =
    sport;


  window.SeolcheonApp
    .state
    .selectedEvent =
    null;


  document
    .querySelectorAll(
      ".sport-card"
    )
    .forEach(
      card => {

        card.classList.toggle(
          "active",
          card.dataset.sportId ===
          sportId
        );

      }
    );


  renderSelectedSport(
    sport
  );

}


/* =========================================================
   08. SELECTED SPORT PANEL
========================================================= */

function renderSelectedSport(sport) {

  const icon =
    document.getElementById(
      "selectedSportIcon"
    );


  const name =
    document.getElementById(
      "selectedSportName"
    );


  const description =
    document.getElementById(
      "selectedSportDescription"
    );


  const events =
    document.getElementById(
      "selectedSportEvents"
    );


  const startButton =
    document.getElementById(
      "startSportAnalysis"
    );


  if (icon) {

    icon.textContent =
      sport.icon;

  }


  if (name) {

    name.textContent =
      sport.name;

  }


  if (description) {

    description.textContent =
      sport.description;

  }


  if (events) {

    events.innerHTML =
      sport.events.map(
        eventName => `

          <button
            class="sport-event-chip"
            data-event="${eventName}"
          >

            ${eventName}

          </button>

        `
      ).join("");


    events
      .querySelectorAll(
        ".sport-event-chip"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              selectSportEvent(
                button.dataset.event
              );

            }
          );

        }
      );

  }


  if (startButton) {

    startButton.disabled =
      false;

  }

}


/* =========================================================
   09. SELECT EVENT
========================================================= */

function selectSportEvent(
  eventName
) {

  window.SeolcheonApp
    .state
    .selectedEvent =
    eventName;


  document
    .querySelectorAll(
      ".sport-event-chip"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.event ===
          eventName
        );

      }
    );

}


/* =========================================================
   10. CLEAR SELECTED SPORT
========================================================= */

function clearSelectedSport() {

  const icon =
    document.getElementById(
      "selectedSportIcon"
    );


  const name =
    document.getElementById(
      "selectedSportName"
    );


  const description =
    document.getElementById(
      "selectedSportDescription"
    );


  const events =
    document.getElementById(
      "selectedSportEvents"
    );


  const startButton =
    document.getElementById(
      "startSportAnalysis"
    );


  if (icon) {

    icon.textContent = "◉";

  }


  if (name) {

    name.textContent =
      "종목을 선택하세요";

  }


  if (description) {

    description.textContent =
      "픽토그램을 선택하면 종목별 분석 항목이 표시됩니다.";

  }


  if (events) {

    events.innerHTML = "";

  }


  if (startButton) {

    startButton.disabled =
      true;

  }

}


/* =========================================================
   11. START ANALYSIS
========================================================= */

function startSelectedSportAnalysis() {

  const state =
    window.SeolcheonApp
      ?.state;


  const sport =
    state?.selectedSport;


  if (!sport) {

    return;

  }


  const eventName =
    state.selectedEvent ||
    sport.events?.[0] ||
    sport.name;


  window.SeolcheonApp
    .openAnalysisWorkspace(
      sport,
      eventName
    );

}


/* =========================================================
   12. SEASON TABS
========================================================= */

function initializeSeasonTabs() {

  document
    .querySelectorAll(
      ".season-tab"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".season-tab"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );


            const season =
              button.dataset.season;


            renderSeasonSports(
              season
            );

          }
        );

      }
    );

}


/* =========================================================
   13. INITIALIZE
========================================================= */

function initializeSports() {

  initializeSeasonTabs();


  const startButton =
    document.getElementById(
      "startSportAnalysis"
    );


  if (startButton) {

    startButton.addEventListener(
      "click",
      startSelectedSportAnalysis
    );

  }


  renderSports();

}


/* =========================================================
   14. GLOBAL ACCESS
========================================================= */

window.SPORTS_DATABASE =
  SPORTS_DATABASE;


window.getAllSports =
  getAllSports;


window.getSportById =
  getSportById;


window.getSportsBySeason =
  getSportsBySeason;


window.renderSports =
  renderSports;


window.initializeSports =
  initializeSports;