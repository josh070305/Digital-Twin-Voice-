import { useState, useRef, useEffect, type ReactNode } from 'react';

interface DeveloperTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandOutput {
  command: string;
  output: string | ReactNode;
  timestamp: string;
}

const INITIAL_HELP = (
  <div className="space-y-1 text-slate-300">
    <p className="text-emerald-400 font-semibold">Joshna AI Developer Terminal v2.4.0 (x86_64-node-mern)</p>
    <p className="text-slate-400 text-xs">Type any command below to inspect microservices, scrapers, and system metrics:</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
      <div><span className="text-indigo-400 font-mono">projects</span> — List all 4 core projects & repos</div>
      <div><span className="text-indigo-400 font-mono">skills</span> — Display full technical stack & tools</div>
      <div><span className="text-indigo-400 font-mono">curl &lt;endpoint&gt;</span> — Test backend API endpoints</div>
      <div><span className="text-indigo-400 font-mono">docker ps</span> — List containerized microservices</div>
      <div><span className="text-indigo-400 font-mono">metrics</span> — View system performance benchmarks</div>
      <div><span className="text-indigo-400 font-mono">cat resume.json</span> — View candidate summary object</div>
      <div><span className="text-indigo-400 font-mono">clear</span> — Clear terminal screen</div>
      <div><span className="text-indigo-400 font-mono">exit</span> — Close terminal</div>
    </div>
  </div>
);

