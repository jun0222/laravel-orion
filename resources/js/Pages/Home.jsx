const TOOLS = [
  {
    href:  '/kyoto',
    title: '京都 最短経路探索',
    sub:   'Kyoto Pathfinder',
    desc:  '京都の名所をグリッドに配置し、BFS / A* でリアルタイム可視化。アルゴリズムの違いを直感的に比較できます。',
    badge: 'BFS / A*',
  },
  {
    href:  '/markdown-pdf',
    title: 'Markdown → PDF',
    sub:   'MD to PDF Converter',
    desc:  'Markdownをリアルタイムプレビューしながら PDF に変換してダウンロード。barryvdh/laravel-dompdf 使用。',
    badge: 'dompdf',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">laravel-orion</h1>
        <p className="mt-3 text-gray-400">Laravel + Inertia + React</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        {TOOLS.map(({ href, title, sub, desc, badge }) => (
          <a
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium shrink-0 ml-2">{badge}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
