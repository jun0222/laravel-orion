import { useState } from 'react'
import { marked } from 'marked'

const PLACEHOLDER = `# タイトル

## 見出し2

本文のテキストをここに書きます。**太字**や*イタリック*も使えます。

- リスト項目1
- リスト項目2
- リスト項目3

\`\`\`js
console.log('Hello, World!')
\`\`\`

> 引用テキスト
`

export default function MarkdownToPdf() {
  const [markdown, setMarkdown]   = useState(PLACEHOLDER)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const preview = marked.parse(markdown, { breaks: true })

  const handleDownload = async () => {
    setLoading(true)
    setError(null)
    try {
      const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
      const res = await fetch('/markdown-pdf/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
        body: JSON.stringify({ markdown }),
      })
      if (!res.ok) throw new Error('変換に失敗しました')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = 'document.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Markdown → PDF</h1>
            <p className="text-sm text-gray-400 mt-0.5">barryvdh/laravel-dompdf + league/commonmark</p>
          </div>
          <div className="flex items-center gap-3">
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
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-100px)]">
        {/* Editor */}
        <div className="flex flex-col">
          <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Markdown</div>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className="flex-1 w-full p-4 rounded-xl border border-gray-200 bg-white font-mono text-sm text-gray-800 resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            spellCheck={false}
            placeholder="Markdownを入力してください..."
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col">
          <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">プレビュー</div>
          <div className="flex-1 overflow-y-auto p-6 rounded-xl border border-gray-200 bg-white prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>
    </div>
  )
}
