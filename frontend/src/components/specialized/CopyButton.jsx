import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

/** Copies `text` to the clipboard; the button flashes a green ✓ for 1.5s. */
export default function CopyButton({ text, className = 'spec-action-btn', children = '📋', title = 'Sao chép từ', ...rest }) {
  const { showToast } = useToast();
  const [done, setDone] = useState(false);
  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1500);
      showToast(`Đã sao chép: "${text}"`);
    });
  };
  const { style, ...others } = rest;
  return (
    <button type="button" className={className} title={title} onClick={copy} style={done ? { ...style, background: '#10B981', color: '#FFFFFF' } : style} {...others}>
      {done ? '✓' : children}
    </button>
  );
}
