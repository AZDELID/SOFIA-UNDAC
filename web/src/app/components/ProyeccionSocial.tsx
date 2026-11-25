import { Clock, Info, CheckCircle2, AlertTriangle } from "lucide-react";

// Pasos según la Convocatoria 2026 de la Dirección de Proyección Social y Extensión Cultural (UNDAC, feb. 2026);
// cada paso cita su sección. Las fechas son de 2026: al salir la convocatoria 2027 se cambian aquí.
type Paso = { titulo: string; texto: string; plazo?: string; ref: string };

const PASOS: Paso[] = [
  {
    titulo: "Verifica que puedes inscribirte",
    texto: "Necesitas matrícula vigente en el año académico y estar entre el VII y el XI semestre, o ser egresado. Es obligatoria para terminar la carrera.",
    ref: "Sección IV y XI",
  },
  {
    titulo: "Forma tu brigada con un docente asesor",
    texto: "De 5 a 15 estudiantes. Monovalente (todos de tu escuela) o polivalente (de varias escuelas, con autorización de la Dirección). Elijan una junta directiva (presidente, secretario, tesorero y responsable de difusión) y escriban un reglamento de grupo firmado. El asesor es un docente adscrito a proyección social.",
    ref: "Sección IV y XI",
  },
  {
    titulo: "Asiste a la capacitación",
    texto: "Es obligatoria: enseñan a elaborar el proyecto y a usar el sistema de la oficina. Tu asistencia cuenta para crear tu usuario en el sistema.",
    plazo: "Según el cronograma de tu facultad",
    ref: "Sección VII",
  },
  {
    titulo: "Inscríbete en el sistema",
    texto: "Llena la ficha de inscripción del sistema de la oficina de Proyección Social, con una foto formal tamaño carné y una copia de tu ficha de matrícula vigente.",
    ref: "Sección XI",
  },
  {
    titulo: "Elabora y presenta el proyecto",
    texto: "Sigue el Formato 1 (esquema de proyecto 2026) y la línea de responsabilidad social de tu facultad. Mínimo 50 beneficiarios, fuera del campus, sin instituciones privadas y dentro de la región Pasco. Anexos obligatorios: la solicitud del beneficiario con sello y fecha, y el reglamento del grupo. Ingresas el proyecto y su cronograma de actividades al sistema.",
    plazo: "20 al 30 de abril de 2026 (improrrogable)",
    ref: "Sección VIII y X",
  },
  {
    titulo: "Evaluación y corrección del proyecto",
    texto: "Un jurado lo califica en el sistema. Si hay observaciones, las levantan y lo vuelven a ingresar; luego el Vicerrectorado Académico emite la resolución.",
    plazo: "Evaluación del 4 al 8 de mayo de 2026 · correcciones en 2 días hábiles",
    ref: "Sección IX y XII",
  },
  {
    titulo: "Ejecuta el proyecto",
    texto: "Cada integrante cumple mínimo 180 horas efectivas, 8 horas por semana. Sube al sistema las evidencias de cada actividad, coloca una gigantografía con el título del proyecto en el lugar y difunde los avances en redes o medios. Lleva tu cuaderno de campo (Formato 5).",
    plazo: "Desde el 4 al 8 de mayo hasta diciembre de 2026 · evidencias en máximo 2 días",
    ref: "Sección VI, X y XIV",
  },
  {
    titulo: "Presenta los informes parciales",
    texto: "El asesor y los estudiantes ingresan al sistema cada informe con el Formato 2. Si no lo hacen a tiempo, los separan del proyecto.",
    plazo: "I informe: 6 al 10 de julio · II informe: 19 al 23 de octubre de 2026",
    ref: "Sección XV",
  },
  {
    titulo: "Participa en la feria de proyectos",
    texto: "Exponen el proyecto junto con el asesor; la asistencia es obligatoria. La fecha y el lugar se comunican con anticipación.",
    plazo: "Antes del II informe parcial",
    ref: "Sección XVI",
  },
  {
    titulo: "Presenta el informe final",
    texto: "Con el Formato 4. Lo ingresan el asesor y el presidente del grupo. Entre sus anexos van la constancia de cumplimiento firmada por el representante de los beneficiarios, el balance económico y el cuaderno de campo.",
    plazo: "23 al 27 de noviembre de 2026",
    ref: "Sección XVIII",
  },
  {
    titulo: "Sustenta y recibe tu certificación",
    texto: "Sustentación presencial ante 2 jurados, con los beneficiarios presentes (cuenta en el puntaje). Corriges el informe y lo vuelves a ingresar. La certificación es válida para obtener el grado de bachiller.",
    plazo: "Informe corregido en máximo 2 días después de sustentar",
    ref: "Sección XIII, XIX y XX",
  },
];

