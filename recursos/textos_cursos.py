# -*- coding: utf-8 -*-
"""Escribe en web/src/app/data/cursos.json, para cada curso de las dos mallas:
  sumilla        de qué va el curso
  recomendacion  un consejo práctico para llevarlo (reemplaza el texto de la plantilla)
  importancia    para qué te sirve (la 17xxx ya lo traía; la 26xxx lo copia del curso
                 del mismo nombre o lo toma de IMPORTANCIA_26)

Los textos son REFERENCIALES: no salen de los sílabos oficiales. Si aparece la sumilla
oficial de un curso, se cambia aquí y se vuelve a correr.

Uso:  python recursos/textos_cursos.py      (desde la carpeta "aplicacion inteligente")
      Luego: docker compose up -d --build web api   (la API copia cursos.json al construir)
"""
import json
from pathlib import Path

RUTA = Path(__file__).resolve().parents[1] / "web" / "src" / "app" / "data" / "cursos.json"

# Textos que se repiten en cursos parecidos de las dos mallas
_MATE_BASICA = ("Lógica proposicional, conjuntos, números reales, ecuaciones, inecuaciones y funciones.",
                "Resuelve ejercicios todos los días: aquí se arma el álgebra que usarás en todos los cursos de cálculo.")
_COMUNICACION = ("Redacción de textos académicos, ortografía, argumentación y exposición oral.",
                 "Aprende a citar en APA desde ya: lo vas a usar en cada informe hasta la tesis.")
_METODOS = ("Técnicas de estudio, organización del tiempo, lectura comprensiva y normas para trabajos universitarios.",
            "Aplica lo que veas en tus otros cursos del semestre: es el momento de armar tu propio método.")
_ED_FISICA = ("Actividad física, deporte y hábitos de vida saludable.",
              "Asiste a todas las sesiones: se evalúa sobre todo la participación.")
_ECOLOGIA = ("Ecosistemas, recursos naturales, contaminación y desarrollo sostenible.",
             "Relaciónalo con la minería de Pasco: los trabajos con un caso local destacan.")
_REALIDAD = ("Análisis de la situación social, económica, política y cultural del Perú y de la región.",
             "Sigue las noticias de Pasco y la sierra central: los trabajos suelen pedir casos de la región.")
_ARTE = ("Taller práctico de expresión artística para la formación integral del estudiante.",
         "Elige el que más te guste: es electivo y se aprueba sobre todo con asistencia y participación.")
_INGLES = ("Gramática y vocabulario básico del inglés, con lectura de textos sencillos.",
           "Lee documentación técnica en inglés desde ahora: es el idioma de casi todo lo que vas a estudiar.")
_QUECHUA = ("Bases del quechua: pronunciación, saludos, vocabulario y estructura de oraciones.",
            "Practica con familiares o vecinos que lo hablen: es la forma más rápida de avanzar.")
_BD1 = ("Modelo entidad-relación, modelo relacional, normalización y SQL básico.",
        "Practica SQL en un motor real (SQL Server, MySQL o PostgreSQL) con datos que tú mismo inventes.")
_BD2 = ("Bases de datos avanzadas: procedimientos almacenados, transacciones, índices, seguridad y optimización.",
        "Trabaja con un volumen grande de datos: así notas la diferencia que hace un índice.")
_ARQUITECTURA = ("Cómo está hecho un computador: CPU, memoria, buses, entrada/salida y lenguaje ensamblador.",
                 "Abre una PC (con cuidado) y ubica cada parte; luego prueba un simulador de ensamblador.")
_PROCESOS = ("Análisis, modelado y mejora de los procesos de negocio con BPMN, apoyados en la tecnología.",
             "Modela los procesos en Bizagi (es gratuito): es la herramienta que más se usa para BPMN.")
_SIG_GERENCIAL = ("Sistemas que apoyan las decisiones de los gerentes: tipos de sistemas de información, ERP, CRM e indicadores.",
                  "Relaciona cada tipo de sistema con una empresa que conozcas.")
