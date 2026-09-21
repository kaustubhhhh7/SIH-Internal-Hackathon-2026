
import { ShoppingCart } from 'lucide-react';

const ProcurementDashboard = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-gov-border pb-4">
        <h2 className="text-page-title text-gov-blue">Procurement Officer Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-l-4 border-l-gov-blue">
          <p className="text-caption text-gray-500">Validated Pilots</p>
          <p className="text-number-large text-gray-800 mt-1">0</p>
        </div>
        <div className="card border-l-4 border-l-yellow-500">
          <p className="text-caption text-gray-500">Pending Procurement</p>
          <p className="text-number-large text-gray-800 mt-1">0</p>
        </div>
        <div className="card border-l-4 border-l-indigo-500">
          <p className="text-caption text-gray-500">Active Contracts</p>
          <p className="text-number-large text-gray-800 mt-1">0</p>
        </div>
        <div className="card border-l-4 border-l-green-500">
          <p className="text-caption text-gray-500">Scale-Up Decisions</p>
          <p className="text-number-large text-gray-800 mt-1">0</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gov-border p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShoppingCart className="w-12 h-12 text-gray-300" />
        </div>
        <h4 className="text-card-title text-gray-900">No pending procurements</h4>
        <p className="mt-1 text-body text-gray-500">Pilots that successfully pass independent validation will appear here for contracting and scale-up.</p>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
