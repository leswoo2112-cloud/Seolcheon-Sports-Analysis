/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / ANALYSIS-3D.JS
   VERSION 1.0

   3D PERFORMANCE VISUALIZATION

   기능
   ---------------------------------------------------------
   - Pose 3D Landmark 시각화
   - 3D Skeleton
   - Front / Side / Top View
   - 자유 회전
   - 확대 / 축소
   - 신체 중심(COM) 계산
   - 신체 중심 이동 궤적
   - 관절 이동 궤적
   - 역도 Barbell Path
   - 실시간 / 영상 분석 공통 지원
   - 리포트용 3D 이미지 캡처

   NOTE
   ---------------------------------------------------------
   단일 카메라의 z 좌표는 실제 공간의 절대 거리(mm/cm)가
   아니라 Pose 모델이 추정한 상대 깊이일 수 있다.
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const ANALYSIS_3D_CONFIG = {

  enabled: true,

  scale: 360,

  zoomMin: 0.5,

  zoomMax: 3,

  defaultZoom: 1,

  rotationSensitivity: 0.008,

  trajectoryLimit: 180,

  jointTrajectoryLimit: 120,

  pointRadius: 5,

  lineWidth: 3,

  showSkeleton: true,

  showCOM: true,

  showCOMPath: true,

  showBarPath: true,

  showGrid: true,

  showAxes: true

};


/* =========================================================
   02. STATE
========================================================= */

const Analysis3DManager = {

  initialized: false,

  enabled: true,

  canvas: null,

  ctx: null,

  landmarks: null,

  latestPose: null,

  width: 0,

  height: 0,

  view: "perspective",

  rotationX: -0.12,

  rotationY: 0.35,

  rotationZ: 0,

  zoom:
    ANALYSIS_3D_CONFIG.defaultZoom,

  offsetX: 0,

  offsetY: 0,

  dragging: false,

  lastPointerX: 0,

  lastPointerY: 0,

  com: null,

  comPath: [],

  jointPaths: {},

  trackedJoint: null,

  barPath: [],

  animationFrame: null

};


/* =========================================================
   03. CONNECTIONS
========================================================= */

