import { Exercise, SRSItem, UserProfile } from '../types';

export interface SessionData {
  session: (Exercise & { isRemedial?: boolean })[];
  hasRemedial: boolean;
  remedialPhase: number | null;
}

export const generateSession = (profile: UserProfile, allExercises: Exercise[]): SessionData => {
  let available = allExercises;
  if (!profile.rioplatense) {
    available = available.filter(ex => !ex.rioplatenseOnly);
  }

  const srs = profile.srs || {};
  const now = new Date();

  // 1. Check for remedial module
  let remedialPhase: number | null = null;
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  for (const item of Object.values(srs)) {
    const recentErrors = item.errorHistory.filter(dateStr => new Date(dateStr) >= sevenDaysAgo);
    if (recentErrors.length >= 3) {
      remedialPhase = item.phase;
      break;
    }
  }

  if (remedialPhase !== null) {
    // Remedial module: 4 input discrimination exercises specifically for that case.
    const remedialExercises = available
      .filter(ex => ex.phase === remedialPhase && ex.type === 'discrimination')
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
    
    const remedialWithFlag = remedialExercises.map(ex => ({ ...ex, isRemedial: true }));
    
    // Get 6 normal exercises
    const normalExercises = getNormalSession(profile, available, srs, 6);
    return { session: [...remedialWithFlag, ...normalExercises], hasRemedial: true, remedialPhase };
  }

  return { session: getNormalSession(profile, available, srs, 10), hasRemedial: false, remedialPhase: null };
};

const getNormalSession = (profile: UserProfile, available: Exercise[], srs: Record<string, SRSItem>, count: number): Exercise[] => {
  const now = new Date();
  
  // Get due items
  const dueItems = Object.values(srs)
    .filter(item => new Date(item.nextReviewDate) <= now)
    .sort((a, b) => {
      // Phase 3 items rise faster in the queue
      const weightA = a.phase === 3 ? 0.5 : 1;
      const weightB = b.phase === 3 ? 0.5 : 1;
      const timeA = new Date(a.nextReviewDate).getTime() * weightA;
      const timeB = new Date(b.nextReviewDate).getTime() * weightB;
      return timeA - timeB;
    });

  const session: Exercise[] = [];
  
  // Add due items
  for (const item of dueItems) {
    if (session.length >= count) break;
    const exercise = available.find(ex => ex.id === item.exerciseId);
    if (exercise) {
      session.push(exercise);
    }
  }

  // Fill the rest with new items appropriate for the user's assignedPhase
  if (session.length < count) {
    const newItems = available
      .filter(ex => !srs[ex.id] && ex.phase <= profile.assignedPhase)
      .sort(() => 0.5 - Math.random());
    
    for (const ex of newItems) {
      if (session.length >= count) break;
      session.push(ex);
    }
  }

  // If still not enough, fill with random already seen items
  if (session.length < count) {
    const seenItems = available
      .filter(ex => srs[ex.id] && !session.some(s => s.id === ex.id))
      .sort(() => 0.5 - Math.random());
    
    for (const ex of seenItems) {
      if (session.length >= count) break;
      session.push(ex);
    }
  }

  return session;
};

export const processAnswer = (profile: UserProfile, exerciseId: string, phase: number, isCorrect: boolean): UserProfile => {
  const srs = { ...(profile.srs || {}) };
  const item = srs[exerciseId] || {
    exerciseId,
    phase,
    repetition: 0,
    interval: 1,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
    errorHistory: []
  };

  const now = new Date();

  if (isCorrect) {
    if (item.repetition === 0) {
      item.interval = 1;
    } else if (item.repetition === 1) {
      item.interval = 6;
    } else {
      item.interval = Math.round(item.interval * item.easinessFactor);
    }
    item.repetition += 1;
    item.easinessFactor = Math.max(1.3, item.easinessFactor + 0.1);
  } else {
    item.repetition = 0;
    // Interval depends on phase for incorrect answers
    if (phase === 1) {
      item.interval = 1;
    } else if (phase === 2) {
      item.interval = 0.5;
    } else {
      item.interval = 0.25;
    }
    item.easinessFactor = Math.max(1.3, item.easinessFactor - 0.2);
    item.errorHistory.push(now.toISOString());
  }

  item.nextReviewDate = new Date(now.getTime() + item.interval * 24 * 60 * 60 * 1000).toISOString();
  srs[exerciseId] = item;

  return { ...profile, srs };
};

export const clearRemedialHistory = (profile: UserProfile, phase: number): UserProfile => {
  const srs = { ...(profile.srs || {}) };
  for (const key in srs) {
    if (srs[key].phase === phase) {
      srs[key] = { ...srs[key], errorHistory: [] };
    }
  }
  return { ...profile, srs };
};
