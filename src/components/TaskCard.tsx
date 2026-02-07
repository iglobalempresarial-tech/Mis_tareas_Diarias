import { Check, Trash2 } from 'lucide-react';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, onDelete, onToggleComplete, onDragStart }: TaskCardProps) {
  const isCompleted = task.status === 'completed';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isCompleted
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {isCompleted && <Check className="w-3 h-3 text-white" />}
          </button>
          <p
            className={`text-sm flex-1 ${
              isCompleted ? 'line-through text-gray-400' : 'text-gray-700'
            }`}
          >
            {task.title}
          </p>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
