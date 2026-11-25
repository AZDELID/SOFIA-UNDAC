import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { IconoTramite } from "./Iconos";
import { borrarHistorial, cargarHistorial, quitarDelHistorial, type EntradaHistorial } from "@/lib/almacen";
import type { FutData } from "@/lib/constructor";
import Button from "./Button";
import SectionHeader from "./SectionHeader";

// ── Mis trámites (historial en este navegador) ──────────────────
export function PantallaMisTramites({ onAbrir, onNuevo }: { onAbrir: (fut: FutData) => void; onNuevo: () => void }) {
  const [entradas, setEntradas] = useState<EntradaHistorial[]>(() => cargarHistorial());

  return (
    <>
      <SectionHeader
        titulo="Mis trámites"
        icono={<ClipboardList size={18} strokeWidth={1.75} />}
        subtitulo="Los últimos FUT que generaste en este navegador"
        btnLabel="Nuevo trámite"
        onBtn={onNuevo}
      />
      <div className="px-6 py-5 max-w-3xl">
        <p className="text-[11px] text-suave mb-4">
          Se guardan solo en este navegador (no en un servidor) y se conservan hasta 20. Si borras los datos del
          navegador o usas otro equipo, no aparecerán.
        </p>
        {entradas.length === 0 ? (
          <div className="bg-bg-card border border-borde rounded-sm p-6 text-[12px] text-suave">
            Todavía no generaste ningún FUT. Cuando descargues o imprimas uno, aparecerá aquí para que lo vuelvas a abrir y
            editar.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {entradas.map((e) => (
              <div key={e.id} className="bg-bg-card border border-borde-card rounded-sm p-3 flex items-center gap-3 flex-wrap">
                <span className="w-9 h-9 flex items-center justify-center border border-borde rounded-sm text-azul-osc"><IconoTramite clave={e.fut.tramiteClave} /></span>
                <div className="flex-1 min-w-[180px]">
                  <div className="text-[12px] font-semibold text-titulo">{e.fut.tramiteNombre}</div>
                  <div className="text-[10px] text-suave">
                    {e.fut.nombresApellidos || "Sin nombre"} · {new Date(e.generado).toLocaleString("es-PE")}
                  </div>
                </div>
                <Button variant="primary" onClick={() => onAbrir(e.fut)}>
                  Abrir y editar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    quitarDelHistorial(e.id);
                    setEntradas(cargarHistorial());
                  }}
                >
                  Quitar
                </Button>
              </div>
            ))}
            <button
              className="self-start text-rojo text-[11px] font-bold mt-2"
              onClick={() => {
                if (window.confirm("¿Borrar todo el historial de este navegador?")) {
                  borrarHistorial();
                  setEntradas([]);
                }
              }}
            >
              Borrar todo el historial
            </button>
          </div>
        )}
      </div>
    </>
  );
}

