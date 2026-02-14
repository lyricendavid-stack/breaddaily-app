# 🔒 BreadDaily v1.0 Product Lock

**Status**: FROZEN for Launch  
**Version**: 1.0.0  
**Date**: 2026-10-24

## 🎯 MVP Feature List (Shipped)
These features are locked, tested, and included in the v1.0 public release.

### 1. Daily Bread Experience
- **Daily Drop**: Static/AI-generated verse of the day with "Real Talk" breakdown.
- **Action Step**: Simple daily challenge (e.g., "Pray for 10s").
- **Bread Mode**: 60-second interactive slide flow for quick consumption.

### 2. Emotional Intelligence (AI)
- **Mood Selector**: 7 core emotions (Stressed, Angry, Lonely, etc.).
- **Generative Scripture**: Gemini 3.0 integration to fetch context-aware verses.

### 3. Gamification (Faith XP)
- **XP System**: Earn XP for reading, checking in, and mood selection.
- **Levels**: 5 ranks from "Crumb" to "Faith Warrior".
- **Streaks**: LocalStorage-based daily streak counter.
- **Badges**: Visual rewards for completing challenges.

### 4. Utilities
- **Bible Reader**: Basic search and text display (NIV/ESV simulation).
- **Study Mode**: 25-minute focus timer with lo-fi audio and verse popups.
- **Midnight Manna**: Dark mode support (System/Manual toggle).

---

## 📅 Moved to v1.1 (Deferred)
The following features were cut from v1.0 to ensure stability and focus.

- **Community & Groups**: Safe, moderated spaces for sharing prayer requests.
- **User Accounts**: Cloud authentication (Auth0/Supabase). Currently local-only.
- **Premium Subscription**: "Midnight Manna" is now free for all users.
- **Parental Controls**: Dashboard for parents to monitor activity.
- **Push Notifications**: Real OS-level notifications for daily drops.
- **Advanced Bible**: Full chapter/book navigation (currently search-based).

---

## ⚠️ Technical Debt & Known Limitations
Items to be addressed in the first maintenance patch.

1.  **Client-Side API Key**: `process.env.API_KEY` is used directly in the frontend. 
2.  **Audio Autoplay**: Study mode audio may be blocked by some browsers without explicit interaction.
3.  **Local Storage Limit**: Progress is stored locally; clearing cache wipes data.