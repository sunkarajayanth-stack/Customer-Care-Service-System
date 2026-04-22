export default function DecisionPanel({ result }) {
  if (!result) {
    return <div className="rounded-lg bg-white p-4 text-sm text-slate-500 shadow">No decision yet. Submit an incident to analyze.</div>
  }

  const danger = ['EVACUATE', 'CALL_FIRE_DEPT'].includes(result.decision)
  const color = danger ? 'text-red-600' : 'text-green-600'

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Decision</h2>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{result.decision}</p>
      <p className="mt-1 text-sm text-slate-600">Incident type: {result.incident_type}</p>
      <p className="mt-1 text-sm text-slate-600">Fire probability: {(result.probability_of_fire * 100).toFixed(1)}%</p>
      <p className="mt-1 text-sm text-slate-600">Confidence: {(result.decision_metadata.confidence * 100).toFixed(0)}%</p>
      <p className="mt-1 text-xs text-slate-500">Policy: {result.decision_metadata.policy}</p>
      {result.decision_metadata.tie_break && <p className="mt-1 text-xs text-amber-700">{result.decision_metadata.tie_break}</p>}
      <ul className="mt-3 list-disc pl-5 text-sm">
        {result.decision_scores.map((d) => (
          <li key={d.action}>{d.action}: {d.score.toFixed(2)} ({d.rationale})</li>
        ))}
      </ul>
    </div>
  )
}
