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
  const { player } = await joinRoom({ code, name: hostName });
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

export async function startRoom(code) {
  await supabase.from("rooms").update({ status: "running" }).eq("code", code);
}

export async function finishRoomIfAllDone(code) {
  const players = await fetchPlayers(code);
  if (players.length > 0 && players.every((p) => p.finished)) {
    await supabase.from("rooms").update({ status: "finished" }).eq("code", code);
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
