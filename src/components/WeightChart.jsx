import { profile } from '../lib/plan'

export default function WeightChart({ weighIns }) {
  const pts = profile.weighInDays
    .map((d) => ({ day: d, w: parseFloat(weighIns[d]?.weight) }))
    .filter((p) => !isNaN(p.w))
  const W = 320, H = 120, P = 24
  const target = profile.startWeightKg - 5
  const min = Math.min(target, ...pts.map((p) => p.w)) - 1
  const max = Math.max(profile.startWeightKg, ...pts.map((p) => p.w)) + 1
  const x = (d) => P + ((d - 1) / 30) * (W - P * 2)
  const y = (w) => P / 2 + ((max - w) / (max - min)) * (H - P)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Weight trend">
      <line x1={P} x2={W - P} y1={y(target)} y2={y(target)} className="chart-target" />
      <text x={W - P} y={y(target) - 4} textAnchor="end" className="chart-label">goal {target} kg</text>
      <polyline points={pts.map((p) => `${x(p.day)},${y(p.w)}`).join(' ')} className="chart-line" />
      {pts.map((p) => (
        <g key={p.day}>
          <circle cx={x(p.day)} cy={y(p.w)} r="3" className="chart-dot" />
          <text x={x(p.day)} y={y(p.w) - 7} textAnchor="middle" className="chart-label">{p.w}</text>
        </g>
      ))}
      {profile.weighInDays.map((d) => (
        <text key={d} x={x(d)} y={H - 2} textAnchor="middle" className="chart-axis">D{d}</text>
      ))}
    </svg>
  )
}
