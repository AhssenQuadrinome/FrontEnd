import { useState, useEffect } from 'react';
import {
  Users,
  Bus,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Map,
  Clock,
  DollarSign,
  Activity,
  Navigation,
  ChevronUp,
  ChevronDown,
  X,
  Search,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import DashboardLayout from '../../DashboardLayout';
import routeService, { Route as BackendRoute, StationOption, ServicePeriodType } from '../../../services/routeService';
import authService from '../../../services/authService';
import { toast } from 'sonner';

export type UserRole = "admin" | "driver" | "controller" | "passenger";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Station {
  id: string;
  name: string;
  order: number;
}

interface Route {
  id: string;
  name: string;
  number: string;
  stations: number;
  stationsList?: Station[];
  status: "active" | "inactive" | "maintenance";
  buses: number;
  startPoint: string;
  endPoint: string;
  avgDuration: string;
  frequency: string;
  distance?: number;
  occupancy?: number;
  onTime?: number;
  passengers?: number;
  revenue?: number;
}

export default function RoutesPage() {
  // Backend state
  const [routes, setRoutes] = useState<Route[]>([]);
  const [availableStations, setAvailableStations] = useState<StationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState<Partial<Route>>({});
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stationInput, setStationInput] = useState("");
  const [stationSearchQuery, setStationSearchQuery] = useState("");

  // Fetch user profile
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      authService.getProfile()
        .then(profile => {
          const roleMap: Record<string, UserRole> = {
            'ADMINISTRATOR': 'admin',
            'DRIVER': 'driver',
            'CONTROLLER': 'controller',
            'PASSENGER': 'passenger'
          };
          setCurrentUser({
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            role: roleMap[profile.role] || profile.role.toLowerCase() as UserRole
          });
        })
        .catch(() => {
          setCurrentUser({
            id: user.id,
            name: "Admin User",
            email: user.email,
            role: 'admin'
          });
        });
    }
  }, []);
  
  // Fetch routes and stations from backend
  useEffect(() => {
    fetchRoutes();
    fetchStations();
  }, []);
  
  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await routeService.getAllRoutes(0, 100);
      // Convert backend routes to UI format
      const uiRoutes: Route[] = response.content.map(r => convertBackendToUIRoute(r));
      setRoutes(uiRoutes);
    } catch (err: any) {
      console.error('Failed to fetch routes:', err);
      toast.error('Failed to load routes', {
        description: err.response?.data?.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStations = async () => {
    try {
      const response = await routeService.getAllStations(0, 1000);
      setAvailableStations(response.content);
    } catch (err: any) {
      console.error('Failed to fetch stations:', err);
      toast.error('Failed to load stations');
    }
  };
  
  // Convert backend route to UI route format
  const convertBackendToUIRoute = (backendRoute: BackendRoute): Route => {
    const frequencyMin = backendRoute.config?.frequencyMinutes || 15;
    const durationMin = backendRoute.estimatedDuration || 0;
    
    return {
      id: backendRoute.id,
      name: backendRoute.name,
      number: backendRoute.number,
      stations: backendRoute.stations?.length || 0,
      stationsList: backendRoute.stations?.map(s => ({
        id: s.stationId,
        name: s.name,
        order: s.sequenceOrder
      })) || [],
      status: backendRoute.active ? "active" : "inactive",
      buses: backendRoute.config?.busCount || 0,
      startPoint: backendRoute.startStation,
      endPoint: backendRoute.endStation,
      avgDuration: durationMin < 60 ? `${durationMin} min` : `${Math.floor(durationMin / 60)}h ${durationMin % 60}min`,
      frequency: frequencyMin < 60 ? `Toutes les ${frequencyMin} min` : `Toutes les ${Math.floor(frequencyMin / 60)}h`,
      distance: backendRoute.distance,
      occupancy: 70, // Mock data for now
      onTime: 85, // Mock data for now
      passengers: 1000, // Mock data for now
      revenue: Math.round(backendRoute.price * 100), // Mock calculation
    };
  };

  const handleAddStation = (stationId?: string) => {
    // If stationId provided, add from available stations
    if (stationId) {
      const station = availableStations.find(s => s.id === stationId);
      if (station && !(formData.stationsList || []).find(s => s.id === stationId)) {
        const currentStations = formData.stationsList || [];
        const newStation: Station = {
          id: station.id,
          name: station.name,
          order: currentStations.length,
        };
        setFormData({
          ...formData,
          stationsList: [...currentStations, newStation],
          stations: currentStations.length + 1,
        });
        setStationSearchQuery("");
      }
      return;
    }
    
    // Legacy: add by name (for manual input)
    if (!stationInput.trim()) return;
    
    const currentStations = formData.stationsList || [];
    const newStation: Station = {
      id: `s${Date.now()}`,
      name: stationInput.trim(),
      order: currentStations.length,
    };
    
    setFormData({
      ...formData,
      stationsList: [...currentStations, newStation],
      stations: (formData.stations || 0) + 1,
    });
    setStationInput("");
  };

  const handleRemoveStation = (stationId: string) => {
    const updatedStations = (formData.stationsList || [])
      .filter(s => s.id !== stationId)
      .map((s, idx) => ({ ...s, order: idx }));
    
    setFormData({
      ...formData,
      stationsList: updatedStations,
      stations: updatedStations.length,
    });
  };

  const handleMoveStation = (stationId: string, direction: 'up' | 'down') => {
    const stations = [...(formData.stationsList || [])];
    const index = stations.findIndex(s => s.id === stationId);
    
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stations.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [stations[index], stations[newIndex]] = [stations[newIndex], stations[index]];
    
    const reorderedStations = stations.map((s, idx) => ({ ...s, order: idx }));
    setFormData({ ...formData, stationsList: reorderedStations });
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData(route);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingRoute(null);
    setFormData({
      status: "active",
      stations: 0,
      buses: 0,
      stationsList: [],
    });
    setStationInput("");
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      
      if (!formData.stationsList || formData.stationsList.length < 2) {
        toast.error('Validation Error', {
          description: 'Please select at least 2 stations for the route',
        });
        return;
      }
      
      // Parse frequency and duration
      const frequencyMatch = formData.frequency?.match(/(\d+)/);
      const frequencyMinutes = frequencyMatch ? parseInt(frequencyMatch[1]) : 15;
      
      const durationMatch = formData.avgDuration?.match(/(\d+)/);
      const estimatedDuration = durationMatch ? parseInt(durationMatch[1]) : 30;
      
      // Prepare backend request
      const backendRequest = {
        number: formData.number || "",
        name: formData.name || "",
        description: "",
        active: formData.status === "active",
        startStation: formData.startPoint || "",
        endStation: formData.endPoint || "",
        distance: formData.distance || 10,
        estimatedDuration: estimatedDuration,
        price: (formData.revenue || 2500) / 1000, // Convert back to price
        config: {
          ruleType: ServicePeriodType.DAILY,
          frequencyMinutes: frequencyMinutes,
          enabled: true,
          busCount: formData.buses || 1,
          firstDeparture: "06:00:00",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        stationIds: formData.stationsList.map(s => s.id),
      };
      
      if (editingRoute) {
        await routeService.updateRoute(editingRoute.id, backendRequest);
        toast.success('Route updated successfully!', {
          description: `${formData.name} has been updated.`,
        });
      } else {
        await routeService.createRoute(backendRequest);
        toast.success('Route created successfully!', {
          description: `${formData.name} has been added.`,
        });
      }
      
      setShowModal(false);
      setEditingRoute(null);
      setFormData({});
      fetchRoutes(); // Refresh routes from backend
    } catch (err: any) {
      console.error('Failed to save route:', err);
      toast.error('Failed to save route', {
        description: err.response?.data?.message || 'Please try again',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne?")) {
      // TODO: Implement DELETE /routeMgtApi/routes/{id}
      toast.info('Delete functionality', {
        description: `Backend delete endpoint not yet implemented for route ${id}`,
      });
    }
  };
  
  // Filter stations for search
  const filteredStations = availableStations.filter(station =>
    station.name.toLowerCase().includes(stationSearchQuery.toLowerCase()) ||
    station.code.toLowerCase().includes(stationSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Loading...", email: "", role: "admin" }} notificationCount={3}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading routes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }} notificationCount={3}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Gestion des Lignes</h3>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreate}
                className="bg-[#9B392D] text-white hover:bg-[#7d2e24] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une Nouvelle Ligne
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {editingRoute ? 'Modifier la Ligne' : 'Créer une Nouvelle Ligne'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nom de la Ligne</Label>
                    <Input 
                      placeholder="ex: Ligne Agdal-Océan" 
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Numéro de Ligne</Label>
                    <Input 
                      placeholder="ex: 15" 
                      value={formData.number || ''}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Point de Départ</Label>
                    <Input 
                      placeholder="ex: Agdal" 
                      value={formData.startPoint || ''}
                      onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Point d'Arrivée</Label>
                    <Input 
                      placeholder="ex: Océan (Plage de Rabat)" 
                      value={formData.endPoint || ''}
                      onChange={(e) => setFormData({...formData, endPoint: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre de Stations</Label>
                    <Input 
                      type="number" 
                      placeholder="ex: 12"
                      value={formData.stations || ''}
                      onChange={(e) => setFormData({...formData, stations: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label>Nombre de Bus</Label>
                    <Input 
                      type="number" 
                      placeholder="ex: 8"
                      value={formData.buses || ''}
                      onChange={(e) => setFormData({...formData, buses: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Durée Moyenne</Label>
                    <Input 
                      placeholder="ex: 45 min"
                      value={formData.avgDuration || ''}
                      onChange={(e) => setFormData({...formData, avgDuration: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Fréquence</Label>
                    <Input 
                      placeholder="ex: Toutes les 15 min"
                      value={formData.frequency || ''}
                      onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Station Management Section */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-lg font-bold mb-3 block">Gestion des Stations</Label>
                  
                  {/* Add Station Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input 
                        placeholder="Rechercher une station (nom ou code)..."
                        value={stationSearchQuery}
                        onChange={(e) => setStationSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {stationSearchQuery && (
                      <div className="mt-2 max-h-48 overflow-y-auto border rounded-lg bg-white shadow-lg">
                        {filteredStations.length === 0 ? (
                          <p className="text-sm text-gray-500 p-3">Aucune station trouvée</p>
                        ) : (
                          filteredStations.slice(0, 10).map(station => (
                            <button
                              key={station.id}
                              onClick={() => handleAddStation(station.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                              disabled={(formData.stationsList || []).some(s => s.id === station.id)}
                              type="button"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{station.name}</p>
                                  <p className="text-xs text-gray-500">{station.code} • {station.address}</p>
                                </div>
                                {(formData.stationsList || []).some(s => s.id === station.id) && (
                                  <span className="text-xs text-green-600">Ajoutée</span>
                                )}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stations List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {(formData.stationsList || []).length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4">
                        Aucune station ajoutée. Commencez par ajouter des stations.
                      </p>
                    ) : (
                      (formData.stationsList || [])
                        .sort((a, b) => a.order - b.order)
                        .map((station, index) => (
                          <div 
                            key={station.id}
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#9B392D]/40 transition-colors"
                          >
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveStation(station.id, 'up')}
                                disabled={index === 0}
                                className="h-5 w-5 p-0 hover:bg-gray-200"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMoveStation(station.id, 'down')}
                                disabled={index === (formData.stationsList || []).length - 1}
                                className="h-5 w-5 p-0 hover:bg-gray-200"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-[#9B392D] text-white text-xs font-bold px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <span className="font-medium text-gray-900">{station.name}</span>
                                {index === 0 && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Départ</span>
                                )}
                                {index === (formData.stationsList || []).length - 1 && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Arrivée</span>
                                )}
                              </div>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStation(station.id)}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                  
                  {(formData.stationsList || []).length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Total: {formData.stationsList?.length || 0} stations
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="w-full bg-[#9B392D] text-white hover:bg-[#7d2e24] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>En cours...</span>
                    </div>
                  ) : (
                    editingRoute ? 'Mettre à Jour' : 'Créer la Ligne'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 gap-8">
          {routes.map((route) => (
            <div
              key={route.id}
              className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-[#9B392D]/20 hover:border-[#9B392D]/40 group"
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(180, 83, 9, 0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(120, 53, 15, 0.3) 0%, transparent 50%)`
                }}></div>
              </div>

              {/* Header Section */}
              <div className="relative bg-gradient-to-br from-[#9B392D]/5 via-[#9B392D]/10 to-[#9B392D]/15 p-6 border-b-4 border-[#9B392D]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Route Number Badge */}
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#9B392D] via-[#7d2e24] to-[#5d1f1a] rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300 border-4 border-[#9B392D]/30">
                        {route.number}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-[#9B392D] rounded-full animate-pulse shadow-lg"></div>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-[#9B392D] mb-1">{route.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-[#7d2e24] font-semibold">
                        <MapPin className="w-4 h-4" />
                        <span>{route.startPoint}</span>
                        <Navigation className="w-3 h-3" />
                        <span>{route.endPoint}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                    route.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    route.status === 'maintenance' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white' :
                    'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}>
                    {route.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Journey Path Visualization */}
              <div className="relative p-6 bg-gradient-to-b from-white to-[#9B392D]/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#9B392D] animate-pulse"></div>
                    <span className="text-xs font-bold text-[#9B392D] uppercase tracking-widest">Journey Path</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#9B392D]/10 rounded-full">
                    <Map className="w-3 h-3 text-[#7d2e24]" />
                    <span className="text-xs font-bold text-[#9B392D]">{route.distance || 10} km</span>
                  </div>
                </div>
                
                {/* Enhanced Path with Journey Feel */}
                <div className="relative bg-gradient-to-r from-[#9B392D]/10 via-[#9B392D]/5 to-[#9B392D]/10 rounded-2xl p-6 shadow-inner border-2 border-[#9B392D]/20">
                  {/* Animated road texture */}
                  <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
                    <div className="h-full w-full" style={{
                      backgroundImage: `repeating-linear-gradient(90deg, 
                        transparent, transparent 10px, 
                        rgba(180, 83, 9, 0.3) 10px, 
                        rgba(180, 83, 9, 0.3) 20px)`
                    }}></div>
                  </div>

                  <div className="relative">
                    {/* Main Journey Line */}
                    <div className="absolute top-1/2 left-8 right-8 h-3 bg-gradient-to-r from-[#9B392D] via-[#7d2e24] to-[#9B392D] rounded-full shadow-lg transform -translate-y-1/2">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent animate-pulse rounded-full"></div>
                      {/* Road markings */}
                      <div className="absolute inset-0 flex items-center justify-around px-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-1 h-1 bg-white/60 rounded-full"></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stations as Journey Points */}
                    <div className="relative flex justify-between px-2">
                      {(() => {
                        const displayStations = route.stationsList && route.stationsList.length > 0 
                          ? route.stationsList
                          : [...Array(Math.min(route.stations, 8))].map((_, idx) => ({
                              id: `temp-${idx}`,
                              name: idx === 0 ? route.startPoint : 
                                    idx === Math.min(route.stations, 8) - 1 ? route.endPoint :
                                    `Station ${String.fromCharCode(65 + idx - 1)}`,
                              order: idx
                            }));
                        
                        return displayStations.map((station, idx) => {
                          const isTerminal = idx === 0 || idx === displayStations.length - 1;
                          
                          return (
                            <div key={station.id} className="flex flex-col items-center z-10" style={{ width: `${100 / displayStations.length}%` }}>
                              {/* Station Marker */}
                              <div className="relative group/station">
                                {/* Pulsing ring for terminals */}
                                {isTerminal && (
                                  <div className="absolute inset-0 -m-2">
                                    <div className="w-full h-full rounded-full bg-[#9B392D]/30 animate-ping"></div>
                                  </div>
                                )}
                                
                                <div className={`relative w-12 h-12 rounded-full border-4 border-white shadow-2xl transform group-hover/station:scale-125 transition-all duration-300 flex items-center justify-center ${
                                  isTerminal
                                    ? 'bg-gradient-to-br from-[#9B392D] via-[#7d2e24] to-[#5d1f1a]'
                                    : 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600'
                                }`}>
                                  {/* Station icon */}
                                  {idx === 0 ? (
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                      <MapPin className="w-4 h-4 text-[#7d2e24]" />
                                    </div>
                                  ) : idx === displayStations.length - 1 ? (
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                      <Navigation className="w-4 h-4 text-[#7d2e24]" />
                                    </div>
                                  ) : (
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                  )}
                                  
                                  {/* Order badge */}
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#9B392D] text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-lg">
                                    {idx + 1}
                                  </div>
                                </div>
                                
                                {/* Hover tooltip */}
                                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/station:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                                  <div className="bg-[#9B392D] text-white px-3 py-2 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap">
                                    <div className="font-bold">{station.name}</div>
                                    <div className="text-[10px] text-white/70 mt-1">Attente: 5 min</div>
                                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#9B392D] rotate-45"></div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Station name */}
                              <div className="mt-3 text-center">
                                <span className="text-[9px] font-bold text-[#9B392D] block max-w-[70px] leading-tight truncate">
                                  {station.name}
                                </span>
                                <span className="text-[8px] text-[#7d2e24] mt-0.5 block">{Math.floor(Math.random() * 300 + 200)} pics</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Moving bus indicator */}
                    <div className="absolute top-1/2 left-8 w-8 h-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-full h-full bg-[#9B392D] rounded-lg shadow-xl flex items-center justify-center animate-pulse">
                        <Bus className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics Dashboard */}
              <div className="p-6 bg-gradient-to-br from-white to-[#9B392D]/5">
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="bg-white border-l-4 border-[#9B392D] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <Activity className="w-5 h-5 text-[#9B392D]" />
                      <span className="text-xs font-semibold text-gray-500">Occupancy</span>
                    </div>
                    <p className="text-xl font-bold text-[#9B392D] mt-1">{route.occupancy || 70}%</p>
                  </div>
                  <div className="bg-white border-l-4 border-blue-600 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-semibold text-gray-500">On Time</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600 mt-1">{route.onTime || 85}%</p>
                  </div>
                  <div className="bg-white border-l-4 border-emerald-600 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span className="text-xs font-semibold text-gray-500">Daily</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-600 mt-1">{route.passengers || 1000}</p>
                  </div>
                  <div className="bg-white border-l-4 border-green-600 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-xs font-semibold text-gray-500">Revenue</span>
                    </div>
                    <p className="text-xl font-bold text-green-600 mt-1">${route.revenue || 2500}</p>
                  </div>
                </div>

                {/* Schedule & Resources Cards */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-gradient-to-br from-[#9B392D]/5 to-[#9B392D]/10 rounded-xl p-4 border-2 border-[#9B392D]/20 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-[#7d2e24]" />
                      <p className="text-xs font-black text-[#9B392D] uppercase tracking-wider">Schedule</p>
                    </div>
                    <p className="text-base text-[#9B392D] font-bold mb-1">
                      {route.avgDuration}
                    </p>
                    <p className="text-xs text-[#7d2e24] font-semibold">{route.frequency}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <Bus className="w-4 h-4 text-blue-700" />
                      <p className="text-xs font-black text-blue-900 uppercase tracking-wider">Resources</p>
                    </div>
                    <p className="text-base text-blue-900 font-bold mb-1">
                      {route.buses} Buses • {route.stations} Stations
                    </p>
                    <p className="text-xs text-blue-700 font-semibold">{route.startPoint} → {route.endPoint}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#9B392D] to-[#7d2e24] text-white hover:from-[#7d2e24] hover:to-[#5d1f1a] shadow-lg hover:shadow-xl font-bold"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Voir Détails
                  </Button>
                  <Button 
                    onClick={() => handleEdit(route)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(route.id)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Route Details Dialog */}
        {selectedRoute && (
          <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9B392D] to-[#7d2e24] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedRoute.number}
                  </div>
                  {selectedRoute.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Route Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#9B392D]/5 rounded-xl p-4 border-2 border-[#9B392D]/20">
                    <p className="text-sm font-semibold text-[#7d2e24] mb-2">Détails de la Ligne</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><span className="font-semibold">Départ:</span> {selectedRoute.startPoint}</div>
                      <div><span className="font-semibold">Arrivée:</span> {selectedRoute.endPoint}</div>
                      <div><span className="font-semibold">Distance:</span> {selectedRoute.distance || 10} km</div>
                      <div><span className="font-semibold">Stations:</span> {selectedRoute.stations}</div>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-2">Infos Opérationnelles</p>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div><span className="font-semibold">Durée:</span> {selectedRoute.avgDuration}</div>
                      <div><span className="font-semibold">Fréquence:</span> {selectedRoute.frequency}</div>
                      <div><span className="font-semibold">Bus:</span> {selectedRoute.buses}</div>
                      <div><span className="font-semibold">Statut:</span> <span className="capitalize">{selectedRoute.status}</span></div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Métriques de Performance</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-[#9B392D]/5 to-[#9B392D]/10 rounded-xl p-4 text-center border border-[#9B392D]/20">
                      <Activity className="w-8 h-8 text-[#7d2e24] mx-auto mb-2" />
                      <p className="text-3xl font-bold text-[#9B392D]">{selectedRoute.occupancy || 70}%</p>
                      <p className="text-xs text-[#7d2e24] font-semibold mt-1">Taux d'Occupation</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
                      <Clock className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-blue-900">{selectedRoute.onTime || 85}%</p>
                      <p className="text-xs text-blue-700 font-semibold mt-1">Ponctualité</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center border border-emerald-200">
                      <Users className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-emerald-900">{selectedRoute.passengers || 1000}</p>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">Passagers/Jour</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
                      <DollarSign className="w-8 h-8 text-green-700 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-green-900">${selectedRoute.revenue || 2500}</p>
                      <p className="text-xs text-green-700 font-semibold mt-1">Revenu/Jour</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleEdit(selectedRoute)}
                    className="flex-1 bg-gradient-to-r from-[#9B392D] to-[#7d2e24] text-white hover:from-[#7d2e24] hover:to-[#5d1f1a]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier la Ligne
                  </Button>
                  <Button 
                    onClick={() => setSelectedRoute(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
