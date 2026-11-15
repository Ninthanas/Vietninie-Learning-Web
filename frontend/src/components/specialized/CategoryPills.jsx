export default function CategoryPills({ categories, words, value, onChange }) {
  return (
    <div className="spec-category-scroll">
      <button type="button" className={`spec-cat-pill ${value === 'all' ? 'active' : ''}`} onClick={() => onChange('all')}>
        <span>🌟 Tất cả</span>
        <span className="cat-count">{words.length}</span>
      </button>
      {categories.map((c) => (
        <button key={c.id} type="button" className={`spec-cat-pill ${value === c.id ? 'active' : ''}`} onClick={() => onChange(c.id)}>
          <span>{c.icon} {c.name_vi}</span>
          <span className="cat-count">{words.filter((w) => w.category === c.id).length}</span>
        </button>
      ))}
    </div>
  );
}
