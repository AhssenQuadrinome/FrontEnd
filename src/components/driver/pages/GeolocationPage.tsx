import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import { toast } from 'sonner';

interface DriverLocation {
  driverId: string;
  driverName: string;
  driverEmail: string;
  latitude: number;
  longitude: number;
  busNumber?: string;
  speed: number;
  timestamp: string;
  isActive: boolean;
}

export default function GeolocationPage() {
  const [sharingLocation, setSharingLocation] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [busNumber, setBusNumber] = useState('');
  const [speed, setSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [, setUpdateTrigger] = useState(0);

  // Fetch current user
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
          const userProfile = {
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            role: roleMap[profile.role] || profile.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
          };
          setCurrentUser(userProfile);

          // Check if location sharing was previously enabled and auto-restart
          const savedLocation = localStorage.getItem(`driver_location_${profile.id}`);
          if (savedLocation) {
            try {
              const parsed: DriverLocation = JSON.parse(savedLocation);
              if (parsed.isActive) {
                setBusNumber(parsed.busNumber || '');
                // Auto-restart location tracking
                setTimeout(() => {
                  startLocationSharingInternal(parsed.busNumber || '');
                }, 500);
              }
            } catch (e) {
              console.error('Error parsing saved location:', e);
            }
          }
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
  }, []);

  // Internal function to start location sharing (can be called with or without bus number)
  const startLocationSharingInternal = (busNum: string, showToast = true) => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      if (showToast) toast.error('Geolocation not supported');
      return;
    }

    setError(null);
    if (showToast) toast.loading('Activating location sharing...');

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, speed: gpsSpeed } = position.coords;
        const now = new Date();
        
        setCurrentLocation({ lat: latitude, lng: longitude });
        setSpeed(gpsSpeed ? Math.round(gpsSpeed * 3.6) : 0); // Convert m/s to km/h
        setLastUpdate(now);

        // Save to localStorage
        if (currentUser) {
          const locationData: DriverLocation = {
            driverId: currentUser.id,
            driverName: currentUser.name,
            driverEmail: currentUser.email,
            latitude,
            longitude,
            busNumber: busNum || undefined,
            speed: gpsSpeed ? Math.round(gpsSpeed * 3.6) : 0,
            timestamp: now.toISOString(),
            isActive: true,
          };

          localStorage.setItem(`driver_location_${currentUser.id}`, JSON.stringify(locationData));
        }

        if (showToast) {
          toast.dismiss();
          toast.success('Location sharing activated');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(error.message);
        if (showToast) {
          toast.dismiss();
          toast.error(`Failed to get location: ${error.message}`);
        }
        setSharingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setSharingLocation(true);
  };

  // Start watching location (public function for button)
  const startLocationSharing = () => {
    startLocationSharingInternal(busNumber, true);
  };

  // Stop watching location
  const stopLocationSharing = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }

    // Update localStorage to mark as inactive
    if (currentUser) {
      const savedLocation = localStorage.getItem(`driver_location_${currentUser.id}`);
      if (savedLocation) {
        try {
          const parsed: DriverLocation = JSON.parse(savedLocation);
          parsed.isActive = false;
          localStorage.setItem(`driver_location_${currentUser.id}`, JSON.stringify(parsed));
        } catch (e) {
          console.error('Error updating location:', e);
        }
      }
    }

    setSharingLocation(false);
    setCurrentLocation(null);
    setSpeed(0);
    toast.info('Location sharing stopped');
  };

  // Handle toggle
  const handleToggle = () => {
    if (sharingLocation) {
      stopLocationSharing();
    } else {
      startLocationSharing();
    }
  };

  // Force re-render every second to update "last update" text
  useEffect(() => {
    if (!sharingLocation || !lastUpdate) return;

    const interval = setInterval(() => {
      // Trigger re-render to update the relative time display
      setUpdateTrigger(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [sharingLocation, lastUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Format last update time
  const getLastUpdateText = () => {
    if (!lastUpdate) return 'Getting location...';
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    
    if (diff < 5) return 'Just now';
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return lastUpdate.toLocaleTimeString();
  };

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
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
              onClick={handleToggle}
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

          {/* Bus Number Input (Optional) */}
          {!sharingLocation && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Number (Optional)
              </label>
              <input
                type="text"
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                placeholder="e.g., BUS-101"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Error: {error}</span>
              </div>
            </div>
          )}

          {sharingLocation && currentLocation && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Location Sharing Active</span>
                </div>
                <p className="text-sm text-green-600">
                  Your position is being shared with the control center in real-time.
                </p>
              </div>

              <div className="bg-cream rounded-xl p-6">
                <h5 className="font-semibold text-navy mb-4">Current Position</h5>
                <div className="space-y-3">
                  {busNumber && (
                    <div className="flex justify-between pb-3 border-b border-gray-200">
                      <span className="text-gray-600">Bus Number:</span>
                      <span className="font-semibold text-navy">{busNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono font-semibold text-navy">{currentLocation.lat.toFixed(6)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono font-semibold text-navy">{currentLocation.lng.toFixed(6)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-semibold text-navy">{speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-semibold text-navy">{getLastUpdateText()}</span>
                  </div>
                  {lastUpdate && (
                    <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Exact Time:</span>
                      <span className="font-mono text-navy">{lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#A54033] text-white rounded-xl p-6">
                <h5 className="font-semibold mb-3">Driver Information</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Name:</span>
                    <span className="font-semibold">{currentUser?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-90">Email:</span>
                    <span className="font-semibold">{currentUser?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Active & Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {sharingLocation && !currentLocation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-semibold">Getting your location...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
