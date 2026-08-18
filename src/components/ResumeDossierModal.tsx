import { useState } from 'react';

interface ResumeDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeDossierModal({ isOpen, onClose }: ResumeDossierModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# Joshna
**Full Stack MERN & AI/ML Engineer** • 2026 B.Tech Computer Science Graduate
📍 Coimbatore, Tamil Nadu, India | ✉️ joesenthil07@gmail.com | 📞 +91 9342214179
🔗 GitHub: github.com/josh070305 | LinkedIn: linkedin.com/in/joshna-senthil

---

## PROFESSIONAL SUMMARY
2026 B.Tech Computer Science graduate from Bharathidasan University with CGPA 8.2 and 0 standing arrears. Hands-on experience in full-stack MERN development, distributed microservices, and AI/LLM engineering. Proven track record building production-grade web applications, autonomous scraping pipelines, and low-latency voice assistants.

---

## TECHNICAL SKILLS
- **Languages:** Python, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3
- **Frontend:** React.js, Redux Toolkit, Tailwind CSS, Vite, Web Audio API, Web Speech API
- **Backend & Microservices:** Node.js, Express.js, RESTful APIs, JWT Authentication, Microservices Architecture
- **AI & LLM:** Groq LPU API, Google Gemini, Anthropic Claude, TensorFlow, Keras, Web Scraping (Cheerio/Axios)
- **Databases & DevOps:** MongoDB, MongoDB Atlas, MySQL, Docker, Git, GitHub Actions, Vercel

---

## KEY TECHNICAL PROJECTS

### 1. E-Commerce Microservices Platform
*Stack: Node.js, Express.js, React.js, TypeScript, MongoDB Atlas, Stripe API, Docker*
- Engineered a full-stack e-commerce system decomposed into 6 independent microservices (Auth, Product, Cart, Order, Payment, Notification).
- Secured with encrypted JWT authentication and role-based access control; integrated Stripe payment webhooks with idempotent ledger.
- Containerized all microservices using Docker; achieved sub-200ms average API response time.
- **GitHub:** https://github.com/josh070305/e--commerce-microservices

### 2. Real-Time AI Meeting Assistant
*Stack: React.js, Node.js, Groq API (Whisper STT & LLaMA-3), MongoDB, WebSockets*
- Built a sub-second real-time transcription and live semantic meeting intelligence engine.
- Generates structured summaries, key action item checklists, and searchable transcripts automatically.
- **GitHub:** https://github.com/josh070305/Real-time-AI-meeting-assistant

### 3. Exam Update Tracker AI Agent
*Stack: Node.js, Express.js, MongoDB, Cheerio, Node-Cron, Groq LLaMA-3.3-70b, Telegram Bot, Twilio WhatsApp*
- Autonomous AI pipeline monitoring 6 Indian government recruitment boards (SSC, RRB, TNPSC, UPSC, IBPS, SBI).
- Built SHA-256 snapshot hashing change detector, saving over 90% redundant LLM token costs.
- Dispatches instant multi-channel alerts via Telegram, WhatsApp, and Email based on user preferences.
- **GitHub:** https://github.com/josh070305/Exam-Tracker

### 4. Joshna AI — Voice Digital Twin
*Stack: React 18, TypeScript, Tailwind CSS, Gemini 2.5/3.5, LiveKit WebRTC, Web Audio API*
- Voice-enabled portfolio twin supporting 4 languages (English, Hindi, French, Spanish) and first-person responses.
- Integrated client-side vector search RAG with zero-downtime deterministic fallback synthesis.
- **GitHub:** https://github.com/josh070305/Digital-Twin-Voice-

---

## EDUCATION
**Bachelor of Technology in Computer Science & Engineering (2022 - 2026)**
Bharathidasan University, Tiruchirappalli, Tamil Nadu
- **CGPA:** 8.2 / 10.0 (0 Standing Arrears)
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-glass)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">📄</span>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Joshna — ATS-Ready Resume & Dossier
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Verified candidate profile formatted for hiring managers and recruiters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              <span>{copied ? '✅ Copied!' : '📋 Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] ml-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Resume Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6 text-[var(--color-text)] bg-[var(--color-card)] print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="border-b border-[var(--color-border)] pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h1 className="text-2xl font-black text-[var(--color-text)] tracking-tight">
                JOSHNA
              </h1>
              <p className="text-sm font-semibold text-indigo-400 mt-0.5">
                Full Stack MERN & AI/ML Engineer
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                2026 B.Tech Computer Science Graduate • Bharathidasan University
              </p>
            </div>

            <div className="text-xs text-right space-y-1 text-[var(--color-text-muted)]">
              <div>✉️ <span className="text-[var(--color-text)] font-medium">joesenthil07@gmail.com</span></div>
              <div>📞 <span className="text-[var(--color-text)] font-medium">+91 9342214179</span></div>
              <div>📍 Coimbatore, Tamil Nadu (Open to Relocation)</div>
              <div>🔗 <a href="https://github.com/josh070305" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">github.com/josh070305</a></div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-[var(--color-border)] pb-1">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
              2026 B.Tech Computer Science graduate with CGPA 8.2 and 0 standing arrears. Hands-on expertise building scalable full-stack MERN applications, Dockerized microservices, autonomous web scraping agents, and low-latency voice assistants with real-time AI integration.
            </p>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-[var(--color-border)] pb-1">
              Technical Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
                <span className="font-bold text-[var(--color-text)]">Languages & Frontend:</span>
                <p className="text-[var(--color-text-muted)] mt-0.5">Python, JavaScript, TypeScript, SQL, React.js, Redux Toolkit, Tailwind CSS, Vite, HTML5, CSS3</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
                <span className="font-bold text-[var(--color-text)]">Backend & Microservices:</span>
                <p className="text-[var(--color-text-muted)] mt-0.5">Node.js, Express.js, RESTful APIs, JWT Auth, Microservices Architecture, Stripe Webhooks</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
                <span className="font-bold text-[var(--color-text)]">AI / LLM & Scraping:</span>
                <p className="text-[var(--color-text-muted)] mt-0.5">Groq LPU API, Google Gemini, Anthropic Claude, Cheerio, Axios, TensorFlow, Keras, NLP</p>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
                <span className="font-bold text-[var(--color-text)]">Databases & DevOps:</span>
                <p className="text-[var(--color-text-muted)] mt-0.5">MongoDB, MongoDB Atlas, MySQL, Docker, Git, GitHub Actions, Vercel</p>
              </div>
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-[var(--color-border)] pb-1">
              Featured Technical Projects
            </h2>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-[var(--color-text)]">
                <span>E-Commerce Microservices Platform</span>
                <a href="https://github.com/josh070305/e--commerce-microservices" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub ↗</a>
              </div>
              <p className="text-[11px] text-indigo-300">Node.js, Express, React, TypeScript, MongoDB Atlas, Stripe API, Docker</p>
              <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-0.5 mt-1">
                <li>Built 6 microservices (Auth, Product, Cart, Order, Payment, Notification) maintaining &lt;200ms average API response latency.</li>
                <li>Integrated Stripe payment processing with idempotent webhooks and JWT encrypted token rotation.</li>
              </ul>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-[var(--color-text)]">
                <span>Exam Update Tracker AI Agent</span>
                <a href="https://github.com/josh070305/Exam-Tracker" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub ↗</a>
              </div>
              <p className="text-[11px] text-indigo-300">Node.js, Express, MongoDB, Cheerio, Node-Cron, Groq LLaMA-3.3-70b, Telegram Bot API, Twilio</p>
              <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-0.5 mt-1">
                <li>Automated crawler monitoring 6 Indian government recruitment boards (SSC, RRB, TNPSC, UPSC, IBPS, SBI).</li>
                <li>Constructed SHA-256 snapshot hashing reducing redundant LLM calls by 90%; dispatches multi-channel alerts via Telegram & WhatsApp.</li>
              </ul>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-[var(--color-text)]">
                <span>Real-Time AI Meeting Assistant</span>
                <a href="https://github.com/josh070305/Real-time-AI-meeting-assistant" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub ↗</a>
              </div>
              <p className="text-[11px] text-indigo-300">React.js, Node.js, Groq API (Whisper STT & LLaMA-3), MongoDB, WebSockets</p>
              <ul className="list-disc list-inside text-[var(--color-text-muted)] space-y-0.5 mt-1">
                <li>Engineered sub-second live speech transcription with real-time semantic summary and action item extraction.</li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-[var(--color-border)] pb-1">
              Education & Academic Standing
            </h2>
            <div className="flex justify-between text-xs">
              <div>
                <p className="font-bold text-[var(--color-text)]">Bachelor of Technology (B.Tech) — Computer Science & Engineering</p>
                <p className="text-[var(--color-text-muted)]">Bharathidasan University, Tiruchirappalli, Tamil Nadu</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-emerald-400">CGPA: 8.2 / 10.0</p>
                <p className="text-[11px] text-[var(--color-text-muted)]">Graduation: 2026 (0 Standing Arrears)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
