import { useEffect, useState } from 'react';
import WordCard from './WordCard';
import EmptyState from '../common/EmptyState';

const STEP = 12;

export default function ListView({ words, categories, onReset }) {
  const [shown, setShown] = useState(STEP);
  useEffect(() => setShown(STEP), [words]);
  if (!words.length) {
    return (
      <EmptyState dashed title="Không tìm thấy thuật ngữ phù hợp" text="Hãy thử tìm từ khóa khác (ví dụ: game, Jira, deadline, phỏng vấn...)">
        <button type="button" className="btn btn-outline btn-sm" onClick={onReset} style={{ marginTop: 14 }}>Xóa bộ lọc tìm kiếm</button>
      </EmptyState>
    );
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Hiển thị <strong>{words.length}</strong> thuật ngữ chuyên ngành</span>
      </div>
      <div className="spec-grid">
        {words.slice(0, shown).map((w, i) => <WordCard key={`${w.zh}-${i}`} word={w} category={categories.find((c) => c.id === w.category)} />)}
      </div>
      {shown < words.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <button type="button" className="btn btn-outline" onClick={() => setShown((n) => n + STEP)}>
            Hiện thêm {Math.min(STEP, words.length - shown)} thuật ngữ ({words.length - shown} còn lại)
          </button>
        </div>
      )}
    </>
  );
}
