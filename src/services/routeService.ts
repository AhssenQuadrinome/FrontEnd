import api from './api';

// Base URL for route endpoints
const ROUTE_BASE_URL = '/routeMgtApi';

// Station interface for selection
export interface StationOption {
  id: string;
  name: string;
  code: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Types matching backend exactly
export interface RouteStation {
  stationId: string;
  name: string;
  code: string;
  sequenceOrder: number;
}

export enum ServicePeriodType {
  DAILY = 'DAILY',
  WEEKDAY = 'WEEKDAY',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY',
  SPECIAL_DATE = 'SPECIAL_DATE',
  EVENT = 'EVENT'
}

export interface RouteConfig {
  ruleType: ServicePeriodType;
  frequencyMinutes: number;
  enabled: boolean;
  busCount: number;
  firstDeparture: string; // "HH:mm:ss"
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

export interface Route {
  id: string;
  number: string;
  name: string;
  description: string;
  active: boolean;
  startStation: string;
  endStation: string;
  distance: number;
  estimatedDuration: number; // in minutes
  price: number;
  config: RouteConfig;
  stations: RouteStation[];
}

export interface CreateRouteRequest {
  number: string;
  name: string;
  description: string;
  active: boolean;
  startStation: string;
  endStation: string;
  distance: number;
  estimatedDuration: number;
  price: number;
  config: {
    ruleType: ServicePeriodType;
    frequencyMinutes: number;
    enabled: boolean;
    busCount: number;
    firstDeparture: string;
    startDate: string;
    endDate: string;
  };
  stationIds: string[];
}

export interface UpdateRouteRequest {
  number?: string;
  name?: string;
  description?: string;
  active?: boolean;
  startStation?: string;
  endStation?: string;
  distance?: number;
  estimatedDuration?: number;
  price?: number;
  config?: {
    ruleType?: ServicePeriodType;
    frequencyMinutes?: number;
    enabled?: boolean;
    busCount?: number;
    firstDeparture?: string;
    startDate?: string;
    endDate?: string;
  };
  stationIds?: string[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Route Service
const routeService = {
  // Get All Routes (paginated)
  async getAllRoutes(page: number = 0, size: number = 10): Promise<PageResponse<Route>> {
    const response = await api.get(`${ROUTE_BASE_URL}/routes`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get Route by ID (includes stations)
  async getRouteById(routeId: string): Promise<Route> {
    const response = await api.get(`${ROUTE_BASE_URL}/routes/${routeId}`);
    return response.data;
  },

  // Create new route
  async createRoute(data: CreateRouteRequest): Promise<Route> {
    const response = await api.post(`${ROUTE_BASE_URL}/routes`, data);
    return response.data;
  },

  // Update route
  async updateRoute(routeId: string, data: UpdateRouteRequest): Promise<Route> {
    const response = await api.patch(`${ROUTE_BASE_URL}/routes/${routeId}`, data);
    return response.data;
  },

  // Get all stations for selection (using existing station service endpoint)
  async getAllStations(page: number = 0, size: number = 1000): Promise<PageResponse<StationOption>> {
    const response = await api.get(`${ROUTE_BASE_URL}/stations`, {
      params: { page, size }
    });
    return response.data;
  },
};

export default routeService;
