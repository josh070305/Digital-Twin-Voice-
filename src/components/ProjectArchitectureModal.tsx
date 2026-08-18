import { useState } from 'react';

interface ProjectArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectId?: string;
}

type TabType = 'digitaltwin' | 'ecommerce' | 'realtime-meeting' | 'exam-tracker';

interface ArchitectureData {
  id: TabType;
  title: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  github: string;
  metrics: { label: string; value: string }[];
  flow: { step: string; desc: string; icon: string; tech: string }[];
  highlights: string[];
}

const ARCHITECTURES: Record<TabType, ArchitectureData> = {
  digitaltwin: {
    id: 'digitaltwin',
    title: 'Digital Twin Voice Bot',
    badge: 'Voice AI / RAG Architecture',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    tagline: 'Real-time voice portfolio twin with sub-500ms latency, vector RAG search, and verified citations',
    github: 'https://github.com/josh070305/Digital-Twin-Voice-',
    metrics: [
      { label: 'Voice Response Latency', value: '< 500ms' },
      { label: 'Multilingual Support', value: '4 Languages' },
      { label: 'RAG Architecture', value: 'Client-Side Vector RAG' },
      { label: 'Fallback Uptime', value: '100% Guaranteed' },
    ],
    flow: [
      { step: 'User Mic Input', desc: 'Audio stream capture & live transcription', icon: '🎙️', tech: 'Web Speech / LiveKit' },
      { step: 'Vector RAG Engine', desc: 'Weighted semantic keyword & chunk matching', icon: '⚡', tech: 'Custom RAG' },
      { step: 'Gemini Generative Core', desc: 'Multi-model fallback reasoning chain', icon: '🤖', tech: 'Gemini 3.5/3.6/Flash' },
      { step: 'Citation Engine', desc: 'Source metadata & confidence scoring', icon: '📎', tech: 'Source Scoring' },
      { step: 'Multilingual TTS', desc: 'Speech voice synthesis in 4 languages', icon: '🔊', tech: 'Web Speech TTS' },
      { step: 'Live Audio Output', desc: 'Interactive voice response & citation cards', icon: '👤', tech: 'Web Audio' },
    ],
    highlights: [
      'Sub-500ms voice turnaround combining client-side vector search and Web Speech recognition.',
      'Dynamic confidence scoring with animated percentage visualizer and source verification.',
      '100% perceived uptime with deterministic local knowledge synthesis fallback.',
    ],
  },
  ecommerce: {
    id: 'ecommerce',
    title: 'E-Commerce Microservices',
    badge: 'Enterprise MERN Architecture',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    tagline: 'High-throughput enterprise commerce backend with 6 decoupled microservices & Stripe checkout',
    github: 'https://github.com/josh070305/e--commerce-microservices',
    metrics: [
      { label: 'API Response Time', value: '< 200ms' },
      { label: 'Microservices', value: '6 Services' },
      { label: 'CI/CD Pipeline', value: 'GitHub Actions' },
      { label: 'Containerization', value: 'Docker' },
    ],
    flow: [
      { step: 'React Frontend', desc: 'TypeScript & Redux state UI', icon: '💻', tech: 'React 18' },
      { step: 'API Gateway', desc: 'Rate limiting & route proxying', icon: '🌐', tech: 'Express Gateway' },
      { step: '6 Microservices', desc: 'Auth, Product, Cart, Order, Payment, Notification', icon: '⚙️', tech: 'Node.js & JWT' },
      { step: 'MongoDB Atlas', desc: 'Distributed multi-region cluster', icon: '🗄️', tech: 'MongoDB' },
      { step: 'Stripe Payment', desc: 'Idempotent webhook ledger', icon: '💳', tech: 'Stripe API' },
    ],
    highlights: [
      'Decomposed into 6 independent services maintaining under 200ms average API response time.',
      'Secured with encrypted JWT token rotation, bcrypt password hashing, and role-based guards.',
      'Docker containerized architecture with automated GitHub Actions CI/CD deployment.',
    ],
  },
  'realtime-meeting': {
    id: 'realtime-meeting',
    title: 'Real-Time AI Meeting Assistant',
    badge: 'Real-Time Speech & LLM',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    tagline: 'Ultra-low latency live speech transcription, automated meeting summaries & action items',
    github: 'https://github.com/josh070305/Real-time-AI-meeting-assistant',
    metrics: [
      { label: 'Speech-to-Text Latency', value: '< 400ms' },
      { label: 'LLM Engine', value: 'Groq LLaMA-3.3-70b' },
      { label: 'Real-Time Streaming', value: 'WebSocket Live' },
      { label: 'Structured Output', value: 'Action Items & Summaries' },
    ],
    flow: [
      { step: 'Audio Stream Input', desc: 'Continuous meeting voice capture', icon: '🎙️', tech: 'Web Audio API' },
      { step: 'Groq Whisper STT', desc: 'Ultra-fast sub-400ms speech transcription', icon: '⚡', tech: 'Groq Cloud' },
      { step: 'Context Chunker', desc: 'Conversation semantic chunking', icon: '🧩', tech: 'Node.js Chunker' },
      { step: 'LLaMA-3 Intelligence', desc: 'Real-time summary & intent reasoning', icon: '🤖', tech: 'Groq LLaMA-3.3' },
      { step: 'Action Extractor', desc: 'Identifies tasks, owners & deadlines', icon: '📋', tech: 'JSON Parser' },
      { step: 'Live Dashboard', desc: 'Real-time UI sync & meeting export', icon: '📊', tech: 'React & Tailwind' },
    ],
    highlights: [
      'Engineered sub-400ms speech-to-text pipeline using Groq Whisper API for ultra-low latency transcription.',
      'Automated extraction of structured action items and meeting recaps in real time using LLaMA-3.',
      'Designed a live dashboard with instant meeting search, speaker labels, and session export.',
    ],
  },
  'exam-tracker': {
    id: 'exam-tracker',
    title: 'Exam Update Tracker AI Agent',
    badge: 'Autonomous AI Scraper',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    tagline: 'Autonomous AI pipeline scraping 6 government exam portals with SHA-256 diffing & multi-channel alerts',
    github: 'https://github.com/josh070305/Exam-Tracker',
    metrics: [
      { label: 'Portals Monitored', value: '6 Portals' },
      { label: 'Token Cost Reduction', value: '90%+ via SHA-256' },
      { label: 'Alert Channels', value: 'Telegram & WhatsApp' },
      { label: 'Scraping Interval', value: 'Autonomous Cron' },
    ],
    flow: [
      { step: 'Cron Scheduler', desc: 'Periodic automated trigger worker', icon: '⏰', tech: 'Node-Cron' },
      { step: '6 Govt Portals', desc: 'SSC, RRB, TNPSC, UPSC, IBPS, SBI', icon: '🌐', tech: 'Cheerio Scraper' },
      { step: 'SHA-256 Diffing', desc: 'Detects page updates & prevents duplicate costs', icon: '🛡️', tech: 'Crypto Hash' },
      { step: 'Groq AI Parsing', desc: 'Extracts exam dates, admit cards & eligibility', icon: '🤖', tech: 'LLaMA-3.3 JSON' },
      { step: 'Versioned Store', desc: 'Stores diffed updates in MongoDB Atlas', icon: '🗄️', tech: 'MongoDB' },
      { step: 'Multi-Channel Alert', desc: 'Pushes alerts to Telegram & WhatsApp', icon: '📱', tech: 'Telegram & Twilio' },
    ],
    highlights: [
      'Scrapes 6 Indian recruitment portals (SSC, RRB, TNPSC, UPSC, IBPS, SBI) autonomously with Cheerio.',
      'Saves 90%+ redundant LLM token costs by hashing page snapshots with SHA-256 diffing before LLM extraction.',
      'Automated real-time notification dispatch across Telegram, WhatsApp (Twilio), and Email.',
    ],
  },
};

