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
import StartupRunway from './pages/public/StartupRunway';
import ProductShowcase from './pages/public/ProductShowcase';
import AddProduct from './pages/startup/AddProduct';
import RequestTestingSandbox from './pages/gov/RequestTestingSandbox';
import SandboxTrials from './pages/gov/SandboxTrials';
import SandboxTrialDetails from './pages/gov/SandboxTrialDetails';
import IssuePurchaseOrder from './pages/procurement/IssuePurchaseOrder';

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
          {/* Public Routes with Shared Government Navbar & Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/startup" element={<RegisterStartup />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/sectors" element={<SectorsPage />} />
            <Route path="/runway" element={<StartupRunway />} />
            <Route path="/showcase" element={<ProductShowcase />} />
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
            <Route path="/startup/products/add" element={
              <ProtectedRoute allowedRoles={['STARTUP']}>
                <AddProduct />
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
            <Route path="/gov/challenges" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT']}>
                <GovDashboard />
              </ProtectedRoute>
            } />
            <Route path="/gov/challenges/:id" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT']}>
                <ChallengeDetails />
              </ProtectedRoute>
            } />
            <Route path="/gov/challenges/create" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT']}>
                <CreateChallenge />
              </ProtectedRoute>
            } />
            <Route path="/gov/request-sandbox" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT', 'PROCUREMENT_OFFICER', 'ADMINISTRATOR']}>
                <RequestTestingSandbox />
              </ProtectedRoute>
            } />
            <Route path="/gov/sandbox-trials" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT', 'INDEPENDENT_VALIDATOR', 'ADMINISTRATOR']}>
                <SandboxTrials />
              </ProtectedRoute>
            } />
            <Route path="/gov/sandbox-trials/:id" element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_DEPARTMENT', 'INDEPENDENT_VALIDATOR', 'ADMINISTRATOR']}>
                <SandboxTrialDetails />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard defaultTab="users" />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard defaultTab="departments" />
              </ProtectedRoute>
            } />
            <Route path="/admin/startups" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard defaultTab="startups" />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                <AdminDashboard defaultTab="settings" />
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
            <Route path="/procurement/issue-po" element={
              <ProtectedRoute allowedRoles={['PROCUREMENT_OFFICER', 'GOVERNMENT_DEPARTMENT', 'ADMINISTRATOR']}>
                <IssuePurchaseOrder />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
