import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { authActions, authenticateUser } from "../lib/store/auth-slice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated, isLoading, error, isInitialized } =
    useAppSelector((state) => state.auth);

  // Initialize auth on mount - check localStorage for existing token
  useEffect(() => {
    dispatch(authActions.initializeAuth());
  }, [dispatch]);

  // Auto-authenticate on app start if no token exists
  useEffect(() => {
    // Wait for initialization, then auto-authenticate if not authenticated
    if (isInitialized && !isAuthenticated && !isLoading && !token) {
      // Automatically fetch token - no user interaction needed
      dispatch(authenticateUser());
    }
  }, [isInitialized, isAuthenticated, isLoading, token, dispatch]);

  return {
    // State
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
  };
};

export default useAuth;
