/* =========================================================
   SEOLCHEON HIGH SCHOOL
   SPORTS PERFORMANCE ANALYSIS SYSTEM

   POSE / BIOMECHANICS ENGINE

   - Skeleton rendering
   - Joint angle calculation
   - Left / Right comparison
   - Pose overlay
   - Sport-analysis integration
   - Video / Camera integration
========================================================= */

"use strict";


window.SeolcheonPose = (() => {

  /* =====================================================
     STATE
  ===================================================== */

  let video = null;

  let canvas = null;

  let ctx = null;

  let running = false;

  let animationId = null;

  let lastLandmarks = null;


  const state = {

    detected: false,

    angles: {},

    symmetry: null,

    landmarks: null

  };


  /* =====================================================
     LANDMARK INDEX

     MediaPipe Pose 기준
  ===================================================== */

  const LM = {

    NOSE: 0,

    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,

    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,

    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,

    LEFT_HIP: 23,
    RIGHT_HIP: 24,

    LEFT_KNEE: 25,
    RIGHT_KNEE: 26,

    LEFT_ANKLE: 27,
    RIGHT_ANKLE: 28,

    LEFT_HEEL: 29,
    RIGHT_HEEL: 30,

    LEFT_FOOT: 31,
    RIGHT_FOOT: 32

  };


  /* =====================================================
     SKELETON CONNECTIONS
  ===================================================== */

  const CONNECTIONS = [

    [11, 12],

    [11, 13],
    [13, 15],

    [12, 14],
    [14, 16],

    [11, 23],
    [12, 24],

    [23, 24],

    [23, 25],
    [25, 27],

    [24, 26],
    [26, 28],

    [27, 29],
    [29, 31],

    [28, 30],
    [30, 32]

  ];


  /* =====================================================
     ELEMENTS
  ===================================================== */

  function refreshElements() {

    video =
      document.querySelector(
        "[data-analysis-video]"
      );


    canvas =
      document.querySelector(
        "[data-skeleton-canvas]"
      );


    if (canvas) {

      ctx =
        canvas.getContext(
          "2d"
        );

    }

  }


  /* =====================================================
     CANVAS SIZE
  ===================================================== */

  function resizeCanvas() {

    if (
      !video ||
      !canvas
    ) {

      return;

    }


    const width =
      video.videoWidth ||
      1280;


    const height =
      video.videoHeight ||
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

  }


  /* =====================================================
     ANGLE
  ===================================================== */

  function calculateAngle(
    pointA,
    pointB,
    pointC
  ) {

    if (
      !pointA ||
      !pointB ||
      !pointC
    ) {

      return null;

    }


    const radians =
      Math.atan2(
        pointC.y - pointB.y,
        pointC.x - pointB.x
      ) -

      Math.atan2(
        pointA.y - pointB.y,
        pointA.x - pointB.x
      );


    let angle =
      Math.abs(
        radians *
        180 /
        Math.PI
      );


    if (
      angle > 180
    ) {

      angle =
        360 - angle;

    }


    return Number(
      angle.toFixed(1)
    );

  }


  /* =====================================================
     LANDMARK VISIBILITY
  ===================================================== */

  function visible(
    point,
    threshold = 0.45
  ) {

    if (!point) {

      return false;

    }


    if (
      point.visibility === undefined
    ) {

      return true;

    }


    return (
      point.visibility >= threshold
    );

  }


  /* =====================================================
     DRAW LINE
  ===================================================== */

  function drawLine(
    a,
    b
  ) {

    if (
      !ctx ||
      !canvas ||
      !visible(a) ||
      !visible(b)
    ) {

      return;

    }


    ctx.beginPath();


    ctx.moveTo(
      a.x * canvas.width,
      a.y * canvas.height
    );


    ctx.lineTo(
      b.x * canvas.width,
      b.y * canvas.height
    );


    ctx.lineWidth =
      Math.max(
        2,
        canvas.width / 500
      );


    ctx.strokeStyle =
      "rgba(71, 213, 255, 0.95)";


    ctx.stroke();

  }


  /* =====================================================
     DRAW POINT
  ===================================================== */

  function drawPoint(
    point
  ) {

    if (
      !ctx ||
      !canvas ||
      !visible(point)
    ) {

      return;

    }


    const x =
      point.x *
      canvas.width;


    const y =
      point.y *
      canvas.height;


    const radius =
      Math.max(
        3,
        canvas.width / 300
      );


    ctx.beginPath();


    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "#ffffff";


    ctx.fill();


    ctx.lineWidth =
      2;


    ctx.strokeStyle =
      "#00d8ff";


    ctx.stroke();

  }


  /* =====================================================
     DRAW ANGLE LABEL
  ===================================================== */

  function drawAngleLabel(
    point,
    angle
  ) {

    if (
      !ctx ||
      !canvas ||
      !point ||
      angle === null
    ) {

      return;

    }


    const x =
      point.x *
      canvas.width;


    const y =
      point.y *
      canvas.height;


    ctx.font =
      `${Math.max(
        14,
        canvas.width / 70
      )}px Arial`;


    ctx.fillStyle =
      "#ffffff";


    ctx.strokeStyle =
      "rgba(0,0,0,0.85)";


    ctx.lineWidth =
      4;


    const text =
      `${angle}°`;


    ctx.strokeText(
      text,
      x + 10,
      y - 10
    );


    ctx.fillText(
      text,
      x + 10,
      y - 10
    );

  }


  /* =====================================================
     ANGLE ANALYSIS
  ===================================================== */

  function analyzeAngles(
    landmarks
  ) {

    if (
      !landmarks ||
      landmarks.length < 33
    ) {

      return {};

    }


    const angles = {


      leftElbow:

        calculateAngle(

          landmarks[
            LM.LEFT_SHOULDER
          ],

          landmarks[
            LM.LEFT_ELBOW
          ],

          landmarks[
            LM.LEFT_WRIST
          ]

        ),


      rightElbow:

        calculateAngle(

          landmarks[
            LM.RIGHT_SHOULDER
          ],

          landmarks[
            LM.RIGHT_ELBOW
          ],

          landmarks[
            LM.RIGHT_WRIST
          ]

        ),


      leftShoulder:

        calculateAngle(

          landmarks[
            LM.LEFT_ELBOW
          ],

          landmarks[
            LM.LEFT_SHOULDER
          ],

          landmarks[
            LM.LEFT_HIP
          ]

        ),


      rightShoulder:

        calculateAngle(

          landmarks[
            LM.RIGHT_ELBOW
          ],

          landmarks[
            LM.RIGHT_SHOULDER
          ],

          landmarks[
            LM.RIGHT_HIP
          ]

        ),


      leftHip:

        calculateAngle(

          landmarks[
            LM.LEFT_SHOULDER
          ],

          landmarks[
            LM.LEFT_HIP
          ],

          landmarks[
            LM.LEFT_KNEE
          ]

        ),


      rightHip:

        calculateAngle(

          landmarks[
            LM.RIGHT_SHOULDER
          ],

          landmarks[
            LM.RIGHT_HIP
          ],

          landmarks[
            LM.RIGHT_KNEE
          ]

        ),


      leftKnee:

        calculateAngle(

          landmarks[
            LM.LEFT_HIP
          ],

          landmarks[
            LM.LEFT_KNEE
          ],

          landmarks[
            LM.LEFT_ANKLE
          ]

        ),


      rightKnee:

        calculateAngle(

          landmarks[
            LM.RIGHT_HIP
          ],

          landmarks[
            LM.RIGHT_KNEE
          ],

          landmarks[
            LM.RIGHT_ANKLE
          ]

        ),


      leftAnkle:

        calculateAngle(

          landmarks[
            LM.LEFT_KNEE
          ],

          landmarks[
            LM.LEFT_ANKLE
          ],

          landmarks[
            LM.LEFT_FOOT
          ]

        ),


      rightAnkle:

        calculateAngle(

          landmarks[
            LM.RIGHT_KNEE
          ],

          landmarks[
            LM.RIGHT_ANKLE
          ],

          landmarks[
            LM.RIGHT_FOOT
          ]

        )

    };


    return angles;

  }


  /* =====================================================
     SYMMETRY
  ===================================================== */

  function difference(
    a,
    b
  ) {

    if (
      a === null ||
      b === null ||
      a === undefined ||
      b === undefined
    ) {

      return null;

    }


    return Math.abs(
      a - b
    );

  }


  function calculateSymmetry(
    angles
  ) {

    const values = [

      difference(
        angles.leftElbow,
        angles.rightElbow
      ),

      difference(
        angles.leftShoulder,
        angles.rightShoulder
      ),

      difference(
        angles.leftHip,
        angles.rightHip
      ),

      difference(
        angles.leftKnee,
        angles.rightKnee
      ),

      difference(
        angles.leftAnkle,
        angles.rightAnkle
      )

    ].filter(
      value =>
        value !== null
    );


    if (
      !values.length
    ) {

      return null;

    }


    const averageDifference =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
      values.length;


    const score =
      Math.max(
        0,
        100 -
        averageDifference * 2
      );


    return Number(
      score.toFixed(1)
    );

  }


  /* =====================================================
     DRAW SKELETON
  ===================================================== */

  function drawSkeleton(
    landmarks
  ) {

    if (
      !ctx ||
      !canvas ||
      !landmarks
    ) {

      return;

    }


    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    CONNECTIONS.forEach(
      connection => {

        const [
          start,
          end
        ] = connection;


        drawLine(

          landmarks[start],

          landmarks[end]

        );

      }
    );


    landmarks.forEach(
      point => {

        drawPoint(
          point
        );

      }
    );

  }


  /* =====================================================
     DRAW ANGLES
  ===================================================== */

  function drawAngles(
    landmarks,
    angles
  ) {

    drawAngleLabel(

      landmarks[
        LM.LEFT_ELBOW
      ],

      angles.leftElbow

    );


    drawAngleLabel(

      landmarks[
        LM.RIGHT_ELBOW
      ],

      angles.rightElbow

    );


    drawAngleLabel(

      landmarks[
        LM.LEFT_HIP
      ],

      angles.leftHip

    );


    drawAngleLabel(

      landmarks[
        LM.RIGHT_HIP
      ],

      angles.rightHip

    );


    drawAngleLabel(

      landmarks[
        LM.LEFT_KNEE
      ],

      angles.leftKnee

    );


    drawAngleLabel(

      landmarks[
        LM.RIGHT_KNEE
      ],

      angles.rightKnee

    );

  }


  /* =====================================================
     UPDATE UI
  ===================================================== */

  const ANGLE_LABELS = {

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


  function updateAngleUI(
    angles
  ) {

    const container =
      document.querySelector(
        "[data-sport-angles]"
      );


    if (!container) {

      return;

    }


    container.innerHTML =
      "";


    Object.entries(
      angles
    ).forEach(
      ([key, value]) => {

        const item =
          document.createElement(
            "div"
          );


        item.className =
          "angle-item";


        const label =
          document.createElement(
            "span"
          );


        label.textContent =
          ANGLE_LABELS[key] ||
          key;


        const strong =
          document.createElement(
            "strong"
          );


        strong.textContent =
          value === null
            ? "--"
            : `${value}°`;


        item.append(
          label,
          strong
        );


        container.appendChild(
          item
        );

      }
    );

  }


  /* =====================================================
     PROCESS LANDMARKS

     실제 AI 모델에서 landmarks가 들어오면
     이 함수 하나로 전체 분석 실행
  ===================================================== */

  function processLandmarks(
    landmarks
  ) {

    if (
      !landmarks ||
      landmarks.length < 33
    ) {

      state.detected =
        false;

      return;

    }


    resizeCanvas();


    lastLandmarks =
      landmarks;


    const angles =
      analyzeAngles(
        landmarks
      );


    const symmetry =
      calculateSymmetry(
        angles
      );


    state.detected =
      true;

    state.landmarks =
      landmarks;

    state.angles =
      angles;

    state.symmetry =
      symmetry;


    drawSkeleton(
      landmarks
    );


    drawAngles(
      landmarks,
      angles
    );


    updateAngleUI(
      angles
    );


    /*
      다른 모듈에서도 사용 가능
    */

    window.SeolcheonPoseData = {

      landmarks,

      angles,

      symmetry,

      timestamp:
        Date.now()

    };


    document.dispatchEvent(

      new CustomEvent(
        "seolcheon:pose-update",
        {
          detail:
            window.SeolcheonPoseData
        }
      )

    );

  }


  /* =====================================================
     CLEAR
  ===================================================== */

  function clear() {

    if (
      ctx &&
      canvas
    ) {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

    }


    state.detected =
      false;

    state.angles =
      {};

    state.symmetry =
      null;

    state.landmarks =
      null;


    lastLandmarks =
      null;

  }


  /* =====================================================
     START / STOP
  ===================================================== */

  function start() {

    refreshElements();

    resizeCanvas();


    running =
      true;


    console.log(
      "[POSE] ANALYSIS READY"
    );

  }


  function stop() {

    running =
      false;


    if (
      animationId
    ) {

      cancelAnimationFrame(
        animationId
      );


      animationId =
        null;

    }


    console.log(
      "[POSE] STOPPED"
    );

  }


  /* =====================================================
     SNAPSHOT IMAGE
  ===================================================== */

  function getPoseImage() {

    if (!canvas) {

      return null;

    }


    try {

      return canvas.toDataURL(
        "image/png"
      );

    }

    catch (error) {

      console.warn(
        "[POSE IMAGE]",
        error
      );


      return null;

    }

  }


  /* =====================================================
     REPORT STORAGE
  ===================================================== */

  function savePoseForReport() {

    const image =
      getPoseImage();


    if (!image) {

      return;

    }


    try {

      sessionStorage.setItem(
        "seolcheon_pose_image",
        image
      );


      sessionStorage.setItem(
        "seolcheon_pose_angles",
        JSON.stringify(
          state.angles
        )
      );

    }

    catch (error) {

      console.warn(
        "[POSE REPORT STORAGE]",
        error
      );

    }

  }


  /* =====================================================
     SNAPSHOT 연동
  ===================================================== */

  document.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          "[data-analysis-snapshot]"
        )
      ) {

        setTimeout(
          savePoseForReport,
          50
        );

      }

    }
  );


  /* =====================================================
     INIT
  ===================================================== */

  function init() {

    refreshElements();


    if (video) {

      video.addEventListener(
        "loadedmetadata",
        resizeCanvas
      );


      video.addEventListener(
        "loadeddata",
        resizeCanvas
      );

    }


    window.addEventListener(
      "resize",
      resizeCanvas
    );


    console.log(
      "[POSE] MODULE READY"
    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }

  else {

    init();

  }


  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {

    start,

    stop,

    clear,

    processLandmarks,

    calculateAngle,

    analyzeAngles,

    calculateSymmetry,

    getPoseImage,

    savePoseForReport,


    getState() {

      return {

        running,

        detected:
          state.detected,

        angles:
          {
            ...state.angles
          },

        symmetry:
          state.symmetry,

        landmarks:
          state.landmarks

      };

    }

  };

})();