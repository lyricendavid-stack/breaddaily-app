import React, { useState } from 'react';
import { UserProgress, AppView } from '../types';
import { LEVEL_MAP } from '../constants';
import { 
  Settings, 
  Bookmark, 
  History, 
  Award, 
  Trash2, 
  X, 
  Info,
  ExternalLink,
  LogOut,
  AlertTriangle
} from 'lucide-react';

interface Props {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  setView: (view: AppView) => void;
}

const ProfileView: React.FC<Props> = ({ progress, setProgress, setView }) => {
  const [showSettings, setShowSettings] = useState(false);
  
  const levels = Object.entries(LEVEL_MAP).sort((a, b) => a[1] - b[1]);
  const currentLevelIndex = levels.findIndex(([name]) => name === progress.level);
  const nextLevel = levels[currentLevelIndex + 1] || levels[levels.length - 1];
  
  const currentMinXp = levels[currentLevelIndex][1];
  const nextMaxXp = nextLevel[1];
  
  const relativeXp = progress.xp - currentMinXp;
  const relativeMax = nextMaxXp - currentMinXp;
  const progressPercent = Math.min(Math.max((relativeXp / (relativeMax || 1)) * 100, 5), 100);

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all your badges, XP, and saved crumbs. This cannot be undone.")) {
      localStorage.removeItem('breadDaily_progress');
      window.location.reload();
    }
  };

  const removeCrumb = (ref: string) => {
    setProgress(prev => ({
      ...prev,
      crumbs: prev.crumbs.filter(c => c !== ref)
    }));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Profile Header */}
      <div className="flex justify-between items-start pt-4">
        <div className="w-10 h-10"></div> {/* Spacer */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-bread-wheat to-bread-sage flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-bread-wheat/20">
              {progress.level[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700">
              <Award size={18} className="text-bread-wheat" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{progress.level}</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Faith Warrior Journey</p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2.5rem] shadow-sm space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Total XP Earned</span>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{progress.xp} <span className="text-xs text-zinc-300 dark:text-zinc-600">/ {nextMaxXp}</span></p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-widest text-bread-wheat">Next: {nextLevel[0]}</span>
          </div>
        </div>
        <div className="w-full h-3 bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-bread-wheat rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,163,115,0.3)]" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-transparent dark:border-zinc-800 transition-colors">
          <History className="text-orange-500 mb-2" size={20} />
          <h4 className="text-2xl font-bold dark:text-white">{progress.streak}</h4>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">Day Streak</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-transparent dark:border-zinc-800 transition-colors">
          <Bookmark className="text-bread-wheat mb-2" size={20} />
          <h4 className="text-2xl font-bold dark:text-white">{progress.crumbs.length}</h4>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">Saved Crumbs</p>
        </div>
      </div>

      {/* Crumbs Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500 px-1">My Crumbs</h3>
        {progress.crumbs.length === 0 ? (
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-100 dark:border-zinc-800 py-12 rounded-[2rem] text-center space-y-2">
            <Bookmark size={32} className="mx-auto opacity-10 dark:text-white" />
            <p className="text-sm font-medium text-zinc-400">Your bread basket is empty...</p>
            <button 
              onClick={() => setView('bible')} 
              className="text-xs font-bold text-bread-wheat hover:underline"
            >
              Go find some verses
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.crumbs.map((ref) => (
              <div 
                key={ref} 
                className="group flex items-center justify-between bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm animate-in slide-in-from-right-2 transition-all hover:border-bread-wheat/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-bread-cream/30 dark:bg-zinc-800 flex items-center justify-center text-bread-wheat">
                    <Bookmark size={18} fill="currentColor" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold dark:text-zinc-200">{ref}</h5>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Saved Crumb</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setView('bible')}
                    className="p-3 text-zinc-400 hover:text-bread-wheat dark:hover:text-white transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    onClick={() => removeCrumb(ref)}
                    className="p-3 text-zinc-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Settings Modal - v1.0 MVP */}
      {showSettings && (
        <div className="fixed inset-0 z-[150] bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-300 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold dark:text-white">Settings</h3>
                <button 
                  onClick={() => setShowSettings(false)} 
                  className="p-2 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm text-zinc-400">
                    <Info size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-zinc-200">BreadDaily v1.0.0</p>
                    <p className="text-xs text-zinc-400">Beta Release</p>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3 px-1">Danger Zone</h4>
                  <button 
                    onClick={handleReset}
                    className="w-full p-4 rounded-3xl bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 font-bold text-sm"
                  >
                    <AlertTriangle size={18} />
                    Reset All Progress & Data
                  </button>
                </div>
              </div>
              
              <p className="text-center text-[10px] text-zinc-300 dark:text-zinc-600 font-medium">
                "Give us this day our daily bread."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;