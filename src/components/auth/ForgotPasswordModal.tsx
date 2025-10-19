import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    X,
    Mail,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader,
    Send,
    Shield
} from 'lucide-react';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { requestPasswordReset } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await requestPasswordReset(email);
            setSent(true);
        } catch (error) {
            // Security: Don't reveal if email exists or not
            setSent(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        setSent(false);
        setLoading(false);
        onClose();
    };

    const handleBackToLogin = () => {
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={handleClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all animate-scaleIn">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {sent ? 'Check Your Email' : 'Reset Password'}
                            </h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!sent ? (
                            // Reset Request Form
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Enter your email address and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="reset-email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError('');
                                            }}
                                            placeholder="Enter your email address"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
                                            disabled={loading}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col space-y-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader className="h-4 w-4 mr-2 animate-spin" />
                                                Sending Reset Link...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Reset Link
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="w-full flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Sign In
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Success State
                            <div className="text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Reset Link Sent
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        If an account with <span className="font-medium text-gray-900 dark:text-white">{email}</span> exists,
                                        you'll receive a password reset email shortly.
                                    </p>
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm text-blue-700 dark:text-blue-400">
                                            <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBackToLogin}
                                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Sign In
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;