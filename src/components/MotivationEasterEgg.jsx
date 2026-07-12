import { useState, useRef } from "react";
import GlitchText from "./GlitchText";

const CLICKS_TO_UNLOCK = 5;

export default function MotivationEasterEgg() {
  const [clicks, setClicks] = useState(0);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleClick = () => {
    setClicks((c) => {
      const next = c + 1;
      if (next >= CLICKS_TO_UNLOCK) {
        setOpen(true);
        return 0;
      }
      return next;
    });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setClicks(0), 1500);
  };

  return (
    <>
      {/* Deliberately unlabeled — a quiet signal icon, not an obvious button */}
      <button
        onClick={handleClick}
        aria-label="signal"
        className="fixed bottom-4 right-4 z-30 h-3 w-3 rounded-full bg-syb-cyan/20 transition-colors hover:bg-syb-cyan/50"
      />

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-syb-black/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="hud-corners glow-border glitching relative m-4 max-w-sm rounded-xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/motivation.jpg"
              alt=""
              className="mx-auto h-40 w-40 rounded-lg object-cover opacity-90"
            />
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-syb-white/60">
              Source of Motivation
            </p>
            <GlitchText className="mt-1 block text-lg text-syb-yellow" />
            <p className="mt-3 text-xs text-syb-white/50">
              Every line of this project owes something to her.
            </p>
            <button onClick={() => setOpen(false)} className="btn-syb mt-4 text-xs">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