export function ProjectArchitectureModal({
  isOpen,
  onClose,
  initialProjectId = 'digitaltwin',
}: ProjectArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (initialProjectId === 'ecommerce') return 'ecommerce';
    if (initialProjectId === 'realtime-meeting' || initialProjectId === 'meeting') return 'realtime-meeting';
    if (initialProjectId === 'exam-tracker' || initialProjectId === 'exam') return 'exam-tracker';
    return 'digitaltwin';
  });

  if (!isOpen) return null;

  const current = ARCHITECTURES[activeTab] || ARCHITECTURES.digitaltwin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[92vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏗️</span>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">System Architectures</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Production-grade blueprints, data flows, and metrics designed by Joshna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 4 Project Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[var(--color-border)] overflow-x-auto custom-scrollbar">
          {(['digitaltwin', 'ecommerce', 'realtime-meeting', 'exam-tracker'] as TabType[]).map((tabKey) => {
            const tab = ARCHITECTURES[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-[var(--color-glass)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-glass-border)]'
                }`}
              >
                <span>{tab.id === 'digitaltwin' ? '🎙️' : tab.id === 'ecommerce' ? '🛒' : tab.id === 'realtime-meeting' ? '⚡' : '🛡️'}</span>
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 py-4 pr-1">
          {/* Subheader with Tagline & GitHub Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${current.badgeColor}`}>
                  {current.badge}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text)] font-medium leading-relaxed max-w-xl">
                {current.tagline}
              </p>
            </div>

            <a
              href={current.github}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 hover:text-indigo-200 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
            >
              <span>🐙</span>
              <span>View GitHub Repo</span>
              <span>→</span>
            </a>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {current.metrics.map((m) => (
              <div
                key={m.label}
                className="p-3 rounded-2xl bg-gradient-to-b from-[#131326] to-[#0a0a14] border border-indigo-500/20 text-center shadow-md"
              >
                <div className="text-sm md:text-base font-black bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {m.value}
                </div>
                <div className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Architecture Diagram Flow */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span>
              <span>End-to-End System Data Flow</span>
            </h4>

            <div className="p-4 md:p-6 rounded-2xl bg-[#090912] border border-indigo-500/30 shadow-inner">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {current.flow.map((item, index) => (
                  <div key={item.step} className="flex items-center gap-2 md:gap-3">
                    {/* Node Box */}
                    <div className="flex flex-col items-center justify-between p-3 rounded-2xl bg-gradient-to-b from-indigo-950/50 via-slate-900/90 to-slate-950 border border-indigo-500/35 text-center w-28 md:w-32 shadow-lg hover:border-indigo-400 hover:scale-[1.03] transition-all group">
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-[11px] font-bold text-white leading-tight">{item.step}</span>
                      <span className="text-[9px] text-indigo-300/80 mt-1 leading-snug line-clamp-2">{item.desc}</span>
                      <span className="mt-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                        {item.tech}
                      </span>
                    </div>

                    {/* Animated Arrow (if not last) */}
                    {index < current.flow.length - 1 && (
                      <div className="text-indigo-400 font-black text-base md:text-lg animate-pulse select-none">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Engineering Highlights */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-1.5">
              <span>🚀</span>
              <span>Engineering Highlights & Impact</span>
            </h4>
            <div className="space-y-2">
              {current.highlights.map((detail, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-xs text-[var(--color-text)] leading-relaxed"
                >
                  <span className="text-emerald-400 font-bold text-sm">✓</span>
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>All 4 projects open source on GitHub</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--color-text)] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
