(() => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const result = document.getElementById("result");
  const resultMedia = document.getElementById("resultMedia");
  const buttons = document.getElementById("buttons");
  const confirmModal = document.getElementById("confirmModal");
  const confirmText = document.getElementById("confirmText");
  const confirmYesBtn = document.getElementById("confirmYesBtn");
  const confirmNoBtn = document.getElementById("confirmNoBtn");

  const desktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobileTouch = window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const margin = 16;
  const maxNoPresses = 15;
  let noBtnFixed = false;
  let noBtnDisabled = false;
  let lastMove = 0;
  let confirmStep = 1;
  let triedNoBeforeYes = false;
  let noPressCount = 0;

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function positionNoButton() {
    const rect = noBtn.getBoundingClientRect();

    if (!noBtnFixed) {
      const placeholder = document.createElement("div");
      placeholder.className = "no-slot";
      placeholder.style.width = `${rect.width}px`;
      placeholder.style.height = `${rect.height}px`;
      buttons.replaceChild(placeholder, noBtn);
      document.body.appendChild(noBtn);
      noBtn.style.position = "fixed";
      noBtn.style.left = `${rect.left}px`;
      noBtn.style.top = `${rect.top}px`;
      noBtn.style.zIndex = "5";
      noBtnFixed = true;
    }
  }

  function getRandomPosition() {
    const rect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;

    const x = Math.random() * (maxX - margin) + margin;
    const y = Math.random() * (maxY - margin) + margin;

    return {
      x: clamp(x, margin, maxX),
      y: clamp(y, margin, maxY)
    };
  }

  function moveNoButton() {
    if (noBtnDisabled) return;
    noPressCount += 1;
    if (noPressCount > maxNoPresses) {
      noBtn.style.display = "none";
      noBtnDisabled = true;
      return;
    }

    triedNoBeforeYes = true;
    const now = Date.now();
    if (now - lastMove < 80) return;
    lastMove = now;

    const { x, y } = getRandomPosition();

    if (!prefersReducedMotion) {
      noBtn.style.transition = "left 120ms ease, top 120ms ease";
    } else {
      noBtn.style.transition = "none";
    }

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  function keepInView() {
    if (!noBtnFixed) return;
    const rect = noBtn.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - margin;
    const maxY = window.innerHeight - rect.height - margin;
    const newLeft = clamp(rect.left, margin, maxX);
    const newTop = clamp(rect.top, margin, maxY);
    noBtn.style.left = `${newLeft}px`;
    noBtn.style.top = `${newTop}px`;
  }

  function getConfirmMessage() {
    if (confirmStep === 1) return "Esti sigura?";
    return `Esti ${(confirmStep - 1) * 100}% sigura?`;
  }

  function updateConfirmMessage() {
    confirmText.textContent = getConfirmMessage();
  }

  function openConfirmModal() {
    confirmStep = 1;
    updateConfirmMessage();
    confirmModal.hidden = false;
  }

  function closeConfirmModal() {
    confirmModal.hidden = true;
  }

  function onYesClick() {
    if (triedNoBeforeYes) {
      showGifResult();
      return;
    }

    result.hidden = true;
    resultMedia.innerHTML = "";
    openConfirmModal();
  }

  function onConfirmYesClick() {
    confirmStep += 1;
    updateConfirmMessage();
  }

  function onConfirmNoClick() {
    closeConfirmModal();
    confirmStep = 1;
    triedNoBeforeYes = false;
  }

  function showGifResult() {
    result.hidden = false;
    noBtnDisabled = true;
    noBtn.style.display = "none";

    const gifPath = "./love.gif";
    const img = new Image();
    img.alt = "Inimioare care sar";
    img.loading = "lazy";
    img.decoding = "async";

    resultMedia.innerHTML = "";
    resultMedia.appendChild(img);

    img.onerror = () => {
      resultMedia.innerHTML = "";
      const fallback = document.createElement("div");
      fallback.className = "fallback-hearts";
      fallback.setAttribute("aria-hidden", "true");
      fallback.innerHTML = "<span>💕</span><span>💖</span><span>💗</span>";
      resultMedia.appendChild(fallback);
    };

    img.src = gifPath;
  }

  function attachHandlers() {
    if (desktopHover) {
      noBtn.addEventListener("click", (event) => {
        event.preventDefault();
        moveNoButton();
      });
    }

    if (mobileTouch) {
      noBtn.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        moveNoButton();
      });
    }
  }

  window.addEventListener("resize", keepInView);
  yesBtn.addEventListener("click", onYesClick);
  confirmYesBtn.addEventListener("click", onConfirmYesClick);
  confirmNoBtn.addEventListener("click", onConfirmNoClick);

  positionNoButton();
  attachHandlers();
})();
