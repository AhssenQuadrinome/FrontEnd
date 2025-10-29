import { ReactNode } from 'react';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import { User } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
  navigation: Array<{
    name: string;
    icon: ReactNode;
    active?: boolean;
    onClick: () => void;
  }>;
  notificationCount?: number;
  onNotificationClick?: () => void;
  mobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export default function DashboardLayout({
  children,
  user,
  navigation,
  notificationCount = 0,
  onNotificationClick,
  mobileMenuOpen = false,
  onMobileMenuToggle,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
          {/* Logo Section */}
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                {/* <img src="/logo-pro.png" alt="Logo" className="w-6 h-6 object-contain" /> */}
                <span className="text-xl text-white">OB</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">OurBusWay</h1>
                <p className="text-xs text-gray-400 capitalize">{user.role} Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {navigation.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3 mb-3 p-2 rounded-xl hover:bg-slate-700/30 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-xl transition-all duration-200 border border-red-800/30">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileMenuToggle}></div>
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-xl">🚌</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-white">OurBusWay</h1>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button onClick={onMobileMenuToggle} className="text-gray-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      onMobileMenuToggle?.();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      item.active
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">
              <button
                onClick={onMobileMenuToggle}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 hidden lg:block">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <div className="lg:hidden text-xl font-bold text-gray-900">OurBusWay</div>

              <button
                onClick={onNotificationClick}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}