import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { Bus, AlertTriangle, MapPin, TrendingUp, Users, Ticket, Bell } from "lucide-react";
import { User } from "../../../types";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "ourbusway2025@outlook.com",
	role: "admin",
};

const mockBuses = [
	{
		id: "1",
		number: "BUS-101",
		route: "Line 15",
		driver: "Karim Benali",
		status: "active",
		location: { lat: 36.7538, lng: 3.0588 },
	},
	{
		id: "2",
		number: "BUS-205",
		route: "Line 8",
		driver: "Ali Meziane",
		status: "active",
		location: { lat: 36.7638, lng: 3.0488 },
	},
	{ id: "3", number: "BUS-312", route: "Line 22", driver: "Omar Khelifi", status: "maintenance", location: null },
];

export default function GeolocationPage() {
	const navigate = useNavigate();
  const navigation = [
    { name: 'Overview', icon: <TrendingUp />, active: false, onClick: () => navigate('/admin/overview') },
    { name: 'Users', icon: <Users />, active: false, onClick: () => navigate('/admin/users') },
    { name: 'Tickets', icon: <Ticket />, active: false, onClick: () => navigate('/admin/tickets') },
    { name: 'Routes', icon: <Bus />, active: false, onClick: () => navigate('/admin/routes') },
    { name: 'Geolocation', icon: <MapPin />, active: true, onClick: () => navigate('/admin/geolocation') },
    { name: 'Incidents', icon: <AlertTriangle />, active: false, onClick: () => navigate('/admin/incidents') },
    { name: 'Notifications', icon: <Bell />, active: false, onClick: () => navigate('/admin/notifications') },
  ];
	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<h3 className="text-2xl font-bold text-gray-900">Real-Time Geolocation</h3>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
							<Bus className="w-6 h-6 text-green-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">{mockBuses.filter((b) => b.status === "active").length}</p>
						<p className="text-sm text-gray-600">Buses Active</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
							<AlertTriangle className="w-6 h-6 text-orange-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">
							{mockBuses.filter((b) => b.status === "maintenance").length}
						</p>
						<p className="text-sm text-gray-600">In Maintenance</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
							<MapPin className="w-6 h-6 text-blue-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">{mockBuses.length}</p>
						<p className="text-sm text-gray-600">Total Buses</p>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h4 className="text-lg font-bold text-gray-900 mb-4">Bus Fleet Status</h4>
					<div className="space-y-3">
						{mockBuses.map((bus) => (
							<div
								key={bus.id}
								className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div
										className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold shadow-sm ${
											bus.status === "active" ? "bg-green-600" : "bg-red-600"
										}`}
									>
										{" "}
										<Bus className="w-6 h-6" />{" "}
									</div>
									<div>
										<p className="font-semibold text-gray-900">{bus.number}</p>
										<p className="text-sm text-gray-600">
											{bus.route} • Driver: {bus.driver}
										</p>
										{bus.location && (
											<p className="text-xs text-gray-500 mt-1">
												Lat: {bus.location.lat.toFixed(4)}, Lng: {bus.location.lng.toFixed(4)}
											</p>
										)}
									</div>
								</div>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
										bus.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
									}`}
								>
									{bus.status}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
