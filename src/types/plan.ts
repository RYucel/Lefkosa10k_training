export type WorkoutType =
  | 'run'
  | 'hiit'
  | 'tempo'
  | 'interval'
  | 'long'
  | 'recovery_run'
  | 'race_prep'
  | 'race'
  | 'rest'
  | 'active_rest';

export interface WorkoutDay {
  id: string; // e.g. "2026-09-02"
  dateStr: string; // "2026-09-02"
  displayDate: string; // "2 Eyl"
  dayOfWeek: string; // "Çar"
  fullDayName: string; // "Çarşamba"
  weekNumber: number; // 1 to 6
  weekLabel: string; // "1. Hafta"
  isPeakWeek?: boolean;
  isTaperWeek?: boolean;
  isRaceWeek?: boolean;
  isRaceDay?: boolean;

  track: string; // "Metehan Dönüşlü (10.15 km)" or "—"
  title: string; // "10.15 km rahat/eforsuz" or "Tam Dinlenme"
  workoutType: WorkoutType;
  details: string; // Full description
  targetPace: string; // "5'46\" /km (158 bpm)" or "Pasif toparlanma"
  distanceKm?: number; // 10.15
  estimatedDurationMin?: number; // 55

  // Specific interval structure for timer runner
  intervalSteps?: Array<{
    name: string;
    durationSec: number;
    type: 'warmup' | 'work' | 'rest' | 'cooldown';
    targetPace?: string;
    reps?: number;
  }>;

  // Key daily tips
  keyNotes?: string[];
  foamRollerRecommended?: boolean;
  stretchRecommended?: boolean;
}

export interface SupplementProtocol {
  id: string;
  name: string;
  brand: string;
  dose: string;
  timing: string;
  timingCategory: 'morning' | 'breakfast' | 'pre_carb_meal' | 'post_workout' | 'dinner' | 'bedtime';
  purpose: string;
  caution?: string;
  recommendedDays?: 'all' | 'workout_days' | 'interval_days' | 'intermittent'; // e.g. D3 3-4 days/week
  defaultQuantity?: number;
  unit?: string; // 'Kapsül' | 'Tablet' | 'gram' | 'Ölçek'
  minQuantity?: number;
  maxQuantity?: number;
  stepQuantity?: number;
}

export interface NutritionProtocol {
  phase: string;
  timing: string;
  foodChoices: string;
  criticalRules: string;
}

export interface RecoveryProtocol {
  area: string;
  practice: string;
  benefit: string;
}

export interface UserDayLog {
  dateStr: string;
  completedWorkout: boolean;
  actualDistanceKm?: number;
  actualDurationMin?: number;
  actualPace?: string;
  actualAvgBpm?: number;
  perceivedEffort?: number; // 1-10
  notes?: string;
  waterGlasses: number; // each glass = 250ml (e.g. 12 glasses = 3L)
  completedSupplements: string[]; // array of supplement ids taken
  supplementDoses?: Record<string, number>; // id -> amount taken (e.g. 2 tablets/capsules or 5g)
  completedNutritionItems: string[];
  foamRollerDone: boolean;
  sleepHours: number;
  updatedAt: string;
}

export interface ReminderSetting {
  id: string;
  title: string;
  time: string; // "HH:MM"
  enabled: boolean;
  description: string;
  category: 'workout' | 'supplement' | 'nutrition' | 'recovery';
}
