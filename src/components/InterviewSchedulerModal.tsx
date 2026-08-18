import { useState } from 'react';

interface InterviewSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InterviewSchedulerModal({ isOpen, onClose }: InterviewSchedulerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    // Store lead in localStorage
    const request = { name, email, message, timestamp: Date.now() };
    const existing = JSON.parse(localStorage.getItem('joshna_interview_requests') || '[]');
    localStorage.setItem('joshna_interview_requests', JSON.stringify([request, ...existing]));

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-slide-up">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <h3 className="text-lg font-bold text-[var(--color-text)]">
                  Schedule an Interview with Joshna
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text)] uppercase tracking-wider">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name / Recruiter Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-xs text-[var(--color-text)] outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text)] uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recruiter@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-xs text-[var(--color-text)] outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[var(--color-text)] uppercase tracking-wider">
                  Message / Role Details
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Role, team, preferred interview times, or question..."
                  className="w-full p-3 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-xs text-[var(--color-text)] outline-none focus:border-indigo-500/50 custom-scrollbar"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
            >
              Send Request
            </button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[var(--color-text)]">
                Interview Request Sent!
              </h4>
              <p className="text-xs text-indigo-300 font-medium">
                Joshna will contact you at <span className="font-mono text-white">joesenthil07@gmail.com</span> within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Contact Info Footer */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border)] space-y-2">
          <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Direct Candidate Contact Info
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] flex items-center gap-2 text-[var(--color-text)]">
              <span>✉️</span>
              <span className="font-mono text-[11px]">joesenthil07@gmail.com</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] flex items-center gap-2 text-[var(--color-text)]">
              <span>📞</span>
              <span className="font-mono text-[11px]">+91 9342214179</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] flex items-center gap-2 text-[var(--color-text)]">
              <span>💼</span>
              <a href="https://linkedin.com/in/joshna-senthil" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                linkedin.com/in/joshna-senthil
              </a>
            </div>
            <div className="p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] flex items-center gap-2 text-[var(--color-text)]">
              <span>🐙</span>
              <a href="https://github.com/josh070305" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                github.com/josh070305
              </a>
            </div>
          </div>

          {isSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              className="w-full mt-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--color-text)] text-xs font-semibold"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
