import type { BotState } from '../utils/voice';

interface StatusTextProps {
  state: BotState;
  isRetrying?: boolean;
}

const STATUS_MAP: Record<BotState, { text: string; color: string }> = {
  idle: { text: 'Ready — tap the mic or type below', color: 'text-[var(--color-text-muted)]' },
  listening: { text: 'Listening…', color: 'text-emerald-400' },
  thinking: { text: 'Thinking…', color: 'text-indigo-400' },
  speaking: { text: 'Speaking…', color: 'text-violet-400' },
  error: { text: 'Something went wrong', color: 'text-red-400' },
};

export function StatusText({ state, isRetrying }: StatusTextProps) {
  const base = STATUS_MAP[state];
  const text = state === 'thinking' && isRetrying ? 'Thinking harder…' : base.text;
  const color = base.color;

  return (
    <div className="flex items-center justify-center gap-2 transition-all duration-300">
      {state !== 'idle' && state !== 'error' && (
        <span className={`inline-block w-2 h-2 rounded-full ${
          state === 'listening' ? 'bg-emerald-400' :
          state === 'thinking' ? 'bg-indigo-400' :
          'bg-violet-400'
        } animate-pulse`} />
      )}
      <p className={`text-sm md:text-base font-medium ${color} transition-colors duration-300`}>
        {text}
      </p>
    </div>
  );
}
