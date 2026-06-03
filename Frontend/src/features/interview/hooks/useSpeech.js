import { useEffect, useRef, useState } from "react";

// ─── Voice preference helpers ─────────────────────────────────────────────────
// Reads 'prepmate-voice' from localStorage ('female' | 'male')
// Falls back to 'female' if nothing saved yet.
// SettingsPage writes this key when the user saves preferences.

function getPreferredVoice() {
  const pref = localStorage.getItem('prepmate-voice') || 'female'

  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  if (pref === 'male') {
    // Try common male voice names across browsers
    return (
      voices.find(v => v.name.includes('Google UK English Male')) ||
      voices.find(v => v.name.includes('Microsoft David'))       ||
      voices.find(v => v.name.includes('Alex'))                  ||
      voices.find(v => v.name.toLowerCase().includes('male'))    ||
      // Last resort: pick a voice that is NOT female-named
      voices.find(v =>
        !v.name.toLowerCase().includes('female') &&
        !v.name.includes('Samantha') &&
        !v.name.includes('Victoria') &&
        !v.name.includes('Karen')    &&
        !v.name.includes('Moira')    &&
        !v.name.includes('Aria')
      ) ||
      null
    )
  }

  // Female (default)
  return (
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.name.includes('Samantha'))                 ||
    voices.find(v => v.name.includes('Victoria'))                 ||
    voices.find(v => v.name.includes('Karen'))                    ||
    voices.find(v => v.name.toLowerCase().includes('female'))     ||
    voices[0] ||
    null
  )
}

function useSpeech() {
  const [transcript,  setTranscript]  = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);

  const recognitionRef = useRef(null);
  const isBusyRef      = useRef(false);

  // ── Setup SpeechRecognition once on mount ──────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser");
      return;
    }

    const recognition        = new SpeechRecognition();
    recognition.continuous   = true;
    recognition.interimResults = true;
    recognition.lang         = "en-US";

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setTranscript(fullTranscript);
    };

    recognition.onend   = () => setIsListening(false);
    recognition.onerror = (e) => {
      console.error("SpeechRecognition error: ", e.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // ── Voices load asynchronously in some browsers ────────────────────────────
  // We prime them so getPreferredVoice() works immediately when speak() is called
  useEffect(() => {
    const prime = () => window.speechSynthesis.getVoices();
    prime();
    window.speechSynthesis.addEventListener('voiceschanged', prime);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', prime);
  }, []);

  // ── Internal speak helper ──────────────────────────────────────────────────
  function _speak(text, onDone, muted = false) {
    window.speechSynthesis.cancel();
    isBusyRef.current = false;

    const utterance    = new SpeechSynthesisUtterance(text);
    utterance.rate     = 0.92;
    utterance.pitch    = 1;
    utterance.volume   = muted ? 0 : 1;

    // Read voice preference fresh every time so changes take effect immediately
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      isBusyRef.current = true;
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      isBusyRef.current = false;
      if (onDone) onDone();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      isBusyRef.current = false;
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  const speak = (text, onDone, muted = false) => _speak(text, onDone, muted);

  const speakAndThen = (text, onDone, muted = false) => _speak(text, onDone, muted);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Ignore "already started" errors
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      isBusyRef.current = false;
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  return {
    transcript,
    isListening,
    isSpeaking,
    speak,
    speakAndThen,
    startListening,
    stopListening,
    setTranscript,
  };
}

export default useSpeech;