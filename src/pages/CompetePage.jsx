import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  supabase,
  createRoom,
  joinRoom,
  startRoom,
  subscribeToRoom,
  fetchPlayers,
  updatePlayerCat,
  kickPlayer,
} from "../lib/realtime";
import { DIFFICULTIES } from "../data/wordPools";
import { CATS } from "../data/cats";
import CatRaceTrack from "../components/CatRaceTrack";
import { useGsapReveal } from "../hooks/useGsapReveal";

const CAT_RACE_MAX_PLAYERS = 4;

export default function CompetePage() {
  const ref = useGsapReveal();
  const navigate = useNavigate();

  const [view, setView] = useState("choose"); // choose | host-form | join-form | lobby
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [difficultyId, setDifficultyId] = useState("normal");
  const [promptMode, setPromptMode] = useState("words");
  const [raceModeChoice, setRaceModeChoice] = useState("cat_race");
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
      setRoom({
        code,
        seed,
        difficulty: difficultyId,
        prompt_mode: promptMode,
        status: "lobby",
        host_name: name.trim(),
      });
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
            state: {
              seed: payload.new.seed,
              difficulty: room.difficulty,
              promptMode: room.prompt_mode,
              raceMode: payload.new.race_mode,
              me,
            },
          });
        }
      },
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, room]);

  const isHost = me && room && me.name === room.host_name;
  const racers = players.filter((p) => !p.is_host);
  const canChooseCatRace = racers.length > 0 && racers.length <= CAT_RACE_MAX_PLAYERS;
  const isCatRace = canChooseCatRace && raceModeChoice === "cat_race";

  const handleStart = async () => {
    const raceMode = canChooseCatRace ? raceModeChoice : "standard";
    const { seed } = await startRoom(room.code, { raceMode });
    navigate(`/compete/${room.code}`, {
      state: {
        seed,
        difficulty: room.difficulty,
        promptMode: room.prompt_mode,
        raceMode,
        me,
      },
    });
  };

  const handleKick = async (playerId) => {
    await kickPlayer(playerId);
    setPlayers(await fetchPlayers(room.code));
  };

  const handlePickCat = async (catId) => {
    if (!me) return;
    await updatePlayerCat(me.id, catId);
    setMe((m) => ({ ...m, cat_id: catId }));
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
              <option value="paragraph">Paragraph</option>
            </select>
          </Field>
          <p className="text-xs text-syb-white/50">
            With 2-4 players you'll choose Cat Race or Standard mode in the lobby. 5+ players always
            runs Standard Tournament mode. As host you spectate — you won't be racing. Rounds have no
            fixed timer: end a round anytime (e.g. if someone's way behind), kick a player, and start
            the next round from the lobby.
          </p>
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
                  {p.name} {p.is_host && <span className="text-syb-yellow">(host — spectating)</span>}
                </span>
                <div className="flex items-center gap-2">
                  {!p.is_host && (
                    <span className="text-xs text-syb-cyan">
                      {p.cat_id ? CATS.find((c) => c.id === p.cat_id)?.label : "picking cat…"}
                    </span>
                  )}
                  {isHost && !p.is_host && (
                    <button
                      type="button"
                      onClick={() => handleKick(p.id)}
                      title={`Remove ${p.name}`}
                      className="font-mono text-xs text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isHost && (
            <div className="mb-6 text-left">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-syb-white/50">
                Race mode
              </p>
              {canChooseCatRace ? (
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
              ) : (
                <p className="rounded-md border border-syb-blue/20 px-3 py-4 text-center text-xs text-syb-white/60">
                  5+ racers joined — Standard Tournament Mode will run instead of the cat race.
                </p>
              )}
            </div>
          )}

          {!isHost && !me?.is_host && (
            <div className="mb-6 text-left">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-syb-white/50">
                Pick your racer
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {CATS.map((cat) => {
                  const claimedBy = racers.find((p) => p.cat_id === cat.id);
                  const claimedByMe = claimedBy?.id === me?.id;
                  const disabled = claimedBy && !claimedByMe;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => handlePickCat(cat.id)}
                      title={claimedBy ? `${claimedBy.name}${claimedByMe ? " (you)" : ""}` : cat.label}
                      className={`flex flex-col items-center gap-1 rounded-md border px-1 py-2 transition-colors ${
                        claimedByMe
                          ? "border-syb-yellow bg-syb-yellow/10"
                          : disabled
                          ? "cursor-not-allowed border-syb-blue/10 opacity-30"
                          : "border-syb-blue/20 hover:border-syb-cyan"
                      }`}
                    >
                      <img src={cat.file} alt={cat.label} className="h-10 w-auto object-contain" draggable={false} />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-syb-white/70">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isHost && isCatRace && (
            <div className="mb-6 text-left">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-syb-white/50">
                Track preview (spectate)
              </p>
              <CatRaceTrack
                racers={racers.map((p) => ({ id: p.id, name: p.name, catId: p.cat_id, progress: 0 }))}
              />
            </div>
          )}

          {isHost ? (
            <button onClick={handleStart} className="btn-syb">
              Start Match ({racers.length} joined)
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
