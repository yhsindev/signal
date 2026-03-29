import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/reading', label: '閱讀清單' },
  { to: '/topics', label: '主題追蹤' },
  { to: '/sources', label: '來源管理' },
  { to: '/position', label: '工程師定位' },
]

export default function Sidebar() {
  return (
    <aside className="w-52 shrink-0 border-r border-zinc-100 flex flex-col py-6 px-4">
      <div className="mb-8 px-2">
        <span className="text-base font-semibold tracking-tight">Signal</span>
        <span className="ml-1.5 text-xs text-zinc-400">訊源</span>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
