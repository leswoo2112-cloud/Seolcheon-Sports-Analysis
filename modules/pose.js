/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / POSE.JS
   VERSION 1.0

   기능
   ---------------------------------------------------------
   - Camera / Video 프레임 수신
   - Pose landmark 표준화
   - 2D 스켈레톤 표시
   - 관절 각도 계산
   - 좌우 대칭 분석
   - 몸통 전경각 계산
   - 관절 좌표 기록
   - 핵심 프레임 저장
   - 각도 표시 이미지 생성
   - Sports Analysis 엔진으로 데이터 전달

   IMPORTANT
   ---------------------------------------------------------
   실제 landmark 검출은 MediaPipe 등의
   Pose Detector가 필요하다.

   이 파일은 검출된 landmark를 분석하는
   설천고 전용 분석 레이어이다.
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const POSE_CONFIG = {

  minimumConfidence: 0.5,

  analysisInterval: 33,

  drawSkeleton: true,

  drawJoints: true,

  drawAngles: true,

  jointRadius: 5,

  lineWidth: 3,

  historyLimit: 300,

  snapshotQuality: 0.92

};


/* =========================================================
   02. LANDMARK INDEX

   MediaPipe Pose 33 Landmark 기준
========================================================= */

const POSE_LANDMARKS = {

  nose: 0,

  leftEye: 2,
  rightEye: 5,

  leftEar: 7,
  rightEar: 8,

  leftShoulder: 11,
  rightShoulder: 12,

  leftElbow: 13,
  rightElbow: 14,

  leftWrist: 15,
  rightWrist: 16,

  leftHip: 23,
  rightHip: 24,

  leftKnee: 25,
  rightKnee: 26,

  leftAnkle: 27,
  rightAnkle: 28,

  leftHeel: 29,
  rightHeel: 30,

  leftFoot: 31,
  rightFoot: 32

};


/* =========================================================
   03. SKELETON CONNECTIONS
========================================================= */

const POSE_CONNECTIONS = [

  ["leftShoulder", "rightShoulder"],

  ["leftShoulder", "leftElbow"],
  ["leftElbow", "leftWrist"],

  ["rightShoulder", "rightElbow"],
  ["rightElbow", "rightWrist"],

  ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"],

  ["leftHip", "rightHip"],

  ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"],
  ["leftAnkle", "leftHeel"],
  ["leftHeel", "leftFoot"],

  ["rightHip", "rightKnee"],
  ["rightKnee", "rightAnkle"],
  ["rightAnkle", "rightHeel"],
  ["rightHeel", "rightFoot"]

];


/* =========================================================
   04. STATE
========================================================= */

const PoseManager = {

  initialized: false,

  enabled: true,

  processing: false,

  detector: null,

  detectorReady: false,

  lastAnalysisTime: 0,

  landmarks: null,

  angles: {},

  symmetry: null,

  confidence: null,

  frameNumber: 0,

  history: [],

  source: null,

  latestResult: null

};


/* =========================================================
   05. INITIALIZE
========================================================= */

function initPose() {

  if (PoseManager.initialized) {
    return;
  }


  PoseManager.initialized = true;


  bindPoseEvents();


  console.log(
    "[POSE] Pose analysis module ready"
  );

}


/* =========================================================
   06. EVENTS
========================================================= */

function bindPoseEvents() {

  /*
     실시간 카메라
  */

  document.addEventListener(
    "camera:frame",
    event => {

      handlePoseFrame(
        event.detail,
        "camera"
      );

    }
  );


  /*
     업로드 영상
  */

  document.addEventListener(
    "video:frame",
    event => {

      handlePoseFrame(
        event.detail,
        "video"
      );

    }
  );


  /*
     외부 detector가 결과를 보내는 방식도 지원
  */

  document.addEventListener(
    "pose:landmarks",
    event => {

      if (
        event.detail?.landmarks
      ) {

        processPoseLandmarks(
          event.detail.landmarks,
          event.detail
        );

      }

    }
  );

}


/* =========================================================
   07. SET DETECTOR

   MediaPipe 등 실제 detector를
   나중에 연결하기 위한 함수
========================================================= */