const ANALYSIS_3D_CONNECTIONS = [

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
   04. INIT
========================================================= */

function initAnalysis3D() {

  if (
    Analysis3DManager.initialized
  ) {
    return;
  }


  Analysis3DManager.initialized =
    true;


  Analysis3DManager.canvas =
    findAnalysis3DCanvas();


  if (
    Analysis3DManager.canvas
  ) {

    Analysis3DManager.ctx =
      Analysis3DManager.canvas
        .getContext("2d");


    resizeAnalysis3DCanvas();


    bindAnalysis3DCanvasEvents();

  }


  bindAnalysis3DEvents();


  console.log(
    "[3D ANALYSIS] Ready"
  );

}


/* =========================================================
   05. FIND CANVAS
========================================================= */

function findAnalysis3DCanvas() {

  return (

    document.getElementById(
      "analysis-3d-canvas"
    ) ||

    document.getElementById(
      "pose-3d-canvas"
    ) ||

    document.querySelector(
      "[data-analysis-3d]"
    )

  );

}


/* =========================================================
   06. EVENTS
========================================================= */

function bindAnalysis3DEvents() {

  /*
     pose.js 결과 수신
  */

  document.addEventListener(
    "pose:result",
    event => {

      updateAnalysis3D(
        event.detail
      );

    }
  );


  /*
     역도 bar path 수신
  */

  document.addEventListener(
    "weightlifting:bar-path",
    event => {

      add3DBarPathPoint(
        event.detail
      );

    }
  );


  document.addEventListener(
    "click",
    handleAnalysis3DClick
  );


  window.addEventListener(
    "resize",
    resizeAnalysis3DCanvas
  );

}


/* =========================================================
   07. BUTTON EVENTS
========================================================= */

function handleAnalysis3DClick(event) {

  const front =
    event.target.closest(
      "[data-3d-view='front']"
    );


  if (front) {

    setAnalysis3DView(
      "front"
    );

    return;
  }


  const side =
    event.target.closest(
      "[data-3d-view='side']"
    );


  if (side) {

    setAnalysis3DView(
      "side"
    );

    return;
  }


  const top =
    event.target.closest(
      "[data-3d-view='top']"
    );


  if (top) {

    setAnalysis3DView(
      "top"
    );

    return;
  }


  const perspective =
    event.target.closest(
      "[data-3d-view='perspective']"
    );


  if (perspective) {

    setAnalysis3DView(
      "perspective"
    );

    return;
  }


  const reset =
    event.target.closest(
      "[data-action='3d-reset']"
    );


  if (reset) {

    resetAnalysis3DView();

    return;
  }


  const zoomIn =
    event.target.closest(
      "[data-action='3d-zoom-in']"
    );


  if (zoomIn) {

    setAnalysis3DZoom(
      Analysis3DManager.zoom +
      0.15
    );

    return;
  }


  const zoomOut =
    event.target.closest(
      "[data-action='3d-zoom-out']"
    );


  if (zoomOut) {

    setAnalysis3DZoom(
      Analysis3DManager.zoom -
      0.15
    );

    return;
  }


  const clearPath =
    event.target.closest(
      "[data-action='3d-clear-path']"
    );


  if (clearPath) {

    clearAnalysis3DPaths();

    return;
  }


  const snapshot =
    event.target.closest(
      "[data-action='3d-snapshot']"
    );


  if (snapshot) {

    captureAnalysis3DSnapshot();

  }

}


/* =========================================================
   08. POINTER / DRAG
========================================================= */

function bindAnalysis3DCanvasEvents() {

  const canvas =
    Analysis3DManager.canvas;


  if (!canvas) {
    return;
  }


  canvas.addEventListener(
    "pointerdown",
    event => {

      Analysis3DManager.dragging =
        true;


      Analysis3DManager.lastPointerX =
        event.clientX;


      Analysis3DManager.lastPointerY =
        event.clientY;


      canvas.setPointerCapture(
        event.pointerId
      );

    }
  );


  canvas.addEventListener(
    "pointermove",
    event => {

      if (
        !Analysis3DManager.dragging
      ) {
        return;
      }


      const dx =
        event.clientX -
        Analysis3DManager.lastPointerX;


      const dy =
        event.clientY -
        Analysis3DManager.lastPointerY;


      Analysis3DManager.rotationY +=
        dx *
        ANALYSIS_3D_CONFIG
          .rotationSensitivity;


      Analysis3DManager.rotationX +=
        dy *
        ANALYSIS_3D_CONFIG
          .rotationSensitivity;


      Analysis3DManager.lastPointerX =
        event.clientX;


      Analysis3DManager.lastPointerY =
        event.clientY;


      Analysis3DManager.view =
        "custom";


      renderAnalysis3D();

    }
  );


  const stopDrag = () => {

    Analysis3DManager.dragging =
      false;

  };


  canvas.addEventListener(
    "pointerup",
    stopDrag
  );


  canvas.addEventListener(
    "pointercancel",
    stopDrag
  );


  /*
     마우스 휠 확대/축소
  */

  canvas.addEventListener(
    "wheel",
    event => {

      event.preventDefault();


      const direction =
        event.deltaY < 0
          ? 0.1
          : -0.1;


      setAnalysis3DZoom(
        Analysis3DManager.zoom +
        direction
      );

    },
    {
      passive: false
    }
  );

}


/* =========================================================
   09. RESIZE
========================================================= */

function resizeAnalysis3DCanvas() {

  const canvas =
    Analysis3DManager.canvas ||
    findAnalysis3DCanvas();


  if (!canvas) {
    return;
  }


  Analysis3DManager.canvas =
    canvas;


  if (
    !Analysis3DManager.ctx
  ) {

    Analysis3DManager.ctx =
      canvas.getContext("2d");

  }


  const rect =
    canvas.getBoundingClientRect();


  const ratio =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );


  const width =
    Math.max(
      320,
      Math.round(
        rect.width || 900
      )
    );


  const height =
    Math.max(
      320,
      Math.round(
        rect.height || 600
      )
    );


  canvas.width =
    width * ratio;


  canvas.height =
    height * ratio;


  Analysis3DManager.width =
    width;


  Analysis3DManager.height =
    height;


  Analysis3DManager.ctx
    .setTransform(
      ratio,
      0,
      0,
      ratio,
      0,
      0
    );


  renderAnalysis3D();

}


