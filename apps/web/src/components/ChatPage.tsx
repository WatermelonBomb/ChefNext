import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Send, Calendar, Paperclip, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ChatPageProps {
  onBack: () => void;
  onScheduleInterview: () => void;
}

export function ChatPage({ onBack, onScheduleInterview }: ChatPageProps) {
  const [message, setMessage] = useState('');
  
  const messages = [
    {
      id: 1,
      sender: 'restaurant',
      text: 'ご応募ありがとうございます。Restaurant L\'espoirの採用担当の山田です。',
      time: '10:30',
      avatar: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      sender: 'user',
      text: 'はじめまして、田中と申します。貴店での修行を希望しております。',
      time: '10:32',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      sender: 'restaurant',
      text: 'ポートフォリオを拝見しました。盛付けの美しさに感銘を受けました。一度面談させていただけますか？',
      time: '10:35',
      avatar: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 4,
      sender: 'user',
      text: 'ありがとうございます！ぜひお願いいたします。',
      time: '10:37',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 5,
      sender: 'restaurant',
      text: '以下の日程で面談可能です。ご都合はいかがでしょうか？',
      time: '10:38',
      avatar: 'https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      isScheduleSuggestion: true
    }
  ];
  
  const handleSend = () => {
    if (message.trim()) {
      // Send message logic
      setMessage('');
    }
  };
  
  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-6 p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#FAF8F4] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Restaurant"
              className="w-14 h-14 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <h4>Restaurant L'espoir</h4>
              <p className="text-sm text-[#1C1C1C]/60">採用担当：山田</p>
            </div>
            
            <div className="w-3 h-3 bg-[#8BA497] rounded-full" />
            <span className="text-sm text-[#1C1C1C]/60">オンライン</span>
          </div>
        </div>
        
        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)] p-6 mb-6 h-[600px] overflow-y-auto">
          <div className="space-y-6">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <ImageWithFallback
                  src={msg.avatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                
                <div className={`flex-1 max-w-md ${msg.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                  {msg.isScheduleSuggestion ? (
                    <div className="bg-gradient-to-br from-[#CDAE58]/10 to-[#F2E6B6]/10 rounded-2xl p-4 border border-[#CDAE58]/20">
                      <p className="mb-4 text-sm">{msg.text}</p>
                      <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-[#CDAE58]/10 transition-colors border border-[#1C1C1C]/10">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">11月20日（水）14:00-16:00</span>
                            <Calendar className="w-4 h-4 text-[#CDAE58]" />
                          </div>
                          <p className="text-xs text-[#1C1C1C]/60 mt-1">厨房見学も可能</p>
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-[#CDAE58]/10 transition-colors border border-[#1C1C1C]/10">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">11月22日（金）10:00-12:00</span>
                            <Calendar className="w-4 h-4 text-[#CDAE58]" />
                          </div>
                          <p className="text-xs text-[#1C1C1C]/60 mt-1">仕込み見学も可能</p>
                        </button>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full mt-3"
                        onClick={onScheduleInterview}
                      >
                        カレンダーで確認
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-[#CDAE58] text-white'
                          : 'bg-[#FAF8F4] text-[#1C1C1C]'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  )}
                  <span className="text-xs text-[#1C1C1C]/40 mt-1 block">{msg.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Input */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)] p-4">
          <div className="flex gap-3 items-end">
            <button className="p-3 hover:bg-[#FAF8F4] rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-[#1C1C1C]/60" />
            </button>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <button
              onClick={handleSend}
              className="p-3 bg-[#CDAE58] text-white rounded-lg hover:shadow-[0_4px_20px_rgba(205,174,88,0.3)] transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
