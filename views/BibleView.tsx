import React, { useState, useMemo } from 'react';
import { Search, Bookmark, Share2, Book, ChevronRight, Sparkles, Filter, X } from 'lucide-react';
import { UserProgress } from '../types';

interface Props {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

const BibleView: React.FC<Props> = ({ progress, setProgress }) => {
  const [version, setVersion] = useState('NIV');
  const [search, setSearch] = useState('');

  const featuredVerses = [
    { ref: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
    { ref: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord...' },
    { ref: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him...' },
    { ref: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.' },
    { ref: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
    { ref: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  ];

  const filteredVerses = useMemo(() => {
    if (!search.trim()) return featuredVerses;
    const lower = search.toLowerCase();
    return featuredVerses.filter(v => 
      v.ref.toLowerCase().includes(lower) || v.text.toLowerCase().includes(lower)
    );
  }, [search]);

  const toggleCrumb = (ref: string) => {
    setProgress(prev => {
      const isBookmarked = prev.crumbs.includes(ref);
      return {
        ...prev,
        crumbs: isBookmarked ? prev.crumbs.filter(c => c !== ref) : [...prev.crumbs, ref]
      };
    });
  };

  const handleShare = async (v: { ref: string; text: string }) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'BreadDaily Crumb',
          text: `"${v.text}" — ${v.ref}`,
        });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-10 animate-in fade-in duration-700 pb-20 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold dark:text-white">The Bible</h2>
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl flex">
          {['NIV', 'ESV', 'KJV'].map(v => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${version === v ? 'bg-white dark:bg-zinc-700 text-bread-wheat shadow-sm' : 'text-zinc-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-bread-wheat">
          <Search size={20} />
        </div>
        <input 
          type="text"
          placeholder="Search books or keywords..."
          className="w-full bg-white dark:bg-[#1A1D23] border border-zinc-100 dark:border-white/5 rounded-[2rem] py-5 pl-14 pr-6 text-sm outline-none focus:ring-4 focus:ring-bread-wheat/10 dark:text-white transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-400"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setSearch('Psalm')}
          className="bg-bread-cream dark:bg-zinc-800/40 p-8 rounded-[2.5rem] space-y-3 border border-transparent hover:border-bread-wheat/20 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-bread-wheat/10 flex items-center justify-center text-bread-wheat group-hover:scale-110 transition-transform">
            <Book size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">Old Testament</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-zinc-500">Genesis to Malachi</p>
          </div>
        </button>
        <button 
          onClick={() => setSearch('Matthew')}
          className="bg-bread-sage dark:bg-zinc-800/40 p-8 rounded-[2.5rem] space-y-3 border border-transparent hover:border-bread-wheat/20 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">New Testament</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-zinc-500">Matthew to Revelation</p>
          </div>
        </button>
      </div>

      <section className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {search ? `Search Results (${filteredVerses.length})` : 'Trending Crumbs'}
          </h3>
          <ChevronRight size={16} className="text-zinc-300" />
        </div>
        
        {filteredVerses.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-zinc-50 dark:bg-white/5 rounded-[3rem]">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
               <Filter size={32} className="text-zinc-300" />
            </div>
            <p className="font-bold text-zinc-400">No matching bread found...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVerses.map((v) => {
              const active = progress.crumbs.includes(v.ref);
              return (
                <div key={v.ref} className="bg-white dark:bg-[#1A1D23] border border-zinc-100 dark:border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-sm group transition-all hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-bread-wheat">{v.ref}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShare(v)}
                        className="p-3 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all"
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        onClick={() => toggleCrumb(v.ref)}
                        className={`p-3 rounded-2xl transition-all ${active ? 'bg-bread-wheat text-white scale-110' : 'text-zinc-300 hover:text-bread-wheat'}`}
                      >
                        <Bookmark size={18} fill={active ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                  <p className="text-2xl italic leading-relaxed font-serif-bible text-zinc-800 dark:text-zinc-100">"{v.text}"</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default BibleView;