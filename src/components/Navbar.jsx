import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { Moon, Sun, LogOut, ChevronDown, Menu } from 'lucide-react'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 flex items-center justify-between px-4 md:px-8 gap-4">
      {/* Botón hamburger - solo visible en mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={24} className="text-slate-600 dark:text-slate-300" />
      </button>

      {/* Espaciador para mantener los botones a la derecha en desktop */}
      <div className="flex-1 md:hidden" />

      {/* Botones de acción */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun size={20} className="text-slate-300" /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            {/* Email solo visible en pantallas medianas y grandes */}
            <span className="hidden md:inline text-sm text-text dark:text-slate-200">
              {user?.email}
            </span>
            <ChevronDown size={16} className="dark:text-slate-300" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-border dark:border-slate-700 py-2 z-50">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
