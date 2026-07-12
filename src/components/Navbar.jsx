import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/play", label: "Play" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/compete", label: "Compete" },
  { to: "/creator", label: "About the Creator" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`navbar-el sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-syb-cyan/40 bg-syb-black/95 backdrop-blur-lg"
          : "border-syb-blue/20 bg-syb-black/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/syborg-logo.png"
            alt="SYBORG logo"
            className="h-9 w-9 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span className="font-mono text-lg font-bold tracking-widest text-syb-white">
            SYBORG<span className="text-syb-yellow">.</span>TYPE
          </span>
        </NavLink>

        <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest sm:gap-2 sm:text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link relative rounded-md px-2 py-2 transition-colors sm:px-3 ${
                  isActive ? "nav-link-active text-syb-yellow" : "text-syb-white/70 hover:text-syb-cyan"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
