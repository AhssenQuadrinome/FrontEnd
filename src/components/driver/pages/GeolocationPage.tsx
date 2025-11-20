import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';

const mockUser: User = {
  id: '2',
  name: 'Hiba EL OUERKHAOUI',
  email: 'hiba.elouerkaoui@mybus.com',
  role: 'driver',
};

export default function GeolocationPage() {
  const [sharingLocation, setSharingLocation] = useState(true);

  return (
    <DashboardLayout user={mockUser} notificationCount={2}>
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
    </DashboardLayout>
  );
}
