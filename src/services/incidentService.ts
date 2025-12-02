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

class IncidentService {
  async reportIncident(data: ReportIncidentRequest): Promise<IncidentResponse> {
    const response = await api.post(`${INCIDENT_BASE_URL}/incidents`, {
      ...data,
      reportedAt: data.reportedAt || new Date().toISOString(),
    });
    return response.data;
  }
}

export default new IncidentService();
