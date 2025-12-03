import DashboardLayout from '../../DashboardLayout';
import { useState, useEffect } from 'react';
import { Bus, MapPin, ShoppingCart, Calendar, CheckCircle2, Clock, Scan } from 'lucide-react';
import authService from '../../../services/authService';
import subscriptionService, { SubscriptionGetResource } from '../../../services/subscriptionService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState<string | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionGetResource | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionGetResource[]>([]);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);

        // Fetch active subscription
        const activeSub = await subscriptionService.getMySubscription();
        setActiveSubscription(activeSub);

        // Fetch subscription history
        const history = await subscriptionService.getSubscriptionHistory(0, 10);
        setSubscriptionHistory(history.content);

        // Show success message if redirected from payment
        if (searchParams.get('refresh') === 'true') {
          toast.success('Subscription activated successfully!');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const toggleQR = (id: string) => {
    setShowQR(showQR === id ? null : id);
  };

  const handlePurchaseSubscription = async () => {
    setPurchasing(true);
    try {
      const response = await subscriptionService.purchaseSubscription();
      // Navigate to subscription payment page with subscription data
      navigate('/passenger/subscription-payment', { 
        state: { 
          subscriptionRequestId: response.subscriptionRequestId
        } 
      });
    } catch (err: any) {
      console.error('Failed to purchase subscription:', err);
      toast.error('Failed to initiate subscription purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase tracking-wide">Active</span>;
      case 'EXPIRED':
        return <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs font-bold uppercase tracking-wide">Expired</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wide">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-bold uppercase tracking-wide">{status}</span>;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const currentUser = {
    id: user?.id || '1',
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
    email: user?.email || '',
    role: 'passenger' as const,
  };

  if (loading || !user) {
    return (
      <DashboardLayout user={currentUser} notificationCount={0}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={currentUser} notificationCount={0}>
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-amber-900">My Subscriptions</h3>
        
        {/* Active Subscription Section */}
        {activeSubscription ? (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Active Subscription</h4>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
              {/* Card Header - White Background */}
              <div className="bg-white p-6 pb-4 border-b-2 border-amber-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Bus className="w-6 h-6 text-amber-800" />
                    </div>
                    <span className="text-gray-900 font-bold text-lg">OurBusWay Pass</span>
                  </div>
                  {getStatusBadge(activeSubscription.status)}
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <Calendar className="w-8 h-8 text-amber-800" />
                  </div>
                  <div>
                    <p className="text-amber-700 text-xs uppercase tracking-wider font-semibold">MONTHLY</p>
                    <p className="text-gray-900 text-xl font-bold">{activeSubscription.planName}</p>
                  </div>
                </div>
              </div>

              {/* Card Body - White Background */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-800 text-sm bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Valid on All Routes</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-gray-600 text-xs uppercase tracking-wide font-medium">Start Date</p>
                    </div>
                    <p className="text-gray-900 font-bold">
                      {new Date(activeSubscription.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <p className="text-gray-600 text-xs uppercase tracking-wide font-medium">Expires</p>
                    </div>
                    <p className="text-gray-900 font-bold">
                      {new Date(activeSubscription.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-green-900 text-sm font-bold">
                      {getDaysRemaining(activeSubscription.endDate)} days remaining
                    </p>
                    <p className="text-green-700 text-xs">Your subscription is active</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleQR(activeSubscription.id)}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <div className="bg-white bg-opacity-20 p-1.5 rounded-lg">
                    <Scan className="w-5 h-5" />
                  </div>
                  {showQR === activeSubscription.id ? 'Hide QR Code' : 'Show QR Code'}
                </button>

                {showQR === activeSubscription.id && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl text-center border-2 border-amber-200 shadow-inner">
                    <div className="inline-block bg-white p-4 rounded-xl shadow-lg">
                      <QRCodeSVG 
                        value={activeSubscription.id}
                        size={200}
                        level="H"
                        includeMargin={true}
                        fgColor="#78350f"
                        bgColor="#ffffff"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Scan className="w-5 h-5 text-amber-800" />
                        <p className="text-amber-900 text-sm font-bold">Scan to validate subscription</p>
                      </div>
                      <p className="text-gray-700 text-xs font-mono bg-white inline-block px-3 py-1 rounded-lg border border-amber-200">
                        ID: {activeSubscription.id}
                      </p>
                      <p className="text-gray-600 text-xs">
                        Valid until {new Date(activeSubscription.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Get a Subscription</h4>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg overflow-hidden border-2 border-amber-200">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-4 rounded-xl shadow-lg">
                    <Bus className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Monthly Bus Pass</h3>
                    <p className="text-gray-700">Unlimited access to all bus routes for 30 days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <p className="text-xs text-gray-600 font-medium">Duration</p>
                    </div>
                    <p className="text-amber-900 font-bold">30 Days</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <p className="text-xs text-gray-600 font-medium">Coverage</p>
                    </div>
                    <p className="text-amber-900 font-bold">All Routes</p>
                  </div>
                </div>

                <button
                  onClick={handlePurchaseSubscription}
                  disabled={purchasing}
                  className="w-full bg-gradient-to-r from-[#A54033] to-amber-900 hover:from-amber-900 hover:to-[#A54033] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Purchase Subscription
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription History */}
        {subscriptionHistory.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Subscription History</h4>
            <div className="space-y-4">
              {subscriptionHistory.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-amber-800" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900">{sub.planName}</h5>
                            {getStatusBadge(sub.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{new Date(sub.startDate).toLocaleDateString()}</span>
                        <span>→</span>
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{new Date(sub.endDate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 inline-block px-2 py-1 rounded">ID: {sub.id}</p>
                    </div>
                    <button
                      onClick={() => toggleQR(sub.id)}
                      className="ml-4 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-900 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md border border-amber-300"
                    >
                      <Scan className="w-4 h-4" />
                      {showQR === sub.id ? 'Hide' : 'View QR'}
                    </button>
                  </div>
                  
                  {showQR === sub.id && (
                    <div className="mt-4 pt-4 border-t-2 border-amber-100">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex justify-center mb-3">
                          <div className="inline-block bg-white p-3 rounded-lg shadow-md">
                            <QRCodeSVG 
                              value={sub.id}
                              size={150}
                              level="H"
                              includeMargin={true}
                              fgColor="#78350f"
                              bgColor="#ffffff"
                            />
                          </div>
                        </div>
                        <p className="text-center text-gray-700 text-xs font-mono bg-white inline-block px-3 py-1 rounded-lg mx-auto block w-fit border border-amber-200">{sub.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}