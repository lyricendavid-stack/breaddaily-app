import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, Heart, ShieldCheck, Search, Loader2, AlertCircle, Flag, CheckCircle2 } from 'lucide-react';
import { moderateContent } from '../services/geminiService';
import { CommunityPost } from '../types';

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: 'Baker_23',
    category: 'School Stress',
    content: 'Anyone else drowning in finals? Joshua 1:9 is keeping me sane right now.',
    timestamp: Date.now() - 3600000,
    reactions: { amen: 12, praying: 8, encouraging: 5 }
  },
  {
    id: '2',
    author: 'GraceSeeker',
    category: 'Doubt & Questions',
    content: 'Is it normal to feel like God is silent sometimes? Just being honest.',
    timestamp: Date.now() - 7200000,
    reactions: { amen: 4, praying: 15, encouraging: 22 }
  }
];

const CommunityView: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Rate limiting effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async () => {
    if (!newPost.trim() || cooldown > 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Basic client-side sanitization
      const sanitized = newPost.trim().replace(/<[^>]*>?/gm, ''); 
      
      const mod = await moderateContent(sanitized);
      if (mod.safe) {
        const post: CommunityPost = {
          id: Date.now().toString(),
          author: 'You',
          category: 'General',
          content: sanitized,
          timestamp: Date.now(),
          reactions: { amen: 0, praying: 0, encouraging: 0 }
        };
        setPosts([post, ...posts]);
        setNewPost('');
        setCooldown(30); // 30-second cooldown between posts
      } else {
        setError(mod.reason || "Let's keep the bread fresh! Your post was flagged for moderation.");
      }
    } catch (err) {
      setError("Spirit check failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, isReported: true } : p
    ));
    // In production, this would send a trigger to a /reports collection
    alert("Thank you. This post has been sent to our moderation team for review.");
  };

  const handleReaction = (postId: string, type: keyof CommunityPost['reactions']) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [type]: p.reactions[type] + 1
          }
        };
      }
      return p;
    }));
  };

  const categories = ['School Stress', 'Sports', 'Doubt', 'Creativity', 'Leadership'];

  return (
    <div className="max-w-2xl mx-auto px-6 space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Bread Community</h2>
        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-3 py-1.5 rounded-full w-fit uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
          <ShieldCheck size={12} /> AI Moderated Safe Space
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-5 rounded-[2rem] shadow-sm space-y-4">
        <textarea 
          placeholder="Share a truth or ask for prayer..."
          maxLength={500}
          className="w-full bg-transparent resize-none h-24 outline-none text-sm p-2 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
          value={newPost}
          onChange={(e) => {
            setNewPost(e.target.value);
            if (error) setError(null);
          }}
        />
        
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-zinc-50 dark:border-zinc-800">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              {categories.slice(0, 2).map(c => (
                <span key={c} className="text-[10px] bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">{c}</span>
              ))}
            </div>
            {cooldown > 0 && (
              <span className="text-[9px] text-[#D4A373] font-bold">Cooldown: {cooldown}s</span>
            )}
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading || !newPost.trim() || cooldown > 0}
            className="bg-[#D4A373] text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-md shadow-[#D4A373]/20"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="py-20 text-center space-y-3 opacity-30">
            <MessageSquare size={48} className="mx-auto" />
            <p className="text-sm font-medium">No one's baked any bread yet. Be the first!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-[2.5rem] space-y-4 shadow-sm animate-in slide-in-from-bottom-2 duration-500 ${post.isReported ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A373] to-[#FAEDCD] ring-2 ring-white dark:ring-zinc-800 shadow-sm flex items-center justify-center text-xs font-bold text-white">
                    {post.author[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{post.author}</h4>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">{post.category}</p>
                  </div>
                </div>
                {!post.isReported && (
                  <button 
                    onClick={() => handleReport(post.id)}
                    className="p-2 text-zinc-300 hover:text-red-400 transition-colors"
                    title="Report Post"
                  >
                    <Flag size={14} />
                  </button>
                )}
              </div>
              
              <p className="text-[15px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                {post.isReported ? "This content is hidden pending review." : post.content}
              </p>

              {!post.isReported && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button 
                    onClick={() => handleReaction(post.id, 'amen')}
                    className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-[#FAEDCD] dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-zinc-700"
                  >
                    🍞 Amen <span className="opacity-40">{post.reactions.amen}</span>
                  </button>
                  <button 
                    onClick={() => handleReaction(post.id, 'praying')}
                    className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-[#E9EDC6] dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-zinc-700"
                  >
                    🙏 Praying <span className="opacity-40">{post.reactions.praying}</span>
                  </button>
                  <button 
                    onClick={() => handleReaction(post.id, 'encouraging')}
                    className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-zinc-700"
                  >
                    ✨ Encouraging <span className="opacity-40">{post.reactions.encouraging}</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityView;