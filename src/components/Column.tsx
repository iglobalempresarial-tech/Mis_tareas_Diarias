import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
}

export function Column({
  title,
  status,
  tasks,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragOver,
  onDrop,
}: ColumnProps) {
  const getColumnColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-blue-50 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className="flex-1 min-w-[300px]">
      <div className={`rounded-lg border-2 ${getColumnColor()} p-4 h-full`}>
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded">
            {tasks.length}
          </span>
        </h2>
        <div
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, status)}
          className="space-y-3 min-h-[200px]"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
