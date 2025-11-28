import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onToggleMode: () => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, onToggleMode, isLoading = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData.email, formData.password);
    }
  };

  return (
    <Card variant="elevated" size="lg" className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">CN</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">ChefNextにログイン</h2>
          <p className="text-[#1C1C1C]/60">あなたのキャリアを次のレベルへ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">メールアドレス</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your-email@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-[#1C1C1C]/20 focus:border-[#CDAE58]'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">パスワード</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-colors focus:outline-none ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-[#1C1C1C]/20 focus:border-[#CDAE58]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#CDAE58] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-[#1C1C1C]/60">ログイン状態を保持</span>
            </label>
            <button
              type="button"
              className="text-sm text-[#CDAE58] hover:underline"
            >
              パスワードを忘れた方
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#1C1C1C]/60">
            アカウントをお持ちでない方は{' '}
            <button
              onClick={onToggleMode}
              className="text-[#CDAE58] hover:underline font-medium"
            >
              新規登録
            </button>
          </p>
        </div>
      </motion.div>
    </Card>
  );
}