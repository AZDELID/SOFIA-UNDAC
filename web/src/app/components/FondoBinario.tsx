import { useMemo, type AnimationEvent } from "react";

// Unos y ceros que aparecen y se apagan en el fondo, como en una terminal.
// Cada grupo, al apagarse, cambia de dígitos y de lugar (sin re-render de React).
const CANTIDAD = 42;

const aleatorio = (min: number, max: number) => min + Math.random() * (max - min);
const bits = () => Array.from({ length: 1 + Math.floor(Math.random() * 6) }, () => (Math.random() < 0.5 ? "0" : "1")).join("");

export function FondoBinario() {
  const grupos = useMemo(
    () => Array.from({ length: CANTIDAD }, () => ({
      texto: bits(),
      left: aleatorio(0, 96), top: aleatorio(0, 96),
      duracion: aleatorio(4, 9), retraso: aleatorio(-9, 0), // retraso negativo: no empiezan todos juntos
      tam: aleatorio(11, 16),
    })),
    [],
  );

  const mover = (e: AnimationEvent<HTMLSpanElement>) => {
    const s = e.currentTarget;
    s.textContent = bits();
    s.style.left = `${aleatorio(0, 96)}%`;
    s.style.top = `${aleatorio(0, 96)}%`;
  };

  return (
    <div className="fondo-binario print:hidden" aria-hidden="true">
      {grupos.map((g, i) => (
        <span
          key={i}
          onAnimationIteration={mover}
          style={{ left: `${g.left}%`, top: `${g.top}%`, fontSize: g.tam, animationDuration: `${g.duracion}s`, animationDelay: `${g.retraso}s` }}
        >
          {g.texto}
        </span>
      ))}
    </div>
  );
}
