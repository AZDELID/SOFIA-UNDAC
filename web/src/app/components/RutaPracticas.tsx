import { useState } from "react";
import type { CSSProperties } from "react";
import { FileText, Download, ArrowRight, Info, FolderDown, Timer, Award, MessagesSquare, Lightbulb } from "lucide-react";
import { LineaTiempo, type PasoRuta } from "./LineaTiempo";
import { Tarjeta, Lista, Contactos } from "./Detalle";

// Pasos según el Reglamento de Prácticas Pre Profesionales (Res. N° 0800-2012-DFI); cada uno cita su artículo en ref
type Paso = PasoRuta & { fut?: { clave: string; boton: string } };

const GUIADAS: Paso[] = [
  {
    titulo: "Consigue dónde hacer tus prácticas",
    texto: "Empresa pública o privada, cooperativa, universidad, instituto de investigación u otra institución relacionada con la carrera. Debe tener un profesional responsable del área que te supervise. Puedes empezar con el VII semestre aprobado o 154 créditos.",
    ref: "Art. 7, 8 y 11",
  },
  {
    titulo: "Pide tu carta de presentación",
    texto: "Presenta tu FUT en mesa de partes, dirigido al Director de Escuela, con tu derecho de trámite. La Dirección te entrega la carta.",
    plazo: "1 día hábil",
    fut: { clave: "carta_presentacion", boton: "Crear FUT: carta de presentación" },
    ref: "Art. 13",
  },
  {
    titulo: "Consigue tu carta de aceptación",
    texto: "Lleva la carta de presentación a la institución donde harás las prácticas y pide que te den una carta de aceptación.",
    ref: "Art. 14",
  },
  {
    titulo: "Pide la asignación de tu asesor",
    texto: "Presenta tu FUT en mesa de partes adjuntando la carta de presentación y la carta de aceptación.",
    fut: { clave: "designacion_supervisor_practicas", boton: "Crear FUT: designación de asesor" },
    ref: "Art. 14",
  },
  {
    titulo: "Te designan un docente asesor",
    texto: "Si todo está en orden, la Dirección deriva tu pedido a la Coordinación de Prácticas, que te asigna un docente asesor al azar.",
    plazo: "2 días",
    ref: "Art. 14",
  },
  {
    titulo: "Haz tus prácticas junto a tu asesor",
    texto: "Coordina con tu asesor. Llena la Ficha de Control (Anexo 02), visada por el responsable del área, y la Ficha de Seguimiento (Anexo 03). Pide por duplicado la certificación de la gerencia de la institución. Si no cumples sus normas, quedas inhabilitado un año.",
    plazo: "85 días calendario seguidos (≈ 3 meses), mínimo 5 horas diarias",
    ref: "Art. 3, 14, 15, 16 y 17",
  },
  {
    titulo: "Presenta tu informe y la documentación",
    texto: "Entrégalo al Coordinador de Prácticas: A4, Arial 12, doble espacio, mínimo 20 páginas, con la estructura del Anexo 04. Adjunta la Ficha de Control visada, el informe favorable de tu asesor y la certificación de la institución. El asesor lo revisa en 15 días; si lo observa, tienes 15 días para corregir. Aprobado, entregas 1 ejemplar impreso y 1 digital y recibes tu certificado.",
    plazo: "Hasta 30 días después de terminar",
    ref: "Art. 18 al 22",
  },
];

const CONVALIDACION: Paso[] = [
  {
    titulo: "Verifica que cumples",
    texto: "Es para egresados que trabajan o trabajaron en una institución o empresa pública o privada más de un año (continuo o acumulado) en labores afines a la carrera.",
    ref: "Art. 25",
  },
  {
    titulo: "Pide la convalidación",
    texto: "Presenta tu FUT dirigido al Director de Escuela con la certificación de trabajo y tus boletas de pago.",
    fut: { clave: "convalidacion_practicas", boton: "Crear FUT: convalidación de prácticas" },
    ref: "Art. 25",
  },
  {
    titulo: "Evalúan tu caso",
    texto: "El Director deriva tu expediente al Coordinador de Prácticas, que opina si corresponde la convalidación.",
    plazo: "2 días hábiles + 3 días hábiles",
    ref: "Art. 26",
  },
  {
    titulo: "Presenta tu informe",
    texto: "Si la opinión es favorable, presentas el informe de prácticas igual que en la ruta con asesor (paso 7): estructura del Anexo 04, revisión del asesor y entrega impresa y digital.",
    ref: "Art. 27",
  },
];

