import { useStore } from '../store'
import { dietRoster, MEALS, dayForDate, dateForDay, fmtDate } from '../lib/plan'
import mealOptions from '../data/mealOptions.json'

const HEAD = { breakfast: 'Breakfast', fruit: 'Fruit', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' }

export default function Food() {
  const { state, toggleMeal } = useStore()
  const today = dayForDate(state.startDate)

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">~1,700–1,800 kcal a day</p>
        <h1>Food roster</h1>
        <p className="muted">Tap a meal once it’s eaten. Litti chokha lands every 7th day as the weekly treat.</p>
      </header>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Day</th>{MEALS.map((m) => <th key={m}>{HEAD[m]}</th>)}</tr>
          </thead>
          <tbody>
            {dietRoster.map((d) => {
              const meals = state.log[d.day]?.meals || {}
              return (
                <tr key={d.day} className={d.day === today ? 'today' : ''}>
                  <td className="day-cell"><strong>{d.day}</strong><small>{fmtDate(dateForDay(state.startDate, d.day))}</small></td>
                  {MEALS.map((m) => (
                    <td key={m}>
                      <button className={`cell-btn ${meals[m] ? 'done' : ''}`} onClick={() => toggleMeal(d.day, m)}>{d[m]}</button>
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <section>
        <h2>Swap options</h2>
        <p className="muted">Any of these can replace the planned meal in the same slot.</p>
        <div className="options">
          {MEALS.map((m) => (
            <div key={m}>
              <h3>{HEAD[m]}</h3>
              <ul className="plain">{mealOptions[m].map((o) => <li key={o}>{o}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Notes</h2>
        <ul className="plain">{mealOptions.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>
    </>
  )
}
