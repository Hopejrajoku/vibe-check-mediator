import os
import asyncio
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    Agent, 
    AgentSession, 
    JobContext, 
    WorkerOptions, 
    cli
)
from livekit.plugins import google, silero, deepgram

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect()
    print(f"Connected to room: {ctx.room.name}")

    # THE BRAIN: Gemini 3
    mediator_agent = Agent(
        instructions="""You are Gemini 3, a professional AI mediator. 
        Your job is to monitor the 'vibe' of the room. 
        If people are polite, stay quiet. 
        If you detect conflict, shouting, or circular arguments, 
        step in with a calm, neutral perspective to de-escalate.""",
        # Using 1.5-flash-latest to maximize free-tier quota
        llm=google.LLM(model="gemini-2.0-flash"),
    )

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        tts=google.TTS(),
    )

    @session.on("user_speech_finished")
    def on_user_speech(transcript):
        print(f"DEBUG: Agent heard -> {transcript.text}")

    await session.start(agent=mediator_agent, room=ctx.room)
    print("Gemini 3 Mediator is LIVE. If you get a 429, wait 60 seconds.")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))