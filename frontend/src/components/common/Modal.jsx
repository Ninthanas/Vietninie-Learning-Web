/**
 * Generic overlay used by every popup (`.unified-modal-overlay` + `.active`).
 * The overlay stays mounted so the CSS transition works; children only render while open.
 */
export default function Modal({ open, onClose, maxWidth = 660, header, closeGlyph = '×', closeOnBackdrop = false, headerStyle, children }) {
  return (
    <div
      className={`unified-modal-overlay ${open ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div className="unified-modal-sheet" style={{ maxWidth }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, ...headerStyle }}>
          {header}
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            {closeGlyph}
          </button>
        </div>
        {open && children}
      </div>
    </div>
  );
}
