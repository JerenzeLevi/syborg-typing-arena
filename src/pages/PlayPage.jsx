import { useState } from "react";
import DifficultySelect from "../components/DifficultySelect";
import TypingArena from "../components/TypingArena";
import StatsPanel from "../components/StatsPanel";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function PlayPage() {
  const [difficultyId, setDifficultyId] = useState(null);
  const [promptMode, setPromptMode] = useState("words"); // "words" | "sentences"
  const [timeLimit, setTimeLimit] = useState(60); // seconds; ignored by Abyss (endless)
  const [modes, setModes] = useState({ blind: false, glitch: false });
  const [lastEngine, setLastEngine] = useState(null);
  const ref = useGsapReveal([difficultyId]);

  const toggleMode = (key) => setModes((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div ref={ref} className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 data-reveal className="mb-8 text-center font-mono text-3xl font-bold uppercase tracking-widest text-syb-white">
        {difficultyId ? "Type." : "Choose Your Difficulty"}
      </h1>

      {!difficultyId ? (
        <DifficultySelect
          selected={difficultyId}
          onSelect={setDifficultyId}
          modes={modes}
          onToggleMode={toggleMode}
          promptMode={promptMode}
          onPromptModeChange={setPromptMode}
          timeLimit={timeLimit}
          onTimeLimitChange={setTimeLimit}
        />
      ) : (
        <>
          <TypingArena
            key={`${difficultyId}-${promptMode}-${timeLimit}`}
            difficultyId={difficultyId}
            promptMode={promptMode}
            timeLimit={timeLimit}
            modes={modes}
            onFinish={setLastEngine}
          />

          {lastEngine && (
            <div className="mt-10">
              <h2 className="mb-4 text-center font-mono text-lg uppercase tracking-widest text-syb-cyan">
                Run Analytics
              </h2>
              <StatsPanel
                wpmSamples={lastEngine.wpmSamples}
                keyErrors={lastEngine.keyErrors}
                keyHits={lastEngine.keyHits}
              />
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setDifficultyId(null);
                setLastEngine(null);
              }}
              className="btn-syb"
            >
              ← Back to Difficulty Select
            </button>
          </div>
        </>
      )}
    </div>
  );
}
