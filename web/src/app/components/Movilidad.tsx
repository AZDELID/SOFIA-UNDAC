import { Info, CheckCircle2, FileText, ArrowRight, Mail, Phone, ListChecks, MapPin, ChartColumn, Building2, Cpu } from "lucide-react";
import { Tarjeta } from "./Detalle";
import { LineaTiempo, type PasoRuta } from "./LineaTiempo";

// Fuentes (revisadas el 26-11-2026):
//  - Reglamento PROMOERPU, Red Peruana de Universidades (anexo 1, ago. 2025): requisitos, créditos, costos, reconocimiento.
//  - Convocatoria RPU 2027-1 publicada por la UNDAC en rpu.edu.pe: documentos y fechas.
//  - Oficina de Cooperación y Relaciones Internacionales (undac.edu.pe) y sus resúmenes de movilidad 2024–2026.
// La UNDAC no publica bases propias en su web: al salir una convocatoria nueva, se cambian aquí.
type Paso = PasoRuta & { fut?: { clave: string; boton: string } };

const PASOS: Paso[] = [
  {
    titulo: "Verifica que cumples",
    texto: "Haber sido estudiante regular al menos cinco ciclos y estar en el tercio superior de tu promoción. Las convocatorias de la RPU piden estar desde el V semestre y en el quinto o tercio superior (o primeros puestos).",
    ref: "PROMOERPU, Art. 9",
  },
  {
    titulo: "Elige universidad y cursos",
    texto: "Cada universidad de la RPU publica sus plazas y las sumillas de sus cursos. Arma una lista de 14 a 22 créditos y pide a tu Facultad que la apruebe: esa lista es la que después te reconocen.",
    ref: "PROMOERPU, Art. 3, 9 y 13",
  },
  {
    titulo: "Reúne los documentos",
    texto: "Formulario de postulación, carta de presentación de tu facultad, historial de notas visado, constancia de tercio o quinto superior, copia de DNI, certificado de salud y un seguro de salud y accidentes con cobertura nacional (SIS u otro).",
    ref: "PROMOERPU, Art. 9 · Convocatoria RPU 2027-1",
    fut: { clave: "constancia_egresado", boton: "Pedir constancia de tercio superior" },
  },
  {
    titulo: "Postula por la Oficina de Cooperación",
    texto: "La oficina presenta tu candidatura a la universidad que elegiste; tú le acreditas los requisitos dentro de los plazos de esa universidad.",
    plazo: "Ciclo 2027-1: la convocatoria RPU de la UNDAC va del 30 nov. 2026 al 12 ene. 2027",
    ref: "PROMOERPU, Art. 9",
  },
  {
    titulo: "Resultados y doble matrícula",
    texto: "Si te aceptan, te matriculas como alumno regular en la universidad de destino y también en la UNDAC ese mismo ciclo. En destino no pagas matrícula ni derechos académicos, y no te exigen sus prerrequisitos.",
    plazo: "Ciclo 2027-1: resultados el 8 de marzo · matrícula en marzo de 2027",
    ref: "PROMOERPU, Art. 11, 14 y 15",
  },
  {
    titulo: "Estudia un ciclo fuera",
    texto: "Es un solo ciclo, sin prórroga. Transporte, alojamiento y alimentación corren por tu cuenta, aunque la UNDAC da una subvención (mira la tabla). Una falta allá se sanciona con el reglamento de la UNDAC.",
    plazo: "Ciclo de abril a julio de 2027",
    ref: "PROMOERPU, Art. 10, 15 y 16",
  },
  {
    titulo: "Vuelve y pide el reconocimiento",
    texto: "Con el documento oficial de notas de la universidad de destino, pide a tu Facultad que reconozca los cursos de tu lista aprobada. Si la nota mínima de aprobación es distinta, se aplica una escala de conversión.",
    ref: "PROMOERPU, Art. 17 a 19",
    fut: { clave: "convalidacion", boton: "Pedir convalidación de cursos" },
  },
];

