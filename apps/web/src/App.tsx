import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layouts/Layout';
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
import { ChefApplicationsPage } from './components/ChefApplicationsPage';
import { RestaurantApplicationsPage } from './components/RestaurantApplicationsPage';
import { AboutPage } from './components/AboutPage';
import { ProfileProvider } from './context/ProfileContext';

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/jobs" element={<JobListingPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />

            {/* Chef Routes */}
            <Route path="/chef/register" element={<ChefRegisterFlow />} />
            <Route path="/chef/profile/edit" element={<ChefProfileEditor />} />
            <Route path="/chef/profile" element={<ChefProfilePage />} />
            <Route path="/chef/applications" element={<ChefApplicationsPage />} />

            {/* Restaurant Routes */}
            <Route path="/restaurant/register" element={<RestaurantRegisterFlow />} />
            <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
            <Route path="/restaurant/profile/edit" element={<RestaurantProfileEditor />} />
            <Route path="/restaurant/profile" element={<RestaurantProfilePage />} />
            <Route path="/restaurant/jobs/new" element={<JobPostPage />} />
            <Route path="/restaurant/applications" element={<RestaurantApplicationsPage />} />

            {/* Other Routes */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/interview/schedule" element={<InterviewSchedulePage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