const REGLAS = [
  "180 horas efectivas por integrante, 8 por semana, de abril a diciembre.",
  "Brigada de 5 a 15 estudiantes, con un docente asesor.",
  "Mínimo 50 beneficiarios: comunidades, organizaciones de escasos recursos, colegios o gobiernos locales. Nunca instituciones privadas.",
  "El trabajo es fuera del campus y, en la sede central, dentro de la región Pasco.",
  "Solo un proyecto de tu facultad: si te inscribes en dos, te retiran y no haces proyección social ese año.",
  "No se repite un proyecto de años anteriores con el mismo nombre: se anula.",
];

const SANCIONES = [
  "Si no cumples con el trabajo, la sanción llega hasta un año.",
  "Dos faltas al trabajo o a las supervisiones, o actos de indisciplina: te separan del proyecto.",
  "Sin informes parciales, informe final o sustentación, el grupo pierde la certificación.",
  "Para retirarte, avisa por escrito con justificación (casos graves) al asesor y a la Dirección; así puedes participar el año siguiente.",
];

export function ProyeccionSocial() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-3">Proyección Social</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Obligatoria desde el VII semestre: un proyecto en brigada con la comunidad, de abril a diciembre, con 180 horas de trabajo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            Basado en la <strong>Convocatoria 2026</strong> de la Dirección de Proyección Social y Extensión Cultural.
            Las fechas y los formatos son los de 2026; pueden cambiar con la convocatoria 2027.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-slate-900 text-xl font-semibold mb-6">Ruta paso a paso</h2>
            <ol className="relative">
              {PASOS.map((p, i) => (
                <li key={p.titulo} className="relative flex gap-4 pb-7 last:pb-0">
                  {i < PASOS.length - 1 && <span className="absolute left-[17px] top-9 bottom-0 w-0.5 bg-slate-200" aria-hidden="true" />}
                  <span className="relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4A6DFF] to-[#7A5BFF] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3 className="text-slate-900 font-semibold">{p.titulo}</h3>
                    <p className="text-slate-600 text-sm mt-1">{p.texto}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {p.plazo && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs text-amber-800">
                          <Clock size={12} className="shrink-0" /> {p.plazo}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{p.ref}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-6 h-fit">
            <aside className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4">Requisitos y reglas</h3>
              <ul className="space-y-3">
                {REGLAS.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </aside>

            <aside className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-1">Línea para Sistemas y Computación</h3>
              <p className="text-slate-500 text-xs mb-3">El proyecto debe seguir una línea de tu facultad.</p>
              <p className="text-sm text-slate-700 font-medium">8. Innovación tecnológica</p>
              <ul className="mt-1 mb-3 list-disc pl-5 text-sm text-slate-600 space-y-0.5">
                <li>Sistemas de redes informáticas</li>
                <li>Hardware y software informático</li>
                <li>Implementación del parque científico y tecnológico</li>
              </ul>
              <p className="text-xs text-slate-500">
                También vale la línea 9 (cuidado del medio ambiente), abierta a todas las facultades.
              </p>
            </aside>

            <aside className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-slate-900 font-semibold mb-4">Sanciones y retiro</h3>
              <ul className="space-y-3">
                {SANCIONES.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-slate-600">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
