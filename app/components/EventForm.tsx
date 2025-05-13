'use client';

import { useState } from 'react';

type EventFormProps = {
  hour: number | null;
  category?: { label: string; color: string };
  onSubmit: (data: {
    title: string;
    description: string;
    address: string;
    hour: number;
    category?: string;
    color?: string;
  }) => void;
};

export default function EventForm({ hour, category, onSubmit }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
  });

  const [selectedHour, setSelectedHour] = useState<number>(hour ?? 6);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (!formData.title.trim()) {
      alert("Le titre est requis.");
      return;
    }

    const hourValue = hour !== null ? hour : selectedHour + selectedMinutes / 60;

    onSubmit({
      ...formData,
      hour: parseFloat(hourValue.toFixed(2)),
      category: category?.label || '',
      color: category?.color || '',
    });

    setFormData({ title: '', description: '', address: '' });
  };

  return (
    <div className="space-y-3 bg-blue-50 p-4 text-black rounded-lg">
      {category && (
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-${category.color}-500`}
          >
            {category.label}
          </span>
        </div>
      )}

      {hour === null && (
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Heure</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
            >
              {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                <option key={h} value={h}>{h}h</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Minutes</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                <option key={m} value={m}>{m} min</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <input
        type="text"
        name="title"
        placeholder="Titre de l’événement"
        className="w-full border px-3 py-1 rounded"
        value={formData.title}
        onChange={handleChange}
      />

      <input
        type="text"
        name="address"
        placeholder="Adresse (optionnel)"
        className="w-full border px-3 py-1 rounded"
        value={formData.address}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description (optionnel)"
        className="w-full border px-3 py-1 rounded"
        value={formData.description}
        onChange={handleChange}
      />

      <button
        onClick={handleFormSubmit}
        className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition"
      >
        Enregistrer
      </button>
    </div>
  );
}
