import { createContext, useContext, useEffect, useState } from 'react'
import { profile, inventory } from './lib/plan'

const KEY = 'neplio-health/v1'

const initial = () => ({
  startDate: profile.defaultStartDate,
  log: {},       // { [day]: { morningWalk, eveningWalk, water, clean, dinnerBy9, steps, meals: {breakfast: true}, note } }
  weighIns: { 1: { weight: profile.startWeightKg, waist: '' } },
  stock: Object.fromEntries(inventory.map((i) => [i.id, i.stock])),
  cooked: [],    // plan days the cook has marked as cooked
})

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved) return { ...initial(), ...saved, stock: { ...initial().stock, ...saved.stock } }
  } catch {}
  return initial()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  }, [state])

  const api = {
    state,
    setStartDate: (startDate) => setState((s) => ({ ...s, startDate })),
    updateDay: (day, patch) =>
      setState((s) => ({ ...s, log: { ...s.log, [day]: { ...s.log[day], ...patch } } })),
    toggleMeal: (day, meal) =>
      setState((s) => {
        const e = s.log[day] || {}
        const meals = { ...e.meals, [meal]: !e.meals?.[meal] }
        return { ...s, log: { ...s.log, [day]: { ...e, meals } } }
      }),
    setWeighIn: (day, patch) =>
      setState((s) => ({ ...s, weighIns: { ...s.weighIns, [day]: { ...s.weighIns[day], ...patch } } })),
    setStock: (id, qty) =>
      setState((s) => ({ ...s, stock: { ...s.stock, [id]: Math.max(0, Math.round(qty * 10) / 10) } })),
    addStock: (patch) =>
      setState((s) => {
        const stock = { ...s.stock }
        for (const [id, q] of Object.entries(patch)) stock[id] = Math.round(((stock[id] || 0) + q) * 10) / 10
        return { ...s, stock }
      }),
    markCooked: (day, needs) =>
      setState((s) => {
        const stock = { ...s.stock }
        for (const [id, q] of Object.entries(needs)) stock[id] = Math.max(0, Math.round(((stock[id] || 0) - q) * 10) / 10)
        return { ...s, stock, cooked: [...s.cooked, day] }
      }),
    exportFile: () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `neplio-health-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(a.href)
    },
    importFile: async (file) => {
      const data = JSON.parse(await file.text())
      setState({ ...initial(), ...data })
    },
    reset: () => setState(initial()),
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
