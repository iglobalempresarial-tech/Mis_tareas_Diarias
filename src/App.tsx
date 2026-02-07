import { useEffect, useState } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Task, TaskStatus } from './types/task';
import { Column } from './components/Column';
import { AddTaskModal } from './components/AddTaskModal';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });

    if (error) {
      console.error('Error loading tasks:', error);
    } else if (data) {
      setTasks(data);
    }
  };

  const addTask = async (title: string) => {
    const maxPosition = tasks
      .filter((t) => t.status === 'todo')
      .reduce((max, t) => Math.max(max, t.position), -1);

    const { error } = await supabase.from('tasks').insert({
      title,
      status: 'todo',
      position: maxPosition + 1,
    });

    if (error) {
      console.error('Error adding task:', error);
    } else {
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      loadTasks();
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    let newStatus: TaskStatus;
    if (task.status === 'todo') {
      newStatus = 'in_progress';
    } else if (task.status === 'in_progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'todo';
    }

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      loadTasks();
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', draggedTask.id);

    if (error) {
      console.error('Error updating task status:', error);
    } else {
      loadTasks();
    }
    setDraggedTask(null);
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tablero Kanban</h1>
              <p className="text-gray-600 text-sm">Organiza tus tareas diarias</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Agregar Tarea
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Column
            title="Por Hacer"
            status="todo"
            tasks={getTasksByStatus('todo')}
            onDelete={handleDeleteClick}
            onToggleComplete={toggleComplete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          <Column
            title="En Progreso"
            status="in_progress"
            tasks={getTasksByStatus('in_progress')}
            onDelete={handleDeleteClick}
            onToggleComplete={toggleComplete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          <Column
            title="Completadas"
            status="completed"
            tasks={getTasksByStatus('completed')}
            onDelete={handleDeleteClick}
            onToggleComplete={toggleComplete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTask}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default App;
