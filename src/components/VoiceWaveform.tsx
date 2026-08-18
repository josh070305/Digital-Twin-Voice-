import type { BotState } from '../utils/voice';

interface VoiceWaveformProps {
  state: BotState;
}

export function VoiceWaveform({ state }: VoiceWaveformProps) {
  const isActive = state === 'listening';

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-8" aria-label="Voice waveform">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-emerald-400 rounded-full waveform-bar"
          style={{
            animationDelay: `${i * 0.12}s`,
            height: '8px',
          }}
        />
      ))}
    </div>
  );
}
