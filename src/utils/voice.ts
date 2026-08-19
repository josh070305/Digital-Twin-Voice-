import { useState, useCallback, useRef, useEffect } from 'react';
import { searchKnowledge, type Chunk } from './search';
import {
  askGemini,
  type Persona,
  getRecruiterFocus,
  setRecruiterFocus,
  getQuestionCount,
  incrementQuestionCount,
} from './gemini';

export type BotState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type Language = 'en-US' | 'hi-IN' | 'fr-FR' | 'es-ES';
export type { Persona } from './gemini';

export const LANGUAGES: { code: Language; label: string; name: string }[] = [
  { code: 'en-US', label: '🇬🇧', name: 'English' },
  { code: 'hi-IN', label: '🇮🇳', name: 'Hindi' },
  { code: 'fr-FR', label: '🇫🇷', name: 'French' },
  { code: 'es-ES', label: '🇪🇸', name: 'Spanish' },
];

export interface Exchange {
  id: string;
  question: string;
  answer: string;
  citation: string;
  chunks: Chunk[];
  confidence: number;
  timestamp: number;
  persona?: Persona;
}

/* ── Web Speech API Types ── */
interface SREvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SRErrEvent extends Event {
  error: string;
}
type SRInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrEvent) => void) | null;
  onend: (() => void) | null;
};

function getSRCtor(): (new () => SRInstance) | null {
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SRInstance) | null;
}

/* ── TTS Helper ── */
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length > 0) return resolve(existing);

    const onVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        window.speechSynthesis.onvoiceschanged = null;
        resolve(v);
      }
    };

    window.speechSynthesis.onvoiceschanged = onVoices;
    setTimeout(() => {
      resolve(window.speechSynthesis.getVoices() || []);
    }, 350);
  });
}

function findBestVoice(voices: SpeechSynthesisVoice[], lang: Language): SpeechSynthesisVoice | null {
  if (!voices.length) return null;

  if (lang === 'hi-IN') {
    return (
      voices.find((v) => {
        const l = v.lang.toLowerCase();
        const n = v.name.toLowerCase();
        return (
          l.startsWith('hi') ||
          n.includes('hindi') ||
          n.includes('हिन्दी') ||
          n.includes('kalpana') ||
          n.includes('hemant')
        );
      }) || null
    );
  }

  if (lang === 'fr-FR') {
    return (
      voices.find((v) => {
        const l = v.lang.toLowerCase();
        const n = v.name.toLowerCase();
        return l.startsWith('fr') || n.includes('french') || n.includes('français');
      }) || null
    );
  }

  if (lang === 'es-ES') {
    return (
      voices.find((v) => {
        const l = v.lang.toLowerCase();
        const n = v.name.toLowerCase();
        return l.startsWith('es') || n.includes('spanish') || n.includes('español');
      }) || null
    );
  }

  // English
  return (
    voices.find((v) => v.lang.toLowerCase() === 'en-us' && (v.name.includes('Google') || v.name.includes('Natural'))) ||
    voices.find((v) => v.lang.toLowerCase().startsWith('en')) ||
    null
  );
}

