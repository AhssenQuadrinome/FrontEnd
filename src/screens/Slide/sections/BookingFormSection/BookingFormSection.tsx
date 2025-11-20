import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const locations = ["Qamra", "3irfan", "Casa", "Rabat", "Tanger", "Fes"];


export const BookingFormSection = (): JSX.Element => {
  const [from, setFrom] = useState("Qamra");
  const [to, setTo] = useState("3irfan");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!from || !to) return "Please select both locations.";
    if (from === to) return "Departure and destination must be different.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    // Simulate async booking
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="absolute top-[200px] right-0 w-full px-4 md:px-8">
      <img
        className="absolute top-0 left-0 w-full h-[600px] md:h-[800px] lg:h-[1057px] object-cover"
        alt="Group"
        src="/group-604.png"
      />

      <div className="absolute top-[300px] left-[-80px] flex mt-2 ml-[170px] justify-start pt-12 md:pt-16 lg:pt-[101px] pb-24 md:pb-32 lg:pb-[200px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[700px] md:max-w-[800px] lg:max-w-[900px] h-auto bg-pink/98 rounded-2xl backdrop-blur-xl shadow-xl border border-pink/50 transition-all duration-300 hover:shadow-2xl z-[70]"
        >
          <div className="w-full p-5 md:p-6">
            {/* Error/Success messages */}
            {error && (
              <div className="w-full text-center px-3 py-2 mb-4 bg-red-50 border border-red-200 rounded-lg text-[#df6951] font-medium text-xs animate-in fade-in duration-300">{error}</div>
            )}
            {success && (
              <div className="w-full text-center px-3 py-2 mb-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium text-xs animate-in fade-in duration-300">Route found! ✓</div>
            )}

            {/* Horizontal Form Layout */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              {/* FROM Select */}
              <div className="flex flex-col w-full md:flex-1">
                <label className="[font-family:'Inter',Helvetica] font-bold text-[#a54033] text-s mb-2 ml-1">
                  From
                </label>
                <div className="relative w-full bg-gradient-to-br from-[#fef5f3] to-[#fff5f0] rounded-xl border-2 border-[#df6951]/30 hover:border-[#df6951] focus-within:border-[#df6951] focus-within:shadow-lg focus-within:shadow-[#df6951]/20 transition-all duration-300">
                  <Select value={from} onValueChange={setFrom}>
                    <SelectTrigger className="flex items-center px-4 w-full rounded-xl border-0 bg-transparent focus:ring-0 focus:ring-offset-0 h-[52px] z-[80] w-[250px] font-bold">
                      <SelectValue className="[font-family:'Inter',Helvetica] font-bold text-[#a54033] text-sm">
                        {from}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[90] rounded-xl border-2 border-[#df6951]/30 shadow-2xl bg-white">
                      {locations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location}
                          className="[font-family:'Inter',Helvetica] font-medium text-sm text-[#a54033] hover:bg-gradient-to-r hover:from-[#df6951]/10 hover:to-[#a54033]/10 focus:bg-gradient-to-r focus:from-[#df6951]/10 focus:to-[#a54033]/10 rounded-lg m-1 cursor-pointer"
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Icon */}
              <div className="flex items-center justify-center mt-0 md:mt-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#df6951] to-[#a54033] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>

              {/* TO Select */}
              <div className="flex flex-col w-full md:flex-1">
                <label className="[font-family:'Inter',Helvetica] font-semibold text-[#a54033] text-s font-bold mb-2 ml-1">
                  To
                </label>
                <div className="relative w-full bg-gradient-to-br from-[#fef5f3] to-[#fff5f0] rounded-xl border-2 border-[#df6951]/30 hover:border-[#df6951] focus-within:border-[#df6951] focus-within:shadow-lg focus-within:shadow-[#df6951]/20 transition-all duration-300">
                  <Select value={to} onValueChange={setTo}>
                    <SelectTrigger className="flex items-center px-4 w-full rounded-xl border-0 bg-transparent focus:ring-0 focus:ring-offset-0 h-[52px] z-[80] w-[250px] font-bold">
                      <SelectValue className="[font-family:'Inter',Helvetica] font-bold text-[#a54033] text-sm">
                        {to}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[90] rounded-xl border-2 border-[#df6951]/30 shadow-2xl bg-white">
                      {locations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location}
                          className="[font-family:'Inter',Helvetica] font-medium text-sm text-[#a54033] hover:bg-gradient-to-r hover:from-[#df6951]/10 hover:to-[#a54033]/10 focus:bg-gradient-to-r focus:from-[#df6951]/10 focus:to-[#a54033]/10 rounded-lg m-1 cursor-pointer"
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full md:w-auto md:mt-6 h-[52px] px-8 bg-gradient-to-r from-[#df6951] to-[#a54033] hover:from-[#e07a67] hover:to-[#b64d40] rounded-xl [font-family:'Inter',Helvetica] font-bold text-white text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none z-[90]"
                disabled={loading || !!validate()}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : "Search"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
