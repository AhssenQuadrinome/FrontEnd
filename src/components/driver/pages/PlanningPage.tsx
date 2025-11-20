import { Calendar, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';

const mockUser: User = {
  id: '2',
  name: 'Hiba EL OUERKHAOUI',
  email: 'hiba.elouerkaoui@mybus.com',
  role: 'driver',
};

export default function PlanningPage() {
  return (
    <DashboardLayout user={mockUser} notificationCount={2}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy">Personal Planning & History</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl shadow-lg p-6 text-white">
            <Calendar className="w-10 h-10 mb-4" />
            <p className="text-3xl font-bold mb-2">24</p>
            <p className="text-sm opacity-90">Trips This Week</p>
          </div>

          <div className="bg-gradient-to-br from-coral to-coral-dark rounded-xl shadow-lg p-6 text-white">
            <Clock className="w-10 h-10 mb-4" />
            <p className="text-3xl font-bold mb-2">96%</p>
            <p className="text-sm opacity-90">On-Time Rate</p>
          </div>

          <div className="bg-gradient-to-br from-burgundy to-burgundy-dark rounded-xl shadow-lg p-6 text-white">
            <CheckCircle className="w-10 h-10 mb-4" />
            <p className="text-3xl font-bold mb-2">182</p>
            <p className="text-sm opacity-90">Total Trips</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="text-xl font-bold text-navy mb-6">Recent Trip History</h4>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-cream rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center text-white font-bold">
                    {27 - i}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Line 15 - City Center Route</p>
                    <p className="text-sm text-gray-600">October {27 - i}, 2025</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
