'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import Tasks from '../components/home/Tasks';
import { fetchApi } from '../../lib/fetchApi'; // ✅ chemin relatif
import dayjs from 'dayjs';

type TaskItem = {
  _id: string;
  label: string;
  description?: string;
  date: string;
  priority?: 'Basse' | 'Moyenne' | 'Haute';
  category?: string;
  emoji?: string;
  color?: string;
  done?: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchApi('/api/tasks');
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des tâches :", error);
      }
    };
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.date?.slice(0, 10) === selectedDate);
  }, [tasks, selectedDate]);

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />

      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mes Tâches du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendrier */}
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            {/* Tâches */}
            <div className="md:col-span-2 p-4 md:p-0">
              <div className="bg-white shadow-md rounded-xl p-4">
                {filteredTasks.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune tâche pour cette date.</p>
                ) : (
                  <Tasks tasks={filteredTasks} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
