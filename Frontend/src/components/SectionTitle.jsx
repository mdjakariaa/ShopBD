export default function SectionTitle({ first, strong, centered = true }) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <h2 className="section-rule-title">
        <span>{first} <strong>{strong}</strong></span>
      </h2>
    </div>
  )
}
