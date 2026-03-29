import { useState } from 'react'
import { useSourcesStore, CATEGORIES, type Category, type Source } from '../../stores/sourcesStore'

const EMPTY_FORM = { name: '', url: '', category: CATEGORIES[0] as Category, description: '' }

export default function Sources() {
  const { sources, addSource, removeSource } = useSourcesStore()
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: sources.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.url.trim()) return
    addSource(form)
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">來源管理</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors"
        >
          {showForm ? '取消' : '+ 新增來源'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-5 border border-zinc-200 rounded-lg bg-zinc-50 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">名稱</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Hacker News"
                className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://..."
                className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">分類</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">說明</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="一句話描述"
                className="px-3 py-2 text-sm border border-zinc-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-zinc-900 text-white rounded hover:bg-zinc-700 transition-colors"
            >
              新增
            </button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {grouped.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              {category}
            </h2>
            <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-lg overflow-hidden">
              {items.map((source) => (
                <SourceRow key={source.id} source={source} onRemove={removeSource} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function SourceRow({ source, onRemove }: { source: Source; onRemove: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white hover:bg-zinc-50 group">
      <div className="min-w-0">
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-zinc-900 hover:underline"
        >
          {source.name}
        </a>
        {source.description && (
          <p className="text-xs text-zinc-400 mt-0.5 truncate">{source.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(source.id)}
        className="ml-4 text-xs text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        移除
      </button>
    </div>
  )
}
