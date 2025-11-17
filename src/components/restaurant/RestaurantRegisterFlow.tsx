import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../layouts/PageLayout';
import { Card } from '../common/Card';
import { Button } from '../Button';
import { ImageUploader } from '../upload/ImageUploader';
import {
  Check,
  Building,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Star,
  Camera,
  FileText,
  Award,
  ChefHat,
  Target
} from 'lucide-react';

interface RestaurantRegisterFlowProps {
  onComplete: () => void;
}

export function RestaurantRegisterFlow({ onComplete }: RestaurantRegisterFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    type: '',
    description: '',
    address: '',
    phone: '',
    website: '',

    // Images
    mainImage: '',
    galleryImages: [] as string[],

    // Job Posting
    position: '',
    salary: '',
    workStyle: [] as string[],
    experienceLevel: '',
    skillsToTeach: [] as string[],
    benefits: [] as string[],

    // Requirements
    requiredSkills: [] as string[],
    jobDescription: '',
    idealCandidate: ''
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const restaurantTypes = ['フレンチ', 'イタリアン', '和食', '中華', 'スペイン料理', 'カフェ', 'その他'];
  const workStyles = ['フルタイム', 'パートタイム', '修行期間限定', '独立支援枠'];
  const skillsList = ['火入れ', 'ソース', '盛付け', '仕込み', '原価管理', 'チームマネジメント'];
  const benefitsList = [
    '独立支援制度',
    '技術指導充実',
    'キャリアアップ支援',
    '食事補助',
    '交通費支給',
    '社会保険完備',
    '有給休暇',
    '研修制度',
    '制服貸与'
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

  const handleArrayToggle = (array: string[], value: string, setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  return (
    <PageLayout
      title="店舗登録"
      subtitle="あなたのお店で働く、次世代の料理人を見つけましょう"
      badge="RESTAURANT REGISTRATION"
      maxWidth="lg"
    >
      {/* Progress Bar */}
      <div className="mb-16">
        <div className="flex justify-between mb-4 max-w-md mx-auto">
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
        <div className="h-2 bg-white rounded-full overflow-hidden max-w-md mx-auto">
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
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-3xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">基本情報</h2>
                  <p className="text-[#1C1C1C]/60">
                    あなたのお店について教えてください
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">店舗名</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="レストラン名"
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">料理ジャンル</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      >
                        <option value="">選択してください</option>
                        {restaurantTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">店舗紹介</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="お店の特徴やコンセプトを教えてください"
                      className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">住所</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="東京都渋谷区..."
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">電話番号</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="03-1234-5678"
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">ウェブサイト（任意）</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://your-restaurant.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Images */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-4xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">店舗写真</h2>
                  <p className="text-[#1C1C1C]/60">
                    お店の魅力を伝える写真をアップロードしてください
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Main Image */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">メイン写真</h3>
                    <ImageUploader
                      onImagesUploaded={(images) => {
                        if (images.length > 0) {
                          setFormData({
                            ...formData,
                            mainImage: images[0].preview
                          });
                        }
                      }}
                      maxImages={1}
                      className="mb-4"
                    />
                    <p className="text-sm text-[#1C1C1C]/60 text-center">
                      料理人が最初に目にする写真です。店舗外観や代表的な料理がおすすめです。
                    </p>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">ギャラリー写真（任意）</h3>
                    <ImageUploader
                      onImagesUploaded={(images) => {
                        setFormData({
                          ...formData,
                          galleryImages: images.map(img => img.preview)
                        });
                      }}
                      maxImages={5}
                      className="mb-4"
                    />
                    <p className="text-sm text-[#1C1C1C]/60 text-center">
                      厨房の様子、料理、店内の雰囲気など、働く環境が分かる写真を追加できます。
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Job Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="elevated" size="lg" className="w-full max-w-4xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#CDAE58]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[#CDAE58]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">求人情報</h2>
                  <p className="text-[#1C1C1C]/60">
                    募集する職種と条件を設定してください
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">募集職種</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="コック、スーシェフなど"
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium">給与</label>
                      <input
                        type="text"
                        value={formData.salary}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        placeholder="25-30万円"
                        className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Work Style */}
                  <div>
                    <label className="block mb-3 font-medium">勤務形態</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {workStyles.map(style => (
                        <button
                          key={style}
                          onClick={() => handleArrayToggle(
                            formData.workStyle,
                            style,
                            (arr) => setFormData({ ...formData, workStyle: arr })
                          )}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            formData.workStyle.includes(style)
                              ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                              : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills to Teach */}
                  <div>
                    <label className="block mb-3 font-medium flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#CDAE58]" />
                      教えられるスキル
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {skillsList.map(skill => (
                        <button
                          key={skill}
                          onClick={() => handleArrayToggle(
                            formData.skillsToTeach,
                            skill,
                            (arr) => setFormData({ ...formData, skillsToTeach: arr })
                          )}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            formData.skillsToTeach.includes(skill)
                              ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                              : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block mb-3 font-medium flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#CDAE58]" />
                      待遇・福利厚生
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {benefitsList.map(benefit => (
                        <button
                          key={benefit}
                          onClick={() => handleArrayToggle(
                            formData.benefits,
                            benefit,
                            (arr) => setFormData({ ...formData, benefits: arr })
                          )}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            formData.benefits.includes(benefit)
                              ? 'border-[#CDAE58] bg-[#CDAE58] text-white'
                              : 'border-[#1C1C1C]/20 text-[#1C1C1C]/70 hover:border-[#CDAE58]'
                          }`}
                        >
                          {benefit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Completion */}
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
                  className="w-24 h-24 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold mb-4">登録完了！</h2>
                <p className="text-[#1C1C1C]/70 mb-8 text-lg">
                  {formData.name}の求人が公開されました。<br />
                  素晴らしい料理人との出会いを期待しています。
                </p>

                <div className="bg-[#CDAE58]/10 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">次のステップ</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#CDAE58] rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <span>応募者からの連絡を受け取る</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#CDAE58]/40 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <span>チャットで事前面談</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#CDAE58]/40 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <span>面接・採用の決定</span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-8"
                >
                  ✨
                </motion.div>

                <p className="text-[#1C1C1C]/60 mb-8">
                  求人管理はダッシュボードで行えます
                </p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12 max-w-4xl mx-auto">
        {step > 1 && step < 4 && (
          <Button variant="ghost" onClick={handleBack}>
            戻る
          </Button>
        )}

        {step < 4 ? (
          <Button
            variant="primary"
            onClick={handleNext}
            className={step === 1 ? 'ml-auto' : ''}
          >
            次へ
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={handleNext}
            className="mx-auto"
          >
            ダッシュボードへ
          </Button>
        )}
      </div>
    </PageLayout>
  );
}