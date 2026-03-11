import { useState, useEffect, useMemo } from 'react';
import { Exercise, DiscriminationExercise, MinimalPairsExercise, ClassificationExercise, FillInBlanksExercise } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle, GripVertical } from 'lucide-react';

interface SessionProps {
  exercises: (Exercise & { isRemedial?: boolean })[];
  onFinish: (score: number, total: number) => void;
  onAnswer: (exerciseId: string, phase: number, isCorrect: boolean) => void;
}

export default function Session({ exercises, onFinish, onAnswer }: SessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [classificationAnswers, setClassificationAnswers] = useState<Record<string, 'propiedad' | 'estado'>>({});
  const [fillInBlanksAnswers, setFillInBlanksAnswers] = useState<Record<string, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentExercise = exercises[currentIndex];
  const isLast = currentIndex === exercises.length - 1;

  const shuffledOptions = useMemo(() => {
    if (!currentExercise) return null;
    
    const shuffleArray = <T,>(array: T[]): T[] => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    if (currentExercise.type === 'discrimination') {
      return { discrimination: shuffleArray((currentExercise as DiscriminationExercise).options) };
    } else if (currentExercise.type === 'minimal_pairs') {
      return { minimal_pairs: shuffleArray((currentExercise as MinimalPairsExercise).options) };
    } else if (currentExercise.type === 'fill_in_blanks') {
      const ex = currentExercise as FillInBlanksExercise;
      const blanksOptions: Record<string, string[]> = {};
      ex.blanks.forEach(b => {
        blanksOptions[b.id] = shuffleArray(b.options);
      });
      return { fill_in_blanks: blanksOptions };
    }
    return null;
  }, [currentExercise]);

  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(answerId);
    setIsAnswered(true);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleClassificationAnswer = (sentenceId: string, category: 'propiedad' | 'estado') => {
    if (isAnswered) return;
    setClassificationAnswers(prev => {
      const next = { ...prev, [sentenceId]: category };
      
      // Check if all sentences are categorized
      if (currentExercise.type === 'classification') {
        const ex = currentExercise as ClassificationExercise;
        if (Object.keys(next).length === ex.sentences.length) {
          setIsAnswered(true);
          // Calculate if all are correct
          const allCorrect = ex.sentences.every(s => next[s.id] === s.category);
          if (allCorrect) {
            setScore(s => s + 1);
          }
        }
      }
      return next;
    });
  };

  const handleFillInBlanksAnswer = (blankId: string, option: string) => {
    if (isAnswered) return;
    setFillInBlanksAnswers(prev => {
      const next = { ...prev, [blankId]: option };
      
      if (currentExercise.type === 'fill_in_blanks') {
        const ex = currentExercise as FillInBlanksExercise;
        if (Object.keys(next).length === ex.blanks.length) {
          setIsAnswered(true);
          const allCorrect = ex.blanks.every(b => next[b.id] === b.correctOption);
          if (allCorrect) {
            setScore(s => s + 1);
          }
        }
      }
      return next;
    });
  };

  const handleNext = () => {
    if (isLast) {
      let finalScore = score;
      let answeredCorrectly = false;
      if (currentExercise.type !== 'classification' && selectedAnswer && isCorrect(selectedAnswer)) {
        finalScore += 1;
        answeredCorrectly = true;
      } else if (currentExercise.type === 'classification') {
        const ex = currentExercise as ClassificationExercise;
        const allCorrect = ex.sentences.every(s => classificationAnswers[s.id] === s.category);
        if (allCorrect && !isAnswered) { // if they somehow click next exactly when finishing
           finalScore += 1;
           answeredCorrectly = true;
        } else if (allCorrect) {
           answeredCorrectly = true;
        }
      } else if (currentExercise.type === 'fill_in_blanks') {
        const ex = currentExercise as FillInBlanksExercise;
        const allCorrect = ex.blanks.every(b => fillInBlanksAnswers[b.id] === b.correctOption);
        if (allCorrect && !isAnswered) {
           finalScore += 1;
           answeredCorrectly = true;
        } else if (allCorrect) {
           answeredCorrectly = true;
        }
      }
      
      if (!isAnswered) {
         onAnswer(currentExercise.id, currentExercise.phase, answeredCorrectly);
      }
      
      setScore(finalScore);
      setShowSummary(true);
    } else {
      let answeredCorrectly = false;
      if (currentExercise.type !== 'classification' && selectedAnswer && isCorrect(selectedAnswer)) {
        answeredCorrectly = true;
      } else if (currentExercise.type === 'classification') {
        const ex = currentExercise as ClassificationExercise;
        const allCorrect = ex.sentences.every(s => classificationAnswers[s.id] === s.category);
        if (allCorrect) {
           answeredCorrectly = true;
        }
      } else if (currentExercise.type === 'fill_in_blanks') {
        const ex = currentExercise as FillInBlanksExercise;
        const allCorrect = ex.blanks.every(b => fillInBlanksAnswers[b.id] === b.correctOption);
        if (allCorrect) {
           answeredCorrectly = true;
        }
      }
      
      if (!isAnswered) {
         onAnswer(currentExercise.id, currentExercise.phase, answeredCorrectly);
      }

      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setClassificationAnswers({});
      setFillInBlanksAnswers({});
      setIsAnswered(false);
      setShowExplanation(false);
    }
  };

  const isCorrect = (answerId: string) => {
    if (currentExercise.type === 'discrimination') {
      return (currentExercise as DiscriminationExercise).options.find(o => o.id === answerId)?.isCorrect;
    } else if (currentExercise.type === 'minimal_pairs') {
      return answerId === (currentExercise as MinimalPairsExercise).correctOption;
    } else if (currentExercise.type === 'classification') {
      const ex = currentExercise as ClassificationExercise;
      return ex.sentences.every(s => classificationAnswers[s.id] === s.category);
    } else if (currentExercise.type === 'fill_in_blanks') {
      const ex = currentExercise as FillInBlanksExercise;
      return ex.blanks.every(b => fillInBlanksAnswers[b.id] === b.correctOption);
    }
    return false;
  };

  // Auto-advance on correct answer
  useEffect(() => {
    if (isAnswered && !showExplanation) {
      if (isCorrect(selectedAnswer || '')) {
        const timer = setTimeout(() => {
          handleNext();
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAnswered, selectedAnswer, classificationAnswers, fillInBlanksAnswers, showExplanation, currentExercise]);

  const renderDiscrimination = (ex: DiscriminationExercise) => {
    const options = shuffledOptions?.discrimination || ex.options;
    return (
    <div className="space-y-8">
      <div className="bg-zinc-900/40 backdrop-blur-md p-8 brutal-border">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold mb-4">Interpreta la oración</p>
        {ex.context && <p className="text-zinc-400 mb-4 italic font-light">{ex.context}</p>}
        <h3 className="text-3xl font-bold tracking-tight text-zinc-100">"{ex.sentence}"</h3>
      </div>
      <div className="space-y-3 font-mono">
        {options.map(opt => {
          const isSelected = selectedAnswer === opt.id;
          const correct = opt.isCorrect;
          
          let btnClass = "w-full text-left p-6 border transition-all ";
          if (!isAnswered) {
            btnClass += "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 text-zinc-300";
          } else if (isSelected && correct) {
            btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
          } else if (isSelected && !correct) {
            btnClass += "border-red-500 bg-red-900/30 text-red-400";
          } else if (!isSelected && correct) {
            btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
          } else {
            btnClass += "border-zinc-800 opacity-30 text-zinc-500";
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id, correct)}
              disabled={isAnswered}
              className={btnClass}
            >
              <div className="flex justify-between items-center">
                <span className="">{opt.text}</span>
                {isAnswered && isSelected && correct && <CheckCircle2 className="text-emerald-500 w-5 h-5" />}
                {isAnswered && isSelected && !correct && <XCircle className="text-red-500 w-5 h-5" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
  };

  const renderMinimalPairs = (ex: MinimalPairsExercise) => {
    const options = shuffledOptions?.minimal_pairs || ex.options;
    return (
    <div className="space-y-8">
      <div className="bg-zinc-900/40 backdrop-blur-md p-8 brutal-border">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold mb-4">Contexto</p>
        <p className="text-zinc-400 mb-6 italic font-light">{ex.context}</p>
        <div className="text-3xl font-bold tracking-tight text-zinc-100 leading-relaxed flex flex-wrap items-center gap-2">
          <span>{ex.blankBefore}</span>
          <span className={`inline-block min-w-[80px] text-center border-b-2 px-2 pb-1 ${isAnswered ? (isCorrect(selectedAnswer!) ? 'border-emerald-500 text-emerald-400' : 'border-red-500 text-red-400') : 'border-zinc-600 text-zinc-500'}`}>
            {selectedAnswer || '___'}
          </span>
          <span>{ex.blankAfter}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 font-mono">
        {options.map(opt => {
          const isSelected = selectedAnswer === opt;
          const correct = opt === ex.correctOption;
          
          let btnClass = "p-6 border text-center text-lg font-medium transition-all ";
          if (!isAnswered) {
            btnClass += "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50 text-zinc-300";
          } else if (isSelected && correct) {
            btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
          } else if (isSelected && !correct) {
            btnClass += "border-red-500 bg-red-900/30 text-red-400";
          } else if (!isSelected && correct) {
            btnClass += "border-emerald-500 bg-emerald-900/30 text-emerald-400";
          } else {
            btnClass += "border-zinc-800 opacity-30 text-zinc-500";
          }

          return (
            <button
              key={opt}
              onClick={() => handleAnswer(opt, correct)}
              disabled={isAnswered}
              className={btnClass}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
  };

  const renderClassification = (ex: ClassificationExercise) => (
    <div className="space-y-8">
      <div className="bg-zinc-900/40 backdrop-blur-md p-8 brutal-border">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold mb-4">Clasifica por perspectiva</p>
        <p className="text-zinc-400 font-light">¿La oración describe una propiedad del individuo o un estado anclado a una situación?</p>
      </div>
      <div className="space-y-4">
        {ex.sentences.map(sentence => {
          const answer = classificationAnswers[sentence.id];
          const isCorrectAnswer = answer === sentence.category;
          
          return (
            <div key={sentence.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
              <span className="text-zinc-200 font-medium flex-1">{sentence.text}</span>
              <div className="flex gap-2 font-mono">
                <button
                  onClick={() => handleClassificationAnswer(sentence.id, 'propiedad')}
                  disabled={isAnswered}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all border ${
                    answer === 'propiedad'
                      ? (isAnswered ? (isCorrectAnswer ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500' : 'bg-red-900/30 text-red-400 border-red-500') : 'bg-zinc-100 text-zinc-950 border-zinc-100')
                      : (isAnswered && sentence.category === 'propiedad' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500' : 'bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-800/50 hover:border-zinc-500')
                  } ${isAnswered ? 'opacity-100' : ''}`}
                >
                  Propiedad
                </button>
                <button
                  onClick={() => handleClassificationAnswer(sentence.id, 'estado')}
                  disabled={isAnswered}
                  className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all border ${
                    answer === 'estado'
                      ? (isAnswered ? (isCorrectAnswer ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500' : 'bg-red-900/30 text-red-400 border-red-500') : 'bg-zinc-100 text-zinc-950 border-zinc-100')
                      : (isAnswered && sentence.category === 'estado' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500' : 'bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-800/50 hover:border-zinc-500')
                  } ${isAnswered ? 'opacity-100' : ''}`}
                >
                  Estado
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFillInBlanks = (ex: FillInBlanksExercise) => (
    <div className="space-y-8">
      <div className="bg-zinc-900/40 backdrop-blur-md p-8 brutal-border">
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold mb-4">Completa el texto</p>
        <div className="text-2xl font-bold tracking-tight text-zinc-100 leading-loose">
          {ex.textParts.map((part, index) => {
            const blank = ex.blanks[index];
            if (!blank) return <span key={index}>{part}</span>;
            
            const answer = fillInBlanksAnswers[blank.id];
            const isCorrectAnswer = answer === blank.correctOption;
            const options = shuffledOptions?.fill_in_blanks?.[blank.id] || blank.options;

            return (
              <span key={index}>
                {part}
                <span className="inline-block mx-2 relative font-mono text-lg">
                  {!answer ? (
                    <span className="flex gap-1 bg-zinc-900/80 border border-zinc-700 p-1">
                      {options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleFillInBlanksAnswer(blank.id, opt)}
                          className="px-3 py-1 text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 text-zinc-300 transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </span>
                  ) : (
                    <span className={`inline-block px-3 py-1 font-bold uppercase tracking-widest text-sm border ${
                      isAnswered 
                        ? (isCorrectAnswer ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500' : 'bg-red-900/30 text-red-400 border-red-500')
                        : 'bg-zinc-800 text-zinc-300 border-zinc-600'
                    }`}>
                      {answer}
                    </span>
                  )}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (showSummary) {
    const percentage = Math.round((score / exercises.length) * 100);
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6 font-sans text-zinc-200 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/40 backdrop-blur-md brutal-border max-w-2xl w-full flex flex-col md:flex-row overflow-hidden"
        >
          <div className="flex-1 relative hidden md:block border-r border-zinc-800">
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920" 
              alt="Dark minimalist architecture" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
          </div>
          <div className="flex-1 p-10 text-center flex flex-col justify-center">
            <div className="w-24 h-24 bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold tracking-tight text-zinc-100">{percentage}%</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-100 mb-4 uppercase">¡Sesión completada!</h2>
            <p className="text-zinc-400 mb-8 font-light">
              Has acertado <strong className="text-zinc-200">{score}</strong> de <strong className="text-zinc-200">{exercises.length}</strong> ejercicios. 
              {percentage >= 80 ? ' ¡Excelente trabajo! Tu intuición se está fortaleciendo.' : 
               percentage >= 50 ? ' Buen progreso. Sigue practicando para consolidar estos conceptos.' : 
               ' No te preocupes, la intuición toma tiempo en construirse. ¡Sigue así!'}
            </p>
            <button
              onClick={() => onFinish(score, exercises.length)}
              className="w-full bg-zinc-100 text-zinc-950 py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors brutal-shadow text-sm"
            >
              Volver al inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans text-zinc-200 relative z-10">
      {/* Header / Progress */}
      <header className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm bg-[#09090b]/80">
        <div className="flex-1">
          <div className="h-1 bg-zinc-800 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex) / exercises.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="ml-4 text-xs font-mono uppercase tracking-widest text-zinc-500">
          {currentIndex + 1} / {exercises.length}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 flex flex-col justify-center">
        {currentExercise.isRemedial && (
          <div className="mb-6 flex justify-center">
            <span className="bg-amber-900/30 border border-amber-500/50 text-amber-400 text-xs font-mono font-bold px-4 py-1.5 uppercase tracking-widest">
              Repaso Rápido
            </span>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {currentExercise.type === 'discrimination' && renderDiscrimination(currentExercise as DiscriminationExercise)}
            {currentExercise.type === 'minimal_pairs' && renderMinimalPairs(currentExercise as MinimalPairsExercise)}
            {currentExercise.type === 'classification' && renderClassification(currentExercise as ClassificationExercise)}
            {currentExercise.type === 'fill_in_blanks' && renderFillInBlanks(currentExercise as FillInBlanksExercise)}

            {/* Feedback Area */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                  className="overflow-hidden"
                >
                  <div className={`p-6 brutal-border ${isCorrect(selectedAnswer || '') ? 'bg-emerald-950/30 border-emerald-900/50' : 'bg-red-950/30 border-red-900/50'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-bold tracking-tight text-xl mb-1 ${isCorrect(selectedAnswer || '') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isCorrect(selectedAnswer || '') ? '¡Excelente!' : 'No exactamente'}
                        </h4>
                        {!showExplanation && (
                          <button 
                            onClick={() => setShowExplanation(true)}
                            className="text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-1 mt-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                          >
                            <HelpCircle className="w-4 h-4" />
                            ¿Por qué?
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-800 text-zinc-300 leading-relaxed font-light"
                        >
                          {currentExercise.explanation}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Actions */}
      <footer className="p-6 border-t border-zinc-800/50 backdrop-blur-sm bg-[#09090b]/80 sticky bottom-0 z-20">
        <div className="max-w-2xl mx-auto flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all ${
              isAnswered 
                ? 'bg-zinc-100 text-zinc-950 hover:bg-white brutal-shadow' 
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            {isLast ? 'Terminar sesión' : 'Siguiente'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
