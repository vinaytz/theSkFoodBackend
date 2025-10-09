import { useAuthStore } from '@/store/authStore';
import { useProfile, useLogin, useSignup, useLogout } from '@/services/queries';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, clearAuth, setUser } = useAuthStore();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useProfile();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();

  // Sync profile data with store
  useEffect(() => {
    if (profileData && !profileError) {
      setUser(profileData);
    } else if (profileError) {
      clearAuth();
    }
  }, [profileData, profileError, setUser, clearAuth]);

  // Check if token exists on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    if (storedToken && !token) {
      // Token exists but not in store, let profile query handle validation
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.token) {
        // Profile will be fetched automatically by useProfile hook
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const result = await signupMutation.mutateAsync({ name, email, password });
      if (result.token) {
        // Profile will be fetched automatically by useProfile hook
        return result;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      clearAuth();
    } catch (error) {
      // Clear auth even if logout request fails
      clearAuth();
    }
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated && !!profileData,
    isLoading: profileLoading || loginMutation.isPending || signupMutation.isPending || logoutMutation.isPending,
    login,
    signup,
    logout,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  };
};