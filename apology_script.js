/* apology_script.js */
(function () {
  let dodgeCount = 0;
  const MAX_COUNT = 20;
  const STICKER_INTERVAL = 3; // every 3 attempts show popup

  const stickers = [
    { emoji: "🍪", text: "Cookie! for you" },
    { emoji: "💧", text: "Water break lele!" },
    { emoji: "🍦", text: "Ice cream time!" },
    { emoji: "🍫", text: "Chocolate therapy!" },
    { emoji: "🍩", text: "Donut energy!" },
    { emoji: "🧃", text: "Juice power!" }
  ];

  const messages = [
    "Oof! Missed me! 😂",
    "You almost had me... almost. 😏",
    "Is that your A-game? Asking for a friend. 🤨",
    "Plot twist: I'm actually training. 🏋️",
    "Wiggle warning! The forgive button noticed. 😬",
    "That was cute. Do it again. 😅",
    "You're like a persistent raccoon. I respect it. 🦝",
    "Careful — I'm developing feelings. 😭",
    "Nice! But I'm still in stealth mode. 🥷",
    "This is getting athletic. Stretch, maybe? 🤸",
    "Cookie-level effort detected. 🍪",
    "You're making me LOL (low-key offended). 😂",
    "Sneaky! Also impressive. 🕵️",
    "Do you have a PhD in Clicking? 🎓",
    "Okay, now it's personal. I feel attacked. 😵",
    "A true hero won't stop. I see you. 🦸",
    "You're writing a saga here. Epic. 📜",
    "What a ride — I'll remember this. 🎢",
    "One more! The finale approaches... 🎬",
    "Alright, you win. I surrender. ❤️"
  ];

  // Create popup DOM once and reuse
  function createPopupElements() {
    if (document.getElementById("sticker-popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "sticker-popup-overlay";
    overlay.setAttribute("aria-hidden", "true");

    const modal = document.createElement("div");
    modal.id = "sticker-popup-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-live", "polite");

    const emoji = document.createElement("div");
    emoji.id = "sticker-popup-emoji";

    const title = document.createElement("div");
    title.id = "sticker-popup-title";

    const closeBtn = document.createElement("button");
    closeBtn.id = "sticker-popup-close";
    closeBtn.textContent = "Close";

    modal.appendChild(emoji);
    modal.appendChild(title);
    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // style via JS to avoid requiring CSS edits
    const style = document.createElement("style");
    style.textContent = `
      #sticker-popup-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.35);
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 350ms ease;
      }
      #sticker-popup-overlay.visible {
        opacity: 1;
        pointer-events: auto;
      }
      #sticker-popup-modal {
        background: linear-gradient(180deg,#ffffff,#fffaf0);
        border-radius: 14px;
        padding: 18px 22px;
        min-width: 260px;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 18px 60px rgba(0,0,0,0.2);
        transform: translateY(12px);
        transition: transform 350ms cubic-bezier(.2,.9,.3,1);
      }
      #sticker-popup-overlay.visible #sticker-popup-modal {
        transform: translateY(0);
      }
      #sticker-popup-emoji {
        font-size: 48px;
        margin-bottom: 6px;
      }
      #sticker-popup-title {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 10px;
      }
      #sticker-popup-close {
        background: #222;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
      }
      #sticker-popup-close:focus { outline: 2px solid #ffd2a6; }
    `;
    document.head.appendChild(style);

    // close behaviour
    closeBtn.addEventListener("click", hidePopup);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) hidePopup();
    });
  }

  let popupTimeout = null;
  function showPopup(emojiText, titleText, duration = 2500) {
    createPopupElements();
    const overlay = document.getElementById("sticker-popup-overlay");
    const emoji = document.getElementById("sticker-popup-emoji");
    const title = document.getElementById("sticker-popup-title");

    emoji.textContent = emojiText;
    title.textContent = titleText;

    overlay.classList.add("visible");
    overlay.setAttribute("aria-hidden", "false");

    // clear existing timeout and set new one
    if (popupTimeout) {
      clearTimeout(popupTimeout);
      popupTimeout = null;
    }
    popupTimeout = setTimeout(hidePopup, duration);
  }

  function hidePopup() {
    const overlay = document.getElementById("sticker-popup-overlay");
    if (!overlay) return;
    overlay.classList.remove("visible");
    overlay.setAttribute("aria-hidden", "true");
    if (popupTimeout) {
      clearTimeout(popupTimeout);
      popupTimeout = null;
    }
  }

  function updateCounterUI() {
    const counter = document.getElementById("dodge-counter");
    const message = document.getElementById("dodge-message");
    if (!counter || !message) return;

    counter.textContent = `Attempts: ${dodgeCount} / ${MAX_COUNT}`;
    const idx = Math.min(dodgeCount - 1, messages.length - 1);
    message.textContent = messages[idx] || "Huh?";
    // playful animation
    counter.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.25)" },
      { transform: "scale(1)" }
    ], { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
  }

  function moveRandomEl(elm) {
    elm.style.position = "fixed";

    const top = Math.floor(Math.random() * 80 + 5);
    const left = Math.floor(Math.random() * 80 + 5);

    const rect = elm.getBoundingClientRect();
    const curX = rect.left;
    const curY = rect.top;

    const destX = (left / 100) * window.innerWidth;
    const destY = (top / 100) * window.innerHeight;

    const deltaX = destX - curX;
    const deltaY = destY - curY;

    elm.style.willChange = "transform";
    elm.style.transition = "transform 420ms ease";
    elm.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    const cleanup = () => {
      elm.removeEventListener("transitionend", cleanup);
      elm.style.transition = "";
      elm.style.transform = "";
      elm.style.left = Math.round(destX) + "px";
      elm.style.top = Math.round(destY) + "px";
      elm.style.willChange = "";
    };
    elm.addEventListener("transitionend", cleanup);
  }

  function moveHandlerInternal(e) {
    e.preventDefault();
    e.stopPropagation();

    if (dodgeCount >= MAX_COUNT) return;
    dodgeCount++;
    updateCounterUI();

    // every STICKER_INTERVAL attempts show popup
    if (dodgeCount % STICKER_INTERVAL === 0) {
      const idx = Math.floor((dodgeCount / STICKER_INTERVAL - 1) % stickers.length);
      const s = stickers[idx];
      showPopup(s.emoji, s.text, 2800); // popup for 2.8s
    }

    if (dodgeCount < MAX_COUNT) {
      moveRandomEl(e.currentTarget);
    } else {
      // final state on reaching MAX_COUNT
      const moveRandom = document.querySelector("#move-random");
      const primary = document.querySelector(".primary");
      if (moveRandom) {
        moveRandom.removeEventListener("click", moveHandlerInternal);
        moveRandom.style.opacity = "0.6";
        moveRandom.style.pointerEvents = "none";
      }
      if (primary) {
        primary.textContent = "Okay, I forgive you ❤️";
        primary.classList.add("forgive-glow");
      }
      // celebrate final
      showPopup("🎉", "You made it to 20! Peace restored.", 3200);
    }
  }

  const moveRandom = document.querySelector("#move-random");
  if (moveRandom) {
    moveRandom.addEventListener("click", moveHandlerInternal, { passive: false });
  }

  window.__apology__ = { getCount: () => dodgeCount };
})();
