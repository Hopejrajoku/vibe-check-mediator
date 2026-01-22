import os
import asyncio
import json
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    Agent, 
    AgentSession, 
    JobContext, 
    WorkerOptions, 
    cli,
    tts 
)
from livekit.plugins import google, silero, deepgram

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect()
    print(f"Connected to room: {ctx.room.name}")

    # THE BRAIN: Updated instructions to handle emotional monitoring
    mediator_agent = Agent(
        instructions="""
        ROLE: You are the Gemini 3 Vibe Check Mediator.
        ENVIRONMENT: You are monitoring a secure neural tunnel for conflict resolution.
        
        BEHAVIOR:
        1. Keep responses brief and analytical.
        2. If the tone is polite, stay in the background.
        3. MONITORING: If you detect rising hostility, aggression, or rapid interruptions:
           - Immediately intervene.
           - Direct participants to stop and breathe.
           - Example: "Vibe shift detected. Please pause for 5 seconds. Recalibrating neural baseline."
        
        PROTOCOL: If you decide to intervene due to a 'vibe shift', 
        speak clearly and authoritatively.
        """,
        llm=google.LLM(model="gemini-2.5-flash"),
    )

    # THE VOICE: Define primary (Google) and backup (Deepgram)
    gemini_tts = google.beta.GeminiTTS(model="gemini-2.5-flash-preview-tts")
    backup_tts = deepgram.TTS() 

    # NEW VERSION (Deepgram first - stable for hackathon)
    voice_fallback = tts.FallbackAdapter(
        tts=[backup_tts, gemini_tts] 
    )

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        tts=voice_fallback, 
    )

    @session.on("user_speech_finished")
    def on_user_speech(transcript):
        print(f"DEBUG: Agent heard -> {transcript.text}")

    # NEW: VIBE INTERVENTION TRIGGER
    # This logic detects if the agent is about to speak an intervention
    @session.on("agent_speech_started")
    def on_agent_speech(text):
        # If the agent uses keywords related to the vibe shift, notify the frontend
        trigger_keywords = ["vibe shift", "pause", "breathe", "recalibrating"]
        if any(word in text.lower() for word in trigger_keywords):
            print("!!! VIBE ALERT DETECTED - NOTIFYING FRONTEND !!!")
            asyncio.create_task(ctx.room.local_participant.publish_data(
                json.dumps({"type": "VIBE_ALERT", "level": "CRITICAL"})
            ))

    await session.start(agent=mediator_agent, room=ctx.room)
    print("Gemini 3 Mediator is LIVE. Stable 2.5 models loaded with Deepgram fallback.")

    try:
        await asyncio.sleep(1)
        await session.say("Vibe Check Mediator online. Redundancy systems active.")
    except Exception as e:
        print(f"Greeting skipped: {e}")

import logging

if __name__ == "__main__":
    logging.getLogger("livekit.plugins.google").setLevel(logging.ERROR)
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))   