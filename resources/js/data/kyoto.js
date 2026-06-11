export const ROWS = 4
export const COLS = 4

export const landmarks = [
  { id: 0,  name: '嵐山',      en: 'Arashiyama',      row: 0, col: 0 },
  { id: 1,  name: '金閣寺',    en: 'Kinkakuji',       row: 0, col: 1 },
  { id: 2,  name: '北野天満宮', en: 'Kitano Tenmangu', row: 0, col: 2 },
  { id: 3,  name: '上賀茂神社', en: 'Kamigamo Shrine', row: 0, col: 3 },
  { id: 4,  name: '二条城',    en: 'Nijo Castle',     row: 1, col: 0 },
  { id: 5,  name: '京都御所',  en: 'Imperial Palace', row: 1, col: 1 },
  { id: 6,  name: '出町柳',    en: 'Demachiyanagi',   row: 1, col: 2 },
  { id: 7,  name: '銀閣寺',    en: 'Ginkakuji',       row: 1, col: 3 },
  { id: 8,  name: '西本願寺',  en: 'Nishi Honganji',  row: 2, col: 0 },
  { id: 9,  name: '錦市場',    en: 'Nishiki Market',  row: 2, col: 1 },
  { id: 10, name: '祇園',      en: 'Gion',            row: 2, col: 2 },
  { id: 11, name: '南禅寺',    en: 'Nanzenji',        row: 2, col: 3 },
  { id: 12, name: '東寺',      en: 'Toji Temple',     row: 3, col: 0 },
  { id: 13, name: '京都駅',    en: 'Kyoto Station',   row: 3, col: 1 },
  { id: 14, name: '清水寺',    en: 'Kiyomizudera',    row: 3, col: 2 },
  { id: 15, name: '伏見稲荷',  en: 'Fushimi Inari',   row: 3, col: 3 },
]

export const edges = [
  // Row 0
  { from: 0,  to: 1,  weight: 3 },
  { from: 1,  to: 2,  weight: 2 },
  { from: 2,  to: 3,  weight: 3 },
  // Row 1
  { from: 4,  to: 5,  weight: 2 },
  { from: 5,  to: 6,  weight: 2 },
  { from: 6,  to: 7,  weight: 3 },
  // Row 2
  { from: 8,  to: 9,  weight: 1 },
  { from: 9,  to: 10, weight: 2 },
  { from: 10, to: 11, weight: 2 },
  // Row 3
  { from: 12, to: 13, weight: 2 },
  { from: 13, to: 14, weight: 3 },
  { from: 14, to: 15, weight: 2 },
  // Col 0
  { from: 0,  to: 4,  weight: 4 },
  { from: 4,  to: 8,  weight: 2 },
  { from: 8,  to: 12, weight: 2 },
  // Col 1
  { from: 1,  to: 5,  weight: 3 },
  { from: 5,  to: 9,  weight: 2 },
  { from: 9,  to: 13, weight: 2 },
  // Col 2
  { from: 2,  to: 6,  weight: 3 },
  { from: 6,  to: 10, weight: 2 },
  { from: 10, to: 14, weight: 2 },
  // Col 3
  { from: 3,  to: 7,  weight: 3 },
  { from: 7,  to: 11, weight: 2 },
  { from: 11, to: 15, weight: 3 },
]

export function buildGraph(lms, eds) {
  const graph = new Map()
  lms.forEach(l => graph.set(l.id, []))
  eds.forEach(e => {
    graph.get(e.from).push({ to: e.to, weight: e.weight })
    graph.get(e.to).push({ to: e.from, weight: e.weight })
  })
  return graph
}
