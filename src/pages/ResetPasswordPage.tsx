import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    CheckSquare,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    Loader,
    Shield,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

interface ResetPasswordPageProps {
    onBackToLogin: () => void;
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onBackToLogin }) => {
    const { resetPassword } = useAuth();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validation, setValidation] = useState({
        password: { isValid: false, message: '' },
        confirmPassword: { isValid: false, message: '' }
    });

    // Get URL parameters from current window location
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    useEffect(() => {
        // Validate required parameters
        if (!userId || !secret) {
            setError('Invalid or expired reset link. Please request a new password reset.');
        }
    }, [userId, secret]);

    // Validation functions
    const validatePassword = (password: string) => {
        if (!password) return { isValid: false, message: '' };
        if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' };
        if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        if (!/(?=.*[A-Z])/.test(password)) return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        if (!/(?=.*\d)/.test(password)) return { isValid: false, message: 'Password must contain at least one number' };
        return { isValid: true, message: 'Strong password!' };
    };

    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (!confirmPassword) return { isValid: false, message: '' };
        if (password !== confirmPassword) return { isValid: false, message: 'Passwords do not match' };
        return { isValid: true, message: 'Passwords match!' };
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');

        // Real-time validation
        if (field === 'password') {
            const passwordValidation = validatePassword(value);
            const confirmValidation = validateConfirmPassword(value, formData.confirmPassword);
            setValidation(prev => ({
                ...prev,
                password: passwordValidation,
                confirmPassword: formData.confirmPassword ? confirmValidation : prev.confirmPassword
            }));
        } else if (field === 'confirmPassword') {
            const confirmValidation = validateConfirmPassword(formData.password, value);
            setValidation(prev => ({
                ...prev,
                confirmPassword: confirmValidation
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !secret) {
            setError('Invalid or expired reset link. Please request a new password reset.');
            return;
        }

        // Final validation
        const passwordValidation = validatePassword(formData.password);
        const confirmValidation = validateConfirmPassword(formData.password, formData.confirmPassword);

        if (!passwordValidation.isValid || !confirmValidation.isValid) {
            setError('Please fix the validation errors before submitting.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await resetPassword(userId, secret, formData.password);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                onBackToLogin();
            }, 3000);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Password reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        onBackToLogin();
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center animate-scaleIn">
                                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Password Reset Successful!
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Your password has been successfully updated. You can now sign in with your new password.
                                </p>
                            </div>

                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-700 dark:text-green-400">
                                    You'll be redirected to the sign-in page in a few seconds...
                                </p>
                            </div>

                            <button
                                onClick={handleBackToLogin}
                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go to Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 animate-pulse">
                        <CheckSquare className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Enter your new password"
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white ${formData.password && validation.password.isValid
                                            ? 'border-green-300 dark:border-green-600'
                                            : formData.password && !validation.password.isValid
                                                ? 'border-red-300 dark:border-red-600'
                                                : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formData.password && validation.password.message && (
                                <div className={`flex items-center space-x-1 text-sm ${validation.password.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {validation.password.isValid ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    <span>{validation.password.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    placeholder="Confirm your new password"
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white ${formData.confirmPassword && validation.confirmPassword.isValid
                                            ? 'border-green-300 dark:border-green-600'
                                            : formData.confirmPassword && !validation.confirmPassword.isValid
                                                ? 'border-red-300 dark:border-red-600'
                                                : 'border-gray-200 dark:border-gray-600'
                                        }`}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {formData.confirmPassword && validation.confirmPassword.message && (
                                <div className={`flex items-center space-x-1 text-sm ${validation.confirmPassword.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {validation.confirmPassword.isValid ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                    <span>{validation.confirmPassword.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !validation.password.isValid || !validation.confirmPassword.isValid}
                            className="w-full flex items-center justify-center px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-5 w-5 mr-2" />
                                    Update Password
                                    <Sparkles className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </button>

                        {/* Back to Login */}
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;