import api from './axios';

export interface ProcurementDashboardStats {
  validatedPilotsCount: number;
  pendingProcurementCount: number;
  activeContractsCount: number;
  totalProcurementValue: number;
  recentOrders: PurchaseOrder[];
  validatedPilots: ValidatedPilot[];
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  productName: string;
  itemDescription: string;
  startupName: string;
  departmentName: string;
  startupProfileId: string;
  departmentId: string;
  sandboxTrialId?: string;
  quantity: number;
  unitPrice: number;
  gstAmount: number;
  totalAmount: number;
  rule149ExemptionRef: string;
  deliveryConsigneeAddress: string;
  procurementOfficerName: string;
  escrowStatus: string;
  status: string;
  orderDate: string;
  milestoneNotes?: string;
}

export interface ValidatedPilot {
  trialId: string;
  trialReferenceNumber: string;
  title: string;
  departmentName: string;
  startupName: string;
  startupProfileId: string;
  departmentId: string;
  validationScore: number;
  testingEnvironment: string;
  location: string;
  maximumBudget: number;
  hasExistingPO: boolean;
}

export interface CreatePurchaseOrderPayload {
  sandboxTrialId?: string;
  startupProfileId: string;
  departmentId: string;
  productName: string;
  itemDescription?: string;
  quantity: number;
  unitPrice: number;
  deliveryConsigneeAddress: string;
  procurementOfficerName?: string;
}

export interface ExemptionCertificate {
  certificateNumber: string;
  orderNumber: string;
  companyName: string;
  dpiitNumber: string;
  departmentName: string;
  productName: string;
  totalAmount: number;
  legalBasis: string;
  issuedAt: string;
  officerName: string;
}

export const procurementApi = {
  getDashboard: () =>
    api.get<ProcurementDashboardStats>('/api/procurement/dashboard'),

  getOrders: (params?: { status?: string; search?: string; page?: number; pageSize?: number }) =>
    api.get<{ total: number; page: number; pageSize: number; orders: PurchaseOrder[] }>('/api/procurement/orders', { params }),

  getOrder: (id: string) =>
    api.get<PurchaseOrder>(`/api/procurement/orders/${id}`),

  createOrder: (data: CreatePurchaseOrderPayload) =>
    api.post<PurchaseOrder>('/api/procurement/orders', data),

  updateStatus: (id: string, status: string, milestoneNotes?: string) =>
    api.patch(`/api/procurement/orders/${id}/status`, { status, milestoneNotes }),

  getCertificate: (id: string) =>
    api.get<ExemptionCertificate>(`/api/procurement/orders/${id}/certificate`),

  getValidatedPilots: () =>
    api.get<ValidatedPilot[]>('/api/procurement/validated-pilots'),

  getStartups: (search?: string) =>
    api.get<{ id: string; companyName: string; dpiitRecognitionNumber: string; productSolutionName: string }[]>(
      '/api/procurement/startups', { params: { search } }
    ),

  getDepartments: () =>
    api.get<{ id: string; name: string; code: string }[]>('/api/procurement/departments'),
};
