// ============================================================================
// STORAGE SERVICE (localStorage): learned / favorites / SRS / streak / quiz history
// Every per-direction key takes `dir` ('zh' | 'vi') = current learning language.
// A tiny pub/sub lets React hooks re-render when anything changes.
// ============================================================================
import { pushProgress, pushQuizResult, pushReset } from './api';

const listeners = new Set();
let version = 0;

export const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getVersion = () => version;
const emit = () => {
  version += 1;
  listeners.forEach((fn) => fn());
};

const key = (base, dir) => `sentruc_${base}_${dir}`;

function readJson(k, fallback) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
const writeJson = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// ---------------------------------------------------------------- learned
export const getLearnedIds = (dir) => new Set(readJson(key('learned', dir), []));

export function toggleLearned(dir, id) {
  const set = getLearnedIds(dir);
  const numId = Number(id);
  let isLearned = false;
  if (set.has(numId)) {
    set.delete(numId);
  } else {
    set.add(numId);
    isLearned = true;
    logDailyStudy(1, false);
  }
  writeJson(key('learned', dir), [...set]);
  pushProgress('learned', dir, numId, { value: isLearned });
  emit();
  return isLearned;
}

export function markLearned(dir, id, status = true, notify = true) {
  const set = getLearnedIds(dir);
  const numId = Number(id);
  if (status) {
    if (!set.has(numId)) logDailyStudy(1, false);
    set.add(numId);
  } else {
    set.delete(numId);
  }
  writeJson(key('learned', dir), [...set]);
  pushProgress('learned', dir, numId, { value: Boolean(status) });
  if (notify) emit();
}

// ---------------------------------------------------------------- favorites
export const getFavoriteIds = (dir) => new Set(readJson(key('favorites', dir), []));

export function toggleFavorite(dir, id) {
  const set = getFavoriteIds(dir);
  const numId = Number(id);
  let isFav = false;
  if (set.has(numId)) set.delete(numId);
  else {
    set.add(numId);
    isFav = true;
  }
  writeJson(key('favorites', dir), [...set]);
  pushProgress('favorite', dir, numId, { value: isFav });
  emit();
  return isFav;
}

// ---------------------------------------------------------------- SRS
// rating: 1 (5 min) | 2 (1 day) | 3 (3 days) | 4 (7 days)
const SRS_INTERVALS = {
  1: 5 * 60 * 1000,
  2: 24 * 60 * 60 * 1000,
  3: 3 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000
};

export const getSrsMap = (dir) => readJson(key('srs', dir), {});

export function recordSrsReview(dir, id, rating) {
  const map = getSrsMap(dir);
  const now = Date.now();
  const prev = map[id] || { reps: 0, rating: 0 };
  map[id] = {
    rating: Number(rating),
    reps: prev.reps + 1,
    lastReviewed: now,
    nextReview: now + (SRS_INTERVALS[rating] || SRS_INTERVALS[2])
  };
  writeJson(key('srs', dir), map);
  pushProgress('srs', dir, id, map[id]);
  if (rating >= 3) markLearned(dir, id, true, false);
  else if (rating === 1) markLearned(dir, id, false, false);
  logDailyStudy(1, false);
  emit();
  return map[id];
}

export function getNeedsReviewIds(dir) {
  const map = getSrsMap(dir);
  const now = Date.now();
  return new Set(
    Object.keys(map)
      .filter((id) => map[id].rating <= 2 || map[id].nextReview <= now)
      .map(Number)
  );
}

// ---------------------------------------------------------------- streak & daily log
export function logDailyStudy(count = 1, notify = true) {
  const today = new Date().toISOString().slice(0, 10);
  const log = readJson('sentruc_daily_log', {});
  log[today] = (log[today] || 0) + count;
  writeJson('sentruc_daily_log', log);
  updateStreak(today);
  if (notify) emit();
}

function updateStreak(todayStr) {
  const lastDate = localStorage.getItem('sentruc_last_study_date');
  let streak = Number(localStorage.getItem('sentruc_streak') || '1');
  if (!lastDate) streak = 1;
  else if (lastDate !== todayStr) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = lastDate === yesterday ? streak + 1 : 1;
  }
  localStorage.setItem('sentruc_last_study_date', todayStr);
  localStorage.setItem('sentruc_streak', String(streak));
}

