import React, { useState, useMemo, useEffect } from 'react';
import { AppView, UserProgress, FaithLevel } from './types';
import { Home, BookOpen, Trophy, User, Moon, Sun, Coffee } from 'lucide-react';
import HomeView from './views/HomeView';
import BibleView from './views/BibleView';
import ChallengesView from './views/ChallengesView';
import ProfileView from './views/ProfileView';
import StudyView from './views/StudyView';
import BreadModeView from './views/BreadModeView';
import { LEVEL_MAP } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('breadDaily_darkMode') === 'true';
  });
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('breadDaily_progress');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: FaithLevel.CRUMB,
      streak: 1,
      completedChallenges: [],
      crumbs: []
    };
  });

  useEffect(() => {
    localStorage.setItem('breadDaily_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('breadDaily_darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addXp = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const levels = Object.entries(LEVEL_MAP).sort((a, b) => b[1] - a[1]);
      const newLevel = levels.find(([_, threshold]) => newXp >= threshold)?.[0] as FaithLevel || FaithLevel.CRUMB;

      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const renderView = () => {
    const props = { addXp, progress, setProgress, setView: setCurrentView };
    switch (currentView) {
      case 'home': return <HomeView {...props} />;
      case 'bible': return <BibleView {...props} />;
      case 'challenges': return <ChallengesView {...props} />;
      case 'profile': return <ProfileView {...props} />;
      case 'study': return <StudyView onExit={() => setCurrentView('home')} />;
      case 'bread-mode': return <BreadModeView onExit={() => setCurrentView('home')} addXp={addXp} />;
      default: return <HomeView {...props} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bible', label: 'Bible', icon: BookOpen },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'profile', label: 'You', icon: User },
  ];

  const hideNav = useMemo(() => ['study', 'bread-mode'].includes(currentView), [currentView]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-hidden ${darkMode ? 'midnight-manna dark' : 'bg-[#FDFBF7]'}`}>
      
      {!hideNav && (
        <header className="px-6 pt-10 pb-4 flex justify-between items-center max-w-2xl mx-auto w-full z-20">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">BreadDaily</h1>
            <p className="text-xs font-bold opacity-40 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Matt 6:11</p>
          </div>
          <div className="flex gap-2.5 items-center">
            <button 
              onClick={() => setCurrentView('study')}
              className="p-3 rounded-2xl bg-bread-sage dark:bg-zinc-800 text-zinc-800 dark:text-white transition-all active:scale-90 hover:scale-105"
              aria-label="Study Mode"
            >
              <Coffee size={20} />
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-white transition-all active:scale-90 hover:scale-105"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto ${hideNav ? '' : 'pb-32'}`}>
        {renderView()}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/90 dark:bg-zinc-900/90 border border-zinc-100 dark:border-zinc-800 rounded-full py-4 px-6 shadow-2xl flex justify-between items-center z-50 backdrop-blur-xl transition-all">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as AppView)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isActive ? 'text-bread-wheat dark:text-bread-wheat scale-110' : 'text-zinc-300 dark:text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-bold tracking-[0.1em] uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default App;