function setPoseDetector(detector) {

  PoseManager.detector =
    detector || null;


  PoseManager.detectorReady =
    Boolean(detector);


  updatePoseStatus(
    PoseManager.detectorReady
      ? "READY"
      : "NO MODEL"
  );

}


/* =========================================================
   08. FRAME HANDLER
========================================================= */

async function handlePoseFrame(
  frameData,
  source
) {

  if (
    !PoseManager.enabled ||
    PoseManager.processing
  ) {
    return;
  }


  const now =
    performance.now();


  if (
    now -
    PoseManager.lastAnalysisTime <
    POSE_CONFIG.analysisInterval
  ) {

    return;

  }


  PoseManager.lastAnalysisTime =
    now;


  const media =
    frameData?.video;


  if (!media) {
    return;
  }


  PoseManager.source =
    source;


  /*
     detector가 아직 없으면
     가짜 분석값을 생성하지 않는다.
  */

  if (
    !PoseManager.detector
  ) {

    updatePoseStatus(
      "MODEL REQUIRED"
    );

    return;

  }


  PoseManager.processing =
    true;


  try {

    const result =
      await runPoseDetector(
        media,
        frameData
      );


    if (
      result?.landmarks
    ) {

      processPoseLandmarks(
        result.landmarks,
        {
          source,
          media,
          frameData,
          rawResult: result
        }
      );

    }

  }

  catch (error) {

    console.error(
      "[POSE] 분석 오류:",
      error
    );


    updatePoseStatus(
      "ERROR"
    );

  }

  finally {

    PoseManager.processing =
      false;

  }

}


/* =========================================================
   09. RUN DETECTOR

   여러 detector 형태에 대응
========================================================= */

async function runPoseDetector(
  media,
  frameData
) {

  const detector =
    PoseManager.detector;


  if (!detector) {
    return null;
  }


  /*
     Custom function
  */

  if (
    typeof detector ===
    "function"
  ) {

    return await detector(
      media,
      frameData
    );

  }


  /*
     detectForVideo 스타일
  */

  if (
    typeof detector.detectForVideo ===
    "function"
  ) {

    const result =
      detector.detectForVideo(
        media,
        performance.now()
      );


    return normalizeDetectorResult(
      result
    );

  }


  /*
     estimatePoses 스타일
  */

  if (
    typeof detector.estimatePoses ===
    "function"
  ) {

    const poses =
      await detector.estimatePoses(
        media
      );


    if (
      !poses ||
      poses.length === 0
    ) {

      return null;

    }


    return normalizeDetectorResult(
      poses[0]
    );

  }


  /*
     detect 스타일
  */

  if (
    typeof detector.detect ===
    "function"
  ) {

    const result =
      await detector.detect(
        media
      );


    return normalizeDetectorResult(
      result
    );

  }


  return null;

}


/* =========================================================
   10. NORMALIZE DETECTOR RESULT
========================================================= */

function normalizeDetectorResult(
  result
) {

  if (!result) {
    return null;
  }


  /*
     이미 우리가 원하는 구조
  */

  if (
    Array.isArray(
      result.landmarks
    ) &&
    typeof result.landmarks[0]?.x ===
      "number"
  ) {

    return {
      ...result,
      landmarks:
        result.landmarks
    };

  }


  /*
     MediaPipe Tasks:
     landmarks = [[...]]
  */

  if (
    Array.isArray(
      result.landmarks
    ) &&
    Array.isArray(
      result.landmarks[0]
    )
  ) {

    return {
      ...result,
      landmarks:
        result.landmarks[0]
    };

  }


  /*
     keypoints 기반 모델
  */

  if (
    Array.isArray(
      result.keypoints
    )
  ) {

    return {
      ...result,
      landmarks:
        convertKeypointsToLandmarks(
          result.keypoints
        )
    };

  }


  return null;

}


/* =========================================================
   11. KEYPOINT CONVERSION
========================================================= */

