(() => {
  const mobileHeroActions = document.querySelector('.mobile-hero-actions');

  if (mobileHeroActions && !mobileHeroActions.querySelector('[data-mobile-presentation]')) {
    const presentationButton = document.createElement('button');
    presentationButton.type = 'button';
    presentationButton.className = 'button button-primary';
    presentationButton.dataset.mobilePresentation = '';
    presentationButton.dataset.video = 'https://drive.google.com/file/d/13dx-6KjRRSsnEJwyv3VLbC-UsOfUzGDB/preview';
    presentationButton.dataset.videoTitle = 'Vídeo de apresentação — Pedro Simões';
    presentationButton.dataset.videoFormat = 'horizontal';
    presentationButton.innerHTML = '<span class="play-icon" aria-hidden="true">▶</span> Assistir apresentação';
    mobileHeroActions.prepend(presentationButton);
  }

  const cinematicDirectUrl = '';

  const horizontalStyles = document.createElement('style');
  horizontalStyles.textContent = `
    .ph-video-hub.is-horizontal {
      width: min(980px, calc(100vw - 28px));
    }

    .ph-video-hub.is-horizontal .ph-video-stage {
      width: min(100%, calc((100dvh - 116px) * 16 / 9));
      max-height: calc(100dvh - 116px);
      aspect-ratio: 16 / 9;
    }

    .ph-video-hub.is-horizontal.is-expanded .ph-video-stage {
      width: 100vw;
      height: 100dvh;
      max-height: none;
      aspect-ratio: auto;
      border: 0;
      border-radius: 0;
    }

    @media (max-width: 760px) {
      .ph-video-hub.is-horizontal .ph-video-stage {
        width: min(100%, calc((100dvh - 92px - env(safe-area-inset-top)) * 16 / 9));
        max-height: calc(100dvh - 92px - env(safe-area-inset-top));
        aspect-ratio: 16 / 9;
      }

      .ph-video-hub.is-horizontal.is-expanded .ph-video-stage {
        width: 100vw;
        height: 100dvh;
        max-height: none;
        aspect-ratio: auto;
      }
    }
  `;
  document.head.appendChild(horizontalStyles);

  const coreScript = document.createElement('script');
  coreScript.src = 'script-core.js?v=20260916-horizontal-player';
  coreScript.async = false;

  coreScript.addEventListener('load', () => {
    const hub = document.querySelector('.ph-video-hub');
    const player = hub?.querySelector('video');
    const expandButton = hub?.querySelector('.ph-video-expand');

    const cinematicDialog = document.querySelector('[aria-labelledby="cinematic-vsl-gallery-title"]');
    const cinematicButton = cinematicDialog?.querySelector('.project-gallery-item');
    if (cinematicButton && cinematicDirectUrl) cinematicButton.dataset.directVideo = cinematicDirectUrl;

    document.addEventListener('click', (event) => {
      const item = event.target.closest?.('.project-gallery-item');
      if (!item || !hub) return;
      hub.classList.toggle('is-horizontal', item.dataset.videoFormat === 'horizontal');
    }, true);

    if (!hub || !player || !expandButton) return;

    const resetExpandedState = () => {
      hub.classList.remove('is-expanded');
      expandButton.textContent = '⛶';
      expandButton.setAttribute('aria-label', 'Expandir player');
      try { screen.orientation?.unlock?.(); } catch (_) {}
    };

    expandButton.addEventListener('click', async (event) => {
      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      const isHorizontal = hub.classList.contains('is-horizontal');
      if (!isMobile || !isHorizontal) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (isIOS && typeof player.webkitEnterFullscreen === 'function') {
        try {
          player.webkitEnterFullscreen();
          return;
        } catch (_) {}
      }

      if (typeof hub.requestFullscreen === 'function') {
        try {
          hub.classList.add('is-expanded');
          expandButton.textContent = '⌟';
          expandButton.setAttribute('aria-label', 'Reduzir player');
          await hub.requestFullscreen();
          try { await screen.orientation?.lock?.('landscape'); } catch (_) {}
          return;
        } catch (_) {
          resetExpandedState();
        }
      }

      hub.classList.toggle('is-expanded');
      const expanded = hub.classList.contains('is-expanded');
      expandButton.textContent = expanded ? '⌟' : '⛶';
      expandButton.setAttribute('aria-label', expanded ? 'Reduzir player' : 'Expandir player');
    }, true);

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) resetExpandedState();
    });

    player.addEventListener('webkitendfullscreen', resetExpandedState);
  });

  document.body.appendChild(coreScript);
})();
