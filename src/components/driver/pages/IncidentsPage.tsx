import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../DashboardLayout';
import { User, Incident } from '../../../types';
import authService from '../../../services/authService';

const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'delay',
    tripId: '1',
    routeName: 'Line 15',
    description: 'Heavy traffic on main boulevard',
    reportedBy: 'Karim Benali',
    reportedAt: '2025-10-28T13:45:00',
    status: 'open',
    severity: 'medium',
  },
];

export default function IncidentsPage() {
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentType, setIncidentType] = useState<'delay' | 'technical' | 'accident' | 'other'>('delay');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
  }, []);

  const handleReportIncident = () => {
    console.log('Reporting incident:', { type: incidentType, description: incidentDescription });
    setShowIncidentModal(false);
    setIncidentDescription('');
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
            {mockIncidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-xl shadow-md border border-cream-dark overflow-hidden">
                <div
                  className={`p-4 ${
                    incident.severity === 'high'
                      ? 'bg-red-100 border-l-4 border-red-600'
                      : incident.severity === 'medium'
                      ? 'bg-yellow-100 border-l-4 border-yellow-600'
                      : 'bg-blue-100 border-l-4 border-blue-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`w-6 h-6 ${
                          incident.severity === 'high'
                            ? 'text-red-600'
                            : incident.severity === 'medium'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                      <div>
                        <h4 className="font-bold text-navy capitalize">{incident.type}</h4>
                        <p className="text-sm text-gray-600">{incident.routeName}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        incident.status === 'open'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {incident.status.toUpperCase()}
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
                      <span className="font-semibold">Severity:</span>{' '}
                      <span className="capitalize">{incident.severity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mockIncidents.length === 0 && (
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
                <label className="block text-sm font-medium text-navy mb-2">Incident Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value as any)}
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                >
                  <option value="delay">Delay</option>
                  <option value="technical">Technical Issue</option>
                  <option value="accident">Accident</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Description</label>
                <textarea
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the incident..."
                  className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-coral resize-none"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowIncidentModal(false);
                    setIncidentDescription('');
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportIncident}
                  disabled={!incidentDescription.trim()}
                  className="flex-1 px-6 py-3 bg-coral hover:bg-coral-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
