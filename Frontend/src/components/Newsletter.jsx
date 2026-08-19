import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="animate-enter mx-auto my-12 max-w-[820px] rounded-[28px] border border-[#e6d9ca] bg-gradient-to-br from-ivory via-[#fcf8f2] to-[#f3e9dd] px-5 py-14 text-center shadow-soft sm:my-16 sm:px-10 sm:py-20 lg:my-20 lg:py-24">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9b735e] sm:text-[11px]">A little extra, just for you</p>
      <h2 className="mt-3 text-[22px] font-medium text-ink sm:text-[27px] lg:text-[31px]">Subscribe now &amp; get 20% off</h2>
      <p className="mx-auto mt-4 max-w-[560px] text-[11px] leading-5 text-muted sm:text-[12px] lg:text-[13px]">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      {submitted ? (
        <p className="mx-auto mt-8 max-w-[650px] rounded-xl border border-[#d9cbbb] bg-white/70 px-5 py-4 text-sm text-[#4e463f]">Thanks for subscribing.</p>
      ) : (
        <form onSubmit={submit} className="mx-auto mt-8 flex max-w-[650px] flex-col gap-2 sm:flex-row sm:gap-0">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email id" className="field h-[50px] min-w-0 flex-1 px-5 text-[11px] sm:h-[54px] sm:rounded-r-none" />
          <button className="btn-primary h-[50px] rounded-xl px-6 text-[10px] sm:h-[54px] sm:rounded-l-none sm:px-10 sm:text-[11px]">SUBSCRIBE</button>
        </form>
      )}
    </section>
  )
}
