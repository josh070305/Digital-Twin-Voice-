# Joshna AI — Digital Twin Voice Bot

A voice-enabled AI that answers questions about Joshna in real time with cited sources.

## What Makes This Different


- **Adaptive Recruiter Mode** — Detects recruiter focus (AI/ML, Full-Stack, System Architecture or JD) and dynamically steers all subsequent Gemini answers
- Recruiter Tools Panel — Match My JD, Architecture viewer, Interview booking, Docs
- Multilingual voice in 4 languages (English, Hindi, French, Spanish)
- Three response personas (Professional/Casual/Technical)
- Citation confidence scoring with visual % meter
- Session export with full conversation + citations
- Text fallback when voice unavailable

## How It Works

User speaks/types → RAG searches knowledge base → Gemini generates answer → Citation extracted → Voice response + citation card displayed

## Architecture

Voice Pipeline:
User Mic → LiveKit Room (WebRTC)
→ Python Agent (Railway)
→ Deepgram STT (nova-2 model)
→ Gemini 1.5 Flash (RAG + citations)
→ Deepgram TTS (aura-asteria voice)
→ Audio back through LiveKit Room
→ Browser plays audio

Frontend: React + TypeScript + Tailwind → Vercel
Agent: Python + LiveKit Agents → Railway
Voice: Deepgram STT + TTS
LLM: Google Gemini 1.5 Flash
Knowledge: Static JSON RAG

## Setup

### Get API Keys:
1. LiveKit: livekit.io → free cloud project
2. Deepgram: deepgram.com → $200 free credits
3. Gemini: aistudio.google.com → free API key

### Run Agent Locally:
```bash
cd agent
pip install -r requirements.txt
cp .env.example .env
# fill in your keys
python agent.py dev
```

### Deploy Agent on Railway:
1. railway.app → new project
2. Deploy from GitHub → select `agent/` folder
3. Add environment variables
4. Deploy

### Run Frontend:
```bash
npm install
npm run dev
```

## How to Use

1. Open the live link
2. Click mic or type a question
3. See answer + citation source
4. Use Recruiter Tools for JD matching

## Example Questions

- "What projects have you built?"
- "What is your tech stack?"
- "Tell me about your education"
- "Why should we hire you?"
- "Tell me about your Real-Time Meeting Assistant"

## Live Demo
https://joshna-ai.vercel.app

## GitHub Repository
https://github.com/josh070305/Digital-Twin-Voice-
