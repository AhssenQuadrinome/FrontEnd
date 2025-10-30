import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { Bell, MapPin, Plus } from "lucide-react";
import { User } from "../../../types";
import {
	AlertTriangle,
	Bus,
	DollarSign,
	Ticket,
	TrendingUp,
	Users,
} from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "ourbusway2025@outlook.com",
	role: "admin",
};

export default function NotificationsPage() {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState(null);

	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: false, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: false, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: true, onClick: () => navigate("/admin/notifications") },
	];

	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h3 className="text-2xl font-bold text-gray-900">
						System Notifications
					</h3>
					<button
						onClick={() => {
							setModalType("notification");
							setShowModal(true);
						}}
						className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all shadow-sm"
					>
						<Plus className="w-5 h-5" />
						Send Notification
					</button>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h4 className="text-lg font-bold text-gray-900 mb-4">
						Create Mass Notification
					</h4>
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Notification Type
							</label>
							<select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
								<option>Delay Alert</option>
								<option>Cancellation</option>
								<option>Service Update</option>
								<option>Maintenance Notice</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Target Audience
							</label>
							<select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
								<option>All Passengers</option>
								<option>Route-Specific</option>
								<option>Subscription Holders</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Message
							</label>
							<textarea
								rows={4}
								placeholder="Enter your message..."
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
							></textarea>
						</div>
						<div className="flex gap-3">
							<button className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg transition-all">
								Send via Email
							</button>
							<button className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors">
								Send via SMS
							</button>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h4 className="text-lg font-bold text-gray-900 mb-4">
						Notification History
					</h4>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
											<Bell className="w-4 h-4 text-orange-600" />
										</div>
										<p className="font-semibold text-gray-900">
											Line 15 Delay Alert
										</p>
									</div>
									<span className="text-xs text-gray-500">
										2 hours ago
									</span>
								</div>
								<p className="text-sm text-gray-600 mb-2 ml-10">
									Line 15 buses are experiencing 15-minute delays due to
									road construction.
								</p>
								<div className="flex gap-4 text-xs text-gray-500 ml-10">
									<span>Sent to: 1,234 passengers</span>
									<span>Delivery: 98% success</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
