import api from './axios';

export interface RegisterStartupPayload {
  companyName: string;
  username: string;          // will use email as username
  dpiitRecognitionNumber: string;
  pan: string;
  authorisedPersonName: string;
  mobileNumber: string;
  email: string;
  password: string;
  otp: string;               // backend requires it; we send empty string for now
  // Extended fields stored in StartupProfile
  category?: string;
  productSolutionName?: string;
  description?: string;
  problemSolved?: string;
}

export interface LoginPayload {
  emailOrUsername: string;
  password: string;
}

export const registerStartup = async (payload: RegisterStartupPayload) => {
  const response = await api.post('/api/auth/register/startup', payload);
  return response.data;
};

export const login = async (payload: LoginPayload) => {
  const response = await api.post('/api/auth/login', payload);
  return response.data;
};
