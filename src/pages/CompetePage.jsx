import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, createRoom, joinRoom, startRoom, subscribeToRoom, fetchPlayers } from "../lib/realtime";
import { DIFFICULTIES } from "../data/wordPools";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function CompetePage() {
  const ref = useGsapReveal();
  const navigate = useNavigate();

  const [view, setView] = useState("choose"); // choose | host-form | join-form | lobby
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [difficultyId, setDifficultyId] = useState("normal");
  const [promptMode, setPromptMode] = useState("words");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [room, setRoom] = useState(null); // { code, seed, difficulty, prompt_mode, status }
  const [me, setMe] = useState(null); // player row
  const [players, setPlayers] = useState([]);

  if (!supabase) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-mono text-syb-white/60">
          Live competition isn't configured on this deployment (missing Supabase environment
          variables).
        </p>
      </div>
    );
  }

  const handleHost = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Enter a name first.");
    setBusy(true);
    setError("");
    try {
      const { code, seed, player } = await createRoom({
        hostName: name.trim(),
        difficulty: difficultyId,
        promptMode,
      });
      setRoom({ code, seed, difficulty: difficultyId, prompt_mode: promptMode, status: "lobby", host_name: name.trim() });
      setMe(player);
      setPlayers([player]);
      setView("lobby");
    } catch (err) {
      setError(err.message || "Could not create room.");
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim() || !joinCode.trim()) return setError("Enter your name and the room code.");
    setBusy(true);
    setError("");
    try {
      const { room: r, player } = await joinRoom({ code: joinCode.trim().toUpperCase(), name: name.trim() });
      setRoom(r);
      setMe(player);
      setPlayers(await fetchPlayers(r.code));
      setView("lobby");
    } catch (err) {
      setError("Room not found. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  };

  // subscribe once in the lobby: watch for new players and for the host starting the match
  useEffect(() => {
    if (view !== "lobby" || !room) return;
    const unsubscribe = subscribeToRoom(room.code, {
      onPlayers: async () => setPlayers(await fetchPlayers(room.code)),
      onRoom: (payload) => {
        if (payload.new?.status === "running") {
          navigate(`/compete/${room.code}`, {
            state: { seed: room.seed, difficulty: room.difficulty, promptMode: room.prompt_mode, me },
          });
        }
      },
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, room]);

  const isHost = me && room && me.name === room.host_name;

  const handleStart = async () => {
    await startRoom(room.code);
    navigate(`/compete/${room.code}`, {
      state: { seed: room.seed, difficulty: room.difficulty, promptMode: room.prompt_mode, me },
    });
  };

  return (
    <div ref={ref} className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 data-reveal className="mb-2 text-center font-mono text-3xl font-bold uppercase tracking-widest text-syb-white">
        Live <span className="yellow-glow text-syb-yellow">Competition</span>
      </h1>
      <p data-reveal className="mb-10 text-center text-sm text-syb-white/60">
        Host a match on one PC, share the code, race live across the room. No login needed.
      </p>

      {view === "choose" && (
        <div data-reveal className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button onClick={() => setView("host-form")} className="btn-syb flex-1">
            Host a Match
          </button>
          <button onClick={() => setView("join-form")} className="btn-syb flex-1">
            Join a Match
          </button>
        </div>
      )}

      {view === "host-form" && (
        <form onSubmit={handleHost} className="glow-border flex flex-col gap-4 rounded-xl p-6">
          <Field label="Your name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="input-syb" autoFocus />
          </Field>
          <Field label="Difficulty">
            <select value={difficultyId} onChange={(e) => setDifficultyId(e.target.value)} className="input-syb">
              {Object.values(DIFFICULTIES).map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Prompt style">
            <select value={promptMode} onChange={(e) => setPromptMode(e.target.value)} className="input-syb">
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
            </select>
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-syb">
            {busy ? "Creating…" : "Create Room"}
          </button>
        </form>
      )}

      {view === "join-form" && (
        <form onSubmit={handleJoin} className="glow-border flex flex-col gap-4 rounded-xl p-6">
          <Field label="Your name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} className="input-syb" autoFocus />
          </Field>
          <Field label="Room code">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="SYB-XXXX"
              className="input-syb font-mono tracking-widest"
            />
          </Field>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="btn-syb">
            {busy ? "Joining…" : "Join Room"}
          </button>
        </form>
      )}

      {view === "lobby" && room && (
        <div className="glow-border rounded-xl p-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-syb-white/50">Room Code</p>
          <p className="yellow-glow my-2 font-mono text-4xl font-bold tracking-widest text-syb-yellow">
            {room.code}
          </p>
          <p className="mb-6 text-sm text-syb-white/60">
            {DIFFICULTIES[room.difficulty]?.label} · {room.prompt_mode === "sentences" ? "Sentences" : "Words"}
          </p>

          <div className="mb-6 space-y-2 text-left">
            {players.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-md border border-syb-blue/20 px-3 py-2">
                <span className="font-mono text-sm text-syb-white">
                  {p.name} {p.name === room.host_name && <span className="text-syb-yellow">(host)</span>}
                </span>
                <span className="text-xs text-syb-cyan">ready</span>
              </div>
            ))}
          </div>

          {isHost ? (
            <button onClick={handleStart} className="btn-syb">
              Start Match ({players.length} joined)
            </button>
          ) : (
            <p className="font-mono text-sm text-syb-cyan animate-pulse">Waiting for host to start…</p>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-left">
      <span className="font-mono text-[10px] uppercase tracking-widest text-syb-white/50">{label}</span>
      {children}
    </label>
  );
}
