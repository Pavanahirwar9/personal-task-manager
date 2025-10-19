import { storage, ID, appwriteConfig } from '../lib/appwrite';
import type { TaskAttachment } from '../types';

export const uploadFile = async (file: File): Promise<TaskAttachment> => {
    try {
        const fileId = ID.unique();
        const response = await storage.createFile(
            appwriteConfig.storageId,
            fileId,
            file
        );

        // Get file URL for viewing
        const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);

        return {
            $id: response.$id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: fileUrl.toString(),
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
};

export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to delete file');
    }
};

export const getFilePreview = (fileId: string, width: number = 300, height: number = 300) => {
    try {
        return storage.getFilePreview(appwriteConfig.storageId, fileId, width, height);
    } catch (error) {
        return null;
    }
};

export const downloadFile = (fileId: string) => {
    try {
        return storage.getFileDownload(appwriteConfig.storageId, fileId);
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to get download link');
    }
};

export const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'File size must be less than 10MB',
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'File type not supported. Please use images, PDFs, or common document formats.',
        };
    }

    return { isValid: true };
};