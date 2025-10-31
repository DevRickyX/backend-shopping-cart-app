import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authSlice from "./auth-slice";
import { productsApi } from "./products-api";
import productsSlice from "./products-slice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productsSlice,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { authActions } from "./auth-slice";
export { productsActions } from "./products-slice";
export { productsApi } from "./products-api";
