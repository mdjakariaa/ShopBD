import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
