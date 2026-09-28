import React, { useState } from 'react';
import { Activity, Zap, ShieldCheck, Flame, Info, CheckCircle2, ChevronRight, Dumbbell } from 'lucide-react';

interface MuscleData {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'core' | 'arms';
  primaryDays: number[];
  secondaryDays: number[];
  exercisesByDay: Record<number, string>;
  biomechanicsCue: string;
  hypertrophyActivation: number; // percentage
  recoveryHours: number;
}

const MUSCLE_DATABASE: Record<string, MuscleData> = {
  pecs: {
    id: 'pecs',
    name: 'Pectoralis Major & Minor',
    category: 'upper',
    primaryDays: [1, 5],
    secondaryDays: [3],
    exercisesByDay: {
      1: 'Barbell Bench Press (3 sets × 8–12 reps)',
      5: 'Incline Dumbbell Press (3 sets × 8–12 reps)',
      3: 'Burpees & High-Cadence Push-offs'
    },
    biomechanicsCue: 'Retract and depress scapulae into bench, touch mid-sternum with 45° elbow flare to protect rotator cuffs.',
    hypertrophyActivation: 96,
    recoveryHours: 48
  },
  delts: {
    id: 'delts',
    name: 'Deltoids (Anterior, Lateral, Rear)',
    category: 'upper',
    primaryDays: [1, 5],
    secondaryDays: [3],
    exercisesByDay: {
      1: 'Overhead Press (3 sets × 8–12 reps)',
      5: 'Arnold Press (3 sets × 8–12 reps)',
      3: 'Kettlebell Overhead Swings'
    },
    biomechanicsCue: 'Keep core braced and ribs locked down. Press bar in slight arc ending directly over the cervical spine.',
    hypertrophyActivation: 92,
    recoveryHours: 48
  },
  lats: {
    id: 'lats',
    name: 'Latissimus Dorsi & Rhomboids',
    category: 'upper',
    primaryDays: [1, 5],
    secondaryDays: [2],
    exercisesByDay: {
      1: 'Pull-ups / Lat Pulldowns & Barbell Rows (3 sets × 8–12 reps)',
      5: 'Chin-ups & T-Bar Rows (3 sets × 8–12 reps)',
      2: 'Romanian Deadlifts (scapular stabilizer)'
    },
    biomechanicsCue: 'Pull through the elbows, not the forearms. Drive elbows down toward the hip pockets and hold peak squeeze for 1 second.',
    hypertrophyActivation: 95,
    recoveryHours: 48
  },
  biceps: {
    id: 'biceps',
    name: 'Biceps Brachii & Brachialis',
    category: 'arms',
    primaryDays: [1, 5],
    secondaryDays: [],
    exercisesByDay: {
      1: 'Dumbbell Bicep Curls (3 sets × 10–15 reps)',
      5: 'Hammer Curls (3 sets × 10–15 reps)'
    },
    biomechanicsCue: 'Pin elbows to ribs and supinate wrists at peak contraction for maximal long-head recruitment.',
    hypertrophyActivation: 89,
    recoveryHours: 36
  },
  triceps: {
    id: 'triceps',
    name: 'Triceps Brachii (Long, Lateral, Medial)',
    category: 'arms',
    primaryDays: [1, 5],
    secondaryDays: [],
    exercisesByDay: {
      1: 'Dumbbell Triceps Extensions (3 sets × 10–15 reps)',
      5: 'Overhead Triceps Extensions (3 sets × 10–15 reps)'
    },
    biomechanicsCue: 'Keep upper arms perpendicular to torso and flare elbows outward as little as possible.',
    hypertrophyActivation: 91,
    recoveryHours: 36
  },
  abs: {
    id: 'abs',
    name: 'Rectus Abdominis & Transverse Abdominis',
    category: 'core',
    primaryDays: [2, 3, 6],
    secondaryDays: [1, 5],
    exercisesByDay: {
      2: 'Hanging Leg Raises & Russian Twists',
      3: 'Plank Variations (High, Forearm, Side) (30–60s)',
      6: 'Cable Crunches (3 sets to failure)'
    },
    biomechanicsCue: 'Curl the pelvis toward the rib cage rather than flexing at the hips to isolate abdominal fibers.',
    hypertrophyActivation: 94,
    recoveryHours: 24
  },
  obliques: {
    id: 'obliques',
    name: 'Internal & External Obliques',
    category: 'core',
    primaryDays: [2, 3, 6],
    secondaryDays: [],
    exercisesByDay: {
      2: 'Russian Twists (3 sets × 15–20 reps)',
      3: 'Side Planks & Mountain Climbers',
      6: 'Wood Chops (Cable Machine) (3 sets × 15–20 reps)'
    },
    biomechanicsCue: 'Rotate the thoracic cage while keeping hips relatively stable to generate high torsional torque.',
    hypertrophyActivation: 88,
    recoveryHours: 24
  },
  quads: {
    id: 'quads',
    name: 'Quadriceps Femoris',
    category: 'lower',
    primaryDays: [2, 6],
    secondaryDays: [3],
    exercisesByDay: {
      2: 'Barbell Squats & Walking Lunges (3 sets × 8–12 reps)',
      6: 'Front Squats & Bulgarian Split Squats (3 sets × 8–12 reps)',
      3: 'Jump Squats & Burpees'
    },
    biomechanicsCue: 'Drive knees in line with toes, maintain mid-foot pressure, and squat below parallel without pelvic tuck.',
    hypertrophyActivation: 98,
    recoveryHours: 72
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Biceps Femoris & Semitendinosus',
    category: 'lower',
    primaryDays: [2, 6],
    secondaryDays: [],
    exercisesByDay: {
      2: 'Romanian Deadlifts (3 sets × 10–15 reps)',
      6: 'Good Mornings (3 sets × 10–15 reps)'
    },
    biomechanicsCue: 'Push hips backward into the wall while keeping knees soft; feel a deep stretch along the posterior thigh.',
    hypertrophyActivation: 94,
    recoveryHours: 72
  },
  glutes: {
    id: 'glutes',
    name: 'Gluteus Maximus & Medius',
    category: 'lower',
    primaryDays: [2, 6],
    secondaryDays: [3],
    exercisesByDay: {
      2: 'Glute Bridges (3 sets × 15–20 reps)',
      6: 'Hip Thrusts (3 sets × 15–20 reps)',
      3: 'Kettlebell Swings (hip hinge snap)'
    },
    biomechanicsCue: 'Tuck chin and posterior pelvic tilt at top lockout; squeeze glutes intensely without hyperextending lumbar spine.',
    hypertrophyActivation: 97,
    recoveryHours: 48
  },
  calves: {
    id: 'calves',
    name: 'Gastrocnemius & Soleus',
    category: 'lower',
    primaryDays: [2, 6],
    secondaryDays: [3],
    exercisesByDay: {
      2: 'Walking Lunges (plantar stabilization)',
      6: 'Split Squats & Standing Calves',
      3: 'Jump Squats & Cardio Drills'
    },
    biomechanicsCue: 'Hold 2-second stretch at bottom and explosive plantar flexion at peak contraction.',
    hypertrophyActivation: 85,
    recoveryHours: 24
  }
};

