/* =========================================================
   설천고 SPORTS PERFORMANCE ANALYSIS SYSTEM
   MODULES / AUTH.JS
   VERSION 1.0

   기능
   ---------------------------------------------------------
   - 로그인
   - 로그아웃
   - 로그인 상태 유지
   - 로그인 화면 ↔ 메인 시스템 전환
   - storage.js보다 먼저 로드되어도 작동
========================================================= */

"use strict";


/* =========================================================
   01. AUTH CONFIG
========================================================= */

const AUTH_CONFIG = {

  sessionKey:
    "seolcheon_sports_auth",

  sessionDuration:
    1000 * 60 * 60 * 12,

  rememberDuration:
    1000 * 60 * 60 * 24 * 30

};


/* =========================================================
   02. DEMO ACCOUNT

   현재는 로컬 웹앱 테스트용 계정.
   실제 서버 인증은 추후 별도 구현.
========================================================= */

const AUTH_ACCOUNTS = [

  {
    id: "admin",
    password: "1234",
    name: "설천고 관리자",
    role: "admin"
  }

];


/* =========================================================
   03. STATE
========================================================= */

const AuthManager = {

  initialized:
    false,

  user:
    null

};


/* =========================================================
   04. INITIALIZE
========================================================= */

function initAuth() {

  if (
    AuthManager.initialized
  ) {
    return;
  }


  AuthManager.initialized =
    true;


  bindAuthEvents();


  const session =
    loadAuthSession();


  if (
    session &&
    isAuthSessionValid(session)
  ) {

    AuthManager.user =
      session.user;


    showMainSystem();

  }

  else {

    clearAuthSession();

    showLoginScreen();

  }

}


/* =========================================================
   05. EVENTS
========================================================= */

function bindAuthEvents() {

  document.addEventListener(
    "click",
    event => {

      const loginButton =
        event.target.closest(
          [
            "[data-action='login']",
            "#login-button",
            "#login-btn"
          ].join(",")
        );


      if (loginButton) {

        event.preventDefault();

        login();

        return;

      }


      const logoutButton =
        event.target.closest(
          [
            "[data-action='logout']",
            "#logout-button",
            "#logout-btn"
          ].join(",")
        );


      if (logoutButton) {

        event.preventDefault();

        logout();

      }

    }
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter"
      ) {
        return;
      }


      const loginScreen =
        findLoginScreen();


      if (
        !loginScreen ||
        !isElementVisible(
          loginScreen
        )
      ) {
        return;
      }


      const target =
        event.target;


      if (
        target.matches(
          [
            "#login-id",
            "#user-id",
            "#username",
            "#login-password",
            "#password"
          ].join(",")
        )
      ) {

        event.preventDefault();

        login();

      }

    }
  );

}


/* =========================================================
   06. LOGIN
========================================================= */

function login() {

  const idInput =
    findLoginIdInput();


  const passwordInput =
    findLoginPasswordInput();


  if (
    !idInput ||
    !passwordInput
  ) {

    showLoginMessage(
      "로그인 입력창을 찾을 수 없습니다.",
      "error"
    );

    console.error(
      "[AUTH] 로그인 input ID를 확인하세요."
    );

    return false;

  }


  const id =
    idInput.value
      .trim();


  const password =
    passwordInput.value;


  if (!id) {

    showLoginMessage(
      "사용자 ID를 입력해주세요.",
      "error"
    );

    idInput.focus();

    return false;

  }


  if (!password) {

    showLoginMessage(
      "비밀번호를 입력해주세요.",
      "error"
    );

    passwordInput.focus();

    return false;

  }


  const account =
    AUTH_ACCOUNTS.find(
      user =>
        user.id === id &&
        user.password === password
    );


  if (!account) {

    showLoginMessage(
      "아이디 또는 비밀번호가 올바르지 않습니다.",
      "error"
    );

    passwordInput.value =
      "";

    passwordInput.focus();

    return false;

  }


  const remember =
    findRememberInput()
      ?.checked ||
    false;


  const now =
    Date.now();


  const session = {

    user: {

      id:
        account.id,

      name:
        account.name,

      role:
        account.role

    },

    loginAt:
      now,

    expiresAt:
      now +
      (
        remember
          ? AUTH_CONFIG.rememberDuration
          : AUTH_CONFIG.sessionDuration
      ),

    remember

  };


  saveAuthSession(
    session
  );


  AuthManager.user =
    session.user;


  showLoginMessage(
    ""
  );


  showMainSystem();


  document.dispatchEvent(
    new CustomEvent(
      "auth:login",
      {
        detail: {
          user:
            AuthManager.user
        }
      }
    )
  );


  return true;

}


/* =========================================================
   07. LOGOUT
========================================================= */

function logout() {

  clearAuthSession();


  AuthManager.user =
    null;


  showLoginScreen();


  const passwordInput =
    findLoginPasswordInput();


  if (passwordInput) {

    passwordInput.value =
      "";

  }


  document.dispatchEvent(
    new CustomEvent(
      "auth:logout"
    )
  );

}


/* =========================================================
   08. LOGIN SCREEN
========================================================= */

function findLoginScreen() {

  return (

    document.getElementById(
      "login-screen"
    ) ||

    document.querySelector(
      "[data-login-screen]"
    ) ||

    document.querySelector(
      ".login-screen"
    )

  );

}


/* =========================================================
   09. MAIN SYSTEM
========================================================= */

function findMainSystem() {

  return (

    document.getElementById(
      "app"
    ) ||

    document.getElementById(
      "main-app"
    ) ||

    document.querySelector(
      "[data-main-app]"
    ) ||

    document.querySelector(
      ".app-shell"
    )

  );

}


