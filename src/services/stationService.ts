import api from './api';

// Base URL for route management endpoints
const ROUTE_BASE_URL = '/routeMgtApi';

// Types
export interface Station {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
  active?: boolean;
}

export interface CreateStationRequest {
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateStationRequest {
  name?: string;
  code?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  active?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Station Service
const stationService = {
  // Get all stations with pagination
  async getAllStations(page: number = 0, size: number = 10): Promise<PageResponse<Station>> {
    const response = await api.get(`${ROUTE_BASE_URL}/stations`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get station by ID
  async getStationById(stationId: string): Promise<Station> {
    const response = await api.get(`${ROUTE_BASE_URL}/stations/${stationId}`);
    return response.data;
  },

  // Create new station
  async createStation(data: CreateStationRequest): Promise<Station> {
    const response = await api.post(`${ROUTE_BASE_URL}/stations`, data);
    return response.data;
  },

  // Update station
  async updateStation(stationId: string, data: UpdateStationRequest): Promise<Station> {
    const response = await api.patch(`${ROUTE_BASE_URL}/stations/${stationId}`, data);
    return response.data;
  },
};

export default stationService;
