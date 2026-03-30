import { useState } from 'react'
import { useReadingStore } from '../../stores/readingStore'
import { useSourcesStore } from '../../stores/sourcesStore'
import { fetchRssFeed } from '../../services/rss'
import type { DigestStatus } from '../../types/article'
import ArticleCard from './ArticleCard'
import ArticleDetail from './ArticleDetail'
import AddArticleModal from './AddArticleModal'

const TABS: { label: string; value: DigestStatus | 'all' }[] = [
  { label: '全部',   value: 'all' },
  { label: '未讀',   value: 'unread' },
  { label: '待消化', value: 'pending' },
  { label: '已略過', value: 'skipped' },
  { label: '已消化', value: 'digested' },
]

export default function Reading() {
  const { articles, addArticles } = useReadingStore()
  const { sources } = useSourcesStore()
  const [tab, setTab] = useState<DigestStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')

  const rssSources = sources.filter((s) => s.rssUrl)

  async function handleRssSync() {
    if (rssSources.length === 0) {
      setSyncStatus('沒有已設定 RSS 的來源')
      return
    }
    setSyncing(true)
    setSyncStatus('')
    try {
      const results = await Promise.allSettled(
        rssSources.map((s) => fetchRssFeed(s.id, s.name, s.rssUrl!)),
      )
      let added = 0
      for (const r of results) {
        if (r.status === 'fulfilled') {
          const before = articles.length
          addArticles(r.value)
          added += articles.length - before
        }
      }
      setSyncStatus(`已同步，新增 ${added} 篇`)
    } catch {
      setSyncStatus('同步失敗，請確認 Worker URL 是否設定正確')
    } finally {
      setSyncing(false)
    }
  }

  const filtered = tab === 'all' ? articles : articles.filter((a) => a.status === tab)
  const selected = articles.find((a) => a.id === selectedId) ?? null

  return (
    <div className="flex h-full">
      {/* Left panel */}
      <div className="w-72 shrink-0 border-r border-zinc-100 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-4 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-semibold">閱讀清單</h1>
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs px-2 py-1 bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              + 新增
            </button>
          </div>
          <button
            onClick={handleRssSync}
            disabled={syncing}
            className="w-full text-xs px-3 py-1.5 border border-zinc-200 rounded text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40"
          >
            {syncing ? '同步中…' : `RSS 更新 (${rssSources.length} 個來源)`}
          </button>
          {syncStatus && <p className="mt-1 text-xs text-zinc-400">{syncStatus}</p>}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 px-4">
          {TABS.map((t) => {
            const count = t.value === 'all' ? articles.length : articles.filter((a) => a.status === t.value).length
            return (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`py-2 mr-3 text-xs border-b-2 transition-colors ${
                  tab === t.value
                    ? 'border-zinc-900 text-zinc-900 font-medium'
                    : 'border-transparent text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {t.label}
                {count > 0 && <span className="ml-1 text-zinc-300">{count}</span>}
              </button>
            )
          })}
        </div>

        {/* Article list */}
        <div className="flex-1 overflow-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-xs text-zinc-300 text-center">
              {tab === 'all' ? '還沒有文章，點「RSS 更新」或「+ 新增」來加入' : '沒有文章'}
            </p>
          ) : (
            filtered.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                isSelected={article.id === selectedId}
                onSelect={setSelectedId}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-auto">
        {selected ? (
          <ArticleDetail article={selected} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-300">
            選擇一篇文章來查看詳情
          </div>
        )}
      </div>

      {showAddModal && <AddArticleModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
