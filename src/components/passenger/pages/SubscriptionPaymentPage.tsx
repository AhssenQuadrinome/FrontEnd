import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import DashboardLayout from '../../DashboardLayout';
import authService from '../../../services/authService';
import paymentService from '../../../services/paymentService';
import { toast } from 'sonner';
import { Calendar, CreditCard, Lock, XCircle } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1e3a5f',
      fontFamily: 'system-ui, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#94a3b8',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

function SubscriptionPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const subscriptionRequestId = location.state?.subscriptionRequestId;

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('MAD');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!subscriptionRequestId) {
      toast.error('Subscription request ID missing');
      navigate('/passenger/subscription');
      return;
    }
    initializePayment();
  }, [subscriptionRequestId]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      console.log('[SubscriptionPaymentPage] Initializing payment for subscriptionRequestId:', subscriptionRequestId);

      // Retry logic to wait for RabbitMQ processing
      const maxRetries = 10;
      const retryDelay = 500; // 500ms between retries
      let lastError: any = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[SubscriptionPaymentPage] Attempt ${attempt}/${maxRetries} to get payment...`);
          
          const response = await paymentService.processPayment(undefined, subscriptionRequestId!);
          
          console.log('[SubscriptionPaymentPage] Payment initialized:', response);
          setClientSecret(response.clientSecret);
          setPaymentIntentId(response.paymentIntentId);
          setAmount(response.amount);
          setCurrency(response.currency);
          
          toast.success('Ready for payment');
          return; // Success! Exit the function
          
        } catch (err: any) {
          lastError = err;
          const status = err.response?.status;
          
          // If 404 or 500, the payment might not be ready yet - retry
          if ((status === 404 || status === 400 || status === 500) && attempt < maxRetries) {
            console.log(`[SubscriptionPaymentPage] Payment not ready yet (status ${status}), retrying in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          
          // If it's another error or last attempt, throw
          throw err;
        }
      }
      
      // If we get here, all retries failed
      throw lastError;
      
    } catch (err: any) {
      console.error('[SubscriptionPaymentPage] Failed to initialize payment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to initialize payment. Payment processing is taking longer than expected.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('[SubscriptionPaymentPage] Stripe.js has not loaded yet');
      return;
    }

    if (!clientSecret) {
      toast.error('Client secret missing. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      console.log('[SubscriptionPaymentPage] Confirming card payment...');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        console.error('[SubscriptionPaymentPage] Stripe error:', stripeError);
        const errorMsg = stripeError.message || 'Payment failed';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('[SubscriptionPaymentPage] Payment succeeded:', paymentIntent);
        toast.success('Payment successful! Your subscription is now active.');
        
        // Redirect to subscription page with refresh parameter after a short delay
        setTimeout(() => {
          navigate('/passenger/subscription?refresh=true');
        }, 2000);
      } else {
        console.warn('[SubscriptionPaymentPage] Unexpected payment status:', paymentIntent.status);
        toast.warning(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err: any) {
      console.error('[SubscriptionPaymentPage] Payment confirmation failed:', err);
      const errorMessage = err.message || 'Payment error';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-xl font-bold text-red-600 mb-2">Payment Error</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/passenger/subscription')}
            className="px-6 py-2 bg-[#A54033] text-white rounded-lg hover:bg-[#8B3428]"
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-amber-800" />
          </div>
          <h2 className="text-2xl font-bold text-navy">
            Subscription Payment
          </h2>
          <p className="text-gray-600 mt-2">Monthly Bus Pass - All Routes</p>
        </div>

        {/* Payment Summary */}
        <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Amount:</span>
            <span className="text-2xl font-bold text-amber-900">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-2">
            <p>✓ Valid for 30 days</p>
            <p>✓ Unlimited trips on all routes</p>
          </div>
          <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-amber-200">
            Payment ID: {paymentIntentId}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Card Information
            </label>
            <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#A54033] focus-within:border-[#A54033]">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!stripe || processing}
            className={`w-full py-3 rounded-lg font-bold transition-colors ${
              processing || !stripe
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#A54033] hover:bg-[#8B3428] text-white'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing payment...
              </span>
            ) : (
              `Pay ${amount.toFixed(2)} ${currency}`
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mb-2">
            <Lock className="w-4 h-4 text-green-600" />
            <p className="font-medium">Secure payment powered by Stripe</p>
          </div>
          <p className="text-xs text-gray-500">Your card information is encrypted and secure</p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/passenger/subscription')}
          className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Cancel payment
        </button>
      </div>
    </div>
  );
}

export default function SubscriptionPaymentPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('[SubscriptionPaymentPage] Failed to fetch profile:', err);
    }
  };

  const currentUser = {
    id: user?.id || '1',
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest',
    email: user?.email || '',
    role: 'passenger' as const,
  };

  return (
    <DashboardLayout user={currentUser} notificationCount={0}>
      <Elements stripe={stripePromise}>
        <SubscriptionPaymentForm />
      </Elements>
    </DashboardLayout>
  );
}
