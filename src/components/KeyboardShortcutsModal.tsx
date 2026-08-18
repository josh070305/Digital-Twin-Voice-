interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Start or stop voice recording (outside text box)' },
  { key: 'Enter', desc: 'Send typed question' },
  { key: 'Esc', desc: 'Clear input / Cancel voice playback' },
  { key: '?', desc: 'Toggle keyboard shortcuts help' },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl z-10 animate-slide-up">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⌨️</span>
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-glass)] border border-[var(--color-glass-border)]"
            >
              <span className="text-xs text-[var(--color-text)] font-medium">{s.desc}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 text-center border-t border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
