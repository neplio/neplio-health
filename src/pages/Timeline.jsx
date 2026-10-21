import { useEffect, useState } from 'react'
import { useStore } from '../store'
import WeightChart from '../components/WeightChart'
import timetable from '../data/timetable.json'
import { profile, dayForDate, dateForDay, fmtDate, dayScore, HABITS } from '../lib/plan'

const toMin = (t) => { const [h, m] = t.split(':').map(Number); return (h === 0 ? 24 : h) * 60 + m }
const to12 = (t) => {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

export default function Timeline() {
  const { state, setWeighIn } = useStore()
  const today = dayForDate(state.startDate)
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t) }, [])

  const nowMin = (now.getHours() < 6 && now.getHours() >= 0 ? now.getHours() + 24 : now.getHours()) * 60 + now.getMinutes()
  const current = [...timetable].reverse().find((s) => toMin(s.time) <= nowMin)

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Same schedule all 30 days</p>
        <h1>Timeline</h1>
      </header>

      <div className="grid-2">
        <section>
          <h2>Daily timetable</h2>
          <ol className="timeline">
            {timetable.map((s) => (
              <li key={s.time} className={s === current ? 'now' : toMin(s.time) < nowMin ? 'past' : ''}>
                <time>{to12(s.time)}</time>
                <div>
                  <strong>{s.label}</strong>
                  {s.detail && <small>{s.detail}</small>}
                </div>
              </li>
            ))}
          </ol>
          <p className="muted small">Drink 3–3.5 L of water through the day. If late-night hunger gets hard, try 30–60 extra minutes of sleep first.</p>
        </section>

        <section>
          <h2>30 days</h2>
          <div className="days">
            {Array.from({ length: profile.durationDays }, (_, i) => i + 1).map((d) => {
              const score = dayScore(state.log[d])
              const done = HABITS.filter((h) => state.log[d]?.[h.id]).length
              return (
                <div key={d} title={`Day ${d} · ${fmtDate(dateForDay(state.startDate, d))} · ${done}/${HABITS.length}`}
                  className={`dot ${d === today ? 'is-today' : ''} ${d > today ? 'future' : ''}`}
                  style={{ '--fill': score }}>
                  {d}
                </div>
              )
            })}
          </div>
          <p className="muted small">Darker = more boxes ticked. A day with every box ticked is a win.</p>

          <h2 className="mt">Weigh-ins</h2>
          <p className="muted small">Once a week, same morning time, after the toilet, before food or water.</p>
          <WeightChart weighIns={state.weighIns} />
          <table className="compact">
            <thead><tr><th>Day</th><th>Date</th><th>Weight (kg)</th><th>Waist (cm)</th></tr></thead>
            <tbody>
              {profile.weighInDays.map((d) => (
                <tr key={d} className={d === today ? 'today' : ''}>
                  <td>Day {d}</td>
                  <td>{fmtDate(dateForDay(state.startDate, d))}</td>
                  <td><input type="number" step="0.1" value={state.weighIns[d]?.weight ?? ''} onChange={(e) => setWeighIn(d, { weight: e.target.value })} /></td>
                  <td><input type="number" step="0.5" value={state.weighIns[d]?.waist ?? ''} onChange={(e) => setWeighIn(d, { waist: e.target.value })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
