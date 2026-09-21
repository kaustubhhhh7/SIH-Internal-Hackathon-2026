import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './i18n';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';

import HomePage from './pages/public/HomePage';
import ChallengesPage from './pages/public/ChallengesPage';
import SectorsPage from './pages/public/SectorsPage';
import ProcessPage from './pages/public/ProcessPage';
import RaiseTicket from './pages/public/RaiseTicket';

import Login from './pages/auth/Login';
import RegisterStartup from './pages/auth/RegisterStartup';
import StartupDashboard from './pages/startup/Dashboard';
import FindChallenges from './pages/startup/FindChallenges';
import ChallengeDetails from './pages/startup/ChallengeDetails';
import GovDashboard from './pages/gov/Dashboard';
import CreateChallenge from './pages/gov/CreateChallenge';
import AdminDashboard from './pages/admin/Dashboard';
import KnowledgeBaseAdmin from './pages/admin/KnowledgeBase';
import ExpertDashboard from './pages/expert/Dashboard';
import ValidatorDashboard from './pages/validator/Dashboard';
import ProcurementDashboard from './pages/procurement/Dashboard';

const queryClient = new QueryClient();

// This is a simple auth mock for the foundation phase.
// In real app, this reads from context/local storage/API.
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Simple mock
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register/startup" element={<RegisterStartup />} />
          
          {/* Public Routes with Shared Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/raise-ticket" element={<RaiseTicket />} />
          </Route>
          
          {/* Authenticated Routes */}
          <Route element={<MainLayout />}>
            
            {/* Startup Routes */}
            <Route path="/startup/dashboard" element={
              <ProtectedRoute allowedRoles={['STARTUP']}>
                <StartupDashboard />
              </ProtectedRoute>
            } />
            <Route path="/startup/challenges" element={
              <ProtectedRoute allowedRoles={['STARTUP']}>
                <FindChallenges />
              </ProtectedRoute>
            } />
            <Route path="/startup/challenges/:id" element={
              <ProtectedRoute allowedRoles={['STARTUP']}>
                <ChallengeDetails />
              </ProtectedRoute>
            } />
            
            {/* Gov Routes */}
            <Route path="/gov/dashboard" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT']}>
                <GovDashboard />
              </ProtectedRoute>
            } />
            <Route path="/gov/challenges/create" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT']}>
                <CreateChallenge />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/knowledge" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <KnowledgeBaseAdmin />
              </ProtectedRoute>
            } />
            
            {/* Expert Routes */}
            <Route path="/expert/dashboard" element={
              <ProtectedRoute allowedRoles={['EXPERT_EVALUATOR']}>
                <ExpertDashboard />
              </ProtectedRoute>
            } />
            
            {/* Validator Routes */}
            <Route path="/validator/dashboard" element={
              <ProtectedRoute allowedRoles={['INDEPENDENT_VALIDATOR']}>
                <ValidatorDashboard />
              </ProtectedRoute>
            } />
            
            {/* Procurement Routes */}
            <Route path="/procurement/dashboard" element={
              <ProtectedRoute allowedRoles={['PROCUREMENT_OFFICER']}>
                <ProcurementDashboard />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
