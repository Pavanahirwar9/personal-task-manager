export interface User {
    $id: string;
    email: string;
    name: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface Task {
    $id: string;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    tags?: string[];
    attachments?: TaskAttachment[];
    userId: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface TaskAttachment {
    $id: string;
    name: string;
    type: string;
    size: number;
    url: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<any>;
    resetPassword: (userId: string, secret: string, password: string) => Promise<any>;
}

export interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    createTask: (task: Omit<Task, '$id' | '$createdAt' | '$updatedAt' | 'userId'>) => Promise<void>;
    updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
}

export interface TaskFilters {
    status?: 'all' | 'pending' | 'completed';
    priority?: 'all' | 'low' | 'medium' | 'high';
    searchTerm?: string;
    sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'title';
    sortOrder?: 'asc' | 'desc';
}