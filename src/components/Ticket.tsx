import { useState } from "react";
import { Train } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";


interface IntermediateStation {
  time: string;
  station: string;
  trainType: string;
}

interface TicketProps {
  departure: string;
  arrival: string;
  duration: string;
  connections: number;
  trainType: string;
  departureStation: string;
  arrivalStation: string;
  price: number;
  currency?: string;
  passengers?: number;
  imminent?: boolean;
  intermediateStations?: IntermediateStation[];
  routeId?: string; // Added for purchase
  onPurchase?: (routeId: string, price: number) => void; // Added purchase handler
}

const Ticket = ({
  departure,
  arrival,
  duration,
  connections,
  trainType,
  departureStation,
  arrivalStation,
  price,
  currency = "DH",
  passengers = 1,
  imminent = false,
  intermediateStations = [],
  routeId,
  onPurchase,
}: TicketProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePurchase = () => {
    if (onPurchase && routeId) {
      onPurchase(routeId, price);
    }
  };
  return (
  <Card className="max-w-2xl overflow-visible border-2 border-[#A54033]/70 border-dashed rounded-2xl shadow-lg p-6 overflow-visible bg-white/30 backdrop-blur-md relative">
    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#A54033]/90 via-[#A54033]/60 to-[#A54033]/40 animate-[shimmer_2.5s_linear_infinite]" style={{maskImage:'linear-gradient(120deg,transparent 0%,#fff3 50%,transparent 100%)'}} />
    <div className="relative z-10">
    {/* Semi-circle clips */}
    <div className="absolute left-[-19px] top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-8 rounded-r-full bg-[#F9FAFC] border-r-2 border-t-2 border-b-2 border-dashed border-[#A54033]"></div>
    <div className="absolute right-[-19px] top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-8 rounded-l-full bg-[#F9FAFC] border-l-2 border-t-2 border-b-2 border-dashed border-[#A54033]"></div>
      
  <div className="relative flex flex-col">
        {/* {imminent && (
          <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0 px-3 py-1 text-xs font-medium">
            Départ imminent
          </Badge>
        )} */}

        <div className="mt-8 grid grid-cols-[1fr,auto,1fr,auto] items-center gap-4">
          {/* Departure Section */}
          <div className="text-center">
            <p className="text-sm font-medium text-navy mb-2">Departure</p>
            <p className="text-2xl font-bold text-navy uppercase tracking-tight">
              {departure}
            </p>
          </div>

          {/* Duration & Connection */}
          <div className="flex flex-col items-center justify-center px-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-[#A54033]"></div>
              <div className="h-px w-16 bg-navy"></div>
              <div className="h-2 w-2 rounded-full bg-[#A54033]"></div>
            </div>
            <p className="text-sm font-semibold text-navy whitespace-nowrap">
              {duration}
            </p>
            <p className="text-xs text-navy whitespace-nowrap">
              {connections} Station{connections > 1 ? "s" : ""} in between
            </p>
          </div>

          {/* Arrival Section */}
          <div className="text-center">
            <p className="text-sm font-medium text-navy mb-2">Arrival</p>
            <p className="text-2xl font-bold text-navy uppercase tracking-tight">
              {arrival}
            </p>
          </div>

          {/* Price & Booking Section */}
          <div className="flex flex-col items-end gap-2 pl-6 border-l-2 border-dashed border-navy">
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">
                {passengers} Passenger{passengers > 1 ? "s" : ""}
              </p>
              
              <p className="text-3xl font-bold text-[#A54033]">
                {price} {currency}
              </p>
            </div>
            <Button 
              onClick={handlePurchase}
              disabled={!onPurchase || !routeId}
              className="w-full bg-[#A54033] hover:bg-navy-dark text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book
            </Button>
          </div>
        </div>

        {/* Train Details Section */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mt-6 pt-4 border-t border-navy flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-navy" />
                <div>
                  {/* <Badge className="bg-orange-500 hover:bg-orange-500 text-white border-0 px-2 py-0.5 text-xs font-medium">
                    {trainType}
                  </Badge> */}
                  <p className="text-xs font-semibold text-navy mt-1 uppercase">
                    {departure}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Train className="h-5 w-5 text-navy" />
                <div>
                  {/* <Badge className="bg-orange-500 hover:bg-orange-500 text-white border-0 px-2 py-0.5 text-xs font-medium">
                    {trainType}
                  </Badge> */}
                  <p className="text-xs font-semibold text-navy mt-1 uppercase">
                    {arrival}
                  </p>
                </div>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <button className="text-navy hover:text-navy-dark transition-all">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    d="M10 12L10 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6 10L10 14L14 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-4">
            <div className="space-y-3 px-4">
              <p className="text-sm font-semibold text-navy mb-2">Stations in between</p>
              {intermediateStations.map((station, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-l-2 border-dashed border-navy pl-4">
                  <div className="h-3 w-3 rounded-full bg-navy"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy uppercase">
                      {station.station}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  </Card>
  );
};

export default Ticket;
