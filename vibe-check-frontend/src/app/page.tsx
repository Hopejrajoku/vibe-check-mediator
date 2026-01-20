'use client';

import { useState, useEffect } from 'react';
import { 
  LiveKitRoom, 
  RoomAudioRenderer, 
  ControlBar, 
  useRoomContext,
  ConnectionStateToast,
} from '@livekit/components-react';
import { GeminiOrb } from '@/components/GeminiOrb';
import { Transcript } from '@/components/Transcript';

const AudioUnlock = () => {
  const room = useRoomContext();
  const [unlocked, setUnlocked] = useState(false);
  
  // Automatically try to enable mic when this component mounts inside the room
  useEffect(() => {
    const enableMic = async () => {
      try {
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (e) {
        console.error("Failed to enable mic on mount:", e);
      }
    };
    enableMic();
  }, [room]);

  if (unlocked) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <div className="text-center group p-4">
        <div className="w-24 h-[2px] bg-cyan-500 mx-auto mb-8 shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse" />
        <button 
          onClick={async () => {
            await room.startAudio();
            // Explicitly ensure mic is on when user clicks initialize
            await room.localParticipant.setMicrophoneEnabled(true);
            setUnlocked(true);
          }}
          className="relative px-8 md:px-12 py-5 bg-transparent border border-cyan-500/50 text-cyan-400 font-mono text-sm tracking-[0.5em] uppercase hover:bg-cyan-500 hover:text-black transition-all duration-700 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] overflow-hidden"
        >
          <span className="relative z-10 font-black">Initialize Uplink</span>
          <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </button>
      </div>
    </div>
  );
};

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const roomName = "playground-1Y9I-q97p"; 

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#000] text-white p-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 text-center w-full max-w-4xl px-4">
          <div className="mb-4 inline-block px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-500/5 text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Protocol: Vibe_Check_V3</div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent mb-2">Vibe Check</h1>
          <p className="text-slate-500 font-mono text-[10px] md:text-xs tracking-[0.5em] md:tracking-[1em] mb-12">NEURAL CONFLICT RESOLUTION</p>
          <button 
            onClick={async () => {
              const resp = await fetch(`/api/get-participant-token?room=${roomName}&username=User_${Math.floor(Math.random() * 100)}`);
              const data = await resp.json();
              setToken(data.token);
            }}
            className="group relative px-10 md:px-16 py-4 border border-white/20 hover:border-cyan-500 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 font-mono font-bold uppercase tracking-widest text-xs md:text-sm group-hover:text-cyan-400">Access Terminal</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Critical: Set video false, audio true, and ensure we connect with mic
      video={false}
      audio={true}
      connect={true}
      onDisconnected={() => setToken(null)}
      className="h-screen w-full bg-[#050505] text-white flex flex-col font-sans m-0 p-0 overflow-hidden"
    >
      <AudioUnlock />
      <ConnectionStateToast />

      {/* Cinematic Header */}
      <header className="h-20 border-b border-white/5 flex justify-between items-center px-6 md:px-10 bg-black/40 backdrop-blur-xl shrink-0 z-40 w-full">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] md:text-[10px] text-cyan-500 tracking-[0.2em] md:tracking-[0.3em] uppercase leading-none">Uplink: Active</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col text-slate-400 font-mono text-[9px] uppercase">
            Node: {roomName.split('-')[0]}
          </div>
        </div>
        <div className="px-3 py-1.5 border border-red-500/30 rounded-full flex items-center gap-2 bg-red-500/5">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-black text-red-500 uppercase">Live Intercept</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col xl:flex-row p-4 md:p-6 gap-6 relative overflow-hidden w-full h-full pb-28 md:pb-6">
        
        {/* Left Section: Visualizer */}
        <section className="flex-[3] w-full relative border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] bg-[#080808] flex flex-col items-center justify-center overflow-hidden group min-h-0">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/20 animate-scan z-10 pointer-events-none" />
          <div className="scale-75 md:scale-110 transition-transform duration-1000">
            <GeminiOrb />
          </div>
        </section>

        {/* Right Section: Intelligence Sidebar */}
        <aside className="flex-1 w-full xl:min-w-[420px] flex flex-col gap-6 min-h-0">
          <div className="flex-1 bg-black/40 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden min-h-0">
            <h3 className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-4">Extraction_Log</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Transcript />
            </div>
          </div>

          <div className="flex-none h-32 md:h-40 bg-gradient-to-br from-cyan-950/20 to-transparent border border-cyan-500/20 rounded-[1.5rem] md:rounded-[2.5rem] p-6 relative overflow-hidden">
             <h3 className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.4em] mb-4">System_Integrity</h3>
             <div className="flex items-end gap-1 h-6">
               {[...Array(15)].map((_, i) => (
                 <div key={i} className="flex-1 bg-cyan-500/20 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 80}%` }} />
               ))}
             </div>
          </div>
        </aside>
      </main>

      {/* Control Bar Dock */}
      <div className="fixed bottom-6 right-6 z-[60] flex items-center justify-center pointer-events-none">
        <div className="bg-black/80 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-auto">
          <div className="lk-control-bar-custom">
            <ControlBar 
              variation="minimal" 
              controls={{ leave: true, screenShare: false, settings: false }} 
            />
          </div>
        </div>
      </div>

      <RoomAudioRenderer />

      <style jsx global>{`
        .lk-control-bar-custom .lk-button-group {
          display: flex !important;
          flex-direction: row !important;
          gap: 1.5rem !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
        }

        .lk-control-bar-custom .lk-button {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 48px !important;
          width: 48px !important;
        }

        .lk-control-bar-custom .lk-button:hover {
          background-color: rgba(6, 182, 212, 0.2) !important;
          border-color: #22d3ee !important;
        }

        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
          background: black;
        }

        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        .animate-scan { animation: scan 8s linear infinite; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </LiveKitRoom>
  );
}