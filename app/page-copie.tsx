'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Calendar from './components/Calendar';
import { FiPlusCircle } from 'react-icons/fi';
import EvenementForm from './components/forms/EvenementForm';
import AnniversaireForm from './components/forms/AnniversaireForm';
import RendezVousForm from './components/forms/RendezVousForm';
import Navbar from './components/Navbar';
import { fetchApi } from '../lib/fetchApi';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [eventType, setEventType] = useState<string | null>(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [eventsByDate, setEventsByDate] = useState<Record<string, string[]>>({});

  // 🔄 Chargement initial de tous les événements du mois
  const fetchAllEventsForMonth = async () => {
    const start = dayjs().startOf('month').format('YYYY-MM-DD');
    const end = dayjs().endOf('month').format('YYYY-MM-DD');

    try {
      const all = await fetchApi(`/api/events/range?start=${start}&end=${end}`);
      const map: Record<string, string[]> = {};

      all.forEach((event: any) => {
        const dateKey = new Date(event.date).toISOString().split('T')[0];
        if (!map[dateKey]) map[dateKey] = [];
        if (!map[dateKey].includes(event.category)) {
          map[dateKey].push(event.category);
        }
      });

      setEventsByDate(map);
    } catch (err) {
      console.error('Erreur lors du chargement des événements du mois :', err.message);
    }
  };

  const fetchEventsForDate = async (date: string) => {
    try {
      const data = await fetchApi(`/api/events?date=${date}`);
      setEvents(data);
    } catch (err) {
      console.error('Erreur en récupérant les événements :', err.message);
    }
  };

  useEffect(() => {
    fetchAllEventsForMonth();
    fetchEventsForDate(selectedDate);
  }, []);

  const handleDayClick = (date: string) => {
    setSelectedDate(date);
    fetchEventsForDate(date);
  };

  const handleFormSubmit = () => {
    setShowPopup(false);
    setEventType(null);
    fetchEventsForDate(selectedDate);
    fetchAllEventsForMonth();
  };

  const renderSelectedForm = () => {
    switch (eventType) {
      case 'rdv':
        return <RendezVousForm onSubmit={handleFormSubmit} />;
      case 'anniv':
        return <AnniversaireForm onSubmit={handleFormSubmit} />;
      case 'event':
        return <EvenementForm onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
  };

  const formatTimeRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const format = (d: Date) =>
    `${d.getHours()}h${d.getMinutes().toString().padStart(2, '0')}`;

  return `${format(startDate)} - ${format(endDate)}`;
  };


  return (
    <div className="bg-white">
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex">
        {/* Colonne gauche (calendrier) */}
        <div className="w-full md:w-2/5 lg:w-1/3 p-6">
          <Calendar onDayClick={handleDayClick} eventsByDate={eventsByDate} />
          <button
            className="flex items-center gap-2 bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded hover:bg-blue-200 transition mt-10"
            onClick={() => setShowPopup(true)}
          >
            <FiPlusCircle /> Ajouter un évenement
          </button>
        </div>

        {/* Colonne droite (événements sélectionnés) */}
        <div className="hidden md:block w-3/5 lg:w-2/3 p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Événements du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h2>
          {events.length === 0 ? (
            <p className="text-gray-500">Aucun événement pour ce jour.</p>
          ) : (
            <div className="flex flex-row gap-4 flex-wrap">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white border-l-4 shadow rounded-lg p-4 w-64 min-h-[160px] flex flex-col justify-between"
                  style={{ borderColor: event.color || '#ccc' }}
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 break-words">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">{event.address}</p>
                    <p className="text-sm text-gray-500">
                      {event.allDay
                        ? 'Toute la journée'
                        : event.start && event.end
                          ? formatTimeRange(event.start, event.end)
                          : 'Heure non précisée'}
                    </p>

                  </div>

                  <span className="inline-block text-xs px-2 py-1 bg-gray-100 rounded text-gray-600 self-start">
                    {event.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* POPUP OVERLAY */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            {eventType === null ? (
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Quel type d’événement voulez-vous ajouter ?
                </h2>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setEventType('rdv')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 rounded"
                  >
                    Rendez-vous
                  </button>
                  <button
                    onClick={() => setEventType('anniv')}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium py-2 rounded"
                  >
                    Anniversaire
                  </button>
                  <button
                    onClick={() => setEventType('event')}
                    className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 rounded"
                  >
                    Autre Événement
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="mt-4 text-sm text-gray-500 underline"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Ajouter un {eventType === 'rdv'
                      ? 'rendez-vous'
                      : eventType === 'anniv'
                      ? 'anniversaire'
                      : 'événement'}
                  </h2>
                  <button
                    onClick={() => {
                      setEventType(null);
                      setShowPopup(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕ Fermer
                  </button>
                </div>
                {renderSelectedForm()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
