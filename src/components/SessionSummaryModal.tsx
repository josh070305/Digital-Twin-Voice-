import type { Exchange } from '../utils/voice';

interface SessionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: Exchange[];
}

export function SessionSummaryModal({ isOpen, onClose, history }: SessionSummaryModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const citationsUsed = Array.from(
    new Set(history.map((h) => h.citation).filter(Boolean))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-slide-up print:m-0 print:p-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Session Summary
              </h2>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Joshna AI — Digital Twin Conversation Report
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24-3.144 2.148-5.829 5.28-5.829s5.52 2.685 5.28 5.829m-10.56 0A5.986 5.986 0 0012 18a5.986 5.986 0 005.28-4.171m-10.56 0c.24-3.144 2.148-5.829 5.28-5.829s5.52 2.685 5.28 5.829" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              </svg>
              <span>Download as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-center">
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              {history.length}
            </span>
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase mt-0.5">
              Questions Asked
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-center">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {citationsUsed.length}
            </span>
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase mt-0.5">
              Citations Referenced
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] text-center">
            <span className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {history.length > 0
                ? Math.round(history.reduce((a, b) => a + (b.confidence || 85), 0) / history.length)
                : 0}
              %
            </span>
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase mt-0.5">
              Avg Match Quality
            </p>
          </div>
        </div>

        {/* Citations List */}
        {citationsUsed.length > 0 && (
          <div className="mb-4 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1.5">
              Referenced Knowledge Chunks:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {citationsUsed.map((cit) => (
                <span
                  key={cit}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {cit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Scrollable Conversation Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {history.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
              No questions asked in this session yet.
            </p>
          ) : (
            history.slice().reverse().map((ex, idx) => (
              <div
                key={ex.id}
                className="p-3.5 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-indigo-400">Q#{idx + 1}</span>
                  <span className="text-[var(--color-text-muted)]">
                    {new Date(ex.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {ex.question}
                </p>
                <div className="p-2.5 rounded-xl bg-[var(--color-card)]/70 border border-white/5 text-xs text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                  {ex.answer}
                </div>
                {ex.citation && (
                  <p className="text-[10px] font-medium text-[var(--color-text-muted)]">
                    Source: <span className="text-indigo-300">{ex.citation}</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>Joshna • 2026 B.Tech CSE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[var(--color-text)] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
