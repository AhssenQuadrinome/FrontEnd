import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { MapPin, Plus, Edit, Settings, Trash2, Bell, X, Save, Clock, MapPinned, CheckCircle } from "lucide-react";
import { User } from "../../../types";
import {
	TrendingUp,
	Users,
	Ticket,
	Bus,
	AlertTriangle,
} from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "ourbusway2025@outlook.com",
	role: "admin",
};

interface Route {
	id: string;
	name: string;
	number: string;
	stations: number;
	status: "active" | "inactive" | "maintenance";
	buses: number;
	startPoint: string;
	endPoint: string;
	avgDuration: string;
	frequency: string;
}

const initialRoutes: Route[] = [
	{
		id: "1",
		name: "Line 15",
		number: "15",
		stations: 12,
		status: "active",
		buses: 8,
		startPoint: "City Center",
		endPoint: "Airport Terminal",
		avgDuration: "45 min",
		frequency: "Every 15 min",
	},
	{
		id: "2",
		name: "Line 8",
		number: "8",
		stations: 10,
		status: "active",
		buses: 6,
		startPoint: "North Station",
		endPoint: "South Mall",
		avgDuration: "35 min",
		frequency: "Every 20 min",
	},
	{
		id: "3",
		name: "Line 22",
		number: "22",
		stations: 15,
		status: "maintenance",
		buses: 10,
		startPoint: "East Plaza",
		endPoint: "West Harbor",
		avgDuration: "55 min",
		frequency: "Every 10 min",
	},
];