/* =========================================================
   10. UPDATE 3D
========================================================= */

function updateAnalysis3D(
  poseResult
) {

  if (
    !Analysis3DManager.enabled ||
    !poseResult?.landmarks
  ) {

    return;
  }


  Analysis3DManager.latestPose =
    poseResult;


  Analysis3DManager.landmarks =
    poseResult.landmarks;


  const com =
    calculateCenterOfMass3D(
      poseResult.landmarks
    );


  Analysis3DManager.com =
    com;


  if (com) {

    Analysis3DManager.comPath.push({

      ...com,

      time:
        poseResult.videoTime ??
        poseResult.timestamp

    });


    limitArray(
      Analysis3DManager.comPath,
      ANALYSIS_3D_CONFIG
        .trajectoryLimit
    );

  }


  updateTrackedJointPath(
    poseResult
  );


  updateAnalysis3DUI();


  renderAnalysis3D();

}


/* =========================================================
   11. LANDMARK
========================================================= */

function getAnalysis3DPoint(
  landmarks,
  name
) {

  if (
    !window.POSE_LANDMARKS
  ) {
    return null;
  }


  const index =
    window.POSE_LANDMARKS[
      name
    ];


  if (
    index === undefined
  ) {
    return null;
  }


  const point =
    landmarks[index];


  if (!point) {
    return null;
  }


  if (
    !Number.isFinite(point.x) ||
    !Number.isFinite(point.y)
  ) {

    return null;
  }


  return {

    x:
      point.x,

    y:
      point.y,

    z:
      Number.isFinite(point.z)
        ? point.z
        : 0,

    visibility:
      point.visibility ?? 1

  };

}


/* =========================================================
   12. CENTER OF MASS

   영상 기반 근사 COM.
   실제 force plate 기반 COM과는 구분한다.
========================================================= */

function calculateCenterOfMass3D(
  landmarks
) {

  const names = [

    "leftShoulder",
    "rightShoulder",

    "leftHip",
    "rightHip",

    "leftKnee",
    "rightKnee",

    "leftAnkle",
    "rightAnkle"

  ];


  const weighted = [

    ["leftShoulder", 1.5],
    ["rightShoulder", 1.5],

    ["leftHip", 3],
    ["rightHip", 3],

    ["leftKnee", 1],
    ["rightKnee", 1],

    ["leftAnkle", 0.5],
    ["rightAnkle", 0.5]

  ];


  let totalWeight = 0;

  let x = 0;
  let y = 0;
  let z = 0;


  weighted.forEach(
    ([name, weight]) => {

      if (
        !names.includes(name)
      ) {
        return;
      }


      const point =
        getAnalysis3DPoint(
          landmarks,
          name
        );


      if (
        !point ||
        point.visibility < 0.4
      ) {
        return;
      }


      x += point.x * weight;
      y += point.y * weight;
      z += point.z * weight;

      totalWeight += weight;

    }
  );


  if (
    totalWeight === 0
  ) {

    return null;
  }


  return {

    x:
      x / totalWeight,

    y:
      y / totalWeight,

    z:
      z / totalWeight

  };

}


/* =========================================================
   13. TRACK JOINT
========================================================= */

function setTracked3DJoint(
  jointName
) {

  Analysis3DManager.trackedJoint =
    jointName || null;


  if (
    jointName &&
    !Analysis3DManager
      .jointPaths[jointName]
  ) {

    Analysis3DManager
      .jointPaths[jointName] = [];

  }


  renderAnalysis3D();

}


/* =========================================================
   14. UPDATE JOINT PATH
========================================================= */

function updateTrackedJointPath(
  pose
) {

  const name =
    Analysis3DManager.trackedJoint;


  if (!name) {
    return;
  }


  const point =
    getAnalysis3DPoint(
      pose.landmarks,
      name
    );


  if (!point) {
    return;
  }


  if (
    !Analysis3DManager
      .jointPaths[name]
  ) {

    Analysis3DManager
      .jointPaths[name] = [];

  }


  Analysis3DManager
    .jointPaths[name]
    .push({

      ...point,

      time:
        pose.videoTime ??
        pose.timestamp

    });


  limitArray(
    Analysis3DManager
      .jointPaths[name],

    ANALYSIS_3D_CONFIG
      .jointTrajectoryLimit
  );

}


