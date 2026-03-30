import { useState } from 'react'
import type { Article } from '../../types/article'
import { useReadingStore } from '../../stores/readingStore'
import { summarizeArticle } from '../../services/claude'

interface Props {
  article: Article
}

export default function ArticleDetail({ article }: Props) {
  const { setSummary, setPerspective, setStatus, removeArticle } = useReadingStore()
  const [perspective, setPerspectiveLocal] = useState(article.perspective)
  const [summarizing, setSummarizing] = useState(false)
  const [error, setError] = useState('')

  async function handleSummarize() {
    setSummarizing(true)
    setError('')
    try {
      const result = await summarizeArticle(article.url, article.title)
      setSummary(article.id, result.summary, result.worthReading, result.reason)
    } catch (e) {
      setError(e instanceof Error ? e.message : '摘要生成失敗')
    } finally {
      setSummarizing(false)
    }
  }

  function handleSavePerspective() {
    if (!perspective.trim()) return
    setPerspective(article.id, perspective.trim())
  }

  return (
    <div className="flex flex-col h-full overflow-auto p-6 max-w-2xl">
      {/* Title */}
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="text-xl font-semibold text-zinc-900 hover:underline leading-snug mb-1"
      >
        {article.title}
      </a>
      <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
        <span>{article.sourceName}</span>
        <span>·</span>
        <span>
          {new Date(article.publishedAt).toLocaleDateString('zh-TW', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </span>
        {article.fromRss && <span className="bg-zinc-100 px-1.5 py-0.5 rounded">RSS</span>}
      </div>

      {/* Claude Summary */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          Claude 摘要
        </h2>
        {article.summary ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-700 leading-relaxed">{article.summary}</p>
            <div className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded font-medium ${
              article.worthReading
                ? 'bg-blue-50 text-blue-600'
                : 'bg-zinc-100 text-zinc-500'
            }`}>
              <span>{article.worthReading ? '值得深讀' : '可略過'}</span>
              {article.worthReadingReason && (
                <span className="text-zinc-400 font-normal">— {article.worthReadingReason}</span>
              )}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleSummarize}
              disabled={summarizing}
              className="px-4 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {summarizing ? '生成中…' : '產生摘要'}
            </button>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </div>
        )}
      </section>

      {/* Personal Perspective */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          個人觀點
        </h2>
        {article.status === 'digested' ? (
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
            {article.perspective}
          </p>
        ) : (
          <div className="space-y-2">
            <textarea
              value={perspective}
              onChange={(e) => setPerspectiveLocal(e.target.value)}
              placeholder="寫下你的判斷——這篇文章改變了你對某件事的看法嗎？"
              rows={5}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-900 placeholder-zinc-300"
            />
            <button
              onClick={handleSavePerspective}
              disabled={!perspective.trim()}
              className="px-4 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors disabled:opacity-40"
            >
              標記為已消化
            </button>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-100">
        {article.status !== 'skipped' && article.status !== 'digested' && (
          <button
            onClick={() => setStatus(article.id, 'skipped')}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            略過
          </button>
        )}
        {article.status === 'skipped' && (
          <button
            onClick={() => setStatus(article.id, 'unread')}
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            取消略過
          </button>
        )}
        <button
          onClick={() => removeArticle(article.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors ml-auto"
        >
          刪除
        </button>
      </div>
    </div>
  )
}
