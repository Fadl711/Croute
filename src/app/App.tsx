import { useState } from 'react';
import RoleSelection from './components/RoleSelection';
import RetailerDashboard from './components/RetailerDashboard';
import FactoryDashboard from './components/FactoryDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
  };

  return (
    <div className="size-full">
      {!selectedRole && <RoleSelection onSelectRole={setSelectedRole} />}
      {selectedRole === 'retailer' && <RetailerDashboard onBack={handleBackToRoleSelection} />}
      {selectedRole === 'factory' && <FactoryDashboard onBack={handleBackToRoleSelection} />}
      {selectedRole === 'driver' && <DriverDashboard onBack={handleBackToRoleSelection} />}
      {selectedRole === 'admin' && <AdminDashboard onBack={handleBackToRoleSelection} />}
    </div>
  );
}