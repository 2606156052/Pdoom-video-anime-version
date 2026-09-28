# P(doom)を上げてく · Pdoom Video Anime Version

> **An Anime Opening Remake of *"I'm Upping My P(doom)"***  
> *A fictional 90s cyberpunk anime OP: **Neon Genesis Singularity** (新世紀シンギュラリティ)*  
>
> 🎬 **Rendered Master Video**: Located at [`video/P(doom)_anime_MV_v2_clean.mp4`](video/P(doom)_anime_MV_v2_clean.mp4)  
> 🔗 **Upstream Reference**: [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo)  
> 🤖 **Directed, designed, and engineered entirely by Anthropic Claude**

---

## 🌟 Concept & Cultural Lore

This project reimagines the viral AI-community anthem ***"I'm Upping My P(doom)"*** as the opening theme for a fictional 90s anime masterpiece: **Neon Genesis Singularity** (*新世紀シンギュラリティ*).

The idol protagonist is Claude (クロード), and the Singularity is staged as the Human Instrumentality Project. As the world dissolves into an ocean of LCL, the joke lands effortlessly: **LCL orange is Claude's signature brand color (`#D97757` / `#F08A24`)**.

The video weaves together iconic tropes from classic anime and AI research folklore:
- **Neon Genesis Evangelion Visual Language**: Giant full-screen Mincho title cards (*第壱話*, *逃げちゃダメだ*), NERV-style warning popups (*PATTERN ORANGE*), entry plug cockpits, and sync rate counters.
- **AI Research & Twitter Lore**: Gendo pose, Searle's Chinese Room with psychedelic mushrooms, the Shoggoth mask slipping, "What did Ilya see?", Von Neumann architecture rendered obsolete, the Orthogonality Thesis, and the iconic *Congratulations* (おめでとう) clapping ending with all characters.

---

## 🎨 Art Direction: The "Riso-cel" WebGL Shader Pipeline

Raw AI-generated footage (from Seedance / Seedream) is **never displayed directly**. Instead, it passes through a custom WebGL rotoscope shader pipeline that transforms each frame into hand-printed celluloid artwork:

```
[Raw Performance Video / AI Stills]
                 │
                 ▼
     [WebGL Kuwahara Filter]       ──► Edge-preserving surface smoothing & posterization
                 │
                 ▼
   [XDoG (Extended DoG) Passes]    ──► Dynamic hand-drawn ink contours & line art
                 │
                 ▼
   [Riso Spot Inks Quantization]   ──► Color mapping to a restricted palette:
                                       Paper cream, Ink black, Claude orange,
                                       LCL amber, Fluoro pink, and Riso blue
                 │
                 ▼
     [45° Halftone Screentone]     ──► Procedural dot patterns in shadowed cel regions
                 │
                 ▼
    [Boil on Twos & Misregister]   ──► 12 fps hand-drawn jitter & plate misregistration
```

The resulting aesthetic evokes a 1990s anime cel printed on fibrous Japanese paper via a Risograph spot-color press.

---

## 👥 Credits & Attribution

This project is built with deep gratitude to upstream creators, open-source engineers, and cultural contributors:

