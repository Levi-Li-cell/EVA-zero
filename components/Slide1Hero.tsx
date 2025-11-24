import React, { useRef, useEffect, useState } from 'react';
import { SlideData } from '../types';

interface Props {
  data: SlideData;
  bgImage: string | null;
}

const Slide1Hero: React.FC<Props> = ({ data, bgImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const text = "EVA";
    const fontSize = 200;
    
    // Pixel particles
    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      color: string;
      size: number;
      vx: number;
      vy: number;
    }
    
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0 };
    let isMouseOver = false;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Draw text to a temporary canvas to read pixel data
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      tempCtx.font = `900 ${fontSize}px 'Orbitron'`;
      tempCtx.fillStyle = '#A518F5'; // EVA Purple
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';
      tempCtx.fillText(text, canvas.width / 2, canvas.height / 2);

      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      particles = [];
      const step = 6; // Check every 6th pixel for performance

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * 4 * imageData.width) + (x * 4);
          if (data[index + 3] > 128) {
            particles.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${data[index + 3]})`,
              size: step - 1,
              vx: 0,
              vy: 0
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 150;
        const force = (maxDistance - distance) / maxDistance;
        
        if (distance < maxDistance && isMouseOver) {
          const directionX = forceDirectionX * force * 40;
          const directionY = forceDirectionY * force * 40;
          p.vx -= directionX;
          p.vy -= directionY;
        } else {
          if (p.x !== p.originX) {
            const dx = p.x - p.originX;
            p.vx -= dx * 0.05;
          }
          if (p.y !== p.originY) {
            const dy = p.y - p.originY;
            p.vy -= dy * 0.05;
          }
        }

        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isMouseOver = true;
      setHovered(true);
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      setHovered(false);
    };

    const handleResize = () => {
        init();
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background with overlay */}
      {bgImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-0 pointer-events-none" />

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 cursor-crosshair" />
      
      <div className="absolute bottom-20 left-10 z-30 max-w-lg pointer-events-none">
         <h2 className="text-4xl font-display text-green-400 font-bold mb-2 tracking-widest uppercase shadow-black drop-shadow-lg">
            {data.subtitle}
         </h2>
         <p className="text-gray-300 text-lg font-light leading-relaxed bg-black/50 p-4 border-l-4 border-green-500 backdrop-blur-sm">
            {data.description}
         </p>
      </div>
    </div>
  );
};

export default Slide1Hero;
