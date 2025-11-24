import React, { useState } from 'react';
import { SlideData } from '../types';

interface Props {
  data: SlideData;
  bgImage: string | null;
}

const Slide3Mecha: React.FC<Props> = ({ data, bgImage }) => {
  const [glitchActive, setGlitchActive] = useState(false);

  return (
    <div 
        className="relative w-full h-full bg-gray-900 overflow-hidden"
        onMouseEnter={() => setGlitchActive(true)}
        onMouseLeave={() => setGlitchActive(false)}
    >
      {/* Background */}
      {bgImage && (
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-500 ${glitchActive ? 'opacity-80' : 'opacity-40'}`}
          style={{ 
              backgroundImage: `url(${bgImage})`,
              filter: glitchActive ? 'contrast(1.2) saturate(1.5) hue-rotate(90deg)' : 'none',
              transition: 'filter 0.2s'
          }}
        />
      )}

      {/* Hexagon Overlay Grid */}
      <div className="absolute inset-0 z-10 opacity-10" 
           style={{ 
               backgroundImage: 'radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent)',
               backgroundSize: '40px 40px',
               backgroundPosition: '0 0, 20px 20px'
           }} 
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-center items-end px-10 md:px-32">
        <div className="relative group">
            <h1 className={`text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-600 transform transition-all duration-100 ${glitchActive ? 'translate-x-2' : ''}`}>
                UNIT-01
            </h1>
            {glitchActive && (
                <>
                    <h1 className="absolute top-0 left-0 text-9xl font-black font-display text-red-500 opacity-50 mix-blend-screen animate-pulse translate-x-[-4px] translate-y-1">UNIT-01</h1>
                    <h1 className="absolute top-0 left-0 text-9xl font-black font-display text-blue-500 opacity-50 mix-blend-screen animate-pulse translate-x-[4px] translate-y-[-1px]">UNIT-01</h1>
                </>
            )}
        </div>
        
        <div className="mt-8 bg-black/70 border border-green-500 p-8 max-w-xl backdrop-blur-lg skew-x-[-12deg]">
            <div className="skew-x-[12deg]">
                <h3 className="text-green-500 font-mono text-xl mb-4 border-b border-green-500/50 pb-2">STATUS: BERSERK</h3>
                <p className="text-gray-200 font-sans leading-relaxed">
                    Test Type Unit-01. The only EVA unit born from Lilith. 
                    It serves as the backup for Human Instrumentality. 
                    Current operational status is unstable. 
                    <span className="block mt-4 text-red-500 font-bold animate-pulse">WARNING: DUMMY PLUG SYSTEM OFFLINE</span>
                </p>
                
                <div className="mt-6 flex space-x-2">
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-8 w-4 bg-green-500/20 border border-green-500 ${glitchActive ? 'animate-bounce' : ''}`} style={{ animationDelay: `${i*0.1}s` }} />
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scan_3s_linear_infinite] z-30 pointer-events-none" />
      
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Slide3Mecha;
