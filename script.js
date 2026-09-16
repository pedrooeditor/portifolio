(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = 'https://wa.me/5511933596263?text=Ol%C3%A1%2C%20Pedro!%20Vi%20seu%20portf%C3%B3lio%20e%20quero%20conversar%20sobre%20um%20projeto.';
  const PRESENTATION_DRIVE = 'https://drive.google.com/file/d/13dx-6KjRRSsnEJwyv3VLbC-UsOfUzGDB/preview';
  const PRESENTATION = 'https://www.dropbox.com/scl/fi/bxpshdy2dm7fy2wujvt6v/Video-de-Apresentacao-Web.mp4?rlkey=373id1dogxip0su4wg6zxgp2d&raw=1';
  const DIRECT = 'https://www.dropbox.com/scl/fi/sf2043sqqgcw2akk8wg6p/Direct-Response-Exemplo-1-Web.mp4?rlkey=z3i60dr04yi77l6r7egb74p6z&raw=1';
  const CINEMATIC = 'https://www.dropbox.com/scl/fi/ic49a7r85ud19artfd06r/Cinematic-VSL-Exemplo-1-Web.mp4?rlkey=atxvz8gmehizt38su5uxv6eso&raw=1';
  const VIRAL1 = 'https://www.dropbox.com/scl/fi/y8ap64v3cre4yjwry1i83/Videos-Virais-Exemplo-1-Web.mp4?rlkey=pktpmp18fpjb6ujke97i0qhnw&raw=1';
  const VIRAL2 = 'https://www.dropbox.com/scl/fi/8260dz00wbam6s0p8gx3r/Videos-Virais-Exemplo-2-Web.mp4?rlkey=gunb25ajjqf4rk132bd85vc7u&raw=1';

  const mobileActions = $('.mobile-hero-actions');
  if (mobileActions && !$('[data-mobile-presentation]', mobileActions)) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'button button-primary';
    b.dataset.mobilePresentation = '';
    b.dataset.video = PRESENTATION_DRIVE;
    b.dataset.videoTitle = 'Vídeo de apresentação — Pedro Simões';
    b.dataset.videoFormat = 'horizontal';
    b.innerHTML = '<span class="play-icon" aria-hidden="true">▶</span> Assistir apresentação';
    mobileActions.prepend(b);
  }

  const eyebrow = $('.hero .eyebrow');
  if (eyebrow) eyebrow.innerHTML = '<span class="status-dot" aria-hidden="true"></span> Pedro Simões · Video Editor · Disponível para projetos';
  const heroTitle = $('.hero-title');
  if (heroTitle) heroTitle.innerHTML = '<span>Edição que prende</span><span>atenção.</span><span class="hero-title-accent">E faz a mensagem vender.</span>';
  const heroRole = $('.hero-role');
  if (heroRole) heroRole.textContent = 'Criativos · VSLs · Conteúdo · Performance';
  const heroIntro = $('.hero-intro > p');
  if (heroIntro) heroIntro.innerHTML = 'Transformo material bruto em vídeos que <strong>seguram o olhar</strong>, comunicam com clareza e valorizam cada segundo.';
  const heroSecondary = $('.hero-actions .button-ghost');
  if (heroSecondary) { heroSecondary.href = '#trabalhos'; heroSecondary.textContent = 'Ver projetos'; }
  const workSummary = $('#trabalhos .section-summary');
  if (workSummary) workSummary.textContent = 'Performance, narrativa e conteúdo curto. Cada projeto abaixo mostra uma forma diferente de transformar atenção em mensagem.';
  const showreelTitle = $('#showreel-title');
  if (showreelTitle) showreelTitle.innerHTML = 'Do bruto ao impacto.<br />Veja como eu penso<br /><em>cada corte.</em>';

  [
    ['.visual-direct', DIRECT, 'Preview real · Direct Response'],
    ['.visual-cinematic', CINEMATIC, 'Preview real · Cinematic / VSL'],
    ['.visual-short', VIRAL1, 'Preview real · Vídeos Virais']
  ].forEach(([selector, url, label]) => {
    const visual = $(selector);
    if (!visual) return;
    visual.dataset.previewVideo = url;
    const l = $('.visual-label', visual);
    if (l) l.textContent = label;
  });

  const work = $('#trabalhos');
  if (work && !$('.project-conversion-cta')) {
    const cta = document.createElement('section');
    cta.className = 'project-conversion-cta section-shell reveal';
    cta.innerHTML = `
      <div class="project-cta-copy">
        <p class="section-kicker">Gostou do nível da edição?</p>
        <h2>Vamos aplicar isso<br>no seu projeto.</h2>
        <p>Me conte o objetivo, formato e referência. Eu cuido do ritmo, da clareza e do acabamento para transformar o bruto em uma peça que segura atenção.</p>
      </div>
      <div class="project-cta-actions">
        <a class="button button-primary" href="${WA}" target="_blank" rel="noopener noreferrer">Falar sobre meu projeto <span aria-hidden="true">↗</span></a>
        <button class="button button-ghost" type="button" data-video="${PRESENTATION_DRIVE}" data-video-title="Vídeo de apresentação — Pedro Simões" data-video-format="horizontal"><span class="play-icon" aria-hidden="true">▶</span> Ver apresentação</button>
      </div>`;
    work.insertAdjacentElement('afterend', cta);
  }

  const about = $('#sobre');
  if (about && !$('.why-me')) {
    const section = document.createElement('section');
    section.className = 'why-me section-shell';
    section.innerHTML = `
      <div class="section-heading reveal">
        <p class="section-kicker">Além da timeline</p>
        <h2>Por que<br>trabalhar comigo</h2>
        <p class="section-summary">Não é efeito pelo efeito. A edição parte do objetivo, da mensagem e de como a pessoa vai consumir aquele vídeo.</p>
      </div>
      <div class="why-grid">
        <article class="why-card reveal"><span>01</span><h3>Visão de performance</h3><p>Ritmo, hierarquia visual e retenção pensados de acordo com o objetivo de cada peça.</p></article>
        <article class="why-card reveal"><span>02</span><h3>Edição + mensagem</h3><p>Texto, B-roll, motion e sound design trabalhando juntos para reforçar o argumento — não competir com ele.</p></article>
        <article class="why-card reveal"><span>03</span><h3>Comunicação direta</h3><p>Briefing claro, alinhamento de referências e decisões de edição fáceis de entender durante o projeto.</p></article>
        <article class="why-card reveal"><span>04</span><h3>Versatilidade</h3><p>Short form, criativos, VSL e cinematic com linguagens diferentes, mantendo consistência de acabamento.</p></article>
      </div>`;
    about.insertAdjacentElement('afterend', section);
  }

  const style = document.createElement('style');
  style.textContent = `
    .hero-title{max-width:980px;font-size:clamp(3.65rem,8.3vw,7.7rem);line-height:.82}
    .hero-title .hero-title-accent{margin-top:20px;color:var(--accent);-webkit-text-stroke:0;font-size:.43em;letter-spacing:-.035em;line-height:1.05}
    .hero-role{max-width:17rem}.hero-intro>p{max-width:650px}
    .work-card{transition:background 220ms ease}.work-card:hover{background:rgba(255,255,255,.012)}
    .work-visual{isolation:isolate;transition:border-color 220ms ease,transform 420ms var(--ease),box-shadow 420ms var(--ease)}
    .work-card:hover .work-visual{border-color:rgba(185,255,63,.34);transform:translateY(-3px);box-shadow:0 22px 70px rgba(0,0,0,.34)}
    .work-preview-video{position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:0;filter:saturate(.78) contrast(1.06) brightness(.78);transform:scale(1.025);transition:opacity 420ms ease,filter 420ms ease,transform 900ms var(--ease);pointer-events:none;background:#050605}
    .visual-direct .work-preview-video,.visual-short .work-preview-video{inset:0 auto 0 50%;width:auto;max-width:72%;height:100%;aspect-ratio:9/16;object-fit:contain;object-position:center;transform:translateX(-50%) scale(1.015);border-inline:1px solid rgba(255,255,255,.08);box-shadow:0 18px 55px rgba(0,0,0,.38)}
    .work-visual.preview-ready .work-preview-video{opacity:.58}.work-visual.preview-playing .work-preview-video{opacity:.9;filter:saturate(.95) contrast(1.04) brightness(.78);transform:scale(1.065)}
    .visual-direct.preview-playing .work-preview-video,.visual-short.preview-playing .work-preview-video{transform:translateX(-50%) scale(1.035)}
    .work-preview-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(4,5,4,.18),rgba(4,5,4,.2) 45%,rgba(4,5,4,.82));pointer-events:none}
    .visual-direct .caption-stack,.visual-cinematic .cinema-copy,.visual-short .phone-frame{position:relative;z-index:2;transition:opacity 320ms ease,transform 420ms var(--ease)}
    .work-visual.preview-ready .caption-stack,.work-visual.preview-ready .cinema-copy,.work-visual.preview-ready .phone-frame{opacity:.28}
    .work-visual.preview-playing .caption-stack,.work-visual.preview-playing .cinema-copy,.work-visual.preview-playing .phone-frame{opacity:.08;transform:translateY(8px) scale(.98)}
    .visual-label,.watch-button{z-index:4}.visual-cinematic::before,.visual-cinematic::after{z-index:3}
    .project-conversion-cta{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(280px,.65fr);gap:clamp(32px,6vw,88px);align-items:end;margin-bottom:clamp(88px,10vw,150px);padding:clamp(34px,5vw,64px);border:1px solid rgba(185,255,63,.3);background:radial-gradient(circle at 92% 20%,rgba(185,255,63,.13),transparent 24rem),linear-gradient(135deg,rgba(255,255,255,.035),transparent 60%),#0d0f0d}
    .project-cta-copy .section-kicker{margin-bottom:18px}.project-cta-copy h2{max-width:820px;margin:0 0 24px;font-family:var(--display);font-size:clamp(2.6rem,5.8vw,5.9rem);font-weight:600;letter-spacing:-.06em;line-height:.88;text-transform:uppercase}.project-cta-copy>p:last-child{max-width:670px;margin:0;color:var(--muted);font-size:1.04rem}.project-cta-actions{display:grid;gap:10px}.project-cta-actions .button{width:100%;min-height:56px}
    .why-me{padding-block:clamp(100px,12vw,180px);border-top:1px solid var(--line)}.why-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}.why-card{min-height:310px;padding:26px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);transition:transform 260ms var(--ease),background 220ms ease,border-color 220ms ease}.why-card:hover{transform:translateY(-5px);border-color:rgba(185,255,63,.35);background:rgba(185,255,63,.055)}.why-card>span{display:block;margin-bottom:78px;color:var(--accent);font-family:var(--display);font-size:.72rem}.why-card h3{margin-bottom:14px;font-family:var(--display);font-size:clamp(1.2rem,1.8vw,1.6rem);font-weight:600;letter-spacing:-.025em;text-transform:uppercase}.why-card p{margin:0;color:var(--muted);font-size:.96rem}
    .ph-video-hub.is-horizontal{width:min(980px,calc(100vw - 28px))}.ph-video-hub.is-horizontal .ph-video-stage{width:min(100%,calc((100dvh - 116px)*16/9));max-height:calc(100dvh - 116px);aspect-ratio:16/9}.ph-video-hub.is-horizontal.is-expanded .ph-video-stage{width:100vw;height:100dvh;max-height:none;aspect-ratio:auto;border:0;border-radius:0}
    @media(min-width:1041px) and (max-width:1220px){.hero{grid-template-columns:minmax(0,1.3fr) minmax(300px,.7fr);gap:clamp(28px,4vw,52px)}.hero-title{font-size:clamp(3.5rem,7.2vw,5.55rem);line-height:.84}.hero-title .hero-title-accent{font-size:.4em}.hero-bottom{grid-template-columns:.82fr 1.18fr;gap:18px}}
    @media(max-width:1040px){.hero-title{font-size:clamp(3.9rem,11.5vw,7rem)}.why-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:760px){.hero-title{max-width:100%;font-size:clamp(3rem,14.2vw,4.6rem);line-height:.86;overflow-wrap:normal}.hero-title .hero-title-accent{margin-top:15px;font-size:.48em;line-height:1.08}.hero-role{max-width:26rem}.work-card:hover .work-visual{transform:none;box-shadow:none}.work-visual.preview-ready .work-preview-video{opacity:.7}.visual-direct .work-preview-video,.visual-short .work-preview-video{max-width:68%}.work-visual.preview-ready .caption-stack,.work-visual.preview-ready .cinema-copy,.work-visual.preview-ready .phone-frame{opacity:.16}.project-conversion-cta{grid-template-columns:1fr;gap:28px;margin-bottom:72px;padding:26px 20px}.project-cta-copy h2{font-size:clamp(2.25rem,10.5vw,3.6rem)}.project-cta-copy>p:last-child{font-size:.96rem}.why-me{padding-block:68px}.why-grid{grid-template-columns:1fr 1fr}.why-card{min-height:230px;padding:18px 15px}.why-card>span{margin-bottom:42px}.why-card h3{font-size:1rem}.why-card p{font-size:.86rem;line-height:1.42}.ph-video-hub.is-horizontal .ph-video-stage{width:min(100%,calc((100dvh - 92px - env(safe-area-inset-top))*16/9));max-height:calc(100dvh - 92px - env(safe-area-inset-top));aspect-ratio:16/9}.ph-video-hub.is-horizontal.is-expanded .ph-video-stage{width:100vw;height:100dvh;max-height:none;aspect-ratio:auto}}
    @media(max-width:430px){.why-grid{grid-template-columns:1fr}.why-card{min-height:0}.why-card>span{margin-bottom:28px}}
    @media(max-width:380px){.service-grid{grid-template-columns:1fr!important}}
    @media(hover:none){.why-card:hover{transform:none;background:transparent;border-color:var(--line)}}
    @media(prefers-reduced-motion:reduce){.work-preview-video{display:none}}
  `;
  document.head.appendChild(style);

  const setupPreviews = () => {
    const visuals = $$('.work-visual[data-preview-video]');
    if (!visuals.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pairs = visuals.map(visual => {
      const video = document.createElement('video');
      video.className = 'work-preview-video';
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
      video.setAttribute('playsinline', ''); video.setAttribute('webkit-playsinline', ''); video.setAttribute('aria-hidden', 'true');
      video.tabIndex = -1; video.dataset.src = visual.dataset.previewVideo;
      const scrim = document.createElement('span'); scrim.className = 'work-preview-scrim'; scrim.setAttribute('aria-hidden', 'true');
      visual.prepend(scrim); visual.prepend(video);
      video.addEventListener('loadeddata', () => visual.classList.add('preview-ready'), { once: true });
      video.addEventListener('play', () => visual.classList.add('preview-playing'));
      video.addEventListener('pause', () => visual.classList.remove('preview-playing'));
      return { visual, video, loaded: false };
    });
    const load = pair => {
      if (!pair || pair.loaded) return;
      pair.loaded = true; pair.video.preload = 'metadata'; pair.video.src = pair.video.dataset.src; pair.video.load();
    };
    const pauseOthers = active => pairs.forEach(({ video }) => { if (video !== active && !video.paused) video.pause(); });
    if ('IntersectionObserver' in window) {
      const pre = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        const p = pairs.find(x => x.visual === e.target); load(p); pre.unobserve(e.target);
      }), { rootMargin: '600px 0px', threshold: .01 });
      pairs.forEach(p => pre.observe(p.visual));
    } else pairs.forEach(load);
    if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
      pairs.forEach(p => {
        const play = () => { load(p); pauseOthers(p.video); p.video.play().catch(() => {}); };
        p.visual.addEventListener('mouseenter', play); p.visual.addEventListener('focusin', play);
        p.visual.addEventListener('mouseleave', () => p.video.pause()); p.visual.addEventListener('focusout', () => p.video.pause());
      });
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        const p = pairs.find(x => x.visual === e.target); if (!p) return;
        if (e.isIntersecting && e.intersectionRatio >= .62) { load(p); pauseOthers(p.video); p.video.play().catch(() => {}); }
        else p.video.pause();
      }), { threshold: [0, .62, 1] });
      pairs.forEach(p => io.observe(p.visual));
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) pairs.forEach(p => p.video.pause()); });
  };
  setupPreviews();

  const core = document.createElement('script');
  core.src = 'script-core.js?v=20260916-final-polish';
  core.async = false;
  core.addEventListener('load', () => {
    const hub = $('.ph-video-hub');
    const player = $('video', hub || document);
    const expand = $('.ph-video-expand', hub || document);
    const centerPlay = $('.ph-video-center-play', hub || document);
    const status = $('.ph-video-status', hub || document);
    const kicker = $('.ph-video-title-copy small', hub || document);
    const title = $('.ph-video-title-copy strong', hub || document);

    const cinematicButton = $('[aria-labelledby="cinematic-vsl-gallery-title"] .project-gallery-item');
    if (cinematicButton) cinematicButton.dataset.directVideo = CINEMATIC;
    const viralButtons = $$('[aria-labelledby="videos-virais-gallery-title"] .project-gallery-item');
    if (viralButtons[0]) viralButtons[0].dataset.directVideo = VIRAL1;
    if (viralButtons[1]) viralButtons[1].dataset.directVideo = VIRAL2;

    document.addEventListener('click', event => {
      const presentation = event.target.closest?.('[data-mobile-presentation], [data-video*="13dx-6KjRRSsnEJwyv3VLbC-UsOfUzGDB"]');
      if (presentation && hub && player) {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        status?.classList.remove('is-visible'); if (status) status.textContent = '';
        hub.classList.add('is-horizontal'); hub.classList.remove('is-expanded');
        if (expand) { expand.textContent = '⛶'; expand.setAttribute('aria-label', 'Expandir player'); }
        if (kicker) kicker.textContent = 'Vídeo de apresentação'; if (title) title.textContent = 'Pedro Simões';
        player.src = PRESENTATION; player.muted = false; document.body.classList.add('ph-hub-open'); hub.showModal();
        player.play().catch(() => { if (centerPlay) centerPlay.hidden = false; });
        return;
      }
      const item = event.target.closest?.('.project-gallery-item');
      if (item && hub) hub.classList.toggle('is-horizontal', item.dataset.videoFormat === 'horizontal');
    }, true);

    if (!hub || !player || !expand) return;
    const reset = () => { hub.classList.remove('is-expanded'); expand.textContent = '⛶'; expand.setAttribute('aria-label', 'Expandir player'); try { screen.orientation?.unlock?.(); } catch (_) {} };
    expand.addEventListener('click', async event => {
      if (!matchMedia('(max-width:760px)').matches || !hub.classList.contains('is-horizontal')) return;
      event.preventDefault(); event.stopImmediatePropagation();
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (ios && typeof player.webkitEnterFullscreen === 'function') { try { player.webkitEnterFullscreen(); return; } catch (_) {} }
      if (typeof hub.requestFullscreen === 'function') {
        try { hub.classList.add('is-expanded'); expand.textContent = '⌟'; expand.setAttribute('aria-label', 'Reduzir player'); await hub.requestFullscreen(); try { await screen.orientation?.lock?.('landscape'); } catch (_) {} return; }
        catch (_) { reset(); }
      }
      hub.classList.toggle('is-expanded'); const on = hub.classList.contains('is-expanded'); expand.textContent = on ? '⌟' : '⛶'; expand.setAttribute('aria-label', on ? 'Reduzir player' : 'Expandir player');
    }, true);
    document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) reset(); });
    player.addEventListener('webkitendfullscreen', reset);
  });
  document.body.appendChild(core);
})();
