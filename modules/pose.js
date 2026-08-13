/* =========================================================
   SEOLCHEON HIGH SCHOOL
   SPORTS PERFORMANCE ANALYSIS SYSTEM

   AI POSE / BIOMECHANICS ENGINE

   - MediaPipe Pose Landmarker
   - 33 body landmarks
   - Live camera analysis
   - Uploaded video analysis
   - Skeleton overlay
   - Joint angles
   - Left / Right symmetry
   - World landmarks
   - Report image
========================================================= */

"use strict";


window.SeolcheonPose = (() => {

  /* =====================================================
     STATE
  ===================================================== */

  let poseLandmarker = null;

  let video = null;

  let canvas = null;

  let ctx = null;

  let running = false;

  let aiReady = false;

  let loading = false;

  let animationId = null;

  let lastVideoTime = -1;

  let lastTimestamp = 0;

  let latestLandmarks = null;

  let latestWorldLandmarks = null;


  const state = {

    detected: false,

    angles: {},

    symmetry: null,

    landmarks: null,

    worldLandmarks: null,

    fps: 0

  };


  /* =====================================================
     MEDIAPIPE LANDMARK INDEX
  ===================================================== */

  const LM = {

    NOSE: 0,

    LEFT_EYE: 2,
    RIGHT_EYE: 5,

    LEFT_EAR: 7,
    RIGHT_EAR: 8,

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

    [7, 11],
    [8, 12],

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
    [27, 31],

    [28, 30],
    [30, 32],
    [28, 32]

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
     STATUS
  ===================================================== */

  function setStatus(
    text
  ) {

    console.log(
      "[POSE]",
      text
    );


    document
      .querySelectorAll(
        "[data-pose-status]"
      )
      .forEach(
        element => {

          element.textContent =
            text;

        }
      );

  }


  /* =====================================================
     LOAD MEDIAPIPE
  ===================================================== */

  async function waitForMediaPipe() {

    if (
      window.MediaPipePose
    ) {

      return true;

    }


    return new Promise(
      resolve => {

        let finished =
          false;


        const ready = () => {

          if (finished) {
            return;
          }


          finished =
            true;


          resolve(
            true
          );

        };


        window.addEventListener(
          "mediapipe-ready",
          ready,
          {
            once: true
          }
        );


        setTimeout(
          () => {

            if (
              finished
            ) {

              return;

            }


            finished =
              true;


            resolve(
              Boolean(
                window.MediaPipePose
              )
            );

          },
          15000
        );

      }
    );

  }


  /* =====================================================
     CREATE AI MODEL
  ===================================================== */

  async function createAI() {

    if (
      aiReady &&
      poseLandmarker
    ) {

      return true;

    }


    if (loading) {

      while (loading) {

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              100
            )
        );

      }


      return aiReady;

    }


    loading =
      true;


    setStatus(
      "AI LOADING"
    );


    try {

      const available =
        await waitForMediaPipe();


      if (
        !available ||
        !window.MediaPipePose
      ) {

        throw new Error(
          "MediaPipe library unavailable"
        );

      }


      const {

        PoseLandmarker,

        FilesetResolver

      } =
        window.MediaPipePose;


      const vision =
        await FilesetResolver
          .forVisionTasks(

            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm"

          );


      poseLandmarker =
        await PoseLandmarker
          .createFromOptions(

            vision,

            {

              baseOptions: {

                modelAssetPath:

                  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"

              },


              runningMode:
                "VIDEO",


              numPoses:
                1,


              minPoseDetectionConfidence:
                0.5,


              minPosePresenceConfidence:
                0.5,


              minTrackingConfidence:
                0.5,


              outputSegmentationMasks:
                false

            }

          );


      aiReady =
        true;


      setStatus(
        "AI READY"
      );


      console.log(
        "[POSE] MediaPipe Pose Landmarker READY"
      );


      return true;

    }

    catch (error) {

      console.error(
        "[POSE AI ERROR]",
        error
      );


      aiReady =
        false;


      setStatus(
        "AI ERROR"
      );


      return false;

    }

    finally {

      loading =
        false;

    }

  }


  /* =====================================================
     CANVAS SIZE
  ===================================================== */

  function resizeCanvas() {

    refreshElements();


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
     VISIBILITY
  ===================================================== */

  function visible(
    point,
    threshold = 0.4
  ) {

    if (!point) {

      return false;

    }


    if (
      point.visibility ===
      undefined
    ) {

      return true;

    }


    return (
      point.visibility >=
      threshold
    );

  }


  /* =====================================================
     ANGLE CALCULATION
  ===================================================== */

  function calculateAngle(
    a,
    b,
    c
  ) {

    if (
      !a ||
      !b ||
      !c
    ) {

      return null;

    }


    const vector1 = {

      x:
        a.x - b.x,

      y:
        a.y - b.y

    };


    const vector2 = {

      x:
        c.x - b.x,

      y:
        c.y - b.y

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


    const angle =
      Math.acos(
        cosine
      ) *
      180 /
      Math.PI;


    return Number(
      angle.toFixed(1)
    );

  }


  /* =====================================================
     ANGLES
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


    return {


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

  }


  /* =====================================================
     SYMMETRY
  ===================================================== */

  function calculateSymmetry(
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


    const differences =
      pairs
        .filter(
          pair =>
            Number.isFinite(
              pair[0]
            ) &&
            Number.isFinite(
              pair[1]
            )
        )
        .map(
          pair =>
            Math.abs(
              pair[0] -
              pair[1]
            )
        );


    if (
      !differences.length
    ) {

      return null;

    }


    const average =
      differences.reduce(
        (sum, value) =>
          sum + value,
        0
      ) /
      differences.length;


    return Number(

      Math.max(
        0,
        100 -
        average * 2
      ).toFixed(1)

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

      a.x *
      canvas.width,

      a.y *
      canvas.height

    );


    ctx.lineTo(

      b.x *
      canvas.width,

      b.y *
      canvas.height

    );


    ctx.lineWidth =
      Math.max(
        3,
        canvas.width /
        400
      );


    ctx.strokeStyle =
      "rgba(0,216,255,0.95)";


    ctx.shadowBlur =
      8;


    ctx.shadowColor =
      "#00d8ff";


    ctx.stroke();


    ctx.shadowBlur =
      0;

  }


  /* =====================================================
     DRAW JOINT
  ===================================================== */

  function drawJoint(
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
        4,
        canvas.width /
        260
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
     ANGLE TEXT
  ===================================================== */

  function drawAngle(
    point,
    angle
  ) {

    if (
      !ctx ||
      !canvas ||
      !visible(point) ||
      !Number.isFinite(angle)
    ) {

      return;

    }


    const x =
      point.x *
      canvas.width;


    const y =
      point.y *
      canvas.height;


    const text =
      `${angle}°`;


    ctx.font =
      `600 ${Math.max(
        14,
        canvas.width / 75
      )}px Arial`;


    ctx.lineWidth =
      5;


    ctx.strokeStyle =
      "rgba(0,0,0,0.85)";


    ctx.strokeText(
      text,
      x + 12,
      y - 12
    );


    ctx.fillStyle =
      "#ffffff";


    ctx.fillText(
      text,
      x + 12,
      y - 12
    );

  }


  /* =====================================================
     DRAW
  ===================================================== */

  function drawPose(
    landmarks,
    angles
  ) {

    if (
      !ctx ||
      !canvas
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
      ([a, b]) => {

        drawLine(
          landmarks[a],
          landmarks[b]
        );

      }
    );


    landmarks.forEach(
      landmark => {

        drawJoint(
          landmark
        );

      }
    );


    drawAngle(

      landmarks[
        LM.LEFT_ELBOW
      ],

      angles.leftElbow

    );


    drawAngle(

      landmarks[
        LM.RIGHT_ELBOW
      ],

      angles.rightElbow

    );


    drawAngle(

      landmarks[
        LM.LEFT_HIP
      ],

      angles.leftHip

    );


    drawAngle(

      landmarks[
        LM.RIGHT_HIP
      ],

      angles.rightHip

    );


    drawAngle(

      landmarks[
        LM.LEFT_KNEE
      ],

      angles.leftKnee

    );


    drawAngle(

      landmarks[
        LM.RIGHT_KNEE
      ],

      angles.rightKnee

    );

  }


  /* =====================================================
     UI ANGLES
  ===================================================== */

  const ANGLE_NAMES = {

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


        item.innerHTML = `

          <span>
            ${
              ANGLE_NAMES[key] ||
              key
            }
          </span>

          <strong>
            ${
              Number.isFinite(
                value
              )
                ? `${value}°`
                : "--"
            }
          </strong>

        `;


        container.appendChild(
          item
        );

      }
    );

  }


  /* =====================================================
     PROCESS RESULT
  ===================================================== */

  function processResult(
    result
  ) {

    if (
      !result ||
      !result.landmarks ||
      !result.landmarks.length
    ) {

      state.detected =
        false;


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


      return;

    }


    const landmarks =
      result.landmarks[0];


    const worldLandmarks =
      result.worldLandmarks?.[0] ||
      null;


    latestLandmarks =
      landmarks;


    latestWorldLandmarks =
      worldLandmarks;


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


    state.worldLandmarks =
      worldLandmarks;


    state.angles =
      angles;


    state.symmetry =
      symmetry;


    drawPose(
      landmarks,
      angles
    );


    updateAngleUI(
      angles
    );


    window.SeolcheonPoseData = {

      detected:
        true,

      landmarks,

      worldLandmarks,

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
     AI LOOP
  ===================================================== */

  async function analyzeFrame() {

    if (!running) {

      return;

    }


    if (
      !video ||
      !poseLandmarker
    ) {

      animationId =
        requestAnimationFrame(
          analyzeFrame
        );


      return;

    }


    if (
      video.readyState < 2
    ) {

      animationId =
        requestAnimationFrame(
          analyzeFrame
        );


      return;

    }


    /*
      같은 비디오 프레임 중복 분석 방지
    */

    if (
      video.currentTime !==
      lastVideoTime
    ) {

      lastVideoTime =
        video.currentTime;


      let timestamp =
        performance.now();


      /*
        MediaPipe VIDEO mode에서는
        timestamp가 계속 증가해야 함
      */

      if (
        timestamp <=
        lastTimestamp
      ) {

        timestamp =
          lastTimestamp +
          1;

      }


      lastTimestamp =
        timestamp;


      try {

        const result =
          poseLandmarker
            .detectForVideo(
              video,
              timestamp
            );


        processResult(
          result
        );

      }

      catch (error) {

        console.warn(
          "[POSE FRAME ERROR]",
          error
        );

      }

    }


    animationId =
      requestAnimationFrame(
        analyzeFrame
      );

  }


  /* =====================================================
     START
  ===================================================== */

  async function start() {

    refreshElements();


    if (!video) {

      console.error(
        "[POSE] VIDEO NOT FOUND"
      );


      return false;

    }


    resizeCanvas();


    const ready =
      await createAI();


    if (!ready) {

      return false;

    }


    if (running) {

      return true;

    }


    running =
      true;


    lastVideoTime =
      -1;


    lastTimestamp =
      0;


    setStatus(
      "POSE ANALYSIS"
    );


    analyzeFrame();


    return true;

  }


  /* =====================================================
     STOP
  ===================================================== */

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


    setStatus(
      "POSE STOPPED"
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


    state.worldLandmarks =
      null;


    latestLandmarks =
      null;


    latestWorldLandmarks =
      null;

  }


  /* =====================================================
     REPORT IMAGE
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
        "[POSE IMAGE ERROR]",
        error
      );


      return null;

    }

  }


  function saveForReport() {

    const image =
      getPoseImage();


    try {

      if (image) {

        sessionStorage.setItem(
          "seolcheon_pose_image",
          image
        );

      }


      sessionStorage.setItem(
        "seolcheon_pose_angles",
        JSON.stringify(
          state.angles
        )
      );


      sessionStorage.setItem(
        "seolcheon_pose_symmetry",
        String(
          state.symmetry ??
          ""
        )
      );


      if (
        state.worldLandmarks
      ) {

        sessionStorage.setItem(
          "seolcheon_pose_world",
          JSON.stringify(
            state.worldLandmarks
          )
        );

      }

    }

    catch (error) {

      console.warn(
        "[POSE REPORT]",
        error
      );

    }

  }


  /* =====================================================
     AUTO START
  ===================================================== */

  function bindControls() {

    document
      .querySelectorAll(
        `
        [data-camera-start],
        [data-analysis-play]
        `
      )
      .forEach(
        button => {

          if (
            button.dataset.poseBound ===
            "true"
          ) {

            return;

          }


          button.dataset.poseBound =
            "true";


          button.addEventListener(
            "click",
            () => {

              setTimeout(
                start,
                500
              );

            }
          );

        }
      );


    const upload =
      document.querySelector(
        "[data-video-upload]"
      );


    if (
      upload &&
      upload.dataset.poseBound !==
        "true"
    ) {

      upload.dataset.poseBound =
        "true";


      upload.addEventListener(
        "change",
        () => {

          setTimeout(
            start,
            700
          );

        }
      );

    }


    document
      .querySelectorAll(
        "[data-analysis-snapshot]"
      )
      .forEach(
        button => {

          if (
            button.dataset.poseSaveBound ===
            "true"
          ) {

            return;

          }


          button.dataset.poseSaveBound =
            "true";


          button.addEventListener(
            "click",
            () => {

              setTimeout(
                saveForReport,
                80
              );

            }
          );

        }
      );

  }


  /* =====================================================
     INIT
  ===================================================== */

  function init() {

    refreshElements();


    bindControls();


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


    const observer =
      new MutationObserver(
        () => {

          refreshElements();

          bindControls();

        }
      );


    observer.observe(
      document.body,
      {

        childList:
          true,

        subtree:
          true

      }
    );


    console.log(
      "[POSE] ENGINE INITIALIZED"
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

    createAI,

    calculateAngle,

    analyzeAngles,

    calculateSymmetry,

    getPoseImage,

    saveForReport,


    getState() {

      return {

        running,

        aiReady,

        detected:
          state.detected,

        angles:
          {
            ...state.angles
          },

        symmetry:
          state.symmetry,

        landmarks:
          state.landmarks,

        worldLandmarks:
          state.worldLandmarks

      };

    }

  };

})();