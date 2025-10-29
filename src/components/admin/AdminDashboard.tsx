import { useState } from 'react';
import {
  Users,
  Ticket,
  MapPin,
  Navigation,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Bus,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import DashboardLayout from '../DashboardLayout';
import { User, Trip, Incident, Notification } from '../../types';

const mockUser: User = {
  id: '4',
  name: 'Admin User',
  email: 'admin@mybus.com',
  role: 'admin',
};

const mockUsers = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'passenger', status: 'active' },
  { id: '2', name: 'Karim Benali', email: 'karim@mybus.com', role: 'driver', status: 'active' },
  { id: '3', name: 'Fatima Zohra', email: 'fatima@mybus.com', role: 'controller', status: 'active' },
  { id: '5', name: 'Sarah Mahmoud', email: 'sarah@example.com', role: 'passenger', status: 'inactive' },
];

const mockRoutes = [
  { id: '1', name: 'Line 15', number: '15', stations: 12, status: 'active', buses: 8 },
  { id: '2', name: 'Line 8', number: '8', stations: 10, status: 'active', buses: 6 },
  { id: '3', name: 'Line 22', number: '22', stations: 15, status: 'active', buses: 10 },
];

const mockBuses = [
  { id: '1', number: 'BUS-101', route: 'Line 15', driver: 'Karim Benali', status: 'active', location: { lat: 36.7538, lng: 3.0588 } },
  { id: '2', number: 'BUS-205', route: 'Line 8', driver: 'Ali Meziane', status: 'active', location: { lat: 36.7638, lng: 3.0488 } },
  { id: '3', number: 'BUS-312', route: 'Line 22', driver: 'Omar Khelifi', status: 'maintenance', location: null },
];

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'delay',
    tripId: 'TR001',
    routeName: 'Line 15',
    description: 'Heavy traffic on main boulevard',
    reportedBy: 'Karim Benali',
    reportedAt: '2025-10-28T13:45:00',
    status: 'open',
    severity: 'medium',
  },
  {
    id: '2',
    type: 'technical',
    tripId: 'TR005',
    routeName: 'Line 8',
    description: 'Engine overheating',
    reportedBy: 'Ali Meziane',
    reportedAt: '2025-10-28T12:30:00',
    status: 'resolved',
    severity: 'high',
  },
];

