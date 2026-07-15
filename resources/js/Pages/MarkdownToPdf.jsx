import { useState } from 'react'
import { marked } from 'marked'

const PLACEHOLDER = `# ドキュメントタイトル

## はじめに

本文のテキストをここに書きます。**太字**や*イタリック*も使えます。

## コード例

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}
console.log(greet('World'))
\`\`\`

## テーブル

| 名前     | 役割         | 備考     |
|---------|-------------|---------|
| Alice   | フロントエンド | React   |
| Bob     | バックエンド   | Laravel |

## 引用

> 複数ページにわたる長いドキュメントでも、ヘッダー・フッター・ページ番号が自動で付きます。
`

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState(PLACEHOLDER)
  const [title, setTitle]       = useState('ドキュメントタイトル')
  const [paper, setPaper]       = useState('a4')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const preview = marked.parse(markdown, { breaks: true })

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
      const res = await fetch('/markdown-pdf/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({ markdown, title, paper_size: paper }),
      })
      if (!res.ok) throw new Error('変換に失敗しました')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `${title || 'document'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="shrink-0">
            <h1 className="text-lg font-bold text-gray-900">Markdown → PDF</h1>
            <p className="text-xs text-gray-400">dompdf + commonmark</p>
          </div>

          {/* Title input */}
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ドキュメントタイトル"
            className="flex-1 max-w-sm px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />

          {/* Paper size */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
            {[['a4', 'A4'], ['letter', 'Letter']].map(([val, label]) => (
              <button key={val} onClick={() => setPaper(val)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer
                  ${paper === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            {error && <span className="text-sm text-red-500">{error}</span>}
            <button
              onClick={handleDownload}
              disabled={loading || !markdown.trim()}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                ${loading || !markdown.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'}`}
            >
              {loading ? 'PDF生成中...' : 'PDFダウンロード'}
            </button>
            <a href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← ホーム</a>
          </div>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {/* Editor */}
        <div className="flex flex-col min-h-0">
          <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Markdown</div>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-white font-mono text-sm text-gray-800 resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            spellCheck={false}
            placeholder="Markdownを入力してください..."
          />
        </div>

        {/* Preview — styled to mimic PDF output */}
        <div className="flex flex-col min-h-0">
          <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">プレビュー</div>
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Mock PDF header */}
            <div className="sticky top-0 bg-white border-b-2 border-indigo-500 px-6 py-2 flex justify-between items-center z-10">
              <span className="text-xs font-bold text-indigo-600 truncate">{title || 'Untitled'}</span>
              <span className="text-xs text-gray-400 shrink-0 ml-2">{new Date().toISOString().slice(0, 10)}</span>
            </div>
            <div
              className="px-6 py-5 prose prose-sm max-w-none
                prose-headings:font-bold prose-h1:text-2xl prose-h1:border-b-2 prose-h1:border-indigo-500 prose-h1:pb-2
                prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-1
                prose-code:bg-gray-100 prose-code:border prose-code:border-gray-200 prose-code:rounded prose-code:px-1
                prose-pre:bg-slate-800 prose-pre:text-slate-200
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-violet-50
                prose-table:text-sm"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
            {/* Mock PDF footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-1.5 flex justify-between">
              <span className="text-xs text-gray-300">laravel-orion</span>
              <span className="text-xs text-gray-400">Page 1 / ...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
