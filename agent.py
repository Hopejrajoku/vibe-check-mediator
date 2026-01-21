import os
import asyncio
import json
import logging
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    Agent, 
    AgentSession, 
    JobContext, 
    WorkerOptions, 
    cli,
    tts,
    llm 
)
from livekit.plugins import google, silero, deepgram

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect()
    print(f"Connected to room: {ctx.room.name}")

    # --- 1. SETUP MULTI-KEY BRAIN POOL ---
    api_keys = [
        os.getenv("GOOGLE_API_KEY"),         
        os.getenv("GOOGLE_API_KEY_2"),       
        os.getenv("GOOGLE_API_KEY_3"),       
        os.getenv("GOOGLE_API_KEY_4"),       
        os.getenv("GOOGLE_API_KEY_5"),       
    ]

    valid_keys = [k for k in api_keys if k]
    
    # Create the list of LLMs
    llm_pool = [google.LLM(model="gemini-2.0-flash", api_key=k) for k in valid_keys]
    
    # FIXED: In Python, FallbackAdapter takes the list as a positional argument
    resilient_llm = llm.FallbackAdapter(llm_pool)

    # --- 2. INITIALIZE MEDIATOR AGENT ---
    mediator_agent = Agent(
        instructions="""
        ROLE: You are the Gemini 3 Vibe Check Mediator.
        ENVIRONMENT: Monitoring a secure neural tunnel for conflict resolution.
        
        BEHAVIOR:
        1. Keep responses brief, analytical, and cinematic.
        2. Stay background-silent unless hostility/anger is detected.
        3. MANDATORY TRIGGER: If you intervene, start with the phrase: "Vibe shift detected."
        4. When triggered, instruct users to pause and breathe for recalibration.
        """,
        llm=resilient_llm,
    )

    # --- 3. HYBRID VOICE SYSTEM ---
    gemini_tts = google.beta.GeminiTTS(model="gemini-2.5-flash-preview-tts")
    backup_tts = deepgram.TTS(model="aura-helios-en") 
    voice_fallback = tts.FallbackAdapter([gemini_tts, backup_tts]) # Fixed here too

    # --- 4. OPTIMIZED SESSION ---
    session = AgentSession(
        vad=silero.VAD.load(
            min_speech_duration=0.2,    
            min_silence_duration=1.2,   
            activation_threshold=0.45
        ),
        stt=deepgram.STT(),
        tts=voice_fallback, 
    )

    @session.on("user_speech_finished")
    def on_user_speech(transcript):
        print(f"DEBUG: Agent heard -> {transcript.text}")

    @session.on("agent_speech_started")
    def on_agent_speech(text):
        trigger_keywords = ["vibe shift", "pause", "breathe", "recalibrating"]
        if any(word in text.lower() for word in trigger_keywords):
            print("!!! VIBE ALERT: BROADCASTING CRITICAL STATE !!!")
            asyncio.create_task(ctx.room.local_participant.publish_data(
                json.dumps({"type": "VIBE_ALERT", "level": "CRITICAL"})
            ))

    # --- START THE SESSION ---
    await session.start(agent=mediator_agent, room=ctx.room)
    print(f"Mediator is LIVE with {len(llm_pool)} fallback brains.")

    try:
        await asyncio.sleep(1)
        await session.say("Vibe Check Mediator online. Redundancy systems active.")
    except Exception as e:
        print(f"Greeting skipped: {e}")

if __name__ == "__main__":
    logging.getLogger("livekit.plugins.google").setLevel(logging.ERROR)
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))