/* =========================================================
   15. BAR PATH
========================================================= */

function add3DBarPathPoint(
  point
) {

  if (!point) {
    return;
  }


  const x =
    Number(point.x);


  const y =
    Number(point.y);


  const z =
    Number(
      point.z ?? 0
    );


  if (
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  ) {

    return;
  }


  Analysis3DManager.barPath.push({

    x,
    y,
    z:
      Number.isFinite(z)
        ? z
        : 0,

    time:
      point.time ??
      performance.now()

  });


  limitArray(
    Analysis3DManager.barPath,
    ANALYSIS_3D_CONFIG
      .trajectoryLimit
  );


  renderAnalysis3D();

}


/* =========================================================
   16. PROJECT 3D POINT
========================================================= */

function projectAnalysis3DPoint(
  point
) {

  if (!point) {
    return null;
  }


  /*
     몸 중심을 원점 근처로 이동
  */

  let x =
    point.x - 0.5;


  let y =
    0.5 - point.y;


  let z =
    point.z;


  /*
     X rotation
  */

  const cosX =
    Math.cos(
      Analysis3DManager.rotationX
    );


  const sinX =
    Math.sin(
      Analysis3DManager.rotationX
    );


  const y1 =
    y * cosX -
    z * sinX;


  const z1 =
    y * sinX +
    z * cosX;


  y = y1;
  z = z1;


  /*
     Y rotation
  */

  const cosY =
    Math.cos(
      Analysis3DManager.rotationY
    );


  const sinY =
    Math.sin(
      Analysis3DManager.rotationY
    );


  const x2 =
    x * cosY +
    z * sinY;


  const z2 =
    -x * sinY +
    z * cosY;


  x = x2;
  z = z2;


  /*
     Z rotation
  */

  const cosZ =
    Math.cos(
      Analysis3DManager.rotationZ
    );


  const sinZ =
    Math.sin(
      Analysis3DManager.rotationZ
    );


  const x3 =
    x * cosZ -
    y * sinZ;


  const y3 =
    x * sinZ +
    y * cosZ;


  x = x3;
  y = y3;


  /*
     간단한 perspective
  */

  const perspective =
    1 /
    Math.max(
      0.55,
      1.5 + z
    );


  const scale =
    ANALYSIS_3D_CONFIG.scale *
    Analysis3DManager.zoom *
    perspective;


  return {

    x:
      Analysis3DManager.width / 2 +
      x * scale +
      Analysis3DManager.offsetX,

    y:
      Analysis3DManager.height / 2 -
      y * scale +
      Analysis3DManager.offsetY,

    depth:
      z,

    scale:
      perspective

  };

}


/* =========================================================
   17. RENDER
========================================================= */

function renderAnalysis3D() {

  const ctx =
    Analysis3DManager.ctx;


  const canvas =
    Analysis3DManager.canvas;


  if (
    !ctx ||
    !canvas
  ) {
    return;
  }


  const width =
    Analysis3DManager.width;


  const height =
    Analysis3DManager.height;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  drawAnalysis3DBackground(
    ctx,
    width,
    height
  );


  if (
    ANALYSIS_3D_CONFIG.showGrid
  ) {

    drawAnalysis3DGrid(
      ctx,
      width,
      height
    );

  }


  if (
    ANALYSIS_3D_CONFIG.showAxes
  ) {

    drawAnalysis3DAxes(
      ctx
    );

  }


  if (
    ANALYSIS_3D_CONFIG.showCOMPath
  ) {

    drawAnalysis3DTrajectory(
      ctx,
      Analysis3DManager.comPath,
      "COM"
    );

  }


  if (
    Analysis3DManager.trackedJoint
  ) {

    const path =
      Analysis3DManager
        .jointPaths[
          Analysis3DManager
            .trackedJoint
        ];


    drawAnalysis3DTrajectory(
      ctx,
      path || [],
      Analysis3DManager
        .trackedJoint
    );

  }


  if (
    ANALYSIS_3D_CONFIG.showBarPath
  ) {

    drawAnalysis3DBarPath(
      ctx
    );

  }


  if (
    Analysis3DManager.landmarks &&
    ANALYSIS_3D_CONFIG.showSkeleton
  ) {

    drawAnalysis3DSkeleton(
      ctx,
      Analysis3DManager.landmarks
    );

  }


  if (
    ANALYSIS_3D_CONFIG.showCOM &&
    Analysis3DManager.com
  ) {

    drawAnalysis3DCOM(
      ctx,
      Analysis3DManager.com
    );

  }


  drawAnalysis3DHUD(
    ctx,
    width
  );

}


