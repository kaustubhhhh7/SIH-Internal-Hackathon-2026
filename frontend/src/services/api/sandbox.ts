import api from './axios';

export interface SandboxTrialSummary {
  id: string;
  trialReferenceNumber: string;
  title: string;
  departmentName: string;
  startupName: string;
  productSolutionName: string;
  challengeTitle?: string;
  testingEnvironment: string;
  location: string;
  durationDays: number;
  maximumBudget: number;
  status: string;
  startDate?: string;
  endDate?: string;
  overallKPIProgress: number;
  validatorName?: string;
  createdAt: string;
}

export interface KPIMeasurement {
  id: string;
  value: number;
  measuredAt: string;
  measuredByName: string;
  notes: string;
  evidenceDocumentUrl?: string;
}

export interface SandboxTrialKPI {
  id: string;
  name: string;
  description: string;
  unit: string;
  baselineValue: number;
  targetValue: number;
  latestValue: number;
  achievementPercentage: number;
  measurementMethod: string;
  measurements: KPIMeasurement[];
}

export interface TrialMilestone {
  id: string;
  name: string;
  percentage: number;
  allocatedAmount: number;
  dueDate?: string;
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  evidenceSummary: string;
  remarks: string;
  approvedAt?: string;
}

export interface TrialDocument {
  id: string;
  title: string;
  documentType: string;
  fileUrl: string;
  notes: string;
  createdAt: string;
}

export interface TrialStatusHistory {
  id: string;
  previousStatus: string;
  newStatus: string;
  changedByName: string;
  changedAt: string;
  reason: string;
}

export interface SandboxTrialDetails extends SandboxTrialSummary {
  objective: string;
  expectedOutcomes: string;
  riskMitigationPlan: string;
  startupProfileId: string;
  departmentId: string;
  challengeId?: string;
  challengeApplicationId?: string;
  validatorUserId?: string;
  createdBy: string;
  approvedAt?: string;
  completedAt?: string;
  kpis: SandboxTrialKPI[];
  milestones: TrialMilestone[];
  documents: TrialDocument[];
  statusHistory: TrialStatusHistory[];
}

export interface CreateSandboxTrialPayload {
  startupProfileId: string;
  challengeId?: string;
  challengeApplicationId?: string;
  title: string;
  testingEnvironment: string;
  location: string;
  objective: string;
  durationDays: number;
  maximumBudget: number;
  expectedOutcomes: string;
  riskMitigationPlan: string;
  validatorUserId?: string;
  kpis: {
    name: string;
    description: string;
    unit: string;
    baselineValue: number;
    targetValue: number;
    measurementMethod: string;
  }[];
  milestones?: {
    name: string;
    percentage: number;
    dueDate?: string;
  }[];
}

export const sandboxApi = {
  getTrials: async (status?: string, search?: string) => {
    const response = await api.get<SandboxTrialSummary[]>('/api/gov/sandbox-trials', {
      params: { status, search }
    });
    return response.data;
  },

  getTrialDetails: async (id: string) => {
    const response = await api.get<SandboxTrialDetails>(`/api/gov/sandbox-trials/${id}`);
    return response.data;
  },

  getFormHelpers: async () => {
    const response = await api.get<{
      startups: { id: string; companyName: string; dpiitRecognitionNumber: string; productSolutionName: string; currentProductStage: string }[];
      challenges: { id: string; challengeReferenceNumber: string; titleEnglish: string; sector: string; estimatedBudget: number }[];
      validators: { id: string; username: string; email: string }[];
      department: { id: string; name: string } | null;
    }>('/api/gov/sandbox-trials/helpers');
    return response.data;
  },

  createTrial: async (payload: CreateSandboxTrialPayload) => {
    const response = await api.post<SandboxTrialDetails>('/api/gov/sandbox-trials', payload);
    return response.data;
  },

  updateStatus: async (id: string, action: string, reason?: string) => {
    const response = await api.post(`/api/gov/sandbox-trials/${id}/status`, { action, reason });
    return response.data;
  },

  assignValidator: async (id: string, validatorUserId: string) => {
    const response = await api.post(`/api/gov/sandbox-trials/${id}/assign-validator`, { validatorUserId });
    return response.data;
  },

  recordMeasurement: async (trialId: string, kpiId: string, payload: { value: number; notes: string; evidenceDocumentUrl?: string }) => {
    const response = await api.post(`/api/gov/sandbox-trials/${trialId}/kpis/${kpiId}/measurements`, payload);
    return response.data;
  },

  submitMilestone: async (trialId: string, milestoneId: string, evidenceSummary: string) => {
    const response = await api.post(`/api/gov/sandbox-trials/${trialId}/milestones/${milestoneId}/submit`, { evidenceSummary });
    return response.data;
  },

  approveMilestone: async (trialId: string, milestoneId: string, remarks: string) => {
    const response = await api.post(`/api/gov/sandbox-trials/${trialId}/milestones/${milestoneId}/approve`, { remarks });
    return response.data;
  }
};
