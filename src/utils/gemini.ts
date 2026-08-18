import type { Chunk } from './search';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Fallback models in priority order.
 * If one hits 429 or 404, we immediately try the next model.
 */
const MODELS = [
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
];

const MAX_RETRIES_PER_MODEL = 2;

export interface GeminiResponse {
  answer: string;
  citation: string;
}

export type Persona = 'professional' | 'casual' | 'technical';

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  'en-US': 'Respond in English only.',
  'hi-IN': 'Respond ONLY in Hindi language using Devanagari script. केवल हिंदी में जवाब दें।',
  'fr-FR': 'Respond ONLY in French language.',
  'es-ES': 'Respond ONLY in Spanish language.',
};

const PERSONA_INSTRUCTIONS: Record<Persona, string> = {
  professional: 'Tone: Professional, direct, articulate, and confident.',
  casual: 'Tone: Friendly, conversational, approachable, and warm.',
  technical: 'Tone: Technical depth, mentioning specific stack details, architecture, and engineering metrics.',
};

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[*\-+•]\s*/gm, '')
    .replace(/^[,;:]\s*/, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Robust fetch with exponential backoff, 429 rate limit handling,
 * and multi-model fallback chain.
 */
async function fetchWithRetry(
  prompt: string,
  onRetry?: (attempt: number, model: string) => void
): Promise<string | null> {
  let attemptCount = 0;

  for (const model of MODELS) {
    for (let i = 0; i < MAX_RETRIES_PER_MODEL; i++) {
      try {
        attemptCount++;
        if (attemptCount > 1) {
          onRetry?.(attemptCount, model);
        }

        const res = await fetch(`${API_BASE}/${model}:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2048, temperature: 0.2 },
          }),
        });

        if (res.status === 429) {
          console.warn(`[Gemini 429 Rate Limit] Model ${model} is rate limited. Trying next model.`);
          break;
        }

        if (res.status === 404) {
          console.warn(`[Gemini 404] Model ${model} unavailable. Trying next model.`);
          break;
        }

        if (res.status === 503) {
          console.warn(`[Gemini 503] Model ${model} overloaded. Backing off...`);
          await sleep(1500 * (i + 1));
          continue;
        }

        if (!res.ok) {
          await sleep(1000);
          continue;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (err) {
        console.warn(`[Gemini Network Error] ${model}:`, err);
        await sleep(1000);
      }
    }
  }

  return null;
}

/**
 * High quality deterministic local RAG synthesis fallback
 * when Gemini API quotas are exhausted (429) or offline.
 * Answers the specific query intent directly without boilerplate.
 */
function generateLocalFallback(
  chunks: Chunk[],
  langCode: string = 'en-US',
  _persona: Persona = 'professional',
  query: string = ''
): GeminiResponse {
  const q = query.toLowerCase();
  const primary = chunks[0] || { id: 'summary', citation: 'Resume — Professional Summary', content: '' };
  let citation = primary.citation;

  // ── HINDI RESPONSES ──
  if (langCode === 'hi-IN') {
    if ((q.includes('typescript') || q.includes('javascript')) && q.includes('project')) {
      citation = 'Resume — Technical Projects — E-Commerce Platform';
      return {
        answer: 'मैंने TypeScript और JavaScript का उपयोग करके ई-कॉमर्स माइक्रोसर्विसेज प्लेटफॉर्म और एग्जाम अपडेट ट्रैकर AI एजेंट बनाया है।',
        citation,
      };
    }
    if (q.includes('education') || q.includes('cgpa') || primary.id === 'education') {
      citation = 'Resume — Education';
      return {
        answer: 'मैंने भारतीदासन विश्वविद्यालय से 8.2 CGPA के साथ 2026 में कंप्यूटर साइंस में बी.टेक पूरा किया है।',
        citation,
      };
    }
    if (q.includes('ecommerce') || primary.id === 'ecommerce') {
      citation = 'Resume — Technical Projects — E-Commerce Platform';
      return {
        answer: 'मैंने Node.js, Express, React, TypeScript और MongoDB के साथ 6 माइक्रोसर्विसेज वाला ई-कॉमर्स प्लेटफॉर्म बनाया है, जिसमें Stripe और Docker शामिल हैं।',
        citation,
      };
    }
    return {
      answer: 'मैं जोशना हूँ, 2026 बी.टेक कंप्यूटर साइंस ग्रेजुएट (8.2 CGPA)। मैं फुल स्टैक MERN और AI/ML इंजीनियरिंग में कुशल हूँ।',
      citation: 'Resume — Professional Summary',
    };
  }

  // ── ENGLISH RESPONSES (Query Intent Routing for Precise, Normal Answers) ──
  if ((q.includes('typescript') || q.includes('javascript')) && (q.includes('project') || q.includes('built') || q.includes('done') || q.includes('make'))) {
    citation = 'Resume — Technical Projects — E-Commerce Platform';
    return {
      answer: 'I built the E-Commerce Microservices Platform (React with Redux & TypeScript) and the Exam Update Tracker AI Agent (React & TypeScript) using TypeScript, JavaScript, Node.js, and Express.',
      citation,
    };
  }

  if (q.includes('typescript') && (q.includes('proficient') || q.includes('skill') || q.includes('know') || q.includes('experience') || q.includes('good'))) {
    citation = 'Resume — Technical Skills';
    return {
      answer: 'Yes, I am proficient in TypeScript. I use it for type-safe frontend architecture with React and Redux Toolkit, as well as backend Node.js microservices.',
      citation,
    };
  }

  if (q.includes('python') && (q.includes('skill') || q.includes('project') || q.includes('proficient') || q.includes('ml') || q.includes('ai'))) {
    citation = 'Resume — Technical Skills';
    return {
      answer: 'I use Python for AI and Machine Learning engineering, developing with TensorFlow, Keras, Scikit-learn, LSTM neural networks, and NLP pipelines.',
      citation,
    };
  }

  if (q.includes('education') || q.includes('cgpa') || q.includes('college') || q.includes('university') || q.includes('degree') || q.includes('study') || primary.id === 'education') {
    citation = 'Resume — Education';
    return {
      answer: 'I completed my B.Tech in Computer Science from Bharathidasan University, Tiruchirappalli in 2026 with a CGPA of 8.2 out of 10 and no standing arrears.',
      citation,
    };
  }

  if (q.includes('ecommerce') || q.includes('commerce') || primary.id === 'ecommerce') {
    citation = 'Resume — Technical Projects — E-Commerce Platform';
    return {
      answer: 'I built a full-stack MERN e-commerce platform with 6 microservices (Auth, Product, Cart, Order, Payment, Notification) using Node.js, Express, React, TypeScript, Stripe, and Docker, maintaining under 200ms average API latency.',
      citation,
    };
  }

  if (q.includes('exam') || q.includes('tracker') || q.includes('scraping') || primary.id === 'exam-tracker') {
    citation = 'GitHub — Exam-Tracker';
    return {
      answer: 'I built the Exam Update Tracker AI Agent to autonomously monitor 6 government exam portals (SSC, RRB, TNPSC, UPSC, IBPS, SBI), parse updates with Groq LLaMA-3.3-70b, and send alerts via Telegram and WhatsApp.',
      citation,
    };
  }

  if (q.includes('meeting') || q.includes('assistant') || primary.id === 'realtime-meeting') {
    citation = 'GitHub — Real-time-AI-meeting-assistant';
    return {
      answer: 'I built the Real-Time AI Meeting Assistant using React, Node.js, MongoDB, and Groq API for sub-second speech transcription and automated meeting summaries.',
      citation,
    };
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || primary.id === 'skills') {
    citation = 'Resume — Technical Skills';
    return {
      answer: 'My technical stack includes Python, SQL, JavaScript, TypeScript, React.js, Node.js, Express.js, MongoDB, REST APIs, JWT, Docker, Git, and GitHub Actions.',
      citation,
    };
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('linkedin') || primary.id === 'contact' || primary.id === 'github') {
    citation = 'Resume — Contact Information';
    return {
      answer: 'You can reach me at joesenthil07@gmail.com, via phone at +91 9342214179, on LinkedIn at linkedin.com/in/joshna-senthil, or view my code on GitHub at github.com/josh070305.',
      citation,
    };
  }

  // Generic summary default
  return {
    answer: 'I am a 2026 B.Tech Computer Science graduate from Bharathidasan University (CGPA 8.2) with hands-on expertise in Full Stack MERN development, Docker, and AI/ML engineering.',
    citation: 'Resume — Professional Summary',
  };
}

export async function askGemini(
  query: string,
  chunks: Chunk[],
  langCode: string = 'en-US',
  persona: Persona = 'professional',
  onRetry?: (attempt: number, model: string) => void
): Promise<GeminiResponse> {
  const fallbackCitation = chunks[0]?.citation || 'Resume — Professional Summary';

  if (!GEMINI_KEY) {
    return generateLocalFallback(chunks, langCode, persona, query);
  }

  const context = chunks.map((c) => `• [${c.citation}]: ${c.content}`).join('\n\n');
  const langRule = LANGUAGE_INSTRUCTIONS[langCode] || LANGUAGE_INSTRUCTIONS['en-US'];
  const personaRule = PERSONA_INSTRUCTIONS[persona] || PERSONA_INSTRUCTIONS.professional;

  const prompt = `${langRule}
${personaRule}

You are Joshna speaking in the first person ("I", "my").
Answer ONLY the specific question asked in 2-3 complete, well-formed, natural sentences using the verified facts below.
Ensure your response ends with proper sentence punctuation and is fully completed.
Do NOT give unrequested background information or recite unrelated parts of your resume.

Verified Information:
${context}

User Question: "${query}"

Your Direct Response (as Joshna):`;

  const rawText = await fetchWithRetry(prompt, onRetry);

  if (!rawText || !rawText.trim()) {
    console.log('[Gemini API 429/Offline] Using instant Knowledge Base synthesis fallback.');
    return generateLocalFallback(chunks, langCode, persona, query);
  }

  const cleaned = stripMarkdown(rawText);

  if (!cleaned || cleaned.length < 10) {
    return generateLocalFallback(chunks, langCode, persona, query);
  }

  return { answer: cleaned, citation: fallbackCitation };
}