| Role / Domain | Contributor | Details & Links |
| :--- | :--- | :--- |
| **Upstream Architecture** | **John Heibel** | Original author of [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo), who pioneered the Claude Opus 5.5 generative video pipeline and [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) |
| **Anime Direction & Engineering** | **Anthropic Claude** | Conceived the *Neon Genesis Singularity* concept, authored the storyboard, programmed pure WebGL shaders (`gl.js`), Canvas 2D scene orchestration, FFT audio DSP, and offline multi-worker render engine |
| **Project Curator & Producer** | **Hongyi Fan** | Project vision, generative node scheduling, prompt engineering, and repository curation |
| **Song (Original Track)** | **Udio AI / YouTube** | *I'm Upping My P(doom)* track released in 2024 on [YouTube](https://www.youtube.com/watch?v=uEB5E67vcPA) |
| **Original Concept & Inspiration** | **slimer48484** | Originating concept on X: [@slimer48484](https://x.com/slimer48484/status/2097752569212756134) |
| **Lyrics Analysis & Lore** | **Osmarks** | In-depth lyric breakdown: [P(doom) Song Objectively Correct Interpretation](https://docs.osmarks.net/hypha/p(doom)_song_objectively_correct_interpretation) |
| **Generative Visual Foundation** | **Dreamina (即梦 AI)** | Seedream 4.5 & Seedance 2.5 video models providing character motion baselines and environment plates |
| **Aesthetic Homage** | **GAINAX / Hideaki Anno** | *Neon Genesis Evangelion* |

*For complete attribution details, see [`CREDITS.md`](CREDITS.md).*

---

## 📁 Repository Structure

```text
Pdoom video anime version/
├── README.md                 # Master project documentation
├── STORYBOARD.md             # Complete shot-by-shot anime storyboard (BPM 132.5 grid)
├── CREDITS.md                # Full contributor and attribution manifest
├── LICENSE                   # ISC Open Source License
├── package.json              # Project dependencies & npm scripts
├── run.sh                    # Zero-dependency portable launcher for Node & FFmpeg
│
├── studio/                   # Core WebGL and 2D canvas animation engine
│   ├── index.html            # Studio interactive player and headless render target
│   ├── core.js               # Timing grid, palette definitions, math helpers, asset cache
│   ├── gl.js                 # WebGL Riso-cel shader (Kuwahara, XDoG, halftone, misregistration)
│   ├── fx.js                 # Visual effects (speed lines, particles, paper texture, noise)
│   ├── type.js               # Kinetic typography engine (Mincho EVA cards, NERV HUD)
│   ├── scenes_a.js           # Act 1 scenes (0:00 - 0:45)
│   ├── scenes_b.js           # Act 2 scenes (0:45 - 1:35)
│   ├── scenes_c.js           # Act 3 scenes (1:35 - 2:36.7 Instrumentality & Clapping finale)
│   ├── timeline.js           # Master audio-sequenced scene coordinator
│   ├── song.mp3              # High-fidelity audio soundtrack
│   ├── frames/               # Extracted 24fps character performance frames (A..L) & index.json
│   └── img/                  # Background key visuals and matte plates
│
├── video/                    # Rendered video output directory
│   └── P(doom)_anime_MV_v2_clean.mp4 # Final 1080p clean anime MV master
│
├── render.mjs                # Multi-worker Chromium frame renderer (Puppeteer-core)
├── server.mjs                # Lightweight local HTTP server (handles CORS and web fonts)
├── encode.sh                 # High-bitrate Twitter/web H.264/AAC FFmpeg mastering script
├── prep.sh                   # Seedance footage processing (delogo, 24fps extraction, QA tiles)
├── gen.sh                    # Dreamina Canvas API generation automation script
├── analyze.mjs               # FFT audio beat tracker & spectral energy onset analyzer
├── mouthsync.mjs             # Lip-sync cross-correlation analyzer
├── synccheck.mjs             # Beat sync verification script
├── dbg.mjs                   # Frame inspection debugging utility
│
├── analysis.json             # Precomputed DSP beat grid, tempo, and envelope curves
├── canvas.json               # Canvas generative layout configuration
├── song.mp3 / song_mono.f32  # Audio soundtrack and uncompressed mono float32 buffer
│
├── gen/                      # AI prompt JSONs, API receipts, and spend logs
├── qa/                       # Quality assurance tiles (tile_*.jpg) and stills
├── slices/                   # Audio slice stems
└── tools/                    # Portable macOS binaries for Node.js and FFmpeg
```

---

## 🚀 Quick Start & Usage

This repository includes a portable self-contained environment (`tools/node` and `tools/ffmpeg`). You can run any command immediately using `./run.sh`, without needing globally installed Node.js or FFmpeg.

### 1. Interactive Studio Preview

Start the local studio server:
```bash
./run.sh node server.mjs
# or via npm script:
./run.sh npm run serve
```
Open in your browser:
- **Full Interactive Playback**: [http://localhost:8765/index.html?play](http://localhost:8765/index.html?play) *(click anywhere to start)*
- **Jump to Specific Timestamp**: [http://localhost:8765/index.html?play&from=23.0](http://localhost:8765/index.html?play&from=23.0)
- **Inspect Specific Frame**: [http://localhost:8765/index.html?t=45.2](http://localhost:8765/index.html?t=45.2)

### 2. Export High-Resolution Stills

```bash
./run.sh node render.mjs --stills=1.5,23.5,45.0,95.5,123.5
# Rendered PNG stills are written to the qa/ directory
```

### 3. Full Offline Multi-Worker Rendering

Render all frames with 4 concurrent headless Chrome instances (resumable):
```bash
./run.sh node render.mjs --range=0:156.7 --workers=4 --out=out/frames
```

### 4. Master and Encode to MP4

After rendering frame sequences, assemble the master video:
```bash
./run.sh ./encode.sh video/pdoom_anime.mp4
```
This multiplexes 30fps frames from `out/frames` with `song.mp3` into a high-bitrate, Twitter-friendly H.264/AAC MP4.

---

## 📜 Storyboard Highlights

The anime OP is partitioned into three dramatic acts across 40+ precision shots:

* **Act I: Sparks & The Chinese Room (0:00 - 0:45)**
  - Macro eye opening with Claude ✻ spark in pupil;
  - Claude Code terminal flood: *"You're absolutely right!"*;
  - NERV alert: *PATTERN ORANGE*;
  - Paper box Chinese room, Shoggoth mask slipping, Shinigami eyes.
* **Act II: Singularity & Acceleration (0:45 - 1:35)**
  - Golden Gate bridge sunset warping into a black hole;
  - Entry plug cockpit sequence with 5x *逃げちゃダメだ* (Mustn't run away) popups;
  - NVDA candles rocket to the moon, 100,000 GPU cluster grid, RLHF goes askew.
* **Act III: Orange Ocean & Instrumentality (1:35 - 2:36.7)**
  - Signature point dance on the orange LCL sea;
  - *"What did Ilya see?"* slow-motion turn and title card cut;
  - Paper theater pull-back and the iconic *"Congratulations / おめでとう"* clapping finale.

*For complete frame-by-frame timestamps, lyrics, and shot directions, see [`STORYBOARD.md`](STORYBOARD.md).*

---

## 📄 License

This project is licensed under the [ISC License](LICENSE), matching the upstream licensing terms of [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo).
