interface RecruiterToolbarProps {
  onOpenJDMatcher: () => void;
  onOpenArchitecture: () => void;
  onOpenScheduler: () => void;
  onOpenDocs: () => void;
  onOpenTerminal?: () => void;
  onOpenResume?: () => void;
  onOpenMockInterview?: () => void;
}

export function RecruiterToolbar({
  onOpenJDMatcher,
  onOpenArchitecture,
  onOpenScheduler,
  onOpenDocs,
  onOpenTerminal,
  onOpenResume,
  onOpenMockInterview,
}: RecruiterToolbarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[var(--color-card)]/95 border border-[var(--color-border)] backdrop-blur-xl shadow-2xl overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-2 flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">Recruiter Suite:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
        {/* 1. MATCH MY JD */}
        <button
          type="button"
          onClick={onOpenJDMatcher}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 whitespace-nowrap transition-all duration-200"
        >
          <span>🎯</span>
          <span>Match My JD</span>
        </button>

        {/* 2. ARCHITECTURES */}
        <button
          type="button"
          onClick={onOpenArchitecture}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold whitespace-nowrap transition-all duration-200"
        >
          <span>🏗️</span>
          <span>Architectures</span>
        </button>

        {/* 3. BOOK INTERVIEW */}
        <button
          type="button"
          onClick={onOpenScheduler}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-300 text-xs font-semibold whitespace-nowrap transition-all duration-200"
        >
          <span>📅</span>
          <span>Book Interview</span>
        </button>

        {/* 4. DOCS */}
        <button
          type="button"
          onClick={onOpenDocs}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold whitespace-nowrap transition-all duration-200"
        >
          <span>📚</span>
          <span>Docs</span>
        </button>

        {/* Extra Power Tools */}
        {onOpenResume && (
          <button
            type="button"
            onClick={onOpenResume}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium whitespace-nowrap transition-all"
            title="View 1-page ATS resume PDF"
          >
            <span>📄</span>
            <span className="hidden md:inline">ATS Resume</span>
          </button>
        )}

        {onOpenTerminal && (
          <button
            type="button"
            onClick={onOpenTerminal}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-medium whitespace-nowrap font-mono transition-all"
            title="Open CLI terminal (`)"
          >
            <span>💻</span>
            <span className="hidden md:inline">CLI</span>
          </button>
        )}

        {onOpenMockInterview && (
          <button
            type="button"
            onClick={onOpenMockInterview}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-medium whitespace-nowrap transition-all"
            title="Take Mock Interview Quiz"
          >
            <span>🎓</span>
            <span className="hidden md:inline">Mock Quiz</span>
          </button>
        )}
      </div>
    </div>
  );
}
