const PARAGRAPHS = [
  "The system builder's club welcomes every freshman to campus with open arms and a promise: the skills you build here will outlast the orientation week itself. Typing fast is not about raw talent, it is about repetition, posture, and the quiet discipline of practicing every single day until your fingers know the keyboard better than your eyes do. Somewhere between the first clumsy sentence and the hundredth clean paragraph, speed simply arrives on its own.",
  "Deep inside the server room the fans spin in a low, steady hum, cooling racks of machines that never sleep. Every request that reaches this campus network travels through cables, switches, and routers before it ever becomes a webpage on your screen. Information systems, computer science, and library science students all depend on this same invisible plumbing, even if they rarely stop to think about it during a busy semester.",
  "A race condition corrupted the shared buffer between threads, and now two processes are fighting over the same block of memory. The kernel logs a warning, then a second one, then falls silent as the watchdog timer resets the whole subsystem. Somewhere in the glitching forest beyond the firewall, a signal flickers red before the connection finally stabilizes and the race can continue as if nothing happened at all.",
  "BSIS graduates often move into systems analysis and design, translating a messy real world problem into diagrams, requirements, and eventually working software. BLIS professionals do something remarkably similar with information itself, organizing knowledge so that anyone who needs it later can actually find it. Both disciplines quietly agree on one thing: structure turns chaos into something a person can use.",
  "The QWERTY keyboard layout was designed back in the eighteen seventies, long before anyone imagined a laptop, a smartphone, or a typing competition streamed live to a room full of cheering freshmen. And yet here we are, still pressing the same staggered rows of keys their inventors chose, racing paragraphs of text across a glowing screen while a little cat sprite sprints toward a finish line drawn in glitching red light.",
  "Cybersecurity protects systems from digital attacks, but the first and most important defense has always been a careful, well trained human being. Phishing emails, weak passwords, and unlocked screens cause more damage than any exotic exploit ever could. Learning to type quickly and accurately is a small skill, but it is exactly the kind of small skill that, practiced often enough, becomes a genuine competitive advantage in any technical career.",
  "Somewhere between the mossy trees and the ancient stone archways of this strange digital forest, four lanes stretch out toward a shimmering finish line. Fireflies drift lazily overhead while red glitch rifts pulse at both ends of the track, hinting that this place exists somewhere between a fairytale and a broken simulation. The cats do not seem to mind; they simply run, paw over paw, chasing the light at the end.",
  "Every keystroke you practice today becomes muscle memory tomorrow, and muscle memory is what separates someone who merely knows where the keys are from someone who can write, code, and communicate without ever looking down. Consistency beats intensity almost every time. A freshman who types a little every day for a month will out-pace a freshman who crams for one long night right before the competition begins.",
  "A database query runs in the background, indexing thousands of records in milliseconds. Structured query language may look simple on the surface, but behind every SELECT statement is a system designed to retrieve truth from chaos. For BSIS and BSIT students alike, understanding data is understanding the backbone of modern technology.",
  "SyBORG is not just a club, it is a proving ground. The coolest, the sharpest, and the most driven minds gather not to compete with others, but to outgrow their former selves. Every event, every system, every line of code written under its name carries one silent message: we build, therefore we rise.",
  "Typing is not just speed, it is flow. It is the moment when your thoughts no longer wait for your hands, when ideas move faster than hesitation, when expression becomes immediate. In that moment, the keyboard disappears, and only creation remains.",
  "If you love me for what I am, for simply being me, then let that love remain unburdened by expectation. Do not love the version you hope I become, for I am still in the process of building myself, line by line, like unfinished code waiting for its final compile.",
  "A packet gets lost in transit, then another. The network retries, recalculates, reroutes. Failure is never final in a well designed system. It adapts. It recovers. It continues. Much like every student who has ever stared at an error message at two in the morning and refused to give up.",
  "Four lanes. Four minds. One finish line. The glow of the corrupted horizon flickers as each keystroke pushes your character forward. In this race, speed matters, but consistency wins. One mistake, one pause, one hesitation, and the gap widens. Stay steady. Stay focused. Keep typing.",
  "Behind every great system is a builder who refused to settle for average. That is the spirit of SyBORG. Not loud, not boastful, but undeniable. The kind of greatness that does not need to be announced because it is already evident in every output produced.",
  "Sometimes the hardest bugs are not in the code, but in the mind. Doubt, hesitation, fear of failure. Yet just like debugging, you trace it back, step by step, until clarity returns. And when it does, you realize you were never broken, only unfinished.",
  "BSIS teaches you to see the world as systems, interconnected, dependent, and dynamic. BSIT teaches you to build and maintain those systems. BLIS teaches you to preserve and organize the knowledge within them. Together, they form a triad that keeps modern society running silently in the background.",
  "The race is not always against others. Sometimes it is against the version of you that almost gave up. Every correct word you type is a step forward, not just in the game, but in becoming someone capable of finishing what they start.",
  "In the end, it was never just about typing fast. It was about discipline, identity, and the quiet realization that the smallest habits, repeated daily, build the strongest foundations. And from those foundations, systems rise, leaders emerge, and legends are written.",
  "But you can't rearrange my life. Because it pleases you. You've got to love me for what I am, for simply being me, don't love me for what you intend or hope that I will be and if you're only using me to feed your fantasy. You're really not in love so let me go, I must be free.",
  "The apartment we won't share I wonder what sad wife lives there. Have the windows deciphered her stares? Do the bricks in the walls know to hide the affairs? The dog we won't have is now one I would not choose. The daughter we won't raise still waits for you. The girl I won't be is the one that's yours. I hope you shortly find what you long for.",
  "There I was, an empty shell, just minding my own world without even knowing what love and life were all about. Then you came, brought me out of my shell, and gave the world to me. Before I knew it, there I was, so in love with you. You gave me a reason for my being, and I love what I am feeling. You gave a meaning to my life; yes, I have gone beyond existing, and it all began when I met you. I love the touch of your hair, and when I look into your eyes, I just know that I am onto something good. I am sure my love for you will endure. Your love will light up my world and take all my cares away, along with the aching part of me. You gave me a reason for my being, and I love what I am feeling. You gave a meaning to my life; yes, I have gone beyond existing, and it all began when I met you. You taught me how to love and showed me how, both today and tomorrow, my life is different from yesterday. You taught me love, darling, and I will always cherish you today, tomorrow, and forever. I am sure that when evening comes around, we will be making love like never before. My love, who could ask for more?",
  "Wise men say only fools rush in, but I cannot help falling in love with you. Shall I stay? Would it be a sin if I cannot help falling in love with you? Like a river flows surely to the sea, darling, so it goes that some things are meant to be. Take my hand and take my whole life, too, for I cannot help falling in love with you. Like a river flows surely to the sea, darling, so it goes that some things are meant to be. Take my hand and take my whole life, too, for I cannot help falling in love with you, Sarah.",
  "If I could begin to be half of what you think of me, I could do about anything, I could even learn how to love. When I see the way you act, wondering when I am coming back, I could do about anything; I could even learn how to love like you. I always thought I might be bad, and now I am sure that it is true, because I think you are so good and I am nothing like you. Look at you go; I just adore you, and I wish that I knew what makes you think I am so special.",
  "I guess mine is not the first heart broken, my eyes are not the first to cry, and I am not the first to know there is just no getting over you. You know I am just a fool who is willing to sit around and wait for you. But baby, cannot you see there is nothing else for me to do? I am hopelessly devoted to you. But now, there is nowhere to hide since you pushed my love aside. I am out of my head, hopelessly devoted to you, hopelessly devoted to you, hopelessly devoted to you. My head is saying, Fool, forget him, but my heart is saying, Don't let go; hold on to the end. That is what I intend to do, for I am hopelessly devoted to you. But now, there is nowhere to hide since you pushed my love aside. I am out of my head, hopelessly devoted to you, hopelessly devoted to you, hopelessly devoted to you.",
  "When we are out in a crowd, laughing loud, nobody knows why. When we are lost at a club, getting drunk, you give me that smile. Going home in the back of a car, your hand touches mine. When we are done making love, you look up and give me those eyes. All of the small things that you do are what remind me why I fell for you. When we are apart and I am missing you, I close my eyes, and all I see is you and the small things you do. When you call me at night while you are out getting high with your friends, every 'hi,' every 'bye,' and every 'I love you' you have ever said matters. All of the small things that you do are what remind me why I fell for you. When we are apart and I am missing you, I close my eyes, and all I see is you and the small things you do. When we are done making love, you look up and give me those eyes. All of the small things that you do are what remind me why I fell for you. When we are apart and I am missing you, I close my eyes, and all I see is you and the small things you do all the small things you do.",
  "And I know I just need one more chance to prove my love to you, and if you come back to me, I will guarantee that I will never let you go. Can we go back to the days our love was strong? Can you tell me how a perfect love goes wrong? Can somebody tell me how to get things back the way they used to be? Oh God, give me a reason, I am down on bended knee. I will never walk again until you come back to me, for I am down on bended knee.",
  "If I see you next to never, then how can we say forever? Wherever you go, whatever you do, I will be right here waiting for you. Whatever it takes or how my heart breaks, I will be right here waiting for you.",

  "Somewhere between every keystroke, I realize I am not racing to finish anymore, I am just hoping you are at the end of this sentence, waiting for me.",

  "If love were a language, I would type your name a thousand times just to make sure the world remembers how it feels to say Sarah.",

  "I used to practice typing to get faster, but now I practice just so I can write about you without ever making a mistake.",

  "Every letter I press feels softer when I am thinking of you, like even the keyboard knows I am in love.",

  "Sarah, if my words ever race ahead of me, it is only because my heart cannot wait to reach you first.",

  "I thought this was just a game, until every line started sounding like a confession I was too shy to say out loud.",

  "You are the only distraction I would gladly lose to, even in a race I was meant to win.",

  "If I could rewrite every sentence in this world, I would make sure your name appears in all the happy endings.",

  "There is something unfair about you, Sarah… how you make even the simplest words feel like they carry a heartbeat.",

  "I do not need perfect accuracy when it comes to love, but when it comes to you, I still try to get every letter right.",

  "In a world of rushing timers and racing thoughts, you are the only pause I never want to skip.",

  "I did not notice when I started smiling while typing, but I know it always happens whenever you cross my mind.",

  "Even if I lose this race, I think I already won the moment you became part of my story.",

  "Sarah, if this were just code, I would debug every mistake just to make sure I never lose you in the output.",

  "Somewhere between the first word and the last, I fell for you without even realizing it.",

  "I do not need autocorrect when I type your name, because my heart already memorized it perfectly.",

  "If I could slow down time, I would stay in the moment where I first realized you made everything feel lighter.",

  "You are not just a thought anymore, you are the reason my thoughts feel worth writing.",

  "And if this sentence never ends, I hope you know it is because I am not ready to stop loving you yet.",

  "I have read stories about love, but none of them felt as real as the quiet way you changed my world without saying a word.",

  "If this were a book, you would be the line I keep going back to, the one I never get tired of reading.",

  "Some loves arrive loudly, but you came softly, like a story that slowly becomes unforgettable.",

  "I used to think love needed grand moments, but now I know it can exist in silence, in the way you simply stay.",

  "You are the kind of person words try to reach but never fully capture.",

  "If my life were a story, everything before you would feel like a long beginning, and you would be the part where it finally makes sense.",

  "There is something gentle about loving you, something that makes the world feel calmer than it used to be.",

  "I do not wish for a dramatic love story, I only wish for a long one where every day with you feels enough.",

  "Somewhere between fiction and reality, I realized you were not just a dream, you were someone I was slowly falling for.",

  "Sarah, if love had a language beyond words, I think it would be the quiet understanding we share.",

  "You are not a fleeting feeling, you are something steady, something that stays even when everything else changes.",

  "I never believed in destiny, but meeting you felt less like chance and more like something meant to happen.",

  "If I could pause time, I would choose the moments where I am simply with you.",

  "You are not just someone I admire, you are the reason I want to become better in the gentlest way.",

  "There are stories where love is chaotic, but ours feels like turning a page and knowing you are exactly where you should be.",

  "I once searched for meaning in many things, but somehow, it found me in you.",

  "Even in another lifetime, I think I would still choose you without hesitation.",

  "You are the kind of feeling that stays even after the sentence ends.",

  "If love were written in words, I would spend my life trying to write you perfectly.",

  "And if this is only the beginning, then I already know this will be my favorite story."


];

//Some lines here came from an artist's lyrics, I don't claim any ownership of the song btw, I just include it out of my current disposition. How I felt atm of putting it.

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
