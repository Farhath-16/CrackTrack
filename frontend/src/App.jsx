import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlacementTracker from './pages/PlacementTracker';
import DSAVault from './pages/DSAVault';
import InterviewBoard from './pages/interviewBoard';
import Profile from './pages/Profile';

import ProtectedRoute from "./components/ProtectedRoute";
import { requestNotificationPermission } from "./utils/notifications";


function App() {
  console.log("App rendered");
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drives"
          element={
            <ProtectedRoute>
              <PlacementTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dsa"
          element={
            <ProtectedRoute>
              <DSAVault />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <InterviewBoard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  )
}

export default App;