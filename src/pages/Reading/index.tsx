// Phase 2: 閱讀清單主頁
// 左欄：文章列表（RSS 抓取 + 手動新增），可按狀態篩選
// 右欄：選中文章的 ArticleDetail（Claude 摘要 + 個人觀點）

export default function Reading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight mb-2">閱讀清單</h1>
      <p className="text-sm text-zinc-400">Phase 2：RSS 自動抓取、Claude 摘要、個人觀點記錄。</p>
    </div>
  )
}