_TOPICOS = ("Temas actuales de la carrera que elige el docente: nuevas tecnologías y tendencias.",
            "Aprovecha para explorar un área nueva: puede marcar tu especialización.")
_PRACTICAS = ("Trabajo en una empresa o institución aplicando lo aprendido, bajo la guía de un docente asesor.",
              "Busca la empresa con tiempo y revisa la ruta de prácticas en SOFIA: plazos, anexos y el FUT que toca.")
_NUBE = ("Máquinas virtuales, contenedores y servicios en la nube (IaaS, PaaS, SaaS) en AWS, Azure o Google Cloud.",
         "Usa las cuentas gratuitas para estudiantes (AWS Educate, Azure for Students) y despliega algo tuyo.")
_TESIS_1 = ("Elaboración del proyecto de investigación: problema, objetivos, marco teórico y metodología.",
            "Elige tu tema y tu asesor pronto: es lo que más retrasa la titulación.")
_TESIS_2 = ("Ejecución de la investigación: recojo y análisis de datos, resultados, discusión y conclusiones.",
            "Reúnete con tu asesor cada semana y no dejes la redacción para el final.")
_EMPRENDER = ("Cómo crear un negocio: idea, modelo Canvas, validación con clientes y plan de negocios.",
              "Piensa en una startup tecnológica: muchos proyectos de software se vuelven negocios.")
_VAN_TIR = "Domina el VAN y la TIR en Excel: vuelven en los cursos de proyectos."

