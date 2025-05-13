'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FiPlusCircle, FiTrash } from 'react-icons/fi';
import { MdLocationOn } from "react-icons/md";
import { fetchApi } from '../../../lib/fetchApi';
import EventForm from '../../components/EventForm';


export default function DayViewPage() {
  const params = useParams();
  const date = Array.isArray(params?.date) ? params.date[0] : params?.date;

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ label: string; color: string } | null>(null);
  const [events, setEvents] = useState<
    { hour: number; title: string; description?: string; address?: string }[]
  >([]);

  useEffect(() => {
    if (date) setSelectedDate(date);
  }, [date]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchEvents = async () => {
      try {
        const data = await fetchApi(`/api/events?date=${selectedDate}`);
        setEvents(data);
      } catch (err) {
        console.error("Erreur chargement des événements :", err);
      }
    };

    fetchEvents();
  }, [selectedDate]);

  const reloadEvents = async () => {
    if (!selectedDate) return;
    const data = await fetchApi(`/api/events?date=${selectedDate}`);
    setEvents(data);
  };

  const handleSubmit = async (
    data: { title: string; description: string; address: string; hour: number }
  ) => {
    if (!selectedDate) return;

    try {
      await fetchApi('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: selectedDate,
        }),
      });

      await reloadEvents();
      setShowForm(false);
      alert('Événement ajouté !');
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
  <div>
    <Navbar />
  <main className="min-h-screen bg-gray-50 flex">

    {/* Colonne gauche */}
      <div className="w-full md:w-2/5 lg:w-1/3 p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-gray-900 font-bold mb-2">
            Planning du {dayjs(selectedDate).format('dddd D MMMM YYYY')}
          </h1>

          <button
            className="bg-blue-100 text-blue-800 font-medium px-4 py-2 rounded hover:bg-blue-200 transition"
            onClick={() => {
              setShowForm(true);
              setSelectedCategory({ label: "Rendez-vous", color: "blue" });
            }}
          >
            Ajouter un rendez-vous
          </button>

          <button
            className="bg-red-100 text-red-800 font-medium px-4 py-2 rounded hover:bg-red-200 transition"
            onClick={() => {
              setShowForm(true);
              setSelectedCategory({ label: "Événement", color: "red" });
            }}
          >
            Ajouter un événement
          </button>

          <button
            className="bg-pink-100 text-pink-800 font-medium px-4 py-2 rounded hover:bg-pink-200 transition"
            onClick={() => {
              setShowForm(true);
              setSelectedCategory({ label: "Anniversaire", color: "pink" });
            }}
          >
            Ajouter un anniversaire
          </button>
        </div>

        {/* Formulaire en popup */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
              <EventForm
                hour={null}
                category={selectedCategory}
                onSubmit={(data) => {
                  handleSubmit(data); // tu peux modifier handleSubmit pour inclure la couleur
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}
      </div>


    {/* Colonne droite */}
    <div className="hidden md:block w-3/5 lg:w-2/3 p-2">
      <div className="w-full h-full bg-white rounded-lg shadow p-2 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tous les événements de la journée
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-500">Aucun événement pour cette journée.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="relative bg-blue-50 border border-blue-200 rounded-lg p-4 pt-6 shadow-sm min-h-[160px]"
              >
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                  onClick={async () => {
                    const confirm = window.confirm("Supprimer cet événement ?");
                    if (!confirm) return;

                    try {
                      await fetchApi(`/api/events/${event._id}`, { method: 'DELETE' });
                      const updated = await fetchApi(`/api/events?date=${selectedDate}`);
                      setEvents(updated);
                    } catch (err) {
                      alert("Erreur lors de la suppression");
                    }
                  }}
                >
                  <FiTrash />
                </button>

                <p className="text-xs text-gray-500 mb-1 font-medium">
                  {Math.floor(event.hour)}h
                  {Math.round((event.hour % 1) * 60) > 0
                    ? `:${Math.round((event.hour % 1) * 60).toString().padStart(2, '0')}`
                    : ''}
                </p>
                <p className="font-semibold text-gray-800 mb-1">{event.title}</p>
                {event.description && (
                  <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                )}
                {event.address && (
                  <p className="flex text-xs text-gray-500 italic"><MdLocationOn />{event.address}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
  </div>
);

}
