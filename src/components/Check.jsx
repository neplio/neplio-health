export default function Check({ checked, onChange, label, sub }) {
  return (
    <label className={`check ${checked ? 'on' : ''}`}>
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      <span className="box" aria-hidden />
      <span className="check-text">
        {label}
        {sub && <small>{sub}</small>}
      </span>
    </label>
  )
}
