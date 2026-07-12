import { useEffect, useRef } from "react";

export default function AmbientGrid() {
  const ref = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (ref.current) {
        ref.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="circuit-bg pointer-events-none fixed inset-[-20px] z-0 transition-transform duration-200 ease-out"
    />
  );
}