export default function RoutesPage() {
	const navigate = useNavigate();
	const [routes, setRoutes] = useState<Route[]>(initialRoutes);
	const [showModal, setShowModal] = useState(false);
	const [editingRoute, setEditingRoute] = useState<Route | null>(null);
	const [formData, setFormData] = useState<Partial<Route>>({});

	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: false, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: true, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
	];

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
		});
		setShowModal(true);
	};

	const handleSave = () => {
		if (editingRoute) {
			setRoutes(routes.map(r => r.id === editingRoute.id ? { ...r, ...formData } : r));
		} else {
			const newRoute: Route = {
				id: String(routes.length + 1),
				name: formData.name || "",
				number: formData.number || "",
				stations: formData.stations || 0,
				status: formData.status || "active",
				buses: formData.buses || 0,
				startPoint: formData.startPoint || "",
				endPoint: formData.endPoint || "",
				avgDuration: formData.avgDuration || "",
				frequency: formData.frequency || "",
			};
			setRoutes([...routes, newRoute]);
		}
		setShowModal(false);
		setEditingRoute(null);
		setFormData({});
	};

	const handleDelete = (id: string) => {
		if (confirm("Are you sure you want to delete this route?")) {
			setRoutes(routes.filter(r => r.id !== id));
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-500";
			case "inactive":
				return "bg-gray-500";
			case "maintenance":
				return "bg-yellow-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusTextColor = (status: string) => {
		switch (status) {
			case "active":
				return "text-green-600";
			case "inactive":
				return "text-gray-600";
			case "maintenance":
				return "text-yellow-600";
			default:
				return "text-gray-600";
		}
	};

	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h3 className="text-2xl font-bold text-gray-900">
						Routes & Schedules
					</h3>
					<button
						onClick={handleCreate}
						className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A54033] to-[#8B2F24] hover:from-[#8B2F24] hover:to-[#A54033] text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
					>
						<Plus className="w-5 h-5" />
						Create Route
					</button>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-white/30 backdrop-blur-md border border-[#A54033]/40 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-lg flex items-center justify-center">
								<Bus className="w-6 h-6 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold text-[#A54033]">{routes.length}</p>
								<p className="text-sm text-gray-600">Total Routes</p>
							</div>
						</div>
					</div>
					<div className="bg-white/30 backdrop-blur-md border border-[#A54033]/40 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#8B2F24] to-[#6B1F1A] rounded-lg flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold text-[#8B2F24]">{routes.filter(r => r.status === "active").length}</p>
								<p className="text-sm text-gray-600">Active Routes</p>
							</div>
						</div>
					</div>
					<div className="bg-white/30 backdrop-blur-md border border-[#A54033]/40 rounded-xl p-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 bg-gradient-to-br from-[#D4604F] to-[#A54033] rounded-lg flex items-center justify-center">
								<MapPinned className="w-6 h-6 text-white" />
							</div>
							<div>
								<p className="text-2xl font-bold text-[#D4604F]">{routes.reduce((sum, r) => sum + r.stations, 0)}</p>
								<p className="text-sm text-gray-600">Total Stations</p>
							</div>
						</div>
					</div>
				</div>

				{/* Routes List */}
				<div className="space-y-4">
					{routes.map((route) => (
						<div
							key={route.id}
							className="relative group transition-transform duration-200 hover:-translate-y-1"
						>
							<div className="bg-white rounded-2xl shadow-lg border border-[#A54033]/40 overflow-hidden hover:shadow-2xl transition-all duration-300">
								<div className="bg-gradient-to-r from-[#A54033] to-[#8B2F24] p-6 text-white">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg border border-white/30">
												{route.number}
											</div>
											<div>
												<h4 className="text-2xl font-bold mb-1">
													{route.name}
												</h4>
												<div className="flex items-center gap-4 text-sm text-white/90">
													<span className="flex items-center gap-1">
														<MapPin className="w-4 h-4" />
														{route.stations} stations
													</span>
													<span className="flex items-center gap-1">
														<Bus className="w-4 h-4" />
														{route.buses} buses
													</span>
												</div>
											</div>
										</div>
										<span className={`px-4 py-2 ${getStatusColor(route.status)} text-white rounded-full text-xs font-semibold shadow-lg capitalize`}>
											{route.status}
										</span>
									</div>
								</div>

								<div className="p-6 space-y-4">
									{/* Route Details */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
											<MapPinned className="w-5 h-5 text-[#A54033] mt-0.5" />
											<div>
												<p className="text-xs text-gray-500 mb-1">Route Path</p>
												<p className="text-sm font-semibold text-gray-900">{route.startPoint}</p>
												<div className="flex items-center gap-2 my-1">
													<div className="w-1 h-6 bg-gradient-to-b from-[#A54033] to-[#8B2F24] rounded-full"></div>
												</div>
												<p className="text-sm font-semibold text-gray-900">{route.endPoint}</p>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
												<Clock className="w-5 h-5 text-[#8B2F24] mt-0.5" />
												<div>
													<p className="text-xs text-gray-500 mb-1">Duration</p>
													<p className="text-sm font-semibold text-gray-900">{route.avgDuration}</p>
												</div>
											</div>
											<div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
												<TrendingUp className="w-5 h-5 text-[#D4604F] mt-0.5" />
												<div>
													<p className="text-xs text-gray-500 mb-1">Frequency</p>
													<p className="text-sm font-semibold text-gray-900">{route.frequency}</p>
												</div>
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3 pt-2">
										<button 
											onClick={() => handleEdit(route)}
											className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#181E4B] hover:bg-[#0f1333] text-white font-medium rounded-lg transition-colors text-sm"
										>
											<Edit className="w-4 h-4" />
											Edit Route
										</button>
										<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#A54033] to-[#8B2F24] hover:from-[#8B2F24] hover:to-[#A54033] text-white font-medium rounded-lg transition-colors text-sm">
											<Settings className="w-4 h-4" />
											Manage Schedule
										</button>
										<button 
											onClick={() => handleDelete(route.id)}
											className="px-4 py-2.5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium rounded-lg transition-colors"
										>
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Modal for Create/Edit */}
			{showModal && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="sticky top-0 bg-gradient-to-r from-[#A54033] to-[#8B2F24] text-white p-6 flex items-center justify-between">
							<h3 className="text-2xl font-bold">
								{editingRoute ? "Edit Route" : "Create New Route"}
							</h3>
							<button
								onClick={() => setShowModal(false)}
								className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="p-6 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Route Name
									</label>
									<input
										type="text"
										value={formData.name || ""}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., Line 15"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Route Number
									</label>
									<input
										type="text"
										value={formData.number || ""}
										onChange={(e) => setFormData({ ...formData, number: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., 15"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Start Point
									</label>
									<input
										type="text"
										value={formData.startPoint || ""}
										onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., City Center"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										End Point
									</label>
									<input
										type="text"
										value={formData.endPoint || ""}
										onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., Airport Terminal"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Number of Stations
									</label>
									<input
										type="number"
										value={formData.stations || ""}
										onChange={(e) => setFormData({ ...formData, stations: parseInt(e.target.value) || 0 })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="12"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Assigned Buses
									</label>
									<input
										type="number"
										value={formData.buses || ""}
										onChange={(e) => setFormData({ ...formData, buses: parseInt(e.target.value) || 0 })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="8"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Status
									</label>
									<select
										value={formData.status || "active"}
										onChange={(e) => setFormData({ ...formData, status: e.target.value as Route["status"] })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
									>
										<option value="active">Active</option>
										<option value="inactive">Inactive</option>
										<option value="maintenance">Maintenance</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Average Duration
									</label>
									<input
										type="text"
										value={formData.avgDuration || ""}
										onChange={(e) => setFormData({ ...formData, avgDuration: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., 45 min"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Frequency
									</label>
									<input
										type="text"
										value={formData.frequency || ""}
										onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
										placeholder="e.g., Every 15 min"
									/>
								</div>
							</div>
						</div>

						<div className="sticky bottom-0 bg-gray-50 p-6 flex gap-3 border-t border-gray-200">
							<button
								onClick={() => setShowModal(false)}
								className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#A54033] to-[#8B2F24] hover:from-[#8B2F24] hover:to-[#A54033] text-white font-medium rounded-lg transition-colors"
							>
								<Save className="w-4 h-4" />
								{editingRoute ? "Save Changes" : "Create Route"}
							</button>
						</div>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}