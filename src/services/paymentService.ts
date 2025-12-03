import api from './api';

// Base URL for payment endpoints
const PAYMENT_BASE_URL = '/paymentMgtApi';

// Types
export interface PaymentProcessRequest {
  ticketRequestId?: string;
  subscriptionRequestId?: string;
}

export interface PaymentProcessResponse {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'REQUIRES_CONFIRMATION' | 'SUCCEEDED' | 'FAILED';
  stripePaymentIntentId: string;
  stripeChargeId?: string;
  ticketRequestId: string;
  ticketId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Service
const paymentService = {
  /**
   * Process Payment - Create or retrieve PaymentIntent for a ticket or subscription purchase
   * @param ticketRequestId - The ticket request ID from ticket purchase (optional)
   * @param subscriptionRequestId - The subscription request ID from subscription purchase (optional)
   * @returns Payment process response with clientSecret for Stripe confirmation
   */
  async processPayment(ticketRequestId?: string, subscriptionRequestId?: string): Promise<PaymentProcessResponse> {
    const response = await api.post(`${PAYMENT_BASE_URL}/payments/process`, {
      ticketRequestId,
      subscriptionRequestId,
    });
    return response.data;
  },

  /**
   * Get Payment by ID
   * @param paymentId - The payment ID
   * @returns Payment details
   */
  async getById(paymentId: string): Promise<Payment> {
    const response = await api.get(`${PAYMENT_BASE_URL}/payments/${paymentId}`);
    return response.data;
  },

  /**
   * Get Payment by Ticket Request ID
   * @param ticketRequestId - The ticket request ID
   * @returns Payment details
   */
  async getByTicketRequestId(ticketRequestId: string): Promise<Payment> {
    const response = await api.get(`${PAYMENT_BASE_URL}/payments/ticket-request/${ticketRequestId}`);
    return response.data;
  },

  /**
   * Get Payment History (for current user)
   * @param page - Page number (0-indexed)
   * @param size - Page size
   * @returns Paginated payment history
   */
  async getHistory(page: number = 0, size: number = 10): Promise<{
    content: Payment[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> {
    const response = await api.get(`${PAYMENT_BASE_URL}/payments/history`, {
      params: { page, size },
    });
    return response.data;
  },
};

export default paymentService;
