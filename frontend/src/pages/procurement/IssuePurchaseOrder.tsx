import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  CreditCard, 
  FileCheck2, 
  Scale, 
  Check, 
  Info,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { productStore } from '../../services/productStore';
import type { PurchaseOrder } from '../../services/productStore';
import { procurementApi } from '../../services/api/procurement';

const IssuePurchaseOrder: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId') || 'PRD-ROBO-002';
  const trialIdParam = searchParams.get('trialId');
  const navigate = useNavigate();

  const products = productStore.getProducts();
  const targetProduct = products.find(p => p.id === productId) || products[0];

  const [quantity, setQuantity] = useState(Math.max(1, targetProduct.minOrderQty));
  const [departmentName, setDepartmentName] = useState('Department of Transport, GoM');
  const [deliveryConsigneeAddress, setDeliveryConsigneeAddress] = useState('Divisional Office, Central Building, Station Road, Pune 411001');
  const [procurementOfficer, setProcurementOfficer] = useState('Er. Anil Deshmukh, Chief Procurement Officer');
  const [agreeRule149, setAgreeRule149] = useState(true);
  const [agreeEscrowMilestone, setAgreeEscrowMilestone] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<PurchaseOrder | null>(null);

  const totalAmount = quantity * targetProduct.price;
  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const [deptsRes, startupsRes] = await Promise.all([
        procurementApi.getDepartments().catch(() => ({ data: [] })),
        procurementApi.getStartups().catch(() => ({ data: [] }))
      ]);

      const dept = deptsRes.data?.[0];
      const startup = startupsRes.data?.[0];

      if (dept && startup) {
        const res = await procurementApi.createOrder({
          startupProfileId: startup.id,
          departmentId: dept.id,
          sandboxTrialId: trialIdParam || undefined,
          productName: targetProduct.name,
          itemDescription: targetProduct.description || targetProduct.name,
          quantity: quantity,
          unitPrice: targetProduct.price,
          deliveryConsigneeAddress: deliveryConsigneeAddress,
          procurementOfficerName: procurementOfficer
        });

        if (res.data) {
          const newPO: PurchaseOrder = {
            id: res.data.id,
            orderNumber: res.data.orderNumber,
            productId: targetProduct.id,
            productName: res.data.productName,
            startupName: res.data.startupName || startup.companyName,
            departmentName: res.data.departmentName || dept.name,
            quantity: res.data.quantity,
            totalAmount: res.data.totalAmount,
            rule149ExemptionRef: res.data.rule149ExemptionRef,
            escrowStatus: (res.data.escrowStatus as any) || 'ESCROW_LOCKED',
            orderDate: new Date(res.data.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: (res.data.status as any) || 'ORDER_PLACED'
          };

          productStore.addPurchaseOrder(newPO);
          setIsSubmitting(false);
          setCompletedOrder(newPO);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend PO creation error, using local fallback:', err);
    }

    const poNumber = `GEM-GOM-2026-PO-${Math.floor(100000 + Math.random() * 900000)}`;
    const exemptionRef = `MH-STARTUP-GFR149-EXEMPT-${Date.now().toString().slice(-6)}`;

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now().toString().slice(-6)}`,
      orderNumber: poNumber,
      productId: targetProduct.id,
      productName: targetProduct.name,
      startupName: targetProduct.startupName,
      departmentName: departmentName,
      quantity: quantity,
      totalAmount: grandTotal,
      rule149ExemptionRef: exemptionRef,
      escrowStatus: 'ESCROW_LOCKED',
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ORDER_PLACED'
    };

    productStore.addPurchaseOrder(newPO);
    setIsSubmitting(false);
    setCompletedOrder(newPO);
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-slate-800 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/showcase"
            className="text-xs font-semibold text-slate-600 hover:text-blue-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Showcase
          </Link>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Statutory Work Order Award Protocol
          </span>
        </div>

        {/* Main Content */}
        {completedOrder ? (
          <div className="bg-white border border-gray-300 shadow-md rounded-sm p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded">
                Official State Work Order Placed Successfully
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
                Work Order Reference: {completedOrder.orderNumber}
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Issued to <strong>{completedOrder.startupName}</strong> under Maharashtra State Innovation Policy 2026.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xs max-w-lg mx-auto text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Exemption Authority:</span>
                <span className="font-mono font-bold text-blue-900">{completedOrder.rule149ExemptionRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Item Procured:</span>
                <span className="font-semibold text-slate-800 text-right">{completedOrder.productName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Consignee Quantity:</span>
                <span className="font-bold text-slate-800">{completedOrder.quantity} Units</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Escrow Payment Protection:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> State Escrow Locked (DBT)
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-slate-900">
                <span>Sanctioned Grand Total:</span>
                <span className="text-blue-950 font-mono">₹ {completedOrder.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/procurement/dashboard"
                className="btn-secondary text-xs uppercase tracking-wider py-2.5 px-4"
              >
                View in Procurement Dashboard
              </Link>
              <Link
                to="/showcase"
                className="btn-primary text-xs uppercase tracking-wider py-2.5 px-4"
              >
                Browse More Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c2340] via-[#15345c] to-[#0c2340] text-white p-6 rounded-t-sm shadow-md border-b-4 border-amber-500">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>GeM & Maharashtra State Innovation Procurement Gateway</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Direct Commercial Purchase Order Generation
              </h1>
              <p className="text-xs text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                Execute direct public procurement of validated startup innovations under GFR Rule 149 & 173(i) with automated escrow DBT payment milestones.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="bg-white border border-gray-300 p-6 sm:p-8 shadow-sm space-y-6 rounded-b-sm">
              
              {/* Product Specifications & Cost Breakdown */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={targetProduct.imageUrl}
                    alt={targetProduct.name}
                    className="w-20 h-20 object-contain rounded bg-white p-1 border border-slate-200 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                      {targetProduct.categoryName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{targetProduct.name}</h3>
                    <p className="text-xs text-slate-500">
                      OEM Startup: <strong>{targetProduct.startupName}</strong> • DPIIT: <strong className="font-mono">{targetProduct.dpiitReg}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500">Unit Price:</div>
                  <div className="text-base font-extrabold text-slate-900">
                    ₹ {targetProduct.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{targetProduct.discountPercentage}% State Rebate</div>
                </div>
              </div>

              {/* Order Quantity & Consignee */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-900" /> 1. Consignee Delivery Details & Quantity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label text-xs">
                      Purchase Order Quantity (Units) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={targetProduct.minOrderQty}
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field text-xs font-bold font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Min Consignee Limit: {targetProduct.minOrderQty} Units
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label text-xs">
                      Issuing Department / Autonomous Authority <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={departmentName}
                      onChange={(e) => setDepartmentName(e.target.value)}
                      className="input-field text-xs font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label text-xs">
                      Consignee Destination & Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryConsigneeAddress}
                      onChange={(e) => setDeliveryConsigneeAddress(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">
                      Authorized Officer Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={procurementOfficer}
                      onChange={(e) => setProcurementOfficer(e.target.value)}
                      className="input-field text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Invoice Summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-700" /> 2. Commercial Invoice & Escrow DBT Sanction
                </h3>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xs space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Subtotal ({quantity} Units @ ₹{targetProduct.price.toLocaleString('en-IN')}):</span>
                    <span className="font-mono font-semibold text-slate-900">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Applicable GST (18% Gov Tech / Hardware Rate):</span>
                    <span className="font-mono font-semibold text-slate-900">₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-extrabold text-slate-900">
                    <span>Sanctioned Grand Total (Inclusive of Taxes & Delivery):</span>
                    <span className="text-blue-950 font-mono">₹ {grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Statutory Affirmations */}
              <div className="bg-blue-50/60 border border-blue-200 p-4 space-y-3 rounded-xs text-xs">
                <div className="font-bold text-blue-950 uppercase tracking-wide flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-blue-900" /> Statutory Public Procurement Compliance Certifications
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="r149"
                    checked={agreeRule149}
                    onChange={(e) => setAgreeRule149(e.target.checked)}
                    className="w-4 h-4 text-blue-900 rounded mt-0.5"
                  />
                  <label htmlFor="r149" className="text-slate-700 leading-snug cursor-pointer">
                    <strong>GFR Rule 149 Exemption Invoked:</strong> The purchasing authority certifies that this procurement is initiated from a DPIIT-recognized startup under the Maharashtra IT & Innovation Policy 2026, granting full exemption from prior experience and prior turnover requirements.
                  </label>
                </div>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="escrow"
                    checked={agreeEscrowMilestone}
                    onChange={(e) => setAgreeEscrowMilestone(e.target.checked)}
                    className="w-4 h-4 text-blue-900 rounded mt-0.5"
                  />
                  <label htmlFor="escrow" className="text-slate-700 leading-snug cursor-pointer">
                    <strong>Milestone-Based Escrow Direct Benefit Transfer (DBT):</strong> Sanctioned funds will be locked in the government nodal escrow account and automatically disbursed upon successful delivery verification within 72 hours.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/showcase')}
                  className="btn-secondary text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeRule149 || !agreeEscrowMilestone}
                  className="btn-primary text-xs uppercase tracking-wider flex items-center justify-center gap-2 py-3 px-6"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isSubmitting ? 'Issuing Work Order...' : 'Authorize & Issue Work Order'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default IssuePurchaseOrder;
