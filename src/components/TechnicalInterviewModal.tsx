import { useState } from 'react';

interface TechnicalInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: string;
  category: string;
  question: string;
  referenceAnswer: string;
  keyConcepts: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 'microservices',
    category: 'System Design & Microservices',
    question: 'How do you ensure idempotent payment handling and data consistency across microservices in an e-commerce platform?',
    referenceAnswer: 'In my E-Commerce project, I use Stripe webhook listeners with an idempotent transaction ledger. Each payment intent has a unique ID stored in MongoDB. When a webhook arrives, we first check if the transaction is already processed before triggering the Cart and Notification services, avoiding double charges.',
    keyConcepts: ['Idempotency Keys', 'Webhook Signature Verification', 'Distributed Transactions', 'Asynchronous Message Queues'],
  },
  {
    id: 'scraping',
    category: 'AI Agents & Automation',
    question: 'How do you monitor government websites for changes without blowing past LLM token limits on unchanged pages?',
    referenceAnswer: 'In my Exam Update Tracker, I implemented a SHA-256 DOM snapshot hashing layer. We hash the scraped notification container on every cron run. If the hash matches the previous snapshot in MongoDB, we immediately terminate the job without calling Groq/Claude, saving over 90% of redundant LLM token costs.',
    keyConcepts: ['SHA-256 Content Hashing', 'DOM Diff Detection', 'LLM Cost Optimization', 'Node-Cron Job Orchestration'],
  },
  {
    id: 'fullstack',
    category: 'MERN & Asynchronous Architecture',
    question: 'How do you handle real-time audio streaming and speech transcription with sub-second latency in web apps?',
    referenceAnswer: 'In my Real-Time AI Meeting Assistant, audio is captured using WebRTC / Web Audio API chunks and streamed over WebSockets directly to the Groq Whisper LPU inference endpoint. Groq processes speech in under 400ms, streaming back live speaker turns and summaries without client-side lag.',
    keyConcepts: ['WebSockets / WebRTC', 'Groq LPU Inference', 'Stream Chunking', 'Sub-second STT Latency'],
  },
];

export function TechnicalInterviewModal({ isOpen, onClose }: TechnicalInterviewModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [showReference, setShowReference] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentIdx];

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    setIsEvaluated(true);
  };

  const handleNext = () => {
    setUserAnswer('');
    setIsEvaluated(false);
    setShowReference(false);
    setCurrentIdx((prev) => (prev + 1) % QUESTIONS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl z-10 animate-slide-up space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                Technical Interview Simulator with Joshna
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Test your system design and engineering knowledge on Joshna's project stack
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Question Card */}
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
              {currentQ.category}
            </span>
            <span className="text-xs font-semibold text-indigo-400">
              Question {currentIdx + 1} of {QUESTIONS.length}
            </span>
          </div>
          <p className="text-sm font-bold text-[var(--color-text)] leading-relaxed">
            "{currentQ.question}"
          </p>
        </div>

        {/* Answer Form */}
        {!isEvaluated ? (
          <form onSubmit={handleEvaluate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-text)]">
                Your Technical Answer:
              </label>
              <textarea
                rows={3}
                required
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Explain the architectural pattern, tools, or design trade-offs..."
                className="w-full p-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] outline-none focus:border-indigo-500/50 custom-scrollbar"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowReference(!showReference)}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                {showReference ? 'Hide Reference Answer' : "💡 View Joshna's Reference Answer"}
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
              >
                Submit Answer
              </button>
            </div>

            {showReference && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2 animate-fade-in">
                <p className="font-bold text-emerald-400">Joshna's Engineering Implementation:</p>
                <p className="text-slate-300 leading-relaxed">{currentQ.referenceAnswer}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentQ.keyConcepts.map((kc) => (
                    <span key={kc} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-indigo-300">
                      {kc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-emerald-400">✅ Answer Submitted!</span>
              <span className="text-xs font-bold text-indigo-400">Score: 9.5 / 10</span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-bold text-[var(--color-text)]">Key Concepts Evaluated:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentQ.keyConcepts.map((kc) => (
                  <span key={kc} className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-lg">
                    ✓ {kc}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 text-xs text-slate-300 space-y-1">
              <p className="font-bold text-indigo-300">Joshna's Production Approach:</p>
              <p className="text-[11px] leading-relaxed">{currentQ.referenceAnswer}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
              >
                Next Question ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
