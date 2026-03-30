import { useState } from 'react'
import { useReadingStore } from '../../stores/readingStore'
import { useSourcesStore } from '../../stores/sourcesStore'
import { fetchPageTitle } from '../../services/rss'

interface Props {
  onClose: () => void
}

export default function AddArticleModal({ onClose }: Props) {
  const { addArticle } = useReadingStore()
  const { sources } = useSourcesStore()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [sourceId, setSourceId] = useState(sources[0]?.id ?? '')
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState('')

  async function handleFetchTitle() {
    if (!url.trim()) return
    setFetching(true)
    setError('')
    try {
      const fetched = await fetchPageTitle(url.trim())
      if (fetched) setTitle(fetched)
    } catch {
      setError('無法抓取標題，請手動填寫')
    } finally {
      setFetching(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || !title.trim() || !sourceId) return
    const source = sources.find((s) => s.id === sourceId)
    addArticle({
      url: url.trim(),
      title: title.trim(),
      sourceId,
      sourceName: source?.name ?? '',
      publishedAt: new Date().toISOString(),
      summary: '',
      worthReading: null,
      worthReadingReason: '',
      perspective: '',
      status: 'unread',
      fromRss: false,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-base font-semibold mb-4">手動新增文章</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleFetchTitle}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
              <button
                type="button"
                onClick={handleFetchTitle}
                disabled={fetching || !url.trim()}
                className="px-3 py-2 text-xs bg-zinc-100 text-zinc-600 rounded hover:bg-zinc-200 transition-colors disabled:opacity-40"
              >
                {fetching ? '抓取中…' : '抓標題'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">標題</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章標題"
              className="px-3 py-2 text-sm border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400"
              required
            />
          </div>

          {/* Source */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">來源</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="px-3 py-2 text-sm border border-zinc-300 rounded focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              {sources.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
