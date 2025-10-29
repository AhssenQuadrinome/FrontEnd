import { useState } from 'react';
import {
  Ticket,
  CreditCard,
  Map,
  User as UserIcon,
  Bell,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { User, Ticket as TicketType, Subscription, Trip, Notification } from '../../types';

const mockUser: User = {
  id: '1',
  name: 'Ahmed Hassan',
  email: 'ahmed.hassan@example.com',
  role: 'passenger',
};

const mockTickets: TicketType[] = [
  {
    id: '1',
    type: 'single',
    status: 'active',
    purchaseDate: '2025-10-28T10:00:00',
    validUntil: '2025-10-28T23:59:59',
    price: 5.0,
    qrCode: 'QR123456789',
  },
  {
    id: '2',
    type: 'single',
    status: 'used',
    purchaseDate: '2025-10-27T14:30:00',
    validUntil: '2025-10-27T23:59:59',
    price: 5.0,
    qrCode: 'QR987654321',
  },
];

const mockSubscription: Subscription = {
  id: '1',
  type: 'monthly',
  status: 'active',
  startDate: '2025-10-01T00:00:00',
  endDate: '2025-10-31T23:59:59',
  price: 50.0,
  autoRenew: true,
};

const mockTrips: Trip[] = [
  {
    id: '1',
    routeId: '1',
    routeName: 'Line 15 - City Center',
    busNumber: 'BUS-101',
    status: 'in-progress',
    departureTime: '14:00',
    arrivalTime: '14:45',
    currentLocation: { latitude: 36.7538, longitude: 3.0588 },
    passengerLoad: 45,
  },
  {
    id: '2',
    routeId: '2',
    routeName: 'Line 8 - University',
    busNumber: 'BUS-205',
    status: 'scheduled',
    departureTime: '15:30',
    arrivalTime: '16:15',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delay',
    title: 'Line 15 Delayed',
    message: 'Your bus is running 10 minutes late due to traffic.',
    sentAt: '2025-10-28T13:45:00',
    read: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'service',
    title: 'New Route Available',
    message: 'Line 22 now serves the new business district.',
    sentAt: '2025-10-27T09:00:00',
    read: true,
    priority: 'normal',
  },
];

type ViewType = 'tickets' | 'subscription' | 'trips' | 'profile' | 'notifications';

export default function PassengerDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('tickets');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'My Tickets', icon: <Ticket />, active: currentView === 'tickets', onClick: () => setCurrentView('tickets') },
    { name: 'Subscription', icon: <CreditCard />, active: currentView === 'subscription', onClick: () => setCurrentView('subscription') },
    { name: 'Routes & Trips', icon: <Map />, active: currentView === 'trips', onClick: () => setCurrentView('trips') },
    { name: 'Profile', icon: <UserIcon />, active: currentView === 'profile', onClick: () => setCurrentView('profile') },
    { name: 'Notifications', icon: <Bell />, active: currentView === 'notifications', onClick: () => setCurrentView('notifications') },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-300',
      used: 'bg-gray-100 text-gray-700 border-gray-300',
      expired: 'bg-red-100 text-red-700 border-red-300',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'used':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <DashboardLayout
        user={mockUser}
        navigation={navigation}
        notificationCount={mockNotifications.filter((n) => !n.read).length}
        onNotificationClick={() => setCurrentView('notifications')}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {/* Tickets View */}
        {currentView === 'tickets' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-navy">My Tickets</h3>
              <button className="flex items-center gap-2 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors">
                <Plus className="w-5 h-5" />
                Buy New Ticket
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark">
                  <div className="bg-gradient-to-r from-navy to-navy-light p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">Ticket ID</p>
                        <p className="text-xl font-bold">#{ticket.id.padStart(6, '0')}</p>
                      </div>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {getStatusIcon(ticket.status)}
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Purchase Date</p>
                        <p className="font-semibold text-navy">
                          {new Date(ticket.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p className="font-semibold text-navy">
                          {new Date(ticket.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-cream-dark">
                      <div className="text-2xl font-bold text-coral">${ticket.price.toFixed(2)}</div>
                      {ticket.status === 'active' && (
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowQRModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-navy hover:bg-navy-dark text-white rounded-lg transition-colors"
                        >
                          <QrCode className="w-4 h-4" />
                          Show QR
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription View */}
        {currentView === 'subscription' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">My Subscription</h3>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-coral">
              <div className="bg-gradient-to-br from-burgundy to-burgundy-dark p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-90 mb-2">Current Plan</p>
                    <h4 className="text-3xl font-bold capitalize">{mockSubscription.type} Pass</h4>
                  </div>
                  <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
                    Active
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${mockSubscription.price}</span>
                  <span className="text-lg opacity-80">/{mockSubscription.type === 'monthly' ? 'month' : 'year'}</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="text-lg font-semibold text-navy">
                      {new Date(mockSubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="text-lg font-semibold text-navy">
                      {new Date(mockSubscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-cream rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-navy">
                    Auto-renewal is <span className="font-semibold">enabled</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors">
                    Renew Early
                  </button>
                  <button className="px-6 py-3 border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded-lg transition-colors">
                    View Receipts
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-cream-dark">
                <h4 className="text-lg font-bold text-navy mb-4">Monthly Plan</h4>
                <p className="text-3xl font-bold text-coral mb-4">$50/mo</p>
                <ul className="space-y-2 text-navy">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Unlimited rides
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    All routes included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Priority support
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-cream-dark">
                <h4 className="text-lg font-bold text-navy mb-4">Annual Plan</h4>
                <p className="text-3xl font-bold text-coral mb-4">$500/yr</p>
                <ul className="space-y-2 text-navy">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Save $100 per year
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    All monthly benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Exclusive perks
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Trips View */}
        {currentView === 'trips' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">Routes & Schedules</h3>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routes, stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
            </div>

            <div className="space-y-4">
              {mockTrips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-cream-dark">
                  <div className="bg-gradient-to-r from-navy to-navy-light p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5" />
                        <h4 className="font-bold text-lg">{trip.routeName}</h4>
                      </div>
                      <button className="text-yellow-accent hover:text-yellow-400">
                        <Star className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Bus Number</p>
                        <p className="font-semibold text-navy">{trip.busNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Departure</p>
                        <p className="font-semibold text-navy">{trip.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Arrival</p>
                        <p className="font-semibold text-navy">{trip.arrivalTime}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          trip.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : trip.status === 'scheduled'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {trip.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                      </span>
                      {trip.passengerLoad && (
                        <span className="text-sm text-gray-600">
                          Capacity: <span className="font-semibold">{trip.passengerLoad}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile View */}
        {currentView === 'profile' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">My Profile</h3>

            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-coral to-coral-dark rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {mockUser.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-navy">{mockUser.name}</h4>
                  <p className="text-gray-600">{mockUser.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-coral text-white text-sm rounded-full">
                    Passenger
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={mockUser.name}
                    className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue={mockUser.email}
                    className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+213 555 123 456"
                    className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                  />
                </div>

                <button className="w-full sm:w-auto px-8 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors mt-4">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications View */}
        {currentView === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-navy">Notifications</h3>

            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-md p-6 border ${
                    notification.read ? 'border-cream-dark' : 'border-coral'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        notification.type === 'delay'
                          ? 'bg-red-100'
                          : notification.type === 'cancellation'
                          ? 'bg-orange-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Bell
                        className={`w-6 h-6 ${
                          notification.type === 'delay'
                            ? 'text-red-600'
                            : notification.type === 'cancellation'
                            ? 'text-orange-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-navy">{notification.title}</h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-coral rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(notification.sentAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>

      {/* QR Code Modal */}
      {showQRModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-navy mb-2">Ticket QR Code</h3>
              <p className="text-gray-600 mb-6">Show this to the controller</p>

              <div className="bg-cream p-8 rounded-xl mb-6">
                <div className="w-64 h-64 mx-auto bg-white rounded-lg flex items-center justify-center border-4 border-navy">
                  <QrCode className="w-48 h-48 text-navy" />
                </div>
                <p className="mt-4 font-mono font-bold text-navy">{selectedTicket.qrCode}</p>
              </div>

              <div className="space-y-2 text-sm text-left mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket ID:</span>
                  <span className="font-semibold text-navy">#{selectedTicket.id.padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="font-semibold text-navy">
                    {new Date(selectedTicket.validUntil).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedTicket(null);
                }}
                className="w-full px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
