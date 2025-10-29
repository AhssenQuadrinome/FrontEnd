import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Navigation,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Play,
  Square,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { User, Trip, Incident } from '../../types';

const mockUser: User = {
  id: '2',
  name: 'Karim Benali',
  email: 'karim.benali@mybus.com',
  role: 'driver',
};

const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: '1',
    routeName: 'Line 15 - City Center to North Station',
    busNumber: 'BUS-101',
    driverId: '2',
    driverName: 'Karim Benali',
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

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'delay',
    tripId: '1',
    routeName: 'Line 15',
    description: 'Heavy traffic on main boulevard',
    reportedBy: 'Karim Benali',
    reportedAt: '2025-10-28T13:45:00',
    status: 'open',
    severity: 'medium',
  },
];

type ViewType = 'trips' | 'geolocation' | 'incidents' | 'planning';

export default function DriverDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('trips');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sharingLocation, setSharingLocation] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<'delay' | 'technical' | 'accident' | 'other'>('delay');
  const [incidentDescription, setIncidentDescription] = useState('');

  const navigation = [
    { name: 'My Trips', icon: <Calendar />, active: currentView === 'trips', onClick: () => setCurrentView('trips') },
    { name: 'Geolocation', icon: <Navigation />, active: currentView === 'geolocation', onClick: () => setCurrentView('geolocation') },
    { name: 'Incidents', icon: <AlertTriangle />, active: currentView === 'incidents', onClick: () => setCurrentView('incidents') },
    { name: 'Planning', icon: <FileText />, active: currentView === 'planning', onClick: () => setCurrentView('planning') },
  ];

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
      <DashboardLayout
        user={mockUser}
        navigation={navigation}
        notificationCount={2}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {/* Trips View */}
        {currentView === 'trips' && (
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
        )}

        {/* Geolocation View */}
        {currentView === 'geolocation' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">Real-Time Geolocation</h3>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-bold text-navy mb-1">Location Sharing</h4>
                  <p className="text-sm text-gray-600">
                    Share your real-time position with the system
                  </p>
                </div>
                <button
                  onClick={() => setSharingLocation(!sharingLocation)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    sharingLocation ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      sharingLocation ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {sharingLocation && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Location Sharing Active</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Your position is being shared with the control center and passengers.
                    </p>
                  </div>

                  <div className="bg-cream rounded-xl p-6">
                    <h5 className="font-semibold text-navy mb-4">Current Position</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-mono font-semibold text-navy">36.7538° N</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-mono font-semibold text-navy">3.0588° E</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Speed:</span>
                        <span className="font-semibold text-navy">42 km/h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="font-semibold text-navy">Just now</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-navy text-white rounded-xl p-6">
                    <h5 className="font-semibold mb-3">Route Progress</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Next Station:</span>
                        <span className="font-semibold">Central Square</span>
                      </div>
                      <div className="w-full bg-navy-dark rounded-full h-3">
                        <div className="bg-coral h-3 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs opacity-80">
                        <span>65% Complete</span>
                        <span>ETA: 12 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Incidents View */}
        {currentView === 'incidents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-navy">Incident Reports</h3>
              <button
                onClick={() => setShowIncidentModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
              >
                <AlertTriangle className="w-5 h-5" />
                New Report
              </button>
            </div>

            <div className="space-y-4">
              {mockIncidents.map((incident) => (
                <div key={incident.id} className="bg-white rounded-xl shadow-md border border-cream-dark overflow-hidden">
                  <div
                    className={`p-4 ${
                      incident.severity === 'high'
                        ? 'bg-red-100 border-l-4 border-red-600'
                        : incident.severity === 'medium'
                        ? 'bg-yellow-100 border-l-4 border-yellow-600'
                        : 'bg-blue-100 border-l-4 border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`w-6 h-6 ${
                            incident.severity === 'high'
                              ? 'text-red-600'
                              : incident.severity === 'medium'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }`}
                        />
                        <div>
                          <h4 className="font-bold text-navy capitalize">{incident.type}</h4>
                          <p className="text-sm text-gray-600">{incident.routeName}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          incident.status === 'open'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-navy mb-4">{incident.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Reported:</span>{' '}
                        {new Date(incident.reportedAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Severity:</span>{' '}
                        <span className="capitalize">{incident.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {mockIncidents.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-navy mb-2">No Incidents Reported</h4>
                  <p className="text-gray-600">All trips are running smoothly today!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Planning View */}
        {currentView === 'planning' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">Personal Planning & History</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl shadow-lg p-6 text-white">
                <Calendar className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">24</p>
                <p className="text-sm opacity-90">Trips This Week</p>
              </div>

              <div className="bg-gradient-to-br from-coral to-coral-dark rounded-xl shadow-lg p-6 text-white">
                <Clock className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">96%</p>
                <p className="text-sm opacity-90">On-Time Rate</p>
              </div>

              <div className="bg-gradient-to-br from-burgundy to-burgundy-dark rounded-xl shadow-lg p-6 text-white">
                <CheckCircle className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">182</p>
                <p className="text-sm opacity-90">Total Trips</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-navy mb-6">Recent Trip History</h4>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center text-white font-bold">
                        {27 - i}
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Line 15 - City Center Route</p>
                        <p className="text-sm text-gray-600">October {27 - i}, 2025</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
