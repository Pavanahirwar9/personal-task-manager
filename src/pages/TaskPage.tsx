import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import type { Task } from '../types';

const TaskPage: React.FC = () => {
    const { tasks, loading, error, createTask, updateTask, deleteTask } = useTask();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setShowTaskForm(true);
    };

    const handleCloseForm = () => {
        setShowTaskForm(false);
        setEditingTask(null);
    };

    const handleSubmitTask = async (taskData: Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.$id, taskData);
            } else {
                await createTask(taskData);
            }
            handleCloseForm();
        } catch (error) {
            // Error is handled by the TaskForm component
            throw error;
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                console.error('Failed to delete task:', error);
                alert('Failed to delete task. Please try again.');
            }
        }
    };

    const handleToggleStatus = async (taskId: string, status: 'pending' | 'completed') => {
        try {
            await updateTask(taskId, { status });
        } catch (error) {
            console.error('Failed to update task status:', error);
            alert('Failed to update task status. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    <p>{error}</p>
                </div>
            )}

            <TaskList
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onToggleStatus={handleToggleStatus}
                loading={loading}
            />

            {showTaskForm && (
                <TaskForm
                    task={editingTask || undefined}
                    onSubmit={handleSubmitTask}
                    onCancel={handleCloseForm}
                    isEditing={!!editingTask}
                />
            )}
        </div>
    );
};

export default TaskPage;