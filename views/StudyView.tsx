
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Droplets, Wind, Coffee, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onExit: () => void;
}

const LOFI_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Placeholder for a real lo-fi stream

const StudyView: React.FC<Props> = ({ onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [seconds, setSeconds] = useState(1500); // 25 mins
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const popups = [
    "Drink some water. You're worth it.",
    "Take a deep breath. God's got this.",
    "Quick prayer break: Just say thanks for 3 things.",
    "Stretch your arms. Relax your shoulders.",
    "Remember: You are loved, chosen, and redeemed.",
    "Rest in His presence right now.",
    "You are doing great. Keep going."
  ];

  useEffect(() => {
    audioRef.current = new Audio(LOFI_URL);
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => {
          const newS = s - 1;
          // Trigger a popup roughly every 5 minutes in a 25 min session
          if (newS > 0 && newS % 300 === 0) {
            triggerPopup();
          }
          return newS;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, seconds]);

  const triggerPopup = () => {
    const randomPopup = popups[Math.floor(Math.random() * popups.length)];
    setPopupContent(randomPopup);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 6000);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-[#0F1115] z-[100] flex flex-col items-center justify-center p-8 text-center space-y-12 overflow-hidden transition-colors duration-700">
      <button 
        onClick={onExit}
        className="absolute top-10 right-8 p-3 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all border border-zinc-100 dark:border-white/10 shadow-sm"
      >
        <X size={24} className="dark:text-white" />
      </button>

      <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h2 className="text-4xl font-serif-bible italic dark:text-white">Study With God</h2>
        <div className="flex items-center justify-center gap-2 opacity-40 dark:text-white">
          <span className="h-[1px] w-8 bg-current"></span>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Matthew 11:28</p>
          <span className="h-[1px] w-8 bg-current"></span>
        </div>
      </div>

      <div className="relative group">
        <div className="w-72 h-72 rounded-full border-[1px] border-zinc-200 dark:border-white/10 flex items-center justify-center relative shadow-inner">
          {/* Pulse animation */}
          <div className={`absolute inset-0 rounded-full bg-[#E9EDC6] dark:bg-zinc-800 transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-10 animate-pulse' : 'scale-100 opacity-0'}`}></div>
          <div className="relative z-10 flex flex-col items-center">
             <span className="text-7xl font-light tracking-tighter dark:text-white tabular-nums">{formatTime(seconds)}</span>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-2 dark:text-white">Focus Session</p>
          </div>
        </div>
        
        {showPopup && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-800 px-8 py-4 rounded-[2rem] shadow-2xl border border-[#D4A373]/30 animate-in zoom-in-95 fade-in duration-500 whitespace-nowrap z-50">
            <div className="flex items-center gap-3">
              <span className="text-lg">✨</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-white">{popupContent}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-zinc-800 rotate-45 border-r border-b border-[#D4A373]/30"></div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-10">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-4 rounded-2xl transition-all ${isMuted ? 'text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-zinc-400 hover:text-zinc-800 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900'}`}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
        
        <button 
          onClick={handleTogglePlay}
          className="w-24 h-24 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2.5rem] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-zinc-200 dark:shadow-none"
        >
          {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
        </button>
        
        <button className="p-4 rounded-2xl text-zinc-400 hover:text-zinc-800 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 transition-all">
          <Wind size={24} />
        </button>
      </div>

      <div className="max-w-xs mx-auto space-y-6 animate-in fade-in duration-1000 delay-500">
        <div className="flex items-center justify-center gap-4 py-2 px-6 rounded-full bg-[#FAEDCD] dark:bg-zinc-900/50 w-fit mx-auto">
          <Coffee size={18} className="text-[#D4A373]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A373]">Lo-fi Instrumental Active</span>
        </div>
        <p className="text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400 font-serif-bible text-lg px-4">
          "Come to me, all you who are weary and burdened, and I will give you rest."
        </p>
      </div>
      
      {/* Audio Wave Visualizer */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none overflow-hidden flex items-end justify-center gap-1.5 px-4 opacity-10">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 bg-[#D4A373] rounded-t-full transition-all duration-700 ease-in-out`} 
            style={{ 
              height: isPlaying ? `${Math.random() * 90 + 10}%` : '4%',
              transitionDelay: `${i * 30}ms`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StudyView;
