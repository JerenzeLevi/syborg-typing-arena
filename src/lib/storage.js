const LEADERBOARD_KEY = "syborg-typing:leaderboard";
const HISTORY_KEY = "syborg-typing:history";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently
  }
}

export function getLeaderboard(difficultyId) {
  const all = read(LEADERBOARD_KEY, {});
  return (all[difficultyId] || []).sort((a, b) => b.score - a.score).slice(0, 10);
}

export function addLeaderboardEntry(difficultyId, entry) {
  const all = read(LEADERBOARD_KEY, {});
  const list = all[difficultyId] || [];
  list.push({ ...entry, date: new Date().toISOString() });
  list.sort((a, b) => b.score - a.score);
  all[difficultyId] = list.slice(0, 10);
  write(LEADERBOARD_KEY, all);
  return all[difficultyId];
}

export function getHistory() {
  return read(HISTORY_KEY, []);
}

export function addHistoryEntry(entry) {
  const history = read(HISTORY_KEY, []);
  history.push({ ...entry, date: new Date().toISOString() });
  const trimmed = history.slice(-50);
  write(HISTORY_KEY, trimmed);
  return trimmed;
}
