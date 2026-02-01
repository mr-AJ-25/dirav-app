// ═══════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE SERVICE
// Handles all data persistence for the application
// ═══════════════════════════════════════════════════════════════════════════

import { TransactionModel, SavingsModel, ChatMessage } from '@/data/mockDatabase';

const STORAGE_KEYS = {
  USER: 'dirav_user',
  AUTH: 'dirav_auth',
  TRANSACTIONS: 'dirav_transactions',
  SAVINGS: 'dirav_savings',
  CHAT_HISTORY: 'dirav_chat_history',
  APPLIED_OFFERS: 'dirav_applied_offers',
  BOOKMARKED_BLOGS: 'dirav_bookmarked_blogs',
  SETTINGS: 'dirav_settings',
  STREAK: 'dirav_streak',
  LAST_LOGIN: 'dirav_last_login',
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  darkMode: boolean;
  currency: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════

export function saveAuthUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
  updateStreak();
}

export function getAuthUser(): AuthUser | null {
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function clearAuthUser(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}

// ═══════════════════════════════════════════════════════════════════════════
// STREAK TRACKING
// ═══════════════════════════════════════════════════════════════════════════

export function updateStreak(): void {
  const now = new Date();
  const today = now.toDateString();
  const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
  
  if (lastLogin === today) {
    // Already logged in today
    return;
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  let currentStreak = getStreak();
  
  if (lastLogin === yesterday.toDateString()) {
    // Consecutive day - increment streak
    currentStreak++;
  } else if (lastLogin !== today) {
    // Streak broken - reset to 1
    currentStreak = 1;
  }
  
  localStorage.setItem(STORAGE_KEYS.STREAK, currentStreak.toString());
  localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, today);
}

export function getStreak(): number {
  const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
  return streak ? parseInt(streak, 10) : 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function saveTransactions(transactions: TransactionModel[]): void {
  const serialized = transactions.map(t => ({
    ...t,
    date: t.date.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(serialized));
}

export function getTransactions(): TransactionModel[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    return parsed.map((t: TransactionModel & { date: string }) => ({
      ...t,
      date: new Date(t.date),
    }));
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SAVINGS GOALS
// ═══════════════════════════════════════════════════════════════════════════

export function saveSavingsGoals(savings: SavingsModel[]): void {
  localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savings));
}

export function getSavingsGoals(): SavingsModel[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.SAVINGS);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT HISTORY
// ═══════════════════════════════════════════════════════════════════════════

export function saveChatHistory(messages: ChatMessage[]): void {
  const serialized = messages.map(m => ({
    ...m,
    timestamp: m.timestamp.toISOString(),
  }));
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(serialized));
}

export function getChatHistory(): ChatMessage[] | null {
  const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    return parsed.map((m: ChatMessage & { timestamp: string }) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    }));
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// APPLIED OFFERS
// ═══════════════════════════════════════════════════════════════════════════

export function saveAppliedOffers(offers: string[]): void {
  localStorage.setItem(STORAGE_KEYS.APPLIED_OFFERS, JSON.stringify(offers));
}

export function getAppliedOffers(): string[] {
  const data = localStorage.getItem(STORAGE_KEYS.APPLIED_OFFERS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKMARKED BLOGS
// ═══════════════════════════════════════════════════════════════════════════

export function saveBookmarkedBlogs(blogs: string[]): void {
  localStorage.setItem(STORAGE_KEYS.BOOKMARKED_BLOGS, JSON.stringify(blogs));
}

export function getBookmarkedBlogs(): string[] {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_BLOGS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getSettings(): UserSettings {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const defaults: UserSettings = {
    notificationsEnabled: true,
    darkMode: false,
    currency: 'USD',
  };
  if (!data) return defaults;
  try {
    return { ...defaults, ...JSON.parse(data) };
  } catch {
    return defaults;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CLEAR ALL DATA
// ═══════════════════════════════════════════════════════════════════════════

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
