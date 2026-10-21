import { useStore } from '../store'
import Check from '../components/Check'
import { profile, diet, exercise, clampDay, dayForDate, dateForDay, fmtDay, MEALS, MEAL_LABELS, HABITS, dayScore } from '../lib/plan'

export default function Me() {
  const { state, updateDay, toggleMeal, setStartDate } = useStore()
  const rawDay = dayForDate(state.startDate)
  const day = clampDay(rawDay)
  const entry = state.log[day] || {}
  const d = diet(day)
  const ex = exercise(day)
  const wins = Object.values(state.log).filter((e) => dayScore(e) === 1).length
  const latest = [...profile.weighInDays].reverse().find((n) => state.weighIns[n]?.weight)
  const lost = latest ? (profile.startWeightKg - parseFloat(state.weighIns[latest].weight)).toFixed(1) : 0

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{fmtDay(dateForDay(state.startDate, day))}</p>
        <h1>
          {rawDay < 1 ? `Starts in ${1 - rawDay} day${rawDay === 0 ? '' : 's'}` : rawDay > profile.durationDays ? 'Plan complete' : `Day ${day} of ${profile.durationDays}`}
        </h1>
        <div className="progress"><span style={{ width: `${(Math.max(0, Math.min(rawDay, 30)) / 30) * 100}%` }} /></div>
      </header>

      <section className="stats">
        <Stat label="Start" value={`${profile.startWeightKg} kg`} />
        <Stat label="Lost so far" value={`${lost} kg`} />
        <Stat label="Perfect days" value={wins} />
        <Stat label="Goal" value="4–6 kg" />
      </section>

      <div className="grid-2">
        <section>
          <h2>Today’s checklist</h2>
          <div className="list">
            {HABITS.map((h) => (
              <Check key={h.id} checked={entry[h.id]} onChange={() => updateDay(day, { [h.id]: !entry[h.id] })}
                label={h.label}
                sub={h.id === 'morningWalk' ? `${ex.morningWalkMin} min${ex.easy ? ' · easy' : ''}` : h.id === 'eveningWalk' ? `${ex.eveningWalkMin} min` : null} />
            ))}
            <label className="row-input">
              <span>Steps <small>target {ex.steps.toLocaleString()}</small></span>
              <input type="number" inputMode="numeric" placeholder="0" value={entry.steps || ''}
                onChange={(e) => updateDay(day, { steps: e.target.value })} />
            </label>
          </div>
        </section>

        <section>
          <h2>Today’s food</h2>
          <div className="list">
            {MEALS.map((m) => (
              <Check key={m} checked={entry.meals?.[m]} onChange={() => toggleMeal(day, m)} label={d[m]} sub={MEAL_LABELS[m]} />
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2>Note for today</h2>
        <textarea rows="2" placeholder="Energy, cravings, anything worth remembering…" value={entry.note || ''}
          onChange={(e) => updateDay(day, { note: e.target.value })} />
      </section>

      <div className="grid-2">
        <section>
          <h2>Rules</h2>
          <ol className="plain">{profile.rules.map((r) => <li key={r}>{r}</li>)}</ol>
          <p className="muted small">{profile.safety}</p>
        </section>
        <section>
          <h2>Profile</h2>
          <dl className="kv">
            <dt>Height</dt><dd>{profile.height}</dd>
            <dt>BMI</dt><dd>{profile.bmi}</dd>
            <dt>Calories</dt><dd>{profile.dailyTargets.kcal} kcal</dd>
            <dt>Water</dt><dd>{profile.dailyTargets.waterLitres}–3.5 L</dd>
            <dt>Oil</dt><dd>{profile.dailyTargets.oilTsp} tsp / day</dd>
            <dt>Sleep</dt><dd>{profile.dailyTargets.sleepHours} h</dd>
            <dt>Start date</dt>
            <dd><input type="date" value={state.startDate} onChange={(e) => e.target.value && setStartDate(e.target.value)} /></dd>
          </dl>
        </section>
      </div>
    </>
  )
}

const Stat = ({ label, value }) => (
  <div className="stat"><small>{label}</small><strong>{value}</strong></div>
)
