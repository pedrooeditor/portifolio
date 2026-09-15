const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const scrollProgress = document.querySelector('.scroll-progress span');
const iframeDialog = document.querySelector('[data-dialog]');
const iframePlayer = document.querySelector('[data-video-frame]');
const iframeTitle = document.querySelector('[data-dialog-title]');
const iframeClose = document.querySelector('[data-dialog-close]');

const closeMenu = (restoreFocus = false) => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
    if (!isOpen) requestAnimationFrame(() => navigation.querySelector('a')?.focus());
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
  });

  window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (scrollProgress) scrollProgress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
  header?.classList.toggle('is-scrolled', window.scrollY > 18);
};
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const runtimeStyles = document.createElement('style');
runtimeStyles.textContent = `
  .portfolio-watermark { display: none !important; }

  @media (max-width: 760px) {
    .video-dialog[open] {
      position: fixed;
      inset: 0;
      display: grid;
      grid-template-rows: auto 1fr;
      width: 100vw !important;
      height: 100dvh !important;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: 0;
      background: #030403;
      overflow: hidden;
    }

    .video-dialog .dialog-bar {
      min-height: calc(58px + env(safe-area-inset-top, 0px));
      padding-top: env(safe-area-inset-top, 0px);
      padding-inline: max(12px, env(safe-area-inset-left, 0px));
      background: #0a0b0a;
    }

    .video-dialog .video-frame {
      place-self: center;
      position: relative;
      width: min(100vw, calc((100dvh - 72px - env(safe-area-inset-top, 0px)) * 16 / 9));
      max-height: calc(100dvh - 72px - env(safe-area-inset-top, 0px));
      aspect-ratio: 16 / 9;
      background: #000;
      overflow: hidden;
    }

    .video-dialog.is-vertical .video-frame {
      width: min(100vw, calc((100dvh - 72px - env(safe-area-inset-top, 0px)) * 9 / 16));
      aspect-ratio: 9 / 16;
    }

    .video-dialog .video-frame iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
      background: #000;
    }
  }

  .project-gallery-dialog {
    width: min(920px, calc(100vw - 32px));
    max-height: min(760px, calc(100vh - 32px));
    margin: auto;
    padding: 0;
    border: 1px solid rgba(255,255,255,.12);
    background: #0b0d0b;
    color: var(--ink);
    box-shadow: 0 32px 100px rgba(0,0,0,.65);
  }

  .project-gallery-dialog::backdrop {
    background: rgba(0,0,0,.82);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .project-gallery-panel {
    padding: clamp(22px, 4vw, 40px);
    background: radial-gradient(circle at 12% 0%, rgba(185,255,63,.12), transparent 34%), #0b0d0b;
  }

  .project-gallery-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }

  .project-gallery-kicker {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: .68rem;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .project-gallery-topbar h2 {
    margin: 0;
    font-family: var(--display);
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -.05em;
    text-transform: uppercase;
  }

  .project-gallery-close {
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.04);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
  }

  .project-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .project-gallery-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    min-height: 150px;
    padding: 18px;
    border: 1px solid rgba(255,255,255,.10);
    background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.015)), #111411;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .project-gallery-item:hover,
  .project-gallery-item:focus-visible {
    transform: translateY(-3px);
    border-color: rgba(185,255,63,.5);
    background: linear-gradient(180deg, rgba(185,255,63,.12), rgba(255,255,255,.02)), #111411;
    outline: none;
  }

  .project-gallery-number {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(185,255,63,.35);
    color: var(--accent);
    font-family: var(--display);
    font-size: .9rem;
  }

  .project-gallery-copy { display: grid; gap: 5px; }
  .project-gallery-copy small { color: var(--muted); font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; }
  .project-gallery-copy strong { font-family: var(--display); font-size: clamp(1.1rem,2vw,1.45rem); font-weight: 600; letter-spacing: -.04em; text-transform: uppercase; }

  .project-gallery-play {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    background: var(--accent);
    color: #080908;
    font-size: .78rem;
  }

  @media (max-width: 760px) {
    .project-gallery-grid { grid-template-columns: 1fr; }
    .project-gallery-item { min-height: 110px; }
  }

  @media (max-width: 520px) {
    .project-gallery-dialog { width: calc(100vw - 20px); max-height: calc(100vh - 20px); }
    .project-gallery-panel { padding: 18px; }
    .project-gallery-topbar { gap: 12px; }
    .project-gallery-close { min-width: 84px; }
    .project-gallery-item { padding: 15px; }
  }

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
    background: rgba(2,3,2,.90);
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

  .ph-video-title { display: flex; align-items: center; min-width: 0; gap: 10px; }
  .ph-video-brand-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 999px; background: var(--accent,#b9ff3f); box-shadow: 0 0 20px rgba(185,255,63,.35); }
  .ph-video-title-copy { min-width: 0; }
  .ph-video-title-copy small,.ph-video-title-copy strong { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ph-video-title-copy small { margin-bottom: 2px; color: rgba(246,247,244,.45); font: 500 10px/1.2 var(--body,sans-serif); letter-spacing: .14em; text-transform: uppercase; }
  .ph-video-title-copy strong { font: 600 13px/1.25 var(--display,sans-serif); letter-spacing: .03em; text-transform: uppercase; }

  .ph-video-close,.ph-video-control,.ph-video-center-play {
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

  .ph-video-close:hover,.ph-video-close:focus-visible,.ph-video-control:hover,.ph-video-control:focus-visible { border-color: rgba(185,255,63,.45); outline: none; }

  .ph-video-stage-wrap {
    display: grid;
    place-items: center;
    min-height: 0;
    padding: 12px;
    background: radial-gradient(circle at 50% 15%, rgba(185,255,63,.05), transparent 34%), #030403;
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
    content: '';
    position: absolute;
    z-index: 2;
    inset: auto 0 0;
    height: 32%;
    pointer-events: none;
    background: linear-gradient(180deg, transparent, rgba(0,0,0,.70));
  }

  .ph-video-center-play {
    position: absolute;
    z-index: 5;
    left: 50%;
    top: 50%;
    display: grid;
    place-items: center;
    width: 58px;
    height: 58px;
    transform: translate(-50%,-50%);
    border: 1px solid rgba(255,255,255,.18);
    border-radius: 999px;
    background: rgba(8,9,8,.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 19px;
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

  .ph-video-controls.is-idle { opacity: .22; transform: translateY(4px); }

  .ph-video-progress {
    width: 100%;
    height: 3px;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(to right, var(--accent,#b9ff3f) 0%, var(--accent,#b9ff3f) var(--progress,0%), rgba(255,255,255,.20) var(--progress,0%), rgba(255,255,255,.20) 100%);
    cursor: pointer;
  }

  .ph-video-progress::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 12px; height: 12px; border: 0; border-radius: 999px; background: #f6f7f4; box-shadow: 0 0 0 3px rgba(0,0,0,.18); }
  .ph-video-progress::-moz-range-thumb { width: 12px; height: 12px; border: 0; border-radius: 999px; background: #f6f7f4; }

  .ph-video-control-row { display: grid; grid-template-columns: auto 1fr auto auto; align-items: center; gap: 8px; }

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

  .ph-video-time { min-width: 0; color: rgba(246,247,244,.70); font: 500 11px/1 var(--body,sans-serif); font-variant-numeric: tabular-nums; }

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
    background: rgba(8,9,8,.92);
    color: rgba(246,247,244,.78);
    text-align: center;
    font: 500 12px/1.5 var(--body,sans-serif);
  }
  .ph-video-status.is-visible { display: block; }

  .ph-video-hub.is-expanded {
    width: 100vw;
    height: 100dvh;
    border: 0;
    border-radius: 0;
  }

  .ph-video-hub.is-expanded .ph-video-shell { height: 100dvh; grid-template-rows: 1fr; }
  .ph-video-hub.is-expanded .ph-video-topbar { display: none; }
  .ph-video-hub.is-expanded .ph-video-stage-wrap { padding: 0; }
  .ph-video-hub.is-expanded .ph-video-stage { width: min(100vw, calc(100dvh * 9 / 16)); max-height: 100dvh; border: 0; border-radius: 0; }

  @media (max-width: 760px) {
    .ph-video-hub { width: 100vw; height: 100dvh; border: 0; border-radius: 0; }
    .ph-video-shell { height: 100dvh; }
    .ph-video-topbar { min-height: calc(60px + env(safe-area-inset-top)); padding-top: calc(10px + env(safe-area-inset-top)); }
    .ph-video-stage-wrap { padding: 8px max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left)); }
    .ph-video-stage { width: min(100%, calc((100dvh - 92px - env(safe-area-inset-top)) * 9 / 16)); max-height: calc(100dvh - 92px - env(safe-area-inset-top)); border-radius: 10px; }
    .ph-video-controls { left: 9px; right: 9px; bottom: 9px; padding: 9px 10px; }
    .ph-video-hub.is-expanded .ph-video-stage { width: min(100vw, calc(100dvh * 9 / 16)); max-height: 100dvh; }
  }
`;
document.head.appendChild(runtimeStyles);

