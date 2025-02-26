import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './Pages/Homepage';
import AuthPage from './Pages/Authpage';
import Navbar from './Pages/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import StudyPlannerPage from './Pages/StudyPlanner';
import FocusTrackingPage from './Pages/FocusTracking';
import DashboardPage from './Pages/Dashboard';
import SmartStudyRecommendations from './Pages/SmartStudy';
import StudyGroupsPage from './Pages/StudyGroups';
import SettingsPage from './Pages/Settings';


// Example of authenticated pages
const Dashboard = () => <div className=" max-w-7xl mx-auto"><DashboardPage /></div>;
const StudyPlanner = () => <div className=" max-w-7xl mx-auto"><StudyPlannerPage /></div>;
const FocusTracking = () => <div className=" max-w-7xl mx-auto"><FocusTrackingPage /></div>;
const SmartStudy = () => <div className=" max-w-7xl mx-auto"><SmartStudyRecommendations /></div>;
const StudyGroups = () => <div className=" max-w-7xl mx-auto"><StudyGroupsPage /></div>;
const Settings = () => <div className=" max-w-7xl mx-auto"><SettingsPage /></div>;

// Auth wrapper component
const AuthRequired = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      // Save the attempted URL for redirecting after login
      navigate('/auth', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);
  
  return isAuthenticated ? children : null;
};

// Layout component to ensure Navbar appears on all pages
const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />
      {children}
    </>
  );
};

// AppRoutes component to handle all the routes
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <Layout>
            {isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
          </Layout>
        }
      />
      
      <Route
        path="/auth"
        element={
          <Layout>
            {isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
          </Layout>
        }
      />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <AuthRequired>
              <Dashboard />
            </AuthRequired>
          </Layout>
        }
      />
      
      <Route
        path="/studyplanner"
        element={
          <Layout>
            <AuthRequired>
              <StudyPlanner />
            </AuthRequired>
          </Layout>
        }
      />
      
      <Route
        path="/focustracking"
        element={
          <Layout>
            <AuthRequired>
              <FocusTracking />
            </AuthRequired>
          </Layout>
        }
      />
      
      <Route
        path="/smartstudy"
        element={
          <Layout>
            <AuthRequired>
              <SmartStudy />
            </AuthRequired>
          </Layout>
        }
      />
      
      <Route
        path="/studygroups"
        element={
          <Layout>
            <AuthRequired>
              <StudyGroups />
            </AuthRequired>
          </Layout>
        }
      />
      
      <Route
        path="/settings"
        element={
          <Layout>
            <AuthRequired>
              <Settings />
            </AuthRequired>
          </Layout>
        }
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'focusUpdate') {
        const { focusedTime, totalTime } = event.data;
        const focusScore = ((focusedTime / totalTime) * 100).toFixed(2);
        console.log(`Focus Score: ${focusScore}%`);
        // Update global state or UI with focus data
      }
    });
  }, []);
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;