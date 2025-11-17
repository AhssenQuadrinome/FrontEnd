import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";
import { Bus, MapPin, Users } from "lucide-react";
import { User } from "../../../types";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

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

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "ourbusway2025@outlook.com",
	role: "admin",
};

// Exact Rabat station coordinates on roads (verified to be on actual streets)
const rabatStations = [
  // Line 15: Agdal - Océan (Following Avenue Mohamed VI and coastal road)
  { id: "s1", name: "Agdal", lat: 33.9716, lng: -6.8498, route: "15" }, // On Avenue Ibn Sina
  { id: "s2", name: "Hay Riad", lat: 33.9811, lng: -6.8557, route: "15" }, // On Avenue Annakhil
  { id: "s3", name: "Avenue Annakhil", lat: 33.9889, lng: -6.8612, route: "15" }, // On Avenue Annakhil
  { id: "s4", name: "Place Pietri", lat: 33.9947, lng: -6.8651, route: "15" }, // On Avenue Al Majd
  { id: "s5", name: "Bab El Had", lat: 34.0017, lng: -6.8698, route: "15" }, // On Avenue Hassan II
  { id: "s6", name: "Avenue Al Marsa", lat: 34.0089, lng: -6.8634, route: "15" }, // On Avenue Al Marsa
  { id: "s7", name: "Plage de Rabat", lat: 34.0158, lng: -6.8521, route: "15" }, // On coastal road
  
  // Line 8: Gare - Akkari - Témara (Following Avenue Hassan II and main roads)
  { id: "s8", name: "Gare Rabat Ville", lat: 34.0129, lng: -6.8316, route: "8" }, // In front of train station on Avenue Mohammed V
  { id: "s9", name: "Bab Chellah", lat: 34.0067, lng: -6.8267, route: "8" }, // On Avenue Yacoub El Mansour
  { id: "s10", name: "Avenue Moulay Youssef", lat: 33.9963, lng: -6.8234, route: "8" }, // On Avenue Moulay Youssef
  { id: "s11", name: "Akkari", lat: 33.9802, lng: -6.8156, route: "8" }, // On Avenue Mehdi Ben Barka
  { id: "s12", name: "Yacoub El Mansour", lat: 33.9612, lng: -6.8423, route: "8" }, // On main road
  { id: "s13", name: "Témara Centre", lat: 33.9284, lng: -6.9067, route: "8" }, // On Avenue Hassan II Témara
  
  // Line 22: Salé - Rabat Centre (Following main roads and bridge)
  { id: "s14", name: "Tabriquet (Salé)", lat: 34.0501, lng: -6.7945, route: "22" }, // On Avenue Prince Héritier
  { id: "s15", name: "Bab Lamrissa", lat: 34.0432, lng: -6.8018, route: "22" }, // On Avenue Hassan II Salé
  { id: "s16", name: "Place Bab Fès", lat: 34.0378, lng: -6.8123, route: "22" }, // On Rue Bab Fès
  { id: "s17", name: "Pont Hassan II", lat: 34.0298, lng: -6.8187, route: "22" }, // On bridge over Bouregreg
  { id: "s18", name: "Bab El Alou", lat: 34.0213, lng: -6.8264, route: "22" }, // On Avenue Mohammed V
  { id: "s19", name: "Place des Alaouites", lat: 34.0156, lng: -6.8334, route: "22" }, // On Boulevard Mohammed V
  { id: "s20", name: "Boulevard Mohamed V", lat: 34.0067, lng: -6.8412, route: "22" }, // On Boulevard Mohammed V
];

