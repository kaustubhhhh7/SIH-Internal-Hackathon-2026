import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
  RefreshCw,
  Award,
  Check,
  Printer,
  X,
  CreditCard,
  FileCheck,
  Sparkles,
  Loader2
} from 'lucide-react';
import { procurementApi } from '../../services/api/procurement';
import { aiAgentsApi } from '../../services/api/aiAgents';
import type {
  ProcurementDashboardStats,
  PurchaseOrder,
  ValidatedPilot
} from '../../services/api/procurement';

const ProcurementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'pilots' | 'policy'>('orders');
  const [stats, setStats] = useState<ProcurementDashboardStats | null>(null);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [validatedPilots, setValidatedPilots] = useState<ValidatedPilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Milestone Update Modal State
  const [selectedOrderForMilestone, setSelectedOrderForMilestone] = useState<PurchaseOrder | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [milestoneNotes, setMilestoneNotes] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Certificate Modal State
  const [selectedOrderForCert, setSelectedOrderForCert] = useState<PurchaseOrder | null>(null);

  // AI Executive Brief Modal State (Agent 4)
  const [briefModalOpen, setBriefModalOpen] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefContent, setBriefContent] = useState<string>('');
  const [selectedPilotForBrief, setSelectedPilotForBrief] = useState<ValidatedPilot | null>(null);

  const handleOpenBrief = async (pilot: ValidatedPilot) => {
    setSelectedPilotForBrief(pilot);
    setBriefModalOpen(true);
    setBriefLoading(true);
    try {
      const res = await aiAgentsApi.generateBrief(pilot.trialId);
      setBriefContent(res.markdownBrief);
    } catch (err: any) {
      console.error('Failed to generate AI brief:', err);
      setBriefContent('# Error\nFailed to generate AI Executive Brief. Please try again.');
    } finally {
      setBriefLoading(false);
    }
  };

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashRes, ordersRes, pilotsRes] = await Promise.all([
        procurementApi.getDashboard().catch(() => ({ data: null })),
        procurementApi.getOrders({ search: searchQuery, status: statusFilter }).catch(() => ({ data: { orders: [] } })),
        procurementApi.getValidatedPilots().catch(() => ({ data: [] }))
      ]);

      if (dashRes.data) {
        setStats(dashRes.data);
      }
      if (ordersRes.data?.orders) {
        setOrders(ordersRes.data.orders);
      }
      if (pilotsRes.data) {
        setValidatedPilots(pilotsRes.data);
      }
    } catch (err) {
      console.error('Failed to load procurement data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const openMilestoneModal = (order: PurchaseOrder) => {
    setSelectedOrderForMilestone(order);
    // suggest next logical status
    if (order.status === 'ORDER_PLACED') setTargetStatus('HARDWARE_DISPATCHED');
    else if (order.status === 'HARDWARE_DISPATCHED') setTargetStatus('INSPECTED_DELIVERED');
    else if (order.status === 'INSPECTED_DELIVERED') setTargetStatus('COMMISSIONED_OPERATIONAL');
    else setTargetStatus('COMPLETED');
    setMilestoneNotes('');
  };

  const handleUpdateMilestone = async () => {
    if (!selectedOrderForMilestone || !targetStatus) return;
    try {
      setIsUpdatingStatus(true);
      await procurementApi.updateStatus(selectedOrderForMilestone.id, targetStatus, milestoneNotes);
      showToast(`Purchase order updated to ${targetStatus.replace(/_/g, ' ')}. Escrow tranche adjusted!`);
      setSelectedOrderForMilestone(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to update order milestone status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getEscrowBadge = (status: string) => {
    switch (status) {
      case 'ESCROW_LOCKED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            🔒 100% In Escrow
          </span>
        );
      case 'ADVANCE_DISBURSED_40':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300">
            ⚡ 40% Advance DBT Released
          </span>
        );
      case 'ACCEPTANCE_DISBURSED_40':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-300">
            📦 80% Released (Inspection Verified)
          </span>
        );
      case 'FULL_DISBURSED_100':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            ✅ 100% Commissioned & Settled
          </span>
        );
      default:
        return <span className="text-xs text-gray-500 font-mono">{status}</span>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'ORDER_PLACED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">ORDER PLACED</span>;
      case 'HARDWARE_DISPATCHED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">HARDWARE DISPATCHED</span>;
      case 'INSPECTED_DELIVERED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">INSPECTED & DELIVERED</span>;
      case 'COMMISSIONED_OPERATIONAL':
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-300">COMMISSIONED (LIVE)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-blue to-indigo-900 rounded-lg p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            GFR Rule 149 & Rule 173(i) Direct Procurement Gateway
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Procurement Officer Governance Dashboard
          </h1>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl">
            Authorize single-source direct work orders for DPIIT-recognized startups, manage GeM PO issuance, and supervise Milestone Escrow Direct Benefit Transfers (DBT).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors flex items-center gap-1.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/procurement/issue-po"
            className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md transition-colors shadow-sm flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Issue Direct Purchase Order
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-gov-blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Validated Field Pilots</span>
            <Award className="w-5 h-5 text-gov-blue" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.validatedPilotsCount ?? validatedPilots.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Third-party certified for direct award
          </p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Procurement</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.pendingProcurementCount ?? validatedPilots.filter(p => !p.hasExistingPO).length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting GeM work order sanction</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active State Contracts</span>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {stats?.activeContractsCount ?? orders.length}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Under escrow delivery tracking</p>
        </div>

        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value Sanctioned</span>
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {formatCurrency(stats?.totalProcurementValue ?? orders.reduce((sum, o) => sum + o.totalAmount, 0))}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Under GFR Rule 149 exemption</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-xs font-bold" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-gov-blue text-gov-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Direct Purchase Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('pilots')}
            className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pilots'
                ? 'border-gov-blue text-gov-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Validated Pilots Awaiting PO ({validatedPilots.length})
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`py-3 px-1 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'policy'
                ? 'border-gov-blue text-gov-blue'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Statutory Framework (GFR 149 & DBT Rules)
          </button>
        </nav>
      </div>

      {/* TAB 1: DIRECT PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by PO #, startup, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue w-full"
              />
            </form>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gov-blue text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="ORDER_PLACED">Order Placed</option>
                <option value="HARDWARE_DISPATCHED">Hardware Dispatched</option>
                <option value="INSPECTED_DELIVERED">Inspected & Delivered</option>
                <option value="COMMISSIONED_OPERATIONAL">Commissioned</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No purchase orders found</p>
              <p className="text-xs text-slate-500 mt-1">Issue a direct work order from validated field trials to get started.</p>
              <Link
                to="/procurement/issue-po"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-xs font-bold bg-gov-blue text-white rounded-md hover:bg-gov-blueDark"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Issue Work Order Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">PO Reference</th>
                    <th className="px-4 py-3 text-left">Startup / Supplier</th>
                    <th className="px-4 py-3 text-left">Procured Solution</th>
                    <th className="px-4 py-3 text-right">Value (Incl. GST)</th>
                    <th className="px-4 py-3 text-left">Escrow DBT Status</th>
                    <th className="px-4 py-3 text-left">Lifecycle</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-gov-blue">{po.orderNumber}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{po.rule149ExemptionRef}</div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{po.startupName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {po.departmentName}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 max-w-xs truncate" title={po.productName}>
                          {po.productName}
                        </div>
                        <div className="text-[11px] text-slate-500">Qty: {po.quantity} units</div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(po.totalAmount)}</div>
                        <div className="text-[10px] text-slate-500">GST 18%: {formatCurrency(po.gstAmount)}</div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getEscrowBadge(po.escrowStatus)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {getOrderStatusBadge(po.status)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrderForCert(po)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
                          title="View GFR 149 Sanction Certificate"
                        >
                          Certificate
                        </button>
                        <button
                          onClick={() => openMilestoneModal(po)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded transition-colors"
                          title="Advance Escrow / Milestone"
                        >
                          Update Escrow
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VALIDATED PILOTS AWAITING PO */}
      {activeTab === 'pilots' && (
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Field Pilots Validated for Direct GeM Procurement</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These startup solutions have passed 90-day field testing and received independent Pass/Fail certificates from scientific validation panels (COEP/IIT Bombay). Under GFR Rule 149, government departments can contract them directly without floating fresh tenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {validatedPilots.map((pilot) => (
              <div key={pilot.trialId} className="border border-slate-200 rounded-lg p-5 hover:border-gov-blue transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                      {pilot.trialReferenceNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Score: {pilot.validationScore}%
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{pilot.title}</h4>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Innovator:</span>
                      <strong className="text-slate-800">{pilot.startupName}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Target Dept:</span>
                      <span className="text-slate-700">{pilot.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Test Site:</span>
                      <span className="text-slate-700">{pilot.testingEnvironment} ({pilot.location})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Pilot Budget:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(pilot.maximumBudget)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {pilot.hasExistingPO ? (
                      <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" /> Work Order Issued
                      </span>
                    ) : (
                      <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" /> Awaiting PO Award
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBrief(pilot)}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Generate 1-Page AI Executive Brief for GFR 149 Sanction"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>📄 Generate AI Executive Brief</span>
                    </button>

                    <Link
                      to={`/procurement/issue-po?trialId=${pilot.trialId}`}
                      className="px-3 py-1.5 text-xs font-bold bg-gov-blue hover:bg-gov-blueDark text-white rounded transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Issue Work Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATUTORY POLICY & ESCROW DBT RULES */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-lg shadow-xs border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">GFR Rule 149 & Milestone Escrow DBT Protocol</h3>
            <p className="text-xs text-slate-500 mt-1">
              Statutory backing governing startup single-source awards under Maharashtra State Innovation Policy 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                Tranche 1: 40% Dispatch Advance
              </div>
              <p className="text-xs text-blue-800">
                Released from State Escrow upon proof of hardware carrier dispatch, OEM serial registration, and optical sensor consignment bills.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-900 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">2</span>
                Tranche 2: 40% Delivery & Bench Verification
              </div>
              <p className="text-xs text-purple-800">
                Released automatically via DBT once consignee signs physical delivery receipt and independent validator verifies bench calibration.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">3</span>
                Tranche 3: 20% Final Commissioning
              </div>
              <p className="text-xs text-emerald-800">
                Released after 30 days of continuous field deployment without telemetry breakdown, completing full contract settlement.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Key Legal Provisions</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>GFR Rule 149</strong>: Mandates exemption of DPIIT-recognized startups from prior turnover and prior experience criteria.
              </li>
              <li>
                <strong>GFR Rule 173(i)</strong>: Authorizes direct single-source procurement without floating open tenders when products have successfully graduated from government testbeds.
              </li>
              <li>
                <strong>Maharashtra IT & Innovation Policy 2026</strong>: Mandates minimum 25% startup procurement across all public departments and urban local bodies.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* MILESTONE / ESCROW UPDATE MODAL */}
      {selectedOrderForMilestone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl border border-slate-300 w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Escrow Milestone Status</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedOrderForMilestone.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForMilestone(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Lifecycle & DBT Milestone:</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue text-xs font-semibold"
                >
                  <option value="ORDER_PLACED">ORDER PLACED (100% Locked in Escrow)</option>
                  <option value="HARDWARE_DISPATCHED">HARDWARE DISPATCHED (Trigger 40% Advance DBT)</option>
                  <option value="INSPECTED_DELIVERED">INSPECTED & DELIVERED (Trigger 40% Delivery DBT)</option>
                  <option value="COMMISSIONED_OPERATIONAL">COMMISSIONED (Trigger Final 20% Release)</option>
                  <option value="COMPLETED">COMPLETED (Fully Settled)</option>
                  <option value="CANCELLED">CANCELLED (Refund to State Treasury)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Officer Milestone Inspection Notes / Consignment Docket #:</label>
                <textarea
                  rows={3}
                  value={milestoneNotes}
                  onChange={(e) => setMilestoneNotes(e.target.value)}
                  placeholder="e.g. Consignment airway bill #49102 verified. Edge vision boxes handed over to Pune Smart City division."
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue text-xs"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[11px] text-amber-900">
                <strong>Statutory DBT Note:</strong> Confirming this status change will record an irrevocable milestone progress entry in the state treasury DBT ledger.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedOrderForMilestone(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdatingStatus}
                onClick={handleUpdateMilestone}
                className="px-4 py-2 text-xs font-bold bg-gov-blue hover:bg-gov-blueDark text-white rounded transition-colors flex items-center gap-1.5"
              >
                {isUpdatingStatus ? 'Processing DBT...' : 'Confirm Milestone & Release Escrow'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GFR 149 EXEMPTION CERTIFICATE MODAL */}
      {selectedOrderForCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-6 text-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-900 rounded-full flex items-center justify-center font-bold text-xl border border-amber-500">
                  🏛️
                </div>
                <div>
                  <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-950">
                    Government of Maharashtra
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    Maharashtra State Innovation Society (MSInS) • GeM Procurement Cell
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderForCert(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono uppercase bg-slate-100 px-3 py-1 rounded font-bold border border-slate-300">
                Statutory Sanction & Exemption Certificate
              </span>
              <h3 className="text-lg font-black text-slate-950 mt-1">
                SANCTION ORDER: {selectedOrderForCert.orderNumber}
              </h3>
              <p className="text-[11px] font-mono text-gov-blue font-semibold">
                Authority Ref: {selectedOrderForCert.rule149ExemptionRef}
              </p>
            </div>

            {/* Certificate Body */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded space-y-3 text-xs leading-relaxed text-slate-800">
              <p>
                This certifies that the direct procurement of <strong>{selectedOrderForCert.productName}</strong> (Quantity: {selectedOrderForCert.quantity}) has been approved in accordance with <strong>Rule 149 of the General Financial Rules (GFR)</strong> and <strong>Rule 173(i)</strong> for DPIIT-recognized startups.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Beneficiary Startup:</span>
                  <strong>{selectedOrderForCert.startupName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Purchasing Department:</span>
                  <strong>{selectedOrderForCert.departmentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sanctioned Order Value:</span>
                  <strong className="text-emerald-700 text-sm">{formatCurrency(selectedOrderForCert.totalAmount)}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Current Escrow DBT Status:</span>
                  <strong>{selectedOrderForCert.escrowStatus}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block text-[10px]">Delivery Consignee Location:</span>
                <span className="text-slate-700">{selectedOrderForCert.deliveryConsigneeAddress}</span>
              </div>
            </div>

            {/* Signature & Seal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs">
              <div>
                <p className="text-[11px] text-slate-500">Sanctioned Date: {new Date(selectedOrderForCert.orderDate).toLocaleDateString()}</p>
                <p className="text-[11px] text-slate-500">Digital Seal: SHA-256 Verified</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-900">{selectedOrderForCert.procurementOfficerName || 'Chief Procurement Officer'}</p>
                <p className="text-[10px] text-slate-500">State Nodal Procurement Authority</p>
              </div>
            </div>

            {/* Print Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementDashboard;
