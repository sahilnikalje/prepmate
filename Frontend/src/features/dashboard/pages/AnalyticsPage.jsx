import React, { useEffect, useState } from 'react'
import DashboardLayout from '../layout/DashboardLayout'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true })

// ─── Mini bar chart (pure CSS, no library needed) ────────────────────────────
function BarChart({ data }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map(d => d.score), 1)

  return (
    <div className="flex items-end gap-2 h-36 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
          <span className="text-[9px] font-bold text-primary">{d.score}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-700"
            style={{
              height: `${Math.round((d.score / max) * 100)}%`,
              background: `linear-gradient(to top, #a3a6ff, #c180ff)`,
              minHeight: '4px',
              opacity: 0.85,
            }}
          />
          <span
            className="text-[8px] text-on-surface-variant truncate w-full text-center"
            title={d.label}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Score ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 100, stroke = 8, color = '#a3a6ff' }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(163,166,255,0.1)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-1000"
      />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/api/analytics')
        setData(res.data)
      } catch (err) {
        setError('Failed to load analytics data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] gap-4 flex-col">
          <svg className="w-9 h-9 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-on-surface-variant font-headline">Loading your analytics...</p>
        </div>
      </DashboardLayout>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-error font-headline">
          {error}
        </div>
      </DashboardLayout>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!data || data.totalInterviews === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">insights</span>
          </div>
          <h2 className="text-2xl font-extrabold font-headline text-on-surface">No Analytics Yet</h2>
          <p className="text-on-surface-variant max-w-sm">
            Complete at least one interview to see your performance analytics here.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  const { totalInterviews, averageScore, bestScore, performanceData, strengths, growthAreas, aiInsight, miniMetrics } = data

  return (
    <DashboardLayout>

      {/* ── Page title ────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
          Analytics
        </h2>
        <p className="text-on-surface-variant text-lg">
          Your interview performance, broken down.
        </p>
      </section>

      {/* ── Top stats row ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Interviews', value: totalInterviews, icon: 'record_voice_over', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Average Score', value: `${averageScore}/100`, icon: 'star', color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Best Score', value: `${bestScore}/100`, icon: 'military_tech', color: 'text-[#48e5d0]', bg: 'bg-[#48e5d0]/10' },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-surface-container-low/60 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/15 flex items-center gap-5 inner-glow"
          >
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <span className={`material-symbols-outlined ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {s.icon}
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-bold tracking-widest uppercase mb-1">{s.label}</p>
              <p className={`text-2xl font-extrabold font-headline ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── Performance chart + AI insight ────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Bar chart */}
        <div className="md:col-span-2 bg-surface-container-low/60 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/15 inner-glow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-headline font-bold text-on-surface text-lg">Score Over Time</h3>
              <p className="text-on-surface-variant text-xs">Performance trend across interviews</p>
            </div>
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              show_chart
            </span>
          </div>
          <BarChart data={performanceData} />
        </div>

        {/* AI insight card */}
        {aiInsight && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-xl rounded-2xl p-6 border border-primary/15 inner-glow flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  psychology
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase">AI Insight</p>
                <p className="font-headline font-bold text-on-surface text-sm">Performance Summary</p>
              </div>
            </div>

            {/* Score ring */}
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <ScoreRing score={aiInsight.score} size={80} stroke={7} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline font-extrabold text-primary text-sm">{aiInsight.score}</span>
                </div>
              </div>
              <div>
                <p className="font-headline font-semibold text-on-surface text-sm">{aiInsight.trend}</p>
                <p className="text-on-surface-variant text-xs mt-1">Recent sessions</p>
              </div>
            </div>

            <p className="text-on-surface-variant text-xs leading-relaxed">{aiInsight.message}</p>

            {aiInsight.priority && aiInsight.priority !== 'Keep practicing' && (
              <div className="bg-surface-variant/30 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-sm">flag</span>
                <p className="text-xs text-on-surface-variant">
                  Focus: <span className="text-secondary font-bold">{aiInsight.priority}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Mini metrics row ──────────────────────────────────────────────── */}
      {miniMetrics && (
        <section className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sessions', value: miniMetrics.totalSessions, icon: 'event_note' },
            { label: 'Questions Answered', value: miniMetrics.questionsAnswered, icon: 'quiz' },
            { label: 'Score Improvement', value: miniMetrics.improvement, icon: 'trending_up' },
          ].map((m, i) => (
            <div
              key={i}
              className="bg-surface-container-low/50 backdrop-blur-xl rounded-2xl p-5 border border-outline-variant/10 text-center inner-glow"
            >
              <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
                {m.icon}
              </span>
              <p className="font-headline font-extrabold text-2xl text-on-surface">{m.value}</p>
              <p className="text-on-surface-variant text-xs mt-1">{m.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* ── Strengths + Growth Areas ──────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Strengths */}
        <div className="bg-surface-container-low/60 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/15 inner-glow">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-[#48e5d0]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <h3 className="font-headline font-bold text-on-surface text-base">Strengths</h3>
          </div>

          {strengths.length === 0 ? (
            <p className="text-on-surface-variant text-sm">Keep practicing to unlock strength insights.</p>
          ) : (
            <div className="space-y-4">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-headline font-semibold text-sm text-on-surface truncate">{s.title}</p>
                      <span className="text-xs font-bold text-[#48e5d0] ml-2 flex-shrink-0">{s.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${s.score}%`, background: 'linear-gradient(to right, #48e5d0, #a3a6ff)' }}
                      />
                    </div>
                    <p className="text-on-surface-variant text-[10px] mt-1">{s.tag} · {s.sessions} session{s.sessions !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Growth Areas */}
        <div className="bg-surface-container-low/60 backdrop-blur-xl rounded-2xl p-6 border border-outline-variant/15 inner-glow">
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              trending_up
            </span>
            <h3 className="font-headline font-bold text-on-surface text-base">Growth Areas</h3>
          </div>

          {growthAreas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
              <span className="material-symbols-outlined text-3xl text-secondary">celebration</span>
              <p className="text-on-surface-variant text-sm">No weak areas detected. Keep it up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {growthAreas.map((g, i) => (
                <div key={i} className="bg-surface-variant/20 rounded-xl p-4 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-headline font-semibold text-sm text-on-surface">{g.title}</p>
                    <span className="text-xs font-bold text-secondary">{g.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${g.score}%`, background: 'linear-gradient(to right, #c180ff, #a3a6ff)' }}
                    />
                  </div>
                  <p className="text-on-surface-variant text-[10px]">{g.insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </DashboardLayout>
  )
}

export default AnalyticsPage