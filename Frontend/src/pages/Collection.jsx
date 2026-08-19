import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { useStore } from '../StoreContext'

const categories = ['Men', 'Women', 'Kids']
const types = ['Topwear', 'Bottomwear', 'Winterwear']

export default function Collection() {
  const { products } = useStore()
  const [params] = useSearchParams()
  const searchQuery = (params.get('q') || '').toLowerCase()
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [sort, setSort] = useState('relevant')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const toggle = (value, setter) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value])

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(product.subCategory)
      const searchMatch = !searchQuery || `${product.name} ${product.category} ${product.subCategory}`.toLowerCase().includes(searchQuery)
      return categoryMatch && typeMatch && searchMatch
    })
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [products, selectedCategories, selectedTypes, sort, searchQuery])

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-[12px] font-semibold tracking-[0.06em] text-ink">CATEGORIES</h3>
        <div className="space-y-3">
          {categories.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 text-[12px] text-[#5f5851] transition-colors hover:text-black">
              <input type="checkbox" checked={selectedCategories.includes(item)} onChange={() => toggle(item, setSelectedCategories)} className="h-3.5 w-3.5 accent-[#2d2925]" />
              {item}
            </label>
          ))}
        </div>
      </div>
      <div className="border-t border-line pt-6">
        <h3 className="mb-4 text-[12px] font-semibold tracking-[0.06em] text-ink">TYPE</h3>
        <div className="space-y-3">
          {types.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-1 text-[12px] text-[#5f5851] transition-colors hover:text-black">
              <input type="checkbox" checked={selectedTypes.includes(item)} onChange={() => toggle(item, setSelectedTypes)} className="h-3.5 w-3.5 accent-[#2d2925]" />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="page-container pt-10 sm:pt-14 lg:pt-16">
        <div className="animate-enter grid gap-8 lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-2xl border border-[#e5dace] bg-ivory/70 p-5 shadow-[0_8px_24px_rgba(67,54,38,0.04)]">
              <h2 className="mb-8 text-[15px] font-semibold tracking-[0.06em]">FILTERS</h2>
              <FilterPanel />
            </div>
          </aside>

          <section>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 sm:mb-10">
              <div className="flex items-center gap-5">
                <button onClick={() => setFiltersOpen((value) => !value)} className="btn-secondary px-4 py-2 text-[11px] lg:hidden">FILTERS</button>
                <h1 className="section-rule-title"><span>ALL <strong>COLLECTIONS</strong></span></h1>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="field h-10 bg-ivory px-3 text-[11px] sm:min-w-[205px]">
                <option value="relevant">Sort by: Relevant</option>
                <option value="low">Sort by: Low to High</option>
                <option value="high">Sort by: High to Low</option>
              </select>
            </div>

            {filtersOpen && <div className="fade-in mb-8 rounded-2xl border border-line bg-ivory/80 p-5 shadow-soft lg:hidden"><FilterPanel /></div>}

            {searchQuery && <p className="mb-6 text-xs text-muted">Showing results for “{params.get('q')}”</p>}

            {filtered.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-9">
                {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-ivory/60 py-24 text-center text-sm text-muted">No products match your filters.</div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  )
}
