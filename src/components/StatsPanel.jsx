const KEYBOARD_ROWS = [
  "1234567890",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

function wpmPath(samples, width, height) {
  if (samples.length < 2) return "";
  const maxWpm = Math.max(...samples.map((s) => s.wpm), 20);
  const stepX = width / (samples.length - 1);
  return samples
    .map((s, i) => {
      const x = i * stepX;
      const y = height - (s.wpm / maxWpm) * height;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function consistencyScore(samples) {
  if (samples.length < 2) return 100;
  const values = samples.map((s) => s.wpm);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const score = Math.max(0, 100 - (stdDev / (mean || 1)) * 100);
  return Math.round(score);
}

export default function StatsPanel({ wpmSamples = [], keyErrors = {}, keyHits = {} }) {
  const width = 320;
  const height = 100;
  const path = wpmPath(wpmSamples, width, height);
  const consistency = consistencyScore(wpmSamples);

  const maxErrorRate = Math.max(
    ...Object.keys(keyHits).map((k) => (keyErrors[k] || 0) / keyHits[k]),
    0.01
  );

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="glow-border rounded-xl p-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-syb-cyan">
          WPM Over Time
        </h3>
        <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full">
          <path d={path} fill="none" stroke="#ffd400" strokeWidth="2" />
        </svg>
        <p className="mt-2 font-mono text-xs text-syb-white/60">
          Consistency Score: <span className="text-syb-yellow">{consistency}</span>
        </p>
      </div>

      <div className="glow-border rounded-xl p-4">
        <h3 className="font-mono text-sm uppercase tracking-widest text-syb-cyan">
          Weak-Key Heatmap
        </h3>
        <div className="mt-3 space-y-1">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.split("").map((key) => {
                const hits = keyHits[key] || 0;
                const errors = keyErrors[key] || 0;
                const rate = hits ? errors / hits : 0;
                const intensity = Math.min(1, rate / maxErrorRate);
                return (
                  <span
                    key={key}
                    title={`${key}: ${errors}/${hits} errors`}
                    className="flex h-7 w-7 items-center justify-center rounded font-mono text-xs uppercase text-syb-black"
                    style={{
                      backgroundColor:
                        hits === 0
                          ? "rgba(245,247,255,0.12)"
                          : `rgba(255, ${Math.round(212 - intensity * 150)}, ${Math.round(
                              77 - intensity * 77
                            )}, ${0.35 + intensity * 0.65})`,
                      color: hits === 0 ? "rgba(245,247,255,0.4)" : "#05070d",
                    }}
                  >
                    {key}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
