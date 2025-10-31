import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';

const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
};

export default function ProfilePage() {
  return (
    <DashboardLayout user={mockUser} notificationCount={0}>
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
        </div>
      </div>
    </DashboardLayout>
  );
}
