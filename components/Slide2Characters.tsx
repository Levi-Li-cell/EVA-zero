import React, { useRef, useEffect } from 'react';
import { SlideData } from '../types';

interface Props {
  data: SlideData;
  bgImage: string | null;
}

const Slide2Characters: React.FC<Props> = ({ data, bgImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; size: number; color: string; life: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = ['#F57D18', '#FFFFFF', '#A518F5', '#39FF14']; // Eva themes (Orange, White, Purple, Green)

    const createParticle = (x: number, y: number) => {
      const size = Math.random() * 5 + 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({ x, y, size, color, life: 1.0 });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        p.life -= 0.02;
        p.y -= 1; // Float up slightly
        p.x += (Math.random() - 0.5) * 2; // Jitter

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        // Create multiple particles per move for density
        for(let i=0; i<3; i++) {
            createParticle(e.clientX - rect.left, e.clientY - rect.top);
        }
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
        {bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 transition-opacity duration-1000 grayscale hover:grayscale-0 transition-all duration-700"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
            {/* Hardcoded Character Cards for demo */}
            {['Shinji Ikari', 'Rei Ayanami', 'Asuka Langley'].map((name, idx) => (
                <div key={idx} className="bg-black/60 border border-orange-500/30 p-6 backdrop-blur-md transform transition-transform hover:scale-105 pointer-events-auto cursor-pointer group">
                    <div className="h-48 bg-gray-800 mb-4 overflow-hidden relative">
                         {/* Placeholder for char img if not generated, using CSS pattern */}
                         <div className={`w-full h-full bg-gradient-to-br ${idx === 0 ? 'from-purple-900' : idx === 1 ? 'from-blue-900' : 'from-red-900'} to-black opacity-80 group-hover:opacity-100 transition-opacity`} />
                         <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-20">0{idx+1}</div>
                    </div>
                    <h3 className="text-2xl font-display text-white mb-2">{name}</h3>
                    <p className="text-sm text-gray-400 font-mono">PILOT / EVA UNIT 0{idx+1}</p>
                    <div className="mt-4 h-1 w-full bg-gray-700 overflow-hidden">
                        <div className="h-full bg-orange-500 w-2/3 animate-pulse"></div>
                    </div>
                    <p className="text-xs text-orange-500 mt-1 text-right">SYNC RATIO: {Math.floor(Math.random() * 30 + 60)}%</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Slide2Characters;