// Route trajectories following real roads in Rabat (detailed waypoints) - fallback if API fails
const routeTrajectories: Record<string, Array<[number, number]>> = {
  "15": [
    // Agdal to Plage - Following Avenue Mohamed VI and coastal roads
    [33.9716, -6.8498], // Agdal
    [33.9745, -6.8512],
    [33.9767, -6.8524],
    [33.9789, -6.8538],
    [33.9811, -6.8557], // Hay Riad
    [33.9834, -6.8572],
    [33.9856, -6.8589],
    [33.9878, -6.8603],
    [33.9889, -6.8612], // Avenue Annakhil
    [33.9908, -6.8625],
    [33.9928, -6.8638],
    [33.9947, -6.8651], // Place Pietri
    [33.9967, -6.8664],
    [33.9987, -6.8678],
    [34.0007, -6.8689],
    [34.0017, -6.8698], // Bab El Had
    [34.0034, -6.8693],
    [34.0051, -6.8681],
    [34.0068, -6.8667],
    [34.0078, -6.8655],
    [34.0089, -6.8634], // Avenue Al Marsa
    [34.0106, -6.8608],
    [34.0123, -6.8578],
    [34.0138, -6.8556],
    [34.0148, -6.8539],
    [34.0158, -6.8521], // Plage de Rabat
  ],
  "8": [
    // Gare to Témara - Following Avenue Hassan II and Route de Témara
    [34.0135, -6.8321], // Gare Rabat Ville
    [34.0123, -6.8308],
    [34.0109, -6.8295],
    [34.0095, -6.8283],
    [34.0078, -6.8274],
    [34.0067, -6.8267], // Bab Chellah
    [34.0045, -6.8256],
    [34.0023, -6.8247],
    [34.0001, -6.8241],
    [33.9981, -6.8236],
    [33.9963, -6.8234], // Avenue Moulay Youssef
    [33.9934, -6.8224],
    [33.9904, -6.8208],
    [33.9874, -6.8189],
    [33.9838, -6.8172],
    [33.9802, -6.8156], // Akkari
    [33.9756, -6.8234],
    [33.9712, -6.8312],
    [33.9667, -6.8378],
    [33.9634, -6.8401],
    [33.9612, -6.8423], // Yacoub El Mansour
    [33.9545, -6.8567],
    [33.9478, -6.8712],
    [33.9412, -6.8834],
    [33.9348, -6.8945],
    [33.9284, -6.9067], // Témara Centre
  ],
  "22": [
    // Salé to Boulevard Mohamed V - Following Pont Hassan II
    [34.0501, -6.7945], // Tabriquet (Salé)
    [34.0489, -6.7956],
    [34.0478, -6.7967],
    [34.0467, -6.7978],
    [34.0456, -6.7989],
    [34.0445, -6.8001],
    [34.0432, -6.8018], // Bab Lamrissa
    [34.0421, -6.8034],
    [34.0409, -6.8051],
    [34.0398, -6.8067],
    [34.0389, -6.8089],
    [34.0383, -6.8106],
    [34.0378, -6.8123], // Place Bab Fès
    [34.0367, -6.8139],
    [34.0356, -6.8153],
    [34.0343, -6.8165],
    [34.0329, -6.8174],
    [34.0313, -6.8181],
    [34.0298, -6.8187], // Pont Hassan II (crossing Bouregreg river)
    [34.0282, -6.8197],
    [34.0267, -6.8209],
    [34.0253, -6.8223],
    [34.0238, -6.8238],
    [34.0225, -6.8251],
    [34.0213, -6.8264], // Bab El Alou
    [34.0198, -6.8284],
    [34.0184, -6.8303],
    [34.0171, -6.8319],
    [34.0156, -6.8334], // Place des Alaouites
    [34.0139, -6.8352],
    [34.0121, -6.8371],
    [34.0103, -6.8389],
    [34.0086, -6.8401],
    [34.0067, -6.8412], // Boulevard Mohamed V
  ],
};

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

// Mock real-time bus data with positions on routes
const initialBuses = [
	{
		id: "1",
		number: "BUS-101",
		route: "15",
		routeName: "Ligne Agdal-Océan",
		driver: "Hiba EL OUERKHAOUI",
		status: "active",
		location: { lat: 33.9947, lng: -6.8651 }, // Place Pietri station - on road
		speed: 45,
		passengers: 32,
	},
	{
		id: "2",
		number: "BUS-205",
		route: "8",
		routeName: "Ligne Gare-Témara",
		driver: "Meryem ELFADILI",
		status: "active",
		location: { lat: 34.0129, lng: -6.8316 }, // Gare Rabat Ville - on Avenue Mohammed V
		speed: 38,
		passengers: 28,
	},
	{
		id: "3",
		number: "BUS-312",
		route: "22",
		routeName: "Ligne Salé-Rabat",
		driver: "Essahih Abderrahmane",
		status: "active",
		location: { lat: 34.0298, lng: -6.8187 }, // Pont Hassan II - on bridge
		speed: 42,
		passengers: 25,
	},
];

