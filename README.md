# Vibe Check: Neural Conflict Mediator
Powered by Gemini 2.0 Flash & LiveKit Real-time multimodal monitoring for baseline emotional stability in secure neural tunnels.

Vibe Check is an advanced AI mediator designed to monitor high-tension vocal environments. Built on Gemini 2.0 Flash, it doesn't just process words—it processes emotional context. When the agent detects rising hostility or a "Vibe Shift," it triggers a critical state change on the frontend and intervenes with authoritative calming protocols.

## Resilience Engineering: The "5-Brain" Fail-Safe
During the development of this mediator, we faced a mission-critical challenge: API Rate Limits. In a real-world conflict, the mediator cannot "crash" or return a 429: Quota Exceeded error.

To overcome the constraints of the Gemini Free Tier, we engineered a High-Availability Brain Pool:

Multi-Project Sharding: We distributed the agent's logic across 5 independent Google Cloud Projects.

FallbackAdapter Architecture: Using LiveKit’s FallbackAdapter, we created a redundant chain of command. If the primary Gemini instance hits a rate limit, the system hot-swaps to the next available "brain" in milliseconds.

Invisible Recovery: The failover happens entirely on the backend. The user experiences zero latency or interruption, ensuring the "Vibe Check" remains online even during high-traffic stress tests.

## Key Innovation: The "Intercept" Logic
Unlike standard AI agents that simply "chat," Vibe Check uses a Neural Intercept Layer:

Dual-Engine Voice: Prioritizes Gemini 2.0 Flash-Preview-TTS for high-fidelity, cinematic responses, falling back to Deepgram Aura for ultra-low latency if necessary.

Data-Packet Intercept: The agent scans its own neural output in real-time. If it decides to intervene (using keywords like "vibe shift" or "breathe"), it broadcasts a LiveKit Data Packet across the room.

Dynamic Frontend: The frontend listens for these packets. The moment a conflict is detected, the UI transitions from a calm "baseline" state to a pulsing "Critical Red" alert, providing immediate visual feedback to the participants.

## The Tech Stack
Intelligence: Google Gemini 2.0 Flash (Primary LLM)

Redundancy: 5x Multi-Project Gemini Failover (High Availability)

Real-time Infrastructure: LiveKit Agents SDK

Audio Pipeline: Deepgram STT & Google Gemini TTS

VAD: Silero (Voice Activity Detection) optimized for 1.2s silence intervals

Frontend: Next.js 14, Tailwind CSS, Framer Motion

## Instructions for Judges
1. Initialize the Uplink
Click the "Access Terminal" button to generate a secure JWT and establish a connection to the LiveKit server.

2. Neural Baseline Greeting
Once the connection is established, the mediator will announce its presence:

"Vibe Check Mediator online. Redundancy systems active. Monitoring vibe levels."

3. Stress-Test the Mediator
Baseline Talk: Speak calmly about mundane topics. The agent remains analytical and stays in the background.

Simulated Conflict: Begin to raise your voice or use aggressive phrasing (e.g., "I'm sick of this, you never listen!").

The Vibe Alert: The agent will immediately intercept. It will say: "Vibe shift detected. Please pause and breathe."

Visual Validation: Watch the GeminiOrb on the screen—it will transition from its baseline colors to a Pulsing Critical Red the instant the mediator detects the shift.

## Installation & Setup
1. Environment Secrets
Create a .env file in the root directory. To enable the 5-brain fallback, use separate API keys from 5 different Google Cloud projects:

Code snippet

## LiveKit Connection
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret

## High Availability Brain Pool (Google Gemini)
GOOGLE_API_KEY=key_from_project_1
GOOGLE_API_KEY_2=key_from_project_2
GOOGLE_API_KEY_3=key_from_project_3
GOOGLE_API_KEY_4=key_from_project_4
GOOGLE_API_KEY_5=key_from_project_5

## Audio Services
DEEPGRAM_API_KEY=your_deepgram_key
2. Run the Mediator
Bash

## Activate your virtual environment
source .venv/Scripts/activate

## Run the agent in development mode
python agent.py dev



# Future Roadmap: The Path to Affective Mediation
While the current version of Vibe Check relies on high-speed keyword intercept and tonal monitoring, our roadmap for the next 12 months involves moving toward true Neural Affective Computing.

Phase 1: Real-time Sentiment Scoring (Q2 2026)
We plan to integrate a sliding-window sentiment analysis model that assigns a numerical "Stability Score" to the room.

Logic: Instead of waiting for a "Vibe Shift" keyword, the UI will display a real-time graph of the room's emotional health.

Tech: Custom fine-tuned BERT models running on edge workers to minimize latency.

Phase 2: Multimodal Emotion Recognition (Q3 2026)
By leveraging Gemini’s multimodal capabilities, the mediator will analyze not just what is said, but how it is said.

Prosody Analysis: Detecting micro-tremors in the voice, pitch spikes, and speech-rate acceleration as early warning signs of aggression.

Facial Micro-expression Analysis: Using the LiveKit video track to detect subtle facial cues (furrowed brows, tightened lips) before a verbal conflict even begins.

Phase 3: Autonomous Conflict De-escalation (Q1 2027)
Moving beyond "Pause and Breathe," the mediator will be trained on professional psychological conflict resolution datasets.

Personalized Intervention: The AI will adapt its tone (Authoritative vs. Empathetic) based on the personality profiles it builds for each participant during the session.

Privacy-First Local Processing: Implementing local-first neural processing to ensure that sensitive emotional data never leaves the participant's secure tunnel.

## Final Vision
Our goal is to create a world where digital communication is as emotionally nuanced as face-to-face interaction, providing a safety net for remote teams, therapeutic sessions, and high-stakes negotiations.