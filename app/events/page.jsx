'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import { fetchApi } from '../../lib/fetchApi';
import dayjs from 'dayjs';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchApi('/api/events');
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Erreur chargement événements :', error);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => e.date?.slice(0, 10) === selectedDate);
  }, [events, selectedDate]);

  return (
    <div className="w-full bg-[#fffaf2] min-h-screen">
      <Header />

      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mes Événements du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            <div className="md:col-span-2 p-4 md:p-0">
              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun événement pour cette date.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredEvents.map((e) => (
                      <li key={e._id} className="text-sm text-gray-700">
                        📍 <strong>{e.title}</strong>
                        {e.address && <span> — {e.address}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
