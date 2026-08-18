import type { BotState } from '../utils/voice';

interface MicButtonProps {
  state: BotState;
  onToggle: () => void;
  onCancelSpeaking: () => void;
}

export function MicButton({ state, onToggle, onCancelSpeaking }: MicButtonProps) {
  const isRecording = state === 'listening';
  const isBusy = state === 'thinking' || state === 'speaking';

  const handleClick = () => {
    if (state === 'speaking') onCancelSpeaking();
    else if (!isBusy) onToggle();
  };

  const btnClass = () => {
    if (isRecording) return 'shadow-[0_0_35px_rgba(239,68,68,0.5)]';
    if (state === 'thinking') return 'opacity-60 cursor-wait';
    if (state === 'speaking') return 'shadow-[0_0_30px_rgba(139,92,246,0.4)]';
    return 'shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)]';
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Pulse ring */}
      {isRecording && (
        <div className="absolute w-[88px] h-[88px] rounded-full bg-red-500/20 animate-ping" />
      )}

      <button
        onClick={handleClick}
        disabled={state === 'thinking'}
        className={`relative w-[72px] h-[72px] rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 disabled:cursor-not-allowed ${btnClass()}`}
        style={{
          background: isRecording
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : state === 'speaking'
            ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            : 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)',
        }}
        title="Click to speak"
      >
        {isRecording ? (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : state === 'thinking' ? (
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : state === 'speaking' ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
