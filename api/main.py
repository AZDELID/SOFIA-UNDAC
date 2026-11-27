# -*- coding: utf-8 -*-
"""API de SOFIA (Sistema de Orientación y Formularios con IA): IA local para el FUT, chat y autollenado por código."""

import json
import re
import time
import unicodedata
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from core import ia
from core.api_undac import APIError, consultar_estudiante
from core.catalogo import CATALOGO

CURSOS = json.loads((Path(__file__).parent / "data" / "cursos.json").read_text(encoding="utf-8"))

app = FastAPI(title="SOFIA · UNDAC")


def ia_o_503(funcion, *args, **kwargs):
    try:
        return funcion(*args, **kwargs)
    except ia.IAError as e:
        raise HTTPException(503, str(e))


@app.get("/api/salud")
def salud():
    return ia.verificar_conexion()


# ───────────── Autollenado con la API institucional ─────────────
# Se consulta desde el servidor para que el token de la URL (UNDAC_API_BASE_URL)
# nunca llegue al navegador. Misma respuesta que la ruta del generador original.

VENTANA_S, MAX_CONSULTAS = 600, 10
consultas_por_ip: dict[str, list[float]] = {}


def excede_limite(ip: str) -> bool:
    """10 consultas cada 10 minutos por IP, para frenar el barrido de códigos."""
    ahora = time.time()
    if len(consultas_por_ip) > 5000:
        consultas_por_ip.clear()
    recientes = [x for x in consultas_por_ip.get(ip, []) if ahora - x < VENTANA_S]
    excede = len(recientes) >= MAX_CONSULTAS
    if not excede:
        recientes.append(ahora)
    consultas_por_ip[ip] = recientes
    return excede


class PedidoCodigo(BaseModel):
    codigo: str = ""


@app.post("/api/consultar-estudiante")
def consultar(p: PedidoCodigo, request: Request):
    codigo = p.codigo.strip()
    if not re.fullmatch(r"\d{6,12}", codigo):
        return JSONResponse({"error": "El código de matrícula debe ser numérico (6 a 12 dígitos)."}, 400)
    # nginx pone X-Real-IP con la IP real del alumno; sin nginx se usa la conexión
    ip = request.headers.get("x-real-ip") or (request.client.host if request.client else "desconocida")
    if excede_limite(ip):
        return JSONResponse({"error": "Demasiadas consultas. Espera unos minutos e inténtalo de nuevo."}, 429)
    try:
        d = consultar_estudiante(codigo)
    except APIError as e:
        return JSONResponse({"error": str(e)}, 502)
    # shortcut: quien tenga un código obtiene ese DNI y domicilio; el límite por IP solo frena el barrido
    return {"nombresApellidos": d["nombres_apellidos"], "dni": d["dni"],
            "correoInstitucional": d["correo_institucional"], "facultad": d["facultad"],
            "escuela": d["escuela"], "domicilio": d["domicilio"]}


# ───────────── IA para el estudiante ─────────────

class TextoLibre(BaseModel):
    texto: str


class PedidoFundamentar(BaseModel):
    tramite_clave: str = Field(max_length=80)
    # solo texto: una lista o un número aquí tumbaba el armado del prompt
    datos: dict[str, str] = Field(max_length=60)
    descripcion: str = ""


class Mensaje(BaseModel):
    rol: str = "user"
    texto: str = ""


class PedidoChat(BaseModel):
    pregunta: str
    # con dicts sueltos, un mensaje sin "texto" o un texto que no es str daba error 500
    historial: list[Mensaje] = []


@app.post("/api/ia/detectar")
def detectar(p: TextoLibre):
    return ia_o_503(ia.detectar_tramite, p.texto[:2000])


@app.post("/api/ia/fundamentar")
def fundamentar(p: PedidoFundamentar):
    datos = {k[:60]: v[:500] for k, v in p.datos.items()}
    texto = ia_o_503(ia.generar_fundamentacion, p.tramite_clave, datos, p.descripcion[:2000])
    return {"fundamentacion": texto}


NOMBRE = {c["codigo"]: c["nombre"] for c in CURSOS}
SEMESTRE = {c["codigo"]: c["semestre"] for c in CURSOS}
VACIAS = {"de", "la", "el", "los", "las", "y", "en", "para", "que", "con", "del", "al", "curso",
          "cursos", "llevar", "aprobar", "necesito", "tengo", "antes", "como", "cual", "cuales", "qu"}
ROMANOS = {"i", "ii", "iii", "iv", "v"}
ROMANO = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]


def _palabras(texto: str) -> set:
    t = unicodedata.normalize("NFKD", texto.lower())
    t = "".join(ch for ch in t if not unicodedata.combining(ch))
    # "bases" y "base" cuentan igual; se quitan palabras vacías
    return {w[:-1] if len(w) > 3 and w.endswith("s") else w
            for w in re.findall(r"[a-z]+", t)} - VACIAS


