import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

export type PasoRuta = { titulo: string; texto: string; plazo?: string; ref: string };

// Línea de tiempo vertical: número a la izquierda, nodo sobre la línea y detalle a la derecha.
// Cada paso toma un tono del degradado cian → violeta → rosa; --l sube la luminosidad en oscuro para que se lea.
export function LineaTiempo<T extends PasoRuta>({ pasos, extra }: { pasos: T[]; extra?: (p: T) => ReactNode }) {
  const color = (i: number) => `oklch(var(--l) 0.16 ${210 + (i * 150) / Math.max(pasos.length - 1, 1)})`;
  const fila = "grid grid-cols-[3.75rem_1.25rem_1fr] sm:grid-cols-[5.5rem_1.5rem_1fr] gap-x-3 sm:gap-x-4";

  return (
    <ol className="[--l:54%] dark:[--l:76%]">
      {pasos.map((p, i) => (
        <li key={p.titulo} className={fila}>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: color(i) }}>Paso</p>
            <p className="font-mono text-2xl sm:text-3xl font-bold leading-none text-slate-800">{String(i + 1).padStart(2, "0")}</p>
            {/* el mismo número en binario, guiño a la carrera */}
            <p className="hidden sm:block font-mono text-[10px] text-slate-400 mt-1">0b{(i + 1).toString(2).padStart(4, "0")}</p>
          </div>

          <div className="relative flex justify-center" aria-hidden="true">
            <span className={`absolute ${i === 0 ? "top-2" : "top-0"} bottom-0 w-1 rounded-full`} style={{ background: color(i) }} />
            <span className="relative mt-1 h-4 w-4 rounded-full border-[3px] bg-white" style={{ borderColor: color(i) }} />
          </div>

          <div className="pb-8 min-w-0">
            <h3 className="font-bold uppercase tracking-wide text-[15px] leading-snug" style={{ color: color(i) }}>{p.titulo}</h3>
            <p className="text-slate-600 text-sm mt-1.5">{p.texto}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {p.plazo && (
                // El plazo se lee como un error de compilación: rojo, monoespaciado, imposible de pasar por alto
                <span className="inline-flex items-start gap-1.5 rounded-md border border-red-500/30 border-l-4 border-l-red-500 bg-red-50 px-2 py-1 font-mono text-xs text-red-700">
                  <CircleAlert size={13} className="shrink-0 mt-px animate-pulse" />
                  <span><span className="font-bold">plazo:</span> {p.plazo}</span>
                </span>
              )}
              <span className="font-mono text-xs text-slate-400">// {p.ref}</span>
            </div>
            {extra?.(p)}
          </div>
        </li>
      ))}

      {/* Remate de la línea, como el fin de un programa */}
      <li className={fila} aria-hidden="true">
        <div />
        <div className="flex flex-col items-center">
          <span className="h-5 w-1 rounded-full" style={{ background: color(pasos.length - 1) }} />
          <span className="h-4 w-4 rounded-full" style={{ background: color(pasos.length - 1) }} />
        </div>
        <p className="self-end font-mono text-xs text-slate-400">exit 0 · ruta completa</p>
      </li>
    </ol>
  );
}
