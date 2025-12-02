import {
  Users,
  Ticket,
  DollarSign,
  Bus,
  AlertTriangle
} from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, UserRole } from '../../../types';
import { useEffect, useState } from 'react';
import authService from '../../../services/authService';
import routeService, { Route } from '../../../services/routeService';
import adminStatsService from '../../../services/adminStatsService';
import incidentService, { IncidentResponse } from '../../../services/incidentService';

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRoutes, setTotalRoutes] = useState<number>(0);
  const [totalBuses, setTotalBuses] = useState<number>(0);
  const [ticketsSoldToday, setTicketsSoldToday] = useState<number>(0);
  const [revenueToday, setRevenueToday] = useState<number>(0);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<IncidentResponse[]>([]);
  const [openIncidentsCount, setOpenIncidentsCount] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [profile, usersData, routesData, statsData, revenueData, incidentsData] = await Promise.all([
        authService.getProfile(),
        authService.getAllUsers(0, 1000), // Get all users
        routeService.getAllRoutes(0, 100), // Get all routes
        adminStatsService.getTicketsSoldToday(),
        adminStatsService.getRevenueToday(), // Get revenue today
        incidentService.getAllIncidents(0, 3), // Get last 5 incidents
      ]);

      // Transform UserProfile to User
      setUser({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        role: profile.role as UserRole,
      });
      setTotalUsers(usersData.totalElements);
      setTotalRoutes(routesData.content.length);
      
      // Count total buses from all routes (each route has config.busCount)
      const busCount = routesData.content.reduce((sum, route) => sum + (route.config?.busCount || 0), 0);
      setTotalBuses(busCount);
      
      setTicketsSoldToday(statsData.count);
      setRevenueToday(revenueData.revenue); // Revenue today
      
      // Get first 3 active routes for display
      setRoutes(routesData.content.filter(r => r.active).slice(0, 3));
      
      // Set recent incidents
      setRecentIncidents(incidentsData.content);
      
      // Count open incidents
      const openCount = incidentsData.content.filter(inc => inc.status === 'OPEN').length;
      setOpenIncidentsCount(openCount);
      
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || !user) {
    return (
      <DashboardLayout 
        user={user || { id: '', name: 'Loading...', email: '', role: 'admin' }} 
        notificationCount={3}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} notificationCount={3}>
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
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  {totalUsers.toLocaleString()}
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
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  {ticketsSoldToday.toLocaleString()}
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
                  {totalBuses}/{totalBuses}
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
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#A54033] bg-clip-text text-transparent mb-1">
                  {revenueToday.toFixed(0)} MAD
                </p>
                <p className="text-sm text-[#A54033] font-medium">Revenue Today</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Active Routes</h4>
              <span className="px-3 py-1 bg-[#181E4B]/10 text-[#181E4B] rounded-full text-xs font-semibold">
                {totalRoutes} Total
              </span>
            </div>
            <div className="space-y-3">
              {routes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No active routes</p>
              ) : (
                routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {route.number}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{route.name}</p>
                        <p className="text-sm text-gray-600">{route.stations.length} stations • {route.config?.busCount || 0} buses</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-[#181E4B]/10 text-[#181E4B] rounded-full text-xs font-semibold">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Recent Incidents</h4>
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                {openIncidentsCount} Open
              </span>
            </div>
            <div className="space-y-3">
              {recentIncidents.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No incidents reported</p>
                  <p className="text-gray-400 text-xs mt-1">All clear for now</p>
                </div>
              ) : (
                recentIncidents.map((incident) => (
                  <div key={incident.id} className={`p-4 rounded-lg border ${
                    incident.status === 'OPEN' ? 'bg-red-50 border-red-200' : 
                    incident.status === 'IN_PROGRESS' ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        incident.type === 'INCIDENT' ? 'text-red-600' :
                        incident.type === 'DELAY' ? 'text-yellow-600' : 'text-orange-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">
                            {incident.type === 'INCIDENT' ? 'Incident' : 
                             incident.type === 'DELAY' ? 'Delay' : 'Cancellation'}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            incident.status === 'OPEN' ? 'bg-red-100 text-red-700' : 
                            incident.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-green-100 text-green-700'
                          }`}>
                            {incident.status === 'IN_PROGRESS' ? 'In Progress' : incident.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 line-clamp-2">{incident.description}</p>
                        <p className="text-xs text-gray-500">
                          Route {incident.routeId} • {new Date(incident.reportedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