# nombre exacto en cursos.json -> (sumilla, consejo)
TEXTOS = {
    # ---- Malla 17xxx ----
    "Matemática Básica": _MATE_BASICA,
    "Comunicación Oral y Escrita": _COMUNICACION,
    "Matemática Superior": ("Matrices, determinantes, sistemas de ecuaciones, vectores y números complejos.",
                            "Practica las operaciones con matrices a mano: reaparecen en gráficos por computadora e IA."),
    "Física General": ("Magnitudes, vectores, cinemática, dinámica, trabajo y energía.",
                       "Dibuja siempre el diagrama de fuerzas antes de escribir ecuaciones."),
    "Cálculo Diferencial": ("Límites, continuidad, derivadas y sus aplicaciones: máximos, mínimos y razón de cambio.",
                            "Domina las reglas de derivación hasta hacerlas sin pensar: Cálculo Integral parte de ahí."),
    "Algoritmos": ("Cómo plantear la solución de un problema paso a paso: pseudocódigo, diagramas de flujo, condicionales, bucles y arreglos.",
                   "Aunque el curso sea en papel, pasa cada pseudocódigo a Python o C++ y pruébalo."),
    "Química General": ("Materia, estructura atómica, tabla periódica, enlaces, reacciones y estequiometría.",
                        "Memoriza poco y entiende mucho: la estequiometría es pura proporción."),
    "Realidad Nacional": _REALIDAD,
    "Estadística General": ("Estadística descriptiva: tablas, gráficos, medidas de tendencia y dispersión, y probabilidad básica.",
                            "Haz los ejercicios también en Excel: así aprendes la herramienta que más vas a usar."),
    "Métodos de Estudio del Trabajo Universitario": _METODOS,
    "Taller de Arte Música y Canto": _ARTE,
    "Taller de Arte Danza": _ARTE,
    "Taller de Arte Teatro": _ARTE,
    "Cálculo Integral": ("Integrales indefinidas y definidas, técnicas de integración y cálculo de áreas y volúmenes.",
                         "Haz una hoja resumen de las técnicas (sustitución, por partes, fracciones parciales) y practica reconocer cuál usar."),
    "Lenguaje de Programación I": ("Primer lenguaje formal: variables, tipos de datos, estructuras de control, funciones y arreglos.",
                                   "Programa todos los días, aunque sean 20 minutos; resuelve retos en HackerRank o LeetCode."),
    "Ecología": _ECOLOGIA,
    "Inglés Básico": _INGLES,
    "Quechua": _QUECHUA,
    "Educación Física": _ED_FISICA,
    "Matemática Básica II": ("Continuación de Matemática Básica: geometría analítica, cónicas, funciones y sucesiones.",
                             "Repasa funciones antes de empezar: son la base de todo lo que sigue."),
    "Cálculo Multivariable": ("Funciones de varias variables, derivadas parciales e integrales dobles y triples.",
                              "Mira las superficies en GeoGebra 3D: ver la gráfica ayuda mucho."),
    "Física I": ("Mecánica: estática, dinámica de partículas y del cuerpo rígido, y oscilaciones.",
                 "Resuelve exámenes pasados: los tipos de problema se repiten."),
    "Lenguaje de Programación II": ("Programación orientada a objetos: clases, herencia, polimorfismo, colecciones y manejo de excepciones.",
                                    "Haz un proyecto pequeño propio (un inventario, una agenda): los objetos se entienden usándolos."),
    "Metodología de la Investigación Científica": ("Cómo plantear un problema, objetivos, hipótesis, marco teórico y diseño de una investigación.",
                                                   "Elige un tema de sistemas que de verdad te interese: puede volverse tu tesis."),
    "Matemática Discreta": ("Lógica, conjuntos, relaciones, combinatoria, grafos y árboles.",
                            "Conecta cada tema con la programación: grafos y combinatoria reaparecen en algoritmos y redes."),
    "Inferencia Estadística": ("Distribuciones, muestreo, intervalos de confianza y pruebas de hipótesis.",
                               "Aprende a hacerlo en Excel, R o Python: en la tesis lo necesitarás para analizar tus datos."),
    "Electrónica I": ("Circuitos eléctricos y componentes (resistencias, diodos, transistores) y su análisis.",
                      "Arma los circuitos en un simulador (Tinkercad, Proteus) antes del laboratorio."),
    "Investigación de Operaciones I": ("Programación lineal, método simplex y modelos de transporte y asignación.",
                                       "Plantea bien el modelo antes de resolver y compruébalo con Solver de Excel."),
    "Economía": ("Microeconomía y macroeconomía: oferta, demanda, mercados, inflación y PBI.",
                 "Relaciona cada concepto con una noticia económica del Perú: se entiende y se recuerda mejor."),
    "Teoría de la Computación": ("Autómatas, lenguajes formales, gramáticas y máquinas de Turing.",
                                 "Usa JFLAP para dibujar y probar autómatas: ver cómo procesan una cadena lo aclara todo."),
    "Teoría de Sistemas": ("Enfoque sistémico: sistemas, subsistemas, entropía y retroalimentación, aplicados a organizaciones.",
                           "Analiza una organización real (tu facultad, un negocio) como sistema: así se vuelve concreto."),
    "Investigación de Operaciones II": ("Modelos probabilísticos: teoría de colas, inventarios, decisiones y cadenas de Markov.",
                                        "Repasa probabilidad antes de empezar: casi todo el curso se apoya en ella."),
    "Electrónica II": ("Electrónica digital: compuertas lógicas, álgebra de Boole y circuitos combinacionales y secuenciales.",
                       "Practica con Arduino o un simulador: ver tu lógica encender un LED ayuda mucho."),
    "Contabilidad y Costos": ("Estados financieros, registro contable y cálculo de costos de producción.",
                              "Arma en Excel los estados de un negocio pequeño: la teoría sola se olvida rápido."),
    "Administración y Calidad Total": ("Proceso administrativo y gestión de la calidad: ciclo PDCA, normas ISO y mejora continua.",
                                       "Busca un ejemplo real de mejora continua: los casos prácticos pesan en la nota."),
    "Arquitectura del Computador": _ARQUITECTURA,
    "Sistemas de Bases I": _BD1,
    "Gestión de la Cadena de Suministro": ("Flujo de materiales en una empresa: compras, inventarios, almacenes y distribución.",
                                           "Fíjate en los sistemas (ERP) que controlan esa cadena: ahí está el aporte del ingeniero de sistemas."),
    "Comportamiento y Desarrollo Organizacional": ("Conducta de las personas en la empresa: motivación, liderazgo, cultura y cambio organizacional.",
                                                   "Te servirá al implantar sistemas: la resistencia al cambio de los usuarios es real."),
    "Sistemas Operativos": ("Procesos, hilos, planificación, memoria, archivos y concurrencia.",
                            "Usa Linux a diario mientras llevas el curso: la terminal te acompañará toda la carrera."),
    "Ingeniería de Software I": ("Ciclo de vida del software, requisitos, modelado con UML y metodologías de desarrollo.",
                                 "Trabaja con un proyecto real: un buen documento de requisitos te ahorra problemas en Software II."),
    "Sistemas de Bases II": _BD2,
    "Simulación": ("Modelado y simulación de sistemas: números aleatorios, Montecarlo y simulación de eventos discretos.",
                   "Aprende una herramienta (Arena, FlexSim o Python): el curso se entiende construyendo modelos."),
    "Herramientas Tecnológicas para la Minería": ("Software y tecnología aplicados a la minería: modelamiento, planificación y control de operaciones.",
                                                  "Pasco es zona minera: conversar con alguien que trabaje en una mina abre puertas para las prácticas."),
    "Planeamiento y Dirección Estratégica": ("Misión, visión, análisis FODA, objetivos estratégicos y control de la gestión.",
                                             "Practica con una empresa real: te servirá en el planeamiento de TI y en la tesis."),
    "Administración Financiera": ("Análisis financiero, valor del dinero en el tiempo, presupuestos y financiamiento.", _VAN_TIR),
    "Redes de Computadoras I": ("Modelos OSI y TCP/IP, direccionamiento IP, subredes, cableado y dispositivos de red.",
                                "Practica el subneteo hasta hacerlo rápido y arma topologías en Cisco Packet Tracer."),
    "Inteligencia de Negocios": ("Data warehouse, procesos ETL, cubos OLAP y tableros para tomar decisiones.",
                                 "Haz un tablero en Power BI con datos reales: queda muy bien en tu portafolio."),
    "Ingeniería de Software II": ("Diseño, arquitectura, pruebas, mantenimiento y gestión de la configuración del software.",
                                  "Usa Git con tu equipo desde el primer día: trabajar con ramas te lo pedirán en cualquier empleo."),
    "Diseño de Lenguaje de Programación": ("Cómo se diseña un lenguaje: sintaxis, semántica, análisis léxico y sintáctico, compiladores e intérpretes.",
                                           "Construye un intérprete pequeño (una calculadora): es la mejor forma de entender un compilador."),
    "Conmutación y Enrutamiento de Redes": ("Configuración de switches y routers: VLAN y enrutamiento estático y dinámico (RIP, OSPF).",
                                            "Practica mucho en Packet Tracer y, si puedes, sigue el material de CCNA."),
    "Metodologías Ágiles de Desarrollo de Software": ("Scrum, Kanban y XP: iteraciones, historias de usuario y roles del equipo.",
                                                      "Organiza tus trabajos de grupo en un tablero (Trello o GitHub Projects): es práctica real."),
    "Desarrollo Web en Entorno Cliente": ("HTML, CSS y JavaScript para construir la parte visible de una web, con diseño adaptable.",
                                          "Publica tus prácticas en GitHub Pages o Vercel: un portafolio en línea vale más que una nota."),
    "Gestión de Proyectos": ("Planificación, cronograma, costos, riesgos y seguimiento de proyectos según la guía PMBOK.",
                             "Arma el cronograma de un proyecto real en un diagrama de Gantt: lo usarás en la tesis y en el trabajo."),
    "Mercadotecnia": ("Marketing: segmentación, producto, precio, plaza, promoción y marketing digital.",
                      "Analiza cómo un negocio local usa sus redes sociales: los casos cercanos se entienden mejor."),
    "Seminario de Tesis I": _TESIS_1,
    "Redes de Computadoras II": ("Redes avanzadas: WAN, servicios de red, redes inalámbricas y seguridad.",
                                 "Configura servicios reales (DHCP, DNS) en máquinas virtuales para practicar."),
    "Sistemas de Información Gerencial": _SIG_GERENCIAL,
    "Tópicos de Ingeniería de Sistemas I": _TOPICOS,
    "Administración de Servidores": ("Instalación y administración de servidores Linux y Windows: usuarios, servicios, seguridad, respaldos y contenedores.",
                                     "Practica en máquinas virtuales o con Docker: romper y reparar tu propio servidor enseña más que la teoría."),
    "Desarrollo de Soluciones I": ("Desarrollo en equipo de un sistema completo, desde los requisitos hasta la entrega.",
                                   "Elige un problema real (un negocio, una oficina de la UNDAC): un sistema que se usa de verdad suma en tu portafolio."),
    "Desarrollo Web en Entorno Servidor": ("Programación del lado del servidor (PHP, Node.js u otros), conexión a bases de datos, sesiones y APIs.",
                                           "Aprende a crear una API REST: casi todas las aplicaciones modernas se comunican así."),
    "Seminario de Tesis II": _TESIS_2,
    "Rediseño de Procesos": _PROCESOS,
    "Sistemas Expertos": ("Sistemas que razonan como un experto: base de conocimiento, reglas, motor de inferencia y lógica difusa.",
                          "Construye un sistema experto pequeño (un diagnóstico, por ejemplo) en Python o Prolog."),
    "Administración de Tecnologías de la Información": ("Gestión del área de TI en una organización: servicios, ITIL, COBIT y gobierno de TI.",
                                                        "Aprende ITIL a nivel básico: lo piden mucho en empleos de soporte y gestión."),
    "Tópicos de Ingeniería de Sistemas II": _TOPICOS,
    "Prácticas Preprofesionales I": _PRACTICAS,
    "Virtualización y Servicios en Cloud": _NUBE,
    "Desarrollo de Soluciones II": ("Continuación de Desarrollo de Soluciones I: un sistema más grande, con calidad, pruebas y despliegue.",
                                    "Puede servirte de base para la tesis o las prácticas: elige el tema pensando en eso."),
    "Despliegue de Aplicaciones Web": ("Publicar una aplicación en producción: servidores, dominios, HTTPS, contenedores e integración continua.",
                                       "Despliega tus proyectos en Vercel, Render o un VPS: tener algo en línea demuestra que sabes."),
    "Trabajo de Investigación": ("Investigación final con la que se obtiene el grado de bachiller.",
                                 "Si puedes, que sea la base de tu tesis: avanzas dos cosas a la vez."),
    "Emprendimiento": _EMPRENDER,
    "Automatización de Procesos": ("Automatización de procesos industriales y de oficina: sensores, controladores, PLC y robots de software (RPA).",
                                   "Practica con Arduino o con una herramienta RPA (UiPath tiene versión gratuita)."),
    "Minería de Datos": ("Descubrir patrones en grandes volúmenes de datos: clasificación, agrupamiento y reglas de asociación.",
                         "Aprende Python con pandas y scikit-learn y practica con datos públicos de Kaggle."),
    "Auditoría de Tecnologías de la Información": ("Evaluación de los controles, la seguridad y el uso de la tecnología en una organización (COBIT, normas ISO).",
                                                   "Audita una oficina real: los hallazgos concretos son lo que más se valora."),
    "Derecho Informático": ("Leyes peruanas sobre tecnología: delitos informáticos, datos personales, firma digital y propiedad intelectual.",
                            "Lee la Ley 30096 (delitos informáticos) y la Ley 29733 (datos personales): te tocará cumplirlas."),
    "Prácticas Preprofesionales II": _PRACTICAS,

    # ---- Solo en la malla 26xxx (los 27 de igual nombre ya están arriba) ----
    "Matemática I": _MATE_BASICA,
    "Comunicación": _COMUNICACION,
    "Taller de Metodología de Trabajo Universitario": _METODOS,
    "Taller de Educación Física": _ED_FISICA,
    "Ecología y Desarrollo Sostenible": _ECOLOGIA,
    "Fundamentos de Ingeniería de Sistemas y Computación": ("Qué hace un ingeniero de sistemas: áreas de la carrera, historia de la computación, hardware, software y redes.",
                                                            "Explora todas las áreas con curiosidad: aquí empiezas a ver cuál te gusta (el Elector de área de SOFIA ayuda)."),
    "Matemática II": ("Matrices, determinantes, sistemas de ecuaciones, vectores y geometría analítica.",
                      "Practica las operaciones con matrices a mano: reaparecen en gráficos por computadora e IA."),
    "Realidad Regional y Nacional": _REALIDAD,
    "Taller de Arte: Música y Canto": _ARTE,
    "Taller de Arte: Danza": _ARTE,
    "Taller de Arte: Teatro": _ARTE,
    "Taller de Idioma Extranjero o Nativo: Inglés": _INGLES,
    "Taller de Idioma Extranjero o Nativo: Quechua": _QUECHUA,
    "Cálculo Diferencial e Integral": ("Límites, derivadas, integrales y sus aplicaciones.",
                                       "Practica las reglas de derivación e integración hasta hacerlas sin pensar."),
    "Física Aplicada": ("Mecánica, electricidad y magnetismo aplicados a la ingeniería.",
                        "Dibuja siempre el diagrama antes de plantear ecuaciones."),
    "Ecuaciones Diferenciales y Modelamiento": ("Ecuaciones diferenciales ordinarias y su uso para modelar fenómenos: crecimiento, circuitos, enfriamiento.",
                                                "Resuelve los modelos también en Python o GeoGebra para ver cómo se comportan."),
    "Fundamentos de Desarrollo Web": ("HTML, CSS y JavaScript básicos para crear páginas web y publicarlas.",
                                      "Publica tus prácticas en GitHub Pages o Vercel desde el primer trabajo."),
    "Base de Datos I": _BD1,
    "Arquitectura de Computadoras": _ARQUITECTURA,
    "Taller de Inteligencia Emocional": ("Autoconocimiento, manejo de emociones, empatía y trabajo en equipo.",
                                         "Aplícalo en tus trabajos de grupo: las empresas valoran estas habilidades tanto como las técnicas."),
    "Ingeniería de Procesos": _PROCESOS,
    "Ingeniería Económica": ("Valor del dinero en el tiempo, VAN, TIR y evaluación de alternativas de inversión.", _VAN_TIR),
    "Marketing Digital": ("Marketing en internet: redes sociales, SEO, publicidad digital y analítica.",
                          "Haz crecer una página real (tuya o de un negocio conocido) y mide los resultados."),
    "Base de Datos II": _BD2,
    "Dinámica de Sistemas": ("Modelar sistemas complejos con diagramas causales, flujos y niveles, y simularlos en el tiempo.",
                             "Usa Vensim (tiene versión gratuita) para construir y simular tus modelos."),
    "Investigación I": _TESIS_1,
    "Programación de Sistemas": ("Programación a bajo nivel: ensamblador, compiladores, enlazadores y llamadas al sistema operativo.",
                                 "Practica en C sobre Linux: entender la memoria te hace mejor programador en cualquier lenguaje."),
    "Calidad de Software": ("Pruebas de software, métricas, estándares de calidad (ISO 25010) y aseguramiento de la calidad.",
                            "Escribe pruebas automáticas para tus propios proyectos: es una práctica muy pedida en el trabajo."),
    "Sistema de Información Geográfico": ("Datos geográficos, mapas digitales y análisis espacial con herramientas SIG.",
                                          "Instala QGIS (es gratuito) y practica con mapas de tu región."),
    "Programación Móvil": ("Desarrollo de aplicaciones para Android e iOS, nativas o con Flutter o React Native.",
                           "Publica una app pequeña propia: aunque sea simple, demuestra que llegaste hasta el final."),
    "Investigación II": _TESIS_2,
    "Formulación y Evaluación de Proyectos": ("Estudio de mercado, técnico y financiero de un proyecto de inversión.",
                                              "Elige un proyecto tecnológico real: puede servirte después en Emprendimiento."),
    "Planeamiento Estratégico de la Información": ("Cómo alinear la tecnología de la información con los objetivos de la organización: el plan estratégico de TI.",
                                                   "Practica con una empresa real: te servirá en el trabajo de investigación."),
    "Gestión de Estándares para Ingeniería de Sistemas y Computación": ("Normas y estándares de la profesión (ISO, IEEE) y cómo aplicarlos en proyectos de TI.",
                                                                       "Haz un resumen de las normas principales: te tocará citarlas en informes y en la tesis."),
    "Comercio Electrónico": ("Negocios por internet: tiendas en línea, medios de pago, logística y seguridad.",
                             "Monta una tienda de prueba (WooCommerce o Shopify) para entender todo el flujo."),
    "Emprendimiento y Responsabilidad Social": ("Cómo crear un negocio (idea, modelo Canvas, plan de negocios) con impacto positivo en la sociedad.",
                                                _EMPRENDER[1]),
    "Inteligencia Artificial I": ("Fundamentos de la IA: búsqueda, representación del conocimiento y aprendizaje automático.",
                                  "Aprende Python con scikit-learn y practica con datos públicos de Kaggle."),
    "Sistema de Información Gerencial": _SIG_GERENCIAL,
    "Seguridad de la Información": ("Protección de la información: amenazas, criptografía, controles, ISO 27001 y gestión de riesgos.",
                                    "Practica en laboratorios legales (TryHackMe, Hack The Box), nunca en sistemas ajenos sin permiso."),
    "Informática Forense": ("Recolección y análisis de evidencia digital para investigar incidentes y delitos informáticos.",
                            "Practica con herramientas libres como Autopsy sobre imágenes de prueba."),
    "Computación en la Nube": _NUBE,
    "Ética Profesional": ("Responsabilidad del ingeniero: código de ética, privacidad, propiedad intelectual y dilemas de la tecnología.",
                          "Relaciónalo con casos reales (fugas de datos, uso de la IA): los debates bien argumentados suben la nota."),
    "Prácticas Preprofesionales": _PRACTICAS,
    "Inteligencia Artificial II": ("IA avanzada: redes neuronales, aprendizaje profundo, visión por computadora y procesamiento de lenguaje natural.",
                                   "Entrena un modelo propio y publícalo; SOFIA misma usa un modelo de lenguaje local."),
    "Tópicos de Ingeniería de Sistemas y Computación": _TOPICOS,
}

