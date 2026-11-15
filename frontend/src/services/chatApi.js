// AI chatbot service (FastAPI + Gemini). Only reachable from localhost, like the main API.
import { isLocalEnv } from './api';

export const AI_BASE_URL = isLocalEnv ? import.meta.env.VITE_AI_BASE_URL || 'http://localhost:8000' : '';

/**
 * @param {{message:string, history:{role:'user'|'assistant', content:string}[], language:'vi'|'zh'}} payload
 * @returns {Promise<string>} the assistant reply
 */
export async function sendChatMessage({ message, history, language }) {
  let res;
  try {
    res = await fetch(`${AI_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language })
    });
  } catch {
    throw new Error('NETWORK');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'ERROR');
  return data.reply;
}
