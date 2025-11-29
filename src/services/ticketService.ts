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

export interface TicketValidation {
  id: string;
  ticketId: string;
  tripId: string;
  validatedAt: string;
  ticket: Ticket;
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
  async validate(ticketId: string, tripId: string): Promise<ValidationResponse> {
    try {
      const response = await api.post(`${TICKET_BASE_URL}/${ticketId}/validate`, null, {
        params: { tripId }
      });
      // Backend returns a string message, convert to ValidationResponse format
      return {
        valid: true,
        ticket: {} as Ticket, // Backend doesn't return ticket in success response
        message: response.data || 'Ticket validated successfully'
      };
    } catch (error: any) {
      // Handle different error types with specific messages
      let errorMessage = 'Ticket validation failed';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          errorMessage = 'Ticket not found or not valid for this route';
        } else if (status === 400) {
          errorMessage = typeof data === 'string' ? data : (data?.message || 'Invalid ticket or route mismatch');
        } else if (status === 410) {
          errorMessage = 'Ticket has already been used';
        } else if (status === 403) {
          errorMessage = 'Ticket has expired';
        } else {
          errorMessage = typeof data === 'string' ? data : (data?.message || errorMessage);
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to validation service';
      }
      
      return {
        valid: false,
        ticket: {} as Ticket,
        message: errorMessage
      };
    }
  },

  // Inspect Ticket (for controllers)
  async inspect(ticketId: string, tripId: string): Promise<{
    valid: boolean;
    message: string;
    ticket?: Ticket;
  }> {
    try {
      const response = await api.get(`${TICKET_BASE_URL}/${ticketId}/inspect`, {
        params: { tripId }
      });
      return {
        valid: true,
        message: response.data || 'Ticket inspection successful',
        ticket: {} as Ticket // Backend may return ticket details
      };
    } catch (error: any) {
      let errorMessage = 'Ticket inspection failed';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          errorMessage = 'Ticket not found or not valid for this route';
        } else if (status === 400) {
          errorMessage = typeof data === 'string' ? data : (data?.message || 'Invalid ticket or route mismatch');
        } else if (status === 410) {
          errorMessage = 'Ticket has already been used';
        } else if (status === 403) {
          errorMessage = 'Ticket has expired';
        } else {
          errorMessage = typeof data === 'string' ? data : (data?.message || errorMessage);
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to inspection service';
      }
      
      return {
        valid: false,
        message: errorMessage
      };
    }
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

  // Get all validations for a specific trip
  async getValidationsByTrip(tripId: string): Promise<TicketValidation[]> {
    const response = await api.get(`${TICKET_BASE_URL}/validations/trip/${tripId}`);
    return response.data;
  },

  // Get all validations for the authenticated driver across all their trips
  async getValidationsByDriver(): Promise<TicketValidation[]> {
    const response = await api.get(`${TICKET_BASE_URL}/validations/driver`);
    return response.data;
  },
};

export default ticketService;
