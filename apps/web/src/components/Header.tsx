import React from 'react';
import { motion } from 'motion/react';
import { Menu, X, User, Briefcase } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { isAuthenticated, logout, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-[#1C1C1C]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="cursor-pointer">
            <h3 className="text-[#CDAE58]">ChefNext</h3>
            <p className="text-xs text-[#1C1C1C]/60">次の一皿が、次のステージへ。</p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className="text-[#1C1C1C] hover:text-[#CDAE58] transition-colors"
            >
              求人を探す
            </Link>
            <Link
              to="/about"
              className="text-[#1C1C1C] hover:text-[#CDAE58] transition-colors"
            >
              ChefNextとは
            </Link>
            <Link
              to="/chef/profile/edit"
              className="text-[#1C1C1C] hover:text-[#CDAE58] transition-colors"
            >
              プロフィール作成
            </Link>
            {!isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                <User className="w-4 h-4" />
                ログイン / 登録
              </Button>
            ) : (
              <>
                <span className="text-xs text-[#1C1C1C]/60">{user?.email}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <Briefcase className="w-4 h-4" />
                  ログアウト
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-3"
          >
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-[#CDAE58]/10 rounded-lg"
            >
              求人を探す
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-[#CDAE58]/10 rounded-lg"
            >
              ChefNextとは
            </Link>
            <Link
              to="/chef/profile/edit"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-[#CDAE58]/10 rounded-lg"
            >
              プロフィール作成
            </Link>
            {!isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
              >
                <User className="w-4 h-4" />
                ログイン / 登録
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                disabled={loading}
              >
                <Briefcase className="w-4 h-4" />
                ログアウト
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
