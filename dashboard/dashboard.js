(() => {
  const cfg = window.PH_ANALYTICS_CONFIG || {};
  const page = document.body.dataset.page || 'login';
  const setupState = document.querySelector('[data-setup]');
  const authState = document.querySelector('[data-auth]');
  const dashboard = document.querySelector('[data-dashboard]');
  const loginForm = document.querySelector('[data-login-form]');
  const loginStatus = document.querySelector('[data-login-status]');
  const dataStatus = document.querySelector('[data-data-status]');
  const periodSelect = document.querySelector('[data-period]');
  const periodCopy = document.querySelector('[data-period-copy]');
  const refreshButton = document.querySelector('[data-refresh]');
  const logoutButton = document.querySelector('[data-logout]');

  const apiUrl = String(cfg.supabaseUrl || '').replace(/\/$/, '');
  const apiKey = String(cfg.supabasePublishableKey || '');
  const configured = Boolean(apiUrl && apiKey);
  const TOKEN_KEY = 'ph_dashboard_token';
  const USER_KEY = 'ph_dashboard_user';

  const show = (el, on) => { if (el) el.hidden = !on; };
  const format = value => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
  const formatDuration = value => {
    const seconds = Math.max(0, Math.round(Number(value || 0)));
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    if (minutes < 60) return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  };
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const readToken = () => {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (_) { return ''; }
  };
  const saveSession = (token, username) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, username || 'ph_admin');
    } catch (_) {}
  };
  const clearSession = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (_) {}
  };

  if (!configured) {
    show(setupState, true);
    show(authState, false);
    show(dashboard, false);
    return;
  }

  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const callRpc = async (name, args = {}) => {
    const response = await fetch(`${apiUrl}/rest/v1/rpc/${encodeURIComponent(name)}`, {
      method: 'POST',
      headers: apiHeaders,
      body: JSON.stringify(args),
      cache: 'no-store'
    });

    const raw = await response.text();
    let data = null;
    if (raw) {
      try { data = JSON.parse(raw); }
      catch (_) { data = raw; }
    }

    if (!response.ok) {
      const message = typeof data === 'object' && data?.message ? data.message : `Erro ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  const rpc = async (name, days) => {
    const token = readToken();
    if (!token) throw new Error('forbidden');
    return callRpc(name, { p_token: token, p_days: days });
  };

  if (page === 'login') {
    show(setupState, false);
    show(authState, true);

    if (readToken()) {
      location.replace('painel.html');
      return;
    }

    const params = new URLSearchParams(location.search);
    if (params.get('expired') === '1' && loginStatus) {
      loginStatus.textContent = 'Sua sessão expirou. Entre novamente.';
    }

    loginForm?.addEventListener('submit', async event => {
      event.preventDefault();
      const form = new FormData(loginForm);
      const username = String(form.get('username') || '').trim();
      const password = String(form.get('password') || '');
      if (!username || !password) return;

      const submit = loginForm.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;
      if (loginStatus) loginStatus.textContent = 'Entrando…';

      try {
        const data = await callRpc('dashboard_login', {
          p_username: username,
          p_password: password
        });

        if (!data?.token) {
          if (loginStatus) loginStatus.textContent = data?.locked
            ? 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
            : 'Usuário ou senha inválidos.';
          return;
        }

        saveSession(data.token, data.username || username);
        location.replace('painel.html');
      } catch (error) {
        if (loginStatus) loginStatus.textContent = `Não foi possível conectar: ${error?.message || 'erro de conexão'}`;
      } finally {
        if (submit) submit.disabled = false;
      }
    });
    return;
  }

  if (!readToken()) {
    location.replace('./');
    return;
  }

  show(setupState, false);
  show(dashboard, true);

  let charts = {};
  const destroyChart = key => {
    if (charts[key]) { charts[key].destroy(); delete charts[key]; }
  };
  const chartText = '#a1a39b';
  const chartGrid = 'rgba(244,244,238,.08)';
  const accent = '#b9ff3f';
  const ink = '#f4f4ee';

  if (window.Chart) {
    Chart.defaults.color = chartText;
    Chart.defaults.borderColor = chartGrid;
    Chart.defaults.font.family = 'Inter Tight, sans-serif';
  }

  const renderKpis = overview => {
    Object.entries(overview || {}).forEach(([key, value]) => {
      document.querySelectorAll(`[data-kpi="${key}"]`).forEach(node => {
        node.textContent = node.hasAttribute('data-time') ? formatDuration(value) : format(value);
      });
    });
  };

  const renderDaily = rows => {
    const canvas = document.querySelector('[data-chart="daily"]');
    if (!canvas || !window.Chart) return;
    destroyChart('daily');
    charts.daily = new Chart(canvas, {
      type: 'line',
      data: {
        labels: rows.map(r => new Date(`${r.day}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
        datasets: [
          { label: 'Visitantes', data: rows.map(r => Number(r.visitors || 0)), borderColor: accent, backgroundColor: 'rgba(185,255,63,.12)', fill: true, tension: .32, borderWidth: 2, pointRadius: 2 },
          { label: 'Plays', data: rows.map(r => Number(r.video_plays || 0)), borderColor: ink, backgroundColor: 'transparent', tension: .32, borderWidth: 1.5, pointRadius: 1 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: true, labels: { boxWidth: 9, boxHeight: 9 } } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  };

  const renderSources = rows => {
    const canvas = document.querySelector('[data-chart="sources"]');
    if (!canvas || !window.Chart) return;
    destroyChart('sources');
    charts.sources = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: rows.map(r => r.source || 'direto'),
        datasets: [{ data: rows.map(r => Number(r.sessions || 0)), backgroundColor: [accent, '#f4f4ee', '#66745a', '#2f3829', '#1e241b', '#9fbf6b'], borderColor: '#101210', borderWidth: 2 }]
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, padding: 16 } } } }
    });
  };

  const renderVideos = rows => {
    const canvas = document.querySelector('[data-chart="videos"]');
    if (canvas && window.Chart) {
      destroyChart('videos');
      charts.videos = new Chart(canvas, {
        type: 'bar',
        data: { labels: rows.map(r => r.video_name), datasets: [{ label: 'Plays', data: rows.map(r => Number(r.plays || 0)), backgroundColor: accent, borderWidth: 0, borderRadius: 2 }] },
        options: { responsive: true, maintainAspectRatio: false, indexAxis: rows.length > 4 ? 'y' : 'x', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { grid: { display: false } } } }
      });
    }

    const list = document.querySelector('[data-video-list]');
    if (!list) return;
    if (!rows.length) {
      list.innerHTML = '<p class="empty-mobile">Ainda não há reproduções suficientes para montar o ranking.</p>';
      return;
    }

    list.innerHTML = rows.slice(0, 5).map((row, index) => `
      <div class="mobile-video-item">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <strong>${escapeHtml(row.video_name || 'Vídeo')}</strong>
        <b>${format(row.plays)} plays</b>
      </div>`).join('');
  };

  const renderFunnel = rows => {
    const root = document.querySelector('[data-funnel]');
    if (!root) return;
    if (!rows.length) {
      root.innerHTML = '<p class="muted">Os dados de retenção aparecerão depois dos primeiros plays.</p>';
      return;
    }
    root.innerHTML = rows.slice(0, 6).map(r => `
      <article class="funnel-item">
        <div class="funnel-top"><strong>${escapeHtml(r.video_name || 'Vídeo')}</strong><span>${format(r.plays)} plays</span></div>
        <div class="funnel-bars">
          <span><b>${format(r.plays)}</b>Play</span>
          <span><b>${format(r.reached_25)}</b>25%</span>
          <span><b>${format(r.reached_50)}</b>50%</span>
          <span><b>${format(r.reached_75)}</b>75%</span>
          <span><b>${format(r.completed)}</b>100%</span>
        </div>
      </article>`).join('');
  };

  const updatePeriodLabel = days => {
    if (!periodCopy) return;
    const labels = { 7: 'Últimos 7 dias', 30: 'Últimos 30 dias', 90: 'Últimos 90 dias', 365: 'Últimos 12 meses' };
    periodCopy.textContent = labels[days] || `Últimos ${days} dias`;
  };

  const loadDashboard = async () => {
    const days = Math.max(1, Number(periodSelect?.value || 30));
    const isMobile = matchMedia('(max-width: 720px)').matches;
    updatePeriodLabel(days);
    if (dataStatus) dataStatus.textContent = 'Atualizando…';
    if (refreshButton) refreshButton.disabled = true;

    try {
      const coreRequests = [
        rpc('analytics_overview_token', days),
        rpc('analytics_daily_token', days),
        rpc('analytics_top_videos_token', days)
      ];
      const detailRequests = isMobile ? [] : [
        rpc('analytics_video_funnel_token', days),
        rpc('analytics_sources_token', days)
      ];
      const results = await Promise.all([...coreRequests, ...detailRequests]);
      const [overview, daily, videos] = results;
      const funnel = isMobile ? [] : results[3];
      const sources = isMobile ? [] : results[4];

      renderKpis(overview || {});
      renderDaily(Array.isArray(daily) ? daily : []);
      renderVideos(Array.isArray(videos) ? videos : []);
      if (!isMobile) {
        renderFunnel(Array.isArray(funnel) ? funnel : []);
        renderSources(Array.isArray(sources) ? sources : []);
      }
      if (dataStatus) dataStatus.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
    } catch (error) {
      const forbidden = /forbidden|42501|permission/i.test(String(error?.message || ''));
      if (forbidden) {
        clearSession();
        location.replace('./?expired=1');
        return;
      }
      if (dataStatus) dataStatus.textContent = `Não foi possível carregar os dados: ${error?.message || 'erro desconhecido'}`;
    } finally {
      if (refreshButton) refreshButton.disabled = false;
    }
  };

  logoutButton?.addEventListener('click', async () => {
    const token = readToken();
    if (token) {
      try { await callRpc('dashboard_logout', { p_token: token }); } catch (_) {}
    }
    clearSession();
    location.replace('./');
  });

  refreshButton?.addEventListener('click', loadDashboard);
  periodSelect?.addEventListener('change', loadDashboard);
  loadDashboard();
})();
