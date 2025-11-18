import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Zap, Shield, Code, CheckCircle, ArrowRight, Github, Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Landing = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()

  const features = [
    {
      icon: Zap,
      title: 'Despliegue instantáneo',
      description: 'Crea instancias de bases de datos en segundos, sin configuración manual.'
    },
    {
      icon: Shield,
      title: 'Seguro y confiable',
      description: 'Credenciales cifradas, rotación de contraseñas y backups automáticos.'
    },
    {
      icon: Code,
      title: 'Múltiples motores',
      description: 'MySQL, PostgreSQL, MongoDB, Redis, SQL Server y Cassandra.'
    },
    {
      icon: Database,
      title: 'Escalable',
      description: 'Desde proyectos personales hasta aplicaciones empresariales.'
    }
  ]

  const plans = [
    {
      name: 'Free',
      price: '$0',
      instances: '2 instancias',
      features: ['Nombre automático', 'Soporte básico', 'Acceso a todos los motores']
    },
    {
      name: 'Standard',
      price: '$29',
      instances: '5 instancias',
      features: ['Nombre personalizado', 'Soporte prioritario', 'Rotación de contraseñas'],
      popular: true
    },
    {
      name: 'Premium',
      price: '$79',
      instances: '10 instancias',
      features: ['Todo de Standard', 'Soporte 24/7', 'Backups automáticos', 'Métricas avanzadas']
    }
  ]

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border dark:border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="text-primary" size={24} md:size={28} />
            <span className="text-lg md:text-xl font-semibold text-text dark:text-white">CrudCloud</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors">
              Pricing
            </a>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {darkMode ? (
                <Sun size={20} className="text-slate-600 dark:text-slate-300" />
              ) : (
                <Moon size={20} className="text-slate-600 dark:text-slate-300" />
              )}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Comenzar gratis
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-600 dark:text-slate-300" />
            ) : (
              <Menu size={24} className="text-slate-600 dark:text-slate-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-border dark:border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
              >
                Pricing
              </a>
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 py-2 text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
              >
                {darkMode ? (
                  <>
                    <Sun size={20} />
                    <span>Modo claro</span>
                  </>
                ) : (
                  <>
                    <Moon size={20} />
                    <span>Modo oscuro</span>
                  </>
                )}
              </button>
              <div className="border-t border-border dark:border-slate-700 pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/login')
                  }}
                  className="w-full py-2 text-left text-slate-600 dark:text-slate-300 hover:text-text dark:hover:text-white transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/login')
                  }}
                  className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-center mt-2"
                >
                  Comenzar gratis
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary/10 text-primary rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
            <Zap size={14} md:size={16} />
            <span>Bases de datos en la nube en segundos</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text dark:text-white mb-4 md:mb-6 leading-tight px-4">
            Gestiona tus bases de datos
            <br />
            <span className="text-primary">sin complicaciones</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Crea, administra y escala instancias de bases de datos en contenedores Docker.
            MySQL, PostgreSQL, MongoDB, Redis y más.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-base md:text-lg"
            >
              <span>Comenzar ahora</span>
              <ArrowRight size={18} md:size={20} />
            </button>
            <button
              onClick={() => window.open('https://docs.macchiato.crudzaso.com/', '_blank', 'noopener,noreferrer')}
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border-2 border-border dark:border-slate-700 text-text dark:text-white rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-base md:text-lg"
            >
              Ver documentación
            </button>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-border dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-border dark:border-slate-700 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="ml-4 text-sm text-slate-600 dark:text-slate-400">dashboard.crudzaso.com</span>
              </div>
              <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[400px] flex items-center justify-center">
                <div className="text-slate-400 dark:text-slate-600">
                  <Database size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Provisión automatizada de bases de datos con control total y seguridad empresarial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-border dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-text dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Database Engines */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white mb-4">
              Motores soportados
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Los motores de bases de datos más populares, listos para usar
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'MySQL', icon: '🐬' },
              { name: 'PostgreSQL', icon: '🐘' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'Redis', icon: '⚡' },
              { name: 'SQL Server', icon: '💼' },
              { name: 'Cassandra', icon: '🌌' }
            ].map((db, index) => (
              <div
                key={index}
                className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-700 flex flex-col items-center justify-center gap-3 hover:border-primary dark:hover:border-primary transition-all"
              >
                <span className="text-4xl">{db.icon}</span>
                <span className="font-medium text-text dark:text-white">{db.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white mb-4">
              Planes flexibles
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Desde proyectos personales hasta aplicaciones empresariales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-8 rounded-xl border-2 ${
                  plan.popular
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-border dark:border-slate-700 bg-background dark:bg-slate-950'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Más popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-text dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold text-text dark:text-white">{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-400">/mes</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{plan.instances}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CheckCircle size={18} className="text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border-2 border-border dark:border-slate-700 text-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Comenzar
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Crea tu primera base de datos en menos de un minuto
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white text-primary rounded-lg font-medium hover:bg-slate-100 transition-colors text-lg"
            >
              Comenzar gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-slate-700 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="text-primary" size={24} />
                <span className="text-lg font-semibold text-text dark:text-white">CrudCloud</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Bases de datos en la nube, simples y poderosas
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-3">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li>
                  <a
                    href="https://docs.macchiato.crudzaso.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Documentación
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-3">Compañía</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text dark:text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border dark:border-slate-700 pt-8 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 CrudCloud. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
