import { useState } from "react";
import { FileText, Download, ArrowRight, Clock } from "lucide-react";

// Pasos según el Reglamento de Prácticas Pre Profesionales (Res. N° 0800-2012-DFI); cada uno cita su artículo
type Paso = { titulo: string; texto: string; plazo?: string; fut?: { clave: string; boton: string }; art: string };

const GUIADAS: Paso[] = [
  {
    titulo: "Consigue dónde hacer tus prácticas",
    texto: "Empresa pública o privada, cooperativa, universidad, instituto de investigación u otra institución relacionada con la carrera. Debe tener un profesional responsable del área que te supervise. Puedes empezar con el VII semestre aprobado o 154 créditos.",
    art: "Art. 7, 8 y 11",
  },
  {
    titulo: "Pide tu carta de presentación",
    texto: "Presenta tu FUT en mesa de partes, dirigido al Director de Escuela, con tu derecho de trámite. La Dirección te entrega la carta.",
    plazo: "1 día hábil",
    fut: { clave: "carta_presentacion", boton: "Crear FUT: carta de presentación" },
    art: "Art. 13",
  },
  {
    titulo: "Consigue tu carta de aceptación",
    texto: "Lleva la carta de presentación a la institución donde harás las prácticas y pide que te den una carta de aceptación.",
    art: "Art. 14",
  },
  {
    titulo: "Pide la asignación de tu asesor",
    texto: "Presenta tu FUT en mesa de partes adjuntando la carta de presentación y la carta de aceptación.",
    fut: { clave: "designacion_supervisor_practicas", boton: "Crear FUT: designación de asesor" },
    art: "Art. 14",
  },
  {
    titulo: "Te designan un docente asesor",
    texto: "Si todo está en orden, la Dirección deriva tu pedido a la Coordinación de Prácticas, que te asigna un docente asesor al azar.",
    plazo: "2 días",
    art: "Art. 14",
  },
  {
    titulo: "Haz tus prácticas junto a tu asesor",
    texto: "Coordina con tu asesor. Llena la Ficha de Control (Anexo 02), visada por el responsable del área, y la Ficha de Seguimiento (Anexo 03). Pide por duplicado la certificación de la gerencia de la institución. Si no cumples sus normas, quedas inhabilitado un año.",
    plazo: "85 días calendario seguidos (≈ 3 meses), mínimo 5 horas diarias",
    art: "Art. 3, 14, 15, 16 y 17",
  },
  {
    titulo: "Presenta tu informe y la documentación",
    texto: "Entrégalo al Coordinador de Prácticas: A4, Arial 12, doble espacio, mínimo 20 páginas, con la estructura del Anexo 04. Adjunta la Ficha de Control visada, el informe favorable de tu asesor y la certificación de la institución. El asesor lo revisa en 15 días; si lo observa, tienes 15 días para corregir. Aprobado, entregas 1 ejemplar impreso y 1 digital y recibes tu certificado.",
    plazo: "Hasta 30 días después de terminar",
    art: "Art. 18 al 22",
  },
];

const CONVALIDACION: Paso[] = [
  {
    titulo: "Verifica que cumples",
    texto: "Es para egresados que trabajan o trabajaron en una institución o empresa pública o privada más de un año (continuo o acumulado) en labores afines a la carrera.",
    art: "Art. 25",
  },
  {
    titulo: "Pide la convalidación",
    texto: "Presenta tu FUT dirigido al Director de Escuela con la certificación de trabajo y tus boletas de pago.",
    fut: { clave: "convalidacion_practicas", boton: "Crear FUT: convalidación de prácticas" },
    art: "Art. 25",
  },
  {
    titulo: "Evalúan tu caso",
    texto: "El Director deriva tu expediente al Coordinador de Prácticas, que opina si corresponde la convalidación.",
    plazo: "2 días hábiles + 3 días hábiles",
    art: "Art. 26",
  },
  {
    titulo: "Presenta tu informe",
    texto: "Si la opinión es favorable, presentas el informe de prácticas igual que en la ruta con asesor (paso 7): estructura del Anexo 04, revisión del asesor y entrega impresa y digital.",
    art: "Art. 27",
  },
];

const ANEXOS = [
  ["Anexo 01", "Ficha de registro", "Anexo-01-Ficha-de-registro.pdf"],
  ["Anexo 02", "Control de prácticas (asistencia)", "Anexo-02-Control-de-practicas.pdf"],
  ["Anexo 03", "Ficha de seguimiento", "Anexo-03-Ficha-de-seguimiento.pdf"],
  ["Anexo 04", "Estructura del informe", "Anexo-04-Estructura-del-informe.pdf"],
  ["Anexo 05", "Ficha de evaluación de la empresa", "Anexo-05-Evaluacion-de-la-empresa.pdf"],
];

export function RutaPracticas({ onFut }: { onFut: (clave: string) => void }) {
  const [ruta, setRuta] = useState<"guiadas" | "convalidacion">("guiadas");
  const pasos = ruta === "guiadas" ? GUIADAS : CONVALIDACION;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            ["guiadas", "Con asesor · 85 días"],
            ["convalidacion", "Convalidación por trabajo · egresados"],
          ] as const).map(([id, texto]) => (
            <button
              key={id}
              onClick={() => setRuta(id)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                ruta === id ? "bg-[#4A6DFF] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>

        <ol className="relative">
          {pasos.map((p, i) => (
            <li key={p.titulo} className="relative flex gap-4 pb-7 last:pb-0">
              {/* línea que une los pasos */}
              {i < pasos.length - 1 && <span className="absolute left-[17px] top-9 bottom-0 w-0.5 bg-slate-200" aria-hidden="true" />}
              <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4A6DFF] to-[#7A5BFF] text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1 pt-1">
                <h3 className="text-slate-900 font-semibold">{p.titulo}</h3>
                <p className="text-slate-600 text-sm mt-1">{p.texto}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {p.plazo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-800">
                      <Clock size={12} /> {p.plazo}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{p.art}</span>
                </div>
                {p.fut && (
                  <button
                    onClick={() => onFut(p.fut!.clave)}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-100 transition-colors"
                  >
                    <FileText size={15} /> {p.fut.boton} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <aside className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
        <h3 className="text-slate-900 font-semibold mb-1">Anexos del reglamento</h3>
        <p className="text-slate-500 text-xs mb-4">Formatos oficiales en PDF, para imprimir y llenar.</p>
        <ul className="space-y-2">
          {ANEXOS.map(([num, nombre, archivo]) => (
            <li key={archivo}>
              <a
                href={`/anexos/${archivo}`}
                download
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
              >
                <Download size={16} className="text-[#4A6DFF] shrink-0" />
                <span className="text-sm">
                  <span className="font-semibold text-slate-900">{num}</span>
                  <span className="text-slate-600"> · {nombre}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
