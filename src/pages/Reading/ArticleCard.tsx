import type { Article } from '../../types/article'

interface Props {
  article: Article
  isSelected: boolean
  onSelect: (id: string) => void
}

export default function ArticleCard(_props: Props) {
  // Phase 2: 顯示文章標題、來源、發布時間、摘要狀態、值不值得深讀標記
  return null
}
