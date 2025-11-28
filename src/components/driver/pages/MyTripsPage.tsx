import { useState, useEffect } from 'react';
import { Clock, MapPin, Bus, Play, StopCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import tripService, { Trip } from '../../../services/tripService';
import routeService, { Route as BackendRoute } from '../../../services/routeService';
import { toast } from 'sonner';
import { Button } from '../../ui/button';

export default function MyTripsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [routes, setRoutes] = useState<BackendRoute[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [currentTripRoute, setCurrentTripRoute] = useState<BackendRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingTrip, setStartingTrip] = useState(false);
  const [endingTrip, setEndingTrip] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    
    console.log('Current user from localStorage:', user);
    console.log('Token exists:', !!token);
    
    // Decode JWT to see exact role format
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('JWT Payload:', payload);
        console.log('JWT Role:', payload.role);
        console.log('JWT Authorities:', payload.authorities);
      } catch (e) {
        console.error('Failed to decode JWT:', e);
      }
    }
    
    if (user) {
      authService.getProfile()
        .then(profile => {
          console.log('Profile fetched:', profile);
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
        .catch((error) => {
          console.error('Failed to fetch profile:', error);
          setCurrentUser({
            id: user.id,
            name: "Driver User",
            email: user.email,
            role: 'driver'
          });
        });
    } else {
      console.warn('No user found in localStorage - redirecting to login may be needed');
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [routesResponse, tripData] = await Promise.all([
        routeService.getAllRoutes(0, 100),
        tripService.getCurrentTrip()
      ]);
      setRoutes(routesResponse.content.filter((r: BackendRoute) => r.active));
      console.log('Trip data received:', tripData);
      setCurrentTrip(tripData);
      
      // Fetch route details for the current trip
      if (tripData && tripData.routeId) {
        try {
          const routeData = await routeService.getRouteById(tripData.routeId);
          setCurrentTripRoute(routeData);
        } catch (err) {
          console.error('Failed to fetch route for current trip:', err);
        }
      } else {
        setCurrentTripRoute(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async (routeId: string) => {
    if (currentTrip) {
      toast.error('Cannot start trip', {
        description: 'You already have an active trip. Please end it first.',
      });
      return;
    }

    try {
      setStartingTrip(true);
      console.log('Starting trip for route:', routeId);
      const now = new Date().toISOString();
      await tripService.startTrip({ routeId, startTime: now });
      toast.success('Trip started successfully!');
      await fetchData();
    } catch (err: any) {
      console.error('Failed to start trip:', err);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      let errorMessage = 'Please try again';
      if (err.response?.status === 403) {
        errorMessage = 'Access denied. Make sure you are logged in as a DRIVER.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      toast.error('Failed to start trip', {
        description: errorMessage,
      });
    } finally {
      setStartingTrip(false);
    }
  };

  const handleEndTrip = async () => {
    if (!currentTrip) return;

    try {
      setEndingTrip(true);
      await tripService.endTrip(currentTrip.id);
      toast.success('Trip ended successfully!');
      await fetchData();
    } catch (err: any) {
      console.error('Failed to end trip:', err);
      toast.error('Failed to end trip', {
        description: err.response?.data?.message || 'Please try again',
      });
    } finally {
      setEndingTrip(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B392D] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading trips...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#181E4B]">My Trips</h3>

        {currentTrip && (
          <div className="bg-gradient-to-br from-[#9B392D] to-[#7d2e24] rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold mb-1">Active Trip</h4>
                <p className="text-white/90">Trip ID: {currentTrip.id}</p>
                <p className="text-white/80 text-sm">Route ID: {currentTrip.routeId}</p>
                {currentTripRoute && (
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {currentTripRoute.startStation} → {currentTripRoute.endStation}
                  </p>
                )}
              </div>
              <CheckCircle2 className="w-12 h-12 opacity-50" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70 mb-1">Started</p>
                <p className="text-sm font-semibold">
                  {currentTrip.startTime
                    ? new Date(currentTrip.startTime).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-white/70 mb-1">Status</p>
                <p className="text-sm font-semibold">{currentTrip.status.replace('_', ' ')}</p>
              </div>
              {currentTrip.busId && (
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-xs text-white/70 mb-1">Bus ID</p>
                  <p className="text-sm font-semibold">{currentTrip.busId}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleEndTrip}
                disabled={endingTrip}
                className="flex-1 bg-white text-[#9B392D] hover:bg-gray-100"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                {endingTrip ? 'Ending...' : 'End Trip'}
              </Button>
              <Button
                onClick={() => window.location.href = '/driver/validate'}
                className="flex-1 bg-white/20 border-2 border-white text-white hover:bg-white/30"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Validate Tickets
              </Button>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-lg font-bold text-[#181E4B] mb-4">Available Routes</h4>
          <div className="grid grid-cols-1 gap-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#9B392D] to-[#7d2e24] text-white font-bold rounded-lg px-3 py-2 text-lg">
                      {route.number}
                    </div>
                    <div>
                      <h5 className="font-bold text-[#181E4B] text-lg">{route.name}</h5>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {route.startStation} → {route.endStation}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleStartTrip(route.id)}
                    disabled={startingTrip || currentTrip !== null}
                    className="bg-gradient-to-r from-[#9B392D] to-[#7d2e24] hover:from-[#7d2e24] hover:to-[#5d1f1a] disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {startingTrip ? 'Starting...' : 'Start Trip'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <Clock className="w-4 h-4 text-[#9B392D] mb-1" />
                      <p className="text-xs text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">{route.estimatedDuration} min</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <MapPin className="w-4 h-4 text-[#9B392D] mb-1" />
                      <p className="text-xs text-gray-600">Distance</p>
                      <p className="font-semibold text-gray-900">{route.distance} km</p>
                    </div>
                    {/* <div className="bg-gray-50 rounded-lg p-3">
                      <Bus className="w-4 h-4 text-[#9B392D] mb-1" />
                      <p className="text-xs text-gray-600">Buses</p>
                      <p className="font-semibold text-gray-900">{route.config?.busCount || 0}</p>
                    </div> */}
                  </div>

                  {/* Stations List */}
                  {route.stations && route.stations.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[#9B392D]" />
                        <p className="text-xs font-medium text-gray-700">Route Stations ({route.stations.length})</p>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {route.stations.map((station, index) => (
                          <div key={station.stationId} className="flex items-center gap-2 flex-shrink-0">
                            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                              <p className="text-xs font-medium text-gray-900">{station.name}</p>
                              {index === 0 && <p className="text-xs text-green-600">Start</p>}
                              {index === route.stations!.length - 1 && <p className="text-xs text-red-600">End</p>}
                            </div>
                            {index < route.stations!.length - 1 && (
                              <div className="text-gray-400">→</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {routes.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No active routes available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
