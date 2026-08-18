import type { Persona } from '../utils/voice';

interface PersonaSelectorProps {
  persona: Persona;
  onChange: (p: Persona) => void;
  disabled?: boolean;
}

const PERSONAS: { id: Persona; label: string; icon: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', icon: '💼', desc: 'Formal & structured' },
  { id: 'casual', label: 'Casual', icon: '✨', desc: 'Friendly & conversational' },
  { id: 'technical', label: 'Technical', icon: '⚡', desc: 'In-depth architecture & tech' },
];

export function PersonaSelector({ persona, onChange, disabled }: PersonaSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--color-glass)] border border-[var(--color-glass-border)] backdrop-blur-md">
      {PERSONAS.map((p) => {
        const isActive = persona === p.id;
        return (
          <button
            key={p.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p.id)}
            title={p.desc}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200
              ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5'
              }
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
