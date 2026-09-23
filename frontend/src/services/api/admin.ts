import api from './axios';

export interface AdminAuditLogDto {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  username: string;
  ipAddress?: string;
}

export interface AdminDashboardStatsDto {
  totalUsers: number;
  totalStartups: number;
  totalDepartments: number;
  activeChallenges: number;
  activePilots: number;
  pendingVerifications: number;
  systemHealth: string;
  recentAuditLogs: AdminAuditLogDto[];
}

export interface AdminUserDto {
  id: string;
  username: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  createdAt: string;
  roles: string[];
  departmentName?: string;
  startupCompanyName?: string;
}

export interface AdminDepartmentDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  userCount: number;
  challengeCount: number;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description: string;
}

export interface AdminStartupDto {
  id: string;
  userId: string;
  companyName: string;
  dpiitRecognitionNumber: string;
  pan: string;
  cinOrLlpin: string;
  productSolutionName: string;
  currentProductStage: string;
  userEmail: string;
  isVerified: boolean;
  applicationCount: number;
  createdAt: string;
}

export interface AdminSystemSettingDto {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
}

export interface UpdateSystemSettingDto {
  settingKey: string;
  settingValue: string;
  description?: string;
}

export const adminApi = {
  getDashboardStats: async (): Promise<AdminDashboardStatsDto> => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getUsers: async (search?: string, role?: string): Promise<AdminUserDto[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    const response = await api.get(`/api/admin/users?${params.toString()}`);
    return response.data;
  },

  toggleUserStatus: async (userId: string): Promise<{ success: boolean; message: string; isActive: boolean }> => {
    const response = await api.put(`/api/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getDepartments: async (): Promise<AdminDepartmentDto[]> => {
    const response = await api.get('/api/admin/departments');
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentDto): Promise<{ success: boolean; message: string; department: AdminDepartmentDto }> => {
    const response = await api.post('/api/admin/departments', data);
    return response.data;
  },

  toggleDepartmentStatus: async (departmentId: string): Promise<{ success: boolean; isActive: boolean }> => {
    const response = await api.put(`/api/admin/departments/${departmentId}/toggle-status`);
    return response.data;
  },

  getStartups: async (): Promise<AdminStartupDto[]> => {
    const response = await api.get('/api/admin/startups');
    return response.data;
  },

  toggleStartupVerification: async (startupId: string): Promise<{ success: boolean; message: string; isVerified: boolean }> => {
    const response = await api.put(`/api/admin/startups/${startupId}/verify`);
    return response.data;
  },

  getAuditLogs: async (limit: number = 50): Promise<AdminAuditLogDto[]> => {
    const response = await api.get(`/api/admin/audit-logs?limit=${limit}`);
    return response.data;
  },

  getSettings: async (): Promise<AdminSystemSettingDto[]> => {
    const response = await api.get('/api/admin/settings');
    return response.data;
  },

  updateSetting: async (data: UpdateSystemSettingDto): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/api/admin/settings', data);
    return response.data;
  }
};
