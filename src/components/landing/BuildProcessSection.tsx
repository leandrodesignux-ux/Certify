import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette,
  Code2,
  Paintbrush,
  Wind,
  Rocket,
  Settings,
  Search,
  GitBranch,
  LayoutGrid,
  Blocks,
  FlaskConical,
  TrendingDown,
  ShieldCheck,
  Clock,
  Leaf,
  BarChart3,
  Briefcase,
  Mail,
  Copy,
  Check,
} from 'lucide-react';

export function BuildProcessSection() {
  const [copied, setCopied] = useState(false);
  const email = 'leandrodesign.ux@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    {
      icon: Palette,
      title: 'Figma',
      desc: 'Design System, prototipado HI-FI y flujos de navegación.',
      tag: 'Design',
    },
    {
      icon: Code2,
      title: 'React + TypeScript',
      desc: 'Componentización tipada, escalable y mantenible.',
      tag: 'Frontend',
    },
    {
      icon: Paintbrush,
      title: 'Tailwind CSS',
      desc: 'Tokens de color, utilidades y diseño responsive sin clases custom.',
      tag: 'Styling',
    },
    {
      icon: Wind,
      title: 'Framer Motion',
      desc: 'Microinteracciones, entradas escalonadas y estados de hover.',
      tag: 'Motion',
    },
    {
      icon: Rocket,
      title: 'Vite',
      desc: 'Build rápida, HMR instantáneo y optimización para producción.',
      tag: 'Build',
    },
  ];

  const processes = [
    {
      icon: Search,
      title: 'Research industrial',
      desc: 'Entrevistas y mapeo de flujos reales de RRHH, prevención y operaciones.',
    },
    {
      icon: GitBranch,
      title: 'Arquitectura de información',
      desc: 'Estructura de navegación, rutas y jerarquía de datos por rol.',
    },
    {
      icon: LayoutGrid,
      title: 'Design System tokenizado',
      desc: 'Variables CSS para colores, tipografía, espaciado y estados semánticos.',
    },
    {
      icon: Blocks,
      title: 'Componentización modular',
      desc: 'Primitivas reutilizables: Button, Card, Badge, ProgressBar, StatusIndicator.',
    },
    {
      icon: FlaskConical,
      title: 'Iteración con datos demo',
      desc: '20 trabajadores, ~60 certificaciones y 5 mallas para validar la UX.',
    },
  ];

  const impact = [
    {
      icon: TrendingDown,
      title: 'Reducción de Cost-to-Serve',
      desc: 'Menos tiempo de gestión administrativa y menor riesgo de multas.',
      metric: '70%',
    },
    {
      icon: ShieldCheck,
      title: 'Mitigación de riesgo legal',
      desc: 'Alertas automáticas antes de vencimientos SENCE y certificaciones críticas.',
      metric: '0',
      metricLabel: 'vencidos ocultos',
    },
    {
      icon: Clock,
      title: 'Eficiencia de decisión',
      desc: 'Dashboard en tiempo real con compliance por área, trabajador y certificación.',
      metric: '5s',
      metricLabel: 'para diagnosticar',
    },
    {
      icon: Leaf,
      title: 'Menos papel, más control',
      desc: 'Centralización de Excel dispersos en una única fuente de verdad.',
      metric: '98%',
      metricLabel: 'menos documentos físicos',
    },
  ];

  const cardBase = {
    backgroundColor: 'var(--surface-card)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)',
    padding: '28px',
  };

  const sectionTitle = {
    fontSize: 'var(--text-eyebrow)',
    fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    color: 'var(--color-text-muted)',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const itemTitle = {
    fontSize: '15px',
    fontWeight: 'var(--weight-semibold)' as React.CSSProperties['fontWeight'],
    color: 'var(--color-brand)',
    marginBottom: '4px',
  };

  const itemDesc = {
    fontSize: 'var(--text-body-sm)',
    color: 'var(--color-text-muted)',
    lineHeight: 1.5,
  };

  return (
    <section
      id="como-lo-construi"
      style={{
        padding: '96px 0',
        backgroundColor: 'var(--surface-canvas)',
        borderTop: '1px solid var(--border-default)',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '56px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 500,
              color: 'var(--color-brand)',
              letterSpacing: '-0.04em',
              marginBottom: '12px',
            }}
          >
            Cómo lo construí
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
            El proceso detrás de CertifyX — de problema industrial a producto funcional.
          </p>
        </motion.div>

        {/* Author card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            ...cardBase,
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '32px',
            alignItems: 'start',
          }}
          className="build-author-grid"
        >
          {/* Left: intro */}
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: 'var(--color-primary-soft)',
                border: '1px solid var(--color-primary-border)',
                borderRadius: '9999px',
                fontSize: 'var(--text-caption)',
                fontWeight: 500,
                color: 'var(--color-primary)',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  flexShrink: 0,
                }}
              />
              Documentación del proceso
            </span>

            <h3
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 500,
                color: 'var(--color-brand)',
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: '12px',
              }}
            >
              Leandro Balbian
            </h3>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-muted)',
                marginBottom: '20px',
                lineHeight: 1.6,
              }}
            >
              UX/UI Designer · Frontend Developer · AI Product Architect
            </p>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text)',
                lineHeight: 1.7,
                maxWidth: '560px',
              }}
            >
              ¿Cómo escalas el control de certificaciones en una empresa industrial sin perder visibilidad ni aumentar el riesgo operativo? CertifyX es una auditoría de diseño aplicada a la gestión de competencias, demostrando cómo un dashboard centralizado, alertas automáticas y mallas curriculares pueden reducir el Cost-to-Serve y mantener la operación dentro de la normativa chilena.
            </p>
          </div>

          {/* Right: contact card */}
          <div
            style={{
              backgroundColor: 'var(--surface-canvas)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}
          >
            <p style={{ ...sectionTitle, marginBottom: '16px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
              Contacto
            </p>

            <button
              onClick={handleCopyEmail}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                marginBottom: '12px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
                    {email}
                  </p>
                  <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)' }}>
                    Click para copiar
                  </p>
                </div>
              </div>
              {copied ? (
                <Check style={{ width: '16px', height: '16px', color: 'var(--status-success)' }} strokeWidth={2} />
              ) : (
                <Copy style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
              )}
            </button>

            <a
              href="https://www.linkedin.com/in/leodisenofreelance/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                height: '44px',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: '1px solid var(--color-primary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                marginBottom: '12px',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'; }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ flexShrink: 0 }}
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>

            <a
              href="https://leandrobalbian.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                height: '44px',
                backgroundColor: 'var(--surface-card)',
                color: 'var(--color-brand)',
                border: '1px solid var(--color-brand)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-brand-soft)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-card)'; }}
            >
              <Briefcase style={{ width: '16px', height: '16px' }} strokeWidth={2} />
              Portfolio
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '10px 12px',
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid var(--status-success-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-success)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 'var(--text-caption)', color: 'var(--status-success)', fontWeight: 500 }}>
                Disponible para consultoría estratégica en UX/UI, Design Systems y productos digitales.
              </span>
            </div>
          </div>
        </motion.div>

        {/* Three columns: Tools, Process, Impact */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={cardBase}
          >
            <p style={sectionTitle}>
              <Settings style={{ width: '14px', height: '14px' }} strokeWidth={2} />
              Herramientas
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.title}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: 'var(--surface-canvas)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border-default)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon style={{ width: '16px', height: '16px', color: 'var(--color-text-muted)' }} strokeWidth={1.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={itemTitle}>{tool.title}</p>
                      <p style={itemDesc}>{tool.desc}</p>
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-micro)',
                        fontWeight: 500,
                        color: 'var(--color-text-faint)',
                        padding: '3px 8px',
                        backgroundColor: 'var(--surface-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '9999px',
                        flexShrink: 0,
                      }}
                    >
                      {tool.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Processes */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={cardBase}
          >
            <p style={sectionTitle}>
              <GitBranch style={{ width: '14px', height: '14px' }} strokeWidth={2} />
              Procesos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {processes.map((process) => {
                const Icon = process.icon;
                return (
                  <div key={process.title} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <Icon style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} strokeWidth={2} />
                      <p style={itemTitle}>{process.title}</p>
                    </div>
                    <p style={itemDesc}>{process.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Impact */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={cardBase}
          >
            <p style={sectionTitle}>
              <BarChart3 style={{ width: '14px', height: '14px' }} strokeWidth={2} />
              Impacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {impact.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} strokeWidth={2} />
                        <p style={itemTitle}>{item.title}</p>
                      </div>
                      {item.metric && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--text-h2)',
                            fontWeight: 600,
                            color: 'var(--color-brand)',
                            letterSpacing: '-0.04em',
                            lineHeight: 1,
                            flexShrink: 0,
                          }}
                        >
                          {item.metric}
                        </span>
                      )}
                    </div>
                    <p style={itemDesc}>{item.desc}</p>
                    {item.metricLabel && (
                      <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-text-faint)', marginTop: '4px' }}>
                        {item.metricLabel}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
