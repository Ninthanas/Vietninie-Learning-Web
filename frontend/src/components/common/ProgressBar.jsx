/** Horizontal progress track (`.quiz-progress-track` / `.quiz-progress-fill`). */
export default function ProgressBar({ percent, height, minPercent = 0, style }) {
  const width = Math.max(minPercent, percent);
  return (
    <div className="quiz-progress-track" style={{ ...(height ? { height } : {}), ...style }}>
      <div className="quiz-progress-fill" style={{ width: `${width}%` }} />
    </div>
  );
}
