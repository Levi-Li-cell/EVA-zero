import React, { useState, useEffect } from 'react';
import { CharacterProfile, TrinityItem } from '../types';
import { generateEvaImage } from '../services/geminiService';

// --- Sub-components ---

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
                         <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                              style={{ backgroundImage: `url(${images[`p-${activeIndex}`]})` }} />
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                             <h3 className="text-2xl font-display font-bold text-blue-400">{current.pilot}</h3>
                         </div>
                     </div>

                     {/* Unit */}
                     <div className="relative group overflow-hidden border border-gray-800 bg-gray-900 rounded-lg transform transition-all scale-110 z-20 shadow-2xl shadow-purple-900/20">
                         <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 z-20">EVA UNIT</div>
                         <div className="absolute inset-0 bg-cover bg-center transition-all duration-500" 
                              style={{ backgroundImage: `url(${images[`u-${activeIndex}`]})` }} />
                         <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                             <h3 className="text-3xl font-display font-bold text-purple-500 text-center">{current.unit}</h3>
                         </div>
                     </div>

                     {/* Angel */}
                     <div className="relative group overflow-hidden border border-gray-800 bg-gray-900 rounded-lg transform transition-all hover:-translate-y-2">
                         <div className="absolute top-2 left-2 text-xs font-mono text-gray-400 z-20">HOSTILE</div>
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
            {/* Scroll 1: Intro */}
            <section className="w-full h-screen snap-start relative flex items-center justify-center bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="z-10 text-center">
                    <h1 className="text-8xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600 mb-4 tracking-tighter">
                        PERSONNEL
                    </h1>
                    <div className="bg-orange-500 text-black font-bold font-mono text-xl px-4 py-2 inline-block transform -skew-x-12">
                        CLASSIFIED INFORMATION
                    </div>
                </div>
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