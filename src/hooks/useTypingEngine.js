import { useState, useRef, useCallback, useEffect } from "react";
import { getPromptQueue, DIFFICULTIES } from "../data/wordPools";

const CRASH_ACCURACY_SAMPLE = 20; // keystrokes considered for abyss crash check

export function useTypingEngine(
  difficultyId,
  { blind = false, promptMode = "words", seed = null } = {}
) {
  const diff = DIFFICULTIES[difficultyId];
  const [queue, setQueue] = useState(() => getPromptQueue(difficultyId, promptMode, 40, seed));
  const [promptIndex, setPromptIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("idle"); // idle | running | finished | crashed
  const [timeLeft, setTimeLeft] = useState(diff.timeLimit);
  const [combo, setCombo] = useState(0);
  const [wave, setWave] = useState(1);
  const [wpmSamples, setWpmSamples] = useState([]); // { t, wpm }
  const [keyErrors, setKeyErrors] = useState({}); // key -> error count
  const [keyHits, setKeyHits] = useState({}); // key -> total presses

  const startTimeRef = useRef(null);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);
  const recentResultsRef = useRef([]); // rolling correctness for abyss crash check
  const timerRef = useRef(null);
  const sampleTimerRef = useRef(null);

  const currentPrompt = queue[promptIndex] || "";

  const start = useCallback(() => {
    setQueue(getPromptQueue(difficultyId, promptMode, 40, seed));
    setPromptIndex(0);
    setTyped("");
    setStatus("running");
    setTimeLeft(diff.timeLimit);
    setCombo(0);
    setWave(1);
    setWpmSamples([]);
    setKeyErrors({});
    setKeyHits({});
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
    recentResultsRef.current = [];
    startTimeRef.current = Date.now();
  }, [difficultyId, diff.timeLimit, promptMode, seed]);

  const finish = useCallback((finalStatus = "finished") => {
    setStatus(finalStatus);
  }, []);

  // countdown timer (non-abyss modes)
  useEffect(() => {
    if (status !== "running" || diff.timeLimit == null) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finish("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [status, diff.timeLimit, finish]);

  // WPM sampling every 2s for the stats graph
  useEffect(() => {
    if (status !== "running") return;
    sampleTimerRef.current = setInterval(() => {
      const elapsedMin = (Date.now() - startTimeRef.current) / 60000;
      if (elapsedMin <= 0) return;
      const wpm = Math.round((correctCharsRef.current / 5) / elapsedMin);
      setWpmSamples((s) => [...s, { t: s.length, wpm }]);
    }, 2000);
    return () => clearInterval(sampleTimerRef.current);
  }, [status]);

  const currentAccuracy = useCallback(() => {
    if (totalCharsRef.current === 0) return 100;
    return Math.round((correctCharsRef.current / totalCharsRef.current) * 100);
  }, []);

  const handleInput = useCallback(
    (value) => {
      if (status !== "running") return;

      const prevLen = typed.length;
      const newLen = value.length;

      // only score forward keystrokes (typed a new char), ignore backspace scoring
      if (newLen > prevLen) {
        const idx = newLen - 1;
        const expected = currentPrompt[idx];
        const actual = value[idx];
        const isCorrect = expected === actual;
        totalCharsRef.current += 1;
        if (isCorrect) correctCharsRef.current += 1;

        const key = (expected || "?").toLowerCase();
        setKeyHits((h) => ({ ...h, [key]: (h[key] || 0) + 1 }));
        if (!isCorrect) setKeyErrors((e) => ({ ...e, [key]: (e[key] || 0) + 1 }));

        if (diff.id === "abyss") {
          recentResultsRef.current.push(isCorrect ? 1 : 0);
          if (recentResultsRef.current.length > CRASH_ACCURACY_SAMPLE) {
            recentResultsRef.current.shift();
          }
          if (recentResultsRef.current.length >= CRASH_ACCURACY_SAMPLE) {
            const acc =
              (recentResultsRef.current.reduce((a, b) => a + b, 0) /
                recentResultsRef.current.length) *
              100;
            if (acc < diff.accuracyFloor) {
              setTyped(value);
              finish("crashed");
              return;
            }
          }
        }
      }

      setTyped(value);

      // completed the current prompt
      if (value === currentPrompt) {
        setCombo((c) => c + 1);
        const nextIndex = promptIndex + 1;
        if (nextIndex >= queue.length) {
          // deterministic refill: derive from the same seed + current length so
          // every client in a competition room still gets an identical sequence
          const refillSeed = seed != null ? seed + queue.length : null;
          setQueue((q) => [...q, ...getPromptQueue(difficultyId, promptMode, 20, refillSeed)]);
        }
        setPromptIndex(nextIndex);
        setTyped("");
        if (diff.id === "abyss") {
          setWave((w) => (nextIndex % 5 === 0 ? w + 1 : w));
        }
      }
    },
    [status, typed, currentPrompt, promptIndex, queue.length, diff, difficultyId, promptMode, seed, finish]
  );

  const elapsedSeconds = startTimeRef.current
    ? (Date.now() - startTimeRef.current) / 1000
    : 0;
  const finalWpm =
    elapsedSeconds > 0 ? Math.round((correctCharsRef.current / 5) / (elapsedSeconds / 60)) : 0;

  return {
    diff,
    status,
    currentPrompt,
    typed,
    timeLeft,
    combo,
    wave,
    wpmSamples,
    keyErrors,
    keyHits,
    accuracy: currentAccuracy(),
    finalWpm,
    totalCharsTyped: correctCharsRef.current,
    blind,
    start,
    finish,
    handleInput,
  };
}
