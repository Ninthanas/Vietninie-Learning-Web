// AI chatbot (Ni Ni). Two ways to reach it:
//  - local dev:   FastAPI AI-service on http://localhost:8000
//  - production:  Cloudflare Worker proxy, address injected at build time via VITE_AI_BASE_URL
import { isLocalEnv } from './api';

const configured = (import.meta.env.VITE_AI_BASE_URL || '').trim().replace(/\/$/, '');
export const AI_BASE_URL = configured || (isLocalEnv ? 'http://localhost:8000' : '');

// Keep requests small: fewer tokens, faster replies, less quota used.
export const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY_TURNS = 12;
const MAX_HISTORY_CHARS = 1000;
const MIN_GAP_MS = 1500; // client-side cooldown between sends
let lastSentAt = 0;

/**
 * @param {{message:string, history:{role:'user'|'assistant', content:string}[], language:'vi'|'zh'}} payload
 * @returns {Promise<string>} the assistant reply
 */
export async function sendChatMessage({ message, history, language }) {
  const now = Date.now();
  if (now - lastSentAt < MIN_GAP_MS) throw new Error('Bạn hỏi nhanh quá, đợi một chút rồi thử lại nhé.');
  lastSentAt = now;

  const trimmed = (history || [])
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, MAX_HISTORY_CHARS) }));

  let res;
  try {
    res = await fetch(`${AI_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.slice(0, MAX_MESSAGE_CHARS), history: trimmed, language })
    });
  } catch {
    throw new Error('NETWORK');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'ERROR');
  return data.reply;
}
