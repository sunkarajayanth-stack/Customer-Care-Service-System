export default function ExplanationPanel({ result }) {
  if (!result) {
    return <div className="rounded-lg bg-white p-4 text-sm text-slate-500 shadow">Explanation appears after analysis.</div>
  }

  const details = result.explanation_details

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Explanation</h2>
      <p className="mt-2 text-sm font-medium text-slate-800">{details.summary}</p>

      <h3 className="mt-3 text-sm font-semibold text-slate-700">Key factors</h3>
      <ul className="list-disc pl-5 text-sm text-slate-700">
        {details.key_factors.map((factor) => <li key={factor}>{factor}</li>)}
      </ul>

      <h3 className="mt-3 text-sm font-semibold text-slate-700">Step-by-step reasoning</h3>
      <ol className="list-decimal pl-5 text-sm text-slate-700">
        {details.reasoning_steps.map((step) => <li key={step}>{step}</li>)}
      </ol>

      <h3 className="mt-3 text-sm font-semibold text-slate-700">Final justification</h3>
      <p className="text-sm text-slate-700">{details.final_justification}</p>
    </div>
  )
}
