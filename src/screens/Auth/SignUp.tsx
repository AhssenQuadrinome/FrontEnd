import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import authService from "../../services/authService";

const SignUp = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register({
        firstName,
        lastName,
        email,
        mobile,
        gender,
        dateOfBirth,
        address,
        password,
        role: 'PASSENGER' // Default role for registration
      });
      // Navigate to account validation page
      navigate("/account-validation", { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fff7f6] via-white to-[#fef3f2] flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#a54033]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#181e4b]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      {/* Bus image accent */}
      {/* <img
        src="/chatgpt-image-17-oct--2025--17-41-18-2.png"
        alt="bus"
        className="hidden lg:block absolute left-6 top-12 w-[70px] object-contain"
      /> */}
      {/* Return to landing page button - now left below bus image */}
      <div className="absolute top-10 left-10 z-10">
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f5b75c] to-[#df6951] text-[#181e4b] font-semibold shadow-md hover:from-[#df6951] hover:to-[#f5b75c] transition-colors text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Return to Home
        </Link>
      </div>

      {/* Signup card */}
      <div className="relative w-full max-w-3xl">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#181e4b] tracking-tight">Create your account</h2>
                </div>
              </div>
              <p className="text-[#555770] ml-15">Join OurBusWay — fast, safe and reliable</p>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-[#181e4b] font-medium">First name</Label>
                <Input id="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[#181e4b] font-medium">Last name</Label>
                <Input id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email" className="text-[#181e4b] font-medium">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="mobile" className="text-[#181e4b] font-medium">Mobile</Label>
                <Input id="mobile" value={mobile} onChange={(e)=>setMobile(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="password" className="text-[#181e4b] font-medium">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="text-[#181e4b] font-medium">Date of birth</Label>
                <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={(e)=>setDateOfBirth(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              <div >
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
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-[#181e4b] font-medium">Address</Label>
                <Input id="address" value={address} onChange={(e)=>setAddress(e.target.value)} className="h-12 pl-4 pr-4 border-[#e0e0e0] focus:border-[#a54033] focus:ring-2 focus:ring-[#a54033]/20 transition-all duration-200 rounded-xl" />
              </div>
              {error && (
                <div className="md:col-span-2 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}
              <div className="md:col-span-2">
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
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-8 md:col-span-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e0e0e0]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#555770]">Already registered?</span>
              </div>
            </div>

            {/* Sign in link */}
            <div className="md:col-span-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-[#a54033] font-semibold hover:text-[#8d3529] transition-colors group"
              >
                Sign in
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

export default SignUp;
