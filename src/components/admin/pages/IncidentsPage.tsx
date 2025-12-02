import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";
import { AlertTriangle, CheckCircle, BarChart3, MapPin } from "lucide-react";
import { User } from "../../../types";
import incidentService, { IncidentResponse } from "../../../services/incidentService";
import routeService, { Route } from "../../../services/routeService";
import authService from "../../../services/authService";
import { toast } from "sonner";

export default function IncidentsPage() {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [routeDetailsMap, setRouteDetailsMap] = useState<Map<string, Route>>(new Map());
	const [updatingIncidents, setUpdatingIncidents] = useState<Set<string>>(new Set());

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
						name: "Admin User",
						email: user.email,
						role: 'admin'
					});
				});
		}

		fetchIncidents();
	}, []);

	const fetchIncidents = async () => {
		try {
			setLoading(true);
			const response = await incidentService.getAllIncidents(0, 100);
			setIncidents(response.content);
		} catch (error) {
			console.error('Failed to fetch incidents:', error);
			toast.error('Failed to load incidents');
		} finally {
			setLoading(false);
		}
	};

	// Fetch route details for all incidents
	useEffect(() => {
		const fetchRouteDetails = async () => {
			const uniqueRouteIds = [...new Set(incidents.map(incident => incident.routeId).filter(Boolean))];
			const newRouteDetails = new Map(routeDetailsMap);

			for (const routeId of uniqueRouteIds) {
				if (!newRouteDetails.has(routeId)) {
					try {
						const route = await routeService.getRouteById(routeId);
						newRouteDetails.set(routeId, route);
					} catch (error) {
						console.error(`Failed to fetch route ${routeId}:`, error);
					}
				}
			}

			setRouteDetailsMap(newRouteDetails);
		};

		if (incidents.length > 0) {
			fetchRouteDetails();
		}
	}, [incidents]);

	const handleUpdateStatus = async (incidentId: string, newStatus: 'IN_PROGRESS' | 'RESOLVED') => {
		try {
			setUpdatingIncidents(prev => new Set(prev).add(incidentId));
			await incidentService.updateIncident(incidentId, { status: newStatus });
			
			// Update local state
			setIncidents(prevIncidents =>
				prevIncidents.map(incident =>
					incident.id === incidentId
						? { ...incident, status: newStatus, resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString() : incident.resolvedAt }
						: incident
				)
			);

			toast.success(`Incident marked as ${newStatus.toLowerCase().replace('_', ' ')}`);
		} catch (error: any) {
			console.error('Failed to update incident:', error);
			toast.error('Failed to update incident status', {
				description: error.response?.data?.message || 'Please try again later',
			});
		} finally {
			setUpdatingIncidents(prev => {
				const newSet = new Set(prev);
				newSet.delete(incidentId);
				return newSet;
			});
		}
	};

	const openIncidents = incidents.filter(i => i.status === 'OPEN');
	const resolvedToday = incidents.filter(i => {
		if (i.status !== 'RESOLVED' || !i.resolvedAt) return false;
		const today = new Date().toDateString();
		const resolvedDate = new Date(i.resolvedAt).toDateString();
		return today === resolvedDate;
	});
	return (
		<DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }} notificationCount={3}>
			<div className="space-y-6">
				<h3 className="text-2xl font-bold text-navy">
					Incident Management
				</h3>

				{loading ? (
					<div className="flex justify-center items-center py-12">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral"></div>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="bg-white rounded-xl shadow-md border border-cream-dark p-6 hover:shadow-lg transition-shadow">
								<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
									<AlertTriangle className="w-6 h-6 text-red-600" />
								</div>
								<p className="text-3xl font-bold text-navy mb-1">
									{openIncidents.length}
								</p>
								<p className="text-sm text-gray-600">Open Incidents</p>
							</div>
							<div className="bg-white rounded-xl shadow-md border border-cream-dark p-6 hover:shadow-lg transition-shadow">
								<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
									<CheckCircle className="w-6 h-6 text-green-600" />
								</div>
								<p className="text-3xl font-bold text-navy mb-1">
									{resolvedToday.length}
								</p>
								<p className="text-sm text-gray-600">Resolved Today</p>
							</div>
							<div className="bg-white rounded-xl shadow-md border border-cream-dark p-6 hover:shadow-lg transition-shadow">
								<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
									<BarChart3 className="w-6 h-6 text-orange-600" />
								</div>
								<p className="text-3xl font-bold text-navy mb-1">
									{incidents.length}
								</p>
								<p className="text-sm text-gray-600">Total Incidents</p>
							</div>
						</div>
						<div className="space-y-4">
							{incidents.length === 0 ? (
								<div className="bg-white rounded-xl shadow-md p-12 text-center">
									<CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
									<h4 className="text-xl font-bold text-navy mb-2">No Incidents Reported</h4>
									<p className="text-gray-600">All operations are running smoothly!</p>
								</div>
							) : (
								incidents.map((incident) => {
									const route = routeDetailsMap.get(incident.routeId);
									const isUpdating = updatingIncidents.has(incident.id);

									return (
										<div
											key={incident.id}
											className="bg-white rounded-xl shadow-md border border-cream-dark overflow-hidden hover:shadow-lg transition-shadow"
										>
											<div
												className={`p-4 border-l-4 ${
													incident.type === 'INCIDENT'
														? 'bg-red-50 border-red-500'
														: incident.type === 'DELAY'
														? 'bg-yellow-50 border-yellow-500'
														: 'bg-blue-50 border-blue-500'
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
															<h4 className="font-bold text-navy capitalize text-lg">
																{incident.type.toLowerCase()}
															</h4>
															{route ? (
																<p className="text-sm text-gray-600">
																	<span className="font-semibold">{route.number}</span> - {route.name}
																</p>
															) : (
																<p className="text-sm text-gray-600">
																	Route ID: {incident.routeId || 'Not specified'}
																</p>
															)}
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
												
												{route && (
													<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
														<p className="text-sm text-blue-900">
															<span className="font-semibold">Route Description:</span> {route.description}
														</p>
													</div>
												)}

												<div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
													<div>
														<span className="font-semibold text-navy">Driver ID:</span>{' '}
														{incident.driverId}
													</div>
													<div>
														<span className="font-semibold text-navy">Reported:</span>{' '}
														{new Date(incident.reportedAt).toLocaleString()}
													</div>
													{incident.busId && (
														<div>
															<span className="font-semibold text-navy">Bus:</span> {incident.busId}
														</div>
													)}
													{incident.latitude && incident.longitude && (
														<div className="flex items-center gap-1">
															<MapPin className="w-3 h-3" />
															<span className="font-semibold text-navy">Location:</span>{' '}
															{incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}
														</div>
													)}
													{incident.resolvedAt && (
														<div>
															<span className="font-semibold text-navy">Resolved:</span>{' '}
															{new Date(incident.resolvedAt).toLocaleString()}
														</div>
													)}
												</div>

												{incident.status !== 'RESOLVED' && (
													<div className="flex gap-3">
														{incident.status === 'OPEN' && (
															<button
																onClick={() => handleUpdateStatus(incident.id, 'IN_PROGRESS')}
																disabled={isUpdating}
																className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
															>
																{isUpdating ? (
																	<>
																		<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
																		Updating...
																	</>
																) : (
																	'Mark In Progress'
																)}
															</button>
														)}
														<button
															onClick={() => handleUpdateStatus(incident.id, 'RESOLVED')}
															disabled={isUpdating}
															className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
														>
															{isUpdating ? (
																<>
																	<div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
																	Updating...
																</>
															) : (
																'Mark as Resolved'
															)}
														</button>
													</div>
												)}
											</div>
										</div>
									);
								})
							)}
						</div>
					</>
				)}
			</div>
		</DashboardLayout>
	);
}
