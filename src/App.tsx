import { useState, useEffect, useMemo } from 'react';
import { useVoiceBot } from './utils/voice';
import { BotAvatar } from './components/BotAvatar';
import { MicButton } from './components/MicButton';
import { StatusText } from './components/StatusText';
import { VoiceWaveform } from './components/VoiceWaveform';
import { AudioSpectrumVisualizer } from './components/AudioSpectrumVisualizer';
import { ConversationHistory } from './components/ConversationHistory';
import { ErrorOverlay } from './components/ErrorOverlay';
import { LanguageSelector } from './components/LanguageSelector';
import { PersonaSelector } from './components/PersonaSelector';
import { SuggestedChips } from './components/SuggestedChips';
import { ThemeToggle } from './components/ThemeToggle';
import { TextInput } from './components/TextInput';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ProjectArchitectureModal } from './components/ProjectArchitectureModal';
import { JobMatcherModal } from './components/JobMatcherModal';
import { InterviewSchedulerModal } from './components/InterviewSchedulerModal';
import { DeveloperTerminalModal } from './components/DeveloperTerminalModal';
import { ResumeDossierModal } from './components/ResumeDossierModal';
import { TechnicalInterviewModal } from './components/TechnicalInterviewModal';
import { DocsModal } from './components/DocsModal';
import { RecruiterToolbar } from './components/RecruiterToolbar';

