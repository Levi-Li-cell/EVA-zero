import React from 'react';
import { SlideData, Tab } from '../types';

interface Props {
  data: SlideData;
  bgImage: string | null;
  onNavigate: (tab: Tab) => void;
}

const Slide4Story: React.FC<Props> = ({ data, bgImage, onNavigate }) => {
    const downloadBg = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!bgImage) return;
        const link = document.createElement('a');
        link.href = bgImage;
        link.download = `EVA_BACKGROUND_${data.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
    <div className="relative w-full h-full bg-red-950/20 overflow-hidden flex items-center justify-center group/slide">
      {/* Background */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-50 sepia mix-blend-overlay"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      
      {bgImage && (
          <button 
            onClick={downloadBg}
            className="absolute top-4 right-4 z-40 text-white/50 hover:text-white border border-white/20 hover:border-white/80 p-2 rounded transition-all opacity-0 group-hover/slide:opacity-100"
            title="Download Background"
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
      )}
      
      {/* Target UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
         {/* Concentric Circles */}
         <div className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] border border-red-500/30 rounded-full animate-[spin_20s_linear_infinite]" />
         <div className="absolute w-[60vw] h-[60vw] md:w-[400px] md:h-[400px] border border-red-500/50 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
         <div className="absolute w-[40vw] h-[40vw] md:w-[200px] md:h-[200px] border-2 border-red-500 rounded-full animate-pulse" />
         
         {/* Crosshairs */}
         <div className="absolute h-full w-[1px] bg-red-500/30" />
         <div className="absolute w-full h-[1px] bg-red-500/30" />
      </div>

      <div className="z-20 text-center max-w-4xl px-4 relative">
         <div className="bg-black/80 border-t-4 border-b-4 border-red-600 p-10 transform transition-all hover:scale-105 duration-500 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
             <h2 className="text-red-500 font-display text-5xl font-black mb-6 tracking-tighter">ANGEL DETECTED</h2>
             <p className="text-xl md:text-2xl text-white font-serif italic mb-6">
                "Man fears the darkness, and so he scrapes away at the edges of it with fire."
             </p>
             <div className="text-left font-mono text-xs text-red-400 space-y-1 border-l border-red-800 pl-4">
                 <p>{'>'} ANALYSIS PATTERN: BLOOD TYPE BLUE</p>
                 <p>{'>'} AT FIELD: CRITICAL</p>
                 <p>{'>'} TARGET: GEOFRONT</p>
             </div>
             
             <button 
                onClick={() => onNavigate('STORY')}
                className="mt-8 px-8 py-3 bg-red-600 text-black font-bold hover:bg-red-500 transition-colors uppercase tracking-widest clip-path-polygon cursor-pointer relative overflow-hidden group"
             >
                <span className="relative z-10">Launch Countermeasures</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
             </button>
         </div>
      </div>
      
      {/* Honeycomb pattern overlay */}
      <div className="absolute inset-0 z-30 opacity-10 pointer-events-none" 
           style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.4' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
           }} 
      />
    </div>
  );
};

export default Slide4Story;