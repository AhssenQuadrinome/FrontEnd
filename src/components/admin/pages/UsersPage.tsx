import { useState, useEffect } from "react";
import DashboardLayout from "../../DashboardLayout";
import { Plus, Search, Filter, Eye, Edit, Trash2, X } from "lucide-react";
import { User } from "../../../types";
import authService, { UserGetResource } from "../../../services/authService";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { cn } from "../../../lib/utils";

export default function UsersPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [users, setUsers] = useState<UserGetResource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	
	// Pagination state
	const [currentPage, setCurrentPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [pageSize] = useState(10);
	
	// Create user dialog state
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState<string | null>(null);
	
	// Form fields
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState("");
	const [address, setAddress] = useState("");
	const [role, setRole] = useState("");
	
	// Fetch current user
	useEffect(() => {
		const user = authService.getCurrentUser();
		if (user) {
			authService.getProfile()
				.then(profile => {
					setCurrentUser({
						id: profile.id,
						name: `${profile.firstName} ${profile.lastName}`,
						email: profile.email,
						role: profile.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
					});
				})
				.catch(err => {
					console.error('Failed to load admin profile:', err);
					setCurrentUser({
						id: user.id,
						name: "Admin User",
						email: user.email,
						role: user.role.toLowerCase() as "admin" | "driver" | "controller" | "passenger"
					});
				});
		}
	}, []);
	
	// Fetch users
	useEffect(() => {
		fetchUsers();
	}, [currentPage]);
	
	const fetchUsers = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await authService.getAllUsers(currentPage, pageSize);
			setUsers(response.content);
			setTotalPages(response.totalPages);
			setTotalElements(response.totalElements);
		} catch (err: any) {
			console.error('Failed to fetch users:', err);
			
			// Handle specific error cases
			if (err.response?.status === 403 || err.response?.status === 401) {
				setError('Access denied. You need admin privileges to view users. Please login as an admin.');
			} else {
				setError(err.response?.data?.message || 'Failed to load users. Please try again.');
			}
		} finally {
			setLoading(false);
		}
	};
	
	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setCreateError(null);
		setCreateLoading(true);
		try {
			await authService.createUserAsAdmin({
				firstName,
				lastName,
				email,
				mobile,
				gender,
				dateOfBirth,
				address,
				password,
				role // DRIVER or CONTROLLER
			});
			
			// Reset form
			setFirstName("");
			setLastName("");
			setEmail("");
			setMobile("");
			setPassword("");
			setDateOfBirth("");
			setGender("");
			setAddress("");
			setRole("");
			
			// Close dialog
			setShowCreateDialog(false);
			
			// Show success message
			alert('User created successfully! An activation email has been sent.');
			
			// Refresh users list
			fetchUsers();
		} catch (err: any) {
			setCreateError(err.response?.data?.message || err.message || "Failed to create user");
		} finally {
			setCreateLoading(false);
		}
	};
	
	// Filter users based on search query
	const filteredUsers = users.filter(user =>
		`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
		user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
		user.role.toLowerCase().includes(searchQuery.toLowerCase())
	);
	
	if (loading) {
		return (
			<DashboardLayout user={currentUser || { id: "", name: "Loading...", email: "", role: "admin" }}>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto mb-4"></div>
						<p className="text-gray-600">Loading users...</p>
					</div>
				</div>
			</DashboardLayout>
		);
	}
	
	if (error) {
		return (
			<DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }}>
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<p className="text-red-600 mb-4">{error}</p>
						<button
							onClick={fetchUsers}
							className="px-4 py-2 bg-[#A54033] text-white rounded-lg hover:bg-[#8B2F24] transition-colors"
						>
							Retry
						</button>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout user={currentUser || { id: "", name: "Admin", email: "", role: "admin" }}>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<h3 className="text-2xl font-bold text-gray-900">
						User Management
					</h3>
					<button
						onClick={() => setShowCreateDialog(true)}
						className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#A54033] to-[#8B2F24] hover:from-[#A54033]/80 hover:to-[#8B2F24]/80 text-white font-medium rounded-lg transition-all shadow-sm"
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
								className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A54033] focus:border-transparent"
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
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
										Role
									</th>
									<th className="px-6 py-3 text-left text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-3 text-center text-xs font-semibold text-[#181E4B] uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredUsers.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
											{searchQuery ? 'No users found matching your search' : 'No users found'}
										</td>
									</tr>
								) : (
									filteredUsers.map((user) => (
										<tr
											key={user.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
														{user.firstName.charAt(0)}
													</div>
													<span className="font-medium text-gray-900">
														{user.firstName} {user.lastName}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 text-gray-600 text-sm">
												{user.email}
											</td>
											<td className="px-6 py-4">
												<span className="px-2.5 py-1 bg-slate-800 text-white rounded-full text-xs font-medium capitalize">
													{user.role.toLowerCase()}
												</span>
											</td>
											<td className="px-6 py-4">
												<span
													className={`px-2.5 py-1 rounded-full text-xs font-medium ${
														user.enabled
															? "bg-green-100 text-green-700"
															: "bg-red-100 text-red-700"
													}`}
												>
													{user.enabled ? "ACTIVE" : "INACTIVE"}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center gap-2">
													<button 
														className="p-2 text-gray-600 hover:text-[#A54033] hover:bg-[#A54033]/10 rounded-lg transition-colors"
														title="View details"
													>
														<Eye className="w-4 h-4" />
													</button>
													<button 
														className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
														title="Edit user"
													>
														<Edit className="w-4 h-4" />
													</button>
													<button 
														className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
														title="Delete user"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					
					{/* Pagination */}
					{totalPages > 1 && (
						<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
							<div className="text-sm text-gray-600">
								Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} users
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
									disabled={currentPage === 0}
									className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Previous
								</button>
								<div className="flex items-center gap-1">
									{Array.from({ length: totalPages }, (_, i) => (
										<button
											key={i}
											onClick={() => setCurrentPage(i)}
											className={`w-8 h-8 rounded-lg transition-colors ${
												currentPage === i
													? "bg-[#A54033] text-white"
													: "border border-gray-300 hover:bg-gray-50"
											}`}
										>
											{i + 1}
										</button>
									))}
								</div>
								<button
									onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
									disabled={currentPage === totalPages - 1}
									className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									Next
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			
			{/* Create User Dialog */}
			{showCreateDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto">
						{/* Decorative accent */}
						<div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-[#a54033] to-[#c15043] rounded-2xl opacity-10 blur-xl"></div>

						<div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#a54033]/10 overflow-hidden">
							{/* Top accent bar */}
							<div className="h-1.5 bg-gradient-to-r from-[#a54033] via-[#c15043] to-[#a54033]"></div>

							<div className="p-8 md:p-10">
								{/* Header */}
								<div className="flex items-center justify-between mb-8">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-gradient-to-br from-[#a54033] to-[#8d3529] rounded-xl flex items-center justify-center shadow-lg shadow-[#a54033]/20">
											<Plus className="w-6 h-6 text-white" />
										</div>
										<div>
											<h2 className="text-3xl font-bold text-[#181e4b] tracking-tight">Create New User</h2>
											<p className="text-[#555770]">Add a new driver or controller to the system</p>
										</div>
									</div>
									<button
										onClick={() => setShowCreateDialog(false)}
										className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="w-6 h-6 text-gray-600" />
									</button>
								</div>

								{/* Form */}
								<form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="firstName" className="text-[#181e4b] font-medium">First name</Label>
										<Input 
											id="firstName" 
											value={firstName} 
											onChange={(e) => setFirstName(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
											required
										/>
									</div>
									<div>
										<Label htmlFor="lastName" className="text-[#181e4b] font-medium">Last name</Label>
										<Input 
											id="lastName" 
											value={lastName} 
											onChange={(e) => setLastName(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
											required
										/>
									</div>
									<div className="md:col-span-2">
										<Label htmlFor="email" className="text-[#181e4b] font-medium">Email</Label>
										<Input 
											id="email" 
											type="email" 
											value={email} 
											onChange={(e) => setEmail(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
											required
										/>
									</div>
									<div>
										<Label htmlFor="mobile" className="text-[#181e4b] font-medium">Mobile</Label>
										<Input 
											id="mobile" 
											value={mobile} 
											onChange={(e) => setMobile(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
											required
										/>
									</div>
									<div>
										<Label htmlFor="password" className="text-[#181e4b] font-medium">Password</Label>
										<Input 
											id="password" 
											type="password" 
											value={password} 
											onChange={(e) => setPassword(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
											required
										/>
									</div>
									<div>
										<Label htmlFor="dateOfBirth" className="text-[#181e4b] font-medium">Date of birth</Label>
										<Input 
											id="dateOfBirth" 
											type="date" 
											value={dateOfBirth} 
											onChange={(e) => setDateOfBirth(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
										/>
									</div>
									<div>
										<Label htmlFor="gender" className="text-[#181e4b] font-medium">Gender</Label>
										<div className="relative group">
											<select
												id="gender"
												value={gender}
												onChange={(e) => setGender(e.target.value)}
												className="h-12 w-full pl-4 pr-4 border border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl bg-white appearance-none"
												required
											>
												<option value="" disabled>Select gender</option>
												<option value="Male">Male</option>
												<option value="Female">Female</option>
											</select>
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#a54033]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
											<div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a54033]">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
												</svg>
											</div>
										</div>
									</div>
									<div>
										<Label htmlFor="role" className="text-[#181e4b] font-medium">Role</Label>
										<div className="relative group">
											<select
												id="role"
												value={role}
												onChange={(e) => setRole(e.target.value)}
												className="h-12 w-full pl-4 pr-4 border border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl bg-white appearance-none"
												required
											>
												<option value="" disabled>Select role</option>
												<option value="DRIVER">Driver</option>
												<option value="CONTROLLER">Controller</option>
											</select>
											<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#a54033]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
											<div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[#a54033]">
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
												</svg>
											</div>
										</div>
									</div>
									<div className="md:col-span-2">
										<Label htmlFor="address" className="text-[#181e4b] font-medium">Address</Label>
										<Input 
											id="address" 
											value={address} 
											onChange={(e) => setAddress(e.target.value)} 
											className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
										/>
									</div>
									{createError && (
										<div className="md:col-span-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
											<svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
											</svg>
											<span className="text-sm text-red-700">{createError}</span>
										</div>
									)}
									<div className="md:col-span-2 flex gap-3">
										<Button
											type="button"
											onClick={() => setShowCreateDialog(false)}
											className="flex-1 h-12 rounded-xl font-semibold border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
										>
											Cancel
										</Button>
										<Button
											type="submit"
											disabled={createLoading}
											className={cn(
												"flex-1 h-12 rounded-xl font-semibold text-white shadow-lg shadow-[#a54033]/25",
												"bg-gradient-to-r from-[#a54033] to-[#c15043]",
												"hover:from-[#8d3529] hover:to-[#a54033]",
												"transform transition-all duration-200",
												"hover:scale-[1.02] hover:shadow-xl hover:shadow-[#a54033]/30",
												"active:scale-[0.98]",
												createLoading && "opacity-70 cursor-not-allowed hover:scale-100"
											)}
										>
											{createLoading ? (
												<div className="flex items-center justify-center gap-2">
													<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
														<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
														<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
													</svg>
													<span>Creating...</span>
												</div>
											) : (
												"Create User"
											)}
										</Button>
									</div>
								</form>
							</div>
						</div>

						{/* Bottom decorative accent */}
						<div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#181e4b] to-[#2a3166] rounded-2xl opacity-10 blur-xl"></div>
					</div>
				</div>
			)}
		</DashboardLayout>
	);
}
