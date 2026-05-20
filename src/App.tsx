import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Workers } from './pages/Workers';
import { WorkerDetail } from './pages/WorkerDetail';
import { Certifications } from './pages/Certifications';
import { Curriculum } from './pages/Curriculum';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App
