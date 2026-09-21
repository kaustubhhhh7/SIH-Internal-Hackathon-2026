
import { Users, Building, Activity, Shield } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gov-border pb-4">
        <h2 className="text-page-title text-gov-blue">System Administration</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-gov-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-500">Total Users</p>
              <p className="text-number-large text-gray-800 mt-1">0</p>
            </div>
            <Users className="w-8 h-8 text-gov-blue opacity-50" />
          </div>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-500">Registered Startups</p>
              <p className="text-number-large text-gray-800 mt-1">0</p>
            </div>
            <Activity className="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="card border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-500">Departments</p>
              <p className="text-number-large text-gray-800 mt-1">0</p>
            </div>
            <Building className="w-8 h-8 text-indigo-500 opacity-50" />
          </div>
        </div>
        <div className="card border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-gray-500">System Health</p>
              <p className="text-number-large text-green-600 mt-1">Healthy</p>
            </div>
            <Shield className="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gov-border p-6 mt-8">
        <h3 className="text-section-title text-gray-800 mb-4 border-none pb-0">Recent Audit Logs</h3>
        <p className="text-body text-gray-500">No audit logs available for display.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
