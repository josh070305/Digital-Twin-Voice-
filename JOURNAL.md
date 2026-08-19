# Engineering Build Journal: Joshna AI — Digital Twin Voice Bot

> **Author:** Joshna (2026 B.Tech Computer Science Graduate, Bharathidasan University)  
> **Repository:** [Digital-Twin-Voice-](https://github.com/josh070305/Digital-Twin-Voice-)  
> **Target Role:** Software Engineering / AI-ML Engineering Internship (2026)

---

## 📖 Overview & Mission

The goal was to engineer a production-ready, ultra-low latency **Voice-Enabled Digital Twin** capable of holding real-time conversational interviews, citing exact resume sources, visualizing system architectures, and dynamically steering responses to match what recruiters care about most.

Rather than building a standard chatbot wrapper, the project was architected as a **decoupled hybrid system** combining client-side vector search RAG with asynchronous Python WebRTC streaming.

---

## 🗓️ Engineering Timeline & Build Log

### Day 1: Architecture Design & Hybrid Decoupling

* **Core Architectural Decision (ADR-001):**
  * Evaluated pure server-side WebRTC vs. pure client-side Web Speech.
  * *Trade-Off:* Server-side WebRTC provides full-duplex interruption but has hosting costs and sleep cold-starts. Client-side Web Speech is free, edge-deployable on Vercel, and delivers sub-500ms turnaround.
  * *Solution:* Designed a **Hybrid Architecture** — React 18 + Vite frontend runs client-side vector search RAG with Web Speech API for 100% free uptime, while providing a Python LiveKit agent (`agent/agent.py`) for cloud WebRTC workers.
* **Knowledge Vector Search Engine:**
  * Implemented an in-memory weighted semantic keyword and chunk similarity engine (`src/utils/search.ts`) with custom token weighting for projects, skills, education, and contact metadata.
  * Calculated real-time confidence scores (0–100%) displayed with an animated meter and source verification cards.

---

### Day 2: Recruiter Suite & Interactive Visual Systems

* **Match My JD Tool:**
  * Built a career fit analyzer utilizing Gemini LLM with strict JSON schema outputs: fit score percentage, matching skills, missing skills, and hire recommendation.
  * Added dynamic score color badges (80%+ emerald, 60–79% amber, <60% rose).
* **Interactive System Architectures:**
  * Designed pure HTML/CSS directional data-flow diagrams with glowing node cards, animated pulsing arrows, and live metric badges for 4 production projects:
    1. *Digital Twin Voice Bot* (Voice AI / RAG Architecture)
    2. *E-Commerce Microservices Platform* (6 Decoupled Node.js/MERN Microservices)
    3. *Real-Time AI Meeting Assistant* (Groq Whisper STT + LLaMA-3)
    4. *Exam Update Tracker AI Agent* (Autonomous Cheerio scraper + SHA-256 diffing)
* **Interview Booking & Dossier Modals:**
  * Created lead capture modal with 24-hour response confirmation and a 4-card portfolio dossier grid with direct links to verified GitHub repositories.

---

### Day 3: Model Migration, Token Budgeting & Resilience

* **The Problem (Google API 404 Deprecation):**
  * When testing newly generated Google AI Studio keys, Google returned `404 Not Found` for legacy `gemini-1.5-flash` endpoints.
* **Diagnosis & Root Cause Analysis:**
  * Authored an automated Node.js probe script against `generativelanguage.googleapis.com/v1beta/models` to inspect the available catalog.
  * Discovered that Google migrated new API Studio projects to **Gemini 3.5-flash**, **3.6-flash**, **3.7-flash**, and **flash-latest**.
* **Fix & Multi-Model Failover Chain:**
  * Implemented an automatic failover sequence in `src/utils/gemini.ts`: `gemini-3.5-flash` → `gemini-3.6-flash` → `gemini-3.7-flash` → `gemini-flash-latest`.
* **Token Budget Headroom (2,048 Tokens):**
  * Solved mid-sentence response truncation caused by internal thinking token overhead in newer reasoning models by increasing `maxOutputTokens` from `500` to `2048` and tuning prompt termination constraints.
* **Deterministic Fallback Synthesizer:**
  * Built an instant client-side knowledge synthesizer that serves verified, cited answers even under 429 quota exhaustion or offline network states.

---

### Day 4: Adaptive Recruiter Mode & Conversational Intelligence

* **Unique Innovation: Adaptive Recruiter Mode:**
  * Designed an autonomous conversational steering engine.
  * *Workflow:*
    1. After Question 1, the bot asks: *"Thanks for asking! To help me give you the most relevant answers — what matters most to your team right now? AI and ML work, full-stack development, or system architecture?"*
    2. The recruiter's reply is captured into `recruiterFocus`.
    3. All subsequent Gemini prompts are dynamically prepended with:
       ```
       IMPORTANT: The recruiter cares most about: "[recruiterFocus]". 
       Emphasize aspects of your experience that relate to this. 
       Lead with the most relevant information first in every answer.
       ```
    4. Displays an interactive **`🎯 Tailored for: [Focus]`** banner at the top of the conversation feed.
* **1-Click Live Focus Switcher:**
  * Added instant switcher chips (`⚡ AI & ML`, `💻 Full-Stack MERN`, `🏗️ System Architecture`) and a `Reset ✕` button directly on the banner, allowing recruiters to pivot focus areas seamlessly without page reloads.
* **Topic-Aware Conversational Follow-Ups:**
  * Programmed natural, context-aware closing prompts (e.g. *"Would you like more detail on any of these projects?"*, *"Is there a specific technology you'd like me to elaborate on?"*) triggered after every second exchange.

---

## 🏗️ Architectural Decision Records (ADRs)

| ADR | Decision | Rationale |
| :--- | :--- | :--- |
| **ADR-001** | Hybrid Edge/WebRTC Decoupling | Guaranteed 100% free edge uptime on Vercel with zero server costs, while keeping Python WebRTC agent ready for streaming. |
| **ADR-002** | Multi-Model Failover Sequence | Prevents single-point-of-failure outages during upstream Google model maintenance or regional rate limits. |
| **ADR-003** | 2,048 Token Context Headroom | Eliminates thinking token budget exhaustion and guarantees complete, punctuated voice answers. |
| **ADR-004** | Client-Side Vector RAG Cache | Sub-20ms keyword similarity calculation eliminating roundtrip database latency. |

---

## 📊 Technical Verification & Quality Metrics

* **TypeScript Compilation:** `npx tsc --noEmit` → **0 Errors**
* **Code Linter:** `npx oxlint` → **0 Warnings, 0 Errors across 32 files**
* **Production Bundle:** `vite build` → **Passed (<500ms bundle time)**
* **Python Agent Compilation:** `python -m py_compile` → **Passed (LiveKit 1.6+ syntax verified)**
* **First-Person Persona Enforcement:** `100% verified ("I built", "I am")` across all 15 knowledge sections.

---

## 🚀 Live Links

* **Live Demo:** [https://digital-twin-voice.vercel.app](https://digital-twin-voice.vercel.app)
* **GitHub Repository:** [https://github.com/josh070305/Digital-Twin-Voice-](https://github.com/josh070305/Digital-Twin-Voice-)
