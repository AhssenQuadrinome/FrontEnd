import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { Ticket, CheckCircle, DollarSign, AlertTriangle, Download, Bell, MapPin } from "lucide-react";
import { User } from '../../../types';
import { TrendingUp, Users, Bus } from "lucide-react";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

const mockUser: User = {
	id: "4",
	name: "Admin User",
	email: "admin@mybus.com",
	role: "admin",
};

export default function TicketsPage() {
	const navigate = useNavigate();
	const navigation = [
		{ name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
		{ name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
		{ name: "Tickets", icon: <Ticket />, active: true, onClick: () => navigate("/admin/tickets") },
		{ name: "Routes", icon: <Bus />, active: false, onClick: () => navigate("/admin/routes") },
		{ name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
		{ name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
		{ name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
	];
	return (
		<DashboardLayout user={mockUser} navigation={navigation} notificationCount={3}>
			<div className="space-y-6">
				<h3 className="text-2xl font-bold text-gray-900">Tickets & Subscriptions</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
							<Ticket className="w-6 h-6 text-orange-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">1,234</p>
						<p className="text-sm text-gray-600">Tickets Sold Today</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
							<CheckCircle className="w-6 h-6 text-green-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">456</p>
						<p className="text-sm text-gray-600">Active Subscriptions</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
							<DollarSign className="w-6 h-6 text-emerald-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">$12.4K</p>
						<p className="text-sm text-gray-600">Revenue Today</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
							<AlertTriangle className="w-6 h-6 text-yellow-600" />
						</div>
						<p className="text-3xl font-bold text-gray-900 mb-1">12</p>
						<p className="text-sm text-gray-600">Fraud Alerts</p>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h4 className="text-lg font-bold text-gray-900">Revenue Analytics</h4>
						<button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
							<Download className="w-4 h-4" />
							Export Report
						</button>
					</div>
					<div className="space-y-4">
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium text-gray-700">Single Tickets</span>
								<span className="text-sm font-semibold text-gray-900">$6,170 (50%)</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div
									className="bg-gradient-to-r from-orange-500 to-red-500 h-2.5 rounded-full"
									style={{ width: "50%" }}
								></div>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium text-gray-700">Monthly Subscriptions</span>
								<span className="text-sm font-semibold text-gray-900">$4,936 (40%)</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div className="bg-slate-800 h-2.5 rounded-full" style={{ width: "40%" }}></div>
							</div>
						</div>
						<div>
							<div className="flex justify-between mb-2">
								<span className="text-sm font-medium text-gray-700">Annual Subscriptions</span>
								<span className="text-sm font-semibold text-gray-900">$1,234 (10%)</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2.5">
								<div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "10%" }}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
}
