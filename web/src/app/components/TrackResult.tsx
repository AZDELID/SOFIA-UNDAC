import { Server, Code, Globe, RotateCcw, Home, BookOpen, TrendingUp, Check, Library, Wrench, Lightbulb } from 'lucide-react';

type Page = 'home' | 'roadmap' | 'tracks' | 'quiz' | 'result' | 'resources';

interface TrackResultProps {
  result: {
    track: string;
    scores: {
      redes: number;
      software: number;
      web: number;
    };
  };
  onNavigate: (page: Page) => void;
}

const trackData: Record<string, {
  name: string;
  icon: any;
  color: string;
  gradient: string;
  summary: string;
  whyThisTrack: string[];
  courses: string[];
  projects: string[];
  tools: string[];
  careerPath: { level: string; role: string; years: string }[];
}> = {
  redes: {
    name: 'RAMA 1: Redes, Servidores y Cloud Computing',
    icon: Server,
    color: '#4A6DFF',
    gradient: 'from-[#4A6DFF] to-[#6B8FFF]',
    summary: 'Tu perfil indica una fuerte inclinación hacia la infraestructura tecnológica. Te destacas en el pensamiento lógico y la resolución de problemas técnicos complejos.',
    whyThisTrack: [
      'Disfrutas trabajar con hardware, configuraciones y sistemas',
      'Te interesa cómo funciona la tecnología "por dentro"',
      'Valoras la estabilidad, seguridad y rendimiento de sistemas'
    ],
    courses: [
      'Comunicaciones y Enrutamiento de Redes',
      'Administración de Servidores',
      'Virtualización y Servicios en Cloud',
      'Seguridad de Redes',
      'Arquitectura Cloud'
    ],
    projects: [
      'Configuración de red empresarial con VLANs',
      'Despliegue de servicios en AWS/Azure',
      'Sistema de monitoreo de infraestructura',
      'Implementación de seguridad perimetral'
    ],
    tools: ['Linux', 'Cisco', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Ansible', 'Terraform'],
    careerPath: [
      { level: 'Junior', role: 'Network Administrator', years: '0-2 años' },
      { level: 'Mid', role: 'Cloud Engineer', years: '2-5 años' },
      { level: 'Senior', role: 'DevOps Engineer / SRE', years: '5-8 años' },
      { level: 'Specialist', role: 'Infrastructure Architect', years: '8+ años' }
    ]
  },
  software: {
    name: 'Desarrollo de Software',
    icon: Code,
    color: '#FF6B6B',
    gradient: 'from-[#FF6B6B] to-[#FF8E8E]',
    summary: 'Tu perfil muestra una fuerte orientación hacia el desarrollo de software y arquitectura de sistemas. Sobresales en resolver problemas complejos con código.',
    whyThisTrack: [
      'Te apasiona la lógica de programación y los algoritmos',
      'Disfrutas diseñar arquitecturas de software robustas',
      'Te motiva crear soluciones técnicas a problemas complejos'
    ],
    courses: [
      'Metodologías Ágiles de Desarrollo de Software',
      'Desarrollo de Soluciones I',
      'Desarrollo de Soluciones II',
      'Tópicos de Ingeniería de Sistemas',
      'Arquitectura de Microservicios'
    ],
    projects: [
      'API REST completa para sistema de e-commerce',
      'Arquitectura de microservicios con Docker',
      'Sistema de procesamiento de transacciones',
      'Framework de automatización de testing'
    ],
    tools: ['Java', 'Python', 'Node.js', 'Spring Boot', 'Docker', 'Git', 'Jenkins', 'Postman'],
    careerPath: [
      { level: 'Junior', role: 'Software Developer', years: '0-2 años' },
      { level: 'Mid', role: 'Backend Engineer', years: '2-5 años' },
      { level: 'Senior', role: 'Software Architect', years: '5-8 años' },
      { level: 'Specialist', role: 'Principal Engineer / Tech Lead', years: '8+ años' }
    ]
  },
  web: {
    name: 'RAMA 3: Desarrollo Web Full Stack',
    icon: Globe,
    color: '#0d9488',
    gradient: 'from-[#14b8a6] to-[#2dd4bf]',
    summary: 'Tu perfil revela una gran inclinación hacia la creación de experiencias digitales. Combinas habilidades técnicas con sensibilidad para el diseño y la usabilidad.',
    whyThisTrack: [
      'Te encanta ver resultados visuales de tu trabajo',
      'Valoras la experiencia del usuario y el diseño intuitivo',
      'Disfrutas trabajando con tecnologías frontend modernas'
    ],
    courses: [
      'Desarrollo Web en Entorno Cliente',
      'Desarrollo Web en Entorno Servidor',
      'Despliegue de Aplicaciones Web',
      'UX/UI Design Principles',
      'Progressive Web Applications'
    ],
    projects: [
      'Plataforma web completa y responsive con React',
      'Sistema de diseño con componentes reutilizables',
      'Aplicación web progresiva (PWA) con funcionalidad offline',
      'Dashboard interactivo con visualización de datos'
    ],
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 'MongoDB', 'Figma', 'Git'],
    careerPath: [
      { level: 'Junior', role: 'Frontend Developer', years: '0-2 años' },
      { level: 'Mid', role: 'Full Stack Developer', years: '2-5 años' },
      { level: 'Senior', role: 'Lead Frontend Engineer', years: '5-8 años' },
      { level: 'Specialist', role: 'Tech Lead / Engineering Manager', years: '8+ años' }
    ]
  }
};

