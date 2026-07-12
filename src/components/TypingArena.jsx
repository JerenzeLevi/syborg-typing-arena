import { useEffect, useRef, useState } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";
import GlitchOverlay from "./GlitchOverlay";
import { addLeaderboardEntry, addHistoryEntry } from "../lib/storage";
import gsap from "gsap";

const GLITCH_CHARS = "!@#$%&*01{}<>";

function scramble(str) {
  return str
    .split("")
    .map((c) => (c === " " ? " " : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]))
    .join("");
}

export default function TypingArena({ difficultyId, promptMode = "words", modes, onFinish }) {
  const engine = useTypingEngine(difficultyId, { blind: modes.blind, promptMode });
  const isAbyss = difficultyId === "abyss";
  const inputRef = useRef(null);
  const promptRef = useRef(null);
  const [hidePrompt, setHidePrompt] = useState(false);
  const [glitchFrame, setGlitchFrame] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);
  const [errorFlash, setErrorFlash] = useState(false);
  const [blackout, setBlackout] = useState(false);
  const [overdrive, setOverdrive] = useState(false);
  const prevTypedRef = useRef("");

  const blindActive = modes.blind && hidePrompt && engine.status === "running";

  useEffect(() => {
    engine.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [engine.status]);

  // blind mode: hide prompt text a moment after each new prompt appears
  useEffect(() => {
    if (!modes.blind) return;
    setHidePrompt(false);
    const t = setTimeout(() => setHidePrompt(true), 1200);
    return () => clearTimeout(t);
  }, [engine.currentPrompt, modes.blind]);

  // blind mode reaches beyond the arena: dim/blur the whole page chrome (navbar included)
  // while the prompt is hidden, so the entire UI narrows focus down to the input.
  useEffect(() => {
    const active = modes.blind && hidePrompt && engine.status === "running";
    document.body.classList.toggle("syb-blind-active", active);
    return () => document.body.classList.remove("syb-blind-active");
  }, [modes.blind, hidePrompt, engine.status]);

  // glitch mode: periodically scramble the untyped remainder AND punch the whole
  // screen with a shake + chroma flicker, not just the affected characters.
  useEffect(() => {
    if (!modes.glitch || engine.status !== "running") return;
    const interval = setInterval(() => {
      setGlitchFrame(scramble(engine.currentPrompt.slice(engine.typed.length)));
      document.body.classList.add("syb-glitch-burst");
      setTimeout(() => {
        setGlitchFrame(null);
        document.body.classList.remove("syb-glitch-burst");
      }, 380);
    }, 1100);
    return () => clearInterval(interval);
  }, [modes.glitch, engine.status, engine.currentPrompt, engine.typed.length]);

  // constant faint chroma flicker on the navbar for the full duration of glitch mode
  useEffect(() => {
    const active = modes.glitch && engine.status === "running";
    document.body.classList.toggle("syb-glitch-active", active);
    return () => document.body.classList.remove("syb-glitch-active");
  }, [modes.glitch, engine.status]);

  // blind mode: unpredictable hard blackout bursts on top of the vignette
  useEffect(() => {
    if (!blindActive) return;
    let timeout;
    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        setBlackout(true);
        setTimeout(() => setBlackout(false), 100 + Math.random() * 200);
        scheduleNext();
      }, delay);
    };
    scheduleNext();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modes.blind, hidePrompt, engine.status]);

  // OVERDRIVE — sustained high WPM + accuracy ramps the whole UI's intensity
  useEffect(() => {
    const active =
      engine.status === "running" && engine.finalWpm >= 70 && engine.accuracy >= 95 && engine.combo >= 5;
    setOverdrive((was) => {
      if (active && !was) {
        // one-shot hue-rotate burst across the whole app the instant overdrive kicks in
        const app = document.getElementById("root");
        if (app) {
          gsap.fromTo(
            app,
            { filter: "hue-rotate(0deg)" },
            { filter: "hue-rotate(180deg)", duration: 0.4, yoyo: true, repeat: 3, ease: "power1.inOut" }
          );
        }
      }
      return active;
    });
    document.body.classList.toggle("syb-overdrive", active);
    return () => document.body.classList.remove("syb-overdrive");
  }, [engine.finalWpm, engine.accuracy, engine.combo, engine.status]);

  // red glitch flash on a wrong keystroke — a UI reaction, not just a text color change
  useEffect(() => {
    const prev = prevTypedRef.current;
    if (engine.typed.length > prev.length) {
      const idx = engine.typed.length - 1;
      if (engine.typed[idx] !== engine.currentPrompt[idx]) {
        setErrorFlash(true);
        setTimeout(() => setErrorFlash(false), 180);
      }
    }
    prevTypedRef.current = engine.typed;
  }, [engine.typed, engine.currentPrompt]);

  useEffect(() => {
    if (engine.status === "finished" || engine.status === "crashed") {
      if (promptRef.current) {
        gsap.fromTo(
          promptRef.current,
          { scale: 1.02, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    }
  }, [engine.status]);

  const finished = engine.status === "finished" || engine.status === "crashed";

  const handleSave = () => {
    const name = playerName.trim() || "Freshman";
    const score = difficultyId === "abyss" ? engine.wave : engine.finalWpm;
    addLeaderboardEntry(difficultyId, {
      name,
      score,
      wpm: engine.finalWpm,
      accuracy: engine.accuracy,
      wave: engine.wave,
    });
    addHistoryEntry({
      difficultyId,
      wpm: engine.finalWpm,
      accuracy: engine.accuracy,
      wave: engine.wave,
      keyErrors: engine.keyErrors,
      keyHits: engine.keyHits,
      wpmSamples: engine.wpmSamples,
    });
    setSaved(true);
    onFinish?.(engine);
  };

  const remainder = engine.currentPrompt.slice(engine.typed.length);
  const displayRemainder = glitchFrame ?? remainder;

  const hot = engine.combo >= 10; // adaptive UI intensity: glow ramps up on hot streaks

  return (
    <div className="relative">
      <GlitchOverlay active={modes.glitch && engine.status === "running"} />
      {blindActive && <div className="blind-vignette" />}
      {blackout && <div className="blind-blackout" />}

      <div
        className={`mb-6 flex flex-wrap items-center justify-between gap-3 font-mono text-sm ${
          blindActive ? "blind-dim" : ""
        }`}
      >
        <div className="flex gap-4">
          <Stat label="Combo" value={engine.combo} accent="yellow" />
          {isAbyss ? (
            <Stat label="Wave" value={engine.wave} accent="red" />
          ) : (
            <Stat label="Time" value={`${engine.timeLeft}s`} accent="cyan" />
          )}
          <Stat label="Accuracy" value={`${engine.accuracy}%`} accent="blue" />
        </div>
        {modes.blind && (
          <span className="rounded border border-syb-yellow/40 px-2 py-1 text-syb-yellow">
            BLIND MODE
          </span>
        )}
        {modes.glitch && (
          <span className="rounded border border-syb-cyan/40 px-2 py-1 text-syb-cyan glitch-chroma">
            GLITCH MODE
          </span>
        )}
        {overdrive && (
          <span className="yellow-glow animate-pulse rounded border border-syb-yellow px-2 py-1 text-syb-yellow">
            ⚡ OVERDRIVE
          </span>
        )}
      </div>

      <div
        ref={promptRef}
        className={`hud-corners circuit-bg relative min-h-[140px] rounded-xl p-6 font-mono text-xl leading-relaxed transition-shadow duration-300 sm:text-2xl ${
          isAbyss ? "abyss-card" : "glow-border"
        } ${modes.glitch && glitchFrame ? "glitching glitch-shake" : ""} ${
          errorFlash ? "border-red-400! shadow-[0_0_28px_rgba(255,0,60,0.45)]" : ""
        } ${hot && !errorFlash ? "shadow-[0_0_32px_rgba(255,230,0,0.25)]" : ""} ${
          overdrive ? "overdrive-active" : ""
        }`}
      >
        {!finished && (
          <>
            {hidePrompt ? (
              <span className="char-current">Type from memory…</span>
            ) : (
              <>
                {engine.typed.split("").map((ch, i) => (
                  <span
                    key={i}
                    className={ch === engine.currentPrompt[i] ? "char-correct" : "char-incorrect"}
                  >
                    {ch}
                  </span>
                ))}
                <span className="char-current">{displayRemainder[0]}</span>
                <span className="char-pending">{displayRemainder.slice(1)}</span>
              </>
            )}
          </>
        )}

        {engine.status === "crashed" && (
          <div className="text-center">
            <p className="yellow-glow font-mono text-3xl font-bold text-red-400">
              ⚠ SYSTEM CRASH ⚠
            </p>
            <p className="mt-2 text-sm text-syb-white/70">
              Accuracy dropped too low. Run terminated at Wave {engine.wave}.
            </p>
          </div>
        )}
        {engine.status === "finished" && (
          <div className="text-center">
            <p className="yellow-glow font-mono text-2xl font-bold text-syb-yellow">
              RUN COMPLETE
            </p>
          </div>
        )}
      </div>

      {!finished ? (
        <input
          ref={inputRef}
          value={engine.typed}
          onChange={(e) => engine.handleInput(e.target.value)}
          className={`relative z-30 mt-4 w-full rounded-lg border bg-syb-black/80 px-4 py-3 font-mono text-lg text-syb-white outline-none ${
            isAbyss
              ? "border-red-500/60 shadow-[0_0_20px_rgba(255,0,60,0.2)] focus:border-red-400"
              : "border-syb-cyan/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] focus:border-syb-yellow"
          }`}
          placeholder="Start typing here…"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ResultTile label="WPM" value={engine.finalWpm} />
          <ResultTile label="Accuracy" value={`${engine.accuracy}%`} />
          <ResultTile label="Combo" value={engine.combo} />
          <ResultTile label={difficultyId === "abyss" ? "Wave" : "Words"} value={engine.wave} />
        </div>
      )}

      {finished && !saved && (
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name for the leaderboard"
            className="rounded-md border border-syb-blue/40 bg-syb-black/60 px-3 py-2 font-mono text-sm text-syb-white outline-none focus:border-syb-cyan"
            maxLength={20}
          />
          <button onClick={handleSave} className="btn-syb">
            Save Score
          </button>
        </div>
      )}
      {finished && saved && (
        <p className="mt-6 text-center font-mono text-sm text-syb-cyan">
          Score saved to the leaderboard. Nice run!
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  const colors = {
    yellow: "text-syb-yellow",
    cyan: "text-syb-cyan",
    blue: "text-syb-blue-bright",
    red: "text-red-400",
  };
  return (
    <div>
      <span className="text-syb-white/50">{label}: </span>
      <span className={`font-bold ${colors[accent]}`}>{value}</span>
    </div>
  );
}

function ResultTile({ label, value }) {
  return (
    <div className="glow-border rounded-lg p-4 text-center">
      <p className="text-xs uppercase tracking-widest text-syb-white/50">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-syb-yellow">{value}</p>
    </div>
  );
}
