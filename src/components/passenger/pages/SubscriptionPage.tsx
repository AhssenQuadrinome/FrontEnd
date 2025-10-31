import DashboardLayout from '../../DashboardLayout';
import { CheckCircle } from 'lucide-react';
import { User, Subscription, Notification } from '../../../types';

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

export default function SubscriptionPage() {
  return (
    <DashboardLayout
      user={mockUser}
      notificationCount={mockNotifications.filter((n) => !n.read).length}
    >
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
                <p className="text-lg font-semibold text-navy">{new Date(mockSubscription.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <p className="text-lg font-semibold text-navy">{new Date(mockSubscription.endDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-cream rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-navy">
                Auto-renewal is <span className="font-semibold">enabled</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
