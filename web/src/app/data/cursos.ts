// Fuente única: la API (chat asistente) lee el mismo cursos.json.
import cursos from "./cursos.json";

export const cursosData = cursos;

// Dos planes conviven: el 17xxx y el nuevo 26xxx (que empezó con el II semestre)
export type Malla = "17" | "26";
export const MALLAS: { id: Malla; nombre: string }[] = [
  { id: "17", nombre: "Malla actual (17xxx)" },
  { id: "26", nombre: "Malla nueva (26xxx)" },
];

// Abril–agosto se dictan los semestres impares y septiembre–diciembre los pares.
// Enero–marzo son vacaciones: se muestran los impares, que son los que vienen.
const PARES = new Date().getMonth() + 1 >= 9;
export const SEMESTRES_AHORA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((s) => (s % 2 === 0) === PARES);
export const PERIODO = PARES ? "Semestres pares · septiembre a diciembre" : "Semestres impares · abril a agosto";

/** Créditos que lleva un semestre: los obligatorios más UN electivo (en cada semestre se elige solo uno).
 *  Si sus electivos valen distinto (II de la 26xxx: talleres de 1 e idiomas de 2) devuelve un rango. */
export function creditosSemestre(cursos: { tipo: string; creditos: number }[]): string {
  const ob = cursos.filter((c) => c.tipo !== "Electivo").reduce((s, c) => s + c.creditos, 0);
  const el = cursos.filter((c) => c.tipo === "Electivo").map((c) => c.creditos);
  if (!el.length) return `${ob}`;
  const [min, max] = [ob + Math.min(...el), ob + Math.max(...el)];
  return min === max ? `${min}` : `${min}–${max}`;
}
