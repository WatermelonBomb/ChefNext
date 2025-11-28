import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { ImageUploader } from '../upload/ImageUploader';
import {
  Check,
  FileText,
  Camera,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  DollarSign,
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ApplicationFlowProps {
  job: {
    id: string;
    restaurant: {
      name: string;
      image: string;
      rating: number;
      location: string;
    };
    position: string;
    salary: string;
    skillsYouCanLearn: string[];
  };
  onComplete: () => void;
  onBack: () => void;
}

export function ApplicationFlow({ job, onComplete, onBack }: ApplicationFlowProps) {
  const [step, setStep] = useState(1);
  const [applicationData, setApplicationData] = useState({
    motivation: '',
    experience: '',
    portfolio: [] as string[],
    availableStartDate: '',
    contactPreference: 'chat'
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit application
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <PageLayout
      title="応募申請"
      subtitle="あなたの想いを伝えて、新しいチャレンジを始めましょう"
      badge="APPLICATION"
      maxWidth="lg"
    >
      {/* Job Info Header */}
      <Card variant="outline" size="md" className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden">
            <img
              src={job.restaurant.image}
              alt={job.restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{job.position}</h3>
            <div className="flex items-center gap-4 text-sm text-[#1C1C1C]/60">
              <span className="font-medium">{job.restaurant.name}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#CDAE58] text-[#CDAE58]" />
                <span>{job.restaurant.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{job.restaurant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.skillsYouCanLearn.map(skill => (
                <Tag key={skill} label={skill} variant="skill" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4 max-w-lg mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                s <= step ? 'bg-[#CDAE58] text-white' : 'bg-white text-[#1C1C1C]/40 border border-[#1C1C1C]/20'
              }`}
            >
              {s < step ? <Check className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-white rounded-full overflow-hidden max-w-lg mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-[#CDAE58] to-[#F2E6B6]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          {/* Step 1: Motivation */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">志望動機</h2>
                  <p className="text-[#1C1C1C]/60">
                    なぜこのお店で働きたいのかを教えてください
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 font-medium">
                      志望動機・自己PR
                    </label>
                    <textarea
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        motivation: e.target.value
                      })}
                      placeholder="このお店を選んだ理由や、あなたの情熱を伝えてください..."
                      className="w-full px-4 py-4 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors resize-none"
                      rows={6}
                    />
                  </div>

                  <div>
                    <label className="block mb-3 font-medium">
                      これまでの経験
                    </label>
                    <textarea
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        experience: e.target.value
                      })}
                      placeholder="料理経験や関連するスキルについて教えてください..."
                      className="w-full px-4 py-4 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Portfolio */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-3xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">作品ポートフォリオ</h2>
                  <p className="text-[#1C1C1C]/60">
                    あなたの料理作品を見せてください（任意）
                  </p>
                </div>

                <ImageUploader
                  onImagesUploaded={(images) => {
                    setApplicationData({
                      ...applicationData,
                      portfolio: images.map(img => img.preview)
                    });
                  }}
                  maxImages={3}
                  className="mb-6"
                />

                <div className="text-center text-sm text-[#1C1C1C]/60">
                  ポートフォリオは後からでも追加できます
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">勤務開始時期</h2>
                  <p className="text-[#1C1C1C]/60">
                    いつから働き始められますか？
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 font-medium">
                      希望開始日
                    </label>
                    <input
                      type="date"
                      value={applicationData.availableStartDate}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        availableStartDate: e.target.value
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block mb-3 font-medium">
                      連絡手段の希望
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={() => setApplicationData({
                          ...applicationData,
                          contactPreference: 'chat'
                        })}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          applicationData.contactPreference === 'chat'
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#CDAE58]'
                            : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
                        }`}
                      >
                        <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">チャット面談</span>
                        <p className="text-xs mt-1 opacity-70">
                          アプリ内でカジュアルに
                        </p>
                      </button>

                      <button
                        onClick={() => setApplicationData({
                          ...applicationData,
                          contactPreference: 'phone'
                        })}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          applicationData.contactPreference === 'phone'
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10 text-[#CDAE58]'
                            : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
                        }`}
                      >
                        <Clock className="w-6 h-6 mx-auto mb-2" />
                        <span className="font-medium">面接予約</span>
                        <p className="text-xs mt-1 opacity-70">
                          店舗で直接面談
                        </p>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-2xl text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="w-20 h-20 bg-[#CDAE58] rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold mb-4">応募完了！</h2>
                <p className="text-[#1C1C1C]/70 mb-8 text-lg">
                  {job.restaurant.name}に応募を送信しました。<br />
                  通常24時間以内に返信があります。
                </p>

                <div className="bg-[#CDAE58]/10 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">次のステップ</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#CDAE58] rounded-full flex items-center justify-center text-white text-xs">
                        1
                      </div>
                      <span>店舗からの連絡を待つ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#CDAE58]/40 rounded-full flex items-center justify-center text-white text-xs">
                        2
                      </div>
                      <span>チャット面談または面接日程調整</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#CDAE58]/40 rounded-full flex items-center justify-center text-white text-xs">
                        3
                      </div>
                      <span>最終面接・条件交渉</span>
                    </div>
                  </div>
                </div>

                <p className="text-[#1C1C1C]/60 mb-8">
                  応募状況はマイページで確認できます
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 max-w-2xl mx-auto">
        {step > 1 && step < 4 && (
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        )}

        {step === 1 && (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            求人に戻る
          </Button>
        )}

        <div className="ml-auto">
          {step < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              次へ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              マイページへ
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}