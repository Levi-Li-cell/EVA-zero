import React from 'react';
import { Tab } from '../types';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navbar: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = ['HOME', 'CHARACTERS', 'STORY'];

  return (
    <div className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="text-3xl font-display font-black tracking-widest text-red-600 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]">
          NERV
          <span className="text-xs align-top ml-1 text-red-500 opacity-70">OFFICIAL</span>
        </div>
        <div className="hidden md:block w-[1px] h-8 bg-red-900/50 mx-2"></div>
        <div className="hidden md:flex flex-col text-[0.6rem] font-mono text-red-400 leading-tight opacity-70">
          <span>GOD'S IN HIS HEAVEN</span>
          <span>ALL'S RIGHT WITH THE WORLD</span>
        </div>
      </div>

      <nav className="pointer-events-auto">
        <ul className="flex gap-1 md:gap-4 bg-black/40 backdrop-blur-md border border-gray-800 p-1 rounded-sm clip-path-slant">
          {tabs.map((tab) => (
            <li key={tab}>
              <button
                onClick={() => onTabChange(tab)}
                className={`
                  relative px-6 py-2 text-sm md:text-base font-display tracking-widest transition-all duration-300
                  ${activeTab === tab 
                    ? 'text-black bg-orange-500 font-bold shadow-[0_0_15px_rgba(249,115,22,0.6)]' 
                    : 'text-gray-400 hover:text-orange-400 hover:bg-white/5'}
                `}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white mix-blend-overlay"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden md:flex gap-2 pointer-events-auto items-center">
         <span className="font-mono text-xs text-orange-500 animate-pulse">MAGI-01: ACTIVE</span>
         <div className="grid grid-cols-2 gap-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></div>
         </div>
      </div>
    </div>
  );
};

export default Navbar;