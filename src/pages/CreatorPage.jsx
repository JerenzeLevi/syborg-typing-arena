import { useGsapReveal } from "../hooks/useGsapReveal";
import MotivationEasterEgg from "../components/MotivationEasterEgg";

const GITHUB_URL = "https://github.com/JerenzeLevi";

export default function CreatorPage() {
  const ref = useGsapReveal();

  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div data-reveal className="hud-corners glow-border relative grid gap-6 rounded-xl p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
        <div className="mx-auto flex gap-3 sm:mx-0">
          <img
            src="/creator-photo-1.jpg"
            alt="Creator portrait"
            className="h-28 w-28 rounded-lg border border-syb-cyan/40 object-cover transition-all duration-300 hover:scale-105 hover:border-syb-yellow hover:shadow-[0_0_20px_rgba(255,230,0,0.35)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <img
            src="/creator-photo-2.jpg"
            alt="Creator portrait, alternate"
            className="h-28 w-28 rounded-lg border border-syb-cyan/40 object-cover transition-all duration-300 hover:scale-105 hover:border-syb-yellow hover:shadow-[0_0_20px_rgba(255,230,0,0.35)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
        <div className="text-center sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-syb-cyan/70">
            System Identity
          </p>
          <h1 className="mt-1 font-mono text-2xl font-bold uppercase tracking-widest text-syb-white sm:text-3xl">
            About the <span className="yellow-glow text-syb-yellow">Creator</span>
          </h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-widest text-syb-cyan">
            Jerenze Levi, "The Apex" · President, SYBORG Club · A.Y. 2026–2027
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-syb mt-4 inline-flex text-xs"
          >
            ★ Follow &amp; Support on GitHub
          </a>
        </div>
      </div>

      <div data-reveal className="mt-4 flex justify-center">
        <img
          src="/syborg-logo.png"
          alt="SYBORG logo"
          className="h-14 w-14 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>

      <div
        data-reveal
        className="glow-border mt-10 rounded-xl p-6 leading-relaxed text-syb-white/85 sm:p-8"
      >
        <p>
          SYBORG Typing Arena is a personal project built by{" "}
          <strong className="text-syb-yellow">Jerenze Levi</strong>, "The Apex," President of
          the <strong className="text-syb-yellow">SYBORG Club</strong> — the official club for
          CS, BLIS, and BSIS students — A.Y. 2026–2027.
        </p>
        <p className="mt-4">
          It was created for incoming freshmen who want a fun, low-pressure way to practice both{" "}
          <em>conventional typing</em> and <em>productivity-focused typing</em> — the same skills
          taught in the Office Productivity and MOS (Microsoft Office Specialist) course track
          that the creator completed personally.
        </p>
        <p className="mt-4">
          Whether you've already taken Computer courses or Office Productivity / MOS, or you're
          just starting out during orientation week, the Easy through Abyss difficulty tiers are
          designed to meet you where you are and push your speed, accuracy, and consistency from
          there. The creator is still learning and building too — practice, not perfection.
        </p>
      </div>

      <div
        data-reveal
        className="glow-border mt-6 rounded-xl p-6 leading-relaxed text-syb-white/85 sm:p-8"
      >
        <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-syb-cyan">
          Instructor Acknowledgment
        </h2>
        <p className="mt-3">
          Special thanks to{" "}
          <strong className="text-syb-yellow">Dr. Philipcris C. Encarnacion</strong>, instructor
          of the <strong>Office Productivity with MOS (Microsoft Office Specialist)</strong>{" "}
          course for the first semester of A.Y. 2026–2027, and Department Dean, whose guidance
          shaped the productivity and computer-literacy foundations behind this project.
        </p>
      </div>

      <div
        data-reveal
        className="glow-border mt-6 rounded-xl p-6 text-center leading-relaxed text-syb-white/85 sm:p-8"
      >
        <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-syb-cyan">
          Follow the Journey
        </h2>
        <p className="mt-3">
          Still learning, still building. If you'd like to support or follow along with future
          SYBORG projects, check out the GitHub profile below.
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-syb mt-4"
        >
          github.com/JerenzeLevi
        </a>
      </div>

      <div
        data-reveal
        className="mt-6 rounded-xl border border-dashed border-syb-cyan/30 p-4 text-center font-mono text-xs uppercase tracking-widest text-syb-white/40"
      >
        ⌁ a signal is hidden somewhere on this page. find it.
      </div>

      <MotivationEasterEgg />
    </div>
  );
}
