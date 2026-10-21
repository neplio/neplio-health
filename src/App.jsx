import { useEffect, useRef, useState } from 'react'
import { useStore } from './store'
import Me from './pages/Me'
import Food from './pages/Food'
import Exercise from './pages/Exercise'
import Timeline from './pages/Timeline'
import Kitchen from './pages/Kitchen'
import { profile } from './lib/plan'

const TABS = [
  { id: 'me', label: 'Me', el: Me },
  { id: 'food', label: 'Food', el: Food },
  { id: 'exercise', label: 'Exercise', el: Exercise },
  { id: 'timeline', label: 'Timeline', el: Timeline },
  { id: 'kitchen', label: 'Kitchen', el: Kitchen },
]

const fromHash = () => TABS.find((t) => `#${t.id}` === location.hash)?.id || 'me'

export default function App() {
  const [tab, setTab] = useState(fromHash)
  const { exportFile, importFile, reset } = useStore()
  const fileRef = useRef()

  useEffect(() => {
    const on = () => setTab(fromHash())
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  const Page = TABS.find((t) => t.id === tab).el

  return (
    <div className="app">
      <nav className="nav">
        <span className="brand">{profile.name}<em>/ 30 days</em></span>
        <div className="tabs">
          {TABS.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={tab === t.id ? 'on' : ''}>{t.label}</a>
          ))}
        </div>
      </nav>

      <main><Page /></main>

      <footer className="foot">
        <span>Saved in this browser. Back it up as a file:</span>
        <button onClick={exportFile}>Export</button>
        <button onClick={() => fileRef.current.click()}>Import</button>
        <button onClick={() => confirm('Clear all progress, weigh-ins and stock?') && reset()}>Reset</button>
        <input ref={fileRef} type="file" accept="application/json" hidden
          onChange={async (e) => {
            const f = e.target.files[0]
            if (!f) return
            try { await importFile(f) } catch { alert('That file could not be read.') }
            e.target.value = ''
          }} />
      </footer>
    </div>
  )
}
