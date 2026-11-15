import { useLanguage } from '../../hooks/useLanguage';

const MAX_BUTTONS = 7;

export default function Pagination({ page, totalPages, onChange }) {
  const { isLearningZh } = useLanguage();
  if (totalPages <= 0) return null;

  let start = Math.max(1, page - 3);
  const end = Math.min(totalPages, start + MAX_BUTTONS - 1);
  if (end - start < MAX_BUTTONS - 1) start = Math.max(1, end - MAX_BUTTONS + 1);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="pagination-bar">
      <button type="button" className="btn btn-sm btn-outline" disabled={page === 1} onClick={() => onChange(page - 1)}>
        ← {isLearningZh ? 'Trước' : '上一页'}
      </button>
      {pages.map((p) => (
        <button key={p} type="button" className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button type="button" className="btn btn-sm btn-outline" disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        {isLearningZh ? 'Tiếp' : '下一页'} →
      </button>
    </div>
  );
}
