import { ArrowLeft, CheckCircle, XCircle, Target, Briefcase, Award, Code2, Book, HelpCircle, Rocket, Star, Sparkles, Flame, AlertTriangle, UserRound } from 'lucide-react';

type Page = 'home' | 'roadmap' | 'tracks' | 'quiz' | 'result' | 'resources';

interface Track {
  id: string;
  name: string;
  shortName: string;
  icon: any;
  color: string;
  gradient: string;
  tagline: string;
  description: string;
  questions: string[];
  learnings: string[];
  attractions: string[];
  careers: string[];
  pros: string[];
  cons: string[];
  skills: string[];
  profile: string;
  tools: string[];
  languages: string[];
  certifications: string[];
}

interface TrackDetailProps {
  track: Track;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function TrackDetail({ track, onBack, onNavigate }: TrackDetailProps) {
  const Icon = track.icon;

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl hover:bg-slate-100 transition-all"
        >
          <ArrowLeft size={20} />
          Volver a Comparación
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className={`w-24 h-24 bg-gradient-to-br ${track.gradient} rounded-3xl flex items-center justify-center shadow-2xl`}
              style={{ boxShadow: `0 20px 60px ${track.color}40` }}
            >
              <Icon className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-5xl text-slate-900 mb-4">{track.name}</h1>
          <p className="text-2xl text-slate-600 italic mb-4">"{track.tagline}"</p>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">{track.description}</p>
        </div>

        {/* Questions Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl text-slate-900 mb-6 flex items-center gap-3">
            <HelpCircle size={32} style={{ color: track.color }} />
            ¿De qué trata esta rama?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {track.questions.map((question, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl">
                <span className="text-xl flex-shrink-0" style={{ color: track.color }}>•</span>
                <p className="text-slate-700">{question}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learnings Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8">
          <h2 className="text-3xl text-slate-900 mb-6 flex items-center gap-3">
            <Rocket size={32} style={{ color: track.color }} />
            ¿Qué aprenderás?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {track.learnings.map((learning, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle size={20} className="mt-0.5 flex-shrink-0" style={{ color: track.color }} />
                <p className="text-slate-700">{learning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attractions Section */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 mb-8">
          <h2 className="text-3xl text-slate-900 mb-6 flex items-center gap-3">
            <Star size={32} style={{ color: track.color }} />
            Lo más atractivo para estudiantes
          </h2>
          <div className="space-y-3">
            {track.attractions.map((attraction, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl transition-all">
                <Sparkles size={20} className="mt-0.5 flex-shrink-0" style={{ color: track.color }} />
                <p className="text-slate-700">{attraction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Careers */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h2 className="text-2xl text-slate-900 mb-6 flex items-center gap-3">
              <Briefcase size={28} style={{ color: track.color }} />
              Salidas Laborales
            </h2>
            <div className="space-y-3">
              {track.careers.map((career, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: track.color }} />
                  <p className="text-slate-700">{career}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h2 className="text-2xl text-slate-900 mb-6 flex items-center gap-3">
              <Target size={28} style={{ color: track.color }} />
              Habilidades Necesarias
            </h2>
            <div className="space-y-3">
              {track.skills.map((skill, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: track.color }} />
                  <p className="text-slate-700">{skill}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pros */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h2 className="text-2xl text-slate-900 mb-6 flex items-center gap-3">
              <Flame size={28} className="text-orange-500" />
              Ventajas (Pros)
            </h2>
            <div className="space-y-3">
              {track.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-green-700" />
                  <p className="text-slate-700">{pro}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8">
            <h2 className="text-2xl text-slate-900 mb-6 flex items-center gap-3">
              <AlertTriangle size={28} className="text-amber-500" />
              Desafíos (Contras)
            </h2>
            <div className="space-y-3">
              {track.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <XCircle size={18} className="mt-0.5 flex-shrink-0 text-orange-600" />
                  <p className="text-slate-700">{con}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 mb-8">
          <h2 className="text-2xl text-slate-900 mb-4 flex items-center gap-3">
            <UserRound size={28} style={{ color: track.color }} />
            Perfil Ideal
          </h2>
          <p className="text-xl text-slate-800 italic leading-relaxed">{track.profile}</p>
        </div>

        {/* Technical Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Tools */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Code2 size={24} style={{ color: track.color }} />
              Herramientas
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Book size={24} style={{ color: track.color }} />
              Lenguajes
            </h3>
            <div className="flex flex-wrap gap-2">
              {track.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-slate-900 text-sm"
                  style={{ backgroundColor: `${track.color}40`, border: `1px solid ${track.color}` }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Award size={24} style={{ color: track.color }} />
              Certificaciones
            </h3>
            <div className="space-y-2">
              {track.certifications.map((cert, idx) => (
                <div key={idx} className="text-slate-600 text-sm flex items-center gap-2">
                  <span style={{ color: track.color }}>▸</span>
                  {cert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('quiz')}
            className={`px-8 py-4 bg-gradient-to-r ${track.gradient} text-slate-900 rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2`}
          >
            ¿Es esta tu área? Confirma con el Quiz
          </button>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-slate-100 border border-slate-300 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            Comparar con Otras Áreas
          </button>
        </div>
      </div>
    </div>
  );
}