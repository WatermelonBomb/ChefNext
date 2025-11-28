import React from 'react';
import { motion } from 'motion/react';
import { Menu, X, User, Briefcase } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-[#1C1C1C]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer"
          >
            <h3 className="text-[#CDAE58]">ChefNext</h3>
            <p className="text-xs text-[#1C1C1C]/60">次の一皿が、次のステージへ。</p>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-[#1C1C1C] hover:text-[#CDAE58] transition-colors"
            >
              求人を探す
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="text-[#1C1C1C] hover:text-[#CDAE58] transition-colors"
            >
              ChefNextとは
            </button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => onNavigate('chef-register')}
            >
              <User className="w-4 h-4" />
              シェフとして始める
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onNavigate('restaurant-register')}
            >
              <Briefcase className="w-4 h-4" />
              店舗として参加
            </Button>
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
            <button 
              onClick={() => { onNavigate('jobs'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-[#CDAE58]/10 rounded-lg"
            >
              求人を探す
            </button>
            <button 
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-[#CDAE58]/10 rounded-lg"
            >
              ChefNextとは
            </button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={() => { onNavigate('chef-register'); setMobileMenuOpen(false); }}
            >
              <User className="w-4 h-4" />
              シェフとして始める
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full"
              onClick={() => { onNavigate('restaurant-register'); setMobileMenuOpen(false); }}
            >
              <Briefcase className="w-4 h-4" />
              店舗として参加
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