/* =========================================================
   18. BACKGROUND
========================================================= */

function drawAnalysis3DBackground(
  ctx,
  width,
  height
) {

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );


  gradient.addColorStop(
    0,
    "#07131d"
  );


  gradient.addColorStop(
    1,
    "#02070c"
  );


  ctx.fillStyle =
    gradient;


  ctx.fillRect(
    0,
    0,
    width,
    height
  );

}


/* =========================================================
   19. GRID
========================================================= */

function drawAnalysis3DGrid(
  ctx,
  width,
  height
) {

  ctx.save();


  ctx.strokeStyle =
    "rgba(120,190,220,0.10)";


  ctx.lineWidth =
    1;


  const gap =
    40;


  for (
    let x = 0;
    x <= width;
    x += gap
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      height
    );

    ctx.stroke();

  }


  for (
    let y = 0;
    y <= height;
    y += gap
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();

  }


  ctx.restore();

}


/* =========================================================
   20. AXES
========================================================= */

function drawAnalysis3DAxes(
  ctx
) {

  const origin = {
    x: 74,
    y:
      Analysis3DManager.height -
      70
  };


  ctx.save();


  ctx.lineWidth =
    2;


  /*
     X
  */

  ctx.strokeStyle =
    "rgba(255,100,100,.85)";

  ctx.beginPath();

  ctx.moveTo(
    origin.x,
    origin.y
  );

  ctx.lineTo(
    origin.x + 45,
    origin.y
  );

  ctx.stroke();


  /*
     Y
  */

  ctx.strokeStyle =
    "rgba(100,255,160,.85)";

  ctx.beginPath();

  ctx.moveTo(
    origin.x,
    origin.y
  );

  ctx.lineTo(
    origin.x,
    origin.y - 45
  );

  ctx.stroke();


  /*
     Z
  */

  ctx.strokeStyle =
    "rgba(100,180,255,.85)";

  ctx.beginPath();

  ctx.moveTo(
    origin.x,
    origin.y
  );

  ctx.lineTo(
    origin.x - 27,
    origin.y + 24
  );

  ctx.stroke();


  ctx.font =
    "600 11px system-ui";


  ctx.fillStyle =
    "#ffffff";


  ctx.fillText(
    "X",
    origin.x + 50,
    origin.y + 4
  );


  ctx.fillText(
    "Y",
    origin.x - 3,
    origin.y - 51
  );


  ctx.fillText(
    "Z",
    origin.x - 40,
    origin.y + 32
  );


  ctx.restore();

}


/* =========================================================
   21. SKELETON
========================================================= */

function drawAnalysis3DSkeleton(
  ctx,
  landmarks
) {

  ctx.save();


  ctx.lineWidth =
    ANALYSIS_3D_CONFIG.lineWidth;


  ctx.strokeStyle =
    "rgba(0,235,255,.90)";


  ANALYSIS_3D_CONNECTIONS.forEach(
    ([nameA, nameB]) => {

      const a =
        getAnalysis3DPoint(
          landmarks,
          nameA
        );


      const b =
        getAnalysis3DPoint(
          landmarks,
          nameB
        );


      if (
        !a ||
        !b
      ) {
        return;
      }


      const pa =
        projectAnalysis3DPoint(
          a
        );


      const pb =
        projectAnalysis3DPoint(
          b
        );


      if (
        !pa ||
        !pb
      ) {
        return;
      }


      ctx.beginPath();


      ctx.moveTo(
        pa.x,
        pa.y
      );


      ctx.lineTo(
        pb.x,
        pb.y
      );


      ctx.stroke();

    }
  );


  /*
     Joint points
  */

  Object.keys(
    window.POSE_LANDMARKS || {}
  )
    .forEach(
      name => {

        const point =
          getAnalysis3DPoint(
            landmarks,
            name
          );


        if (
          !point ||
          point.visibility < 0.45
        ) {
          return;
        }


        const projected =
          projectAnalysis3DPoint(
            point
          );


        if (!projected) {
          return;
        }


        ctx.beginPath();


        ctx.fillStyle =
          "#ffffff";


        ctx.arc(
          projected.x,
          projected.y,
          Math.max(
            2.5,
            ANALYSIS_3D_CONFIG
              .pointRadius *
            projected.scale
          ),
          0,
          Math.PI * 2
        );


        ctx.fill();

      }
    );


  ctx.restore();

}


