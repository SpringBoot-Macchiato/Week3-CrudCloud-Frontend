import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, Box, CreditCard, X } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const links = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/app/motores', icon: Database, label: 'Motores disponibles' },
    { to: '/app/instancias', icon: Box, label: 'Mis instancias' },
    { to: '/app/plan', icon: CreditCard, label: 'Mi plan' },
  ]

  const handleLinkClick = () => {
    // Cerrar sidebar en mobile al hacer click en un link
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900
          border-r border-border dark:border-slate-700 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header con botón de cerrar en mobile */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border dark:border-slate-700">
          <h1 className="text-xl font-semibold text-text dark:text-white">CrudCloud</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
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
    </>
  )
}

export default Sidebar