function convertKeypointsToLandmarks(
  keypoints
) {

  /*
     모델별 landmark 구조가 다를 수 있으므로
     이름이 있는 keypoint를 우선 사용
  */

  const result =
    new Array(33)
      .fill(null);


  const nameMap = {

    nose:
      "nose",

    left_shoulder:
      "leftShoulder",

    right_shoulder:
      "rightShoulder",

    left_elbow:
      "leftElbow",

    right_elbow:
      "rightElbow",

    left_wrist:
      "leftWrist",

    right_wrist:
      "rightWrist",

    left_hip:
      "leftHip",

    right_hip:
      "rightHip",

    left_knee:
      "leftKnee",

    right_knee:
      "rightKnee",

    left_ankle:
      "leftAnkle",

    right_ankle:
      "rightAnkle"

  };


  keypoints.forEach(
    point => {

      const mapped =
        nameMap[
          point.name
        ];


      if (!mapped) {
        return;
      }


      const index =
        POSE_LANDMARKS[
          mapped
        ];


      result[index] = {

        x:
          point.x,

        y:
          point.y,

        z:
          point.z || 0,

        visibility:
          point.score ?? 1

      };

    }
  );


  return result;

}


/* =========================================================
   12. PROCESS LANDMARKS
========================================================= */

function processPoseLandmarks(
  landmarks,
  metadata = {}
) {

  if (
    !Array.isArray(
      landmarks
    )
  ) {
    return null;
  }


  const normalized =
    normalizeLandmarks(
      landmarks,
      metadata.media
    );


  PoseManager.landmarks =
    normalized;


  const confidence =
    calculatePoseConfidence(
      normalized
    );


  PoseManager.confidence =
    confidence;


  const angles =
    calculateAllPoseAngles(
      normalized
    );


  PoseManager.angles =
    angles;


  const symmetry =
    calculatePoseSymmetry(
      angles
    );


  PoseManager.symmetry =
    symmetry;


  PoseManager.frameNumber++;


  const result = {

    frame:
      PoseManager.frameNumber,

    timestamp:
      performance.now(),

    source:
      metadata.source ||
      PoseManager.source,

    videoTime:
      metadata.frameData
        ?.currentTime ??
      null,

    confidence,

    landmarks:
      normalized,

    angles,

    symmetry

  };


  PoseManager.latestResult =
    result;


  addPoseHistory(
    result
  );


  drawPoseOverlay(
    result
  );


  updatePoseUI(
    result
  );


  /*
     다음 sports-analysis.js에서
     이 이벤트를 받는다.
  */

  document.dispatchEvent(
    new CustomEvent(
      "pose:result",
      {
        detail:
          result
      }
    )
  );


  return result;

}


/* =========================================================
   13. NORMALIZE LANDMARKS
========================================================= */

function normalizeLandmarks(
  landmarks,
  media
) {

  const width =
    media?.videoWidth ||
    media?.width ||
    1;


  const height =
    media?.videoHeight ||
    media?.height ||
    1;


  return landmarks.map(
    point => {

      if (!point) {
        return null;
      }


      let x =
        Number(
          point.x
        );


      let y =
        Number(
          point.y
        );


      /*
         pixel 좌표 모델이면
         0~1 범위로 변환
      */

      if (
        x > 1 ||
        y > 1
      ) {

        x =
          x / width;

        y =
          y / height;

      }


      return {

        x,

        y,

        z:
          Number(
            point.z || 0
          ),

        visibility:
          Number(
            point.visibility ??
            point.score ??
            1
          )

      };

    }
  );

}


/* =========================================================
   14. GET LANDMARK
========================================================= */

function getPosePoint(
  landmarks,
  name
) {

  const index =
    POSE_LANDMARKS[
      name
    ];


  if (
    index === undefined
  ) {

    return null;
  }


  return (
    landmarks[index] ||
    null
  );

}


/* =========================================================
   15. POINT VALID
========================================================= */

