import { useEffect, useRef } from 'react';
import type { BotState } from '../utils/voice';

interface AudioSpectrumVisualizerProps {
  state: BotState;
}

export function AudioSpectrumVisualizer({ state }: AudioSpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isActive = state === 'listening' || state === 'speaking';

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;
    const barCount = 28;

    const render = () => {
      phase += 0.08;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        // Multi-frequency simulated wave
        const freq1 = Math.sin(phase + i * 0.35);
        const freq2 = Math.cos(phase * 1.5 + i * 0.2);
        const intensity = state === 'speaking' ? 0.9 : 0.65;
        const normalized = Math.abs(freq1 * 0.6 + freq2 * 0.4) * intensity;
        const barHeight = Math.max(normalized * height * 0.85, 4);

        const x = i * (barWidth + 3);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (state === 'speaking') {
          gradient.addColorStop(0, '#818cf8');
          gradient.addColorStop(0.5, '#c084fc');
          gradient.addColorStop(1, '#f472b6');
        } else {
          gradient.addColorStop(0, '#34d399');
          gradient.addColorStop(0.5, '#6ee7b7');
          gradient.addColorStop(1, '#3b82f6');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, state]);

  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center h-9 my-1">
      <canvas
        ref={canvasRef}
        width={260}
        height={36}
        className="rounded-xl shadow-xs"
      />
    </div>
  );
}
