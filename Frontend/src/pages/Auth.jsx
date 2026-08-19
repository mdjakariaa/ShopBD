import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Newsletter from '../components/Newsletter'

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()

  const submit = (event) => {
    event.preventDefault()
    navigate('/collection')
  }

  return (
    <Layout>
      <div className="page-container min-h-[1350px]">
        <section className="animate-enter mx-auto max-w-[560px] pt-20 sm:pt-28 lg:pt-36">
          <div className="rounded-[24px] border border-[#e3d7ca] bg-ivory/70 p-6 shadow-soft sm:p-9">
            <div className="flex items-center justify-center gap-3">
              <h1 className="font-serifDisplay text-[33px] text-[#342f2b] sm:text-[40px]">{isLogin ? 'Login' : 'Sign Up'}</h1>
              <span className="mt-2 h-px w-10 bg-gradient-to-r from-espresso to-[#a88975]" />
            </div>
            <form onSubmit={submit} className="mt-10 space-y-4">
              {!isLogin && <input required placeholder="Name" className="field h-[52px] w-full px-4 text-[13px]" />}
              <input required type="email" placeholder="Email" className="field h-[52px] w-full px-4 text-[13px]" />
              <input required type="password" minLength="6" placeholder="Password" className="field h-[52px] w-full px-4 text-[13px]" />
              {isLogin && (
                <div className="flex justify-between text-[11px] text-[#5c554e] sm:text-[12px]">
                  <button type="button" className="link-underline">Forgot your password?</button>
                  <Link className="link-underline" to="/signup">Create account</Link>
                </div>
              )}
              {!isLogin && <div className="text-right text-[11px] text-[#5c554e]"><Link className="link-underline" to="/login">Already have an account?</Link></div>}
              <div className="pt-5 text-center">
                <button className="btn-primary h-[48px] min-w-[120px] px-8 text-[13px]">{isLogin ? 'Sign in' : 'Create'}</button>
              </div>
            </form>
          </div>
        </section>
        <div className="pt-24 sm:pt-32 lg:pt-40"><Newsletter /></div>
      </div>
    </Layout>
  )
}
