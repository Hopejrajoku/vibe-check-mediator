# Vibe Check: Neural Conflict Mediator

**Powered by Gemini 2.5 Flash & LiveKit** *Real-time multimodal monitoring for baseline emotional stability in secure neural tunnels.*

Vibe Check is an advanced AI mediator designed to monitor high-tension vocal environments. Built on **Gemini 2.5 Flash**, it doesn't just process words—it processes context. When the agent detects rising hostility or a "Vibe Shift," it triggers a critical state change on the frontend and intervenes with authoritative calming protocols.

---

## Key Innovation: The "Intercept" Logic
Unlike standard AI agents, Vibe Check uses a **Dual-Engine Voice System** and a custom **Data Intercept Layer**:
* **Dual-Engine Voice:** Uses a `FallbackAdapter` to prioritize Deepgram Aura for ultra-low latency, with Gemini TTS as a high-fidelity backup.
* **Neural Intercept:** The agent scans its own output in real-time. If it decides to intervene (using keywords like "breathe" or "vibe shift"), it sends a **LiveKit Data Packet** to the frontend, instantly turning the UI into a "Critical Alert" state.

---

## The Tech Stack
* **Intelligence:** Google Gemini 2.5 Flash (LLM)
* **Real-time Infrastructure:** LiveKit Agents SDK
* **Audio Pipeline:** Deepgram STT & TTS (Helios/Aura models)
* **VAD:** Silero (Voice Activity Detection)
* **Frontend:** Next.js 14, Tailwind CSS, Framer Motion

---

## Instructions for Judges

### 1. Initialize the Uplink
Click the **"Access Terminal"** button to generate a secure JWT and establish a connection to the LiveKit server.

### 2. Neural Baseline Greeting
Once you click **"Initialize Uplink,"** wait for the agent to say:  
> *"Neural Mediator online. Monitoring vibe levels. How can I assist today?"*

### 3. Stress-Test the Mediator
* **Polite Interaction:** Speak calmly to the agent. It will respond briefly and analytically, remaining in the background.
* **Simulated Conflict:** Raise your voice or use aggressive phrasing (e.g., *"I'm tired of being interrupted!"*).
* **The Vibe Alert:** When the agent detects the shift, it will say: *"Vibe shift detected. Please pause and breathe."*
* **Visual Feedback:** Watch the **GeminiOrb**—it will transition to a pulsing **Critical Red** state the moment the mediator intervenes.

---

## Installation & Setup

### 1. Environment Secrets
Create a `.env` file in the root (and `.env.local` for Next.js):
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
GOOGLE_API_KEY=your_gemini_key
DEEPGRAM_API_KEY=your_deepgram_key