import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import authService from "../../services/authService";

const Login = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await authService.login({ username: email, password });
      
      // Navigate based on user role
      const role = response.user.role;
      if (role === 'ADMINISTRATOR') {
        navigate('/admin/overview');
      } else if (role === 'DRIVER') {
        navigate('/driver/trips');
      } else if (role === 'CONTROLLER') {
        navigate('/controller/validate');
      } else {
        navigate('/passenger/tickets');
      }
    } catch (err: any) {
      // Handle specific error cases
      if (err.response?.status === 403) {
        const errorMessage = err.response?.data?.message || "";
        
        // Check for specific error messages
        if (errorMessage.includes("disabled") || errorMessage.includes("Disabled")) {
          setError("Your account has been disabled by an administrator. Please contact support for assistance.");
        } else if (errorMessage.includes("not yet validated") || errorMessage.includes("not activated") || errorMessage.includes("not yet activated")) {
          setError("Your account is not yet activated. Please check your email for the activation link.");
        } else {
          setError(errorMessage || "Access denied. Please contact support.");
        }
      } else if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#f5b75c]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#df6951]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
  

      {/* Return to landing page button - now left below bus image */}
      <div className="absolute top-10 left-10 z-10">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f5b75c] to-[#df6951] text-[#181e4b] font-semibold shadow-md hover:from-[#df6951] hover:to-[#f5b75c] transition-colors text-white ">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return to Home
        </Link>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md">
        {/* Decorative accent */}
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-gradient-to-br from-[#a54033] to-[#c15043] rounded-2xl opacity-10 blur-xl"></div>
        
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#a54033]/10 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-[#a54033] via-[#c15043] to-[#a54033]"></div>
          
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#a54033] to-[#8d3529] rounded-xl flex items-center justify-center shadow-lg shadow-[#a54033]/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#181e4b] tracking-tight">Welcome Back</h2>
                </div>
              </div>
              <p className="text-[#555770] ml-15">Sign in to continue to OurBusWay</p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#181e4b] font-medium">Email Address</Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#a54033]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#181e4b] font-medium">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-[#a54033] hover:text-[#8d3529] font-medium transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#a54033]/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className={cn(
                  "w-full h-12 rounded-xl font-semibold text-white shadow-lg shadow-[#a54033]/25",
                  "bg-gradient-to-r from-[#a54033] to-[#c15043]",
                  "hover:from-[#8d3529] hover:to-[#a54033]",
                  "transform transition-all duration-200",
                  "hover:scale-[1.02] hover:shadow-xl hover:shadow-[#a54033]/30",
                  "active:scale-[0.98]",
                  loading && "opacity-70 cursor-not-allowed hover:scale-100"
                )}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e0e0e0]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#555770]">New to OurBusWay?</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center gap-2 text-[#a54033] font-semibold hover:text-[#8d3529] transition-colors group"
              >
                Create an account
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom decorative accent */}
        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-[#181e4b] to-[#2a3166] rounded-2xl opacity-10 blur-xl"></div>
      </div>
    </div>
  );
};

export default Login;