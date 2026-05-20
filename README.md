# CertifyX

Sistema de gestión de certificaciones y competencias para empresas industriales.

![CertifyX Dashboard](public/screenshots/dashboard.png)

## Descripción

CertifyX es una plataforma de gestión de certificaciones industriales diseñada para empresas mineras, constructoras y agroindustriales de Chile. Centraliza el control de competencias, certificaciones SENCE, mallas curriculares y cumplimiento legal en un dashboard intuitivo.

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3.4
- **Animaciones**: Framer Motion
- **Estado**: Zustand
- **Data Fetching**: React Query (TanStack)
- **Gráficos**: Recharts
- **Router**: React Router v6
- **UI/UX**: Diseño industrial dark mode con glassmorphism

## Características Principales

### Dashboard
- KPI cards con métricas en tiempo real
- Gráficos de compliance (AreaChart, BarChart, DonutChart, LineChart)
- Panel de alertas de vencimientos
- Feed de actividad reciente

### Gestión de Trabajadores
- Grid/Table toggle
- Filtros por área, cargo, compliance
- Perfil detallado con timeline de certificaciones
- Indicadores de estado (vigente, por vencer, vencido)

### Certificaciones
- Lista completa con filtros avanzados
- Ordenación por columnas
- Exportación CSV
- Indicadores visuales de estado

### Mallas Curriculares
- Visualización de rutas de aprendizaje
- Progreso por curso
- Líneas de tiempo conectadas

## Instalación Local

### Requisitos
- Node.js 18+
- npm o pnpm

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/leandrodesignux-ux/Certify.git
cd Certify/certifyx

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo en localhost:5173 |
| `npm run build` | Construye para producción en /dist |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npx tsc --noEmit` | Verifica tipos TypeScript |

## Estructura de Carpetas

```
certifyx/
├── public/                 # Assets estáticos
├── src/
│   ├── components/
│   │   ├── dashboard/      # StatsCard, ComplianceGauge, Charts
│   │   ├── layout/         # Sidebar, Topbar, AppLayout
│   │   ├── ui/             # Button, Card, Badge, ProgressBar
│   │   ├── workers/        # WorkerCard, WorkerTable
│   │   ├── profile/        # ProfileHeader
│   │   ├── certifications/ # CertCard, CertTimeline
│   │   └── curriculum/     # CourseCard, MeshGrid
│   ├── pages/              # Landing, Dashboard, Workers, etc.
│   ├── data/               # Mock data para demo
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Helpers (dates, colors, format)
│   └── styles/             # globals.css
├── tailwind.config.ts
├── vite.config.ts
└── tsconfig.json
```

## Screenshots

> Añadir capturas de pantalla en `public/screenshots/`:
> - `dashboard.png` - Vista principal del dashboard
> - `workers.png` - Lista de trabajadores
> - `certifications.png` - Tabla de certificaciones
> - `profile.png` - Perfil de trabajador
> - `landing.png` - Landing page

## Deploy

### Vercel (Recomendado)

1. Conectar repositorio GitHub en [vercel.com](https://vercel.com)
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. El archivo `vercel.json` ya incluye rewrites para SPA

**Link al deploy**: [TBD - Añadir URL de Vercel]

### Configuración Vercel

El archivo `vercel.json` incluye:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Esto asegura que el enrutamiento SPA funcione correctamente.

## Licencia

MIT © 2024 CertifyX

---

Desarrollado con React + TypeScript + TailwindCSS para el ecosistema industrial chileno.
