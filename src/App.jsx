import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './auth/useAuth';
import ProtectedRoute from './auth/ProtectedRoute';
import LandingPage from './pages/auth/LandingPage'; 
// Layouts
import AdminLayout from './layouts/AdminLayout';
import GeneralLayout from './layouts/GeneralLayout';
import StudentLayout from './layouts/StudentLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import StudentSignupPage from './pages/auth/StudentSignupPage'; // ✅ FIXED: Import signup page

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import UploadFace from './pages/admin/UploadFace'; // ✅ Include missing
import UploadVideo from './pages/admin/UploadVideo'; // ✅ Include missing
import Detections from './pages/admin/Detections';
import AdminProfile from './pages/admin/AdminProfile';
import UserDetail from './pages/admin/UserDetail';

// General User Pages
import GeneralDashboard from './pages/general/Dashboard';
import GeneralUpload from './pages/general/UploadVideo';
import GeneralDetections from './pages/general/Detections';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentUpload from './pages/student/MyFace';
import StudentDetections from './pages/student/Detections';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<StudentSignupPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
  <Route path="users" element={<Users />} />
  <Route path="users/:id" element={<UserDetail />} /> {/* ✅ */}
  <Route path="upload-face" element={<UploadFace />} />
  <Route path="upload-video" element={<UploadVideo />} />
  <Route path="detections" element={<Detections />} />
  <Route path="profile" element={<AdminProfile />} /> {/* ✅ */}
      </Route>

      {/* General User Protected Routes */}
      <Route
        path="/general/*"
        element={
          <ProtectedRoute role="general">
            <GeneralLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<GeneralDashboard />} />
        <Route path="upload" element={<GeneralUpload />} />
        <Route path="detections" element={<GeneralDetections />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="upload" element={<StudentUpload />} />
        <Route path="detections" element={<StudentDetections />} />
      </Route>
    </Routes>
  );
}

export default App;
