import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "../hooks/useGsapReveal";
import Blob from "../components/Blob";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: "CS/IT-Themed Prompts",
    body: "Practice on real code snippets, CS/IT terminology, and orientation vocabulary instead of generic filler sentences.",
  },
  {
    title: "Abyss: Infinite Mode",
    body: "A roguelike endless run with escalating waves, combo multipliers, glitch events, and a system-crash ending.",
  },
  {
    title: "Blind & Glitch Modes",
    body: "Toggle blind typing (from memory) or glitch distortion on top of any difficulty for an extra challenge.",
  },
  {
    title: "Skill Breakdown",
    body: "Post-run WPM graph, weak-key heatmap, and a consistency score to see exactly where to improve.",
  },
];

export default function HomePage() {
  const ref = useGsapReveal();
  const featuresRef = useRef(null);

  // scroll-scrubbed entrance (tied to scroll position, not a one-shot reveal)
  useEffect(() => {
    if (!featuresRef.current) return;
    const cards = featuresRef.current.querySelectorAll(".feature-card");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 100, opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 55%",
              scrub: true,
            },
          }
        );
      });
    }, featuresRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref}>
      <section className="circuit-bg relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-syb-navy/40 via-transparent to-syb-black" />
        <Blob color="purple" size={420} className="absolute -left-32 top-10 -z-10" />
        <Blob color="cyan" size={360} className="absolute -right-24 bottom-0 -z-10" />
        <div className="relative">
          <img
            src="/syborg-logo.png"
            alt="SYBORG logo"
            data-reveal
            className="magnetic mx-auto mb-6 h-28 w-28 animate-[float_5s_ease-in-out_infinite] drop-shadow-[0_0_28px_rgba(0,240,255,0.55)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h1
            data-reveal
            className="hero-scanline relative font-mono text-4xl font-black uppercase tracking-widest text-syb-white sm:text-6xl"
          >
            SYBORG <span className="yellow-glow animate-[flicker_3.5s_ease-in-out_infinite] text-syb-yellow">Typing</span> Arena
          </h1>
          <p data-reveal className="mx-auto mt-5 max-w-xl text-syb-white/70">
            A techy, CS/IT-themed typing game built for CS, IT, BLIS &amp; BSIS freshmen
            orientation. No login, no install — just open and type.
          </p>
          <div data-reveal className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/play" className="btn-syb">
              Start Typing
            </Link>
            <Link
              to="/creator"
              className="btn-syb"
              style={{ borderColor: "rgba(255,212,0,0.5)" }}
            >
              Meet the Creator
            </Link>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-mono text-2xl font-bold uppercase tracking-widest text-syb-cyan">
          Why It's Different
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="feature-card glow-border relative w-64 p-6"
              style={{
                borderRadius:
                  i % 2 === 0
                    ? "55% 45% 62% 38% / 45% 55% 45% 55%"
                    : "40% 60% 45% 55% / 60% 40% 55% 45%",
              }}
            >
              <h3 className="font-mono text-lg font-bold text-syb-yellow">{f.title}</h3>
              <p className="mt-2 text-sm text-syb-white/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
