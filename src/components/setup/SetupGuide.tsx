import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { validateAppwriteSetup, getSetupInstructions } from '../../utils/setupValidation';

const SetupGuide: React.FC = () => {
    const [setupStatus, setSetupStatus] = useState<{
        isValid: boolean;
        issues: string[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkSetup();
    }, []);

    const checkSetup = async () => {
        try {
            setLoading(true);
            const status = await validateAppwriteSetup();
            setSetupStatus(status);
        } catch (error) {
            setSetupStatus({
                isValid: false,
                issues: ['Failed to validate setup. Please check your configuration.']
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (setupStatus?.isValid) {
        return null; // Don't show anything if setup is valid
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="bg-yellow-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                            <Settings className="h-10 w-10 text-yellow-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Appwrite Setup Required
                        </h1>
                        <p className="text-gray-600">
                            Before you can use the Personal Task Manager, you need to configure your Appwrite project.
                        </p>
                    </div>

                    {setupStatus && (
                        <div className="mb-8">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-red-800 mb-2">
                                            Configuration Issues Found:
                                        </h3>
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {setupStatus.issues.map((issue, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mr-2">•</span>
                                                    <span>{issue}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-blue-900 mb-3">
                                Quick Setup Steps:
                            </h3>
                            <ol className="text-sm text-blue-800 space-y-2">
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">1</span>
                                    <span>Create an account at <a href="https://cloud.appwrite.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Appwrite Cloud</a></span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">2</span>
                                    <span>Create a new project and copy your Project ID</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">3</span>
                                    <span>Create a database and tasks collection (see detailed guide)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">4</span>
                                    <span>Create a storage bucket for file attachments</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">5</span>
                                    <span>Update your <code className="bg-blue-100 px-1 rounded">.env</code> file with the IDs</span>
                                </li>
                            </ol>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">
                                Current Configuration:
                            </h3>
                            <pre className="text-sm text-gray-600 bg-white p-4 rounded border overflow-x-auto">
                                {getSetupInstructions()}
                            </pre>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <a
                                href="https://cloud.appwrite.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center space-x-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span>Open Appwrite Cloud</span>
                            </a>
                            <button
                                onClick={checkSetup}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <CheckCircle className="h-4 w-4" />
                                <span>Check Setup Again</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupGuide;