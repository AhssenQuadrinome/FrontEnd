import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User } from '../../../types';
import authService from '../../../services/authService';
import incidentService, { IncidentType, IncidentResponse } from '../../../services/incidentService';
import { toast } from 'sonner';

const STORAGE_KEY = 'driver_reported_incidents';

export default function IncidentsPage() {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<IncidentType>('DELAY');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [routeId, setRouteId] = useState('');
  const [busId, setBusId] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reportedIncidents, setReportedIncidents] = useState<IncidentResponse[]>([]);
  const [submitting, setSubmitting] = useState(false);

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
        .catch(() => {
          setCurrentUser({
            id: user.id,
            name: "Driver User",
            email: user.email,
            role: 'driver'
          });
        });
    }

    // Load previously reported incidents from localStorage
    const savedIncidents = localStorage.getItem(STORAGE_KEY);
    if (savedIncidents) {
      try {
        setReportedIncidents(JSON.parse(savedIncidents));
      } catch (error) {
        console.error('Failed to load incidents:', error);
      }
    }
  }, []);

  // Save incidents to localStorage whenever they change
  useEffect(() => {
    if (reportedIncidents.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportedIncidents));
    }
  }, [reportedIncidents]);

  const handleReportIncident = async () => {
    if (!incidentDescription.trim()) {
      toast.error('Please provide a description');
      return;
    }

    if (!routeId.trim()) {
      toast.error('Please select a route');
      return;
    }

    if (!busId.trim()) {
      toast.error('Please provide the bus ID');
      return;
    }

    try {
      setSubmitting(true);
      const response = await incidentService.reportIncident({
        routeId: routeId,
        busId: busId,
        type: incidentType,
        description: incidentDescription,
        reportedAt: new Date().toISOString(),
      });

      // Add the new incident to the list
      setReportedIncidents(prev => [response, ...prev]);
      
      toast.success('Incident reported successfully!', {
        description: 'Your incident has been submitted to the system.',
      });
      
      setShowIncidentModal(false);
      setIncidentDescription('');
      setRouteId('');
      setBusId('');
      setIncidentType('DELAY');
    } catch (error: any) {
      console.error('Failed to report incident:', error);
      toast.error('Failed to report incident', {
        description: error.response?.data?.message || 'Please try again later',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <DashboardLayout user={currentUser || { id: "", name: "Driver", email: "", role: "driver" }} notificationCount={2}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-2xl font-bold text-navy">Incident Reports</h3>
            <button
              onClick={() => setShowIncidentModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              New Report
            </button>
          </div>

          <div className="space-y-4">
            {reportedIncidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-xl shadow-md border border-cream-dark overflow-hidden">
                <div
                  className={`p-4 ${
                    incident.type === 'INCIDENT'
                      ? 'bg-red-100 border-l-4 border-red-600'
                      : incident.type === 'DELAY'
                      ? 'bg-yellow-100 border-l-4 border-yellow-600'
                      : 'bg-blue-100 border-l-4 border-blue-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`w-6 h-6 ${
                          incident.type === 'INCIDENT'
                            ? 'text-red-600'
                            : incident.type === 'DELAY'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                      <div>
                        <h4 className="font-bold text-navy capitalize">{incident.type.toLowerCase()}</h4>
                        <p className="text-sm text-gray-600">
                          {incident.routeId ? `Route: ${incident.routeId}` : 'Route not specified'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        incident.status === 'OPEN'
                          ? 'bg-red-200 text-red-800'
                          : incident.status === 'IN_PROGRESS'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {incident.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-navy mb-4">{incident.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Reported:</span>{' '}
                      {new Date(incident.reportedAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold">Type:</span>{' '}
                      <span className="capitalize">{incident.type.toLowerCase()}</span>
                    </div>
                    {incident.busId && (
                      <div>
                        <span className="font-semibold">Bus:</span> {incident.busId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {reportedIncidents.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-navy mb-2">No Incidents Reported</h4>
                <p className="text-gray-600">All trips are running smoothly today!</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* Incident Report Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coral rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-navy">Report Incident</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Route ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  placeholder="Enter route ID..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Bus ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  placeholder="Enter bus ID..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Incident Type <span className="text-red-500">*</span></label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="DELAY">Delay</option>
                  <option value="INCIDENT">Incident</option>
                  <option value="CANCELLATION">Cancellation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the incident in detail..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowIncidentModal(false);
                    setIncidentDescription('');
                    setRouteId('');
                    setBusId('');
                    setIncidentType('DELAY');
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportIncident}
                  disabled={!incidentDescription.trim() || !routeId.trim() || !busId.trim() || submitting}
                  className="flex-1 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
