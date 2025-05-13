'use client';

import { useEffect, useState } from 'react';
import { FaLocationDot, FaClock, FaArrowRightLong } from "react-icons/fa6";
import { HiCalendarDateRange } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { fetchApi } from '@/lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import EventForm from '../forms/EventForm';
import { toast } from 'react-toastify';

type EventType = {
  _id: string;
  title: string;
  date: string;
  hour: number | null;
  minutes?: number;
  address?: string;
  color?: string;
};

const hexToRgba = (hex: string, alpha: number = 0.3) => {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Events() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadEvents = async () => {
    try {
      const data = await fetchApi('/api/events');
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sorted.slice(0, 5)); // ✅ les 5 plus récents
    } catch (err) {
      console.error('Erreur chargement événements :', err);
      toast.success('Evenement ajouté avec succès');

    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/api/events/${id}`, { method: 'DELETE' });
      toast.success('🗑️ Événement supprimé');
      loadEvents();
    } catch (err) {
      console.error('Erreur suppression événement :', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEventAdded = () => {
    setShowModal(false);
    loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md transition transform hover:-translate-y-1 duration-300 animate-fadeUp">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Prochains événements</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun événement à venir.</p>
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
                {/* Bouton supprimer */}
                <button
                  onClick={() => handleDelete(event._id)}
                  className="absolute top-2 right-2 text-m text-gray-400 hover:text-red-500"
                  title="Supprimer"
                >
                  <RxCross2 />
                </button>

                {/* Titre */}
                <div className="text-[#110444] font-semibold">{event.title}</div>

                {/* Date + lieu */}
                <div className="flex items-center gap-2 text-gray-700">
                  <HiCalendarDateRange /><span>{formatted}</span>
                </div>

                {/* Heure */}
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

                {/* Titre */}
                <div className="flex gap-2 text-[#110444] font-semibold">
                  <FaLocationDot />
                  {event.address}
                </div>
              </li>

            );
          })}
        </ul>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <EventForm
            hour={null}
            onSubmitSuccess={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
