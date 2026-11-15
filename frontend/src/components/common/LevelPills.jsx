import { useLanguage } from '../../hooks/useLanguage';
import { LEVEL_OPTIONS } from '../../utils/helpers';

/** A1–C2 / HSK 1–6 pill selector (shared by Quiz and Listening). */
export default function LevelPills({ value, onChange }) {
  const { isVi } = useLanguage();
  return (
    <div className="level-pills" style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', margin: '16px 0 20px' }}>
      {LEVEL_OPTIONS.map((lvl) => {
        const active = lvl.id === value || lvl.id.toUpperCase() === String(value || '').toUpperCase();
        return (
          <button
            key={lvl.id}
            type="button"
            className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 14px', borderRadius: 99, fontWeight: 700, fontSize: '0.86rem' }}
            onClick={() => onChange(lvl.id)}
          >
            {isVi ? lvl.vi : lvl.zh}
          </button>
        );
      })}
    </div>
  );
}
