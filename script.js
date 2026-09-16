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

  const cinematicDirectUrl = 'https://www.dropbox.com/scl/fi/ic49a7r85ud19artfd06r/Cinematic-VSL-Exemplo-1-Web.mp4?rlkey=atxvz8gmehizt38su5uxv6eso&raw=1';
  const viralDirectUrl = 'https://www.dropbox.com/scl/fi/y8ap64v3cre4yjwry1i83/Videos-Virais-Exemplo-1-Web.mp4?rlkey=pktpmp18fpjb6ujke97i0qhnw&raw=1';
  const viralDirectUrl2 = 'https://www.dropbox.com/scl/fi/8260dz00wbam6s0p8gx3r/Videos-Virais-Exemplo-2-Web.mp4?rlkey=gunb25ajjqf4rk132bd85vc7u&raw=1';
  const presentationDirectUrl = 'https://www.dropbox.com/scl/fi/bxpshdy2dm7fy2wujvt6v/Video-de-Apresentacao-Web.mp4?rlkey=373id1dogxip0su4wg6zxgp2d&raw=1';

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
  coreScript.src = 'script-core.js?v=20260916-presentation-player';
  coreScript.async = false;

  coreScript.addEventListener('load', () => {
    const hub = document.querySelector('.ph-video-hub');
    const player = hub?.querySelector('video');
    const expandButton = hub?.querySelector('.ph-video-expand');
    const centerPlay = hub?.querySelector('.ph-video-center-play');
    const status = hub?.querySelector('.ph-video-status');
    const kicker = hub?.querySelector('.ph-video-title-copy small');
    const title = hub?.querySelector('.ph-video-title-copy strong');

    const cinematicDialog = document.querySelector('[aria-labelledby="cinematic-vsl-gallery-title"]');
    const cinematicButton = cinematicDialog?.querySelector('.project-gallery-item');
    if (cinematicButton && cinematicDirectUrl) cinematicButton.dataset.directVideo = cinematicDirectUrl;

    const viralDialog = document.querySelector('[aria-labelledby="videos-virais-gallery-title"]');
    const viralButtons = viralDialog?.querySelectorAll('.project-gallery-item');
    if (viralButtons?.[0] && viralDirectUrl) viralButtons[0].dataset.directVideo = viralDirectUrl;
    if (viralButtons?.[1] && viralDirectUrl2) viralButtons[1].dataset.directVideo = viralDirectUrl2;

    document.addEventListener('click', (event) => {
      const presentationTrigger = event.target.closest?.('[data-mobile-presentation], [data-video*="13dx-6KjRRSsnEJwyv3VLbC-UsOfUzGDB"]');

      if (presentationTrigger && hub && player && presentationDirectUrl) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        status?.classList.remove('is-visible');
        if (status) status.textContent = '';
        hub.classList.add('is-horizontal');
        hub.classList.remove('is-expanded');
        if (expandButton) {
          expandButton.textContent = '⛶';
          expandButton.setAttribute('aria-label', 'Expandir player');
        }
        if (kicker) kicker.textContent = 'Vídeo de apresentação';
        if (title) title.textContent = 'Pedro Simões';
        player.src = presentationDirectUrl;
        player.muted = false;
        document.body.classList.add('ph-hub-open');
        hub.showModal();

        const attempt = player.play();
        if (attempt?.catch) {
          attempt.catch(() => {
            if (centerPlay) centerPlay.hidden = false;
          });
        }
        return;
      }

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
