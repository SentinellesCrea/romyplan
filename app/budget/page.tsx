'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import BudgetForm from '../components/forms/BudgetForm';
import CalendarPreview from '../components/home/CalendarPreview';
import { RxCross2 } from 'react-icons/rx';
import Footer from '../components/home/Footer';
import { fetchApi } from '@/lib/fetchApi';
import dayjs from 'dayjs';

type BudgetItem = {
  _id: string;
  titre: string;
  subCategory?: string;
  date: string;
  amount: number;
  type: 'dépense' | 'revenu';
};

const fixedLimits: Record<string, number> = {
  Course: 200,
  Shopping: 150,
  Loisirs: 100,
  Factures: 400,
  Dettes: 2000,
  Autre: 200,
};

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadBudgets = async () => {
      const data = await fetchApi('/api/budget');
      setBudgets(Array.isArray(data) ? data : []);
    };
    loadBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => b.date?.slice(0, 10) === selectedDate);
  }, [budgets, selectedDate]);

  const handleBudgetAdded = () => {
    setShowModal(false);
    loadBudget();
    toast.success('💰 Budget ajouté avec succès');

    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/api/budget/${id}`, { method: 'DELETE' });
      setBudgets((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('❌ Erreur lors de la suppression :', error);
    }
  };

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mon budget du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendrier à gauche */}
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            {/* Liste des budgets à droite */}
            <div className="md:col-span-2 p-4 md:p-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#110444] font-bold text-lg"></h2>
              <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
            </div>
              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredBudgets.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun budget pour cette date.</p>
                ) : (
                  <ul className="text-sm text-gray-700 mt-2 space-y-2">
                    {filteredBudgets.map((item) => (
                      <li key={item._id} className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span >
                            <span className="text-gray-900 text-lg">{item.titre}</span>
                            {item.subCategory && (
                              <span className="ml-1 text-pink-600 font-medium text-xs">
                                [{item.subCategory}]
                              </span>
                            )}
                            <span className="text-gray-500 text-xs ml-1">
                              ({new Date(item.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                              })})
                            </span>
                          </span>
                          <span className={`text-xs ${item.type === 'dépense' ? 'text-red-500' : 'text-green-600'}`}>
                            {item.amount.toFixed(2).replace('.', ',')} € — {item.type}
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
                )}
              </div>

                {showModal && (
                  <Modal onClose={() => setShowModal(false)}>
                    <BudgetForm onSubmitSuccess={handleBudgetAdded} />
                  </Modal>
                )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
