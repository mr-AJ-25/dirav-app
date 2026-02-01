import { AuthProvider } from '@/context/AuthContext';
import { AppShell } from '@/layout/AppShell';

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
