import { useState } from 'react';
import { DiravColors } from '@/core/theme/colors';
import { useAuth } from '@/context/AuthContext';
import {
  DashboardIcon,
  PlanningIcon,
  SavingsIcon,
  AIIcon,
  ProfileIcon,
  LogoutIcon,
  DiscoverIcon,
} from '@/core/icons/Icons';
import { DashboardScreen } from '@/features/dashboard/DashboardScreen';
import { PlanningScreen } from '@/features/planning/PlanningScreen';
import { SavingsScreen } from '@/features/savings/SavingsScreen';
import DiscoverScreen from '@/features/discover/DiscoverScreen';
import { AIAdvisorScreen } from '@/features/ai-advisor/AIAdvisorScreen';
import { ProfileScreen } from '@/features/profile/ProfileScreen';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  mobileLabel?: string;
}

// Desktop navigation order
const desktopNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={22} />, mobileLabel: 'Home' },
  { id: 'planning', label: 'Planning', icon: <PlanningIcon size={22} />, mobileLabel: 'Budget' },
  { id: 'ai', label: 'AI Advisor', icon: <AIIcon size={22} />, mobileLabel: 'AI' },
  { id: 'savings', label: 'Savings', icon: <SavingsIcon size={22} /> },
  { id: 'discover', label: 'Discover', icon: <DiscoverIcon size={22} /> },
  { id: 'profile', label: 'Profile', icon: <ProfileIcon size={22} /> },
];

// Mobile bottom navigation order: Home - Budget - AI - Savings - Discover
const mobileNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon size={22} />, mobileLabel: 'Home' },
  { id: 'planning', label: 'Planning', icon: <PlanningIcon size={22} />, mobileLabel: 'Budget' },
  { id: 'ai', label: 'AI Advisor', icon: <AIIcon size={22} />, mobileLabel: 'AI' },
  { id: 'savings', label: 'Savings', icon: <SavingsIcon size={22} /> },
  { id: 'discover', label: 'Discover', icon: <DiscoverIcon size={22} /> },
];

// Map screen id to index in screens array
const screenIndexMap: Record<string, number> = {
  dashboard: 0,
  planning: 1,
  ai: 2,
  savings: 3,
  discover: 4,
  profile: 5,
};

export function AppShell() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const screens = [
    <DashboardScreen key="dashboard" />,
    <PlanningScreen key="planning" />,
    <AIAdvisorScreen key="ai" />,
    <SavingsScreen key="savings" />,
    <DiscoverScreen key="discover" />,
    <ProfileScreen key="profile" />,
  ];

  const handleLogout = () => {
    logout();
    setCurrentScreen('dashboard');
    setShowLogoutConfirm(false);
  };

  const currentIndex = screenIndexMap[currentScreen] || 0;

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-[#F8F9FC]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 flex-shrink-0">
        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-baseline">
            <span 
              className="text-5xl font-black tracking-tight"
              style={{ 
                color: DiravColors.primary,
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              }}
            >
              D
            </span>
            <span 
              className="text-2xl font-semibold tracking-tight"
              style={{ 
                color: DiravColors.primary,
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              }}
            >
              irav
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 tracking-widest uppercase">Smart Finance</p>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4">
          {desktopNavItems.map((item) => {
            const isSelected = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-1.5 transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#7C3AED]/10 to-[#C026D3]/10'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span
                  style={{
                    color: isSelected
                      ? DiravColors.primary
                      : DiravColors.textSecondary,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className={`font-medium ${
                    isSelected ? 'text-[#7C3AED]' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
                {isSelected && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100">
          {user && (
            <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogoutIcon size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-baseline">
            <span 
              className="text-3xl font-black tracking-tight"
              style={{ 
                color: DiravColors.primary,
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              }}
            >
              D
            </span>
            <span 
              className="text-lg font-semibold tracking-tight"
              style={{ 
                color: DiravColors.primary,
                fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              }}
            >
              irav
            </span>
          </div>
          <button
            onClick={() => setCurrentScreen('profile')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md active:scale-95 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`,
            }}
          >
            {user ? user.name.charAt(0).toUpperCase() : 'G'}
          </button>
        </header>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {screens[currentIndex]}
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden flex-shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div 
            className="flex items-center justify-around"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
          >
            {mobileNavItems.map((item) => {
              const isSelected = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 relative transition-all active:scale-95 ${
                    isSelected ? 'text-[#7C3AED]' : 'text-gray-400'
                  }`}
                >
                  {/* Active indicator */}
                  {isSelected && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-gradient-to-r from-[#7C3AED] to-[#C026D3]" />
                  )}
                  
                  {/* Icon container */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#7C3AED]/10 shadow-sm' : ''
                    }`}
                  >
                    <span style={{ color: isSelected ? DiravColors.primary : '#9CA3AF' }}>
                      {item.icon}
                    </span>
                  </div>
                  
                  {/* Label */}
                  <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-[#7C3AED]' : 'text-gray-400'}`}>
                    {item.mobileLabel || item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <LogoutIcon size={28} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to logout from your account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
