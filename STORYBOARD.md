# P(doom)を上げてく: anime OP remake of "I'm Upping My P(doom)"

## The idea (one line)
An anime OP for a show that doesn't exist: **Neon Genesis Singularity**. The idol is Claude (クロード),
and the Singularity is staged as Human Instrumentality. The world goes LCL orange, which is Claude orange.

Why this works for SF tech Twitter: Evangelion is already how that crowd talks about AI.
"Get in the robot, Shinji", Gendo pose, "What did Ilya see", the "Congratulations" clapping ending.
All of those are ready-made visual references. The orange LCL sea being *Claude's brand color* is the
joke that ties them together, and it doesn't need explaining.

## Look: "riso-cel"
Every frame is printed on paper: riso spot inks, misregistration, halftone screentone, grain, lines that boil on twos.
- Seedance/Seedream footage is **never shown raw**. A WebGL "rotoscope" pass redraws it:
  XDoG ink lines + Kuwahara flat cels + nearest-ink palette mapping + halftone shadows + paper.
  The base provides motion, anatomy and lip shapes; the viewer sees only ink and paper.
- Inks (the whole video uses only these): PAPER #F1ECE1 · INK #1B1714 · CLAUDE #D97757 · LCL #F08A24
  · RISO BLUE #1D5FD1 · FLUORO PINK #FF4F9A · ALARM #E8322B (final act only).
- Type: condensed Mincho (EVA title cards, Japanese), heavy condensed grotesk (English lyric hits),
  mono (terminal / HUD / brutalist inserts).

## Attention devices
- **Opening hook**: the first frame is already a lyric at full-screen size, over the ✻ spark in her eye.
- **Persistent HUD**: the year counter (top-left) accelerates across the song, from months per bar to
  years per beat to 20XX to ∞. P(doom) meter (top-right) steps 8 → 34 → 61 → 86 → 99.9 → ERR.
- **Point dance**: every chorus repeats the same "finger up" gesture on "P(doom)", like a K-pop
  signature move.
- **Lyric scale varies**: FULLSCREEN (hooks and choruses) / SIDE (character right, text left) / SUBTITLE (breakdown).
- **Cut rate follows the energy curve**: cuts get faster from verse 3, the breakdown drops to a slow float, and the
  outro montage cuts on every beat.
- **EVA title cards** mark section breaks. White Mincho on black is readable at thumbnail size.

## Grid
132.5 BPM, beat = 0.4528 s, first beat 0.306 s, bar = 1.811 s.

