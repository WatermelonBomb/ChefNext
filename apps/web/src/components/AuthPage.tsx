import React, { useEffect, useState } from 'react';
import { PageLayout } from './layouts/PageLayout';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

interface AuthPageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { login, register, loading, error, clearError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      onSuccess?.();
    }
  }, [isAuthenticated, onSuccess]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      onSuccess?.();
    } catch (error) {
      // エラーは AuthContext で管理されるため、ここではログのみ
      console.error('Login failed:', error);
    }
  };

  const handleSignup = async (data: { email: string; password: string; name: string; role: 'chef' | 'restaurant' }) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        role: data.role === 'chef' ? 'CHEF' : 'RESTAURANT',
      });
      onSuccess?.();
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    clearError();
  };

  return (
    <PageLayout
      title={mode === 'login' ? 'ログイン' : '新規登録'}
      subtitle={mode === 'login'
        ? '次のステージへの扉を開きましょう'
        : 'あなたの料理人生が今、始まります'
      }
      badge="AUTHENTICATION"
      maxWidth="sm"
    >
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="w-full flex justify-center">
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onToggleMode={() => switchMode('signup')}
            isLoading={loading}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignup}
            onToggleMode={() => switchMode('login')}
            isLoading={loading}
          />
        )}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onBack}
          className="text-[#1C1C1C]/60 hover:text-[#CDAE58] transition-colors"
        >
          ← トップページに戻る
        </button>
      </div>
    </PageLayout>
  );
}
