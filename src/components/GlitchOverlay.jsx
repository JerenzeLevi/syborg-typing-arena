import { useEffect, useState } from "react";

export default function GlitchOverlay({ active }) {
  const [rift, setRift] = useState(false);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setRift(true);
      setTimeout(() => setRift(false), 260);
    }, 2600);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;
  return (
    <>
      <div className="glitch-scanlines" />
      <div className="glitch-tear-bands" />
      <div className="pointer-events-none fixed inset-0 z-40 mix-blend-screen">
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-syb-blue/15 via-transparent to-red-500/10" />
      </div>
      {rift && (
        <div className="glitch-rift">
          <span className="glitch-rift-label">⚠ CORRUPTED ⚠</span>
        </div>
      )}
    </>
  );
}
