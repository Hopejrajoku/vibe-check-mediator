'use client';

import { useTranscriptions } from '@livekit/components-react';
import { useEffect, useRef, useMemo } from 'react';

export const Transcript = () => {
  const transcriptions = useTranscriptions();
  const scrollRef = useRef<HTMLDivElement>(null);

  const validTranscriptions = useMemo(() => {
    return transcriptions.filter(t => t.segments && t.segments.length > 0);
  }, [transcriptions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [validTranscriptions]);

  return (
    <div 
      ref={scrollRef}
      className="w-full flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar scroll-smooth flex flex-col"
    >
      {validTranscriptions.map((t) => {
        const text = t.segments.map(s => s.text).join(' ');
        
        // IDENTIFICATION LOGIC
        const isAgent = t.participant?.identity?.toLowerCase().includes('agent') || 
                        t.participant?.identity?.toLowerCase().includes('gemini') ||
                        !t.participant?.identity;

        // VIBE DETECTION LOGIC (Matches the Python keywords)
        const isVibeShift = isAgent && (
          text.toLowerCase().includes('vibe shift') || 
          text.toLowerCase().includes('recalibrating') ||
          text.toLowerCase().includes('breathe')
        );
        
        return (
          <div 
            key={t.id} 
            className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            {/* Label */}
            <div className={`flex items-center gap-2 mb-2 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}>
              <span className={`text-[8px] font-mono uppercase tracking-[0.2em] transition-colors duration-500 ${
                isVibeShift ? 'text-red-500' : isAgent ? 'text-cyan-500' : 'text-slate-500'
              }`}>
                {isVibeShift ? '⚠ Critical_Intervention' : isAgent ? '▷ System_Mediator' : '● Inbound_Signal'}
              </span>
              <div className={`w-1 h-1 rounded-full ${
                isVibeShift ? 'bg-red-500 animate-ping' : isAgent ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'
              }`} />
            </div>
            
            {/* Chat Bubble */}
            <div className={`max-w-[90%] px-5 py-3.5 rounded-2xl text-[13px] leading-relaxed border transition-all duration-500 ${
              isVibeShift 
                ? 'bg-red-500/10 border-red-500/40 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                : isAgent 
                  ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-50 rounded-tl-none shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                  : 'bg-white/[0.03] border-white/10 text-slate-300 rounded-tr-none'
            }`}>
              {text}
            </div>
          </div>
        );
      })}

      {validTranscriptions.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center">
          <div className="relative w-12 h-12 mb-6">
            <div className="absolute inset-0 border border-cyan-500 rounded-full animate-ping" />
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-pulse" />
          </div>
          <p className="text-cyan-500 font-mono text-[9px] tracking-[0.6em] uppercase">Ready_For_Data_Input</p>
        </div>
      )}
    </div>
  );
};