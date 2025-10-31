import DashboardLayout from '../../DashboardLayout';
import { User, Notification } from '../../../types';
import { useState } from 'react';
import PurchasedTicket from '../../PurchasedTicket';
import { QrCode } from 'lucide-react';

const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
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

export default function TicketsPage() {
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Example purchased tickets data
  const purchasedTickets = [
    {
      departure: 'Rabat Ville',
      arrival: 'Agdal',
      duration: '15 min',
      connections: 1,
      trainType: 'Express',
      departureStation: 'Rabat Ville',
      arrivalStation: 'Agdal',
      price: 20,
      currency: 'MAD',
      status: 'active',
      purchaseDate: '31-10-2025',
      qrCode: 'QR123456789',
      intermediateStations: [
        { station: 'Manssour', time: '', trainType: '' },
      ],
    },
    {
      departure: 'Salé',
      arrival: 'Hay Riad',
      duration: '30 min',
      connections: 2,
      trainType: 'Express',
      departureStation: 'Salé',
      arrivalStation: 'Hay Riad',
      price: 35,
      currency: 'MAD',
      status: 'expired',
      purchaseDate: '30-10-2025',
      qrCode: 'QR987654321',
      intermediateStations: [
        { station: 'Oudayas', time: '', trainType: '' },
        { station: 'Akkari', time: '', trainType: '' },
      ],
    },
    {
      departure: 'Agdal',
      arrival: 'Temara',
      duration: '20 min',
      connections: 1,
      trainType: 'Express',
      departureStation: 'Agdal',
      arrivalStation: 'Temara',
      price: 18,
      currency: 'MAD',
      status: 'active',
      purchaseDate: '29-10-2025',
      qrCode: 'QR555555555',
      intermediateStations: [
        { station: 'Youssoufia', time: '', trainType: '' },
      ],
    },
    {
      departure: 'Sidi Yaacoub',
      arrival: 'Oudayas',
      duration: '25 min',
      connections: 2,
      trainType: 'Express',
      departureStation: 'Sidi Yaacoub',
      arrivalStation: 'Oudayas',
      price: 28,
      currency: 'MAD',
      status: 'active',
      purchaseDate: '28-10-2025',
      qrCode: 'QR444444444',
      intermediateStations: [
        { station: 'Manssour', time: '', trainType: '' },
        { station: 'Rabat Ville', time: '', trainType: '' },
      ],
    },
  ];

  // Handler for QR button click
  const handleShowQR = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowQRModal(true);
  };

  // Filtering logic
  const filteredTickets = purchasedTickets.filter(ticket => {
    // Fix: status comparison should be case-insensitive and allow for string type
    const ticketStatus = (ticket.status || '').toLowerCase();
    const filterStatus = statusFilter.toLowerCase();
    const matchesStatus = filterStatus === 'all' || ticketStatus === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      ticket.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.arrival.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout
      user={mockUser}
      notificationCount={mockNotifications.filter((n) => !n.read).length}
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-navy text-center">My Purchased Tickets</h3>
        {/* Filter Section */}
<div className="mb-8">
  {/* Status Filter - Segmented Control */}
  <div className="flex flex-col items-center gap-6">
    <div className="inline-flex bg-gradient-to-r from-gray-50 to-gray-100 p-1.5 rounded-2xl shadow-lg border border-gray-200">
      <button
        onClick={() => setStatusFilter('all')}
        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          statusFilter === 'all'
            ? 'bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-white shadow-xl scale-105 transform'
            : 'text-gray-600 hover:text-[#1e3a5f] hover:bg-white/50'
        }`}
      >
        All Statuses
      </button>
      <button
        onClick={() => setStatusFilter('active')}
        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          statusFilter === 'active'
            ? 'bg-gradient-to-br from-[#A54033] to-red-600 text-white shadow-xl scale-105 transform'
            : 'text-gray-600 hover:text-[#A54033] hover:bg-white/50'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => setStatusFilter('expired')}
        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          statusFilter === 'expired'
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-xl scale-105 transform'
            : 'text-gray-600 hover:text-gray-700 hover:bg-white/50'
        }`}
      >
        Expired
      </button>
    </div>

    {/* Search Input - Enhanced Design */}
    <div className="relative w-full max-w-md group border border-dashed border-[#A54033] rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#A54033] via-[#1e3a5f] to-[#A54033] rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl shadow-xl">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#1e3a5f]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#A54033]/30 text-gray-700 placeholder-gray-400 font-medium transition-all duration-300"
          placeholder="Search by station..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTickets.map((ticket, idx) => (
              <PurchasedTicket
                key={idx}
                {...ticket}
                onShowQR={() => handleShowQR(ticket)}
              />
            ))}
          </div>
        </div>
        {/* QR Code Modal */}
        {showQRModal && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 m-0 bg-black/50 min-h-screen w-screen top-[-225px] left-0" style={{top: "-25px"}}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-navy mb-2">Ticket QR Code</h3>
                <p className="text-gray-600 mb-6">Show this to the controller</p>
                <div className="bg-cream p-8 rounded-xl mb-6">
                  <div className="w-64 h-64 mx-auto bg-white rounded-lg flex items-center justify-center border-4 border-navy">
                    <QrCode className="w-48 h-48 text-navy" />
                  </div>
                  <p className="mt-4 font-mono font-bold text-navy">{selectedTicket.qrCode}</p>
                </div>
                <button
                  onClick={() => {
                    setShowQRModal(false);
                    setSelectedTicket(null);
                  }}
                  className="w-full px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
