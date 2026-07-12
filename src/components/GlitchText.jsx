import { useEffect, useState } from "react";

const GLITCH_CHARS = "!@#$%&*01{}<>?/\\|";

// Obfuscated as char codes so the plain string never appears in source/devtools search.
const CODES = [
  83, 97, 114, 97, 104, 32, 71, 46, 32, 71, 105, 97, 109, 97, 116,
];
const REVEAL = () => String.fromCharCode(...CODES);

function scramble(str) {
  return str
    .split("")
    .map((c) => (c === " " ? " " : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]))
    .join("");
}

// Renders a name that is never fully legible for more than a couple of characters
// at once — most characters stay scrambled, only a rotating 1-2 char window
// resolves briefly, so it can't be screenshotted or read at a glance.
export default function GlitchText({ className }) {
  const real = REVEAL();
  const [display, setDisplay] = useState(() => scramble(real));

  useEffect(() => {
    const interval = setInterval(() => {
      const revealIndex = Math.floor(Math.random() * real.length);
      const chars = scramble(real).split("");
      if (real[revealIndex] !== " ") chars[revealIndex] = real[revealIndex];
      setDisplay(chars.join(""));
    }, 90);
    return () => clearInterval(interval);
  }, [real]);

  return (
    <span className={`glitch-chroma font-mono tracking-widest ${className || ""}`}>
      {display}
    </span>
  );
}
