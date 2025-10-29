import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { Users, Plus, Search, Filter, Eye, Edit, Trash2, Bell, MapPin } from "lucide-react";
import { User } from "../../../types";
import { TrendingUp, Ticket, Bus, DollarSign, AlertTriangle } from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "admin@mybus.com",
	role: "admin",
};

const mockUsers = [
	{
		id: "1",
		name: "Ahmed Hassan",
		email: "ahmed@example.com",
		role: "passenger",
		status: "active",
	},
	{
		id: "2",
		name: "Karim Benali",
		email: "karim@mybus.com",
		role: "driver",
		status: "active",
	},
	{
		id: "3",
		name: "Fatima Zohra",
		email: "fatima@mybus.com",
		role: "controller",
		status: "active",
	},
	{
		id: "5",
		name: "Sarah Mahmoud",
		email: "sarah@example.com",
		role: "passenger",
		status: "inactive",
	},
];

export default function UsersPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: true, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: false, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: false, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
	];

	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h3 className="text-2xl font-bold text-gray-900">
						User Management
					</h3>
					<button
						onClick={() => {}}
						className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
					>
						<Plus className="w-5 h-5" />
						Add User
					</button>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
					<div className="flex gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search users..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>
						<button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
							<Filter className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Role
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{mockUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
													{user.name.charAt(0)}
												</div>
												<span className="font-medium text-gray-900">
													{user.name}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-gray-600 text-sm">
											{user.email}
										</td>
										<td className="px-6 py-4">
											<span className="px-2.5 py-1 bg-slate-800 text-white rounded-full text-xs font-medium capitalize">
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2.5 py-1 rounded-full text-xs font-medium ${
													user.status === "active"
														? "bg-green-100 text-green-700"
														: "bg-red-100 text-red-700"
												}`}
											>
												{user.status.toUpperCase()}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-center gap-2">
												<button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
													<Eye className="w-4 h-4" />
												</button>
												<button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
													<Edit className="w-4 h-4" />
												</button>
												<button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
