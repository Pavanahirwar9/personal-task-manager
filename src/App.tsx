import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthForm from './components/auth/AuthForm';
import Header from './components/layout/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TaskPage from './pages/TaskPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SetupGuide from './components/setup/SetupGuide';
import { appwriteConfig } from './lib/appwrite';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [setupValid, setSetupValid] = useState(true);
  const [currentRoute, setCurrentRoute] = useState('');

  useEffect(() => {
    // Check if basic Appwrite configuration is present
    const isBasicSetupValid = !!(
      appwriteConfig.project &&
      appwriteConfig.databaseId &&
      appwriteConfig.storageId
    );
    setSetupValid(isBasicSetupValid);

    // Simple routing logic
    const updateRoute = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('userId') && urlParams.get('secret')) {
        setCurrentRoute('reset-password');
      } else {
        setCurrentRoute('');
      }
    };

    updateRoute();
    window.addEventListener('popstate', updateRoute);
    return () => window.removeEventListener('popstate', updateRoute);
  }, []);

  // Show setup guide if configuration is missing
  if (!setupValid) {
    return <SetupGuide />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Handle password reset route (accessible without authentication)
  if (currentRoute === 'reset-password') {
    return (
      <ResetPasswordPage
        onBackToLogin={() => {
          window.history.pushState({}, '', window.location.pathname);
          setCurrentRoute('');
          setAuthMode('login');
        }}
      />
    );
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />
    );
  }

  return (
    <ProtectedRoute>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Header />
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <TaskPage />
          </main>
        </div>
      </TaskProvider>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
