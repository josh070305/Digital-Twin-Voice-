import { useRef, useEffect, useState } from 'react';
import type { Exchange, BotState } from '../utils/voice';
import { CitationCard } from './CitationCard';

interface ConversationHistoryProps {
  history: Exchange[];
  state: BotState;
  onEndSession?: () => void;
  onInspectArchitecture?: (projectId: string) => void;
}

function exportConversation(history: Exchange[]) {
  const lines = history
    .slice()
    .reverse()
    .map((ex) => {
      const t = new Date(ex.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let b = `[${t}] You: ${ex.question}\n[${t}] Joshna AI: ${ex.answer}\n`;
      if (ex.citation) b += `  📎 Source: ${ex.citation}\n`;
      if (ex.confidence) b += `  📊 Match Confidence: ${ex.confidence}%\n`;
      return b;
    })
    .join('\n---\n\n');

  const blob = new Blob([`Joshna AI — Complete Conversation\n${'='.repeat(45)}\n\n${lines}`], {
    type: 'text/plain;charset=utf-8',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `joshna-ai-session-${Date.now()}.txt`;
  a.click();
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[var(--color-text-muted)] hover:text-indigo-400 transition-colors p-1 rounded"
      title="Copy answer"
    >
      {copied ? (
        <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-[10px] font-bold text-white">J</span>
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 typing-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConversationHistory({
  history,
  state,
  onEndSession,
  onInspectArchitecture,
}: ConversationHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [history.length, state]);

  if (history.length === 0 && state !== 'thinking') {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3.5">
          <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.534 1.11.266 1.666l-.77 1.603a.75.75 0 00.99.99l1.603-.77c.556-.268 1.22-.166 1.666.266A8.932 8.932 0 0012 20.25z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-1">Conversation Feed</h3>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs leading-relaxed">
          Questions and responses appear here with verified source citations.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top action bar: counter + End Session + Export */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-glass)]">
        <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
          {history.length} {history.length === 1 ? 'question' : 'questions'} asked
        </span>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && onEndSession && (
            <button
              type="button"
              onClick={onEndSession}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300 hover:bg-pink-500/25 transition-colors flex items-center gap-1"
            >
              <span>📊</span>
              <span>End Session</span>
            </button>
          )}

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => exportConversation(history)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-indigo-400 hover:border-indigo-500/40 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed — 100% full text, no max-height or line-clamp */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-3.5 py-3.5 space-y-4"
        style={{ height: 'calc(100% - 44px)' }}
      >
        {state === 'thinking' && <TypingIndicator />}

        {history.map((ex) => (
          <div key={ex.id} className="flex flex-col gap-3 animate-fade-in w-full">
            {/* User message (Right-aligned) */}
            <div className="flex justify-end w-full">
              <div
                className="rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[88%] shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.35), rgba(168, 85, 247, 0.25))',
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                }}
              >
                <p className="text-xs md:text-sm text-indigo-50 leading-relaxed break-words whitespace-pre-wrap">
                  {ex.question}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  {ex.persona && (
                    <span className="text-[9px] font-semibold text-indigo-300/70 uppercase">
                      {ex.persona}
                    </span>
                  )}
                  <span className="text-[9px] text-indigo-300/60 ml-auto">
                    {new Date(ex.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Bot message (Left-aligned) — Full text, no clamp */}
            <div className="flex justify-start w-full">
              <div className="flex gap-2.5 w-full min-w-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                  <span className="text-[10px] font-bold text-white">J</span>
                </div>
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                  <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl rounded-bl-md p-3.5 shadow-sm">
                    <p className="text-xs md:text-sm text-[var(--color-text)] leading-relaxed break-words whitespace-pre-wrap">
                      {ex.answer}
                    </p>
                    <div className="flex justify-end mt-1.5 pt-1 border-t border-white/5">
                      <CopyButton text={ex.answer} />
                    </div>
                  </div>

                  {/* Citation Card */}
                  {ex.citation && (
                    <CitationCard
                      citation={ex.citation}
                      section={ex.chunks[0]?.section}
                      content={ex.chunks[0]?.content}
                      confidence={ex.confidence}
                      onInspectArchitecture={onInspectArchitecture}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
