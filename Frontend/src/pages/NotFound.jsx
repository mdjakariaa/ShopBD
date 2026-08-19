import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="page-container py-32 text-center">
        <div className="animate-enter mx-auto max-w-[520px] rounded-[24px] border border-line bg-ivory/70 px-6 py-16 shadow-soft">
          <h1 className="font-serifDisplay text-5xl text-ink">404</h1>
          <p className="mt-4 text-sm text-muted">The page you requested could not be found.</p>
          <Link to="/" className="btn-primary mt-8 h-12 px-8 text-xs">BACK HOME</Link>
        </div>
      </div>
    </Layout>
  )
}
