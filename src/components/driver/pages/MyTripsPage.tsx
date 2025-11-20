import { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Play,
  Square,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, Trip } from '../../../types';

const mockUser: User = {
  id: '2',
  name: 'Hiba EL OUERKHAOUI',
  email: 'hiba.elouerkaoui@mybus.com',
  role: 'driver',
};

const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: '1',
    routeName: 'Line 15 - City Center to North Station',
    busNumber: 'BUS-101',
    driverId: '2',
    driverName: 'Hiba El OUERKHAOUI',
    status: 'in-progress',
    departureTime: '14:00',
    arrivalTime: '14:45',
    currentLocation: { latitude: 36.7538, longitude: 3.0588 },
    passengerLoad: 45,
  },
  {
    id: '2',
    routeId: '1',
    routeName: 'Line 15 - North Station to City Center',
    busNumber: 'BUS-101',
    status: 'scheduled',
    departureTime: '15:30',
    arrivalTime: '16:15',
    passengerLoad: 0,
  },
  {
    id: '3',
    routeId: '1',
    routeName: 'Line 15 - City Center to North Station',
    busNumber: 'BUS-101',
    status: 'scheduled',
    departureTime: '17:00',
    arrivalTime: '17:45',
    passengerLoad: 0,
  },
];

export default function MyTripsPage() {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<'delay' | 'technical' | 'accident' | 'other'>('delay');
  const [incidentDescription, setIncidentDescription] = useState('');

  const handleStartTrip = (tripId: string) => {
    console.log('Starting trip:', tripId);
  };

  const handleEndTrip = (tripId: string) => {
    console.log('Ending trip:', tripId);
  };

  const handleReportIncident = () => {
    console.log('Reporting incident:', { type: incidentType, description: incidentDescription });
    setShowIncidentModal(false);
    setIncidentDescription('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'scheduled':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <>
      <DashboardLayout user={mockUser} notificationCount={2}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-2xl font-bold text-navy">My Trips & Schedule</h3>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              Report Incident
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8" />
                <span className="text-2xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-semibold">Today's Trips</h4>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8" />
                <span className="text-2xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-semibold">In Progress</h4>
            </div>

            <div className="bg-gradient-to-br from-coral to-coral-dark rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8" />
                <span className="text-2xl font-bold">45%</span>
              </div>
              <h4 className="text-lg font-semibold">Current Load</h4>
            </div>
          </div>

          <div className="space-y-4">
            {mockTrips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark">
                <div className="bg-gradient-to-r from-navy to-navy-light p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <h4 className="font-bold text-lg">{trip.routeName}</h4>
                        <p className="text-sm opacity-80">Bus: {trip.busNumber}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        trip.status
                      )}`}
                    >
                      {trip.status.toUpperCase().replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Departure</p>
                      <p className="font-semibold text-navy text-lg">{trip.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Arrival</p>
                      <p className="font-semibold text-navy text-lg">{trip.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-navy text-lg">45 min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Load</p>
                      <p className="font-semibold text-navy text-lg">{trip.passengerLoad}%</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-cream-dark">
                    {trip.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartTrip(trip.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Start Trip
                      </button>
                    )}
                    {trip.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => handleEndTrip(trip.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
                        >
                          <Square className="w-4 h-4" />
                          End Trip
                        </button>
                        <button
                          onClick={() => setShowIncidentModal(true)}
                          className="px-4 py-3 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white font-semibold rounded-lg transition-colors"
                        >
                          Report Issue
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>

      {/* Incident Report Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coral rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy">Report Incident</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Incident Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="delay">Delay</option>
                  <option value="technical">Technical Issue</option>
                  <option value="accident">Accident</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Description</label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the incident..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowIncidentModal(false);
                    setIncidentDescription('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportIncident}
                  disabled={!incidentDescription.trim()}
                  className="flex-1 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
