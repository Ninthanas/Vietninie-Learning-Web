// ============================================================================
// PLACEMENT TEST — builds a fresh, levelled test from the bundled vocabulary and
// grammar datasets (no hand-written questions, nothing hidden in the stem).
//   * 5 questions per CEFR level A1 -> C2 (30 total), easiest first
//   * 4 kinds: recognition (word -> meaning), recall (meaning -> word),
//     cloze (fill the blank in a real sentence), grammar (from the grammar bank)
//   * distractors share the word type and level of the answer; options are shuffled
//   * adaptive stop: the test ends early once the learner clearly hit their ceiling
// ============================================================================
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const HSK_OF = { A1: 'HSK 1', A2: 'HSK 2', B1: 'HSK 3', B2: 'HSK 4', C1: 'HSK 5', C2: 'HSK 6' };
export const PASS_RATIO = 0.6;
const PER_LEVEL = 5;

const rand = Math.random;
function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const plain = (s) => String(s).toLowerCase().replace(/[（(].*?[)）]/g, '').replace(/\s+/g, ' ').trim();
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Normalise both datasets into { id, word, meaning, level, type, example, exampleNative }
function normalise(list, dir) {
  return list
    .map((x) =>
      dir === 'zh'
        ? { id: `zh${x.id}`, word: x.word, meaning: x.meaning_vi, level: x.cefr, type: x.word_type, example: x.example_zh, exampleNative: x.example_vi }
        : { id: `vi${x.id}`, word: x.word, meaning: x.meaning_zh, level: x.level, type: x.word_type, example: x.example_vi, exampleNative: x.example_zh }
    )
    .filter((x) => x.word && x.meaning && LEVELS.includes(x.level) && String(x.meaning).length <= 42);
}

const TEXT = {
  recognition: { vi: 'Chọn nghĩa đúng của từ này', zh: '选择这个词的正确意思' },
  recall: {
    vi: 'Chọn từ tiếng Trung đúng với nghĩa sau',
    zh: '选择与下列意思对应的越南语词'
  },
  cloze: { vi: 'Chọn từ điền vào chỗ trống', zh: '选择适合填入空格的词' },
  grammar: { vi: 'Chọn đáp án đúng', zh: '选择正确答案' }
};

// distractors: same word type, same level first, similar length, no overlapping meaning
function pickDistractors(target, pool, field, count = 3, excludeText = '') {
  const ti = LEVELS.indexOf(target.level);
  const tKey = plain(target[field]);
  const scored = pool
    .filter((c) => c.id !== target.id && c.type === target.type)
    .filter((c) => Math.abs(LEVELS.indexOf(c.level) - ti) <= 1)
    .filter((c) => {
      const k = plain(c[field]);
      return k && k !== tKey && !k.includes(tKey) && !tKey.includes(k);
    })
    .filter((c) => !excludeText || !excludeText.toLowerCase().includes(String(c.word).toLowerCase()))
    .map((c) => ({
      c,
      s: Math.abs(String(c[field]).length - String(target[field]).length) + Math.abs(LEVELS.indexOf(c.level) - ti) * 3 + rand() * 6
    }))
    .sort((a, b) => a.s - b.s);
  const seen = new Set();
  const out = [];
  for (const { c } of scored) {
    const k = plain(c[field]);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length === count) break;
  }
  return out.length === count ? out : null;
}

function finish(base, correctText, wrongTexts) {
  const options = shuffle([correctText, ...wrongTexts]);
  return { ...base, options, correct_index: options.indexOf(correctText) };
}

function makeRecognition(w, pool, isVi) {
  const d = pickDistractors(w, pool, 'meaning');
  if (!d) return null;
  return finish(
    { type: 'recognition', prompt: TEXT.recognition[isVi ? 'vi' : 'zh'], stem: w.word, stemClass: 'word' },
    w.meaning,
    d.map((x) => x.meaning)
  );
}

function makeRecall(w, pool, isVi) {
  const d = pickDistractors(w, pool, 'word');
  if (!d) return null;
  return finish(
    { type: 'recall', prompt: TEXT.recall[isVi ? 'vi' : 'zh'], stem: w.meaning, stemClass: 'meaning' },
    w.word,
    d.map((x) => x.word)
  );
}

