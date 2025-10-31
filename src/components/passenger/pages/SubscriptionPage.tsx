import DashboardLayout from '../../DashboardLayout';
import React, { useState } from 'react';
import { X, QrCode, Bus, Calendar, Zap, MapPin } from 'lucide-react';

// Mock types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Subscription {
  id: string;
  type: 'monthly' | 'yearly';
  passengerType: 'student' | 'young' | 'elder' | 'standard';
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
  subscriptionId: string;
  routeCoverage: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  sentAt: string;
  read: boolean;
  priority: string;
}


const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
};

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    type: 'monthly',
    passengerType: 'student',
    status: 'active',
    startDate: '2025-10-01T00:00:00',
    endDate: '2025-10-31T23:59:59',
    price: 50.0,
    autoRenew: true,
    subscriptionId: 'SUB-2025-4782',
    routeCoverage: 'All Routes',
  },
  {
    id: '2',
    type: 'monthly',
    passengerType: 'young',
    status: 'active',
    startDate: '2025-10-01T00:00:00',
    endDate: '2025-10-31T23:59:59',
    price: 70.0,
    autoRenew: false,
    subscriptionId: 'SUB-2025-3891',
    routeCoverage: 'All Routes',
  },
  {
    id: '3',
    type: 'monthly',
    passengerType: 'elder',
    status: 'active',
    startDate: '2025-10-01T00:00:00',
    endDate: '2025-10-31T23:59:59',
    price: 60.0,
    autoRenew: true,
    subscriptionId: 'SUB-2025-5623',
    routeCoverage: 'All Routes',
  },
  {
    id: '4',
    type: 'monthly',
    passengerType: 'standard',
    status: 'active',
    startDate: '2025-10-01T00:00:00',
    endDate: '2025-10-31T23:59:59',
    price: 100.0,
    autoRenew: true,
    subscriptionId: 'SUB-2025-7834',
    routeCoverage: 'All Routes',
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
];

const passengerTypeConfig = {
  student: {
    label: 'Student Pass',
    badge: 'STUDENT',
    emoji: '🎓',
  },
  young: {
    label: 'Young Pass',
    badge: 'YOUNG',
    emoji: '🌟',
  },
  elder: {
    label: 'Senior Pass',
    badge: 'SENIOR',
    emoji: '👴',
  },
  standard: {
    label: 'Standard Pass',
    badge: 'STANDARD',
    emoji: '🎫',
  },
};

export default function SubscriptionPage() {
  const [showQR, setShowQR] = useState<string | null>(null);

  const toggleQR = (id: string) => {
    setShowQR(showQR === id ? null : id);
  };

  return (
    <DashboardLayout
      user={mockUser}
      notificationCount={mockNotifications.filter((n) => !n.read).length}
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-amber-900">All Subscription Types</h3>
        
        {/* Grid of Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {mockSubscriptions.map((subscription) => {
            const config = passengerTypeConfig[subscription.passengerType];
            const daysRemaining = Math.ceil(
              (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={subscription.id} className="h-full">
                <div className="bg-gradient-to-br from-amber-800 to-amber-950 rounded-2xl shadow-2xl overflow-hidden h-full">
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Bus className="w-6 h-6 text-amber-200" />
                        <span className="text-white font-bold text-lg">Bus Pass</span>
                      </div>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase tracking-wide">
                        Active
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-5xl font-bold text-white">{config.emoji}</span>
                      <div>
                        <p className="text-amber-200 text-xs uppercase tracking-wider">{config.badge}</p>
                        <p className="text-white text-xl font-bold">{config.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-amber-100 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{subscription.routeCoverage}</span>
                    </div>
                  </div>

                  {/* Separator with dots */}
                  <div className="px-6">
                    <div className="border-t border-amber-600 border-dashed"></div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-amber-300 text-xs uppercase tracking-wide mb-1">Valid Until</p>
                        <p className="text-white font-semibold">
                          {new Date(subscription.endDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-amber-300 text-xs mt-1">{daysRemaining} days left</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-300 text-xs uppercase tracking-wide mb-1">Price</p>
                        <p className="text-white text-2xl font-bold">${subscription.price}</p>
                        <p className="text-amber-300 text-xs mt-1 capitalize">per {subscription.type === 'monthly' ? 'month' : 'year'}</p>
                      </div>
                    </div>

                    {subscription.autoRenew && (
                      <div className="flex items-center gap-2 bg-amber-900 bg-opacity-50 rounded-lg p-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <p className="text-amber-100 text-xs">Auto-renewal enabled</p>
                      </div>
                    )}

           {!subscription.autoRenew && (
                      <div className="flex items-center gap-2 bg-amber-900 bg-opacity-50 rounded-lg p-2">
                        <X className="w-4 h-4 text-yellow-400" />
                        <p className="text-amber-100 text-xs">Auto-renewal disabled</p>
                      </div>
                    )}

                    <button
                      onClick={() => toggleQR(subscription.id)}
                      className="w-full bg-white hover:bg-amber-50 text-amber-900 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                    >
                      <QrCode className="w-5 h-5" />
                      {showQR === subscription.id ? 'Hide QR Code' : 'Show QR Code'}
                    </button>

                    {showQR === subscription.id && (
                      <div className="bg-white p-6 rounded-lg text-center mt-3">
                        <div className="inline-block">
                          <div className="w-40 h-40 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-28 h-28 text-amber-800" />
                          </div>
                        </div>
                        <p className="text-amber-900 text-sm font-semibold mt-3">Scan to validate</p>
                        <p className="text-gray-500 text-xs mt-1">ID: {subscription.subscriptionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}