export default function GeolocationPage() {
	const [buses, setBuses] = useState(initialBuses);
	const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
	const [realRoutes, setRealRoutes] = useState<Record<string, Array<[number, number]>>>({});
	const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
	
	// Fetch real road routes on mount
	useEffect(() => {
		const loadRealRoutes = async () => {
			setIsLoadingRoutes(true);
			const routes: Record<string, [number, number][]> = {};
			
			// Get key stations for each route to fetch roads between them
			const routeStations = {
				"15": rabatStations.filter(s => s.route === "15").map(s => [s.lat, s.lng] as [number, number]),
				"8": rabatStations.filter(s => s.route === "8").map(s => [s.lat, s.lng] as [number, number]),
				"22": rabatStations.filter(s => s.route === "22").map(s => [s.lat, s.lng] as [number, number]),
			};
			
			// Fetch real routes from API
			for (const [routeId, coords] of Object.entries(routeStations)) {
				const realRoute = await fetchRoadRoute(coords);
				routes[routeId] = realRoute;
			}
			
			setRealRoutes(routes);
			setIsLoadingRoutes(false);
		};
		
		loadRealRoutes();
	}, []);
	
	// Simulate real-time bus movement along actual routes
	useEffect(() => {
		const interval = setInterval(() => {
			setBuses(prevBuses =>
				prevBuses.map(bus => {
					// Get the route path for this bus
					const routePath = realRoutes[bus.route] || routeTrajectories[bus.route];
					if (!routePath || routePath.length === 0) return bus;
					
					// Find closest point on route to current bus location
					let closestIndex = 0;
					let minDistance = Infinity;
					
					for (let i = 0; i < routePath.length; i++) {
						const point = routePath[i];
						const distance = Math.sqrt(
							Math.pow(point[0] - bus.location.lat, 2) + 
							Math.pow(point[1] - bus.location.lng, 2)
						);
						if (distance < minDistance) {
							minDistance = distance;
							closestIndex = i;
						}
					}
					
					// Move bus to next point on route (simulate movement)
					const nextIndex = (closestIndex + 1) % routePath.length;
					const nextPoint = routePath[nextIndex];
					
					return {
						...bus,
						location: {
							lat: nextPoint[0],
							lng: nextPoint[1],
						},
						speed: Math.max(20, Math.min(60, bus.speed + (Math.random() - 0.5) * 5)),
					};
				})
			);
		}, 3000);
		
		return () => clearInterval(interval);
	}, [realRoutes]);
	
  const routeColors: Record<string, string> = {
    "15": "#9B392D",
    "8": "#2563eb",
    "22": "#16a34a",
  };
  
  const filteredStations = selectedRoute 
    ? rabatStations.filter(s => s.route === selectedRoute)
    : rabatStations;
    
  const filteredBuses = selectedRoute
    ? buses.filter(b => b.route === selectedRoute)
    : buses;
    
	return (
		<DashboardLayout user={mockUser} notificationCount={3}>
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
							Toutes
						</button>
						<button
							onClick={() => setSelectedRoute("15")}
							className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
								selectedRoute === "15"
									? 'bg-[#9B392D] text-white shadow-lg'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							L15
						</button>
						<button
							onClick={() => setSelectedRoute("8")}
							className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
								selectedRoute === "8"
									? 'bg-blue-600 text-white shadow-lg'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							L8
						</button>
						<button
							onClick={() => setSelectedRoute("22")}
							className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
								selectedRoute === "22"
									? 'bg-green-600 text-white shadow-lg'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							L22
						</button>
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
								<p className="text-2xl font-bold text-gray-900">{filteredBuses.filter((b) => b.status === "active").length}</p>
								<p className="text-xs text-gray-600 font-medium truncate">Bus Actifs</p>
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
								<p className="text-2xl font-bold text-gray-900">
									{filteredBuses.reduce((sum, bus) => sum + bus.passengers, 0)}
								</p>
								<p className="text-xs text-gray-600 font-medium truncate">Passagers</p>
							</div>
						</div>
					</div>
				</div>
				
				{/* Compact Bus List - Floating Style */}
				<div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
					<h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
						<Bus className="w-4 h-4 text-[#9B392D]" />
						Flotte en Temps Réel
					</h4>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
						{filteredBuses.map((bus) => (
							<div
								key={bus.id}
								className="relative p-3 bg-gradient-to-br from-gray-50 to-white rounded-lg hover:shadow-md transition-all border border-gray-200 overflow-hidden"
							>
								{/* Colored accent bar */}
								<div 
									className="absolute top-0 left-0 w-full h-1"
									style={{ backgroundColor: routeColors[bus.route] }}
								></div>
								
								<div className="flex items-start gap-3">
									<div
										className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
										style={{ background: `linear-gradient(135deg, ${routeColors[bus.route]}, ${routeColors[bus.route]}dd)` }}
									>
										<Bus className="w-5 h-5" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<p className="font-bold text-sm text-gray-900 truncate">{bus.number}</p>
											<div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
										</div>
										<p className="text-xs text-gray-600 font-medium truncate mb-1">{bus.routeName}</p>
										<p className="text-xs text-gray-500 truncate">👨‍✈️ {bus.driver}</p>
										<div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
											<div className="flex items-center gap-1">
												<span className="text-xs font-bold" style={{ color: routeColors[bus.route] }}>
													{Math.round(bus.speed)}
												</span>
												<span className="text-xs text-gray-500">km/h</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="text-xs font-bold text-blue-600">{bus.passengers}</span>
												<span className="text-xs text-gray-500">/50</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
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
							
							{/* Route Trajectories - Use real routes if loaded, fallback to static */}
							{Object.entries(isLoadingRoutes ? routeTrajectories : realRoutes).map(([routeId, path]) => {
								if (selectedRoute && selectedRoute !== routeId) return null;
								if (!path || path.length === 0) return null;
								return (
									<Polyline
										key={routeId}
										positions={path as [number, number][]}
										pathOptions={{
											color: routeColors[routeId],
											weight: 6,
											opacity: 0.8,
											lineCap: 'round',
											lineJoin: 'round',
										}}
									/>
								);
							})}
							
							{/* Stations - Precisely on roads */}
							{filteredStations.map((station) => (
								<CircleMarker
									key={station.id}
									center={[station.lat, station.lng]}
									radius={10}
									pathOptions={{
										fillColor: routeColors[station.route],
										fillOpacity: 1,
										color: 'white',
										weight: 4,
									}}
								>
									<Tooltip permanent={false} direction="top" offset={[0, -10]}>
										<div className="text-center">
											<div className="font-bold text-sm">{station.name}</div>
											<div className="text-xs text-gray-600">Ligne {station.route}</div>
										</div>
									</Tooltip>
								</CircleMarker>
							))}
							
							{/* Buses */}
							{filteredBuses.map((bus) => (
								<Marker
									key={bus.id}
									position={[bus.location.lat, bus.location.lng]}
									icon={createBusIcon(routeColors[bus.route])}
								>
									<Popup>
										<div className="p-2">
											<div className="font-bold text-lg mb-2" style={{ color: routeColors[bus.route] }}>
												{bus.number}
											</div>
											<div className="space-y-1 text-sm">
												<div><span className="font-semibold">Ligne:</span> {bus.routeName}</div>
												<div><span className="font-semibold">Conducteur:</span> {bus.driver}</div>
												<div><span className="font-semibold">Vitesse:</span> {Math.round(bus.speed)} km/h</div>
												<div><span className="font-semibold">Passagers:</span> {bus.passengers}/50</div>
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
