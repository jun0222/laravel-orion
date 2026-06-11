import { useState, useEffect, useCallback } from 'react'
import { landmarks, edges, ROWS, COLS } from '../data/kyoto'
import { bfsSteps, astarSteps } from '../utils/pathfinding'

const ALGORITHMS = {
  bfs:   { label: '全探索 (BFS)', complexity: 'O(V + E)',    desc: '全ノードを幅優先で探索' },
  astar: { label: 'A* 探索',      complexity: 'O(E log V)', desc: 'ヒューリスティックで目標に向かう' },
}

const STATE_CLASS = {
  unvisited: 'bg-white text-gray-700 border-gray-300',
  start:     'bg-emerald-500 text-white border-emerald-600 shadow-lg',
  goal:      'bg-violet-500 text-white border-violet-600 shadow-lg',
  frontier:  'bg-amber-300 text-amber-900 border-amber-400',
  visited:   'bg-sky-200 text-sky-900 border-sky-300',
  current:   'bg-red-500 text-white border-red-600 shadow-lg scale-105',
  path:      'bg-green-500 text-white border-green-600 shadow-md',
}

const STATE_FILL = {
  unvisited: '#f9fafb',
  start:     '#10b981',
  goal:      '#8b5cf6',
  frontier:  '#fcd34d',
  visited:   '#bae6fd',
  current:   '#ef4444',
  path:      '#22c55e',
}

