/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULE / TRAINING-RECOMMENDATIONS.JS

   역할
   - 종목별 추천 훈련
   - 자세분석 결과 기반 자동 추천
   - 기술 / 근력 / 파워 / 코어 / 밸런스 / 스피드
   - 동계 / 하계 종목별 맞춤 추천
   - 리포트 연동
========================================================= */

"use strict";


/* =========================================================
   01. TRAINING DATABASE
========================================================= */

const TRAINING_LIBRARY = {

  /* -------------------------------------------------------
     공통
  ------------------------------------------------------- */

  common: {

    mobility: [
      "발목 가동성 드릴",
      "고관절 가동성 드릴",
      "흉추 회전 드릴",
      "어깨 가동성 드릴",
      "햄스트링 동적 스트레칭",
      "힙 플렉서 모빌리티",
      "딥 스쿼트 모빌리티",
      "월 앵클 모빌리티"
    ],

    core: [
      "플랭크",
      "사이드 플랭크",
      "데드버그",
      "버드독",
      "팔로프 프레스",
      "케이블 안티로테이션",
      "행잉 니레이즈",
      "파머스 캐리",
      "수트케이스 캐리",
      "베어 크롤"
    ],

    balance: [
      "싱글 레그 밸런스",
      "싱글 레그 리치",
      "밸런스 패드 스탠스",
      "싱글 레그 RDL",
      "측면 밸런스 드릴",
      "착지 안정화 드릴"
    ],

    speed: [
      "10m 가속 질주",
      "20m 가속 질주",
      "30m 스프린트",
      "플라잉 스프린트",
      "저항 스프린트",
      "A-Skip",
      "B-Skip",
      "하이니 드릴"
    ],

    plyometric: [
      "포고 점프",
      "스쿼트 점프",
      "박스 점프",
      "브로드 점프",
      "싱글 레그 홉",
      "라테랄 바운드",
      "드롭 점프",
      "스케이터 점프"
    ]

  },


  /* =======================================================
     02. WINTER SPORTS
  ======================================================= */

  winter: {

    biathlon: {

      name: "바이애슬론",

      technique: [
        "V1 스케이팅 기술 드릴",
        "V2 스케이팅 기술 드릴",
        "V2 Alternate 드릴",
        "오르막 스케이팅 드릴",
        "평지 글라이딩 드릴",
        "다운힐 밸런스 드릴",
        "코너 진입 기술 드릴",
        "폴링 타이밍 드릴",
        "싱글 스키 밸런스",
        "주법 전환 드릴"
      ],

      strength: [
        "프론트 스쿼트",
        "불가리안 스플릿 스쿼트",
        "루마니안 데드리프트",
        "스텝업",
        "풀업",
        "랫풀다운",
        "시티드 로우",
        "트라이셉스 프레스다운",
        "케이블 폴링",
        "싱글 레그 프레스"
      ],

      performance: [
        "롤러스키 인터벌",
        "오르막 롤러스키",
        "스키 바운딩",
        "폴링 인터벌",
        "템포 롤러스키",
        "기술 전환 인터벌"
      ]

    },


    crossCountry: {

      name: "크로스컨트리 스키",

      technique: [
        "V1 기술 드릴",
        "V2 기술 드릴",
        "V2 Alternate",
        "더블폴링",
        "노폴 스케이팅",
        "싱글 스키 글라이드",
        "다운힐 포지션",
        "코너링 드릴"
      ],

      strength: [
        "스쿼트",
        "스플릿 스쿼트",
        "데드리프트",
        "풀업",
        "랫풀다운",
        "케이블 풀다운",
        "스키에르그"
      ]

    },


    alpineSki: {

      name: "알파인 스키",

      technique: [
        "엣지 컨트롤 드릴",
        "카빙 턴 드릴",
        "싱글 스키 턴",
        "압력 이동 드릴",
        "턴 타이밍 드릴",
        "슬라럼 풋워크"
      ],

      strength: [
        "프론트 스쿼트",
        "월싯",
        "불가리안 스플릿 스쿼트",
        "레그 프레스",
        "싱글 레그 스쿼트",
        "노르딕 햄스트링"
      ]

    },


    speedSkating: {

      name: "스피드스케이팅",

      technique: [
        "스케이팅 자세 유지",
        "사이드 푸시 드릴",
        "크로스오버 드릴",
        "스타트 드릴",
        "코너 기술 드릴"
      ],

      strength: [
        "백 스쿼트",
        "프론트 스쿼트",
        "스플릿 스쿼트",
        "힙 쓰러스트",
        "루마니안 데드리프트"
      ]

    },


    shortTrack: {

      name: "쇼트트랙",

      technique: [
        "코너 자세 드릴",
        "크로스오버",
        "스타트 반응",
        "저자세 유지",
        "라인 변경 드릴"
      ],

      strength: [
        "싱글 레그 스쿼트",
        "스플릿 스쿼트",
        "힙 쓰러스트",
        "사이드 런지",
        "코사크 스쿼트"
      ]

    },


    skiJumping: {

      name: "스키점프",

      technique: [
        "인런 자세",
        "테이크오프 타이밍",
        "점프 자세",
        "착지 안정화",
        "밸런스 드릴"
      ],

      strength: [
        "점프 스쿼트",
        "프론트 스쿼트",
        "박스 점프",
        "카프 레이즈",
        "싱글 레그 점프"
      ]

    },


    snowboard: {

      name: "스노보드",

      technique: [
        "엣지 전환",
        "카빙",
        "밸런스",
        "턴 연결",
        "착지 안정화"
      ],

      strength: [
        "스쿼트",
        "사이드 런지",
        "스플릿 스쿼트",
        "코어 로테이션"
      ]

    },


    skeleton: {

      name: "스켈레톤",

      technique: [
        "스타트 푸시",
        "썰매 탑승 전환",
        "저항 최소화 자세",
        "라인 컨트롤",
        "스타트 스프린트"
      ],

      strength: [
        "스쿼트",
        "파워클린",
        "데드리프트",
        "힙 쓰러스트",
        "스프린트 저항 훈련"
      ]

    },


    bobsleigh: {

      name: "봅슬레이",

      technique: [
        "스타트 푸시",
        "탑승 타이밍",
        "동시 푸시",
        "가속 자세"
      ],

      strength: [
        "백 스쿼트",
        "파워클린",
        "데드리프트",
        "벤치프레스",
        "저항 스프린트"
      ]

    }

  },


  /* =======================================================
     03. SUMMER SPORTS
  ======================================================= */

  summer: {

    sprint: {

      name: "육상 단거리",

      technique: [
        "블록 스타트",
        "첫 3스텝 가속",
        "A-Skip",
        "B-Skip",
        "월 드라이브",
        "니 드라이브",
        "암 스윙 드릴",
        "플라잉 스프린트"
      ],

      strength: [
        "백 스쿼트",
        "프론트 스쿼트",
        "파워클린",
        "힙 쓰러스트",
        "루마니안 데드리프트",
        "노르딕 햄스트링"
      ]

    },


    middleDistance: {

      name: "육상 중거리",

      technique: [
        "러닝 자세 드릴",
        "케이던스 드릴",
        "페이스 컨트롤",
        "코너 러닝",
        "스트라이드"
      ],

      conditioning: [
        "200m 인터벌",
        "400m 인터벌",
        "600m 인터벌",
        "템포런",
        "프로그레션 런"
      ]

    },


    longDistance: {

      name: "육상 장거리",

      technique: [
        "러닝 이코노미 드릴",
        "케이던스 훈련",
        "상체 이완 러닝",
        "페이스 조절"
      ],

      conditioning: [
        "템포런",
        "롱런",
        "크루즈 인터벌",
        "언덕 반복주"
      ]

    },


    hurdles: {

      name: "허들",

      technique: [
        "리드 레그 드릴",
        "트레일 레그 드릴",
        "허들 리듬",
        "스타트-1허들",
        "3스텝 리듬"
      ],

      strength: [
        "스플릿 스쿼트",
        "스텝업",
        "RDL",
        "힙 쓰러스트"
      ]

    },


    longJump: {

      name: "멀리뛰기",

      technique: [
        "도움닫기 리듬",
        "마지막 2스텝",
        "발구름",
        "공중 자세",
        "착지 드릴"
      ],

      strength: [
        "스쿼트",
        "파워클린",
        "박스 점프",
        "바운딩"
      ]

    },


    highJump: {

      name: "높이뛰기",

      technique: [
        "곡선 도움닫기",
        "발구름",
        "무릎 드라이브",
        "공중 자세",
        "착지"
      ],

      strength: [
        "스플릿 스쿼트",
        "카프 레이즈",
        "점프 스쿼트",
        "싱글 레그 점프"
      ]

    },


    swimming: {

      name: "수영",

      technique: [
        "스트림라인",
        "캐치 드릴",
        "풀 드릴",
        "킥 드릴",
        "롤링 드릴",
        "턴 드릴",
        "스타트 드릴"
      ],

      strength: [
        "풀업",
        "랫풀다운",
        "케이블 로우",
        "페이스풀",
        "코어 안정화"
      ]

    },


    cycling: {

      name: "사이클",

      technique: [
        "페달링 효율",
        "케이던스 드릴",
        "댄싱 자세",
        "코너링",
        "스프린트 자세"
      ],

      strength: [
        "스쿼트",
        "스플릿 스쿼트",
        "힙 쓰러스트",
        "RDL"
      ]

    },


    rowing: {

      name: "조정",

      technique: [
        "캐치 자세",
        "드라이브",
        "피니시",
        "리커버리",
        "스트로크 리듬"
      ],

      strength: [
        "데드리프트",
        "바벨 로우",
        "풀업",
        "스쿼트",
        "코어 브레이싱"
      ]

    },


    football: {

      name: "축구",

      technique: [
        "가속 드릴",
        "감속 드릴",
        "방향전환",
        "사이드 스텝",
        "볼 컨트롤",
        "킥 자세"
      ],

      strength: [
        "스플릿 스쿼트",
        "노르딕 햄스트링",
        "힙 쓰러스트",
        "카프 레이즈"
      ]

    },


    basketball: {

      name: "농구",

      technique: [
        "첫 스텝",
        "감속",
        "사이드 컷",
        "점프 착지",
        "레이업 풋워크",
        "수비 슬라이드"
      ],

      strength: [
        "스플릿 스쿼트",
        "스쿼트",
        "RDL",
        "카프 레이즈"
      ]

    },


    volleyball: {

      name: "배구",

      technique: [
        "어프로치 점프",
        "블로킹 풋워크",
        "착지",
        "스파이크 접근"
      ],

      strength: [
        "스쿼트",
        "점프 스쿼트",
        "박스 점프",
        "스플릿 스쿼트"
      ]

    },


    tennis: {

      name: "테니스",

      technique: [
        "스플릿 스텝",
        "사이드 이동",
        "포핸드 체중이동",
        "백핸드 회전",
        "서브 자세"
      ],

      strength: [
        "사이드 런지",
        "케이블 로테이션",
        "싱글 레그 RDL"
      ]

    },


    badminton: {

      name: "배드민턴",

      technique: [
        "스플릿 스텝",
        "런지",
        "코트 복귀",
        "점프 스매시 착지"
      ],

      strength: [
        "스플릿 스쿼트",
        "사이드 런지",
        "카프 레이즈"
      ]

    }

  },


  /* =======================================================
     04. WEIGHTLIFTING
  ======================================================= */

  weightlifting: {

    name: "역도",

    technique: [
      "스타트 포지션",
      "퍼스트 풀",
      "트랜지션",
      "세컨드 풀",
      "트리플 익스텐션",
      "캐치",
      "오버헤드 안정화",
      "바벨 궤적 교정"
    ],

    exercises: [
      "클린",
      "파워클린",
      "행 클린",
      "클린 풀",
      "스내치",
      "파워 스내치",
      "행 스내치",
      "스내치 풀",
      "클린 앤 저크",
      "푸시 프레스",
      "푸시 저크",
      "스플릿 저크",
      "프론트 스쿼트",
      "백 스쿼트",
      "오버헤드 스쿼트",
      "클린 데드리프트",
      "스내치 데드리프트"
    ]

  }

};


