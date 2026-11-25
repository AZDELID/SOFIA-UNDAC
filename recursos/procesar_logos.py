# -*- coding: utf-8 -*-
"""Quita el fondo y los textos de los logos de recursos/logos-originales/ y los deja,
recortados y con transparencia, en web/public/img/logos/<nombre>.png.

Uso:  python recursos/procesar_logos.py      (desde la carpeta "aplicacion inteligente")

Cómo quita el fondo: rellena desde los bordes los píxeles casi blancos (o casi negros)
que tocan el borde; así no se borran los blancos encerrados (la panza de Tux, el ojo
del dinosaurio). En el contorno pasa el blanco a transparencia ("color a alfa") para
que el borde suavizado no deje un halo blanco en el tema oscuro.
"""
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parents[1]
ORIGEN = RAIZ / "recursos" / "logos-originales"
DESTINO = RAIZ / "web" / "public" / "img" / "logos"
LADO = 256  # lado máximo del PNG final

# número de imagen → (nombre, qué parte se queda, opciones)
#   todo / arriba / abajo / izquierda: banda separada por espacio vacío (quita el texto)
#   mayor: la pieza de recuadro más grande (MySQL: el delfín, sin las letras)
LOGOS = {
    1: ("linux-tux", "todo", {}), 2: ("arch", "todo", {}), 3: ("linux-mint", "todo", {"fondo": "negro"}),
    4: ("kali", "todo", {}), 5: ("linux", "arriba", {}), 6: ("ubuntu", "arriba", {}),
    7: ("windows", "todo", {}), 8: ("android", "todo", {}), 9: ("android-brazos", "todo", {}),
    10: ("apple", "todo", {}), 11: ("python", "todo", {}), 12: ("csharp", "todo", {}),
    13: ("cpp", "todo", {}), 14: ("java", "izquierda", {}), 15: ("swift", "especial", {}),
    16: ("html5", "abajo", {}), 17: ("php", "todo", {}), 18: ("javascript", "todo", {}),
    19: ("postgresql", "todo", {}), 20: ("mariadb", "arriba", {}), 21: ("firebird", "todo", {}),
    22: ("mysql", "mayor", {}), 23: ("ruby", "todo", {}), 24: ("sqlserver", "todo", {"tol": 22}),
    25: ("arduino-cinta", "todo", {}), 26: ("mongodb", "izquierda", {}), 27: ("platformio", "todo", {}),
    28: ("arduino", "arriba", {"sin_pequenos": True}), 29: ("esp32", "especial", {}),
    30: ("proteus", "todo", {"tol": 18}), 31: ("dino-chrome", "todo", {}),
    # 32: ícono wifi de Shutterstock (banco de pago, con marca de agua): no se usa
    33: ("internet-explorer", "todo", {}), 34: ("wifi", "todo", {"sin_pequenos": True}),
    35: ("docker", "arriba", {}), 36: ("git", "todo", {}), 37: ("github", "todo", {}),
    38: ("claude-code", "todo", {}), 39: ("gemini", "todo", {}), 40: ("chatgpt", "todo", {}),
    41: ("deepseek", "izquierda", {"tol": 60}), 42: ("redhat", "todo", {}), 43: ("hydra", "todo", {}),
    44: ("nmap", "arriba", {}), 45: ("wireshark", "arriba", {}), 46: ("correo-lupa", "todo", {}),
    47: ("putty", "todo", {}), 48: ("matlab", "todo", {}), 49: ("geogebra", "todo", {}),
}


def relleno_desde_borde(cerca: np.ndarray) -> np.ndarray:
    """Píxeles de `cerca` conectados al borde de la imagen (4 vecinos)."""
    alto, ancho = cerca.shape
    fondo = np.zeros_like(cerca)
    cola = deque()
    for y in range(alto):
        for x in (0, ancho - 1):
            if cerca[y, x] and not fondo[y, x]:
                fondo[y, x] = True; cola.append((y, x))
    for x in range(ancho):
        for y in (0, alto - 1):
            if cerca[y, x] and not fondo[y, x]:
                fondo[y, x] = True; cola.append((y, x))
    while cola:
        y, x = cola.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < alto and 0 <= nx < ancho and cerca[ny, nx] and not fondo[ny, nx]:
                fondo[ny, nx] = True; cola.append((ny, nx))
    return fondo


def dilatar(m: np.ndarray, veces: int) -> np.ndarray:
    for _ in range(veces):
        n = m.copy()
        n[1:] |= m[:-1]; n[:-1] |= m[1:]; n[:, 1:] |= m[:, :-1]; n[:, :-1] |= m[:, 1:]
        m = n
    return m


def quitar_fondo(img: Image.Image, fondo: str = "blanco", tol: int = 40) -> np.ndarray:
    """Devuelve RGBA (float 0-255) con el fondo transparente."""
    rgb = np.asarray(img.convert("RGB")).astype(float)
    base = 255.0 if fondo == "blanco" else 0.0
    dist = np.abs(rgb - base).max(axis=2)  # qué tan lejos del color de fondo
    es_fondo = relleno_desde_borde(dist <= tol)
    alfa = np.where(es_fondo, 0.0, 255.0)
    # contorno: el fondo mezclado con el logo se convierte en transparencia
    borde = dilatar(es_fondo, 2) & ~es_fondo
    a = np.clip(dist / 255.0, 1e-3, 1.0)
    limpio = (rgb - (1 - a)[..., None] * base) / a[..., None]
    rgb = np.where(borde[..., None], np.clip(limpio, 0, 255), rgb)
    alfa = np.where(borde, a * 255.0, alfa)
    return np.dstack([rgb, alfa])


