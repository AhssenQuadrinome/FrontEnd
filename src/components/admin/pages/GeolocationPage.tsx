import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";
import { Bus, MapPin, Users } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import routeService, { Route } from '../../../services/routeService';
import authService from '../../../services/authService';

interface DriverLocation {
  driverId: string;
  driverName: string;
  driverEmail: string;
  latitude: number;
  longitude: number;
  busNumber?: string;
  speed: number;
  timestamp: string;
  isActive: boolean;
}

// Fetch real road route between coordinates using OSRM (free, no API key needed)
async function fetchRoadRoute(coordinates: [number, number][]): Promise<[number, number][]> {
  try {
    // OSRM expects coordinates as lng,lat separated by semicolons
    const coordString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.warn('OSRM API failed, using direct coordinates');
      return coordinates;
    }

    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.warn('No route found, using direct coordinates');
      return coordinates;
    }
    
    const routeCoords = data.routes[0].geometry.coordinates;
    // Convert from [lng, lat] to [lat, lng] format
    return routeCoords.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
  } catch (error) {
    console.warn('Error fetching route, using direct coordinates:', error);
    return coordinates;
  }
}

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export type UserRole = "admin" | "driver" | "controller" | "passenger";

interface StationWithRoute {
  id: string;
  name: string;
  lat: number;
  lng: number;
  route: string;
  code: string;
}

