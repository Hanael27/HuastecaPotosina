import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './contentSlice';
import galleryReducer from './gallerySlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    gallery: galleryReducer,
    ui: uiReducer,
  },
});

export default store;
