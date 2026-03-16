import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Play, BookOpen, BarChart3, Settings, LogIn, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

interface DashboardProps {
  profile: UserProfile;
  onStartSession: () => void;
  onReset: () => void;
}

export default function Dashboard({ profile, onStartSession, onReset }: DashboardProps) {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const accuracy = profile.stats && profile.stats.totalExercises > 0 
    ? Math.round((profile.stats.correctExercises / profile.stats.totalExercises) * 100) 
    : null;

  const getL1Name = (l1: string | null) => {
    switch (l1) {
      case 'en': return 'Inglés';
      case 'pt-br': return 'Portugués (BR)';
      case 'pt-pt': return 'Portugués (PT)';
      case 'fr': return 'Francés';
      case 'it': return 'Italiano';
      case 'de': return 'Alemán';
      case 'other': return 'Otro';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-zinc-200">
      <header className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between backdrop-blur-sm bg-[#09090b]/80 sticky top-0 z-20">
        <h1 className="font-mono text-xl font-bold tracking-tight text-zinc-100">SER/ESTAR</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block">{user.email}</span>
              <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline-block font-mono text-xs uppercase tracking-widest">Salir</span>
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
              <LogIn className="w-4 h-4" />
              <span className="font-mono text-xs uppercase tracking-widest">Guardar progreso</span>
            </button>
          )}
          <button onClick={onReset} className="p-2 text-zinc-500 hover:text-zinc-200 transition-colors" title="Reiniciar perfil">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-8 relative z-10">
        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-950/30 border border-emerald-900/50 p-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4 brutal-border"
          >
            <div className="text-emerald-200/80 text-sm font-mono">
              <strong className="text-emerald-400">¡Atención!</strong> Inicia sesión para guardar tu historial en la nube.
            </div>
            <button 
              onClick={handleSignIn}
              className="whitespace-nowrap bg-emerald-500 text-zinc-950 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors brutal-shadow"
            >
              Iniciar sesión
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-zinc-900/40 backdrop-blur-md p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 brutal-border overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-luminosity">
            <img 
              src="https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1920" 
              alt="Abstract dark architecture" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent"></div>
          </div>
          
          <div className="space-y-6 flex-1 relative z-10">
            <div className="inline-block px-3 py-1 bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
              Fase {profile.assignedPhase || 1}: {
                profile.assignedPhase === 1 ? 'Fundamentos' :
                profile.assignedPhase === 2 ? 'Adjetivos Claros' :
                profile.assignedPhase === 3 ? 'Adjetivos Ambivalentes' : 'Avanzado'
              }
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-100 uppercase leading-[0.9]">Entrena tu <br/> intuición.</h2>
            <p className="text-zinc-400 leading-relaxed max-w-lg font-light text-lg">
              Construye la diferencia entre propiedades del individuo y estados anclados a una situación. 
              Sesiones cortas diarias son mejores que horas de estudio.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button 
              onClick={onStartSession}
              className="w-full md:w-auto bg-zinc-100 text-zinc-950 px-10 py-6 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3 text-lg brutal-shadow"
            >
              <Play className="w-6 h-6 fill-current" />
              INICIAR SESIÓN
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 backdrop-blur-md p-6 brutal-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-zinc-800 text-zinc-300 border border-zinc-700">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-300">Tu progreso</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-zinc-500">Precisión global</span>
                  <span className="text-emerald-400">{accuracy !== null ? `${accuracy}%` : '--%'}</span>
                </div>
                <div className="h-1 bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${accuracy || 0}%` }}></div>
                </div>
              </div>
              <p className="text-xs font-mono text-zinc-500 mt-4 leading-relaxed">
                {profile.stats?.totalSessions 
                  ? `Has completado ${profile.stats.totalSessions} sesión${profile.stats.totalSessions === 1 ? '' : 'es'}.`
                  : 'Completa tu primera sesión para ver estadísticas.'}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/40 backdrop-blur-md p-6 brutal-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-zinc-800 text-zinc-300 border border-zinc-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-zinc-300">Configuración</h3>
            </div>
            <ul className="space-y-3 text-sm text-zinc-400 font-mono">
              <li className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <span>Idioma nativo</span>
                <span className="text-zinc-200">{getL1Name(profile.l1)}</span>
              </li>
              <li className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <span>Var. Rioplatense</span>
                <span className="text-zinc-200">{profile.rioplatense ? 'Activada' : 'Desactivada'}</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
