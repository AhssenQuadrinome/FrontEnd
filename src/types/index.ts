export type UserRole = 'passenger' | 'driver' | 'controller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Ticket {
  id: string;
  type: 'single' | 'subscription';
  status: 'active' | 'used' | 'expired';
  purchaseDate: string;
  validUntil: string;
  price: number;
  qrCode: string;
}

export interface Subscription {
  id: string;
  type: 'monthly' | 'annual';
  status: 'active' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
}

export interface Route {
  id: string;
  name: string;
  number: string;
  stations: Station[];
  active: boolean;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface Trip {
  id: string;
  routeId: string;
  routeName: string;
  busNumber: string;
  driverId?: string;
  driverName?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  departureTime: string;
  arrivalTime: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  passengerLoad?: number;
}

export interface Incident {
  id: string;
  type: 'delay' | 'technical' | 'accident' | 'other';
  tripId: string;
  routeName: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'open' | 'resolved';
  severity: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  type: 'delay' | 'cancellation' | 'service' | 'system';
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high';
}

export interface ValidationRecord {
  id: string;
  ticketId: string;
  passengerId: string;
  passengerName: string;
  controllerId: string;
  tripId: string;
  validatedAt: string;
  valid: boolean;
}
