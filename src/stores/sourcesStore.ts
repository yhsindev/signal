import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import defaultSources from '../data/sources.json'

export const CATEGORIES = [
  '深度分析',
  '財報一手',
  '工程技術',
  '半導體',
  '影片/Podcast',
  '研究論文',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Source {
  id: string
  name: string
  url: string
  category: Category
  description: string
  rssUrl?: string   // RSS feed URL，有填才能自動抓取
}

interface SourcesState {
  sources: Source[]
  addSource: (source: Omit<Source, 'id'>) => void
  removeSource: (id: string) => void
}

export const useSourcesStore = create<SourcesState>()(
  persist(
    (set) => ({
      sources: defaultSources as Source[],
      addSource: (source) =>
        set((state) => ({
          sources: [
            ...state.sources,
            { ...source, id: crypto.randomUUID() },
          ],
        })),
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id),
        })),
    }),
    { name: 'signal-sources' },
  ),
)
