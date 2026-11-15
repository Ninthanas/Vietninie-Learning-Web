import { shuffle, matchesLevel } from './helpers';

export const QUIZ_MODES = [
  { id: 'meaning', icon: '📖', vi: '1. Chọn nghĩa đúng', zh: '1. 选择正确释义' },
  { id: 'word', icon: '🎯', vi: '2. Chọn từ đúng', zh: '2. 根据释义选词' },
  { id: 'pinyin', icon: '🔤', vi: '3. Chọn Pinyin / Phiên âm', zh: '3. 选择正确拼音/读音' },
  { id: 'listening', icon: '🔊', vi: '4. Nghe & chọn đáp án', zh: '4. 听音辨词测验' },
  { id: 'matching', icon: '🧩', vi: '5. Ghép từ với nghĩa', zh: '5. 词义连线配对' },
  { id: 'fill_blank', icon: '✍️', vi: '6. Điền từ còn thiếu', zh: '6. 语境选词填空' },
  { id: 'translate', icon: '🌏', vi: '7. Dịch câu hoàn chỉnh', zh: '7. 双语句子翻译' },
  { id: 'speed_flash', icon: '⚡', vi: '8. Flashcard Challenge', zh: '8. 极速闪卡挑战' }
];

/** Words of the chosen level (falls back to the whole pool when fewer than 4 match). */
export function getActivePool(pool, level) {
  if (!level || level === 'all') return pool;
  const filtered = pool.filter((i) => matchesLevel(i, level));
  return filtered.length >= 4 ? filtered : pool;
}

/** Build up to `count` multiple-choice questions for a (non-matching) mode. */
export function buildQuestions(pool, modeId, isLearningZh, count = 10) {
  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, pool.length)).map((item) => {
    const distractors = shuffle(shuffled.filter((d) => d.id !== item.id)).slice(0, 3);
    const optionItems = shuffle([item, ...distractors]);
    const correctIdx = optionItems.findIndex((o) => o.id === item.id);

    const meaning = isLearningZh ? item.meaning_vi : item.meaning_zh;
    const phonetic = isLearningZh ? item.pinyin : item.pronunciation_guide;
    const exTarget = (isLearningZh ? item.example_zh : item.example_vi) || '';
    const exNative = isLearningZh ? item.example_vi : item.example_zh;
    const meaningOf = (o) => (isLearningZh ? o.meaning_vi : o.meaning_zh);
    const phoneticOf = (o) => (isLearningZh ? o.pinyin : o.pronunciation_guide);

    let q;
    switch (modeId) {
      case 'meaning':
        q = { title: isLearningZh ? 'Nghĩa tiếng Việt của từ này là gì?' : '这个越南语词汇的中文意思是什么？', main: item.word, sub: phonetic, options: optionItems.map(meaningOf) };
        break;
      case 'word':
        q = { title: isLearningZh ? `"${meaning}" trong tiếng Trung là:` : `“${meaning}”用越南语怎么说？`, main: meaning, sub: isLearningZh ? `Chủ đề: ${item.topic_label_vi}` : `主题：${item.topic_label_zh}`, options: optionItems.map((o) => o.word) };
        break;
      case 'pinyin':
        q = { title: isLearningZh ? 'Chọn Pinyin chính xác cho chữ Hán:' : '选择该越南语词汇的正确发音指南：', main: item.word, sub: meaning, options: optionItems.map(phoneticOf) };
        break;
      case 'listening':
        q = { title: isLearningZh ? 'Nghe phát âm và chọn từ đúng:' : '请听发音并选择正确的词条：', main: '🔊 Bấm để nghe phát âm', sub: isLearningZh ? 'Nghe kỹ thanh điệu và âm tiết' : '仔细分辨声调与发音', options: optionItems.map((o) => `${o.word} (${meaningOf(o)})`) };
        break;
      case 'fill_blank':
        q = { title: isLearningZh ? 'Điền từ còn thiếu vào chỗ trống (___):' : '请选择正确的词填入句中空白处 (___)：', main: exTarget.replace(item.word, ' ______ '), sub: exNative, options: optionItems.map((o) => o.word) };
        break;
      case 'translate':
        q = { title: isLearningZh ? 'Chọn bản dịch đúng nhất cho câu sau:' : '请选择下列句子最准确的翻译：', main: exTarget, sub: isLearningZh ? item.example_pinyin : '', options: optionItems.map((o) => (isLearningZh ? o.example_vi : o.example_zh)) };
        break;
      default: // speed_flash
        q = { title: isLearningZh ? '⚡ Phản xạ nhanh Flashcard:' : '⚡ 极速闪卡反应挑战：', main: item.word, sub: phonetic, options: optionItems.map(meaningOf) };
    }
    return { item, correctIdx, ...q };
  });
}
