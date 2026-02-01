import { useState, useEffect } from 'react';
import { DiravCard, DiravButton, DiravBadge } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase } from '@/data/mockDatabase';
import { useAuth } from '@/context/AuthContext';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { getSettings, saveSettings, getStreak } from '@/services/storageService';
import { 
  FireIcon, 
  TargetIcon, 
  CalendarIcon,
  EditIcon,
  SettingsIcon,
  BellIcon,
  LogoutIcon,
  WalletIcon,
  TrendUpIcon,
  SavingsIcon,
  CloseIcon,
  CheckIcon
} from '@/core/icons/Icons';

export function ProfileScreen() {
  const { user, isAuthenticated, logout, streak } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [quote, setQuote] = useState(MockDatabase.getRandomQuote());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [settings, setSettings] = useState(getSettings());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(MockDatabase.getRandomQuote());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSettingsToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
    showSuccessToast('Settings updated');
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        {/* Auth Required Card */}
        <div className="max-w-md mx-auto mt-8">
          <DiravCard className="text-center">
            {/* Illustration */}
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${DiravColors.primary}15` }}
            >
              <ProfileIconLarge />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
              Access Your Profile
            </h2>
            <p className="text-[#6B7280] mb-6">
              Sign in or create an account to view your profile, track your progress, and earn achievements.
            </p>

            {/* Benefits */}
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-medium text-[#111827] text-sm">Track Your Progress</p>
                  <p className="text-xs text-[#6B7280]">See your financial journey at a glance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">🏆</span>
                <div>
                  <p className="font-medium text-[#111827] text-sm">Earn Achievements</p>
                  <p className="text-xs text-[#6B7280]">Unlock badges as you reach milestones</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">🔥</span>
                <div>
                  <p className="font-medium text-[#111827] text-sm">Build Your Streak</p>
                  <p className="text-xs text-[#6B7280]">Log in daily to maintain your streak</p>
                </div>
              </div>
            </div>

            <DiravButton
              label="Sign In or Create Account"
              fullWidth
              onClick={() => setShowAuthModal(true)}
            />
          </DiravCard>
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthScreen
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => setShowAuthModal(false)}
          />
        )}
      </div>
    );
  }

  // User data
  const mockUser = MockDatabase.user;
  const displayStreak = streak || getStreak() || mockUser.streak;
  const totalBalance = MockDatabase.getTotalBalance();
  const savingsProgress = MockDatabase.getSavingsProgress();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(user?.createdAt || mockUser.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const earnedBadges = mockUser.badges.filter(b => b.earned);
  const lockedBadges = mockUser.badges.filter(b => !b.earned);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckIcon size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Motivational Quote Card */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6"
        style={{
          background: `linear-gradient(135deg, ${DiravColors.primary} 0%, ${DiravColors.accentGradientEnd} 100%)`,
        }}
      >
        <div className="relative z-10">
          <p className="text-white/80 text-xs sm:text-sm mb-1">Daily Motivation</p>
          <p className="text-white text-base sm:text-lg font-medium leading-relaxed mb-2">
            "{quote.quote}"
          </p>
          <p className="text-white/70 text-xs sm:text-sm">— {quote.author}</p>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <SparkleDecoration />
        </div>
      </div>

      {/* Profile Header */}
      <DiravCard className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4 sm:gap-0">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white flex-shrink-0"
              style={{ backgroundColor: DiravColors.primary }}
            >
              {user?.avatar || mockUser.avatar}
            </div>
            <div className="sm:hidden">
              <h2 className="text-lg font-bold text-[#111827]">{user?.name || mockUser.name}</h2>
              <p className="text-sm text-[#6B7280]">{user?.email || mockUser.email}</p>
              <DiravBadge
                label={mockUser.level}
                color={`${DiravColors.primary}20`}
                textColor={DiravColors.primary}
                className="mt-1"
              />
            </div>
          </div>

          {/* Info - Desktop */}
          <div className="hidden sm:flex flex-1 sm:ml-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#111827]">{user?.name || mockUser.name}</h2>
              <p className="text-sm text-[#6B7280] mb-2">{user?.email || mockUser.email}</p>
              <DiravBadge
                label={mockUser.level}
                color={`${DiravColors.primary}20`}
                textColor={DiravColors.primary}
              />
            </div>
          </div>

          {/* Edit Button */}
          <button 
            onClick={() => setShowEditProfile(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-[#6B7280] w-full sm:w-auto"
          >
            <EditIcon size={16} />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>

        {/* Member Since & Streak */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">
              Member since {formatDate(user?.createdAt || mockUser.joinedDate.toISOString())} ({daysSinceJoined} days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FireIcon size={16} className="text-[#F59E0B]" />
            <span className="text-sm font-semibold" style={{ color: DiravColors.warning }}>
              {displayStreak} day streak! 🔥
            </span>
          </div>
        </div>
      </DiravCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <DiravCard padding="sm" className="text-center">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
            style={{ backgroundColor: `${DiravColors.primary}15` }}
          >
            <WalletIcon size={20} className="text-[#7C3AED]" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#111827]">{formatCurrency(totalBalance)}</p>
          <p className="text-xs sm:text-sm text-[#6B7280]">Total Balance</p>
        </DiravCard>

        <DiravCard padding="sm" className="text-center">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
            style={{ backgroundColor: `${DiravColors.success}15` }}
          >
            <SavingsIcon size={20} className="text-[#10B981]" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#111827]">{formatCurrency(mockUser.totalSaved)}</p>
          <p className="text-xs sm:text-sm text-[#6B7280]">Total Saved</p>
        </DiravCard>

        <DiravCard padding="sm" className="text-center">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
            style={{ backgroundColor: `${DiravColors.info}15` }}
          >
            <TargetIcon size={20} className="text-[#3B82F6]" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#111827]">{mockUser.goalsCompleted}</p>
          <p className="text-xs sm:text-sm text-[#6B7280]">Goals Done</p>
        </DiravCard>

        <DiravCard padding="sm" className="text-center">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3"
            style={{ backgroundColor: `${DiravColors.warning}15` }}
          >
            <TrendUpIcon size={20} className="text-[#F59E0B]" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#111827]">{mockUser.transactionsLogged}</p>
          <p className="text-xs sm:text-sm text-[#6B7280]">Transactions</p>
        </DiravCard>
      </div>

      {/* Progress Overview */}
      <DiravCard className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-4">Your Progress</h3>
        
        <div className="space-y-4">
          {/* Savings Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Savings Goals Progress</span>
              <span className="text-sm font-semibold text-[#7C3AED]">{savingsProgress.toFixed(0)}%</span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${savingsProgress}%`,
                  backgroundColor: DiravColors.primary,
                }}
              />
            </div>
          </div>

          {/* Budget Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Budget Health</span>
              <span className="text-sm font-semibold text-[#10B981]">Good</span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '75%', backgroundColor: DiravColors.success }}
              />
            </div>
          </div>

          {/* Monthly Spending */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B7280]">Monthly Spending</span>
              <span className="text-sm font-semibold text-[#F59E0B]">Under Budget</span>
            </div>
            <div className="h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '45%', backgroundColor: DiravColors.warning }}
              />
            </div>
          </div>
        </div>
      </DiravCard>

      {/* Badges Section */}
      <DiravCard className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-[#111827]">Achievements</h3>
          <span className="text-xs sm:text-sm text-[#6B7280]">
            {earnedBadges.length} of {mockUser.badges.length} earned
          </span>
        </div>

        {/* Earned Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#7C3AED]/5 to-[#C026D3]/5 border border-[#7C3AED]/10"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">{badge.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#111827] truncate">{badge.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{badge.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <>
            <p className="text-xs sm:text-sm text-[#6B7280] mb-3">Keep going to unlock:</p>
            <div className="flex flex-wrap gap-2">
              {lockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 opacity-60"
                >
                  <span className="text-lg grayscale">{badge.icon}</span>
                  <span className="text-xs text-[#6B7280]">{badge.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </DiravCard>

      {/* Settings Section */}
      <DiravCard>
        <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-4">Settings</h3>
        
        <div className="space-y-2">
          {/* Notifications Toggle */}
          <button
            onClick={() => handleSettingsToggle('notificationsEnabled')}
            className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BellIcon size={20} className="text-[#6B7280]" />
              <span className="text-sm sm:text-base text-[#111827]">Push Notifications</span>
            </div>
            <div
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.notificationsEnabled ? 'bg-[#7C3AED]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </button>

          {/* App Settings */}
          <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <SettingsIcon size={20} className="text-[#6B7280]" />
              <span className="text-sm sm:text-base text-[#111827]">App Settings</span>
            </div>
            <ChevronRight />
          </button>

          {/* Privacy */}
          <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldIcon />
              <span className="text-sm sm:text-base text-[#111827]">Privacy & Security</span>
            </div>
            <ChevronRight />
          </button>

          {/* Help */}
          <button className="w-full flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpIcon />
              <span className="text-sm sm:text-base text-[#111827]">Help & Support</span>
            </div>
            <ChevronRight />
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-red-50 transition-colors text-[#EF4444]"
          >
            <LogoutIcon size={20} />
            <span className="text-sm sm:text-base font-medium">Log Out</span>
          </button>
        </div>
      </DiravCard>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSuccess={() => {
            setShowEditProfile(false);
            showSuccessToast('Profile updated successfully');
          }}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <DiravCard className="w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#111827] mb-2">Log Out?</h3>
            <p className="text-[#6B7280] mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <DiravButton
                label="Cancel"
                isOutlined
                fullWidth
                onClick={() => setShowLogoutConfirm(false)}
              />
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl font-semibold bg-[#EF4444] text-white hover:bg-[#DC2626] transition-colors"
              >
                Log Out
              </button>
            </div>
          </DiravCard>
        </div>
      )}
    </div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ 
  user, 
  onClose, 
  onSuccess 
}: { 
  user: { name: string; email: string } | null; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const { updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    updateUser({ name: name.trim(), avatar: initials });
    
    setIsLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-xl">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827]">Edit Profile</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon size={20} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#6B7280]"
            />
            <p className="text-xs text-[#6B7280] mt-1">Email cannot be changed</p>
          </div>

          <DiravButton
            label={isLoading ? 'Saving...' : 'Save Changes'}
            fullWidth
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
          />
        </div>
      </div>
    </div>
  );
}

// Helper components
function SparkleDecoration() {
  return (
    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" className="text-white" />
    </svg>
  );
}

function ProfileIconLarge() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
