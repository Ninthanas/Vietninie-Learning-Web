import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { getTopics } from '../../services/dataService';

const TABS = [
  ['all', 'Chủ đề'],
  ['learned', 'Đã học'],
  ['favorite', 'Yêu thích'],
  ['review', 'Cần ôn']
];
const STATUS_OPTIONS = [['all', 'Mọi trạng thái'], ['learned', 'Đã học'], ['unlearned', 'Chưa học'], ['favorite', 'Yêu thích'], ['review', 'Cần ôn (SRS)']];

/** Search + quick tabs; the detailed filters sit behind a "Lọc" button so the page stays calm. */
export default function VocabToolbar({ filters, onChange, totalCount, wordTypes }) {
  const { isLearningZh } = useLanguage();
  const [open, setOpen] = useState(false);
  const topics = getTopics();
  const levels = isLearningZh ? ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'] : ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const set = (patch) => onChange({ ...filters, ...patch });
  const activeCount = ['level', 'wordType'].filter((k) => filters[k] !== 'all').length + (['all', 'learned', 'favorite', 'review'].includes(filters.status) ? 0 : 1);

  return (
    <div className="vocab-toolbar">
      <div className="search-row">
        <div className="search-input-wrap">
          <svg className="search-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => set({ query: e.target.value })}
            placeholder={isLearningZh ? 'Tìm chữ Hán, pinyin, nghĩa Việt' : '搜索越南语或中文'}
            aria-label="Tìm từ vựng"
          />
        </div>
        <button type="button" className="btn btn-outline filter-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Lọc{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      <div className="status-pills" role="tablist" aria-label="Nhóm từ">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={filters.status === id} className={`status-pill ${filters.status === id ? 'active' : ''}`} onClick={() => set({ status: id, topic: id === 'all' ? filters.topic : 'all' })}>
            {label}
          </button>
        ))}
      </div>

      {open && (
        <div className="filter-controls-grid filter-panel-open">
          <select className="filter-select" aria-label="Chủ đề" value={filters.topic} onChange={(e) => set({ topic: e.target.value })}>
            <option value="all">{isLearningZh ? `Tất cả chủ đề (${totalCount} từ)` : `全部主题 (${totalCount} 词)`}</option>
            {topics.map((tp) => <option key={tp.key} value={tp.key}>{isLearningZh ? tp.vi : tp.zh}</option>)}
          </select>
          <select className="filter-select" aria-label="Cấp độ" value={filters.level} onChange={(e) => set({ level: e.target.value })}>
            <option value="all">{isLearningZh ? 'Mọi cấp độ (HSK 1–6)' : '所有等级 (A1–C2)'}</option>
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className="filter-select" aria-label="Từ loại" value={filters.wordType} onChange={(e) => set({ wordType: e.target.value })}>
            <option value="all">{isLearningZh ? 'Mọi từ loại' : '所有词性'}</option>
            {wordTypes.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
          <select className="filter-select" aria-label="Trạng thái" value={filters.status} onChange={(e) => set({ status: e.target.value })}>
            {STATUS_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
