import { databases, ID, Query, appwriteConfig } from '../lib/appwrite';
import type { Task } from '../types';

export const createTask = async (task: Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>, userId: string) => {
    try {
        // Prepare task data with proper defaults and validation
        const taskData = {
            title: task.title?.trim() || 'Untitled Task',
            description: task.description?.trim() || '',
            status: task.status || 'pending',
            priority: task.priority || 'medium',
            userId: userId,
            dueDate: task.dueDate || '',
            tags: Array.isArray(task.tags) ? task.tags.join(',').substring(0, 100) : '', // Send as single string
            attachments: ''  // Send as empty string instead of array
        };

        console.log('Creating task with data:', taskData);

        const response = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.taskCollectionId,
            ID.unique(),
            taskData
        );

        // Parse the response properly
        const parsedTask = {
            ...response,
            tags: typeof response.tags === 'string' ? response.tags.split(',').filter(Boolean) : [],
            attachments: []
        };

        return parsedTask as unknown as Task;
    } catch (error) {
        console.error('Create task error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create task');
    }
};

export const getTasks = async (userId: string) => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.taskCollectionId,
            [
                Query.equal('userId', userId)
            ]
        );

        // Parse and clean up the tasks data
        const tasks = response.documents.map(doc => ({
            ...doc,
            tags: typeof doc.tags === 'string' ? doc.tags.split(',').filter(Boolean) : [],
            attachments: []  // Simplified for now
        }));

        return tasks as unknown as Task[];
    } catch (error) {
        console.error('Get tasks error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
};

export const updateTask = async (taskId: string, updates: Partial<Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>>) => {
    try {
        // Prepare updates with proper data types
        const updateData: any = {};

        if (updates.title !== undefined) updateData.title = updates.title?.trim() || 'Untitled Task';
        if (updates.description !== undefined) updateData.description = updates.description?.trim() || '';
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.priority !== undefined) updateData.priority = updates.priority;
        if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate || '';
        if (updates.tags !== undefined) updateData.tags = Array.isArray(updates.tags) ? updates.tags.join(',').substring(0, 100) : '';
        if (updates.attachments !== undefined) updateData.attachments = '';

        console.log('Updating task with data:', updateData);

        const response = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.taskCollectionId,
            taskId,
            updateData
        );

        // Parse the response properly
        const parsedTask = {
            ...response,
            tags: typeof response.tags === 'string' ? response.tags.split(',').filter(Boolean) : [],
            attachments: []
        };

        return parsedTask as unknown as Task;
    } catch (error) {
        console.error('Update task error:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update task');
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.taskCollectionId,
            taskId
        );
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
    }
};

export const getTaskById = async (taskId: string) => {
    try {
        const response = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.taskCollectionId,
            taskId
        );

        return response as unknown as Task;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch task');
    }
};