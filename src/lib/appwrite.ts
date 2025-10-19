import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

// Appwrite configuration using environment variables
export const appwriteConfig = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    project: import.meta.env.VITE_APPWRITE_PROJECT_ID || '',
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || '',
    taskCollectionId: 'tasks',
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID || '',
};

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.project);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export client and ID for direct use
export { client, ID, Query };

// Helper functions
export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.log('No active session', error);
        return null;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Sign in failed');
    }
};

export const signUp = async (email: string, password: string, name: string) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw new Error('Account creation failed');

        // Automatically sign in after registration
        const session = await signIn(email, password);
        return { account: newAccount, session };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Sign up failed');
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Sign out failed');
    }
};

// Password Recovery Functions
export const initiatePasswordReset = async (email: string) => {
    try {
        // Use the current domain for reset URL
        const resetUrl = `${window.location.origin}`;
        const recovery = await account.createRecovery(email, resetUrl);
        return recovery;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Password reset request failed');
    }
};

export const completePasswordReset = async (userId: string, secret: string, password: string) => {
    try {
        const recovery = await account.updateRecovery(userId, secret, password);
        return recovery;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Password reset failed');
    }
};