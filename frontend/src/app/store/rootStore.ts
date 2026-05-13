import { useAuthStore } from './authStore';
import { useUIStore } from './uiStore';

export const resetAllStores = () => {
  useAuthStore.getState().logout();
  
  const currentTheme = useUIStore.getState().theme;
  useUIStore.setState({
    sidebarOpen: true,
    globalLoading: false,
    activeModal: null,
    modalData: null,
    toasts: [],
    theme: currentTheme,
  });
};

export const initializeStores = () => {
  console.log('Stores initialized');
};