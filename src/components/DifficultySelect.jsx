import { useState } from "react";
import gsap from "gsap";
import { DIFFICULTIES } from "../data/wordPools";
import useGSAPAnimation from "../hooks/useGSAPAnimation";
import Blob from "./Blob";

const RADII = [
  "62% 38% 55% 45% / 45% 55% 45% 55%",
  "45% 55% 40% 60% / 55% 45% 60% 40%",
  "55% 45% 62% 38% / 40% 60% 45% 55%",
  "40% 60% 45% 55% / 60% 40% 55% 45%",
];

const TIME_OPTIONS = [
  { label: "30s", value: 30 },
  { label: "60s", value: 60 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
];

export default function DifficultySelect({
  selected,
  onSelect,
  modes,
  onToggleMode,
  promptMode,
  onPromptModeChange,
  timeLimit,
  onTimeLimitChange,
}) {
  const [activationFx, setActivationFx] = useState(null); // null | "blind" | "glitch"

  const handleToggle = (key) => {
    const turningOn = !modes[key];
    onToggleMode(key);
    if (turningOn) {
      setActivationFx(key);
      setTimeout(() => setActivationFx(null), key === "glitch" ? 650 : 550);
    }
  };

  return (
    <div>
      {activationFx === "blind" && <div className="mode-fx-blackout" />}
      {activationFx === "glitch" && (
        <>
          <div className="glitch-scanlines mode-fx-scanlines" />
          <div className="glitch-tear-bands" />
          <div className="glitch-rift">
            <span className="glitch-rift-label">⚠ CORRUPTED ⚠</span>
          </div>
        </>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-syb-white/40">
          Prompt style:
        </span>
        <PromptModeToggle
          label="Words"
          active={promptMode === "words"}
          onClick={() => onPromptModeChange("words")}
        />
        <PromptModeToggle
          label="Sentences"
          active={promptMode === "sentences"}
          onClick={() => onPromptModeChange("sentences")}
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-syb-white/30">
          (Hard ignores this — always syntax)
        </span>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-syb-white/40">
          Time limit:
        </span>
        {TIME_OPTIONS.map((opt) => (
          <PromptModeToggle
            key={opt.value}
            label={opt.label}
            active={timeLimit === opt.value}
            onClick={() => onTimeLimitChange(opt.value)}
          />
        ))}
        <span className="font-mono text-[10px] uppercase tracking-widest text-syb-white/30">
          (Abyss ignores this — it's endless)
        </span>
      </div>

      {/* fluid flex layout instead of a rigid grid — cards find their own weight */}
      <div className="flex flex-wrap items-stretch justify-center gap-6">
        {Object.values(DIFFICULTIES).map((d, i) => (
          <DifficultyCard
            key={d.id}
            d={d}
            index={i}
            isSelected={selected === d.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ModeToggle
          label="Blind Mode"
          description="Prompt vanishes. Type from memory."
          icon="◐"
          color="yellow"
          active={modes.blind}
          onClick={() => handleToggle("blind")}
        />
        <ModeToggle
          label="Glitch Mode"
          description="Screen corrupts. Stay focused."
          icon="⌁"
          color="red"
          active={modes.glitch}
          onClick={() => handleToggle("glitch")}
        />
      </div>
    </div>
  );
}

function DifficultyCard({ d, index, isSelected, onSelect }) {
  const isAbyss = d.id === "abyss";
  const isHard = d.id === "hard";
  const isEasy = d.id === "easy";
  const ref = useGSAPAnimation((el) => {
    gsap.to(el, {
      scale: 1.02,
      duration: 3.2 + index * 0.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: index * 0.3,
    });
  }, []);

  return (
    <button
      ref={ref}
      onClick={() => onSelect(d.id)}
      data-reveal
      className={`glow-border relative w-56 overflow-visible p-6 text-left transition-colors ${
        isAbyss
          ? "abyss-card hover:border-red-400"
          : isHard
          ? "hover:border-orange-400"
          : isEasy
          ? "hover:border-green-400"
          : "hover:border-syb-yellow"
      } ${
        isSelected
          ? isAbyss
            ? "border-red-400 bg-red-950/20"
            : isHard
            ? "border-orange-400 bg-orange-950/20"
            : isEasy
            ? "border-green-400 bg-green-950/20"
            : "border-syb-yellow bg-syb-blue/15"
          : ""
      }`}
      style={{ borderRadius: RADII[index % RADII.length] }}
    >
      <Blob
        color={isAbyss ? "red" : isHard ? "orange" : isEasy ? "green" : "cyan"}
        size={140}
        className="absolute -right-8 -top-8 -z-10"
      />
      <p
        className={`font-mono text-lg font-bold uppercase tracking-widest ${
          isAbyss ? "text-red-400" : isHard ? "text-orange-400" : isEasy ? "text-green-400" : "text-syb-white"
        }`}
      >
        {d.label}
      </p>
      <p
        className={`mt-2 text-sm ${
          isAbyss
            ? "text-red-200/50"
            : isHard
            ? "text-orange-200/50"
            : isEasy
            ? "text-green-200/50"
            : "text-syb-white/60"
        }`}
      >
        {d.description}
      </p>
    </button>
  );
}

function ModeToggle({ label, description, icon, color, active, onClick }) {
  const theme =
    color === "red"
      ? {
          border: active ? "border-red-400" : "border-red-500/25",
          bg: active ? "bg-red-500/15" : "bg-red-500/5",
          text: active ? "text-red-300" : "text-red-300/60",
          glow: active ? "shadow-[0_0_22px_rgba(255,0,60,0.35)]" : "",
        }
      : {
          border: active ? "border-syb-yellow" : "border-syb-yellow/25",
          bg: active ? "bg-syb-yellow/15" : "bg-syb-yellow/5",
          text: active ? "text-syb-yellow" : "text-syb-yellow/60",
          glow: active ? "shadow-[0_0_22px_rgba(255,230,0,0.35)]" : "",
        };

  return (
    <button
      onClick={onClick}
      className={`group flex w-60 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${theme.border} ${theme.bg} ${theme.glow}`}
    >
      <span className={`font-mono text-2xl ${theme.text}`}>{icon}</span>
      <span className="flex-1">
        <span className={`block font-mono text-xs font-bold uppercase tracking-widest ${theme.text}`}>
          {label}
        </span>
        <span className="mt-0.5 block text-[11px] text-syb-white/45">{description}</span>
      </span>
      <span
        className={`h-5 w-9 shrink-0 rounded-full border transition-colors ${
          active ? `${theme.border} ${theme.bg}` : "border-syb-white/20 bg-syb-white/5"
        }`}
      >
        <span
          className={`block h-3.5 w-3.5 translate-y-0.5 rounded-full transition-transform duration-200 ${
            active ? `translate-x-4 ${color === "red" ? "bg-red-400" : "bg-syb-yellow"}` : "translate-x-0.5 bg-syb-white/40"
          }`}
        />
      </span>
    </button>
  );
}

function PromptModeToggle({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
        active
          ? "border-syb-cyan bg-syb-cyan/10 text-syb-cyan"
          : "border-syb-blue/30 text-syb-white/50 hover:text-syb-cyan"
      }`}
    >
      {label}
    </button>
  );
}
