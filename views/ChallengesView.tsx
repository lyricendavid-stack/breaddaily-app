import React, { useState } from 'react';
import { Trophy, Shield, Heart, UserCheck, Flame, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { UserProgress, FaithLevel } from '../types';
import { XP_VALUES } from '../constants';

interface Props {
  addXp: (amount: number) => void;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

const CHALLENGE_DATA = [
  {
    id: 'anxiety-reset',
    title: 'Anxiety Reset',
    description: 'Find peace in the chaos with 7 days of restful scripture.',
    icon: Heart,
    color: 'bg-red-50 text-red-600',
    xp: XP_VALUES.CHALLENGE_COMPLETE,
    totalDays: 7
  },
  {
    id: 'identity-check',
    title: 'Who Are You?',
    description: 'Discover your worth as God sees you, not as the world does.',
    icon: UserCheck,
    color: 'bg-blue-50 text-blue-600',
    xp: XP_VALUES.CHALLENGE_COMPLETE,
    totalDays: 7
  },
  {
    id: 'bold-faith',
    title: 'Bold Faith Week',
    description: 'Living out your faith loudly and proudly in your school.',
    icon: Shield,
    color: 'bg-orange-50 text-orange-600',
    xp: XP_VALUES.CHALLENGE_COMPLETE,
    totalDays: 7
  }
];

const ChallengesView: React.FC<Props> = ({ addXp, progress, setProgress }) => {
  const [startingId, setStartingId] = useState<string | null>(null);
  
  const isCompleted = (id: string) => progress.completedChallenges.includes(id);

  const startChallenge = (id: string) => {
    setStartingId(id);
    // Simulate some work/animation
    setTimeout(() => {
      setProgress(prev => ({
        ...prev,
        completedChallenges: [...prev.completedChallenges, id]
      }));
      addXp(XP_VALUES.CHALLENGE_COMPLETE);
      setStartingId(null);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold dark:text-white">7-Day Challenges</h2>
        <p className="text-sm opacity-50 dark:text-zinc-400">Deepen your roots and level up your faith.</p>
      </div>

      <div className="space-y-4">
        {CHALLENGE_DATA.map((challenge) => {
          const completed = isCompleted(challenge.id);
          const isStarting = startingId === challenge.id;
          const currentDays = completed ? challenge.totalDays : 0;

          return (
            <div key={challenge.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5 dark:opacity-10 group-hover:scale-110 transition-transform`}>
                <challenge.icon size={96} />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${challenge.color} dark:bg-zinc-800`}>
                      <challenge.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold dark:text-white">{challenge.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-bread-wheat">+{challenge.xp} XP Badge</p>
                    </div>
                  </div>
                  {completed && <CheckCircle2 className="text-emerald-500" size={24} />}
                </div>

                <p className="text-sm opacity-60 dark:text-zinc-400 max-w-[85%]">{challenge.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">
                    <span>Progress</span>
                    <span>{currentDays}/{challenge.totalDays} Days</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bread-wheat transition-all duration-1000" 
                      style={{ width: `${(currentDays / challenge.totalDays) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  disabled={completed || isStarting}
                  onClick={() => startChallenge(challenge.id)}
                  className={`w-full py-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    completed 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default' 
                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isStarting && <Loader2 size={16} className="animate-spin" />}
                  {completed ? 'Challenge Completed' : isStarting ? 'Starting Journey...' : 'Start Your Journey'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 dark:text-zinc-500">Milestone Badges</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className={`aspect-square rounded-2xl flex items-center justify-center shadow-inner transition-all ${progress.completedChallenges.length > 0 ? 'bg-bread-cream' : 'bg-zinc-50 dark:bg-zinc-800 grayscale opacity-30'}`}>
            <Flame className="text-bread-wheat" size={24} />
          </div>
          <div className={`aspect-square rounded-2xl flex items-center justify-center shadow-inner transition-all ${progress.completedChallenges.length > 1 ? 'bg-bread-sage' : 'bg-zinc-50 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-800 grayscale opacity-30'}`}>
            <Star className="text-bread-clay" size={24} />
          </div>
          <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center grayscale opacity-30">
            <Trophy size={24} />
          </div>
          <div className="aspect-square bg-zinc-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center grayscale opacity-30">
            <Shield size={24} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChallengesView;