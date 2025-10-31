import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { authActions, authenticateUser } from "../lib/store/auth-slice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated, isLoading, error, isInitialized } =
    useAppSelector((state) => state.auth);
  const hasAttemptedAuth = useRef(false);

  // Auto-authenticate on app start - only run once
  useEffect(() => {
    // First check if we have a token
    dispatch(authActions.initializeAuth());
  }, [dispatch]);

  // Auto-authenticate if not authenticated - run when auth state changes
  useEffect(() => {
    // Only attempt authentication if not authenticated, not loading, initialized, and not already attempted
    if (
      !isAuthenticated &&
      !isLoading &&
      isInitialized &&
      !hasAttemptedAuth.current
    ) {
      hasAttemptedAuth.current = true;
      dispatch(authenticateUser());
    }
  }, [isAuthenticated, isLoading, isInitialized, dispatch]);

  // Reset the flag when authentication succeeds or fails
  useEffect(() => {
    if (isAuthenticated || error) {
      hasAttemptedAuth.current = false;
    }
  }, [isAuthenticated, error]);

  // Auto-refresh token logic
  useEffect(() => {
    if (isAuthenticated && token) {
      // Check token expiration every hour
      const interval = setInterval(() => {
        // Check if token exists
        if (!localStorage.getItem("auth_token")) {
          dispatch(authActions.logout());
        }
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, dispatch]);

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
