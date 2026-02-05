(() => {
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const result = document.getElementById("result");
  const resultMedia = document.getElementById("resultMedia");
  const buttons = document.getElementById("buttons");

  const desktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const mobileTouch = window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const margin = 16;
  let noBtnFixed = false;
  let noBtnDisabled = false;
  let lastMove = 0;

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

  function onYesClick() {
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
      noBtn.addEventListener("pointerenter", moveNoButton);
      noBtn.addEventListener("pointermove", moveNoButton);
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

  positionNoButton();
  attachHandlers();
})();
