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

    # THE BRAIN: Gemini remains the intelligence
    mediator_agent = Agent(
        instructions="""
        ROLE: You are the Gemini 3 Neural Mediator.
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

    # THE VOICE: Deepgram primary to bypass Gemini TTS quota
    gemini_tts = google.beta.GeminiTTS(model="gemini-2.5-flash-preview-tts")
    backup_tts = deepgram.TTS(model="aura-helios-en") 

    voice_fallback = tts.FallbackAdapter(
        tts=[backup_tts, gemini_tts] 
    )

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        tts=voice_fallback, 
    )

    # --- ADDED GREETING LOGIC ---
    @ctx.room.on("participant_connected")
    def on_participant_connected(participant):
        # When you join the page, the agent will speak immediately
        asyncio.create_task(session.say("Neural Mediator online. Monitoring vibe levels. How can I assist today?"))

    @session.on("user_speech_finished")
    def on_user_speech(transcript):
        print(f"DEBUG: Agent heard -> {transcript.text}")

    @session.on("agent_speech_started")
    def on_agent_speech(text):
        trigger_keywords = ["vibe shift", "pause", "breathe", "recalibrating"]
        if any(word in text.lower() for word in trigger_keywords):
            print("!!! VIBE ALERT DETECTED - NOTIFYING FRONTEND !!!")
            asyncio.create_task(ctx.room.local_participant.publish_data(
                json.dumps({"type": "VIBE_ALERT", "level": "CRITICAL"})
            ))

    await session.start(agent=mediator_agent, room=ctx.room)
    print("Gemini 3 Mediator is LIVE. Auto-greeting enabled.")

import logging

if __name__ == "__main__":
    logging.getLogger("livekit.plugins.google").setLevel(logging.ERROR)
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))