import { useState } from 'react';
import RoleSelection from './components/RoleSelection';
import RetailerDashboard from './components/retailer/RetailerDashboard';
import FactoryDashboard from './components/factory/FactoryDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

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