import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { updateProgress, subscribeToRoom, fetchPlayers, finishRoomIfAllDone } from "../lib/realtime";

export default function LiveMatchPage() {
  const { code } = useParams();
  const location = useLocation();
  const { seed, difficulty, promptMode, me } = location.state || {};

  const engine = useTypingEngine(difficulty, { promptMode, seed });
  const [players, setPlayers] = useState([]);
  const startedRef = useRef(false);
  const reportedFinishRef = useRef(false);

  useEffect(() => {
    if (!difficulty || startedRef.current) return;
    startedRef.current = true;
    engine.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    if (!code) return;
    fetchPlayers(code).then(setPlayers);
    const unsubscribe = subscribeToRoom(code, {
      onPlayers: async () => setPlayers(await fetchPlayers(code)),
      onRoom: () => {},
    });
    return unsubscribe;
  }, [code]);

  // broadcast this player's progress to the room, throttled to every keystroke batch (~cheap)
  useEffect(() => {
    if (!me || engine.status !== "running") return;
    updateProgress(me.id, {
      wpm: engine.finalWpm,
      accuracy: engine.accuracy,
      progress: engine.totalCharsTyped,
      finished: false,
    });
  }, [engine.totalCharsTyped, engine.status, me, engine.finalWpm, engine.accuracy]);

  useEffect(() => {
    if (!me || reportedFinishRef.current) return;
    if (engine.status === "finished" || engine.status === "crashed") {
      reportedFinishRef.current = true;
      updateProgress(me.id, {
        wpm: engine.finalWpm,
        accuracy: engine.accuracy,
        progress: engine.totalCharsTyped,
        finished: true,
      }).then(() => finishRoomIfAllDone(code));
    }
  }, [engine.status, me, code, engine.finalWpm, engine.accuracy, engine.totalCharsTyped]);

  if (!difficulty || !me) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-syb-white/60">
          This match session was lost (probably from a page refresh). Live matches don't survive
          a reload yet.
        </p>
        <Link to="/compete" className="btn-syb mt-6 inline-flex">
          Back to Compete
        </Link>
      </div>
    );
  }

  const finished = engine.status === "finished" || engine.status === "crashed";
  const ranked = [...players].sort((a, b) => (b.progress || 0) - (a.progress || 0));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-center font-mono text-2xl font-bold uppercase tracking-widest text-syb-white">
        Room <span className="text-syb-yellow">{code}</span>
      </h1>

      <div className="mb-8 space-y-2">
        {ranked.map((p, i) => (
          <div key={p.id} className="glow-border flex items-center gap-3 rounded-lg px-4 py-2">
            <span className={`w-6 font-mono text-sm ${i === 0 ? "text-syb-yellow" : "text-syb-cyan"}`}>
              #{i + 1}
            </span>
            <span className="w-28 truncate font-mono text-sm text-syb-white">
              {p.name} {p.id === me.id && "(you)"}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-syb-black/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-syb-cyan to-syb-yellow transition-all duration-300"
                style={{ width: `${Math.min(100, (p.progress / 400) * 100)}%` }}
              />
            </div>
            <span className="w-14 text-right font-mono text-xs text-syb-white/60">{p.wpm} wpm</span>
            {p.finished && <span className="text-xs text-syb-yellow">✓</span>}
          </div>
        ))}
      </div>

      <div className="glow-border relative min-h-[140px] rounded-xl p-6 font-mono text-xl leading-relaxed sm:text-2xl">
        {!finished ? (
          <>
            {engine.currentPrompt.split("").map((ch, i) => {
              if (i < engine.typed.length) {
                return (
                  <span key={i} className={engine.typed[i] === ch ? "char-correct" : "char-incorrect"}>
                    {ch}
                  </span>
                );
              }
              return (
                <span key={i} className={i === engine.typed.length ? "char-current" : "char-pending"}>
                  {ch}
                </span>
              );
            })}
          </>
        ) : (
          <p className="yellow-glow text-center text-2xl font-bold text-syb-yellow">
            {engine.status === "crashed" ? "SYSTEM CRASH" : "FINISHED"} — {engine.finalWpm} WPM
          </p>
        )}
      </div>

      {!finished && (
        <input
          value={engine.typed}
          onChange={(e) => engine.handleInput(e.target.value)}
          className="input-syb mt-4 w-full text-lg"
          placeholder="Start typing here…"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      )}

      {finished && (
        <div className="mt-6 text-center">
          <Link to="/compete" className="btn-syb">
            Back to Compete
          </Link>
        </div>
      )}
    </div>
  );
}
