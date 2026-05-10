import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import SendRewards from './pages/SendRewards';
import Feedback from './pages/Feedback';
import MyProfile from './pages/MyProfile';
import MarkAttendance from './pages/MarkAttendance';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageAttendance from './pages/ManageAttendance';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-attendance"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MarkAttendance />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Leaderboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-rewards"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <SendRewards />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Feedback />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <MyProfile />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <ProtectedLayout>
                <AdminDashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute role="admin">
              <ProtectedLayout>
                <ManageUsers />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-attendance"
          element={
            <ProtectedRoute role="admin">
              <ProtectedLayout>
                <ManageAttendance />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
