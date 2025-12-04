import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { ChefRegisterFlow } from './components/ChefRegisterFlow';
import { RestaurantRegisterFlow } from './components/RestaurantRegisterFlow';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { JobPostPage } from './components/JobPostPage';
import { JobListingPage } from './components/JobListingPage';
import { JobDetailPage } from './components/JobDetailPage';
import { ChefProfilePage } from './components/ChefProfilePage';
import { ChatPage } from './components/ChatPage';
import { InterviewSchedulePage } from './components/InterviewSchedulePage';
import { ReviewPage } from './components/ReviewPage';
import { AuthPage } from './components/AuthPage';
import { ChefProfileEditor } from './components/profile/ChefProfileEditor';
import { RestaurantProfileEditor } from './components/profile/RestaurantProfileEditor';
import { RestaurantProfilePage } from './components/RestaurantProfilePage';
import { ProfileProvider } from './context/ProfileContext';
import { useAuth } from './hooks/useAuth';

type Page =
  | 'landing'
  | 'chef-register'
  | 'restaurant-register'
  | 'restaurant-dashboard'
  | 'job-post'
  | 'jobs'
  | 'job-detail'
  | 'profile'
  | 'chef-profile-builder'
  | 'restaurant-profile-builder'
  | 'restaurant-profile'
  | 'chat'
  | 'interview-schedule'
  | 'review'
  | 'about'
  | 'auth';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isAuthenticated } = useAuth();

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'chef-register':
        return <ChefRegisterFlow onComplete={() => navigateTo('chef-profile-builder')} />;

      case 'restaurant-register':
        return <RestaurantRegisterFlow onComplete={() => navigateTo('restaurant-profile-builder')} />;

      case 'chef-profile-builder':
        return (
          <ChefProfileEditor
            onBack={() => navigateTo('jobs')}
            onSaved={() => navigateTo('profile')}
          />
        );

      case 'restaurant-profile-builder':
        return (
          <RestaurantProfileEditor
            onBack={() => navigateTo('restaurant-dashboard')}
            onSaved={() => navigateTo('restaurant-profile')}
          />
        );

      case 'restaurant-dashboard':
        return <RestaurantDashboard onNavigate={navigateTo} />;

      case 'restaurant-profile':
        return <RestaurantProfilePage onBack={() => navigateTo('restaurant-dashboard')} />;

      case 'job-post':
        return <JobPostPage onBack={() => navigateTo('restaurant-dashboard')} />;

      case 'jobs':
        return <JobListingPage onJobClick={(jobId) => navigateTo('job-detail')} />;

      case 'job-detail':
        return <JobDetailPage onBack={() => navigateTo('jobs')} />;

      case 'profile':
        return <ChefProfilePage onBack={() => navigateTo('jobs')} />;

      case 'auth':
        return (
          <AuthPage
            onBack={() => navigateTo('landing')}
            onSuccess={() => navigateTo('jobs')}
          />
        );

      case 'chat':
        return (
          <ChatPage
            onBack={() => navigateTo('job-detail')}
            onScheduleInterview={() => navigateTo('interview-schedule')}
          />
        );

      case 'interview-schedule':
        return <InterviewSchedulePage onBack={() => navigateTo('chat')} />;

      case 'review':
        return <ReviewPage onBack={() => navigateTo('profile')} />;

      case 'about':
        return (
          <div className="min-h-screen bg-[#FAF8F4] pb-20" style={{ paddingTop: '120px' }}>
            <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 max-w-4xl">
                <h2 className="mb-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">ChefNextとは</h2>
              </div>

              <div className="w-full max-w-4xl">
                <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(205,174,88,0.1)] mb-8">
                  <h3 className="mb-4">私たちのビジョン</h3>
                  <p className="text-[#1C1C1C]/70 leading-relaxed mb-6">
                    ChefNextは、料理人のキャリアを「学びと成長」を中心に再定義する
                    次世代のマッチングプラットフォームです。単なる求人サービスではなく、
                    料理人としての技術向上、人間的な成長、そして独立への道のりを
                    全面的にサポートします。
                  </p>
                  <p className="text-[#1C1C1C]/70 leading-relaxed">
                    「次の一皿が、次のステージへ。」<br />
                    あなたの情熱と技術を、次の世代へ。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                    <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="mb-3">スキル重視のマッチング</h4>
                    <p className="text-[#1C1C1C]/70 leading-relaxed">
                      経験年数ではなく、習得スキルと成長意欲を重視したマッチング
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                    <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h4 className="mb-3">成長の可視化</h4>
                    <p className="text-[#1C1C1C]/70 leading-relaxed">
                      スキルツリーとレビューシステムで成長過程を可視化
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(205,174,88,0.1)]">
                    <div className="w-12 h-12 bg-[#CDAE58] rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h4 className="mb-3">独立支援</h4>
                    <p className="text-[#1C1C1C]/70 leading-relaxed">
                      経営ノウハウから資金支援まで、独立をトータルサポート
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      <main>
        {renderPage()}
      </main>

      <Footer />

      {/* Quick Access FAB - Profile */}
      {isAuthenticated && currentPage !== 'landing' && currentPage !== 'chef-register' && (
        <button
          onClick={() => navigateTo('profile')}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#CDAE58] rounded-full shadow-[0_4px_20px_rgba(205,174,88,0.4)] flex items-center justify-center hover:shadow-[0_8px_30px_rgba(205,174,88,0.5)] transition-all z-50"
        >
          <span className="text-white text-xl">👨‍🍳</span>
        </button>
      )}
    </div>
  );
}
function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}

export default App;