/* =========================================================
   05. DEFICIENCY MAP

   자세분석에서 낮게 나온 항목에 따라
   자동으로 훈련 카테고리를 선택
========================================================= */

const DEFICIENCY_TRAINING_MAP = {

  posture: [
    "core",
    "mobility"
  ],

  symmetry: [
    "balance",
    "core"
  ],

  stability: [
    "balance",
    "core"
  ],

  power: [
    "plyometric",
    "strength"
  ],

  speed: [
    "speed",
    "plyometric"
  ],

  mobility: [
    "mobility"
  ],

  technique: [
    "technique"
  ],

  coordination: [
    "balance",
    "technique"
  ]

};


/* =========================================================
   06. HELPERS
========================================================= */

function trainingUnique(array) {

  return [
    ...new Set(
      array.filter(Boolean)
    )
  ];

}


function trainingShuffle(array) {

  const copy = [
    ...array
  ];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] = [
      copy[j],
      copy[i]
    ];

  }

  return copy;

}


/* =========================================================
   07. FIND SPORT
========================================================= */

function findTrainingSport(
  sportKey
) {

  if (!sportKey) {
    return null;
  }


  if (
    TRAINING_LIBRARY.winter[
      sportKey
    ]
  ) {

    return {
      season: "winter",
      data:
        TRAINING_LIBRARY.winter[
          sportKey
        ]
    };

  }


  if (
    TRAINING_LIBRARY.summer[
      sportKey
    ]
  ) {

    return {
      season: "summer",
      data:
        TRAINING_LIBRARY.summer[
          sportKey
        ]
    };

  }


  if (
    sportKey ===
    "weightlifting"
  ) {

    return {
      season:
        "strength",

      data:
        TRAINING_LIBRARY
          .weightlifting
    };

  }


  return null;

}


