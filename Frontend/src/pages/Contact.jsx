import Layout from '../components/Layout'
import SectionTitle from '../components/SectionTitle'
import Newsletter from '../components/Newsletter'
import contactImage from '../assets/contact_img.png'

export default function Contact() {
  return (
    <Layout>
      <div className="page-container min-h-[1200px] pt-16 sm:min-h-[1700px] sm:pt-20 lg:min-h-[2100px] lg:pt-24">
        <SectionTitle first="CONTACT" strong="US" />
        <section className="animate-enter mx-auto mt-10 grid max-w-[1280px] items-center gap-10 md:grid-cols-[1.05fr_.95fr] lg:mt-14 lg:gap-16">
          <div className="overflow-hidden rounded-[24px] border border-[#e2d6c9] shadow-soft">
            <img src={contactImage} alt="Laptop, phone and desk workspace" className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]" />
          </div>
          <div className="text-[12px] leading-6 text-[#635c55] sm:text-[13px] lg:text-[14px] lg:leading-7">
            <h2 className="text-[18px] font-semibold text-ink lg:text-[20px]">OUR STORE</h2>
            <p className="mt-7">455 Sylhet<br />Sylhet, Bangladesh</p>
            <p className="mt-7">Tel: 099456<br />Email: shopbd.dev@gmail.com</p>
            <h2 className="mt-10 text-[18px] font-semibold text-ink lg:text-[20px]">CAREERS AT SHOPBD</h2>
            <p className="mt-5">Learn more about our teams and job openings.</p>
            <button className="btn-secondary mt-7 h-12 px-8 text-[11px]">Explore Jobs</button>
          </div>
        </section>
        <Newsletter />
      </div>
    </Layout>
  )
}
