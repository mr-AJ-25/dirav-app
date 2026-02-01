import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AuthUser, 
  saveAuthUser, 
  getAuthUser, 
  clearAuthUser, 
  getStreak
} from '@/services/storageService';

interface GoogleLoginResult {
  success: boolean;
  name?: string;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  streak: number;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<GoogleLoginResult>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a random name for demo purposes
function generateDemoGoogleUser(): { name: string; email: string } {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Skyler'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`;
  return { name, email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Check for existing auth on mount
    const existingUser = getAuthUser();
    if (existingUser) {
      setUser(existingUser);
      setStreak(getStreak());
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate inputs
    if (!email.includes('@') || password.length < 6) {
      return false;
    }

    // Check if user exists in localStorage (simulating database)
    const existingUsers = JSON.parse(localStorage.getItem('dirav_users') || '[]');
    const foundUser = existingUsers.find((u: AuthUser & { password: string }) => u.email === email.toLowerCase());
    
    if (foundUser) {
      if (foundUser.password !== password) {
        return false; // Wrong password
      }
      
      const authUser: AuthUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        avatar: foundUser.avatar,
        createdAt: foundUser.createdAt,
      };
      
      saveAuthUser(authUser);
      setUser(authUser);
      setStreak(getStreak());
      return true;
    }

    // User not found
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate inputs
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      return false;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('dirav_users') || '[]');
    if (existingUsers.some((u: AuthUser) => u.email === email.toLowerCase())) {
      return false; // User already exists
    }

    // Create new user
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newUser: AuthUser & { password: string } = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase(),
      avatar: initials || 'U',
      createdAt: new Date().toISOString(),
      password: password, // In real app, this would be hashed
    };

    // Save to "database"
    existingUsers.push(newUser);
    localStorage.setItem('dirav_users', JSON.stringify(existingUsers));

    // Log user in
    const authUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt,
    };
    
    saveAuthUser(authUser);
    setUser(authUser);
    setStreak(1);
    return true;
  };

  const loginWithGoogle = async (): Promise<GoogleLoginResult> => {
    // Simulate Google OAuth delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // In a real app, you would use Google OAuth here
      // For demo purposes, we'll simulate a successful Google login
      
      // Check if there's an existing Google user in storage
      const existingUsers = JSON.parse(localStorage.getItem('dirav_users') || '[]');
      const existingGoogleUser = existingUsers.find((u: AuthUser & { isGoogle?: boolean }) => u.isGoogle);
      
      if (existingGoogleUser) {
        // Return existing Google user
        const authUser: AuthUser = {
          id: existingGoogleUser.id,
          name: existingGoogleUser.name,
          email: existingGoogleUser.email,
          avatar: existingGoogleUser.avatar,
          createdAt: existingGoogleUser.createdAt,
        };
        
        saveAuthUser(authUser);
        setUser(authUser);
        setStreak(getStreak());
        
        return { success: true, name: authUser.name };
      }
      
      // Create new Google user (demo mode)
      const demoUser = generateDemoGoogleUser();
      const initials = demoUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      
      const newUser: AuthUser & { isGoogle: boolean } = {
        id: Date.now().toString(),
        name: demoUser.name,
        email: demoUser.email,
        avatar: initials,
        createdAt: new Date().toISOString(),
        isGoogle: true,
      };

      // Save to "database"
      existingUsers.push(newUser);
      localStorage.setItem('dirav_users', JSON.stringify(existingUsers));

      // Log user in
      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      };
      
      saveAuthUser(authUser);
      setUser(authUser);
      setStreak(1);
      
      return { success: true, name: authUser.name };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Failed to sign in with Google' };
    }
  };

  const logout = () => {
    clearAuthUser();
    setUser(null);
    setStreak(0);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    saveAuthUser(updatedUser);
    setUser(updatedUser);
    
    // Also update in users list
    const existingUsers = JSON.parse(localStorage.getItem('dirav_users') || '[]');
    const updatedUsers = existingUsers.map((u: AuthUser) => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    localStorage.setItem('dirav_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: user !== null,
      streak,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