type ViewType = 'overview' | 'users' | 'tickets' | 'routes' | 'geolocation' | 'incidents' | 'notifications';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'user' | 'route' | 'notification' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Overview', icon: <BarChart3 />, active: currentView === 'overview', onClick: () => setCurrentView('overview') },
    { name: 'Users', icon: <Users />, active: currentView === 'users', onClick: () => setCurrentView('users') },
    { name: 'Tickets', icon: <Ticket />, active: currentView === 'tickets', onClick: () => setCurrentView('tickets') },
    { name: 'Routes', icon: <MapPin />, active: currentView === 'routes', onClick: () => setCurrentView('routes') },
    { name: 'Geolocation', icon: <Navigation />, active: currentView === 'geolocation', onClick: () => setCurrentView('geolocation') },
    { name: 'Incidents', icon: <AlertTriangle />, active: currentView === 'incidents', onClick: () => setCurrentView('incidents') },
    { name: 'Notifications', icon: <Bell />, active: currentView === 'notifications', onClick: () => setCurrentView('notifications') },
  ];

  return (
    <>
      <DashboardLayout
        user={mockUser}
        navigation={navigation}
        notificationCount={3}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {/* Overview */}
        {currentView === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">System Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    12%
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">2,847</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    8%
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
                <p className="text-sm text-gray-600">Tickets Sold Today</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Bus className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">24/26</p>
                <p className="text-sm text-gray-600">Buses Active</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    15%
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">$12.4K</p>
                <p className="text-sm text-gray-600">Revenue Today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Active Routes</h4>
                <div className="space-y-3">
                  {mockRoutes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {route.number}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{route.name}</p>
                          <p className="text-sm text-gray-600">{route.stations} stations • {route.buses} buses</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">Recent Incidents</h4>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                    {mockIncidents.filter(i => i.status === 'open').length} Open
                  </span>
                </div>
                <div className="space-y-3">
                  {mockIncidents.map((incident) => (
                    <div key={incident.id} className={`p-4 rounded-lg border ${
                      incident.status === 'open' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          incident.severity === 'high' ? 'text-red-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 capitalize">{incident.type}</p>
                            <span className={`text-xs font-medium ${
                              incident.status === 'open' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {incident.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{incident.description}</p>
                          <p className="text-xs text-gray-500">{incident.routeName} • {incident.reportedBy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {currentView === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
              <button
                onClick={() => {
                  setModalType('user');
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-800 text-white rounded-full text-xs font-medium capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tickets & Subscriptions */}
        {currentView === 'tickets' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Tickets & Subscriptions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Ticket className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
                <p className="text-sm text-gray-600">Tickets Sold Today</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">456</p>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">$12.4K</p>
                <p className="text-sm text-gray-600">Revenue Today</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
                <p className="text-sm text-gray-600">Fraud Alerts</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-900">Revenue Analytics</h4>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Single Tickets</span>
                    <span className="text-sm font-semibold text-gray-900">$6,170 (50%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Subscriptions</span>
                    <span className="text-sm font-semibold text-gray-900">$4,936 (40%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-slate-800 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Annual Subscriptions</span>
                    <span className="text-sm font-semibold text-gray-900">$1,234 (10%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Routes & Schedules */}
        {currentView === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">Routes & Schedules</h3>
              <button
                onClick={() => {
                  setModalType('route');
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Route
              </button>
            </div>

            <div className="space-y-4">
              {mockRoutes.map((route) => (
                <div key={route.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
                          {route.number}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold mb-1">{route.name}</h4>
                          <p className="text-sm text-gray-300">{route.stations} stations • {route.buses} buses assigned</p>
                        </div>
                      </div>
                      <span className="px-4 py-2 bg-green-500 text-white rounded-full text-xs font-semibold shadow-sm">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-sm">
                        <Edit className="w-4 h-4" />
                        Edit Route
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-colors text-sm">
                        <Settings className="w-4 h-4" />
                        Manage Schedule
                      </button>
                      <button className="px-4 py-2.5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Geolocation */}
        {currentView === 'geolocation' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Real-Time Geolocation</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Bus className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockBuses.filter(b => b.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Buses Active</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockBuses.filter(b => b.status === 'maintenance').length}</p>
                <p className="text-sm text-gray-600">In Maintenance</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockBuses.length}</p>
                <p className="text-sm text-gray-600">Total Buses</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Bus Fleet Status</h4>
              <div className="space-y-3">
                {mockBuses.map((bus) => (
                  <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${
                        bus.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        <Bus className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{bus.number}</p>
                        <p className="text-sm text-gray-600">{bus.route} • Driver: {bus.driver}</p>
                        {bus.location && (
                          <p className="text-xs text-gray-500 mt-1">
                            Lat: {bus.location.lat.toFixed(4)}, Lng: {bus.location.lng.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {bus.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Incidents */}
        {currentView === 'incidents' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Incident Management</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockIncidents.filter(i => i.status === 'open').length}</p>
                <p className="text-sm text-gray-600">Open Incidents</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockIncidents.filter(i => i.status === 'resolved').length}</p>
                <p className="text-sm text-gray-600">Resolved Today</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{mockIncidents.length}</p>
                <p className="text-sm text-gray-600">Total Incidents</p>
              </div>
            </div>

            <div className="space-y-4">
              {mockIncidents.map((incident) => (
                <div key={incident.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`p-4 border-l-4 ${
                    incident.severity === 'high' ? 'bg-red-50 border-red-500' :
                    incident.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className={`w-6 h-6 ${
                          incident.severity === 'high' ? 'text-red-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <h4 className="font-bold text-gray-900 capitalize text-lg">{incident.type}</h4>
                          <p className="text-sm text-gray-600">{incident.routeName} • Trip {incident.tripId}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        incident.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{incident.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-semibold text-gray-900">Reported by:</span> {incident.reportedBy}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Time:</span> {new Date(incident.reportedAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Severity:</span>{' '}
                        <span className={`capitalize font-semibold ${
                          incident.severity === 'high' ? 'text-red-600' :
                          incident.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                    </div>

                    {incident.status === 'open' && (
                      <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {currentView === 'notifications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-2xl font-bold text-gray-900">System Notifications</h3>
              <button
                onClick={() => {
                  setModalType('notification');
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Send Notification
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Create Mass Notification</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Delay Alert</option>
                    <option>Cancellation</option>
                    <option>Service Update</option>
                    <option>Maintenance Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>All Passengers</option>
                    <option>Route-Specific</option>
                    <option>Subscription Holders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Enter your message..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all">
                    Send via Email
                  </button>
                  <button className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
                    Send via SMS
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Notification History</h4>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-4 h-4 text-orange-600" />
                        </div>
                        <p className="font-semibold text-gray-900">Line 15 Delay Alert</p>
                      </div>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 ml-10">
                      Line 15 buses are experiencing 15-minute delays due to road construction.
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500 ml-10">
                      <span>Sent to: 1,234 passengers</span>
                      <span>Delivery: 98% success</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}