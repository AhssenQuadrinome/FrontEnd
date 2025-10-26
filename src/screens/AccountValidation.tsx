import React, { useEffect, useState } from 'react';

const validateEndpoint = 'http://localhost:8080/authMgtApi/validate-account';

export default function AccountValidation() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Support both hash and search params for token
    let t = '';
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      t = params.get('token') || '';
    } else if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      t = hashParams.get('token') || '';
    }
    if (t) {
      setToken(t);
      (async () => {
        try {
              const res = await fetch(validateEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activationKey: t }),
              });
          if (res.ok) {
            setStatus('success');
            setMessage('Your account has been activated successfully!');
          } else {
            const data = await res.json();
            setStatus('error');
            setMessage(data.message || 'Activation failed.');
          }
        } catch (err) {
          setStatus('error');
          setMessage('Network error.');
        }
      })();
    } else {
      setStatus('error');
      setMessage('No token found in URL.');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-background">
      <div className="bg-card shadow-lg rounded-2xl px-8 py-10 w-full max-w-md text-center border border-border">
        <h1 className="text-3xl font-bold mb-4 text-primary-color" style={{ fontFamily: 'Montserrat, Helvetica' }}>Account Activation</h1>
        {status === 'loading' && (
          <p className="mb-6 text-black-2 animate-fade-in">Activating your account...</p>
        )}
        {message && (
          <div className={`mt-6 text-lg font-medium ${status === 'success' ? 'text-lime' : 'text-d-2'} animate-fade-in`}>{message}</div>
        )}
      </div>
    </div>
  );
}
