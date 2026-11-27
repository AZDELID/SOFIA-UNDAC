import { Info, CheckCircle2, AlertTriangle, ListChecks, Cpu, ShieldAlert, MessagesSquare, FileText, CalendarRange, Files, FileCheck2, Users, Lightbulb } from "lucide-react";
import { LineaTiempo, type PasoRuta } from "./LineaTiempo";
import { Tarjeta, Lista, Contactos } from "./Detalle";

// Pasos según la Convocatoria 2026 de la Dirección de Proyección Social y Extensión Cultural (UNDAC, feb. 2026);
// cada paso cita su sección. Las fechas son de 2026: al salir la convocatoria 2027 se cambian aquí.
const PASOS: PasoRuta[] = [
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

// Qué cubre cada informe (Sección IX y XV): [informe, fecha de ingreso al sistema, meses que reporta]
const INFORMES: [string, string, string][] = [
  ["I informe parcial", "6 al 10 de julio", "Abril a julio (hasta el 10)"],
  ["II informe parcial", "19 al 23 de octubre", "10 de julio al 23 de octubre"],
  ["Informe final", "23 al 27 de noviembre", "Todo el proyecto, hasta el 27 de noviembre"],
];

// Formato 1: esquema del proyecto 2026
const FORMATO_1 = [
  "Carátula: título (qué, para quién y dónde), ejecutores con código y semestre, modalidad, fecha y firmas del asesor y del presidente.",
  "Antecedentes y diagnóstico: estudios previos y la realidad del lugar, analizada con instrumentos.",
  "Problema y justificación: la situación encontrada y por qué y para qué se hace el proyecto.",
  "Síntesis ejecutiva: un resumen de 10 líneas como máximo.",
  "Objetivos: uno general (claro, medible, ligado al título) y hasta 5 específicos.",
  "Metas: cuánto se logrará y en qué tiempo, en números.",
  "Referente académico: sustento teórico que conecta los cursos de la carrera con el problema (máximo 10 hojas).",
  "Estrategias, lugar y fechas: actividades, métodos, delimitación espacial y temporal.",
  "Beneficiarios: cuántos directos e indirectos (mínimo 50).",
  "Cronograma: actividades, responsables y tiempos en diagrama de Gantt.",
  "Indicadores: cómo medirán el avance y el impacto.",
  "Presupuesto y financiamiento: costos aproximados y cómo se cubren, de preferencia con gobiernos locales.",
  "Anexos obligatorios: solicitud del beneficiario con sello y fecha, y reglamento del grupo firmado.",
];

// Formato 4: esquema del informe final 2026 (lo que más se olvida)
const FORMATO_4 = [
  "Síntesis: 120 palabras como máximo, más el abstract en inglés.",
  "Sustento teórico: 5 hojas como máximo.",
  "Actividades: todas, de inicio a fin, y si quedó alguna pendiente, por qué.",
  "Resultados e impacto: metas alcanzadas y beneficios reales para la comunidad.",
  "Sostenibilidad: cómo seguirá mejorando la vida de los beneficiarios.",
  "Constancia de cumplimiento: firmada por el representante de los beneficiarios; el original se muestra al jurado.",
  "Balance económico: aportes de estudiantes, beneficiarios o instituciones.",
  "Otros anexos: certificado de entrega de materiales, cuaderno de campo digital (Formato 5), carátulas de los informes parciales, fotos con leyenda y enlaces a videos en Drive.",
];

const FORMATOS = [
  "Formato 1: esquema del proyecto.",
  "Formato 2: informes parciales I y II, con una tabla de actividades por mes y su % de avance.",
  "Formato 3: monitoreo; lo usa solo la Dirección cuando visita el proyecto.",
  "Formato 4: informe final.",
  "Formato 5: cuaderno de campo; por cada actividad, qué se hizo, quién asistió y cuántas horas trabajó cada uno.",
];

const EQUIPO = [
  "Asesor: un docente adscrito a proyección social, que solo puede asesorar un proyecto.",
  "Colaboradores: hasta 2 docentes; un co-asesor solo si el proyecto es relevante y con autorización.",
  "Otros integrantes: graduados, personal administrativo o voluntarios pueden sumarse como colaboradores.",
  "Más de 15 estudiantes: solo con más de 200 beneficiarios identificados y autorización de la Dirección.",
  "Proyectos de 2025: pueden seguir en 2026 en una nueva etapa, con autorización.",
  "Segunda carrera: la proyección social es obligatoria en el programa que estás llevando.",
];

// Consejos de SOFIA (no salen de la convocatoria)
const CONSEJOS = [
  "Arma la brigada y consigue la carta del beneficiario antes de abril: del 20 al 30 de abril no da tiempo para empezar de cero.",
  "Sube las evidencias el mismo día de cada actividad: el plazo es de solo 2 días.",
  "Desde el inicio lleva el cuaderno de campo y una carpeta compartida con fotos y videos ordenados por mes: el informe final se arma con eso.",
  "Elijan un tesorero ordenado y guarden boletas: el balance económico es un anexo obligatorio.",
  "Para la sustentación, coordinen con tiempo que asistan los beneficiarios: su presencia cuenta en la nota.",
];

const CONTACTOS: [string, string, string][] = [
  ["Directora de Proyección Social y Extensión Cultural", "Mag. Marianela Susana Neira López", "mneiral@undac.edu.pe"],
  ["Jefe de Proyección Social · Facultad de Ingeniería", "Jonas Ananias Ramos Martinez", "jramosma@undac.edu.pe"],
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
            <LineaTiempo pasos={PASOS} />
          </div>

          <div className="space-y-6 h-fit">
            <Tarjeta titulo="Requisitos y reglas" icono={ListChecks} tono="verde">
              <ul className="space-y-3">
                {REGLAS.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </Tarjeta>

            <Tarjeta titulo="Línea para Sistemas y Computación" nota="El proyecto debe seguir una línea de tu facultad." icono={Cpu} tono="violeta">
              <p className="text-sm text-slate-700 font-medium">8. Innovación tecnológica</p>
              <ul className="mt-1 mb-3 list-disc pl-5 text-sm text-slate-600 space-y-0.5 marker:text-[var(--tono)]">
                <li>Sistemas de redes informáticas</li>
                <li>Hardware y software informático</li>
                <li>Implementación del parque científico y tecnológico</li>
              </ul>
              <p className="text-xs text-slate-500">
                También vale la línea 9 (cuidado del medio ambiente), abierta a todas las facultades.
              </p>
            </Tarjeta>

            <Tarjeta titulo="Sanciones y retiro" icono={ShieldAlert} tono="rojo">
              <ul className="space-y-3">
                {SANCIONES.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-slate-600">
                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </Tarjeta>

            <Tarjeta titulo="A quién preguntar" nota="Del Directorio Institucional de la UNDAC." icono={MessagesSquare} tono="celeste">
              <Contactos personas={CONTACTOS} />
            </Tarjeta>
          </div>
        </div>

        <h2 className="text-slate-900 text-2xl font-semibold mt-12 mb-6">Más detalles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          <Tarjeta titulo="Qué va en el proyecto" nota="Formato 1 · esquema del proyecto 2026" icono={FileText} tono="azul" className="lg:row-span-2">
            <Lista items={FORMATO_1} />
          </Tarjeta>

          <Tarjeta titulo="Qué cubre cada informe" nota="Se ingresan al sistema; si no llegan a tiempo, separan al grupo." icono={CalendarRange} tono="naranja">
            <ol className="relative space-y-4 border-l-2 border-dashed border-[color-mix(in_oklab,var(--tono)_40%,transparent)] ml-2 pl-5 text-sm">
              {INFORMES.map(([nombre, fecha, meses], i) => (
                <li key={nombre} className="relative">
                  <span className="absolute -left-[31px] top-0 grid place-items-center w-5 h-5 rounded-full bg-[var(--tono)] text-white text-[10px] font-bold">{i + 1}</span>
                  <p className="text-slate-800 font-semibold">{nombre}</p>
                  <p className="font-mono text-xs text-[var(--tono)] mt-0.5">{fecha} de 2026</p>
                  <p className="text-slate-500 text-xs">Reporta: {meses}</p>
                </li>
              ))}
            </ol>
          </Tarjeta>

          <Tarjeta titulo="Los cinco formatos" nota="Están en la convocatoria; los llenas en el sistema de la oficina." icono={Files} tono="turquesa">
            <Lista items={FORMATOS} />
          </Tarjeta>

          <Tarjeta titulo="Qué va en el informe final" nota="Formato 4 · lo que más se olvida" icono={FileCheck2} tono="verde">
            <Lista items={FORMATO_4} />
          </Tarjeta>

          <Tarjeta titulo="Quiénes forman el equipo" nota="Sección IV y XI" icono={Users} tono="violeta">
            <Lista items={EQUIPO} />
          </Tarjeta>

          <Tarjeta titulo="Consejos para que no se complique" nota="De SOFIA, no de la convocatoria." icono={Lightbulb} tono="rosa" className="md:col-span-2 lg:col-span-3">
            <Lista items={CONSEJOS} />
          </Tarjeta>
        </div>
      </div>
    </div>
  );
}
