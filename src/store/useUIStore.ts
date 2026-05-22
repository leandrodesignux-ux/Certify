import { create } from 'zustand';

interface UIStore {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  activeRoute: string;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setActiveRoute: (route: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  activeRoute: '/',

  toggleSidebar: () => set((state) => ({
    sidebarCollapsed: !state.sidebarCollapsed
  })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleMobileSidebar: () => set((state) => ({
    mobileSidebarOpen: !state.mobileSidebarOpen
  })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setActiveRoute: (route) => set({ activeRoute: route }),
}));
