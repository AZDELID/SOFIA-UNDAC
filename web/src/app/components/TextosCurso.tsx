import { BookOpen, ClipboardList, CheckCircle2, Target } from "lucide-react";
import { cursosData } from "../data/cursos";

type Curso = (typeof cursosData)[number];

/** De qué va, qué se hace, cómo aprobarlo y para qué sirve: la misma ficha en el mapa y en la lista. */
export function TextosCurso({ curso }: { curso: Curso }) {
  const bloque = (Icono: typeof BookOpen, titulo: string, cuerpo: React.ReactNode) => (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><Icono size={14} /> {titulo}</div>
      <div className="text-slate-700 mt-0.5">{cuerpo}</div>
    </div>
  );
  return (
    <div className="space-y-3 text-sm">
      {bloque(BookOpen, "De qué va", curso.sumilla)}
      {bloque(ClipboardList, "Qué se hace", curso.que_se_hace)}
      {bloque(CheckCircle2, "Cómo aprobarlo", (
        <ul className="list-disc pl-5 space-y-0.5 marker:text-slate-400">
          {curso.como_aprobar.map((c) => <li key={c}>{c}</li>)}
        </ul>
      ))}
      {bloque(Target, "Para qué te sirve", curso.importancia)}
      <p className="text-[11px] text-slate-400">Textos referenciales: el sílabo de tu docente manda.</p>
    </div>
  );
}
