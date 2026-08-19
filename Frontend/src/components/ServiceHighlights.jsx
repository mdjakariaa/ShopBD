import exchangeIcon from '../assets/exchange_icon.png'
import qualityIcon from '../assets/quality_icon.png'
import supportIcon from '../assets/support_img.png'

const services = [
  [exchangeIcon, 'Easy Exchange Policy', 'We offer hassle free exchange policy'],
  [qualityIcon, '7 Days Return Policy', 'We provide 7 days free return policy'],
  [supportIcon, 'Best Customer Support', 'We provide 24/7 customer support'],
]

export default function ServiceHighlights() {
  return (
    <section className="animate-enter grid gap-14 py-16 text-center sm:grid-cols-3 sm:gap-6 sm:py-24 lg:py-28">
      {services.map(([icon, title, copy]) => (
        <div key={title} className="group mx-auto max-w-[280px] px-4 py-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e5d9cc] bg-ivory shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-soft">
            <img src={icon} alt="" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10" />
          </div>
          <h3 className="mt-5 text-[12px] font-semibold text-ink sm:text-[13px] lg:text-[14px]">{title}</h3>
          <p className="mt-2 text-[10px] leading-5 text-muted sm:text-[11px] lg:text-[12px]">{copy}</p>
        </div>
      ))}
    </section>
  )
}
