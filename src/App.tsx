import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';

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
          <Route index element={<div className="text-[#F0F4FF]">Página de Trabajadores</div>} />
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
