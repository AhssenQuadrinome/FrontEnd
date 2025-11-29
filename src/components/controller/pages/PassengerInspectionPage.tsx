import { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Search,
  Upload
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import ticketService from '../../../services/ticketService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from 'sonner';
import jsQR from 'jsqr';

interface InspectionRecord {
  ticketId: string;
  tripId: string;
  valid: boolean;
  message: string;
  timestamp: Date;
}

export default function PassengerInspectionPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [tripId, setTripId] = useState('');
  const [ticketQrImage, setTicketQrImage] = useState<File | null>(null);
  const [tripQrImage, setTripQrImage] = useState<File | null>(null);
  const [inspecting, setInspecting] = useState(false);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionRecord[]>([]);

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

  const handleTicketQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTicketQrImage(file);
      
      try {
        const qrData = await readQRCode(file);
        if (qrData) {
          setTicketId(qrData);
          toast.success('Ticket QR Code scanned!', {
            description: `Ticket ID: ${qrData}`,
          });
        } else {
          toast.warning('No QR code detected', {
            description: 'Please enter the ticket ID manually.',
          });
        }
      } catch (error) {
        console.error('Failed to scan QR code:', error);
        toast.error('Failed to scan QR code');
      }
    }
  };

  const handleTripQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTripQrImage(file);
      
      try {
        const qrData = await readQRCode(file);
        if (qrData) {
          setTripId(qrData);
          toast.success('Trip QR Code scanned!', {
            description: `Trip ID: ${qrData}`,
          });
        } else {
          toast.warning('No QR code detected', {
            description: 'Please enter the trip ID manually.',
          });
        }
      } catch (error) {
        console.error('Failed to scan QR code:', error);
        toast.error('Failed to scan QR code');
      }
    }
  };

  const handleInspect = async () => {
    if (!ticketId.trim()) {
      toast.error('Please enter a ticket ID');
      return;
    }

    if (!tripId.trim()) {
      toast.error('Please enter a trip ID');
      return;
    }

    try {
      setInspecting(true);
      const result = await ticketService.inspect(ticketId, tripId);
      
      setInspectionHistory(prev => [{
        ticketId,
        tripId,
        valid: result.valid,
        message: result.message,
        timestamp: new Date(),
      }, ...prev]);

      if (result.valid) {
        toast.success('Ticket inspection successful!', {
          description: result.message,
        });
      } else {
        toast.error('Invalid ticket', {
          description: result.message,
        });
      }

      // Reset form
      setTicketId('');
      setTripId('');
      setTicketQrImage(null);
      setTripQrImage(null);
    } catch (err: any) {
      console.error('Failed to inspect ticket:', err);
      toast.error('Inspection failed', {
        description: err.response?.data?.message || 'Please try again',
      });
      
      setInspectionHistory(prev => [{
        ticketId,
        tripId,
        valid: false,
        message: err.response?.data?.message || 'Inspection error',
        timestamp: new Date(),
      }, ...prev]);
    } finally {
      setInspecting(false);
    }
  };

  const validCount = inspectionHistory.filter((i) => i.valid).length;
  const invalidCount = inspectionHistory.filter((i) => !i.valid).length;

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Controller", email: "", role: "controller" }} notificationCount={1}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#181E4B]">Passenger Inspection</h3>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Search className="w-8 h-8" />
              <span className="text-3xl font-bold">{inspectionHistory.length}</span>
            </div>
            <h4 className="text-lg font-semibold">Total Inspections</h4>
            <p className="text-sm opacity-80">Today</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8" />
              <span className="text-3xl font-bold">{validCount}</span>
            </div>
            <h4 className="text-lg font-semibold">Valid Tickets</h4>
            <p className="text-sm opacity-80">Approved</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="w-8 h-8" />
              <span className="text-3xl font-bold">{invalidCount}</span>
            </div>
            <h4 className="text-lg font-semibold">Invalid Tickets</h4>
            <p className="text-sm opacity-80">Flagged</p>
          </div>
        </div>

        {/* Inspection Form */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-[#181E4B] mb-6 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#9B392D]" />
            Inspect Passenger Ticket
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Ticket ID Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket QR Code
                </label>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  ticketQrImage 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#9B392D]'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {ticketQrImage ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
                        <p className="text-sm text-green-600 font-medium">{ticketQrImage.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-[#9B392D] mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Upload Ticket QR</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTicketQRUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Ticket ID
                </label>
                <Input
                  type="text"
                  placeholder="Ticket ID..."
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="text-center text-lg font-mono"
                />
              </div>
            </div>

            {/* Trip ID Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip QR Code
                </label>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  tripQrImage 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#9B392D]'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {tripQrImage ? (
                      <>
                        <CheckCircle className="w-10 h-10 text-green-600 mb-2" />
                        <p className="text-sm text-green-600 font-medium">{tripQrImage.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-[#9B392D] mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Upload Trip QR</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTripQRUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Trip ID
                </label>
                <Input
                  type="text"
                  placeholder="Trip ID..."
                  value={tripId}
                  onChange={(e) => setTripId(e.target.value)}
                  className="text-center text-lg font-mono"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleInspect}
            disabled={inspecting || !ticketId.trim() || !tripId.trim()}
            className="w-full bg-gradient-to-r from-[#9B392D] to-[#7d2e24] hover:from-[#7d2e24] hover:to-[#5d1f1a] disabled:opacity-50 h-12 text-base font-medium"
          >
            {inspecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Inspecting...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Inspect Ticket
              </>
            )}
          </Button>
        </div>

        {/* Inspection History */}
        {inspectionHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-[#181E4B] mb-4">Recent Inspections</h4>
            <div className="space-y-3">
              {inspectionHistory.slice(0, 10).map((inspection, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    inspection.valid
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-red-50 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {inspection.valid ? (
                        <div className="bg-green-600 rounded-full p-1">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red-600 rounded-full p-1">
                          <XCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          Ticket: <span className="font-mono">{inspection.ticketId}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Trip: <span className="font-mono">{inspection.tripId}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{inspection.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 font-medium">
                        {inspection.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {!inspection.valid && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Report to Admin
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {inspectionHistory.length > 10 && (
              <p className="text-center text-sm text-gray-500 mt-3">
                Showing 10 of {inspectionHistory.length} inspections
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
