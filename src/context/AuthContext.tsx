import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthContextType } from '../types';
import {
    getCurrentUser,
    signIn as appwriteSignIn,
    signUp as appwriteSignUp,
    signOut as appwriteSignOut,
    initiatePasswordReset,
    completePasswordReset
} from '../lib/appwrite';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.log('No active session');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await appwriteSignIn(email, password);
            await checkUser();
        } catch (error) {
            throw error;
        }
    };

    const signUp = async (email: string, password: string, name: string) => {
        try {
            await appwriteSignUp(email, password, name);
            await checkUser();
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await appwriteSignOut();
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            return await initiatePasswordReset(email);
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (userId: string, secret: string, password: string) => {
        try {
            return await completePasswordReset(userId, secret, password);
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        requestPasswordReset,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};