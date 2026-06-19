import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ChevronDown,
  AlertTriangle,
  FileX,
  ShieldAlert,
  EyeOff,
  Bell,
  BarChart3,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : '#ffffff',
        borderBottom: '1px solid #ebebeb',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        transition: 'background-color 0.2s, backdrop-filter 0.2s',
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo — single prismatic accent on the mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0070f3 0%, #7928ca 50%, #ff4ecd 100%)',
            }}
          >
            <Zap style={{ width: '14px', height: '14px', color: '#ffffff' }} strokeWidth={2.5} />
          </span>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--color-brand)',
            }}
          >
            CertifyX
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Producto', 'Precios', 'Demo'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{ fontSize: '14px', color: '#4d4d4d', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-brand)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)'; }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            height: '36px',
            padding: '0 16px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-body)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'; }}
        >
          Ingresar
        </button>
      </div>
    </motion.nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: '#fafafa',
        overflow: 'hidden',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      {/* Engineering grid — subtle dots */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #d4d4d4 1px, transparent 0)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Label pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '28px' }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              backgroundColor: '#ffffff',
              border: '1px solid #ebebeb',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#4d4d4d',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#297a3a',
                flexShrink: 0,
              }}
            />
            Gestión de certificaciones industriales
          </span>
        </motion.div>

        {/* Headline — Geist style */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 500,
            color: 'var(--color-brand)',
            lineHeight: 1.1,
            letterSpacing: '-0.06em',
            marginBottom: '24px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Del papel al panel,<br />sin fricción.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)',
            maxWidth: '560px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}
        >
          Certifica el talento industrial en tiempo real. Alertas automáticas,
          dashboard vivo y mallas curriculares en un solo lugar.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}
        >
          {/* Filled */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              height: '44px',
              padding: '0 24px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: '1px solid var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary)'; }}
          >
            Ver Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} strokeWidth={2} />
          </button>
          {/* Outlined */}
          <button
            style={{
              height: '44px',
              padding: '0 24px',
              backgroundColor: 'var(--surface-card)',
              color: 'var(--color-text)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'border-color 0.15s, background-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-soft)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-card)';
            }}
          >
            Ver Demo
          </button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          style={{ marginTop: '64px', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ebebeb',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Titlebar */}
            <div
              style={{
                backgroundColor: '#fafafa',
                borderBottom: '1px solid #ebebeb',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ebebeb' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ebebeb' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ebebeb' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#a8a8a8' }}>Dashboard CertifyX</span>
              <div style={{ width: '52px' }} />
            </div>
            {/* Mock stats */}
            <div
              style={{
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
              }}
            >
              {[
                { label: 'Trabajadores', value: '20', color: 'var(--color-brand)' },
                { label: 'Vigentes', value: '45', color: '#297a3a' },
                { label: 'Por vencer', value: '12', color: '#b25000' },
                { label: 'Compliance', value: '78%', color: 'var(--color-brand)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #ebebeb',
                    borderRadius: '6px',
                    padding: '16px',
                  }}
                >
                  <p style={{ fontSize: '11px', color: '#a8a8a8', marginBottom: '8px', fontWeight: 500 }}>
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: '28px',
                      fontWeight: 600,
                      color: stat.color,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            style={{ color: '#a8a8a8' }}
          >
            <ChevronDown style={{ width: '20px', height: '20px' }} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pain Points ────────────────────────────────────────────────────────────────
function PainPoints() {
  const painPoints = [
    {
      icon: AlertTriangle,
      title: 'Certificaciones vencidas sin avisar',
      desc: 'Multas por trabajadores operando con licencias caducadas.',
      iconColor: '#e5484d',
      iconBg: 'rgba(229,72,77,0.08)',
    },
    {
      icon: FileX,
      title: 'Excel desactualizados y perdidos',
      desc: 'Versiones dispersas, datos inconsistentes, sin historial.',
      iconColor: '#b25000',
      iconBg: 'rgba(178,80,0,0.08)',
    },
    {
      icon: ShieldAlert,
      title: 'Multas y paralizaciones',
      desc: 'Fiscalizaciones SENCE que detienen operaciones críticas.',
      iconColor: '#e5484d',
      iconBg: 'rgba(229,72,77,0.08)',
    },
    {
      icon: EyeOff,
      title: 'Sin visibilidad del equipo',
      desc: 'No sabes quién está capacitado ni qué falta en terreno.',
      iconColor: '#4d4d4d',
      iconBg: '#f5f5f5',
    },
  ];

  return (
    <section id="features" style={{ padding: '96px 0', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
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
            El caos de certificaciones en terreno
          </h2>
          <p style={{ fontSize: '15px', color: '#666666' }}>
            Problemas que resolviste ayer. Hoy, son historia.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {painPoints.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebebeb',
                  borderRadius: '6px',
                  padding: '24px',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    backgroundColor: pain.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px', color: pain.iconColor }} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-brand)',
                    marginBottom: '8px',
                  }}
                >
                  {pain.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666666', lineHeight: 1.6 }}>{pain.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Features (3-column Vercel card grid) ──────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Bell,
      title: 'Alertas automáticas',
      desc: 'Notificaciones inteligentes antes de vencimientos. Sin sorpresas.',
    },
    {
      icon: BarChart3,
      title: 'Dashboard en tiempo real',
      desc: 'Visión 360° del compliance de tu equipo, donde estés.',
    },
    {
      icon: BookOpen,
      title: 'Mallas curriculares',
      desc: 'Rutas de aprendizaje estructuradas para cada cargo.',
    },
  ];

  return (
    <section style={{ padding: '96px 0', backgroundColor: '#fafafa', borderTop: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
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
            Todo lo que necesitas
          </h2>
          <p style={{ fontSize: '15px', color: '#666666' }}>
            Construido para equipos industriales que no tienen margen de error.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ebebeb',
                  borderRadius: '6px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon style={{ width: '20px', height: '20px', color: '#4d4d4d' }} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-brand)',
                    marginBottom: '8px',
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666666', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ──────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: '500+', label: 'Empresas activas' },
    { value: '40.000+', label: 'Trabajadores gestionados' },
    { value: '98%', label: 'menos papel' },
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1px',
            backgroundColor: '#ebebeb',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid #ebebeb',
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              style={{
                backgroundColor: '#ffffff',
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(40px, 5vw, 56px)',
                  fontWeight: 500,
                  color: 'var(--color-brand)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: '14px', color: '#666666' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Gerente RRHH',
      company: 'Minera del Norte S.A.',
      quote: 'Redujimos un 70% el tiempo de gestión de certificaciones. Las alertas automáticas nos salvaron de paralizaciones.',
      initials: 'CM',
    },
    {
      name: 'Andrea Vásquez',
      role: 'Jefa Prevención',
      company: 'Constructora Atlas',
      quote: 'Antes teníamos 12 Excels diferentes. Ahora todo en un dashboard que cualquier supervisor entiende.',
      initials: 'AV',
    },
  ];

  return (
    <section style={{ padding: '96px 0', backgroundColor: '#fafafa', borderTop: '1px solid #ebebeb' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 500,
              color: 'var(--color-brand)',
              letterSpacing: '-0.04em',
            }}
          >
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #ebebeb',
                borderRadius: '6px',
                padding: '24px',
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--color-text)',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                "{testimonial.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ebebeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#4d4d4d' }}>
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-brand)' }}>
                    {testimonial.name}
                  </p>
                  <p style={{ fontSize: '13px', color: '#666666' }}>
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Final ──────────────────────────────────────────────────────────────────
function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      style={{
        padding: '96px 0',
        backgroundColor: 'var(--color-brand)',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              color: '#ffffff',
              letterSpacing: '-0.05em',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Deja el papel atrás.
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '40px',
              lineHeight: 1.6,
            }}
          >
            Únete a las empresas que ya certifican en tiempo real.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              height: '48px',
              padding: '0 28px',
              backgroundColor: '#ffffff',
              color: 'var(--color-brand)',
              border: '1px solid #ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
            }}
          >
            Empezar ahora <ArrowRight style={{ width: '16px', height: '16px' }} strokeWidth={2} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: '28px 24px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #ebebeb',
      }}
    >
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '5px',
              background: 'linear-gradient(135deg, #0070f3 0%, #7928ca 50%, #ff4ecd 100%)',
            }}
          >
            <Zap style={{ width: '12px', height: '12px', color: '#ffffff' }} strokeWidth={2.5} />
          </span>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-brand)' }}>
            CertifyX
          </span>
        </div>
        <p style={{ fontSize: '13px', color: '#a8a8a8' }}>
          © 2025 CertifyX. Plataforma de gestión de competencias industriales.
        </p>
      </div>
    </footer>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────────
export function Landing() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <PainPoints />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;
