import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Tag } from './Tag';
import {
  Users, Plus, Calendar, Search, Filter, MoreVertical, Star,
  TrendingUp, Clock, Eye, MessageSquare, FileText, CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RestaurantDashboardProps {
  onNavigate: (page: string) => void;
}

export function RestaurantDashboard({ onNavigate }: RestaurantDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = {
    totalApplicants: 24,
    activeJobs: 3,
    upcomingInterviews: 5,
    averageRating: 4.8
  };

  const recentApplicants = [
    {
      id: 1,
      name: '佐藤 健太',
      position: 'スーシェフ',
      experience: '3年',
      skills: ['火入れ Lv.4', 'ソース Lv.3', '盛付け Lv.5'],
      appliedDate: '2024-11-10',
      status: 'pending',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      name: '田中 美咲',
      position: 'コミシェフ',
      experience: '2年',
      skills: ['仕込み Lv.4', '原価管理 Lv.3'],
      appliedDate: '2024-11-09',
      status: 'interview_scheduled',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      name: '山田 大輔',
      position: 'スーシェフ',
      experience: '5年',
      skills: ['火入れ Lv.5', 'チームマネジメント Lv.4'],
      appliedDate: '2024-11-08',
      status: 'accepted',
      avatar: 'https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwcG9ydHJhaXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYzMDU0MzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const activeJobs = [
    {
      id: 1,
      title: 'スーシェフ募集',
      position: 'スーシェフ',
      applicants: 12,
      postedDate: '2024-11-01',
      status: 'active'
    },
    {
      id: 2,
      title: 'コミシェフ急募',
      position: 'コミシェフ',
      applicants: 8,
      postedDate: '2024-11-05',
      status: 'active'
    },
    {
      id: 3,
      title: 'パティシエ（研修生）',
      position: '研修生',
      applicants: 4,
      postedDate: '2024-11-07',
      status: 'active'
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidateName: '田中 美咲',
      position: 'コミシェフ',
      date: '2024-11-15',
      time: '14:00',
      type: '面談・厨房見学'
    },
    {
      id: 2,
      candidateName: '鈴木 一郎',
      position: 'スーシェフ',
      date: '2024-11-16',
      time: '10:00',
      type: '技術面談'
    },
    {
      id: 3,
      candidateName: '高橋 花子',
      position: '研修生',
      date: '2024-11-17',
      time: '16:00',
      type: '面談'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '審査中';
      case 'interview_scheduled':
        return '面談予定';
      case 'accepted':
        return '採用';
      case 'rejected':
        return '不採用';
      default:
        return '未確認';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalApplicants}</p>
              <p className="text-sm text-[#1C1C1C]/60">応募者数</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#CDAE58]/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#CDAE58]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeJobs}</p>
              <p className="text-sm text-[#1C1C1C]/60">募集中</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#CDAE58]">
            <Clock className="w-4 h-4" />
            <span>平均応募期間 2週間</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.upcomingInterviews}</p>
              <p className="text-sm text-[#1C1C1C]/60">面談予定</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-purple-600">
            <Calendar className="w-4 h-4" />
            <span>今週 3件</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.averageRating}</p>
              <p className="text-sm text-[#1C1C1C]/60">レビュー評価</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Star className="w-4 h-4 fill-current" />
            <span>24件のレビュー</span>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applicants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">最近の応募者</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('applicants')}
            >
              すべて見る
            </Button>
          </div>

          <div className="space-y-4">
            {recentApplicants.slice(0, 3).map((applicant) => (
              <div key={applicant.id} className="flex items-center gap-4 p-4 bg-[#FAF8F4] rounded-xl">
                <ImageWithFallback
                  src={applicant.avatar}
                  alt={applicant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{applicant.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(applicant.status)}`}>
                      {getStatusText(applicant.status)}
                    </span>
                  </div>
                  <p className="text-sm text-[#1C1C1C]/60">{applicant.position} • {applicant.experience}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {applicant.skills.slice(0, 2).map((skill) => (
                      <Tag key={skill} label={skill} variant="skill" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">今週の面談予定</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('interviews')}
            >
              スケジュール
            </Button>
          </div>

          <div className="space-y-4">
            {upcomingInterviews.slice(0, 3).map((interview) => (
              <div key={interview.id} className="flex items-center gap-4 p-4 border border-[#1C1C1C]/10 rounded-xl">
                <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{interview.candidateName}</h4>
                  <p className="text-sm text-[#1C1C1C]/60">{interview.position}</p>
                  <p className="text-sm text-[#CDAE58]">
                    {interview.date} {interview.time} • {interview.type}
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  詳細
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderApplicants = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C1C1C]/40" />
          <input
            type="text"
            placeholder="応募者を検索..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1C1C1C]/20 focus:border-[#CDAE58] focus:outline-none"
          />
        </div>
        <Button variant="secondary">
          <Filter className="w-4 h-4 mr-2" />
          フィルター
        </Button>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
        {recentApplicants.map((applicant, index) => (
          <motion.div
            key={applicant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 ${index < recentApplicants.length - 1 ? 'border-b border-[#1C1C1C]/10' : ''}`}
          >
            <div className="flex items-start gap-4">
              <ImageWithFallback
                src={applicant.avatar}
                alt={applicant.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{applicant.name}</h3>
                    <p className="text-[#1C1C1C]/60">{applicant.position} • 経験{applicant.experience}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(applicant.status)}`}>
                      {getStatusText(applicant.status)}
                    </span>
                    <button className="p-2 hover:bg-[#FAF8F4] rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {applicant.skills.map((skill) => (
                    <Tag key={skill} label={skill} variant="skill" />
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-[#1C1C1C]/60 mb-4">
                  <span>応募日: {applicant.appliedDate}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    プロフィール確認
                  </Button>
                  <Button variant="secondary" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    メッセージ
                  </Button>
                  {applicant.status === 'pending' && (
                    <>
                      <Button variant="secondary" size="sm">
                        面談設定
                      </Button>
                      <Button variant="primary" size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        承認
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">募集求人管理</h2>
        <Button
          variant="primary"
          onClick={() => onNavigate('job-post')}
        >
          <Plus className="w-4 h-4 mr-2" />
          新しい求人を作成
        </Button>
      </div>

      {/* Jobs List */}
      <div className="grid gap-6">
        {activeJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                <p className="text-[#1C1C1C]/60">{job.position}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                  募集中
                </span>
                <button className="p-2 hover:bg-[#FAF8F4] rounded-lg">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#FAF8F4] rounded-xl p-4">
                <p className="text-2xl font-bold text-[#CDAE58]">{job.applicants}</p>
                <p className="text-sm text-[#1C1C1C]/60">応募者数</p>
              </div>
              <div className="bg-[#FAF8F4] rounded-xl p-4">
                <p className="text-sm text-[#1C1C1C]/60">掲載開始</p>
                <p className="font-medium">{job.postedDate}</p>
              </div>
              <div className="bg-[#FAF8F4] rounded-xl p-4">
                <p className="text-sm text-[#1C1C1C]/60">ステータス</p>
                <p className="font-medium text-green-600">活動中</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={() => onNavigate('restaurant-applications')}>
                応募者確認
              </Button>
              <Button variant="secondary" size="sm">
                求人編集
              </Button>
              <Button variant="secondary" size="sm">
                一時停止
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: '概要', icon: TrendingUp },
    { id: 'applicants', label: '応募者管理', icon: Users },
    { id: 'jobs', label: '求人管理', icon: FileText },
    { id: 'interviews', label: '面談管理', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Restaurant L'espoir</h1>
            <p className="text-[#1C1C1C]/70">レストラン管理ダッシュボード</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl p-2 mb-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#CDAE58] text-white shadow-[0_4px_20px_rgba(205,174,88,0.3)]'
                      : 'text-[#1C1C1C]/70 hover:bg-[#FAF8F4]'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'applicants' && renderApplicants()}
            {activeTab === 'jobs' && renderJobs()}
            {activeTab === 'interviews' && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-[#CDAE58]" />
                <h3 className="text-xl font-semibold mb-2">面談管理</h3>
                <p className="text-[#1C1C1C]/70">面談スケジュール管理機能は次回のアップデートで実装予定です</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
