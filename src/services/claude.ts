import Anthropic from '@anthropic-ai/sdk'

export interface SummaryResult {
  summary: string
  worthReading: boolean
  reason: string
}

export async function summarizeArticle(url: string, title: string): Promise<SummaryResult> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY
  if (!apiKey) throw new Error('VITE_CLAUDE_API_KEY 未設定，請在 .env.local 填入 API Key')

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `你是幫助工程師過濾高品質科技資訊的助手。

文章標題：${title}
文章網址：${url}

請做兩件事：
1. 用 3–5 句繁體中文摘要這篇文章的核心內容。若無法存取網址，依標題與來源網站推斷。
2. 判斷這篇文章對一個關注 AI 產業、半導體、系統工程的工程師是否值得花 30 分鐘深讀。

回傳格式（純 JSON，不要加 markdown code block）：
{"summary":"...","worthReading":true,"reason":"一句話說明判斷理由"}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(text) as SummaryResult
}
