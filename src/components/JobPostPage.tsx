import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Tag } from './Tag';
import {
  FileText, MapPin, DollarSign, Clock, Users, BookOpen,
  Save, Eye, ChevronLeft, Plus, Minus, Star, Target
} from 'lucide-react';

interface JobPostPageProps {
  onBack: () => void;
  onSave?: (jobData: any) => void;
  editMode?: boolean;
  jobData?: any;
}

export function JobPostPage({ onBack, onSave, editMode = false, jobData }: JobPostPageProps) {
  const [formData, setFormData] = useState({
    title: jobData?.title || '',
    position: jobData?.position || '',
    department: jobData?.department || '',
    experienceLevel: jobData?.experienceLevel || '',
    location: jobData?.location || '東京都港区',
    employmentType: jobData?.employmentType || '',
    salary: {
      min: jobData?.salary?.min || '',
      max: jobData?.salary?.max || '',
      type: jobData?.salary?.type || 'monthly'
    },
    workingHours: {
      start: jobData?.workingHours?.start || '',
      end: jobData?.workingHours?.end || '',
      breakTime: jobData?.workingHours?.breakTime || 60
    },
    holidays: jobData?.holidays || [],
    description: jobData?.description || '',
    responsibilities: jobData?.responsibilities || [''],
    requirements: jobData?.requirements || [''],
    preferredSkills: jobData?.preferredSkills || [],
    trainingProgram: {
      duration: jobData?.trainingProgram?.duration || '',
      curriculum: jobData?.trainingProgram?.curriculum || [''],
      mentorship: jobData?.trainingProgram?.mentorship || '',
      certification: jobData?.trainingProgram?.certification || false
    },
    benefits: jobData?.benefits || [],
    careerPath: jobData?.careerPath || '',
    workEnvironment: jobData?.workEnvironment || []
  });

  const [previewMode, setPreviewMode] = useState(false);

  const positions = [
    'シェフ・料理長', 'スーシェフ', 'コミシェフ', 'パティシエ',
    'ソムリエ', 'サービススタッフ', '研修生・見習い'
  ];

  const departments = [
    'キッチン', 'ホール', 'パティスリー', 'バー', '管理部門'
  ];

  const experienceLevels = [
    '未経験OK', '1年以上', '3年以上', '5年以上', '10年以上'
  ];

  const employmentTypes = [
    '正社員', '契約社員', 'アルバイト・パート', 'インターン'
  ];

  const holidayOptions = [
    '土日祝休み', '週2日休み', 'シフト制', '年間休日120日以上',
    '夏季休暇あり', '年末年始休暇あり'
  ];

  const skillOptions = [
    '火入れ', 'ソース', '盛付け', '仕込み', '原価管理',
    'チームマネジメント', 'メニュー開発', '衛生管理'
  ];

  const benefitOptions = [
    '社会保険完備', '賞与年2回', '昇給あり', '退職金制度',
    '食事補助', '制服貸与', '交通費支給', '研修制度充実',
    '独立支援制度', '海外研修機会', '資格取得支援'
  ];

  const environmentOptions = [
    'オープンキッチン', 'チームワーク重視', '創作料理歓迎',
    '最新設備完備', 'クリーンな職場', '残業少なめ',
    '教育制度充実', 'アットホーム'
  ];

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const toggleArrayField = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, updatedArray);
  };

  const addArrayItem = (field: string) => {
    const currentArray = field.includes('.')
      ? formData.trainingProgram.curriculum
      : formData[field as keyof typeof formData] as string[];
    const updatedArray = [...currentArray, ''];
    updateFormData(field, updatedArray);
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const currentArray = field.includes('.')
      ? formData.trainingProgram.curriculum
      : formData[field as keyof typeof formData] as string[];
    const updatedArray = currentArray.map((item, i) => i === index ? value : item);
    updateFormData(field, updatedArray);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = field.includes('.')
      ? formData.trainingProgram.curriculum
      : formData[field as keyof typeof formData] as string[];
    const updatedArray = currentArray.filter((_, i) => i !== index);
    updateFormData(field, updatedArray);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  const renderForm = () => (
    <div className="space-y-8">
      {/* 基本情報 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#CDAE58]/20 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#CDAE58]" />
          </div>
          <h3 className="font-semibold">基本情報</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">求人タイトル *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              placeholder="スーシェフ募集 - ミシュラン星付きレストラン"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">募集職種 *</label>
            <select
              value={formData.position}
              onChange={(e) => updateFormData('position', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">選択してください</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">部門</label>
            <select
              value={formData.department}
              onChange={(e) => updateFormData('department', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">選択してください</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">経験年数</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => updateFormData('experienceLevel', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">選択してください</option>
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">雇用形態</label>
            <select
              value={formData.employmentType}
              onChange={(e) => updateFormData('employmentType', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
            >
              <option value="">選択してください</option>
              {employmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">勤務地</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              placeholder="東京都港区"
            />
          </div>
        </div>
      </motion.div>

      {/* 給与・勤務条件 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold">給与・勤務条件</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">給与</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                value={formData.salary.min}
                onChange={(e) => updateFormData('salary.min', e.target.value)}
                className="px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                placeholder="最低額"
              />
              <input
                type="number"
                value={formData.salary.max}
                onChange={(e) => updateFormData('salary.max', e.target.value)}
                className="px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                placeholder="最高額"
              />
              <select
                value={formData.salary.type}
                onChange={(e) => updateFormData('salary.type', e.target.value)}
                className="px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              >
                <option value="hourly">時給</option>
                <option value="monthly">月給</option>
                <option value="annual">年収</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">勤務時間</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm text-[#1C1C1C]/60">開始時間</label>
                <input
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) => updateFormData('workingHours.start', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-[#1C1C1C]/60">終了時間</label>
                <input
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) => updateFormData('workingHours.end', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-[#1C1C1C]/60">休憩時間（分）</label>
                <input
                  type="number"
                  value={formData.workingHours.breakTime}
                  onChange={(e) => updateFormData('workingHours.breakTime', parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-medium">休日・休暇</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {holidayOptions.map(holiday => (
                <button
                  key={holiday}
                  onClick={() => toggleArrayField('holidays', holiday)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.holidays.includes(holiday)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                  }`}
                >
                  {holiday}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 仕事内容・応募要件 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold">仕事内容・応募要件</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">仕事内容</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              rows={4}
              placeholder="どのような業務を担当していただくか詳細に記載してください..."
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">主な業務内容</label>
            {formData.responsibilities.map((resp, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={resp}
                  onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                  placeholder="業務内容を入力..."
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeArrayItem('responsibilities', index)}
                  disabled={formData.responsibilities.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addArrayItem('responsibilities')}
            >
              <Plus className="w-4 h-4 mr-2" />
              項目を追加
            </Button>
          </div>

          <div>
            <label className="block mb-2 font-medium">必須要件</label>
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                  placeholder="必須要件を入力..."
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeArrayItem('requirements', index)}
                  disabled={formData.requirements.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addArrayItem('requirements')}
            >
              <Plus className="w-4 h-4 mr-2" />
              項目を追加
            </Button>
          </div>

          <div>
            <label className="block mb-3 font-medium">歓迎スキル</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleArrayField('preferredSkills', skill)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.preferredSkills.includes(skill)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 育成プログラム */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold">育成プログラム・成長支援</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">研修期間</label>
            <input
              type="text"
              value={formData.trainingProgram.duration}
              onChange={(e) => updateFormData('trainingProgram.duration', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              placeholder="3ヶ月、6ヶ月など"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">カリキュラム内容</label>
            {formData.trainingProgram.curriculum.map((curr, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={curr}
                  onChange={(e) => updateArrayItem('trainingProgram.curriculum', index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
                  placeholder="カリキュラムを入力..."
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => removeArrayItem('trainingProgram.curriculum', index)}
                  disabled={formData.trainingProgram.curriculum.length === 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addArrayItem('trainingProgram.curriculum')}
            >
              <Plus className="w-4 h-4 mr-2" />
              項目を追加
            </Button>
          </div>

          <div>
            <label className="block mb-2 font-medium">メンターシップ制度</label>
            <textarea
              value={formData.trainingProgram.mentorship}
              onChange={(e) => updateFormData('trainingProgram.mentorship', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              rows={3}
              placeholder="マンツーマン指導、先輩シェフによるサポート体制など..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="certification"
              checked={formData.trainingProgram.certification}
              onChange={(e) => updateFormData('trainingProgram.certification', e.target.checked)}
              className="w-5 h-5 text-[#CDAE58] rounded focus:ring-[#CDAE58]"
            />
            <label htmlFor="certification" className="font-medium">修了証明書・資格取得支援あり</label>
          </div>

          <div>
            <label className="block mb-2 font-medium">キャリアパス</label>
            <textarea
              value={formData.careerPath}
              onChange={(e) => updateFormData('careerPath', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
              rows={3}
              placeholder="昇進の道筋、将来的な独立支援など..."
            />
          </div>
        </div>
      </motion.div>

      {/* 福利厚生・職場環境 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold">福利厚生・職場環境</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-3 font-medium">福利厚生</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {benefitOptions.map(benefit => (
                <button
                  key={benefit}
                  onClick={() => toggleArrayField('benefits', benefit)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.benefits.includes(benefit)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-3 font-medium">職場環境</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {environmentOptions.map(env => (
                <button
                  key={env}
                  onClick={() => toggleArrayField('workEnvironment', env)}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.workEnvironment.includes(env)
                      ? 'border-[#CDAE58] bg-[#CDAE58]/10'
                      : 'border-[#1C1C1C]/20 hover:border-[#CDAE58]/40'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
      <h2 className="text-2xl font-bold mb-6">プレビュー</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">{formData.title || '求人タイトル'}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag label={formData.position || '職種'} variant="primary" />
            <Tag label={formData.experienceLevel || '経験レベル'} variant="secondary" />
            <Tag label={formData.employmentType || '雇用形態'} variant="secondary" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FAF8F4] rounded-xl p-4">
            <h4 className="font-medium mb-2">勤務地</h4>
            <p className="text-[#1C1C1C]/70">{formData.location}</p>
          </div>

          <div className="bg-[#FAF8F4] rounded-xl p-4">
            <h4 className="font-medium mb-2">給与</h4>
            <p className="text-[#1C1C1C]/70">
              {formData.salary.min && formData.salary.max
                ? `${formData.salary.min}万円 - ${formData.salary.max}万円`
                : '応相談'
              }
            </p>
          </div>
        </div>

        {formData.description && (
          <div>
            <h4 className="font-medium mb-2">仕事内容</h4>
            <p className="text-[#1C1C1C]/70 whitespace-pre-wrap">{formData.description}</p>
          </div>
        )}

        {formData.preferredSkills.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">求めるスキル</h4>
            <div className="flex flex-wrap gap-2">
              {formData.preferredSkills.map(skill => (
                <Tag key={skill} label={skill} variant="skill" />
              ))}
            </div>
          </div>
        )}

        {formData.benefits.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">福利厚生</h4>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map(benefit => (
                <Tag key={benefit} label={benefit} variant="secondary" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  {editMode ? '求人編集' : '新しい求人を作成'}
                </h1>
                <p className="text-[#1C1C1C]/70">求人情報を入力してください</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'フォームに戻る' : 'プレビュー'}
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editMode ? '更新する' : '求人を投稿'}
              </Button>
            </div>
          </div>

          {/* Content */}
          {previewMode ? renderPreview() : renderForm()}
        </div>
      </div>
    </div>
  );
}