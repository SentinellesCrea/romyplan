'use client';

import { useState } from 'react';
import { fetchApi } from '@/lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { toast } from 'react-toastify';

const colors = ['#10b981'];
const emojis = ['📝', '📌', '💡', '🔥', '📖', '💭', '✝️', '📓', '🧠', '📷'];

export default function NoteForm({ onSubmitSuccess, onCancel }: { onSubmitSuccess?: () => void }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    date: '',
    color: '#10b981',
    emoji: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date) {
      return toast.warning('Le titre et la date sont requis');
    }

    try {
      await fetchApi('/api/notes', {
        method: 'POST',
        body: form,
      });
      toast.success('📝 Note ajoutée');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('Erreur ajout note', err);
      toast.error('Erreur lors de l’enregistrement');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto space-y-5 border border-pink-100">
      <h2 className="text-[#522c01] text-xl font-bold mb-4">Ajouter une note</h2>

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

      {/* Titre */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Titre</label>
        <input
          type="text"
          name="title"
          placeholder="Ex: Pensée du jour"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* Contenu */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Contenu</label>
        <textarea
          name="content"
          placeholder="Contenu de la note..."
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 h-24 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.content}
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

      {/* Emoji */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Emoji</label>
        <div className="flex flex-wrap gap-2 text-xl">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, emoji }))}
              className={`p-2 rounded-full transition duration-150 ${
                form.emoji === emoji ? 'bg-pink-200 ring-2 ring-pink-400' : 'hover:bg-pink-100'
              }`}
            >
              {emoji}
            </button>
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
