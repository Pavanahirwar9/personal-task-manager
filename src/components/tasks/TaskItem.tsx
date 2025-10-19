import React from 'react';
import { Calendar, Flag, Edit, Trash2, CheckCircle, Circle, Paperclip } from 'lucide-react';
import type { Task } from '../../types';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onToggleStatus: (taskId: string, status: 'pending' | 'completed') => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
    const priorityColors = {
        low: 'text-green-600 bg-green-50 border-green-200',
        medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        high: 'text-red-600 bg-red-50 border-red-200',
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
    const isCompleted = task.status === 'completed';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleToggleStatus = () => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        onToggleStatus(task.$id, newStatus);
    };

    return (
        <div className={`card hover:shadow-md transition-shadow duration-200 ${isCompleted ? 'opacity-75' : ''}`}>
            <div className="flex items-start space-x-3">
                <button
                    onClick={handleToggleStatus}
                    className={`mt-1 flex-shrink-0 ${isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-primary-600'} transition-colors`}
                >
                    {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className={`mt-1 text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-gray-400 hover:text-primary-600 transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => onDelete(task.$id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                        </span>

                        {/* Due Date */}
                        {task.dueDate && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${isOverdue
                                    ? 'text-red-600 bg-red-50 border-red-200'
                                    : 'text-gray-600 bg-gray-50 border-gray-200'
                                }`}>
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(task.dueDate)}
                                {isOverdue && <span className="ml-1 text-red-600 font-semibold">!</span>}
                            </span>
                        )}

                        {/* Attachments */}
                        {task.attachments && task.attachments.length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {task.attachments.length}
                            </span>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                        Created {new Date(task.$createdAt).toLocaleDateString()}
                        {task.$updatedAt !== task.$createdAt && (
                            <span> • Updated {new Date(task.$updatedAt).toLocaleDateString()}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;