def bandas(ocupado: np.ndarray) -> list[tuple[int, int]]:
    """Tramos seguidos con contenido; une los huecos chicos (2 % del largo)."""
    idx = np.flatnonzero(ocupado)
    if not len(idx):
        return []
    hueco = max(4, int(len(ocupado) * 0.02))
    tramos, ini, fin = [], idx[0], idx[0]
    for i in idx[1:]:
        if i - fin > hueco:
            tramos.append((ini, fin)); ini = i
        fin = i
    return tramos + [(ini, fin)]


def piezas(m: np.ndarray) -> list[np.ndarray]:
    """Componentes conectadas (8 vecinos) de la máscara."""
    alto, ancho = m.shape
    visto = np.zeros_like(m)
    lista = []
    for y0, x0 in zip(*np.nonzero(m)):
        if visto[y0, x0]:
            continue
        pix, cola = [], deque([(y0, x0)])
        visto[y0, x0] = True
        while cola:
            y, x = cola.popleft(); pix.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < alto and 0 <= nx < ancho and m[ny, nx] and not visto[ny, nx]:
                        visto[ny, nx] = True; cola.append((ny, nx))
        lista.append(np.array(pix))
    return lista


def quedarse(rgba: np.ndarray, parte: str, sin_pequenos: bool) -> np.ndarray:
    lleno = rgba[..., 3] > 128
    if parte in ("arriba", "abajo"):
        b = bandas(lleno.any(axis=1))
        y0, y1 = b[0] if parte == "arriba" else b[-1]
        rgba[:y0, :, 3] = 0; rgba[y1 + 1:, :, 3] = 0
    elif parte == "izquierda":
        x0, x1 = bandas(lleno.any(axis=0))[0]
        rgba[:, :x0, 3] = 0; rgba[:, x1 + 1:, 3] = 0
    if parte == "mayor" or sin_pequenos:
        ps = piezas(rgba[..., 3] > 128)
        caja = lambda p: (np.ptp(p[:, 0]) + 1) * (np.ptp(p[:, 1]) + 1)
        if parte == "mayor":
            elegida = max(ps, key=caja)
            # solo la pieza y su borde suave (2 px); así no quedan restos tenues de las letras
            dentro = np.zeros(rgba.shape[:2], bool)
            dentro[elegida[:, 0], elegida[:, 1]] = True
            rgba[~dilatar(dentro, 2), 3] = 0
            fuera = []
        else:  # quita ® y ™: piezas de menos del 2 % de la mayor
            mayor = max(len(p) for p in ps)
            fuera = [p for p in ps if len(p) < 0.02 * mayor]
        for p in fuera:
            y, x = p[:, 0], p[:, 1]
            rgba[y.min():y.max() + 1, x.min():x.max() + 1, 3] = 0
    return rgba


def esp32(img: Image.Image) -> np.ndarray:
    """Símbolo blanco sobre cuadro rojo: el blanco pasa a ser el logo (en rojo Espressif)."""
    rgb = np.asarray(img.convert("RGB")).astype(float)
    blanco = rgb.min(axis=2)
    alfa = np.clip((blanco - 70) / 170, 0, 1) * 255
    color = np.broadcast_to(np.array([231.0, 53.0, 44.0]), rgb.shape)
    return quedarse(np.dstack([color, alfa]), "arriba", False)


def swift(img: Image.Image) -> np.ndarray:
    """El ícono de Swift es el cuadro naranja con el ave: cuadrado central con esquinas redondas."""
    ancho, alto = img.size
    lado = min(ancho, alto)
    x0 = (ancho - lado) // 2
    cuadro = img.convert("RGB").crop((x0, 0, x0 + lado, lado))
    mascara = Image.new("L", (lado, lado), 0)
    ImageDraw.Draw(mascara).rounded_rectangle((0, 0, lado - 1, lado - 1), radius=lado // 5, fill=255)
    cuadro.putalpha(mascara)
    return np.asarray(cuadro).astype(float)


def guardar(rgba: np.ndarray, ruta: Path) -> None:
    img = Image.fromarray(rgba.round().astype(np.uint8), "RGBA")
    caja = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    img = img.crop(caja)
    margen = max(2, int(max(img.size) * 0.04))
    lienzo = Image.new("RGBA", (img.width + 2 * margen, img.height + 2 * margen), (0, 0, 0, 0))
    lienzo.paste(img, (margen, margen))
    if max(lienzo.size) > LADO:
        lienzo.thumbnail((LADO, LADO), Image.LANCZOS)
    lienzo.save(ruta, optimize=True)


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    for num, (nombre, parte, op) in LOGOS.items():
        img = Image.open(ORIGEN / f"{num}.png")
        if nombre == "esp32":
            rgba = esp32(img)
        elif nombre == "swift":
            rgba = swift(img)
        else:
            rgba = quitar_fondo(img, op.get("fondo", "blanco"), op.get("tol", 40))
            rgba = quedarse(rgba, parte, op.get("sin_pequenos", False))
        guardar(rgba, DESTINO / f"{nombre}.png")
        print(f"{num:>2} -> {nombre}.png")  # sin flecha unicode: la consola de Windows usa cp1252


if __name__ == "__main__":
    main()
