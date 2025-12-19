import React from 'react';
import { motion } from 'motion/react';

interface JobDetailPageProps {
  onBack: () => void;
  onScheduleInterview: () => void;
  onChat: () => void;
}

export function JobDetailPage({ onBack, onScheduleInterview, onChat }: JobDetailPageProps) {
  // This component is being migrated from apps/web/src/components
  // TODO: Replace Web-specific dependencies with cross-platform alternatives

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#1C1C1C]/70 hover:text-[#CDAE58] transition-colors"
          >
            ← 求人一覧に戻る
          </button>
        </div>
      </div>

      <div className="relative h-[500px] mb-12 w-full max-w-5xl mx-auto">
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
                  <span>📍</span>
                  <span>東京都港区六本木</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⭐</span>
                  <span>ミシュラン2つ星</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
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
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
              >
                <h4 className="mb-6">応募する</h4>

                <div className="space-y-3">
                  <button
                    onClick={onScheduleInterview}
                    className="w-full px-6 py-3 bg-[#CDAE58] text-white rounded-xl hover:bg-[#B89A48] transition-colors"
                  >
                    📅 面談を予約
                  </button>

                  <button
                    onClick={onChat}
                    className="w-full px-6 py-3 bg-white border-2 border-[#CDAE58] text-[#CDAE58] rounded-xl hover:bg-[#CDAE58]/10 transition-colors"
                  >
                    💬 メッセージを送る
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
