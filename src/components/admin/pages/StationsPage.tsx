import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";
import { Plus, Search, Edit, Trash2, X, MapPin } from "lucide-react";
import { User } from "../../../types";
import stationService, { Station, CreateStationRequest } from "../../../services/stationService";
import authService from "../../../services/authService";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from "sonner";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { position: [number, number] | null; setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function StationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  
  // Create station dialog state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Edit station dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  
  // Default map center (Tunisia)
  const defaultCenter: [number, number] = [36.8065, 10.1815]; // Tunis coordinates
  
  // Fetch current user
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      authService.getProfile()
        .then(profile => {
          const roleMap: Record<string, "admin" | "driver" | "controller" | "passenger"> = {
            'ADMINISTRATOR': 'admin',
            'DRIVER': 'driver',
            'CONTROLLER': 'controller',
            'PASSENGER': 'passenger'
          };
          setCurrentUser({
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            role: roleMap[profile.role] || profile.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
          });
        })
        .catch(err => {
          console.error('Failed to load admin profile:', err);
          const roleMap: Record<string, "admin" | "driver" | "controller" | "passenger"> = {
            'ADMINISTRATOR': 'admin',
            'DRIVER': 'driver',
            'CONTROLLER': 'controller',
            'PASSENGER': 'passenger'
          };
          setCurrentUser({
            id: user.id,
            name: "Admin User",
            email: user.email,
            role: roleMap[user.role] || user.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
          });
        });
    }
  }, []);
  
  // Fetch stations
  useEffect(() => {
    fetchStations();
  }, [currentPage]);
  
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stationService.getAllStations(currentPage, pageSize);
      setStations(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      console.error('Failed to fetch stations:', err);
      setError(err.response?.data?.message || 'Failed to load stations. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPosition) {
      setCreateError('Please select a location on the map');
      return;
    }
    
    setCreateError(null);
    setCreateLoading(true);
    
    try {
      const stationData: CreateStationRequest = {
        name,
        code,
        address,
        latitude: selectedPosition[0],
        longitude: selectedPosition[1]
      };
      
      await stationService.createStation(stationData);
      
      // Reset form
      setName("");
      setCode("");
      setAddress("");
      setSelectedPosition(null);
      
      // Close dialog
      setShowCreateDialog(false);
      
      // Show success message
      toast.success('Station created successfully!', {
        description: `${name} has been added to the system.`,
      });
      
      // Refresh stations list
      fetchStations();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to create station";
      setCreateError(errorMessage);
      toast.error('Failed to create station', {
        description: errorMessage,
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setName(station.name);
    setCode(station.code);
    setAddress(station.address || "");
    setSelectedPosition([station.latitude, station.longitude]);
    setShowEditDialog(true);
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStation) return;
    
    if (!selectedPosition) {
      setEditError('Please select a location on the map');
      return;
    }
    
    setEditError(null);
    setEditLoading(true);
    
    try {
      const stationData: CreateStationRequest = {
        name,
        code,
        address,
        latitude: selectedPosition[0],
        longitude: selectedPosition[1]
      };
      
      await stationService.updateStation(editingStation.id, stationData);
      
      // Reset form
      setName("");
      setCode("");
      setAddress("");
      setSelectedPosition(null);
      setEditingStation(null);
      
      // Close dialog
      setShowEditDialog(false);
      
      // Show success message
      toast.success('Station updated successfully!', {
        description: `${name} has been updated.`,
      });
      
      // Refresh stations list
      fetchStations();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update station";
      setEditError(errorMessage);
      toast.error('Failed to update station', {
        description: errorMessage,
      });
    } finally {
      setEditLoading(false);
    }
  };
  
  // Filter stations based on search query
  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Loading...", email: "", role: "admin" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchStations}
              className="px-4 py-2 bg-[#A54033] text-white rounded-lg hover:bg-[#8B2F24] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Station Management
          </h3>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A54033] to-[#8B2F24] hover:from-[#A54033]/80 hover:to-[#8B2F24]/80 text-white font-medium rounded-lg transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Station
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchQuery ? 'No stations found matching your search' : 'No stations found'}
                    </td>
                  </tr>
                ) : (
                  filteredStations.map((station) => (
                    <tr
                      key={station.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {station.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {station.code}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {station.address || '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex flex-col">
                          <span>Lat: {station.latitude.toFixed(6)}</span>
                          <span>Lng: {station.longitude.toFixed(6)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEditStation(station)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit station"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete station"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} stations
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 rounded-lg transition-colors ${
                        currentPage === i
                          ? "bg-[#A54033] text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Station Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Decorative accent */}
            <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-[#a54033] to-[#c15043] rounded-2xl opacity-10 blur-xl"></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#a54033]/10 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#a54033] via-[#c15043] to-[#a54033]"></div>

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a54033] to-[#8d3529] rounded-xl flex items-center justify-center shadow-lg shadow-[#a54033]/20">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#181e4b] tracking-tight">Add New Station</h2>
                      <p className="text-[#555770]">Click on the map to select station location</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateDialog(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreateStation} className="space-y-6">
                  {/* Map */}
                  <div>
                    <Label className="text-[#181e4b] font-medium mb-2 block">Select Location on Map</Label>
                    <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      <MapContainer
                        center={selectedPosition || defaultCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={selectedPosition} setPosition={setSelectedPosition} />
                      </MapContainer>
                    </div>
                    {selectedPosition && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: Lat {selectedPosition[0].toFixed(6)}, Lng {selectedPosition[1].toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-[#181e4b] font-medium">Station Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="e.g., Central Station"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code" className="text-[#181e4b] font-medium">Station Code</Label>
                      <Input 
                        id="code" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="e.g., CS01"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-[#181e4b] font-medium">Address</Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="Full address"
                        required
                      />
                    </div>
                  </div>

                  {createError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-700">{createError}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setShowCreateDialog(false)}
                      className="flex-1 h-12 rounded-xl font-semibold border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createLoading}
                      className={cn(
                        "flex-1 h-12 rounded-xl font-semibold text-white shadow-lg shadow-[#a54033]/25",
                        "bg-gradient-to-r from-[#a54033] to-[#c15043]",
                        "hover:from-[#8d3529] hover:to-[#a54033]",
                        "transform transition-all duration-200",
                        "hover:scale-[1.02] hover:shadow-xl hover:shadow-[#a54033]/30",
                        "active:scale-[0.98]",
                        createLoading && "opacity-70 cursor-not-allowed hover:scale-100"
                      )}
                    >
                      {createLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Station"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom decorative accent */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#181e4b] to-[#2a3166] rounded-2xl opacity-10 blur-xl"></div>
          </div>
        </div>
      )}

      {/* Edit Station Dialog */}
      {showEditDialog && editingStation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" >
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Decorative accent */}
            <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-[#a54033] to-[#c15043] rounded-2xl opacity-10 blur-xl"></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#a54033]/10 overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#a54033] via-[#c15043] to-[#a54033]"></div>

              <div className="p-8 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#a54033] to-[#8d3529] rounded-xl flex items-center justify-center shadow-lg shadow-[#a54033]/20">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#181e4b] tracking-tight">Edit Station</h2>
                      <p className="text-[#555770]">Update station details and location</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditDialog(false);
                      setEditingStation(null);
                      setName("");
                      setCode("");
                      setAddress("");
                      setSelectedPosition(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdateStation} className="space-y-6">
                  {/* Map */}
                  <div>
                    <Label className="text-[#181e4b] font-medium mb-2 block">Select Location on Map</Label>
                    <div className="h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                      <MapContainer
                        center={selectedPosition || defaultCenter}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        key={`edit-${editingStation.id}`}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={selectedPosition} setPosition={setSelectedPosition} />
                      </MapContainer>
                    </div>
                    {selectedPosition && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: Lat {selectedPosition[0].toFixed(6)}, Lng {selectedPosition[1].toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name" className="text-[#181e4b] font-medium">Station Name</Label>
                      <Input 
                        id="edit-name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="e.g., Central Station"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-code" className="text-[#181e4b] font-medium">Station Code</Label>
                      <Input 
                        id="edit-code" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="e.g., CS01"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="edit-address" className="text-[#181e4b] font-medium">Address</Label>
                      <Input 
                        id="edit-address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                        placeholder="Full address"
                        required
                      />
                    </div>
                  </div>

                  {editError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-700">{editError}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowEditDialog(false);
                        setEditingStation(null);
                        setName("");
                        setCode("");
                        setAddress("");
                        setSelectedPosition(null);
                      }}
                      className="flex-1 h-12 rounded-xl font-semibold border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={editLoading}
                      className={cn(
                        "flex-1 h-12 rounded-xl font-semibold text-white shadow-lg shadow-[#a54033]/25",
                        "bg-gradient-to-r from-[#a54033] to-[#c15043]",
                        "hover:from-[#8d3529] hover:to-[#a54033]",
                        "transform transition-all duration-200",
                        "hover:scale-[1.02] hover:shadow-xl hover:shadow-[#a54033]/30",
                        "active:scale-[0.98]",
                        editLoading && "opacity-70 cursor-not-allowed hover:scale-100"
                      )}
                    >
                      {editLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Station"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            {/* Bottom decorative accent */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#181e4b] to-[#2a3166] rounded-2xl opacity-10 blur-xl"></div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
