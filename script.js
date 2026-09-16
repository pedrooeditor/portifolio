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

  const coreScript = document.createElement('script');
  coreScript.src = 'script-core.js?v=20260916-mobile-presentation';
  coreScript.async = false;
  document.body.appendChild(coreScript);
})();