// Create custom bus icon that looks like an actual bus
const createBusIcon = (color: string) => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="40" height="40" viewBox="0 0 64 64" style="filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
          <!-- Bus Body -->
          <rect x="8" y="18" width="48" height="32" rx="4" fill="${color}" stroke="white" stroke-width="2"/>
          
          <!-- Bus Windows -->
          <rect x="12" y="22" width="18" height="12" rx="2" fill="white" opacity="0.9"/>
          <rect x="34" y="22" width="18" height="12" rx="2" fill="white" opacity="0.9"/>
          
          <!-- Bus Wheels -->
          <circle cx="18" cy="52" r="5" fill="#333" stroke="white" stroke-width="1.5"/>
          <circle cx="18" cy="52" r="2" fill="#666"/>
          <circle cx="46" cy="52" r="5" fill="#333" stroke="white" stroke-width="1.5"/>
          <circle cx="46" cy="52" r="2" fill="#666"/>
          
          <!-- Bus Front Lights -->
          <circle cx="14" cy="48" r="2" fill="#FFE66D"/>
          <circle cx="50" cy="48" r="2" fill="#FFE66D"/>
          
          <!-- Bus Door -->
          <rect x="28" y="38" width="8" height="12" rx="1" fill="#444"/>
          
          <!-- Route Number Badge -->
          <circle cx="32" cy="14" r="8" fill="white" stroke="${color}" stroke-width="2"/>
          <text x="32" y="18" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">BUS</text>
        </svg>
        
        <!-- Active Status Indicator -->
        <div style="
          position: absolute;
          top: -4px;
          right: -4px;
          background: #10b981;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      </style>
    `,
    className: 'custom-bus-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

export default function GeolocationPage() {
	const [routes, setRoutes] = useState<Route[]>([]);
	const [stations, setStations] = useState<StationWithRoute[]>([]);
	const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
	const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
	const [realRoutes, setRealRoutes] = useState<Record<string, Array<[number, number]>>>({});
	const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
	const [currentUser, setCurrentUser] = useState<any>(null);
	
	// Fetch user profile
	useEffect(() => {
		const loadUser = async () => {
			try {
				const profile = await authService.getProfile();
				setCurrentUser(profile);
			} catch (error) {
				console.error('Failed to load user profile:', error);
			}
		};
		loadUser();
	}, []);
	
	// Fetch routes and stations
	useEffect(() => {
		const loadRoutesAndStations = async () => {
			try {
				// Fetch routes (paginated, get all by setting large size)
				const routesResponse = await routeService.getAllRoutes(0, 100);
				setRoutes(routesResponse.content);
				
				// Fetch all stations with coordinates
				const stationsResponse = await routeService.getAllStations(0, 1000);
				const stationsMap = new Map(stationsResponse.content.map(s => [s.id, s]));
				
				// Build stations with route info from all routes
				const allStations: StationWithRoute[] = [];
				routesResponse.content.forEach(route => {
					route.stations.forEach(routeStation => {
						const stationDetails = stationsMap.get(routeStation.stationId);
						if (stationDetails) {
							allStations.push({
								id: routeStation.stationId,
								name: routeStation.name,
								code: routeStation.code,
								route: route.id,
								lat: stationDetails.latitude,
								lng: stationDetails.longitude,
							});
						}
					});
				});
				setStations(allStations);
			} catch (error) {
				console.error('Failed to load routes and stations:', error);
			}
		};
		loadRoutesAndStations();
	}, []);
	
	// Load driver locations from localStorage
	useEffect(() => {
		const loadDriverLocations = () => {
			const locations: DriverLocation[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key?.startsWith('driver_location_')) {
					try {
						const data = JSON.parse(localStorage.getItem(key) || '{}');
						if (data.isActive && data.latitude && data.longitude) {
							locations.push(data);
						}
					} catch (error) {
						console.error('Failed to parse driver location:', error);
					}
				}
			}
			setDriverLocations(locations);
		};
		
		loadDriverLocations();
		
		// Refresh driver locations every 5 seconds
		const interval = setInterval(loadDriverLocations, 5000);
		return () => clearInterval(interval);
	}, []);
	
	// Fetch real road routes on mount
	useEffect(() => {
		const loadRealRoutes = async () => {
			if (stations.length === 0) return;
			
			setIsLoadingRoutes(true);
			const routesMap: Record<string, [number, number][]> = {};
			
			// Get key stations for each route to fetch roads between them
			const routeStations: Record<string, [number, number][]> = {};
			stations.forEach(station => {
				if (!routeStations[station.route]) {
					routeStations[station.route] = [];
				}
				routeStations[station.route].push([station.lat, station.lng]);
			});
			
			// Fetch real routes from API
			for (const [routeId, coords] of Object.entries(routeStations)) {
				const realRoute = await fetchRoadRoute(coords);
				routesMap[routeId] = realRoute;
			}
			
			setRealRoutes(routesMap);
			setIsLoadingRoutes(false);
		};
		
		loadRealRoutes();
	}, [stations]);
	
  // Generate colors for routes dynamically
  const getRouteColor = (routeId: string) => {
    const colors = ['#9B392D', '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899'];
    const hash = routeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const filteredStations = selectedRoute 
    ? stations.filter(s => s.route === selectedRoute)
    : stations;
    
  // For now, show all drivers regardless of route selection
  // In the future, you could filter by route if busNumber or route info is added to driver location
  const filteredDrivers = driverLocations;
    
	if (!currentUser) {
		return <div className="flex items-center justify-center h-screen">Loading...</div>;
	}

	// Map user to DashboardLayout format
	const dashboardUser = {
		id: currentUser.id,
		name: `${currentUser.firstName} ${currentUser.lastName}`,
		email: currentUser.email,
		role: currentUser.role,
	};

	return (
		<DashboardLayout user={dashboardUser} notificationCount={3}>
			<div className="space-y-4">
				{/* Header with Route Filters */}
				<div className="flex items-center justify-between">
					<h3 className="text-2xl font-bold text-gray-900">Géolocalisation en Temps Réel</h3>
					<div className="flex gap-2">
						<button
							onClick={() => setSelectedRoute(null)}
							className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
								!selectedRoute
									? 'bg-[#9B392D] text-white shadow-lg'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							Toutes les Routes
						</button>
						{routes.map(route => (
							<button
								key={route.id}
								onClick={() => setSelectedRoute(route.id)}
								className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
									selectedRoute === route.id
										? 'bg-[#9B392D] text-white shadow-lg'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
								}`}
							>
								{route.number}
							</button>
						))}
					</div>
				</div>
				
				{/* Compact Stats Cards */}
				<div className="grid grid-cols-3 gap-3">
					<div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-sm border border-green-200 p-3 hover:shadow-md transition-all">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<Bus className="w-5 h-5 text-green-600" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-2xl font-bold text-gray-900">{filteredDrivers.length}</p>
								<p className="text-xs text-gray-600 font-medium truncate">Chauffeurs Actifs</p>
							</div>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-red-50 to-white rounded-lg shadow-sm border border-red-200 p-3 hover:shadow-md transition-all">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-[#9B392D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
								<MapPin className="w-5 h-5 text-[#9B392D]" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-2xl font-bold text-gray-900">{filteredStations.length}</p>
								<p className="text-xs text-gray-600 font-medium truncate">Stations</p>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-sm border border-blue-200 p-3 hover:shadow-md transition-all">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<Users className="w-5 h-5 text-blue-600" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-2xl font-bold text-gray-900">{routes.length}</p>
								<p className="text-xs text-gray-600 font-medium truncate">Routes</p>
							</div>
						</div>
					</div>
				</div>
				
				{/* Compact Driver List - Floating Style */}
				<div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
					<h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
						<Bus className="w-4 h-4 text-[#9B392D]" />
						Chauffeurs Actifs ({filteredDrivers.length})
					</h4>
					{filteredDrivers.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
							<p>Aucun chauffeur actif pour le moment</p>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
							{filteredDrivers.map((driver) => (
								<div
									key={driver.driverId}
									className="relative p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg hover:shadow-md transition-all border border-gray-200 overflow-hidden"
								>
									{/* Colored accent bar */}
									<div 
										className="absolute top-0 left-0 w-full h-1 bg-green-500"
									></div>
									
									<div className="flex items-start gap-3">
										<div
											className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 bg-gradient-to-br from-green-600 to-green-700"
										>
											<Bus className="w-5 h-5" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-bold text-sm text-gray-900 truncate">{driver.driverName}</p>
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
											</div>
											<p className="text-xs text-gray-600 truncate mb-1">{driver.driverEmail}</p>
											{driver.busNumber && (
												<p className="text-xs text-gray-500 truncate">� Bus: {driver.busNumber}</p>
											)}
											<div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
												<div className="flex items-center gap-1">
													<span className="text-xs font-bold text-green-600">
														{Math.round(driver.speed)}
													</span>
													<span className="text-xs text-gray-500">km/h</span>
												</div>
												<div className="text-xs text-gray-500">
													{new Date(driver.timestamp).toLocaleTimeString()}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Interactive Map */}
				<div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
					<div className="h-[700px] relative">
						{isLoadingRoutes && (
							<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border border-[#9B392D]">
								<div className="flex items-center gap-2">
									<div className="w-3 h-3 border-2 border-[#9B392D] border-t-transparent rounded-full animate-spin"></div>
									<span className="text-xs font-semibold text-gray-700">Chargement des routes...</span>
								</div>
							</div>
						)}
						<MapContainer
							center={[33.9716, -6.8498]}
							zoom={12}
							style={{ height: '100%', width: '100%' }}
							zoomControl={true}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							
							{/* Route Trajectories */}
							{!isLoadingRoutes && Object.entries(realRoutes).map(([routeId, path]) => {
								if (selectedRoute && selectedRoute !== routeId) return null;
								if (!path || path.length === 0) return null;
								return (
									<Polyline
										key={routeId}
										positions={path as [number, number][]}
										pathOptions={{
											color: getRouteColor(routeId),
											weight: 6,
											opacity: 0.8,
											lineCap: 'round',
											lineJoin: 'round',
										}}
									/>
								);
							})}
							
							{/* Stations */}
							{filteredStations.map((station) => (
								<CircleMarker
									key={station.id}
									center={[station.lat, station.lng]}
									radius={8}
									pathOptions={{
										fillColor: getRouteColor(station.route),
										fillOpacity: 1,
										color: 'white',
										weight: 3,
									}}
								>
									<Tooltip permanent={false} direction="top" offset={[0, -10]}>
										<div className="text-center">
											<div className="font-bold text-sm">{station.name}</div>
											<div className="text-xs text-gray-600">{station.code}</div>
										</div>
									</Tooltip>
								</CircleMarker>
							))}
							
							{/* Active Drivers */}
							{filteredDrivers.map((driver) => (
								<Marker
									key={driver.driverId}
									position={[driver.latitude, driver.longitude]}
									icon={createBusIcon(getRouteColor(driver.driverId))}
								>
									<Popup>
										<div className="p-2">
											<div className="font-bold text-lg mb-2 text-green-600">
												{driver.driverName}
											</div>
											<div className="space-y-1 text-sm">
												<div><span className="font-semibold">Email:</span> {driver.driverEmail}</div>
												{driver.busNumber && (
													<div><span className="font-semibold">Bus:</span> {driver.busNumber}</div>
												)}
												<div><span className="font-semibold">Vitesse:</span> {Math.round(driver.speed)} km/h</div>
												<div><span className="font-semibold">Position:</span> {driver.latitude.toFixed(6)}, {driver.longitude.toFixed(6)}</div>
												<div><span className="font-semibold">Dernière mise à jour:</span> {new Date(driver.timestamp).toLocaleString()}</div>
												<div className="flex items-center gap-2 mt-2">
													<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
													<span className="text-green-600 font-semibold">En Service</span>
												</div>
											</div>
										</div>
									</Popup>
								</Marker>
							))}
						</MapContainer>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
