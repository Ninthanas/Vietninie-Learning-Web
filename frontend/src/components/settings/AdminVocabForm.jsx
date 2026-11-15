import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { useStorageVersion } from '../../hooks/useProgress';
import { addCustomVocabulary, deleteCustomVocabulary, getCustomVocabulary } from '../../services/storage';

const EMPTY = { word: '', phonetic: '', meaning: '', exTarget: '', exNative: '' };

/** Admin CMS: add / remove user-defined vocabulary (stored in localStorage per learning direction). */
export default function AdminVocabForm() {
  const { isLearningZh, learningLang } = useLanguage();
  const { showToast } = useToast();
  useStorageVersion();
  const [form, setForm] = useState(EMPTY);
  const list = getCustomVocabulary(learningLang);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const word = form.word.trim(), phonetic = form.phonetic.trim(), meaning = form.meaning.trim();
    const exTarget = form.exTarget.trim(), exNative = form.exNative.trim();
    addCustomVocabulary(learningLang, {
      word,
      pinyin: phonetic,
      pronunciation_guide: phonetic,
      meaning_vi: meaning,
      meaning_zh: meaning,
      word_type: 'phrase',
      level: isLearningZh ? 'HSK 4' : 'B1',
      topic: 'vn_proficiency',
      topic_key: 'vn_proficiency',
      topic_label_vi: '60. Từ vựng giao tiếp Việt - Trung chuyên sâu',
      topic_label_zh: '60. 越中跨境实务词汇',
      example_zh: isLearningZh ? exTarget : exNative,
      example_pinyin: isLearningZh ? phonetic : '',
      example_vi: isLearningZh ? exNative : exTarget,
      pronunciation: '',
      usage_note: 'Từ vựng do Admin/Người học bổ sung.'
    });
    setForm(EMPTY);
    showToast('✅ Đã thêm từ vựng mới vào cơ sở dữ liệu!');
  };

  const fields = [
    ['word', isLearningZh ? 'Từ vựng tiếng Trung (VD: 跨境直播)' : '越南语词汇 (例: Thương mại điện tử)'],
    ['phonetic', isLearningZh ? 'Pinyin (VD: kuàjìng zhíbō)' : '发音指南 (例: [thương mại điện tử])'],
    ['meaning', isLearningZh ? 'Nghĩa tiếng Việt (VD: Livestream xuyên biên giới)' : '中文释义 (例: 电子商务)'],
    ['exTarget', isLearningZh ? 'Câu ví dụ tiếng Trung' : '越南语例句'],
    ['exNative', isLearningZh ? 'Dịch nghĩa câu ví dụ' : '中文例句翻译']
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: 14 }}>🛠️ {isLearningZh ? 'Admin CMS: Thêm Từ Vựng Mới' : '词库管理后台：新增自定义词条'}</h3>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map(([k, ph]) => <input key={k} type="text" className="filter-select" placeholder={ph} value={form[k]} onChange={set(k)} required />)}
        <button type="submit" className="btn btn-primary">+ {isLearningZh ? 'Lưu từ vựng vào Hệ thống' : '保存至本地词库'}</button>
      </form>

      {list.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h4>Từ vựng đã thêm ({list.length}):</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {list.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: 8 }}>
                <span><strong>{c.word}</strong> — {isLearningZh ? c.meaning_vi : c.meaning_zh}</span>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => deleteCustomVocabulary(learningLang, c.id)}>Xóa</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
