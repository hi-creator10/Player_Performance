import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

/**
 * LandingPage - Public marketing page describing the platform
 */

const STATS = [
  { value: 7642, suffix: '+', label: 'Active athletes' },
  { value: 418, suffix: '', label: 'Coaches onboard' },
  { value: 36900, suffix: '+', label: 'Matches analysed' },
  { value: 94, suffix: '%', label: 'Report faster progress' },
];

const FEATURES = [
  {
    title: 'Performance Scoring',
    text: 'Sport-specific formulas turn raw match stats into a single, comparable 0–100 performance score.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'AI Performance Coach',
    text: 'A built-in AI assistant reads each player’s history and answers questions with personalised advice.',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    color: 'from-violet-500 to-fuchsia-400',
  },
  {
    title: 'Smart Suggestions',
    text: 'Automatic training recommendations highlight weak areas and what to work on before the next match.',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    color: 'from-amber-500 to-orange-400',
  },
  {
    title: 'Coach Dashboard',
    text: 'Manage your squad, log matches in seconds and export team performance reports to CSV.',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    title: 'Real-time Sync',
    text: 'Scores and charts update live the moment a coach submits a match — no refresh needed.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    color: 'from-sky-500 to-indigo-400',
  },
  {
    title: 'Works Offline',
    text: 'Log data from the ground with patchy signal. Everything syncs automatically once you reconnect.',
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    color: 'from-rose-500 to-pink-400',
  },
];

const SPORTS = [
  {
    name: 'Cricket',
    emoji: '🏏',
    metrics: ['Runs & strike rate', 'Wickets & economy', 'Catches', 'Overs bowled'],
    accent: 'from-emerald-500/20 to-emerald-500/0',
  },
  {
    name: 'Football',
    emoji: '⚽',
    metrics: ['Goals & assists', 'Passes completed', 'Tackles made', 'Minutes played'],
    accent: 'from-blue-500/20 to-blue-500/0',
  },
  {
    name: 'Basketball',
    emoji: '🏀',
    metrics: ['Points scored', 'Rebounds & assists', 'Steals', 'Field goal %'],
    accent: 'from-orange-500/20 to-orange-500/0',
  },
];

const STEPS = [
  { title: 'Create your account', text: 'Sign up as a coach or a player and pick your sport.' },
  { title: 'Log every match', text: 'Coaches enter match stats; scores are calculated instantly.' },
  { title: 'Track & improve', text: 'Players follow trends, get AI insights and act on suggestions.' },
];

const CHART_POINTS = [42, 55, 48, 63, 58, 71, 69, 78, 84];

const Icon = ({ d, className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

/** Counts up from 0 to `end` once the element scrolls into view */
const CountUp = ({ end, suffix }) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end]);

  return <span ref={ref}>{value.toLocaleString('en-IN')}{suffix}</span>;
};

