export type DigestStatus = 'unread' | 'pending' | 'digested'

export interface Article {
  id: string
  url: string
  title: string
  sourceId: string       // 對應 sources.json 的 id
  sourceName: string
  publishedAt: string    // ISO 8601
  addedAt: string        // ISO 8601
  summary: string        // Claude 生成的摘要
  worthReading: boolean | null  // Claude 判斷是否值得深讀，null 表示尚未判斷
  perspective: string    // 個人觀點（填完才算 digested）
  status: DigestStatus
  fromRss: boolean       // true = RSS 自動抓取，false = 手動貼 URL
}
