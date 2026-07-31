import { getCat } from "../data/cats";

// Tuned by eye against public/image.jpg (4-lane forest track, red glitch rifts
// mark the start on the left and the finish on the right). Nudge these percentages
// after viewing the real render if a cat looks off the lane line.
const START_X = 15; // just right of the left glitch rift
const FINISH_X = 86; // just before the right glitch rift
const LANE_Y = [22, 47, 72, 97]; // vertical center of each of the 4 lanes, top-to-bottom

export default function CatRaceTrack({ racers = [], className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-xl ${className}`}>
      <img src="/image.jpg" alt="" className="block w-full select-none" draggable={false} />
      {racers.slice(0, 4).map((racer, lane) => {
        if (!racer) return null;
        const cat = getCat(racer.catId);
        if (!cat) return null;
        const progress = Math.min(1, Math.max(0, racer.progress || 0));
        const left = START_X + progress * (FINISH_X - START_X);
        const running = progress > 0 && progress < 1;
        return (
          <div
            key={racer.id ?? lane}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-[left] duration-300 ease-out"
            style={{ left: `${left}%`, top: `${LANE_Y[lane]}%` }}
          >
            <span className="mb-1 max-w-[4.5rem] truncate rounded bg-syb-black/70 px-1.5 py-0.5 font-mono text-[10px] text-syb-white">
              {racer.name}
            </span>
            <img
              src={cat.file}
              alt={cat.label}
              draggable={false}
              className={`h-10 w-auto select-none drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] sm:h-14 ${
                running ? "animate-cat-run" : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
