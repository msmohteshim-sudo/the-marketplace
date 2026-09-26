import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ServicesPage } from './pages/services/ServicesPage';
import { JobsPage } from './pages/jobs/JobsPage';
import { IdeasPage } from './pages/ideas/IdeasPage';
import { CoursesPage } from './pages/courses/CoursesPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SavedPage } from './pages/saved/SavedPage';
import { AdminPage } from './pages/admin/AdminPage';

import { ErrorBoundary } from './components/common/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* 4 Core Marketplace Modules */}
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServicesPage />} />
              <Route path="/services/create" element={<ServicesPage />} />

              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobsPage />} />
              <Route path="/jobs/post" element={<JobsPage />} />

              <Route path="/ideas" element={<IdeasPage />} />
              <Route path="/ideas/:id" element={<IdeasPage />} />
              <Route path="/ideas/create" element={<IdeasPage />} />

              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CoursesPage />} />
              <Route path="/courses/create" element={<CoursesPage />} />

              {/* Activity & User */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/saved" element={<SavedPage />} />

              {/* Admin Panel */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