const ANEXOS = [
  ["Anexo 01", "Ficha de registro", "Anexo-01-Ficha-de-registro.pdf"],
  ["Anexo 02", "Control de prácticas (asistencia)", "Anexo-02-Control-de-practicas.pdf"],
  ["Anexo 03", "Ficha de seguimiento", "Anexo-03-Ficha-de-seguimiento.pdf"],
  ["Anexo 04", "Estructura del informe", "Anexo-04-Estructura-del-informe.pdf"],
  ["Anexo 05", "Ficha de evaluación de la empresa", "Anexo-05-Evaluacion-de-la-empresa.pdf"],
];

// Los plazos del reglamento en una sola vista: [cifra, unidad, qué]
const PLAZOS: [string, string, string][] = [
  ["1", "día hábil", "para que te den la carta de presentación"],
  ["2", "días", "para que tu pedido llegue a la Coordinación y te asignen asesor"],
  ["85", "días seguidos", "de prácticas, con 5 horas diarias como mínimo"],
  ["30", "días", "para entregar el informe después de terminar"],
  ["15", "días", "tiene tu asesor para revisarlo"],
  ["15", "días", "tienes tú para levantar las observaciones"],
];

// Anexo 04
const ESTRUCTURA = [
  "Sin numerar: carátula, contracarátula, dedicatoria, índice e introducción.",
  "Capítulo I: aspectos generales de la empresa, objetivos, alcances y limitaciones.",
  "Capítulo II: bases teóricas.",
  "Capítulo III: resultados obtenidos (actividades realizadas, personal que intervino y logros).",
  "Al final, sin numerar: conclusiones, recomendaciones, bibliografía y anexos.",
  "Formato: A4, Arial 12, doble espacio, 20 páginas como mínimo.",
];

// Anexo 05: lo que califica el responsable de la empresa
const CRITERIOS = ["Iniciativa", "Habilidad", "Cooperación", "Organización del trabajo", "Eficiencia", "Dedicación", "Cumplimiento", "Sociabilidad", "Puntualidad", "Asistencia"];
const ESCALA: [string, string][] = [["Excelente", "18–20"], ["Muy bueno", "16–17"], ["Bueno", "13–15"], ["Regular", "11–12"], ["Deficiente", "08–10"], ["Ineficiente", "00–07"]];

const BUENO_SABER = [
  "Para el bachiller: sin prácticas aprobadas no te declaran expedito al grado (Art. 1 y 12).",
  "Plan de prácticas: la empresa debe tener un profesional responsable del área y un plan que revisa tu asesor (Art. 8).",
  "Vacantes de la Facultad: las que consigue la Coordinación se reparten según el perfil que pide la empresa o por orden de mérito (Art. 9 y 10).",
  "Charlas: la Coordinación programa charlas de prácticas y relaciones humanas para el VIII y IX semestre (Art. 6).",
  "Asesor: no se cambia, salvo licencia, enfermedad o ausencia larga (Art. 24).",
  "Tu informe: un ejemplar se queda en la biblioteca de la Escuela (Art. 23).",
  "Ficha de control (Anexo 02): marcas entrada y salida cada día; P = permiso, FJ / FI = falta justificada o injustificada, E = enfermedad.",
  "Prácticas hechas antes de 2012: se presenta el informe con el certificado de la empresa y la carta de presentación (Disposición segunda).",
];

const CONTACTOS: [string, string, string][] = [
  ["Director de la Escuela de Sistemas y Computación", "Dr. Teodoro Alvarado Rivera", "talvarado@undac.edu.pe"],
  ["Coordinador académico de la Escuela", "Ing. Pit Frank Alania Ricaldi", "palaniar@undac.edu.pe"],
];

