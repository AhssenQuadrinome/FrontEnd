import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function AccountValidation() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleValidate = async () => {
    if (!code || !email) {
      setStatus('error');
      setMessage('Please enter the validation code.');
      return;
    }

    setStatus('loading');
    try {
      const response = await authService.validateAccount({ email, code });
      setStatus('success');
      setMessage('Your account has been activated successfully!');
      
      // Navigate based on user role after 2 seconds
      setTimeout(() => {
        const role = response.user.role;
        if (role === 'ADMINISTRATOR') {
          navigate('/admin');
        } else if (role === 'DRIVER') {
          navigate('/driver');
        } else if (role === 'CONTROLLER') {
          navigate('/controller');
        } else {
          navigate('/passenger');
        }
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || err.message || 'Validation failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background">
      <div className="bg-card shadow-lg rounded-2xl px-8 py-10 w-full max-w-md text-center border border-border">
        <h1 className="text-3xl font-bold mb-4 text-primary-color" style={{ fontFamily: 'Montserrat, Helvetica' }}>Account Activation</h1>
        
        {status === 'idle' && (
          <>
            <p className="mb-6 text-black-2">Enter the validation code sent to {email}</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-4 py-3 border rounded-xl mb-4"
            />
            <button
              onClick={handleValidate}
              className="w-full bg-gradient-to-r from-[#a54033] to-[#c15043] text-white py-3 rounded-xl font-semibold hover:from-[#8d3529] hover:to-[#a54033] transition-all"
            >
              Validate Account
            </button>
          </>
        )}
        
        {status === 'loading' && (
          <p className="mb-6 text-black-2 animate-fade-in">Validating your account...</p>
        )}
        
        {message && (
          <div className={`mt-6 text-lg font-medium ${status === 'success' ? 'text-lime' : 'text-d-2'} animate-fade-in`}>{message}</div>
        )}
      </div>
    </div>
  );
}
