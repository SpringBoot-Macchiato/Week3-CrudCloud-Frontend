import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Moon, Sun, LogOut, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-end px-8 gap-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium text-sm">
              {user?.email?.[0]?.toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-text">{user?.email}</span>
          <ChevronDown size={16} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text hover:bg-slate-50 transition-colors"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