function App() {
  const {
    state,
    history,
    error,
    micPermission,
    language,
    persona,
    speechSupported,
    isRetrying,
    liveTranscript,
    lastErrorType,
    recruiterFocus,
    updateRecruiterFocus,
    setLanguage,
    setPersona,
    toggleListening,
    cancelSpeaking,
    sendTextQuery,
    retryInEnglish,
    retryLastQuery,
  } = useVoiceBot();

  const [isDark, setIsDark] = useState(() => {
    return (localStorage.getItem('joshna-ai-theme') ?? 'dark') === 'dark';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSessionSummaryOpen, setIsSessionSummaryOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>('digitaltwin');
  const [isJDMatcherOpen, setIsJDMatcherOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(false);

  // Check embed mode: ?embed=true
  const isEmbedMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('embed') === 'true';
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('joshna-ai-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Auto-open drawer on new message (mobile)
  useEffect(() => {
    if (history.length > 0 && window.innerWidth < 1024 && !isEmbedMode) {
      setDrawerOpen(true);
    }
  }, [history.length, isEmbedMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (e.key === '`' && !isInput) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if (e.key === ' ' && !isInput) {
        e.preventDefault();
        toggleListening();
      } else if (e.key === 'Escape') {
        cancelSpeaking();
        setIsSessionSummaryOpen(false);
        setIsShortcutsOpen(false);
        setIsArchitectureOpen(false);
        setIsJDMatcherOpen(false);
        setIsSchedulerOpen(false);
        setIsTerminalOpen(false);
        setIsResumeOpen(false);
        setIsMockInterviewOpen(false);
      } else if (e.key === '?' && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening, cancelSpeaking]);

  const handleInspectArchitecture = (projectId: string) => {
    setActiveProjectId(projectId);
    setIsArchitectureOpen(true);
  };

  const isBusy = state !== 'idle' && state !== 'error';
  const latestExchange = history[0];

  /* ────────────────────────────────────────────────────────── */
  /*  Embed Mode View (?embed=true)                              */
  /* ────────────────────────────────────────────────────────── */
  if (isEmbedMode) {
    return (
      <div className="min-h-dvh bg-[#0d0d14] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="bg-glow" />
        <ErrorOverlay
          error={error}
          micPermission={micPermission}
          lastErrorType={lastErrorType}
          onRetryInEnglish={retryInEnglish}
          onRetryLast={retryLastQuery}
        />

        <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Joshna AI • Embed Twin
            </span>
          </div>

          <BotAvatar state={state} language={language} />
          <AudioSpectrumVisualizer state={state} />

          {/* Live Transcript */}
          {state === 'listening' && liveTranscript && (
            <div className="w-full px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 animate-pulse">
              <span className="font-bold text-indigo-400">Hearing: </span>
              "{liveTranscript}"
            </div>
          )}

          <StatusText state={state} isRetrying={isRetrying} />

          {speechSupported ? (
            <MicButton state={state} onToggle={toggleListening} onCancelSpeaking={cancelSpeaking} />
          ) : null}

          <TextInput onSend={sendTextQuery} disabled={isBusy} />

          {/* Latest Answer Card in Embed Mode */}
          {latestExchange && (
            <div className="w-full mt-2 text-left bg-[#13131f]/90 border border-[#1e1e2e] rounded-2xl p-4 shadow-xl animate-fade-in space-y-2">
              <p className="text-xs font-semibold text-indigo-300">You: {latestExchange.question}</p>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{latestExchange.answer}</p>
              {latestExchange.citation && (
                <p className="text-[10px] text-slate-400">Source: {latestExchange.citation}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────────────────────── */
  /*  Full Standard App Layout                                  */
  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-dvh bg-[var(--color-bg)] transition-colors duration-400">
      {/* Background ambient layers */}
      <div className="bg-animated" />
      <div className="bg-grid" />
      <div className="bg-glow" />

      {/* Error overlay with smart retry recovery */}
      <ErrorOverlay
        error={error}
        micPermission={micPermission}
        lastErrorType={lastErrorType}
        onRetryInEnglish={retryInEnglish}
        onRetryLast={retryLastQuery}
      />

      {/* Modals */}
      <SessionSummaryModal
        isOpen={isSessionSummaryOpen}
        onClose={() => setIsSessionSummaryOpen(false)}
        history={history}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ProjectArchitectureModal
        isOpen={isArchitectureOpen}
        initialProjectId={activeProjectId}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <JobMatcherModal
        isOpen={isJDMatcherOpen}
        onClose={() => setIsJDMatcherOpen(false)}
        onSetRecruiterFocus={updateRecruiterFocus}
      />

      <InterviewSchedulerModal
        isOpen={isSchedulerOpen}
        onClose={() => setIsSchedulerOpen(false)}
      />

      <DeveloperTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      <ResumeDossierModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      <TechnicalInterviewModal
        isOpen={isMockInterviewOpen}
        onClose={() => setIsMockInterviewOpen(false)}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* ── Top Header Navigation Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-6 py-3 lg:pr-[27rem] bg-[var(--color-card)]/40 backdrop-blur-md border-b border-[var(--color-border)]/50">
        {/* Left Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-sm font-black text-white">J</span>
          </div>
          <div>
            <span className="text-sm md:text-base font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Joshna AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
              Digital Twin
            </span>
          </div>
        </div>

        {/* Right Controls: Persona + Language + Shortcuts + Theme */}
        <div className="flex items-center gap-2">
          {/* Persona selector on desktop */}
          <div className="hidden sm:block">
            <PersonaSelector persona={persona} onChange={setPersona} disabled={isBusy} />
          </div>

          <LanguageSelector language={language} onChange={setLanguage} />

          {/* Shortcuts Help Button */}
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-card)]/60 text-[var(--color-text-muted)] hover:text-indigo-400 hover:border-indigo-500/50 transition-all text-xs font-bold backdrop-blur-sm"
            title="Keyboard Shortcuts (?)"
          >
            ?
          </button>

          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>
      </header>

      {/* ── Main App Layout Grid ── */}
      <div className="relative z-10 h-dvh flex flex-col lg:flex-row overflow-hidden">
        {/* ── Center / Left Column: Interactive Voice Avatar & Inputs (Static / Centered) ── */}
        <main className="flex-1 flex flex-col items-center justify-center gap-2 px-6 pt-16 pb-3 max-w-3xl mx-auto w-full h-full overflow-y-auto custom-scrollbar">
          {/* Mobile Persona selector */}
          <div className="sm:hidden w-full flex justify-center mb-1">
            <PersonaSelector persona={persona} onChange={setPersona} disabled={isBusy} />
          </div>

          {/* Header Title */}
          <div className="text-center select-none">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Joshna AI
              </span>
            </h1>
            <p className="text-[11px] md:text-xs text-[var(--color-text-muted)] mt-0.5 font-medium tracking-wide">
              Voice-Enabled Digital Twin • 2026 B.Tech Computer Science Graduate
            </p>
          </div>

          {/* Recruiter Quick Action Toolbar */}
          <div className="w-full">
            <RecruiterToolbar
              onOpenJDMatcher={() => setIsJDMatcherOpen(true)}
              onOpenArchitecture={() => {
                setActiveProjectId('digitaltwin');
                setIsArchitectureOpen(true);
              }}
              onOpenScheduler={() => setIsSchedulerOpen(true)}
              onOpenDocs={() => setIsDocsOpen(true)}
              onOpenTerminal={() => setIsTerminalOpen(true)}
              onOpenResume={() => setIsResumeOpen(true)}
              onOpenMockInterview={() => setIsMockInterviewOpen(true)}
            />
          </div>

          {/* Bot Avatar with language-specific soundwave ripples */}
          <BotAvatar state={state} language={language} />

          {/* Live Audio Spectrum Equalizer */}
          <AudioSpectrumVisualizer state={state} />

          {/* Live Transcript when user speaks */}
          {state === 'listening' && liveTranscript ? (
            <div className="w-full max-w-md px-4 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 animate-pulse text-center">
              <span className="font-bold text-indigo-400">Hearing: </span>
              "{liveTranscript}"
            </div>
          ) : (
            <VoiceWaveform state={state} />
          )}

          {/* Status Text Indicator */}
          <StatusText state={state} isRetrying={isRetrying} />

          {/* Mic Button Area */}
          {speechSupported ? (
            <MicButton state={state} onToggle={toggleListening} onCancelSpeaking={cancelSpeaking} />
          ) : (
            <div className="text-center px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 max-w-sm">
              <p className="text-xs text-amber-400">
                🎤 Voice recognition is not supported in this browser. Please use <strong>Google Chrome</strong> for voice features, or type below.
              </p>
            </div>
          )}

          {/* Always Available Text Input */}
          <TextInput onSend={sendTextQuery} disabled={isBusy} />

          {/* Clickable Quick Suggestion Chips */}
          <SuggestedChips onSelect={sendTextQuery} disabled={isBusy} />

          {/* Mobile Drawer Trigger Button */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-xs font-semibold px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242" />
              </svg>
              <span>View Conversation ({history.length})</span>
            </button>
          )}
        </main>

        {/* ── Desktop Right Column: Full Conversation Panel (Independent Scroll) ── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-96 xl:w-[430px] border-l border-[var(--color-border)] bg-[var(--color-aside)] backdrop-blur-md overflow-hidden min-w-0 pt-16 h-full">
          <div className="h-full flex flex-col overflow-hidden">
            <ConversationHistory
              history={history}
              state={state}
              recruiterFocus={recruiterFocus}
              onEndSession={() => setIsSessionSummaryOpen(true)}
              onInspectArchitecture={handleInspectArchitecture}
            />
          </div>
        </aside>
      </div>

      {/* ── Mobile Slide-Up Conversation Drawer ── */}
      {drawerOpen && (
        <>
          <div
            className="drawer-overlay lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="drawer-panel lg:hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  Conversation Feed
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {history.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[65vh] overflow-hidden">
              <ConversationHistory
                history={history}
                state={state}
                recruiterFocus={recruiterFocus}
                onEndSession={() => {
                  setDrawerOpen(false);
                  setIsSessionSummaryOpen(true);
                }}
                onInspectArchitecture={handleInspectArchitecture}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
