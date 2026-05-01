import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import RoleSelection from './components/RoleSelection';
import RetailerDashboard from './components/retailer/RetailerDashboard';
import FactoryDashboard from './components/factory/FactoryDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { Toaster } from "sonner";

function AppContent() {
  const navigate = useNavigate();

  const handleBackToRoleSelection = () => {
    navigate('/');
  };

  const handleSelectRole = (role: string) => {
    navigate(`/${role}`);
  };

  return (
    <div className="size-full">
      <Routes>
        <Route path="/" element={<RoleSelection onSelectRole={handleSelectRole} />} />
        <Route path="/retailer" element={<RetailerDashboard onBack={handleBackToRoleSelection} />} />
        <Route path="/factory" element={<FactoryDashboard onBack={handleBackToRoleSelection} />} />
        <Route path="/driver" element={<DriverDashboard onBack={handleBackToRoleSelection} />} />
        <Route path="/admin" element={<AdminDashboard onBack={handleBackToRoleSelection} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
      <Toaster 
        position="top-center" 
        expand={true} 
        richColors 
        dir="rtl"
        toastOptions={{
          style: {
            fontFamily: "'Cairo', sans-serif",
            borderRadius: '1.25rem',
            padding: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
    </Router>
  );
}