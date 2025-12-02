import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import incidentService, { IncidentType, IncidentResponse } from '../../../services/incidentService';
import routeService, { Route } from '../../../services/routeService';
import { toast } from 'sonner';

export default function IncidentsPage() {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('DELAY');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [routeId, setRouteId] = useState('');
  const [busId, setBusId] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reportedIncidents, setReportedIncidents] = useState<IncidentResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [routeDetailsMap, setRouteDetailsMap] = useState<Map<string, Route>>(new Map());

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      authService.getProfile()
        .then(profile => {
          const roleMap: Record<string, "admin" | "driver" | "controller" | "passenger"> = {
            'ADMINISTRATOR': 'admin',
            'DRIVER': 'driver',
            'CONTROLLER': 'controller',
            'PASSENGER': 'passenger'
          };
          setCurrentUser({
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            role: roleMap[profile.role] || profile.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
          });
        })
        .catch(() => {
          setCurrentUser({
            id: user.id,
            name: "Driver User",
            email: user.email,
            role: 'driver'
          });
        });
    }

    // Clear old localStorage data (migration)
    localStorage.removeItem('driver_reported_incidents');

    // Fetch incidents from backend
    fetchIncidents();

    // Fetch all routes for the dropdown
    fetchRoutes();

  }, []);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoadingIncidents(true);
      const response = await incidentService.getAllIncidents(0, 100);
      
      // Get user profile to get the UUID
      const userProfile = await authService.getProfile();
      
      if (userProfile && userProfile.id) {
        // Filter to show only incidents reported by the current driver using UUID
        const driverIncidents = response.content.filter(
          incident => incident.driverId === userProfile.id
        );
        setReportedIncidents(driverIncidents);
      } else {
        setReportedIncidents(response.content);
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      toast.error('Failed to load incidents');
    } finally {
      setLoadingIncidents(false);
    }
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoadingRoutes(true);
      const response = await routeService.getAllRoutes(0, 100); // Get up to 100 routes
      setRoutes(response.content.filter(route => route.active)); // Only show active routes
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      toast.error('Failed to load routes');
    } finally {
      setLoadingRoutes(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success('Location acquired successfully', {
          description: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Failed to get location', {
          description: error.message || 'Please enable location services',
        });
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Fetch route details for all incidents when they change
  useEffect(() => {
    const fetchRouteDetails = async () => {
      const uniqueRouteIds = [...new Set(reportedIncidents.map(incident => incident.routeId).filter(Boolean))];
      const newRouteDetails = new Map(routeDetailsMap);
      
      for (const routeId of uniqueRouteIds) {
        if (!newRouteDetails.has(routeId)) {
          try {
            const route = await routeService.getRouteById(routeId);
            newRouteDetails.set(routeId, route);
          } catch (error) {
            console.error(`Failed to fetch route ${routeId}:`, error);
          }
        }
      }
      
      setRouteDetailsMap(newRouteDetails);
    };

    if (reportedIncidents.length > 0) {
      fetchRouteDetails();
    }
  }, [reportedIncidents]);

  const handleReportIncident = async () => {
    if (!incidentDescription.trim()) {
      toast.error('Please provide a description');
      return;
    }

    if (!routeId.trim()) {
      toast.error('Please select a route');
      return;
    }

    if (!busId.trim()) {
      toast.error('Please provide the bus ID');
      return;
    }

    if (!currentLocation) {
      toast.error('Location not available', {
        description: 'Please enable location access',
      });
      return;
    }

    try {
      setSubmitting(true);
      await incidentService.reportIncident({
        routeId: routeId,
        busId: busId,
        type: incidentType,
        description: incidentDescription,
        reportedAt: new Date().toISOString(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      // Refresh incidents list from backend
      await fetchIncidents();
      
      toast.success('Incident reported successfully!', {
        description: 'Your incident has been submitted to the system.',
      });
      
      setShowIncidentModal(false);
      setIncidentDescription('');
      setRouteId('');
      setBusId('');
      setCurrentLocation(null);
      setIncidentType('DELAY');
    } catch (error: any) {
      console.error('Failed to report incident:', error);
      toast.error('Failed to report incident', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
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

          {loadingIncidents ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {reportedIncidents.map((incident) => {
                const route = routeDetailsMap.get(incident.routeId);
              return (
                <div key={incident.id} className="bg-white rounded-xl shadow-md border border-cream-dark overflow-hidden">
                  <div
                    className={`p-4 ${
                      incident.type === 'INCIDENT'
                        ? 'bg-red-100 border-l-4 border-red-600'
                        : incident.type === 'DELAY'
                        ? 'bg-yellow-100 border-l-4 border-yellow-600'
                        : 'bg-blue-100 border-l-4 border-blue-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle
                          className={`w-6 h-6 ${
                            incident.type === 'INCIDENT'
                              ? 'text-red-600'
                              : incident.type === 'DELAY'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }`}
                        />
                        <div>
                          <h4 className="font-bold text-navy capitalize">{incident.type.toLowerCase()}</h4>
                          {route ? (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">{route.number}</span> - {route.name}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Route ID: {incident.routeId || 'Not specified'}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          incident.status === 'OPEN'
                            ? 'bg-red-200 text-red-800'
                            : incident.status === 'IN_PROGRESS'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {incident.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-navy mb-4">{incident.description}</p>
                    {route && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">Route Description:</span> {route.description}
                        </p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Reported:</span>{' '}
                        {new Date(incident.reportedAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Type:</span>{' '}
                        <span className="capitalize">{incident.type.toLowerCase()}</span>
                      </div>
                      {incident.busId && (
                        <div>
                          <span className="font-semibold">Bus:</span> {incident.busId}
                        </div>
                      )}
                      {incident.latitude && incident.longitude && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-semibold">Location:</span>{' '}
                          {incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

              {reportedIncidents.length === 0 && (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-navy mb-2">No Incidents Reported</h4>
                  <p className="text-gray-600">All trips are running smoothly today!</p>
                </div>
              )}
            </div>
          )}
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
                <label className="block text-sm font-medium text-navy mb-2">Route <span className="text-red-500">*</span></label>
                <select
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  disabled={loadingRoutes}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingRoutes ? 'Loading routes...' : 'Select a route...'}
                  </option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.number} - {route.name} ({route.description})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Bus ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  placeholder="Enter bus ID..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Current Location <span className="text-red-500">*</span></label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className={`w-full px-4 py-3 border-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    currentLocation
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-cream-dark hover:border-coral hover:bg-coral/5 text-navy'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <MapPin className={`w-5 h-5 ${currentLocation ? 'text-green-600' : 'text-coral'}`} />
                  {gettingLocation ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-coral"></div>
                      Getting location...
                    </>
                  ) : currentLocation ? (
                    <>
                      Location Acquired ✓
                      <span className="text-xs font-normal">
                        ({currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)})
                      </span>
                    </>
                  ) : (
                    'Get Current Location'
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Click to get your current GPS coordinates
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Incident Type <span className="text-red-500">*</span></label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="DELAY">Delay</option>
                  <option value="INCIDENT">Incident</option>
                  <option value="CANCELLATION">Cancellation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the incident in detail..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowIncidentModal(false);
                    setIncidentDescription('');
                    setRouteId('');
                    setBusId('');
                    setCurrentLocation(null);
                    setIncidentType('DELAY');
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportIncident}
                  disabled={!incidentDescription.trim() || !routeId.trim() || !busId.trim() || !currentLocation || submitting}
                  className="flex-1 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
