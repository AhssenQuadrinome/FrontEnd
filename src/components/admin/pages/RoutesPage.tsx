import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { MapPin, Plus, Edit, Settings, Trash2, Bell } from "lucide-react";
import { User } from "../../../types";
import {
	TrendingUp,
	Users,
	Ticket,
	Bus,
	DollarSign,
	AlertTriangle,
} from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "admin@mybus.com",
	role: "admin",
};

const mockRoutes = [
	{
		id: "1",
		name: "Line 15",
		number: "15",
		stations: 12,
		status: "active",
		buses: 8,
	},
	{
		id: "2",
		name: "Line 8",
		number: "8",
		stations: 10,
		status: "active",
		buses: 6,
	},
	{
		id: "3",
		name: "Line 22",
		number: "22",
		stations: 15,
		status: "active",
		buses: 10,
	},
];

export default function RoutesPage() {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState(null);

	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: false, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: true, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
	];

	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h3 className="text-2xl font-bold text-gray-900">
						Routes & Schedules
					</h3>
					<button
						onClick={() => {
							setModalType("route");
							setShowModal(true);
						}}
						className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
					>
						<Plus className="w-5 h-5" />
						Create Route
					</button>
				</div>
				<div className="space-y-4">
					{mockRoutes.map((route) => (
						<div
							key={route.id}
							className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
						>
							<div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-4">
										<div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
											{route.number}
										</div>
										<div>
											<h4 className="text-xl font-bold mb-1">
												{route.name}
											</h4>
											<p className="text-sm text-gray-300">
												{route.stations} stations •{" "}
												{route.buses} buses assigned
											</p>
										</div>
									</div>
									<span className="px-4 py-2 bg-green-500 text-white rounded-full text-xs font-semibold shadow-sm">
										Active
									</span>
								</div>
							</div>
							<div className="p-6">
								<div className="flex gap-3">
									<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-sm">
										<Edit className="w-4 h-4" />
										Edit Route
									</button>
									<button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-colors text-sm">
										<Settings className="w-4 h-4" />
										Manage Schedule
									</button>
									<button className="px-4 py-2.5 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium rounded-lg transition-colors">
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</DashboardLayout>
	);
}
