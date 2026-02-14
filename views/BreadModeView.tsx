
import React, { useState } from 'react';
import { X, ChevronRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';

interface Props {
  onExit: () => void;
  addXp: (amount: number) => void;
}

const BreadModeView: React.FC<Props> = ({ onExit, addXp }) => {
  const [step, setStep] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  const slides = [
    {
      title: "One Verse",
      content: '"I can do all things through Christ who strengthens me."',
      ref: "Philippians 4:13",
      color: "bg-orange-500"
    },
    {
      title: "One Truth",
      content: "Strength isn't about your muscles or your brain power. It's about who's got your back.",
      ref: "Real Talk",
      color: "bg-[#D4A373]"
    },
    {
      title: "One Action",
      content: "Try something you've been putting off today. Just one small step.",
      ref: "Challenge",
      color: "bg-emerald-500"
    }
  ];

  const nextStep = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      addXp(50);
      onExit();
    }, 1500);
  };

  if (isFinishing) {
    return (
      <div className="fixed inset-0 z-[120] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center animate-bounce">
          <CheckCircle2 size={48} className="text-emerald-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Daily Bread Fed</h2>
          <div className="flex items-center justify-center gap-2 text-[#D4A373] font-bold">
            <Zap size={18} fill="currentColor" />
            <span>+50 XP Earned</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-zinc-900 text-white flex flex-col p-8 transition-colors duration-500">
      {/* Progress Bars */}
      <div className="flex gap-2 mt-4 mb-12">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-white transition-all duration-700 ease-out ${i < step ? 'w-full' : i === step ? 'w-full' : 'w-0'}`}
              style={{ transitionDelay: i === step ? '100ms' : '0ms' }}
            ></div>
          </div>
        ))}
      </div>

      <button onClick={onExit} className="absolute top-16 right-8 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all">
        <X size={24} className="opacity-60" />
      </button>

      <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm mx-auto w-full" key={step}>
        <div className="space-y-2 animate-in slide-in-from-left duration-500">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">{slides[step].title}</span>
          <div className={`h-1 w-12 ${slides[step].color} rounded-full`}></div>
        </div>
        
        <h2 className="text-4xl font-serif-bible italic leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          {slides[step].content}
        </h2>
        
        <div className="flex items-center gap-3 animate-in fade-in duration-1000 delay-300">
          <Sparkles size={16} className="text-[#D4A373]" />
          <p className="text-sm font-bold text-[#D4A373] uppercase tracking-widest">{slides[step].ref}</p>
        </div>
      </div>

      <div className="space-y-6 max-w-sm mx-auto w-full pb-8">
        <button 
          onClick={nextStep}
          className="w-full bg-white text-zinc-900 py-6 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
        >
          {step === slides.length - 1 ? (
            <>Complete 60s Bread <Zap size={20} fill="#D4A373" className="text-[#D4A373]" /></>
          ) : (
            <>Continue <ChevronRight size={20} /></>
          )}
        </button>

        <p className="text-center text-[10px] opacity-40 font-bold uppercase tracking-[0.2em]">
          Tap anywhere to progress
        </p>
      </div>
    </div>
  );
};

export default BreadModeView;
