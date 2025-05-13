'use client';

import { useState } from 'react';
import { fetchApi } from '../../../lib/fetchApi';

export default function RendezVousForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    date: '',
    startHour: 8,
    startMinutes: 0,
    endHour: 9,
    endMinutes: 0,
    allDay: false,
  });

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert("Le titre est requis");
    if (!formData.date) return alert("La date est requise");

    // Créer les objets Date pour start et end
    const [year, month, day] = formData.date.split('-').map(Number);

    const start = new Date(year, month - 1, day, formData.startHour, formData.startMinutes);
    const end = new Date(year, month - 1, day, formData.endHour, formData.endMinutes);

    if (!formData.allDay && start >= end) {
      return alert("L'heure de fin doit être après l'heure de début.");
    }

    const eventToSave = {
      title: formData.title,
      address: formData.address,
      date: new Date(formData.date), // utile pour l'affichage/calendrier
      start: formData.allDay ? null : start,
      end: formData.allDay ? null : end,
      allDay: formData.allDay,
      category: 'Rendez-vous',
      color: 'blue',
    };

    try {
      await fetchApi('/api/events', {
        method: 'POST',
        body: eventToSave,
      });

      alert("Rendez-vous enregistré !");
      onSubmit(eventToSave);
    } catch (err) {
      alert("Erreur lors de l’enregistrement");
    }
  };

  return (
    <div className="space-y-3 bg-blue-50 p-4 text-black rounded-lg">
      <h2 className="font-bold text-blue-700 mb-2">Ajouter un rendez-vous</h2>

      <label className="block">
        <span className="text-sm text-blue-800">Date du rendez-vous</span>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full border px-3 py-1 rounded mt-1"
        />
      </label>

      <input
        type="text"
        placeholder="Titre du rendez-vous"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full border px-3 py-1 rounded"
      />

      <input
        type="text"
        placeholder="Adresse"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full border px-3 py-1 rounded"
      />

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="rdvAllDay"
          checked={formData.allDay}
          onChange={() => setFormData({ ...formData, allDay: !formData.allDay })}
        />
        <label htmlFor="rdvAllDay" className="text-sm text-blue-800">
          Toute la journée
        </label>
      </div>

      {!formData.allDay && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-20">De :</span>
            <select
              value={formData.startHour}
              onChange={(e) => setFormData({ ...formData, startHour: parseInt(e.target.value) })}
              className="border px-2 py-1 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}h</option>
              ))}
            </select>
            <select
              value={formData.startMinutes}
              onChange={(e) => setFormData({ ...formData, startMinutes: parseInt(e.target.value) })}
              className="border px-2 py-1 rounded"
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 w-20">À :</span>
            <select
              value={formData.endHour}
              onChange={(e) => setFormData({ ...formData, endHour: parseInt(e.target.value) })}
              className="border px-2 py-1 rounded"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i}h</option>
              ))}
            </select>
            <select
              value={formData.endMinutes}
              onChange={(e) => setFormData({ ...formData, endMinutes: parseInt(e.target.value) })}
              className="border px-2 py-1 rounded"
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
      >
        Enregistrer
      </button>
    </div>
  );
}
