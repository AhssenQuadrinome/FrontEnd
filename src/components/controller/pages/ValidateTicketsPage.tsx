import { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle,
  XCircle,
  Ticket,
  AlertTriangle,
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, ValidationRecord } from '../../../types';
import authService from '../../../services/authService';

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

export default function ValidateTicketsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
    ticketInfo?: any;
  } | null>(null);

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
            name: "Controller User",
            email: user.email,
            role: 'controller'
          });
        });
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        handleScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    setScannerActive(true);
    // Simulate QR code processing
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
    }, 2000);
  };

  const handleReset = () => {
    setValidationResult(null);
    setUploadedImage(null);
  };

  const todayValidations = mockValidations.filter(
    (v) => new Date(v.validatedAt).toDateString() === new Date().toDateString()
  );
  const validCount = todayValidations.filter((v) => v.valid).length;
  const invalidCount = todayValidations.filter((v) => !v.valid).length;

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Controller", email: "", role: "controller" }} notificationCount={1}>
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
              <div className="space-y-4">
                <label
                  htmlFor="qr-upload"
                  className="w-full flex flex-col items-center justify-center gap-3 px-8 py-8 bg-gradient-to-br from-navy to-navy-light hover:from-navy-dark hover:to-navy text-white rounded-xl transition-all cursor-pointer border-2 border-dashed border-white/30 hover:border-white/50"
                >
                  <QrCode className="w-16 h-16" />
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-1">Upload QR Code</p>
                    <p className="text-sm opacity-80">Click to select an image</p>
                  </div>
                  <input
                    id="qr-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-center text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            )}

            {scannerActive && (
              <div className="bg-navy rounded-xl p-8 text-center">
                {uploadedImage && (
                  <div className="mb-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded QR Code"
                      className="w-48 h-48 mx-auto object-contain rounded-lg border-2 border-coral"
                    />
                  </div>
                )}
                <div className="w-48 h-12 mx-auto mb-4 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-coral rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-coral rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
                <p className="text-white text-lg font-semibold">Processing QR Code...</p>
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
                  onClick={handleReset}
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
    </DashboardLayout>
  );
}
