import { useProgress } from '../../hooks/useProgress';

const XP_PER_WORD = 10;
const XP_PER_LEVEL = 200;

/** Streak + XP + level chips. XP is derived from the real "learned words" count (10 XP per word). */
export default function GameStats() {
  const { learned, streak } = useProgress();
  const xp = learned.size * XP_PER_WORD;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return (
    <div className="game-stats" aria-label="Streak và XP">
      <span className="game-chip game-chip-streak" title="Chuỗi ngày học liên tiếp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9Z" fill="#F97316" stroke="#2B1B17" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        {streak}
      </span>
      <span className="game-chip game-chip-xp" title={`Cấp ${level}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" fill="#FFB703" stroke="#2B1B17" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        {xp}<small>XP · Lv {level}</small>
      </span>
    </div>
  );
}