// Resumen de Movilidad Estudiantil 2026-A, Oficina de Cooperación y Relaciones Internacionales (UNDAC)
const DESTINOS_2026A: [string, string, number, number][] = [
  ["U. N. Mayor de San Marcos", "Lima", 11, 5000],
  ["U. N. del Centro del Perú", "Huancayo", 9, 3000],
  ["U. N. Hermilio Valdizán", "Huánuco", 7, 3000],
  ["U. N. de Huancavelica", "Huancavelica", 3, 4000],
  ["U. N. San Antonio Abad", "Cusco", 2, 5000],
  ["Pontificia U. Católica del Perú", "Lima", 1, 5000],
  ["U. N. de Ingeniería", "Lima", 1, 5000],
  ["U. Peruana Cayetano Heredia", "Lima", 1, 5000],
  ["Universidad El Bosque", "Bogotá, Colombia", 3, 10000],
];

// De la «Relación Movilidad Estudiantil Académica UNDAC 2026 A» (contados a mano; sin nombres)
const SISTEMAS_2026A: [string, string, number][] = [
  ["U. N. Mayor de San Marcos", "Lima", 2],
  ["U. N. Hermilio Valdizán", "Huánuco", 2],
  ["U. N. de Ingeniería", "Lima", 1],
];
const POR_ESCUELA_2026A: [string, number][] = [
  ["Administración", 11], ["Comunicación", 6], ["Educación", 5], ["Sistemas", 5],
  ["Economía", 4], ["Derecho", 3], ["Agronomía", 2], ["Odontología", 2],
];

const POR_ANIO: [string, number][] = [["2023", 4], ["2024", 49], ["2025", 59], ["2026", 90]];

const REQUISITOS = [
  "Al menos cinco ciclos como estudiante regular.",
  "Tercio superior de tu promoción, acreditado por la UNDAC.",
  "Seguro de salud y contra accidentes con cobertura nacional.",
  "Historial de notas visado.",
  "Lista de cursos aprobada por tu Facultad (14 a 22 créditos).",
  "Solo un ciclo por estudiante, sin prórrogas.",
];

const soles = (n: number) => `S/ ${n.toLocaleString("es-PE")}`;

