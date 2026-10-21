import { useState } from 'react'
import { useStore } from '../store'
import { MEALS, MEAL_LABELS, diet, recipes, inventory, ingredient, requirements, dayForDate, dateForDay, fmtDay, clampDay, profile } from '../lib/plan'

const fmt = (q, unit) => `${Math.round(q * 10) / 10} ${unit}`
const categories = [...new Set(inventory.map((i) => i.category))]

export default function Kitchen() {
  const { state, setStock, markCooked, addStock } = useStore()
  const tomorrow = clampDay(dayForDate(state.startDate) + 1)
  const [day, setDay] = useState(tomorrow)
  const [horizon, setHorizon] = useState(3)
  const d = diet(day)
  const cooked = state.cooked.includes(day)

  const fromDay = clampDay(Math.max(dayForDate(state.startDate), 1))
  const upcoming = Array.from({ length: horizon }, (_, i) => fromDay + i).filter((n) => n <= profile.durationDays && !state.cooked.includes(n))
  const needs = requirements(upcoming)
  const shopping = Object.entries(needs)
    .map(([id, q]) => ({ ...ingredient(id), buy: q - (state.stock[id] || 0) }))
    .filter((i) => i.buy > 0)

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">For the cook</p>
        <h1>Kitchen</h1>
        <p className="muted">Roti = medium phulka, no ghee. 3 tsp oil for the whole day. Tea and milk always without sugar. Less salt.</p>
      </header>

      <section>
        <div className="section-head">
          <h2>Menu</h2>
          <div className="stepper">
            <button onClick={() => setDay(clampDay(day - 1))} aria-label="Previous day">‹</button>
            <span>Day {day} · {fmtDay(dateForDay(state.startDate, day))}</span>
            <button onClick={() => setDay(clampDay(day + 1))} aria-label="Next day">›</button>
          </div>
        </div>
        <div className="menu">
          {MEALS.map((m) => (
            <div key={m} className="menu-item">
              <small>{MEAL_LABELS[m]}</small>
              <strong>{d[m]}</strong>
              <span className="muted small">
                {Object.entries(recipes[d[m]] || {}).map(([id, q]) => `${ingredient(id).name} ${fmt(q, ingredient(id).unit)}`).join(' · ')}
              </span>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn" disabled={cooked} onClick={() => markCooked(day, requirements([day]))}>
            {cooked ? 'Cooked ✓ — stock deducted' : 'Mark day cooked · deduct stock'}
          </button>
          <span className="muted small">Night before: boil eggs / make chilla batter. Lunch goes in a tiffin.</span>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Shopping list</h2>
          <div className="seg">
            {[3, 7].map((n) => (
              <button key={n} className={horizon === n ? 'on' : ''} onClick={() => setHorizon(n)}>Next {n} days</button>
            ))}
          </div>
        </div>
        {shopping.length === 0 ? (
          <p className="muted">Stock covers the next {horizon} days.</p>
        ) : (
          <>
            <ul className="shop">
              {shopping.map((i) => <li key={i.id}><span>{i.name}</span><span>{fmt(Math.ceil(i.buy), i.unit)}</span></li>)}
            </ul>
            <div className="actions">
              <button className="btn ghost" onClick={() => addStock(Object.fromEntries(shopping.map((i) => [i.id, Math.ceil(i.buy)])))}>
                Bought everything · add to stock
              </button>
            </div>
          </>
        )}
      </section>

      <section>
        <h2>Inventory</h2>
        <div className="inv">
          {categories.map((c) => (
            <div key={c}>
              <h3>{c}</h3>
              {inventory.filter((i) => i.category === c).map((i) => {
                const q = state.stock[i.id] ?? 0
                const step = i.unit === 'pcs' || i.unit === 'tsp' ? 1 : i.unit === 'ml' ? 250 : 100
                return (
                  <div key={i.id} className={`inv-row ${q <= i.reorderAt ? 'low' : ''}`}>
                    <span>{i.name}</span>
                    <div className="qty">
                      <button onClick={() => setStock(i.id, q - step)} aria-label={`Less ${i.name}`}>−</button>
                      <input type="number" value={q} onChange={(e) => setStock(i.id, parseFloat(e.target.value) || 0)} />
                      <em>{i.unit}</em>
                      <button onClick={() => setStock(i.id, q + step)} aria-label={`More ${i.name}`}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
