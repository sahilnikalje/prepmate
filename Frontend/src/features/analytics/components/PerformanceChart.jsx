import { performanceData } from "../data/analyticsDummyData"

//todo STEP-1: Define SVG canvas dimensions

export default function PerformanceChart() {
  const W   = 900
  const H   = 200
  const pad = 30

  //todo STEP-2: Calculate x/y for each point
  const points = performanceData.map((d, i) => ({
    x: pad + (i / (performanceData.length - 1)) * (W - pad * 2),
    y: H - pad - (d.score / 100) * (H - pad * 2),
    ...d,
  }))

  //todo STEP-3: Smooth bezier curve
  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`
    const prev = points[i - 1]
    const cpX  = (prev.x + p.x) / 2
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`
  }, "")

  //todo STEP-4: Filled area path — close the shape at the bottom
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`

  return (
    <div className="glass-panel rounded-3xl p-8">

       {/*//* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-headline font-bold text-2xl text-on-surface">
            Performance Evolution
          </h3>
          <p className="text-on-surface-variant text-sm mt-1">
            Long-term progress trend across all core dimensions.
          </p>
        </div>

        {/*//* Time filter pills */}
        <div className="flex items-center gap-2">
          {["1W", "1M", "3M"].map((t, i) => (
            <button
              key={t}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                i === 1
                  ? "bg-primary text-on-primary-fixed"
                  : "bg-white/5 text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/*//* SVG Chart */}
      <div className="w-full overflow-hidden rounded-2xl bg-surface-container-low/50 p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          preserveAspectRatio="none"
          style={{ height: "220px" }}
        >
          <defs>
            {/*//* Area gradient */}
            <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#a3a6ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a3a6ff" stopOpacity="0.02" />
            </linearGradient>

            {/*//* Line gradient */}
            <linearGradient id="chartLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#a3a6ff" />
              <stop offset="100%" stopColor="#c180ff" />
            </linearGradient>

            {/*//* Dashed baseline gradient */}
            <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#a3a6ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#c180ff" stopOpacity="0.2" />
            </linearGradient>

            {/*//* Glow filter */}
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/*//* Filled area */}
          <path d={areaD} fill="url(#chartAreaGrad)" />

          {/*//* Dashed baseline */}
          <line
            x1={points[0].x} y1={points[0].y}
            x2={points[points.length - 1].x} y2={points[points.length - 1].y}
            stroke="url(#baseGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/*//* Main curve */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chartLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#lineGlow)"
          />

          {/*//* Data point dots */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5"  fill="#a3a6ff" />
              <circle cx={p.x} cy={p.y} r="10" fill="#a3a6ff" opacity="0.15" />
            </g>
          ))}
        </svg>

        {/*//* X-axis labels */}
        <div className="flex justify-between px-2 mt-2">
          {performanceData.map((d, i) => (
            <span key={i} className="text-[11px] text-on-surface-variant font-medium">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}