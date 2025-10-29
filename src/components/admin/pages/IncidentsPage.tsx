import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { AlertTriangle, CheckCircle, BarChart3, MapPin, Bell } from "lucide-react";
import { User } from "../../../types";
import { TrendingUp, Users, Ticket, Bus, DollarSign } from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "admin@mybus.com",
	role: "admin",
};

const mockIncidents = [
	{
		id: "1",
		type: "delay",
		tripId: "TR001",
		routeName: "Line 15",
		description: "Heavy traffic on main boulevard",
		reportedBy: "Karim Benali",
		reportedAt: "2025-10-28T13:45:00",
		status: "open",
		severity: "medium",
	},
	{
		id: "2",
		type: "technical",
		tripId: "TR005",
		routeName: "Line 8",
		description: "Engine overheating",
		reportedBy: "Ali Meziane",
		reportedAt: "2025-10-28T12:30:00",
		status: "resolved",
		severity: "high",
	},
];

export default function IncidentsPage() {
	const navigate = useNavigate();
	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: false, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: false, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: true, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
	];
	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<h3 className="text-2xl font-bold text-gray-900">
					Incident Management
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
							<AlertTriangle className="w-6 h-6 text-red-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">
							{mockIncidents.filter((i) => i.status === "open").length}
						</p>
						<p className="text-sm text-gray-600">Open Incidents</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">
							{mockIncidents.filter((i) => i.status === "resolved").length}
						</p>
						<p className="text-sm text-gray-600">Resolved Today</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
							<BarChart3 className="w-6 h-6 text-orange-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">
							{mockIncidents.length}
						</p>
						<p className="text-sm text-gray-600">Total Incidents</p>
					</div>
				</div>
				<div className="space-y-4">
					{mockIncidents.map((incident) => (
						<div
							key={incident.id}
							className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
						>
							<div
								className={`p-4 border-l-4 ${
									incident.severity === "high"
										? "bg-red-50 border-red-500"
										: incident.severity === "medium"
										? "bg-yellow-50 border-yellow-500"
										: "bg-blue-50 border-blue-500"
								}`}
							>
								{" "}
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<AlertTriangle
											className={`w-6 h-6 ${
												incident.severity === "high"
													? "text-red-600"
													: incident.severity === "medium"
													? "text-yellow-600"
													: "text-blue-600"
											}`}
										/>
										<div>
											<h4 className="font-bold text-gray-900 capitalize text-lg">
												{incident.type}
											</h4>
											<p className="text-sm text-gray-600">
												{incident.routeName} • Trip {incident.tripId}
											</p>
										</div>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs font-semibold ${
											incident.status === "open"
												? "bg-red-100 text-red-700"
												: "bg-green-100 text-green-700"
										}`}
									>
										{incident.status.toUpperCase()}
									</span>
								</div>
							</div>
							<div className="p-6">
								<p className="text-gray-700 mb-4">
									{incident.description}
								</p>
								<div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
									<div>
										<span className="font-semibold text-gray-900">
											Reported by:
										</span>{" "}
										{incident.reportedBy}
									</div>
									<div>
										<span className="font-semibold text-gray-900">
											Time:
										</span>{" "}
										{new Date(incident.reportedAt).toLocaleString()}
									</div>
									<div>
										<span className="font-semibold text-gray-900">
											Severity:
										</span>{" "}
										<span
											className={`capitalize font-semibold ${
												incident.severity === "high"
													? "text-red-600"
													: incident.severity === "medium"
													? "text-yellow-600"
													: "text-blue-600"
											}`}
										>
											{incident.severity}
										</span>
									</div>
								</div>
								{incident.status === "open" && (
									<button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
										Mark as Resolved
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
