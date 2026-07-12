import { useEffect } from "react";

// Ambient instability: every so often, pick a random on-screen glow card and
// flicker it once. Non-looping/non-periodic on purpose — random delay each time.
export default function RandomFlicker() {
  useEffect(() => {
    let timeout;

    const scheduleNext = () => {
      const delay = 5000 + Math.random() * 9000;
      timeout = setTimeout(() => {
        const candidates = Array.from(document.querySelectorAll(".glow-border"));
        const visible = candidates.filter((el) => {
          const r = el.getBoundingClientRect();
          return r.top < window.innerHeight && r.bottom > 0;
        });
        if (visible.length) {
          const el = visible[Math.floor(Math.random() * visible.length)];
          el.classList.add("ambient-flicker");
          setTimeout(() => el.classList.remove("ambient-flicker"), 220);
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeout);
  }, []);

  return null;
}