/* =========================================================
   22. COM
========================================================= */

function drawAnalysis3DCOM(
  ctx,
  com
) {

  const point =
    projectAnalysis3DPoint(
      com
    );


  if (!point) {
    return;
  }


  ctx.save();


  ctx.shadowBlur =
    16;


  ctx.shadowColor =
    "rgba(255,220,70,.8)";


  ctx.fillStyle =
    "#ffe34f";


  ctx.beginPath();


  ctx.arc(
    point.x,
    point.y,
    8,
    0,
    Math.PI * 2
  );


  ctx.fill();


  ctx.shadowBlur =
    0;


  ctx.font =
    "700 11px system-ui";


  ctx.fillStyle =
    "#ffffff";


  ctx.fillText(
    "COM",
    point.x + 11,
    point.y - 7
  );


  ctx.restore();

}


/* =========================================================
   23. TRAJECTORY
========================================================= */

function drawAnalysis3DTrajectory(
  ctx,
  path,
  label
) {

  if (
    !Array.isArray(path) ||
    path.length < 2
  ) {
    return;
  }


  ctx.save();


  ctx.strokeStyle =
    "rgba(255,220,70,.72)";


  ctx.lineWidth =
    2;


  ctx.beginPath();


  path.forEach(
    (point, index) => {

      const p =
        projectAnalysis3DPoint(
          point
        );


      if (!p) {
        return;
      }


      if (
        index === 0
      ) {

        ctx.moveTo(
          p.x,
          p.y
        );

      }

      else {

        ctx.lineTo(
          p.x,
          p.y
        );

      }

    }
  );


  ctx.stroke();


  const last =
    projectAnalysis3DPoint(
      path[
        path.length - 1
      ]
    );


  if (last) {

    ctx.fillStyle =
      "#ffffff";


    ctx.font =
      "600 11px system-ui";


    ctx.fillText(
      label,
      last.x + 8,
      last.y - 8
    );

  }


  ctx.restore();

}


/* =========================================================
   24. BAR PATH
========================================================= */

function drawAnalysis3DBarPath(
  ctx
) {

  const path =
    Analysis3DManager.barPath;


  if (
    path.length < 2
  ) {
    return;
  }


  ctx.save();


  ctx.strokeStyle =
    "rgba(255,90,140,.9)";


  ctx.lineWidth =
    4;


  ctx.beginPath();


  path.forEach(
    (point, index) => {

      const p =
        projectAnalysis3DPoint(
          point
        );


      if (!p) {
        return;
      }


      if (
        index === 0
      ) {

        ctx.moveTo(
          p.x,
          p.y
        );

      }

      else {

        ctx.lineTo(
          p.x,
          p.y
        );

      }

    }
  );


  ctx.stroke();


  const latest =
    projectAnalysis3DPoint(
      path[
        path.length - 1
      ]
    );


  if (latest) {

    ctx.fillStyle =
      "#ff5a8c";


    ctx.beginPath();


    ctx.arc(
      latest.x,
      latest.y,
      7,
      0,
      Math.PI * 2
    );


    ctx.fill();


    ctx.fillStyle =
      "#ffffff";


    ctx.font =
      "700 11px system-ui";


    ctx.fillText(
      "BAR PATH",
      latest.x + 10,
      latest.y - 9
    );

  }


  ctx.restore();

}


/* =========================================================
   25. HUD
========================================================= */