export function TrackResult({ result, onNavigate }: TrackResultProps) {
  const track = trackData[result.track];
  const Icon = track.icon;

  const totalScore = result.scores.redes + result.scores.software + result.scores.web;
  const percentages = {
    redes: Math.round((result.scores.redes / totalScore) * 100),
    software: Math.round((result.scores.software / totalScore) * 100),
    web: Math.round((result.scores.web / totalScore) * 100)
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Result Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl text-slate-900 mb-4">
            ¡Resultados Obtenidos!
          </h1>
          <p className="text-xl text-slate-600">
            Hemos analizado tus respuestas y esta es nuestra recomendación
          </p>
        </div>

        {/* Main Result Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 mb-8">
          <div className="text-center mb-8">
            <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${track.gradient} rounded-2xl items-center justify-center mb-4`}>
              <Icon className="text-white" size={40} />
            </div>
            <h2 className="text-3xl md:text-4xl text-slate-900 mb-2">
              Tu área recomendada es:
            </h2>
            <h3 className={`text-4xl md:text-5xl bg-gradient-to-r ${track.gradient} bg-clip-text text-transparent mb-4`}>
              {track.name}
            </h3>
            <p className="text-slate-700 text-lg max-w-2xl mx-auto">
              {track.summary}
            </p>
          </div>

          {/* Score Visualization */}
          <div className="mb-8">
            <h4 className="text-slate-900 text-xl mb-4 text-center">Distribución de tu Perfil</h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server size={20} className="text-blue-600" />
                    <span className="text-slate-900">Redes & Cloud</span>
                  </div>
                  <span className="text-slate-600">{percentages.redes}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4A6DFF] to-[#6B8FFF] transition-all duration-1000"
                    style={{ width: `${percentages.redes}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-[#FF6B6B]" />
                    <span className="text-slate-900">Software</span>
                  </div>
                  <span className="text-slate-600">{percentages.software}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] transition-all duration-1000"
                    style={{ width: `${percentages.software}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={20} className="text-teal-700" />
                    <span className="text-slate-900">Desarrollo Web</span>
                  </div>
                  <span className="text-slate-600">{percentages.web}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] transition-all duration-1000"
                    style={{ width: `${percentages.web}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Why This Track */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
            <h4 className="text-slate-900 text-xl mb-4">¿Por qué {track.name}?</h4>
            <ul className="space-y-3">
              {track.whyThisTrack.map((reason, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-[#4A6DFF] to-[#7A5BFF] rounded-full flex items-center justify-center text-white text-sm">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('tracks')}
              className={`flex-1 py-4 bg-gradient-to-r ${track.gradient} text-slate-900 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2`}
            >
              <BookOpen size={20} />
              Explorar {track.name}
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="flex-1 py-4 bg-slate-100 border border-slate-300 text-slate-900 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              Repetir Quiz
            </button>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Courses */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h4 className="text-slate-900 text-xl mb-4 flex items-center gap-2">
              <Library size={22} className="text-[#4A6DFF]" /> Cursos Relacionados
            </h4>
            <ul className="space-y-2">
              {track.courses.map((course, index) => (
                <li key={index} className="text-slate-600 flex items-start gap-2">
                  <span className="text-teal-700 mt-1">▸</span>
                  {course}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h4 className="text-slate-900 text-xl mb-4 flex items-center gap-2">
              <Wrench size={22} className="text-[#7A5BFF]" /> Herramientas a Dominar
            </h4>
            <div className="flex flex-wrap gap-2">
              {track.tools.map((tool, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h4 className="text-slate-900 text-xl mb-4 flex items-center gap-2">
            <Lightbulb size={22} className="text-amber-500" /> Ejemplos de Proyectos Reales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {track.projects.map((project, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:bg-slate-100 transition-all">
                <p className="text-slate-700">{project}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Career Path */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          <h4 className="text-slate-900 text-xl mb-6 flex items-center gap-2">
            <TrendingUp size={24} />
            Ruta de Carrera Profesional
          </h4>
          <div className="space-y-4">
            {track.careerPath.map((stage, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${track.gradient} rounded-xl flex items-center justify-center text-slate-900`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="text-slate-900 text-lg">{stage.role}</h5>
                    <span className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-500 text-xs">
                      {stage.level}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm">{stage.years}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 border border-slate-300 text-slate-900 rounded-xl hover:bg-slate-200 transition-all"
          >
            <Home size={20} />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}