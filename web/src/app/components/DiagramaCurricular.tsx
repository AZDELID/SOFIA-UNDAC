import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ZoomIn, ZoomOut, Maximize2, X, ArrowRight, ArrowLeft } from "lucide-react";
import { cursosData, creditosSemestre, SEMESTRES_AHORA } from "../data/cursos";
import { LOGOS, herramientasDe, urlLogo } from "../data/logos";

type Curso = (typeof cursosData)[number];
type Linea = { de: string; a: string; d: string };

const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const NOMBRE_RAMA: Record<string, string> = { redes: "Redes y Cloud", software: "Software", web: "Web Full Stack" };

// Colores del diagrama original: uno por semestre y uno por rama electiva ([fondo, texto])
const COLOR_SEMESTRE = ["#6cbf4b", "#14a058", "#16b3ad", "#1b5fc2", "#2b3a9f", "#5a2ea6", "#a01f8e", "#e53935", "#f5a524", "#f47c20"];
const COLOR_RAMA: Record<string, [string, string]> = {
  redes: ["#5fe3c5", "#0f3d35"],
  software: ["#ece444", "#3d3a05"],
  web: ["#9b6bf0", "#ffffff"],
};

// Altura (centro de la tarjeta) de cada curso, medida sobre la imagen original del plan.
// La columna sale del semestre. Música, Teatro y Quechua no estaban en la imagen.
const ALTURA: Record<string, number> = {
  // I
  "17201": 117, "17101": 158, "17104": 203, "17301": 379, "17103": 580, "17102": 630,
  // II
  "17202": 117, "17107": 243, "17302": 295, "17108": 530, "17106": 580, "17105": 630,
  // III
  "17204": 117, "17203": 158, "17205": 203, "17303": 295, "17112": 530, "17115": 580, "17113": 630,
  // IV
  "17210": 74, "17209": 117, "17116": 158, "17208": 203, "17207": 243, "17304": 295, "17206": 630,
  // V
  "17214": 74, "17212": 117, "17213": 203, "17215": 243, "17305": 295, "17306": 347, "17211": 630,
  // VI
  "17216": 74, "17310": 117, "17307": 295, "17309": 347, "17308": 418, "17217": 570, "17311": 630,
  // VII
  "17219": 74, "17218": 243, "17312": 295, "17313": 347, "17315": 400, "17314": 445, "17316": 530, "17317": 580, "17318": 630,
  // VIII
  "17221": 74, "17222": 158, "17220": 243, "17319": 295, "17320": 400, "17321": 466, "17322": 530, "17323": 580, "17324": 630,
  // IX
  "17224": 74, "17223": 158, "17325": 243, "17326": 295, "17328": 400, "17327": 466, "17329": 530, "17330": 580, "17331": 630,
  // X
  "17226": 74, "17225": 158, "17332": 203, "17334": 295, "17333": 347, "17336": 400, "17335": 630,
};

// Medidas en píxeles: escala de la imagen, ancho de columna, ancho de tarjeta, margen y cabecera
const ESCALA = 1.6, PASO = 184, ANCHO = 136, MARGEN = 24, CABECERA = 64;
const xTarjeta = (col: number) => MARGEN + col * PASO + (PASO - ANCHO) / 2;
const yPx = (alto: number) => CABECERA + (alto - 60) * ESCALA;
const ANCHO_TOTAL = MARGEN * 2 + 10 * PASO;

/** Une los puntos con tramos rectos y esquinas redondeadas (solo tramos horizontales o verticales). */
function camino(p: [number, number][], radio = 8): string {
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const [ax, ay] = p[i - 1], [bx, by] = p[i], [cx, cy] = p[i + 1];
    const r = Math.min(radio, Math.hypot(bx - ax, by - ay) / 2, Math.hypot(cx - bx, cy - by) / 2);
    d += ` L${bx - Math.sign(bx - ax) * r},${by - Math.sign(by - ay) * r} Q${bx},${by} ${bx + Math.sign(cx - bx) * r},${by + Math.sign(cy - by) * r}`;
  }
  return d + ` L${p[p.length - 1][0]},${p[p.length - 1][1]}`;
}

