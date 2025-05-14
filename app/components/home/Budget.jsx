'use client';

import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { RxCross2 } from 'react-icons/rx';
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import BudgetForm from '../forms/BudgetForm';
import { fetchApi } from '../../../lib/fetchApi';
import { toast } from 'react-toastify';

const fixedLimits = {
  Courses: 500,
  Shopping: 150,
  Loisirs: 100,
  Factures: 1200,
  Dettes: 2000,
  Salaire: 4000,
  Autre: 200,
};

export default function Budget() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApi('/api/budget')
      .then((data) => setBudgetItems(data))
      .catch((err) => {
        console.error('❌ Erreur chargement budget :', err);
        toast.error('Erreur lors du chargement du budget');
      });
  }, []);

  const currentMonth = dayjs().format('YYYY-MM');
  const filteredBudgets = useMemo(() => {
    return budgetItems.filter((item) => dayjs(item.date).format('YYYY-MM') === currentMonth);
  }, [budgetItems]);

  const categoryTotals = {};
  let totalRevenu = 0;
  let totalDepense = 0;

  filteredBudgets.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = { total: 0, type: item.type };
    }
    categoryTotals[item.category].total += item.amount;

    if (item.type === 'revenu') totalRevenu += item.amount;
    if (item.type === 'dépense') totalDepense += item.amount;
  });

  const solde = totalRevenu - totalDepense;

  const lastItems = [...filteredBudgets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleBudgetAdded = () => {
    setShowModal(false);
    toast.success('💰 Budget ajouté avec succès');
    fetchApi('/api/budget').then((data) => setBudgetItems(data));
    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchApi(`/api/budget/${id}`, { method: 'DELETE' });
      toast.success('🗑️ Supprimé');
      fetchApi('/api/budget').then((data) => setBudgetItems(data));
      if (typeof window !== 'undefined' && window.refreshCalendar) {
        window.refreshCalendar();
      }
    } catch (err) {
      toast.error('❌ Erreur lors de la suppression');
      console.error('❌ Erreur suppression budget :', err);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md transition transform hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Mon Budget – {dayjs().format('MMMM YYYY')}</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      <div className="space-y-2">
        {Object.entries(categoryTotals).map(([label, { total, type }], idx) => {
          const limit = fixedLimits[label] ?? 200;
          const progress = (total / limit) * 100;
          const isOver = total > limit;

          return (
            <div key={idx}>
              <p className="text-sm mb-1">
                <span className="font-semibold">{label}</span>{' '}
                <span className={`ml-2 text-xs ${type === 'revenu' ? 'text-green-600' : 'text-gray-500'}`}>
                  {total.toFixed(2)}€ / {limit}€
                </span>
              </p>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    type === 'revenu' ? 'bg-green-400' : isOver ? 'bg-red-500' : 'bg-pink-400'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm font-semibold text-gray-800 border-t border-gray-200">
        Total du mois :{' '}
        <span className={solde >= 0 ? 'text-green-600' : 'text-red-500'}>
          {solde.toFixed(2)}€
        </span>
      </div>

      <h3 className="mt-4 text-red-600 text-sm font-semibold">Derniers enregistrements</h3>
      <ul className="text-sm text-gray-700 mt-2 space-y-1">
        {lastItems.map((item) => (
          <li key={item._id} className="flex justify-between items-center">
            <div className="flex flex-col">
              <span>
                {item.titre}{' '}
                <span className={`text-xs ml-2 ${item.type === 'revenu' ? 'text-green-600' : 'text-gray-400'}`}>
                  ({dayjs(item.date).format('D MMM')})
                </span>
              </span>
              <span className="text-xs text-gray-500">
                {item.amount.toFixed(2).replace('.', ',')}€ — {item.type}
              </span>
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              className="text-gray-400 hover:text-red-500 text-m ml-2"
              title="Supprimer"
            >
              <RxCross2 />
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <BudgetForm
            onSubmitSuccess={handleBudgetAdded}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  );
}
