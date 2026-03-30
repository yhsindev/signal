import type { Article } from '../types/article'

// Phase 2: 從來源的 RSS feed 抓取最新文章
// 因為瀏覽器的 CORS 限制，需要透過公開的 RSS-to-JSON proxy（如 rss2json.com）
// 或考慮改用 Cloudflare Workers 自架 proxy

export async function fetchRssFeed(_sourceId: string, _rssUrl: string): Promise<Omit<Article, 'id' | 'addedAt' | 'summary' | 'worthReading' | 'perspective' | 'status'>[]> {
  throw new Error('Not implemented')
}

export async function fetchPageTitle(_url: string): Promise<string> {
  // Phase 2: 手動貼 URL 時自動抓取頁面 og:title
  throw new Error('Not implemented')
}
