import React, { useState } from 'react';
import { X, Calendar, Flag, Plus } from 'lucide-react';
import type { Task, TaskAttachment } from '../../types';
import FileUpload from './FileUpload';

interface TaskFormProps {
    task?: Task;
    onSubmit: (taskData: Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 'medium' as const,
        status: task?.status || 'pending' as const,
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task?.tags?.join(', ') || '',
    });
    const [attachments, setAttachments] = useState<TaskAttachment[]>(task?.attachments || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : '',
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim().substring(0, 50)).filter(Boolean) : [],
                attachments: [],  // Disable for now
            };

            await onSubmit(taskData);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to save task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="input-field"
                            placeholder="Enter task title..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="input-field resize-none"
                            rows={3}
                            placeholder="Enter task description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                                <Flag className="h-4 w-4 inline mr-1" />
                                Priority
                            </label>
                            <select
                                id="priority"
                                value={formData.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="input-field"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="input-field"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags (comma-separated)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={formData.tags}
                            onChange={(e) => handleInputChange('tags', e.target.value)}
                            className="input-field"
                            placeholder="work, urgent, personal..."
                        />
                    </div>

                    {/* File attachments temporarily disabled */}
                    {false && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                File Attachments
                            </label>
                            <FileUpload
                                attachments={attachments}
                                onAttachmentsChange={setAttachments}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary flex items-center space-x-2"
                            disabled={isSubmitting}
                        >
                            <Plus className="h-4 w-4" />
                            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;