function makeCloze(w, pool, isVi) {
  if (!w.example || w.example.trim() === w.word || w.example.length < 6) return null;
  const re = new RegExp(escapeRe(w.word), 'i');
  if (!re.test(w.example)) return null;
  const sentence = w.example.replace(re, '＿＿＿');
  const d = pickDistractors(w, pool, 'word', 3, w.example);
  if (!d) return null;
  return finish(
    {
      type: 'cloze',
      prompt: TEXT.cloze[isVi ? 'vi' : 'zh'],
      stem: sentence,
      stemClass: 'sentence',
      // the translation pins down which word fits (several verbs/nouns could fit the blank otherwise)
      hint: w.exampleNative || ''
    },
    w.word,
    d.map((x) => x.word)
  );
}

function grammarLevel(g, dir) {
  if (dir === 'zh') {
    const n = parseInt(String(g.level).replace(/\D/g, ''), 10);
    return LEVELS[Math.min(5, Math.max(0, (n || 1) - 1))];
  }
  return LEVELS.includes(g.level) ? g.level : 'A1';
}

function makeGrammar(g, isVi) {
  const q = g.quiz;
  if (!q || !Array.isArray(q.options) || q.options.length < 3 || q.answerIndex == null) return null;
  const correct = q.options[q.answerIndex];
  return finish({ type: 'grammar', prompt: TEXT.grammar[isVi ? 'vi' : 'zh'], stem: q.question, stemClass: 'sentence', hint: '' }, correct, q.options.filter((_, i) => i !== q.answerIndex));
}

/** Build the whole test. dir = language being learned ('zh' | 'vi'); isVi = UI language is Vietnamese. */
export function buildPlacementTest({ vocab, grammar, dir, isVi }) {
  const pool = normalise(vocab, dir);
  const used = new Set();
  const questions = [];

  LEVELS.forEach((level) => {
    const levelWords = shuffle(pool.filter((w) => w.level === level));
    const grammarPick = shuffle((grammar || []).filter((g) => grammarLevel(g, dir) === level))[0];
    const wanted = ['recognition', 'recognition', 'recall', 'cloze', grammarPick ? 'grammar' : 'cloze'];
    const built = [];

    for (const kind of wanted) {
      let q = null;
      if (kind === 'grammar') q = makeGrammar(grammarPick, isVi);
      else {
        for (const w of levelWords) {
          if (used.has(w.id)) continue;
          q =
            kind === 'recognition' ? makeRecognition(w, pool, isVi)
            : kind === 'recall' ? makeRecall(w, pool, isVi)
            : makeCloze(w, pool, isVi);
          if (q) {
            used.add(w.id);
            break;
          }
        }
      }
      if (q) built.push(q);
    }
    // top up with plain recognition if a kind could not be built (e.g. few sentences at C2)
    for (const w of levelWords) {
      if (built.length >= PER_LEVEL) break;
      if (used.has(w.id)) continue;
      const q = makeRecognition(w, pool, isVi);
      if (q) {
        used.add(w.id);
        built.push(q);
      }
    }
    shuffle(built).forEach((q, i) => questions.push({ ...q, id: `${dir}_${level}_${i}`, level }));
  });
  return questions;
}

// ---------------------------------------------------------------- scoring
export function levelScores(questions, answers) {
  return LEVELS.map((level) => {
    const asked = questions.filter((q) => q.level === level && answers[q.id] !== undefined);
    const correct = asked.filter((q) => answers[q.id] === q.correct_index).length;
    return {
      level,
      tested: asked.length > 0,
      correct,
      total: asked.length,
      percentage: asked.length ? Math.round((correct / asked.length) * 100) : 0
    };
  });
}

/** Highest level reached through an unbroken chain of passed levels (a lucky guess at C2 cannot count). */
export function scorePlacement(questions, answers) {
  const scores = levelScores(questions, answers);
  let rec = 'A1';
  for (const s of scores) {
    if (!s.tested || s.percentage < PASS_RATIO * 100) break;
    rec = s.level;
  }
  return {
    recommended_level: rec,
    level_scores: scores,
    total_correct: scores.reduce((n, s) => n + s.correct, 0),
    total_questions: scores.reduce((n, s) => n + s.total, 0),
    skipped: questions.filter((q) => answers[q.id] === -1).length,
    taken_at: new Date().toISOString()
  };
}

/** True once the learner has clearly hit their ceiling: called right after a level block is finished. */
export function shouldStopAfter(questions, answers, index) {
  const next = questions[index + 1];
  const cur = questions[index];
  if (!next || next.level === cur.level) return false;
  const scores = levelScores(questions, answers).filter((s) => s.tested);
  const last = scores[scores.length - 1];
  const prev = scores[scores.length - 2];
  if (scores.length === 1 && last.percentage < 40) return true;
  return !!prev && prev.percentage < PASS_RATIO * 100 && last.percentage < PASS_RATIO * 100;
}
