import { useState, useRef } from "react";
import { cursosData, MALLAS, type Malla, SEMESTRES_AHORA, PERIODO } from "../data/cursos";
import { horariosCSVData } from "../data/horarios-csv";
import { Download, Image as ImageIcon, FileText, Search } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

// ============================================
// INTERFACES
// ============================================

interface Curso {
  codigo: string;
  nombre: string;
  semestre: number;
  creditos: number;
  malla: string;
  tipo: string;
}

interface CeldaHorario {
  cursos: Array<{
    curso: string;
    modalidad: string;
    codigo: string;
  }>;
}

// ============================================
// FUNCIÓN PARA GENERAR COLORES POR CURSO
// ============================================

const getColorForCourse = (courseName: string): string => {
  const colors = [
    "rgba(255, 138, 128, 0.4)",  // Coral suave
    "rgba(129, 168, 255, 0.4)",  // Azul claro moderno
    "rgba(255, 209, 102, 0.4)",  // Amarillo cálido suave
    "rgba(134, 239, 172, 0.4)",  // Verde menta
    "rgba(255, 179, 186, 0.4)",  // Rosa pastel
    "rgba(174, 198, 255, 0.4)",  // Azul cielo suave
    "rgba(255, 167, 120, 0.4)",  // Naranja suave
    "rgba(204, 153, 255, 0.4)",  // Lila
    "rgba(153, 216, 255, 0.4)",  // Celeste limpio
    "rgba(255, 236, 179, 0.4)",  // Amarillo pastel
    "rgba(167, 243, 208, 0.4)",  // Verde agua
    "rgba(255, 204, 229, 0.4)",  // Rosa claro elegante
    "rgba(176, 224, 230, 0.4)",  // Azul grisáceo
    "rgba(255, 218, 185, 0.4)",  // Durazno suave
    "rgba(221, 209, 255, 0.4)"   // Lavanda clara
  ];
  
  // Generar hash del nombre del curso para obtener un color consistente
  let hash = 0;
  for (let i = 0; i < courseName.length; i++) {
    hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// ============================================
// CSV → CÓDIGO DE CURSO
// ============================================

// "Cálculo Integral" y "Calculo Integral" dan la misma clave: sin tildes, sin espacios ni signos
const clave = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Nombres del CSV que no coinciden con cursos.json ni quitando tildes
const ALIAS: Record<string, string> = {
  [clave("Sistema de Bases II")]: "17309",
  [clave("Sistema de Informacion Gerencial")]: "17320",
  [clave("Conmutacion y Enrutamiento de Redes")]: "17316",
  [clave("Metologia Agiles de Desarrollo de Software")]: "17317",
};

// El CSV es de la malla 17xxx; la 26xxx repite nombres (Algoritmos, Física General…) y no debe tomarlos
const CODIGO_POR_CLAVE = new Map<string, string>([
  ...(cursosData as Curso[]).filter((c) => c.malla === "17").map((c) => [clave(c.nombre), c.codigo] as [string, string]),
  ...Object.entries(ALIAS),
]);

// Cada fila del CSV con el código del curso al que pertenece ("libre" y nombres desconocidos quedan fuera)
const SLOTS = horariosCSVData
  .map((h) => ({ ...h, codigo: CODIGO_POR_CLAVE.get(clave(h.curso)) }))
  .filter((h): h is typeof h & { codigo: string } => !!h.codigo);
const CON_HORARIO = new Set(SLOTS.map((h) => h.codigo));

const cursosDeMalla = (m: Malla) => (cursosData as Curso[]).filter((c) => c.malla === m);
// Al elegir un semestre se marcan sus obligatorios; el electivo lo elige el estudiante (solo uno por semestre)
const obligatoriosDe = (m: Malla, sem: number) =>
  cursosDeMalla(m).filter((c) => c.semestre === sem && c.tipo !== "Electivo").map((c) => c.codigo);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function Horarios({ cursoInicial = null }: { cursoInicial?: string | null }) {
  // Desde el mapa se llega con un curso: se abre su semestre con ese curso marcado y el horario armado
  const desdeMapa = (cursosData as Curso[]).find((c) => c.codigo === cursoInicial && SEMESTRES_AHORA.includes(c.semestre));
  const [malla, setMalla] = useState<Malla>((desdeMapa?.malla as Malla) ?? "17");
  const [semestreSeleccionado, setSemestreSeleccionado] = useState(desdeMapa?.semestre ?? SEMESTRES_AHORA[0]);
  const cursos = cursosDeMalla(malla);
  // Empieza igual que al elegir un semestre: con los obligatorios del primero que se dicta ahora
  const [cursosSeleccionados, setCursosSeleccionados] = useState<string[]>(() => {
    if (!desdeMapa) return obligatoriosDe("17", SEMESTRES_AHORA[0]);
    const base = obligatoriosDe(desdeMapa.malla as Malla, desdeMapa.semestre);
    return base.includes(desdeMapa.codigo) ? base : [...base, desdeMapa.codigo];
  });
  const [horarioGenerado, setHorarioGenerado] = useState(!!desdeMapa);
  // Día que se ve en el celular: hoy (lunes a sábado) o el lunes
  const [diaMovil, setDiaMovil] = useState(() => Math.min(Math.max(new Date().getDay() - 1, 0), 5));
  const [busquedaOtrosCursos, setBusquedaOtrosCursos] = useState("");
  const [semestreFiltroOtros, setSemestreFiltroOtros] = useState<number | null>(null);
  const horarioRef = useRef<HTMLDivElement>(null);
  const sinHorario = cursos.filter((c) => cursosSeleccionados.includes(c.codigo) && !CON_HORARIO.has(c.codigo));

  const cursosPorSemestre = cursos.filter(
    (c) => c.semestre === semestreSeleccionado
  );

  // ============================================
  // FUNCIONES DE MANEJO DE ESTADO
  // ============================================

  const toggleCurso = (codigo: string) => {
    if (cursosSeleccionados.includes(codigo)) {
      setCursosSeleccionados(cursosSeleccionados.filter((c) => c !== codigo));
      return;
    }
    // Un electivo reemplaza al otro electivo que hubiera del mismo semestre
    const nuevo = cursos.find((c) => c.codigo === codigo)!;
    const otros = nuevo.tipo === "Electivo"
      ? cursos.filter((c) => c.tipo === "Electivo" && c.semestre === nuevo.semestre).map((c) => c.codigo)
      : [];
    setCursosSeleccionados([...cursosSeleccionados.filter((c) => !otros.includes(c)), codigo]);
  };

  const seleccionarSemestre = (sem: number, m: Malla = malla) => {
    setSemestreSeleccionado(sem);
    setCursosSeleccionados(obligatoriosDe(m, sem));
    setHorarioGenerado(false);
  };

  const generarHorario = () => {
    setHorarioGenerado(true);
  };

  // ============================================
  // CONFIGURACIÓN DE DÍAS Y HORARIOS
  // ============================================

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  
  // Horarios en bloques de 50 minutos - 15 bloques totales
  const bloqueHorarios = [
    { inicio: "08:00 am", fin: "08:50 am", hora: "08:00 am" },
    { inicio: "08:50 am", fin: "09:40 am", hora: "08:50 am" },
    { inicio: "09:40 am", fin: "10:30 am", hora: "09:40 am" },
    { inicio: "10:30 am", fin: "11:20 am", hora: "10:30 am" },
    { inicio: "11:20 am", fin: "12:10 pm", hora: "11:20 am" },
    { inicio: "12:10 pm", fin: "13:00 pm", hora: "12:10 pm" },
    { inicio: "13:00 pm", fin: "14:30 pm", hora: "13:00 pm", almuerzo: true },
    { inicio: "14:30 pm", fin: "15:20 pm", hora: "14:30 pm" },
    { inicio: "15:20 pm", fin: "16:10 pm", hora: "15:20 pm" },
    { inicio: "16:10 pm", fin: "17:00 pm", hora: "16:10 pm" },
    { inicio: "17:00 pm", fin: "17:50 pm", hora: "17:00 pm" },
    { inicio: "17:50 pm", fin: "18:40 pm", hora: "17:50 pm" },
    { inicio: "18:40 pm", fin: "19:30 pm", hora: "18:40 pm" },
    { inicio: "19:30 pm", fin: "20:20 pm", hora: "19:30 pm" },
    { inicio: "20:20 pm", fin: "21:10 pm", hora: "20:20 pm" },
  ];

  // ============================================
  // CONSTRUCCIÓN DE LA MATRIZ DE HORARIO
  // ============================================

  const construirMatrizHorario = (): (CeldaHorario | null)[][] => {
    const matriz: (CeldaHorario | null)[][] = Array(bloqueHorarios.length)
      .fill(null)
      .map(() => Array(dias.length).fill(null));

    // Solo las horas de los cursos marcados, sean del semestre que sean; una celda vacía es hora libre
    SLOTS.filter((slot) => cursosSeleccionados.includes(slot.codigo)).forEach((slot) => {
      const diaIndex = dias.indexOf(slot.dia);
      const bloqueIndex = bloqueHorarios.findIndex(
        (b) => b.inicio.toLowerCase() === slot.horaInicio.toLowerCase().trim()
      );
      // La hora de almuerzo queda siempre libre aunque el CSV tenga clase ahí
      if (diaIndex === -1 || bloqueIndex === -1 || bloqueHorarios[bloqueIndex].almuerzo) return;

      const nombre = cursos.find((c) => c.codigo === slot.codigo)!.nombre;
      const celda = (matriz[bloqueIndex][diaIndex] ??= { cursos: [] });
      // dos cursos distintos en la misma hora = cruce de horarios
      if (!celda.cursos.some((c) => c.codigo === slot.codigo)) {
        celda.cursos.push({ curso: nombre, modalidad: slot.modalidad, codigo: slot.codigo });
      }
    });

    return matriz;
  };

  const matrizHorario = construirMatrizHorario();
  // Bloques de 50 min donde coinciden dos o más cursos
  const cruces = matrizHorario.flat().filter((c) => c && c.cursos.length > 1).length;

  // ============================================
  // FUNCIONES DE EXPORTACIÓN
  // ============================================

  // En el celular la tabla completa está oculta (se ve por día): para exportarla se muestra
  // un instante fuera de la pantalla, a ancho de escritorio, y se vuelve a ocultar
  const capturar = async () => {
    const el = horarioRef.current!;
    const oculta = getComputedStyle(el).display === "none";
    if (oculta) el.style.cssText = "display:block;position:fixed;left:-10000px;top:0;width:1100px;overflow:visible";
    try {
      // el fondo del tema actual: en oscuro la imagen también sale oscura
      return await html2canvas(el, { backgroundColor: getComputedStyle(document.body).backgroundColor, scale: 2 });
    } finally {
      if (oculta) el.style.cssText = "";
    }
  };

  const exportarImagen = async () => {
    if (!horarioRef.current) return;

    try {
      const canvas = await capturar();

      const link = document.createElement("a");
      link.download = `horario-semestre-${semestreSeleccionado}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error al exportar imagen:", error);
    }
  };

  const exportarPDF = async () => {
    if (!horarioRef.current) return;

    try {
      const canvas = await capturar();

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // En oscuro la hoja entera toma el color del fondo (el pixel de la esquina, fuera del borde redondeado)
      if (document.documentElement.classList.contains("dark")) {
        const [r, g, b] = canvas.getContext("2d")!.getImageData(0, 0, 1, 1).data;
        pdf.setFillColor(r, g, b);
        pdf.rect(0, 0, 297, 210, "F");
      }

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`horario-semestre-${semestreSeleccionado}.pdf`);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
    }
  };

  // ============================================
  // RENDERIZADO
  // ============================================

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-4">Planificación de Horarios</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Selecciona tus cursos y genera tu horario académico semanal.
            Exporta en imagen o PDF.
          </p>
        </div>

        {/* ============================================ */}
        {/* SELECTOR DE SEMESTRE */}
        {/* ============================================ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-slate-900 text-xl">Seleccionar Semestre</h2>
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
              {MALLAS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMalla(m.id); seleccionarSemestre(SEMESTRES_AHORA[0], m.id); }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    malla === m.id ? "bg-[#4A6DFF] text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {m.nombre}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-4">Ahora: {PERIODO}</p>
          {malla === "26" && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              Aún no hay horario cargado para la malla nueva (26xxx).
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SEMESTRES_AHORA.map((sem) => (
              <button
                key={sem}
                onClick={() => seleccionarSemestre(sem)}
                className={`px-4 py-3 rounded-xl transition-all ${
                  semestreSeleccionado === sem
                    ? "bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white shadow-lg shadow-[#4A6DFF]/30"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semestre {sem}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* LISTA DE CURSOS */}
        {/* ============================================ */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <h2 className="text-slate-900 text-xl mb-4">
            Cursos - Semestre {semestreSeleccionado}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cursosPorSemestre.filter((c) => c.tipo !== "Electivo").map((curso) => (
              <label
                key={curso.codigo}
                className="flex items-center gap-3 p-4 bg-white hover:bg-slate-100 rounded-xl cursor-pointer transition-all border border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={cursosSeleccionados.includes(curso.codigo)}
                  onChange={() => toggleCurso(curso.codigo)}
                  className="w-5 h-5 rounded accent-[#4A6DFF]"
                />
                <div className="flex-1">
                  <p className="text-slate-900">{curso.nombre}</p>
                  <p className="text-slate-500 text-sm">
                    {curso.codigo} • {curso.creditos} créditos
                  </p>
                </div>
              </label>
            ))}
          </div>

          {cursosPorSemestre.some((c) => c.tipo === "Electivo") && (
            <fieldset className="mt-5">
              <legend className="text-slate-700 text-sm font-semibold mb-3">Electivo · elige solo uno</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cursosPorSemestre.filter((c) => c.tipo === "Electivo").map((curso) => (
                  <label
                    key={curso.codigo}
                    className="flex items-center gap-3 p-4 bg-white hover:bg-slate-100 rounded-xl cursor-pointer transition-all border border-dashed border-slate-300"
                  >
                    <input
                      type="radio"
                      name={`electivo-${semestreSeleccionado}`}
                      checked={cursosSeleccionados.includes(curso.codigo)}
                      onChange={() => toggleCurso(curso.codigo)}
                      className="w-5 h-5 accent-[#4A6DFF]"
                    />
                    <div className="flex-1">
                      <p className="text-slate-900">{curso.nombre}</p>
                      <p className="text-slate-500 text-sm">
                        {curso.codigo} • {curso.creditos} créditos
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {/* Agregar cursos de otros semestres */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-slate-600 text-sm mb-3">
              Cursos de otros semestres
            </h3>
            <div className="flex flex-col gap-3 mb-3">
              <input
                type="text"
                value={busquedaOtrosCursos}
                onChange={(e) => setBusquedaOtrosCursos(e.target.value)}
                placeholder="Buscar curso por nombre..."
                className="w-full px-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4A6DFF]"
              />
              
              <div>
                <p className="text-slate-500 text-xs mb-2">Filtrar por semestre:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <button
                    onClick={() => setSemestreFiltroOtros(null)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      semestreFiltroOtros === null
                        ? "bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Todos
                  </button>
                  {SEMESTRES_AHORA.map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSemestreFiltroOtros(sem)}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        semestreFiltroOtros === sem
                          ? "bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Semestre {sem}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {cursos
                .filter(
                  (c) =>
                    c.semestre !== semestreSeleccionado &&
                    SEMESTRES_AHORA.includes(c.semestre) &&
                    (!semestreFiltroOtros || c.semestre === semestreFiltroOtros) &&
                    c.nombre.toLowerCase().includes(busquedaOtrosCursos.toLowerCase())
                )
                .map((curso) => (
                  <label
                    key={curso.codigo}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-slate-100 rounded-lg cursor-pointer transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={cursosSeleccionados.includes(curso.codigo)}
                      onChange={() => toggleCurso(curso.codigo)}
                      className="w-4 h-4 rounded accent-[#4A6DFF]"
                    />
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm">
                        {curso.nombre} - Semestre {curso.semestre}
                      </p>
                    </div>
                  </label>
                ))}
            </div>
          </div>

          <button
            onClick={generarHorario}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white rounded-xl hover:shadow-lg hover:shadow-[#4A6DFF]/50 transition-all"
          >
            Generar Horario
          </button>
        </div>

        {/* ============================================ */}
        {/* HORARIO GENERADO */}
        {/* ============================================ */}
        {horarioGenerado && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            {cruces > 0 && (
              <button
                onClick={() => {
                  // En el celular se cambia al primer día con cruce si el que se ve no tiene
                  const conCruce = (d: number) => matrizHorario.some((f) => (f[d]?.cursos.length ?? 0) > 1);
                  if (!conCruce(diaMovil)) setDiaMovil(Math.max(0, dias.findIndex((_, d) => conCruce(d))));
                  setTimeout(() => {
                    [...document.querySelectorAll<HTMLElement>("[data-cruce]")]
                      .find((e) => e.offsetParent)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 50);
                }}
                className="mb-5 w-full flex items-center justify-between gap-3 rounded-xl border-2 border-dashed border-red-400 bg-red-50/40 px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50 transition-colors"
              >
                <span><strong>Tienes cruces en {cruces} {cruces === 1 ? "hora" : "horas"}</strong> de tu horario</span>
                <span className="font-semibold">Ver dónde →</span>
              </button>
            )}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-slate-900 text-xl">
                Horario Semestre {semestreSeleccionado}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={exportarImagen}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-all border border-teal-200"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Imagen</span>
                </button>
                <button
                  onClick={exportarPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl hover:bg-[#7A5BFF]/20 transition-all border border-[#7A5BFF]/30"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>

            {/* Celular: un día a la vez */}
            <div className="md:hidden">
              <div className="grid grid-cols-6 gap-1 mb-4" role="tablist">
                {dias.map((dia, i) => {
                  const conClase = matrizHorario.some((fila) => fila[i]);
                  return (
                    <button
                      key={dia}
                      role="tab"
                      aria-selected={diaMovil === i}
                      onClick={() => setDiaMovil(i)}
                      className={`relative min-h-11 rounded-xl text-sm font-medium transition-colors ${
                        diaMovil === i ? "bg-[#4A6DFF] text-white" : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {dia.slice(0, 3)}
                      {conClase && diaMovil !== i && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4A6DFF]" />}
                    </button>
                  );
                })}
              </div>
              {(() => {
                // Junta los bloques seguidos del mismo curso en una sola tarjeta
                const grupos: { desde: string; hasta: string; celda: CeldaHorario | null; almuerzo?: boolean }[] = [];
                bloqueHorarios.forEach((b, i) => {
                  const celda = b.almuerzo ? null : matrizHorario[i][diaMovil];
                  const ult = grupos[grupos.length - 1];
                  if (!b.almuerzo && ult && !ult.almuerzo && JSON.stringify(ult.celda) === JSON.stringify(celda)) ult.hasta = b.fin;
                  else grupos.push({ desde: b.inicio, hasta: b.fin, celda, almuerzo: b.almuerzo });
                });
                const visibles = grupos.filter((g) => g.almuerzo || g.celda);
                if (!visibles.some((g) => g.celda)) return <p className="py-8 text-center text-slate-500">Sin clases este día</p>;
                return (
                  <ul className="space-y-2 rounded-xl bg-white p-2">
                    {visibles.map((g) => {
                      const cruce = !!g.celda && g.celda.cursos.length > 1;
                      return (
                        <li
                          key={g.desde}
                          data-cruce={cruce || undefined}
                          className={`flex gap-3 rounded-xl p-3 ${g.almuerzo ? "bg-amber-50 text-amber-800" : cruce ? "border-2 border-dashed border-red-500" : ""}`}
                          style={!g.almuerzo && !cruce ? { backgroundColor: getColorForCourse(g.celda!.cursos[0].curso) } : undefined}
                        >
                          <span className="w-20 shrink-0 text-xs font-medium text-slate-600 leading-tight">{g.desde}<br />{g.hasta}</span>
                          <span className="flex-1 text-sm">
                            {g.almuerzo ? <strong>Almuerzo</strong> : (
                              <>
                                {cruce && <span className="block text-[10px] font-bold uppercase text-red-600">Cruce</span>}
                                {g.celda!.cursos.map((c) => (
                                  <span key={c.codigo} className="block font-semibold text-slate-900">
                                    {c.curso}{c.modalidad && ` (${c.modalidad})`}
                                  </span>
                                ))}
                              </>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              })()}
            </div>

            {/* Escritorio: la semana completa (también es lo que se exporta) */}
            <div ref={horarioRef} className="hidden md:block overflow-x-auto rounded-xl bg-white">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#4A6DFF]/30 to-[#7A5BFF]/30">
                    <th className="text-slate-900 p-3 border border-slate-300 text-sm font-bold">
                      HORAS
                    </th>
                    {dias.map((dia) => (
                      <th
                        key={dia}
                        className="text-slate-900 p-3 border border-slate-300 text-sm font-bold"
                      >
                        {dia.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bloqueHorarios.map((bloque, rowIndex) => (
                    <tr key={bloque.hora}>
                      <td className="bg-slate-100 text-slate-800 p-2 border border-slate-300 text-center text-xs font-medium">
                        {bloque.inicio} - {bloque.fin}
                      </td>
                      {bloque.almuerzo ? (
                        <td colSpan={dias.length} className="border border-slate-300 bg-amber-50 p-3 text-center text-sm font-semibold tracking-wide text-amber-800">
                          ALMUERZO
                        </td>
                      ) : dias.map((dia, colIndex) => {
                        const celda = matrizHorario[rowIndex][colIndex];
                        
                        // Verificar si es continuación de la celda anterior
                        const celdaAnterior =
                          rowIndex > 0
                            ? matrizHorario[rowIndex - 1][colIndex]
                            : null;
                        
                        const esRepetida = celda && celdaAnterior && 
                          JSON.stringify(celda) === JSON.stringify(celdaAnterior);

                        if (esRepetida) {
                          return null;
                        }

                        // Calcular rowSpan
                        let rowSpan = 1;
                        if (celda) {
                          for (let i = rowIndex + 1; i < bloqueHorarios.length; i++) {
                            const celdaSiguiente = matrizHorario[i][colIndex];
                            if (celdaSiguiente && JSON.stringify(celdaSiguiente) === JSON.stringify(celda)) {
                              rowSpan++;
                            } else {
                              break;
                            }
                          }
                        }

                        // Determinar el color de fondo
                        // vacía: transparente, así toma el fondo de la tarjeta (blanca o oscura según el tema)
                        let bgColor = "transparent";
                        const esCruce = !!celda && celda.cursos.length > 1;
                        if (celda && celda.cursos.length > 0) {
                          const primerCurso = celda.cursos[0];
                          if (esCruce) {
                            // Cruce de horarios: transparente, el borde punteado lo marca
                            bgColor = "transparent";
                          } else {
                            bgColor = getColorForCourse(primerCurso.curso);
                          }
                        }

                        return (
                          <td
                            key={`${dia}-${bloque.hora}`}
                            rowSpan={rowSpan}
                            data-cruce={esCruce || undefined}
                            style={{ backgroundColor: bgColor }}
                            className="border border-slate-300 p-2 text-center text-xs align-middle"
                          >
                            {celda && celda.cursos.length > 0 && (
                              <div className={esCruce ? "space-y-0.5 rounded-md border-2 border-dashed border-red-500 p-1.5" : "space-y-0.5"}>
                                {esCruce && <div className="text-[10px] font-bold uppercase text-red-600">Cruce</div>}
                                {celda.cursos.map((curso, idx) => (
                                  <div key={idx}>
                                    {idx > 0 && <span className="text-slate-900 font-bold"> | </span>}
                                    <span className="text-slate-900 font-semibold">
                                      {curso.curso}
                                      {curso.modalidad && ` (${curso.modalidad})`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <p className="text-teal-700 text-sm">
                <strong>Total de cursos:</strong> {cursosSeleccionados.length} •{" "}
                <strong>Total de créditos:</strong>{" "}
                {cursos
                  .filter((c) => cursosSeleccionados.includes(c.codigo))
                  .reduce((sum, c) => sum + c.creditos, 0)}
              </p>
              {sinHorario.length > 0 && (
                <p className="text-amber-700 text-sm mt-2">
                  <strong>Sin horario cargado:</strong> {sinHorario.map((c) => c.nombre).join(", ")}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}