function isPosePointValid(
  point
) {

  if (!point) {
    return false;
  }


  if (
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {

    return false;
  }


  return (
    (
      point.visibility ??
      1
    ) >=
    POSE_CONFIG.minimumConfidence
  );

}


/* =========================================================
   16. ANGLE BETWEEN 3 POINTS
========================================================= */

function calculateJointAngle(
  pointA,
  pointB,
  pointC
) {

  if (
    !isPosePointValid(pointA) ||
    !isPosePointValid(pointB) ||
    !isPosePointValid(pointC)
  ) {

    return null;
  }


  const vector1 = {

    x:
      pointA.x -
      pointB.x,

    y:
      pointA.y -
      pointB.y

  };


  const vector2 = {

    x:
      pointC.x -
      pointB.x,

    y:
      pointC.y -
      pointB.y

  };


  const dot =
    vector1.x *
    vector2.x +
    vector1.y *
    vector2.y;


  const magnitude1 =
    Math.hypot(
      vector1.x,
      vector1.y
    );


  const magnitude2 =
    Math.hypot(
      vector2.x,
      vector2.y
    );


  if (
    magnitude1 === 0 ||
    magnitude2 === 0
  ) {

    return null;
  }


  let cosine =
    dot /
    (
      magnitude1 *
      magnitude2
    );


  cosine =
    Math.max(
      -1,
      Math.min(
        1,
        cosine
      )
    );


  const radians =
    Math.acos(
      cosine
    );


  return Number(
    (
      radians *
      180 /
      Math.PI
    ).toFixed(1)
  );

}


/* =========================================================
   17. ALL ANGLES
========================================================= */

function calculateAllPoseAngles(
  landmarks
) {

  const p =
    name =>
      getPosePoint(
        landmarks,
        name
      );


  return {

    leftShoulder:
      calculateJointAngle(
        p("leftElbow"),
        p("leftShoulder"),
        p("leftHip")
      ),

    rightShoulder:
      calculateJointAngle(
        p("rightElbow"),
        p("rightShoulder"),
        p("rightHip")
      ),


    leftElbow:
      calculateJointAngle(
        p("leftShoulder"),
        p("leftElbow"),
        p("leftWrist")
      ),

    rightElbow:
      calculateJointAngle(
        p("rightShoulder"),
        p("rightElbow"),
        p("rightWrist")
      ),


    leftHip:
      calculateJointAngle(
        p("leftShoulder"),
        p("leftHip"),
        p("leftKnee")
      ),

    rightHip:
      calculateJointAngle(
        p("rightShoulder"),
        p("rightHip"),
        p("rightKnee")
      ),


    leftKnee:
      calculateJointAngle(
        p("leftHip"),
        p("leftKnee"),
        p("leftAnkle")
      ),

    rightKnee:
      calculateJointAngle(
        p("rightHip"),
        p("rightKnee"),
        p("rightAnkle")
      ),


    leftAnkle:
      calculateJointAngle(
        p("leftKnee"),
        p("leftAnkle"),
        p("leftFoot")
      ),

    rightAnkle:
      calculateJointAngle(
        p("rightKnee"),
        p("rightAnkle"),
        p("rightFoot")
      ),


    trunk:
      calculateTrunkAngle(
        landmarks
      )

  };

}


/* =========================================================
   18. TRUNK ANGLE

   수직축 기준 몸통 기울기
========================================================= */

function calculateTrunkAngle(
  landmarks
) {

  const leftShoulder =
    getPosePoint(
      landmarks,
      "leftShoulder"
    );


  const rightShoulder =
    getPosePoint(
      landmarks,
      "rightShoulder"
    );


  const leftHip =
    getPosePoint(
      landmarks,
      "leftHip"
    );


  const rightHip =
    getPosePoint(
      landmarks,
      "rightHip"
    );


  if (
    !isPosePointValid(leftShoulder) ||
    !isPosePointValid(rightShoulder) ||
    !isPosePointValid(leftHip) ||
    !isPosePointValid(rightHip)
  ) {

    return null;
  }


  const shoulder = {

    x:
      (
        leftShoulder.x +
        rightShoulder.x
      ) / 2,

    y:
      (
        leftShoulder.y +
        rightShoulder.y
      ) / 2

  };


  const hip = {

    x:
      (
        leftHip.x +
        rightHip.x
      ) / 2,

    y:
      (
        leftHip.y +
        rightHip.y
      ) / 2

  };


  const dx =
    shoulder.x -
    hip.x;


  const dy =
    hip.y -
    shoulder.y;


  const angle =
    Math.atan2(
      Math.abs(dx),
      Math.abs(dy)
    ) *
    180 /
    Math.PI;


  return Number(
    angle.toFixed(1)
  );

}


/* =========================================================
   19. POSE CONFIDENCE
========================================================= */

function calculatePoseConfidence(
  landmarks
) {

  const valid =
    landmarks.filter(
      point =>
        point &&
        Number.isFinite(
          point.visibility
        )
    );


  if (
    valid.length === 0
  ) {

    return null;
  }


  const average =
    valid.reduce(
      (
        total,
        point
      ) =>
        total +
        point.visibility,
      0
    ) /
    valid.length;


  return Number(
    (
      average * 100
    ).toFixed(1)
  );

}


/* =========================================================
   20. SYMMETRY
========================================================= */

function calculatePoseSymmetry(
  angles
) {

  const pairs = [

    [
      angles.leftShoulder,
      angles.rightShoulder
    ],

    [
      angles.leftElbow,
      angles.rightElbow
    ],

    [
      angles.leftHip,
      angles.rightHip
    ],

    [
      angles.leftKnee,
      angles.rightKnee
    ],

    [
      angles.leftAnkle,
      angles.rightAnkle
    ]

  ];


  const differences = [];


  pairs.forEach(
    ([left, right]) => {

      if (
        Number.isFinite(left) &&
        Number.isFinite(right)
      ) {

        differences.push(
          Math.abs(
            left -
            right
          )
        );

      }

    }
  );


  if (
    differences.length === 0
  ) {

    return null;
  }


  const averageDifference =
    differences.reduce(
      (a, b) =>
        a + b,
      0
    ) /
    differences.length;


  /*
     각도 차이가 커질수록
     100점에서 감소.
     진단 수치가 아닌 기술 비교용 지표.
  */

  const score =
    Math.max(
      0,
      100 -
      averageDifference * 2
    );


  return {

    score:
      Number(
        score.toFixed(1)
      ),

    averageAngleDifference:
      Number(
        averageDifference
          .toFixed(1)
      )

  };

}


/* =========================================================
   21. HISTORY
========================================================= */

function addPoseHistory(
  result
) {

  PoseManager.history.push(
    result
  );


  if (
    PoseManager.history.length >
    POSE_CONFIG.historyLimit
  ) {

    PoseManager.history.splice(
      0,
      PoseManager.history.length -
      POSE_CONFIG.historyLimit
    );

  }

}


/* =========================================================
   22. FIND OVERLAY CANVAS
========================================================= */

function findPoseCanvas() {

  return (

    document.getElementById(
      "pose-overlay"
    ) ||

    document.getElementById(
      "pose-canvas"
    ) ||

    document.querySelector(
      "[data-pose-canvas]"
    )

  );

}


/* =========================================================
   23. DRAW OVERLAY
========================================================= */

function drawPoseOverlay(
  result
) {

  const canvas =
    findPoseCanvas();


  if (!canvas) {
    return;
  }


  const media =
    getCurrentPoseMedia();


  if (!media) {
    return;
  }


  const width =
    media.videoWidth ||
    media.width ||
    canvas.clientWidth ||
    1280;


  const height =
    media.videoHeight ||
    media.height ||
    canvas.clientHeight ||
    720;


  if (
    canvas.width !== width
  ) {

    canvas.width =
      width;

  }


  if (
    canvas.height !== height
  ) {

    canvas.height =
      height;

  }


  const ctx =
    canvas.getContext(
      "2d"
    );


  if (!ctx) {
    return;
  }


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  if (
    POSE_CONFIG.drawSkeleton
  ) {

    drawPoseSkeleton(
      ctx,
      result.landmarks,
      width,
      height
    );

  }


  if (
    POSE_CONFIG.drawJoints
  ) {

    drawPoseJoints(
      ctx,
      result.landmarks,
      width,
      height
    );

  }


  if (
    POSE_CONFIG.drawAngles
  ) {

    drawPoseAngles(
      ctx,
      result,
      width,
      height
    );

  }

}


/* =========================================================
   24. DRAW SKELETON
========================================================= */

function drawPoseSkeleton(
  ctx,
  landmarks,
  width,
  height
) {

  ctx.save();


  ctx.lineWidth =
    POSE_CONFIG.lineWidth;


  ctx.strokeStyle =
    "rgba(0, 240, 255, 0.95)";


  POSE_CONNECTIONS.forEach(
    ([nameA, nameB]) => {

      const a =
        getPosePoint(
          landmarks,
          nameA
        );


      const b =
        getPosePoint(
          landmarks,
          nameB
        );


      if (
        !isPosePointValid(a) ||
        !isPosePointValid(b)
      ) {

        return;

      }


      ctx.beginPath();


      ctx.moveTo(
        a.x * width,
        a.y * height
      );


      ctx.lineTo(
        b.x * width,
        b.y * height
      );


      ctx.stroke();

    }
  );


  ctx.restore();

}


/* =========================================================
   25. DRAW JOINTS
========================================================= */

function drawPoseJoints(
  ctx,
  landmarks,
  width,
  height
) {

  ctx.save();


  ctx.fillStyle =
    "rgba(255,255,255,0.98)";


  landmarks.forEach(
    point => {

      if (
        !isPosePointValid(point)
      ) {
        return;
      }


      ctx.beginPath();


      ctx.arc(
        point.x * width,
        point.y * height,
        POSE_CONFIG.jointRadius,
        0,
        Math.PI * 2
      );


      ctx.fill();

    }
  );


  ctx.restore();

}


/* =========================================================
   26. DRAW ANGLES
========================================================= */

function drawPoseAngles(
  ctx,
  result,
  width,
  height
) {

  const items = [

    [
      "leftKnee",
      result.angles.leftKnee,
      "L KNEE"
    ],

    [
      "rightKnee",
      result.angles.rightKnee,
      "R KNEE"
    ],

    [
      "leftHip",
      result.angles.leftHip,
      "L HIP"
    ],

    [
      "rightHip",
      result.angles.rightHip,
      "R HIP"
    ],

    [
      "leftElbow",
      result.angles.leftElbow,
      "L ELBOW"
    ],

    [
      "rightElbow",
      result.angles.rightElbow,
      "R ELBOW"
    ]

  ];


  ctx.save();


  ctx.font =
    "600 18px system-ui";


  ctx.textBaseline =
    "bottom";


  items.forEach(
    (
      [
        jointName,
        angle,
        label
      ]
    ) => {

      if (
        !Number.isFinite(angle)
      ) {

        return;

      }


      const point =
        getPosePoint(
          result.landmarks,
          jointName
        );


      if (
        !isPosePointValid(point)
      ) {

        return;

      }


      const x =
        point.x * width +
        12;


      const y =
        point.y * height -
        8;


      const text =
        `${label} ${angle}°`;


      const metrics =
        ctx.measureText(
          text
        );


      ctx.fillStyle =
        "rgba(5,15,25,0.82)";


      ctx.fillRect(
        x - 5,
        y - 21,
        metrics.width + 10,
        26
      );


      ctx.fillStyle =
        "#ffffff";


      ctx.fillText(
        text,
        x,
        y
      );

    }
  );


  ctx.restore();

}


/* =========================================================
   27. CURRENT MEDIA
========================================================= */

function getCurrentPoseMedia() {

  if (
    PoseManager.source ===
      "camera"
  ) {

    return (
      window.CameraManager
        ?.video ||
      null
    );

  }


  if (
    PoseManager.source ===
      "video"
  ) {

    return (
      window.VideoManager
        ?.video ||
      null
    );

  }


  return null;

}


/* =========================================================
   28. UPDATE UI
========================================================= */

function updatePoseUI(
  result
) {

  setPoseText(
    "pose-confidence",
    result.confidence !== null
      ? `${result.confidence}%`
      : "--"
  );


  setPoseText(
    "pose-symmetry",
    result.symmetry
      ? `${result.symmetry.score}`
      : "--"
  );


  setPoseText(
    "pose-left-knee",
    formatPoseAngle(
      result.angles.leftKnee
    )
  );


  setPoseText(
    "pose-right-knee",
    formatPoseAngle(
      result.angles.rightKnee
    )
  );


  setPoseText(
    "pose-left-hip",
    formatPoseAngle(
      result.angles.leftHip
    )
  );


  setPoseText(
    "pose-right-hip",
    formatPoseAngle(
      result.angles.rightHip
    )
  );


  setPoseText(
    "pose-trunk",
    formatPoseAngle(
      result.angles.trunk
    )
  );


  updatePoseStatus(
    "TRACKING"
  );

}


/* =========================================================
   29. SET UI TEXT
========================================================= */

function setPoseText(
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
   30. FORMAT ANGLE
========================================================= */

function formatPoseAngle(
  value
) {

  return Number.isFinite(value)
    ? `${value}°`
    : "--";

}


/* =========================================================
   31. STATUS
========================================================= */

function updatePoseStatus(
  status
) {

  document
    .querySelectorAll(
      [
        "#pose-status",
        "[data-pose-status]"
      ].join(",")
    )
    .forEach(
      element => {

        element.textContent =
          status;


        element.dataset.status =
          status
            .toLowerCase()
            .replaceAll(
              " ",
              "-"
            );

      }
    );

}


/* =========================================================
   32. CAPTURE ANALYSIS SNAPSHOT

   원본 영상 + 스켈레톤 + 각도를
   하나의 이미지로 합친다.
========================================================= */

function capturePoseSnapshot(
  options = {}
) {

  const media =
    getCurrentPoseMedia();


  const overlay =
    findPoseCanvas();


  if (
    !media ||
    !PoseManager.latestResult
  ) {

    return null;
  }


  const width =
    media.videoWidth ||
    overlay?.width ||
    1280;


  const height =
    media.videoHeight ||
    overlay?.height ||
    720;


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    width;


  canvas.height =
    height;


  const ctx =
    canvas.getContext(
      "2d"
    );


  /*
     원본 프레임
  */

  try {

    ctx.drawImage(
      media,
      0,
      0,
      width,
      height
    );

  }

  catch (error) {

    console.warn(
      "[POSE] 원본 프레임 캡처 실패",
      error
    );

  }


  /*
     스켈레톤 + 각도
  */

  drawPoseSkeleton(
    ctx,
    PoseManager.latestResult.landmarks,
    width,
    height
  );


  drawPoseJoints(
    ctx,
    PoseManager.latestResult.landmarks,
    width,
    height
  );


  drawPoseAngles(
    ctx,
    PoseManager.latestResult,
    width,
    height
  );


  /*
     상단 분석 정보
  */

  drawSnapshotHeader(
    ctx,
    width,
    options
  );


  const image =
    canvas.toDataURL(
      "image/jpeg",
      POSE_CONFIG.snapshotQuality
    );


  const snapshot = {

    id:
      "pose_snapshot_" +
      Date.now(),

    type:
      options.type ||
      "pose",

    sportId:
      options.sportId ||
      null,

    frame:
      PoseManager.latestResult.frame,

    videoTime:
      PoseManager.latestResult.videoTime,

    angles: {
      ...PoseManager.latestResult.angles
    },

    symmetry:
      PoseManager.latestResult.symmetry,

    confidence:
      PoseManager.latestResult.confidence,

    width,

    height,

    image,

    createdAt:
      new Date()
        .toISOString()

  };


  document.dispatchEvent(
    new CustomEvent(
      "pose:snapshot",
      {
        detail:
          snapshot
      }
    )
  );


  return snapshot;

}


/* =========================================================
   33. SNAPSHOT HEADER
========================================================= */

function drawSnapshotHeader(
  ctx,
  width,
  options
) {

  const sport =
    options.sportName ||
    "SPORT PERFORMANCE ANALYSIS";


  ctx.save();


  ctx.fillStyle =
    "rgba(5,15,25,0.82)";


  ctx.fillRect(
    0,
    0,
    width,
    54
  );


  ctx.fillStyle =
    "#ffffff";


  ctx.font =
    "700 18px system-ui";


  ctx.fillText(
    "SEOLCHEON SPORTS SCIENCE",
    20,
    23
  );


  ctx.font =
    "500 14px system-ui";


  ctx.fillText(
    sport,
    20,
    44
  );


  ctx.restore();

}


/* =========================================================
   34. ANGLE SNAPSHOT

   리포트에 들어가는
   '각도 사진'
========================================================= */

function captureAngleSnapshot(
  sportId = null,
  sportName = null
) {

  return capturePoseSnapshot(
    {
      type:
        "angle",

      sportId,

      sportName
    }
  );

}


/* =========================================================
   35. KEY FRAME
========================================================= */

function capturePoseKeyFrame(
  label = "KEY FRAME"
) {

  const snapshot =
    capturePoseSnapshot(
      {
        type:
          "keyframe"
      }
    );


  if (!snapshot) {
    return null;
  }


  snapshot.label =
    label;


  document.dispatchEvent(
    new CustomEvent(
      "pose:keyframe",
      {
        detail:
          snapshot
      }
    )
  );


  return snapshot;

}


/* =========================================================
   36. GET ANGLE
========================================================= */

function getCurrentPoseAngle(
  angleName
) {

  return (
    PoseManager.angles[
      angleName
    ] ??
    null
  );

}


/* =========================================================
   37. GET LATEST RESULT
========================================================= */

function getLatestPoseResult() {

  return (
    PoseManager.latestResult ||
    null
  );

}


/* =========================================================
   38. GET HISTORY
========================================================= */

function getPoseHistory() {

  return [
    ...PoseManager.history
  ];

}


/* =========================================================
   39. CLEAR HISTORY
========================================================= */

function clearPoseHistory() {

  PoseManager.history =
    [];


  PoseManager.frameNumber =
    0;

}


/* =========================================================
   40. ENABLE / DISABLE
========================================================= */

function setPoseEnabled(
  enabled
) {

  PoseManager.enabled =
    Boolean(enabled);


  updatePoseStatus(
    PoseManager.enabled
      ? "READY"
      : "OFF"
  );

}


/* =========================================================
   41. AVERAGE ANGLE

   일정 구간 평균 각도 계산
========================================================= */

function getAveragePoseAngle(
  angleName,
  startTime = null,
  endTime = null
) {

  let history =
    PoseManager.history;


  if (
    startTime !== null
  ) {

    history =
      history.filter(
        frame =>
          frame.videoTime === null ||
          frame.videoTime >=
            startTime
      );

  }


  if (
    endTime !== null
  ) {

    history =
      history.filter(
        frame =>
          frame.videoTime === null ||
          frame.videoTime <=
            endTime
      );

  }


  const values =
    history

      .map(
        frame =>
          frame.angles[
            angleName
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


  const average =
    values.reduce(
      (a, b) =>
        a + b,
      0
    ) /
    values.length;


  return Number(
    average.toFixed(1)
  );

}


/* =========================================================
   42. RANGE
========================================================= */

function getPoseAngleRange(
  angleName
) {

  const values =
    PoseManager.history

      .map(
        frame =>
          frame.angles[
            angleName
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


  return {

    min:
      Number(
        Math.min(
          ...values
        ).toFixed(1)
      ),

    max:
      Number(
        Math.max(
          ...values
        ).toFixed(1)
      ),

    average:
      Number(
        (
          values.reduce(
            (a, b) =>
              a + b,
            0
          ) /
          values.length
        ).toFixed(1)
      )

  };

}


/* =========================================================
   43. AUTO INIT
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initPose
  );

}

else {

  initPose();

}


/* =========================================================
   44. GLOBAL ACCESS
========================================================= */

window.POSE_CONFIG =
  POSE_CONFIG;

window.POSE_LANDMARKS =
  POSE_LANDMARKS;

window.POSE_CONNECTIONS =
  POSE_CONNECTIONS;

window.PoseManager =
  PoseManager;

window.initPose =
  initPose;

window.setPoseDetector =
  setPoseDetector;

window.processPoseLandmarks =
  processPoseLandmarks;

window.calculateJointAngle =
  calculateJointAngle;

window.calculateAllPoseAngles =
  calculateAllPoseAngles;

window.calculatePoseSymmetry =
  calculatePoseSymmetry;

window.calculateTrunkAngle =
  calculateTrunkAngle;

window.capturePoseSnapshot =
  capturePoseSnapshot;

window.captureAngleSnapshot =
  captureAngleSnapshot;

window.capturePoseKeyFrame =
  capturePoseKeyFrame;

window.getCurrentPoseAngle =
  getCurrentPoseAngle;

window.getLatestPoseResult =
  getLatestPoseResult;

window.getPoseHistory =
  getPoseHistory;

window.clearPoseHistory =
  clearPoseHistory;

window.setPoseEnabled =
  setPoseEnabled;

window.getAveragePoseAngle =
  getAveragePoseAngle;

window.getPoseAngleRange =
  getPoseAngleRange;