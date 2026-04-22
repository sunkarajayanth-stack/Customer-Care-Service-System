export default function HistoryPanel({ history }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Recent Incidents</h2>
      {!history.length && <p className="text-sm text-slate-500">No incidents analyzed yet.</p>}
      <ul className="mt-2 space-y-2 text-sm">
        {history.map((item) => (
          <li key={item.id} className="rounded border border-slate-200 p-2">
            <div className="font-medium">{item.decision} ({item.incident_type})</div>
            <div className="text-xs text-slate-500">{item.timestamp}</div>
            <div className="text-xs text-slate-600">Path: {item.path || 'No safe path'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
