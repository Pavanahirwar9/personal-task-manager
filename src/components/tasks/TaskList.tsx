import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, SortAsc, SortDesc, Sparkles, Grid3X3, List, Settings } from 'lucide-react';
import type { Task, TaskFilters } from '../../types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (taskId: string) => void;
    onToggleStatus: (taskId: string, status: 'pending' | 'completed') => void;
    onCreateTask: () => void;
    loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onEditTask,
    onDeleteTask,
    onToggleStatus,
    onCreateTask,
    loading = false,
}) => {
    const [filters, setFilters] = useState<TaskFilters>({
        status: 'all',
        priority: 'all',
        searchTerm: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = [...tasks];

        // Filter by status
        if (filters.status !== 'all') {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        // Filter by priority
        if (filters.priority !== 'all') {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }

        // Filter by search term
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchLower) ||
                task.description?.toLowerCase().includes(searchLower) ||
                task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Sort tasks
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'dueDate':
                    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    comparison = aDate - bDate;
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'createdAt':
                default:
                    comparison = new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
                    break;
            }

            return filters.sortOrder === 'desc' ? comparison : -comparison;
        });

        return filtered;
    }, [tasks, filters]);

    const taskStats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const pending = total - completed;
        const overdue = tasks.filter(task =>
            task.dueDate &&
            new Date(task.dueDate) < new Date() &&
            task.status === 'pending'
        ).length;

        return { total, completed, pending, overdue };
    }, [tasks]);

    const handleFilterChange = (key: keyof TaskFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dashboard-gradient p-6 space-y-8">
            {/* Welcome Section */}
            <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
                        Task Dashboard
                    </h2>
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Stay organized and boost your productivity with our intuitive task management system
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                            <Grid3X3 className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{taskStats.pending}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                            <List className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{taskStats.completed}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{taskStats.overdue}</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                            <Settings className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Create Task Button */}
                    <button
                        onClick={onCreateTask}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create New Task
                        <Sparkles className="h-4 w-4 ml-2" />
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                                        ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center space-x-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                        <Filter className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">Filters & Search</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/* Sort */}
                    <div className="flex space-x-2">
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="dueDate">Due Date</option>
                            <option value="title">Title</option>
                            <option value="priority">Priority</option>
                        </select>
                        <button
                            onClick={toggleSortOrder}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 dark:text-gray-300"
                        >
                            {filters.sortOrder === 'asc' ? (
                                <SortAsc className="h-5 w-5" />
                            ) : (
                                <SortDesc className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                {filteredAndSortedTasks.length > 0 ? (
                    filteredAndSortedTasks.map((task) => (
                        <div
                            key={task.$id}
                            className="transform transition-all duration-200 hover:scale-[1.02] animate-slideInUp"
                        >
                            <TaskItem
                                task={task}
                                onEdit={onEditTask}
                                onDelete={onDeleteTask}
                                onToggleStatus={onToggleStatus}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-full mb-6">
                            <Search className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No tasks found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                            {filters.searchTerm || filters.status !== 'all' || filters.priority !== 'all'
                                ? 'Try adjusting your filters or search terms to discover your tasks.'
                                : 'Ready to boost your productivity? Create your first task and get started!'}
                        </p>
                        {tasks.length === 0 && (
                            <button
                                onClick={onCreateTask}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Create your first task
                                <Sparkles className="h-4 w-4 ml-2" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;