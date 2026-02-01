import { useState } from 'react';
import { DiravButton } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { useAuth } from '@/context/AuthContext';
import { CloseIcon, CheckIcon, SparklesIcon } from '@/core/icons/Icons';

interface AuthScreenProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthScreen({ onClose, onSuccess }: AuthScreenProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Form validation
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Please enter your password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let success: boolean;

      if (mode === 'login') {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password. Please try again or create an account.');
        } else {
          // Get user name for welcome message
          const existingUsers = JSON.parse(localStorage.getItem('dirav_users') || '[]');
          const foundUser = existingUsers.find((u: { email: string; name: string }) => u.email === email);
          setWelcomeName(foundUser?.name || 'there');
        }
      } else {
        success = await signup(name, email, password);
        if (!success) {
          setError('An account with this email already exists. Please log in instead.');
        } else {
          setWelcomeName(name);
        }
      }

      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 4000); // Give time to read the welcome message
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        setWelcomeName(result.name || 'there');
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 4000);
      } else {
        setError(result.error || 'Google sign-in failed. Please try again.');
      }
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setErrors({});
  };

  // Success/Welcome Screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
          {/* Gradient Header */}
          <div 
            className="p-8 text-center"
            style={{
              background: `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`,
            }}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CheckIcon size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome Back!' : 'Welcome to Dirav!'}
            </h2>
            <p className="text-white/80 text-lg">
              Hello, {welcomeName}! 👋
            </p>
          </div>

          {/* Welcome Message Content */}
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-[#F8F9FC] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#C026D3] flex items-center justify-center flex-shrink-0">
                  <SparklesIcon size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#111827] mb-1">Your Financial Journey Starts Now!</p>
                  <p className="text-sm text-[#6B7280]">
                    Dirav is here to make your financial life easier and smarter.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-[#111827]">Here's what you can do:</h3>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-lg">📊</span>
                  <span className="text-[#374151]"><strong>Track</strong> your income and expenses effortlessly</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-lg">🎯</span>
                  <span className="text-[#374151]"><strong>Set goals</strong> and watch your savings grow</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-lg">🎓</span>
                  <span className="text-[#374151]"><strong>Discover</strong> scholarships and discounts</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-lg">🤖</span>
                  <span className="text-[#374151]"><strong>Ask AI</strong> for personalized financial advice</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-center text-sm text-[#6B7280]">
                  Taking you to your dashboard...
                </p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full animate-progress"
                    style={{
                      background: `linear-gradient(90deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md shadow-xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-[#6B7280]">
              {mode === 'login' 
                ? 'Sign in to access your profile' 
                : 'Join Dirav to start managing your finances'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon size={24} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl animate-shake">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button 
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#7C3AED] rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-sm font-semibold text-[#111827]">
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#6B7280]">or continue with email</span>
            </div>
          </div>

          {/* Name Field (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                  errors.name ? 'border-[#EF4444]' : 'border-gray-200'
                }`}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                errors.email ? 'border-[#EF4444]' : 'border-gray-200'
              }`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                errors.password ? 'border-[#EF4444]' : 'border-gray-200'
              }`}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {errors.password && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all ${
                  errors.confirmPassword ? 'border-[#EF4444]' : 'border-gray-200'
                }`}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-[#EF4444] mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Forgot Password (Login only) */}
          {mode === 'login' && (
            <div className="text-right">
              <button className="text-sm font-medium text-[#7C3AED] hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <DiravButton
            label={isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading || isGoogleLoading}
          />

          {/* Switch Mode */}
          <p className="text-center text-sm text-[#6B7280]">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={switchMode}
              className="font-semibold hover:underline"
              style={{ color: DiravColors.primary }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Terms (Signup only) */}
        {mode === 'signup' && (
          <div className="px-4 sm:px-6 pb-6">
            <p className="text-xs text-center text-[#6B7280]">
              By creating an account, you agree to our{' '}
              <button className="underline hover:text-[#7C3AED]">Terms of Service</button> and{' '}
              <button className="underline hover:text-[#7C3AED]">Privacy Policy</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
