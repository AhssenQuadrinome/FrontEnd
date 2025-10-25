import { ChevronDownIcon } from "lucide-react";
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
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!from || !to || !dateTime) return "Please fill in all fields.";
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
    <div className="absolute top-[400px] right-0 w-full px-4 md:px-8">
      <img
        className="absolute top-0 left-0 w-full h-[600px] md:h-[800px] lg:h-[1057px] object-cover"
        alt="Group"
        src="/group-604.png"
      />

      <div className="relative flex mt-2 ml-[170px] justify-start pt-12 md:pt-16 lg:pt-[101px] pb-24 md:pb-32 lg:pb-[200px]">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[320px] md:max-w-[372px] h-auto flex bg-[#00000000] rounded-[30px] border border-solid border-[#ffffff] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] z-[70]"
        >
          <div className="w-full h-auto flex bg-[#df695126] rounded-[31px] p-6 md:p-0">
            <div className="inline-flex w-full md:mt-[29.4px] md:w-[210px] md:h-[384.07px] md:ml-[81px] relative flex-col items-center justify-center gap-6 md:gap-[30px]">
              <div className="inline-flex flex-col items-center justify-center gap-6 md:gap-[30px] relative flex-[0_0_auto] w-full">
                {/* Error message */}
                {error && (
                  <div className="w-full text-center text-[#df6951] font-bold text-xs md:text-sm mb-2">{error}</div>
                )}
                {/* Success message */}
                {success && (
                  <div className="w-full text-center text-green-600 font-bold text-xs md:text-sm mb-2">Booking confirmed!</div>
                )}
                <div className="flex flex-col w-full md:w-[210px] items-start relative flex-[0_0_auto]">
                  <div className="gap-2.5 self-stretch w-full flex-[0_0_auto] bg-[#ffffff80] rounded border border-solid border-[#79747e] flex flex-col items-start relative">
                    <Select value={from} onValueChange={setFrom}>
                      <SelectTrigger className="flex items-center pl-4 pr-0 py-1 relative self-stretch w-full flex-[0_0_auto] rounded border-0 bg-transparent focus:ring-0 focus:ring-offset-0 h-auto z-[80]">
                        <div className="flex flex-col h-10 items-start justify-center relative flex-1 grow">
                          <SelectValue className="[font-family:'Montserrat',Helvetica] font-semibold text-[#1c1b1f] text-sm md:text-base">
                            {from}
                          </SelectValue>

                          <div className="bg-[#ffffffcc] rounded-[14px] inline-flex items-center px-1 py-0 absolute -top-4 -left-1 pointer-events-none">
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-[#df6951] text-xs md:text-sm tracking-[0] leading-[normal]">
                              FROM
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-12 h-12 items-center justify-center gap-2.5 p-3 relative">
                          <ChevronDownIcon className="relative w-6 h-6" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="z-[90]">
                        {locations.map((location) => (
                          <SelectItem
                            key={location}
                            value={location}
                            className="[font-family:'Montserrat',Helvetica] font-semibold"
                          >
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="w-full md:w-[210px] h-14 flex flex-col items-start relative">
                  <div className="gap-2.5 self-stretch w-full flex-[0_0_auto] bg-[#ffffff80] rounded border border-solid border-[#79747e] flex flex-col items-start relative">
                    <Select value={to} onValueChange={setTo}>
                      <SelectTrigger className="flex items-center pl-4 pr-0 py-1 relative self-stretch w-full flex-[0_0_auto] rounded border-0 bg-transparent focus:ring-0 focus:ring-offset-0 h-auto z-[80]">
                        <div className="flex flex-col h-10 items-start justify-center relative flex-1 grow">
                          <SelectValue className="[font-family:'Montserrat',Helvetica] font-semibold text-[#1c1b1f] text-sm md:text-base">
                            {to}
                          </SelectValue>

                          <div className="bg-[#ffffff80] rounded-[17px] inline-flex items-center px-1 py-0 absolute -top-4 -left-1 pointer-events-none">
                            <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-[#df6951] text-xs md:text-sm tracking-[0] leading-[normal]">
                              TO
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col w-12 h-12 items-center justify-center gap-2.5 p-3 relative">
                          <ChevronDownIcon className="relative w-6 h-6" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="z-[90]">
                        {locations.map((location) => (
                          <SelectItem
                            key={location}
                            value={location}
                            className="[font-family:'Montserrat',Helvetica] font-semibold"
                          >
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col w-full md:w-[210px] items-start relative flex-[0_0_auto]">
                  <div className="gap-2.5 self-stretch w-full flex-[0_0_auto] bg-[#ffffff80] rounded border border-solid border-[#79747e] flex flex-col items-start relative">
                    <div className="flex items-center pl-4 pr-0 py-2 relative self-stretch w-full flex-[0_0_auto] rounded">
                      <div className="flex flex-col h-10 items-start justify-center relative flex-1 grow">
                        <input
                          type="datetime-local"
                          value={dateTime}
                          onChange={(e) => setDateTime(e.target.value)}
                          className="w-full bg-transparent border-0 outline-none [font-family:'Montserrat',Helvetica] font-semibold text-[#1c1b1f] text-sm md:text-base tracking-[0] leading-[normal] focus:ring-0"
                          required
                        />

                        <div className="bg-[#ffffff80] rounded-[18px] inline-flex items-center px-1 py-0 absolute -top-4 -left-1 pointer-events-none">
                          <div className="relative w-fit mt-[-1.00px] [font-family:'Montserrat',Helvetica] font-bold text-[#df6951] text-xs md:text-sm tracking-[0] leading-[normal]">
                            DATE &amp; TIME
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="relative w-full md:w-[210px] h-12 md:h-14 bg-[#df6951] rounded-[14.5px] [font-family:'Inter',Helvetica] font-bold text-[#ffffff] text-lg md:text-[22px] hover:bg-[#df6951]/90 h-auto z-[90]"
                disabled={loading || !!validate()}
              >
                {loading ? "Booking..." : "CONFIRM"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
