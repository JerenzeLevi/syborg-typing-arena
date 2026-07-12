const EASY_WORDS = [
  "byte", "code", "data", "file", "loop", "chip", "wifi", "user", "click", "type",
  "save", "open", "menu", "icon", "link", "text", "font", "page", "print", "scan",
  "mouse", "cable", "power", "email", "login", "start", "close", "paste", "share", "photo",
  "system", "laptop", "screen", "folder", "signal", "device", "backup", "portal", "modem", "browser",
];

const EASY_SENTENCES = [
  "Open the file and save your work.",
  "Click the icon to start the program.",
  "Type slowly at first, then speed up.",
  "Plug in the cable and turn on the power.",
  "Check your email before the meeting starts.",
  "The mouse and keyboard both need new batteries.",
  "Print the page and close the laptop.",
  "Share the folder with your groupmates.",
];

const NORMAL_SENTENCES = [
  "The system builder's club welcomes every freshman to campus.",
  "Practice typing every day to build real productivity skills.",
  "Good posture and finger placement improve typing speed over time.",
  "Freshmen orientation week is the perfect time to learn new habits.",
  "Office productivity tools save hours of work when used correctly.",
  "Consistency matters more than raw speed when you are learning to type.",
  "The IT department organizes several fun activities during opening week.",
  "Computer science students often practice logic before writing any code.",
  "Information systems connect people, data, and technology together.",
  "The library information science program teaches how to organize knowledge.",
  "A confident typist can finish reports and assignments much faster.",
  "SYBORG stands for the System Builder's Organization on this campus.",
  "Keyboard shortcuts can save you several minutes every single day.",
  "Accuracy first, speed second, that is the golden rule of typing.",
  "Every keystroke you practice today becomes muscle memory tomorrow.",
];

const NORMAL_WORDS = [
  ...EASY_WORDS,
  "freshman", "campus", "habits", "posture", "keystroke", "shortcut", "accuracy",
  "consistency", "orientation", "productivity", "groupmate", "report", "assignment",
];

const HARD_TERMS = [
  "algorithm", "bandwidth", "middleware", "polymorphism", "encapsulation", "asynchronous",
  "recursion", "database", "encryption", "kernel", "compiler", "framework", "repository",
  "dependency", "inheritance", "throughput", "virtualization", "microservice", "protocol",
  "authentication", "authorization", "container", "orchestration", "namespace", "abstraction",
];

const HARD_SNIPPETS = [
  "function add(a, b) { return a + b; }",
  "const users = data.filter(u => u.active);",
  "for (let i = 0; i < arr.length; i++) { total += arr[i]; }",
  "SELECT name, email FROM students WHERE year = 1;",
  "def greet(name): return f\"Hello, {name}!\"",
  "if (isValid && !isLoading) { submitForm(); }",
  "<div className=\"container\">{children}</div>",
  "git commit -m \"fix: resolve login bug\"",
  "class Robot: def __init__(self): self.power = 100",
  "npm install react-router-dom gsap",
  "public static void main(String[] args) {}",
  "const [count, setCount] = useState(0);",
  "SELECT COUNT(*) FROM orders WHERE status = 'pending';",
  "while (queue.length > 0) { process(queue.shift()); }",
  "try { await fetch(url); } catch (err) { console.error(err); }",
];

const ABYSS_TERMS = [
  ...HARD_TERMS,
  "segmentation fault", "stack overflow", "null pointer exception", "race condition",
  "deadlock detected", "buffer overflow", "memory leak", "kernel panic", "syntax error",
  "connection timeout", "access denied", "checksum mismatch", "packet loss", "core dump",
];

const ABYSS_SENTENCES = [
  "Segmentation fault: the process tried to access forbidden memory.",
  "Stack overflow detected after too many recursive calls.",
  "A race condition corrupted the shared buffer between threads.",
  "Deadlock detected: two processes are waiting on each other forever.",
  "Kernel panic — the system halted to prevent further damage.",
  "Connection timeout: the server did not respond in time.",
  "Checksum mismatch means the downloaded file may be corrupted.",
  "Access denied — you do not have permission to open this file.",
];

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    description: "Short common words. Generous timing. Great warm-up.",
    timeLimit: 60,
    accuracyFloor: 0,
    words: EASY_WORDS,
    sentences: EASY_SENTENCES,
  },
  normal: {
    id: "normal",
    label: "Normal",
    description: "Full sentences with everyday orientation vocabulary.",
    timeLimit: 60,
    accuracyFloor: 0,
    words: NORMAL_WORDS,
    sentences: NORMAL_SENTENCES,
  },
  hard: {
    id: "hard",
    label: "Hard",
    description: "CS/IT terminology and real code snippets under time pressure.",
    timeLimit: 60,
    accuracyFloor: 0,
    words: HARD_TERMS,
    sentences: HARD_SNIPPETS,
  },
  abyss: {
    id: "abyss",
    label: "Abyss",
    description: "Infinite roguelike run. Waves speed up. One crash ends it all.",
    timeLimit: null,
    accuracyFloor: 60,
    words: ABYSS_TERMS,
    sentences: ABYSS_SENTENCES,
  },
};

// mulberry32 — small deterministic PRNG so a room `seed` produces the exact
// same prompt queue on every player's device (fair races in competition mode).
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

export function getPromptQueue(difficultyId, promptMode = "words", count = 40, seed = null) {
  const diff = DIFFICULTIES[difficultyId];
  const pool = promptMode === "sentences" ? diff.sentences : diff.words;
  const rand = seed != null ? seededRandom(seed) : Math.random;
  const queue = [];
  for (let i = 0; i < count; i++) {
    queue.push(pool[Math.floor(rand() * pool.length)]);
  }
  return queue;
}
