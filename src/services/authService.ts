import api from './api';
import { jwtDecode } from 'jwt-decode';

// Base URL for authentication endpoints
const AUTH_BASE_URL = '/authMgtApi';

// JWT Payload interface
interface JWTPayload {
  sub: string;        // User email/username
  role: string;       // User role
  userId: string;     // User ID
  exp: number;        // Expiration
  iat: number;        // Issued at
}

// Types
export interface LoginRequest {
  username: string;  // Backend expects 'username' not 'email'
  password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface ValidateAccountRequest {
  activationKey: string;  // Backend expects 'activationKey'
  password?: string;      // Optional password for first-time setup
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

export interface UserGetResource {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  role: string;
  enabled: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Authentication Service
const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<{ token: string; user: any }> {
    const response = await api.post(`${AUTH_BASE_URL}/login`, credentials);
    const token = response.data.access_token;
    
    if (token) {
      // Store token first so subsequent API calls work
      localStorage.setItem('token', token);
      
      // Decode JWT to get basic info
      const decoded = jwtDecode<JWTPayload>(token);
      
      // Fetch full profile to get the correct UUID
      try {
        const profile = await this.getProfile();
        const user = {
          id: profile.id, // Use the UUID from profile
          email: profile.email,
          role: decoded.role,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      } catch (error) {
        // Fallback if profile fetch fails
        const user = {
          id: decoded.userId || decoded.sub,
          email: decoded.sub,
          role: decoded.role,
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      }
    }
    throw new Error('No token received');
  },

  // Register
  async register(data: RegisterRequest): Promise<void> {
    await api.post(`${AUTH_BASE_URL}/users/register`, data);
  },

  // Validate Account - Returns 204 No Content, user must login after
  async validateAccount(data: ValidateAccountRequest): Promise<void> {
    await api.post(`${AUTH_BASE_URL}/validate-account`, data);
    // Backend returns 204 No Content on success
    // User must login after account validation
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

  // Get All Users (Admin only)
  async getAllUsers(page: number = 0, size: number = 10): Promise<PageResponse<UserGetResource>> {
    const response = await api.get(`${AUTH_BASE_URL}/admin/users`, {
      params: { page, size }
    });
    return response.data;
  },

  // Create User As Admin (Admin only - can create DRIVER or CONTROLLER)
  async createUserAsAdmin(data: RegisterRequest): Promise<UserGetResource> {
    const response = await api.post(`${AUTH_BASE_URL}/admin/create`, data);
    return response.data;
  },

  // Toggle User Status (Admin only - enable/disable user)
  async toggleUserStatus(userId: string): Promise<UserGetResource> {
    const response = await api.patch(`${AUTH_BASE_URL}/admin/users/${userId}/toggle-status`);
    return response.data;
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
