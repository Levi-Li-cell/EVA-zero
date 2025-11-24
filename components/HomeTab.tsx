import React, { useEffect, useState, useRef } from 'react';
import { generateEvaImage } from '../services/geminiService';
import Slide1Hero from './Slide1Hero';
import Slide2Characters from './Slide2Characters';
import Slide3Mecha from './Slide3Mecha';
import Slide4Story from './Slide4Story';
import { SlideData } from '../types';

const SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'EVANGELION',
    subtitle: 'Human Instrumentality',
    description: 'The fate of humanity rests on the shoulders of children. Explore the psychological depth and mecha action of Neon Genesis Evangelion.',
    prompt: 'Tokyo-3 city futuristic skyline at sunset, cyberpunk vibes, purple and green lighting, massive mecha silhouette in distance',
  },
  {
    id: 2,
    title: 'PILOTS',
    subtitle: 'The Children',
    description: 'Shinji, Rei, Asuka. Chosen by fate to pilot the bio-machines known as Evangelions.',
    prompt: 'Inside an Evangelion entry plug cockpit, futuristic interface, LCL fluid bubbles, warm orange holographic screens',
  },
  {
    id: 3,
    title: 'UNITS',
    subtitle: 'Synthetic Life',
    description: 'Not robots. Humans clad in armor. The ultimate weapon against the Angels.',
    prompt: 'Eva Unit 01 berserk mode close up, glowing green eyes, purple armor, roaring, dynamic action shot, 3d render style',
  },
  {
    id: 4,
    title: 'ANGELS',
    subtitle: 'The Messengers',
    description: 'Grotesque, beautiful, and terrifying entities arriving to trigger the Third Impact.',
    prompt: 'Abstract geometric angel Ramiel floating over a geometric city, beam of light, surreal atmosphere, red sky',
  },
];

const HomeTab: React.FC = () => {
  const [images, setImages] = useState<Record<number, string>>({});
  
  useEffect(() => {
    // Generate the first one immediately for better UX
    const initLoad = async () => {
         const firstImg = await generateEvaImage(SLIDES[0].prompt);
         if (firstImg) setImages(prev => ({ ...prev, 1: firstImg }));
    };
    initLoad();

    // Lazy load others
    SLIDES.slice(1).forEach(async (slide) => {
        const url = await generateEvaImage(slide.prompt);
        if (url) setImages(prev => ({ ...prev, [slide.id]: url }));
    });
  }, []);

  return (
    <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth">
        {/* Slide 1 */}
        <section className="w-full h-screen snap-start relative">
            <Slide1Hero data={SLIDES[0]} bgImage={images[1] || null} />
        </section>

        {/* Slide 2 */}
        <section className="w-full h-screen snap-start relative">
            <Slide2Characters data={SLIDES[1]} bgImage={images[2] || null} />
        </section>

        {/* Slide 3 */}
        <section className="w-full h-screen snap-start relative">
             <Slide3Mecha data={SLIDES[2]} bgImage={images[3] || null} />
        </section>

         {/* Slide 4 */}
         <section className="w-full h-screen snap-start relative">
             <Slide4Story data={SLIDES[3]} bgImage={images[4] || null} />
        </section>
    </div>
  );
};

export default HomeTab;