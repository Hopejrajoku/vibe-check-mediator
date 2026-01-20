'use client';
import { useState } from 'react';
import { BarVisualizer, useDataChannel } from '@livekit/components-react';

export const GeminiOrb = () => {
  const [isVibeAlert, setIsVibeAlert] = useState(false);

  // Listen for the "VIBE_ALERT" from the Python Agent
  useDataChannel((message) => {
    const data = JSON.parse(new TextDecoder().decode(message.payload));
    if (data.type === 'VIBE_ALERT') {
      setIsVibeAlert(true);
      // Reset back to normal after 5 seconds (matching the "breathe" pause)
      setTimeout(() => setIsVibeAlert(false), 5000);
    }
  });

  return (
    <div className="relative flex flex-col items-center justify-center scale-110">
      {/* 1. Deep Background Glow (The Ambient Energy) */}
      <div className={`absolute w-[450px] h-[450px] rounded-full blur-[120px] animate-pulse pointer-events-none transition-colors duration-1000 ${
        isVibeAlert ? 'bg-red-600/30' : 'bg-cyan-500/10'
      }`} />
      
      {/* 2. Rotating Outer Containment Rings */}
      <div className={`absolute w-80 h-80 border-[1px] rounded-full pointer-events-none transition-all duration-1000 ${
        isVibeAlert ? 'border-red-500/40 animate-[spin_2s_linear_infinite]' : 'border-cyan-500/20 animate-[spin_10s_linear_infinite]'
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-[0_0_15px] transition-colors duration-1000 ${
          isVibeAlert ? 'bg-red-500 shadow-red-500' : 'bg-cyan-400 shadow-cyan-400'
        }`} />
      </div>
      
      <div className={`absolute w-[280px] h-[280px] border-[1px] rounded-full pointer-events-none transition-all duration-1000 ${
        isVibeAlert ? 'border-red-500/20 animate-[spin_4s_linear_infinite_reverse]' : 'border-blue-500/10 animate-[spin_15s_linear_infinite_reverse]'
      }`} />

      {/* 3. The Sphere Container (The Glass Effect) */}
      <div className={`relative w-72 h-72 flex items-center justify-center bg-black rounded-full border shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden group transition-all duration-700 ${
        isVibeAlert ? 'border-red-500 shadow-[0_0_100px_rgba(239,68,68,0.3)]' : 'border-white/10 hover:border-cyan-500/50 shadow-[0_0_100px_rgba(6,182,212,0.2)]'
      }`}>
        
        {/* Interior Gradient Reflection */}
        <div className={`absolute inset-0 bg-gradient-to-tr pointer-events-none z-10 transition-all duration-1000 ${
          isVibeAlert ? 'from-red-500/30 via-transparent to-red-500/10' : 'from-cyan-500/20 via-transparent to-white/5'
        }`} />
        
        {/* The Visualizer Bars */}
        <div className="relative z-0 w-full px-8 opacity-80 group-hover:opacity-100 transition-opacity">
          {/* BarVisualizer color is usually inherited or set via CSS */}
          <div className={isVibeAlert ? 'text-red-500' : 'text-cyan-400'}>
             <BarVisualizer options={{ barWidth: 6, gap: 4 }} />
          </div>
        </div>

        {/* Glossy Overlay (Lens Effect) */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20" />
      </div>
      
      {/* 4. Data HUD Labels */}
      <div className="mt-12 flex flex-col items-center gap-4 relative">
        <div className="flex items-center gap-3">
            <span className={`w-1 h-1 rounded-full animate-ping ${isVibeAlert ? 'bg-red-500' : 'bg-cyan-500'}`} />
            <h2 className={`font-mono text-[10px] tracking-[0.5em] uppercase font-bold transition-colors duration-1000 ${
              isVibeAlert ? 'text-red-500' : 'text-cyan-400'
            }`}>
              {isVibeAlert ? 'CRITICAL_INTERVENTION' : 'Mediator_Core_V3'}
            </h2>
            <span className={`w-1 h-1 rounded-full animate-ping transition-colors duration-1000 ${isVibeAlert ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Decorative Logic Line */}
        <div className="relative w-48 h-[1px]">
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900 to-transparent transition-all duration-1000 ${isVibeAlert ? 'via-red-900' : 'via-cyan-900'}`} />
            <div className={`absolute top-0 h-[1px] w-8 animate-data-travel shadow-[0_0_10px] transition-all duration-1000 ${
              isVibeAlert ? 'bg-red-400 shadow-red-500' : 'bg-cyan-400 shadow-cyan-400'
            }`} />
        </div>

        <p className={`text-[8px] font-mono uppercase tracking-widest animate-pulse transition-colors duration-1000 ${
          isVibeAlert ? 'text-red-600' : 'text-slate-600'
        }`}>
            {isVibeAlert ? 'PROTOCOL: BREATH_CYCLE_REQD' : 'Neural Signal: 102.4 MHz'}
        </p>
      </div>

      <style jsx global>{`
        @keyframes data-travel {
          0% { left: -10%; opacity: 0; }
          50% { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        .animate-data-travel {
          animation: data-travel 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};