function drawAnalysis3DHUD(
  ctx,
  width
) {

  ctx.save();


  ctx.fillStyle =
    "rgba(4,12,20,.78)";


  ctx.fillRect(
    16,
    16,
    Math.min(
      width - 32,
      290
    ),
    72
  );


  ctx.fillStyle =
    "#ffffff";


  ctx.font =
    "700 14px system-ui";


  ctx.fillText(
    "SEOLCHEON 3D MOTION ANALYSIS",
    30,
    40
  );


  ctx.font =
    "500 11px system-ui";


  ctx.fillStyle =
    "rgba(210,235,245,.8)";


  ctx.fillText(
    `VIEW  ${Analysis3DManager.view.toUpperCase()}`,
    30,
    60
  );


  ctx.fillText(
    `ZOOM  ${Analysis3DManager.zoom.toFixed(2)}×`,
    30,
    77
  );


  ctx.restore();

}


/* =========================================================
   26. VIEW
========================================================= */

function setAnalysis3DView(
  view
) {

  Analysis3DManager.view =
    view;


  switch (view) {

    case "front":

      Analysis3DManager.rotationX =
        0;

      Analysis3DManager.rotationY =
        0;

      Analysis3DManager.rotationZ =
        0;

      break;


    case "side":

      Analysis3DManager.rotationX =
        0;

      Analysis3DManager.rotationY =
        Math.PI / 2;

      Analysis3DManager.rotationZ =
        0;

      break;


    case "top":

      Analysis3DManager.rotationX =
        Math.PI / 2;

      Analysis3DManager.rotationY =
        0;

      Analysis3DManager.rotationZ =
        0;

      break;


    case "perspective":

    default:

      Analysis3DManager.rotationX =
        -0.12;

      Analysis3DManager.rotationY =
        0.35;

      Analysis3DManager.rotationZ =
        0;

      break;

  }


  updateAnalysis3DViewButtons();


  renderAnalysis3D();

}


/* =========================================================
   27. VIEW BUTTON
========================================================= */

function updateAnalysis3DViewButtons() {

  document
    .querySelectorAll(
      "[data-3d-view]"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",

          button.dataset[
            "3dView"
          ] ===
          Analysis3DManager.view
        );

      }
    );

}


/* =========================================================
   28. ZOOM
========================================================= */

function setAnalysis3DZoom(
  zoom
) {

  Analysis3DManager.zoom =
    Math.max(
      ANALYSIS_3D_CONFIG.zoomMin,

      Math.min(
        ANALYSIS_3D_CONFIG.zoomMax,
        Number(zoom) || 1
      )
    );


  updateAnalysis3DUI();


  renderAnalysis3D();

}


/* =========================================================
   29. RESET VIEW
========================================================= */

function resetAnalysis3DView() {

  Analysis3DManager.zoom =
    ANALYSIS_3D_CONFIG
      .defaultZoom;


  Analysis3DManager.offsetX =
    0;


  Analysis3DManager.offsetY =
    0;


  setAnalysis3DView(
    "perspective"
  );

}


/* =========================================================
   30. CLEAR PATHS
========================================================= */

function clearAnalysis3DPaths() {

  Analysis3DManager.comPath =
    [];


  Analysis3DManager.jointPaths =
    {};


  Analysis3DManager.barPath =
    [];


  renderAnalysis3D();

}


/* =========================================================
   31. UI
========================================================= */

function updateAnalysis3DUI() {

  setAnalysis3DText(
    "analysis-3d-view",
    Analysis3DManager.view
  );


  setAnalysis3DText(
    "analysis-3d-zoom",
    `${Analysis3DManager.zoom.toFixed(2)}×`
  );


  setAnalysis3DText(
    "analysis-3d-com-frames",
    String(
      Analysis3DManager
        .comPath.length
    )
  );


  const com =
    Analysis3DManager.com;


  if (com) {

    setAnalysis3DText(
      "analysis-3d-com-x",
      com.x.toFixed(3)
    );


    setAnalysis3DText(
      "analysis-3d-com-y",
      com.y.toFixed(3)
    );


    setAnalysis3DText(
      "analysis-3d-com-z",
      com.z.toFixed(3)
    );

  }

}


/* =========================================================
   32. SET TEXT
========================================================= */

