import React from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Tag } from './Tag';
import { MapPin, Clock, DollarSign, Users, Award, Calendar, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface JobDetailPageProps {
  onBack: () => void;
  onScheduleInterview: () => void;
  onChat: () => void;
}

export function JobDetailPage({ onBack, onScheduleInterview, onChat }: JobDetailPageProps) {
  const skills = ['火入れ', 'ソース', '原価管理', 'チームマネジメント'];
  
  const alumni = [
    {
      name: '佐藤 健',
      current: '恵比寿で独立',
      imageUrl: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      name: '鈴木 美咲',
      current: 'ミシュラン1つ星獲得',
      imageUrl: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="w-full max-w-5xl mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1C1C1C]/70 hover:text-[#CDAE58] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          求人一覧に戻る
        </button>
      </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-[500px] mb-12 w-full max-w-5xl">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-white mb-4">Restaurant L'espoir</h2>
              <div className="flex flex-wrap gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>東京都港区六本木</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>ミシュラン2つ星</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Tag label="独立支援枠" variant="category" className="bg-[#CDAE58] text-white border-none" />
                <Tag label="フレンチ" variant="default" className="bg-white/90 text-[#1C1C1C]" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
            >
              <h3 className="mb-4">店舗概要</h3>
              <p className="text-[#1C1C1C]/70 leading-relaxed mb-6">
                六本木の中心に位置するミシュラン2つ星フレンチレストラン。
                伝統的なフランス料理の技法を守りながら、日本の食材や季節感を大切にした
                独自のスタイルを確立しています。将来独立を目指すシェフに、
                経営ノウハウから技術まで、すべてを学べる環境を提供します。
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-[#CDAE58]" />
                  <div>
                    <p className="text-sm text-[#1C1C1C]/60">報酬</p>
                    <p className="font-medium">30-35万円</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#CDAE58]" />
                  <div>
                    <p className="text-sm text-[#1C1C1C]/60">期間</p>
                    <p className="font-medium">6ヶ月-1年</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
            >
              <h3 className="mb-6">学べるスキル</h3>
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-4 bg-[#FAF8F4] rounded-xl"
                  >
                    <div className="w-10 h-10 bg-[#CDAE58] rounded-full flex items-center justify-center">
                      <span className="text-white">✓</span>
                    </div>
                    <span className="font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Mentor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
            >
              <h3 className="mb-6">指導者紹介</h3>
              <div className="flex gap-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Chef mentor"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4>Pierre Laurent</h4>
                  <p className="text-sm text-[#1C1C1C]/60 mb-3">オーナーシェフ / 経験25年</p>
                  <p className="text-[#1C1C1C]/70 text-sm leading-relaxed">
                    パリの三つ星レストランで修行後、2010年に独立。
                    「次世代のシェフを育てることが、料理界への恩返し」
                    という信念のもと、多くの弟子を育ててきました。
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Alumni */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
            >
              <h3 className="mb-6">過去卒業生の活躍</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alumni.map((person, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-[#FAF8F4] rounded-xl">
                    <ImageWithFallback
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-sm mb-1">{person.name}</h4>
                      <p className="text-sm text-[#1C1C1C]/60">今は{person.current}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
              >
                <h4 className="mb-6">応募する</h4>
                
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={onScheduleInterview}
                  >
                    <Calendar className="w-5 h-5" />
                    面談を予約
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={onChat}
                  >
                    <Users className="w-5 h-5" />
                    メッセージを送る
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#1C1C1C]/10">
                  <div className="flex items-center gap-2 text-sm text-[#1C1C1C]/60 mb-2">
                    <Users className="w-4 h-4" />
                    <span>現在24名が応募中</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#1C1C1C]/60">
                    <Clock className="w-4 h-4" />
                    <span>募集終了まであと12日</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#CDAE58]/10 to-[#F2E6B6]/10 rounded-2xl p-6 border border-[#CDAE58]/20"
              >
                <h4 className="mb-3">💡 ポイント</h4>
                <ul className="space-y-2 text-sm text-[#1C1C1C]/70">
                  <li className="flex items-start gap-2">
                    <span className="text-[#CDAE58]">•</span>
                    <span>独立支援金制度あり</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#CDAE58]">•</span>
                    <span>メニュー開発に参加可能</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#CDAE58]">•</span>
                    <span>経営ノウハウも学べます</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