/* =========================================================
   08. GET SPORT TRAINING
========================================================= */

function getSportTraining(
  sportKey
) {

  const sport =
    findTrainingSport(
      sportKey
    );


  if (!sport) {

    return [];

  }


  const result = [];

  const data =
    sport.data;


  Object.keys(
    data
  ).forEach(
    key => {

      if (
        Array.isArray(
          data[key]
        )
      ) {

        result.push(
          ...data[key]
        );

      }

    }
  );


  return trainingUnique(
    result
  );

}


/* =========================================================
   09. GET COMMON TRAINING
========================================================= */

function getCommonTraining(
  category
) {

  return (
    TRAINING_LIBRARY
      .common[
        category
      ] || []
  );

}


/* =========================================================
   10. SCORE NORMALIZATION
========================================================= */

function normalizeTrainingScores(
  scores = {}
) {

  return {

    posture:
      Number(
        scores.posture ??
        scores.postureStability ??
        100
      ),

    symmetry:
      Number(
        scores.symmetry ??
        100
      ),

    stability:
      Number(
        scores.stability ??
        100
      ),

    power:
      Number(
        scores.power ??
        100
      ),

    speed:
      Number(
        scores.speed ??
        100
      ),

    mobility:
      Number(
        scores.mobility ??
        100
      ),

    technique:
      Number(
        scores.technique ??
        scores.skill ??
        100
      ),

    coordination:
      Number(
        scores.coordination ??
        100
      )

  };

}