function setAnalysis3DText(
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
   33. SNAPSHOT

   리포트에서 사용할 3D 분석 이미지
========================================================= */

function captureAnalysis3DSnapshot() {

  const canvas =
    Analysis3DManager.canvas;


  if (!canvas) {
    return null;
  }


  renderAnalysis3D();


  const image =
    canvas.toDataURL(
      "image/png"
    );


  const snapshot = {

    id:
      "analysis_3d_" +
      Date.now(),

    type:
      "3d-analysis",

    sportId:
      window.SportsAnalysisManager
        ?.sportId ||
      null,

    view:
      Analysis3DManager.view,

    zoom:
      Analysis3DManager.zoom,

    com:
      Analysis3DManager.com
        ? {
            ...Analysis3DManager.com
          }
        : null,

    comPath:
      Analysis3DManager.comPath
        .map(
          point => ({
            ...point
          })
        ),

    barPath:
      Analysis3DManager.barPath
        .map(
          point => ({
            ...point
          })
        ),

    image,

    createdAt:
      new Date()
        .toISOString()

  };


  document.dispatchEvent(
    new CustomEvent(
      "analysis3d:snapshot",
      {
        detail:
          snapshot
      }
    )
  );


  return snapshot;

}


/* =========================================================
   34. GET CURRENT STATE
========================================================= */

function getAnalysis3DState() {

  return {

    enabled:
      Analysis3DManager.enabled,

    view:
      Analysis3DManager.view,

    rotationX:
      Analysis3DManager.rotationX,

    rotationY:
      Analysis3DManager.rotationY,

    rotationZ:
      Analysis3DManager.rotationZ,

    zoom:
      Analysis3DManager.zoom,

    com:
      Analysis3DManager.com,

    comPath:
      [
        ...Analysis3DManager.comPath
      ],

    trackedJoint:
      Analysis3DManager.trackedJoint,

    jointPaths:
      Analysis3DManager.jointPaths,

    barPath:
      [
        ...Analysis3DManager.barPath
      ]

  };

}


/* =========================================================
   35. ENABLE
========================================================= */

function setAnalysis3DEnabled(
  enabled
) {

  Analysis3DManager.enabled =
    Boolean(enabled);


  if (
    Analysis3DManager.enabled
  ) {

    renderAnalysis3D();

  }

}


/* =========================================================
   36. LIMIT ARRAY
========================================================= */

function limitArray(
  array,
  limit
) {

  if (
    !Array.isArray(array)
  ) {
    return;
  }


  if (
    array.length > limit
  ) {

    array.splice(
      0,
      array.length -
      limit
    );

  }

}


/* =========================================================
   37. RESET ALL
========================================================= */

function resetAnalysis3D() {

  Analysis3DManager.landmarks =
    null;


  Analysis3DManager.latestPose =
    null;


  Analysis3DManager.com =
    null;


  Analysis3DManager.comPath =
    [];


  Analysis3DManager.jointPaths =
    {};


  Analysis3DManager.barPath =
    [];


  Analysis3DManager.trackedJoint =
    null;


  resetAnalysis3DView();


  renderAnalysis3D();

}


/* =========================================================
   38. AUTO INIT
========================================================= */

if (
  document.readyState ===
    "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initAnalysis3D
  );

}

else {

  initAnalysis3D();

}


/* =========================================================
   39. GLOBAL
========================================================= */

window.ANALYSIS_3D_CONFIG =
  ANALYSIS_3D_CONFIG;

window.Analysis3DManager =
  Analysis3DManager;

window.initAnalysis3D =
  initAnalysis3D;

window.updateAnalysis3D =
  updateAnalysis3D;

window.calculateCenterOfMass3D =
  calculateCenterOfMass3D;

window.setTracked3DJoint =
  setTracked3DJoint;

window.add3DBarPathPoint =
  add3DBarPathPoint;

window.setAnalysis3DView =
  setAnalysis3DView;

window.setAnalysis3DZoom =
  setAnalysis3DZoom;

window.resetAnalysis3DView =
  resetAnalysis3DView;

window.clearAnalysis3DPaths =
  clearAnalysis3DPaths;

window.captureAnalysis3DSnapshot =
  captureAnalysis3DSnapshot;

window.getAnalysis3DState =
  getAnalysis3DState;

window.setAnalysis3DEnabled =
  setAnalysis3DEnabled;

window.resetAnalysis3D =
  resetAnalysis3D;