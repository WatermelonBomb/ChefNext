import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import {
  Send,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  MapPin,
  Clock,
  Image as ImageIcon,
  Smile,
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'application';
  timestamp: Date;
  isRead: boolean;
}

interface ChatInterfaceProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    rating: number;
    location: string;
    position: string;
  };
  onBack: () => void;
}

export function ChatInterface({ restaurant, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'restaurant',
      senderName: restaurant.name,
      content: 'ご応募ありがとうございます！まずは軽くお話させていただけませんか？',
      type: 'text',
      timestamp: new Date(Date.now() - 60000),
      isRead: true
    },
    {
      id: '2',
      senderId: 'user',
      senderName: 'あなた',
      content: 'はい、ぜひお話させてください。どのようなことでも聞いてください。',
      type: 'text',
      timestamp: new Date(Date.now() - 30000),
      isRead: true
    },
    {
      id: '3',
      senderId: 'restaurant',
      senderName: restaurant.name,
      content: '当店では特に火入れの技術を重視しています。これまでの経験について教えていただけますか？',
      type: 'text',
      timestamp: new Date(Date.now() - 15000),
      isRead: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'あなた',
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate restaurant response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'restaurant',
          senderName: restaurant.name,
          content: 'ありがとうございます。詳しくお聞きしたいので、今度お時間のある時にお店にお越しいただけませんか？',
          type: 'text',
          timestamp: new Date(),
          isRead: false
        };
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageLayout
      title={`${restaurant.name}との面談`}
      subtitle={restaurant.position + 'の応募について'}
      badge="CHAT INTERVIEW"
      maxWidth="lg"
    >
      <div className="h-[70vh] flex flex-col">
        {/* Chat Header */}
        <Card variant="outline" size="sm" className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-semibold">{restaurant.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#1C1C1C]/60">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#CDAE58] text-[#CDAE58]" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurant.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages Container */}
        <Card variant="outline" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${
                    message.senderId === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      message.senderId === 'user'
                        ? 'bg-[#CDAE58] text-white rounded-br-md'
                        : 'bg-white border border-[#1C1C1C]/10 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div
                      className={`mt-1 text-xs ${
                        message.senderId === 'user' ? 'text-white/70' : 'text-[#1C1C1C]/50'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-[#1C1C1C]/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-[#1C1C1C]/40 rounded-full"
                          animate={{
                            y: [0, -4, 0],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#1C1C1C]/50 ml-2">入力中...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#1C1C1C]/10">
            <div className="flex items-center gap-3">
              <button className="p-2 text-[#1C1C1C]/40 hover:text-[#CDAE58] transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="メッセージを入力..."
                  className="w-full px-4 py-3 rounded-full border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[#1C1C1C]/40 hover:text-[#CDAE58] transition-colors">
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-3 rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button className="px-3 py-1 bg-[#CDAE58]/10 text-[#CDAE58] text-xs rounded-full hover:bg-[#CDAE58]/20 transition-colors">
                面接の日程調整
              </button>
              <button className="px-3 py-1 bg-[#CDAE58]/10 text-[#CDAE58] text-xs rounded-full hover:bg-[#CDAE58]/20 transition-colors">
                履歴書を送信
              </button>
              <button className="px-3 py-1 bg-[#CDAE58]/10 text-[#CDAE58] text-xs rounded-full hover:bg-[#CDAE58]/20 transition-colors">
                質問する
              </button>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}