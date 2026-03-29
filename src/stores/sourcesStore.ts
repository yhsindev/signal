import { create } from 'zustand'

interface SourcesState {
  // Phase 1: sources list (loaded from sources.json)
}

export const useSourcesStore = create<SourcesState>()(() => ({}))
