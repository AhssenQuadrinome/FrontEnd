import api from './api';

export interface TicketStats {
  count: number;
  growthPercentage: number;
  timestamp: string;
}

export interface RevenueStats {
  revenue: number;
  currency: string;
  growthPercentage: number;
  timestamp: string;
}

export interface TransactionStats {
  totalTransactions: number;
  avgDailyRevenue: number;
  timestamp: string;
}

export interface RevenueTypeItem {
  revenue: number;
  percentage: number;
  label: string;
}

export interface RevenueByType {
  singleTickets: RevenueTypeItem;
  monthlySubscriptions: RevenueTypeItem;
  annualSubscriptions: RevenueTypeItem;
  totalRevenue: number;
  timestamp: string;
}

class AdminStatsService {
  async getTicketsSoldToday(): Promise<TicketStats> {
    const response = await api.get('/ticketMgtApi/admin/stats/tickets-sold-today');
    return response.data;
  }

  async getRevenueToday(): Promise<RevenueStats> {
    const response = await api.get('/ticketMgtApi/admin/stats/revenue-today');
    return response.data;
  }

  async getTotalTransactions(): Promise<TransactionStats> {
    const response = await api.get('/ticketMgtApi/admin/stats/total-transactions');
    return response.data;
  }

  async getRevenueByType(): Promise<RevenueByType> {
    const response = await api.get('/ticketMgtApi/admin/stats/revenue-by-type');
    return response.data;
  }

  async getActiveSubscriptionsCount(): Promise<{ count: number; status: string }> {
    const response = await api.get('/subscriptionMgtApi/subscription/stats/active-count');
    return response.data;
  }

  async getSubscriptionRevenueToday(): Promise<{ revenue: number; currency: string; count: number }> {
    const response = await api.get('/subscriptionMgtApi/subscription/stats/revenue-today');
    return response.data;
  }

  async getTotalSubscriptionRevenue(): Promise<{ 
    totalRevenue: number; 
    currency: string; 
    totalCount: number;
    revenueByPlan: Record<string, number>;
    countByPlan: Record<string, number>;
  }> {
    const response = await api.get('/subscriptionMgtApi/subscription/stats/total-revenue');
    return response.data;
  }
}

export default new AdminStatsService();
