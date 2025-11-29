import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Ticket } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import tripService, { Trip } from '../../../services/tripService';
import ticketService, { TicketValidation } from '../../../services/ticketService';

export default function PlanningPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [validations, setValidations] = useState<TicketValidation[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  // Fetch driver trips and validations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tripsData, validationsData] = await Promise.all([
          tripService.getDriverTrips(),
          ticketService.getValidationsByDriver()
        ]);
        setTrips(tripsData);
        setValidations(validationsData);
      } catch (error) {
        console.error('Error fetching driver data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalTrips = trips.length;
  const totalValidations = validations.length;
  
  // Calculate trips this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const tripsThisWeek = trips.filter(trip => 
    new Date(trip.startTime) >= oneWeekAgo
  ).length;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Personal Planning & History</h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-navy">Loading driver statistics...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl shadow-lg p-6 text-white">
                <Calendar className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">{tripsThisWeek}</p>
                <p className="text-sm opacity-90">Trips This Week</p>
              </div>

              <div className="bg-gradient-to-br from-coral to-coral-dark rounded-xl shadow-lg p-6 text-white">
                <Ticket className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">{totalValidations}</p>
                <p className="text-sm opacity-90">Tickets Validated</p>
              </div>

              <div className="bg-gradient-to-br from-burgundy to-burgundy-dark rounded-xl shadow-lg p-6 text-white">
                <CheckCircle className="w-10 h-10 mb-4" />
                <p className="text-3xl font-bold mb-2">{totalTrips}</p>
                <p className="text-sm opacity-90">Total Trips</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-xl font-bold text-navy mb-6">Recent Trip History</h4>
              {trips.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No trips found for your account.
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.slice(0, 10).map((trip) => {
                    // Count validations for this trip
                    const tripValidations = validations.filter(v => v.tripId === trip.id).length;
                    
                    return (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center text-white font-bold text-xs">
                            {trip.routeId?.substring(0, 6) || 'N/A'}
                          </div>
                          <div>
                            <p className="font-semibold text-navy">
                              Trip ID: {trip.id.substring(0, 8)}... • Route: {trip.routeId}
                            </p>
                            <p className="text-sm text-gray-600">{formatDate(trip.startTime)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {tripValidations} ticket{tripValidations !== 1 ? 's' : ''} validated
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(trip.status)}`}>
                          {trip.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
