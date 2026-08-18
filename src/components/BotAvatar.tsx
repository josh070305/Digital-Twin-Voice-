import type { BotState, Language } from '../utils/voice';

interface BotAvatarProps {
  state: BotState;
  language?: Language;
}

const LANGUAGE_RIPPLE_COLORS: Record<Language, { border: string; bg: string; glow: string }> = {
  'en-US': {
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    glow: 'rgba(99, 102, 241, 0.45)',
  },
  'hi-IN': {
    border: 'border-emerald-500/35',
    bg: 'bg-emerald-500/15',
    glow: 'rgba(16, 185, 129, 0.5)',
  },
  'fr-FR': {
    border: 'border-sky-500/35',
    bg: 'bg-sky-500/15',
    glow: 'rgba(14, 165, 233, 0.5)',
  },
  'es-ES': {
    border: 'border-rose-500/35',
    bg: 'bg-rose-500/15',
    glow: 'rgba(244, 63, 94, 0.5)',
  },
};

export function BotAvatar({ state, language = 'en-US' }: BotAvatarProps) {
  const rippleTheme = LANGUAGE_RIPPLE_COLORS[language] || LANGUAGE_RIPPLE_COLORS['en-US'];

  const ringClass = () => {
    switch (state) {
      case 'listening':
        return 'ring-emerald-400 shadow-[0_0_50px_rgba(34,197,94,0.35)]';
      case 'thinking':
        return 'ring-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.35)]';
      case 'speaking':
        return 'ring-violet-400';
      case 'error':
        return 'ring-red-400 shadow-[0_0_40px_rgba(239,68,68,0.3)]';
      default:
        return 'ring-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]';
    }
  };

  return (
    <div className="relative flex items-center justify-center animate-intro py-4">
      {/* ── Concentric sound wave ripples when speaking (color coded by language) ── */}
      {state === 'speaking' && (
        <>
          <div
            className={`absolute w-48 h-48 md:w-60 md:h-60 rounded-full border ${rippleTheme.border} ${rippleTheme.bg} animate-ping`}
            style={{ animationDuration: '1.4s' }}
          />
          <div
            className={`absolute w-56 h-56 md:w-72 md:h-72 rounded-full border ${rippleTheme.border} animate-ping`}
            style={{ animationDuration: '2.2s', animationDelay: '0.3s' }}
          />
          <div
            className={`absolute w-64 h-64 md:w-84 md:h-84 rounded-full border ${rippleTheme.border} animate-ping`}
            style={{ animationDuration: '3.0s', animationDelay: '0.6s' }}
          />
          <div
            className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full animate-pulse"
            style={{ backgroundColor: rippleTheme.glow }}
          />
        </>
      )}

      {/* ── Listening ripples ── */}
      {state === 'listening' && (
        <>
          <div
            className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full border border-emerald-500/25 animate-ping"
            style={{ animationDuration: '2s' }}
          />
          <div
            className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-emerald-500/15 animate-ping"
            style={{ animationDuration: '3s' }}
          />
        </>
      )}

      {/* ── Thinking Spinner Ring ── */}
      {state === 'thinking' && (
        <div
          className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full border-2 border-transparent border-t-indigo-500 border-r-pink-400/60 animate-spin"
          style={{ animationDuration: '1.1s' }}
        />
      )}

      {/* ── Main Avatar Circle ── */}
      <div
        className={`
          relative w-36 h-36 md:w-48 md:h-48 rounded-full
          flex items-center justify-center
          ring-4 transition-all duration-500
          ${ringClass()}
          ${state === 'speaking' ? 'animate-pulse' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)',
          backgroundSize: '200% 200%',
          boxShadow: state === 'speaking' ? `0 0 60px ${rippleTheme.glow}` : undefined,
          animation:
            state === 'idle'
              ? 'gradientShift 6s ease infinite, float 4s ease-in-out infinite'
              : state === 'speaking'
              ? 'gradientShift 2.5s ease infinite'
              : undefined,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/15 to-transparent" />
        <span
          className="relative text-5xl md:text-7xl font-extrabold text-white select-none drop-shadow-lg"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          J
        </span>
      </div>
    </div>
  );
}