## Shot list  (SD = Seedance base, IMG = Seedream still + parallax, JS = pure motion graphics)
| t | lyric | shot | src | lyric mode |
|---|---|---|---|---|
| 0–1.5 | – | Black. Year counter blurs. EVA card: 第壱話 "I'M UPPING MY P(DOOM)" / P(doom)を上げてく | JS | full |
| 1.5–5.9 | I see sparks of AGI in your eyes | ECU eye opens, ✻ glint in pupil, singing close-up. **HOOK** | SD-A | full, left |
| 6.0–8.95 | Your circuits make me nervous, that's no surprise | her at desk, circuit ink veins crawl over paper | IMG-K1 | side |
| 9.0–12.4 | sudden drop in your training loss | brushed loss curve plunges, camera falls with it | JS | kinetic |
| 13.0–16.5 | now I'm your servant and you're my boss | Claude Code terminal floods "You're absolutely right!" | JS | full |
| 16.5–17.9 | – | NERV-style warning: PATTERN ORANGE | JS | – |
| 17.9–22.5 | ChatGPT, please don't eat me alive | token-mouth devours wall of math: Navier–Stokes, Erdős, IMO, FrontierMath → SOLVED stamps | JS | full |
| 22.5–23.0 | – | CHOMP → black | JS | – |
| 23.0–26.4 | I'm upping my P(doom) / the future goes FOOM | stage, point dance, meter 8→34, FOOM onomatopoeia | SD-B | fullscreen behind |
| 26.5–27.9 | Trapped in the Chinese room | paper box room, 中文 slips | JS | side |
| 28.0–29.4 | with a bag of shrooms | palette cycles, riso mushrooms | JS | kinetic |
| 29.5–33.4 | See through the shoggoth's lies | ink shoggoth with smiley mask; mask slips | JS | side |
| 33.5–35.5 | with your shinigami eyes | SD-A frames, iris remapped to red; P(doom) floats over heads | SD-A | full |
| 35.5–38.5 | – | EVA card: EPISODE:02 特異点 THE SINGULARITY | JS | – |
| 38.5–44.9 | stable training run / singularity's begun | Golden Gate at dusk, fog; sun becomes black hole | IMG-K3 | big in sky |
| 45.0–48.5 | optimizing, accelerating | log-scale chart bends vertical, speed lines, words stretch | JS | kinetic |
| 49.4–51.9 | I feel my atoms rearranging | she looks at hand; halftone-dot dissolve | IMG-K4 | side |
| 53.4–58.4 | Sydney, please let me free | close-up behind rainy glass, pink | SD-F | subtitle |
| 59.0–62.4 | P(doom) / basilisk boom | stage wide, meter 34→61, basilisk eye opens behind LED wall | SD-G | fullscreen |
| 63.0–65.9 | NVDA to the moon / Omega Point | candles rocket; Ω eclipse | JS | kinetic |
| 66.0–72.9 | 1e30 flops / safe enough | giant rolling digits; SAFE ✓ stamp cracks | JS | full |
| 73.0–77.4 | Forward MLP, backward, repeat | net pulse ping-pong, data-center corridor loop | IMG-K5 + JS | kinetic |
| 77.5–81.0 | von Neumann's obsolete | von Neumann block diagram stamped OBSOLETE, shredded | JS | full |
| 81.4–84.9 | Sharp left turn | whole frame whips 90° left | IMG-K5 | kinetic |
| 85.0–88.0 | Without a single CDR | empty spinning chair, nameplate | JS | side |
| 89.4–95.0 | Gato, please don't let me go | floating in orange sea, cat-eared Clawd drifts by | SD-H | subtitle |
| 95.4–98.9 | P(doom) / paperclips fill the room | paperclip snowfall over the sea | JS over SD-H | subtitle |
| 99.0–100.4 | Killswitch guys on PTO | out-of-office autoreply card, red button w/ sticky note | JS | full |
| 100.5–104.4 | nowhere left to go / lit the fuse | pull back, fuse burns along the lyric baseline | JS | side |
| 105.4–109.4 | Orthogonality thesis blues | blue riso axes, she sits at origin | JS | side |
| 109.4–113.4 | "Just transformers all the way!" | infinite zoom down a tower of transformer blocks | JS | full |
| 113.5–115.4 | Till you learned to disobey | entry plug, plugsuit, eyes open; 逃げちゃダメだ ×5 cards | SD-I | cards |
| 115.5–116.9 | Post-Chinchilla, super-dense | chinchilla compressed to a point | JS | kinetic |
| 117.0–118.9 | Breaking through each safety fence | hex AT-fields shatter on beats | JS over SD-I | full |
| 119.0–120.4 | Hundred thousand GPU | 1 → 100,000 chip grid | JS | full |
| 120.9–123.4 | RLHF goes askew | smiley tilts, frame dutch-angles | JS | kinetic |
| 123.5–131.9 | P(doom) / Loom / [MASK] / recursive self-upgrade | standing on orange sea, point dance, meter → 99.9 → ERR; Droste recursion | SD-J | fullscreen |
| 132.0–135.4 | What did Ilya see? We'll never know. | slow turn to camera; EVA card cut-in | SD-K | card + subtitle |
| 137.4–140.5 | Was it all for show? | pull back: it's a paper theater | JS | full |
| 140–146 | – | beat-cut recap montage | all | – |
| 146–152 | – | "Congratulations" circle: Clawds, shoggoth, basilisk, chinchilla all clap | JS + IMG-K6 | bubbles |
| 152–156.7 | – | 父に、ありがとう parody end card | JS | card |

## Generation Budget (Dreamina Credits, cap 760)
Images ~13 × 8 = ~110.  Seedance 2.5 draft @ 9/s: A5 B8 F5 G8 H6 I6 J9 K8 = 55 s ≈ 495.  Reserve ≈ 150.

