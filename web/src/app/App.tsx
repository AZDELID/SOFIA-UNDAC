import { useState, type MouseEvent } from "react";
import { Home } from "./components/Home";
import { Roadmap } from "./components/Roadmap";
import { TracksComparison } from "./components/TracksComparison";
import { Quiz } from "./components/Quiz";
import { TrackResult } from "./components/TrackResult";
import { Horarios } from "./components/Horarios";
import { Practicas } from "./components/Practicas";
import { ProyeccionSocial } from "./components/ProyeccionSocial";
import Wizard from "./fut/Wizard";
import { Chat } from "./components/Chat";
import { FondoBinario } from "./components/FondoBinario";
import { Menu, X, ArrowLeft, MessageCircle, Sun, Moon } from "lucide-react";
import sistemasLogo from "figma:asset/32bb1d1a320e6006b4dc077789a136a1fa29f1f3.png";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

export type Page =
  | "home" | "roadmap" | "tracks" | "quiz" | "result"
  | "horarios" | "practicas" | "proyeccion" | "tramites" | "chat";

// Un solo menú para escritorio y celular
const MENU: { page: Page; label: string }[] = [
  { page: "home", label: "Inicio" },
  { page: "roadmap", label: "Ruta de Cursos" },
  { page: "tracks", label: "Elector de Área" },
  { page: "horarios", label: "Horarios" },
  { page: "practicas", label: "Prácticas" },
  { page: "proyeccion", label: "Proyección Social" },
  { page: "tramites", label: "Trámites FUT" },
  { page: "chat", label: "Asistente IA" },
];

type QuizResult = { track: string; scores: { redes: number; software: number; web: number } };

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Dato con el que se abre la página de destino: el trámite del FUT (desde la ruta de prácticas)
  // o el curso que se agrega al horario (desde el mapa)
  const [parametro, setParametro] = useState<string | null>(null);

  // El tema arranca como lo dejó index.html (guardado o el del sistema operativo)
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains("dark"));

  // El color nuevo se expande en círculo desde el botón (View Transitions);
  // en navegadores sin esa función cambia de golpe
  const cambiarTema = (e: MouseEvent) => {
    const nuevo = !oscuro;
    const aplicar = () => {
      document.documentElement.classList.toggle("dark", nuevo);
      setOscuro(nuevo);
      try { localStorage.setItem("tema", nuevo ? "oscuro" : "claro"); } catch { /* modo privado: no se guarda */ }
    };
    const raiz = document.documentElement.style;
    raiz.setProperty("--tx", `${e.clientX}px`);
    raiz.setProperty("--ty", `${e.clientY}px`);
    if (!document.startViewTransition) return aplicar();
    document.startViewTransition(aplicar);
  };

  const botonTema = (
    <button
      onClick={cambiarTema}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
      aria-label={oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={oscuro ? "Tema claro" : "Tema oscuro"}
    >
      {/* El ícono que sale gira y se encoge; el que entra hace lo contrario */}
      <Sun size={20} className={`absolute transition-all duration-500 ${oscuro ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`} />
      <Moon size={20} className={`absolute transition-all duration-500 ${oscuro ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
    </button>
  );

  const navigateTo = (page: Page, dato: string | null = null) => {
    setParametro(dato);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // La página actual se marca con una "píldora" azul; el resto se aclara al pasar el mouse
  const enlace = (clase: string) => (item: (typeof MENU)[number]) => (
    <button
      key={item.page}
      onClick={() => navigateTo(item.page)}
      aria-current={currentPage === item.page ? "page" : undefined}
      className={`${clase} rounded-lg px-3 py-1.5 transition-colors duration-200 ${
        currentPage === item.page ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      }`}
    >
      {item.label}
    </button>
  );

  return (
    <div className="min-h-screen text-slate-900 print:bg-white">
      <FondoBinario />
      <nav className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="flex items-center gap-3" onClick={() => navigateTo("home")}>
              <ImageWithFallback src={sistemasLogo} alt="Logo Ingeniería de Sistemas" className="w-10 h-10 rounded-xl object-contain" />
              <span className="text-slate-900 text-lg font-semibold tracking-wide">
                SOFIA
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {MENU.slice(1).map(enlace("text-sm"))}
              <span className="ml-1">{botonTema}</span>
              <button
                onClick={() => navigateTo("quiz")}
                className="brillo relative ml-2 px-4 py-2 text-sm bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white rounded-xl shadow-md shadow-[#4A6DFF]/20 hover:shadow-lg hover:shadow-[#4A6DFF]/30 hover:-translate-y-px transition-all duration-200"
              >
                Hacer Quiz
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-1">
            {botonTema}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100" aria-label="Menú">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 space-y-1 animate-entrada">
              {MENU.map(enlace("block w-full text-left"))}
            </div>
          )}
        </div>
      </nav>

      <main className="pt-16 pb-24 print:pt-0 print:pb-0">
        {/* key: al cambiar de página React vuelve a montar este bloque y se repite la animación de entrada */}
        <div key={currentPage} className="animate-entrada">
          {currentPage !== "home" && currentPage !== "tramites" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <button onClick={() => navigateTo("home")} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          )}

          {currentPage === "home" && <Home onNavigate={navigateTo} />}
          {currentPage === "roadmap" && <Roadmap onHorario={(codigo) => navigateTo("horarios", codigo)} onActividad={navigateTo} />}
          {currentPage === "tracks" && <TracksComparison onNavigate={navigateTo} />}
          {currentPage === "quiz" && <Quiz onComplete={(r: QuizResult) => { setQuizResult(r); navigateTo("result"); }} />}
          {currentPage === "result" && quizResult && <TrackResult result={quizResult} onNavigate={navigateTo} />}
          {currentPage === "horarios" && <Horarios key={parametro ?? ""} cursoInicial={parametro} />}
          {currentPage === "practicas" && <Practicas onFut={(clave) => navigateTo("tramites", clave)} />}
          {currentPage === "proyeccion" && <ProyeccionSocial />}
          {currentPage === "tramites" && <Wizard key={parametro ?? ""} tramiteInicial={parametro} />}
          {currentPage === "chat" && <Chat />}
        </div>
      </main>

      {/* SOFIA a un clic desde cualquier página */}
      {currentPage !== "chat" && (
        <button
          onClick={() => navigateTo("chat")}
          className="brillo print:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-[#4A6DFF]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          aria-label="Pregúntale a SOFIA"
        >
          {/* Punto que "late" para invitar a escribir */}
          <span className="absolute top-2 left-3 w-2 h-2 rounded-full bg-emerald-400 animate-ping" aria-hidden="true" />
          <MessageCircle size={20} />
          <span className="hidden sm:inline">Pregúntale a SOFIA</span>
        </button>
      )}

    </div>
  );
}
