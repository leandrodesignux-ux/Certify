import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Workers } from './pages/Workers';
import { WorkerDetail } from './pages/WorkerDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
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
          <Route index element={<div className="text-[#F0F4FF]">Página de Certificaciones</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
