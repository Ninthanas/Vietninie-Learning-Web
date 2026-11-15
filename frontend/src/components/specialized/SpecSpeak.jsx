import { speak } from '../../services/audio';

/** Specialized vocabulary is always Chinese -> speaks zh-CN. */
export default function SpecSpeak({ text, className = 'spec-action-btn', title = 'Nghe phát âm', children = '🔊', ...rest }) {
  return (
    <button type="button" className={className} title={title} onClick={() => speak(text, 'zh-CN')} {...rest}>
      {children}
    </button>
  );
}