/* =========================================================
   10. SHOW LOGIN
========================================================= */

function showLoginScreen() {

  const loginScreen =
    findLoginScreen();


  const mainSystem =
    findMainSystem();


  if (loginScreen) {

    loginScreen.hidden =
      false;


    loginScreen.classList.add(
      "active"
    );

  }


  if (mainSystem) {

    mainSystem.hidden =
      true;


    mainSystem.classList.remove(
      "active"
    );

  }


  document.body.classList.add(
    "auth-locked"
  );


  document.body.classList.remove(
    "auth-unlocked"
  );

}


/* =========================================================
   11. SHOW MAIN
========================================================= */

function showMainSystem() {

  const loginScreen =
    findLoginScreen();


  const mainSystem =
    findMainSystem();


  if (loginScreen) {

    loginScreen.hidden =
      true;


    loginScreen.classList.remove(
      "active"
    );

  }


  if (mainSystem) {

    mainSystem.hidden =
      false;


    mainSystem.classList.add(
      "active"
    );

  }


  document.body.classList.remove(
    "auth-locked"
  );


  document.body.classList.add(
    "auth-unlocked"
  );


  updateAuthUserUI();

}


/* =========================================================
   12. LOGIN ID INPUT
========================================================= */

function findLoginIdInput() {

  return (

    document.getElementById(
      "login-id"
    ) ||

    document.getElementById(
      "user-id"
    ) ||

    document.getElementById(
      "username"
    ) ||

    document.querySelector(
      "[data-login-id]"
    )

  );

}


/* =========================================================
   13. PASSWORD INPUT
========================================================= */

function findLoginPasswordInput() {

  return (

    document.getElementById(
      "login-password"
    ) ||

    document.getElementById(
      "password"
    ) ||

    document.querySelector(
      "[data-login-password]"
    )

  );

}


/* =========================================================
   14. REMEMBER INPUT
========================================================= */

function findRememberInput() {

  return (

    document.getElementById(
      "remember-login"
    ) ||

    document.getElementById(
      "remember-me"
    ) ||

    document.querySelector(
      "[data-remember-login]"
    )

  );

}


/* =========================================================
   15. LOGIN MESSAGE
========================================================= */

function showLoginMessage(
  message,
  type = ""
) {

  const element =

    document.getElementById(
      "login-message"
    ) ||

    document.querySelector(
      "[data-login-message]"
    );


  if (!element) {

    if (
      message &&
      type === "error"
    ) {

      console.warn(
        "[AUTH]",
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
   16. SAVE SESSION

   auth.js가 storage.js보다 먼저 로드되므로
   localStorage를 직접 사용한다.
========================================================= */

function saveAuthSession(
  session
) {

  try {

    localStorage.setItem(
      AUTH_CONFIG.sessionKey,
      JSON.stringify(session)
    );


    return true;

  }

  catch (error) {

    console.error(
      "[AUTH] 세션 저장 실패:",
      error
    );


    return false;

  }

}


/* =========================================================
   17. LOAD SESSION
========================================================= */

function loadAuthSession() {

  try {

    const raw =
      localStorage.getItem(
        AUTH_CONFIG.sessionKey
      );


    if (!raw) {

      return null;

    }


    return JSON.parse(
      raw
    );

  }

  catch (error) {

    console.error(
      "[AUTH] 세션 불러오기 실패:",
      error
    );


    return null;

  }

}


/* =========================================================
   18. CLEAR SESSION
========================================================= */

function clearAuthSession() {

  try {

    localStorage.removeItem(
      AUTH_CONFIG.sessionKey
    );

  }

  catch (error) {

    console.error(
      "[AUTH] 세션 삭제 실패:",
      error
    );

  }

}


/* =========================================================
   19. VALID SESSION
========================================================= */

function isAuthSessionValid(
  session
) {

  if (
    !session ||
    !session.user ||
    !session.expiresAt
  ) {

    return false;

  }


  return (
    Date.now() <
    session.expiresAt
  );

}


/* =========================================================
   20. CURRENT USER
========================================================= */

function getCurrentUser() {

  return (
    AuthManager.user ||
    null
  );

}


/* =========================================================
   21. LOGGED IN
========================================================= */

function isLoggedIn() {

  return Boolean(
    getCurrentUser()
  );

}


/* =========================================================
   22. USER UI
========================================================= */

function updateAuthUserUI() {

  const user =
    getCurrentUser();


  if (!user) {
    return;
  }


  document
    .querySelectorAll(
      "[data-auth-user-name]"
    )
    .forEach(
      element => {

        element.textContent =
          user.name;

      }
    );


  document
    .querySelectorAll(
      "[data-auth-user-role]"
    )
    .forEach(
      element => {

        element.textContent =
          user.role === "admin"
            ? "ADMIN"
            : user.role;

      }
    );

}


/* =========================================================
   23. ELEMENT VISIBLE
========================================================= */

function isElementVisible(
  element
) {

  if (!element) {

    return false;

  }


  if (element.hidden) {

    return false;

  }


  const style =
    window.getComputedStyle(
      element
    );


  return (
    style.display !== "none" &&
    style.visibility !== "hidden"
  );

}


/* =========================================================
   24. AUTO INITIALIZE
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initAuth
  );

}

else {

  initAuth();

}


/* =========================================================
   25. GLOBAL ACCESS
========================================================= */

window.AUTH_CONFIG =
  AUTH_CONFIG;

window.AuthManager =
  AuthManager;

window.initAuth =
  initAuth;

window.login =
  login;

window.logout =
  logout;

window.getCurrentUser =
  getCurrentUser;

window.isLoggedIn =
  isLoggedIn;

window.showLoginScreen =
  showLoginScreen;

window.showMainSystem =
  showMainSystem;