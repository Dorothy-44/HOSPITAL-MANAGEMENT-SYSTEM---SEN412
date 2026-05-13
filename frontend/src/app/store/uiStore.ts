import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// Types
// ============================================
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  
  // Theme
  theme: 'light' | 'dark';
  
  // Loading
  globalLoading: boolean;
  
  // Modal
  activeModal: string | null;
  modalData: any;
  
  // Toasts
  toasts: Toast[];
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Loading
  setGlobalLoading: (loading: boolean) => void;
  
  // Modal
  openModal: (modalName: string, data?: any) => void;
  closeModal: () => void;
  
  // Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// ============================================
// Store
// ============================================
export const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      // Initial State
      sidebarOpen: true,
      theme: 'light',
      globalLoading: false,
      activeModal: null,
      modalData: null,
      toasts: [],

      // Sidebar Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Theme Actions
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setTheme: (theme) => set({ theme }),

      // Loading Actions
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Modal Actions
      openModal: (modalName, data = null) =>
        set({ activeModal: modalName, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Toast Actions
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: Date.now().toString() },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'hospital-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        theme: state.theme,
      }),
    }
  )
);