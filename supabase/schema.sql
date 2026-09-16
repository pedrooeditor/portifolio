create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  session_id text not null,
  event_name text not null,
  page_path text,
  referrer_host text,
  traffic_source text,
  utm_medium text,
  utm_campaign text,
  project_name text,
  video_name text,
  video_progress smallint check (video_progress is null or video_progress between 0 and 100),
  device_type text,
  viewport_width integer,
  viewport_height integer,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_video_name_idx on public.analytics_events (video_name);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

revoke all on table public.analytics_events from anon, authenticated;
grant insert on table public.analytics_events to anon, authenticated;

create policy "public can insert analytics events"
on public.analytics_events
for insert
to anon, authenticated
with check (true);

create table if not exists public.analytics_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.analytics_admins enable row level security;
revoke all on table public.analytics_admins from anon, authenticated;

create or replace function public.is_analytics_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.analytics_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_analytics_admin() from public;
grant execute on function public.is_analytics_admin() to authenticated;

create or replace function public.analytics_overview(p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  since_ts timestamptz;
  result jsonb;
begin
  if not public.is_analytics_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  since_ts := now() - make_interval(days => greatest(coalesce(p_days, 30), 1));
  select jsonb_build_object(
    'visitors', count(distinct visitor_id),
    'sessions', count(distinct session_id),
    'page_views', count(*) filter (where event_name = 'page_view'),
    'project_opens', count(*) filter (where event_name in ('project_open','video_open')),
    'video_plays', count(*) filter (where event_name in ('video_play','presentation_play')),
    'whatsapp_clicks', count(*) filter (where event_name = 'whatsapp_click')
  ) into result
  from public.analytics_events
  where created_at >= since_ts;
  return result;
end;
$$;

create or replace function public.analytics_daily(p_days integer default 30)
returns table (
  day date,
  visitors bigint,
  sessions bigint,
  page_views bigint,
  video_plays bigint,
  whatsapp_clicks bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_analytics_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  select
    e.created_at::date as day,
    count(distinct e.visitor_id) as visitors,
    count(distinct e.session_id) as sessions,
    count(*) filter (where e.event_name = 'page_view') as page_views,
    count(*) filter (where e.event_name in ('video_play','presentation_play')) as video_plays,
    count(*) filter (where e.event_name = 'whatsapp_click') as whatsapp_clicks
  from public.analytics_events e
  where e.created_at >= now() - make_interval(days => greatest(coalesce(p_days, 30), 1))
  group by e.created_at::date
  order by day;
end;
$$;

create or replace function public.analytics_top_videos(p_days integer default 30)
returns table (
  video_name text,
  plays bigint,
  completed bigint,
  completion_rate numeric
)
language plpgsql
security definer
set search_path = public
as $$;
begin
  if not public.is_analytics_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  with grouped as (
    select
      e.video_name,
      count(*) filter (where e.event_name in ('video_play','presentation_play')) as plays,
      count(*) filter (where e.event_name = 'video_complete') as completed
    from public.analytics_events e
    where e.created_at >= now() - make_interval(days => greatest(coalesce(p_days, 30), 1))
      and e.video_name is not null
      and e.video_name <> ''
    group by e.video_name
  )
  select
    g.video_name,
    g.plays,
    g.completed,
    case when g.plays = 0 then 0 else round((g.completed::numeric / g.plays::numeric) * 100, 1) end
  from grouped g
  where g.plays > 0
  order by g.plays desc, g.video_name;
end;
$$;

create or replace function public.analytics_video_funnel(p_days integer default 30)
returns table (
  video_name text,
  plays bigint,
  reached_25 bigint,
  reached_50 bigint,
  reached_75 bigint,
  completed bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_analytics_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  select
    e.video_name,
    count(*) filter (where e.event_name in ('video_play','presentation_play')) as plays,
    count(*) filter (where e.event_name = 'video_25') as reached_25,
    count(*) filter (where e.event_name = 'video_50') as reached_50,
    count(*) filter (where e.event_name = 'video_75') as reached_75,
    count(*) filter (where e.event_name = 'video_complete') as completed
  from public.analytics_events e
  where e.created_at >= now() - make_interval(days => greatest(coalesce(p_days, 30), 1))
    and e.video_name is not null
    and e.video_name <> ''
  group by e.video_name
  order by plays desc, e.video_name;
end;
$$;

create or replace function public.analytics_sources(p_days integer default 30)
returns table (
  source text,
  sessions bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_analytics_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  select
    coalesce(nullif(e.traffic_source, ''), 'direto') as source,
    count(distinct e.session_id) as sessions
  from public.analytics_events e
  where e.created_at >= now() - make_interval(days => greatest(coalesce(p_days, 30), 1))
  group by coalesce(nullif(e.traffic_source, ''), 'direto')
  order by sessions desc, source;
end;
$$;

revoke all on function public.analytics_overview(integer) from public;
revoke all on function public.analytics_daily(integer) from public;
revoke all on function public.analytics_top_videos(integer) from public;
revoke all on function public.analytics_video_funnel(integer) from public;
revoke all on function public.analytics_sources(integer) from public;

grant execute on function public.analytics_overview(integer) to authenticated;
grant execute on function public.analytics_daily(integer) to authenticated;
grant execute on function public.analytics_top_videos(integer) to authenticated;
grant execute on function public.analytics_video_funnel(integer) to authenticated;
grant execute on function public.analytics_sources(integer) to authenticated;

-- Depois de criar seu usuário na Auth do Supabase, libere a dashboard com:
-- insert into public.analytics_admins (email) values ('SEU_EMAIL_DE_LOGIN');
