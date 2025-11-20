import api from './api';

// Base URL for ticket endpoints
const TICKET_BASE_URL = '/ticketMgtApi';

// Types
export interface TicketPurchaseRequest {
  route: {
    id: string;
    price: number;
  };
}

export interface Ticket {
  id: string;
  userId: string;
  routeId: string;
  purchaseDate: string;
  price: number;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
}

export interface TicketHistoryResponse {
  content: Ticket[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ValidationRequest {
  // Add validation fields if needed
}

export interface ValidationResponse {
  valid: boolean;
  ticket: Ticket;
  message?: string;
}

// Ticket Service
const ticketService = {
  // Purchase Ticket
  async purchase(data: TicketPurchaseRequest): Promise<Ticket> {
    const response = await api.post(`${TICKET_BASE_URL}/purchase`, data);
    return response.data;
  },

  // Get Ticket History (paginated)
  async getHistory(page: number = 0, size: number = 10): Promise<TicketHistoryResponse> {
    const response = await api.get(`${TICKET_BASE_URL}/history`, {
      params: { page, size },
    });
    return response.data;
  },

  // Get Ticket by ID
  async getById(ticketId: string): Promise<Ticket> {
    const response = await api.get(`${TICKET_BASE_URL}/${ticketId}`);
    return response.data;
  },

  // Get QR Code for Ticket
  async getQRCode(ticketId: string): Promise<string> {
    const response = await api.get(`${TICKET_BASE_URL}/${ticketId}/qrcode`, {
      responseType: 'blob',
    });
    // Convert blob to base64 data URL
    const blob = response.data;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  // Validate Ticket
  async validate(ticketId: string, data?: ValidationRequest): Promise<ValidationResponse> {
    const response = await api.post(`${TICKET_BASE_URL}/${ticketId}/validate`, data || {});
    return response.data;
  },

  // Inspect Ticket (for controllers)
  async inspect(ticketId: string): Promise<Ticket> {
    const response = await api.get(`${TICKET_BASE_URL}/${ticketId}/inspect`);
    return response.data;
  },

  // Get Ticket PDF
  async getPDF(ticketId: string): Promise<Blob> {
    const response = await api.get(`${TICKET_BASE_URL}/${ticketId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download PDF
  downloadPDF(ticketId: string): void {
    this.getPDF(ticketId).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  },
};

export default ticketService;
