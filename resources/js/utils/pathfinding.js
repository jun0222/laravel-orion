import { buildGraph } from '../data/kyoto'

function reconstructPath(cameFrom, goalId) {
  const path = []
  let cur = goalId
  while (cur !== null && cur !== undefined) {
    path.unshift(cur)
    const next = cameFrom.get(cur)
    if (next === undefined || next === cur) break
    cur = next
  }
  return path
}

// 全探索 (BFS): explores ALL reachable nodes, records path when goal first found
export function bfsSteps(landmarks, edges, startId, goalId) {
  const graph = buildGraph(landmarks, edges)
  const steps = []
  const visited = new Set()
  const frontier = new Set([startId])
  const cameFrom = new Map([[startId, null]])
  const queue = [startId]

  steps.push({ visited: new Set(visited), frontier: new Set(frontier), current: null, found: false, path: null })

  while (queue.length > 0) {
    const current = queue.shift()
    frontier.delete(current)
    visited.add(current)

    steps.push({ visited: new Set(visited), frontier: new Set(frontier), current, found: false, path: null })

    for (const { to } of graph.get(current) || []) {
      if (!visited.has(to) && !frontier.has(to)) {
        frontier.add(to)
        if (!cameFrom.has(to)) cameFrom.set(to, current)
        queue.push(to)
      }
    }
  }

  steps.push({
    visited: new Set(visited),
    frontier: new Set(),
    current: null,
    found: true,
    path: reconstructPath(cameFrom, goalId),
  })

  return steps
}

// A*: goal-directed search with Manhattan distance heuristic
export function astarSteps(landmarks, edges, startId, goalId) {
  const graph = buildGraph(landmarks, edges)
  const lMap = new Map(landmarks.map(l => [l.id, l]))
  const goal = lMap.get(goalId)
  const steps = []
  const visited = new Set()
  const frontier = new Set([startId])
  const cameFrom = new Map([[startId, null]])
  const gScore = new Map([[startId, 0]])
  const fScore = new Map()
  const openList = [startId]

  const h = (id) => {
    const n = lMap.get(id)
    return Math.abs(n.row - goal.row) + Math.abs(n.col - goal.col)
  }
  fScore.set(startId, h(startId))

  steps.push({ visited: new Set(visited), frontier: new Set(frontier), current: null, found: false, path: null })

  while (openList.length > 0) {
    openList.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity))
    const current = openList.shift()
    frontier.delete(current)

    if (current === goalId) {
      visited.add(current)
      steps.push({
        visited: new Set(visited),
        frontier: new Set(frontier),
        current,
        found: true,
        path: reconstructPath(cameFrom, goalId),
      })
      break
    }

    visited.add(current)
    steps.push({ visited: new Set(visited), frontier: new Set(frontier), current, found: false, path: null })

    for (const { to, weight } of graph.get(current) || []) {
      if (visited.has(to)) continue
      const tentG = (gScore.get(current) ?? 0) + weight
      if (tentG < (gScore.get(to) ?? Infinity)) {
        cameFrom.set(to, current)
        gScore.set(to, tentG)
        fScore.set(to, tentG + h(to))
        if (!frontier.has(to)) {
          frontier.add(to)
          openList.push(to)
        }
      }
    }
  }

  return steps
}
