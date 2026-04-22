import DecisionPanel from './DecisionPanel'
import ExplanationPanel from './ExplanationPanel'
import HistoryPanel from './HistoryPanel'
import InputForm from './InputForm'
import MapVisualizer from './MapVisualizer'

export default function Dashboard({ mapData, result, onSubmit, loading, history }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <InputForm onSubmit={onSubmit} loading={loading} />
        <DecisionPanel result={result} />
        <HistoryPanel history={history} />
      </div>
      <div className="space-y-4 lg:col-span-2">
        <ExplanationPanel result={result} />
        <MapVisualizer
          mapData={mapData}
          path={result?.evacuation_path || []}
          blockedExits={result?.blocked_exits || []}
          blockedNodes={result?.blocked_nodes || []}
        />
      </div>
    </div>
  )
}
