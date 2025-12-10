import DashboardLayout from '../../DashboardLayout';
import { useState, useEffect } from 'react';
import PurchasedTicket from '../../PurchasedTicket';
import { QrCode } from 'lucide-react';
import authService from '../../../services/authService';
import ticketService, { Ticket } from '../../../services/ticketService';
import routeService, { Route } from '../../../services/routeService';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function TicketsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [routes, setRoutes] = useState<Map<string, Route>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Prevent multiple fetches during same session
    if (hasFetched) return;
    
    const shouldRefresh = searchParams.get('refresh') === 'true';
    
    if (shouldRefresh) {
      console.log('[TicketsPage] Refresh requested from payment success - waiting for webhook processing...');
      // Remove the refresh parameter from URL immediately
      navigate('/passenger/tickets', { replace: true });
      // Wait 2 seconds for webhook to process and create ticket
      setTimeout(() => {
        fetchData();
        setHasFetched(true);
      }, 2000);
    } else {
      // Normal load without delay
      fetchData();
      setHasFetched(true);
    }
  }, []); // Empty dependency array - only run once on mount

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('[TicketsPage] Fetching profile and tickets...');
      
      const [profile, ticketsData] = await Promise.all([
        authService.getProfile(),
        ticketService.getHistory(0, 50)
      ]);
      
      console.log('[TicketsPage] Profile:', profile);
      console.log('[TicketsPage] Tickets:', ticketsData);
      
      setUser(profile);
      setTickets(ticketsData.content);
      
      // Fetch route details for all tickets
      const uniqueRouteIds = [...new Set(ticketsData.content.map(t => t.routeId))];
      console.log('[TicketsPage] Fetching routes:', uniqueRouteIds);
      
      const routeMap = new Map<string, Route>();
      await Promise.all(
        uniqueRouteIds.map(async (routeId) => {
          try {
            const route = await routeService.getRouteById(routeId);
            routeMap.set(routeId, route);
          } catch (err) {
            console.error(`[TicketsPage] Failed to fetch route ${routeId}:`, err);
          }
        })
      );
      
      setRoutes(routeMap);
      console.log('[TicketsPage] Routes loaded:', routeMap);
      console.log('[TicketsPage] Data loaded successfully');
    } catch (err) {
      console.error('[TicketsPage] Failed to fetch data:', err);
      alert('Failed to load tickets. Please check if you are logged in and services are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = async (ticket: any) => {
    try {
      const ticketId = typeof ticket === 'string' ? ticket : (ticket.id || ticket.userId);
      const qrCode = await ticketService.getQRCode(ticketId);
      setQrCodeData(qrCode);
      setSelectedTicket(tickets.find(t => t.id === ticketId) || null);
      setShowQRModal(true);
    } catch (err) {
      console.error('Failed to load QR code:', err);
      alert('Failed to load QR code');
    }
  };

  const currentUser = {
    id: user?.id || '1',
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
    email: user?.email || '',
    role: 'passenger' as const,
  };

  // Show loading state
  if (loading) {
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

  // Show error if user failed to load
  if (!user) {
    return (
      <DashboardLayout user={currentUser} notificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-600">
            <p className="text-xl font-bold mb-2">❌ Erreur de chargement</p>
            <p>Impossible de charger le profil. Vérifiez votre connexion.</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-[#A54033] text-white rounded-lg hover:bg-[#8B3428]"
            >
              Réessayer
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Convert backend tickets to display format with route details
  const purchasedTickets = tickets.map(ticket => {
    const route = routes.get(ticket.routeId);
    
    return {
      id: ticket.id,
      departure: route?.startStation || 'Station de départ',
      arrival: route?.endStation || 'Station d\'arrivée',
      duration: route?.estimatedDuration ? `${route.estimatedDuration} min` : '30 min',
      connections: route?.stations?.length || 0,
      trainType: 'Bus',
      departureStation: route?.startStation || 'Station de départ',
      arrivalStation: route?.endStation || 'Station d\'arrivée',
      price: ticket.price,
      currency: 'DH',
      status: ticket.status.toLowerCase(), // Keep the actual backend status (active, used)
      purchaseDate: new Date(ticket.purchaseDate).toLocaleDateString(),
      qrCode: ticket.id,
      intermediateStations: route?.stations?.map(s => ({
        time: '',
        station: s.name,
        trainType: 'Bus'
      })) || [],
      userId: ticket.userId,
      routeId: ticket.routeId,
    };
  });

  // OLD MOCK DATA - Removed (backend integration complete)

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
      user={currentUser}
      notificationCount={0}
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
        onClick={() => setStatusFilter('used')}
        className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
          statusFilter === 'used'
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-xl scale-105 transform'
            : 'text-gray-600 hover:text-gray-700 hover:bg-white/50'
        }`}
      >
        Used
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
                    {qrCodeData ? (
                      <img src={qrCodeData} alt="QR Code" className="w-full h-full" />
                    ) : (
                      <QrCode className="w-48 h-48 text-navy" />
                    )}
                  </div>
                  <p className="mt-4 font-mono font-bold text-navy">{selectedTicket.id}</p>
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
