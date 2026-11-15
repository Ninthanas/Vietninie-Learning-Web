// ============================================================================
// DEEP WORD INSIGHT — builds the "Giải mã từ vựng" data (pure; rendering is in components).
// ============================================================================
import { getScriptPair, getTaiwanComparison } from './chineseScript';

const ICONS = ['🧬', '📘', '🔥', '💡'];

/** Split a usage_note into rows: [{ icon: '📘' | '', html: '...' }] (html comes from our own dataset). */
export function splitInsightLines(rawText) {
  if (!rawText) return [];
  const cleaned = String(rawText)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/([.!?])\s*(📘|🔥|💡|🧬)/g, '$1\n$2')
    .replace(/\s+(📘|🔥|💡|🧬)/g, '\n$1');
  return cleaned
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const icon = ICONS.find((i) => line.startsWith(i)) || '';
      return { icon, html: icon ? line.replace(new RegExp('^' + icon + '\\s*'), '') : line };
    });
}

const REPLY_MAP_ZH = {
  '你好': { target: '你好！往前走两百米左转就到地铁站啦。', sub: 'Chào bạn! Đi thẳng 200m rồi rẽ trái là tới ga tàu điện ngầm nha.' },
  '您好': { target: '辛苦了！放我办公桌上吧，我马上看。', sub: 'Vất vả cho em rồi! Cứ để trên bàn làm việc của anh, anh xem ngay.' },
  '早上好': { target: '早啊！会议资料我都打印好发给大家了。', sub: 'Chào buổi sáng! Tài liệu họp mình đã in sẵn phát cho mọi người rồi.' },
  '下午好': { target: '太棒了，我正困着呢，加我一杯少糖的！', sub: 'Tuyệt quá, mình đang buồn ngủ díp mắt đây, cho mình ké 1 ly ít đường nhé!' },
  '晚上好': { target: '晚上好！我们有预约，姓阮，两位靠窗的位置。', sub: 'Chào buổi tối! Tụi mình có đặt trước tên Nguyễn, bàn 2 người cạnh cửa sổ ạ.' },
  '晚安': { target: '晚安啦，明天见，做个好梦！', sub: 'Ngủ ngon nha, mai gặp lại, mơ đẹp nhé!' },
  '谢谢': { target: '客气啥呀！趁热快喝吧。', sub: 'Khách sáo gì chứ! Uống lúc còn nóng/lạnh ngay đi.' }
};

export function buildInsight(item, isLearningZh = true) {
  if (!item) return null;
  const word = item.word || '';
  const meaning = isLearningZh ? item.meaning_vi || '' : item.meaning_zh || '';
  const phonetic = isLearningZh ? item.pinyin || '' : item.pronunciation_guide || '';
  const exTarget = isLearningZh ? item.example_zh || '' : item.example_vi || '';
  const exNative = isLearningZh ? item.example_vi || '' : item.example_zh || '';
  const topic = isLearningZh ? item.topic_label_vi || 'Giao tiếp' : item.topic_label_zh || '日常交际';

  const zhSource = isLearningZh ? word : meaning;
  const scriptPair = getScriptPair(zhSource);
  const twComp = getTaiwanComparison(zhSource);

  const custom = REPLY_MAP_ZH[word];
  const miniDialogue = isLearningZh
    ? [
        { speaker: '🧑 Tình huống mở lời', target: exTarget, sub: exNative, lang: 'zh-CN' },
        {
          speaker: '👩‍💼 Đáp lại tự nhiên (Bản xứ)',
          target: custom ? custom.target : `好的没问题！关于${word}这件事我们就这么定啦。`,
          sub: custom ? custom.sub : 'Ok không thành vấn đề! Chuyện này tụi mình cứ chốt như vậy nhé.',
          lang: 'zh-CN'
        }
      ]
    : [
        { speaker: '🧑 实际场景开口', target: exTarget, sub: exNative, lang: 'vi-VN' },
        {
          speaker: '👩‍💼 越南本地人自然回应',
          target: 'Dạ vâng, ok luôn bạn ơi! Cứ thống nhất như vậy nhé.',
          sub: '好的没问题朋友！咱们就这么敲定啦。',
          lang: 'vi-VN'
        }
      ];

  return {
    word,
    meaning,
    phonetic,
    topic,
    scriptPair,
    twComp,
    noteLines: splitInsightLines(item.usage_note),
    miniDialogue
  };
}