# «Para qué te sirve» de los cursos que solo existen en la 26xxx
IMPORTANCIA_26 = {
    "Matemática I": "Base para Matemática II y Cálculo",
    "Comunicación": "Redactar informes y exponer",
    "Taller de Metodología de Trabajo Universitario": "Organizar tu estudio",
    "Taller de Educación Física": "Salud y bienestar",
    "Ecología y Desarrollo Sostenible": "Proyectos responsables con el ambiente",
    "Fundamentos de Ingeniería de Sistemas y Computación": "Conocer la carrera y sus áreas",
    "Matemática II": "Base para Cálculo y modelamiento",
    "Realidad Regional y Nacional": "Entender el contexto del país",
    "Taller de Arte: Música y Canto": "Formación integral",
    "Taller de Arte: Danza": "Formación integral",
    "Taller de Arte: Teatro": "Formación integral",
    "Taller de Idioma Extranjero o Nativo: Inglés": "Leer documentación técnica",
    "Taller de Idioma Extranjero o Nativo: Quechua": "Comunicarte con tu región",
    "Cálculo Diferencial e Integral": "Base para Ecuaciones Diferenciales y Física Aplicada",
    "Física Aplicada": "Base para Electrónica",
    "Ecuaciones Diferenciales y Modelamiento": "Modelar sistemas que cambian en el tiempo",
    "Fundamentos de Desarrollo Web": "Base del desarrollo web",
    "Base de Datos I": "Gestión de datos",
    "Arquitectura de Computadoras": "Entender cómo funciona el hardware",
    "Taller de Inteligencia Emocional": "Trabajo en equipo y liderazgo",
    "Ingeniería de Procesos": "Diseñar sistemas que sigan los procesos reales",
    "Ingeniería Económica": "Saber si una inversión conviene",
    "Marketing Digital": "Dar a conocer productos digitales",
    "Base de Datos II": "Bases de datos de alto rendimiento",
    "Dinámica de Sistemas": "Analizar sistemas con retroalimentación",
    "Investigación I": "Primer paso del trabajo de investigación",
    "Programación de Sistemas": "Entender cómo se ejecuta un programa",
    "Calidad de Software": "Entregar software confiable",
    "Sistema de Información Geográfico": "Analizar datos con ubicación",
    "Programación Móvil": "Desarrollar apps para celular",
    "Investigación II": "Terminar el trabajo de investigación",
    "Formulación y Evaluación de Proyectos": "Saber si un proyecto es viable",
    "Planeamiento Estratégico de la Información": "Planificar la TI de una organización",
    "Gestión de Estándares para Ingeniería de Sistemas y Computación": "Trabajar según normas reconocidas",
    "Comercio Electrónico": "Vender por internet",
    "Emprendimiento y Responsabilidad Social": "Crear tu propio negocio",
    "Inteligencia Artificial I": "Base de la inteligencia artificial",
    "Sistema de Información Gerencial": "Apoyar las decisiones de gerencia",
    "Seguridad de la Información": "Proteger los datos de una organización",
    "Informática Forense": "Investigar incidentes informáticos",
    "Computación en la Nube": "Desplegar servicios en la nube",
    "Ética Profesional": "Ejercer la profesión con responsabilidad",
    "Prácticas Preprofesionales": "Experiencia profesional",
    "Inteligencia Artificial II": "Construir sistemas inteligentes",
    "Tópicos de Ingeniería de Sistemas y Computación": "Explorar tendencias de la carrera",
}


def main():
    cursos = json.loads(RUTA.read_text(encoding="utf-8"))
    imp17 = {c["nombre"]: c["importancia"] for c in cursos if c["malla"] == "17" and c.get("importancia")}
    faltan = sorted({c["nombre"] for c in cursos} - TEXTOS.keys())
    assert not faltan, f"Sin textos: {faltan}"
    nuevos = []
    for c in cursos:
        sumilla, consejo = TEXTOS[c["nombre"]]
        importancia = c.get("importancia") or imp17.get(c["nombre"]) or IMPORTANCIA_26[c["nombre"]]
        # sumilla antes de recomendacion para que el JSON se lea en orden
        d = {k: v for k, v in c.items() if k not in ("sumilla", "recomendacion", "importancia", "malla")}
        d.update(sumilla=sumilla, recomendacion=consejo, importancia=importancia, malla=c["malla"])
        nuevos.append(d)
    with open(RUTA, "w", encoding="utf-8", newline="\r\n") as f:
        f.write(json.dumps(nuevos, ensure_ascii=False, indent=1) + "\n")
    print(f"{len(nuevos)} cursos con sumilla, consejo e importancia")


if __name__ == "__main__":
    main()
