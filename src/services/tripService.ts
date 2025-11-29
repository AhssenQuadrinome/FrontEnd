import api from './api';

// Base URL for trip endpoints
const TRIP_BASE_URL = '/routeMgtApi/trips';

// Types
export interface StartTripRequest {
  routeId: string;
  busId?: string;
  startTime?: string;
}

export interface Trip {
  id: string;
  routeId: string;
  inspectorId?: string;
  busId?: string;
  driverId: string;
  startTime: string; // ISO DateTime string like "2025-11-28T18:46:11.142"
  endTime?: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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
    console.log('Raw backend response for startTrip:', response);
    console.log('Trip data from backend after start:', response.data);
    const trip = response.data;
    // Store trip ID in localStorage so we can fetch it later
    localStorage.setItem('currentTripId', trip.id);
    return trip;
  },

  // End current trip - Backend endpoint is /endTrip/{tripId}
  async endTrip(tripId: string, data?: { endTime?: string; notes?: string }): Promise<Trip> {
    const response = await api.patch(`${TRIP_BASE_URL}/endTrip/${tripId}`, data || {});
    const trip = response.data;
    // Remove trip ID from localStorage when trip ends
    localStorage.removeItem('currentTripId');
    return trip;
  },

  // Get trip by ID - Use backend endpoint GET /trips/{tripId}
  async getTripById(tripId: string): Promise<Trip> {
    const response = await api.get(`${TRIP_BASE_URL}/${tripId}`);
    console.log('Raw backend response for trip:', response);
    console.log('Trip data from backend:', response.data);
    return response.data;
  },

  // Get current active trip for driver
  // Backend doesn't have /current endpoint, so we store tripId in localStorage
  // and fetch using getTripById
  async getCurrentTrip(): Promise<Trip | null> {
    const tripId = localStorage.getItem('currentTripId');
    if (tripId) {
      try {
        return await this.getTripById(tripId);
      } catch (error: any) {
        // Trip might have been ended or deleted
        if (error.response?.status === 404) {
          localStorage.removeItem('currentTripId');
          return null;
        }
        throw error;
      }
    }
    return null;
  },

  // Get trip history for driver
  async getTripHistory(page: number = 0, size: number = 10): Promise<PageResponse<Trip>> {
    const response = await api.get(`${TRIP_BASE_URL}/history`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get all trips for the authenticated driver (no pagination)
  async getDriverTrips(): Promise<Trip[]> {
    const response = await api.get(`${TRIP_BASE_URL}/driver`);
    return response.data;
  },
};

export default tripService;
