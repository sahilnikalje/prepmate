import { useEffect, useRef, useState } from "react";

function useSpeech() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  // Guard: prevent duplicate/overlapping speech calls
  const isBusyRef = useRef(false);

  //todo Setup SpeechRecognition once on mount
  //todo SpeechRecognition is built into Chrome/Edge browsers
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;    //todo keep listening until we stop it
    recognition.interimResults = true; //todo show words as they're being spoken
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let fullTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setTranscript(fullTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (e) => {
      console.error("SpeechRecognition error: ", e.error);
      setIsListening(false);
    };
    recognitionRef.current = recognition;
  }, []);

  // Helper to get best available voice
  const getVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(
        (v) =>
          v.name.includes("Google UK English Female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Female")
      ) || null
    );
  };

  //todo speak() — browser reads the question aloud
  //todo After speaking finishes → runs onDone callback
  const speak = (text, onDone, muted = false) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    isBusyRef.current = false; // reset after cancel

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = muted ? 0 : 1;

    const voice = getVoice();
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
    };

    window.speechSynthesis.speak(utterance);
  };

  //todo speakAndThen() — speaks text then calls a callback
  //todo Used for feedback phrases before next question
  //todo Has a busy guard to prevent overlapping calls
  const speakAndThen = (text, onDone, muted = false) => {
    // If already speaking — cancel and reset
    window.speechSynthesis.cancel();
    isBusyRef.current = false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = muted ? 0 : 1;

    const voice = getVoice();
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
      if (onDone) onDone(); // still proceed on error
    };

    window.speechSynthesis.speak(utterance);
  };

  //todo Start mic
  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    setTranscript(""); //todo clear previous answer
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // Ignore "already started" errors
    }
  };

  //todo Stop mic
  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  //todo Cleanup on unmount
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
