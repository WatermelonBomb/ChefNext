import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Tag } from './Tag';
import { Star, ChevronLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ReviewPage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const reviewTags = [
    '学びの質が高い',
    '厨房の雰囲気が良い',
    '丁寧な指導',
    '実践的なスキル',
    'チームワーク重視',
    '独立支援が充実'
  ];

  const placeholderExamples = [
    'この期間で火入れ技術が大幅に上達しました',
    'ソースの作り方を基礎から学ぶことができました',
    '原価意識を持って料理に取り組めるようになりました',
    'チームマネジメントの重要性を学びました'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleBack = () => navigate('/jobs');

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      navigate('/jobs');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-[#1C1C1C]/70 hover:text-[#CDAE58] transition-colors mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              戻る
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-2">レビューを書く</h2>
              <p className="text-[#1C1C1C]/70">あなたの成長体験を言語化しましょう</p>
            </motion.div>
          </div>

          {/* Restaurant Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-6"
          >
            <div className="flex gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1643101570532-88c8ecc07c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2Mjk1NTk5MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Restaurant"
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="mb-1">Restaurant L'espoir</h4>
                <p className="text-sm text-[#1C1C1C]/60">2024年4月 - 2024年10月（6ヶ月間）</p>
              </div>
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-6"
          >
            <h3 className="mb-6">総合評価</h3>
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform"
                >
                  <Star
                    className={`w-12 h-12 ${star <= (hoveredRating || rating)
                        ? 'fill-[#CDAE58] text-[#CDAE58]'
                        : 'text-[#1C1C1C]/20'
                      }`}
                  />
                </motion.button>
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[#1C1C1C]/60"
              >
                {rating === 5 && '素晴らしい成長体験でした'}
                {rating === 4 && '充実した学びが得られました'}
                {rating === 3 && '良い経験になりました'}
                {rating === 2 && '期待と異なる部分がありました'}
                {rating === 1 && '改善が必要だと感じました'}
              </motion.p>
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-6"
          >
            <h3 className="mb-6">この職場の特徴</h3>
            <div className="flex flex-wrap gap-3">
              {reviewTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full transition-all ${selectedTags.includes(tag)
                      ? 'bg-[#CDAE58] text-white shadow-[0_4px_20px_rgba(205,174,88,0.2)]'
                      : 'bg-[#FAF8F4] text-[#1C1C1C] hover:bg-[#CDAE58]/20 border border-[#1C1C1C]/10'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Comment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-6"
          >
            <h3 className="mb-6">成長の記録</h3>
            <p className="text-sm text-[#1C1C1C]/60 mb-4">
              成長を言語化することで、次のステージへの準備ができます
            </p>

            {/* Example Prompts */}
            <div className="mb-4 p-4 bg-[#FAF8F4] rounded-xl">
              <p className="text-sm font-medium text-[#1C1C1C]/70 mb-2">例：</p>
              <ul className="space-y-1 text-sm text-[#1C1C1C]/60">
                {placeholderExamples.map((example, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#CDAE58]">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="この期間で学んだこと、成長したことを具体的に書いてください..."
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none resize-none"
              rows={8}
            />

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-[#1C1C1C]/40">
                {comment.length} / 500文字
              </span>
              {comment.length >= 50 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm text-[#8BA497] flex items-center gap-1"
                >
                  <Star className="w-4 h-4 fill-[#8BA497]" />
                  素晴らしい！
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={handleBack}
            >
              下書き保存
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleSubmit}
            >
              レビューを投稿
            </Button>
          </motion.div>

          {/* Encouragement */}
          {rating > 0 && selectedTags.length > 0 && comment.length > 50 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-br from-[#CDAE58]/10 to-[#F2E6B6]/10 rounded-xl border border-[#CDAE58]/20 text-center"
            >
              <p className="text-sm text-[#1C1C1C]/70">
                ✨ あなたの成長の記録が、次のシェフの道しるべになります
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
