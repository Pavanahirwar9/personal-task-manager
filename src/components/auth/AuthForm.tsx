import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import {
    CheckSquare,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    Github,
    Chrome,
    KeyRound
} from 'lucide-react';

interface AuthFormProps {
    mode: 'login' | 'register';
    onToggleMode: () => void;
}

interface ValidationState {
    email: { isValid: boolean; message: string };
    password: { isValid: boolean; message: string };
    name: { isValid: boolean; message: string };
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
    const { signIn, signUp } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [validation, setValidation] = useState<ValidationState>({
        email: { isValid: false, message: '' },
        password: { isValid: false, message: '' },
        name: { isValid: false, message: '' }
    });

    // Validation functions
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) return { isValid: false, message: '' };
        if (!emailRegex.test(email)) return { isValid: false, message: 'Please enter a valid email address' };
        return { isValid: true, message: '' };
    };

    const validatePassword = (password: string) => {
        if (!password) return { isValid: false, message: '' };
        if (password.length < 8) return { isValid: false, message: 'Password must be at least 8 characters long' };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            return { isValid: false, message: 'Password must contain uppercase, lowercase, and number' };
        }
        return { isValid: true, message: '' };
    };

    const validateName = (name: string) => {
        if (!name) return { isValid: false, message: '' };
        if (name.trim().length < 2) return { isValid: false, message: 'Name must be at least 2 characters long' };
        return { isValid: true, message: '' };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        if (name === 'email') {
            setValidation(prev => ({ ...prev, email: validateEmail(value) }));
        } else if (name === 'password') {
            setValidation(prev => ({ ...prev, password: validatePassword(value) }));
        } else if (name === 'name') {
            setValidation(prev => ({ ...prev, name: validateName(value) }));
        }

        if (error) setError('');
    };

    const handleTabSwitch = () => {
        onToggleMode();
        setError('');
        setFormData({ email: '', password: '', name: '' });
        setValidation({
            email: { isValid: false, message: '' },
            password: { isValid: false, message: '' },
            name: { isValid: false, message: '' }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await signIn(formData.email, formData.password);
            } else {
                if (!formData.name.trim()) {
                    throw new Error('Name is required');
                }
                await signUp(formData.email, formData.password, formData.name);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const emailValid = validation.email.isValid;
        const passwordValid = validation.password.isValid;
        const nameValid = mode === 'login' || validation.name.isValid;
        return emailValid && passwordValid && nameValid && formData.email && formData.password && (mode === 'login' || formData.name);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Logo */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-center">
                        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <CheckSquare className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-white">Task Manager</h1>
                        <p className="mt-2 text-blue-100">Organize your productivity</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-gray-50">
                        <button
                            type="button"
                            onClick={handleTabSwitch}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${mode === 'login'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={handleTabSwitch}
                            className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${mode === 'register'
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Field (Register only) */}
                            {mode === 'register' && (
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className={`h-5 w-5 ${validation.name.isValid && formData.name ? 'text-green-500' : 'text-gray-400'}`} />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required={mode === 'register'}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${validation.name.message && formData.name
                                                    ? 'border-red-300 bg-red-50'
                                                    : validation.name.isValid && formData.name
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your full name"
                                            aria-describedby="name-error"
                                        />
                                        {validation.name.isValid && formData.name && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                    {validation.name.message && formData.name && (
                                        <p id="name-error" className="text-sm text-red-600 flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            {validation.name.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className={`h-5 w-5 ${validation.email.isValid && formData.email ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${validation.email.message && formData.email
                                                ? 'border-red-300 bg-red-50'
                                                : validation.email.isValid && formData.email
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email address"
                                        aria-describedby="email-error"
                                    />
                                    {validation.email.isValid && formData.email && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                {validation.email.message && formData.email && (
                                    <p id="email-error" className="text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {validation.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className={`h-5 w-5 ${validation.password.isValid && formData.password ? 'text-green-500' : 'text-gray-400'}`} />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        required
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${validation.password.message && formData.password
                                                ? 'border-red-300 bg-red-50'
                                                : validation.password.isValid && formData.password
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your password"
                                        aria-describedby="password-error"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {validation.password.message && formData.password && (
                                    <p id="password-error" className="text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {validation.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link (Login only) */}
                            {mode === 'login' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center transition-colors"
                                    >
                                        <KeyRound className="h-4 w-4 mr-1" />
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!isFormValid() || loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                        <CheckSquare className="h-5 w-5 ml-2" />
                                    </span>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    <Github className="h-5 w-5" />
                                    <span className="ml-2 text-sm font-medium">GitHub</span>
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    <Chrome className="h-5 w-5" />
                                    <span className="ml-2 text-sm font-medium">Google</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPasswordModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />
        </div>
    );
};

export default AuthForm;