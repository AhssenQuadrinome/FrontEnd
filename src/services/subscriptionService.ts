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

  // Inspect / validate subscription for a trip (for controllers).
  // NOTE: backend must expose an endpoint that controllers can call. We assume
  // a path like /subscriptionMgtApi/subscription/{subscriptionId}/inspect?tripId=...
  // If your backend exposes a different internal path (e.g. /internal/...), update the URL here.
  async inspect(subscriptionId: string, tripId: string): Promise<{ valid: boolean; message: string }>{
    try {
      const resp = await api.get(`${SUBSCRIPTION_BASE_URL}/${subscriptionId}/inspect`, { params: { tripId } });
      return { valid: true, message: resp.data || 'Subscription is valid for this trip' };
    } catch (err: any) {
      let message = 'Subscription inspection failed';
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        if (status === 404) message = 'Subscription not found';
        else if (status === 403) message = typeof data === 'string' ? data : 'Subscription not valid for this trip';
        else message = typeof data === 'string' ? data : (data?.message || message);
      } else if (err.request) {
        message = 'Cannot connect to subscription service';
      }
      return { valid: false, message };
    }
  }
};

export default subscriptionService;
