interface ErrorOverlayProps {
  error: string | null;
  micPermission: 'granted' | 'denied' | 'prompt';
  lastErrorType?: 'api' | 'language' | null;
  onDismiss?: () => void;
  onRetryInEnglish?: () => void;
  onRetryLast?: () => void;
}

export function ErrorOverlay({
  error,
  micPermission,
  lastErrorType,
  onDismiss,
  onRetryInEnglish,
  onRetryLast,
}: ErrorOverlayProps) {
  if (micPermission === 'denied') {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-bg)]/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Microphone Access Required</h2>
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
            Joshna AI needs microphone permission for voice questions. Alternatively, you can type your questions below.
          </p>
          <div className="bg-[var(--color-glass)] border border-[var(--color-glass-border)] rounded-2xl p-4 text-left mb-6">
            <ol className="text-xs text-[var(--color-text)] space-y-2">
              <li className="flex gap-2"><span className="text-indigo-400 font-mono font-bold">1.</span> Click the lock/tune icon in your browser address bar</li>
              <li className="flex gap-2"><span className="text-indigo-400 font-mono font-bold">2.</span> Set "Microphone" to "Allow"</li>
              <li className="flex gap-2"><span className="text-indigo-400 font-mono font-bold">3.</span> Refresh this page to activate voice mode</li>
            </ol>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-indigo-500/25"
            >
              Refresh Page
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-3 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-semibold transition-colors"
              >
                Use Text Only
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-slide-up max-w-lg w-[90%]">
        <div className="bg-[#1b1528]/95 border border-indigo-500/30 backdrop-blur-2xl rounded-2xl px-5 py-3.5 shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-xs text-slate-200 font-medium truncate">{error}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {lastErrorType === 'language' && onRetryInEnglish && (
              <button
                onClick={onRetryInEnglish}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Try in English
              </button>
            )}

            {onRetryLast && (
              <button
                onClick={onRetryLast}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Try again
              </button>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                title="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
