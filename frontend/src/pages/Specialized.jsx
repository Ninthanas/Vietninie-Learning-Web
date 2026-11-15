import { useMemo, useState } from 'react';
import Loading from '../components/common/Loading';
import ModeTabs from '../components/specialized/ModeTabs';
import CategoryPills from '../components/specialized/CategoryPills';
import ListView from '../components/specialized/ListView';
import InterviewView from '../components/specialized/InterviewView';
import CheatsheetView from '../components/specialized/CheatsheetView';
import FlashcardView from '../components/specialized/FlashcardView';
import { useAsyncData } from '../hooks/useAsyncData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getSpecializedData } from '../services/dataService';


export default function Specialized() {
  const { data, loading } = useAsyncData(() => getSpecializedData(), []);
  const [mode, setMode] = useState('list');
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  useDocumentTitle('Vietninie • Chuyên ngành');

  const words = data?.words || [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (category !== 'all' && w.category !== category) return false;
      if (!q) return true;
      return (
        w.zh.toLowerCase().includes(q) || (w.zh_tw && w.zh_tw.toLowerCase().includes(q)) || w.pinyin.toLowerCase().includes(q) ||
        w.vi.toLowerCase().includes(q) || (w.explanation && w.explanation.toLowerCase().includes(q))
      );
    });
  }, [words, category, query]);

  const reset = () => { setQuery(''); setCategory('all'); };

  return (
    <section className="section-block">
      <div className="container">
        <section className="spec-hero">
          <div className="spec-hero-eyebrow"><span>💼 CHUYÊN NGÀNH THỰC CHIẾN</span><span>•</span><span>VIỆT ⇄ TRUNG</span></div>
          <h1 className="spec-hero-title">Chuyên ngành: Game, PM, Đối tác, Phỏng vấn</h1>
          <p className="spec-hero-desc">Thuật ngữ và tình huống công sở dùng ngay khi làm việc với đối tác Trung Quốc.</p>
        </section>

        <ModeTabs mode={mode} onChange={setMode} />

        {loading || !data ? (
          <Loading />
        ) : (
          <>
            {(mode === 'list' || mode === 'flashcard') && (
              <div>
                <div className="spec-search-bar">
                  <div className="spec-search-input-wrap">
                    <span className="spec-search-icon">🔍</span>
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Tìm kiếm thuật ngữ chuyên ngành"
                      placeholder="Tìm theo chữ Hán (游戏, 截止日期), Pinyin (kaifa), nghĩa tiếng Việt (quản lý dự án) hoặc công cụ..." />
                  </div>
                </div>
                <CategoryPills categories={data.categories || []} words={words} value={category} onChange={setCategory} />
              </div>
            )}
            <div>
              {mode === 'list' && <ListView words={filtered} categories={data.categories || []} onReset={reset} />}
              {mode === 'interview' && <InterviewView scenarios={data.interview_scenarios} />}
              {mode === 'cheatsheet' && <CheatsheetView data={data} />}
              {mode === 'flashcard' && <FlashcardView words={filtered} />}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
