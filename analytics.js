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
  document.addEventListener('click', event => {
    const whatsapp = event.target.closest?.('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (whatsapp) {
      track('whatsapp_click', { metadata: { label: clean(text(whatsapp)), section: clean(whatsapp.closest('section')?.id || '') } });
      return;
    }

    const gallery = event.target.closest?.('.project-gallery-item');
    if (gallery) {
      track('video_open', { video_name: gallery.dataset.videoTitle || text(gallery) });
      return;
    }

    const watch = event.target.closest?.('.watch-button');
    if (watch) {
      const card = watch.closest('.work-card');
      track('project_open', { project_name: text(card?.querySelector('h3')) || watch.dataset.videoTitle || text(watch) });
      return;
    }

    const presentation = event.target.closest?.('[data-mobile-presentation], [data-video-title*="apresenta" i]');
    if (presentation) track('presentation_open', { video_name: presentation.dataset.videoTitle || 'Vídeo de apresentação' });
  }, true);

  const attached = new WeakSet();
  const videoState = new WeakMap();
  const getName = video => {
    const hub = video.closest?.('.ph-video-hub');
    if (hub) {
      const kicker = text(hub.querySelector('.ph-video-title-copy small'));
      const title = text(hub.querySelector('.ph-video-title-copy strong'));
      return [kicker, title].filter(Boolean).join(' — ') || 'Vídeo';
    }
    return video.dataset.videoTitle || 'Vídeo';
  };
  const attachVideo = video => {
    if (!video || attached.has(video) || video.classList.contains('work-preview-video')) return;
    attached.add(video);
    videoState.set(video, { name: '', milestones: new Set() });

    video.addEventListener('play', () => {
      const state = videoState.get(video);
      const name = getName(video);
      if (state.name !== name) { state.name = name; state.milestones.clear(); }
      track(/apresenta/i.test(name) ? 'presentation_play' : 'video_play', { video_name: name });
    });

    video.addEventListener('timeupdate', () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const state = videoState.get(video);
      const name = getName(video);
      if (state.name !== name) { state.name = name; state.milestones.clear(); }
      const pct = (video.currentTime / video.duration) * 100;
      [25, 50, 75].forEach(mark => {
        if (pct >= mark && !state.milestones.has(mark)) {
          state.milestones.add(mark);
          track(`video_${mark}`, { video_name: name, video_progress: mark });
        }
      });
    });

    video.addEventListener('ended', () => {
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
})();
