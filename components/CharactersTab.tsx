import React, { useState, useEffect, useRef } from 'react';
import { CharacterProfile, TrinityItem } from '../types';
import { generateEvaImage } from '../services/geminiService';

// --- Sub-components ---

// 1. EVA Slicer Canvas Component
const EvaSlicerTitle: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resize);
        resize();

        // Create an offscreen canvas to render the base text
        const buffer = document.createElement('canvas');
        const bCtx = buffer.getContext('2d');

        const render = () => {
            if (!bCtx) return;
            
            // 1. Draw pure text to offscreen buffer
            buffer.width = canvas.width;
            buffer.height = canvas.height;
            
            bCtx.fillStyle = '#000000'; // Background
            bCtx.fillRect(0, 0, buffer.width, buffer.height);
            
            // Calculate dynamic font size to fill ~90% of width
            const text = "EVA";
            bCtx.font = `900 100px 'Orbitron'`; // Seed size
            const metrics = bCtx.measureText(text);
            // Scale factor: Target Width / Current Width
            const targetWidth = canvas.width * 0.95; 
            const scale = targetWidth / metrics.width;
            const fontSize = 100 * scale;

            bCtx.font = `900 ${fontSize}px 'Orbitron', sans-serif`;
            bCtx.textAlign = 'center';
            bCtx.textBaseline = 'middle';
            // Classic Gainax Title Card Style: White text on Black, or high contrast
            bCtx.fillStyle = '#FFFFFF'; 
            bCtx.fillText(text, canvas.width / 2, canvas.height / 2);

            // 2. Main Draw Loop: Slice and dice
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const sliceHeight = Math.max(4, canvas.height / 120); 
            const numSlices = Math.ceil(canvas.height / sliceHeight);

            for (let i = 0; i < numSlices; i++) {
                const sy = i * sliceHeight;
                const sh = sliceHeight;
                
                // --- SLIDING DISTORTION ALGORITHM ---
                let offset = 0;
                
                // 1. Large Block Shifts (The "TARE" look)
                // Group slices into large blocks
                const blockSize = 20; // Slices per block
                const blockIndex = Math.floor(i / blockSize);
                
                // Static shifts based on block index (gives the broken jagged look)
                if (blockIndex % 3 === 0) offset += 15;
                if (blockIndex % 7 === 0) offset -= 15;
                if (blockIndex % 5 === 0) offset += 30;

                // 2. Dynamic Sliding
                // Blocks slide horizontally over time
                const slideSpeed = Math.sin(time * 0.5 + blockIndex);
                if (blockIndex % 2 === 0) {
                    offset += slideSpeed * 20; 
                } else {
                    offset -= slideSpeed * 20;
                }

                // 3. Glitch Spikes
                // Occasional extreme horizontal shift
                if (Math.random() > 0.98) {
                     offset += (Math.random() - 0.5) * 200;
                }

                // 4. Scanline Wave
                // A wave that travels down pushing pixels
                const wavePos = (time * 1500) % (canvas.height + 500) - 250;
                const distToWave = Math.abs(sy - wavePos);
                if (distToWave < 150) {
                     const force = (150 - distToWave) / 150;
                     offset += Math.sin(distToWave * 0.1) * force * 100;
                     // Chromatic aberration trigger
                }

                // Draw the slice
                ctx.drawImage(
                    buffer,
                    0, sy, buffer.width, sh, // Source
                    offset, sy, buffer.width, sh // Dest (shifted x)
                );
            }

            // Optional: Green overlay for that "Monitor" feel
            ctx.fillStyle = 'rgba(0, 255, 0, 0.02)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.02;
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="relative w-full h-full bg-black overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            
            {/* Vignette & Scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_60%,#000_100%)]" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]" />
            
            <div className="absolute bottom-10 left-10 pointer-events-none z-10">
                <div className="bg-red-600 text-black font-bold font-mono text-xl px-4 py-2 inline-block transform -skew-x-12 animate-pulse shadow-[0_0_10px_red]">
                     TOP SECRET
                </div>
            </div>
        </div>
    );
};


const AccordionItem: React.FC<{ char: CharacterProfile; expanded: boolean; onClick: () => void; image: string | null }> = ({ char, expanded, onClick, image }) => {
    return (
        <div 
            onClick={onClick}
            className={`
                relative h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-r border-gray-800
                ${expanded ? 'flex-[5] grayscale-0' : 'flex-1 grayscale hover:grayscale-0'}
            `}
        >
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{ 
                    backgroundImage: image ? `url(${image})` : 'none',
                    backgroundColor: char.color,
                    transform: expanded ? 'scale(1.1)' : 'scale(1.0)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            
            {/* Expanded Content */}
            <div className={`absolute bottom-10 left-10 z-20 transition-opacity duration-500 ${expanded ? 'opacity-100 delay-300' : 'opacity-0'}`}>
                <h2 className="text-6xl font-display font-black text-white mb-2 uppercase tracking-tighter shadow-black drop-shadow-lg">{char.name}</h2>
                <div className="inline-block bg-white text-black px-2 py-1 font-bold font-mono text-sm mb-2">{char.eva}</div>
                <p className="text-gray-200 max-w-md bg-black/50 p-2 backdrop-blur-sm border-l-2 border-white">{char.role}</p>
            </div>

            {/* Collapsed Label (Vertical) */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${expanded ? 'opacity-0' : 'opacity-100'}`}>
                 <h3 className="text-4xl font-display font-bold text-white uppercase rotate-90 whitespace-nowrap tracking-widest drop-shadow-md">{char.name}</h3>
            </div>
        </div>
    );
};

const TrinityCarousel: React.FC = () => {
    const items: TrinityItem[] = [
        {
            pilot: "SHINJI IKARI",
            unit: "EVA-01",
            angel: "SACHIEL",
            quote: "I mustn't run away.",
            pilotPrompt: "Shinji Ikari sad expression plugsuit anime style",
            unitPrompt: "Evangelion Unit 01 purple head close up 3d style",
            angelPrompt: "Sachiel angel evangelion face close up scary"
        },
        {
            pilot: "REI AYANAMI",
            unit: "EVA-00",
            angel: "RAMIEL",
            quote: "I am not a doll.",
            pilotPrompt: "Rei Ayanami blue hair plugsuit ethereal anime style",
            unitPrompt: "Evangelion Unit 00 orange yellow single eye close up",
            angelPrompt: "Ramiel geometric angel blue crystal octahedron floating"
        },
        {
            pilot: "ASUKA LANGLEY",
            unit: "EVA-02",
            angel: "GAGHIEL",
            quote: "Are you stupid?",
            pilotPrompt: "Asuka Langley Soryu angry confident plugsuit anime style",
            unitPrompt: "Evangelion Unit 02 red four eyes beast mode",
            angelPrompt: "Gaghiel aquatic giant angel evangelion underwater"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [images, setImages] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadImages = async () => {
            const current = items[activeIndex];
            // Load all 3 for current index if not exists
            if (!images[`p-${activeIndex}`]) {
                const p = await generateEvaImage(current.pilotPrompt);
                if (p) setImages(prev => ({...prev, [`p-${activeIndex}`]: p}));
            }
            if (!images[`u-${activeIndex}`]) {
                const u = await generateEvaImage(current.unitPrompt);
                if (u) setImages(prev => ({...prev, [`u-${activeIndex}`]: u}));
            }
            if (!images[`a-${activeIndex}`]) {
                const a = await generateEvaImage(current.angelPrompt);
                if (a) setImages(prev => ({...prev, [`a-${activeIndex}`]: a}));
            }
        };
        loadImages();
    }, [activeIndex]);

    const next = () => setActiveIndex((prev) => (prev + 1) % items.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

    const current = items[activeIndex];

    const downloadImage = (url: string, name: string) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = `EVA_DATA_${name.replace(/\s+/g, '_').toUpperCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden">
             {/* Background decorative rings */}
             <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="w-[800px] h-[800px] border border-orange-500 rounded-full animate-[spin_60s_linear_infinite]" />
                 <div className="absolute w-[600px] h-[600px] border border-green-500 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
             </div>

             <div className="flex flex-col md:flex-row gap-8 items-center z-10 w-full max-w-7xl px-4">
                 <button onClick={prev} className="p-4 text-white hover:text-orange-500 transition-colors">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>

                 {/* Trinity Container */}
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh]">
                     {/* Pilot */}
                     <div className="relative group overflow-hidden border border-gray-800 bg-gray-900 rounded-lg transform transition-all hover:-translate-y-2">
                         <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 z-20">PILOT</div>
                         {images[`p-${activeIndex}`] && (
                            <button 
                                onClick={() => downloadImage(images[`p-${activeIndex}`], current.pilot)}
                                className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded hover:bg-orange-500 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Download Data"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                         )}
                         <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                              style={{ backgroundImage: `url(${images[`p-${activeIndex}`]})` }} />
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                             <h3 className="text-2xl font-display font-bold text-blue-400">{current.pilot}</h3>
                         </div>
                     </div>

                     {/* Unit */}
                     <div className="relative group overflow-hidden border border-gray-800 bg-gray-900 rounded-lg transform transition-all scale-110 z-20 shadow-2xl shadow-purple-900/20">
                         <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 z-20">EVA UNIT</div>
                         {images[`u-${activeIndex}`] && (
                            <button 
                                onClick={() => downloadImage(images[`u-${activeIndex}`], current.unit)}
                                className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded hover:bg-orange-500 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Download Data"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                         )}
                         <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                              style={{ backgroundImage: `url(${images[`u-${activeIndex}`]})` }} />
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                             <h3 className="text-3xl font-display font-bold text-purple-500 text-center">{current.unit}</h3>
                         </div>
                     </div>

                     {/* Angel */}
                     <div className="relative group overflow-hidden border border-gray-800 bg-gray-900 rounded-lg transform transition-all hover:-translate-y-2">
                         <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 z-20">HOSTILE</div>
                         {images[`a-${activeIndex}`] && (
                            <button 
                                onClick={() => downloadImage(images[`a-${activeIndex}`], current.angel)}
                                className="absolute top-2 right-2 text-white bg-black/50 p-1 rounded hover:bg-orange-500 z-30 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Download Data"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                         )}
                         <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                              style={{ backgroundImage: `url(${images[`a-${activeIndex}`]})` }} />
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                             <h3 className="text-2xl font-display font-bold text-red-500 text-right">{current.angel}</h3>
                         </div>
                     </div>
                 </div>

                 <button onClick={next} className="p-4 text-white hover:text-orange-500 transition-colors">
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </button>
             </div>
             
             <div className="absolute bottom-10 text-center w-full z-20">
                 <p className="text-2xl font-serif italic text-white/60">"{current.quote}"</p>
                 <div className="flex justify-center mt-4 gap-2">
                     {items.map((_, idx) => (
                         <div key={idx} className={`w-16 h-1 rounded-full transition-all ${idx === activeIndex ? 'bg-orange-500' : 'bg-gray-700'}`} />
                     ))}
                 </div>
             </div>
        </div>
    );
};

// --- Main Component ---

const CharactersTab: React.FC = () => {
    const [accordionIndex, setAccordionIndex] = useState(0);
    const [charImages, setCharImages] = useState<string[]>([]);

    const characters: CharacterProfile[] = [
        { name: "SHINJI", eva: "UNIT-01", role: "Third Child", color: "#6b21a8", imgPrompt: "Shinji Ikari full body plugsuit standing confident anime style" },
        { name: "REI", eva: "UNIT-00", role: "First Child", color: "#1e3a8a", imgPrompt: "Rei Ayanami full body plugsuit standing mysterious anime style" },
        { name: "ASUKA", eva: "UNIT-02", role: "Second Child", color: "#991b1b", imgPrompt: "Asuka Langley full body plugsuit standing proud anime style" },
        { name: "MARI", eva: "UNIT-08", role: "Problem Child", color: "#be185d", imgPrompt: "Mari Makinami Illustrious full body pink plugsuit anime style" },
        { name: "KAWORU", eva: "MARK.06", role: "Fifth Child", color: "#374151", imgPrompt: "Kaworu Nagisa full body plugsuit standing serene anime style" },
    ];

    useEffect(() => {
        // Pre-load char images
        characters.forEach(async (c, i) => {
            const url = await generateEvaImage(c.imgPrompt);
            if(url) {
                setCharImages(prev => {
                    const n = [...prev];
                    n[i] = url;
                    return n;
                });
            }
        });
    }, []);

    return (
        <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth bg-black">
            {/* Scroll 1: EVA Slicer Intro */}
            <section className="w-full h-screen snap-start relative flex items-center justify-center bg-black overflow-hidden">
                <EvaSlicerTitle />
            </section>

            {/* Scroll 2: Accordion */}
            <section className="w-full h-screen snap-start relative flex flex-col bg-black">
                <div className="absolute top-0 left-0 w-full z-10 p-4 bg-gradient-to-b from-black to-transparent pointer-events-none">
                     <span className="text-xs font-mono text-gray-500">SELECT FILE TO EXPAND</span>
                </div>
                <div className="flex-1 w-full flex overflow-hidden">
                    {characters.map((char, index) => (
                        <AccordionItem 
                            key={char.name} 
                            char={char} 
                            expanded={index === accordionIndex} 
                            onClick={() => setAccordionIndex(index)}
                            image={charImages[index] || null}
                        />
                    ))}
                </div>
            </section>

            {/* Scroll 3: MAGI System Visual */}
            <section className="w-full h-screen snap-start relative flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-50">
                     <div className="flex gap-8">
                         <div className="w-64 h-40 bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 animate-pulse"></div>
                             <span className="font-mono text-2xl font-bold text-orange-500">MELCHIOR-1</span>
                         </div>
                         <div className="w-64 h-40 bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                             <span className="font-mono text-2xl font-bold text-orange-500">BALTHASAR-2</span>
                         </div>
                         <div className="w-64 h-40 bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center relative overflow-hidden group">
                             <div className="absolute inset-0 bg-orange-500/10 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                             <span className="font-mono text-2xl font-bold text-orange-500">CASPER-3</span>
                         </div>
                     </div>
                     <div className="text-orange-500 font-mono text-xl animate-bounce mt-10">DECISION: UNANIMOUS</div>
                </div>
            </section>

            {/* Scroll 4: Trinity Carousel */}
            <section className="w-full h-screen snap-start relative">
                <TrinityCarousel />
            </section>
        </div>
    );
};

export default CharactersTab;