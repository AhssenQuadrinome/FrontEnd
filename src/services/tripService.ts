import api from './api';

// Base URL for trip endpoints
const TRIP_BASE_URL = '/routeMgtApi/trips';

// Types
export interface StartTripRequest {
  routeId: string;
  busId?: string;
}

export interface Trip {
  id: string;
  routeId: string;
  routeName?: string;
  routeNumber?: string;
  driverId: string;
  driverName?: string;
  busId?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  startStation?: string;
  endStation?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Trip Service
const tripService = {
  // Start a new trip
  async startTrip(data: StartTripRequest): Promise<Trip> {
    const response = await api.post(`${TRIP_BASE_URL}/startTrip`, data);
    return response.data;
  },

  // End current trip
  async endTrip(tripId: string): Promise<Trip> {
    const response = await api.post(`${TRIP_BASE_URL}/${tripId}/end`);
    return response.data;
  },

  // Get current active trip for driver
  async getCurrentTrip(): Promise<Trip | null> {
    try {
      const response = await api.get(`${TRIP_BASE_URL}/current`);
      return response.data;
    } catch (error: any) {
      // Return null if no trip found (404) or access denied for this endpoint (403)
      // 403 might mean driver has no active trip and endpoint requires one
      if (error.response?.status === 404 || error.response?.status === 403) {
        return null;
      }
      throw error;
    }
  },

  // Get trip by ID
  async getTripById(tripId: string): Promise<Trip> {
    const response = await api.get(`${TRIP_BASE_URL}/${tripId}`);
    return response.data;
  },

  // Get trip history for driver
  async getTripHistory(page: number = 0, size: number = 10): Promise<PageResponse<Trip>> {
    const response = await api.get(`${TRIP_BASE_URL}/history`, {
      params: { page, size }
    });
    return response.data;
  },
};

export default tripService;
