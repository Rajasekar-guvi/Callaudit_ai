import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Toast } from './components/ui/Toast';
import { SubmissionPage } from './pages/SubmissionPage';
import { DashboardPage } from './pages/DashboardPage';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  useTheme();

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<SubmissionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toast />
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
