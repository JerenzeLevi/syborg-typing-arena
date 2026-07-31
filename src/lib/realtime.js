import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `SYB-${code}`;
}

export async function createRoom({ hostName, difficulty, promptMode }) {
  const code = randomCode();
  const seed = Math.floor(Math.random() * 1e9);
  const { error } = await supabase.from("rooms").insert({
    code,
    host_name: hostName,
    difficulty,
    prompt_mode: promptMode,
    seed,
  });
  if (error) throw error;
  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ room_code: code, name: hostName, is_host: true })
    .select()
    .single();
  if (playerError) throw playerError;
  return { code, seed, player };
}

export async function joinRoom({ code, name }) {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();
  if (roomError || !room) throw new Error("Room not found");

  const { data: player, error } = await supabase
    .from("players")
    .insert({ room_code: code, name })
    .select()
    .single();
  if (error) throw error;

  return { room, player };
}

export async function updateProgress(playerId, { wpm, accuracy, progress, finished }) {
  await supabase.from("players").update({ wpm, accuracy, progress, finished }).eq("id", playerId);
}

// starts a round (the first one, or the next one after a round break); always
// re-seeds the prompt sequence and clears every racer's progress from the last round
export async function startRoom(code, { raceMode = "standard" } = {}) {
  const seed = Math.floor(Math.random() * 1e9);
  await supabase.from("rooms").update({ status: "running", race_mode: raceMode, seed }).eq("code", code);
  await supabase
    .from("players")
    .update({ progress: 0, wpm: 0, accuracy: 100, finished: false })
    .eq("room_code", code)
    .eq("is_host", false);
  return { seed };
}

// host cuts a round short (e.g. one racer is way behind) — everyone freezes at
// their current progress and the room drops back to the lobby for the next round
export async function endRound(code) {
  await supabase.from("rooms").update({ status: "lobby" }).eq("code", code);
}

export async function kickPlayer(playerId) {
  await supabase.from("players").delete().eq("id", playerId);
}

export async function updatePlayerCat(playerId, catId) {
  await supabase.from("players").update({ cat_id: catId }).eq("id", playerId);
}

export async function setBlindLeaderboard(code, value) {
  await supabase.from("rooms").update({ blind_leaderboard: value }).eq("code", code);
}

export async function finishRoomIfAllDone(code) {
  const players = await fetchPlayers(code);
  const racers = players.filter((p) => !p.is_host);
  if (racers.length > 0 && racers.every((p) => p.finished)) {
    await supabase.from("rooms").update({ status: "lobby" }).eq("code", code);
  }
}

export function subscribeToRoom(code, { onPlayers, onRoom }) {
  const channel = supabase
    .channel(`room:${code}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players", filter: `room_code=eq.${code}` },
      onPlayers
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms", filter: `code=eq.${code}` },
      onRoom
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export async function fetchPlayers(code) {
  const { data } = await supabase.from("players").select("*").eq("room_code", code).order("joined_at");
  return data || [];
}
