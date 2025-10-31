import { useState } from 'react';
import DashboardLayout from '../../DashboardLayout';
import Ticket from '../../Ticket';
import { User } from '../../../types';

const mockUser: User = {
  id: '1',
  name: 'Abderrahmane Essahih',
  email: 'abderrahmane.essahih@example.com',
  role: 'passenger',
};

const stations = [
  'Sidi Yaacoub',
  'Manssour',
  'Rabat Ville',
  'Agdal',
  'Salé',
  'Youssoufia',
  'Temara',
  'Akkari',
  'Hay Riad',
  'Oudayas',
];

function getTicketSuggestions(departure: string, arrival: string) {
  // Simulate ticket suggestions with different intermediate stations and prices
  if (!departure || !arrival || departure === arrival) return [];
  const depIndex = stations.indexOf(departure);
  const arrIndex = stations.indexOf(arrival);
  if (depIndex === -1 || arrIndex === -1 || depIndex >= arrIndex) return [];
  const suggestions = [];
  for (let i = depIndex + 1; i <= arrIndex; i++) {
    const intermediate = stations.slice(depIndex + 1, i);
    suggestions.push({
      departure,
      arrival,
      duration: `${(i - depIndex) * 45} min`,
      connections: intermediate.length,
      trainType: 'Express',
      departureStation: departure,
      arrivalStation: stations[i],
      price: 5 + intermediate.length,
      currency: 'DH',
      passengers: 1,
      imminent: false,
      intermediateStations: intermediate.map((station, idx) => ({
        time: `${8 + idx}:00`,
        station,
        trainType: 'Local',
      })),
    });
  }
  return suggestions;
}

export default function BuyTicketPage() {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [showResults, setShowResults] = useState(false);

  const ticketSuggestions = getTicketSuggestions(departure, arrival);

  return (
    <DashboardLayout user={mockUser} notificationCount={0}>
      <div className="max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6 text-navy">Acheter un billet</h2>
        <form
          className="flex flex-col md:flex-row gap-4 mb-8 justify-end items-end"
          onSubmit={e => {
            e.preventDefault();
            setShowResults(true);
          }}
        >
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Départ</label>
            <select
              className="w-full border border-[#A54033] bg-[#A54033]/10 text-navy font-bold rounded-lg px-3 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-[#A54033]"
              value={departure}
              onChange={e => {
                setDeparture(e.target.value);
                setShowResults(false);
              }}
            >
              <option value="">Sélectionner</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Arrivée</label>
            <select
              className="w-full border border-[#A54033] bg-[#A54033]/10 text-navy font-bold rounded-lg px-3 py-2 h-12 focus:outline-none focus:ring-2 focus:ring-[#A54033]"
              value={arrival}
              onChange={e => {
                setArrival(e.target.value);
                setShowResults(false);
              }}
            >
              <option value="">Sélectionner</option>
              {stations.map(station => (
                <option key={station} value={station}>{station}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#A54033] text-white px-6 h-12 rounded-lg font-semibold shadow hover:bg-[#A54033]/90 transition"
          >
            Voir les billets
          </button>
        </form>
        {showResults && (
          <div className="space-y-6">
            {ticketSuggestions.length === 0 ? (
              <p className="text-center text-gray-500">Aucune suggestion disponible pour cette combinaison.</p>
            ) : (
              ticketSuggestions.map((ticket, idx) => (
                <Ticket key={idx} {...ticket} />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
