'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import EventForm from '../components/forms/EventForm';
import { fetchApi } from '../../lib/fetchApi';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showModal, setShowModal] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await fetchApi('/api/events');
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Erreur chargement événements :', error);
      toast.error("Erreur lors du chargement des événements");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleEventAdded = () => {
    setShowModal(false);
    loadEvents();
    toast.success("📌 Événement ajouté");
    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

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
            {/* Calendrier */}
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            {/* Événements */}
            <div className="md:col-span-2 p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#110444] font-bold text-lg">Mes Événements</h2>
                <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredEvents.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun événement pour cette date.</p>
                ) : (
                  <ul className="space-y-2">
                    {filteredEvents.map((e) => (
                      <li key={e._id} className="text-sm text-gray-700">
                        📍 <strong>{e.title}</strong>
                        {e.start && (
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(e.start).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                        {e.address && <span className="ml-2">— {e.address}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  <EventForm
                    hour={null}
                    onSubmitSuccess={handleEventAdded}
                    onCancel={() => setShowModal(false)}
                  />
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
