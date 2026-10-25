/**
 * Fit MHENTOR, play impact entrance once, then run the living cycle.
 */
(function () {
  const headline = document.querySelector(".headline");
  const stage = document.querySelector(".stage");
  const jelly = document.querySelector(".jellyfish-wrap");
  if (!headline || !stage) return;

  const SIDE_GAP = 0.025;
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let raf = 0;
  let entered = false;

  function fit() {
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    if (stageW < 80 || stageH < 80) return;

    const availableW = stageW * (1 - SIDE_GAP * 2);

    headline.style.width = "max-content";
    headline.style.maxWidth = "none";

    let lo = 32;
    let hi = Math.min(availableW * 0.5, stageH * 0.5);

    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      headline.style.fontSize = mid + "px";
      if (headline.scrollWidth <= availableW) lo = mid;
      else hi = mid;
    }

    headline.style.fontSize = lo + "px";
    document.documentElement.style.setProperty("--word-size", lo + "px");

    if (jelly) {
      const letterH = Math.max(headline.getBoundingClientRect().height, 1);
      const jellyW = Math.min(stageW * 0.46, Math.max(200, letterH * 1.4), 540);
      jelly.style.width = jellyW + "px";
    }
  }

  function playEntrance() {
    if (entered) return;
    entered = true;

    if (REDUCE) {
      headline.classList.add("is-ready", "is-settled");
      stage.classList.remove("is-cycling");
      return;
    }

    void headline.offsetWidth;
    headline.classList.add("is-entering");

    // 0.58s rise + 6×0.065s stagger ≈ 0.97s — start living loop after snap
    window.setTimeout(function () {
      headline.classList.remove("is-entering");
      headline.classList.add("is-settled", "is-cycling");
      stage.classList.add("is-cycling");
    }, 1050);
  }

  function schedule() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fit);
  }

  function start() {
    fit();
    playEntrance();
  }

  schedule();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready
      .then(function () {
        fit();
        playEntrance();
      })
      .catch(start);
  } else {
    start();
  }

  window.setTimeout(function () {
    fit();
    playEntrance();
  }, 400);

  window.addEventListener(
    "load",
    function () {
      fit();
      playEntrance();
    },
    { passive: true }
  );

  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("orientationchange", schedule, { passive: true });
})();
