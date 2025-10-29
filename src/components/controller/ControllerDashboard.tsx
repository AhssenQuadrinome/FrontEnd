import { useState } from 'react';
import {
  QrCode,
  CheckCircle,
  XCircle,
  User as UserIcon,
  Ticket,
  BarChart3,
  AlertTriangle,
  Scan,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { User, ValidationRecord } from '../../types';

const mockUser: User = {
  id: '3',
  name: 'Fatima Zohra',
  email: 'fatima.zohra@mybus.com',
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

type ViewType = 'validate' | 'inspection' | 'reports';

export default function ControllerDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('validate');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    ticketInfo?: any;
  } | null>(null);

  const navigation = [
    { name: 'Validate Tickets', icon: <QrCode />, active: currentView === 'validate', onClick: () => setCurrentView('validate') },
    { name: 'Passenger Inspection', icon: <UserIcon />, active: currentView === 'inspection', onClick: () => setCurrentView('inspection') },
    { name: 'Reports', icon: <BarChart3 />, active: currentView === 'reports', onClick: () => setCurrentView('reports') },
  ];

  const handleScan = () => {
    setScannerActive(true);
    setTimeout(() => {
      const isValid = Math.random() > 0.3;
      setValidationResult({
        valid: isValid,
        message: isValid ? 'Ticket is valid!' : 'Ticket is expired or invalid!',
        ticketInfo: isValid
          ? {
              id: 'T' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
              passenger: 'John Doe',
              type: 'Single Ticket',
              validUntil: new Date().toISOString(),
            }
          : null,
      });
      setScannerActive(false);
      setScannedCode('QR' + Math.random().toString(36).substring(7).toUpperCase());
    }, 2000);
  };

  const todayValidations = mockValidations.filter(
    (v) => new Date(v.validatedAt).toDateString() === new Date().toDateString()
  );
  const validCount = todayValidations.filter((v) => v.valid).length;
  const invalidCount = todayValidations.filter((v) => !v.valid).length;

  return (
    <DashboardLayout
      user={mockUser}
      navigation={navigation}
      notificationCount={1}
      mobileMenuOpen={mobileMenuOpen}
      onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {/* Validate View */}
      {currentView === 'validate' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-navy">Ticket Validation</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8" />
                <span className="text-3xl font-bold">{validCount}</span>
              </div>
              <h4 className="text-lg font-semibold">Valid Tickets</h4>
              <p className="text-sm opacity-80">Today</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="w-8 h-8" />
                <span className="text-3xl font-bold">{invalidCount}</span>
              </div>
              <h4 className="text-lg font-semibold">Invalid Tickets</h4>
              <p className="text-sm opacity-80">Today</p>
            </div>

            <div className="bg-gradient-to-br from-coral to-coral-dark rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Ticket className="w-8 h-8" />
                <span className="text-3xl font-bold">{todayValidations.length}</span>
              </div>
              <h4 className="text-lg font-semibold">Total Scans</h4>
              <p className="text-sm opacity-80">Today</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-navy rounded-full mb-4">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-navy mb-2">Scan Passenger Ticket</h4>
              <p className="text-gray-600">Position the QR code within the frame to validate</p>
            </div>

            <div className="max-w-md mx-auto">
              {!scannerActive && !validationResult && (
                <button
                  onClick={handleScan}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-coral hover:bg-coral-dark text-white text-lg font-semibold rounded-xl transition-colors"
                >
                  <Scan className="w-6 h-6" />
                  Start Scanner
                </button>
              )}

              {scannerActive && (
                <div className="bg-navy rounded-xl p-8 text-center">
                  <div className="w-48 h-48 mx-auto mb-4 border-4 border-dashed border-coral rounded-lg flex items-center justify-center animate-pulse">
                    <QrCode className="w-32 h-32 text-coral" />
                  </div>
                  <p className="text-white text-lg font-semibold">Scanning...</p>
                </div>
              )}

              {validationResult && (
                <div className="space-y-4">
                  <div
                    className={`rounded-xl p-8 text-center ${
                      validationResult.valid
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-red-50 border-2 border-red-500'
                    }`}
                  >
                    {validationResult.valid ? (
                      <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
                    ) : (
                      <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
                    )}
                    <h5
                      className={`text-2xl font-bold mb-2 ${
                        validationResult.valid ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {validationResult.message}
                    </h5>
                    {validationResult.ticketInfo && (
                      <div className="mt-6 bg-white rounded-lg p-4 text-left">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ticket ID:</span>
                            <span className="font-semibold text-navy">{validationResult.ticketInfo.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Passenger:</span>
                            <span className="font-semibold text-navy">{validationResult.ticketInfo.passenger}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold text-navy">{validationResult.ticketInfo.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Valid Until:</span>
                            <span className="font-semibold text-navy">
                              {new Date(validationResult.ticketInfo.validUntil).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {!validationResult.valid && (
                      <div className="mt-6 bg-white rounded-lg p-4 text-left">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-navy">
                            <p className="font-semibold mb-1">Action Required</p>
                            <p className="text-gray-600">
                              This ticket has been flagged. Please report this incident to administration.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setValidationResult(null);
                      setScannedCode('');
                    }}
                    className="w-full px-6 py-3 bg-navy hover:bg-navy-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    Scan Another Ticket
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h4 className="text-xl font-bold text-navy mb-4">Recent Validations</h4>
            <div className="space-y-3">
              {mockValidations.slice(0, 5).map((validation) => (
                <div
                  key={validation.id}
                  className="flex items-center justify-between p-4 bg-cream rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        validation.valid ? 'bg-green-100' : 'bg-red-100'
                      }`}
                    >
                      {validation.valid ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{validation.passengerName}</p>
                      <p className="text-sm text-gray-600">Ticket: {validation.ticketId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy">
                      {new Date(validation.validatedAt).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(validation.validatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inspection View */}
      {currentView === 'inspection' && (
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
      )}

      {/* Reports View */}
      {currentView === 'reports' && (
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
                {((validCount / todayValidations.length) * 100).toFixed(0)}%
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
                    style={{ width: `${(validCount / todayValidations.length) * 100}%` }}
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
                    style={{ width: `${(invalidCount / todayValidations.length) * 100}%` }}
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
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
