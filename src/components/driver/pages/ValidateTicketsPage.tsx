import { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import tripService, { Trip } from '../../../services/tripService';
import ticketService from '../../../services/ticketService';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import jsQR from 'jsqr';
import { QRCodeSVG } from 'qrcode.react';

export default function ValidateTicketsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [validationHistory, setValidationHistory] = useState<Array<{
    ticketId: string;
    valid: boolean;
    message?: string;
    timestamp: Date;
  }>>([]);

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
    
    fetchCurrentTrip();
  }, []);

  const fetchCurrentTrip = async () => {
    try {
      setLoading(true);
      
      const tripData = await tripService.getCurrentTrip();
      setCurrentTrip(tripData);
      
      if (!tripData) {
        toast.info('No active trip', {
          description: 'Please start a trip first before validating tickets.',
        });
      }
    } catch (err: any) {
      console.error('Failed to load trip:', err);
      setCurrentTrip(null);
      toast.error('Failed to load trip information');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrImage(file);
      
      // Scan QR code from image
      try {
        const imageData = await readQRCode(file);
        if (imageData) {
          setTicketId(imageData);
          toast.success('QR Code scanned!', {
            description: `Ticket ID: ${imageData}`,
          });
        } else {
          toast.warning('No QR code detected', {
            description: 'Please enter the ticket ID manually.',
          });
        }
      } catch (error) {
        console.error('Failed to scan QR code:', error);
        toast.error('Failed to scan QR code', {
          description: 'Please enter the ticket ID manually.',
        });
      }
    }
  };

  const readQRCode = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            resolve(code.data);
          } else {
            resolve(null);
          }
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleValidateTicket = async () => {
    if (!ticketId.trim()) {
      toast.error('Please enter a ticket ID');
      return;
    }

    if (!currentTrip) {
      toast.error('No active trip', {
        description: 'Please start a trip first.',
      });
      return;
    }

    try {
      setValidating(true);
      const result = await ticketService.validate(ticketId, currentTrip.id);
      
      setValidationHistory(prev => [{
        ticketId,
        valid: result.valid,
        message: result.message,
        timestamp: new Date(),
      }, ...prev]);

      if (result.valid) {
        toast.success('Ticket validated successfully!', {
          description: `Ticket ${ticketId} is valid for this trip.`,
        });
      } else {
        toast.error('Invalid ticket', {
          description: result.message || 'This ticket cannot be used for this trip.',
        });
      }

      setTicketId('');
      setQrImage(null);
    } catch (err: any) {
      console.error('Failed to validate ticket:', err);
      toast.error('Validation failed', {
        description: err.response?.data?.message || 'Please try again',
      });
      
      setValidationHistory(prev => [{
        ticketId,
        valid: false,
        message: err.response?.data?.message || 'Validation error',
        timestamp: new Date(),
      }, ...prev]);
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B392D] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentTrip) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Trip</h3>
            <p className="text-gray-600 mb-4">Please start a trip before validating tickets.</p>
            <Button
              onClick={() => window.location.href = '/driver/trips'}
              className="bg-gradient-to-r from-[#9B392D] to-[#7d2e24]"
            >
              Go to Trips
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#181E4B]">Validate Tickets</h3>

        {/* Current Trip Info */}
        <div className="bg-gradient-to-br from-[#9B392D] to-[#7d2e24] rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Active Trip</h4>
              <div className="space-y-1">
                <p className="text-white/90">Trip ID: {currentTrip.id}</p>
                <p className="text-white/80 text-sm">Route ID: {currentTrip.routeId}</p>
                <p className="text-white/75 text-sm">Started: {new Date(currentTrip.startTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3">
              <QRCodeSVG 
                value={currentTrip.id} 
                size={96}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>

        {/* Validation Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#181E4B] mb-6 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#9B392D]" />
            Ticket Validation
          </h4>
          
          <div className="space-y-5">
            {/* QR Code Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload QR Code
              </label>
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  qrImage 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#9B392D]'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {qrImage ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
                        <p className="text-sm text-green-600 font-medium">{qrImage.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-10 h-10 text-[#9B392D] mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload QR code</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>

            {/* Manual Ticket ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Ticket ID
              </label>
              <Input
                type="text"
                placeholder="Ticket ID..."
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidateTicket()}
                className="text-center text-lg font-mono"
              />
            </div>

            <Button
              onClick={handleValidateTicket}
              disabled={validating || !ticketId.trim()}
              className="w-full bg-gradient-to-r from-[#9B392D] to-[#7d2e24] hover:from-[#7d2e24] hover:to-[#5d1f1a] disabled:opacity-50 h-12 text-base font-medium"
            >
              {validating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Validate Ticket
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Validation History */}
        {validationHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-[#181E4B] mb-4">Recent Validations</h4>
            <div className="space-y-2">
              {validationHistory.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    item.valid
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.valid ? (
                      <div className="bg-green-600 rounded-full p-1">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="bg-red-600 rounded-full p-1">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{item.ticketId}</p>
                      <p className="text-sm text-gray-600">{item.message || (item.valid ? 'Valid' : 'Invalid')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            {validationHistory.length > 5 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Showing 5 of {validationHistory.length} validations
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
