import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpotlightCard from '../components/home/SpotlightCard';
import Faq from '../components/home/Faq';
import { LogoMark } from '../components/mascot/Logo';

const Mascot3D = lazy(() => import('../components/mascot/Mascot3D'));
import Button from '../components/common/Button';
import { useVocabulary } from '../hooks/useVocabulary';
import { useProgress } from '../hooks/useProgress';
import { useLanguage } from '../hooks/useLanguage';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getTopics } from '../services/dataService';
import { topicStats, cleanTopicName } from '../utils/topics';

function BubbleIcon({ d, fill }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d={d} fill={fill} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>
  );
}

const SAYINGS = [
  ['今天学十分钟吧！', 'Hôm nay mình học 10 phút nhé!'],
  ['你好，我是 Ni Ni！', 'Chào bạn, mình là Ni Ni!'],
  ['每天一点点，进步大大！', 'Mỗi ngày một chút, tiến bộ thật nhiều!'],
  ['加油！你可以的！', 'Cố lên! Bạn làm được mà!']
];

/** The 3D mascot loads after the page is interactive; until then (or on data-saver) a flat Ni Ni face is shown. */
function MascotStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (navigator.connection?.saveData) return undefined;
    const run = () => setReady(true);
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(run, { timeout: 1500 }) : setTimeout(run, 400);
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  const flat = <div className="home-mascot home-mascot-flat"><LogoMark size={190} /></div>;
  return ready ? <Suspense fallback={flat}><MascotStage /></Suspense> : flat;
}

function NiNiSays() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % SAYINGS.length), 6000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="nini-says" role="status" aria-live="polite" key={i}>
      <span lang="zh">{SAYINGS[i][0]}</span>
      <span>{SAYINGS[i][1]}</span>
    </div>
  );
}

