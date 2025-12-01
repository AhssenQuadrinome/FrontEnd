import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ticketRequestId = searchParams.get('ticketRequestId');

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('MAD');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!ticketRequestId) {
      toast.error('ID de demande de billet manquant');
      navigate('/passenger/buy-ticket');
      return;
    }
    initializePayment();
  }, [ticketRequestId]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      console.log('[PaymentPage] Initializing payment for ticketRequestId:', ticketRequestId);

      // Retry logic to wait for RabbitMQ processing
      const maxRetries = 10;
      const retryDelay = 500; // 500ms between retries
      let lastError: any = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[PaymentPage] Attempt ${attempt}/${maxRetries} to get payment...`);
          
          const response = await paymentService.processPayment(ticketRequestId!);
          
          console.log('[PaymentPage] Payment initialized:', response);
          setClientSecret(response.clientSecret);
          setPaymentIntentId(response.paymentIntentId);
          setAmount(response.amount);
          setCurrency(response.currency);
          
          toast.success('Prêt pour le paiement');
          return; // Success! Exit the function
          
        } catch (err: any) {
          lastError = err;
          const status = err.response?.status;
          
          // If 404 or 500, the payment might not be ready yet - retry
          if ((status === 404 || status === 500) && attempt < maxRetries) {
            console.log(`[PaymentPage] Payment not ready yet (status ${status}), retrying in ${retryDelay}ms...`);
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
      console.error('[PaymentPage] Failed to initialize payment:', err);
      const errorMessage = err.response?.data?.message || 'Échec de l\'initialisation du paiement. Le traitement du paiement prend plus de temps que prévu.';
      toast.error(`❌ ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('[PaymentPage] Stripe.js has not loaded yet');
      return;
    }

    if (!clientSecret) {
      toast.error('Secret client manquant. Veuillez réessayer.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Élément de carte non trouvé');
      return;
    }

    try {
      setProcessing(true);
      setError('');
      console.log('[PaymentPage] Confirming card payment...');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        console.error('[PaymentPage] Stripe error:', stripeError);
        const errorMsg = stripeError.message || 'Le paiement a échoué';
        setError(errorMsg);
        toast.error(`❌ ${errorMsg}`);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        console.log('[PaymentPage] Payment succeeded:', paymentIntent);
        toast.success('✅ Paiement réussi! Votre billet est confirmé.');
        
        // Redirect to tickets page with refresh parameter after a short delay
        setTimeout(() => {
          navigate('/passenger/tickets?refresh=true');
        }, 2000);
      } else {
        console.warn('[PaymentPage] Unexpected payment status:', paymentIntent.status);
        toast.warning(`Statut du paiement: ${paymentIntent.status}`);
      }
    } catch (err: any) {
      console.error('[PaymentPage] Payment confirmation failed:', err);
      const errorMessage = err.message || 'Erreur lors du paiement';
      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A54033] mx-auto"></div>
          <p className="mt-4 text-gray-600">Initialisation du paiement...</p>
        </div>
      </div>
    );
  }

  if (error && !clientSecret) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">❌ Erreur</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate('/passenger/buy-ticket')}
            className="px-6 py-2 bg-[#A54033] text-white rounded-lg hover:bg-[#8B3428]"
          >
            Retour à l'achat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-navy text-center">
          Paiement sécurisé
        </h2>

        {/* Payment Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Montant:</span>
            <span className="text-xl font-bold text-navy">
              {amount.toFixed(2)} {currency}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            ID de paiement: {paymentIntentId}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Informations de carte
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
                Traitement en cours...
              </span>
            ) : (
              `Payer ${amount.toFixed(2)} ${currency}`
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Paiement sécurisé par Stripe</p>
          <p className="mt-1">Vos informations de carte sont cryptées et sécurisées</p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/passenger/buy-ticket')}
          className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Annuler le paiement
        </button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('[PaymentPage] Failed to fetch profile:', err);
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
        <PaymentForm />
      </Elements>
    </DashboardLayout>
  );
}
