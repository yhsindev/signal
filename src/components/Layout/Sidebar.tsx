import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/reading', label: '閱讀清單' },
  { to: '/topics', label: '主題追蹤' },
  { to: '/sources', label: '來源管理' },
  { to: '/position', label: '工程師定位' },
]

export default function Sidebar() {
  return (
    <aside>
      <div>
        <span>Signal 訊源</span>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
