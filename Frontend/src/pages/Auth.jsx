import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import Newsletter from '../components/Newsletter'
import { useStore } from '../StoreContext'

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { token, setToken, backendUrl } = useStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        })

        if (response.data.success) {
          setToken(response.data.token)
          toast.success('Logged in successfully!')
          navigate('/')
        } else {
          toast.error(response.data.message)
        }
      } else {
        if (password.length < 8) {
          toast.error('Please enter a strong password (minimum 8 characters)')
          setLoading(false)
          return
        }

        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        })

        if (response.data.success) {
          setToken(response.data.token)
          toast.success('Account created successfully!')
          navigate('/')
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="page-container min-h-[1350px]">
        <section className="animate-enter mx-auto max-w-[560px] pt-20 sm:pt-28 lg:pt-36">
          <div className="rounded-[24px] border border-[#e3d7ca] bg-ivory/70 p-6 shadow-soft sm:p-9">
            <div className="flex items-center justify-center gap-3">
              <h1 className="font-serifDisplay text-[33px] text-[#342f2b] sm:text-[40px]">
                {isLogin ? 'Login' : 'Sign Up'}
              </h1>
              <span className="mt-2 h-px w-10 bg-gradient-to-r from-espresso to-[#a88975]" />
            </div>
            <form onSubmit={submit} className="mt-10 space-y-4">
              {!isLogin && (
                <input
                  required
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field h-[52px] w-full px-4 text-[13px]"
                />
              )}
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field h-[52px] w-full px-4 text-[13px]"
              />
              <input
                required
                type="password"
                minLength={isLogin ? 1 : 8}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field h-[52px] w-full px-4 text-[13px]"
              />
              {isLogin && (
                <div className="flex justify-between text-[11px] text-[#5c554e] sm:text-[12px]">
                  <button type="button" className="link-underline">
                    Forgot your password?
                  </button>
                  <Link className="link-underline" to="/signup">
                    Create account
                  </Link>
                </div>
              )}
              {!isLogin && (
                <div className="text-right text-[11px] text-[#5c554e]">
                  <Link className="link-underline" to="/login">
                    Already have an account?
                  </Link>
                </div>
              )}
              <div className="pt-5 text-center">
                <button
                  disabled={loading}
                  className="btn-primary h-[48px] min-w-[120px] px-8 text-[13px] disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </section>
        <div className="pt-24 sm:pt-32 lg:pt-40">
          <Newsletter />
        </div>
      </div>
    </Layout>
  )
}
