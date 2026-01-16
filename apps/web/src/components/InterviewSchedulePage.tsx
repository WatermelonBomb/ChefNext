import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function InterviewSchedulePage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const availableDates = [
    { date: '11月20日（水）', slots: ['10:00-12:00', '14:00-16:00'], note: '厨房見学も可能' },
    { date: '11月22日（金）', slots: ['10:00-12:00', '15:00-17:00'], note: '仕込み見学も可能' },
    { date: '11月25日（月）', slots: ['13:00-15:00', '16:00-18:00'], note: 'シェフと直接面談' },
    { date: '11月27日（水）', slots: ['10:00-12:00', '14:00-16:00'], note: '試作実習も可能' }
  ];

  const handleBack = () => navigate('/chat');

  const handleConfirm = () => {
    setShowCelebration(true);
    setTimeout(() => {
      navigate('/jobs');
    }, 3000);
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
              <h2 className="mb-2">面談予約</h2>
              <p className="text-[#1C1C1C]/70">ご希望の日時を選択してください</p>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {!showCelebration ? (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)] p-8"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-8">
                  <button className="p-2 hover:bg-[#FAF8F4] rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3>2024年11月</h3>
                  <button className="p-2 hover:bg-[#FAF8F4] rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Available Dates */}
                <div className="space-y-6">
                  {availableDates.map((dateInfo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-2xl p-6 transition-all cursor-pointer ${selectedDate === dateInfo.date
                          ? 'border-[#CDAE58] bg-[#CDAE58]/5'
                          : 'border-[#1C1C1C]/10 hover:border-[#CDAE58]/40'
                        }`}
                      onClick={() => setSelectedDate(dateInfo.date)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="mb-1">{dateInfo.date}</h4>
                          <p className="text-sm text-[#1C1C1C]/60">{dateInfo.note}</p>
                        </div>
                        {selectedDate === dateInfo.date && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-[#CDAE58] rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Time Slots */}
                      <div className="grid grid-cols-2 gap-3">
                        {dateInfo.slots.map((slot, slotIndex) => (
                          <button
                            key={slotIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(dateInfo.date);
                              setSelectedTime(slot);
                            }}
                            className={`px-4 py-3 rounded-xl text-sm transition-all ${selectedDate === dateInfo.date && selectedTime === slot
                                ? 'bg-[#CDAE58] text-white shadow-[0_4px_20px_rgba(205,174,88,0.3)]'
                                : 'bg-[#FAF8F4] text-[#1C1C1C] hover:bg-[#CDAE58]/20'
                              }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Confirmation */}
                {selectedDate && selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-gradient-to-br from-[#CDAE58]/10 to-[#F2E6B6]/10 rounded-2xl border border-[#CDAE58]/20"
                  >
                    <h4 className="mb-4">予約内容の確認</h4>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#1C1C1C]/60">日付</span>
                        <span className="font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1C1C]/60">時間</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#1C1C1C]/60">場所</span>
                        <span className="font-medium">Restaurant L'espoir</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                          setSelectedDate(null);
                          setSelectedTime(null);
                        }}
                      >
                        変更する
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleConfirm}
                      >
                        予約を確定
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* Celebration */
              <motion.div
                key="celebration"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)] p-12 text-center"
              >
                {/* Gold Sparkle Effect */}
                <div className="relative mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="w-32 h-32 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center mx-auto shadow-[0_8px_32px_rgba(205,174,88,0.4)]"
                  >
                    <Check className="w-16 h-16 text-white" />
                  </motion.div>

                  {/* Floating Sparkles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * 100,
                        y: Math.sin((i * Math.PI * 2) / 8) * 100
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity
                      }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className="text-3xl">✨</span>
                    </motion.div>
                  ))}
                </div>

                <h2 className="mb-4">予約完了！</h2>
                <p className="text-[#1C1C1C]/70 mb-6 text-lg">
                  {selectedDate} {selectedTime}
                </p>
                <p className="text-[#1C1C1C]/60">
                  予約確認メールを送信しました。<br />
                  当日お会いできることを楽しみにしています。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
