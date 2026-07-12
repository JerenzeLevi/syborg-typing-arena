import Leaderboard from "../components/Leaderboard";
import { useGsapReveal } from "../hooks/useGsapReveal";

export default function LeaderboardPage() {
  const ref = useGsapReveal();
  return (
    <div ref={ref} className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 data-reveal className="mb-8 text-center font-mono text-3xl font-bold uppercase tracking-widest text-syb-white">
        Leaderboard
      </h1>
      <div data-reveal>
        <Leaderboard />
      </div>
    </div>
  );
}
