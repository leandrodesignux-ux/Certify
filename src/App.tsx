import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Card } from './components/ui/Card';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workers = lazy(() => import('./pages/Workers'));
import { WorkerDetail } from './pages/WorkerDetail';
const Certifications = lazy(() => import('./pages/Certifications'));
const Curriculum = lazy(() => import('./pages/Curriculum'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card variant="glass" padding="lg" className="text-center">
        <div className="w-8 h-8 border-2 border-[#9b6ab5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8892A4]">Cargando...</p>
      </Card>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/" element={<Landing />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AppLayout
              pageTitle="Dashboard"
              breadcrumbs={[{ label: 'Inicio' }]}
            />
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        <Route
          path="/workers"
          element={
            <AppLayout
              pageTitle="Trabajadores"
              breadcrumbs={[{ label: 'Inicio', route: '/' }, { label: 'Trabajadores' }]}
            />
          }
        >
          <Route index element={<Workers />} />
          <Route
            path=":workerId"
            element={
              <AppLayout
                pageTitle="Detalle del Trabajador"
                breadcrumbs={[
                  { label: 'Inicio', route: '/' },
                  { label: 'Trabajadores', route: '/workers' },
                  { label: 'Perfil' },
                ]}
              />
            }
          >
            <Route index element={<WorkerDetail />} />
          </Route>
        </Route>
        <Route
          path="/certifications"
          element={
            <AppLayout
              pageTitle="Certificaciones"
              breadcrumbs={[{ label: 'Inicio', route: '/' }, { label: 'Certificaciones' }]}
            />
          }
        >
          <Route index element={<Certifications />} />
        </Route>
        <Route
          path="/curriculum"
          element={
            <AppLayout
              pageTitle="Mallas Curriculares"
              breadcrumbs={[{ label: 'Inicio', route: '/' }, { label: 'Mallas' }]}
            />
          }
        >
          <Route index element={<Curriculum />} />
        </Route>
        <Route
          path="/reports"
          element={
            <AppLayout
              pageTitle="Reportes"
              breadcrumbs={[{ label: 'Inicio', route: '/' }, { label: 'Reportes' }]}
            />
          }
        >
          <Route index element={<Reports />} />
        </Route>
        <Route
          path="/settings"
          element={
            <AppLayout
              pageTitle="Configuración"
              breadcrumbs={[{ label: 'Inicio', route: '/' }, { label: 'Configuración' }]}
            />
          }
        >
          <Route index element={<Settings />} />
        </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    );
}

export default App
