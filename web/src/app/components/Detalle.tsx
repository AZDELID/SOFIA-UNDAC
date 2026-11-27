import type { CSSProperties, ReactNode } from "react";
import { Mail, type LucideIcon } from "lucide-react";

// Piezas que comparten Proyección Social, Prácticas y Movilidad para sus cuadros de información.
// Cada cuadro tiene un color (--tono): barra de arriba, ícono, viñetas, cifras y sombra lo toman de ahí.
// Son colores medios: se leen igual sobre blanco y sobre el fondo oscuro.
export const TONOS = {
  azul: "#4A6DFF", violeta: "#8b5cf6", turquesa: "#14b8a6", verde: "#10b981",
  naranja: "#f97316", rojo: "#ef4444", celeste: "#0ea5e9", rosa: "#ec4899",
} as const;
export type Tono = keyof typeof TONOS;

export function Tarjeta({ titulo, nota, icono: Icono, tono = "azul", children, className = "" }: {
  titulo: string; nota?: string; icono?: LucideIcon; tono?: Tono; children: ReactNode; className?: string;
}) {
  return (
    <section
      style={{ "--tono": TONOS[tono] } as CSSProperties}
      className={`revelar group relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-6 min-w-0 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--tono)_45%,transparent)] hover:shadow-[0_18px_40px_-20px_var(--tono)] ${className}`}
    >
      {/* barra de color: arranca corta y se completa al pasar el mouse */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-[0.2] bg-[var(--tono)] transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex items-start gap-3 mb-4">
        {Icono && (
          <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-[color-mix(in_oklab,var(--tono)_15%,transparent)] text-[var(--tono)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <Icono size={20} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-slate-900 font-semibold leading-snug">{titulo}</h3>
          {nota && <p className="text-slate-500 text-xs mt-0.5">{nota}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

// Las cifras (fechas, horas, créditos) se pintan del color del cuadro: el ojo las encuentra sin leer todo
const resaltar = (texto: string) =>
  texto.split(/(\d+(?:[.,–]\d+)*)/).map((parte, i) =>
    i % 2 ? <span key={i} className="font-semibold text-[var(--tono,inherit)]">{parte}</span> : parte,
  );

/** Lista con viñeta de color; un texto que empieza con «Título: » pone el título en negrita */
export function Lista({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-slate-600 list-disc pl-5 marker:text-[var(--tono,#cbd5e1)]">
      {items.map((t) => {
        const i = t.indexOf(": ");
        return (
          <li key={t}>
            {i > 0 && i < 40
              ? <><strong className="text-slate-800 font-semibold">{t.slice(0, i)}:</strong> {resaltar(t.slice(i + 2))}</>
              : resaltar(t)}
          </li>
        );
      })}
    </ul>
  );
}

const iniciales = (nombre: string) =>
  nombre.replace(/^(Mag|Dr|Dra|Ing|Lic|Bach|Econ)\.\s*/, "").split(" ").slice(0, 2).map((p) => p[0]).join("");

/** Personas del Directorio Institucional de la UNDAC: [cargo, nombre, correo] */
export function Contactos({ personas }: { personas: [string, string, string][] }) {
  return (
    <ul className="space-y-4 text-sm">
      {personas.map(([cargo, nombre, correo]) => (
        <li key={correo} className="flex gap-3">
          <span aria-hidden="true" className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-[var(--tono)] text-white text-xs font-bold">
            {iniciales(nombre)}
          </span>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">{cargo}</p>
            <p className="text-slate-800 font-medium">{nombre}</p>
            <a href={`mailto:${correo}`} className="inline-flex items-center gap-1.5 text-blue-700 hover:underline break-all">
              <Mail size={13} className="shrink-0" /> {correo}
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
