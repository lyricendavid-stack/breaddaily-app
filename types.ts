
export type AppView = 'home' | 'bible' | 'challenges' | 'profile' | 'study' | 'bread-mode';

export interface Verse {
  reference: string;
  text: string;
  breakdown: string;
  realTalk: string;
  challenge: string;
  prayer?: string;
}

export interface UserProgress {
  xp: number;
  level: string;
  streak: number;
  completedChallenges: string[];
  crumbs: string[]; // Bookmarks
}

export enum FaithLevel {
  CRUMB = 'Crumb',
  BAKER = 'Baker',
  DISCIPLE = 'Disciple',
  BREAD_BUILDER = 'Bread Builder',
  FAITH_WARRIOR = 'Faith Warrior'
}

export type Mood = 'Stressed' | 'Angry' | 'Lonely' | 'Jealous' | 'Doubting' | 'Overthinking' | 'Confident';

export interface CommunityPost {
  id: string;
  author: string;
  category: string;
  content: string;
  timestamp: number;
  reactions: {
    amen: number;
    praying: number;
    encouraging: number;
  };
  isReported?: boolean;
}