function QuickSearch() {
  const navigate = useNavigate();
  const { isLearningZh } = useLanguage();
  const [q, setQ] = useState('');
  const samples = isLearningZh ? ['你好', '学习', '谢谢'] : ['xin chào', 'cảm ơn', 'tạm biệt'];
  const go = (text) => {
    const v = (text ?? q).trim();
    if (v) navigate(`/vocabulary?q=${encodeURIComponent(v)}`);
  };
  return (
    <section className="home-section">
      <h2>{isLearningZh ? 'Tra chữ Hán, từ tiếng Trung' : 'Tra từ tiếng Việt'}</h2>
      <form className="quick-search" onSubmit={(e) => { e.preventDefault(); go(); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={isLearningZh ? 'Gõ chữ Hán, pinyin hoặc tiếng Việt' : '输入越南语或中文'} aria-label="Tra từ" />
        <button type="submit" className="btn btn-primary">Tra từ</button>
      </form>
      <div className="quick-samples">
        <span>Thử:</span>
        {samples.map((s) => <button key={s} type="button" lang={isLearningZh ? 'zh' : 'vi'} onClick={() => go(s)}>{s}</button>)}
      </div>
    </section>
  );
}

const ZONES = [
  { to: '/vocabulary', zh: '词', title: 'Từ vựng', sub: 'Học theo chủ đề' },
  { to: '/grammar', zh: '语', title: 'Ngữ pháp', sub: 'Theo cấp độ' },
  { to: '/practice', zh: '练', title: 'Luyện tập', sub: 'Quiz · Nghe · Hội thoại' },
  { to: '/specialized', zh: '业', title: 'Chuyên ngành', sub: 'Game, PM, phỏng vấn' }
];

export default function Home() {
  const { items } = useVocabulary();
  const { learned, review } = useProgress();
  const { isLearningZh } = useLanguage();
  const { openLessons } = useUI();
  const { isLoggedIn, user } = useAuth();
  useDocumentTitle('Vietninie 越学越辣');

  const stats = topicStats(getTopics(), items, learned);
  const current = stats.find((s) => s.done > 0 && s.done < s.total) || stats.find((s) => s.done < s.total) || stats[0];
  const name = isLoggedIn ? user.display_name || user.username : '';

  const tasks = [
    { to: '/vocabulary?status=review&mode=flashcard', title: review.size ? `Ôn ${review.size} từ cần ôn` : 'Ôn lại từ đã học', meta: 'Lặp lại ngắt quãng', done: review.size === 0 && learned.size > 0 },
    { to: '/quiz', title: 'Làm 1 bài Quiz', meta: '5 phút' },
    { to: '/listening', title: 'Luyện nghe 1 đoạn', meta: '3 phút' }
  ];

  return (
    <div className="home-wrap container">
      <section className="home-top">
        <div className="home-top-main">
          <p className="home-hello">Chào {name || 'bạn'}!</p>
          <h1 className="home-title">Hôm nay học gì nào?</h1>

          {current && (
            <div className="card continue-card">
              <div className="continue-meta">
                <span>{learned.size ? 'HỌC TIẾP' : 'BẮT ĐẦU'} · {isLearningZh ? current.topic.level : current.topic.cefr}</span>
                <span>{current.done}/{current.total} từ</span>
              </div>
              <h2 className="continue-name">{cleanTopicName(isLearningZh ? current.topic.vi : current.topic.zh)}</h2>
              {current.samples.length > 0 && (
                <div className="continue-words" aria-hidden="true">
                  {current.samples.map((w) => <span key={w}>{w}</span>)}
                </div>
              )}
              <div className="progress-bar" role="progressbar" aria-label="Tiến độ chủ đề" aria-valuemin={0} aria-valuemax={100} aria-valuenow={current.pct}>
                <div style={{ width: `${current.pct}%` }} />
              </div>
              <div className="continue-actions">
                <Button to={`/vocabulary?topic=${current.topic.key}`} className="continue-btn">Học tiếp</Button>
                <Button variant="outline" onClick={openLessons}>Khoá học 4 bước</Button>
              </div>
            </div>
          )}
        </div>

        <div className="home-stage" aria-label="Ni Ni">
          <div className="home-stage-glow" aria-hidden="true" />
          <Mascot3D className="home-mascot" zoom={7.6} />
          <span className="stage-chip stage-chip-a"><BubbleIcon d="M12 2c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9Z" fill="#F97316" />Giữ streak mỗi ngày</span>
          <span className="stage-chip stage-chip-b"><BubbleIcon d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" fill="#FFC83D" />Nhận XP khi học</span>
          <span className="stage-chip stage-chip-c"><BubbleIcon d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-3 2-1.5 5 4.5-2.5 4.5 2.5L15 17" fill="#D7261E" />Mở huy hiệu mới</span>
          <NiNiSays />
          <p className="stage-hint">Bấm vào Ni Ni để chào bạn</p>
        </div>
      </section>

      <section className="home-section">
        <h2>Nhiệm vụ hôm nay</h2>
        <div className="task-grid">
          {tasks.map((t) => (
            <Link key={t.title} to={t.to} className="card task-card">
              <span className={`task-dot ${t.done ? 'done' : ''}`} aria-hidden="true">
                {t.done && <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>}
              </span>
              <span><strong>{t.title}</strong><small>{t.meta}</small></span>
            </Link>
          ))}
        </div>
      </section>

      <QuickSearch />

      <section className="home-section">
        <h2>Từ của ngày</h2>
        <SpotlightCard items={items} />
      </section>

      <section className="home-section home-zones">
        <h2>Khám phá</h2>
        <div className="zone-grid">
          {ZONES.map((z) => (
            <Link key={z.to} to={z.to} className="card zone-card">
              <span className="zone-char" lang="zh" aria-hidden="true">{z.zh}</span>
              <strong>{z.title}</strong>
              <small>{z.sub}</small>
            </Link>
          ))}
        </div>
      </section>
      <Faq />
    </div>
  );
}
