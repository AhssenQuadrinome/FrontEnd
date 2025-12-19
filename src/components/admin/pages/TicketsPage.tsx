import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../DashboardLayout";
import { Ticket, CheckCircle, DollarSign, AlertTriangle, Download, Bell, MapPin } from "lucide-react";
import { User } from '../../../types';
import { TrendingUp, Users, Bus } from "lucide-react";
import authService from "../../../services/authService";
import adminStatsService from "../../../services/adminStatsService";

// User model and roles
export type UserRole = "admin" | "driver" | "controller" | "passenger";

export default function TicketsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stats state
  const [ticketsSold, setTicketsSold] = useState({ count: 0, growth: 0 });
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [revenueToday, setRevenueToday] = useState({ revenue: 0, growth: 0 });
  const [totalTransactions, setTotalTransactions] = useState({ total: 0, avgDaily: 0 });
  const [revenueByType, setRevenueByType] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await authService.getProfile();
      setUser({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        role: profile.role.toLowerCase() as UserRole,
      });

      // Fetch all stats in parallel from both ticket and subscription services
      const [
        ticketsData, 
        subscriptionsData, 
        ticketRevenueData, 
        subscriptionRevenueData,
        transactionsData, 
        ticketRevenueTypeData,
        totalSubscriptionData
      ] = await Promise.all([
        adminStatsService.getTicketsSoldToday(),
        adminStatsService.getActiveSubscriptionsCount(),
        adminStatsService.getRevenueToday(), // Ticket revenue today
        adminStatsService.getSubscriptionRevenueToday(), // Subscription revenue today
        adminStatsService.getTotalTransactions(),
        adminStatsService.getRevenueByType(), // Ticket revenue breakdown
        adminStatsService.getTotalSubscriptionRevenue(), // Total subscription revenue
      ]);

      setTicketsSold({ count: ticketsData.count, growth: ticketsData.growthPercentage });
      setActiveSubscriptions(subscriptionsData.count);
      
      // Combine revenue from tickets and subscriptions
      const combinedRevenueToday = ticketRevenueData.revenue + subscriptionRevenueData.revenue;
      // Use ticket growth as primary indicator (can be enhanced later)
      setRevenueToday({ revenue: combinedRevenueToday, growth: ticketRevenueData.growthPercentage });
      
      // Combine transaction count (tickets + subscriptions)
      const combinedTransactions = transactionsData.totalTransactions + totalSubscriptionData.totalCount;
      const combinedAvgDaily = transactionsData.avgDailyRevenue + subscriptionRevenueData.revenue;
      setTotalTransactions({ total: combinedTransactions, avgDaily: combinedAvgDaily });
      
      // Combine revenue by type
      const totalRevenueCombined = ticketRevenueTypeData.totalRevenue + totalSubscriptionData.totalRevenue;
      const subscriptionRevenue = totalSubscriptionData.totalRevenue;
      
      // Calculate percentages
      const ticketPercentage = totalRevenueCombined > 0 
        ? (ticketRevenueTypeData.totalRevenue / totalRevenueCombined) * 100 
        : 0;
      const subscriptionPercentage = totalRevenueCombined > 0 
        ? (subscriptionRevenue / totalRevenueCombined) * 100 
        : 0;
      
      const combinedRevenueByType = {
        singleTickets: {
          revenue: ticketRevenueTypeData.totalRevenue,
          percentage: ticketPercentage,
          label: "Single Tickets"
        },
        monthlySubscriptions: {
          revenue: subscriptionRevenue,
          percentage: subscriptionPercentage,
          label: "Subscriptions"
        },
        totalRevenue: totalRevenueCombined,
        timestamp: new Date().toISOString()
      };
      
      console.log('[AdminTicketsPage] Combined revenue:', combinedRevenueByType);
      setRevenueByType(combinedRevenueByType);

      console.log('[AdminTicketsPage] Stats loaded successfully');
    } catch (err) {
      console.error('[AdminTicketsPage] Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentUser: User = user || {
    id: "4",
    name: "Admin User",
    email: "ourbusway2025@outlook.com",
    role: "admin",
  };

  const navigation = [
    { name: "Overview", icon: <TrendingUp />, active: false, onClick: () => navigate("/admin/overview") },
    { name: "Users", icon: <Users />, active: false, onClick: () => navigate("/admin/users") },
    { name: "Tickets", icon: <Ticket />, active: true, onClick: () => navigate("/admin/tickets") },
    { name: "Routes", icon: <Bus />, active: false, onClick: () => navigate("/admin/routes") },
    { name: "Geolocation", icon: <MapPin />, active: false, onClick: () => navigate("/admin/geolocation") },
    { name: "Incidents", icon: <AlertTriangle />, active: false, onClick: () => navigate("/admin/incidents") },
    { name: "Notifications", icon: <Bell />, active: false, onClick: () => navigate("/admin/notifications") },
  ];

  // Dynamic revenue data from backend (excluding annual subscriptions)
  const revenueData = revenueByType ? [
    { 
      label: revenueByType.singleTickets.label, 
      value: revenueByType.singleTickets.revenue, 
      percentage: revenueByType.singleTickets.percentage, 
      color: "#A54033" 
    },
    { 
      label: revenueByType.monthlySubscriptions.label, 
      value: revenueByType.monthlySubscriptions.revenue, 
      percentage: revenueByType.monthlySubscriptions.percentage, 
      color: "#8B2F24" 
    },
  ] : [
    { label: "Single Tickets", value: 0, percentage: 100, color: "#A54033" },
    { label: "Monthly Subscriptions", value: 0, percentage: 0, color: "#8B2F24" },
  ];

  // Calculate total from the sum of all revenue items to ensure consistency
  const totalRevenueSum = revenueData.reduce((sum, item) => sum + item.value, 0);

  // Calculate SVG pie chart segments
  const createPieSegments = () => {
    let currentAngle = -90;
    return revenueData
      .filter(item => item.percentage > 0) // Only show segments with actual data
      .map((item, index) => {
        const angle = (item.percentage / 100) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        // Handle 100% case - draw full circle
        if (angle >= 359.99) {
          const path = `M 50 5 A 45 45 0 1 1 49.99 5 Z`;
          return { ...item, path, index };
        }
        
        const x1 = 50 + 45 * Math.cos((Math.PI * startAngle) / 180);
        const y1 = 50 + 45 * Math.sin((Math.PI * startAngle) / 180);
        const x2 = 50 + 45 * Math.cos((Math.PI * endAngle) / 180);
        const y2 = 50 + 45 * Math.sin((Math.PI * endAngle) / 180);
        
        const largeArc = angle > 180 ? 1 : 0;
        const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;
        
        currentAngle = endAngle;
        
        return { ...item, path, index };
      });
  };

  const pieSegments = createPieSegments();

  if (loading) {
    return (
      <DashboardLayout user={currentUser} navigation={navigation} notificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading statistics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser} navigation={navigation} notificationCount={0}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900">Tickets & Subscriptions</h3>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Tickets Sold */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A54033] to-[#8B2F24] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #A5403355'}}>
                      <Ticket className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#A54033] to-[#8B2F24] bg-clip-text text-transparent mb-1">
                  {ticketsSold.count.toLocaleString()}
                </p>
                <p className="text-sm text-[#A54033] font-medium">Tickets Sold Today</p>
              </div>
            </div>
          </div>

          {/* Card 2: Active Subscriptions */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#8B2F24] to-[#6B1F1A] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #8B2F2455'}}>
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-1 px-3 py-1 bg-[#8B2F24]/10 rounded-full text-[#8B2F24] text-sm font-semibold">
                    <span className="text-xs">N/A</span>
                  </div> */}
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#8B2F24] to-[#6B1F1A] bg-clip-text text-transparent mb-1">
                  {activeSubscriptions.toLocaleString()}
                </p>
                <p className="text-sm text-[#8B2F24] font-medium">Active Subscriptions</p>
              </div>
            </div>
          </div>

          {/* Card 3: Revenue Today */}
          <div className="relative group transition-transform duration-200 hover:-translate-y-1 hover:scale-105">
            <div className="rounded-2xl shadow-lg p-6 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#D4604F] to-[#A54033] rounded-2xl flex items-center justify-center shadow-lg" style={{boxShadow:'0 0 24px 0 #D4604F55'}}>
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-[#D4604F] to-[#A54033] bg-clip-text text-transparent mb-1">
                  {revenueToday.revenue.toFixed(0)} MAD
                </p>
                <p className="text-sm text-[#D4604F] font-medium">Revenue Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Circular Diagram */}
          <div className="rounded-2xl shadow-lg p-6 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
            <h4 className="text-lg font-bold text-[#181E4B] mb-6">Revenue Distribution</h4>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {pieSegments.map((segment) => (
                    <path
                      key={segment.index}
                      d={segment.path}
                      fill={segment.color}
                      className={`transition-all duration-300 cursor-pointer ${
                        hoveredSegment === segment.index ? 'opacity-80' : 'opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredSegment(segment.index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      style={{
                        filter: hoveredSegment === segment.index ? 'brightness(1.2)' : 'none',
                        transform: hoveredSegment === segment.index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: '50% 50%'
                      }}
                    />
                  ))}
                  <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <p className="text-2xl font-bold text-[#181E4B]">{totalRevenueSum.toFixed(0)} MAD</p>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {revenueData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart Analytics */}
          <div className="lg:col-span-2 rounded-2xl shadow-lg p-6 bg-white/30 backdrop-blur-md border border-[#A54033]/40">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-[#181E4B]">Revenue Analytics</h4>
              {/* <button className="flex items-center gap-2 px-4 py-2 border border-[#181E4B]/40 text-[#181E4B] hover:bg-[#181E4B]/10 rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" />
                Export Report
              </button> */}
            </div>
            <div className="space-y-6">
              {revenueData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.value.toFixed(0)} MAD ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="relative w-full bg-[#181E4B]/10 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${item.percentage}%`,
                        background: `linear-gradient(to right, ${item.color}, ${item.color}dd)`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_linear_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-2xl font-bold text-[#A54033]">{totalTransactions.avgDaily.toFixed(0)} MAD</p>
                <p className="text-xs text-gray-600 mt-1">Avg. Daily Revenue</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <p className="text-2xl font-bold text-[#8B2F24]">{totalTransactions.total.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">Total Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style> */}
    </DashboardLayout>
  );
}