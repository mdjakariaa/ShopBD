import Layout from '../components/Layout'
import SectionTitle from '../components/SectionTitle'
import Newsletter from '../components/Newsletter'
import aboutImage from '../assets/about_img.png'

export default function About() {
  return (
    <Layout>
      <div className="page-container pt-16 sm:pt-20 lg:pt-24">
        <SectionTitle first="ABOUT" strong="US" />
        <section className="animate-enter mt-10 grid items-center gap-10 md:grid-cols-[.9fr_1.1fr] lg:mt-14 lg:gap-24">
          <div className="overflow-hidden rounded-[24px] border border-[#e2d6c9] shadow-soft">
            <img src={aboutImage} alt="Clothing and accessories arranged on a white surface" className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.02]" />
          </div>
          <div className="space-y-7 text-[12px] leading-7 text-[#635c55] sm:text-[13px] lg:text-[14px] lg:leading-8">
            <p>ShopBD Was Born Out Of A Passion For Innovation And A Desire To Revolutionize The Way People Shop Online. Our Journey Began With A Simple Idea: To Provide A Platform Where Customers Can Easily Discover, Explore, And Purchase A Wide Range Of Products From The Comfort Of Their Homes.</p>
            <p>Since Our Inception, We've Worked Tirelessly To Curate A Diverse Selection Of High-Quality Products That Cater To Every Taste And Preference. From Fashion And Beauty To Electronics And Home Essentials, We Offer An Extensive Collection Sourced From Trusted Brands And Suppliers.</p>
            <div>
              <h3 className="mb-4 font-semibold text-ink">Our Mission</h3>
              <p>Our Mission At ShopBD Is To Empower Customers With Choice, Convenience, And Confidence. We're Dedicated To Providing A Seamless Shopping Experience That Exceeds Expectations, From Browsing And Ordering To Delivery And Beyond.</p>
            </div>
          </div>
        </section>

        <section className="animate-enter-delay pt-20 lg:pt-24">
          <SectionTitle first="WHY" strong="CHOOSE US" centered={false} />
          <div className="mt-10 grid overflow-hidden rounded-[22px] border border-line bg-ivory/60 shadow-soft md:grid-cols-3">
            {[
              ['QUALITY ASSURANCE:', 'We Meticulously Select And Vet Each Product To Ensure It Meets Our Stringent Quality Standards.'],
              ['CONVENIENCE:', 'With Our User-Friendly Interface And Hassle-Free Ordering Process, Shopping Has Never Been Easier.'],
              ['EXCEPTIONAL CUSTOMER SERVICE:', 'Our Team Of Dedicated Professionals Is Here To Assist You The Way, Ensuring Your Satisfaction Is Our Top Priority.'],
            ].map(([title, copy], index) => (
              <div key={title} className={`min-h-[220px] p-8 transition-colors duration-300 hover:bg-white/75 sm:p-10 lg:flex lg:min-h-[270px] lg:flex-col lg:justify-center lg:px-14 ${index ? 'border-t border-line md:border-l md:border-t-0' : ''}`}>
                <h3 className="text-[11px] font-semibold tracking-[0.04em] text-ink sm:text-[12px]">{title}</h3>
                <p className="mt-7 text-[11px] leading-6 text-muted sm:text-[12px]">{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <Newsletter />
      </div>
    </Layout>
  )
}
