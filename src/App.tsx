import { useState, useEffect } from 'react';
import { UserProfile, Exercise } from './types';
import { exercises as allExercises } from './data/exercises';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Session from './components/Session';
import { generateSession, processAnswer, clearRemedialHistory } from './utils/srs';
import { loadProfile, saveProfile, clearProfile } from './services/profileService';
import { auth } from './firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionExercises, setSessionExercises] = useState<(Exercise & { isRemedial?: boolean })[]>([]);
  const [remedialPhase, setRemedialPhase] = useState<number | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    // Check for redirect results primarily to catch and log errors
    getRedirectResult(auth).catch((error: any) => {
      console.error('Redirect auth error:', error);
      alert(`Error de autenticación: ${error?.message || error}`);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const loadedProfile = await loadProfile();
      setProfile(loadedProfile);

      // If user logs in and we have a local profile but no cloud profile, 
      // loadProfile will return the local one. We should save it to cloud.
      if (user && loadedProfile) {
        await saveProfile(loadedProfile);
      }

      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = async (newProfile: UserProfile) => {
    setProfile(newProfile);
    await saveProfile(newProfile);
  };

  const startSession = () => {
    if (profile) {
      const { session, remedialPhase: rPhase } = generateSession(profile, allExercises);
      setSessionExercises(session);
      setRemedialPhase(rPhase);
      setIsSessionActive(true);
    }
  };

  const handleAnswer = async (exerciseId: string, phase: number, isCorrect: boolean) => {
    if (profile) {
      const newProfile = processAnswer(profile, exerciseId, phase, isCorrect);
      setProfile(newProfile);
      await saveProfile(newProfile);
    }
  };

  const finishSession = async (score: number, total: number) => {
    setIsSessionActive(false);
    if (profile) {
      const newStats = {
        totalSessions: (profile.stats?.totalSessions || 0) + 1,
        totalExercises: (profile.stats?.totalExercises || 0) + total,
        correctExercises: (profile.stats?.correctExercises || 0) + score,
      };
      let newProfile: UserProfile = { ...profile, stats: newStats };

      // Clear remedial history if they just completed a session that had remedial exercises
      if (remedialPhase !== null) {
        newProfile = clearRemedialHistory(newProfile, remedialPhase);
      }

      setProfile(newProfile);
      await saveProfile(newProfile);
      setRemedialPhase(null);
    }
  };

  const resetProfile = async () => {
    await clearProfile();
    setProfile(null);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="bg-noise"></div>
        <div className="animate-pulse flex flex-col items-center relative z-10">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-0 bg-zinc-950">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920"
          alt="Dark abstract background"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity grayscale"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950"></div>
      </div>
      <div className="bg-noise z-0"></div>
      <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-30"></div>
      <div className="relative z-10">
        {(!profile || !profile.onboardingCompleted) ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : isSessionActive ? (
          <Session exercises={sessionExercises} onFinish={finishSession} onAnswer={handleAnswer} />
        ) : (
          <Dashboard
            profile={profile}
            onStartSession={startSession}
            onReset={resetProfile}
          />
        )}
      </div>
    </>
  );
}
