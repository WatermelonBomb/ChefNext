import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface SignupFormProps {
  onSubmit: (data: { email: string; password: string; name: string; role: 'chef' | 'restaurant' }) => void;
  onToggleMode: () => void;
  isLoading?: boolean;
}

export function SignupForm({ onSubmit, onToggleMode, isLoading = false }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'chef' as 'chef' | 'restaurant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前を入力してください';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
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
          <h2 className="text-2xl font-bold mb-2">ChefNextに新規登録</h2>
          <p className="text-[#1C1C1C]/60">あなたの料理キャリアを始めましょう</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">登録タイプ</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'chef' })}
              className={`p-4 rounded-xl border text-center transition-all ${
                formData.role === 'chef'
                  ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#CDAE58]'
                  : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]/50'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">シェフ</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'restaurant' })}
              className={`p-4 rounded-xl border text-center transition-all ${
                formData.role === 'restaurant'
                  ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#CDAE58]'
                  : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]/50'
              }`}
            >
              <div className="w-6 h-6 mx-auto mb-2 bg-current opacity-60 rounded" />
              <span className="text-sm font-medium">店舗</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              {formData.role === 'chef' ? 'お名前' : '店舗名'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.role === 'chef' ? '山田 太郎' : 'レストラン名'}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-[#1C1C1C]/20 focus:border-[#CDAE58]'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

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
                placeholder="8文字以上"
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

          <div>
            <label className="block text-sm font-medium mb-2">パスワード確認</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="パスワードを再入力"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-[#1C1C1C]/20 focus:border-[#CDAE58]'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '登録中...' : '新規登録'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#1C1C1C]/60">
            すでにアカウントをお持ちの方は{' '}
            <button
              onClick={onToggleMode}
              className="text-[#CDAE58] hover:underline font-medium"
            >
              ログイン
            </button>
          </p>
        </div>
      </motion.div>
    </Card>
  );
}