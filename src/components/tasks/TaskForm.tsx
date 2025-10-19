import React, { useState } from 'react';
import { X, Calendar, Flag, Plus } from 'lucide-react';
import './CreateTaskModal.css';
import type { Task } from '../../types';
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
    // attachments feature temporarily disabled
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
        <div className="ctp-backdrop" role="dialog" aria-modal="true">
            <div className="ctp-card">
                <div className="ctp-header">
                    <h2 className="ctp-title">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                    <button onClick={onCancel} className="ctp-close" aria-label="Close">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="ctp-body">
                    {error && <div className="ctp-error">{error}</div>}

                    <div className="ctp-row">
                        <label className="ctp-label">Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="ctp-input"
                            placeholder="Enter task title..."
                            required
                        />
                    </div>

                    <div className="ctp-row">
                        <label className="ctp-label">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="ctp-textarea"
                            rows={4}
                            placeholder="Enter task description..."
                        />
                    </div>

                    <div className="ctp-grid">
                        <div>
                            <label className="ctp-label"><Flag className="icon" /> Priority</label>
                            <select id="priority" value={formData.priority} onChange={(e) => handleInputChange('priority', e.target.value)} className="ctp-input">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="ctp-label">Status</label>
                            <select id="status" value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} className="ctp-input">
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="ctp-grid">
                        <div>
                            <label className="ctp-label"><Calendar className="icon" /> Due Date</label>
                            <input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => handleInputChange('dueDate', e.target.value)} className="ctp-input" />
                        </div>

                        <div>
                            <label className="ctp-label">Tags (comma-separated)</label>
                            <input id="tags" type="text" value={formData.tags} onChange={(e) => handleInputChange('tags', e.target.value)} className="ctp-input" placeholder="work, urgent, personal..." />
                        </div>
                    </div>

                    <div className="ctp-footer">
                        <button type="button" onClick={onCancel} className="ctp-btn ghost" disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="ctp-btn primary" disabled={isSubmitting}>
                            <Plus className="icon" />
                            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;