import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showWelcome: true,
  isMobileNavOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    closeWelcome(state) {
      state.showWelcome = false;
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false;
    },
  },
});

export const { closeWelcome, toggleMobileNav, closeMobileNav } = uiSlice.actions;

export const selectShowWelcome = (state) => state.ui.showWelcome;
export const selectIsMobileNavOpen = (state) => state.ui.isMobileNavOpen;

export default uiSlice.reducer;
