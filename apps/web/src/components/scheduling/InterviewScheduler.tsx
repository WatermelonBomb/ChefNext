import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'in-person' | 'video' | 'phone';
}

interface InterviewSchedulerProps {
  restaurant: {
    name: string;
    image: string;
    rating: number;
    location: string;
    position: string;
  };
  onComplete: () => void;
  onBack: () => void;
}

export function InterviewScheduler({ restaurant, onComplete, onBack }: InterviewSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [interviewType, setInterviewType] = useState<'in-person' | 'video' | 'phone'>('in-person');
  const [step, setStep] = useState(1);

  // Generate calendar days
  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Generate time slots for selected date
  const generateTimeSlots = (): TimeSlot[] => {
    const slots = [
      { id: '1', time: '10:00', available: true, type: 'in-person' as const },
      { id: '2', time: '11:00', available: false, type: 'in-person' as const },
      { id: '3', time: '14:00', available: true, type: 'in-person' as const },
      { id: '4', time: '15:00', available: true, type: 'video' as const },
      { id: '5', time: '16:00', available: true, type: 'in-person' as const },
      { id: '6', time: '17:00', available: false, type: 'video' as const },
      { id: '7', time: '18:00', available: true, type: 'phone' as const }
    ];

    return slots.filter(slot => slot.type === interviewType);
  };

  const calendarDays = generateCalendarDays();
  const timeSlots = selectedDate ? generateTimeSlots() : [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleConfirm = () => {
    setStep(2);
    // Simulate booking confirmation
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      default: return MapPin;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'ビデオ面談';
      case 'phone': return '電話面談';
      default: return '店舗面談';
    }
  };

  return (
    <PageLayout
      title="面談予約"
      subtitle="理想のキャリアに向けて、一歩踏み出しましょう"
      badge="INTERVIEW SCHEDULING"
      maxWidth="lg"
    >
      {/* Restaurant Header */}
      <Card variant="outline" size="md" className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{restaurant.position}</h3>
            <div className="flex items-center gap-4 text-sm text-[#1C1C1C]/60">
              <span className="font-medium">{restaurant.name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#CDAE58] text-[#CDAE58]" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{restaurant.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="scheduling"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Interview Type Selection */}
              <Card variant="elevated" size="lg">
                <h3 className="text-lg font-semibold mb-6">面談方法を選択</h3>
                <div className="space-y-3">
                  {[
                    {
                      type: 'in-person' as const,
                      label: '店舗で面談',
                      description: '実際の職場を見ながら詳しくお話',
                      icon: MapPin,
                      recommended: true
                    },
                    {
                      type: 'video' as const,
                      label: 'ビデオ面談',
                      description: 'オンラインで気軽に面談',
                      icon: Video,
                      recommended: false
                    },
                    {
                      type: 'phone' as const,
                      label: '電話面談',
                      description: 'お忙しい方におすすめ',
                      icon: Phone,
                      recommended: false
                    }
                  ].map(({ type, label, description, icon: Icon, recommended }) => (
                    <motion.button
                      key={type}
                      onClick={() => setInterviewType(type)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        interviewType === type
                          ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                          : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          interviewType === type ? 'bg-[#CDAE58] text-white' : 'bg-gray-100'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{label}</span>
                            {recommended && (
                              <span className="px-2 py-1 bg-[#CDAE58] text-white text-xs rounded-full">
                                推奨
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#1C1C1C]/60 mt-1">{description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>

              {/* Calendar */}
              <Card variant="elevated" size="lg">
                <h3 className="text-lg font-semibold mb-6">日程を選択</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {calendarDays.map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <motion.button
                        key={date.toISOString()}
                        onClick={() => handleDateSelect(date)}
                        className={`p-3 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-[#CDAE58] text-white'
                            : isWeekend
                            ? 'bg-gray-50 text-[#1C1C1C]/40 cursor-not-allowed'
                            : 'bg-white border border-[#1C1C1C]/20 hover:border-[#CDAE58]'
                        }`}
                        disabled={isWeekend}
                        whileHover={!isWeekend ? { scale: 1.02 } : {}}
                        whileTap={!isWeekend ? { scale: 0.98 } : {}}
                      >
                        <div className="text-xs opacity-70">
                          {date.toLocaleDateString('ja-JP', { weekday: 'short' })}
                        </div>
                        <div className="font-medium">
                          {date.getDate()}日
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-[#1C1C1C]/10 pt-6"
                  >
                    <h4 className="font-medium mb-4">
                      {formatDate(selectedDate)} - {getTypeLabel(interviewType)}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <motion.button
                          key={slot.id}
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`p-2 rounded-lg text-center transition-all ${
                            selectedTimeSlot?.id === slot.id
                              ? 'bg-[#CDAE58] text-white'
                              : slot.available
                              ? 'bg-white border border-[#1C1C1C]/20 hover:border-[#CDAE58]'
                              : 'bg-gray-100 text-[#1C1C1C]/40 cursor-not-allowed'
                          }`}
                          disabled={!slot.available}
                          whileHover={slot.available ? { scale: 1.05 } : {}}
                          whileTap={slot.available ? { scale: 0.95 } : {}}
                        >
                          <Clock className="w-3 h-3 mx-auto mb-1" />
                          <div className="text-xs font-medium">{slot.time}</div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </div>

            {/* Confirmation Summary */}
            {selectedDate && selectedTimeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card variant="glass" size="md">
                  <h3 className="font-semibold mb-4">予約内容確認</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#CDAE58]" />
                      <span>{formatDate(selectedDate)} {selectedTimeSlot.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {React.createElement(getTypeIcon(interviewType), { className: "w-5 h-5 text-[#CDAE58]" })}
                      <span>{getTypeLabel(interviewType)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-[#CDAE58]" />
                      <span>{restaurant.name} 採用担当者</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>

              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTimeSlot}
              >
                予約を確定する
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg mx-auto"
          >
            <Card variant="elevated" size="lg">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
                className="w-20 h-20 bg-[#CDAE58] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-4">予約完了！</h2>
              <p className="text-[#1C1C1C]/70 mb-8">
                面談予約が完了しました。<br />
                当日はよろしくお願いします。
              </p>

              <div className="bg-[#CDAE58]/10 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4 text-center">予約詳細</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#CDAE58]" />
                    <span>{selectedDate && formatDate(selectedDate)} {selectedTimeSlot?.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {React.createElement(getTypeIcon(interviewType), { className: "w-5 h-5 text-[#CDAE58]" })}
                    <span>{getTypeLabel(interviewType)}</span>
                  </div>
                  {interviewType === 'in-person' && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#CDAE58]" />
                      <span>{restaurant.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">リマインダー</p>
                    <p>面談の前日にアプリ通知でリマインドします。</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}