import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { DiagramaCurricular } from './DiagramaCurricular';
import { TextosCurso } from './TextosCurso';
import { cursosData, MALLAS, type Malla, creditosSemestre } from '../data/cursos';

interface Course {
  code: string;
  name: string;
  credits: number;
  type: string;
  prerequisite: string;
  track?: string;
  curso: (typeof cursosData)[number];
}

interface Semester {
  number: number;
  name: string;
  year: number;
  color: string;
  courses: Course[];
}


// Rama de cada curso electivo de la malla 17xxx (el diagrama la usa para el color)
const RAMAS: Record<string, string> = {
  '17316': 'redes', '17322': 'redes', '17329': 'redes',
  '17317': 'software', '17323': 'software', '17330': 'software',
  '17318': 'web', '17324': 'web', '17331': 'web',
};
const COLORES = ['#FFB84D', '#A8E855', '#56E0E0', '#D4A5F4', '#8B7FFF', '#FF6B6B', '#C77FFF', '#4D6FFF', '#FF8C42', '#FFD700'];
const ROMANO = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// La lista se arma con los mismos datos que el mapa y el chat (cursos.json)
const cursosDe = (malla: Malla) => (cursosData as any[]).filter((c) => c.malla === malla);
const semestresDe = (malla: Malla): Semester[] =>
  ROMANO.map((r, i) => ({
    number: i + 1,
    name: `${r} Semestre`,
    year: Math.ceil((i + 1) / 2),
    color: COLORES[i],
    courses: cursosDe(malla)
      .filter((c) => c.semestre === i + 1)
      .map((c) => ({
        code: c.codigo, name: c.nombre, credits: c.creditos, type: c.tipo,
        prerequisite: c.prerrequisitos.join(', ') || 'Ninguno', track: RAMAS[c.codigo], curso: c,
      })),
  }));

