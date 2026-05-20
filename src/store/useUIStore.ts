import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  activeRoute: string;
  
  toggleSidebar: () => void;
  setActiveRoute: (route: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeRoute: '/',
  
  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
  
  setActiveRoute: (route) => set({ activeRoute: route }),
}));
