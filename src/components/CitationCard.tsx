interface CitationCardProps {
  citation: string;
  section?: string;
  content?: string;
  confidence?: number;
  onInspectArchitecture?: (projectId: string) => void;
}

function getSourceBadge(citation: string): { label: string; bg: string; stroke: string } {
  const l = citation.toLowerCase();
  if (l.includes('github')) {
    return { label: 'GitHub', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/25', stroke: '#3b82f6' };
  }
  if (l.includes('project') || l.includes('meeting') || l.includes('commerce') || l.includes('genai')) {
    return { label: 'Project', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/25', stroke: '#f59e0b' };
  }
  return { label: 'Resume', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', stroke: '#10b981' };
}

function getConfidenceColor(conf: number): { color: string; track: string } {
  if (conf >= 80) return { color: '#10b981', track: 'rgba(16, 185, 129, 0.15)' };
  if (conf >= 50) return { color: '#f59e0b', track: 'rgba(245, 158, 11, 0.15)' };
  return { color: '#ef4444', track: 'rgba(239, 68, 68, 0.15)' };
}

function detectProjectId(citation: string, content?: string): string | null {
  const text = `${citation} ${content || ''}`.toLowerCase();
  if (text.includes('commerce') || text.includes('microservice')) return 'ecommerce';
  if (text.includes('meeting') || text.includes('groq') || text.includes('assistant')) return 'realtime-meeting';
  if (text.includes('exam') || text.includes('tracker') || text.includes('cheerio') || text.includes('scrap')) return 'exam-tracker';
  if (text.includes('voice') || text.includes('twin') || text.includes('digital twin')) return 'digitaltwin';
  return null;
}

export function CitationCard({
  citation,
  section,
  content,
  confidence,
  onInspectArchitecture,
}: CitationCardProps) {
  if (!citation) return null;
  const badge = getSourceBadge(citation);
  const confVal = confidence != null && confidence > 0 ? confidence : 85;
  const { color: confColor, track: trackColor } = getConfidenceColor(confVal);
  const projectId = detectProjectId(citation, content);

  // SVG circular arc calculation
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confVal / 100) * circumference;

  return (
    <div className="group relative animate-slide-up w-full min-w-0">
      <div className="gradient-border overflow-hidden">
        <div className="bg-[var(--color-card)] rounded-[calc(1rem-1px)] p-3.5 transition-all">
          {/* Top header row */}
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${badge.bg}`}>
                {badge.label}
              </span>
              {section && (
                <span className="text-xs font-medium text-[var(--color-text-muted)] truncate">{section}</span>
              )}
            </div>

            {/* Circular Confidence Arc Gauge */}
            <div className="flex items-center gap-1.5 flex-shrink-0" title={`Knowledge match confidence: ${confVal}%`}>
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth="3.5"
                  />
                  {/* Active Arc */}
                  <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke={confColor}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[9px] font-extrabold" style={{ color: confColor }}>
                  {confVal}%
                </span>
              </div>
            </div>
          </div>

          {/* Citation Label */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text)] font-semibold break-words">
              <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span>{citation}</span>
            </div>

            {/* Inspect Architecture Quick Action */}
            {projectId && onInspectArchitecture && (
              <button
                type="button"
                onClick={() => onInspectArchitecture(projectId)}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-colors flex-shrink-0"
              >
                <span>🏗️</span>
                <span className="hidden sm:inline">Architecture</span>
              </button>
            )}
          </div>

          {/* Excerpt text */}
          {content && (
            <p className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed break-words whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
