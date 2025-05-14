'use client';

import { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { FcHighPriority } from 'react-icons/fc';
import PrimaryButton from '../ui/PrimaryButton';
import Modal from '../ui/Modal';
import TaskForm from '../forms/TaskForm';
import { fetchApi } from '../../../lib/fetchApi';
import { toast } from 'react-toastify';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      const data = await fetchApi('/api/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Erreur chargement des tâches :', err);
      toast.error('Erreur lors du chargement des tâches');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskAdded = () => {
    setShowModal(false);
    setEditingTask(null);
    loadTasks();
    toast.success('✅ Tâche enregistrée');
    if (typeof window !== 'undefined' && window.refreshCalendar) {
      window.refreshCalendar();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Souhaitez-vous vraiment supprimer cette tâche ?');
    if (!confirmDelete) return;

    try {
      await fetchApi(`/api/tasks/${id}`, { method: 'DELETE' });
      toast.success('🗑️ Tâche supprimée');
      loadTasks();
    } catch (err) {
      console.error('Erreur suppression tâche :', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDoneToggle = async (id, checked) => {
    try {
      await fetchApi(`/api/tasks/${id}`, {
        method: 'PUT',
        body: { done: checked },
      });
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, done: checked } : task))
      );
    } catch (err) {
      console.error('Erreur mise à jour done :', err);
      toast.error('Erreur mise à jour du statut');
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
    <div className="bg-white rounded-xl p-4 shadow-md transition transform hover:-translate-y-1 duration-300 animate-fadeUp">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#110444] font-bold text-lg">Mes Tâches</h2>
        <PrimaryButton onClick={() => setShowModal(true)}>+ Ajouter</PrimaryButton>
      </div>

      <ul className="space-y-3">
        {tasks.map((task) => (
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
  );
}
