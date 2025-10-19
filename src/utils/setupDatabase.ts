import { databases, appwriteConfig } from '../lib/appwrite';

// The Appwrite SDK types vary between versions and some database helper
// methods used here (createCollection, createStringAttribute, etc.) may
// not be present in the installed SDK type definitions. Cast to `any`
// to avoid TypeScript build failures on Vercel while keeping runtime behavior.
const dbAny: any = databases as any;

export const setupDatabase = async () => {
    try {
        console.log('Setting up database...');

        // Create tasks collection
        const collection = await dbAny.createCollection(
            appwriteConfig.databaseId,
            'tasks',
            'Tasks'
        );

        console.log('Tasks collection created:', collection);

        // Create attributes
        const attributes = [
            { key: 'title', type: 'string', size: 200, required: true },
            { key: 'description', type: 'string', size: 1000, required: false },
            { key: 'status', type: 'string', size: 20, required: true, default: 'pending' },
            { key: 'priority', type: 'string', size: 10, required: true, default: 'medium' },
            { key: 'userId', type: 'string', size: 50, required: true },
            { key: 'dueDate', type: 'datetime', required: false },
            { key: 'tags', type: 'string', size: 50, array: true, required: false },
            { key: 'attachments', type: 'string', size: 200, array: true, required: false }
        ];

        for (const attr of attributes) {
            if (attr.type === 'string') {
                await dbAny.createStringAttribute(
                    appwriteConfig.databaseId,
                    'tasks',
                    attr.key,
                    attr.size,
                    attr.required,
                    attr.default,
                    attr.array || false
                );
            } else if (attr.type === 'datetime') {
                await dbAny.createDatetimeAttribute(
                    appwriteConfig.databaseId,
                    'tasks',
                    attr.key,
                    attr.required
                );
            }
            console.log(`Created attribute: ${attr.key}`);
        }

        // Create index for userId
        await dbAny.createIndex(
            appwriteConfig.databaseId,
            'tasks',
            'userId_index',
            'key',
            ['userId']
        );

        console.log('Database setup completed successfully!');
        return true;
    } catch (error) {
        console.error('Database setup failed:', error);
        throw error;
    }
};