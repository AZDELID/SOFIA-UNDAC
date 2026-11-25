import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cursosData, MALLAS, type Malla } from "../data/cursos";
import { RutaPracticas } from "./RutaPracticas";

type Curso = {
  codigo: string; nombre: string; semestre: number; creditos: number;
  tipo: string; prerrequisitos: string[]; malla: string;
};

const CURSOS = cursosData as Curso[];
const ROMANOS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
// Reglamento, Art. 11: prácticas con el VII semestre aprobado o su equivalente de 154 créditos
const META = 154;

export function Practicas({ onFut }: { onFut: (clave: string) => void }) {
  const [pestana, setPestana] = useState<"creditos" | "ruta">("creditos");
  const [malla, setMalla] = useState<Malla>("17");
  const [llevados, setLlevados] = useState<Set<string>>(new Set());

  const cursos = CURSOS.filter((c) => c.malla === malla);
  const nombre = new Map(cursos.map((c) => [c.codigo, c.nombre]));
  const semestres = ROMANOS.map((r, i) => ({ r, lista: cursos.filter((c) => c.semestre === i + 1) }));
  const esElectivo = (c: Curso) => c.tipo === "Electivo";

  const creditos = cursos.filter((c) => llevados.has(c.codigo)).reduce((s, c) => s + c.creditos, 0);
  // Total de la carrera: obligatorios + un electivo por semestre (el marcado o, si no hay, el de menos créditos)
  const total = semestres.reduce((s, { lista }) => {
    const ob = lista.filter((c) => !esElectivo(c)).reduce((t, c) => t + c.creditos, 0);
    const el = lista.filter(esElectivo);
    if (!el.length) return s + ob;
    const elegido = el.find((c) => llevados.has(c.codigo));
    return s + ob + (elegido?.creditos ?? Math.min(...el.map((c) => c.creditos)));
  }, 0);
  const puede = creditos >= META;

  const cambiar = (c: Curso) => {
    const n = new Set(llevados);
    if (n.has(c.codigo)) n.delete(c.codigo);
    else {
      // solo un electivo por semestre: marcar uno desmarca el otro
      if (esElectivo(c)) cursos.filter((o) => esElectivo(o) && o.semestre === c.semestre).forEach((o) => n.delete(o.codigo));
      n.add(c.codigo);
    }
    setLlevados(n);
  };

  // «Marcar todos» marca los obligatorios; el electivo lo elige el estudiante. Desmarcar limpia todo el semestre.
  const marcarSemestre = (lista: Curso[], marcar: boolean) => {
    const n = new Set(llevados);
    for (const c of lista) {
      if (!marcar) n.delete(c.codigo);
      else if (!esElectivo(c)) n.add(c.codigo);
    }
    setLlevados(n);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-3">Prácticas Preprofesionales</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Suma tus créditos y sigue la ruta paso a paso. Puedes hacer prácticas con el VII semestre aprobado o {META} créditos.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {([["creditos", "Mis créditos"], ["ruta", "Ruta de prácticas"]] as const).map(([id, texto]) => (
            <button
              key={id}
              onClick={() => setPestana(id)}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                pestana === id ? "bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white shadow-lg shadow-[#4A6DFF]/30" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {texto}
            </button>
          ))}
        </div>

        {pestana === "ruta" ? <RutaPracticas onFut={onFut} /> : <>
        {/* Malla y avance de la carrera: arriba, sin quedarse fijo */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {MALLAS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMalla(m.id); setLlevados(new Set()); }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  malla === m.id ? "bg-[#4A6DFF] text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {m.nombre}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-600">
            Carrera: <strong className="text-slate-900">{creditos} / {total}</strong> créditos ({Math.round((creditos / total) * 100)}%)
          </div>
        </div>

        {/* Barra fija y compacta (en el celular ocupa ~60 px) mientras se marcan los cursos */}
        <div className="sticky top-16 md:top-20 z-10 bg-white/95 backdrop-blur rounded-2xl border border-slate-200 px-4 py-3 md:p-5 mb-6 md:mb-8 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xl md:text-3xl font-bold text-slate-900">{creditos} <span className="text-sm md:text-base font-normal text-slate-500">créditos</span></span>
            {puede ? (
              <button onClick={() => { setPestana("ruta"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors">
                <CheckCircle2 size={18} /> Ya puedes<span className="hidden sm:inline">: empieza tu ruta de prácticas</span> →
              </button>
            ) : (
              <span className="text-sm font-semibold text-slate-600">Te {META - creditos === 1 ? "falta" : "faltan"} {META - creditos}<span className="hidden sm:inline"> para las prácticas</span></span>
            )}
          </div>
          <div className="h-2 md:h-3 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={META} aria-valuenow={creditos}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${puede ? "bg-emerald-500" : "bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF]"}`}
              style={{ width: `${Math.min(100, (creditos / META) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {semestres.map(({ r, lista }) => {
            const obligatorios = lista.filter((c) => !esElectivo(c));
            const electivos = lista.filter(esElectivo);
            const todos = obligatorios.every((c) => llevados.has(c.codigo));
            const delSemestre = lista.filter((c) => llevados.has(c.codigo)).reduce((s, c) => s + c.creditos, 0);
            const fila = (c: Curso) => {
              const faltan = llevados.has(c.codigo) ? c.prerrequisitos.filter((p) => !llevados.has(p)) : [];
              return (
                <label key={c.codigo} className="flex items-center gap-3 min-h-11 py-2 cursor-pointer rounded-lg hover:bg-slate-50 -mx-2 px-2">
                  <input
                    type="checkbox"
                    checked={llevados.has(c.codigo)}
                    onChange={() => cambiar(c)}
                    className="w-5 h-5 shrink-0 rounded accent-[#4A6DFF]"
                  />
                  <span className="flex-1 text-sm">
                    <span className="text-slate-900">{c.nombre}</span>
                    <span className="text-slate-400"> · {c.codigo} · {c.creditos} cr</span>
                    {faltan.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-amber-700 mt-0.5">
                        <AlertTriangle size={12} /> Falta su prerrequisito: {faltan.map((p) => nombre.get(p) ?? p).join(", ")}
                      </span>
                    )}
                  </span>
                </label>
              );
            };
            return (
              <div key={r} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <h2 className="text-slate-900 text-lg font-semibold">{r} semestre</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500">{delSemestre} cr</span>
                    <label className="flex items-center gap-2 min-h-11 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={todos}
                        onChange={() => marcarSemestre(lista, !todos)}
                        className="w-5 h-5 rounded accent-[#4A6DFF]"
                      />
                      Marcar todos
                    </label>
                  </div>
                </div>
                {obligatorios.map(fila)}
                {electivos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Electivo · elige solo uno</p>
                    {electivos.map(fila)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>}
      </div>
    </div>
  );
}
