import {
  Users,
  Ticket,
  TrendingUp,
  DollarSign,
  Bus,
  AlertTriangle,
  MapPin,
  Bell
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, Incident } from '../../../types';
import { useNavigate } from 'react-router-dom';

const mockUser: User = {
  id: '4',
  name: 'Admin User',
  email: 'ourbusway2025@outlook.com',
  role: 'admin',
};

const mockRoutes = [
  { id: '1', name: 'Line 15', number: '15', stations: 12, status: 'active', buses: 8 },
  { id: '2', name: 'Line 8', number: '8', stations: 10, status: 'active', buses: 6 },
  { id: '3', name: 'Line 22', number: '22', stations: 15, status: 'active', buses: 10 },
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

export default function OverviewPage() {
  const navigate = useNavigate();
  const navigation = [
    { name: 'Overview', icon: <TrendingUp />, active: true, onClick: () => navigate('/admin/overview') },
    { name: 'Users', icon: <Users />, active: false, onClick: () => navigate('/admin/users') },
    { name: 'Tickets', icon: <Ticket />, active: false, onClick: () => navigate('/admin/tickets') },
    { name: 'Routes', icon: <Bus />, active: false, onClick: () => navigate('/admin/routes') },
    { name: 'Geolocation', icon: <MapPin />, active: false, onClick: () => navigate('/admin/geolocation') },
    { name: 'Incidents', icon: <AlertTriangle />, active: false, onClick: () => navigate('/admin/incidents') },
    { name: 'Notifications', icon: <Bell />, active: false, onClick: () => navigate('/admin/notifications') },
  ];
  return (
    <DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card - brown gradient */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A54033] to-[#A54033] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #A5403355'}}>
                      <Users className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#A54033]/10 rounded-full text-[#A54033] text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    12%
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  2,847
                </p>
                <p className="text-sm text-[#A54033] font-medium">Total Users</p>
              </div>
            </div>
          </div>
          {/* Tickets Card - navy gradient */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A54033] to-[#A54033] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #A5403355'}}>
                      <Ticket className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#A54033]/10 rounded-full text-[#A54033] text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    8%
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  1,234
                </p>
                <p className="text-sm text-[#A54033] font-medium">Tickets Sold Today</p>
              </div>
            </div>
          </div>
          {/* Buses Card - brown gradient */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A54033] to-[#A54033] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #A5403355'}}>
                      <Bus className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  24/26
                </p>
                <p className="text-sm text-[#A54033] font-medium">Buses Active</p>
              </div>
            </div>
          </div>
          {/* Revenue Card - navy gradient */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A54033] to-[#A54033] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #A5403355'}}>
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#A54033]/10 rounded-full text-[#A54033] text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    15%
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  $12.4K
                </p>
                <p className="text-sm text-[#A54033] font-medium">Revenue Today</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Active Routes</h4>
            <div className="space-y-3">
              {mockRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {route.number}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{route.name}</p>
                      <p className="text-sm text-gray-600">{route.stations} stations • {route.buses} buses</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#181E4B]/10 text-[#181E4B] rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Recent Incidents</h4>
              <span className="px-3 py-1 bg-[#181E4B]/10 text-[#181E4B] rounded-full text-xs font-semibold">
                {mockIncidents.filter(i => i.status === 'open').length} Open
              </span>
            </div>
            <div className="space-y-3">
              {mockIncidents.map((incident) => (
                <div key={incident.id} className={`p-4 rounded-lg border ${
                  incident.status === 'open' ? 'bg-[#181E4B]/5 border-[#181E4B]/30' : 'bg-gray-50 border-gray-200'
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
                          incident.status === 'open' ? 'text-red-600' : 'text-[#181E4B]'
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
    </DashboardLayout>
  );
}
