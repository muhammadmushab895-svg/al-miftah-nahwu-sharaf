/**
 * Utilitas pelafalan teks Arab menggunakan Web Speech API (ar-SA / ar)
 * dengan manajemen status agar UI React dapat menampilkan indikator audio aktif.
 */

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function stopArabicSpeech() {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore browser cancel errors
  }
}

export function pickArabicVoice() {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase() === 'ar-sa') ||
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('ar')) ||
    null
  );
}

/**
 * Melafalkan teks Arab menggunakan SpeechSynthesis.
 * @param {string} text Teks Arab yang akan dilafalkan
 * @param {{ rate?: number, onStart?: () => void, onEnd?: () => void, onError?: (err: any) => void }} options
 */
export function speakArabic(text, options = {}) {
  const cleanText = String(text || '').replace(/\s*\/\s*.*/, '').trim();
  if (!cleanText || cleanText === '-' || cleanText.startsWith('- (')) {
    options.onEnd?.();
    return false;
  }

  if (!isSpeechSupported()) {
    options.onError?.(new Error('Web Speech API tidak didukung pada peramban ini.'));
    return false;
  }

  stopArabicSpeech();

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = pickArabicVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || 'ar-SA';
  utterance.rate = options.rate ?? 0.85;
  utterance.pitch = 1.0;

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => {
    options.onEnd?.();
  };
  utterance.onerror = (err) => {
    options.onError?.(err);
  };

  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    options.onError?.(err);
    return false;
  }
}