export function DeveloperTerminalModal({ isOpen, onClose }: DeveloperTerminalModalProps) {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'init',
      output: INITIAL_HELP,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let result: string | ReactNode = '';

    switch (mainCmd) {
      case 'help':
        result = INITIAL_HELP;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      case 'whoami':
        result = 'joshna (B.Tech CS 2026, Bharathidasan University • CGPA 8.2 • Full Stack & AI Engineer)';
        break;

      case 'skills':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-indigo-300 font-bold">🛠️ Technical Competencies:</p>
            <p><span className="text-slate-400">Languages:</span> Python, JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3</p>
            <p><span className="text-slate-400">Full Stack:</span> React.js, Node.js, Express.js, MongoDB, REST APIs, JWT, Redux, Tailwind</p>
            <p><span className="text-slate-400">AI / LLM:</span> Groq LPU API, Google Gemini, Anthropic Claude, TensorFlow, Keras, Web Scraping</p>
            <p><span className="text-slate-400">DevOps:</span> Docker, Git, GitHub Actions, Vercel, Postman</p>
          </div>
        );
        break;

      case 'projects':
        result = (
          <div className="space-y-1.5 text-xs">
            <p className="text-indigo-300 font-bold">📂 Featured Production Projects:</p>
            <p>1. <span className="text-emerald-400 font-mono font-semibold">E-Commerce Microservices Platform</span> — 6 services, JWT, Stripe, Docker (github.com/josh070305/e--commerce-microservices)</p>
            <p>2. <span className="text-pink-400 font-mono font-semibold">Real-Time AI Meeting Assistant</span> — Groq Whisper STT, live summaries (github.com/josh070305/Real-time-AI-meeting-assistant)</p>
            <p>3. <span className="text-amber-400 font-mono font-semibold">Exam Update Tracker AI Agent</span> — 6 portals scraped, SHA-256 diff, Telegram/WhatsApp (github.com/josh070305/Exam-Tracker)</p>
            <p>4. <span className="text-cyan-400 font-mono font-semibold">Joshna AI Digital Twin</span> — Client Vector RAG, Multilingual TTS, LiveKit (github.com/josh070305/digital-twin)</p>
          </div>
        );
        break;

      case 'docker':
        if (arg === 'ps' || arg.includes('ps')) {
          result = (
            <div className="font-mono text-[11px] leading-relaxed overflow-x-auto text-slate-300">
              <p className="text-slate-500">CONTAINER ID   IMAGE                 COMMAND                  STATUS          PORTS</p>
              <p className="text-emerald-400">a4f91c0e3b12   ecommerce-gateway     "node gateway.js"        Up 48 hours     0.0.0.0:8080-&gt;8080/tcp</p>
              <p className="text-emerald-400">c81d09e5fa41   auth-service:v2       "node auth.js"           Up 48 hours     0.0.0.0:5001-&gt;5001/tcp</p>
              <p className="text-emerald-400">e901f421ba77   product-service       "node product.js"        Up 48 hours     0.0.0.0:5002-&gt;5002/tcp</p>
              <p className="text-emerald-400">b110c78a0149   payment-service       "node payment.js"        Up 48 hours     0.0.0.0:5004-&gt;5004/tcp</p>
              <p className="text-emerald-400">f789e09d1341   exam-tracker-worker   "node cron-scraper.js"   Up 12 hours     0.0.0.0:5000-&gt;5000/tcp</p>
            </div>
          );
        } else {
          result = 'Usage: docker ps';
        }
        break;

      case 'metrics':
        result = (
          <div className="space-y-1 text-xs">
            <p className="text-indigo-300 font-bold">📊 Verified System Benchmarks:</p>
            <p>• <span className="text-emerald-400">E-Commerce API Response Latency:</span> 142ms average (Target: &lt;200ms)</p>
            <p>• <span className="text-pink-400">Groq LLM Inference Speed:</span> &lt;400ms first token turnaround</p>
            <p>• <span className="text-amber-400">Exam Tracker Scraping Efficiency:</span> 90% redundant LLM token reduction via SHA-256 caching</p>
            <p>• <span className="text-cyan-400">Academic Standing:</span> 8.2 CGPA • 0 Standing Arrears • Bharathidasan University</p>
          </div>
        );
        break;

      case 'curl':
        if (arg.includes('ecommerce') || arg.includes('auth') || arg.includes('product')) {
          result = (
            <pre className="text-[11px] text-emerald-300 font-mono bg-black/40 p-2.5 rounded-lg">
{`HTTP/1.1 200 OK
Content-Type: application/json
X-Response-Time: 142ms

{
  "status": "healthy",
  "service": "ecommerce-api-gateway",
  "microservices": {
    "auth": "UP (JWT active)",
    "products": "UP (1,240 items in cache)",
    "cart": "UP",
    "payment": "UP (Stripe webhook connected)"
  },
  "timestamp": "${new Date().toISOString()}"
}`}
            </pre>
          );
        } else if (arg.includes('exam') || arg.includes('tracker')) {
          result = (
            <pre className="text-[11px] text-amber-300 font-mono bg-black/40 p-2.5 rounded-lg">
{`HTTP/1.1 200 OK
Content-Type: application/json

{
  "scraper_status": "ACTIVE",
  "boards_monitored": ["SSC", "RRB", "TNPSC", "UPSC", "IBPS", "SBI"],
  "last_cron_run": "${new Date(Date.now() - 1000 * 60 * 15).toISOString()}",
  "llm_parser": "Groq llama-3.3-70b-versatile",
  "notifications_dispatched_24h": 14
}`}
            </pre>
          );
        } else {
          result = (
            <pre className="text-[11px] text-indigo-300 font-mono bg-black/40 p-2.5 rounded-lg">
{`HTTP/1.1 200 OK
{
  "status": "online",
  "candidate": "Joshna",
  "role": "Full Stack Developer / AI Engineer",
  "contact": "joesenthil07@gmail.com",
  "github": "https://github.com/josh070305"
}`}
            </pre>
          );
        }
        break;

      case 'cat':
        if (arg.includes('resume')) {
          result = (
            <pre className="text-[11px] text-slate-300 font-mono bg-black/40 p-2.5 rounded-lg">
{`{
  "name": "Joshna",
  "education": "B.Tech Computer Science (2026)",
  "university": "Bharathidasan University",
  "cgpa": 8.2,
  "key_projects": [
    "E-Commerce Microservices Platform",
    "Real-Time AI Meeting Assistant",
    "Exam Update Tracker AI Agent",
    "Digital Twin Voice Assistant"
  ],
  "contact": {
    "email": "joesenthil07@gmail.com",
    "linkedin": "linkedin.com/in/joshna-senthil",
    "github": "github.com/josh070305"
  }
}`}
            </pre>
          );
        } else {
          result = `File '${arg || 'unknown'}' not found. Try 'cat resume.json'.`;
        }
        break;

      case 'contact':
        result = 'Email: joesenthil07@gmail.com | Phone: +91 9342214179 | GitHub: github.com/josh070305';
        break;

      default:
        result = `Command not recognized: '${trimmed}'. Type 'help' to see available developer commands.`;
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        output: result,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0 && historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl h-[520px] bg-[#0c0d14] border border-indigo-500/30 rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden animate-slide-up font-mono">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#141522] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-slate-400 font-semibold ml-2">
              joshna@dev-twin: ~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Interactive CLI
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 text-xs">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command !== 'init' && (
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <span className="text-emerald-400">joshna@dev-twin:~$</span>
                  <span>{item.command}</span>
                  <span className="text-[10px] text-slate-600 ml-auto">{item.timestamp}</span>
                </div>
              )}
              <div className="pl-0 text-slate-200">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Line */}
        <div className="p-3 bg-[#11121d] border-t border-white/10 flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-xs">joshna@dev-twin:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'projects', 'docker ps', 'curl /api/ecommerce/health'..."
            className="flex-1 bg-transparent text-xs text-white outline-none placeholder-slate-600 font-mono"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
