import { completarCorreo } from "@/lib/validadores";

// Campos que solo llevan números, con su largo máximo
const SOLO_NUMEROS: Record<string, number> = { dni: 8, codigo: 12, celular: 9 };

export default function Campo({
  clave,
  etiqueta,
  obligatorio,
  placeholder,
  ayuda,
  error,
  valor,
  onChange,
  opciones,
  sugerencia,
}: {
  clave: string;
  etiqueta: string;
  obligatorio: boolean;
  placeholder: string;
  ayuda: string;
  error?: string;
  valor: string;
  onChange: (v: string) => void;
  opciones?: string[];
  sugerencia?: string;
}) {
  const esArea = clave === "domicilio" || clave === "fundamentacion_libre";
  const largoNum = SOLO_NUMEROS[clave];
  const claseBase = `w-full border rounded-sm px-2.5 py-2 text-[12px] bg-bg-card focus:outline-none focus:border-borde-focus ${
    error ? "border-rojo" : "border-borde"
  }`;
  // id + aria-invalid: el Wizard busca el primer campo con error para subir hasta él
  const comunes = { id: `campo-${clave}`, "aria-invalid": error ? true : undefined, className: claseBase };
  return (
    <div>
      <label htmlFor={`campo-${clave}`} className="block text-[11px] font-semibold text-titulo mb-1">
        {etiqueta} {obligatorio && <span className="text-rojo">*</span>}
      </label>
      {opciones ? (
        <select {...comunes} value={valor} onChange={(e) => onChange(e.target.value)}>
          <option value="">-- Selecciona --</option>
          {opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : esArea ? (
        <textarea {...comunes} placeholder={placeholder} value={valor} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          {...comunes}
          placeholder={placeholder || (sugerencia ? `Ej.: ${sugerencia}` : "")}
          value={valor}
          inputMode={largoNum ? "numeric" : undefined}
          maxLength={largoNum}
          // borra letras, espacios y guiones al escribir o pegar
          onChange={(e) => onChange(largoNum ? e.target.value.replace(/\D/g, "") : e.target.value)}
          onBlur={clave === "correo" ? () => onChange(completarCorreo(valor)) : undefined}
        />
      )}
      {sugerencia && !valor && (
        <button
          type="button"
          onClick={() => onChange(sugerencia)}
          className="mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-sm border border-borde text-titulo hover:border-borde-focus"
        >
          Usar {sugerencia}
        </button>
      )}
      {error ? (
        <p className="text-[10px] text-rojo font-semibold mt-1">{error}</p>
      ) : ayuda ? (
        <p className="text-[10px] text-hint mt-1">{ayuda}</p>
      ) : null}
    </div>
  );
}
