import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Compass, Map, Calendar, FileText, MessageCircle, Briefcase, Users, Plane, ListChecks, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { Page } from '../App';
import { LOGOS, urlLogo } from '../data/logos';

const ARCHIVOS = Object.keys(LOGOS);
const FILAS = [ARCHIVOS.slice(0, ARCHIVOS.length / 2), ARCHIVOS.slice(ARCHIVOS.length / 2)];

// Cada logo va en una ficha blanca (también en oscuro, con tema-claro): así se ven los logos negros
function Cinta({ logos, alReves }: { logos: string[]; alReves?: boolean }) {
  return (
    <div className="cinta overflow-hidden py-1">
      <div className={`cinta-pista ${alReves ? 'al-reves' : ''}`}>
        {[...logos, ...logos].map((a, i) => (
          <div key={i} title={LOGOS[a]} className="tema-claro shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-slate-200 shadow-sm p-2.5 flex items-center justify-center">
            <img src={urlLogo(a)} alt="" loading="lazy" className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface HomeProps {
  onNavigate: (page: Page) => void;
}

// Un cuadro por cada sección del menú (pedido del usuario), ordenados por cuánto se usan.
// El color va suave en el ícono; el acento fuerte queda para las acciones.
const HERRAMIENTAS: { pagina: Page; titulo: string; texto: string; Icono: typeof Map; tono: string }[] = [
  { pagina: 'horarios', titulo: 'Planificación de Horarios', texto: 'Arma tu horario del semestre y mira los cruces', Icono: Calendar, tono: 'bg-blue-50 text-blue-600' },
  { pagina: 'roadmap', titulo: 'Ruta de Cursos', texto: 'Todos los cursos por semestre y qué necesitas antes', Icono: Map, tono: 'bg-violet-50 text-violet-600' },
  { pagina: 'tramites', titulo: 'Trámites con FUT', texto: 'Cuenta tu caso y la IA redacta tu FUT', Icono: FileText, tono: 'bg-teal-50 text-teal-700' },
  { pagina: 'practicas', titulo: 'Prácticas Preprofesionales', texto: 'Suma tus créditos y sigue la ruta paso a paso', Icono: Briefcase, tono: 'bg-amber-50 text-amber-700' },
  { pagina: 'proyeccion', titulo: 'Proyección Social', texto: 'Requisitos, fechas y ruta del proyecto con la comunidad', Icono: Users, tono: 'bg-red-50 text-red-600' },
  { pagina: 'movilidad', titulo: 'Movilidad Estudiantil', texto: 'Estudia un ciclo en otra universidad: requisitos y pasos', Icono: Plane, tono: 'bg-indigo-50 text-indigo-600' },
  { pagina: 'chat', titulo: 'Asistente IA', texto: 'Pregunta por cursos, prerrequisitos y trámites', Icono: MessageCircle, tono: 'bg-sky-50 text-sky-700' },
  { pagina: 'tracks', titulo: 'Elector de Área', texto: 'Compara las 3 áreas electivas de la carrera', Icono: Compass, tono: 'bg-emerald-50 text-emerald-700' },
  { pagina: 'quiz', titulo: 'Quiz de Área', texto: 'Responde unas preguntas y descubre tu área ideal', Icono: ListChecks, tono: 'bg-orange-50 text-orange-600' },
];

const NUMEROS = [
  ['10', 'Semestres'],
  ['46', 'Cursos Totales'],
  ['3', 'Áreas Electivas'],
  ['154', 'Créditos para prácticas'],
];

// Cuenta de 0 al número cuando la cifra aparece en pantalla (una sola vez)
function Contador({ hasta }: { hasta: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setValor(hasta);
    let cuadro = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const p = Math.min((ahora - inicio) / 1200, 1);
        setValor(Math.round(hasta * (1 - (1 - p) ** 3))); // frena al final
        if (p < 1) cuadro = requestAnimationFrame(paso);
      };
      cuadro = requestAnimationFrame(paso);
    });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(cuadro); };
  }, [hasta]);
  return <span ref={ref} className="tabular-nums">{valor}</span>;
}

const TITULO = 'Tu carrera en Sistemas, paso a paso';

export function Home({ onNavigate }: HomeProps) {
  return (
    <div>
      {/* Portada: titular corto y, enseguida, las herramientas (en el celular deben verse sin bajar) */}
      <section className="relative pt-10 md:pt-16 pb-8 md:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Nubes de color de fondo, solo en pantallas grandes */}
        <div className="hidden md:block absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="flotar absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
          <div className="flotar absolute bottom-0 right-1/4 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-70" style={{ animationDelay: '-9s' }}></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Cada palabra sube por separado, una tras otra */}
          <h1 aria-label={TITULO} className="text-[clamp(2.2rem,3.5vw+1rem,4rem)] leading-[1.05] font-bold text-slate-900 mb-5">
            {TITULO.split(' ').map((palabra, i) => (
              <span key={i} aria-hidden="true" className="cascada inline-block mr-[0.25em]" style={{ '--i': i } as CSSProperties}>
                {palabra}
              </span>
            ))}
          </h1>
          <p className="cascada text-base md:text-lg text-slate-600 max-w-[60ch] mx-auto" style={{ '--i': 6 } as CSSProperties}>
            Mira qué cursos te tocan, arma tu horario sin cruces y saca tu FUT en minutos.
          </p>
        </div>

        {/* Tecnologías de la carrera: dos filas en sentidos opuestos (una sola en el celular) */}
        <div role="img" aria-label="Tecnologías que verás en la carrera" className="cascada relative z-10 max-w-6xl mx-auto mt-8 space-y-3" style={{ '--i': 7 } as CSSProperties}>
          <Cinta logos={FILAS[0]} />
          <div className="hidden md:block"><Cinta logos={FILAS[1]} alReves /></div>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        {/* En el celular cada herramienta es una fila; desde md, una tarjeta */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {HERRAMIENTAS.map(({ pagina, titulo, texto, Icono, tono }, i) => (
            <button
              key={titulo}
              onClick={() => onNavigate(pagina)}
              style={{ '--i': i + 4 } as CSSProperties}
              className="cascada group relative flex md:block items-center gap-4 text-left bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-3 md:p-6 min-h-16 hover:border-[#4A6DFF]/40 hover:shadow-xl hover:shadow-[#4A6DFF]/10 md:hover:-translate-y-1 active:scale-[0.98] transition-all duration-300"
            >
              <ArrowUpRight className="hidden md:block absolute top-6 right-6 text-slate-300 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-[#4A6DFF] transition-all duration-300" size={20} />
              <div className={`w-11 h-11 md:w-14 md:h-14 md:mb-4 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300 ${tono}`}>
                <Icono size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-xl text-slate-900 md:mb-2 font-semibold">{titulo}</h3>
                <p className="hidden md:block text-slate-600 text-sm">{texto}</p>
              </div>
              <ChevronRight className="md:hidden text-slate-400 shrink-0" size={20} />
            </button>
          ))}
        </div>
      </section>

      <section className="revelar py-14 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">Tu Carrera en Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {NUMEROS.map(([n, texto]) => (
              <div key={texto} className="text-center">
                <div className="font-display text-4xl md:text-6xl font-extrabold mb-1 bg-gradient-to-br from-[#4A6DFF] to-[#7A5BFF] bg-clip-text text-transparent">
                  <Contador hasta={Number(n)} />
                </div>
                <div className="text-slate-600 text-sm md:text-base">{texto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
