import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from './auth-slice';
import { itemsApi } from './items-api';
import itemsSlice from './items-slice';
import { cartApi } from './cart-api';
import cartSlice from './cart-slice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    items: itemsSlice,
    cart: cartSlice,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(itemsApi.middleware, cartApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { authActions } from './auth-slice';
export { itemsActions } from './items-slice';
export { cartActions } from './cart-slice';
export { itemsApi } from './items-api';
export { cartApi } from './cart-api';
