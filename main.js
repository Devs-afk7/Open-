// ─── DOM REFS ───────────────────────────────────────────
const card            = document.getElementById("card");
const emojiTop        = document.getElementById("emojiTop");
const question        = document.getElementById("question");
const gif             = document.getElementById("gif");
const yesBtn          = document.getElementById("yesBtn");
const noBtn           = document.getElementById("noBtn");
const btnGroup        = document.getElementById("btnGroup");
const petalsContainer = document.getElementById("petals");
const confettiCont    = document.getElementById("confetti");
const flashOverlay    = document.getElementById("flashOverlay");

// ─── SCREENS ────────────────────────────────────────────
// Screen 0 = opening. Screens 1-5 = drama. After 5 NOs = button drama.
const SCREENS = [
  {
    emoji:   "🥺",
    text:    "Suna na",
    gifSrc:  "cute.gif",
    yesText: "Bol naa 💬",
    noText:  "No 🙅",
  },
  {
    emoji:   "😔",
    text:    "Pleasee Pleasee Pleaseee im sorry",
    gifSrc:  "sorry.png",
    yesText: "La la k vo ?",
    noText:  "Naii ma sundai sundina",
  },
  {
    emoji:   "😭",
    text:    "I I did not mean what i said or made seem i swearrr i swearrr",
    gifSrc:  "download.gif",
    yesText: "😑 Lala",
    noText:  "Baal ho TwT",
  },
  {
    emoji:   "🙏",
    text:    "Pleaseee pleaseeeeeeeeeee pleaseeeeeeeeee pleeeasseeeeeeeeee 😭😭",
    gifSrc:  "sadlife.gif",
    yesText: "😑 Ok but not ok",
    noText:  "No means NOO",
  },
  {
    emoji:   "💔",
    text:    "Yaaar pleaaseee. I beg youu 😭 i i cant, you know i did not mean to say/do that right im sorry 😭😭",
    gifSrc:  "run.gif",
    yesText: "......... Lala",
    noText:  "Nope. Nahi. Never.",
  },
  {
    emoji:   "😭😭",
    text:    "Cosmica I I beg youu 😭 pleaseee 😭😭, i might be annoying atp TwT <br> (tell me if i am creeping 😭)",
    gifSrc:  "run.gif",
    yesText: "Hyaaaaaaa lala 😑",
    noText:  "vaad ma jau timi ",
  },
];

// ─── STATE ──────────────────────────────────────────────
const state = {
  noCount:    0,      // 0-5: how many NOs pressed
  dramaMode:  false,  // true after 5 NOs: no-btn escapes
  yesBtnScale: 1.0,
};

