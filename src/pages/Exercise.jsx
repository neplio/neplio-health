import { useStore } from '../store'
import { exerciseRoster, dayForDate, dateForDay, fmtDate } from '../lib/plan'

export default function Exercise() {
  const { state, updateDay } = useStore()
  const today = dayForDate(state.startDate)
  const weeks = [1, 2, 3, 4, 5].map((w) => exerciseRoster.filter((d) => d.week === w))

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Walking plan</p>
        <h1>Exercise roster</h1>
        <p className="muted">
          Morning walk tops out at 40 min so you’re done before 7 am. Days 7, 14, 21 and 28 are lighter so your legs recover.
          From week 2, add 5 min of stairs near the end of the morning walk.
        </p>
      </header>

      {weeks.map((rows, i) => (
        <section key={i}>
          <h2>Week {i + 1}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Day</th><th>Morning</th><th>Evening</th><th>Target</th><th>Steps done</th></tr>
              </thead>
              <tbody>
                {rows.map((d) => {
                  const e = state.log[d.day] || {}
                  const steps = parseInt(e.steps) || 0
                  return (
                    <tr key={d.day} className={d.day === today ? 'today' : ''}>
                      <td className="day-cell"><strong>{d.day}</strong><small>{fmtDate(dateForDay(state.startDate, d.day))}</small></td>
                      <td>
                        <button className={`cell-btn ${e.morningWalk ? 'done' : ''}`} onClick={() => updateDay(d.day, { morningWalk: !e.morningWalk })}>
                          {d.morningWalkMin} min{d.easy ? ' · easy' : ''}{d.stairs && !d.easy ? ' + stairs' : ''}
                        </button>
                      </td>
                      <td>
                        <button className={`cell-btn ${e.eveningWalk ? 'done' : ''}`} onClick={() => updateDay(d.day, { eveningWalk: !e.eveningWalk })}>
                          {d.eveningWalkMin} min
                        </button>
                      </td>
                      <td className="num">{d.steps.toLocaleString()}</td>
                      <td>
                        <input type="number" inputMode="numeric" className={`steps ${steps >= d.steps ? 'hit' : ''}`} placeholder="—"
                          value={e.steps || ''} onChange={(ev) => updateDay(d.day, { steps: ev.target.value })} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <p className="muted small">Every hour at work: stand or walk 3–5 minutes — calls on your feet count.</p>
    </>
  )
}
