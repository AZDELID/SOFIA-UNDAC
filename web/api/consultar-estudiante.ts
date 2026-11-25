// Función de Vercel: autollenado del FUT por código (no usa IA). Igual que /api/consultar-estudiante de FastAPI.
// La URL de la API UNDAC lleva tokens: vive en la variable UNDAC_API_BASE_URL de Vercel, nunca en el navegador.
import { facultadDeEscuela } from "../src/app/lib/facultades.js";

const VENTANA_MS = 10 * 60 * 1000;
const MAX_CONSULTAS = 10;
// shortcut: el límite vive en la memoria de cada instancia de Vercel, solo frena el barrido; usar Vercel KV si abusan
const consultasPorIp = new Map<string, number[]>();

function excedeLimite(ip: string): boolean {
  const ahora = Date.now();
  if (consultasPorIp.size > 5000) consultasPorIp.clear();
  const recientes = (consultasPorIp.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  const excede = recientes.length >= MAX_CONSULTAS;
  if (!excede) recientes.push(ahora);
  consultasPorIp.set(ip, recientes);
  return excede;
}

const error = (mensaje: string, status: number) => Response.json({ error: mensaje }, { status });

export async function POST(request: Request) {
  const base = process.env.UNDAC_API_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return error("El autollenado no está configurado en este servidor (falta UNDAC_API_BASE_URL).", 500);

  const cuerpo = await request.json().catch(() => null);
  const codigo = String(cuerpo?.codigo ?? "").trim();
  if (!/^\d{6,12}$/.test(codigo)) return error("El código de matrícula debe ser numérico (6 a 12 dígitos).", 400);

  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "desconocida";
  if (excedeLimite(ip)) return error("Demasiadas consultas. Espera unos minutos e inténtalo de nuevo.", 429);

  let resp: Response;
  try {
    resp = await fetch(`${base}/${codigo}`, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
  } catch {
    return error("No se pudo conectar a la API de UNDAC. Puede que solo responda desde la red de la universidad.", 502);
  }
  if (resp.status === 403) return error("La API de UNDAC rechazó la conexión (403). Puede que solo responda desde la red de la universidad.", 502);
  if (resp.status === 404) return error(`Código de matrícula '${codigo}' no encontrado.`, 404);
  if (!resp.ok) return error(`La API de UNDAC respondió con error HTTP ${resp.status}.`, 502);

  const data = await resp.json().catch(() => null);
  // un campo puede venir null o como número
  const campo = (clave: string) => String(data?.[clave] ?? "").trim();
  // si el código no existe, la API responde 200 con {message}
  if (!campo("Nombres")) return error(`No se encontraron datos para el código '${codigo}'.`, 404);

  const escuela = campo("Programa facultad"); // en realidad es la escuela, no la facultad
  const correo = campo("Correo Institucional");
  // shortcut: quien tenga un código obtiene ese DNI y domicilio; el límite por IP solo frena el barrido
  return Response.json(
    {
      nombresApellidos: `${campo("Apellido paterno")} ${campo("Apellido materno")} ${campo("Nombres")}`.replace(/\s+/g, " ").trim(),
      dni: campo("Dni"),
      correoInstitucional: correo.toLowerCase().endsWith("@undac.edu.pe") ? correo : "",
      facultad: facultadDeEscuela(escuela),
      escuela,
      domicilio: campo("Domicilio"),
    },
    { headers: { "Cache-Control": "no-store" } }, // trae datos personales
  );
}
