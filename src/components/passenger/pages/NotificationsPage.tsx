import DashboardLayout from '../../DashboardLayout';
import { Bell } from 'lucide-react';
import { Notification } from '../../../types';
import { useState, useEffect } from 'react';
import authService from '../../../services/authService';

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

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const currentUser = {
    id: user?.id || '1',
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
    email: user?.email || '',
    role: 'passenger' as const,
  };

  if (loading || !user) {
    return (
      <DashboardLayout user={currentUser} notificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={currentUser}
      notificationCount={mockNotifications.filter((n) => !n.read).length}
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Notifications</h3>
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-md p-6 border ${notification.read ? 'border-cream-dark' : 'border-coral'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${notification.type === 'delay' ? 'bg-red-100' : notification.type === 'cancellation' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  <Bell className={`w-6 h-6 ${notification.type === 'delay' ? 'text-red-600' : notification.type === 'cancellation' ? 'text-orange-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-navy">{notification.title}</h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-coral rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-400">{new Date(notification.sentAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