/** Todos los cursos alcanzables siguiendo `vecinos` (cadena completa, no solo el paso directo). */
function cadena(inicio: string, vecinos: Map<string, string[]>): Set<string> {
  const vistos = new Set<string>();
  const pila = [...(vecinos.get(inicio) ?? [])];
  while (pila.length) {
    const c = pila.pop()!;
    if (!vistos.has(c)) {
      vistos.add(c);
      pila.push(...(vecinos.get(c) ?? []));
    }
  }
  return vistos;
}

// Actividades extracurriculares (no son cursos); valen para las dos mallas y van al pie de su semestre
// `pagina`: la tarjeta lleva a su sección de SOFIA (Movilidad aún no tiene)
const ACTIVIDADES: { semestre: number; nombre: string; tipo: string; detalle: string; pagina?: "practicas" | "proyeccion" }[] = [
  { semestre: 5, nombre: "Movilidad estudiantil", tipo: "Opcional", detalle: "Un semestre en otra universidad; los requisitos dependen de la universidad de destino." },
  { semestre: 7, nombre: "Proyección Social", tipo: "Obligatoria", detalle: "Desde el VII semestre: 180 horas en brigada con la comunidad.", pagina: "proyeccion" },
  { semestre: 8, nombre: "Prácticas Preprofesionales", tipo: "Obligatoria", detalle: "Desde el VIII semestre, con 154 créditos o más. Es distinta del curso de prácticas.", pagina: "practicas" },
];

// Talleres de arte y Quechua de las dos mallas: siguen en los datos (lista, horarios, chat) pero no van en el mapa
const FUERA_DEL_MAPA = new Set(["17109", "17110", "17111", "17114", "26119", "26120", "26121", "26123"]);

/** Para una malla sin imagen (26xxx): cada curso va en la fila de su prerrequisito si está libre,
 *  así las cadenas quedan en línea recta; el resto ocupa la primera fila libre. Devuelve la altura en unidades de ALTURA. */
function alturasAuto(cursos: Curso[]): Map<string, number> {
  const fila = new Map<string, number>();
  for (let s = 1; s <= 10; s++) {
    const ocupadas = new Set<number>();
    const delSem = cursos.filter((c) => c.semestre === s);
    const preDe = (c: Curso) => c.prerrequisitos.find((p) => fila.has(p));
    for (const c of [...delSem.filter(preDe), ...delSem.filter((c) => !preDe(c))]) {
      const p = preDe(c);
      let f = p ? fila.get(p)! : 0;
      for (let d = 0; ; d++) {
        if (!ocupadas.has(f + d)) { f += d; break; }
        if (p && f - d >= 0 && !ocupadas.has(f - d)) { f -= d; break; }
      }
      ocupadas.add(f);
      fila.set(c.codigo, f);
    }
  }
  return new Map([...fila].map(([cod, f]) => [cod, 80 + f * 60]));
}