/* =========================================================
   11. FIND WEAK AREAS
========================================================= */

function findWeakTrainingAreas(
  scores = {},
  threshold = 80
) {

  const normalized =
    normalizeTrainingScores(
      scores
    );


  return Object
    .entries(
      normalized
    )

    .filter(
      ([, score]) =>
        Number.isFinite(
          score
        ) &&
        score <
        threshold
    )

    .sort(
      (a, b) =>
        a[1] -
        b[1]
    )

    .map(
      ([key, score]) => ({
        key,
        score
      })
    );

}


/* =========================================================
   12. CATEGORY TRAINING
========================================================= */

function getDeficiencyTraining(
  weaknessKey
) {

  const categories =
    DEFICIENCY_TRAINING_MAP[
      weaknessKey
    ] || [];


  const exercises = [];


  categories.forEach(
    category => {

      exercises.push(
        ...getCommonTraining(
          category
        )
      );

    }
  );


  return trainingUnique(
    exercises
  );

}


/* =========================================================
   13. AUTO RECOMMENDATION ENGINE
========================================================= */

function generateTrainingRecommendations({
  sport,
  scores = {},
  maxItems = 10
} = {}) {

  const result = [];

  const weaknesses =
    findWeakTrainingAreas(
      scores
    );


  /* -------------------------------------------------------
     약점 기반 추천
  ------------------------------------------------------- */

  weaknesses.forEach(
    weakness => {

      const exercises =
        getDeficiencyTraining(
          weakness.key
        );


      trainingShuffle(
        exercises
      )
      .slice(
        0,
        3
      )
      .forEach(
        exercise => {

          result.push({

            exercise,

            reason:
              `${weakness.key} 점수 ${weakness.score}점 보완`,

            priority:
              weakness.score < 65
                ? "HIGH"
                : weakness.score < 80
                  ? "MEDIUM"
                  : "LOW",

            source:
              "analysis"

          });

        }
      );

    }
  );


  /* -------------------------------------------------------
     종목별 추천
  ------------------------------------------------------- */

  const sportExercises =
    trainingShuffle(
      getSportTraining(
        sport
      )
    );


  sportExercises
    .slice(
      0,
      5
    )
    .forEach(
      exercise => {

        result.push({

          exercise,

          reason:
            "종목 특화 퍼포먼스 향상",

          priority:
            "SPORT",

          source:
            sport

        });

      }
    );


  /* -------------------------------------------------------
     중복 제거
  ------------------------------------------------------- */

  const used =
    new Set();


  return result
    .filter(
      item => {

        if (
          used.has(
            item.exercise
          )
        ) {

          return false;

        }

        used.add(
          item.exercise
        );

        return true;

      }
    )
    .slice(
      0,
      maxItems
    );

}


