import { useMemo, useState } from 'react';
import Trans from '../components/common/Trans';
import LevelPills from '../components/common/LevelPills';
import Loading from '../components/common/Loading';
import ListeningChallenge from '../components/listening/ListeningChallenge';
import { useVocabulary } from '../hooks/useVocabulary';
import { useLanguage } from '../hooks/useLanguage';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getPref, setPref } from '../services/storage';
import { matchesLevel } from '../utils/helpers';

export default function Listening() {
  const { isVi } = useLanguage();
  const { items, loading } = useVocabulary();
  const { showToast } = useToast();
  const [level, setLevel] = useState(() => getPref('sentruc_listening_level') || getPref('sentruc_placement_level') || 'all');
  useDocumentTitle('Vietninie • Luyện nghe');

  const pool = useMemo(() => {
    if (!items.length) return [];
    if (!level || level === 'all') return items.slice(0, 80);
    const f = items.filter((i) => matchesLevel(i, level));
    return f.length ? f : items.slice(0, 60);
  }, [items, level]);

  const change = (lvl) => {
    setLevel(lvl);
    setPref('sentruc_listening_level', lvl);
    showToast(isVi ? `🎧 Đã chọn cấp độ nghe: ${lvl.toUpperCase()}` : `🎧 已切换听力等级：${lvl.toUpperCase()}`);
  };

  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <Trans k="listening" as="h1" style={{ fontSize: '2rem', fontWeight: 800, marginTop: 6 }}>Phòng Luyện Nghe & Nhận Diện Thanh Điệu</Trans>
          </div>
        </div>
        <LevelPills value={level} onChange={change} />
        {loading || !pool.length ? <Loading /> : <ListeningChallenge key={level} items={pool} level={level} />}
      </div>
    </section>
  );
}
