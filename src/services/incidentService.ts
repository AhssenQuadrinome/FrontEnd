import api from './api';

const INCIDENT_BASE_URL = '/incidentMgtApi';

export type IncidentType = 'INCIDENT' | 'DELAY' | 'CANCELLATION';
export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface ReportIncidentRequest {
  routeId?: string;
  busId?: string;
  type: IncidentType;
  description: string;
  reportedAt?: string;
  latitude?: number;
  longitude?: number;
}

export interface IncidentResponse {
  id: string;
  driverId: string;
  routeId: string;
  busId: string;
  type: IncidentType;
  status: IncidentStatus;
  description: string;
  latitude?: number;
  longitude?: number;
  reportedAt: string;
  resolvedAt?: string;
}

export interface UpdateIncidentRequest {
  status?: IncidentStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

class IncidentService {
  async reportIncident(data: ReportIncidentRequest): Promise<IncidentResponse> {
    const response = await api.post(`${INCIDENT_BASE_URL}/incidents`, {
      ...data,
      reportedAt: data.reportedAt || new Date().toISOString(),
    });
    return response.data;
  }

  async getAllIncidents(page: number = 0, size: number = 10): Promise<PageResponse<IncidentResponse>> {
    const response = await api.get(`${INCIDENT_BASE_URL}/incidents`, {
      params: { page, size },
    });
    return response.data;
  }

  async getIncidentById(id: string): Promise<IncidentResponse> {
    const response = await api.get(`${INCIDENT_BASE_URL}/incidents/${id}`);
    return response.data;
  }

  async updateIncident(id: string, data: UpdateIncidentRequest): Promise<IncidentResponse> {
    const response = await api.patch(`${INCIDENT_BASE_URL}/incidents/${id}`, data);
    return response.data;
  }
}

export default new IncidentService();
