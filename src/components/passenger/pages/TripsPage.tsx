import DashboardLayout from '../../DashboardLayout';
import { MapPin, Star } from 'lucide-react';
import { User, Trip, Notification } from '../../../types';

const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
};

const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: '1',
    routeName: 'Line 15 - City Center',
    busNumber: 'BUS-101',
    status: 'in-progress',
    departureTime: '14:00',
    arrivalTime: '14:45',
    currentLocation: { latitude: 36.7538, longitude: 3.0588 },
    passengerLoad: 45,
  },
  {
    id: '2',
    routeId: '2',
    routeName: 'Line 8 - University',
    busNumber: 'BUS-205',
    status: 'scheduled',
    departureTime: '15:30',
    arrivalTime: '16:15',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delay',
    title: 'Line 15 Delayed',
    message: 'Your bus is running 10 minutes late due to traffic.',
    sentAt: '2025-10-28T13:45:00',
    read: false,
    priority: 'high',
  },
];

export default function TripsPage() {
  return (
    <DashboardLayout user={mockUser} notificationCount={mockNotifications.filter((n) => !n.read).length}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Routes & Schedules</h3>
        <div className="space-y-4">
          {mockTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark">
              <div className="bg-gradient-to-r from-navy to-navy-light p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <h4 className="font-bold text-lg">{trip.routeName}</h4>
                  </div>
                  <button className="text-yellow-accent hover:text-yellow-400">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bus Number</p>
                    <p className="font-semibold text-navy">{trip.busNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Departure</p>
                    <p className="font-semibold text-navy">{trip.departureTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Arrival</p>
                    <p className="font-semibold text-navy">{trip.arrivalTime}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${trip.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : trip.status === 'scheduled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {trip.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                  </span>
                  {trip.passengerLoad && (
                    <span className="text-sm text-gray-600">
                      Capacity: <span className="font-semibold">{trip.passengerLoad}%</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