const withAutoplay = (url) => `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;

const openIframeVideo = (button) => {
  if (!iframeDialog || !iframePlayer || !button.dataset.video) return;
  iframePlayer.src = withAutoplay(button.dataset.video);
  if (iframeTitle) iframeTitle.textContent = button.dataset.videoTitle || 'Projeto';
  iframeDialog.classList.toggle('is-vertical', button.dataset.videoFormat === 'vertical');
  document.body.classList.add('video-open');
  iframeDialog.showModal();
};

const closeIframeVideo = () => {
  if (!iframeDialog || !iframePlayer) return;
  if (iframeDialog.open) iframeDialog.close();
  iframePlayer.src = '';
  iframeDialog.classList.remove('is-vertical');
  document.body.classList.remove('video-open');
};

iframeClose?.addEventListener('click', closeIframeVideo);
iframeDialog?.addEventListener('click', (event) => { if (event.target === iframeDialog) closeIframeVideo(); });
iframeDialog?.addEventListener('cancel', (event) => { event.preventDefault(); closeIframeVideo(); });
iframeDialog?.addEventListener('contextmenu', (event) => event.preventDefault());
iframeDialog?.addEventListener('dragstart', (event) => event.preventDefault());

const directHub = document.createElement('dialog');
directHub.className = 'ph-video-hub';
directHub.setAttribute('aria-label', 'Player do portfólio');
directHub.innerHTML = `
  <div class="ph-video-shell">
    <header class="ph-video-topbar">
      <div class="ph-video-title">
        <span class="ph-video-brand-dot" aria-hidden="true"></span>
        <div class="ph-video-title-copy"><small>Projeto</small><strong>Vídeo</strong></div>
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
document.body.appendChild(directHub);

