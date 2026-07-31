import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useTypingEngine } from "../hooks/useTypingEngine";
import {
  updateProgress,
  subscribeToRoom,
  fetchPlayers,
  finishRoomIfAllDone,
  setBlindLeaderboard,
  endRound,
  startRoom,
  kickPlayer,
} from "../lib/realtime";
import { playSound } from "../lib/sound";
import CatRaceTrack from "../components/CatRaceTrack";

const CAT_RACE_MAX_PLAYERS = 4;

export default function LiveMatchPage() {
  const { code } = useParams();
  const location = useLocation();
  const initial = location.state || {};
  const { difficulty, promptMode, me } = initial;
  const isHost = !!me?.is_host;

  const [seed, setSeed] = useState(initial.seed);
  const [raceMode, setRaceMode] = useState(initial.raceMode);
  const [raceModeChoice, setRaceModeChoice] = useState(initial.raceMode || "cat_race");
  const isCatRace = raceMode === "cat_race";

  const engine = useTypingEngine(difficulty, {
    promptMode: isCatRace ? "paragraph" : promptMode,
    seed,
    timeLimit: "none",
  });
  const [players, setPlayers] = useState([]);
  const [roomStatus, setRoomStatus] = useState("running");
  const [blind, setBlind] = useState(false);
  const reportedFinishRef = useRef(false);
  const finishSoundPlayedRef = useRef(false);

  const roundActive = roomStatus === "running";

  // (re)start the typing engine for this player at the top of every round
  useEffect(() => {
    if (isHost || !difficulty || !roundActive) return;
    reportedFinishRef.current = false;
    finishSoundPlayedRef.current = false;
    engine.start();
    playSound("/sounds/meow-start.mp3");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty, isHost, roundActive, seed]);

  useEffect(() => {
    if (!code) return;
    fetchPlayers(code).then(setPlayers);
    const unsubscribe = subscribeToRoom(code, {
      onPlayers: async () => setPlayers(await fetchPlayers(code)),
      onRoom: (payload) => {
        if (payload.new?.status) setRoomStatus(payload.new.status);
        if (payload.new?.seed != null) setSeed(payload.new.seed);
        if (payload.new?.race_mode) setRaceMode(payload.new.race_mode);
        if (typeof payload.new?.blind_leaderboard === "boolean") setBlind(payload.new.blind_leaderboard);
      },
    });
    return unsubscribe;
  }, [code]);

  // broadcast this player's progress to the room, throttled to every keystroke batch (~cheap)
  useEffect(() => {
    if (!me || isHost || !roundActive || engine.status !== "running") return;
    updateProgress(me.id, {
      wpm: engine.finalWpm,
      accuracy: engine.accuracy,
      progress: engine.totalCharsTyped,
      finished: false,
    });
  }, [engine.totalCharsTyped, engine.status, me, isHost, roundActive, engine.finalWpm, engine.accuracy]);

  useEffect(() => {
    if (!me || isHost || !roundActive || reportedFinishRef.current) return;
    if (engine.status === "finished" || engine.status === "crashed") {
      reportedFinishRef.current = true;
      updateProgress(me.id, {
        wpm: engine.finalWpm,
        accuracy: engine.accuracy,
        progress: engine.totalCharsTyped,
        finished: true,
      }).then(() => finishRoomIfAllDone(code));
    }
  }, [engine.status, me, isHost, roundActive, code, engine.finalWpm, engine.accuracy, engine.totalCharsTyped]);

  useEffect(() => {
    if (isHost || !roundActive || finishSoundPlayedRef.current) return;
    if (engine.status === "finished" || engine.status === "crashed") {
      finishSoundPlayedRef.current = true;
      playSound("/sounds/meow-finish.mp3");
    }
  }, [engine.status, isHost, roundActive]);

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
  const racers = players.filter((p) => !p.is_host);
  const ranked = [...racers].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  const paragraphLength = engine.currentPrompt.length || 1;
  const canChooseCatRace = racers.length > 0 && racers.length <= CAT_RACE_MAX_PLAYERS;

  const handleKick = async (playerId) => {
    await kickPlayer(playerId);
  };

  const handleStartNextRound = async () => {
    const nextRaceMode = canChooseCatRace ? raceModeChoice : "standard";
    await startRoom(code, { raceMode: nextRaceMode });
  };

  const board = isCatRace ? (
    <div className="mb-8">
      <CatRaceTrack
        racers={racers.slice(0, CAT_RACE_MAX_PLAYERS).map((p) => ({
          id: p.id,
          name: p.id === me.id ? `${p.name} (you)` : p.name,
          catId: p.cat_id,
          progress: (p.progress || 0) / paragraphLength,
        }))}
      />
    </div>
  ) : (
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
  );

  if (isHost) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-center font-mono text-2xl font-bold uppercase tracking-widest text-syb-white">
          Spectating Room <span className="text-syb-yellow">{code}</span>
        </h1>
        <p className="mb-6 text-center text-sm text-syb-white/60">
          {roundActive
            ? "Race in progress — you're watching, not racing."
            : "Round ended — review results, remove anyone you'd like, then start the next round."}
        </p>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setBlindLeaderboard(code, !blind)} className="btn-syb">
            {blind ? "Reveal Leaderboards" : "Blind Leaderboards"}
          </button>
          {roundActive && (
            <button type="button" onClick={() => endRound(code)} className="btn-syb">
              End Round
            </button>
          )}
        </div>

        <div className={blind ? "pointer-events-none blur-md select-none" : ""}>{board}</div>

        {!roundActive && (
          <div className="mt-8 glow-border rounded-xl p-6 text-left">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-syb-white/50">
              Racers ({racers.length})
            </p>
            <div className="mb-6 space-y-2">
              {racers.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md border border-syb-blue/20 px-3 py-2">
                  <span className="font-mono text-sm text-syb-white">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => handleKick(p.id)}
                    title={`Remove ${p.name}`}
                    className="font-mono text-xs text-red-400 hover:text-red-300"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>

            {canChooseCatRace ? (
              <div className="mb-6">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-syb-white/50">
                  Next round mode
                </p>
                <div className="flex gap-2">
                  {[
                    { value: "cat_race", label: "Cat Race" },
                    { value: "standard", label: "Standard" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRaceModeChoice(opt.value)}
                      className={`flex-1 rounded-md border px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                        raceModeChoice === opt.value
                          ? "border-syb-yellow bg-syb-yellow/10 text-syb-yellow"
                          : "border-syb-blue/20 text-syb-white/60 hover:border-syb-cyan"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mb-6 rounded-md border border-syb-blue/20 px-3 py-4 text-center text-xs text-syb-white/60">
                5+ racers — next round will run Standard Tournament Mode.
              </p>
            )}

            <button
              type="button"
              onClick={handleStartNextRound}
              disabled={racers.length === 0}
              className="btn-syb w-full"
            >
              Start Next Round
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/compete" className="btn-syb">
            Back to Compete
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-center font-mono text-2xl font-bold uppercase tracking-widest text-syb-white">
        Room <span className="text-syb-yellow">{code}</span>
      </h1>

      {board}

      {roundActive ? (
        <>
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
        </>
      ) : (
        <div className="mt-4 text-center">
          <p className="font-mono text-sm text-syb-cyan animate-pulse">
            Round ended — waiting for the host to start the next round…
          </p>
          <Link to="/compete" className="btn-syb mt-6 inline-flex">
            Back to Compete
          </Link>
        </div>
      )}
    </div>
  );
}