export function RutaPracticas({ onFut }: { onFut: (clave: string) => void }) {
  const [ruta, setRuta] = useState<"guiadas" | "convalidacion">("guiadas");
  const pasos = ruta === "guiadas" ? GUIADAS : CONVALIDACION;

  return (
    <>
    <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <Info size={18} className="shrink-0 mt-0.5" />
      <p>
        Basado en el <strong>Reglamento de Prácticas de la Escuela (Res. 0800-2012-DFI)</strong>. En 2024 el Consejo Universitario
        aprobó un reglamento de prácticas (CU-045-2024, modificado por CU-089-2024), pero su texto no está publicado en la web de la UNDAC:
        pregunta en la Dirección de Escuela si cambió algún plazo.
      </p>
    </div>
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

        <LineaTiempo
          pasos={pasos}
          extra={(p) => p.fut && (
            <button
              onClick={() => onFut(p.fut!.clave)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-3 py-1.5 text-sm text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <FileText size={15} /> {p.fut.boton} <ArrowRight size={14} />
            </button>
          )}
        />
      </div>

      <Tarjeta titulo="Anexos del reglamento" nota="Formatos oficiales en PDF, para imprimir y llenar." icono={FolderDown} tono="azul" className="h-fit">
        <ul className="space-y-2">
          {ANEXOS.map(([num, nombre, archivo]) => (
            <li key={archivo}>
              <a
                href={`/anexos/${archivo}`}
                download
                className="group/anexo flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:border-[var(--tono)] hover:bg-[color-mix(in_oklab,var(--tono)_8%,transparent)] transition-colors"
              >
                <Download size={16} className="text-[var(--tono)] shrink-0 transition-transform group-hover/anexo:translate-y-0.5" />
                <span className="text-sm">
                  <span className="font-semibold text-slate-900">{num}</span>
                  <span className="text-slate-600"> · {nombre}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Tarjeta>
    </div>

    <h2 className="text-slate-900 text-2xl font-semibold mt-12 mb-6">Más detalles</h2>
    <Tarjeta titulo="Los plazos en números" nota="Desde la carta de presentación hasta tu certificado." icono={Timer} tono="naranja">
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PLAZOS.map(([cifra, unidad, que], i) => (
          <li
            key={que}
            style={{ "--i": i } as CSSProperties}
            className="cascada rounded-xl border border-slate-200 p-3 transition-colors hover:border-[var(--tono)] hover:bg-[color-mix(in_oklab,var(--tono)_7%,transparent)]"
          >
            <p className="font-mono text-3xl font-bold text-[var(--tono)] leading-none">{cifra}</p>
            <p className="text-xs font-semibold text-slate-800 mt-1">{unidad}</p>
            <p className="text-xs text-slate-600 mt-1">{que}</p>
          </li>
        ))}
      </ul>
    </Tarjeta>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-6">
      <Tarjeta titulo="Cómo se arma el informe" nota="Anexo 04 · Art. 18 y 19" icono={FileText} tono="violeta">
        <Lista items={ESTRUCTURA} />
      </Tarjeta>

      <Tarjeta titulo="Cómo te califica la empresa" nota="Anexo 05 · lo llena el responsable del área" icono={Award} tono="verde">
        <div className="flex flex-wrap gap-1.5">
          {CRITERIOS.map((c) => (
            <span key={c} className="rounded-full bg-[color-mix(in_oklab,var(--tono)_14%,transparent)] px-2.5 py-0.5 text-xs font-medium text-slate-700">{c}</span>
          ))}
        </div>
        {/* barra por nivel: del verde (excelente) al rojo (ineficiente), larga según la nota máxima */}
        <ul className="mt-4 space-y-1.5 text-sm">
          {ESCALA.map(([nivel, nota], i) => (
            <li key={nivel} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-2">
              <span className="text-slate-600">{nivel}</span>
              <span className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${(Number(nota.split("–")[1]) / 20) * 100}%`, background: `oklch(68% 0.17 ${150 - i * 28})` }}
                />
              </span>
              <span className="font-mono text-right text-slate-800">{nota}</span>
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="A quién preguntar" nota="Del Directorio Institucional de la UNDAC. El Coordinador de Prácticas lo nombra el Consejo de Facultad cada año (Art. 5)." icono={MessagesSquare} tono="celeste">
        <Contactos personas={CONTACTOS} />
      </Tarjeta>

      <Tarjeta titulo="Bueno saber" nota="Lo que dice el reglamento y casi nadie lee." icono={Lightbulb} tono="rosa" className="md:col-span-2 lg:col-span-3">
        <Lista items={BUENO_SABER} />
      </Tarjeta>
    </div>
    </>
  );
}
