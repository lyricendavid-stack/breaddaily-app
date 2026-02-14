
import React from 'react';
// @ts-ignore
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { XP_VALUES } from '../constants';

// Fix: Declare Jest globals to resolve TypeScript errors
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;

// --- MOCKS ---

// Mock Gemini Service
jest.mock('../services/geminiService', () => ({
  getMoodBasedScripture: jest.fn().mockResolvedValue({
    reference: 'Psalm 23:1',
    text: 'The Lord is my shepherd.',
    breakdown: 'God guides you.',
    realTalk: 'You are not alone.',
    challenge: 'Pray once today.',
    prayer: 'Thank you Lord.'
  })
}));

// Mock Audio for Study Mode
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();

// Mock ScrollTo
window.scrollTo = jest.fn();

// Mock LocalStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// --- TESTS ---

describe('BreadDaily Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Renders Home View and Daily Bread card', () => {
    render(<App />);
    expect(screen.getByText('BreadDaily')).toBeInTheDocument();
    expect(screen.getByText('Daily Bread Drop')).toBeInTheDocument();
    expect(screen.getByText('The Breakdown')).toBeInTheDocument();
  });

  test('Daily Check-in increments XP and Streak', () => {
    render(<App />);
    
    // Initial XP check (assuming 0 from clear localStorage)
    const xpBadges = screen.getAllByText(/0 XP/i);
    expect(xpBadges.length).toBeGreaterThan(0);

    // Find and click Check-in
    const checkInBtn = screen.getByText('Daily Spirit Check-in');
    fireEvent.click(checkInBtn);

    // Expect XP update
    // Note: React state updates might need waitFor
    expect(screen.queryByText('Daily Spirit Check-in')).not.toBeInTheDocument(); // Should disappear
    expect(screen.getByText(`${XP_VALUES.CHECK_IN} XP`)).toBeInTheDocument();
  });

  test('Mood Filter calls AI service and updates view', async () => {
    render(<App />);
    
    const stressedBtn = screen.getByText('Stressed');
    fireEvent.click(stressedBtn);

    expect(screen.getByText('Baking your custom bread...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Psalm 23:1')).toBeInTheDocument();
    });
  });

  test('Navigation switches views correctly', () => {
    render(<App />);
    
    // Navigate to Bible
    const bibleNav = screen.getByText('BIBLE');
    fireEvent.click(bibleNav);
    expect(screen.getByText('The Bible')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search books or keywords...')).toBeInTheDocument();
    
    // Check Profile Navigation
    const profileNav = screen.getByText('YOU');
    fireEvent.click(profileNav);
    expect(screen.getByText('Faith Warrior Journey')).toBeInTheDocument();
  });

  test('Bread Mode (60s) flow and XP reward', async () => {
    render(<App />);
    
    // Enter Bread Mode
    fireEvent.click(screen.getByText(/Feed me faster/i));
    
    expect(screen.getByText('One Verse')).toBeInTheDocument();
    
    // Step through slides
    const nextBtn = screen.getByText('Continue');
    fireEvent.click(nextBtn); // To Truth
    fireEvent.click(nextBtn); // To Action
    
    const completeBtn = screen.getByText(/Complete 60s Bread/i);
    fireEvent.click(completeBtn);

    // Expect Finish Screen
    await waitFor(() => {
      expect(screen.getByText('Daily Bread Fed')).toBeInTheDocument();
      expect(screen.getByText('+50 XP Earned')).toBeInTheDocument();
    });
  });
});
