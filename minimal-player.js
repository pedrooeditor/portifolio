(() => {
  const TEST_DRIVE_PREVIEW = "https://drive.google.com/file/d/148SFeFxIAvX_X8O5AFnuVjlRBqtF28JW/preview";
  const TEST_DIRECT_VIDEO = "https://drive.google.com/uc?export=download&id=1jGtOIgtZbFVyRevIs90CDwDamBemVHBj";

  const style = document.createElement("style");
  style.textContent = `
    body.ph-hub-open { overflow: hidden; }

    .ph-video-hub {
      width: min(560px, calc(100vw - 28px));
      max-width: none;
      max-height: none;
      padding: 0;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 18px;
      background: #080908;
      color: #f6f7f4;
      overflow: hidden;
      box-shadow: 0 30px 90px rgba(0,0,0,.72);
    }

    .ph-video-hub::backdrop {
      background: rgba(2,3,2,.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .ph-video-shell {
      display: grid;
      grid-template-rows: auto 1fr;
      min-height: 0;
      background: #080908;
    }

    .ph-video-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 64px;
      padding: 12px 14px 12px 16px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      background: rgba(8,9,8,.96);
    }

    .ph-video-title {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 10px;
    }

    .ph-video-brand-dot {
      width: 8px;
      height: 8px;
      flex: 0 0 auto;
      border-radius: 999px;
      background: var(--accent, #b9ff3f);
      box-shadow: 0 0 20px rgba(185,255,63,.35);
    }

    .ph-video-title-copy {
      min-width: 0;
    }

    .ph-video-title-copy small,
    .ph-video-title-copy strong {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ph-video-title-copy small {
      margin-bottom: 2px;
      color: rgba(246,247,244,.45);
      font: 500 10px/1.2 var(--body, sans-serif);
      letter-spacing: .14em;
      text-transform: uppercase;
    }

    .ph-video-title-copy strong {
      font: 600 13px/1.25 var(--display, sans-serif);
      letter-spacing: .03em;
      text-transform: uppercase;
    }

    .ph-video-close,
    .ph-video-control,
    .ph-video-center-play {
      appearance: none;
      -webkit-appearance: none;
      border: 0;
      color: #f6f7f4;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .ph-video-close {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      flex: 0 0 auto;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 999px;
      background: rgba(255,255,255,.045);
      font-size: 22px;
      line-height: 1;
    }

    .ph-video-close:hover,
    .ph-video-close:focus-visible,
    .ph-video-control:hover,
    .ph-video-control:focus-visible {
      border-color: rgba(185,255,63,.45);
      outline: none;
    }

    .ph-video-stage-wrap {
      display: grid;
      place-items: center;
      min-height: 0;
      padding: 12px;
      background:
        radial-gradient(circle at 50% 15%, rgba(185,255,63,.05), transparent 34%),
        #030403;
    }

    .ph-video-stage {
      position: relative;
      width: min(100%, calc((100dvh - 116px) * 9 / 16));
      max-height: calc(100dvh - 116px);
      aspect-ratio: 9 / 16;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 14px;
      background: #000;
      box-shadow: 0 20px 55px rgba(0,0,0,.4);
    }

    .ph-video-stage video {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }

    .ph-video-stage::after {
      content: "";
      position: absolute;
      z-index: 2;
      inset: auto 0 0;
      height: 34%;
      pointer-events: none;
      background: linear-gradient(180deg, transparent, rgba(0,0,0,.74));
    }

    .ph-video-center-play {
      position: absolute;
      z-index: 5;
      left: 50%;
      top: 50%;
      display: grid;
      place-items: center;
      width: 62px;
      height: 62px;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 999px;
      background: rgba(8,9,8,.72);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      font-size: 20px;
      transition: opacity 160ms ease, transform 160ms ease;
    }

    .ph-video-center-play[hidden] { display: none; }

    .ph-video-controls {
      position: absolute;
      z-index: 6;
      left: 12px;
      right: 12px;
      bottom: 12px;
      display: grid;
      gap: 9px;
      padding: 10px 11px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 14px;
      background: rgba(8,9,8,.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: opacity 180ms ease, transform 180ms ease;
    }

    .ph-video-controls.is-idle {
      opacity: .18;
      transform: translateY(4px);
    }

    .ph-video-progress {
      width: 100%;
      height: 3px;
      margin: 0;
      appearance: none;
      -webkit-appearance: none;
      border: 0;
      border-radius: 999px;
      background: linear-gradient(
        to right,
        var(--accent, #b9ff3f) 0%,
        var(--accent, #b9ff3f) var(--progress, 0%),
        rgba(255,255,255,.20) var(--progress, 0%),
        rgba(255,255,255,.20) 100%
      );
      cursor: pointer;
    }

    .ph-video-progress::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border: 0;
      border-radius: 999px;
      background: #f6f7f4;
      box-shadow: 0 0 0 3px rgba(0,0,0,.18);
    }

    .ph-video-progress::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border: 0;
      border-radius: 999px;
      background: #f6f7f4;
    }

    .ph-video-control-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: 8px;
    }

    .ph-video-control {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border: 1px solid transparent;
      border-radius: 9px;
      background: transparent;
      font: 600 14px/1 sans-serif;
    }

    .ph-video-time {
      min-width: 0;
      color: rgba(246,247,244,.70);
      font: 500 11px/1 var(--body, sans-serif);
      font-variant-numeric: tabular-nums;
    }

    .ph-video-status {
      position: absolute;
      z-index: 7;
      left: 18px;
      right: 18px;
      top: 50%;
      display: none;
      transform: translateY(-50%);
      padding: 14px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 12px;
      background: rgba(8,9,8,.90);
      color: rgba(246,247,244,.78);
      text-align: center;
      font: 500 12px/1.5 var(--body, sans-serif);
    }

    .ph-video-status.is-visible { display: block; }

    .ph-video-hub.is-expanded {
      width: 100vw;
      height: 100dvh;
      border: 0;
      border-radius: 0;
    }

    .ph-video-hub.is-expanded .ph-video-shell {
      height: 100dvh;
    }

    .ph-video-hub.is-expanded .ph-video-stage-wrap {
      padding: 8px max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
    }

    .ph-video-hub.is-expanded .ph-video-stage {
      width: min(100%, calc((100dvh - 80px) * 9 / 16));
      max-height: calc(100dvh - 80px);
      border-radius: 10px;
    }

    @media (max-width: 760px) {
      .ph-video-hub {
        width: 100vw;
        height: 100dvh;
        border: 0;
        border-radius: 0;
      }

      .ph-video-shell { height: 100dvh; }

      .ph-video-topbar {
        min-height: calc(60px + env(safe-area-inset-top));
        padding-top: calc(10px + env(safe-area-inset-top));
      }

      .ph-video-stage-wrap {
        padding: 8px max(8px, env(safe-area-inset-right)) max(8px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
      }

      .ph-video-stage {
        width: min(100%, calc((100dvh - 92px - env(safe-area-inset-top)) * 9 / 16));
        max-height: calc(100dvh - 92px - env(safe-area-inset-top));
        border-radius: 10px;
      }

      .ph-video-controls {
        left: 9px;
        right: 9px;
        bottom: 9px;
        padding: 9px 10px;
      }
    }

    @media (orientation: landscape) and (max-height: 560px) {
      .ph-video-hub,
      .ph-video-shell { height: 100dvh; }

      .ph-video-topbar { min-height: 52px; padding-block: 7px; }

      .ph-video-stage {
        width: min(100%, calc((100dvh - 64px) * 9 / 16));
        max-height: calc(100dvh - 64px);
      }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("dialog");
  modal.className = "ph-video-hub";
  modal.setAttribute("aria-label", "Player do portfólio");
  modal.innerHTML = `
    <div class="ph-video-shell">
      <header class="ph-video-topbar">
        <div class="ph-video-title">
          <span class="ph-video-brand-dot" aria-hidden="true"></span>
          <div class="ph-video-title-copy">
            <small>Direct Response</small>
            <strong>Exemplo 1</strong>
          </div>
        </div>
        <button class="ph-video-close" type="button" aria-label="Fechar vídeo">×</button>
      </header>
      <div class="ph-video-stage-wrap">
        <div class="ph-video-stage">
          <video playsinline webkit-playsinline preload="metadata" disablepictureinpicture controlslist="nodownload noremoteplayback"></video>
          <button class="ph-video-center-play" type="button" aria-label="Reproduzir vídeo" hidden>▶</button>
          <div class="ph-video-status" role="status"></div>
          <div class="ph-video-controls">
            <input class="ph-video-progress" type="range" min="0" max="1000" value="0" aria-label="Progresso do vídeo" />
            <div class="ph-video-control-row">
              <button class="ph-video-control ph-video-play" type="button" aria-label="Pausar vídeo">Ⅱ</button>
              <span class="ph-video-time">0:00 / 0:00</span>
              <button class="ph-video-control ph-video-mute" type="button" aria-label="Silenciar vídeo">◖))</button>
              <button class="ph-video-control ph-video-expand" type="button" aria-label="Expandir player">⛶</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const video = modal.querySelector("video");
  const closeButton = modal.querySelector(".ph-video-close");
  const playButton = modal.querySelector(".ph-video-play");
  const centerPlay = modal.querySelector(".ph-video-center-play");
  const muteButton = modal.querySelector(".ph-video-mute");
  const expandButton = modal.querySelector(".ph-video-expand");
  const progress = modal.querySelector(".ph-video-progress");
  const time = modal.querySelector(".ph-video-time");
  const controls = modal.querySelector(".ph-video-controls");
  const status = modal.querySelector(".ph-video-status");
  const stage = modal.querySelector(".ph-video-stage");

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const total = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(total / 60);
    const secs = String(total % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const syncPlayUI = () => {
    const paused = video.paused;
    playButton.textContent = paused ? "▶" : "Ⅱ";
    playButton.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
    centerPlay.hidden = !paused;
  };

  const syncTimeUI = () => {
    const duration = video.duration || 0;
    const current = video.currentTime || 0;
    time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    const ratio = duration > 0 ? current / duration : 0;
    progress.value = String(Math.round(ratio * 1000));
    progress.style.setProperty("--progress", `${ratio * 100}%`);
  };

  const togglePlayback = () => {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const openMinimalPlayer = () => {
    status.classList.remove("is-visible");
    status.textContent = "";
    modal.classList.remove("is-expanded");
    video.src = TEST_DIRECT_VIDEO;
    video.currentTime = 0;
    video.muted = false;
    document.body.classList.add("ph-hub-open");
    modal.showModal();

    const attempt = video.play();
    if (attempt?.catch) {
      attempt.catch(() => {
        centerPlay.hidden = false;
        syncPlayUI();
      });
    }
  };

  const closeMinimalPlayer = () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    modal.classList.remove("is-expanded");
    if (modal.open) modal.close();
    document.body.classList.remove("ph-hub-open");
    syncPlayUI();
    syncTimeUI();
  };

  document.addEventListener("click", (event) => {
    const target = event.target.closest(`[data-video="${TEST_DRIVE_PREVIEW}"]`);
    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openMinimalPlayer();
  }, true);

  closeButton.addEventListener("click", closeMinimalPlayer);
  playButton.addEventListener("click", togglePlayback);
  centerPlay.addEventListener("click", togglePlayback);
  video.addEventListener("click", togglePlayback);

  muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    muteButton.textContent = video.muted ? "×))" : "◖))";
    muteButton.setAttribute("aria-label", video.muted ? "Ativar som" : "Silenciar vídeo");
  });

  expandButton.addEventListener("click", () => {
    modal.classList.toggle("is-expanded");
    const expanded = modal.classList.contains("is-expanded");
    expandButton.textContent = expanded ? "⌟" : "⛶";
    expandButton.setAttribute("aria-label", expanded ? "Reduzir player" : "Expandir player");
  });

  progress.addEventListener("input", () => {
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = (Number(progress.value) / 1000) * video.duration;
    syncTimeUI();
  });

  video.addEventListener("play", syncPlayUI);
  video.addEventListener("pause", syncPlayUI);
  video.addEventListener("loadedmetadata", syncTimeUI);
  video.addEventListener("durationchange", syncTimeUI);
  video.addEventListener("timeupdate", syncTimeUI);
  video.addEventListener("ended", syncPlayUI);

  video.addEventListener("error", () => {
    centerPlay.hidden = true;
    status.textContent = "O vídeo direto não carregou neste navegador. Atualize a página e tente novamente.";
    status.classList.add("is-visible");
  });

  let idleTimer;
  const wakeControls = () => {
    controls.classList.remove("is-idle");
    clearTimeout(idleTimer);
    if (!video.paused) {
      idleTimer = setTimeout(() => controls.classList.add("is-idle"), 2200);
    }
  };

  stage.addEventListener("pointermove", wakeControls);
  stage.addEventListener("pointerdown", wakeControls);
  video.addEventListener("play", wakeControls);
  video.addEventListener("pause", wakeControls);

  modal.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMinimalPlayer();
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeMinimalPlayer();
  });
})();
