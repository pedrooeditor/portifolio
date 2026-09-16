(() => {
  const cfg = window.PH_ANALYTICS_CONFIG || {};
  const setupState = document.querySelector('[data-setup]');
  const authState = document.querySelector('[data-auth]');
  const dashboard = document.querySelector('[data-dashboard]');
  const loginForm = document.querySelector('[data-login-form]');
  const loginStatus = document.querySelector('[data-login-status]');
  const dataStatus = document.querySelector('[data-data-status]');
  const periodSelect = document.querySelector('[data-period]');
  const refreshButton = document.querySelector('[data-refresh]');
  const logoutButton = document.querySelector('[data-logout]');
  const configured = Boolean(cfg.supabaseUrl && cfg.supabasePublishableKey && window.supabase);
  const show = (el, on) => { if (el) el.hidden = !on; };
  const format = value => new Intl.NumberFormat('pt-BR').format(Number(value || 0));

  if (!configured) {
    show(setupState, true);
    show(authState, false);
    show(dashboard, false);
    return;
  }

  const client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });

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

  const rpc = async (name, days) => {
    const { data, error } = await client.rpc(name, { p_days: days });
    if (error) throw error;
    return data;
  };

  const renderKpis = overview => {
    Object.entries(overview || {}).forEach(([key, value]) => {
      const node = document.querySelector(`[data-kpi="${key}"]`);
      if (node) node.textContent = format(value);
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
        plugins: { legend: { display: true, labels: { boxWidth: 10, boxHeight: 10 } } },
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
    if (!canvas || !window.Chart) return;
    destroyChart('videos');
    charts.videos = new Chart(canvas, {
      type: 'bar',
      data: { labels: rows.map(r => r.video_name), datasets: [{ label: 'Plays', data: rows.map(r => Number(r.plays || 0)), backgroundColor: accent, borderWidth: 0, borderRadius: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, indexAxis: rows.length > 4 ? 'y' : 'x', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { grid: { display: false } } } }
    });
  };

  const renderFunnel = rows => {
    const root = document.querySelector('[data-funnel]');
    if (!root) return;
    if (!rows.length) { root.innerHTML = '<p class="muted">Os dados de retenção aparecerão depois dos primeiros plays.</p>'; return; }
    root.innerHTML = rows.slice(0, 6).map(r => `
      <article class="funnel-item">
        <div class="funnel-top"><strong>${String(r.video_name || 'Vídeo').replace(/[<>&"]/g, '')}</strong><span>${format(r.plays)} plays</span></div>
        <div class="funnel-bars">
          <span><b>${format(r.plays)}</b>Play</span>
          <span><b>${format(r.reached_25)}</b>25%</span>
          <span><b>${format(r.reached_50)}</b>50%</span>
          <span><b>${format(r.reached_75)}</b>75%</span>
          <span><b>${format(r.completed)}</b>100%</span>
        </div>
      </article>`).join('');
  };

  const loadDashboard = async () => {
    const days = Math.max(1, Number(periodSelect?.value || 30));
    if (dataStatus) dataStatus.textContent = 'Atualizando dados…';
    if (refreshButton) refreshButton.disabled = true;
    try {
      const [overview, daily, videos, funnel, sources] = await Promise.all([
        rpc('analytics_overview', days),
        rpc('analytics_daily', days),
        rpc('analytics_top_videos', days),
        rpc('analytics_video_funnel', days),
        rpc('analytics_sources', days)
      ]);
      renderKpis(overview || {});
      renderDaily(Array.isArray(daily) ? daily : []);
      renderVideos(Array.isArray(videos) ? videos : []);
      renderFunnel(Array.isArray(funnel) ? funnel : []);
      renderSources(Array.isArray(sources) ? sources : []);
      if (dataStatus) dataStatus.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`;
    } catch (error) {
      const forbidden = /forbidden|42501|permission/i.test(String(error?.message || ''));
      if (dataStatus) dataStatus.textContent = forbidden ? 'Este usuário ainda não foi autorizado como administrador do analytics.' : `Não foi possível carregar os dados: ${error?.message || 'erro desconhecido'}`;
    } finally {
      if (refreshButton) refreshButton.disabled = false;
    }
  };

  const applySession = async session => {
    const signedIn = Boolean(session?.user);
    show(setupState, false);
    show(authState, !signedIn);
    show(dashboard, signedIn);
    if (signedIn) await loadDashboard();
  };

  loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (loginStatus) loginStatus.textContent = 'Entrando…';
    const form = new FormData(loginForm);
    const { data, error } = await client.auth.signInWithPassword({ email: String(form.get('email') || ''), password: String(form.get('password') || '') });
    if (error) { if (loginStatus) loginStatus.textContent = 'E-mail ou senha inválidos.'; return; }
    if (loginStatus) loginStatus.textContent = '';
    await applySession(data.session);
  });

  logoutButton?.addEventListener('click', async () => { await client.auth.signOut(); await applySession(null); });
  refreshButton?.addEventListener('click', loadDashboard);
  periodSelect?.addEventListener('change', loadDashboard);

  client.auth.onAuthStateChange((_event, session) => {
    if (!session) applySession(null);
  });

  client.auth.getSession().then(({ data }) => applySession(data.session));
})();
