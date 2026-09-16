(() => {
  const cfg = window.PH_ANALYTICS_CONFIG || {};
  const url = String(cfg.supabaseUrl || '').replace(/\/$/, '');
  const key = String(cfg.supabasePublishableKey || '');
  if (!url || !key) return;

  const endpoint = `${url}/rest/v1/analytics_events`;
  const storage = window.localStorage;
  const session = window.sessionStorage;
  const uuid = () => (crypto?.randomUUID ? crypto.randomUUID() : `ph-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const readOrCreate = (store, keyName) => {
    try {
      let value = store.getItem(keyName);
      if (!value) { value = uuid(); store.setItem(keyName, value); }
      return value;
    } catch (_) { return uuid(); }
  };

  const visitorId = readOrCreate(storage, 'ph_visitor_id');
  const sessionId = readOrCreate(session, 'ph_session_id');
  const params = new URLSearchParams(location.search);
  const referrerHost = (() => {
    try { return document.referrer ? new URL(document.referrer).hostname : ''; } catch (_) { return ''; }
  })();
  const trafficSource = params.get('utm_source') || referrerHost || 'direto';
  const deviceType = innerWidth <= 760 ? 'mobile' : innerWidth <= 1100 ? 'tablet' : 'desktop';
  const clean = value => value == null ? null : String(value).slice(0, 240);

  const track = (eventName, extra = {}) => {
    if (!eventName) return;
    const payload = {
      visitor_id: visitorId,
      session_id: sessionId,
      event_name: clean(eventName),
      page_path: clean(location.pathname),
      referrer_host: clean(referrerHost),
      traffic_source: clean(trafficSource),
      utm_medium: clean(params.get('utm_medium')),
      utm_campaign: clean(params.get('utm_campaign')),
      project_name: clean(extra.project_name),
      video_name: clean(extra.video_name),
      video_progress: Number.isFinite(extra.video_progress) ? Math.max(0, Math.min(100, Math.round(extra.video_progress))) : null,
      engaged_seconds: Number.isFinite(extra.engaged_seconds) ? Math.max(0, Math.round(extra.engaged_seconds)) : null,
      watch_seconds: Number.isFinite(extra.watch_seconds) ? Math.max(0, Math.round(extra.watch_seconds)) : null,
      device_type: deviceType,
      viewport_width: innerWidth,
      viewport_height: innerHeight,
      metadata: extra.metadata && typeof extra.metadata === 'object' ? extra.metadata : {}
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  };

  window.phTrack = track;

  try {
    if (!session.getItem('ph_session_started')) {
      session.setItem('ph_session_started', '1');
      track('session_start');
    }
  } catch (_) { track('session_start'); }
  track('page_view');

  const text = el => (el?.textContent || '').replace(/\s+/g, ' ').trim();
  const safeHref = el => {
    try {
      const href = el?.getAttribute?.('href') || '';
      if (!href) return '';
      const parsed = new URL(href, location.href);
      return parsed.origin === location.origin ? `${parsed.pathname}${parsed.hash}` : parsed.hostname;
    } catch (_) { return ''; }
  };

  document.addEventListener('click', event => {
    const interactive = event.target.closest?.('a, button, [role="button"]');
    if (interactive) {
      track('click', {
        metadata: {
          label: clean(text(interactive) || interactive.getAttribute('aria-label') || ''),
          target: clean(safeHref(interactive)),
          section: clean(interactive.closest('section')?.id || '')
        }
      });
    }

    const whatsapp = event.target.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (whatsapp) {
      track('whatsapp_click', { metadata: { label: clean(text(whatsapp)), section: clean(whatsapp.closest('section')?.id || '') } });
    }

    const gallery = event.target.closest?.('.project-gallery-item');
    if (gallery) track('video_open', { video_name: gallery.dataset.videoTitle || text(gallery) });

    const watch = event.target.closest?.('.watch-button');
    if (watch) {
      const card = watch.closest('.work-card');
      track('project_open', { project_name: text(card?.querySelector('h3')) || watch.dataset.videoTitle || text(watch) });
    }

    const presentation = event.target.closest?.('[data-mobile-presentation], [data-video-title*="apresenta" i]');
    if (presentation) track('presentation_open', { video_name: presentation.dataset.videoTitle || 'Vídeo de apresentação' });
  }, true);

  let activeSince = document.visibilityState === 'visible' ? Date.now() : null;
  let pendingEngaged = 0;
  const accrueEngagement = () => {
    if (activeSince == null) return;
    const now = Date.now();
    pendingEngaged += Math.max(0, (now - activeSince) / 1000);
    activeSince = now;
  };
  const flushEngagement = () => {
    accrueEngagement();
    const seconds = Math.floor(pendingEngaged);
    if (seconds > 0) {
      pendingEngaged -= seconds;
      track('session_engagement', { engaged_seconds: seconds });
    }
  };

  const attached = new WeakSet();
  const videoStates = new Map();
  const getName = video => {
    const hub = video.closest?.('.ph-video-hub');
    if (hub) {
      const kicker = text(hub.querySelector('.ph-video-title-copy small'));
      const title = text(hub.querySelector('.ph-video-title-copy strong'));
      return [kicker, title].filter(Boolean).join(' — ') || 'Vídeo';
    }
    return video.dataset.videoTitle || 'Vídeo';
  };

  const accrueVideo = (video, state) => {
    if (!state || state.watchSince == null) return;
    const now = Date.now();
    if (!video.paused && !video.ended && document.visibilityState === 'visible') {
      state.pendingWatch += Math.max(0, (now - state.watchSince) / 1000);
    }
    state.watchSince = (!video.paused && !video.ended && document.visibilityState === 'visible') ? now : null;
  };
  const flushVideo = (video, state) => {
    accrueVideo(video, state);
    const seconds = Math.floor(state.pendingWatch);
    if (seconds > 0) {
      state.pendingWatch -= seconds;
      track('video_watch', { video_name: state.name || getName(video), watch_seconds: seconds });
    }
  };

  const attachVideo = video => {
    if (!video || attached.has(video) || video.classList.contains('work-preview-video')) return;
    attached.add(video);
    const state = { name: '', milestones: new Set(), watchSince: null, pendingWatch: 0 };
    videoStates.set(video, state);

    video.addEventListener('play', () => {
      const name = getName(video);
      if (state.name !== name) {
        flushVideo(video, state);
        state.name = name;
        state.milestones.clear();
        state.pendingWatch = 0;
      }
      state.watchSince = document.visibilityState === 'visible' ? Date.now() : null;
      track(/apresenta/i.test(name) ? 'presentation_play' : 'video_play', { video_name: name });
    });

    video.addEventListener('timeupdate', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const name = getName(video);
      if (state.name !== name) {
        flushVideo(video, state);
        state.name = name;
        state.milestones.clear();
        state.pendingWatch = 0;
      }
      const pct = (video.currentTime / video.duration) * 100;
      [25, 50, 75].forEach(mark => {
        if (pct >= mark && !state.milestones.has(mark)) {
          state.milestones.add(mark);
          track(`video_${mark}`, { video_name: name, video_progress: mark });
        }
      });
    });

    video.addEventListener('pause', () => flushVideo(video, state));
    video.addEventListener('ended', () => {
      flushVideo(video, state);
      track('video_complete', { video_name: getName(video), video_progress: 100 });
    });
  };

  const scanVideos = root => {
    if (root?.matches?.('video')) attachVideo(root);
    root?.querySelectorAll?.('video').forEach(attachVideo);
  };
  scanVideos(document);
  new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(node => {
    if (node.nodeType === 1) scanVideos(node);
  }))).observe(document.documentElement, { childList: true, subtree: true });

  const flushAllVideos = () => videoStates.forEach((state, video) => flushVideo(video, state));

  document.addEventListener('visibilitychange', () => {
    accrueEngagement();
    if (document.visibilityState === 'visible') {
      activeSince = Date.now();
      videoStates.forEach((state, video) => {
        if (!video.paused && !video.ended) state.watchSince = Date.now();
      });
    } else {
      activeSince = null;
      flushEngagement();
      flushAllVideos();
    }
  });

  setInterval(() => {
    if (document.visibilityState === 'visible') flushEngagement();
    flushAllVideos();
  }, 15000);

  window.addEventListener('pagehide', () => {
    flushEngagement();
    flushAllVideos();
  });
})();