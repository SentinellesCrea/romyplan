'use client';

import { useState } from 'react';
import { fetchApi } from '../../../lib/fetchApi';
import PrimaryButton from '../ui/PrimaryButton';
import SecondaryButton from '../ui/SecondaryButton';
import { toast } from 'react-toastify';

const categories = ['Course', 'Shopping', 'Loisirs', 'Factures', 'Salaire', 'Dettes', 'Autre'];
const types = ['revenu', 'dépense'];
const colors = ['#f59e0b'];

export default function BudgetForm({ onSubmitSuccess, onCancel }) {
  const [form, setForm] = useState({
    titre: '',
    category: categories[0],
    amount: '',
    type: types[1],
    date: '',
    color: '#f59e0b',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const trimmedTitre = form.titre.trim();

    if (!trimmedTitre || !form.amount || !form.date || !form.type || !form.category) {
      return toast.warning('Tous les champs sont requis');
    }

    try {
      const payload = {
        titre: trimmedTitre,
        category: form.category,
        amount: parseFloat(form.amount),
        type: form.type,
        date: form.date,
        color: '#f59e0b',
      };

      await fetchApi('/api/budget', {
        method: 'POST',
        body: payload,
      });

      toast.success('💰 Budget enregistré');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      console.error('❌ Erreur ajout budget', err);
      toast.error('Erreur lors de l’enregistrement');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto space-y-5 border border-pink-100">
      <h2 className="text-[#522c01] text-xl font-bold mb-4">Ajouter une ligne budget</h2>

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
          name="titre"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
          placeholder="Ex: Payer EDF"
          value={form.titre}
          onChange={handleChange}
        />
      </div>

      {/* Montant + Date */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-[#522c01] font-medium mb-1">Montant (€)</label>
          <input
            type="number"
            name="amount"
            className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
            placeholder="Ex: 50"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label className="block text-[#522c01] font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            className="w-full rounded-xl border-2 border-[#dbcbb0] p-3"
            value={form.date}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Type</label>
        <select
          name="type"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 bg-white"
          value={form.type}
          onChange={handleChange}
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t === 'revenu' ? 'Revenu' : 'Dépense'}
            </option>
          ))}
        </select>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-[#522c01] font-medium mb-1">Catégorie</label>
        <select
          name="category"
          className="w-full rounded-xl border-2 border-[#dbcbb0] p-3 bg-white"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-3 mt-4">
        <SecondaryButton onClick={onCancel}>Annuler</SecondaryButton>
        <PrimaryButton onClick={handleSubmit}>Enregistrer</PrimaryButton>
      </div>
    </div>
  );
}
