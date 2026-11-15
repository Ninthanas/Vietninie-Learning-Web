import { Link } from 'react-router-dom';
import ScriptText from '../common/ScriptText';
import { useLanguage } from '../../hooks/useLanguage';
import { pickFields } from '../../utils/helpers';

export default function RelatedWordCard({ item }) {
  const { isLearningZh } = useLanguage();
  const f = pickFields(item, isLearningZh);
  return (
    <Link to={`/vocabulary/${item.id}`} className="vocab-card">
      <div className="vocab-word-main" style={{ fontSize: '1.4rem' }}>{isLearningZh ? <ScriptText text={item.word} /> : item.word}</div>
      <div className="vocab-pinyin">{f.phonetic}</div>
      <div className="vocab-meaning">{f.meaning}</div>
    </Link>
  );
}
