import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LogoMark } from '../mascot/Logo';
import { AI_BASE_URL, MAX_MESSAGE_CHARS, sendChatMessage } from '../../services/chatApi';

/** Floating AI chat button + popup panel. Conversation lives in component state (server is stateless). */
export default function ChatWidget() {
  const { isVi, nativeLang, pick } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  if (!AI_BASE_URL) return null; // production build without an AI backend: hide the widget

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const reply = await sendChatMessage({ message: text, history, language: nativeLang });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      const msg =
        e.message === 'NETWORK'
          ? pick('Không kết nối được Ni Ni, kiểm tra mạng rồi thử lại nhé.', '无法连接 Ni Ni，请检查网络后重试。')
          : e.message;
      setMessages((prev) => [...prev, { role: 'assistant', content: msg, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {open && (
        <section className="chat-panel" role="dialog" aria-label="AI chat">
          <header className="chat-header">
            <span className="chat-title"><LogoMark size={32} /><strong>{pick('Ni Ni · Trợ lý AI', 'Ni Ni · AI 助手')}</strong></span>
            <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </header>
          <div className="chat-body">
            {messages.length === 0 && (
              <p className="chat-hint">
                {pick(
                  'Xin chào, mình là Ni Ni! Hỏi mình về từ vựng, ngữ pháp, phát âm tiếng Trung / tiếng Việt nhé.',
                  '你好，我是 Ni Ni！可以问我越南语/中文的词汇、语法和发音问题。'
                )}
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}${m.error ? ' error' : ''}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="chat-msg assistant chat-typing">…</div>}
            <div ref={endRef} />
          </div>
          <div className="chat-input-row">
            <textarea
              rows={1}
              value={input}
              maxLength={MAX_MESSAGE_CHARS}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={pick('Nhập câu hỏi…', '输入问题…')}
            />
            <button type="button" onClick={send} disabled={loading || !input.trim()}>
              {isVi ? 'Gửi' : '发送'}
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={pick('Mở chat AI', '打开 AI 聊天')}
      >
        {open ? '✕' : (<><LogoMark size={42} /><span className="chat-fab-label">{pick('Hỏi Ni Ni', '问 Ni Ni')}</span></>)}
      </button>
    </>
  );
}
