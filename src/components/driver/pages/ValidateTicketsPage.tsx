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
      const trip = await tripService.getCurrentTrip();
      setCurrentTrip(trip);
      
      if (!trip) {
        toast.error('No active trip', {
          description: 'Please start a trip first before validating tickets.',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch trip:', err);
      toast.error('Failed to load trip information');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQrImage(e.target.files[0]);
      // TODO: Extract ticket ID from QR code image
      // For now, user will need to enter manually
      toast.info('QR Code uploaded', {
        description: 'Please enter the ticket ID manually for now.',
      });
    }
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
              <h4 className="text-xl font-bold mb-1">Active Trip</h4>
              <p className="text-white/90">Route: {currentTrip.routeName || `#${currentTrip.routeNumber || 'N/A'}`}</p>
              <p className="text-sm text-white/75 mt-1">Started: {new Date(currentTrip.startTime).toLocaleTimeString()}</p>
            </div>
            <QrCode className="w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Validation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-bold text-[#181E4B] mb-4">Scan or Enter Ticket</h4>
          
          {/* QR Code Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload QR Code Image
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              {qrImage && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Uploaded
                </span>
              )}
            </div>
          </div>

          {/* Manual Ticket ID Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Ticket ID Manually
            </label>
            <Input
              type="text"
              placeholder="Enter ticket ID..."
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleValidateTicket()}
            />
          </div>

          <Button
            onClick={handleValidateTicket}
            disabled={validating || !ticketId.trim()}
            className="w-full bg-gradient-to-r from-[#9B392D] to-[#7d2e24] hover:from-[#7d2e24] hover:to-[#5d1f1a] disabled:opacity-50"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {validating ? 'Validating...' : 'Validate Ticket'}
          </Button>
        </div>

        {/* Validation History */}
        {validationHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-[#181E4B] mb-4">Validation History</h4>
            <div className="space-y-3">
              {validationHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    item.valid
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.valid ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">Ticket: {item.ticketId}</p>
                      <p className="text-sm text-gray-600">{item.message || (item.valid ? 'Valid ticket' : 'Invalid ticket')}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
