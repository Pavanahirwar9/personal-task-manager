import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Task, TaskContextType } from '../types';
import { useAuth } from './AuthContext';
import { createTask, getTasks, updateTask, deleteTask } from '../services/taskService';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};

interface TaskProviderProps {
    children: React.ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            refreshTasks();
        } else {
            setTasks([]);
        }
    }, [user]);

    const refreshTasks = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const userTasks = await getTasks(user.$id);
            setTasks(userTasks);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>) => {
        if (!user) throw new Error('User not authenticated');

        try {
            setError(null);
            const newTask = await createTask(taskData, user.$id);
            setTasks(prev => [newTask, ...prev]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create task');
            throw error;
        }
    };

    const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
        try {
            setError(null);
            const updatedTask = await updateTask(id, updates);
            setTasks(prev => prev.map(task => task.$id === id ? updatedTask : task));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update task');
            throw error;
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            setError(null);
            await deleteTask(id);
            setTasks(prev => prev.filter(task => task.$id !== id));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to delete task');
            throw error;
        }
    };

    const value: TaskContextType = {
        tasks,
        loading,
        error,
        createTask: handleCreateTask,
        updateTask: handleUpdateTask,
        deleteTask: handleDeleteTask,
        refreshTasks,
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};