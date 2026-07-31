const PARAGRAPHS = [
  "The system builder's club welcomes every freshman to campus with open arms and a promise: the skills you build here will outlast the orientation week itself. Typing fast is not about raw talent, it is about repetition, posture, and the quiet discipline of practicing every single day until your fingers know the keyboard better than your eyes do. Somewhere between the first clumsy sentence and the hundredth clean paragraph, speed simply arrives on its own.",
  "Deep inside the server room the fans spin in a low, steady hum, cooling racks of machines that never sleep. Every request that reaches this campus network travels through cables, switches, and routers before it ever becomes a webpage on your screen. Information systems, computer science, and library science students all depend on this same invisible plumbing, even if they rarely stop to think about it during a busy semester.",
  "A race condition corrupted the shared buffer between threads, and now two processes are fighting over the same block of memory. The kernel logs a warning, then a second one, then falls silent as the watchdog timer resets the whole subsystem. Somewhere in the glitching forest beyond the firewall, a signal flickers red before the connection finally stabilizes and the race can continue as if nothing happened at all.",
  "BSIS graduates often move into systems analysis and design, translating a messy real world problem into diagrams, requirements, and eventually working software. BLIS professionals do something remarkably similar with information itself, organizing knowledge so that anyone who needs it later can actually find it. Both disciplines quietly agree on one thing: structure turns chaos into something a person can use.",
  "The QWERTY keyboard layout was designed back in the eighteen seventies, long before anyone imagined a laptop, a smartphone, or a typing competition streamed live to a room full of cheering freshmen. And yet here we are, still pressing the same staggered rows of keys their inventors chose, racing paragraphs of text across a glowing screen while a little cat sprite sprints toward a finish line drawn in glitching red light.",
  "Cybersecurity protects systems from digital attacks, but the first and most important defense has always been a careful, well trained human being. Phishing emails, weak passwords, and unlocked screens cause more damage than any exotic exploit ever could. Learning to type quickly and accurately is a small skill, but it is exactly the kind of small skill that, practiced often enough, becomes a genuine competitive advantage in any technical career.",
  "Somewhere between the mossy trees and the ancient stone archways of this strange digital forest, four lanes stretch out toward a shimmering finish line. Fireflies drift lazily overhead while red glitch rifts pulse at both ends of the track, hinting that this place exists somewhere between a fairytale and a broken simulation. The cats do not seem to mind; they simply run, paw over paw, chasing the light at the end.",
  "Every keystroke you practice today becomes muscle memory tomorrow, and muscle memory is what separates someone who merely knows where the keys are from someone who can write, code, and communicate without ever looking down. Consistency beats intensity almost every time. A freshman who types a little every day for a month will out-pace a freshman who crams for one long night right before the competition begins.",
];

function seededRandom(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickParagraph(seed) {
  const rand = seed != null ? seededRandom(seed) : Math.random;
  return PARAGRAPHS[Math.floor(rand() * PARAGRAPHS.length)];
}
