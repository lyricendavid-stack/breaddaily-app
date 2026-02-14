import React, { useState } from 'react';
import { AppView, UserProgress, Mood, Verse } from '../types';
import { INITIAL_DAILY_BREAD, MOODS, XP_VALUES } from '../constants';
import { Zap, Heart, Share2, ArrowRight, Loader2, Sparkles, Flame, Play, AlertCircle, CheckCircle, Quote } from 'lucide-react';
import { getMoodBasedScripture } from '../services/geminiService';

interface Props {
  setView: (view: AppView) => void;
  addXp: (amount: number) => void;
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

const HomeView: React.FC<Props> = ({ setView, addXp, progress, setProgress }) => {
  const [dailyVerse, setDailyVerse] = useState<Verse>(INITIAL_DAILY_BREAD);
  const [loadingMood, setLoadingMood] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleMoodSelect = async (mood: Mood) => {
    setLoadingMood(true);
    setError(null);
    try {
      const verse = await getMoodBasedScripture(mood);
      setDailyVerse(verse);
      addXp(XP_VALUES.MOOD_FINDER);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError("Couldn't reach the Bread Oven. Try again later.");
    } finally {
      setLoadingMood(false);
    }
  };

  const handleCheckIn = () => {
    if (!hasCheckedIn) {
      addXp(XP_VALUES.CHECK_IN);
      setHasCheckedIn(true);
    }
  };

  const toggleCrumb = () => {
    const ref = dailyVerse.reference;
    const isBookmarked = progress.crumbs.includes(ref);
    
    setProgress(prev => ({
      ...prev,
      crumbs: isBookmarked ? prev.crumbs.filter(c => c !== ref) : [...prev.crumbs, ref]
    }));

    if (!isBookmarked) {
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'BreadDaily - Daily Bread',
      text: `"${dailyVerse.text}" — ${dailyVerse.reference}\n\nShared from BreadDaily`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("Copied to clipboard!");
      }
    } catch (err) { console.error('Share failed', err); }
  };

  const isBookmarked = progress.crumbs.includes(dailyVerse.reference);

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Dynamic Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="bg-white dark:bg-[#1A1D23] border border-zinc-100 dark:border-white/5 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame size={16} className="text-orange-500" />
            </div>
            <span className="font-bold text-xs dark:text-zinc-300">{progress.streak} Day Streak</span>
          </div>
          <div className="bg-white dark:bg-[#1A1D23] border border-zinc-100 dark:border-white/5 rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-bread-wheat/10 flex items-center justify-center">
              <Zap size={16} className="text-bread-wheat" />
            </div>
            <span className="font-bold text-xs dark:text-zinc-300">{progress.xp} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-purple-500 bg-purple-500/5 px-4 py-2 rounded-full border border-purple-500/10">
          <Sparkles size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">{progress.level}</span>
        </div>
      </div>

      {/* Main Feature: Daily Bread Drop */}
      <section className="relative group">
        <div className="bg-white dark:bg-[#1A1D23] border border-zinc-100 dark:border-white/5 rounded-[3rem] p-10 shadow-2xl shadow-bread-wheat/5 transition-all duration-500 hover:shadow-bread-wheat/10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-bread-wheat animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">Daily Bread Drop</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all bg-zinc-50 dark:bg-zinc-800 rounded-2xl"
              >
                <Share2 size={18} />
              </button>
              <button 
                onClick={toggleCrumb}
                className={`p-3 rounded-2xl transition-all ${isBookmarked ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-300 hover:text-red-400'}`}
              >
                <Heart size={18} fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <Quote className="absolute -top-6 -left-6 text-bread-wheat/10 dark:text-bread-wheat/5" size={60} />
              <h2 className="text-4xl font-serif-bible italic leading-[1.2] text-zinc-900 dark:text-white mb-4 relative z-10">
                {dailyVerse.text}
              </h2>
              <p className="text-sm font-bold text-bread-wheat tracking-wider">{dailyVerse.reference}</p>
            </div>

            <div className="grid gap-6 pt-10 border-t border-zinc-50 dark:border-white/5">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">The Breakdown</h4>
                <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-400">{dailyVerse.breakdown}</p>
              </div>
              
              <div className="bg-bread-cream/30 dark:bg-zinc-800/30 p-6 rounded-3xl border border-bread-cream dark:border-white/5 space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-bread-wheat">Real Talk</h4>
                <p className="text-base leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium italic">"{dailyVerse.realTalk}"</p>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Challenge</h4>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{dailyVerse.challenge}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button 
              onClick={() => setView('bread-mode')}
              className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/10 dark:shadow-none"
            >
              Feed me faster (60s Mode) <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {showSavedToast && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-full flex items-center gap-3 animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 shadow-2xl">
              <CheckCircle size={20} className="text-bread-sage" />
              <span className="font-black text-xs uppercase tracking-widest">Saved to Crumbs</span>
            </div>
          </div>
        )}
      </section>

      {/* Spirit Check-in */}
      {!hasCheckedIn && (
        <button 
          onClick={handleCheckIn}
          className="w-full bg-gradient-to-r from-bread-wheat to-bread-sage p-0.5 rounded-[2rem] overflow-hidden shadow-sm hover:scale-[1.01] transition-all"
        >
          <div className="bg-white dark:bg-[#0F1115] px-8 py-6 rounded-[calc(2rem-2px)] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-bread-wheat/10 flex items-center justify-center">
                <Flame size={24} className="text-bread-wheat" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-zinc-900 dark:text-white">Daily Spirit Check-in</h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">Collect your daily XP boost</p>
              </div>
            </div>
            <span className="bg-bread-wheat text-white text-[10px] font-black px-4 py-2 rounded-full">+{XP_VALUES.CHECK_IN} XP</span>
          </div>
        </button>
      )}

      {/* Mood Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">How's your heart?</h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">Scripture matches for your exact mood.</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOODS.map((mood, idx) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.label as Mood)}
              disabled={loadingMood}
              className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] transition-all duration-300 border border-transparent hover:border-bread-wheat/20 active:scale-95 disabled:opacity-50 ${mood.color} dark:bg-zinc-800/40`}
            >
              <span className="text-3xl transform group-hover:scale-125 transition-transform duration-300" role="img" aria-label={mood.label}>{mood.emoji}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">{mood.label}</span>
            </button>
          ))}
        </div>
        
        {loadingMood && (
          <div className="flex items-center justify-center gap-3 text-sm text-bread-wheat dark:text-white animate-pulse py-4 bg-bread-wheat/5 rounded-3xl border border-bread-wheat/10">
            <Loader2 className="animate-spin" size={20} /> 
            <span className="font-black text-[10px] uppercase tracking-widest">Baking your custom bread...</span>
          </div>
        )}
      </section>

      {/* Study Mode Banner */}
      <section 
        onClick={() => setView('study')}
        className="group bg-[#E9EDC6] dark:bg-emerald-950/20 p-8 rounded-[3rem] cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-between border border-transparent dark:border-white/5"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <h3 className="font-black text-xs uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Study With God</h3>
          </div>
          <p className="text-lg font-serif-bible italic text-emerald-900 dark:text-zinc-100">"Come to me, all you who are weary..."</p>
          <p className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-400/50 uppercase tracking-widest">Lo-fi beats + Scripture pop-ups</p>
        </div>
        <div className="w-16 h-16 rounded-[2rem] bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play size={24} fill="currentColor" />
        </div>
      </section>
    </div>
  );
};

export default HomeView;