//todo STEP-1: Accept data as prop — real data from backend
//todo STEP-2: Fall back to empty if no data

export default function PerformanceChart({ data = [] }) {
  const W   = 900
  const H   = 200
  const pad = 30

  if (data.length < 2) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center text-on-surface-variant">
        Complete at least 2 interviews to see your performance chart.
      </div>
    )
  }

  //todo STEP-3: Map data points to SVG coordinates
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: H - pad - (d.score / 100) * (H - pad * 2),
    ...d,
  }))

  //todo STEP-4: Smooth bezier curve path
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cpX  = (prev.x + p.x) / 2
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`
  }, "")

  //todo STEP-5: Filled area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`

  return (
    <div className="glass-panel rounded-3xl p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-headline font-bold text-2xl text-on-surface">Performance Evolution</h3>
          <p className="text-on-surface-variant text-sm mt-1">
            Long-term progress trend across all your interviews.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-xs font-bold">LIVE</span>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl bg-surface-container-low/50 p-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: "220px" }}>
          <defs>
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#a3a6ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a3a6ff" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#a3a6ff" />
              <stop offset="100%" stopColor="#c180ff" />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d={areaD} fill="url(#chartAreaGrad)" />
          <path d={pathD} fill="none" stroke="url(#chartLineGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#lineGlow)" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5"  fill="#a3a6ff" />
              <circle cx={p.x} cy={p.y} r="10" fill="#a3a6ff" opacity="0.15" />
            </g>
          ))}
        </svg>

        <div className="flex justify-between px-2 mt-2">
          {data.map((d, i) => (
            <span key={i} className="text-[11px] text-on-surface-variant font-medium">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}