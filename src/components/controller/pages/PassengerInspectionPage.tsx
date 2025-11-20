import { AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, ValidationRecord } from '../../../types';

const mockUser: User = {
  id: '3',
  name: 'Moon flower',
  email: 'moon.flower@mybus.com',
  role: 'controller',
};

const mockValidations: ValidationRecord[] = [
  {
    id: '1',
    ticketId: 'T000123',
    passengerId: 'P001',
    passengerName: 'Ahmed Hassan',
    controllerId: '3',
    tripId: 'TR001',
    validatedAt: '2025-10-28T14:23:00',
    valid: true,
  },
  {
    id: '2',
    ticketId: 'T000124',
    passengerId: 'P002',
    passengerName: 'Sarah Mahmoud',
    controllerId: '3',
    tripId: 'TR001',
    validatedAt: '2025-10-28T14:25:00',
    valid: true,
  },
  {
    id: '3',
    ticketId: 'T000089',
    passengerId: 'P003',
    passengerName: 'Mohamed Ali',
    controllerId: '3',
    tripId: 'TR001',
    validatedAt: '2025-10-28T14:28:00',
    valid: false,
  },
];

export default function PassengerInspectionPage() {
  return (
    <DashboardLayout user={mockUser} notificationCount={1}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Passenger Inspection</h3>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy mb-2">Search Passenger</label>
            <input
              type="text"
              placeholder="Enter ticket ID or passenger name..."
              className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
        </div>

        <div className="space-y-4">
          {mockValidations.map((validation) => (
            <div key={validation.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark">
              <div className="bg-gradient-to-r from-navy to-navy-light p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center font-bold text-lg">
                      {validation.passengerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{validation.passengerName}</h4>
                      <p className="text-sm opacity-80">ID: {validation.passengerId}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      validation.valid
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                  >
                    {validation.valid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Ticket ID</p>
                    <p className="font-semibold text-navy">{validation.ticketId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Trip ID</p>
                    <p className="font-semibold text-navy">{validation.tripId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Validated At</p>
                    <p className="font-semibold text-navy">
                      {new Date(validation.validatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p className={`font-semibold ${validation.valid ? 'text-green-600' : 'text-red-600'}`}>
                      {validation.valid ? 'Active Ticket' : 'Expired/Invalid'}
                    </p>
                  </div>
                </div>

                {!validation.valid && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    Report to Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
