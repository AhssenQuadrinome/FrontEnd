import api from './api';

// Base URL for route endpoints
const ROUTE_BASE_URL = '/routeMgtApi';

// Types matching backend exactly
export interface Station {
  stationId: string;
  name: string;
  code: string;
  sequenceOrder: number;
  travelMinutesToNext: number | null;
}

export interface RouteConfig {
  frequency?: number;
  operatingHours?: string;
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
  estimatedDuration: number;
  price: number;
  config?: RouteConfig;
  stations?: Station[];
}

export interface RouteListResponse {
  content: Route[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Route Service
const routeService = {
  // Get All Routes (paginated)
  async getAllRoutes(page: number = 0, size: number = 10): Promise<RouteListResponse> {
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
};

export default routeService;
