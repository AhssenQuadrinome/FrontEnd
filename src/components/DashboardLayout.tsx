import { ReactNode } from 'react';
import { LogOut, Menu, X, Bell, Ticket, TrendingUp, Map, User as UserIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
  notificationCount?: number;
  onNotificationClick?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function DashboardLayout({
  children,
  user,
  notificationCount = 0,
  onNotificationClick,
  mobileMenuOpen = false,
  onMobileMenuToggle,
}: DashboardLayoutProps) {
  const location = useLocation();
  const passengerNavigation = [
    { name: 'My Tickets', icon: <Ticket />, path: '/passenger/tickets' },
    { name: 'Buy Ticket', icon: <Ticket />, path: '/passenger/buy-ticket' },
    { name: 'Subscription', icon: <TrendingUp />, path: '/passenger/subscription' },
    { name: 'Routes & Trips', icon: <Map />, path: '/passenger/trips' },
    { name: 'Profile', icon: <UserIcon />, path: '/passenger/profile' },
    { name: 'Notifications', icon: <Bell />, path: '/passenger/notifications' },
  ];
  const adminNavigation = [
    { name: 'Overview', icon: <TrendingUp />, path: '/admin/overview' },
    { name: 'Users', icon: <UserIcon />, path: '/admin/users' },
    { name: 'Tickets', icon: <Ticket />, path: '/admin/tickets' },
    { name: 'Routes', icon: <Map />, path: '/admin/routes' },
    { name: 'Geolocation', icon: <Map />, path: '/admin/geolocation' },
    { name: 'Incidents', icon: <Bell />, path: '/admin/incidents' },
    { name: 'Notifications', icon: <Bell />, path: '/admin/notifications' },
  ];
  const driverNavigation = [
    { name: 'My Trips', icon: <Ticket />, path: '/driver/trips' },
    { name: 'Geolocation', icon: <Map />, path: '/driver/geolocation' },
    { name: 'Incidents', icon: <Bell />, path: '/driver/incidents' },
    { name: 'Planning', icon: <TrendingUp />, path: '/driver/planning' },
    { name: 'Profile', icon: <UserIcon />, path: '/driver/profile' },
  ];
  const controllerNavigation = [
    { name: 'Validate Tickets', icon: <Ticket />, path: '/controller/validate' },
    { name: 'Reports', icon: <TrendingUp />, path: '/controller/reports' },
    { name: 'Profile', icon: <UserIcon />, path: '/controller/profile' },
  ];
  
  const navigation = 
    user.role === 'admin' ? adminNavigation :
    user.role === 'driver' ? driverNavigation :
    user.role === 'controller' ? controllerNavigation :
    passengerNavigation;
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">OB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OurBusWay</h1>
              <p className="text-xs text-gray-600 capitalize">{user.role} Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={onNotificationClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#181E4B] to-[#181E4B] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>
            {/* Admin Info and Logout */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex flex-col text-right mr-2">
                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
              <button className="ml-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 flex items-center gap-2 transition-all duration-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileMenuToggle}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">OB</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">OurBusWay</h1>
                  <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
              <button onClick={onMobileMenuToggle} className="text-gray-400 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col items-center justify-center space-y-1">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-[#A54033] to-[#8B2F24] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={onMobileMenuToggle}
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 border border-red-200">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-center gap-2 px-6 py-3 overflow-x-auto">
          {navigation.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-[#A54033] to-[#8B2F24] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}