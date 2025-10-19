import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createTask } from '../../services/taskService';

export const DatabaseTest: React.FC = () => {
    const { user } = useAuth();
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testTaskCreation = async () => {
        if (!user) {
            setResult('Error: User not authenticated');
            return;
        }

        setLoading(true);
        setResult('Testing task creation...');

        try {
            const testTask = {
                title: 'Test Task - ' + new Date().getTime(),
                description: 'This is a test task created at ' + new Date().toLocaleString(),
                status: 'pending' as const,
                priority: 'medium' as const,
                dueDate: '',
                tags: ['test', 'debug'],
                attachments: []
            };

            console.log('Test task data:', testTask);
            const newTask = await createTask(testTask, user.$id);
            setResult(`Success! Task created with ID: ${newTask.$id}\nTitle: ${newTask.title}\nStatus: ${newTask.status}`);
        } catch (error) {
            console.error('Test task creation failed:', error);
            setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck browser console for details.`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="p-4 text-red-600">Please log in to test task creation</div>;
    }

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Database Connection Test</h3>

            <button
                onClick={testTaskCreation}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Testing...' : 'Test Task Creation'}
            </button>

            {result && (
                <div className={`mt-4 p-3 rounded-lg ${result.includes('Success')
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                    <pre className="whitespace-pre-wrap text-sm">{result}</pre>
                </div>
            )}
        </div>
    );
};