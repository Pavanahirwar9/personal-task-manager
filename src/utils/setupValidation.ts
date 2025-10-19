import { databases, appwriteConfig } from '../lib/appwrite';

export const validateAppwriteSetup = async () => {
    const issues: string[] = [];

    try {
        // Check if project ID is configured
        if (!appwriteConfig.project) {
            issues.push('Project ID is not configured. Please set VITE_APPWRITE_PROJECT_ID in your .env file.');
        }

        // Check if database ID is configured
        if (!appwriteConfig.databaseId) {
            issues.push('Database ID is not configured. Please set VITE_APPWRITE_DATABASE_ID in your .env file.');
        }

        // Check if storage ID is configured
        if (!appwriteConfig.storageId) {
            issues.push('Storage bucket ID is not configured. Please set VITE_APPWRITE_STORAGE_ID in your .env file.');
        }

        // Try to list collections (this will fail if tasks collection doesn't exist)
        if (appwriteConfig.databaseId) {
            try {
                await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.taskCollectionId,
                    [] // No queries
                );
            } catch (error) {
                issues.push(`Cannot access tasks collection "${appwriteConfig.taskCollectionId}". Please ensure the collection exists with proper permissions.`);
            }
        }

    } catch (error) {
        issues.push('General connection error. Please check your Appwrite endpoint and project configuration.');
    }

    return {
        isValid: issues.length === 0,
        issues
    };
};

export const getSetupInstructions = () => {
    return `
🚨 Appwrite Setup Required 🚨

To use this application, you need to configure your Appwrite project:

1. Create an Appwrite project at https://cloud.appwrite.io/
2. Follow the setup guide in APPWRITE_SETUP.md
3. Update your .env file with the correct IDs
4. Restart the development server

Current configuration:
- Project ID: ${appwriteConfig.project || 'NOT SET'}
- Database ID: ${appwriteConfig.databaseId || 'NOT SET'}
- Storage ID: ${appwriteConfig.storageId || 'NOT SET'}
  `;
};