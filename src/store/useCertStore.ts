import { create } from 'zustand';
import type { Certification, CertStatus } from '../types';
import { mockCertifications } from '../data/mockData';

type CertTab = 'todas' | 'vigentes' | 'proximas' | 'vencidas';

interface CertStore {
  certifications: Certification[];
  activeTab: CertTab;
  search: string;
  lastUpdated: Date;
  
  setCertifications: (certifications: Certification[]) => void;
  setActiveTab: (tab: CertTab) => void;
  setSearch: (search: string) => void;
  
  filteredCerts: () => Certification[];
  certsByWorker: (workerId: string) => Certification[];
}

export const useCertStore = create<CertStore>((set, get) => ({
  certifications: mockCertifications,
  activeTab: 'todas',
  search: '',
  lastUpdated: new Date(),
  
  setCertifications: (certifications) => set({ 
    certifications, 
    lastUpdated: new Date() 
  }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSearch: (search) => set({ search }),
  
  filteredCerts: () => {
    const { certifications, activeTab } = get();
    
    if (activeTab === 'todas') return certifications;
    
    const statusMap: Record<Exclude<CertTab, 'todas'>, CertStatus | CertStatus[]> = {
      vigentes: 'vigente',
      proximas: 'proximo_vencer',
      vencidas: ['vencido', 'pendiente'],
    };
    
    const targetStatus = statusMap[activeTab];
    
    return certifications.filter((cert) => {
      if (Array.isArray(targetStatus)) {
        return targetStatus.includes(cert.estado);
      }
      return cert.estado === targetStatus;
    });
  },
  
  certsByWorker: (workerId) => {
    return get().certifications.filter((cert) => cert.workerId === workerId);
  },
}));

export const mockComplianceTrend = [
  { week: 'Semana 1', value: 73, label: '04 Nov' },
  { week: 'Semana 2', value: 75, label: '11 Nov' },
  { week: 'Semana 3', value: 76, label: '18 Nov' },
  { week: 'Semana 4', value: 78, label: '25 Nov' },
];
