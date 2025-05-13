'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { toast } from 'react-toastify';

const colors = ['#ec4899'];

export default function AnniversaryForm({ onSubmitSuccess, onCancel }: { onSubmitSuccess?: () => void }) {
  const [form, setForm] = useState({
    name: '',
    date: '',
    description: '',
    color: '#ec4899',
    allDay: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.date) {
      return toast.warning('Le nom et la date sont requis');
    }

    try {
      await fetchApi('/api/anniversaries', {
        method: 'POST',
        body: form,
      });
      toast.success('🎉 Anniversaire ajouté avec succès');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('❌ Erreur ajout anniversaire', err);
      toast.error('Erreur lors de l’enregistrement');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto space-y-5 border border-pink-100">
      <h2 className="text-[#522c01] text-xl font-bold mb-4">Ajouter un anniversaire</h2>

      {/* Nom */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Nom</label>
        <input
          type="text"
          name="name"
          placeholder="Ex: Sophie Martin"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Date</label>
        <input
          type="date"
          name="date"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      {/* Toute la journée */}
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

      {/* Description */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Description (optionnelle)</label>
        <textarea
          name="description"
          placeholder="Détails supplémentaires..."
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 h-24 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.description}
          onChange={handleChange}
        />
      </div>

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
                form.color === color ? 'border-[#522c01] scale-110 ring-2 ring-[#dbcbb0]' : 'border-[#dbcbb0]'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 mt-4">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>Enregistrer</PrimaryButton>
      </div>
    </div>
  );
}
