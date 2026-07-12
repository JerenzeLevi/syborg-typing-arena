import { useEffect, useState } from "react";

const LOG_LINES = [
  "injecting input stream...",
  "recalibrating interface...",
  "latency spike detected...",
  "syncing keystroke buffer...",
  "thermal levels nominal...",
  "signal integrity check ok...",
];

export default function SystemStatus() {
  const [status, setStatus] = useState("STABLE");
  const [log, setLog] = useState(LOG_LINES[0]);
  const [logVisible, setLogVisible] = useState(true);

  useEffect(() => {
    const update = () => {
      if (document.body.classList.contains("syb-glitch-active")) setStatus("COMPROMISED");
      else if (document.body.classList.contains("syb-blind-active")) setStatus("DEGRADED");
      else setStatus("STABLE");
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogVisible(false);
      setTimeout(() => {
        setLog(LOG_LINES[Math.floor(Math.random() * LOG_LINES.length)]);
        setLogVisible(true);
      }, 300);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    STABLE: "text-syb-cyan",
    DEGRADED: "text-syb-yellow",
    COMPROMISED: "text-red-400",
  };

  return (
    <div className="pointer-events-none fixed left-3 top-16 z-40 font-mono text-[10px] uppercase tracking-widest sm:left-4">
      <p className="text-syb-white/40">
        SYSTEM: <span className={colors[status]}>{status}</span>
      </p>
      <p
        className={`mt-0.5 text-syb-white/25 transition-opacity duration-300 ${
          logVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        &gt; {log}
      </p>
    </div>
  );
}
