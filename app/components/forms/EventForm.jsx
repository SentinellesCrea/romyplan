'use client';

import { useState } from 'react';
import { fetchApi } from '../../../lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { toast } from 'react-toastify';

const categories = ['Rendez-vous', 'Événement'];
const colors = ['#ff2424'];

export default function EventForm({ onSubmitSuccess, onCancel, hour = null }) {
  const [form, setForm] = useState({
    title: '',
    address: '',
    date: '',
    allDay: false,
    startHour: 8,
    startMinutes: 0,
    endHour: 9,
    endMinutes: 0,
    category: categories[0],
    color: '#ff2424',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date) {
      return toast.warning('Le titre et la date sont requis');
    }

    const baseDate = new Date(form.date);

    const eventToSave = {
      title: form.title,
      address: form.address,
      date: baseDate,
      allDay: form.allDay,
      category: form.category,
      color: form.color || '#60a5fa',
      start: form.allDay
        ? null
        : new Date(baseDate.setHours(form.startHour, form.startMinutes)),
      end: form.allDay
        ? null
        : new Date(baseDate.setHours(form.endHour, form.endMinutes)),
    };

    try {
      await fetchApi('/api/events', {
        method: 'POST',
        body: eventToSave,
      });
      toast.success('📌 Événement ajouté');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('Erreur ajout événement', err);
      toast.error('Erreur lors de l’enregistrement');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto space-y-5 border border-pink-100">
      <h2 className="text-[#522c01] text-xl font-bold mb-4">Ajouter un événement</h2>

      {/* Couleur */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Couleur</label>
        <div className="flex gap-2 mt-1">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, color }))}
              className={`w-6 h-6 rounded-full border-2 transition duration-200 ${
                form.color === color
                  ? 'border-[#522c01] scale-110 ring-2 ring-[#dbcbb0]'
                  : 'border-[#dbcbb0]'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Titre</label>
        <input
          type="text"
          name="title"
          placeholder="Ex: Rendez-vous médical"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      {/* AllDay */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="allDay"
          id="allDay"
          checked={form.allDay}
          onChange={handleChange}
        />
        <label htmlFor="allDay" className="text-sm text-[#522c01]">
          Toute la journée
        </label>
      </div>

      {/* Heures si allDay false */}
      {!form.allDay && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[#522c01] font-medium mb-1">Début</label>
            <div className="flex gap-2">
              <select
                name="startHour"
                value={form.startHour}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-[#dbcbb0] p-2"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}h</option>
                ))}
              </select>
              <select
                name="startMinutes"
                value={form.startMinutes}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-[#dbcbb0] p-2"
              >
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-[#522c01] font-medium mb-1">Fin</label>
            <div className="flex gap-2">
              <select
                name="endHour"
                value={form.endHour}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-[#dbcbb0] p-2"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}h</option>
                ))}
              </select>
              <select
                name="endMinutes"
                value={form.endMinutes}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-[#dbcbb0] p-2"
              >
                {[0, 15, 30, 45].map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Catégorie */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Catégorie</label>
        <select
          name="category"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Adresse</label>
        <input
          type="text"
          name="address"
          placeholder="Lieu ou adresse"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 mt-4">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>Enregistrer</PrimaryButton>
      </div>
    </div>
  );
}
