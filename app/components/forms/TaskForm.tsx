'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { toast } from 'react-toastify';

const emojis = ['✨', '🎯', '📝', '🛒', '🏠', '🍎', '💰', '📞', '🎁', '❤️'];
const categories = ['Personnel', 'Travail', 'Famille', 'Urgent'];
const priorities = ['Basse', 'Moyenne', 'Haute'];

export default function TaskForm({
  onSubmitSuccess,
  onCancel,
  task,
}: {
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  task?: any;
}) {
  const [form, setForm] = useState({
    label: '',
    description: '',
    date: '',
    priority: 'Moyenne',
    category: 'Personnel',
    emoji: '',
    color: '#60a5fa', // ✅ couleur fixée pour les tâches
  });

  useEffect(() => {
    if (task) {
      setForm({
        label: task.label || '',
        description: task.description || '',
        date: task.date || '',
        priority: task.priority || 'Moyenne',
        category: task.category || 'Personnel',
        emoji: task.emoji || '',
        color: task.color || '#60a5fa', // fallback couleur tâche
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.label.trim()) return toast.warning('Le titre est requis');

    try {
      const payload = { ...form, color: '#60a5fa' }; // ✅ forcer la couleur

      if (task?._id) {
        await fetchApi(`/api/tasks/${task._id}`, {
          method: 'PUT',
          body: { ...payload, done: task.done },
        });
        toast.success('✏️ Tâche mise à jour');
      } else {
        await fetchApi('/api/tasks', {
          method: 'POST',
          body: { ...payload, done: false },
        });
        toast.success('✅ Tâche ajoutée');
      }

      onSubmitSuccess?.();
    } catch (err) {
      console.error('❌ Erreur tâche', err);
      toast.error('Erreur lors de l’enregistrement');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto space-y-5 border border-pink-100">
      <h2 className="text-[#522c01] text-xl font-bold mb-4">
        {task ? 'Modifier la tâche' : 'Ajouter une nouvelle tâche'}
      </h2>

      {/* Titre */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Titre de la tâche</label>
        <input
          type="text"
          name="label"
          placeholder="Ex: Acheter des fleurs"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.label}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Description (optionnel)</label>
        <textarea
          name="description"
          placeholder="Détails supplémentaires..."
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 h-24 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* Date + priorité */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[#522c01] font-medium mb-1">Date d’échéance</label>
          <input
            type="date"
            name="date"
            className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label className="block text-[#522c01] font-medium mb-1">Priorité</label>
          <select
            name="priority"
            className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={form.priority}
            onChange={handleChange}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Catégorie</label>
        <select
          name="category"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Emoji */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Ajouter un emoji</label>
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
        <PrimaryButton onClick={handleSubmit}>
          {task ? 'Mettre à jour' : 'Enregistrer'}
        </PrimaryButton>
      </div>
    </div>
  );
}
