'use client';

import { useEffect, useState } from 'react';
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import AnniversaryForm from '../forms/AnniversaryForm';
import { fetchApi } from '../../../lib/fetchApi';
import { toast } from 'react-toastify';

export default function Anniversaries() {
  const [anniversaries, setAnniversaries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadAnniversaries = async () => {
    try {
      const data = await fetchApi('/api/anniversaries');
      setAnniversaries(data);
    } catch (err) {
      console.error('Erreur chargement anniversaires :', err);
      toast.error("❌ Impossible de charger les anniversaires");
    }
  };

  useEffect(() => {
    loadAnniversaries();
  }, []);

  const handleAnniversaryAdded = () => {
    setShowModal(false);
    loadAnniversaries();
    toast.success("🎉 Anniversaire ajouté avec succès");

    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition transform hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Anniversaires</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      {anniversaries.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun anniversaire enregistré.</p>
      ) : (
        <ul className="space-y-3">
          {anniversaries.map((a) => {
            const date = new Date(a.date);
            const formattedDate = date.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
            });

            return (
              <li key={a._id} className="flex items-center gap-3">
                <div className="bg-pink-300 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold uppercase">
                  {a.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{a.name}</p>
                  <p className="text-xs text-gray-500">{formattedDate} 🎂</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AnniversaryForm
            onSubmitSuccess={handleAnniversaryAdded}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
