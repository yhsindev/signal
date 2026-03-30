import type { Article, DigestStatus } from '../../types/article'

const STATUS_BADGE: Record<DigestStatus, { label: string; className: string }> = {
  unread:   { label: '未讀',   className: 'bg-zinc-100 text-zinc-500' },
  pending:  { label: '待消化', className: 'bg-blue-50 text-blue-600' },
  skipped:  { label: '已略過', className: 'bg-zinc-100 text-zinc-400' },
  digested: { label: '已消化', className: 'bg-green-50 text-green-600' },
}

interface Props {
  article: Article
  isSelected: boolean
  onSelect: (id: string) => void
}

export default function ArticleCard({ article, isSelected, onSelect }: Props) {
  const badge = STATUS_BADGE[article.status]
  const date = new Date(article.publishedAt).toLocaleDateString('zh-TW', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <button
      onClick={() => onSelect(article.id)}
      className={`w-full text-left px-4 py-3 border-b border-zinc-100 hover:bg-zinc-50 transition-colors ${
        isSelected ? 'bg-zinc-50 border-l-2 border-l-zinc-900' : ''
      } ${article.status === 'skipped' ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-medium text-zinc-900 line-clamp-2 leading-snug">
          {article.title}
        </span>
        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span>{article.sourceName}</span>
        <span>·</span>
        <span>{date}</span>
        {article.worthReading === true && (
          <>
            <span>·</span>
            <span className="text-blue-500">值得深讀</span>
          </>
        )}
        {article.worthReading === false && (
          <>
            <span>·</span>
            <span className="text-zinc-400">可略過</span>
          </>
        )}
      </div>
    </button>
  )
}
