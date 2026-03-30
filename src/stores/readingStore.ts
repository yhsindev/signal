import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Article, DigestStatus } from '../types/article'

interface ReadingState {
  articles: Article[]
  addArticle: (article: Omit<Article, 'id' | 'addedAt'>) => void
  addArticles: (articles: Omit<Article, 'id' | 'addedAt'>[]) => void  // RSS 批次新增，自動去重
  setSummary: (id: string, summary: string, worthReading: boolean, reason: string) => void
  setPerspective: (id: string, perspective: string) => void
  setStatus: (id: string, status: DigestStatus) => void
  removeArticle: (id: string) => void
}

export const useReadingStore = create<ReadingState>()(
  persist(
    (set) => ({
      articles: [],

      addArticle: (article) =>
        set((state) => {
          if (state.articles.some((a) => a.url === article.url)) return state
          return {
            articles: [
              { ...article, id: crypto.randomUUID(), addedAt: new Date().toISOString() },
              ...state.articles,
            ],
          }
        }),

      addArticles: (incoming) =>
        set((state) => {
          const existingUrls = new Set(state.articles.map((a) => a.url))
          const newOnes = incoming
            .filter((a) => !existingUrls.has(a.url))
            .map((a) => ({ ...a, id: crypto.randomUUID(), addedAt: new Date().toISOString() }))
          if (newOnes.length === 0) return state
          return { articles: [...newOnes, ...state.articles] }
        }),

      setSummary: (id, summary, worthReading, reason) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id
              ? { ...a, summary, worthReading, worthReadingReason: reason, status: 'pending' }
              : a,
          ),
        })),

      setPerspective: (id, perspective) =>
        set((state) => ({
          articles: state.articles.map((a) =>
            a.id === id ? { ...a, perspective, status: 'digested' } : a,
          ),
        })),

      setStatus: (id, status) =>
        set((state) => ({
          articles: state.articles.map((a) => (a.id === id ? { ...a, status } : a)),
        })),

      removeArticle: (id) =>
        set((state) => ({ articles: state.articles.filter((a) => a.id !== id) })),
    }),
    { name: 'signal-reading' },
  ),
)
