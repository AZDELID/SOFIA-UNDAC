// Logos de public/img/logos (los genera recursos/procesar_logos.py) con su nombre para mostrar.
export const LOGOS: Record<string, string> = {
  "linux-tux": "Linux", ubuntu: "Ubuntu", redhat: "Red Hat", arch: "Arch Linux", "linux-mint": "Linux Mint",
  kali: "Kali Linux", windows: "Windows", apple: "macOS", android: "Android",
  python: "Python", java: "Java", csharp: "C#", cpp: "C++", swift: "Swift", ruby: "Ruby",
  html5: "HTML5", javascript: "JavaScript", php: "PHP",
  mysql: "MySQL", mariadb: "MariaDB", postgresql: "PostgreSQL", sqlserver: "SQL Server", mongodb: "MongoDB", firebird: "Firebird",
  docker: "Docker", git: "Git", github: "GitHub",
  wireshark: "Wireshark", nmap: "Nmap", putty: "PuTTY", hydra: "Hydra", wifi: "Wi-Fi",
  arduino: "Arduino", esp32: "ESP32", platformio: "PlatformIO", proteus: "Proteus",
  matlab: "MATLAB", geogebra: "GeoGebra",
  chatgpt: "ChatGPT", gemini: "Gemini", deepseek: "DeepSeek", "claude-code": "Claude Code",
};

export const urlLogo = (archivo: string) => `/img/logos/${archivo}.png`;

// Herramientas que se suelen usar según el nombre del curso.
// Decisión mía (referencial): no sale de los sílabos; el usuario puede corregir esta tabla.
const POR_CURSO: [RegExp, string[]][] = [
  [/base de datos|sistemas de bases|mineria de datos|inteligencia de negocios/, ["mysql", "postgresql", "sqlserver", "mongodb"]],
  [/lenguaje de programacion|algoritmos|programacion de sistemas|teoria de la computacion/, ["python", "cpp", "java", "csharp"]],
  [/programacion movil/, ["android", "swift", "java"]],
  [/desarrollo web en entorno cliente|fundamentos de desarrollo web|comercio electronico/, ["html5", "javascript"]],
  [/desarrollo web en entorno servidor/, ["php", "javascript", "mysql"]],
  [/despliegue|computacion en la nube|virtualizacion/, ["docker", "linux-tux", "git", "github"]],
  [/administracion de servidores|sistemas operativos/, ["linux-tux", "ubuntu", "redhat", "windows"]],
  [/redes|conmutacion/, ["wireshark", "nmap", "putty", "wifi"]],
  [/seguridad|forense|auditoria/, ["kali", "nmap", "wireshark", "hydra"]],
  [/electronica|arquitectura de(l)? computador|automatizacion/, ["arduino", "esp32", "proteus", "platformio"]],
  [/calculo|matematica|ecuaciones|estadistic|inferencia|investigacion de operaciones|simulacion|fisica/, ["matlab", "geogebra"]],
  [/inteligencia artificial|sistemas expertos/, ["python", "chatgpt", "gemini", "deepseek"]],
  [/ingenieria de software|metodologias agiles|desarrollo de soluciones|calidad de software/, ["git", "github", "java", "python"]],
];

const normal = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function herramientasDe(nombreCurso: string): string[] {
  const n = normal(nombreCurso);
  return POR_CURSO.find(([patron]) => patron.test(n))?.[1] ?? [];
}

// Autocomprobación de la tabla (solo en desarrollo)
if (import.meta.env.DEV) {
  console.assert(herramientasDe("Base de Datos II")[0] === "mysql", "logos: Base de Datos");
  console.assert(herramientasDe("Cálculo Diferencial").includes("geogebra"), "logos: tildes");
  console.assert(herramientasDe("Ética Profesional").length === 0, "logos: curso sin herramientas");
  console.assert(herramientasDe("Redes de Computadoras I").includes("wireshark"), "logos: redes");
}