/** Decorative dashboard preview shown in the hero */
const DashboardPreview = () => {
  const width = 300;
  const height = 110;
  const step = width / (CHART_POINTS.length - 1);
  const points = CHART_POINTS.map((p, i) => `${i * step},${height - (p / 100) * height}`).join(' ');

  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/30 via-violet-500/30 to-fuchsia-500/30 blur-3xl rounded-full" />
      <div className="relative rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center font-semibold text-white">AK</div>
            <div>
              <p className="text-sm font-semibold text-white">Player overview</p>
              <p className="text-xs text-slate-400">Cricket · All-rounder</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300">▲ 12% this month</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Current', value: '84' },
            { label: 'Average', value: '63' },
            { label: 'Matches', value: '27' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white/5 border border-white/5 p-4">
          <p className="text-xs text-slate-400 mb-3">Performance trend</p>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="trendLine" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
            <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#trendFill)" />
            <polyline points={points} fill="none" stroke="url(#trendLine)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-xl bg-violet-500/10 border border-violet-500/20 p-3">
          <span className="text-lg" aria-hidden="true">✨</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-violet-300">AI Coach:</span> Your strike rate is up 18% over the last 5 innings. Focus on death-over bowling to lift your economy.
          </p>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const { isAuthenticated, userRole } = useAuth();
  const dashboardPath = userRole === 'coach' ? '/coach' : '/player';
  const primaryCta = isAuthenticated
    ? { to: dashboardPath, label: 'Go to dashboard' }
    : { to: '/login?mode=register', label: 'Get started free' };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="font-bold text-lg tracking-tight">NeuroPlay<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Lite</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#sports" className="hover:text-white transition-colors">Sports</a>
            <a href="#partner" className="hover:text-white transition-colors">Sportsathon</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            {!isAuthenticated && (
              <Link to="/login" className="hidden sm:inline-block text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign in
              </Link>
            )}
            <Link
              to={primaryCta.to}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-white text-slate-900 hover:bg-slate-200 transition-colors"
            >
              {isAuthenticated ? 'Dashboard' : 'Get started'}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-blue-600/25 via-violet-600/10 to-transparent rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
          <div className="text-center lg:text-left animate-slide-up">
            <a
              href="#partner"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 hover:bg-white/10 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In collaboration with <span className="font-semibold text-white">Sportsathon</span>
              <span aria-hidden="true">→</span>
            </a>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Turn every match into
              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                measurable progress.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
              The performance analytics platform for coaches and athletes in cricket, football and basketball.
              Log matches, get a clear performance score, and receive AI-powered coaching insights — all in one place.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to={primaryCta.to}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-violet-600/25 transition-all"
              >
                {primaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-slate-200 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Explore features
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {['from-blue-500 to-cyan-400', 'from-violet-500 to-fuchsia-400', 'from-amber-500 to-orange-400', 'from-emerald-500 to-teal-400'].map((g, i) => (
                  <div key={g} className={`w-9 h-9 rounded-full border-2 border-slate-950 bg-gradient-to-br ${g} flex items-center justify-center text-xs font-bold text-white`}>
                    {['RS', 'PM', 'AK', 'NJ'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-400">
                Trusted by <span className="font-semibold text-white">7,600+ athletes</span> across India
              </p>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto lg:max-w-none animate-fade-in">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sportsathon collaboration */}
      <section id="partner" className="scroll-mt-20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 via-slate-900 to-blue-600/20 p-8 sm:p-12 lg:p-16">
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative grid lg:grid-cols-5 gap-10 items-center">
              <div className="lg:col-span-3">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-300">Official collaboration</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                  Built together with <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Sportsathon</span>
                </h2>
                <p className="mt-5 text-slate-300 leading-relaxed">
                  We’ve partnered with Sportsathon to bring data-driven performance tracking to grassroots and
                  competitive athletes. Participants in Sportsathon events can track their match performance,
                  compare progress across tournaments and get personalised training guidance — right from
                  the platform.
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-300">
                  {[
                    'Performance tracking for Sportsathon athletes',
                    'Coach tools for participating teams & academies',
                    'Tournament-wide progress insights',
                    'AI coaching for every registered player',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-5 h-5 mt-0.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur p-8 text-center">
                  <div className="flex items-center justify-center gap-4 text-2xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">NeuroPlayLite</span>
                    <span className="text-slate-500 text-xl">×</span>
                    <span className="text-white">Sportsathon</span>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-2xl font-bold text-white">2,300+</p>
                      <p className="text-xs text-slate-400 mt-1">Athletes onboarded via Sportsathon</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4">
                      <p className="text-2xl font-bold text-white">60+</p>
                      <p className="text-xs text-slate-400 mt-1">Partner teams & academies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">Features</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to perform better</h2>
            <p className="mt-4 text-slate-400">From match entry to AI insights, the platform covers the full loop between coach and athlete.</p>
          </div>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon d={f.icon} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section id="sports" className="scroll-mt-20 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Multi-sport</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">One platform, three sports</h2>
            <p className="mt-4 text-slate-400">Each sport has its own metrics and scoring formula, tuned to what actually matters on the field.</p>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {SPORTS.map((s) => (
              <div key={s.name} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-8">
                <div className={`absolute inset-0 bg-gradient-to-b ${s.accent} pointer-events-none`} />
                <div className="relative">
                  <span className="text-5xl" role="img" aria-label={s.name}>{s.emoji}</span>
                  <h3 className="mt-4 text-2xl font-bold text-white">{s.name}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {s.metrics.map((m) => (
                      <li key={m} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-fuchsia-400">How it works</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Up and running in minutes</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative text-center md:text-left">
                <div className="w-12 h-12 mx-auto md:mx-0 rounded-full border border-white/15 bg-gradient-to-br from-blue-600/30 to-violet-600/30 flex items-center justify-center text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 p-10 sm:p-14 text-center">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 35%)' }} />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Join 7,600+ athletes already improving</h2>
              <p className="mt-4 text-white/80 max-w-xl mx-auto">Free for players and coaches. Set up your team and log your first match today.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={primaryCta.to} className="px-6 py-3 rounded-xl font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors">
                  {primaryCta.label}
                </Link>
                {!isAuthenticated && (
                  <Link to="/login" className="px-6 py-3 rounded-xl font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors">
                    I already have an account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} NeuroPlayLite. All rights reserved.</p>
          <p>In collaboration with <span className="text-slate-300 font-medium">Sportsathon</span></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
