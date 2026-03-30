import type { Article } from '../types/article'

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? ''

interface RssItem {
  title: string
  url: string
  publishedAt: string
}

export async function fetchRssFeed(
  sourceId: string,
  sourceName: string,
  rssUrl: string,
): Promise<Omit<Article, 'id' | 'addedAt'>[]> {
  const res = await fetch(`${WORKER_URL}/rss?url=${encodeURIComponent(rssUrl)}`)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

  const items: RssItem[] = await res.json()
  return items.map((item) => ({
    url: item.url,
    title: item.title,
    sourceId,
    sourceName,
    publishedAt: item.publishedAt,
    summary: '',
    worthReading: null,
    worthReadingReason: '',
    perspective: '',
    status: 'unread' as const,
    fromRss: true,
  }))
}

export async function fetchPageTitle(url: string): Promise<string> {
  const res = await fetch(`${WORKER_URL}/title?url=${encodeURIComponent(url)}`)
  if (!res.ok) throw new Error(`Title fetch failed: ${res.status}`)
  const { title } = await res.json()
  return title as string
}