export function Roadmap({ onHorario, onActividad }: { onHorario?: (codigo: string) => void; onActividad?: (pagina: "practicas" | "proyeccion" | "movilidad") => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  // En el celular el mapa queda muy ancho: se abre la lista, y el mapa sigue a un clic
  const [viewMode, setViewMode] = useState<'visual' | 'list'>(() => (window.matchMedia('(max-width: 767px)').matches ? 'list' : 'visual'));
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [malla, setMalla] = useState<Malla>('17');

  const toggleCourseDetails = (code: string) => {
    setExpandedCourse(expandedCourse === code ? null : code);
  };

  // Function to normalize text for search (remove accents and convert to lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove accents
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl text-slate-900 mb-4">Malla Curricular Completa</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Explora todos los cursos de Ingeniería de Sistemas organizados por semestre
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
          {viewMode === 'list' && (
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar curso por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A6DFF]"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-12 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4A6DFF] appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-white text-slate-900">Todos los Cursos</option>
                  <option value="Obligatorio" className="bg-white text-slate-900">Obligatorios</option>
                  <option value="Electivo" className="bg-white text-slate-900">Electivos</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
          {/* Malla */}
          <div className="flex gap-2 bg-white border border-slate-200 rounded-xl p-1">
            {MALLAS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMalla(m.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  malla === m.id ? 'bg-[#4A6DFF] text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {m.nombre}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'visual' ? 'bg-[#4A6DFF] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mapa Visual
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-[#4A6DFF] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Lista Detallada
            </button>
          </div>
          </div>
        </div>

        {/* Visual Mode - Flow Diagram */}
        {viewMode === 'visual' && (
          <DiagramaCurricular key={malla} cursos={cursosDe(malla)} ramas={RAMAS} onHorario={onHorario} onActividad={onActividad} />
        )}

        {/* List Mode - Detailed Tables */}
        {viewMode === 'list' && (
          <div className="space-y-8">
            {semestresDe(malla).map((semester) => {
              const filteredCourses = semester.courses.filter((course) => {
                const matchesSearch = 
                  normalizeText(course.name).includes(normalizeText(searchTerm)) ||
                  course.code.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesFilter = filterType === 'all' || course.type === filterType;
                return matchesSearch && matchesFilter;
              });

              if (filteredCourses.length === 0) return null;

              const totalCredits = creditosSemestre(semester.courses.map((c) => ({ tipo: c.type, creditos: c.credits })));
              const hayElectivos = semester.courses.some((c) => c.type === 'Electivo');

              return (
                <div
                  key={semester.number}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:bg-slate-100 transition-all"
                >
                  {/* Semester Header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ backgroundColor: `${semester.color}40`, borderBottom: `2px solid ${semester.color}` }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="tema-claro w-14 h-14 rounded-xl flex items-center justify-center text-slate-900 text-xl font-display font-bold shadow-lg"
                        style={{ backgroundColor: semester.color }}
                      >
                        {semester.number}
                      </div>
                      <div>
                        <h3 className="text-2xl text-slate-900">{semester.name}</h3>
                        <p className="text-slate-600">Año {semester.year} • {totalCredits} créditos{hayElectivos && ' · eliges 1 electivo'}</p>
                      </div>
                    </div>
                    <div className="text-slate-500 text-sm">
                      {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Courses Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-4 px-6 text-slate-700 text-sm">Código</th>
                          <th className="text-left py-4 px-6 text-slate-700 text-sm">Curso</th>
                          <th className="text-center py-4 px-6 text-slate-700 text-sm">Créditos</th>
                          <th className="text-center py-4 px-6 text-slate-700 text-sm">Tipo</th>
                          <th className="text-left py-4 px-6 text-slate-700 text-sm">Requisito</th>
                          <th className="text-center py-4 px-6 text-slate-700 text-sm"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => (
                          <>
                            <tr
                              key={course.code}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => toggleCourseDetails(course.code)}
                            >
                              <td className="py-4 px-6">
                                <span className="text-slate-900 font-mono">{course.code}</span>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-900">{course.name}</span>
                                  {course.track && (
                                    <span
                                      className="px-2 py-1 rounded text-xs"
                                      style={{
                                        backgroundColor: course.track === 'redes' ? '#4A6DFF20' :
                                                        course.track === 'software' ? '#FF6B6B20' :
                                                        '#0d948820',
                                        color: course.track === 'redes' ? '#4A6DFF' :
                                              course.track === 'software' ? '#FF6B6B' :
                                              '#0d9488'
                                      }}
                                    >
                                      {course.track === 'redes' ? 'Redes' :
                                       course.track === 'software' ? 'Software' :
                                       'Web'}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className="text-slate-700">{course.credits}</span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs ${
                                    course.type === 'Obligatorio'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-violet-100 text-violet-700'
                                  }`}
                                >
                                  {course.type}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="text-slate-600 font-mono text-sm">
                                  {course.prerequisite}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {expandedCourse === course.code ? (
                                  <ChevronUp className="text-slate-500" size={20} />
                                ) : (
                                  <ChevronDown className="text-slate-500" size={20} />
                                )}
                              </td>
                            </tr>
                            
                            {/* Expanded Details */}
                            {expandedCourse === course.code && (
                              <tr className="border-b border-slate-100">
                                <td colSpan={6} className="py-4 px-6 bg-white">
                                  <div className="max-w-3xl"><TextosCurso curso={course.curso} /></div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend for Elective Tracks */}
        {malla === '17' && <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-xl text-slate-900 mb-4">Leyenda de Áreas Electivas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-[#5fe3c5]"></div>
              <span className="text-slate-700">RAMA 1: Redes, Servidores y Cloud Computing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-[#ece444]"></div>
              <span className="text-slate-700">RAMA 2: Desarrollo de Software</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-[#9b6bf0]"></div>
              <span className="text-slate-700">RAMA 3: Desarrollo Web Full Stack</span>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}