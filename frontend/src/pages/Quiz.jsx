import { useCallback, useEffect, useMemo, useState } from 'react';
import Trans from '../components/common/Trans';
import LevelPills from '../components/common/LevelPills';
import Loading from '../components/common/Loading';
import ModeGrid from '../components/quiz/ModeGrid';
import QuestionView from '../components/quiz/QuestionView';
import ResultView from '../components/quiz/ResultView';
import MatchingGame from '../components/quiz/MatchingGame';
import { useVocabulary } from '../hooks/useVocabulary';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../hooks/useProgress';
import { useToast } from '../hooks/useToast';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { getPref, setPref } from '../services/storage';
import { buildQuestions, getActivePool } from '../utils/quiz';

export default function Quiz() {
  const { isVi, isLearningZh } = useLanguage();
  const { items, loading } = useVocabulary();
  const { markLearned, saveQuizResult } = useProgress();
  const { showToast } = useToast();
  useDocumentTitle('Vietninie • Quiz');

  const [level, setLevel] = useState(() => getPref('sentruc_quiz_level') || getPref('sentruc_placement_level') || 'all');
  const [mode, setMode] = useState('word');
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const pool = useMemo(() => getActivePool(items, level), [items, level]);
  const questions = useMemo(
    () => (mode === 'matching' ? [] : buildQuestions(pool, mode, isLearningZh)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, mode, round, isLearningZh]
  );

  const restart = useCallback((nextMode = mode) => {
    setMode(nextMode);
    setIndex(0);
    setScore(0);
    setRound((r) => r + 1);
  }, [mode]);

  useEffect(() => restart(), [isLearningZh]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeLevel = (lvl) => {
    setLevel(lvl);
    setPref('sentruc_quiz_level', lvl);
    setIndex(0);
    setScore(0);
    setRound((r) => r + 1);
    showToast(isVi ? `🎯 Đã chọn cấp độ Quiz: ${lvl.toUpperCase()}` : `🎯 已切换测验等级：${lvl.toUpperCase()}`);
  };

  const onAnswer = (correct) => {
    if (correct) {
      setScore((s) => s + 1);
      markLearned(questions[index].item.id, true);
    }
    setIndex((i) => i + 1);
  };

  const q = questions[index];

  return (
    <section className="section-block">
      <div className="container">
        <div className="section-header">
          <div>
            <Trans k="quiz" as="h1" style={{ fontSize: '2rem', fontWeight: 800 }}>Đấu Trường Kiểm Tra 8 Chế Độ (Interactive Quiz)</Trans>
            <p style={{ color: 'var(--text-secondary)' }}>Chọn một chế độ, làm xong mới sang chế độ khác.</p>
          </div>
        </div>

        <LevelPills value={level} onChange={changeLevel} />
        <ModeGrid active={mode} onSelect={restart} />

        <div className="quiz-arena">
          {loading ? (
            <Loading />
          ) : mode === 'matching' ? (
            <MatchingGame key={`${round}-${level}`} pool={items} />
          ) : q ? (
            <QuestionView
              key={`${round}-${index}`}
              question={q}
              index={index}
              total={questions.length}
              score={score}
              level={level}
              autoPlay={mode === 'listening'}
              onAnswer={onAnswer}
            />
          ) : (
            <ResultView
              score={score}
              total={questions.length}
              onRetry={() => restart()}
              onSave={() => saveQuizResult(mode, score, questions.length)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
