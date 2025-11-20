import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AccountValidation() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    // Extract activation token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const activationKey = params.get('token');

    if (!activationKey) {
      setStatus('error');
      setMessage('No activation token found in URL.');
      return;
    }

    // Validate account automatically
    (async () => {
      try {
        await authService.validateAccount({ activationKey });
        
        // Try to decode email from token if possible
        try {
          const decoded = JSON.parse(atob(activationKey.split('.')[1]));
          setEmail(decoded.sub || decoded.email || '');
        } catch {
          // If can't decode, no problem
        }

        setStatus('success');
        setMessage('Your account has been activated successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Activation failed.');
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background">
      <div className="bg-card shadow-lg rounded-2xl px-8 py-10 w-full max-w-md text-center border border-border">
        <h1 className="text-3xl font-bold mb-4 text-primary-color" style={{ fontFamily: 'Montserrat, Helvetica' }}>Account Activation</h1>
        
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-color"></div>
            </div>
            <p className="mb-6 text-black-2 animate-fade-in">Activating your account...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-semibold text-green-600 mb-2">Account Activated!</p>
            {email && <p className="text-black-2 mb-4">Your account <span className="font-semibold">{email}</span> has been activated.</p>}
            <p className="text-sm text-black-2">Redirecting to login page...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-semibold text-red-600 mb-2">Activation Failed</p>
            <p className="text-black-2">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
