/* Pedro Simões — interações do portfólio */
(() => {
  'use strict';
  window.__psBooted = true;

  /* ==========================================================================
     CONFIGURAÇÃO
     Para adicionar um trabalho novo: copie um bloco dentro de PROJETOS e troque
     id, textos e o link do vídeo (Dropbox com &raw=1 no final). O card aparece
     sozinho na grade de trabalhos e entra na sequência do player.
     ========================================================================== */

  const WHATSAPP = '5511933596263';
  const MSG_PADRAO = 'Olá, Pedro! Vi seu portfólio e quero conversar sobre um projeto.';

  const APRESENTACAO = {
    id: 'presentation',
    categoria: 'Pedro Simões',
    titulo: 'Vídeo de Apresentação',
    formato: 'horizontal',
    url: 'https://www.dropbox.com/scl/fi/ytdskddlhxg5edqeaqqyc/Video-de-Apresentacao-Novo-Web.mp4?rlkey=c05uyqobm09iqyzb4ail5m89z&raw=1',
    resumo: 'Quem eu sou, como eu penso cada corte e o que posso fazer pelo seu vídeo.'
  };

  const RESUMO = {
    direct: 'Criativo de resposta direta: gancho nos primeiros segundos, oferta clara e CTA no ponto certo — com legendas, B-roll e sound design acompanhando cada argumento.',
    vsl: 'Narrativa, atmosfera, color grading e desenho de som trabalhando juntos, sem perder a clareza da oferta.',
    viral: 'Conteúdo vertical feito para segurar no feed: cortes rápidos, legendas dinâmicas e ritmo do primeiro ao último segundo.'
  };

  const PROJETOS = [
    {
      id: 'c1',
      categoria: 'Cinematic · VSL',
      titulo: 'VSL cinematográfica',
      formato: 'horizontal',
      url: 'https://www.dropbox.com/scl/fi/ic49a7r85ud19artfd06r/Cinematic-VSL-Exemplo-1-Web.mp4?rlkey=atxvz8gmehizt38su5uxv6eso&raw=1',
      resumo: RESUMO.vsl
    },
    {
      id: 'd1',
      categoria: 'Direct Response',
      titulo: 'Criativo de conversão 01',
      formato: 'vertical',
      url: 'https://www.dropbox.com/scl/fi/sf2043sqqgcw2akk8wg6p/Direct-Response-Exemplo-1-Web.mp4?rlkey=z3i60dr04yi77l6r7egb74p6z&raw=1',
      resumo: RESUMO.direct
    },
    {
      id: 'v1',
      categoria: 'Vídeo viral',
      titulo: 'Retenção no feed 01',
      formato: 'vertical',
      url: 'https://www.dropbox.com/scl/fi/y8ap64v3cre4yjwry1i83/Videos-Virais-Exemplo-1-Web.mp4?rlkey=pktpmp18fpjb6ujke97i0qhnw&raw=1',
      resumo: RESUMO.viral
    },
    {
      id: 'd2',
      categoria: 'Direct Response',
      titulo: 'Criativo de conversão 02',
      formato: 'vertical',
      url: 'https://www.dropbox.com/scl/fi/23xptelf3enkvrfssn8gi/Direct-Response-Exemplo-2-Web.mp4?rlkey=pl43hn30ljsnf788aqz2chzie&raw=1',
      resumo: RESUMO.direct
    },
    {
      id: 'v2',
      categoria: 'Vídeo viral',
      titulo: 'Retenção no feed 02',
      formato: 'vertical',
      url: 'https://www.dropbox.com/scl/fi/8260dz00wbam6s0p8gx3r/Videos-Virais-Exemplo-2-Web.mp4?rlkey=gunb25ajjqf4rk132bd85vc7u&raw=1',
      resumo: RESUMO.viral
    },
    {
      id: 'd3',
      categoria: 'Direct Response',
      titulo: 'Criativo de conversão 03',
      formato: 'vertical',
      url: 'https://www.dropbox.com/scl/fi/q6dss5lhec5p3wllr94o2/Direct-Response-Exemplo-3-Web.mp4?rlkey=hwc3y6oahtw6evcw9rjjlq46o&raw=1',
      resumo: RESUMO.direct
    }
  ];

  /* ==========================================================================
     Utilidades
     ========================================================================== */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const media = q => window.matchMedia(q);
  const reduceMotion = media('(prefers-reduced-motion: reduce)').matches;
  const finePointer = media('(hover: hover) and (pointer: fine)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const canAutoplay = !reduceMotion && !saveData;
  const hasGSAP = Boolean(window.gsap && window.ScrollTrigger);
  const animate = hasGSAP && !reduceMotion;

  const pad = n => String(Math.max(0, Math.floor(n))).padStart(2, '0');
  const clamp01 = n => Math.min(1, Math.max(0, n));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  const track = (name, extra) => { try { if (window.phTrack) window.phTrack(name, extra); } catch (_) {} };
  const safePlay = v => { try { const p = v.play(); if (p && p.catch) p.catch(() => {}); } catch (_) {} };

  const VIDEOS = { [APRESENTACAO.id]: APRESENTACAO };
  PROJETOS.forEach(p => { VIDEOS[p.id] = p; });

  // Seções fixadas (pin) ficam estáveis quando a página sempre recarrega do topo.
  if ('scrollRestoration' in history && !location.hash) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  if (!animate) root.classList.add('no-scrub');

  let refreshTimer;
  const refreshLayout = (delay = 650) => {
    if (!hasGSAP) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), delay);
  };

  $$('[data-wa]').forEach(a => { a.href = waLink(MSG_PADRAO); });
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  /* ==========================================================================
     Grade de trabalhos (gerada a partir de PROJETOS)
     ========================================================================== */

  const grid = $('[data-work-grid]');
  if (grid) {
    const frag = document.createDocumentFragment();
    PROJETOS.forEach((p, i) => {
      const wide = p.formato === 'horizontal';
      const nome = `${p.categoria} — ${p.titulo}`;
      const card = document.createElement('article');
      card.className = `card${wide ? ' card--wide' : ''}`;
      card.setAttribute('data-reveal', '');
      card.innerHTML = `
        <button class="card-media" type="button" data-open-video="${esc(p.id)}" data-video-title="${esc(nome)}" data-cursor="play" aria-label="Assistir ${esc(nome)}">
          <span class="card-fallback" aria-hidden="true">${esc(p.categoria)}</span>
          <video class="work-preview-video" data-preview="${esc(p.id)}" data-lazy-group="work" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
          <span class="card-tag" aria-hidden="true">${esc(p.categoria)}</span>
          <span class="card-play" aria-hidden="true"><svg class="i"><use href="#i-play"/></svg></span>
        </button>
        <div class="card-meta">
          <span class="card-num">${pad(i + 1)}</span>
          <div><h3 class="card-title">${esc(p.titulo)}</h3><p class="card-cat">${esc(p.categoria)} · ${wide ? 'Horizontal' : 'Vertical'}</p></div>
          <span class="card-arrow" aria-hidden="true"><svg class="i"><use href="#i-arrow"/></svg></span>
        </div>`;
      card.querySelector('.card-meta').addEventListener('click', () => card.querySelector('.card-media').click());
      frag.appendChild(card);
    });

    const cta = document.createElement('article');
    cta.className = 'card card--wide card--cta';
    cta.setAttribute('data-reveal', '');
    cta.innerHTML = `
      <a class="card-cta" href="#contato">
        <small>Seu projeto</small>
        <strong>O próximo trabalho aqui pode ser <em>o seu.</em></strong>
        <span class="btn btn-dark"><span>Vamos conversar</span><span class="btn-icon"><svg class="i"><use href="#i-arrow"/></svg></span></span>
      </a>`;
    frag.appendChild(cta);
    grid.appendChild(frag);
  }

  /* ==========================================================================
     Prévias de vídeo (mudas, carregam sob demanda e tocam só quando visíveis)
     ========================================================================== */

  const previews = $$('video[data-preview]');
  let previewsSuspended = false;
  let playerOpen = false;

  const loadPreview = v => {
    if (v.dataset.loaded) return;
    const data = VIDEOS[v.dataset.preview];
    if (!data) return;
    v.dataset.loaded = '1';
    v.preload = 'metadata';
    v.src = `${data.url}#t=${v.hasAttribute('data-poster-only') ? 3 : 0.1}`;
  };

  const shouldAutoplay = v => canAutoplay && !v.hasAttribute('data-poster-only');

  const suspendPreviews = on => {
    previewsSuspended = on;
    previews.forEach(v => {
      if (on) v.pause();
      else if (v._visible && shouldAutoplay(v)) safePlay(v);
    });
  };

  previews.forEach(v => {
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    if (v.hasAttribute('data-eager')) loadPreview(v);
  });

  if ('IntersectionObserver' in window) {
    const previewIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = e.target;
        v._visible = e.isIntersecting;
        if (e.isIntersecting) {
          loadPreview(v);
          if (shouldAutoplay(v) && !previewsSuspended) safePlay(v);
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: '150px 0px', threshold: 0.2 });
    previews.forEach(v => previewIO.observe(v));

    const workSection = $('#trabalhos');
    if (workSection) {
      const warm = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        $$('video[data-lazy-group="work"]').forEach(loadPreview);
        warm.disconnect();
      }, { rootMargin: '900px 0px' });
      warm.observe(workSection);
    }
  } else {
    previews.forEach(v => { loadPreview(v); if (shouldAutoplay(v)) safePlay(v); });
  }

  document.addEventListener('visibilitychange', () => suspendPreviews(document.hidden || playerOpen));

  /* ==========================================================================
     Rolagem suave (Lenis) + abertura
     ========================================================================== */

  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const intro = $('[data-intro]');
  let ready = false;
  const onReady = () => {
    if (ready) return;
    ready = true;
    root.classList.add('is-ready');
    if (lenis) lenis.start();
    refreshLayout(80);
  };

  const introActive = Boolean(intro) && !root.classList.contains('no-intro') && getComputedStyle(intro).display !== 'none';
  if (introActive) {
    try { sessionStorage.setItem('ps_intro_seen', '1'); } catch (_) {}
    if (lenis) lenis.stop();
    setTimeout(onReady, 1150);
    intro.addEventListener('animationend', e => { if (e.animationName === 'intro-done') intro.remove(); });
    intro.addEventListener('click', () => { intro.remove(); onReady(); });
  } else {
    if (intro) intro.remove();
    requestAnimationFrame(() => requestAnimationFrame(onReady));
  }

  /* ==========================================================================
     Menu (celular)
     ========================================================================== */

  const header = $('[data-header]');
  const menuBtn = $('[data-menu-btn]');
  const menu = $('[data-menu]');
  let menuOpen = false;
  let menuTimer;

  const openMenu = () => {
    if (!menu || menuOpen) return;
    menuOpen = true;
    clearTimeout(menuTimer);
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    root.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    $('.menu-btn-label', menuBtn).textContent = 'Fechar';
    if (header) header.classList.remove('is-hidden');
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
    updateDock();
  };

  const closeMenu = () => {
    if (!menu || !menuOpen) return;
    menuOpen = false;
    menu.classList.remove('is-open');
    root.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    $('.menu-btn-label', menuBtn).textContent = 'Menu';
    if (lenis) lenis.start(); else document.body.style.overflow = '';
    menuTimer = setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 850);
    updateDock();
  };

  if (menuBtn) menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { closeMenu(); menuBtn.focus(); } });
  media('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  /* ---------- Links internos com rolagem suave ---------- */

  const scrollToHash = hash => {
    const target = hash === '#top' ? 0 : document.getElementById(hash.slice(1));
    if (target === null) return false;
    if (lenis) lenis.scrollTo(target, { duration: 1.5 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    return true;
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash.length < 2) return;
    closeMenu();
    if (!scrollToHash(hash)) return;
    e.preventDefault();
    history.replaceState(null, '', hash === '#top' ? location.pathname + location.search : hash);
  });

  /* ==========================================================================
     Header e CTA fixo
     ========================================================================== */

  const dock = $('[data-dock]');
  let lastY = window.scrollY;
  let dockBlocked = false;
  let ticking = false;

  function updateDock() {
    if (!dock) return;
    const show = window.scrollY > window.innerHeight * 0.9 && !dockBlocked && !menuOpen;
    dock.classList.toggle('is-on', show);
  }

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('is-scrolled', y > 24);
      const dy = y - lastY;
      if (Math.abs(dy) > 6) {
        header.classList.toggle('is-hidden', dy > 0 && y > 520 && !menuOpen);
        lastY = y;
      }
      if (y < 520) header.classList.remove('is-hidden');
    }
    updateDock();
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const visible = new Set();
    const dockIO = new IntersectionObserver(entries => {
      entries.forEach(e => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      dockBlocked = visible.size > 0;
      updateDock();
    });
    $$('#contato, .footer').forEach(b => dockIO.observe(b));

    const navLinks = $$('[data-nav-link]');
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => navIO.observe(s));
  }

  /* ==========================================================================
     Rodapé: assinatura letra por letra
     ========================================================================== */

  const wordmark = $('[data-wordmark]');
  let wordmarkInner = null;
  if (wordmark) {
    const text = wordmark.textContent.trim();
    wordmark.innerHTML = `<span class="wordmark-mask"><span class="wordmark-inner">${Array.from(text)
      .map((ch, i) => `<span class="wl" style="--i:${i}">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`)
      .join('')}</span></span>`;
    wordmarkInner = $('.wordmark-inner', wordmark);
    wordmarkInner.style.display = 'inline-block';
  }

  const fitWordmark = () => {
    if (!wordmark || !wordmarkInner) return;
    wordmark.style.fontSize = '';
    const fs = parseFloat(getComputedStyle(wordmark).fontSize);
    const ratio = wordmark.clientWidth / Math.max(1, wordmarkInner.offsetWidth);
    wordmark.style.fontSize = `${(fs * ratio * 0.995).toFixed(2)}px`;
  };

  /* ==========================================================================
     Revelações ao rolar
     ========================================================================== */

  const revealEls = $$('[data-reveal], [data-reveal-lines]');
  revealEls.forEach(el => {
    if (!el.hasAttribute('data-reveal') || !el.parentElement) return;
    const siblings = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
    const idx = siblings.indexOf(el);
    const step = el.classList.contains('card') ? (idx % 3) * 0.12 : Math.min(idx, 6) * 0.08;
    if (step > 0) el.style.setProperty('--rd', `${step}s`);
  });

  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => revealIO.observe(el));
    if (wordmark) revealIO.observe(wordmark);
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
    if (wordmark) wordmark.classList.add('is-in');
  }

  /* ==========================================================================
     Faixa: velocidade e direção acompanham a rolagem
     ========================================================================== */

  const ticker = $('.ticker');
  const marqueeAnims = $$('[data-marquee]')
    .map(el => (el.getAnimations ? el.getAnimations()[0] : null))
    .filter(Boolean);

  if (ticker && marqueeAnims.length && !reduceMotion && 'IntersectionObserver' in window) {
    let prevY = window.scrollY;
    let rate = 1;
    let dir = 1;
    let running = false;
    const loop = () => {
      if (!running) return;
      const y = window.scrollY;
      const v = y - prevY;
      prevY = y;
      if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1;
      const target = dir * (1 + Math.min(Math.abs(v) * 0.12, 5));
      const next = rate + (target - rate) * 0.07;
      if (Math.abs(next - rate) > 0.002) {
        rate = next;
        marqueeAnims.forEach(a => { a.playbackRate = rate; });
      }
      requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        prevY = window.scrollY;
        requestAnimationFrame(loop);
      } else if (!e.isIntersecting) {
        running = false;
      }
    }).observe(ticker);
  }

  /* ==========================================================================
     Hero: a janela do showreel se expande até ocupar a tela
     ========================================================================== */

  const heroPin = $('[data-hero-pin]');
  const heroMedia = $('[data-hero-media]');
  if (animate && heroPin && heroMedia) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (min-height: 600px)', () => {
      const content = $('[data-hero-content]');
      const reel = $('[data-hero-reel]');
      const label = $('[data-hero-label]');
      gsap.set(heroMedia, { '--shade': 0.15 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroPin,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      tl.fromTo(heroMedia,
        { clipPath: 'inset(50% 3.5% 7% 56% round 20px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 }, 0)
        .to(content, { yPercent: -10, autoAlpha: 0, ease: 'power1.in', duration: 0.5 }, 0)
        .to(label, { autoAlpha: 0, duration: 0.15 }, 0)
        .to(heroMedia, { '--shade': 0.5, ease: 'none', duration: 1 }, 0)
        .fromTo(reel, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.72);

      if (finePointer) {
        const video = $('video', heroMedia);
        gsap.set(video, { scale: 1.08 });
        const qx = gsap.quickTo(video, 'x', { duration: 1.2, ease: 'power3' });
        const qy = gsap.quickTo(video, 'y', { duration: 1.2, ease: 'power3' });
        const move = e => {
          qx((e.clientX / window.innerWidth - 0.5) * -24);
          qy((e.clientY / window.innerHeight - 0.5) * -16);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      }
      return undefined;
    });
  }

  /* ==========================================================================
     Manifesto: acende palavra por palavra
     ========================================================================== */

  const statement = $('[data-words]');
  if (statement) {
    const highlight = new Set(['cortar', 'segundo', 'mensagem']);
    const words = statement.textContent.trim().split(/\s+/);
    statement.innerHTML = words
      .map(w => `<span class="w${highlight.has(w.replace(/[^\p{L}]/gu, '')) ? ' hl' : ''}">${esc(w)}</span>`)
      .join(' ');
    const spans = $$('.w', statement);
    if (animate) {
      ScrollTrigger.create({
        trigger: statement,
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: true,
        onUpdate: self => {
          const n = Math.round(self.progress * spans.length);
          spans.forEach((s, i) => s.classList.toggle('on', i < n));
        }
      });
    } else {
      spans.forEach(s => s.classList.add('on'));
    }
  }

  /* ==========================================================================
     Sobre: leve parallax no vídeo de apresentação
     ========================================================================== */

  if (animate) {
    const portraitVideo = $('.portrait video');
    if (portraitVideo) {
      gsap.fromTo(portraitVideo, { yPercent: -6, scale: 1.12 }, {
        yPercent: 6,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ==========================================================================
     Serviços: prévia em vídeo que segue o mouse
     ========================================================================== */

  const svcItems = $$('.svc');
  const svcFloat = $('[data-svc-float]');
  const svcList = $('[data-svc-list]');
  if (svcFloat && svcList && finePointer && !reduceMotion) {
    const fv = $('video', svcFloat);
    fv.muted = true;
    let tx = 0;
    let ty = 0;
    let fx = 0;
    let fy = 0;
    let on = false;
    let raf = 0;
    const loop = () => {
      fx += (tx - fx) * 0.14;
      fy += (ty - fy) * 0.14;
      svcFloat.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      raf = on || Math.abs(tx - fx) + Math.abs(ty - fy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    svcList.addEventListener('pointermove', e => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    // Ao rolar com o mouse parado, a linha sai de baixo do cursor: esconde a prévia.
    window.addEventListener('scroll', () => {
      if (!on) return;
      const under = document.elementFromPoint(tx, ty);
      if (!under || !under.closest('.svc[data-svc-preview]')) {
        on = false;
        svcFloat.classList.remove('is-on');
        fv.pause();
      }
    }, { passive: true });
    svcItems.forEach(li => {
      const id = li.dataset.svcPreview;
      li.addEventListener('pointerenter', e => {
        const v = id && VIDEOS[id];
        if (!v) return;
        if (!on) { fx = tx = e.clientX; fy = ty = e.clientY; }
        if (fv.dataset.id !== id) { fv.dataset.id = id; fv.src = v.url; }
        svcFloat.classList.toggle('is-h', v.formato === 'horizontal');
        svcFloat.classList.add('is-on');
        on = true;
        safePlay(fv);
        if (!raf) raf = requestAnimationFrame(loop);
      });
      li.addEventListener('pointerleave', () => {
        on = false;
        svcFloat.classList.remove('is-on');
        fv.pause();
      });
    });
  }

  /* ==========================================================================
     Processo: linha dourada acompanha a rolagem
     ========================================================================== */

  const stepsEl = $('[data-steps]');
  const stepsFill = $('[data-steps-fill]');
  const steps = $$('.step');
  if (stepsEl && stepsFill) {
    if (animate) {
      ScrollTrigger.create({
        trigger: stepsEl,
        start: 'top 75%',
        end: 'bottom 55%',
        scrub: 0.4,
        onUpdate: self => {
          const p = self.progress;
          stepsFill.style.setProperty('--p', p.toFixed(4));
          steps.forEach((s, i) => s.classList.toggle('is-on', p >= i / steps.length + 0.02));
        }
      });
    } else {
      stepsFill.style.setProperty('--p', '1');
      steps.forEach(s => s.classList.add('is-on'));
    }
  }

  /* ==========================================================================
     FAQ
     ========================================================================== */

  $$('.qa').forEach(qa => {
    const btn = $('.qa-q', qa);
    btn.addEventListener('click', () => {
      const open = !qa.classList.contains('is-open');
      $$('.qa.is-open').forEach(o => {
        if (o === qa) return;
        o.classList.remove('is-open');
        $('.qa-q', o).setAttribute('aria-expanded', 'false');
      });
      qa.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      refreshLayout();
    });
  });

  /* ==========================================================================
     Briefing rápido → mensagem pronta no WhatsApp
     ========================================================================== */

  const brief = $('[data-brief]');
  const briefSend = $('[data-brief-send]');
  if (brief && briefSend) {
    const read = () => {
      const fd = new FormData(brief);
      return {
        tipo: fd.get('tipo') || '',
        volume: fd.get('volume') || '',
        prazo: fd.get('prazo') || '',
        nota: String(fd.get('nota') || '').trim()
      };
    };
    const build = () => {
      const b = read();
      const lines = ['Olá, Pedro! Vi seu portfólio e quero um orçamento.'];
      if (b.tipo || b.volume || b.prazo || b.nota) lines.push('');
      if (b.tipo) lines.push(`• Tipo: ${b.tipo}`);
      if (b.volume) lines.push(`• Quantidade: ${b.volume}`);
      if (b.prazo) lines.push(`• Prazo: ${b.prazo}`);
      if (b.nota) lines.push(`• Detalhes: ${b.nota}`);
      briefSend.href = waLink(lines.join('\n'));
    };
    brief.addEventListener('change', build);
    brief.addEventListener('input', build);
    brief.addEventListener('submit', e => e.preventDefault());
    briefSend.addEventListener('click', () => {
      const b = read();
      track('brief_send', { metadata: { tipo: b.tipo, volume: b.volume, prazo: b.prazo } });
    });
    build();
  }

  /* ---------- Copiar e-mail ---------- */

  const toastEl = $('[data-toast]');
  let toastTimer;
  const toast = msg => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  };

  $$('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (__) {}
        ta.remove();
      }
      toast(ok ? 'E-mail copiado ✓' : text);
      const label = $('span', btn);
      if (ok && label) {
        label.textContent = 'Copiado';
        setTimeout(() => { label.textContent = 'Copiar'; }, 2000);
      }
      track('email_copy');
    });
  });

  /* ==========================================================================
     Cursor personalizado e botões magnéticos (só mouse)
     ========================================================================== */

  const cursor = $('[data-cursor-el]');
  if (cursor && finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    cursor.classList.add('is-hidden');
    const dot = $('.cursor-dot', cursor);
    const ring = $('.cursor-ring', cursor);
    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      cursor.classList.remove('is-hidden');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      if (!t || !t.closest) return;
      const play = t.closest('[data-cursor="play"]');
      const link = !play && t.closest('a, button, label, input, textarea, select');
      cursor.classList.toggle('is-play', Boolean(play));
      cursor.classList.toggle('is-link', Boolean(link));
    });
    document.addEventListener('mouseout', e => { if (!e.relatedTarget) cursor.classList.add('is-hidden'); });
  }

  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.2;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* ==========================================================================
     Player
     ========================================================================== */

  const dlg = $('[data-player]');
  if (dlg) {
    const pv = $('[data-pl-video]', dlg);
    const stage = $('[data-pl-stage]', dlg);
    const kicker = $('[data-pl-kicker]', dlg);
    const titleEl = $('[data-pl-title]', dlg);
    const countEl = $('[data-pl-count]', dlg);
    const descEl = $('[data-pl-desc]', dlg);
    const ctaEl = $('[data-pl-cta]', dlg);
    const big = $('[data-pl-big]', dlg);
    const loading = $('[data-pl-loading]', dlg);
    const errEl = $('[data-pl-error]', dlg);
    const controls = $('[data-pl-controls]', dlg);
    const prog = $('[data-pl-progress]', dlg);
    const timeEl = $('[data-pl-time]', dlg);
    const playBtn = $('[data-pl-play]', dlg);
    const muteBtn = $('[data-pl-mute]', dlg);
    const fullBtn = $('[data-pl-full]', dlg);
    const prevBtn = $('[data-pl-prev]', dlg);
    const nextBtn = $('[data-pl-next]', dlg);
    const closeBtn = $('[data-pl-close]', dlg);
    const ids = PROJETOS.map(p => p.id);
    let currentId = null;
    let idleTimer;

    const fmt = s => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${pad(s % 60)}` : '0:00');
    const setIcon = (btn, icon, label) => {
      $('use', btn).setAttribute('href', `#${icon}`);
      btn.setAttribute('aria-label', label);
    };

    const wake = () => {
      controls.classList.remove('is-idle');
      clearTimeout(idleTimer);
      if (!pv.paused) idleTimer = setTimeout(() => controls.classList.add('is-idle'), 2400);
    };
    const syncPlay = () => {
      setIcon(playBtn, pv.paused ? 'i-play' : 'i-pause', pv.paused ? 'Reproduzir' : 'Pausar');
      big.hidden = !pv.paused || !errEl.hidden;
      wake();
    };
    const syncMute = () => setIcon(muteBtn, pv.muted ? 'i-mute' : 'i-vol', pv.muted ? 'Ativar som' : 'Silenciar');
    const syncTime = () => {
      const d = pv.duration || 0;
      const c = pv.currentTime || 0;
      timeEl.textContent = `${fmt(c)} / ${fmt(d)}`;
      const r = d ? c / d : 0;
      prog.value = String(Math.round(r * 1000));
      prog.style.setProperty('--p', `${(r * 100).toFixed(2)}%`);
    };

    const load = id => {
      const v = VIDEOS[id];
      if (!v) return;
      currentId = id;
      const idx = ids.indexOf(id);
      dlg.classList.toggle('is-h', v.formato === 'horizontal');
      kicker.textContent = v.categoria;
      titleEl.textContent = v.titulo;
      countEl.textContent = idx >= 0 ? `${pad(idx + 1)} / ${pad(ids.length)}` : '';
      prevBtn.hidden = idx < 0;
      nextBtn.hidden = idx < 0;
      descEl.textContent = v.resumo || '';
      ctaEl.href = waLink(
        id === APRESENTACAO.id
          ? 'Olá, Pedro! Assisti sua apresentação e quero conversar sobre um projeto.'
          : `Olá, Pedro! Vi o projeto "${v.titulo}" (${v.categoria}) no seu portfólio e quero um vídeo nesse estilo.`
      );
      errEl.hidden = true;
      big.hidden = true;
      loading.classList.add('is-on');
      pv.src = v.url;
      pv.muted = false;
      syncMute();
      syncTime();
      const attempt = pv.play();
      if (attempt && attempt.catch) attempt.catch(() => { loading.classList.remove('is-on'); big.hidden = false; });
    };

    const open = id => {
      if (!VIDEOS[id]) return;
      if (!dlg.open) {
        try { dlg.showModal(); } catch (_) { dlg.setAttribute('open', ''); }
        playerOpen = true;
        document.body.classList.add('player-open');
        if (lenis) lenis.stop();
        suspendPreviews(true);
      }
      load(id);
    };

    const close = () => {
      pv.pause();
      pv.removeAttribute('src');
      pv.load();
      loading.classList.remove('is-on');
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      if (dlg.open) dlg.close();
    };

    dlg.addEventListener('close', () => {
      playerOpen = false;
      currentId = null;
      document.body.classList.remove('player-open');
      if (lenis && !menuOpen) lenis.start();
      suspendPreviews(document.hidden);
    });

    const step = dir => {
      const idx = ids.indexOf(currentId);
      if (idx < 0) return;
      const nextId = ids[(idx + dir + ids.length) % ids.length];
      load(nextId);
      track('video_open', { video_name: `${VIDEOS[nextId].categoria} — ${VIDEOS[nextId].titulo}` });
    };
    const toggle = () => { if (pv.paused) safePlay(pv); else pv.pause(); };
    const toggleMute = () => { pv.muted = !pv.muted; syncMute(); };
    const toggleFull = () => {
      if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
      if (stage.requestFullscreen) {
        stage.requestFullscreen()
          .then(() => {
            try { screen.orientation.lock(dlg.classList.contains('is-h') ? 'landscape' : 'portrait').catch(() => {}); } catch (_) {}
          })
          .catch(() => { if (pv.webkitEnterFullscreen) pv.webkitEnterFullscreen(); });
      } else if (pv.webkitEnterFullscreen) {
        pv.webkitEnterFullscreen();
      }
    };

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-open-video]');
      if (!t) return;
      e.preventDefault();
      open(t.dataset.openVideo);
    });

    closeBtn.addEventListener('click', close);
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.classList.contains('pl-body')) close(); });
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));
    playBtn.addEventListener('click', toggle);
    big.addEventListener('click', toggle);
    pv.addEventListener('click', toggle);
    muteBtn.addEventListener('click', toggleMute);
    fullBtn.addEventListener('click', toggleFull);
    prog.addEventListener('input', () => {
      if (pv.duration) pv.currentTime = (Number(prog.value) / 1000) * pv.duration;
      syncTime();
    });

    pv.addEventListener('play', syncPlay);
    pv.addEventListener('pause', syncPlay);
    pv.addEventListener('ended', syncPlay);
    pv.addEventListener('timeupdate', syncTime);
    pv.addEventListener('loadedmetadata', syncTime);
    pv.addEventListener('durationchange', syncTime);
    pv.addEventListener('waiting', () => loading.classList.add('is-on'));
    pv.addEventListener('playing', () => loading.classList.remove('is-on'));
    pv.addEventListener('canplay', () => loading.classList.remove('is-on'));
    pv.addEventListener('error', () => {
      if (!pv.getAttribute('src')) return;
      loading.classList.remove('is-on');
      errEl.hidden = false;
      big.hidden = true;
    });

    stage.addEventListener('pointermove', wake);
    stage.addEventListener('pointerdown', wake);

    dlg.addEventListener('keydown', e => {
      const onRange = e.target.closest && e.target.closest('input[type="range"]');
      if (e.key === ' ' || e.key === 'k') {
        if (e.target.closest && e.target.closest('button, a')) return;
        e.preventDefault();
        toggle();
      } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !onRange) {
        e.preventDefault();
        step(e.key === 'ArrowRight' ? 1 : -1);
      } else if (e.key === 'm') {
        toggleMute();
      } else if (e.key === 'f') {
        toggleFull();
      }
    });

    // Deslizar para trocar de vídeo; deslizar para baixo fecha.
    let sx = 0;
    let sy = 0;
    let st = 0;
    let swipeOk = false;
    stage.addEventListener('touchstart', e => {
      const t = e.touches[0];
      swipeOk = !(e.target.closest && e.target.closest('.pl-controls'));
      sx = t.clientX;
      sy = t.clientY;
      st = Date.now();
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (!swipeOk || Date.now() - st > 700) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
      else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.4) close();
    }, { passive: true });
  }

  /* ==========================================================================
     Ajustes finais
     ========================================================================== */

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitWordmark, 150);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { fitWordmark(); refreshLayout(50); });
  }

  fitWordmark();
  onScroll();
})();