interface Props {
  currentDay: number;
  onSelectDay?: (day: number) => void;
}

export const BiomechanicalMuscleHeatmap: React.FC<Props> = ({ currentDay, onSelectDay }) => {
  const [activeDay, setActiveDay] = useState<number>(currentDay || 1);
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('pecs');
  const [viewPerspective, setViewPerspective] = useState<'anterior' | 'posterior'>('anterior');

  const selectedMuscle = MUSCLE_DATABASE[selectedMuscleId] || MUSCLE_DATABASE.pecs;

  const handleDayChange = (day: number) => {
    setActiveDay(day);
    if (onSelectDay) onSelectDay(day);

    // Auto-select a primary muscle for that day
    if (day === 1 || day === 5) setSelectedMuscleId('pecs');
    else if (day === 2 || day === 6) setSelectedMuscleId('quads');
    else if (day === 3) setSelectedMuscleId('abs');
    else setSelectedMuscleId('pecs');
  };

  const getActivationColor = (muscleId: string) => {
    const data = MUSCLE_DATABASE[muscleId];
    if (!data) return '#334155';

    if (data.primaryDays.includes(activeDay)) {
      return '#f97316'; // Primary focus - glowing orange
    }
    if (data.secondaryDays.includes(activeDay)) {
      return '#06b6d4'; // Secondary stabilizer - electric cyan
    }
    return '#1e293b'; // Rest / low activation
  };

  const isMusclePrimary = (muscleId: string) => {
    return MUSCLE_DATABASE[muscleId]?.primaryDays.includes(activeDay);
  };

  const isMuscleSecondary = (muscleId: string) => {
    return MUSCLE_DATABASE[muscleId]?.secondaryDays.includes(activeDay);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Background Neon Glow Orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Innovative Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Biomechanical Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">3D Neuromuscular Map</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            Interactive Muscle Activation Heatmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Click on anatomical regions or switch workout days to inspect tension angles and neuromuscular fiber recruitment.
          </p>
        </div>

        {/* View Perspective Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setViewPerspective('anterior')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewPerspective === 'anterior'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            type="button"
            onClick={() => setViewPerspective('posterior')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewPerspective === 'posterior'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      {/* 7-Day Day Selector Strip */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {[
          { day: 1, label: 'Day 1: Upper Strength', icon: '🏋️' },
          { day: 2, label: 'Day 2: Lower & Core', icon: '🦵' },
          { day: 3, label: 'Day 3: HIIT Cardio', icon: '🔥' },
          { day: 4, label: 'Day 4: Active Recovery', icon: '🧘' },
          { day: 5, label: 'Day 5: Upper Hypertrophy', icon: '💪' },
          { day: 6, label: 'Day 6: Lower Hypertrophy', icon: '⚡' },
          { day: 7, label: 'Day 7: Full Rest', icon: '💤' }
        ].map((item) => (
          <button
            key={item.day}
            type="button"
            onClick={() => handleDayChange(item.day)}
            className={`px-3 py-2 rounded-xl font-mono text-xs transition-all shrink-0 flex items-center gap-2 border ${
              activeDay === item.day
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-black shadow-lg shadow-orange-500/25 border-orange-400 scale-[1.02]'
                : 'bg-slate-950/80 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Heatmap Grid: Anatomy Canvas + Live Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Left Column: Interactive Anatomical Figure (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl border border-slate-800/90 p-6 flex flex-col items-center justify-center relative min-h-[380px] shadow-inner">
          {/* Heatmap Legend */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 text-[10px] font-mono bg-slate-900/80 backdrop-blur-sm p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50 animate-pulse" />
              <span className="text-orange-300 font-semibold">Primary Focus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
              <span className="text-cyan-300 font-semibold">Synergist / Core</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span className="text-slate-400">Rest / Minimal</span>
            </div>
          </div>

          {/* Perspective Label */}
          <div className="absolute top-3 right-3 text-[11px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
            {viewPerspective === 'anterior' ? 'Frontal Plane' : 'Dorsal Plane'}
          </div>

          {/* SVG Anatomy Map */}
          <div className="w-full max-w-[260px] h-[340px] flex items-center justify-center relative">
            <svg
              viewBox="0 0 200 320"
              className="w-full h-full drop-shadow-[0_0_20px_rgba(249,115,22,0.15)] select-none"
            >
              {/* Head Silhouette */}
              <circle cx="100" cy="30" r="16" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
              {/* Neck */}
              <rect x="94" y="45" width="12" height="12" rx="2" fill="#1e293b" />

              {viewPerspective === 'anterior' ? (
                /* ANTERIOR VIEW */
                <g>
                  {/* Traps (Anterior collarbone) */}
                  <path
                    d="M84 48 L100 56 L116 48 L130 58 L100 64 L70 58 Z"
                    fill={getActivationColor('lats')}
                    stroke="#0f172a"
                    strokeWidth="1.5"
                    className="cursor-pointer transition-all hover:opacity-80"
                    onClick={() => setSelectedMuscleId('lats')}
                  />

                  {/* Left & Right Shoulders (Deltoids) */}
                  <path
                    d="M62 60 C56 68 56 82 64 92 C68 85 70 72 68 60 Z"
                    fill={getActivationColor('delts')}
                    stroke={selectedMuscleId === 'delts' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'delts' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('delts')}
                  />
                  <path
                    d="M138 60 C144 68 144 82 136 92 C132 85 130 72 132 60 Z"
                    fill={getActivationColor('delts')}
                    stroke={selectedMuscleId === 'delts' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'delts' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('delts')}
                  />

                  {/* Chest (Pectoralis Major) */}
                  <path
                    d="M72 62 C85 64 98 68 99 88 C85 92 70 85 68 68 Z"
                    fill={getActivationColor('pecs')}
                    stroke={selectedMuscleId === 'pecs' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'pecs' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('pecs')}
                  />
                  <path
                    d="M128 62 C115 64 102 68 101 88 C115 92 130 85 132 68 Z"
                    fill={getActivationColor('pecs')}
                    stroke={selectedMuscleId === 'pecs' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'pecs' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('pecs')}
                  />

                  {/* Biceps */}
                  <rect
                    x="56"
                    y="92"
                    width="11"
                    height="28"
                    rx="5"
                    fill={getActivationColor('biceps')}
                    stroke={selectedMuscleId === 'biceps' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'biceps' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('biceps')}
                  />
                  <rect
                    x="133"
                    y="92"
                    width="11"
                    height="28"
                    rx="5"
                    fill={getActivationColor('biceps')}
                    stroke={selectedMuscleId === 'biceps' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'biceps' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('biceps')}
                  />

                  {/* Forearms */}
                  <rect x="52" y="122" width="10" height="34" rx="4" fill="#1e293b" stroke="#0f172a" />
                  <rect x="138" y="122" width="10" height="34" rx="4" fill="#1e293b" stroke="#0f172a" />

                  {/* Rectus Abdominis (Abs 6-pack) */}
                  <g
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('abs')}
                  >
                    <rect
                      x="88"
                      y="92"
                      width="10"
                      height="12"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                    <rect
                      x="102"
                      y="92"
                      width="10"
                      height="12"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                    <rect
                      x="88"
                      y="107"
                      width="10"
                      height="12"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                    <rect
                      x="102"
                      y="107"
                      width="10"
                      height="12"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                    <rect
                      x="88"
                      y="122"
                      width="10"
                      height="14"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                    <rect
                      x="102"
                      y="122"
                      width="10"
                      height="14"
                      rx="2"
                      fill={getActivationColor('abs')}
                      stroke="#0f172a"
                    />
                  </g>

                  {/* External Obliques */}
                  <path
                    d="M74 94 C76 110 80 130 84 138 C80 130 76 110 74 94 Z"
                    fill={getActivationColor('obliques')}
                    stroke={selectedMuscleId === 'obliques' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('obliques')}
                  />
                  <path
                    d="M126 94 C124 110 120 130 116 138 C120 130 124 110 126 94 Z"
                    fill={getActivationColor('obliques')}
                    stroke={selectedMuscleId === 'obliques' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('obliques')}
                  />

                  {/* Quadriceps (Thighs) */}
                  <path
                    d="M76 148 C72 170 70 195 76 220 C82 220 92 195 94 150 Z"
                    fill={getActivationColor('quads')}
                    stroke={selectedMuscleId === 'quads' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'quads' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('quads')}
                  />
                  <path
                    d="M124 148 C128 170 130 195 124 220 C118 220 108 195 106 150 Z"
                    fill={getActivationColor('quads')}
                    stroke={selectedMuscleId === 'quads' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'quads' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('quads')}
                  />

                  {/* Knees */}
                  <circle cx="82" cy="227" r="5" fill="#1e293b" />
                  <circle cx="118" cy="227" r="5" fill="#1e293b" />

                  {/* Calves (Anterior Tibialis) */}
                  <path
                    d="M76 235 C74 255 76 280 80 295 C84 295 86 270 85 235 Z"
                    fill={getActivationColor('calves')}
                    stroke={selectedMuscleId === 'calves' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('calves')}
                  />
                  <path
                    d="M124 235 C126 255 124 280 120 295 C116 295 114 270 115 235 Z"
                    fill={getActivationColor('calves')}
                    stroke={selectedMuscleId === 'calves' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('calves')}
                  />
                </g>
              ) : (
                /* POSTERIOR VIEW */
                <g>
                  {/* Trapezius */}
                  <path
                    d="M84 48 L100 52 L116 48 L126 68 L100 96 L74 68 Z"
                    fill={getActivationColor('lats')}
                    stroke={selectedMuscleId === 'lats' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('lats')}
                  />

                  {/* Rear Deltoids */}
                  <path
                    d="M62 62 C58 70 58 80 64 88 C68 80 70 70 68 62 Z"
                    fill={getActivationColor('delts')}
                    stroke={selectedMuscleId === 'delts' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('delts')}
                  />
                  <path
                    d="M138 62 C142 70 142 80 136 88 C132 80 130 70 132 62 Z"
                    fill={getActivationColor('delts')}
                    stroke={selectedMuscleId === 'delts' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('delts')}
                  />

                  {/* Triceps */}
                  <rect
                    x="56"
                    y="88"
                    width="11"
                    height="28"
                    rx="5"
                    fill={getActivationColor('triceps')}
                    stroke={selectedMuscleId === 'triceps' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'triceps' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('triceps')}
                  />
                  <rect
                    x="133"
                    y="88"
                    width="11"
                    height="28"
                    rx="5"
                    fill={getActivationColor('triceps')}
                    stroke={selectedMuscleId === 'triceps' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'triceps' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('triceps')}
                  />

                  {/* Latissimus Dorsi (Lats V-Taper) */}
                  <path
                    d="M72 74 C80 84 84 110 88 134 C76 120 70 100 70 80 Z"
                    fill={getActivationColor('lats')}
                    stroke={selectedMuscleId === 'lats' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('lats')}
                  />
                  <path
                    d="M128 74 C120 84 116 110 112 134 C124 120 130 100 130 80 Z"
                    fill={getActivationColor('lats')}
                    stroke={selectedMuscleId === 'lats' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('lats')}
                  />

                  {/* Gluteus Maximus */}
                  <path
                    d="M76 142 C72 155 76 172 88 172 C98 172 98 152 98 142 Z"
                    fill={getActivationColor('glutes')}
                    stroke={selectedMuscleId === 'glutes' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'glutes' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('glutes')}
                  />
                  <path
                    d="M124 142 C128 155 124 172 112 172 C102 172 102 152 102 142 Z"
                    fill={getActivationColor('glutes')}
                    stroke={selectedMuscleId === 'glutes' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'glutes' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('glutes')}
                  />

                  {/* Hamstrings (Back of Thighs) */}
                  <path
                    d="M76 175 C72 195 72 215 78 225 C84 225 94 205 96 175 Z"
                    fill={getActivationColor('hamstrings')}
                    stroke={selectedMuscleId === 'hamstrings' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'hamstrings' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('hamstrings')}
                  />
                  <path
                    d="M124 175 C128 195 128 215 122 225 C116 225 106 205 104 175 Z"
                    fill={getActivationColor('hamstrings')}
                    stroke={selectedMuscleId === 'hamstrings' ? '#f97316' : '#0f172a'}
                    strokeWidth={selectedMuscleId === 'hamstrings' ? 2 : 1}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('hamstrings')}
                  />

                  {/* Calves (Gastrocnemius Diamond) */}
                  <path
                    d="M74 235 C70 255 74 275 80 295 C88 280 88 255 86 235 Z"
                    fill={getActivationColor('calves')}
                    stroke={selectedMuscleId === 'calves' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('calves')}
                  />
                  <path
                    d="M126 235 C130 255 126 275 120 295 C112 280 112 255 114 235 Z"
                    fill={getActivationColor('calves')}
                    stroke={selectedMuscleId === 'calves' ? '#f97316' : '#0f172a'}
                    className="cursor-pointer transition-all hover:brightness-125"
                    onClick={() => setSelectedMuscleId('calves')}
                  />
                </g>
              )}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 text-center flex items-center gap-1 font-mono">
            <span>💡 Click any muscle body group to view biomechanics</span>
          </div>
        </div>

        {/* Right Column: Live Neuromuscular Telemetry Card (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <div className="text-[10px] font-mono text-orange-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                Target Muscle Telemetry · Day {activeDay}
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {selectedMuscle.name}
              </h4>
            </div>

            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                isMusclePrimary(selectedMuscle.id)
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  : isMuscleSecondary(selectedMuscle.id)
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {isMusclePrimary(selectedMuscle.id)
                  ? 'Primary Driver'
                  : isMuscleSecondary(selectedMuscle.id)
                  ? 'Stabilizer / Core'
                  : 'Recovery Phase'}
              </span>
            </div>
          </div>

          {/* Targeted Exercise in Active Day */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Dumbbell className="w-4 h-4" />
              <span>Target Movement in Day {activeDay}:</span>
            </div>
            <p className="text-sm font-semibold text-white">
              {selectedMuscle.exercisesByDay[activeDay] || 'Scheduled for recovery / active flush on this day.'}
            </p>
          </div>

          {/* Biomechanical Form Cue */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Biomechanical Form Cue & Mind-Muscle Vector:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed font-sans">
              "{selectedMuscle.biomechanicsCue}"
            </p>
          </div>

          {/* Telemetry Meters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Hypertrophy Index</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-white font-mono">{selectedMuscle.hypertrophyActivation}%</span>
                <span className="text-[10px] text-emerald-400 font-bold">Max</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  style={{ width: `${selectedMuscle.hypertrophyActivation}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Recovery Window</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-cyan-300 font-mono">{selectedMuscle.recoveryHours}h</span>
                <span className="text-[10px] text-slate-400">supercomp.</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">Full ATP/glycogen flush</span>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Days</span>
              <div className="flex items-center gap-1.5 mt-1.5">
                {selectedMuscle.primaryDays.map((d) => (
                  <span key={d} className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold flex items-center justify-center">
                    D{d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