const directVideo = directHub.querySelector('video');
const directStage = directHub.querySelector('.ph-video-stage');
const directControls = directHub.querySelector('.ph-video-controls');
const directProgress = directHub.querySelector('.ph-video-progress');
const directTime = directHub.querySelector('.ph-video-time');
const directPlay = directHub.querySelector('.ph-video-play');
const directCenterPlay = directHub.querySelector('.ph-video-center-play');
const directMute = directHub.querySelector('.ph-video-mute');
const directExpand = directHub.querySelector('.ph-video-expand');
const directClose = directHub.querySelector('.ph-video-close');
const directStatus = directHub.querySelector('.ph-video-status');
const directKicker = directHub.querySelector('.ph-video-title-copy small');
const directTitle = directHub.querySelector('.ph-video-title-copy strong');

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const total = Math.max(0, Math.floor(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const syncDirectPlay = () => {
  const paused = directVideo.paused;
  directPlay.textContent = paused ? '▶' : 'Ⅱ';
  directPlay.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
  directCenterPlay.hidden = !paused;
};

const syncDirectTime = () => {
  const duration = directVideo.duration || 0;
  const current = directVideo.currentTime || 0;
  directTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  const ratio = duration > 0 ? current / duration : 0;
  directProgress.value = String(Math.round(ratio * 1000));
  directProgress.style.setProperty('--progress', `${ratio * 100}%`);
};

const toggleDirectPlayback = () => {
  if (directVideo.paused) directVideo.play().catch(() => {});
  else directVideo.pause();
};

const openDirectVideo = ({ url, category, title }) => {
  directStatus.classList.remove('is-visible');
  directStatus.textContent = '';
  directHub.classList.remove('is-expanded');
  directExpand.textContent = '⛶';
  directKicker.textContent = category || 'Projeto';
  directTitle.textContent = title || 'Vídeo';
  directVideo.src = url;
  directVideo.muted = false;
  document.body.classList.add('ph-hub-open');
  directHub.showModal();
  const attempt = directVideo.play();
  if (attempt?.catch) attempt.catch(() => { directCenterPlay.hidden = false; syncDirectPlay(); });
};

const closeDirectVideo = () => {
  directVideo.pause();
  directVideo.removeAttribute('src');
  directVideo.load();
  directHub.classList.remove('is-expanded');
  if (directHub.open) directHub.close();
  document.body.classList.remove('ph-hub-open');
  syncDirectPlay();
  syncDirectTime();
};

directClose.addEventListener('click', closeDirectVideo);
directPlay.addEventListener('click', toggleDirectPlayback);
directCenterPlay.addEventListener('click', toggleDirectPlayback);
directVideo.addEventListener('click', toggleDirectPlayback);
directMute.addEventListener('click', () => {
  directVideo.muted = !directVideo.muted;
  directMute.textContent = directVideo.muted ? '×))' : '◖))';
  directMute.setAttribute('aria-label', directVideo.muted ? 'Ativar som' : 'Silenciar vídeo');
});
directExpand.addEventListener('click', () => {
  directHub.classList.toggle('is-expanded');
  const expanded = directHub.classList.contains('is-expanded');
  directExpand.textContent = expanded ? '⌟' : '⛶';
  directExpand.setAttribute('aria-label', expanded ? 'Reduzir player' : 'Expandir player');
});
directProgress.addEventListener('input', () => {
  if (!Number.isFinite(directVideo.duration) || directVideo.duration <= 0) return;
  directVideo.currentTime = (Number(directProgress.value) / 1000) * directVideo.duration;
  syncDirectTime();
});
directVideo.addEventListener('play', syncDirectPlay);
directVideo.addEventListener('pause', syncDirectPlay);
directVideo.addEventListener('loadedmetadata', syncDirectTime);
directVideo.addEventListener('durationchange', syncDirectTime);
directVideo.addEventListener('timeupdate', syncDirectTime);
directVideo.addEventListener('ended', syncDirectPlay);
directVideo.addEventListener('error', () => {
  directCenterPlay.hidden = true;
  directStatus.textContent = 'O vídeo não carregou neste navegador. Atualize a página e tente novamente.';
  directStatus.classList.add('is-visible');
});

directHub.addEventListener('cancel', (event) => { event.preventDefault(); closeDirectVideo(); });
directHub.addEventListener('click', (event) => { if (event.target === directHub) closeDirectVideo(); });

let idleTimer;
const wakeDirectControls = () => {
  directControls.classList.remove('is-idle');
  clearTimeout(idleTimer);
  if (!directVideo.paused) idleTimer = setTimeout(() => directControls.classList.add('is-idle'), 2200);
};
directStage.addEventListener('pointermove', wakeDirectControls);
directStage.addEventListener('pointerdown', wakeDirectControls);
directVideo.addEventListener('play', wakeDirectControls);
directVideo.addEventListener('pause', wakeDirectControls);

const setupProjectGallery = ({ visualSelector, categoryName, labelText, titleText, typeText, videos }) => {
  const visual = document.querySelector(visualSelector);
  if (!visual) return;

  const card = visual.closest('.work-card');
  const trigger = visual.querySelector('.watch-button');
  const visualLabel = visual.querySelector('.visual-label');
  const cardTitle = card?.querySelector('.work-content h3');
  const workType = card?.querySelector('.work-type');
  if (!trigger) return;

  trigger.removeAttribute('data-video');
  trigger.removeAttribute('data-video-title');
  trigger.removeAttribute('data-video-format');
  trigger.setAttribute('aria-label', `Ver projetos de ${categoryName}`);
  trigger.innerHTML = '<span aria-hidden="true">▶</span> Ver projetos';

  if (visualLabel) visualLabel.textContent = labelText;
  if (cardTitle && titleText) cardTitle.textContent = titleText;
  if (workType && typeText) workType.textContent = typeText;

  const idBase = categoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const galleryDialog = document.createElement('dialog');
  galleryDialog.className = 'project-gallery-dialog';
  galleryDialog.setAttribute('aria-labelledby', `${idBase}-gallery-title`);
  galleryDialog.innerHTML = `
    <div class="project-gallery-panel">
      <div class="project-gallery-topbar">
        <div><p class="project-gallery-kicker">${categoryName}</p><h2 id="${idBase}-gallery-title">Escolha um projeto</h2></div>
        <button class="project-gallery-close" type="button" aria-label="Fechar galeria">Fechar ×</button>
      </div>
      <div class="project-gallery-grid" aria-label="Projetos de ${categoryName}"></div>
    </div>
  `;

  const grid = galleryDialog.querySelector('.project-gallery-grid');
  const close = galleryDialog.querySelector('.project-gallery-close');

  videos.forEach((video, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-gallery-item';
    button.dataset.video = video.url || '';
    button.dataset.videoTitle = `${categoryName} — ${video.label}`;
    button.dataset.videoFormat = video.format || 'vertical';
    if (video.directUrl) button.dataset.directVideo = video.directUrl;
    button.setAttribute('aria-label', `Assistir ${categoryName} — ${video.label}`);
    button.innerHTML = `
      <span class="project-gallery-number">0${index + 1}</span>
      <span class="project-gallery-copy"><small>Projeto</small><strong>${video.label}</strong></span>
      <span class="project-gallery-play" aria-hidden="true">▶</span>
    `;
    button.addEventListener('click', () => {
      galleryDialog.close();
      if (button.dataset.directVideo) {
        openDirectVideo({ url: button.dataset.directVideo, category: categoryName, title: video.label });
      } else {
        openIframeVideo(button);
      }
    });
    grid.appendChild(button);
  });

  document.body.appendChild(galleryDialog);
  trigger.addEventListener('click', () => galleryDialog.showModal());
  close.addEventListener('click', () => galleryDialog.close());
  galleryDialog.addEventListener('click', (event) => { if (event.target === galleryDialog) galleryDialog.close(); });
  galleryDialog.addEventListener('cancel', (event) => { event.preventDefault(); galleryDialog.close(); });
};

setupProjectGallery({
  visualSelector: '.visual-direct',
  categoryName: 'Direct Response',
  labelText: 'Direct response · 3 projetos',
  videos: [
    { label: 'Exemplo 1', url: 'https://drive.google.com/file/d/148SFeFxIAvX_X8O5AFnuVjlRBqtF28JW/preview' },
    { label: 'Exemplo 2', url: 'https://drive.google.com/file/d/13O1-hU_z1ESGwfoZ3IwS5oFvoNVwlmpc/preview' },
    { label: 'Exemplo 3', url: 'https://drive.google.com/file/d/1Ij5vQo45FUrQx9N_AJqnzk_bUQlFqJy0/preview' }
  ]
});

setupProjectGallery({
  visualSelector: '.visual-cinematic',
  categoryName: 'Cinematic / VSL',
  labelText: 'Cinematic / VSL · 1 projeto',
  videos: [
    { label: 'Exemplo 1', url: 'https://drive.google.com/file/d/1yeI2Juc4IqeB8twvVGNz6bQYrBRCpWpo/preview', format: 'horizontal' }
  ]
});

setupProjectGallery({
  visualSelector: '.visual-short',
  categoryName: 'Vídeos Virais',
  labelText: 'Vídeos virais · 2 projetos',
  titleText: 'Vídeos Virais',
  typeText: 'TikTok · Instagram Reels · Conteúdo viral',
  videos: [
    { label: 'Exemplo 1', url: 'https://drive.google.com/file/d/1lnN0hxlTaZSnCNyowxlRyDjuaMGOc7Da/preview' },
    { label: 'Exemplo 2', url: 'https://drive.google.com/file/d/1nKhoR1OHOccjVoXP0njX10uVatjhTVdz/preview' }
  ]
});

document.querySelectorAll('[data-video]').forEach((button) => {
  if (!button.classList.contains('project-gallery-item')) button.addEventListener('click', () => openIframeVideo(button));
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
