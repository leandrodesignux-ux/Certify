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
  Quote,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// Navbar
function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(10,14,26,0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(91,34,119,0.2)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#9b6ab5]" />
          <span className="font-display text-xl font-bold text-[#F0F4FF]">CertifyX</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-[#8892A4] hover:text-[#F0F4FF] transition-colors"
          >
            Producto
          </a>
          <a
            href="#pricing"
            className="text-sm text-[#8892A4] hover:text-[#F0F4FF] transition-colors"
          >
            Precios
          </a>
          <a
            href="#demo"
            className="text-sm text-[#8892A4] hover:text-[#F0F4FF] transition-colors"
          >
            Demo
          </a>
        </div>

        {/* CTA */}
        <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
          Ingresar
        </Button>
      </div>
    </motion.nav>
  );
}

// Hero Section
function Hero() {
  const navigate = useNavigate();

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#0d0920' }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: '#0d0920' }}>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(91, 34, 119, 0.2) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(91,34,119,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            color: '#9b6ab5',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          Del papel al panel.
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ marginTop: '24px', fontSize: '20px', color: '#8892A4', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}
        >
          Certifica el talento industrial en tiempo real.
          <br />
          Gestión de competencias sin fricción.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
        >
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#7c4dab',
              color: '#F0F4FF',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Ver Dashboard <ArrowRight style={{ width: '20px', height: '20px' }} />
          </button>
          <button
            style={{
              backgroundColor: 'transparent',
              color: '#F0F4FF',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              border: '1px solid rgba(240,244,255,0.25)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Ver Demo
          </button>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="relative bg-[#1a1040] rounded-lg border border-[rgba(91,34,119,0.3)] shadow-[0_0_40px_rgba(91,34,119,0.2)] p-6">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(91,34,119,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#FF3D57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                <div className="w-3 h-3 rounded-full bg-[#729362]" />
              </div>
              <div className="text-xs text-[#8892A4]">Dashboard CertifyX</div>
            </div>

            {/* Mock Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Trabajadores', value: '20', color: '#9b6ab5' },
                { label: 'Certificaciones Vigentes', value: '45', color: '#729362' },
                { label: 'Próximas a Vencer', value: '12', color: '#FFB800' },
                { label: 'Compliance', value: '78%', color: '#8a9e52' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#231455] rounded p-4">
                  <p className="text-xs text-[#8892A4] mb-1">{stat.label}</p>
                  <p
                    className="font-display text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-[#8892A4]"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Pain Points
function PainPoints() {
  const painPoints = [
    {
      icon: AlertTriangle,
      title: 'Certificaciones vencidas sin avisar',
      desc: 'Multas por trabajadores operando con licencias caducadas.',
      color: '#FF3D57',
    },
    {
      icon: FileX,
      title: 'Excel desactualizados y perdidos',
      desc: 'Versiones dispersas, datos inconsistentes, sin historial.',
      color: '#FFB800',
    },
    {
      icon: ShieldAlert,
      title: 'Multas y paralizaciones',
      desc: 'Fiscalizaciones SENCE que detienen operaciones críticas.',
      color: '#FF3D57',
    },
    {
      icon: EyeOff,
      title: 'Sin visibilidad del equipo',
      desc: 'No sabes quién está capacitado ni qué falta en terreno.',
      color: '#6B7280',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0d0920]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold text-[#F0F4FF] mb-4">
            El caos de certificaciones en terreno
          </h2>
          <p className="text-[#8892A4]">Problemas que resolvió ayer. Hoy, son historia.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {painPoints.map((pain, index) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  backgroundColor: '#1a1040',
                  border: '1px solid rgba(91,34,119,0.2)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <Icon className="w-10 h-10 mb-4" style={{ color: pain.color }} />
                <h3 className="font-display text-xl font-semibold text-[#F0F4FF] mb-2">
                  {pain.title}
                </h3>
                <p className="text-sm text-[#8892A4] leading-relaxed">{pain.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Features
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
    <section className="py-24 bg-[#130b3a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-[#7c4dab] to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 bg-[rgba(91,34,119,0.15)] rounded-sm mb-6">
                    <Icon className="w-8 h-8 text-[#9b6ab5]" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#F0F4FF] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#8892A4]">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Stats
function Stats() {
  const stats = [
    { value: '500+', label: 'Empresas' },
    { value: '40.000+', label: 'Trabajadores' },
    { value: '98%', label: 'menos papel' },
  ];

  return (
    <section className="py-20 bg-[#130b3a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontFamily: '"Barlow Condensed", sans-serif', fontSize: '56px', fontWeight: 700, color: '#9b6ab5' }}>{stat.value}</p>
              <p style={{ marginTop: '8px', color: '#8892A4' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials
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
    <section className="py-24 bg-[#0d0920]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-4xl font-bold text-[#F0F4FF] text-center mb-16"
        >
          Lo que dicen nuestros clientes
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={{
                backgroundColor: '#231455',
                border: '1px solid rgba(91,34,119,0.18)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <Quote style={{ width: '32px', height: '32px', color: '#9b6ab5', marginBottom: '16px' }} />
              <p style={{ color: '#F0F4FF', lineHeight: 1.6, marginBottom: '24px' }}>"{testimonial.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '9999px', backgroundColor: '#1a1040', border: '1px solid rgba(91,34,119,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 700, color: '#c49fe0' }}>
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p style={{ fontWeight: 500, color: '#F0F4FF' }}>{testimonial.name}</p>
                  <p style={{ fontSize: '14px', color: '#8892A4' }}>
                    {testimonial.role}, {testimonial.company}
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

// CTA Final
function CTA() {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #130b3a 0%, #0d0920 100%)',
      }}
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(91,34,119,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-[#F0F4FF] mb-6">
            Deja el papel atrás.
          </h2>
          <p className="text-xl text-[#8892A4] mb-10">
            Únete a las empresas que ya certifican en tiempo real.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
            Empezar Ahora →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-8 bg-[#0d0920] border-t border-[rgba(91,34,119,0.15)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#9b6ab5]" />
          <span className="font-display text-lg font-bold text-[#F0F4FF]">CertifyX</span>
        </div>
        <p className="text-sm text-[#5c5480]">
          © 2025 CertifyX. Plataforma de gestión de competencias industriales.
        </p>
      </div>
    </footer>
  );
}

// Main Landing Page
export function Landing() {
  return (
    <div className="bg-[#0d0920] min-h-screen">
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
