# Credits & Acknowledgments

The project **Pdoom Video Anime Version** (*P(doom)を上げてく: Anime OP Remake*) was architected and built by **Anthropic Claude**, referencing and building upon the creative concepts and pipeline architecture established in John Heibel's open-source project [PDoomVideo](https://github.com/JohnHeibel/PDoomVideo).

We express our deepest gratitude to all original authors, inspiration sources, open-source contributors, and generative model foundations.

---

## 1. Upstream Project & Pipeline Origin

* **Upstream Repository**: [https://github.com/JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo)
* **Original Author**: **John Heibel** ([@JohnHeibel](https://github.com/JohnHeibel) / `jhcat99@gmail.com`)
* **Contribution & Significance**: 
  - Pioneered the first complete generative source code project for the *I'm Upping My P(doom)* music video created entirely by Claude Opus 5.5;
  - Established the multi-scene storyboard planning, headless browser offline frame rendering, and end-to-end Puppeteer + FFmpeg video assembly workflow;
  - Authored the general [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) animation foundation.

---

## 2. Anime Version Architecture & Direction

* **AI Director & Core Engineering**: **Anthropic Claude** (Claude 3.7 Sonnet / Claude Code / Claude Opus 5.5)
  - Conceived and wrote the complete fictional anime opening script *Neon Genesis Singularity* (`STORYBOARD.md`);
  - Engineered the custom pure WebGL **"Riso-cel"** rotoscope shader pipeline (Kuwahara surface smoothing + XDoG ink contour extraction + spot ink quantization + 45° halftone screentone + boil wobble on twos);
  - Implemented multi-track Canvas 2D scene orchestration (`scenes_a.js`, `scenes_b.js`, `scenes_c.js`);
  - Built the FFT-based audio DSP tempo/energy analyzer (`analyze.mjs`) and lip-sync cross-correlation tool (`mouthsync.mjs`);
  - Authored the multi-worker Chromium offline frame renderer and high-bitrate Twitter/web-friendly H.264/AAC mastering pipeline.

* **Project Curator & Producer**: **Hongyi Fan** ([@hongyifan](https://github.com/hongyifan))
  - Responsible for project initiation, generation scheduling, prompt engineering design, and repository curation.

---

## 3. Music, Lyrics & Cultural Lore

* **Song**: *I'm Upping My P(doom)*
  - Generated via Udio AI, traced back to the 2024 YouTube upload: [Watch on YouTube](https://www.youtube.com/watch?v=uEB5E67vcPA)
* **Original Creative Inspiration**: 
  - Conceived from the viral post on X by **slimer48484**: [View on X](https://x.com/slimer48484/status/2097752569212756134)
* **Lyrics Interpretation & Lore**: 
  - Detailed lyric breakdowns and source lore by **Osmarks**: [The Objectively Correct Interpretation](https://docs.osmarks.net/hypha/p(doom)_song_objectively_correct_interpretation)
* **Visual Aesthetic Homage**: 
  - *Neon Genesis Evangelion* (GAINAX / Hideaki Anno) — Mincho bold typography title cards, LCL orange sea (echoing Claude's signature brand color), Human Instrumentality climax, NERV warning UI, and the iconic "Congratulations" clapping finale.

---

## 4. Generative Media & Toolchain

* **Visual Generative Foundation**: 
  - **Dreamina (即梦 AI)**: Seedream 4.5 and Seedance 2.5 video models providing dynamic character choreography and scenic matte paintings (re-rendered entirely through the WebGL shader pipeline without raw AI footage).
* **Open Source Dependencies & Runtimes**:
  - [Puppeteer Core](https://pptr.dev/): Precision headless browser frame capture.
  - [FFmpeg](https://ffmpeg.org/): Frame sequencing, color space conversion (`yuv420p`), and audio multiplexing.
  - [ffmpeg-static](https://github.com/eugeneware/ffmpeg-static) & [ffprobe-static](https://github.com/joshwnj/ffprobe-static): Cross-platform precompiled binary toolset.
  - Google Fonts: Anton, Archivo Black, Dela Gothic One, JetBrains Mono, Shippori Mincho B1, Noto Sans JP.
