import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import logo from '../assets/logo.png'
import searchIcon from '../assets/search_icon.png'
import profileIcon from '../assets/profile-icon.png'
import cartIcon from '../assets/cart_icon.png'
import menuIcon from '../assets/menu_icon.png'
import { useStore } from '../StoreContext'

const desktopLinks = [
  ['/', 'HOME'],
  ['/collection', 'COLLECTION'],
  ['/about', 'ABOUT'],
  ['/contact', 'CONTACT'],
]

export default function Navbar() {
  const { cartCount, token, logout } = useStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const profileRef = useRef(null)

  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const submitSearch = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/collection?q=${encodeURIComponent(trimmed)}` : '/collection')
    setSearchOpen(false)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    setProfileOpen(false)
    navigate('/login')
  }

  const handleProfileClick = () => {
    if (!token) {
      navigate('/login')
    } else {
      setProfileOpen((value) => !value)
    }
  }

  return (
    <>
      <header className="page-container border-b border-line/90 bg-ivory/60">
        <div className="flex h-[98px] items-center justify-between sm:h-[92px] lg:h-[98px]">
          <NavLink to="/" aria-label="Forever home" onClick={() => setMenuOpen(false)} className="rounded-md transition-opacity duration-300 hover:opacity-75">
            <img src={logo} alt="Forever" className="w-[122px] sm:w-[150px] lg:w-[176px]" />
          </NavLink>

          <nav className="hidden items-center gap-12 text-[13px] tracking-[0.045em] md:flex lg:gap-14">
            {desktopLinks.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative rounded-md px-1 py-3 transition-colors duration-300 hover:text-black ${isActive ? 'font-medium text-black' : 'text-[#4a4540]'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`absolute bottom-[4px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-espresso to-[#a88975] transition-all duration-300 ${isActive ? 'w-7 opacity-100' : 'w-0 opacity-0'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen((value) => !value)} className="icon-button" aria-label="Search" aria-expanded={searchOpen}>
              <img src={searchIcon} alt="" className="h-[22px] w-[22px] object-contain sm:h-6 sm:w-6" />
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={handleProfileClick}
                className="icon-button"
                aria-label="Profile menu"
                aria-expanded={profileOpen}
              >
                <img src={profileIcon} alt="" className="h-[22px] w-[19px] object-contain sm:h-6 sm:w-6" />
              </button>
              {token && profileOpen && (
                <div className="fade-in absolute right-0 top-12 z-50 w-[170px] overflow-hidden rounded-2xl border border-line bg-ivory py-2 text-[13px] shadow-lift">
                  <button
                    onClick={() => {
                      navigate('/orders')
                      setProfileOpen(false)
                    }}
                    className="block w-full px-5 py-2.5 text-left text-[#514a44] transition-colors hover:bg-cream hover:text-black"
                  >
                    Orders
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-5 py-2.5 text-left text-[#514a44] transition-colors hover:bg-cream hover:text-black"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => navigate('/cart')} className="icon-button relative" aria-label={`Cart with ${cartCount} items`}>
              <img src={cartIcon} alt="" className="h-[24px] w-[23px] object-contain sm:h-7 sm:w-7" />
              <span className="absolute bottom-0 right-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-espresso px-1 text-[9px] leading-none text-white shadow-sm">
                {cartCount}
              </span>
            </button>

            <button onClick={() => setMenuOpen((value) => !value)} className="icon-button ml-0.5 md:hidden" aria-label="Toggle menu" aria-expanded={menuOpen}>
              <img src={menuIcon} alt="" className="h-[23px] w-[31px] object-contain" />
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="fade-in flex items-center gap-3 border-t border-line py-4">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="field h-11 flex-1 px-4 text-sm"
            />
            <button className="btn-primary h-11 px-6 text-xs">SEARCH</button>
          </form>
        )}
      </header>

      {menuOpen && (
        <div className="fade-in page-container overflow-hidden rounded-b-2xl border-b border-line bg-ivory/95 pb-2 shadow-soft md:hidden">
          {desktopLinks.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => `flex items-center justify-between border-t border-line/70 px-3 py-4 text-xs transition-colors hover:bg-cream ${isActive ? 'font-semibold text-black' : 'text-[#514a44]'}`}
            >
              {label}<span aria-hidden="true">›</span>
            </NavLink>
          ))}
          {token ? (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/orders')
                }}
                className="flex w-full items-center justify-between border-t border-line/70 px-3 py-4 text-left text-xs text-[#514a44] transition-colors hover:bg-cream"
              >
                Orders<span aria-hidden="true">›</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="flex w-full items-center justify-between border-t border-line/70 px-3 py-4 text-left text-xs text-[#514a44] transition-colors hover:bg-cream"
              >
                Logout<span aria-hidden="true">›</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/login')
                }}
                className="flex w-full items-center justify-between border-t border-line/70 px-3 py-4 text-left text-xs text-[#514a44] transition-colors hover:bg-cream"
              >
                Login<span aria-hidden="true">›</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/signup')
                }}
                className="flex w-full items-center justify-between border-t border-line/70 px-3 py-4 text-left text-xs text-[#514a44] transition-colors hover:bg-cream"
              >
                Sign Up<span aria-hidden="true">›</span>
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
