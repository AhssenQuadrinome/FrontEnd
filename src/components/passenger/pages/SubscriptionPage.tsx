import DashboardLayout from '../../DashboardLayout';
import { CheckCircle } from 'lucide-react';
import { User, Subscription, Notification } from '../../../types';
import { Bus, Calendar, CreditCard, Shield, QrCode } from 'lucide-react';
import { useState } from 'react';

const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
};

const mockSubscription: Subscription = {
  id: '1',
  type: 'monthly',
  status: 'active',
  startDate: '2025-10-01T00:00:00',
  endDate: '2025-10-31T23:59:59',
  price: 50.0,
  autoRenew: true,
};

// Add missing mockSubscription.cardNumber and routeCoverage
mockSubscription.cardNumber = mockSubscription.cardNumber || '1234 5678 9012 3456';
mockSubscription.routeCoverage = mockSubscription.routeCoverage || 'All Rabat city routes';

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
];

const subscriptionTypeConfig = {
  monthly: {
    color: 'from-yellow-400 to-orange-400',
    icon: <Bus className="inline w-8 h-8" />,
    label: 'Monthly Pass',
    discount: '10% off for auto-renew',
  },
  yearly: {
    color: 'from-blue-400 to-indigo-400',
    icon: <Bus className="inline w-8 h-8" />,
    label: 'Yearly Pass',
    discount: '15% off for auto-renew',
  },
};
const config = subscriptionTypeConfig[mockSubscription.type] || subscriptionTypeConfig.monthly;

export default function SubscriptionPage() {
  const [showQR, setShowQR] = useState(false);

  // Calculate days remaining
  const today = new Date();
  const endDate = new Date(mockSubscription.endDate);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <DashboardLayout
      user={mockUser}
      notificationCount={mockNotifications.filter((n) => !n.read).length}
    >
   <div className="space-y-6">
        <h3 className="text-2xl font-bold text-amber-900">My Subscription</h3>
        
        {/* Unique Subscription Card Design */}
        <div className="relative max-w-2xl">
          {/* Card Container with Ticket Perforation Effect */}
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Decorative Corner Patterns */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="0" cy="0" r="80" fill="currentColor" className="text-amber-900" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="currentColor" className="text-amber-900" />
              </svg>
            </div>

            {/* Main Card Header with Gradient */}
            <div className={`relative bg-gradient-to-br ${config.color} p-8 text-white overflow-hidden`}>
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                }}></div>
              </div>

              {/* Bus Icon Watermark */}
              <Bus className="absolute right-4 top-4 w-24 h-24 opacity-20" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{config.icon}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-90 mb-1">Bus Pass</p>
                      <h4 className="text-2xl font-bold">{config.label}</h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white border-opacity-30">
                    {mockSubscription.status.toUpperCase()}
                  </span>
                </div>

                {/* Card Number with Chip Design */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center shadow-lg">
                    <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Card Number</p>
                    <p className="font-mono text-sm tracking-wider">{mockSubscription.cardNumber}</p>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="mt-6">
                  <p className="text-xs opacity-75 mb-1">Cardholder</p>
                  <p className="text-lg font-semibold uppercase tracking-wide">{mockUser.name}</p>
                </div>
              </div>
            </div>

            {/* Perforated Divider */}
            <div className="relative h-6 bg-white">
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-amber-50"></div>
                ))}
              </div>
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-50"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-50"></div>
            </div>

            {/* Card Details Section */}
            <div className="p-8 space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Validity</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(mockSubscription.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    to {new Date(mockSubscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-amber-700 font-semibold mt-2">{daysRemaining} days remaining</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-amber-700" />
                    <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Plan</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-900">${mockSubscription.price}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {mockSubscription.type} billing
                  </p>
                  <p className="text-xs text-green-600 font-semibold mt-2">{config.discount}</p>
                </div>
              </div>

              {/* Coverage Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-blue-700 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900 mb-1">Route Coverage</p>
                    <p className="text-sm text-gray-700">{mockSubscription.routeCoverage}</p>
                    <p className="text-xs text-gray-600 mt-1">Valid on all city bus routes and express lines</p>
                  </div>
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              {/* Auto-Renew Status */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900">
                    Auto-renewal {mockSubscription.autoRenew ? 'enabled' : 'disabled'}
                  </p>
                  {mockSubscription.autoRenew && (
                    <p className="text-xs text-gray-600 mt-1">
                      Your pass will automatically renew on {new Date(mockSubscription.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* QR Code Button */}
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>

              {/* QR Code Display */}
              {showQR && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-dashed border-amber-300 text-center">
                  <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                    <div className="w-48 h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-amber-800" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 font-medium">Scan this code to validate your pass</p>
                  <p className="text-xs text-gray-500 mt-2">Valid for entry on all supported routes</p>
                </div>
              )}
            </div>
          </div>

          {/* Card Shadow Effect */}
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-amber-900 opacity-10 blur-xl rounded-full"></div>
        </div>
      </div>
    </DashboardLayout>
  );
}