def _ficha(c: dict) -> str:
    # con el semestre de cada uno, el modelo ya no supone que el prerrequisito es del mismo semestre
    otro = lambda k: f"{k} {NOMBRE.get(k, '')} (semestre {ROMANO[SEMESTRE[k]] if k in SEMESTRE else '?'})"
    req = ", ".join(map(otro, c["prerrequisitos"])) or "ninguno"
    hab = ", ".join(map(otro, c["desbloquea"])) or "ninguno"
    # en romano: con "semestre 9" el modelo llegó a decir "sexto semestre (semestre 9)"
    return (f"- {c['codigo']} {c['nombre']} (malla {c['malla']}xxx): semestre {ROMANO[c['semestre']]}, {c['creditos']} créditos, "
            f"{c['tipo']}. Prerrequisitos: {req}. Habilita: {hab}. "
            f"De qué trata (referencial): {c.get('sumilla', '-')} Qué se hace: {c.get('que_se_hace', '-')} "
            f"Cómo aprobarlo: {' '.join(c.get('como_aprobar', []))}")


def cursos_mencionados(pregunta: str) -> list:
    """Busca los cursos que nombra la pregunta. Un modelo de 4B confunde
    códigos en una lista larga; dándole la ficha exacta ya no adivina."""
    q = _palabras(pregunta)
    puntos = []
    for c in CURSOS:
        comunes = q & _palabras(c["nombre"])
        # el número romano solo desempata (Bases I vs Bases II)
        puntos.append((sum(0.5 if w in ROMANOS else 1 for w in comunes), c))
    mejor = max(p for p, _ in puntos)
    elegidos = [c for p, c in puntos if p == mejor and p >= 1]
    # 27 cursos se llaman igual en las dos mallas: se queda la que pide el estudiante (17xxx si no dice)
    malla = "26" if re.search(r"\b26(\d{3}|x+)\b|malla 26|malla nueva|nueva malla", pregunta.lower()) else "17"
    return ([c for c in elegidos if c["malla"] == malla] or elegidos)[:3]


def contexto_erp(pregunta: str, anterior: str = "") -> str:
    """Plan de estudios y trámites para el chat, con la ficha exacta de los cursos nombrados."""
    # Lista completa solo de la malla 17xxx (la de casi todos); la 26xxx entra por las fichas de la pregunta
    cursos = "\n".join(f"- {c['codigo']} {c['nombre']} (semestre {ROMANO[c['semestre']]}, {c['creditos']} cr"
                       f"{', electivo' if c['tipo'] == 'Electivo' else ''})"
                       for c in CURSOS if c["malla"] == "17")
    tramites = "\n".join(f"- {t['nombre']}: anexos {t.get('anexo_sugerido', '-')}"
                         for t in CATALOGO.values())
    # "¿y qué necesito para llevarlo?" no nombra el curso: se busca en la pregunta anterior
    fichas = "\n".join(_ficha(c) for c in cursos_mencionados(pregunta) or cursos_mencionados(anterior))
    return (f"\nPLAN DE ESTUDIOS de Ingeniería de Sistemas y Computación (malla 17xxx; "
            f"la malla nueva 26xxx la lleva desde el II semestre):\n{cursos}\n"
            f"\nTRÁMITES que se pueden hacer con FUT en este sistema:\n{tramites}\n"
            + (f"\nDATOS EXACTOS de los cursos de la pregunta (úsalos tal cual):\n{fichas}\n" if fichas else "")
            + "En cada semestre el estudiante elige UN solo curso Electivo; los Obligatorios los lleva todos.\n"
            + "Al hablar de un curso, di de qué malla es (17xxx o 26xxx).\n"
            + "Usa solo estos datos para cursos y trámites; no inventes códigos ni prerrequisitos.\n")


# Cada "## Título" de conocimiento.md es una ficha; se le dan al modelo solo las que más se parecen a la pregunta
FICHAS = (Path(__file__).parent / "data" / "conocimiento.md").read_text(encoding="utf-8").split("\n## ")[1:]


def _raices(texto: str) -> set:
    # 6 letras: "convalido" y "convalidación" cuentan como la misma palabra
    return {w[:6] for w in _palabras(texto)}


def informacion_oficial(texto: str) -> str:
    q = _raices(texto)
    # el título pesa el triple: si no, la ficha más larga gana siempre
    puntos = sorted(((len(q & _raices(f)) + 2 * len(q & _raices(f.split("\n")[0])), f) for f in FICHAS),
                    key=lambda x: -x[0])
    elegidas = [f.strip() for p, f in puntos[:2] if p >= 2]
    return "".join(f"\nINFORMACIÓN OFICIAL: {f}\n" for f in elegidas)


@app.post("/api/chat")
def chat(p: PedidoChat):
    # la pregunta anterior entra en la búsqueda para que "¿y cuánto dura?" siga el mismo tema
    # solo los 6 últimos y recortados: 6 mensajes de 150 000 letras pasaban enteros al modelo
    historial = [{"rol": m.rol, "texto": m.texto[:2000]} for m in p.historial[-6:]]
    anterior = next((m["texto"] for m in reversed(historial) if m["rol"] == "user"), "")
    texto = ia_o_503(ia.chat_asistente, p.pregunta[:2000], historial,
                     contexto_extra=contexto_erp(p.pregunta, anterior[:500]) + informacion_oficial(f"{p.pregunta[:2000]} {anterior[:500]}"))
    return {"respuesta": texto}
