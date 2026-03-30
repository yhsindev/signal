import { create } from 'zustand'
import type { Article, DigestStatus } from '../types/article'

interface ReadingState {
  articles: Article[]

  // 新增
  addArticle: (article: Omit<Article, 'id' | 'addedAt'>) => void

  // 更新 Claude 摘要結果
  setSummary: (id: string, summary: string, worthReading: boolean) => void

  // 更新個人觀點 → 自動推進 status 到 'digested'
  setPerspective: (id: string, perspective: string) => void

  // 手動更新消化狀態
  setStatus: (id: string, status: DigestStatus) => void

  // 篩選用（不存入 store，computed）
  // filtered by status: useReadingStore(state => state.articles.filter(...))
}

export const useReadingStore = create<ReadingState>()(() => ({
  articles: [],
  addArticle: () => {},
  setSummary: () => {},
  setPerspective: () => {},
  setStatus: () => {},
}))
