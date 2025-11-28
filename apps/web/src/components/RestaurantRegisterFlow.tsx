import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Tag } from './Tag';
import { Check, MapPin, Building2, Users, Clock, Star, Target } from 'lucide-react';
import { PageLayout } from './layouts/PageLayout';
import { Card } from './common/Card';
import { ImageUploader } from './upload/ImageUploader';

interface RestaurantRegisterFlowProps {
  onComplete: () => void;
}

export function RestaurantRegisterFlow({ onComplete }: RestaurantRegisterFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    genre: '',
    location: '',
    description: '',
    images: [] as string[],
    capacity: '',
    businessHours: {
      open: '',
      close: ''
    },
    educationPhilosophy: '',
    trainingPrograms: [] as string[],
    mentorshipStyle: '',
    careerSupport: [] as string[],
    workEnvironment: [] as string[],
    benefits: [] as string[]
  });

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const genres = ['フレンチ', 'イタリアン', '和食', '中華', 'スペイン料理', 'カフェ・ビストロ', 'その他'];

  const trainingPrograms = [
    'マンツーマン指導', 'グループ研修', '外部講師招聘',
    '他店舗研修', '海外研修', 'コンテスト参加支援'
  ];

  const mentorshipStyles = [
    '伝統的徒弟制', '現代的コーチング', 'プロジェクトベース',
    'ローテーション制', 'オープンキッチン制'
  ];

  const careerSupportOptions = [
    '独立支援', '昇進制度', '資格取得支援', '転職サポート',
    '開業コンサルティング', '資金調達支援'
  ];

  const workEnvironmentOptions = [
    'オープンキッチン', 'チームワーク重視', '創作料理可',
    '最新設備完備', 'クリーンな職場', '残業少なめ'
  ];

  const benefitsOptions = [
    '社会保険完備', '賞与あり', '有給取得推奨', '食事補助',
    '研修費補助', '制服貸与', '交通費支給'
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleArrayField = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, updatedArray);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="mb-4">レストラン基本情報</h3>
                <p className="text-[#1C1C1C]/70">あなたのレストランについて教えてください</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">レストラン名 *</label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => updateFormData('restaurantName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    placeholder="Restaurant L'espoir"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">オーナーシェフ名 *</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => updateFormData('ownerName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    placeholder="田中 太郎"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">所在地 *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    placeholder="東京都港区"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">客席数</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    placeholder="30"
                  />
                </div>
              </div>
            </motion.div>
          </Card>
        );

      case 2:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <Star className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="mb-4">料理ジャンル・コンセプト</h3>
                <p className="text-[#1C1C1C]/70">レストランの特色を教えてください</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 font-medium">メイン料理ジャンル *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => updateFormData('genre', genre)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.genre === genre
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{genre}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">レストラン紹介</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    rows={4}
                    placeholder="お店の特色、こだわり、雰囲気について教えてください..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">営業開始</label>
                    <input
                      type="time"
                      value={formData.businessHours.open}
                      onChange={(e) => updateFormData('businessHours', {
                        ...formData.businessHours,
                        open: e.target.value
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">営業終了</label>
                    <input
                      type="time"
                      value={formData.businessHours.close}
                      onChange={(e) => updateFormData('businessHours', {
                        ...formData.businessHours,
                        close: e.target.value
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>
        );

      case 3:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <Target className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="mb-4">教育方針・指導スタイル</h3>
                <p className="text-[#1C1C1C]/70">どのように若手シェフを育てていますか？</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">教育方針</label>
                  <textarea
                    value={formData.educationPhilosophy}
                    onChange={(e) => updateFormData('educationPhilosophy', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                    rows={4}
                    placeholder="技術向上、人間性、将来への目標など、どのような考えで指導されているかお聞かせください..."
                  />
                </div>

                <div>
                  <label className="block mb-3 font-medium">提供する研修プログラム</label>
                  <div className="grid grid-cols-1 gap-3">
                    {trainingPrograms.map((program) => (
                      <button
                        key={program}
                        onClick={() => toggleArrayField('trainingPrograms', program)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.trainingPrograms.includes(program)
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{program}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-3 font-medium">指導スタイル</label>
                  <div className="grid grid-cols-1 gap-3">
                    {mentorshipStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => updateFormData('mentorshipStyle', style)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.mentorshipStyle === style
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>
        );

      case 4:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <Users className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="mb-4">キャリア支援・労働環境</h3>
                <p className="text-[#1C1C1C]/70">働きやすさと成長環境について教えてください</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 font-medium">提供するキャリア支援</label>
                  <div className="grid grid-cols-1 gap-3">
                    {careerSupportOptions.map((support) => (
                      <button
                        key={support}
                        onClick={() => toggleArrayField('careerSupport', support)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.careerSupport.includes(support)
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{support}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-3 font-medium">労働環境の特徴</label>
                  <div className="grid grid-cols-2 gap-3">
                    {workEnvironmentOptions.map((env) => (
                      <button
                        key={env}
                        onClick={() => toggleArrayField('workEnvironment', env)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.workEnvironment.includes(env)
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{env}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </Card>
        );

      case 5:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <Clock className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="mb-4">待遇・福利厚生</h3>
                <p className="text-[#1C1C1C]/70">働く環境の詳細をお聞かせください</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-3 font-medium">福利厚生・待遇</label>
                  <div className="grid grid-cols-2 gap-3">
                    {benefitsOptions.map((benefit) => (
                      <button
                        key={benefit}
                        onClick={() => toggleArrayField('benefits', benefit)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.benefits.includes(benefit)
                            ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                            : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                        }`}
                      >
                        <span className="font-medium">{benefit}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">店舗写真</label>
                  <p className="text-sm text-[#1C1C1C]/60 mb-3">
                    厨房や店舗の雰囲気が分かる写真を追加してください
                  </p>
                  <ImageUploader
                    images={formData.images}
                    onImagesChange={(images) => updateFormData('images', images)}
                    maxImages={5}
                  />
                </div>
              </div>
            </motion.div>
          </Card>
        );

      case 6:
        return (
          <Card className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Success Animation */}
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

              <h2 className="mb-4">登録完了！</h2>
              <p className="text-[#1C1C1C]/70 mb-6 text-lg">
                {formData.restaurantName}の登録が完了しました
              </p>
              <p className="text-[#1C1C1C]/60">
                審査が完了次第、メールでご連絡いたします。<br />
                素晴らしいシェフとの出会いをお楽しみに。
              </p>
            </motion.div>
          </Card>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.restaurantName && formData.ownerName && formData.location;
      case 2:
        return formData.genre;
      case 3:
        return formData.educationPhilosophy;
      case 4:
        return formData.careerSupport.length > 0;
      case 5:
        return formData.benefits.length > 0;
      default:
        return true;
    }
  };

  return (
    <PageLayout
      title="レストラン登録"
      description="次世代のシェフを育てる、あなたの店舗を登録しましょう"
      showProgress={step < totalSteps}
      progress={progress}
    >
      <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
        <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            {/* Progress Bar */}
            {step < totalSteps && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-[#1C1C1C]/60">
                    Step {step} of {totalSteps}
                  </span>
                  <span className="text-sm font-medium text-[#1C1C1C]/60">
                    {Math.round(progress)}% 完了
                  </span>
                </div>
                <div className="w-full bg-[#1C1C1C]/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-gradient-to-r from-[#CDAE58] to-[#F2E6B6] h-2 rounded-full"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            {step < totalSteps && (
              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="secondary"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  戻る
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {step === totalSteps - 1 ? '登録完了' : '次へ'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}