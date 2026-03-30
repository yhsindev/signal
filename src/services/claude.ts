// Claude API 摘要服務
// 需要在 .env.local 設定 VITE_CLAUDE_API_KEY

export interface SummaryResult {
  summary: string        // 3–5 句重點摘要
  worthReading: boolean  // 是否值得花時間深讀
  reason: string         // 判斷理由（一句話）
}

export async function summarizeArticle(_url: string, _title: string): Promise<SummaryResult> {
  // Phase 2: 呼叫 Claude API，傳入文章 URL 和標題，回傳摘要與判斷
  throw new Error('Not implemented')
}
