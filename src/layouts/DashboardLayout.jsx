import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Contenido principal con margin responsive */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
