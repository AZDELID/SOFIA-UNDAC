import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot } from "lucide-react";
import { post, caja, campo, botonPrimario } from "../api";

// caido: la IA no respondió (Ollama apagado o sin red); se muestra el dinosaurio de Chrome
type Mensaje = { rol: "user" | "assistant"; texto: string; caido?: boolean };

const SUGERENCIAS = [
  "¿Qué necesito aprobar para llevar Base de Datos II?",
  "¿Qué documentos piden para la reserva de matrícula?",
  "¿Qué cursos se llevan en el 5.º semestre?",
];

export function Chat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { rol: "assistant", texto: "Hola, soy SOFIA, el Sistema de Orientación y Formularios con IA de la UNDAC. Pregúntame por cursos, prerrequisitos o trámites con FUT." },
  ]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const fin = useRef<HTMLDivElement>(null);

  // con llaves: scrollIntoView ya devuelve una Promise y React la tomaría como función de limpieza
  useEffect(() => { fin.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes]);

  async function enviar(pregunta: string) {
    if (!pregunta.trim() || cargando) return;
    // el saludo no lo escribió el modelo, y los avisos de "sin conexión" tampoco
    const historial = mensajes.slice(1).filter((m) => !m.caido);
    setMensajes((m) => [...m, { rol: "user", texto: pregunta }]);
    setTexto("");
    setCargando(true);
    try {
      const r = await post("/chat", { pregunta, historial });
      setMensajes((m) => [...m, { rol: "assistant", texto: r.respuesta }]);
    } catch (e: any) {
      setMensajes((m) => [...m, { rol: "assistant", texto: e.message, caido: true }]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <h1 className="text-4xl text-slate-900 mb-2">Pregúntale a SOFIA</h1>
      <p className="text-slate-600 mb-6">Responde con el plan de estudios y el catálogo de trámites del sistema. Corre en el servidor local, sin internet.</p>
      <div className={caja + " h-[55vh] overflow-y-auto space-y-4"}>
        {mensajes.map((m, i) => m.caido ? (
          <div key={i} className="flex animate-entrada items-end gap-3">
            <div className="tema-claro shrink-0 w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 flex items-end justify-center">
              <img src="/img/logos/dino-chrome.png" alt="Dinosaurio de Chrome" className="dino-salta w-11" />
            </div>
            <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800">
              <strong className="block">SOFIA está sin conexión</strong>
              <span className="text-sm">La IA del servidor no responde. Espera un momento y vuelve a intentarlo.</span>
              <span className="block mt-1 text-xs text-slate-500">Detalle: {m.texto}</span>
            </div>
          </div>
        ) : (
          <div key={i} className={`flex animate-entrada ${m.rol === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-wrap ${m.rol === "user" ? "bg-[#4A6DFF] text-white" : "bg-slate-100 text-slate-800"}`}>
              {m.rol === "assistant" && <Bot size={16} className="inline mr-2 text-teal-700" />}
              {/* el modelo marca con **negrita**: las partes impares van en <strong> */}
              {m.texto.split("**").map((parte, j) => (j % 2 ? <strong key={j}>{parte}</strong> : parte))}
            </div>
          </div>
        ))}
        {cargando && <Loader2 className="animate-spin text-slate-500" />}
        <div ref={fin} />
      </div>
      <div className="flex flex-wrap gap-2 my-3">
        {SUGERENCIAS.map((s) => (
          <button key={s} onClick={() => enviar(s)} className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900">{s}</button>
        ))}
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); enviar(texto); }}>
        <input className={campo} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu pregunta…" />
        <button className={botonPrimario} disabled={cargando} aria-label="Enviar"><Send size={18} /></button>
      </form>
    </div>
  );
}
