import React, { useState } from 'react';
import { PageLayout } from './layouts/PageLayout';
import { LoginForm } from './auth/LoginForm';
import { SignupForm } from './auth/SignupForm';

interface AuthPageProps {
  onLogin: (email: string, password: string) => void;
  onSignup: (data: { email: string; password: string; name: string; role: 'chef' | 'restaurant' }) => void;
  onBack: () => void;
}

export function AuthPage({ onLogin, onSignup, onBack }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      onLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: { email: string; password: string; name: string; role: 'chef' | 'restaurant' }) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      onSignup(data);
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="w-full flex justify-center">
        {mode === 'login' ? (
          <LoginForm
            onSubmit={handleLogin}
            onToggleMode={() => setMode('signup')}
            isLoading={isLoading}
          />
        ) : (
          <SignupForm
            onSubmit={handleSignup}
            onToggleMode={() => setMode('login')}
            isLoading={isLoading}
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