import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout({ setToken }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7fcf8]">
      <Navbar setToken={setToken} /> 

      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 bg-[#eff2f0fa] p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
