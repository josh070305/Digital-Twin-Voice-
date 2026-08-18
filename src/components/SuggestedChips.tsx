interface SuggestedChipsProps {
  onSelect: (q: string) => void;
  disabled: boolean;
}

const SUGGESTIONS = [
  "What projects have you built?",
  "Tell me about your Exam Tracker AI Agent",
  "Tell me about your Real-Time Meeting Assistant",
  "How does your E-Commerce Platform work?",
  "What is your complete technical stack?",
  "Tell me about your education and CGPA",
];

export function SuggestedChips({ onSelect, disabled }: SuggestedChipsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
      {SUGGESTIONS.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="text-[11px] md:text-xs px-3.5 py-1.5 rounded-full border border-[var(--color-glass-border)] bg-[var(--color-glass)] backdrop-blur-md text-[var(--color-text-muted)] hover:bg-white/10 hover:border-indigo-500/30 hover:text-[var(--color-text)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
