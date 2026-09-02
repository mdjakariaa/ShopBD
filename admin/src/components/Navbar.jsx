import { assets } from '../assets/assets'

function Navbar({ setToken }) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-[#ebeeeb] bg-[#f7fcf8] px-[4%] py-2">
      <img
        className="block w-[max(10%,80px)] select-none"
        src={assets.logo}
        alt="Admin Panel"
        draggable="false"
      />

      <button
        onClick={() => setToken("")}
        type="button"
        className="rounded-full bg-gray-600 px-5 py-2 text-xs text-white sm:px-7 sm:py-2 sm:text-sm"
      >
        Logout
      </button>
    </header>
  )
}

export default Navbar
