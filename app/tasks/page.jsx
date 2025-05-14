'use client';

import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { RxCross2 } from 'react-icons/rx';
import { FaPen } from 'react-icons/fa6';
import { FcHighPriority } from 'react-icons/fc';
import Header from '../components/home/Header';
import CalendarPreview from '../components/home/CalendarPreview';
import Footer from '../components/home/Footer';
import PrimaryButton from '../components/ui/PrimaryButton';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/forms/TaskForm';
import { fetchApi } from '../../lib/fetchApi';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchApi('/api/tasks');
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des tâches :', error);
      }
    };
    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.date?.slice(0, 10) === selectedDate);
  }, [tasks, selectedDate]);

  const handleTaskAdded = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchApi('/api/tasks').then(setTasks);
    if (window.refreshCalendar) window.refreshCalendar();
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    try {
      await fetchApi(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchApi('/api/tasks').then(setTasks);
    } catch (err) {
      console.error('❌ Erreur suppression tâche :', err);
    }
  };

  const handleDoneToggle = async (id, checked) => {
    try {
      await fetchApi(`/api/tasks/${id}`, {
        method: 'PUT',
        body: { done: checked },
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, done: checked } : t)));
    } catch (err) {
      console.error('❌ Erreur mise à jour done :', err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const hexToRgba = (hex, alpha = 0.2) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="bg-[#fffaf2] min-h-screen">
      <Header />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-[#5f4b8b] p-4 md:p-0 mt-10">
            Mes Tâches du {dayjs(selectedDate).format('DD MMMM YYYY')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-4 md:p-0">
              <CalendarPreview onDayClick={(date) => setSelectedDate(date)} />
            </div>

            <div className="md:col-span-2 p-4 md:p-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#110444] font-bold text-lg">Mes Tâches</h2>
                <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
              </div>
              <div className="bg-white shadow-md rounded-xl p-4">
              {filteredTasks.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune tâche pour cette date.</p>
              ) : (
                <ul className="space-y-3">
                  {filteredTasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex items-start gap-3 rounded-lg p-3 text-sm shadow-sm transition transform hover:-translate-y-1 hover:shadow-md duration-300 relative"
                      style={{
                        backgroundColor: hexToRgba(task.color || '#fef2f2', 0.2),
                        borderLeft: `4px solid ${task.color || '#f59e0b'}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={(e) => handleDoneToggle(task._id, e.target.checked)}
                        className="accent-pink-500 w-4 h-4 mt-1"
                      />
                      <div className="flex-1">
                        <div className={`text-sm ${task.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {task.emoji && <span className="mr-1">{task.emoji}</span>}
                          <span className="font-medium">{task.label}</span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {task.description.length > 50
                              ? `${task.description.slice(0, 50)}...`
                              : task.description}
                          </p>
                        )}
                        {task.priority && (
                          <span className="flex text-xs font-medium mt-2 gap-2">
                            <FcHighPriority /> {task.priority}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(task._id)}
                        className="absolute top-2 right-2 text-m text-gray-400 hover:text-red-500"
                        title="Supprimer"
                      >
                        <RxCross2 />
                      </button>
                      <button
                        onClick={() => handleEdit(task)}
                        className="absolute top-2 right-8 text-sm text-gray-400 hover:text-blue-500"
                        title="Modifier"
                      >
                        <FaPen />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              </div>
              {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                  <TaskForm
                    task={editingTask}
                    onSubmitSuccess={handleTaskAdded}
                    onClose={() => {
                      setShowModal(false);
                      setEditingTask(null);
                    }}
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
