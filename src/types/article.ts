export type DigestStatus = 'unread' | 'pending' | 'skipped' | 'digested'

export interface Article {
  id: string
  url: string
  title: string
  sourceId: string
  sourceName: string
  publishedAt: string   // ISO 8601
  addedAt: string       // ISO 8601
  summary: string       // Claude 生成的摘要，空字串表示尚未生成
  worthReading: boolean | null  // null = 尚未判斷
  worthReadingReason: string    // Claude 判斷理由
  perspective: string   // 個人觀點，填完才算 digested
  status: DigestStatus
  fromRss: boolean      // true = RSS 自動抓取，false = 手動貼 URL
}
