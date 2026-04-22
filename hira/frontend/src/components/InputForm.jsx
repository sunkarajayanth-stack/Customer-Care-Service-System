import { useState } from 'react'

const presets = {
  normal: {
    fire_detected: false,
    smoke_level: 1,
    people_inside: 3,
    exits_blocked: '',
    blocked_nodes: '',
    sprinkler_working: true,
    location: 'RoomA',
    planning_algorithm: 'astar',
  },
  fire: {
    fire_detected: true,
    smoke_level: 9,
    people_inside: 20,
    exits_blocked: 'Exit2',
    blocked_nodes: '',
    sprinkler_working: false,
    location: 'RoomA',
    planning_algorithm: 'astar',
  },
  blocked: {
    fire_detected: true,
    smoke_level: 8,
    people_inside: 12,
    exits_blocked: 'Exit1,Exit2,Exit3',
    blocked_nodes: 'Hall1',
    sprinkler_working: false,
    location: 'RoomA',
    planning_algorithm: 'bfs',
  },
  occupancy: {
    fire_detected: true,
    smoke_level: 6,
    people_inside: 55,
    exits_blocked: 'Exit2',
    blocked_nodes: '',
    sprinkler_working: true,
    location: 'RoomB',
    planning_algorithm: 'astar',
  },
}

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm] = useState(presets.fire)

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const applyPreset = (name) => setForm(presets[name])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      smoke_level: Number(form.smoke_level),
      people_inside: Number(form.people_inside),
      exits_blocked: form.exits_blocked ? form.exits_blocked.split(',').map((v) => v.trim()).filter(Boolean) : [],
      blocked_nodes: form.blocked_nodes ? form.blocked_nodes.split(',').map((v) => v.trim()).filter(Boolean) : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Incident Input</h2>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded bg-green-100 px-2 py-1 text-xs" onClick={() => applyPreset('normal')}>Normal</button>
        <button type="button" className="rounded bg-red-100 px-2 py-1 text-xs" onClick={() => applyPreset('fire')}>Fire Emergency</button>
        <button type="button" className="rounded bg-yellow-100 px-2 py-1 text-xs" onClick={() => applyPreset('blocked')}>Blocked Exits</button>
        <button type="button" className="rounded bg-purple-100 px-2 py-1 text-xs" onClick={() => applyPreset('occupancy')}>High Occupancy</button>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.fire_detected} onChange={(e) => handleChange('fire_detected', e.target.checked)} />
        Fire detected
      </label>
      <label className="block">Smoke level (0-10)
        <input className="mt-1 w-full rounded border p-2" type="number" min="0" max="10" value={form.smoke_level} onChange={(e) => handleChange('smoke_level', e.target.value)} />
      </label>
      <label className="block">People inside
        <input className="mt-1 w-full rounded border p-2" type="number" min="0" value={form.people_inside} onChange={(e) => handleChange('people_inside', e.target.value)} />
      </label>
      <label className="block">Planning algorithm
        <select className="mt-1 w-full rounded border p-2" value={form.planning_algorithm} onChange={(e) => handleChange('planning_algorithm', e.target.value)}>
          <option value="astar">A* (recommended)</option>
          <option value="bfs">BFS</option>
        </select>
      </label>
      <label className="block">Exits blocked (comma-separated)
        <input className="mt-1 w-full rounded border p-2" value={form.exits_blocked} onChange={(e) => handleChange('exits_blocked', e.target.value)} />
      </label>
      <label className="block">Blocked nodes (comma-separated)
        <input className="mt-1 w-full rounded border p-2" value={form.blocked_nodes} onChange={(e) => handleChange('blocked_nodes', e.target.value)} />
      </label>
      <label className="block">Location
        <input className="mt-1 w-full rounded border p-2" value={form.location} onChange={(e) => handleChange('location', e.target.value)} />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.sprinkler_working} onChange={(e) => handleChange('sprinkler_working', e.target.checked)} />
        Sprinkler working
      </label>
      <button className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Incident'}
      </button>
    </form>
  )
}
