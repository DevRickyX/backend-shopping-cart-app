import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, AuthToken, ApiError } from "../types";
import { apiClient } from "../api";

// Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent flash
  error: null,
  isInitialized: false,
};

// Extended state to track initialization
interface ExtendedAuthState extends AuthState {
  isInitialized: boolean;
}

const extendedInitialState: ExtendedAuthState = {
  ...initialState,
  isInitialized: false,
};

// Async thunks
export const authenticateUser = createAsyncThunk<
  AuthToken,
  void,
  { rejectValue: ApiError }
>("auth/authenticate", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.getAuthToken();
    console.log('Auth response:', response);
    
    // apiClient should have already unwrapped {data: T} to T
    // So response should be {access_token: ...} directly
    let tokenData: AuthToken;
    
    if (response && typeof response === 'object') {
      // Check if it's still wrapped
      if ('data' in response && response.data && typeof response.data === 'object') {
        console.log('Found nested data, unwrapping...');
        tokenData = response.data as AuthToken;
      } else if ('access_token' in response) {
        tokenData = response as AuthToken;
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid token response format');
      }
    } else {
      throw new Error('Invalid response type');
    }
    
    console.log('Extracted token data:', tokenData);
    
    if (!tokenData.access_token) {
      throw new Error('No access_token in response');
    }
    
    return tokenData;
  } catch (error) {
    console.error('Authentication error:', error);
    return rejectWithValue(error as ApiError);
  }
});

// Auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: extendedInitialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      apiClient.clearAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      apiClient.setAuthToken(action.payload);
    },
    initializeAuth: (state) => {
      // Only initialize once
      if (state.isInitialized) {
        return;
      }

      // Check if token exists in localStorage on app initialization
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          state.isLoading = false;
          apiClient.setAuthToken(token);
        } else {
          // No token found, set loading to false
          state.isLoading = false;
        }
      } else {
        // Server-side rendering, set loading to false
        state.isLoading = false;
      }

      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle authenticateUser
      .addCase(authenticateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const token = action.payload?.access_token;
        console.log('Storing token:', token ? 'Token received' : 'No token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          state.error = null;
          console.log('Setting token in apiClient and localStorage');
          apiClient.setAuthToken(token);
          console.log('Token stored, localStorage check:', localStorage.getItem('auth_token'));
        } else {
          console.error('No token in payload:', action.payload);
          state.error = 'Invalid token response';
          state.isAuthenticated = false;
        }
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Authentication failed";
        apiClient.clearAuthToken();
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
