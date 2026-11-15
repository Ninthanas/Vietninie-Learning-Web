import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import Loading from '../components/common/Loading';
import VocabToolbar from '../components/vocabulary/VocabToolbar';
import VocabCard from '../components/vocabulary/VocabCard';
import VocabFlashcard from '../components/vocabulary/VocabFlashcard';
import { useVocabulary } from '../hooks/useVocabulary';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../hooks/useProgress';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { stripTones } from '../utils/helpers';
import { getTopics } from '../services/dataService';
import { topicStats, cleanTopicName } from '../utils/topics';
import TopicGrid from '../components/vocabulary/TopicGrid';

const PAGE_SIZE = 24;
const DEFAULT_FILTERS = { query: '', status: 'all', topic: 'all', level: 'all', wordType: 'all' };

function matches(item, f, sets) {
  if (f.status === 'learned' && !sets.learned.has(item.id)) return false;
  if (f.status === 'unlearned' && sets.learned.has(item.id)) return false;
  if (f.status === 'favorite' && !sets.favorites.has(item.id)) return false;
  if (f.status === 'review' && !sets.review.has(item.id)) return false;
  if (f.topic !== 'all' && (item.topic_key || item.topic) !== f.topic) return false;
  if (f.level !== 'all' && item.level !== f.level) return false;
  if (f.wordType !== 'all' && item.word_type !== f.wordType) return false;

  const q = f.query.trim().toLowerCase();
  if (!q) return true;
  const qNo = stripTones(q);
  const w = (item.word || '').toLowerCase();
  const py = (item.pinyin || item.pronunciation_guide || '').toLowerCase();
  const mVi = (item.meaning_vi || '').toLowerCase();
  const mZh = (item.meaning_zh || '').toLowerCase();
  const tZh = (item.topic_label_zh || '').toLowerCase();
  return (
    w.includes(q) || stripTones(w).includes(qNo) || py.includes(q) || stripTones(py).includes(qNo) ||
    mVi.includes(q) || stripTones(mVi).includes(qNo) || mZh.includes(q) ||
    stripTones(item.topic_label_vi || '').includes(qNo) || tZh.includes(q)
  );
}

export default function Vocabulary() {
  const { isLearningZh, t } = useLanguage();
  const { items, loading } = useVocabulary();
  const { learned, favorites, review } = useProgress();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'flashcard' ? 'flashcard' : 'list');
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, topic: params.get('topic') || 'all', status: params.get('status') || 'all', query: params.get('q') || '' });
  const [page, setPage] = useState(1);
  useDocumentTitle('Vietninie • ' + t('vocabPageTitle', 'Kho từ vựng'));

  // Level / word-type values differ per direction: reset them when the direction changes.
  useEffect(() => {
    setFilters((f) => ({ ...f, level: 'all', wordType: 'all' }));
  }, [isLearningZh]);
  useEffect(() => setPage(1), [filters]);

  const wordTypes = useMemo(() => [...new Set(items.map((i) => i.word_type))].filter(Boolean), [items]);
  const filtered = useMemo(
    () => items.filter((i) => matches(i, filters, { learned, favorites, review })),
    [items, filters, learned, favorites, review]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const slice = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const noFilters = filters.topic === 'all' && filters.status === 'all' && !filters.query.trim() && filters.level === 'all' && filters.wordType === 'all';
  const showTopics = mode === 'list' && noFilters;
  const stats = useMemo(() => topicStats(getTopics(), items, learned), [items, learned]);
  const activeTopic = filters.topic !== 'all' ? stats.find((x) => x.topic.key === filters.topic) : null;
  const pickTopic = (key) => {
    setFilters({ ...DEFAULT_FILTERS, topic: key });
    window.scrollTo({ top: 0 });
  };

  return (
    <section className="section-block">
      <div className="container">
        <div className="page-head">
          <div>
            {activeTopic ? (
              <>
                <button type="button" className="back-link" onClick={() => setFilters(DEFAULT_FILTERS)}>← Tất cả chủ đề</button>
                <h1 className="page-title">{cleanTopicName(isLearningZh ? activeTopic.topic.vi : activeTopic.topic.zh)}</h1>
                <p className="page-sub">{activeTopic.done}/{activeTopic.total} từ đã học</p>
              </>
            ) : (
              <>
                <h1 className="page-title">{t('vocabulary', 'Từ vựng')}</h1>
                <p className="page-sub">
                  {noFilters
                    ? (isLearningZh ? `Chọn một chủ đề để bắt đầu. ${stats.length} chủ đề · ${items.length} từ.` : `选择一个主题开始。${stats.length} 个主题 · ${items.length} 词。`)
                    : (isLearningZh ? <>Tìm thấy <strong>{filtered.length}</strong> / {items.length} từ</> : <>筛选出 <strong>{filtered.length}</strong> / {items.length} 词</>)}
                </p>
              </>
            )}
          </div>
          <Button variant="outline" onClick={() => setMode(mode === 'flashcard' ? 'list' : 'flashcard')}>
            {mode === 'flashcard' ? 'Xem danh sách' : 'Chơi Flashcard'}
          </Button>
        </div>

        <VocabToolbar filters={filters} onChange={setFilters} totalCount={items.length} wordTypes={wordTypes} />

        {loading ? (
          <Loading />
        ) : mode === 'flashcard' ? (
          <VocabFlashcard items={filtered} />
        ) : showTopics ? (
          <TopicGrid stats={stats} onPick={pickTopic} />
        ) : (
          <div>
            <div className="vocab-grid">
              {filtered.length === 0 ? (
                <EmptyState
                  fullRow
                  title={isLearningZh ? 'Không tìm thấy từ vựng phù hợp' : '未找到匹配的词汇'}
                  text={isLearningZh ? 'Hãy thử từ khóa khác (chữ Hán, Pinyin không dấu hoặc tiếng Việt) hoặc đặt lại bộ lọc.' : '请尝试其他关键词或重置筛选条件。'}
                />
              ) : (
                slice.map((item) => <VocabCard key={item.id} item={item} />)
              )}
            </div>
            <Pagination page={safePage} totalPages={totalPages} onChange={goToPage} />
          </div>
        )}
      </div>
    </section>
  );
}
