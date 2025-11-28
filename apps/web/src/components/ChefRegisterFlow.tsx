import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { Tag } from './Tag';
import { Check, Flame, Droplet, Scissors, MapPin, DollarSign } from 'lucide-react';
import { SkillTreeNode } from './SkillTreeNode';
import { PageLayout } from './layouts/PageLayout';
import { Card } from './common/Card';
import { ImageUploader } from './upload/ImageUploader';

interface ChefRegisterFlowProps {
  onComplete: () => void;
}

export function ChefRegisterFlow({ onComplete }: ChefRegisterFlowProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    experience: '',
    portfolioImages: [] as string[],
    skills: {} as { [key: string]: number },
    location: '',
    salary: ''
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const genres = ['フレンチ', 'イタリアン', '和食', '中華', 'スペイン料理', 'その他'];
  const skillsList = ['火入れ', 'ソース', '盛付け', '仕込み', '原価管理', 'チームマネジメント'];

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

  const handleSkillChange = (skill: string, level: number) => {
    setFormData({
      ...formData,
      skills: { ...formData.skills, [skill]: level }
    });
  };

  return (
    <PageLayout
      title="シェフ登録"
      subtitle="あなたの料理人としてのキャリアを始めましょう"
      badge="CHEF REGISTRATION"
      maxWidth="lg"
    >
      {/* Progress Bar */}
      <div className="mb-16">
        <div className="flex justify-between mb-4 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                s <= step ? 'bg-[#CDAE58] text-white' : 'bg-white text-[#1C1C1C]/40'
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
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

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex justify-center"
          >
            <Card variant="elevated" size="lg" className="w-full max-w-2xl">
              <h2 className="mb-2 text-2xl font-bold leading-tight">基本情報</h2>
              <p className="text-[#1C1C1C]/60 mb-8">あなたについて教えてください</p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium">お名前</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="山田 太郎"
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">得意ジャンル</label>
                  <div className="flex flex-wrap gap-3">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setFormData({ ...formData, genre })}
                        className={`px-4 py-2 rounded-full transition-all ${
                          formData.genre === genre
                            ? 'bg-[#CDAE58] text-white'
                            : 'bg-white border border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#CDAE58]'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">経験年数</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                  >
                    <option value="">選択してください</option>
                    <option value="1年未満">1年未満</option>
                    <option value="1-3年">1-3年</option>
                    <option value="3-5年">3-5年</option>
                    <option value="5-10年">5-10年</option>
                    <option value="10年以上">10年以上</option>
                  </select>
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
            className="w-full flex justify-center"
          >
            <Card variant="elevated" size="lg" className="w-full max-w-3xl">
              <h2 className="mb-2 text-2xl font-bold leading-tight">作品登録</h2>
              <p className="text-[#1C1C1C]/60 mb-8">あなたの代表作を見せてください</p>

              <ImageUploader
                onImagesUploaded={(images) => {
                  setFormData({
                    ...formData,
                    portfolioImages: images.map(img => img.preview)
                  });
                }}
                maxImages={5}
                className="mb-8"
              />

              <div className="mt-8">
                <label className="block mb-2 font-medium">料理の説明</label>
                <textarea
                  placeholder="この料理のこだわりや技法を教えてください"
                  className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>

              <div className="mt-6">
                <label className="block mb-2 font-medium">使用した技法</label>
                <div className="flex flex-wrap gap-2">
                  <Tag label="火入れ" icon={Flame} variant="skill" />
                  <Tag label="ソース" icon={Droplet} variant="skill" />
                  <Tag label="盛付け" icon={Scissors} variant="skill" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Skill Tree */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex justify-center"
          >
            <Card variant="elevated" size="lg" className="w-full max-w-4xl">
              <h2 className="mb-2 text-2xl font-bold leading-tight">スキルツリー</h2>
              <p className="text-[#1C1C1C]/60 mb-8">あなたのスキルレベルを教えてください</p>

              <div className="relative h-[500px] bg-[#FAF8F4] rounded-2xl mb-8">
                {/* Center Node */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(205,174,88,0.3)] z-10">
                  <span className="font-medium">YOU</span>
                </div>

                {/* Skill Nodes */}
                {skillsList.map((skill, index) => (
                  <SkillTreeNode
                    key={skill}
                    skill={skill}
                    level={formData.skills[skill] || 0}
                    angle={(360 / skillsList.length) * index}
                    distance={180}
                  />
                ))}
              </div>

              <div className="space-y-4">
                {skillsList.map((skill) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">{skill}</label>
                      <span className="text-[#CDAE58]">Lv.{formData.skills[skill] || 0}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={formData.skills[skill] || 0}
                      onChange={(e) => handleSkillChange(skill, parseInt(e.target.value))}
                      className="w-full accent-[#CDAE58]"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Preferences */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full flex justify-center"
          >
            <Card variant="elevated" size="lg" className="w-full max-w-2xl">
              <h2 className="mb-2 text-2xl font-bold leading-tight">希望条件</h2>
              <p className="text-[#1C1C1C]/60 mb-8">理想の働き方を教えてください</p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    希望勤務地
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="東京都渋谷区"
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    希望報酬
                  </label>
                  <select
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none transition-colors"
                  >
                    <option value="">選択してください</option>
                    <option value="20-25万円">20-25万円</option>
                    <option value="25-30万円">25-30万円</option>
                    <option value="30-35万円">30-35万円</option>
                    <option value="35-40万円">35-40万円</option>
                    <option value="40万円以上">40万円以上</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">勤務形態</label>
                  <div className="space-y-3">
                    {['フルタイム', 'パートタイム', '修行期間限定', '独立支援枠'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-[#CDAE58] rounded"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 5: Completion */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full flex justify-center"
          >
            <Card variant="elevated" size="lg" className="w-full max-w-2xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-br from-[#CDAE58] to-[#F2E6B6] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_4px_24px_rgba(205,174,88,0.3)]"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <h2 className="mb-4 text-2xl font-bold leading-tight">登録完了！</h2>
              <p className="text-[#1C1C1C]/70 mb-8 text-lg leading-relaxed">
                あなたの成長が、今日から始まります。
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-8"
              >
                ✨
              </motion.div>

              <p className="text-[#1C1C1C]/60 mb-8 leading-relaxed">
                プロフィールが作成されました。<br />
                さっそく理想の職場を探しましょう！
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && step < 5 && (
          <Button variant="ghost" onClick={handleBack}>
            戻る
          </Button>
        )}
        {step < 5 ? (
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
            求人を探す
          </Button>
        )}
      </div>
    </PageLayout>
  );
}