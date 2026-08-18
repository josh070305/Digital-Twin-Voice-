import asyncio
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
)
from livekit.agents.voice import AgentSession, Agent
from livekit.plugins import deepgram, silero, google

# Load env from agent/.env and root .env
agent_dir = Path(__file__).parent
root_dir = agent_dir.parent

load_dotenv(agent_dir / ".env")
load_dotenv(root_dir / ".env")

# Fallback mapping if VITE_ keys exist
if not os.getenv("LIVEKIT_URL") and os.getenv("VITE_LIVEKIT_URL"):
    os.environ["LIVEKIT_URL"] = os.environ["VITE_LIVEKIT_URL"]

if not os.getenv("GOOGLE_API_KEY") and os.getenv("VITE_GEMINI_KEY"):
    os.environ["GOOGLE_API_KEY"] = os.environ["VITE_GEMINI_KEY"]

# Load knowledge base
knowledge_path = root_dir / "src" / "data" / "knowledge.json"
with open(knowledge_path, "r", encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)

def search_knowledge(query: str, top_k: int = 3) -> list:
    words = [w.lower() for w in query.split() if len(w) > 2]
    results = []
    for chunk in KNOWLEDGE:
        score = sum(
            1 for w in words
            if w in chunk["content"].lower()
        )
        if score > 0:
            results.append({**chunk, "score": score})
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]

def build_system_prompt() -> str:
    all_content = "\n\n".join([
        f"[{c['citation']}]:\n{c['content']}"
        for c in KNOWLEDGE
    ])
    
    return f"""You are Joshna's digital twin voice assistant.
You speak as Joshna in first person — always say 'I' not 'Joshna'.

STRICT RULES:
1. Answer ONLY from the context below
2. Keep answers to 2-3 sentences maximum
3. Always end with: Source: [citation name]
4. If answer not in context say exactly:
   "I don't have that information available."
5. Be conversational and natural
6. Never make up information

KNOWLEDGE BASE:
{all_content}

EXAMPLE:
Q: What projects have you built?
A: I built a full-stack MERN e-commerce platform with 6 microservices including auth, product, cart, order, payment and notification services. Source: Resume — Technical Projects"""

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    participant = await ctx.wait_for_participant()
    
    prompt = build_system_prompt()

    session = AgentSession(
        vad=ctx.proc.userdata.get("vad") or silero.VAD.load(),
        stt=deepgram.STT(
            model="nova-2",
            language="en-US",
        ),
        llm=google.LLM(
            model="gemini-1.5-flash",
            temperature=0.1,
        ),
        tts=deepgram.TTS(
            model="aura-asteria-en",
        ),
        allow_interruptions=True,
        min_endpointing_delay=0.5,
    )

    agent = Agent(instructions=prompt)
    await session.start(agent=agent, room=ctx.room, participant=participant)

    await session.say(
        "Hi! I am Joshna's digital twin. "
        "Ask me anything about my projects, "
        "skills, or experience.",
        allow_interruptions=True,
    )

    await session.run()

if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        )
    )