export const getStreak = () => Number(localStorage.getItem('sentruc_streak') || '5');

export function getLast7DaysActivity() {
  const log = readJson('sentruc_daily_log', {});
  const fallbackCounts = [18, 24, 15, 32, 28, 36, 22];
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    result.push({
      date: iso,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      count: log[iso] !== undefined ? log[iso] : fallbackCounts[6 - i]
    });
  }
  return result;
}

// ---------------------------------------------------------------- quiz history
export function saveQuizResult(mode, score, total) {
  pushQuizResult(localStorage.getItem('sentruc_native_lang') === 'zh' ? 'vi' : 'zh', mode, score, total);
  const history = readJson('sentruc_quiz_history', []);
  history.unshift({
    mode,
    score,
    total,
    accuracy: Math.round((score / Math.max(1, total)) * 100),
    date: new Date().toISOString()
  });
  writeJson('sentruc_quiz_history', history.slice(0, 50));
  logDailyStudy(score, false);
  emit();
}

export function getQuizAverageAccuracy() {
  const history = readJson('sentruc_quiz_history', []);
  if (!history.length) return 88;
  return Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / history.length);
}

// ---------------------------------------------------------------- custom (admin) vocabulary
export const getCustomVocabulary = (dir) => readJson(key('custom_vocab', dir), []);

export function addCustomVocabulary(dir, item) {
  const list = getCustomVocabulary(dir);
  const newItem = { ...item, id: Date.now(), isCustom: true };
  list.unshift(newItem);
  writeJson(key('custom_vocab', dir), list);
  emit();
  return newItem;
}

export function deleteCustomVocabulary(dir, id) {
  writeJson(
    key('custom_vocab', dir),
    getCustomVocabulary(dir).filter((i) => Number(i.id) !== Number(id))
  );
  emit();
}

// ---------------------------------------------------------------- lesson scores (4-step lessons)
export const getLessonScores = () => readJson('sentruc_lesson_scores', {});

export function saveLessonScore(entry) {
  const saved = getLessonScores();
  saved[entry.lesson_id] = entry;
  writeJson('sentruc_lesson_scores', saved);
  emit();
}

// ---------------------------------------------------------------- settings helpers
export function resetProgress(dir) {
  localStorage.removeItem(key('learned', dir));
  localStorage.removeItem(key('favorites', dir));
  localStorage.removeItem(key('srs', dir));
  pushReset(dir);
  emit();
}

export function seedDemoProgress(dir, vocab) {
  writeJson(key('learned', dir), vocab.slice(0, 1284).map((i) => i.id));
  writeJson(key('favorites', dir), vocab.slice(0, 86).map((i) => i.id));
  localStorage.setItem('sentruc_streak', '12');
  const srsMap = {};
  vocab.slice(1284, 1416).forEach((item) => {
    srsMap[item.id] = { rating: 2, reps: 2, lastReviewed: Date.now() - 86400000, nextReview: Date.now() - 1000 };
  });
  writeJson(key('srs', dir), srsMap);
  emit();
}

// ---------------------------------------------------------------- simple string prefs
export const getPref = (name, fallback = '') => localStorage.getItem(name) || fallback;
export const setPref = (name, value) => {
  localStorage.setItem(name, value);
  emit();
};

// ---------------------------------------------------------------- server sync helpers
/** Snapshot of the local progress in the shape the API's /sync endpoint expects. */
export const exportProgress = (dir) => ({
  learned: [...getLearnedIds(dir)],
  favorites: [...getFavoriteIds(dir)],
  srs: getSrsMap(dir)
});

/** Replace local progress with the merged copy returned by the server. */
export function importProgress(dir, data) {
  if (!data) return;
  writeJson(key('learned', dir), data.learned || []);
  writeJson(key('favorites', dir), data.favorites || []);
  writeJson(key('srs', dir), data.srs || {});
  emit();
}