// ─── HELPERS ────────────────────────────────────────────
function isMobile() {
  return window.innerWidth <= 480;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ─── PETALS ─────────────────────────────────────────────
function spawnPetals() {
  const emojis = ["🌸","💕","🌷","💗","✨","🍓","💝","🌺","💖"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.classList.add("petal");
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = (0.9 + Math.random() * 1.3) + "rem";
    p.style.animationDuration = (4 + Math.random() * 7) + "s";
    p.style.animationDelay = (Math.random() * 8) + "s";
    petalsContainer.appendChild(p);
  }
}

// ─── CONFETTI ────────────────────────────────────────────
function spawnConfetti() {
  confettiCont.style.display = "block";
  const colors = ["#ff6b9d","#e91e63","#ff4081","#f48fb1","#ffd6e8","#fff176","#ff8a65","#a5d6a7","#ce93d8"];
  for (let i = 0; i < 140; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti-piece");
    piece.style.left   = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    const sz = 6 + Math.random() * 11;
    piece.style.width  = sz + "px";
    piece.style.height = sz + "px";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.animationDuration = (2.2 + Math.random() * 3.2) + "s";
    piece.style.animationDelay   = (Math.random() * 1.8) + "s";
    confettiCont.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

// ─── HEART BURST ─────────────────────────────────────────
function burstHearts(cx, cy) {
  const emojis = ["❤️","💕","💗","💖","💝","🌸","✨","💞"];
  for (let i = 0; i < 38; i++) {
    const h = document.createElement("div");
    h.classList.add("heart-particle");
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (Math.PI * 2 * i) / 38 + (Math.random() - 0.5) * 0.4;
    const dist  = 80 + Math.random() * (isMobile() ? 140 : 280);
    h.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    h.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    h.style.setProperty("--rot", (Math.random() * 360 - 180) + "deg");
    h.style.setProperty("--dur", (0.7 + Math.random() * 0.6) + "s");
    h.style.left = cx + "px";
    h.style.top  = cy + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }
}

// ─── RENDER SCREEN ───────────────────────────────────────
function renderScreen(idx) {
  const s = SCREENS[Math.min(idx, SCREENS.length - 1)];

  // fade out
  question.style.opacity = "0";
  gif.style.opacity = "0";

  setTimeout(() => {
    emojiTop.textContent = s.emoji;
    question.textContent = s.text;
    gif.src = s.gifSrc;
    yesBtn.textContent = s.yesText;
    noBtn.textContent  = s.noText;

    question.style.opacity = "1";
    gif.style.opacity = "1";
    question.classList.add("fade-in");
    setTimeout(() => question.classList.remove("fade-in"), 450);

    // grow yes button
    state.yesBtnScale = Math.min(state.yesBtnScale + 0.14, 1.85);
    yesBtn.style.fontSize = (1.0 * state.yesBtnScale) + "rem";
    yesBtn.style.padding  = `${13 * state.yesBtnScale}px ${30 * state.yesBtnScale}px`;
    yesBtn.classList.add("pulse-yes");
    setTimeout(() => yesBtn.classList.remove("pulse-yes"), 600);
  }, 300);
}

// ─── UPDATE SHAKE LEVEL ──────────────────────────────────
function setShake(level) {
  card.dataset.shake = level;
}

// ─── ONE-HIT SHAKE ───────────────────────────────────────
function triggerShakeHit() {
  // remove continuous shake temporarily
  const prev = card.dataset.shake;
  card.dataset.shake = "0";
  card.classList.add("shake-hit");
  setTimeout(() => {
    card.classList.remove("shake-hit");
    card.dataset.shake = prev;
  }, 450);
}

// ─── NO-BUTTON DRAMA MODE ────────────────────────────────
const JUMP_MARGIN = { mobile: 18, desktop: 36 };

function getJumpBounds() {
  const m    = isMobile() ? JUMP_MARGIN.mobile : JUMP_MARGIN.desktop;
  const btnW = noBtn.offsetWidth  || (isMobile() ? 110 : 145);
  const btnH = noBtn.offsetHeight || (isMobile() ? 44  : 52);
  return {
    minX: m,
    maxX: window.innerWidth  - btnW - m,
    minY: m,
    maxY: window.innerHeight - btnH - m,
  };
}

function jumpNoBtn() {
  const { minX, maxX, minY, maxY } = getJumpBounds();
  noBtn.style.left = clamp(Math.random() * maxX, minX, maxX) + "px";
  noBtn.style.top  = clamp(Math.random() * maxY, minY, maxY) + "px";
}

function enterDramaMode() {
  state.dramaMode = true;
  noBtn.classList.add("drama");

  // initial placement near natural position, then start escaping
  const rect = noBtn.getBoundingClientRect();
  noBtn.style.left = rect.left + "px";
  noBtn.style.top  = rect.top  + "px";

  // jump immediately
  setTimeout(jumpNoBtn, 60);
}

// ─── APOLOGY SCREEN ──────────────────────────────────────
function showApologyScreen() {
  // Stop shaking
  setShake(0);
  state.dramaMode = false;

  // Remove drama mode from no btn
  noBtn.classList.remove("drama");
  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top  = "";

  // Fade out current content
  question.style.opacity = "0";
  gif.style.opacity = "0";
  noBtn.style.display = "none";
  yesBtn.style.display = "none";
  // reset yes btn size for apology
  yesBtn.style.fontSize = "";
  yesBtn.style.padding  = "";

  setTimeout(() => {
    emojiTop.textContent = "😭";
    question.innerHTML   = `😭 I'm genuinely sorry Cosmicaa 😭<br>dont risaying naa Please 😭`;
    gif.src              = "sorry.png";

    question.style.opacity = "1";
    gif.style.opacity      = "1";
    question.classList.add("fade-in");

    // remove old okay btn if any
    const old = document.getElementById("okayBtn");
    if (old) old.remove();

    const okayBtn = document.createElement("button");
    okayBtn.id        = "okayBtn";
    okayBtn.className = "okay-btn fade-in";
    okayBtn.textContent = "okay 😭";
    btnGroup.appendChild(okayBtn);

    okayBtn.addEventListener("click", showFinale);
  }, 320);
}

// ─── FINALE ──────────────────────────────────────────────
function showFinale() {
  const okayBtn = document.getElementById("okayBtn");
  if (okayBtn) okayBtn.style.pointerEvents = "none";

  // 1. Flash
  flashOverlay.classList.add("flash-on");
  setTimeout(() => flashOverlay.classList.remove("flash-on"), 550);

  // 2. Heart burst from card center
  const cardRect = card.getBoundingClientRect();
  const cx = cardRect.left + cardRect.width  / 2;
  const cy = cardRect.top  + cardRect.height / 2;

  setTimeout(() => burstHearts(cx, cy), 280);
  setTimeout(() => burstHearts(cx, cy), 650); // second burst

  // 3. Confetti
  setTimeout(() => { spawnConfetti(); spawnConfetti(); }, 400);
  document.body.classList.add("celebrate");

  // 4. Swap content
  setTimeout(() => {
    question.style.opacity = "0";
    gif.style.opacity      = "0";
    if (okayBtn) okayBtn.style.opacity = "0";
  }, 750);

  setTimeout(() => {
    emojiTop.textContent = "🎉";

    question.innerHTML   = `Yayyy!! 🎉🎉`;
    question.style.opacity = "1";
    question.style.fontSize = isMobile() ? "2rem" : "2.6rem";
    question.classList.add("fade-in");

    gif.src = "love.gif";
    gif.style.opacity = "1";
    gif.classList.add("fade-in");

    if (okayBtn) okayBtn.remove();

    // sweet message
    const msg = document.createElement("p");
    msg.className  = "finale-msg";
    msg.textContent = "U are the bestt 😭 im sorry i wont mess up again";
    btnGroup.innerHTML = "";
    btnGroup.appendChild(msg);

    emojiTop.style.animation = "heartbeat 0.75s ease-in-out infinite";
  }, 1050);
}

// ─── YES HANDLER ─────────────────────────────────────────
yesBtn.addEventListener("click", () => {
  showApologyScreen();
});

// ─── NO HANDLER ──────────────────────────────────────────
noBtn.addEventListener("click", () => {
  if (state.dramaMode) {
    // in drama mode, clicks are hard to land but if she does — jump again
    jumpNoBtn();
    return;
  }

  state.noCount++;
  triggerShakeHit();

  const shakeLevel = Math.min(state.noCount, 5);
  setTimeout(() => setShake(shakeLevel), 460);

  if (state.noCount >= 5) {
    // render the chaos screen, THEN enter drama mode
    renderScreen(5);
    setTimeout(() => {
      enterDramaMode();
    }, 380);
  } else {
    renderScreen(state.noCount);
  }
});

// ─── NO BUTTON ESCAPE (always active) ────────────────────
noBtn.addEventListener("mouseover", () => {
  if (state.dramaMode) jumpNoBtn();
});

noBtn.addEventListener("touchstart", (e) => {
  if (state.dramaMode) {
    e.preventDefault();
    jumpNoBtn();
  }
}, { passive: false });

// ─── RESIZE GUARD ────────────────────────────────────────
window.addEventListener("resize", () => {
  if (state.dramaMode) jumpNoBtn();
});

// ─── INIT ────────────────────────────────────────────────
spawnPetals();
