const TABS = [
  ['list', '📋', 'Danh Sách Thuật Ngữ'],
  ['interview', '🎙️', 'Kịch Bản Phỏng Vấn (Audio)'],
  ['cheatsheet', '🛠️', 'Phân Biệt Nghiệp Vụ & Cụm Từ PM'],
  ['flashcard', '🃏', 'Luyện Flashcard 3D']
];

export default function ModeTabs({ mode, onChange }) {
  return (
    <div className="spec-mode-bar" role="tablist">
      {TABS.map(([id, icon, label]) => (
        <button key={id} type="button" role="tab" className={`spec-mode-tab ${mode === id ? 'active' : ''}`} onClick={() => onChange(id)}>
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