/* =========================================================
   14. BIATHLON SPECIAL RECOMMENDATION

   바이애슬론 분석 결과:
   - 주법
   - 오르막
   - 균형
   - 폴링
   등을 별도로 반영
========================================================= */

function generateBiathlonTraining(
  analysis = {}
) {

  const result = [];


  if (
    analysis.uphillScore <
    80
  ) {

    result.push(
      "오르막 V1 인터벌",
      "스키 바운딩",
      "오르막 롤러스키"
    );

  }


  if (
    analysis.balanceScore <
    80
  ) {

    result.push(
      "싱글 스키 글라이드",
      "싱글 레그 밸런스",
      "스케이터 점프"
    );

  }


  if (
    analysis.poleTimingScore <
    80
  ) {

    result.push(
      "폴링 타이밍 드릴",
      "스키에르그",
      "더블폴링 인터벌"
    );

  }


  if (
    analysis.techniqueTransitionScore <
    80
  ) {

    result.push(
      "V1-V2 전환 드릴",
      "지형 변화 주법 전환",
      "기술 전환 인터벌"
    );

  }


  return trainingUnique(
    result
  );

}


/* =========================================================
   15. SPRINT SPECIAL RECOMMENDATION
========================================================= */

function generateSprintTraining(
  analysis = {}
) {

  const result = [];


  if (
    analysis.startScore <
    80
  ) {

    result.push(
      "블록 스타트",
      "10m 가속 질주",
      "월 드라이브"
    );

  }


  if (
    analysis.accelerationScore <
    80
  ) {

    result.push(
      "20m 가속 질주",
      "저항 스프린트",
      "바운딩"
    );

  }


  if (
    analysis.topSpeedScore <
    80
  ) {

    result.push(
      "플라잉 20m",
      "A-Skip",
      "하이니 드릴"
    );

  }


  return trainingUnique(
    result
  );

}


/* =========================================================
   16. WEIGHTLIFTING SPECIAL RECOMMENDATION
========================================================= */

function generateWeightliftingTraining(
  analysis = {}
) {

  const result = [];


  if (
    analysis.firstPullScore <
    80
  ) {

    result.push(
      "클린 데드리프트",
      "스내치 데드리프트",
      "포즈 퍼스트 풀"
    );

  }


  if (
    analysis.secondPullScore <
    80
  ) {

    result.push(
      "행 클린",
      "행 스내치",
      "클린 풀"
    );

  }


  if (
    analysis.catchScore <
    80
  ) {

    result.push(
      "프론트 스쿼트",
      "오버헤드 스쿼트",
      "톨 클린"
    );

  }


  if (
    analysis.barPathScore <
    80
  ) {

    result.push(
      "바벨 궤적 교정 드릴",
      "포즈 클린",
      "포즈 스내치"
    );

  }


  return trainingUnique(
    result
  );

}


