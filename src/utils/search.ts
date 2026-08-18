import knowledge from '../data/knowledge.json';

export interface Chunk {
  id: string;
  section: string;
  content: string;
  citation: string;
  score?: number;
}

const knowledgeBase = knowledge as Chunk[];

/** Common stop words to ignore during search */
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
  'in', 'with', 'to', 'for', 'of', 'not', 'no', 'can', 'do', 'does',
  'did', 'has', 'have', 'had', 'be', 'was', 'were', 'been', 'are',
  'what', 'who', 'how', 'where', 'when', 'why', 'tell', 'about', 'say',
  'me', 'her', 'his', 'she', 'he', 'they', 'you', 'your', 'their',
  'like', 'just', 'also', 'very', 'much', 'some', 'any', 'all',
]);

/**
 * Name aliases — speech recognition often mishears "Joshna" as
 * "Joshua", "Joshna", "Josh" etc. We treat them all as equivalent.
 */
const NAME_ALIASES = new Set([
  'joshna', 'joshua', 'josh', 'joshnas', 'joshuas', 'joshs',
]);

/**
 * Synonym map — maps common query words to related terms that
 * appear in the knowledge base content.
 */
const SYNONYMS: Record<string, string[]> = {
  project: ['platform', 'tool', 'built', 'microservices', 'assistant', 'meeting', 'exam', 'tracker', 'agent'],
  projects: ['platform', 'tool', 'built', 'microservices', 'assistant', 'meeting', 'exam', 'tracker', 'agent'],
  commerce: ['ecommerce', 'e-commerce', 'microservices', 'stripe', 'cart', 'order', 'product', 'jwt', 'docker'],
  ecommerce: ['commerce', 'e-commerce', 'microservices', 'stripe', 'cart', 'order', 'product', 'jwt', 'docker'],
  'e-commerce': ['commerce', 'ecommerce', 'microservices', 'stripe', 'cart', 'order', 'product', 'jwt', 'docker'],
  meeting: ['assistant', 'real-time', 'transcription', 'summaries', 'groq'],
  assistant: ['meeting', 'real-time', 'voice', 'bot', 'gemini', 'twin', 'tracker'],
  exam: ['tracker', 'recruitment', 'alerts', 'scraping', 'cheerio', 'telegram', 'whatsapp', 'ssc', 'upsc'],
  tracker: ['exam', 'recruitment', 'alerts', 'scraping', 'agent', 'cheerio', 'telegram'],
  scraping: ['cheerio', 'axios', 'exam', 'tracker', 'scrapers', 'cron'],
  agent: ['ai', 'autonomous', 'pipeline', 'exam', 'tracker', 'bot'],
  skill: ['skills', 'technical', 'proficient', 'languages', 'python', 'react'],
  skills: ['technical', 'proficient', 'languages', 'python', 'react', 'stack'],
  tech: ['technical', 'react', 'python', 'node', 'typescript', 'stack'],
  stack: ['technical', 'react', 'python', 'node', 'typescript', 'full'],
  typescript: ['ecommerce', 'exam-tracker', 'skills', 'react', 'redux', 'full-stack'],
  javascript: ['ecommerce', 'exam-tracker', 'realtime-meeting', 'skills', 'node', 'express', 'react'],
  python: ['tensorflow', 'keras', 'lstm', 'nlp', 'skills', 'ai', 'ml', 'scikit-learn'],
  react: ['ecommerce', 'exam-tracker', 'realtime-meeting', 'frontend', 'skills', 'redux'],
  docker: ['ecommerce', 'skills', 'devops', 'microservices'],
  education: ['university', 'bharathidasan', 'btech', 'cgpa', 'graduate', 'degree', 'tiruchirappalli', 'college'],
  cgpa: ['education', 'university', 'btech', 'score', 'grades', 'bharathidasan', '8.2'],
  study: ['university', 'btech', 'cgpa', 'graduate', 'degree'],
  college: ['university', 'bharathidasan', 'btech', 'education', 'degree'],
  contact: ['email', 'phone', 'linkedin', 'github'],
  reach: ['email', 'phone', 'linkedin', 'github'],
  email: ['joesenthil07', 'gmail', 'contact'],
  location: ['coimbatore', 'chennai', 'bangalore', 'tamil'],
  experience: ['built', 'expertise', 'proficient', 'hands-on'],
  work: ['built', 'expertise', 'proficient', 'microservices', 'platform', 'meeting', 'exam', 'ecommerce'],
};

/**
 * Expands query words with synonyms for better matching.
 */
function expandWords(words: string[]): string[] {
  const expanded = new Set(words);
  for (const word of words) {
    const syns = SYNONYMS[word];
    if (syns) {
      for (const s of syns) expanded.add(s);
    }
  }
  return Array.from(expanded);
}

/**
 * Searches the knowledge base for chunks relevant to the query.
 * Uses keyword matching with synonym expansion and name alias handling.
 * Returns top 3 most relevant chunks.
 */
export function searchKnowledge(query: string): Chunk[] {
  const rawWords = query
    .toLowerCase()
    .replace(/[?.,!'"]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const hasNameMention = rawWords.some((w) => NAME_ALIASES.has(w));
  const contentWords = rawWords.filter(
    (w) => !STOP_WORDS.has(w) && !NAME_ALIASES.has(w)
  );

  const searchWords = expandWords(contentWords);

  let results: Chunk[];

  if (searchWords.length === 0) {
    if (hasNameMention) {
      return knowledgeBase.slice(0, 3);
    }
    const raw = query.toLowerCase().trim();
    results = knowledgeBase
      .filter(
        (chunk) =>
          chunk.content.toLowerCase().includes(raw) ||
          chunk.section.toLowerCase().includes(raw) ||
          chunk.citation.toLowerCase().includes(raw)
      )
      .slice(0, 3);
  } else {
    // Score each chunk: give direct content word hits 3x weight vs synonym expansion
    results = knowledgeBase
      .map((chunk) => {
        const searchable = (
          chunk.content + ' ' + chunk.section + ' ' + chunk.citation
        ).toLowerCase();

        let score = 0;
        for (const w of contentWords) {
          if (searchable.includes(w)) score += 3;
        }
        for (const w of searchWords) {
          if (searchable.includes(w)) score += 1;
        }

        // De-prioritize generic summary if specific technical chunks matched
        if (chunk.id === 'summary' && !query.toLowerCase().includes('about') && !query.toLowerCase().includes('who') && !query.toLowerCase().includes('summary')) {
          score = Math.max(0, score - 2);
        }

        if (hasNameMention && score > 0) score += 1;

        return { ...chunk, score };
      })
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  // Fallback: if no chunks matched, return the summary chunk
  if (results.length === 0) {
    const summary = knowledgeBase.find((c) => c.id === 'summary');
    if (summary) {
      return [summary];
    }
  }

  return results;
}
