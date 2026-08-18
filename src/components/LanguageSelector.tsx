import { LANGUAGES, type Language } from '../utils/voice';

interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
}

export function LanguageSelector({ language, onChange }: LanguageSelectorProps) {
  return (
    <div className="relative">
      <select
        id="language-selector"
        value={language}
        onChange={(e) => onChange(e.target.value as Language)}
        className="appearance-none bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] text-sm rounded-xl px-3 py-2 pr-8 cursor-pointer hover:border-indigo-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label} {l.name}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}
