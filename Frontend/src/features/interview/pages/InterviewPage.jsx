import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSpeech from "./../hooks/useSpeech";
import InterviewHeader from "./../components/InterviewHeader";
import CameraView from "./../components/CameraView";
import ControlBar from "./../components/ControlBar";
import interviewService from "../services/interviewService";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FOLLOW_UPS = 1; // maximum follow-up questions per main question

// Short, natural AI feedback phrases after a good answer
const GOOD_FEEDBACK_PHRASES = [
  "Good explanation.",
  "Nice answer.",
  "Solid understanding.",
  "Good approach.",
  "Well said.",
  "Great, noted.",
  "Clear and concise.",
];

function getRandomFeedback() {
  return GOOD_FEEDBACK_PHRASES[Math.floor(Math.random() * GOOD_FEEDBACK_PHRASES.length)];
}

// ─── Component ────────────────────────────────────────────────────────────────
function InterviewPage() {
  const { id } = useParams(); // interview ID from URL
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [scores, setScores] = useState([]);

  // currentQ: the text currently displayed on screen — persists until next question
  const [currentQ, setCurrentQ] = useState("");

  // Countdown before interview starts
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);

  // Completion modal state
  const [showCompletion, setShowCompletion] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  // ── Refs: prevent race conditions ─────────────────────────────────────────
  // Prevent submitting the same answer twice
  const isSubmittingRef = useRef(false);
  // Track the question text that was last asked (to prevent re-asking)
  const lastAskedQuestionRef = useRef("");
  // True while transitioning between questions — blocks new submissions
  const isTransitioningRef = useRef(false);

  // ── Speech hook ────────────────────────────────────────────────────────────
  const {
    transcript,
    isListening,
    isSpeaking,
    speak,
    speakAndThen,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeech();

  // ── STEP: Load questions when interview mounts ─────────────────────────────
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await interviewService.getQuestions(id);
        setQuestions(data.questions);
        setCurrentQ(data.questions[0]);
        lastAskedQuestionRef.current = data.questions[0];
      } catch (err) {
        console.error("Failed to load questions: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [id]);

  // ── STEP: Speak question when countdown finishes ───────────────────────────
  // Only triggers once after countdown hides — does NOT re-trigger on state changes
  const hasSpokenFirstRef = useRef(false);
  useEffect(() => {
    if (!currentQ || isLoading || showCountdown) return;
    if (hasSpokenFirstRef.current) return; // already spoken first question
    hasSpokenFirstRef.current = true;
    speak(currentQ, () => startListening(), isMuted);
  }, [showCountdown, isLoading]);

  // ── STEP: Countdown timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!showCountdown) return;
    if (countdown === 0) {
      setShowCountdown(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showCountdown]);

  // ── STEP: Completion redirect countdown ───────────────────────────────────
  useEffect(() => {
    if (!showCompletion) return;
    if (redirectCountdown === 0) {
      navigate("/dashboard");
      return;
    }
    const timer = setTimeout(() => setRedirectCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [showCompletion, redirectCountdown]);

  // ── Helper: ask a new question (sets text + speaks) ───────────────────────
  const askQuestion = useCallback(
    (questionText) => {
      // Prevent asking the same question twice
      if (questionText === lastAskedQuestionRef.current && hasSpokenFirstRef.current) return;
      lastAskedQuestionRef.current = questionText;
      isTransitioningRef.current = false;
      setCurrentQ(questionText);
      speak(questionText, () => {
        setTimeout(() => startListening(), 500);
      }, isMuted);
    },
    [isMuted, speak, startListening]
  );

  // ── STEP: Submit answer handler ────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    // Guard: no empty answer, not already submitting, not transitioning
    if (!transcript.trim()) return;
    if (isSubmittingRef.current) return;
    if (isTransitioningRef.current) return;

    isSubmittingRef.current = true;
    isTransitioningRef.current = true;

    stopListening();
    window.speechSynthesis.cancel();
    setIsEvaluating(true);

    try {
      const result = await interviewService.evaluateAnswer({
        question: currentQ,
        answer: transcript,
        role: "Interview Candidate",
      });

      // Save Q&A to conversation log
      const entry = {
        question: currentQ,
        answer: transcript,
        score: result.score,
      };
      const newConversation = [...conversation, entry];
      const newScores = [...scores, result.score];
      setConversation(newConversation);
      setScores(newScores);
      setTranscript("");

      // Build the feedback + transition text
      const feedback = result.feedback || getRandomFeedback();
      const isWeak = result.quality === "weak";
      const canFollowUp = isWeak && followUpCount < MAX_FOLLOW_UPS;

      if (canFollowUp) {
        // ── Follow-up: only for weak answers, max once ───────────────────
        setFollowUpCount((prev) => prev + 1);

        // Generate a follow-up question via a brief Groq nudge
        const followUpText = `Could you expand on that a bit more?`;
        const fullText = `${feedback} ${followUpText}`;

        isSubmittingRef.current = false;

        speakAndThen(fullText, () => {
          setCurrentQ(followUpText);
          lastAskedQuestionRef.current = followUpText;
          isTransitioningRef.current = false;
          setTimeout(() => startListening(), 500);
        }, isMuted);

      } else {
        // ── Move to next main question ────────────────────────────────────
        setFollowUpCount(0);
        const nextIndex = currentIndex + 1;

        if (nextIndex < questions.length) {
          setCurrentIndex(nextIndex);
          const nextQuestion = questions[nextIndex];

          const transitionText = `${feedback} Moving to the next question.`;

          isSubmittingRef.current = false;

          speakAndThen(transitionText, () => {
            // After saying "Moving to next question" — wait a beat then ask it
            setTimeout(() => {
              askQuestion(nextQuestion);
            }, 600);
          }, isMuted);

        } else {
          // ── All questions done — end interview ────────────────────────
          isSubmittingRef.current = false;

          speakAndThen(
            `${feedback} Thank you. The interview is now complete. You did a great job!`,
            () => {
              handleFinish(newConversation, newScores);
            },
            isMuted
          );
        }
      }
    } catch (err) {
      console.error("Evaluation failed: ", err);
      isSubmittingRef.current = false;
      isTransitioningRef.current = false;
    } finally {
      setIsEvaluating(false);
    }
  };

  // ── STEP: Save results + show completion modal ─────────────────────────────
  const handleFinish = async (fullConversation, allScores) => {
    const finalScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    try {
      await interviewService.saveResults({
        interviewId: id,
        conversation: fullConversation,
        finalScore,
      });
    } catch (err) {
      console.error("Save results failed: ", err);
    } finally {
      // Show completion modal — auto-redirects after countdown
      setShowCompletion(true);
    }
  };

  // ── STEP: End interview early ──────────────────────────────────────────────
  const handleEndInterview = async () => {
    window.speechSynthesis.cancel();
    await handleFinish(conversation, scores);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      if (!prev) window.speechSynthesis.cancel();
      return !prev;
    });
  };

  const handleToggleListen = () => {
    isListening ? stopListening() : startListening();
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex flex-col items-center justify-center gap-4">
        <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="font-headline text-on-surface-variant text-lg">
          Preparing your personalized interview...
        </p>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-surface min-h-screen max-h-screen flex flex-col overflow-hidden">

      {/* ── Countdown Modal ─────────────────────────────────────────────── */}
      {showCountdown && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          {/* Glow */}
          <div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative flex flex-col items-center gap-6 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mic-glow">
              <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>

            {/* Title */}
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-2">
                Get Ready!
              </h2>
              <p className="text-on-surface-variant text-sm">
                Your AI interview is about to begin. Make sure you're in a quiet place.
              </p>
            </div>

            {/* Countdown circle */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(163,166,255,0.1)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#grad)" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - countdown / 10)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a3a6ff" />
                    <stop offset="100%" stopColor="#c180ff" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-headline text-4xl font-extrabold text-primary">{countdown}</span>
            </div>

            <p className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
              Starting interview...
            </p>

            {/* Skip button */}
            <button
              onClick={() => { setCountdown(0); setShowCountdown(false); }}
              className="px-6 py-2.5 rounded-full border border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Completion Modal ─────────────────────────────────────────────── */}
      {showCompletion && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          <div className="absolute w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative flex flex-col items-center gap-6 text-center max-w-md px-6">
            {/* Success icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mic-glow">
              <span
                className="material-symbols-outlined text-white text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-extrabold text-on-surface">
                Interview Complete!
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Great work! You've completed all the questions. Your responses have been saved and are being evaluated.
              </p>
            </div>

            {/* Redirect countdown */}
            <div className="bg-surface-container-high/60 backdrop-blur-xl px-8 py-4 rounded-2xl border border-outline-variant/20 flex flex-col items-center gap-2 inner-glow">
              <span className="font-headline text-4xl font-extrabold text-primary">{redirectCountdown}</span>
              <p className="text-on-surface-variant text-xs font-bold tracking-widest uppercase">
                Redirecting to dashboard...
              </p>
            </div>

            {/* Manual redirect */}
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full text-sm shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Go to Dashboard Now
            </button>
          </div>
        </div>
      )}

      {/* Atmospheric glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <InterviewHeader
        role={"Interview"}
        currentIndex={currentIndex}
        total={questions.length}
      />

      {/* Warning banner */}
      <div className="flex justify-center px-8 mb-2 flex-shrink-0">
        <div className="bg-error-container/20 backdrop-blur-xl px-6 py-2 rounded-xl border border-error/20 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-error text-sm"
            style={{ fontVariationSettings: "'FILL'1" }}
          >
            warning
          </span>
          <span className="font-headline font-bold text-[10px] tracking-widest text-error uppercase">
            Please stay on this screen to maintain session integrity.
          </span>
        </div>
      </div>

      {/* Main content: Camera + subtitle + actions */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 relative min-h-0">
        <CameraView
          question={currentQ}
          transcript={transcript}
          isListening={isListening}
          isSpeaking={isSpeaking}
        />

        {/* Submit button — only shows when mic is stopped and transcript exists */}
        {!isListening && !isSpeaking && !isEvaluating && transcript && !isSubmittingRef.current && (
          <div
            onClick={handleSubmitAnswer}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full text-sm shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Submit Answer
          </div>
        )}

        {/* Evaluating state */}
        {isEvaluating && (
          <div className="mt-4 flex items-center gap-3 text-secondary flex-shrink-0">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="font-headline text-sm font-bold tracking-widest">
              AI is evaluating your answer...
            </span>
          </div>
        )}
      </main>

      {/* Controls */}
      <ControlBar
        isListening={isListening}
        isSpeaking={isSpeaking}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onToggleListen={handleToggleListen}
        onEndInterview={handleEndInterview}
      />
    </div>
  );
}

export default InterviewPage;
