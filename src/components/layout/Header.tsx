import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTask } from '../../context/TaskContext';
import { LogOut, CheckSquare, Moon, Sun, User, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Header: React.FC = () => {
    const { user, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { tasks } = useTask();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    // Calculate task statistics
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;

    // Get user initials for avatar
    const getUserInitials = (name: string | undefined, email: string | undefined) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
        return email?.[0]?.toUpperCase() || 'U';
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                                <CheckSquare className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Task Manager
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Stay productive</p>
                            </div>
                        </div>

                        {/* Task Statistics */}
                        <div className="hidden md:flex items-center space-x-3 ml-8">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    {totalTasks} Total
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 rounded-full">
                                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                    {pendingTasks} Pending
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-full">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                    {completedTasks} Done
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ?
                                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" /> :
                                <Sun className="h-5 w-5 text-yellow-500" />
                            }
                        </button>

                        {/* User Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm shadow-lg">
                                    {user?.name ? (
                                        <User className="h-5 w-5" />
                                    ) : (
                                        getUserInitials(user?.name, user?.email)
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                            </div>
                        </div>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-red-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;