async function speakAnswer(text: string, lang: Language): Promise<void> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const voices = await getVoicesAsync();

  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = lang;

    const matchedVoice = findBestVoice(voices, lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || lang;
    }

    const timer = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        clearInterval(timer);
      }
    }, 6000);

    utterance.onend = () => {
      clearInterval(timer);
      resolve();
    };
    utterance.onerror = () => {
      clearInterval(timer);
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

function calcConfidence(chunks: Chunk[]): number {
  if (!chunks.length) return 0;
  const top = chunks[0]?.score ?? 1;
  return Math.min(Math.max(Math.round((top / 8) * 100 + 40), 55), 98);
}

/* ── Main Voice Bot Hook ── */
export function useVoiceBot() {
  const [state, setState] = useState<BotState>('idle');
  const [history, setHistory] = useState<Exchange[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [language, setLanguage] = useState<Language>('en-US');
  const [persona, setPersona] = useState<Persona>('professional');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastErrorType, setLastErrorType] = useState<'api' | 'language' | null>(null);

  const recRef = useRef<SRInstance | null>(null);
  const listeningRef = useRef(false);
  const langRef = useRef(language);
  const personaRef = useRef(persona);
  const coveredTopicsRef = useRef<Set<string>>(new Set());
  const lastQueryRef = useRef<string>('');

  useEffect(() => {
    langRef.current = language;
  }, [language]);

  useEffect(() => {
    personaRef.current = persona;
  }, [persona]);

  useEffect(() => {
    setSpeechSupported(!!getSRCtor());
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then((s) => {
        setMicPermission(s.state as 'granted' | 'denied' | 'prompt');
        s.onchange = () => setMicPermission(s.state as 'granted' | 'denied' | 'prompt');
      })
      .catch(() => {});
  }, []);

  const addToHistory = (
    question: string,
    answer: string,
    citation: string,
    chunks: Chunk[],
    confidence: number
  ) => {
    setHistory((prev) => [
      {
        id: Date.now().toString(),
        question,
        answer,
        citation,
        chunks,
        confidence,
        timestamp: Date.now(),
        persona: personaRef.current,
      },
      ...prev,
    ]);
  };

  const [recruiterFocus, setRecruiterFocusState] = useState<string>(() => getRecruiterFocus());

  const updateRecruiterFocus = useCallback((focus: string) => {
    setRecruiterFocus(focus);
    setRecruiterFocusState(focus);
  }, []);

  const getProactiveFollowUp = useCallback((primaryChunkId?: string, query: string = ''): string | null => {
    const qCount = getQuestionCount();
    // After every 2nd question, add a natural follow-up
    if (qCount <= 1 || qCount % 2 !== 0) return null;

    const q = query.toLowerCase();
    const id = primaryChunkId || '';

    // Projects follow-up
    if (
      q.includes('project') ||
      id.includes('project') ||
      id.includes('ecommerce') ||
      id.includes('meeting') ||
      id.includes('tracker')
    ) {
      if (langRef.current === 'hi-IN') return ' क्या आप इनमें से किसी प्रोजेक्ट के बारे में अधिक विवरण जानना चाहेंगे?';
      if (langRef.current === 'fr-FR') return ' Souhaitez-vous plus de détails sur l\'un de ces projets ?';
      if (langRef.current === 'es-ES') return ' ¿Desea más detalles sobre alguno de estos proyectos?';
      return ' Would you like more detail on any of these?';
    }

    // Skills follow-up
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || id === 'skills') {
      if (langRef.current === 'hi-IN') return ' क्या कोई विशेष तकनीक है जिसके बारे में आप विस्तार से जानना चाहेंगे?';
      if (langRef.current === 'fr-FR') return ' Y a-t-il une technologie spécifique sur laquelle vous souhaitez en savoir plus ?';
      if (langRef.current === 'es-ES') return ' ¿Hay alguna tecnología específica sobre la que le gustaría que profundice?';
      return " Is there a specific technology you'd like me to elaborate on?";
    }

    // Education follow-up
    if (
      q.includes('education') ||
      q.includes('college') ||
      q.includes('degree') ||
      q.includes('university') ||
      id === 'education'
    ) {
      if (langRef.current === 'hi-IN') return ' डिग्री के साथ-साथ मेरे पास प्रैक्टिकल प्रोजेक्ट अनुभव भी है — क्या आप एक उदाहरण देखना चाहेंगे?';
      if (langRef.current === 'fr-FR') return ' J\'ai également une expérience pratique sur des projets en plus de mon diplôme — voulez-vous que je vous en présente un ?';
      if (langRef.current === 'es-ES') return ' También tengo experiencia práctica en proyectos junto con mi carrera, ¿quiere que le explique uno?';
      return ' I also have hands-on project experience alongside my degree — want me to walk through one?';
    }

    // General / Experience follow-up
    if (langRef.current === 'hi-IN') return ' यदि आपकी टीम के लिए उपयोगी हो तो मुझे किसी भी क्षेत्र में विस्तार से बताने में खुशी होगी।';
    if (langRef.current === 'fr-FR') return ' Ravi d\'approfondir tout domaine spécifique s\'il est pertinent pour votre équipe.';
    if (langRef.current === 'es-ES') return ' Con gusto profundizaré en cualquier área específica si es relevante para su equipo.';
    return " Happy to go deeper on any specific area if it's relevant to your team.";
  }, []);

  const processQuery = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return;

      lastQueryRef.current = transcript;
      setState('thinking');
      setLastErrorType(null);
      setLiveTranscript('');

      try {
        // ── ADAPTIVE RECRUITER MODE: Capture answer to recruiter focus follow-up ──
        if (getQuestionCount() === 1 && !getRecruiterFocus()) {
          const cleanFocus = transcript.trim();
          setRecruiterFocus(cleanFocus);
          setRecruiterFocusState(cleanFocus);
          incrementQuestionCount();

          const ack = "Perfect — I'll make sure to highlight that in everything I share with you.";
          setState('speaking');
          await speakAnswer(ack, langRef.current);
          addToHistory(transcript, ack, 'Adaptive Recruiter Profile', [], 100);
          setState('idle');
          return;
        }

        incrementQuestionCount();

        const chunks = searchKnowledge(transcript);
        const confidence = calcConfidence(chunks);

        chunks.forEach((c) => coveredTopicsRef.current.add(c.id));

        if (!chunks.length) {
          const fb =
            langRef.current === 'hi-IN'
              ? 'मेरे पास अभी वह जानकारी नहीं है। कृपया मेरे प्रोजेक्ट्स, स्किल्स या शिक्षा के बारे में पूछें!'
              : "I don't have that specific information right now. Feel free to ask about my projects, skills, or education!";

          setState('speaking');
          await speakAnswer(fb, langRef.current);
          addToHistory(transcript, fb, '', [], 0);
          setState('idle');
          return;
        }

        const { answer, citation } = await askGemini(
          transcript,
          chunks,
          langRef.current,
          personaRef.current,
          (attempt, model) => {
            console.log(`[Gemini Retry] Attempt ${attempt + 1} using ${model}`);
            setIsRetrying(true);
          }
        );

        setIsRetrying(false);

        if (answer === "I'm having a moment, please try again shortly.") {
          setLastErrorType('api');
          setError("I'm having a moment. Please try again shortly.");
          setState('error');
          setTimeout(() => {
            setError(null);
            setState('idle');
          }, 5000);
          return;
        }

        const followUp = getProactiveFollowUp(chunks[0]?.id, transcript);
        const finalAnswer = followUp ? answer + followUp : answer;

        setState('speaking');
        await speakAnswer(finalAnswer, langRef.current);
        addToHistory(transcript, finalAnswer, citation, chunks, confidence);
        setState('idle');

        // ── ADAPTIVE RECRUITER MODE: Automatic follow-up after the 1st answer ──
        if (getQuestionCount() === 1 && !getRecruiterFocus()) {
          setTimeout(async () => {
            const recruiterFollowUp =
              "Thanks for asking! To help me give you the most relevant answers — what matters most to your team right now? AI and ML work, full-stack development, or system architecture?";
            setState('speaking');
            await speakAnswer(recruiterFollowUp, langRef.current);
            addToHistory('', recruiterFollowUp, 'Adaptive Recruiter Mode', [], 100);
            setState('idle');
          }, 1500);
        }
      } catch (err) {
        console.error('Voice bot processing error:', err);
        setIsRetrying(false);
        const errStr = String(err);

        if (langRef.current !== 'en-US' && (errStr.includes('language') || errStr.includes('Gemini'))) {
          setLastErrorType('language');
          setError('Response error. You can try in English or retry.');
        } else {
          setLastErrorType('api');
          setError('Unable to reach the assistant. Please try again.');
        }

        setState('error');
        setTimeout(() => {
          setError(null);
          setState('idle');
        }, 5000);
      }
    },
    [getProactiveFollowUp]
  );

  const retryInEnglish = useCallback(() => {
    const q = lastQueryRef.current || history[0]?.question;
    if (q) {
      setLanguage('en-US');
      langRef.current = 'en-US';
      setError(null);
      setLastErrorType(null);
      processQuery(q);
    }
  }, [history, processQuery]);

  const retryLastQuery = useCallback(() => {
    const q = lastQueryRef.current || history[0]?.question;
    if (q) {
      setError(null);
      setLastErrorType(null);
      processQuery(q);
    }
  }, [history, processQuery]);

  const startListening = useCallback(() => {
    const Ctor = getSRCtor();
    if (!Ctor) {
      setSpeechSupported(false);
      setError('Voice not supported in this browser. Please use Chrome for voice features.');
      setState('error');
      setTimeout(() => {
        setError(null);
        setState('idle');
      }, 3000);
      return;
    }

    if (listeningRef.current) return;

    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true; // Live transcript enabled
    rec.lang = langRef.current;

    rec.onresult = (e: SREvent) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < e.results.length; i++) {
        const item = e.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (final) {
        listeningRef.current = false;
        setLiveTranscript('');
        processQuery(final);
      } else {
        setLiveTranscript(interim);
      }
    };

    rec.onerror = (e: SRErrEvent) => {
      listeningRef.current = false;
      setLiveTranscript('');

      if (e.error === 'not-allowed') {
        setMicPermission('denied');
        setError('Microphone access denied.');
      } else if (e.error === 'no-speech') {
        setState('idle');
      } else if (e.error === 'network') {
        setError('Speech network error. You can type your question below.');
        setState('error');
        setTimeout(() => {
          setError(null);
          setState('idle');
        }, 3500);
      } else {
        setError(`Speech error: ${e.error}. Try typing below.`);
        setState('error');
        setTimeout(() => {
          setError(null);
          setState('idle');
        }, 3500);
      }
    };

    rec.onend = () => {
      listeningRef.current = false;
      setLiveTranscript('');
      setState((p) => (p === 'listening' ? 'idle' : p));
    };

    recRef.current = rec;
    listeningRef.current = true;
    setState('listening');
    setError(null);
    rec.start();
  }, [processQuery]);

  const stopListening = useCallback(() => {
    if (recRef.current && listeningRef.current) {
      recRef.current.stop();
      listeningRef.current = false;
      setLiveTranscript('');
      setState('idle');
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (listeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  const cancelSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setState('idle');
  }, []);

  const sendTextQuery = useCallback(
    (text: string) => {
      if (text.trim()) {
        processQuery(text.trim());
      }
    },
    [processQuery]
  );

  return {
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
  };
}
