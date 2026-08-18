interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocCard {
  title: string;
  icon: string;
  link: string;
  description: string;
}

const DOCS_CARDS: DocCard[] = [
  {
    title: 'GitHub Profile',
    icon: '🐙',
    link: 'https://github.com/josh070305',
    description: 'All projects with code',
  },
  {
    title: 'Proof Resume',
    icon: '📜',
    link: 'https://proof.zeromaintenanceengineer.in/cv/joesenthil07',
    description: '10-day verified reasoning log',
  },
  {
    title: 'E-Commerce Platform',
    icon: '🛒',
    link: 'https://github.com/josh070305/e--commerce-microservices',
    description: '6-service MERN microservices',
  },
  {
    title: 'Digital Twin Bot',
    icon: '🎙️',
    link: 'https://github.com/josh070305/Digital-Twin-Voice-',
    description: 'This project — voice + RAG + citations',
  },
];

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📚</span>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                Joshna's Portfolio & Docs
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Verified repositories, live production systems, and engineering dossiers
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
          {DOCS_CARDS.map((card) => (
            <div
              key={card.title}
              className="p-4 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] flex flex-col justify-between gap-3 hover:border-indigo-500/40 transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{card.icon}</span>
                  <h4 className="text-sm font-bold text-[var(--color-text)] group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h4>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
                  {card.link.replace('https://', '')}
                </span>
                <a
                  href={card.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1"
                >
                  <span>Open</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>All repositories open source & verified</span>
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
