import api from './api';

// Base URL for authentication endpoints
const AUTH_BASE_URL = '/authMgtApi';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: string;
}

export interface ValidateAccountRequest {
  email: string;
  code: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  role: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Authentication Service
const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post(`${AUTH_BASE_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register
  async register(data: RegisterRequest): Promise<void> {
    await api.post(`${AUTH_BASE_URL}/users/register`, data);
  },

  // Validate Account
  async validateAccount(data: ValidateAccountRequest): Promise<LoginResponse> {
    const response = await api.post(`${AUTH_BASE_URL}/validate-account`, data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get Profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get(`${AUTH_BASE_URL}/users/profile`);
    return response.data;
  },

  // Update Profile
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.patch(`${AUTH_BASE_URL}/users/profile`, data);
    return response.data;
  },

  // Change Password
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.patch(`${AUTH_BASE_URL}/users/change-password`, data);
  },

  // Forgot Password
  async forgotPassword(email: string): Promise<void> {
    await api.post(`${AUTH_BASE_URL}/users/forgot-password`, { email });
  },

  // Reset Password
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api.post(`${AUTH_BASE_URL}/users/reset-password`, {
      email,
      code,
      newPassword,
    });
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post(`${AUTH_BASE_URL}/logout`);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

export default authService;
