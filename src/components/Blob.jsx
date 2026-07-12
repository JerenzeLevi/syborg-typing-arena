import useGSAPAnimation from "../hooks/useGSAPAnimation";
import gsap from "gsap";

const VARIANTS = {
  cyan: "rgba(0, 240, 255, 0.35)",
  yellow: "rgba(255, 230, 0, 0.28)",
  purple: "rgba(122, 0, 255, 0.3)",
  red: "rgba(255, 0, 60, 0.32)",
};

// A continuously morphing, breathing SVG blob used as ambient decoration —
// not decorative-once, it keeps drifting/scaling for as long as it's mounted.
export default function Blob({ color = "cyan", size = 320, className = "" }) {
  const ref = useGSAPAnimation((el) => {
    gsap.to(el, {
      scale: 1.15,
      rotation: 12,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    const path = el.querySelector("path");
    gsap.to(path, {
      attr: {
        d: "M45,-65C58,-55,68,-40,72,-23C76,-6,74,13,65,30C56,47,40,62,21,70C2,78,-20,79,-40,71C-60,63,-78,46,-84,25C-90,4,-84,-21,-70,-40C-56,-59,-34,-72,-11,-76C12,-80,32,-75,45,-65Z",
      },
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      className={`pointer-events-none blur-2xl ${className}`}
      style={{ filter: "blur(28px)" }}
    >
      <path
        fill={VARIANTS[color] || VARIANTS.cyan}
        d="M40,-60C60,-50,80,-30,85,-10C90,10,80,30,65,45C50,60,30,70,10,75C-10,80,-30,75,-50,65C-70,55,-90,40,-95,20C-100,0,-90,-25,-70,-45C-50,-65,-25,-80,0,-80C25,-80,50,-70,40,-60Z"
      />
    </svg>
  );
}
