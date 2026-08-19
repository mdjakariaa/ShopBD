import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

const footerLinkClass = 'transition-colors duration-300 hover:text-black focus-visible:text-black'

export default function Footer() {
  return (
    <footer className="page-container mt-auto pt-20 sm:pt-28 lg:pt-36">
      <div className="rounded-t-[28px] border-x border-t border-[#e6ddd0] bg-gradient-to-b from-ivory/80 to-[#f7f0e7]/80 px-5 pt-10 sm:px-10 lg:px-14 lg:pt-14">
        <div className="pb-10 text-center sm:hidden">
          <img src={logo} alt="Forever" className="mx-auto mb-7 w-[150px]" />
          <p className="mx-auto max-w-[530px] text-[11px] leading-5 text-[#676057]">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1700s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] text-[#676057]">
            <Link className={footerLinkClass} to="/">Home</Link>
            <Link className={footerLinkClass} to="/about">About us</Link>
            <Link className={footerLinkClass} to="/checkout">Delivery</Link>
            <a className={footerLinkClass} href="#privacy">Privacy policy</a>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] text-[#676057]">
            <p>+01712345678</p>
            <p>shopbd.dev@gmail.com</p>
          </div>
        </div>

        <div className="hidden gap-12 pb-12 sm:grid sm:grid-cols-[1.7fr_.7fr_.8fr] sm:gap-16 lg:pb-16">
          <div className="max-w-[560px]">
            <img src={logo} alt="Forever" className="mb-7 w-[150px] lg:w-[176px]" />
            <p className="text-[12px] leading-6 text-[#676057] lg:text-[14px] lg:leading-7">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div>
            <h3 className="mb-6 text-[14px] font-semibold tracking-wide text-ink lg:text-[16px]">COMPANY</h3>
            <div className="flex flex-col gap-3 text-[12px] text-[#676057] lg:text-[14px]">
              <Link className={footerLinkClass} to="/">Home</Link>
              <Link className={footerLinkClass} to="/about">About us</Link>
              <Link className={footerLinkClass} to="/checkout">Delivery</Link>
              <a className={footerLinkClass} href="#privacy">Privacy policy</a>
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-[14px] font-semibold tracking-wide text-ink lg:text-[16px]">GET IN TOUCH</h3>
            <div className="space-y-3 text-[12px] text-[#676057] lg:text-[14px]">
              <p>+01712345678</p>
              <p>shopbd.dev@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-line py-6 text-center text-[10px] text-[#746d64] sm:text-[12px] lg:text-[13px]">
          Copyright 2026 © ShopBD.dev - All Right Reserved.
        </div>
      </div>
    </footer>
  )
}
