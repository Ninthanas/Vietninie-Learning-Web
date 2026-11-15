import { useMemo, useSyncExternalStore } from 'react';
import * as storage from '../services/storage';
import { useLanguage } from './useLanguage';

/** Re-renders the caller whenever anything in the storage service changes. */
export const useStorageVersion = () => useSyncExternalStore(storage.subscribe, storage.getVersion);

/** Learned / favorite / SRS state for the current learning direction + mutating actions. */
export function useProgress() {
  const { learningLang: dir } = useLanguage();
  const version = useStorageVersion();

  const state = useMemo(
    () => ({
      learned: storage.getLearnedIds(dir),
      favorites: storage.getFavoriteIds(dir),
      review: storage.getNeedsReviewIds(dir),
      streak: storage.getStreak(),
      quizAccuracy: storage.getQuizAverageAccuracy(),
      last7Days: storage.getLast7DaysActivity(),
      lessonScores: storage.getLessonScores()
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dir, version]
  );

  return {
    ...state,
    toggleLearned: (id) => storage.toggleLearned(dir, id),
    toggleFavorite: (id) => storage.toggleFavorite(dir, id),
    markLearned: (id, status = true) => storage.markLearned(dir, id, status),
    rateSrs: (id, rating) => storage.recordSrsReview(dir, id, rating),
    saveQuizResult: storage.saveQuizResult
  };
}
