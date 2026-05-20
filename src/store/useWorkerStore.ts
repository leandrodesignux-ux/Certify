import { create } from 'zustand';
import type { Worker } from '../types';
import { mockWorkers } from '../data/mockData';

interface WorkerFilters {
  area: string;
  cargo: string;
  search: string;
  complianceMin: number;
}

interface WorkerStore {
  workers: Worker[];
  selectedWorker: Worker | null;
  filters: WorkerFilters;
  
  setWorkers: (workers: Worker[]) => void;
  selectWorker: (worker: Worker | null) => void;
  setFilters: (filters: Partial<WorkerFilters>) => void;
  clearFilters: () => void;
  
  filteredWorkers: () => Worker[];
}

const defaultFilters: WorkerFilters = {
  area: '',
  cargo: '',
  search: '',
  complianceMin: 0,
};

export const useWorkerStore = create<WorkerStore>((set, get) => ({
  workers: mockWorkers,
  selectedWorker: null,
  filters: defaultFilters,
  
  setWorkers: (workers) => set({ workers }),
  
  selectWorker: (worker) => set({ selectedWorker: worker }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  
  clearFilters: () => set({ filters: defaultFilters }),
  
  filteredWorkers: () => {
    const { workers, filters } = get();
    
    return workers.filter((worker) => {
      if (filters.area && worker.area !== filters.area) return false;
      if (filters.cargo && worker.cargo !== filters.cargo) return false;
      if (worker.complianceScore < filters.complianceMin) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${worker.nombre} ${worker.apellidos}`.toLowerCase();
        const matchName = fullName.includes(searchLower);
        const matchRut = worker.rut.toLowerCase().includes(searchLower);
        const matchEmail = worker.email.toLowerCase().includes(searchLower);
        const matchCargo = worker.cargo.toLowerCase().includes(searchLower);
        
        if (!matchName && !matchRut && !matchEmail && !matchCargo) return false;
      }
      return true;
    });
  },
}));
