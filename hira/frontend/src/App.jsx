import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import { getBuildingMap, submitIncident } from './services/api'

export default function App() {
  const [mapData, setMapData] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    console.info('[HIRA] Initializing frontend and fetching building map...')
    getBuildingMap()
      .then((res) => {
        setMapData(res.data)
        console.info('[HIRA] Backend connection established.')
      })
      .catch(() => {
        setMapData({})
        setError('Backend unavailable. Start backend on http://localhost:8000 and refresh.')
      })
  }, [])

  const handleSubmit = async (payload) => {
    setLoading(true)
    setError('')
    try {
      const res = await submitIncident(payload)
      setResult(res.data)
      setHistory((prev) => [
        {
          id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
          decision: res.data.decision,
          incident_type: res.data.incident_type,
          path: (res.data.evacuation_path || []).join(' -> '),
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ].slice(0, 5))
    } catch (err) {
      const details = err?.response?.data?.error?.message || err?.response?.data?.detail
      const message = details || 'Incident analysis failed. Please check inputs and backend status.'
      setError(Array.isArray(message) ? message.map((m) => m.msg).join(', ') : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 px-4 py-4 text-white shadow">
        <h1 className="text-2xl font-bold">Hybrid Incident Response Agent (HIRA)</h1>
        <p className="text-sm text-slate-200">Detect → Reason → Plan → Decide → Explain</p>
      </header>
      {error && <div className="mx-auto mt-4 max-w-7xl rounded bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}
      <Dashboard mapData={mapData} result={result} onSubmit={handleSubmit} loading={loading} history={history} />
    </main>
  )
}
