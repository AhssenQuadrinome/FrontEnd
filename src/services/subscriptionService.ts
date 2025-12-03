import api from './api';

// Base URL for subscription endpoints
const SUBSCRIPTION_BASE_URL = '/subscriptionMgtApi/subscription';

// Types
export interface SubscriptionGetResource {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  userId: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Subscription Service
const subscriptionService = {
  // Get current active subscription
  async getMySubscription(): Promise<SubscriptionGetResource | null> {
    try {
      const response = await api.get(`${SUBSCRIPTION_BASE_URL}/me`);
      return response.data;
    } catch (error: any) {
      // Return null if no active subscription (404)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Get subscription history (paginated)
  async getSubscriptionHistory(page: number = 0, size: number = 10): Promise<PageResponse<SubscriptionGetResource>> {
    const response = await api.get(`${SUBSCRIPTION_BASE_URL}/history`, {
      params: { page, size }
    });
    return response.data;
  },

  // Create/Purchase new subscription
  async purchaseSubscription(): Promise<any> {
    const response = await api.post(`${SUBSCRIPTION_BASE_URL}/create`);
    return response.data;
  },
};

export default subscriptionService;
