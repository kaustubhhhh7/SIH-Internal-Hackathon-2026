import api from './axios';

export interface ChallengeListDto {
  id: string;
  challengeReferenceNumber: string;
  titleEnglish: string;
  titleMarathi: string;
  departmentName: string;
  sector: string;
  status: string;
  submissionClosingDate: string | null;
  pilotRequirement: boolean;
  applicationCount: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateChallengeDto {
  titleEnglish: string;
  titleMarathi: string;
  sector: string;
  geographicScope: string;
  targetBeneficiaries: string;
  problemStatementEnglish: string;
  problemStatementMarathi: string;
  backgroundEnglish: string;
  backgroundMarathi: string;
  currentSituation: string;
  desiredOutcomeEnglish: string;
  desiredOutcomeMarathi: string;
  expectedDeliverables: string;
  functionalRequirements: string;
  technicalRequirements: string;
  eligibilityRequirements: string;
  pilotRequirement: boolean;
  pilotDuration: string;
  dataRequirements: string;
  cybersecurityRequirements: string;
  intellectualPropertyRequirements: string;
  procurementExpectation: string;
  estimatedBudget: number | null;
  fundingType: string;
  publicationDate: string | null;
  submissionOpeningDate: string | null;
  submissionClosingDate: string | null;
  technologyCategoryIds: string[];
}

export interface ChallengeDetailsDto extends CreateChallengeDto {
  id: string;
  challengeReferenceNumber: string;
  departmentName: string;
  status: string;
  isSaved: boolean;
  hasApplied: boolean;
  applicationCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GovDashboardStats {
  activeChallenges: number;
  totalApplications: number;
  underEvaluation: number;
  activePilots: number;
  recentChallenges: ChallengeListDto[];
  departmentName: string;
}

export const govChallengeApi = {
  getGovDashboard: async () => {
    const response = await api.get<GovDashboardStats>('/api/gov/dashboard');
    return response.data;
  },

  getDepartmentChallenges: async (page = 1, pageSize = 20) => {
    const response = await api.get<PaginatedResponse<ChallengeListDto>>('/api/challenges/department', {
      params: { page, pageSize }
    });
    return response.data;
  },
  
  getChallenge: async (id: string) => {
    const response = await api.get<ChallengeDetailsDto>(`/api/challenges/${id}`);
    return response.data;
  },

  createChallenge: async (data: CreateChallengeDto) => {
    const response = await api.post<ChallengeDetailsDto>('/api/challenges', data);
    return response.data;
  },
  
  updateChallenge: async (id: string, data: CreateChallengeDto) => {
    const response = await api.put(`/api/challenges/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, action: string) => {
    const response = await api.post(`/api/challenges/${id}/status?action=${action}`);
    return response.data;
  }
};

export const startupChallengeApi = {
  getChallenges: async (params: { page?: number, pageSize?: number, search?: string, sector?: string, pilotRequired?: boolean }) => {
    const response = await api.get<PaginatedResponse<ChallengeListDto>>('/api/startup/challenges', { params });
    return response.data;
  },

  getChallenge: async (id: string) => {
    const response = await api.get<ChallengeDetailsDto>(`/api/startup/challenges/${id}`);
    return response.data;
  },

  saveChallenge: async (id: string) => {
    const response = await api.post(`/api/startup/challenges/${id}/save`);
    return response.data;
  },
  
  unsaveChallenge: async (id: string) => {
    const response = await api.delete(`/api/startup/challenges/${id}/save`);
    return response.data;
  },

  applyForChallenge: async (id: string) => {
    const response = await api.post<{ applicationId: string }>(`/api/startup/challenges/${id}/apply`);
    return response.data;
  }
};