// ── Grid View ────────────────────────────────────────────────────────────────
function GridView({ getState, onNodeClick }) {
  const grid = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => landmarks.find(l => l.row === r && l.col === c) ?? null)
  )

  return (
    <div className="p-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
      {grid.flat().map((lm, i) =>
        lm ? (
          <button
            key={lm.id}
            onClick={() => onNodeClick(lm.id)}
            className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${STATE_CLASS[getState(lm.id)]}`}
          >
            <div className="font-bold text-sm leading-tight">{lm.name}</div>
            <div className="text-xs opacity-70 mt-0.5">{lm.en}</div>
          </button>
        ) : (
          <div key={i} className="invisible" />
        )
      )}
    </div>
  )
}

// ── Graph View ───────────────────────────────────────────────────────────────
function GraphView({ getState, onNodeClick, path }) {
  const W = 720, H = 460, PAD = 90, R = 36
  const dx = (W - PAD * 2) / (COLS - 1)
  const dy = (H - PAD * 2) / (ROWS - 1)
  const pos = (lm) => ({ x: PAD + lm.col * dx, y: PAD + lm.row * dy })

  const pathSet = new Set(
    (path ?? []).slice(0, -1).map((id, i) => [id, path[i + 1]].sort().join('-'))
  )
  const onPath = (a, b) => pathSet.has([a, b].sort().join('-'))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-3xl mx-auto select-none">
      {/* Edges */}
      {edges.map((e, i) => {
        const f = landmarks.find(l => l.id === e.from)
        const t = landmarks.find(l => l.id === e.to)
        const fp = pos(f), tp = pos(t)
        const mx = (fp.x + tp.x) / 2, my = (fp.y + tp.y) / 2
        const isOnPath = onPath(e.from, e.to)
        return (
          <g key={i}>
            <line x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
              stroke={isOnPath ? '#22c55e' : '#d1d5db'}
              strokeWidth={isOnPath ? 5 : 2}
              strokeLinecap="round"
            />
            <text x={mx} y={my - 7} textAnchor="middle" fontSize="11" fill="#9ca3af">{e.weight}</text>
          </g>
        )
      })}
      {/* Nodes */}
      {landmarks.map(lm => {
        const { x, y } = pos(lm)
        const st = getState(lm.id)
        const fill = STATE_FILL[st]
        const dark = ['frontier', 'unvisited', 'visited'].includes(st)
        const tc = dark ? '#1f2937' : '#ffffff'
        return (
          <g key={lm.id} onClick={() => onNodeClick(lm.id)} className="cursor-pointer">
            <circle cx={x} cy={y} r={R} fill={fill} stroke="#9ca3af" strokeWidth={2} />
            <text x={x} y={y - 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={tc}>{lm.name}</text>
            <text x={x} y={y + 10} textAnchor="middle" fontSize="9" fill={tc} opacity="0.8">
              {lm.en.length > 11 ? lm.en.slice(0, 11) + '…' : lm.en}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function KyotoPathfinder() {
  const [start, setStart]           = useState(null)
  const [goal, setGoal]             = useState(null)
  const [mode, setMode]             = useState('start')   // 'start' | 'goal'
  const [algorithm, setAlgorithm]   = useState('bfs')
  const [view, setView]             = useState('grid')
  const [speed, setSpeed]           = useState(300)
  const [steps, setSteps]           = useState([])
  const [stepIdx, setStepIdx]       = useState(0)
  const [isRunning, setIsRunning]   = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showCJ, setShowCJ]         = useState(false)

  // Animation tick
  useEffect(() => {
    if (!isRunning || !steps.length) return
    if (stepIdx >= steps.length - 1) {
      setIsRunning(false)
      setIsComplete(true)
      return
    }
    const t = setTimeout(() => setStepIdx(i => i + 1), speed)
    return () => clearTimeout(t)
  }, [isRunning, stepIdx, steps, speed])

  // COOL JAPAN trigger
  useEffect(() => {
    if (!isComplete) return
    const t = setTimeout(() => setShowCJ(true), 700)
    return () => clearTimeout(t)
  }, [isComplete])

  const cur = steps[stepIdx] ?? null

  const getState = useCallback((id) => {
    if (!cur) {
      if (id === start) return 'start'
      if (id === goal)  return 'goal'
      return 'unvisited'
    }
    if (cur.found && cur.path?.includes(id)) return 'path'
    if (id === cur.current)         return 'current'
    if (cur.visited?.has(id))       return 'visited'
    if (cur.frontier?.has(id))      return 'frontier'
    if (id === start)               return 'start'
    if (id === goal)                return 'goal'
    return 'unvisited'
  }, [cur, start, goal])

  const handleNodeClick = (id) => {
    if (isRunning) return
    if (mode === 'start') {
      setStart(id); setGoal(null); setMode('goal')
      setSteps([]); setIsComplete(false); setShowCJ(false)
    } else {
      if (id === start) return
      setGoal(id); setMode('start')
    }
  }

  const handleRun = () => {
    if (!start || !goal || isRunning) return
    const fn = algorithm === 'bfs' ? bfsSteps : astarSteps
    const s = fn(landmarks, edges, start, goal)
    setSteps(s); setStepIdx(0)
    setIsRunning(true); setIsComplete(false); setShowCJ(false)
  }

  const handleReset = () => {
    setStart(null); setGoal(null); setMode('start')
    setSteps([]); setStepIdx(0)
    setIsRunning(false); setIsComplete(false); setShowCJ(false)
  }

  // Stats
  const last = isComplete ? steps[steps.length - 1] : null
  const pathWeight = last?.path?.slice(0, -1).reduce((sum, id, i) => {
    const nxt = last.path[i + 1]
    const e = edges.find(e => (e.from === id && e.to === nxt) || (e.from === nxt && e.to === id))
    return sum + (e?.weight ?? 0)
  }, 0) ?? 0

  const statusText = isComplete ? '探索完了!'
    : isRunning  ? `探索中... (${stepIdx + 1} / ${steps.length} ステップ)`
    : start && goal ? 'スタート準備完了 — 探索開始を押してください'
    : start       ? 'ゴールを選択してください'
    : 'スタート地点を選択してください'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">京都 最短経路探索</h1>
            <p className="text-sm text-gray-400 mt-0.5">Kyoto Pathfinder — Algorithm Visualizer</p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← ホーム</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
          {/* Algorithm */}
          <div className="flex gap-2">
            {Object.entries(ALGORITHMS).map(([key, info]) => (
              <button key={key}
                onClick={() => !isRunning && setAlgorithm(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                  ${algorithm === key
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'}
                  ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {info.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[['grid', 'グリッド'], ['graph', 'グラフ']].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer
                  ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Speed */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="text-xs text-gray-400">速度</span>
            {[['遅', 700], ['普通', 300], ['速', 80]].map(([label, ms]) => (
              <button key={ms} onClick={() => setSpeed(ms)}
                className={`px-2.5 py-1 rounded border text-xs cursor-pointer transition-colors
                  ${speed === ms ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-auto">
            <button onClick={handleReset}
              className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              リセット
            </button>
            <button onClick={handleRun} disabled={!start || !goal || isRunning}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                ${start && goal && !isRunning
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isRunning ? '探索中...' : '探索開始'}
            </button>
          </div>
        </div>

        {/* Status + Legend */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className={`font-medium ${isComplete ? 'text-green-600' : isRunning ? 'text-amber-600' : 'text-gray-600'}`}>
            {statusText}
          </span>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 ml-auto">
            {[['bg-emerald-500','スタート'],['bg-violet-500','ゴール'],['bg-amber-300','探索中'],
              ['bg-sky-200','訪問済'],['bg-red-500','現在地'],['bg-green-500','最短経路']].map(([bg, label]) => (
              <span key={label} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded inline-block ${bg}`} />{label}
              </span>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {view === 'grid'
            ? <GridView getState={getState} onNodeClick={handleNodeClick} />
            : <div className="p-4">
                <GraphView getState={getState} onNodeClick={handleNodeClick} path={cur?.path} />
              </div>
          }
        </div>

        {/* Algorithm info bar */}
        <div className="text-xs text-gray-400 text-center">
          {ALGORITHMS[algorithm].desc} — 計算量: {ALGORITHMS[algorithm].complexity}
        </div>

        {/* Stats */}
        {isComplete && last && (
          <div className="bg-white rounded-2xl border border-green-200 p-5">
            <h2 className="font-bold text-gray-900 mb-4">探索結果</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                ['訪問ノード数', last.visited?.size ?? 0, 'text-indigo-600'],
                ['経路コスト', pathWeight,              'text-green-600'],
                ['探索ステップ', steps.length,           'text-amber-600'],
                ['計算量',      ALGORITHMS[algorithm].complexity, 'text-gray-700 text-lg font-mono'],
              ].map(([label, val, cls]) => (
                <div key={label} className="text-center">
                  <div className={`text-2xl font-bold ${cls}`}>{val}</div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
            {last.path && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 font-medium mb-2">最短経路</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {last.path.map((id, i) => {
                    const lm = landmarks.find(l => l.id === id)
                    return (
                      <span key={id} className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {lm.name}
                        </span>
                        {i < last.path.length - 1 && <span className="text-gray-300 text-lg">→</span>}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* COOL JAPAN! overlay */}
      {showCJ && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 cursor-pointer"
          onClick={() => setShowCJ(false)}
        >
          <div className="text-center cool-japan-pop">
            <div className="text-7xl md:text-9xl font-black tracking-widest"
              style={{
                color: '#fff',
                textShadow: '0 0 30px rgba(255,80,80,0.9), 0 0 60px rgba(255,80,80,0.5), 0 0 100px rgba(255,80,80,0.3)',
              }}>
              COOL JAPAN!
            </div>
            <div className="text-white/60 mt-6 text-base">クリックして閉じる</div>
          </div>
        </div>
      )}
    </div>
  )
}
