import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType?: 'user' | 'venue') => Promise<void>;
  register: (email: string, password: string, name: string, userType?: 'user' | 'venue') => Promise<void>;
  googleLogin: (idToken: string, userType?: 'user' | 'venue') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        apiService.setToken(token);
        const response = await apiService.getCurrentUser();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      await AsyncStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: 'user' | 'venue' = 'user') => {
    try {
      const response = await apiService.login(email, password);
      const { user: userData, token } = response;
      
      // Add userType to the user data
      const userWithType = { ...userData, userType };
      
      await AsyncStorage.setItem('authToken', token);
      apiService.setToken(token);
      setUser(userWithType);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string, userType: 'user' | 'venue' = 'user') => {
    try {
      console.log('🔄 AuthContext: Starting registration process');
      console.log('📝 Registration data:', { email, password: '***', name, userType });
      
      console.log('🌐 Calling apiService.register...');
      const response = await apiService.register(email, password, name);
      console.log('✅ API registration response received:', response);
      
      const { user: userData, token } = response;
      console.log('👤 User data from API:', userData);
      console.log('🔑 Token received:', token ? 'Yes' : 'No');
      
      // Add userType to the user data
      const userWithType = { ...userData, userType };
      console.log('👤 User with type:', userWithType);
      
      console.log('💾 Storing auth token...');
      await AsyncStorage.setItem('authToken', token);
      console.log('✅ Auth token stored');
      
      console.log('🔧 Setting API service token...');
      apiService.setToken(token);
      console.log('✅ API service token set');
      
      console.log('👤 Setting user state...');
      setUser(userWithType);
      console.log('✅ User state set');
      
      console.log('🎉 Registration completed successfully!');
    } catch (error) {
      console.error('❌ Registration error in AuthContext:', error);
      throw error;
    }
  };

  const googleLogin = async (idToken: string, userType: 'user' | 'venue' = 'user') => {
    try {
      console.log('🔄 AuthContext: Starting Google login process');
      console.log('📝 Google login data:', { idToken: '***', userType });
      
      const response = await apiService.googleLogin(idToken);
      const { user: userData, token } = response;
      
      // Add userType to the user data
      const userWithType = { ...userData, userType };
      
      await AsyncStorage.setItem('authToken', token);
      apiService.setToken(token);
      setUser(userWithType);
      
      console.log('🎉 Google login completed successfully!');
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      console.log('🔄 AuthContext: Starting forgot password process');
      await apiService.forgotPassword(email);
      console.log('✅ Forgot password email sent successfully!');
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      console.log('🔄 AuthContext: Starting password reset process');
      await apiService.resetPassword(token, newPassword);
      console.log('✅ Password reset completed successfully!');
    } catch (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      console.log('🔄 AuthContext: Starting email verification process');
      await apiService.verifyEmail(token);
      console.log('✅ Email verification completed successfully!');
    } catch (error) {
      console.error('❌ Email verification error:', error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    try {
      console.log('🔄 AuthContext: Starting resend verification email process');
      await apiService.resendVerificationEmail();
      console.log('✅ Verification email resent successfully!');
    } catch (error) {
      console.error('❌ Resend verification email error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user:', user?.email);
      
      // Clear token from storage
      await AsyncStorage.removeItem('authToken');
      console.log('✅ Auth token removed from storage');
      
      // Clear API service token
      apiService.setToken('');
      console.log('✅ API service token cleared');
      
      // Clear user state
      setUser(null);
      console.log('✅ User state cleared');
      
      console.log('🎉 Logout completed successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if there's an error, clear the user state
      setUser(null);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      await apiService.updateUserProfile(userData);
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 