
import { FaithLevel, Verse } from './types';

export const COLORS = {
  beige: '#FDFBF7',
  wheat: '#D4A373',
  sage: '#CCD5AE',
  cream: '#FAEDCD',
  midnight: '#0F1115',
};

export const INITIAL_DAILY_BREAD: Verse = {
  reference: 'Matthew 6:11',
  text: 'Give us this day our daily bread.',
  breakdown: 'This isn\'t just about food. It\'s a daily request for God to provide exactly what your soul needs for the next 24 hours.',
  realTalk: 'Stop stressing about the giant "what ifs" of next semester or your future career. Focus on the grace available for right now.',
  challenge: 'Write down one thing you are worried about for next week. Cross it out and pray: "Lord, I trust You for today."',
  prayer: 'Father, help me trust You for my needs today and rest in Your provision.'
};

export const DAILY_BREAD_SAMPLES: Verse[] = [
  INITIAL_DAILY_BREAD,
  {
    reference: 'Philippians 4:6',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    breakdown: 'Paul is telling us that we don\'t have to carry our stress alone. There\'s a direct line to God through prayer.',
    realTalk: 'Between exam weeks and social media drama, life gets loud. This verse is your permission to hit the pause button and vent to God instead of overthinking.',
    challenge: 'Next time you feel a panic spike today, stop and say a 10-second prayer asking for peace.',
    prayer: 'Lord, take the noise in my head and replace it with Your quiet confidence.'
  },
  {
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    breakdown: 'God isn\'t just suggesting we be brave; He\'s promising His presence as the reason why we can be.',
    realTalk: 'Being the "new person" or standing up for what\'s right is terrifying. But you\'re never walking into those rooms solo.',
    challenge: 'Do one small thing today that scares you, knowing God is standing right there with you.',
    prayer: 'Father, give me the backbone to be brave and the heart to trust Your presence.'
  }
];

export const LEVEL_MAP: Record<FaithLevel, number> = {
  [FaithLevel.CRUMB]: 0,
  [FaithLevel.BAKER]: 100,
  [FaithLevel.DISCIPLE]: 500,
  [FaithLevel.BREAD_BUILDER]: 1200,
  [FaithLevel.FAITH_WARRIOR]: 3000,
};

export const MOODS = [
  { label: 'Stressed', emoji: '🤯', color: 'bg-orange-100' },
  { label: 'Angry', emoji: '🔥', color: 'bg-red-100' },
  { label: 'Lonely', emoji: '☁️', color: 'bg-blue-100' },
  { label: 'Jealous', emoji: '🐍', color: 'bg-green-100' },
  { label: 'Doubting', emoji: '🤔', color: 'bg-purple-100' },
  { label: 'Overthinking', emoji: '🌀', color: 'bg-gray-100' },
  { label: 'Confident', emoji: '✨', color: 'bg-yellow-100' },
];

export const XP_VALUES = {
  CHECK_IN: 25,
  BREAD_MODE: 50,
  MOOD_FINDER: 15,
  CHALLENGE_COMPLETE: 250,
};
