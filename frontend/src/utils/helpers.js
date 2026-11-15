// Small pure helpers shared by pages & components.

/** "Nǐ hǎo" / "Xin chào" -> "ni hao" / "xin chao" (for tone-insensitive search). */
export function stripTones(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export const shuffle = (list) => [...list].sort(() => 0.5 - Math.random());

/** Level filter shared by Quiz & Listening: 'all' | 'A1'..'C2' matches item.level (HSK x / A1) or item.cefr. */
export function matchesLevel(item, level) {
  const t = String(level || '').toUpperCase();
  const lvl = String(item.level || '').toUpperCase();
  const cefr = String(item.cefr || '').toUpperCase();
  return lvl.includes(t) || cefr === t;
}

export const LEVEL_OPTIONS = [
  { id: 'all', vi: '🌟 Tất cả cấp độ', zh: '🌟 全部等级' },
  { id: 'A1', vi: '🌱 A1 (HSK 1)', zh: '🌱 A1 / HSK 1' },
  { id: 'A2', vi: '🌿 A2 (HSK 2)', zh: '🌿 A2 / HSK 2' },
  { id: 'B1', vi: '🌳 B1 (HSK 3)', zh: '🌳 B1 / HSK 3' },
  { id: 'B2', vi: '🎋 B2 (HSK 4)', zh: '🎋 B2 / HSK 4' },
  { id: 'C1', vi: '🏆 C1 (HSK 5)', zh: '🏆 C1 / HSK 5' },
  { id: 'C2', vi: '👑 C2 (HSK 6)', zh: '👑 C2 / HSK 6' }
];

/** Pick the right field of a vocabulary item depending on the learning direction. */
export function pickFields(item, isLearningZh) {
  return {
    phonetic: isLearningZh ? item.pinyin : item.pronunciation_guide,
    meaning: isLearningZh ? item.meaning_vi : item.meaning_zh,
    exTarget: (isLearningZh ? item.example_zh : item.example_vi) || '',
    exPinyin: isLearningZh ? item.example_pinyin : '',
    exNative: (isLearningZh ? item.example_vi : item.example_zh) || '',
    speechLang: isLearningZh ? 'zh-CN' : 'vi-VN',
    topicLabel: isLearningZh ? item.topic_label_vi : item.topic_label_zh
  };
}
