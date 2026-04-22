import { useMemo } from 'react'

export default function MapVisualizer({ mapData, path = [], blockedExits = [], blockedNodes = [] }) {
  const nodes = useMemo(() => Object.keys(mapData || {}), [mapData])

  if (!mapData) return null

  const isExit = (node) => node.startsWith('Exit')

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Building Map</h2>
      <p className="text-sm text-slate-600">Evacuation path: {path.length ? path.join(' → ') : 'No safe path'}</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-blue-100 px-2 py-1">Room/Hall</span>
        <span className="rounded bg-green-100 px-2 py-1">Path</span>
        <span className="rounded bg-red-100 px-2 py-1">Blocked</span>
        <span className="rounded bg-purple-100 px-2 py-1">Exit</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {nodes.map((node) => {
          const inPath = path.includes(node)
          const isBlocked = blockedExits.includes(node) || blockedNodes.includes(node)
          const baseClass = isBlocked ? 'border-red-500 bg-red-50' : inPath ? 'border-green-600 bg-green-50' : isExit(node) ? 'border-purple-600 bg-purple-50' : 'border-slate-300 bg-slate-50'
          return (
            <div key={node} title={`Node: ${node} | Type: ${isExit(node) ? 'Exit' : 'Room/Hall'} | Connections: ${(mapData[node] || []).length}`} className={`rounded border p-2 text-sm ${baseClass}`}>
              <div className="font-semibold">{node}</div>
              <div className="text-xs text-slate-500">Links: {(mapData[node] || []).join(', ') || 'None'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
