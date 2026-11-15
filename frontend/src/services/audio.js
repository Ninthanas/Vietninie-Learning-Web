// ============================================================================
// AUDIO ENGINE — single-source TTS (no echo): native Web Speech voice first,
// otherwise Youdao / Google TTS stream. Ported 1:1 from the legacy app.js.
// ============================================================================
let sharedAudio = null;
let unlocked = false;
let playRequestId = 0;
let lastSpeakTime = 0;
let lastSpeakText = '';

function ensureNoReferrer() {
  if (!document.querySelector('meta[name="referrer"]')) {
    const meta = document.createElement('meta');
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.appendChild(meta);
  }
}

function getAudioElement() {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
    sharedAudio.setAttribute('playsinline', '');
    sharedAudio.setAttribute('webkit-playsinline', '');
    try {
      sharedAudio.referrerPolicy = 'no-referrer';
    } catch (e) {
      /* ignore */
    }
  }
  return sharedAudio;
}

export function stopAll() {
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      /* ignore */
    }
  }
  if (sharedAudio) {
    try {
      sharedAudio.onplaying = null;
      sharedAudio.onerror = null;
      sharedAudio.onended = null;
      sharedAudio.pause();
      sharedAudio.removeAttribute('src');
      sharedAudio.load();
    } catch (e) {
      /* ignore */
    }
  }
}

function unlockMobileAudio() {
  if (unlocked) return;
  unlocked = true;
  ensureNoReferrer();
  const audio = getAudioElement();
  try {
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    }
  } catch (e) {
    /* ignore */
  }
}

/** Call once at startup (main.jsx). */
export function initAudio() {
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
  document.addEventListener('touchstart', unlockMobileAudio, { once: true, passive: true });
  document.addEventListener('click', unlockMobileAudio, { once: true, passive: true });
}

function hasNativeVoiceFor(langCode = 'vi-VN') {
  if (!('speechSynthesis' in window)) return false;
  try {
    const prefix = langCode.toLowerCase().slice(0, 2);
    return (window.speechSynthesis.getVoices() || []).some((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
  } catch (e) {
    return false;
  }
}

function speakStreamOnly(text, langCode, reqId) {
  if (reqId !== playRequestId) return;
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      /* ignore */
    }
  }
  const isVi = langCode.toLowerCase().startsWith('vi');
  const encoded = encodeURIComponent(text);
  const primaryUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=${isVi ? 'vi' : 'zh'}`;
  const backupUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${isVi ? 'vi' : 'zh-CN'}&client=gtx`;
  const audio = getAudioElement();
  let triedBackup = false;

  audio.onerror = () => {
    if (reqId !== playRequestId || triedBackup) return;
    triedBackup = true;
    audio.src = backupUrl;
    audio.play().catch(() => {});
  };
  audio.src = primaryUrl;
  audio.play().catch(() => {
    if (reqId === playRequestId && !triedBackup) {
      triedBackup = true;
      audio.src = backupUrl;
      audio.play().catch(() => {});
    }
  });
}

function speakNativeOnly(text, langCode, reqId) {
  if (reqId !== playRequestId) return;
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langCode;
    utter.rate = 0.92;
    const voices = window.speechSynthesis.getVoices() || [];
    const prefix = langCode.toLowerCase().slice(0, 2);
    const voice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix) && v.localService) ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(prefix));
    if (voice) utter.voice = voice;
    utter.onerror = () => {
      if (reqId === playRequestId) speakStreamOnly(text, langCode, reqId);
    };
    window.speechSynthesis.speak(utter);
  } catch (e) {
    speakStreamOnly(text, langCode, reqId);
  }
}

export function speak(text, langCode = 'zh-CN') {
  if (!text) return;
  const clean = String(text).trim();
  const now = Date.now();
  if (clean === lastSpeakText && now - lastSpeakTime < 350) return; // anti double-click echo
  lastSpeakText = clean;
  lastSpeakTime = now;

  ensureNoReferrer();
  const reqId = ++playRequestId;
  stopAll();
  if (hasNativeVoiceFor(langCode)) speakNativeOnly(clean, langCode, reqId);
  else speakStreamOnly(clean, langCode, reqId);
}