export function Movilidad({ onFut }: { onFut: (clave: string) => void }) {
  const maximo = Math.max(...POR_ANIO.map(([, n]) => n));
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl text-slate-900 mb-3">Movilidad Estudiantil</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Opcional desde el V semestre: estudia un ciclo en otra universidad del Perú o del extranjero y vuelve con los cursos reconocidos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info size={18} className="shrink-0 mt-0.5" />
          <p>
            Basado en el <strong>Reglamento de Movilidad de la Red Peruana de Universidades (RPU)</strong>, de la que la UNDAC es miembro,
            y en los resúmenes de la Oficina de Cooperación y Relaciones Internacionales. La UNDAC no publica bases propias en su web:
            confirma requisitos, fechas y subvención con la oficina antes de postular.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-slate-900 text-xl font-semibold mb-6">Ruta paso a paso</h2>
            <LineaTiempo
              pasos={PASOS}
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

          <div className="space-y-6 h-fit min-w-0">
            <Tarjeta titulo="Requisitos" nota="Reglamento PROMOERPU, Art. 9 y 10" icono={ListChecks} tono="verde">
              <ul className="space-y-3">
                {REQUISITOS.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" /> {r}
                  </li>
                ))}
              </ul>
            </Tarjeta>

            <Tarjeta titulo="A dónde fueron en 2026-A" nota="38 estudiantes de la UNDAC y la subvención que recibió cada uno." icono={MapPin} tono="azul">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
                    <th className="py-1.5 font-medium">Universidad</th>
                    <th className="py-1.5 font-medium text-right">Est.</th>
                    <th className="py-1.5 pl-3 font-medium text-right">Subvención</th>
                  </tr>
                </thead>
                <tbody>
                  {DESTINOS_2026A.map(([u, ciudad, n, s]) => (
                    <tr key={u} className="border-b border-slate-100 last:border-0 transition-colors hover:bg-[color-mix(in_oklab,var(--tono)_7%,transparent)]">
                      <td className="py-1.5 pr-2">
                        <span className="text-slate-700">{u}</span>
                        <span className="block text-xs text-slate-400">{ciudad}</span>
                      </td>
                      <td className="py-1.5 text-right font-mono font-semibold text-[var(--tono)]">{n}</td>
                      <td className="py-1.5 pl-3 text-right font-mono text-slate-700 whitespace-nowrap">{soles(s)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Tarjeta>

            <Tarjeta titulo="Estudiantes de la UNDAC por año" icono={ChartColumn} tono="violeta">
              <ul className="space-y-2">
                {POR_ANIO.map(([anio, n]) => (
                  <li key={anio} className="grid grid-cols-[2.5rem_1fr_2rem] items-center gap-2 text-sm">
                    <span className="font-mono text-slate-500">{anio}</span>
                    <span className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <span className="crecer block h-full rounded-full bg-[var(--tono)]" style={{ width: `${(n / maximo) * 100}%` }} />
                    </span>
                    <span className="font-mono text-right text-slate-700">{n}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-3">En 2026, 77 de los 90 fueron por la RPU. De 2020 a 2022 no hubo.</p>
            </Tarjeta>

            <Tarjeta titulo="Oficina de Cooperación y Relaciones Internacionales" nota="Depende del Rectorado. Coordina la movilidad y la RPU en la UNDAC." icono={Building2} tono="celeste">
              <p className="text-sm text-slate-700 font-medium">Mag. José Nieto Daza</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li><a href="mailto:relacionesinternacionales@undac.edu.pe" className="inline-flex items-center gap-2 text-blue-700 hover:underline break-all"><Mail size={14} className="shrink-0" /> relacionesinternacionales@undac.edu.pe</a></li>
                <li><a href="tel:963530016" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Phone size={14} className="shrink-0" /> 963 530 016</a></li>
              </ul>
            </Tarjeta>
          </div>
        </div>

        <h2 className="text-slate-900 text-2xl font-semibold mt-12 mb-6">Los de Sistemas</h2>
        <Tarjeta titulo="Estudiantes de Sistemas y Computación en 2026-A" nota="Relación de la Oficina de Cooperación, periodo 2026-A (salientes)." icono={Cpu} tono="turquesa">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1.3fr] gap-8 items-start">
            <div>
              <p className="font-display text-6xl font-bold text-[var(--tono)] leading-none">5<span className="text-2xl text-slate-400 font-medium"> / 38</span></p>
              <p className="text-sm text-slate-600 mt-2 max-w-[14rem]">
                estudiantes de la escuela salieron de movilidad: <strong className="text-slate-800">4 del IX semestre y 1 del V</strong>.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">A dónde fueron</p>
              <ul className="space-y-2">
                {SISTEMAS_2026A.map(([u, ciudad, n]) => (
                  <li key={u} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition-colors hover:border-[var(--tono)]">
                    <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-[var(--tono)] text-white font-mono font-bold">{n}</span>
                    <span className="text-sm">
                      <span className="text-slate-800 font-medium">{u}</span>
                      <span className="block text-xs text-slate-500">{ciudad}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Por escuela (2026-A)</p>
              <ul className="space-y-1.5">
                {POR_ESCUELA_2026A.map(([escuela, n]) => {
                  const nuestra = escuela === "Sistemas";
                  return (
                    <li key={escuela} className="grid grid-cols-[8.5rem_1fr_1.5rem] items-center gap-2 text-sm">
                      <span className={nuestra ? "font-semibold text-slate-900" : "text-slate-600"}>{escuela}</span>
                      <span className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <span
                          className={`crecer block h-full rounded-full ${nuestra ? "bg-[var(--tono)]" : "bg-slate-300"}`}
                          style={{ width: `${(n / POR_ESCUELA_2026A[0][1]) * 100}%` }}
                        />
                      </span>
                      <span className={`font-mono text-right ${nuestra ? "font-bold text-[var(--tono)]" : "text-slate-700"}`}>{n}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Tarjeta>
      </div>
    </div>
  );
}
