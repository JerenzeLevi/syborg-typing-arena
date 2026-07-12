import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLeaderboard } from "../lib/storage";
import { DIFFICULTIES } from "../data/wordPools";

export default function Leaderboard() {
  const [tab, setTab] = useState("easy");
  const entries = getLeaderboard(tab);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!bodyRef.current) return;
    const rows = bodyRef.current.querySelectorAll("tr");
    gsap.fromTo(
      rows,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
    );
  }, [tab, entries.length]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.values(DIFFICULTIES).map((d) => (
          <button
            key={d.id}
            onClick={() => setTab(d.id)}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              tab === d.id
                ? "border-syb-yellow text-syb-yellow"
                : "border-syb-blue/30 text-syb-white/60 hover:text-syb-cyan"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="glow-border overflow-hidden rounded-xl">
        <table className="w-full font-mono text-sm">
          <thead>
            <tr className="border-b border-syb-blue/30 text-left text-syb-white/50">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">{tab === "abyss" ? "Wave" : "WPM"}</th>
              <th className="px-4 py-2">Accuracy</th>
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-syb-white/40">
                  No runs yet on this difficulty. Be the first!
                </td>
              </tr>
            )}
            {entries.map((e, i) => (
              <tr
                key={i}
                className={`border-b border-syb-blue/10 transition-all duration-200 last:border-0 hover:bg-syb-cyan/5 hover:shadow-[inset_0_0_20px_rgba(0,240,255,0.15)] ${
                  i < 3 ? "bg-gradient-to-r from-syb-yellow/10 via-transparent to-transparent" : ""
                }`}
              >
                <td className="px-4 py-2 text-syb-cyan">
                  {i < 3 ? <span className="yellow-glow text-syb-yellow">#{i + 1}</span> : i + 1}
                </td>
                <td className="px-4 py-2">{e.name}</td>
                <td className="px-4 py-2 text-syb-yellow">{e.score}</td>
                <td className="px-4 py-2">{e.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
