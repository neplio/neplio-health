import profile from '../data/profile.json'
import dietRoster from '../data/dietRoster.json'
import exerciseRoster from '../data/exerciseRoster.json'
import recipes from '../data/recipes.json'
import inventory from '../data/inventory.json'

export const MEALS = ['breakfast', 'fruit', 'lunch', 'snack', 'dinner']
export const MEAL_LABELS = {
  breakfast: 'Breakfast · 6:50',
  fruit: 'Fruit · 10:30',
  lunch: 'Lunch · 1:30',
  snack: 'Snack · 4:30',
  dinner: 'Dinner · 8:30',
}
export const HABITS = [
  { id: 'morningWalk', label: 'Morning walk' },
  { id: 'eveningWalk', label: 'Evening walk' },
  { id: 'water', label: 'Water 3 L' },
  { id: 'clean', label: 'No sugar / fried' },
  { id: 'dinnerBy9', label: 'Dinner by 9 pm' },
]

const DAY_MS = 86400000
const parse = (iso) => new Date(iso + 'T00:00:00')

export function dateForDay(startDate, day) {
  return new Date(parse(startDate).getTime() + (day - 1) * DAY_MS)
}

export function dayForDate(startDate, date = new Date()) {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((today - parse(startDate)) / DAY_MS) + 1
}

export const fmtDate = (d) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
export const fmtDay = (d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })

export const diet = (day) => dietRoster.find((d) => d.day === day)
export const exercise = (day) => exerciseRoster.find((d) => d.day === day)
export const clampDay = (day) => Math.min(Math.max(day, 1), profile.durationDays)

export function dayScore(entry = {}) {
  const done = HABITS.filter((h) => entry[h.id]).length
  return done / HABITS.length
}

/** Ingredient totals needed to cook the given plan days. */
export function requirements(days) {
  const totals = {}
  const add = (id, qty) => (totals[id] = (totals[id] || 0) + qty)
  for (const day of days) {
    const d = diet(day)
    if (!d) continue
    for (const m of MEALS) for (const [id, q] of Object.entries(recipes[d[m]] || {})) add(id, q)
    for (const [id, q] of Object.entries(recipes._daily)) add(id, q)
  }
  return totals
}

export const ingredient = (id) => inventory.find((i) => i.id === id)
export { profile, dietRoster, exerciseRoster, recipes, inventory }
