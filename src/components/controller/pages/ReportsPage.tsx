import {
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
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

export default function ReportsPage() {
  const todayValidations = mockValidations.filter(
    (v) => new Date(v.validatedAt).toDateString() === new Date().toDateString()
  );
  const validCount = todayValidations.filter((v) => v.valid).length;
  const invalidCount = todayValidations.filter((v) => !v.valid).length;

  return (
    <DashboardLayout user={mockUser} notificationCount={1}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Validation Reports</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-navy">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-navy" />
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-navy mb-1">{todayValidations.length}</p>
            <p className="text-sm text-gray-600">Today's Validations</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-navy mb-1">{validCount}</p>
            <p className="text-sm text-gray-600">Valid Tickets</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-navy mb-1">{invalidCount}</p>
            <p className="text-sm text-gray-600">Invalid Tickets</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-coral">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-8 h-8 text-coral" />
            </div>
            <p className="text-3xl font-bold text-navy mb-1">
              {todayValidations.length > 0 
                ? ((validCount / todayValidations.length) * 100).toFixed(0)
                : 0}%
            </p>
            <p className="text-sm text-gray-600">Validation Rate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-xl font-bold text-navy mb-6">Validation Statistics</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-navy">Valid Tickets</span>
                <span className="text-sm font-semibold text-green-600">{validCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${todayValidations.length > 0 ? (validCount / todayValidations.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-navy">Invalid Tickets</span>
                <span className="text-sm font-semibold text-red-600">{invalidCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all"
                  style={{ width: `${todayValidations.length > 0 ? (invalidCount / todayValidations.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold text-navy">Anomalies & Reports</h4>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {invalidCount} Issues
            </span>
          </div>

          <div className="space-y-3">
            {mockValidations
              .filter((v) => !v.valid)
              .map((validation) => (
                <div key={validation.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-navy">{validation.passengerName}</p>
                        <span className="text-xs text-red-600 font-medium">
                          {new Date(validation.validatedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Expired/Invalid ticket detected: {validation.ticketId}
                      </p>
                      <button className="text-sm text-coral hover:text-coral-dark font-semibold">
                        Forward to Admin →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            
            {invalidCount === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-gray-600">No anomalies detected today</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
