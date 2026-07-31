// Drop meow-start.mp3 and meow-finish.mp3 into public/sounds/ — nothing else to wire up.
export function playSound(path) {
  try {
    const audio = new Audio(path);
    audio.play().catch(() => {});
  } catch {
    // ignore — audio isn't available in this environment
  }
}
