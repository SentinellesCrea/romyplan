'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FaLocationDot, FaClock, FaArrowRightLong } from "react-icons/fa6";
import { HiCalendarDateRange } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { fetchApi } from '../../../lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import EventForm from '../forms/EventForm';
import { toast } from 'react-toastify';

const hexToRgba = (hex, alpha = 0.3) => {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await fetchApi('/api/events');
      const currentMonth = dayjs().format('YYYY-MM');

      const filtered = data.filter((event) =>
        dayjs(event.date).format('YYYY-MM') === currentMonth
      );

      const sorted = filtered.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setEvents(sorted);
    } catch (err) {
      console.error('Erreur chargement événements :', err);
      toast.error("Erreur lors du chargement des événements");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchApi(`/api/events/${id}`, { method: 'DELETE' });
      toast.success('🗑️ Événement supprimé');
      loadEvents();
    } catch (err) {
      console.error('Erreur suppression événement :', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md transition transform hover:-translate-y-1 duration-300 animate-fadeUp">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Événements du mois</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun événement ce mois-ci.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => {
            const date = new Date(event.date);
            const formatted = date.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
            });

            return (
              <li
                key={event._id}
                className="relative p-3 rounded-lg text-sm shadow-sm hover:shadow-md transition flex flex-col gap-1"
                style={{
                  backgroundColor: hexToRgba(event.color || '#60a5fa', 0.3),
                  borderLeft: `4px solid ${event.color || '#60a5fa'}`,
                }}
              >
                <button
                  onClick={() => handleDelete(event._id)}
                  className="absolute top-2 right-2 text-m text-gray-400 hover:text-red-500"
                  title="Supprimer"
                >
                  <RxCross2 />
                </button>

                <div className="text-[#110444] font-semibold">{event.title}</div>

                <div className="flex items-center gap-2 text-gray-700">
                  <HiCalendarDateRange /><span>{formatted}</span>
                </div>

                {event.start && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock />
                    {new Date(event.start).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {event.end && (
                      <>
                        <span className="text-gray-400"><FaArrowRightLong /></span>
                        {new Date(event.end).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    )}
                  </div>
                )}

                {event.address && (
                  <div className="flex gap-2 text-[#110444] font-semibold">
                    <FaLocationDot />
                    {event.address}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EventForm
            hour={null}
            onSubmitSuccess={() => {
              setShowModal(false);
              loadEvents();
              toast.success('📅 Événement ajouté');
            }}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
