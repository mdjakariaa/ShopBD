import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const baseLinkClass =
  'flex items-center gap-3 rounded-l border border-r-0 border-gray-300 px-3 py-2'

function getNavClass({ isActive }) {
  return `${baseLinkClass} ${
    isActive ? 'border-[#C586A5] bg-[#ffebf5]' : 'bg-transparent'
  }`
}

function Sidebar() {
  return (
    <aside className="w-[18%] shrink-0 self-stretch border-r-2 border-gray-200 bg-[#f7fcf8]">
      <nav className="flex flex-col gap-4 pl-[20%] pt-6 text-[15px]">
        <NavLink className={getNavClass} to="/add">
          <img className="h-5 w-5 shrink-0" src={assets.add_icon} alt="" />
          <span className="hidden whitespace-nowrap text-gray-800 md:block">
            Add Items
          </span>
        </NavLink>

        <NavLink className={getNavClass} to="/list">
          <img className="h-5 w-5 shrink-0" src={assets.order_icon} alt="" />
          <span className="hidden whitespace-nowrap text-gray-800 md:block">
            List Items
          </span>
        </NavLink>

        <NavLink className={getNavClass} to="/orders">
          <img className="h-5 w-5 shrink-0" src={assets.order_icon} alt="" />
          <span className="hidden whitespace-nowrap text-gray-800 md:block">
            Orders
          </span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
