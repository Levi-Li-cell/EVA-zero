import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import CharactersTab from './components/CharactersTab';
import StoryTab from './components/StoryTab';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('HOME');

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Tab Content Container */}
      <div className="w-full h-full pt-0">
          {activeTab === 'HOME' && <HomeTab onNavigate={setActiveTab} />}
          {activeTab === 'CHARACTERS' && <CharactersTab />}
          {activeTab === 'STORY' && <StoryTab />}
      </div>

      {/* Global Grain/CRT Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      ></div>
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%]"></div>
    </div>
  );
};

export default App;