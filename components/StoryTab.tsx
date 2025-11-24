import React, { useEffect, useRef, useState } from 'react';
import { generateEvaImage } from '../services/geminiService';

interface StoryPoint {
    id: number;
    year: string;
    title: string;
    desc: string;
    prompt: string;
}

const STORY_POINTS: StoryPoint[] = [
    {
        id: 1,
        year: '2000',
        title: 'SECOND IMPACT',
        desc: 'The contact experiment with Adam in Antarctica results in a global cataclysm. Half the human population is wiped out. The oceans turn red.',
        prompt: 'Antarctica snowy landscape destruction giant explosion cross of light second impact evangelion anime style',
    },
    {
        id: 2,
        year: '2015',
        title: 'ANGEL ATTACK',
        desc: '15 years later, the Angels return. NERV is established in Tokyo-3 to combat them using the Evangelions. Shinji Ikari is summoned.',
        prompt: 'Futuristic city Tokyo-3 buildings retracting into ground sunset giant monster silhouette anime style',
    },
    {
        id: 3,
        year: '2016',
        title: 'INSTRUMENTALITY',
        desc: 'SEELE\'s plan to merge all human souls into one collective consciousness begins. The Human Instrumentality Project.',
        prompt: 'Surreal abstract imagery many glowing souls floating up to giant moon white Rei head atmospheric',
    },
    {
        id: 4,
        year: 'UNKNOWN',
        title: 'REBUILD',
        desc: 'The world resets. A new cycle begins. The sea is red, the land is scarred, but humanity persists.',
        prompt: 'Ruined city red ocean giant evangelion remnants dramatic lighting cinematic anime style',
    },
];

const StoryTab: React.FC = () => {
    const [images, setImages] = useState<Record<number, string>>({});
    
    // Intersection Observer to light up the timeline
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [activeSection, setActiveSection] = useState(0);

    useEffect(() => {
        STORY_POINTS.forEach(async (point) => {
            const url = await generateEvaImage(point.prompt);
            if (url) setImages(prev => ({ ...prev, [point.id]: url }));
        });
    }, []);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = Number(entry.target.getAttribute('data-id'));
                    setActiveSection(id);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.story-section').forEach(el => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth bg-gray-950 relative">
            {/* Fixed Visual Linear Guidance - The Timeline Line */}
            <div className="fixed top-0 left-10 md:left-20 h-full w-1 bg-gray-800 z-20">
                {/* The Active Progress Bar */}
                <div 
                    className="w-full bg-green-500 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(34,197,94,0.8)]"
                    style={{ height: `${(activeSection / STORY_POINTS.length) * 100}%` }}
                />
            </div>

            {STORY_POINTS.map((point, index) => (
                <section 
                    key={point.id} 
                    data-id={point.id}
                    className="story-section w-full h-screen snap-start relative flex items-center overflow-hidden"
                >
                    {/* Dynamic Background */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear scale-110"
                        style={{ 
                            backgroundImage: images[point.id] ? `url(${images[point.id]})` : 'none',
                            opacity: 0.4
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

                    {/* Timeline Node */}
                    <div className="fixed left-10 md:left-20 transform -translate-x-1/2 z-30 transition-all duration-500"
                         style={{ top: '50%', opacity: activeSection === point.id ? 1 : 0.2 }}>
                         <div className={`w-4 h-4 rotate-45 border-2 ${activeSection === point.id ? 'bg-green-500 border-white' : 'bg-black border-gray-600'}`} />
                         {activeSection === point.id && (
                             <div className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap text-green-500 font-mono text-sm tracking-widest animate-pulse">
                                 CURRENT ERA: {point.year}
                             </div>
                         )}
                    </div>

                    <div className="relative z-10 pl-24 md:pl-40 pr-10 max-w-4xl">
                        <div className={`transition-all duration-1000 transform ${activeSection === point.id ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
                            <div className="text-8xl md:text-[10rem] font-black text-gray-800 absolute -top-20 -left-10 -z-10 select-none opacity-50 font-display">
                                {point.year}
                            </div>
                            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tighter shadow-black drop-shadow-md">
                                {point.title}
                            </h2>
                            <div className="w-20 h-1 bg-green-500 mb-8" />
                            <p className="text-xl md:text-2xl text-gray-300 font-serif leading-relaxed max-w-2xl border-l-4 border-green-500/30 pl-6">
                                {point.desc}
                            </p>
                        </div>
                    </div>
                    
                    {/* Decorative Hexagons */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-20 pointer-events-none">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-32 h-10 border border-white skew-x-[-20deg]" />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default StoryTab;