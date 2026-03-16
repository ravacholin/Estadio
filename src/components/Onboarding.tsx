import { useState, useMemo } from 'react';
import { UserProfile, L1 } from '../types';
import { diagnosticItems } from '../data/diagnostic';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Languages, MapPin, Brain, ArrowRight, CheckCircle2, XCircle, LogIn } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'welcome' | 'l1' | 'rioplatense' | 'diagnostic' | 'register'>('welcome');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    rioplatense: false,
  });

  // Diagnostic state
  const [diagIndex, setDiagIndex] = useState(0);
  const [diagAnswers, setDiagAnswers] = useState<Record<string, boolean>>({});
  const [diagSelected, setDiagSelected] = useState<string | null>(null);
  const [diagAnswered, setDiagAnswered] = useState(false);
  const [assignedPhase, setAssignedPhase] = useState<number>(1);

  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Error signing in:', error);
      alert(`Error de Google Auth: ${error?.message || error}`);
    }
  };

  const shuffledDiagOptions = useMemo(() => {
    const currentItem = diagnosticItems[diagIndex];
    if (!currentItem) return [];
    const newArray = [...currentItem.options];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, [diagIndex]);

  const handleL1Select = (l1: L1) => {
    setProfile({ ...profile, l1 });
    if (l1 === 'pt-br' || l1 === 'pt-pt' || l1 === 'en' || l1 === 'fr' || l1 === 'it' || l1 === 'de' || l1 === 'other') {
      setStep('rioplatense');
    }
  };

  const startDiagnostic = () => {
    setStep('diagnostic');
  };

  const handleDiagAnswer = (option: string) => {
    if (diagAnswered) return;
    setDiagSelected(option);
    setDiagAnswered(true);

    const currentItem = diagnosticItems[diagIndex];
    const isCorrect = option === currentItem.correctOption;

    setDiagAnswers(prev => ({ ...prev, [currentItem.id]: isCorrect }));

    setTimeout(() => {
      if (diagIndex < diagnosticItems.length - 1) {
        setDiagIndex(i => i + 1);
        setDiagSelected(null);
        setDiagAnswered(false);
      } else {
        calculatePhaseAndFinish();
      }
    }, 1000);
  };

  const calculatePhaseAndFinish = () => {
    // Calculate errors per block
    let errorsA = 0;
    let errorsB = 0;
    let errorsC = 0;

    diagnosticItems.forEach(item => {
      if (!diagAnswers[item.id]) {
        if (item.block === 'A') errorsA++;
        if (item.block === 'B') errorsB++;
        if (item.block === 'C') errorsC++;
      }
    });

    let phase = 1;
    if (errorsA > 0) {
      phase = 1;
    } else if (errorsB > 0) {
      phase = 2;
    } else if (errorsC > 0) {
      phase = 3;
    } else {
      phase = 4;
    }

    // Mixed pattern check
    if (errorsA > 0 && errorsC > 0 && errorsB === 0) {
      phase = 1;
    }

    setAssignedPhase(phase);
    setStep('register');
  };

  const finishOnboarding = () => {
    onComplete({
      l1: profile.l1 || 'other',
      rioplatense: profile.rioplatense || false,
      onboardingCompleted: true,
      assignedPhase: assignedPhase
    });
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center font-sans text-zinc-200 relative z-10">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen flex flex-col md:flex-row"
          >
            <div className="flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-zinc-950">
              <div className="max-w-xl">
                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
                  <Brain className="w-8 h-8 text-zinc-300" />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-zinc-100 leading-[0.9] mb-8 uppercase">
                  Ser y estar <br /> no son <br /> una regla.
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-12 font-light max-w-md">
                  Son dos formas de ver el mundo. En 10 minutos por día vas a empezar a entender la diferencia.
                </p>
                <div className="flex flex-col gap-4 w-full md:w-max">
                  <button
                    onClick={handleSignIn}
                    className="w-full flex items-center justify-center gap-3 px-12 bg-emerald-600 text-zinc-50 py-5 font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors brutal-shadow text-sm"
                  >
                    <LogIn className="w-5 h-5" />
                    Iniciar sesión con Google
                  </button>
                  <button
                    onClick={() => setStep('l1')}
                    className="w-full px-12 border border-zinc-700 bg-zinc-900/50 text-zinc-300 py-5 font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors brutal-shadow text-sm"
                  >
                    Hacer el test (sin cuenta)
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 relative hidden md:block border-l border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920"
                alt="Brutalist architecture"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent"></div>
            </div>
          </motion.div>
        )}

        {step === 'l1' && (
          <motion.div
            key="l1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-zinc-900/40 backdrop-blur-md brutal-border max-w-md w-full p-8"
          >
            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6">
              <Languages className="w-6 h-6 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6 uppercase">¿Cuál es tu idioma nativo?</h2>
            <div className="space-y-3 font-mono text-sm">
              {[
                { id: 'en', label: 'Inglés (English)' },
                { id: 'pt-br', label: 'Portugués (Brasil)' },
                { id: 'pt-pt', label: 'Portugués (Portugal)' },
                { id: 'fr', label: 'Francés (Français)' },
                { id: 'it', label: 'Italiano' },
                { id: 'de', label: 'Alemán (Deutsch)' },
                { id: 'other', label: 'Otro' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleL1Select(lang.id as L1)}
                  className="w-full text-left px-6 py-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-zinc-300"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'rioplatense' && (
          <motion.div
            key="rioplatense"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-zinc-900/40 backdrop-blur-md brutal-border max-w-md w-full p-8"
          >
            <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6">
              <MapPin className="w-6 h-6 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 mb-2 uppercase">Variedad Rioplatense</h2>
            <p className="text-zinc-400 text-sm mb-6 font-light">
              ¿Estás aprendiendo español en Argentina o Uruguay?
            </p>
            <div className="space-y-3 font-mono text-sm">
              <button
                onClick={() => { setProfile({ ...profile, rioplatense: true }); startDiagnostic(); }}
                className="w-full text-left px-6 py-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-zinc-300"
              >
                Sí, incluir rioplatense (Vos, usos locales)
              </button>
              <button
                onClick={() => { setProfile({ ...profile, rioplatense: false }); startDiagnostic(); }}
                className="w-full text-left px-6 py-4 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-zinc-300"
              >
                No, prefiero español general
              </button>
            </div>
          </motion.div>
        )}

        {step === 'diagnostic' && (
          <motion.div
            key="diagnostic"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-zinc-900/40 backdrop-blur-md brutal-border max-w-2xl w-full p-8"
          >
            <div className="mb-8">
              <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
                <span>Diagnóstico rápido</span>
                <span>{diagIndex + 1} de {diagnosticItems.length}</span>
              </div>
              <div className="h-1 bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((diagIndex) / diagnosticItems.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-8">
              <p className="text-zinc-400 mb-6 italic font-light">{diagnosticItems[diagIndex].context}</p>
              <div className="text-3xl font-bold tracking-tight text-zinc-100 leading-relaxed flex flex-wrap items-center gap-2">
                {diagnosticItems[diagIndex].blankBefore && <span>{diagnosticItems[diagIndex].blankBefore}</span>}
                <span className={`inline-block min-w-[80px] text-center border-b-2 px-2 pb-1 ${diagAnswered ? (diagSelected === diagnosticItems[diagIndex].correctOption ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-400') : 'border-zinc-600 text-zinc-500'}`}>
                  {diagSelected || '___'}
                </span>
                {diagnosticItems[diagIndex].blankAfter && <span>{diagnosticItems[diagIndex].blankAfter}</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono">
              {shuffledDiagOptions.map(opt => {
                const isSelected = diagSelected === opt;
                const isCorrect = opt === diagnosticItems[diagIndex].correctOption;

                let btnClass = "p-6 border text-center text-lg font-medium transition-all ";
                if (!diagAnswered) {
                  btnClass += "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 text-zinc-300";
                } else if (isSelected && isCorrect) {
                  btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
                } else if (isSelected && !isCorrect) {
                  btnClass += "border-red-500 bg-red-900/30 text-red-400";
                } else if (!isSelected && isCorrect) {
                  btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
                } else {
                  btnClass += "border-zinc-800 opacity-30 text-zinc-500";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleDiagAnswer(opt)}
                    disabled={diagAnswered}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {opt}
                      {diagAnswered && isSelected && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {diagAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 backdrop-blur-md brutal-border max-w-md w-full p-8 text-center"
          >
            <div className="w-16 h-16 bg-emerald-900/30 border border-emerald-500/50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2 uppercase">¡Diagnóstico completo!</h2>
            <p className="text-zinc-400 mb-8 font-light">
              Empezás en la <strong className="text-zinc-200">Fase {assignedPhase}</strong>. Ya analizamos tus respuestas y adaptamos el contenido para ti.
            </p>

            <div className="space-y-4">
              <button
                onClick={finishOnboarding}
                className="w-full bg-zinc-100 text-zinc-950 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 brutal-shadow text-sm"
              >
                Guardar mi progreso
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={finishOnboarding}
                className="w-full text-zinc-500 py-4 font-mono text-xs uppercase tracking-widest hover:text-zinc-300 transition-colors"
              >
                Omitir por ahora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

