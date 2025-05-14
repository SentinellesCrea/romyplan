'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import PrimaryButton from '../components/ui/PrimaryButton';
import { fetchApi } from '../../lib/fetchApi';
import AnniversaryForm from '../components/forms/AnniversaryForm';
import Modal from '../components/ui/Modal';
import dayjs from 'dayjs';

export default function AnniversariesPage() {
  const [anniversaries, setAnniversaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadAnniversaries = async () => {
      try {
        const data = await fetchApi('/api/anniversaries');
        setAnniversaries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erreur de chargement des anniversaires :', error);
      }
    };

    loadAnniversaries();
  }, []);

  const handleAnniversaryAdded = () => {
    setShowModal(false);
    fetchApi('/api/anniversaries').then(setAnniversaries);
    if (window.refreshCalendar) window.refreshCalendar();
  };

  const filteredAnniversaries = useMemo(() => {
    return anniversaries.filter((a) => a.date?.slice(0, 10) === selectedDate);
  }, [anniversaries, selectedDate]);

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Anniversaires du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            <div className="md:col-span-2 p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#110444] font-bold text-lg">Les Anniversaires</h2>
                <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
              </div>

              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredAnniversaries.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun anniversaire pour cette date.</p>
                ) : (
                  <ul className="space-y-3">
                    {filteredAnniversaries.map((a) => {
                      const formattedDate = dayjs(a.date).format('DD MMMM');
                      return (
                        <li key={a._id} className="flex items-center gap-3">
                          <div className="bg-pink-300 text-white w-8 h-8 flex items-center justify-center rounded-full font-bold uppercase">
                            {a.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{a.name}</p>
                            <p className="text-xs text-gray-500">Date : {formattedDate} 🎂</p>
                            {a.description && (
                              <p className="text-xs text-gray-500">{a.description} 🎁</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  <AnniversaryForm
                    onSubmitSuccess={handleAnniversaryAdded}
                    onCancel={() => setShowModal(false)}
                  />
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
