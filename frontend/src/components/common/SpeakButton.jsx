import { speak } from '../../services/audio';

/** Plays TTS for `text`. Pass any legacy class via className (`action-icon-btn`, `btn btn-sm btn-primary`, ...). */
export default function SpeakButton({ text, lang = 'zh-CN', className = 'action-icon-btn', stopPropagation = false, children, ...rest }) {
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        speak(text, lang);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
