import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, Box, CreditCard } from 'lucide-react'

const Sidebar = () => {
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/motores', icon: Database, label: 'Motores disponibles' },
    { to: '/instancias', icon: Box, label: 'Mis instancias' },
    { to: '/plan', icon: CreditCard, label: 'Mi plan' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-border dark:border-slate-700 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border dark:border-slate-700">
        <h1 className="text-xl font-semibold text-text dark:text-white">CrudCloud</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