export function DiagramaCurricular({ cursos: todos, ramas, onHorario, onActividad }: {
  cursos: Curso[]; ramas: Record<string, string>; onHorario?: (codigo: string) => void;
  onActividad?: (pagina: "practicas" | "proyeccion") => void;
}) {
  const cursos = useMemo(() => todos.filter((c) => !FUERA_DEL_MAPA.has(c.codigo)), [todos]);
  const porCodigo = useMemo(() => new Map(cursos.map((c) => [c.codigo, c])), [cursos]);
  const semestres = useMemo(
    () => Array.from({ length: 10 }, (_, i) => cursos.filter((c) => c.semestre === i + 1)),
    [cursos],
  );
  // La malla 17xxx usa las alturas de la imagen; un curso que no esté en ALTURA se acomoda solo
  const centroY = useMemo(() => {
    const auto = alturasAuto(cursos.filter((c) => !(c.codigo in ALTURA)));
    return new Map(cursos.map((c) => [c.codigo, yPx(ALTURA[c.codigo] ?? auto.get(c.codigo)!)]));
  }, [cursos]);
  const yActividades = Math.max(...centroY.values()) + 120;
  const altoTotal = yActividades + 95; // espacio para la tarjeta más alta (Prácticas, con «Ver ruta»)

  // Grafo en los dos sentidos: lo que pide cada curso y lo que habilita
  const [requiere, habilita] = useMemo(() => {
    const req = new Map<string, string[]>();
    const hab = new Map<string, string[]>();
    for (const c of cursos) {
      const pre = c.prerrequisitos.filter((p) => porCodigo.has(p));
      req.set(c.codigo, pre);
      for (const p of pre) hab.set(p, [...(hab.get(p) ?? []), c.codigo]);
    }
    return [req, hab];
  }, [cursos, porCodigo]);

  const [fijo, setFijo] = useState<string | null>(null);
  const [encima, setEncima] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const activo = encima ?? fijo;

  const antes = useMemo(() => (activo ? cadena(activo, requiere) : new Set<string>()), [activo, requiere]);
  const despues = useMemo(() => (activo ? cadena(activo, habilita) : new Set<string>()), [activo, habilita]);
  const resaltado = (codigo: string) => !activo || codigo === activo || antes.has(codigo) || despues.has(codigo);

  // Al cambiar el zoom, el scroll se escala igual para seguir mirando el mismo punto
  const visor = useRef<HTMLDivElement>(null);
  const zoomPrevio = useRef(zoom);
  useLayoutEffect(() => {
    const v = visor.current;
    const r = zoom / zoomPrevio.current;
    if (v && r !== 1) {
      v.scrollLeft *= r;
      v.scrollTop *= r;
    }
    zoomPrevio.current = zoom;
  }, [zoom]);

  // Posiciones fijas; del navegador solo se mide la altura de cada tarjeta (depende del largo del nombre)
  const tarjetas = useRef(new Map<string, HTMLButtonElement>());
  const [lineas, setLineas] = useState<Linea[]>([]);

  useLayoutEffect(() => {
    const medir = () => {
      const alto = new Map<string, number>();
      for (const [cod, el] of tarjetas.current) alto.set(cod, el.offsetHeight);
      const col = (cod: string) => porCodigo.get(cod)!.semestre - 1;

      // Una línea horizontal a la altura y está libre si no pisa ninguna tarjeta de las columnas intermedias
      const libre = (y: number, c1: number, c2: number) =>
        ![...alto].some(([cod, h]) => col(cod) > c1 && col(cod) < c2 && Math.abs(y - centroY.get(cod)!) < h / 2 + 6);
      const alturas = [...new Set(centroY.values())];

      // 1.ª pasada: por dónde va cada línea. Los tramos verticales van por el pasillo entre semestres
      // (pasillo g = entre la columna g-1 y la g); dentro de un pasillo, cada curso de origen tiene su carril.
      type Ruta = { de: string; a: string; ys: number[]; pasillos: number[] };
      const rutas: Ruta[] = [];
      const carriles = new Map<number, string[]>();
      for (const [a, pres] of requiere) {
        for (const de of pres) {
          if (!alto.has(a) || !alto.has(de)) continue;
          const c1 = col(de), c2 = col(a);
          const y1 = centroY.get(de)!, y2 = centroY.get(a)!;
          let r: Ruta;
          if (c1 === c2) r = { de, a, ys: [y1, y2], pasillos: [c1] }; // mismo semestre: rodea por la izquierda
          else if (y1 === y2 && libre(y1, c1, c2)) r = { de, a, ys: [y1], pasillos: [] }; // recta
          else if (libre(y1, c1, c2)) r = { de, a, ys: [y1, y2], pasillos: [c2] }; // cambia de altura al llegar
          else if (libre(y2, c1, c2)) r = { de, a, ys: [y1, y2], pasillos: [c1 + 1] }; // cambia de altura al salir
          else {
            // ninguna de las dos alturas está libre: viaja por la altura libre más cercana
            const medio = (y1 + y2) / 2;
            const ym = alturas.filter((y) => libre(y, c1, c2)).sort((p, q) => Math.abs(p - medio) - Math.abs(q - medio))[0];
            r = ym === undefined ? { de, a, ys: [y1, y2], pasillos: [c2] } : { de, a, ys: [y1, ym, y2], pasillos: [c1 + 1, c2] };
          }
          for (const g of r.pasillos) {
            const l = carriles.get(g) ?? [];
            if (!l.includes(de)) l.push(de);
            carriles.set(g, l);
          }
          rutas.push(r);
        }
      }

      // 2.ª pasada: convierte alturas y pasillos en puntos
      const xPasillo = (g: number, de: string) => {
        const l = carriles.get(g)!;
        const base = g === 0 ? MARGEN / 2 : MARGEN + g * PASO;
        return base + (l.indexOf(de) - (l.length - 1) / 2) * 7;
      };
      setLineas(
        rutas.map(({ de, a, ys, pasillos }) => {
          const c1 = col(de), c2 = col(a);
          const p: [number, number][] = [[c1 === c2 ? xTarjeta(c1) : xTarjeta(c1) + ANCHO, ys[0]]];
          pasillos.forEach((g, i) => {
            const x = xPasillo(g, de);
            p.push([x, ys[i]], [x, ys[i + 1]]);
          });
          p.push([xTarjeta(c2), ys[ys.length - 1]]);
          return { de, a, d: camino(p) };
        }),
      );
    };
    medir();
    // si cambia la altura de una tarjeta (por ejemplo, al cargar la letra) se recalculan las líneas
    const obs = new ResizeObserver(medir);
    tarjetas.current.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [requiere, porCodigo, centroY]);

  const seleccionado = fijo ? porCodigo.get(fijo) : undefined;
  const nombres = (codigos: string[]) => codigos.map((c) => porCodigo.get(c)).filter(Boolean) as Curso[];
  const escala = zoom / 100;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl text-slate-900">Diagrama de Flujo Curricular</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-2 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors" title="Alejar" aria-label="Alejar">
            <ZoomOut className="w-5 h-5 text-slate-700" />
          </button>
          <span className="text-slate-600 text-sm w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(150, z + 10))} className="p-2 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors" title="Acercar" aria-label="Acercar">
            <ZoomIn className="w-5 h-5 text-slate-700" />
          </button>
          <button onClick={() => setZoom(100)} className="p-2 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors" title="Restablecer zoom" aria-label="Restablecer zoom">
            <Maximize2 className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>
      <p className="text-slate-500 text-sm mb-5">
        Borde punteado = electivo: en cada semestre eliges solo uno. Tarjetas blancas al pie = actividades extracurriculares. Pasa el mouse sobre un curso para ver qué necesitas antes <span className="inline-block w-3 h-3 rounded-sm bg-blue-500 align-middle" /> y qué te habilita después{" "}
        <span className="inline-block w-3 h-3 rounded-sm bg-emerald-500 align-middle" />. Haz clic para fijarlo y ver su ficha.
      </p>

      <div ref={visor} className="overflow-auto border border-slate-200 rounded-xl bg-[#f8fafc] dark:bg-[oklch(16%_0.03_265)]" style={{ maxHeight: "70vh" }}>
        {/* el contenedor externo toma el tamaño ya escalado para que el scroll llegue a todo */}
        <div style={{ width: ANCHO_TOTAL * escala, height: altoTotal * escala }}>
          <div
            className="relative origin-top-left transition-transform duration-200"
            style={{ width: ANCHO_TOTAL, height: altoTotal, transform: `scale(${escala})` }}
            onMouseLeave={() => setEncima(null)}
          >
            {/* caja de cada semestre con el borde de su color, como en el original */}
            {semestres.map((lista, i) => (
              <div
                key={`col-${i}`}
                className="absolute rounded-lg border-2 bg-white"
                style={{ left: MARGEN + i * PASO + 6, width: PASO - 12, top: 8, bottom: 8, borderColor: COLOR_SEMESTRE[i] + "99" }}
              >
                <div className="text-center pt-2">
                  <div className="text-sm font-bold text-slate-800">{ROMANOS[i]} semestre</div>
                  <div className="text-[11px] text-slate-500">{creditosSemestre(todos.filter((c) => c.semestre === i + 1))} créditos</div>
                </div>
              </div>
            ))}

            <svg className="absolute inset-0 pointer-events-none" width={ANCHO_TOTAL} height={altoTotal} aria-hidden="true">
              <defs>
                {[["gris", "#64748b"], ["azul", "#3b82f6"], ["verde", "#10b981"]].map(([id, color]) => (
                  <marker key={id} id={`flecha-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M0,0 L10,5 L0,10 z" fill={color} />
                  </marker>
                ))}
              </defs>
              {lineas.map((l) => {
                // línea azul: parte de lo que necesitas antes; verde: parte de lo que habilita
                const tipo = !activo ? "gris"
                  : (l.a === activo || antes.has(l.a)) && (l.de === activo || antes.has(l.de)) ? "azul"
                  : (l.de === activo || despues.has(l.de)) && (l.a === activo || despues.has(l.a)) ? "verde"
                  : null;
                const color = tipo === "azul" ? "#3b82f6" : tipo === "verde" ? "#10b981" : "#64748b";
                return (
                  <path
                    key={`${l.de}-${l.a}`}
                    d={l.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={tipo && tipo !== "gris" ? 2.5 : 1.5}
                    opacity={tipo ? 1 : 0.12}
                    markerEnd={`url(#flecha-${tipo ?? "gris"})`}
                    style={{ transition: "opacity .2s, stroke .2s" }}
                  />
                );
              })}
            </svg>

            {cursos.map((c) => {
              const rama = ramas[c.codigo];
              const [fondo, texto] = rama ? COLOR_RAMA[rama] : [COLOR_SEMESTRE[c.semestre - 1], "#ffffff"];
              const esActivo = c.codigo === activo;
              return (
                <button
                  key={c.codigo}
                  ref={(el) => { if (el) tarjetas.current.set(c.codigo, el); else tarjetas.current.delete(c.codigo); }}
                  title={`${c.codigo} · ${c.creditos} créditos${rama ? ` · ${NOMBRE_RAMA[rama]}` : ""}`}
                  onMouseEnter={() => setEncima(c.codigo)}
                  onFocus={() => setEncima(c.codigo)}
                  onBlur={() => setEncima(null)}
                  onClick={() => setFijo(fijo === c.codigo ? null : c.codigo)}
                  className={`absolute -translate-y-1/2 min-h-9 px-2 py-1.5 rounded-lg ${c.tipo === "Electivo" ? "border-2 border-dashed border-current" : ""} text-center text-[12px] leading-tight font-bold shadow-sm dark:ring-offset-[oklch(20.5%_0.034_265)] transition-[opacity,box-shadow] duration-200 ${
                    resaltado(c.codigo) ? "opacity-100" : "opacity-25"
                  } ${
                    esActivo ? "ring-[3px] ring-blue-500 ring-offset-2 shadow-lg" : antes.has(c.codigo) ? "ring-2 ring-blue-400 ring-offset-1" : despues.has(c.codigo) ? "ring-2 ring-emerald-400 ring-offset-1" : "hover:shadow-md"
                  }`}
                  style={{ left: xTarjeta(c.semestre - 1), top: centroY.get(c.codigo), width: ANCHO, background: fondo, color: texto }}
                >
                  <span className="block text-[10px] font-semibold opacity-80">{c.codigo} · {c.creditos} cr</span>
                  {c.nombre}
                </button>
              );
            })}

            {ACTIVIDADES.map((a) => {
              const destino = onActividad && a.pagina;
              // con sección propia la tarjeta es un botón; sin ella (Movilidad) solo informa
              const Etiqueta = destino ? "button" : "div";
              return (
                <Etiqueta
                  key={a.nombre}
                  title={a.detalle}
                  onClick={destino ? () => onActividad(destino) : undefined}
                  className={`absolute -translate-y-1/2 rounded-2xl border-2 bg-white px-2 py-2 text-center shadow-sm ${
                    destino ? "cursor-pointer transition-shadow hover:shadow-lg hover:ring-2 hover:ring-[#4A6DFF]/30" : ""
                  }`}
                  style={{ left: xTarjeta(a.semestre - 1), top: yActividades, width: ANCHO, borderColor: COLOR_SEMESTRE[a.semestre - 1] }}
                >
                  <span
                    className="mb-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase text-white"
                    style={{ background: a.tipo === "Obligatoria" ? "#e53935" : "#64748b" }}
                  >
                    {a.tipo}
                  </span>
                  <div className="text-[12px] font-bold leading-tight text-slate-800">{a.nombre}</div>
                  <div className="mt-1 text-[10px] leading-snug text-slate-500">{a.detalle}</div>
                  {destino && <div className="mt-1 text-[10px] font-semibold text-[#4A6DFF]">Ver ruta →</div>}
                </Etiqueta>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ficha del curso fijado con clic */}
      {seleccionado && (
        <div key={seleccionado.codigo} className="animate-entrada mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide">
                {ROMANOS[seleccionado.semestre - 1]} semestre · {seleccionado.creditos} créditos · {seleccionado.tipo}
                {ramas[seleccionado.codigo] ? ` · ${NOMBRE_RAMA[ramas[seleccionado.codigo]]}` : ""}
              </div>
              <h3 className="text-xl text-slate-900 mt-1">
                {seleccionado.nombre} <span className="text-slate-400 font-mono text-base">{seleccionado.codigo}</span>
              </h3>
            </div>
            <button onClick={() => setFijo(null)} className="p-1.5 rounded-lg hover:bg-blue-100 text-slate-500" aria-label="Cerrar ficha">
              <X size={18} />
            </button>
          </div>
          {seleccionado.recomendacion && <p className="text-slate-700 text-sm mt-3">{seleccionado.recomendacion}</p>}
          {herramientasDe(seleccionado.nombre).length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-medium text-slate-500 mb-2">Herramientas que se suelen usar</div>
              <div className="flex flex-wrap gap-2">
                {herramientasDe(seleccionado.nombre).map((a, i) => (
                  <span
                    key={a}
                    style={{ "--i": i } as CSSProperties}
                    className="cascada tema-claro inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 pl-1.5 pr-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                  >
                    <img src={urlLogo(a)} alt="" className="w-6 h-6 object-contain" />
                    {LOGOS[a]}
                  </span>
                ))}
              </div>
            </div>
          )}
          {onHorario && (SEMESTRES_AHORA.includes(seleccionado.semestre) ? (
            <button
              onClick={() => onHorario(seleccionado.codigo)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] px-4 py-2 text-sm text-white shadow-md shadow-[#4A6DFF]/20 hover:shadow-lg transition-shadow"
            >
              Agregar a mi horario <ArrowRight size={15} />
            </button>
          ) : (
            <p className="mt-4 text-xs text-slate-500">Este curso no se dicta en esta mitad del año.</p>
          ))}
          <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <div className="flex items-center gap-1.5 font-medium text-blue-700 mb-1.5"><ArrowLeft size={15} /> Necesitas aprobar antes</div>
              {nombres(requiere.get(seleccionado.codigo) ?? []).map((c) => (
                <button key={c.codigo} onClick={() => setFijo(c.codigo)} className="block text-left text-slate-700 hover:text-blue-700">• {c.nombre} <span className="text-slate-400">({c.codigo})</span></button>
              ))}
              {!requiere.get(seleccionado.codigo)?.length && <span className="text-slate-500">Ningún prerrequisito</span>}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-700 mb-1.5">Te habilita <ArrowRight size={15} /></div>
              {nombres(habilita.get(seleccionado.codigo) ?? []).map((c) => (
                <button key={c.codigo} onClick={() => setFijo(c.codigo)} className="block text-left text-slate-700 hover:text-emerald-700">• {c.nombre} <span className="text-slate-400">({c.codigo})</span></button>
              ))}
              {!habilita.get(seleccionado.codigo)?.length && <span className="text-slate-500">No es prerrequisito de otro curso</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
