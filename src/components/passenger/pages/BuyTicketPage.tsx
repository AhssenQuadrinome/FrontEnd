import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import Ticket from '../../Ticket';
import authService from '../../../services/authService';
import routeService, { Route } from '../../../services/routeService';
import ticketService from '../../../services/ticketService';
import { useNavigate } from 'react-router-dom';

export default function BuyTicketPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [allStations, setAllStations] = useState<string[]>([]);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('[BuyTicketPage] Fetching profile and routes...');
      
      const [profile, routesData] = await Promise.all([
        authService.getProfile(),
        routeService.getAllRoutes(0, 100)
      ]);
      
      console.log('[BuyTicketPage] Profile:', profile);
      console.log('[BuyTicketPage] Routes:', routesData);
      
      setUser(profile);
      const activeRoutes = routesData.content.filter(r => r.active);
      setRoutes(activeRoutes);
      
      // Extract all unique stations from routes
      const stations = new Set<string>();
      activeRoutes.forEach(route => {
        stations.add(route.startStation);
        stations.add(route.endStation);
        route.stations?.forEach(s => stations.add(s.name));
      });
      setAllStations(Array.from(stations).sort());
      
      console.log('[BuyTicketPage] Data loaded successfully');
    } catch (err) {
      console.error('[BuyTicketPage] Failed to fetch data:', err);
      alert('Failed to load data. Please check if you are logged in and services are running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) {
      alert('Veuillez sélectionner les deux stations');
      return;
    }
    if (fromStation === toStation) {
      alert('Les stations de départ et d\'arrivée doivent être différentes');
      return;
    }

    // Find routes that connect these stations
    const matching = routes.filter(route => {
      // Direct route
      if (route.startStation === fromStation && route.endStation === toStation) {
        return true;
      }
      // Route with intermediate stations
      if (route.stations && route.stations.length > 0) {
        const stationNames = route.stations.map(s => s.name);
        const fromIndex = stationNames.indexOf(fromStation);
        const toIndex = stationNames.indexOf(toStation);
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
      }
      return false;
    });

    setAvailableRoutes(matching);
    setShowResults(true);
  };

  const handlePurchase = async (routeId: string, price: number) => {
    if (purchasing) return; // Prevent double-click
    
    try {
      setPurchasing(true);
      console.log('[BuyTicketPage] Purchasing ticket for route:', routeId, 'Price:', price);
      
      const ticket = await ticketService.purchase({
        route: {
          id: routeId,
          price: price
        }
      });
      
      console.log('[BuyTicketPage] Ticket purchased successfully:', ticket);
      alert('✅ Billet acheté avec succès!\n\nVotre billet a été envoyé par email.');
      
      // Redirect to tickets page
      navigate('/passenger/tickets');
    } catch (err: any) {
      console.error('[BuyTicketPage] Purchase failed:', err);
      const errorMessage = err.response?.data?.message || 'Échec de l\'achat du billet';
      alert(`❌ Erreur: ${errorMessage}`);
    } finally {
      setPurchasing(false);
    }
  };

  const currentUser = {
    id: user?.id || '1',
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
    email: user?.email || '',
    role: 'passenger' as const,
  };

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

  return (
    <DashboardLayout user={currentUser} notificationCount={0}>
      <div className="max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-navy">Acheter un billet</h2>
        
        {/* Station Selection */}
        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Station de départ</label>
            <select
              className="w-full border border-[#A54033] bg-[#A54033]/10 text-navy font-bold rounded-lg px-3 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-[#A54033]"
              value={fromStation}
              onChange={e => setFromStation(e.target.value)}
            >
              <option value="">Sélectionnez une station</option>
              {allStations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Station d'arrivée</label>
            <select
              className="w-full border border-[#A54033] bg-[#A54033]/10 text-navy font-bold rounded-lg px-3 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-[#A54033]"
              value={toStation}
              onChange={e => setToStation(e.target.value)}
            >
              <option value="">Sélectionnez une station</option>
              {allStations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-[#A54033] text-white font-bold py-3 rounded-lg hover:bg-[#8B3428] transition-colors"
          >
            Rechercher des lignes
          </button>
        </div>

        {/* Available Routes */}
        {showResults && (
          <div className="space-y-6">
            {availableRoutes.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                Aucune ligne disponible pour ce trajet
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-navy">
                  {availableRoutes.length} ligne(s) disponible(s)
                </h3>
                {availableRoutes.map(route => (
                  <Ticket
                    key={route.id}
                    routeId={route.id}
                    departure={route.startStation}
                    arrival={route.endStation}
                    duration={`${route.estimatedDuration} min`}
                    connections={route.stations?.length || 0}
                    trainType="Bus"
                    departureStation={route.startStation}
                    arrivalStation={route.endStation}
                    price={route.price}
                    currency="DH"
                    passengers={1}
                    imminent={false}
                    intermediateStations={route.stations?.map((s: any) => ({
                      time: '',
                      station: s.name,
                      trainType: 'Bus',
                    })) || []}
                    onPurchase={handlePurchase}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