/* =========================================================
   17. TRAINING PRIORITY
========================================================= */

function getTrainingPriorityLabel(
  priority
) {

  const map = {

    HIGH:
      "최우선",

    MEDIUM:
      "보완 필요",

    LOW:
      "유지",

    SPORT:
      "종목 특화"

  };


  return (
    map[
      priority
    ] ||
    priority
  );

}


/* =========================================================
   18. RENDER RECOMMENDATIONS
========================================================= */

function renderTrainingRecommendations(
  target,
  recommendations = []
) {

  const element =
    typeof target ===
    "string"
      ? document.querySelector(
          target
        )
      : target;


  if (!element) {
    return;
  }


  if (
    recommendations.length ===
    0
  ) {

    element.innerHTML = `
      <div class="training-empty">
        분석을 완료하면
        추천 훈련이 표시됩니다.
      </div>
    `;

    return;

  }


  element.innerHTML =
    recommendations
      .map(
        (
          item,
          index
        ) => `
          <article
            class="training-recommendation-card"
            data-priority="${item.priority}"
          >

            <div class="training-number">
              ${String(
                index + 1
              ).padStart(
                2,
                "0"
              )}
            </div>

            <div class="training-content">

              <span class="training-priority">
                ${getTrainingPriorityLabel(
                  item.priority
                )}
              </span>

              <h4>
                ${item.exercise}
              </h4>

              <p>
                ${item.reason}
              </p>

            </div>

          </article>
        `
      )
      .join("");

}


/* =========================================================
   19. CREATE FULL RECOMMENDATION
========================================================= */

function createFullTrainingRecommendation(
  analysis = {}
) {

  const sport =
    analysis.sport ||
    analysis.sportKey ||
    "";


  let recommendations =
    generateTrainingRecommendations({

      sport,

      scores:
        analysis.scores ||
        analysis,

      maxItems:
        12

    });


  let special = [];


  if (
    sport ===
    "biathlon"
  ) {

    special =
      generateBiathlonTraining(
        analysis
      );

  }


  if (
    sport ===
    "sprint"
  ) {

    special =
      generateSprintTraining(
        analysis
      );

  }


  if (
    sport ===
    "weightlifting"
  ) {

    special =
      generateWeightliftingTraining(
        analysis
      );

  }


  special.forEach(
    exercise => {

      recommendations.unshift({

        exercise,

        reason:
          "종목별 세부 분석 결과 기반 추천",

        priority:
          "HIGH",

        source:
          "special"

      });

    }
  );


  const used =
    new Set();


  recommendations =
    recommendations.filter(
      item => {

        if (
          used.has(
            item.exercise
          )
        ) {
          return false;
        }

        used.add(
          item.exercise
        );

        return true;

      }
    );


  return recommendations.slice(
    0,
    15
  );

}


/* =========================================================
   20. REPORT FORMAT
========================================================= */

function getTrainingForReport(
  analysis
) {

  return createFullTrainingRecommendation(
    analysis
  ).map(
    item => ({
      title:
        item.exercise,

      reason:
        item.reason,

      priority:
        getTrainingPriorityLabel(
          item.priority
        )
    })
  );

}


/* =========================================================
   21. PUBLIC API
========================================================= */

window.SeolcheonTraining = {

  library:
    TRAINING_LIBRARY,

  deficiencyMap:
    DEFICIENCY_TRAINING_MAP,

  findSport:
    findTrainingSport,

  getSportTraining:
    getSportTraining,

  findWeakAreas:
    findWeakTrainingAreas,

  generate:
    generateTrainingRecommendations,

  createFull:
    createFullTrainingRecommendation,

  biathlon:
    generateBiathlonTraining,

  sprint:
    generateSprintTraining,

  weightlifting:
    generateWeightliftingTraining,

  render:
    renderTrainingRecommendations,

  forReport:
    getTrainingForReport

};


/* =========================================================
   END
========================================================= */