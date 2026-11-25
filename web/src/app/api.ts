// Llamadas a la API FastAPI (nginx reenvía /api al contenedor "api")
export async function api<T = any>(ruta: string, opciones: RequestInit = {}): Promise<T> {
  const r = await fetch(`/api${ruta}`, {
    ...opciones,
    headers: { "Content-Type": "application/json", ...(opciones.headers || {}) },
  });
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok) {
    const d = cuerpo.detail;
    // FastAPI devuelve detail como texto, lista de errores o lista de objetos de validación
    throw new Error(Array.isArray(d) ? d.map((e: any) => e.msg ?? e).join(" · ") : d || `Error ${r.status}`);
  }
  return cuerpo;
}

export const post = <T = any>(ruta: string, datos: unknown, headers?: Record<string, string>) =>
  api<T>(ruta, { method: "POST", body: JSON.stringify(datos), headers });

export const caja = "bg-white border border-slate-200 rounded-3xl p-6 shadow-sm";
export const campo = "w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4A6DFF] focus:ring-4 focus:ring-[#4A6DFF]/10 transition-shadow";
export const botonPrimario = "px-6 py-3 bg-gradient-to-r from-[#4A6DFF] to-[#7A5BFF] text-white rounded-xl shadow-md shadow-[#4A6DFF]/20 hover:shadow-lg hover:shadow-[#4A6DFF]/30 transition-all duration-200 disabled:opacity-50";
