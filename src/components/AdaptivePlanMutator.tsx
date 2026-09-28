import React, { useState } from 'react';
import { Zap, ShieldCheck, Home, Flame, RotateCcw, Sparkles, Check, ChevronRight } from 'lucide-react';

interface Props {
  onMutatePlan: (mutatedPlan: string, mutationTitle: string, mutationDescription: string) => void;
  onResetScreenshotPlan: () => void;
}

export const AdaptivePlanMutator: React.FC<Props> = ({ onMutatePlan, onResetScreenshotPlan }) => {
  const [activeMutation, setActiveMutation] = useState<string>('original');
  const [justApplied, setJustApplied] = useState<string | null>(null);

  const MUTATIONS = [
    {
      id: 'express_20min',
      title: '⚡ 20-Min Density Express',
      tagline: 'Time-Capped Hypertrophy',
      icon: '⚡',
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      description: 'Pairs antagonistic muscle groups into rapid supersets (Chest + Back, Quads + Hamstrings) with 45s rest intervals. Maintains 97% training volume in half the time.',
      generatePlan: () => `## 7-Day High-Intensity Workout Plan (20-Min Density Express Adaptation)

[Adaptation Note: Program re-engineered into antagonistic supersets with 45-second rest intervals to maximize training density within 20-30 minute workout windows.]

**Day 1: Upper Body Push & Pull Supersets (20 Mins)**
* **Warm-up (3 mins):** 60s jumping jacks, arm swings, dynamic torso twists.
* **Superset A (3 rounds - 45s rest between rounds):**
  * Barbell Bench Press: 8-10 reps immediately followed by
  * Barbell Bent-Over Rows: 10-12 reps
* **Superset B (3 rounds - 45s rest between rounds):**
  * Dumbbell Overhead Press: 10 reps immediately followed by
  * Pull-ups (or Lat Pulldowns): 8-10 reps
* **Superset C (Arm Finisher - 2 rounds):**
  * Dumbbell Bicep Curls: 12 reps + Dumbbell Overhead Triceps Extension: 12 reps
* **Cooldown (2 mins):** Chest and lat doorway stretch.

**Day 2: Lower Body & Core Density (20 Mins)**
* **Warm-up (3 mins):** Bodyweight squats (15 reps), glute bridges (15 reps).
* **Superset A (3 rounds - 60s rest):**
  * Barbell Squats: 8-10 reps immediately followed by
  * Romanian Deadlifts: 10-12 reps
* **Superset B (3 rounds - 45s rest):**
  * Walking Lunges: 10 reps per leg immediately followed by
  * Hanging Leg Raises / Knee Tucks: 12 reps
* **Cooldown (2 mins):** Foam roll hamstrings and hip flexor stretch.

**Day 3: HIIT Cardio & Core Flush (18 Mins)**
* **Tabata Circuit (4 rounds, 20s work / 10s rest):**
  * Station 1: Burpees
  * Station 2: Mountain Climbers
  * Station 3: Kettlebell / Dumbbell Swings
  * Station 4: High Plank Hold

**Day 4: Active Recovery & Mobility (20 Mins)**
* **Protocol:** 20-min brisk outdoor walk + 5 mins thoracic spine openers.

**Day 5: Upper Body Hypertrophy Supersets (20 Mins)**
* **Superset A (3 rounds):** Incline Dumbbell Press (10 reps) + T-Bar Rows (10 reps)
* **Superset B (3 rounds):** Arnold Press (10 reps) + Chin-ups (8-10 reps)
* **Superset C (2 rounds):** Hammer Curls (12 reps) + Triceps Rope Extensions (12 reps)

**Day 6: Lower Body Power & Core (20 Mins)**
* **Superset A (3 rounds):** Front Squats (8-10 reps) + Hip Thrusts (12-15 reps)
* **Superset B (3 rounds):** Bulgarian Split Squats (8/leg) + Russian Twists (20 total)

**Day 7: Full Rest & Central Nervous System Recovery**
* **Focus:** Deep 8-hour sleep, hydration, and nutritional replenishment.`
    },
    {
      id: 'home_dumbbell',
      title: '🏠 Home & Dumbbell Only',
      tagline: 'Zero Heavy Machinery Needed',
      icon: '🏠',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      description: 'Replaces heavy barbells, cable stacks, and smith machines with versatile adjustable dumbbells, floor push-ups, and calisthenics.',
      generatePlan: () => `## 7-Day High-Intensity Workout Plan (Home & Dumbbell Adaptation)

[Adaptation Note: Calibrated for home gyms and dumbbell setups. Swapped barbell racks for tempo dumbbell presses, goblet squats, and calisthenic compound movements.]

**Day 1: Upper Body Home Strength**
* **Warm-up (5 mins):** Arm circles, push-up to downward dog, cat-cow mobility.
* **Main Workout:**
  * Flat / Floor Dumbbell Press: 4 sets of 10-12 reps
  * Bent-Over Dual Dumbbell Rows: 4 sets of 10-12 reps
  * Standing Dumbbell Shoulder Press: 3 sets of 10-12 reps
  * Push-ups (Tempo 3-0-1): 3 sets to technical failure
  * Dumbbell Bicep Hammer Curls: 3 sets of 12-15 reps
  * Overhead Dumbbell Triceps Extension: 3 sets of 12-15 reps
* **Cooldown (5 mins):** Doorway chest stretch and child's pose.

**Day 2: Lower Body Dumbbell Foundations**
* **Main Workout:**
  * Dumbbell Goblet Squats: 4 sets of 12-15 reps (hold heavy dumbbell at chest)
  * Dumbbell Romanian Deadlifts: 4 sets of 10-12 reps (deep hamstring stretch)
  * Dumbbell Bulgarian Split Squats: 3 sets of 10 reps per leg (rear foot on chair/couch)
  * Glute Bridges with Dumbbell on Hips: 3 sets of 15-20 reps
  * Floor Russian Twists (Weighted): 3 sets of 20 total
  * Hollow Body Plank: 3 sets of 45-60 seconds

**Day 3: Bodyweight & Dumbbell HIIT**
* **Exercises (4 rounds):**
  * Dumbbell Thrusters (Squat to Press): 12 reps
  * Mountain Climbers: 45 seconds
  * Dumbbell Renegade Rows in Plank: 12 total
  * Jump Squats (or Fast Air Squats): 15 reps

**Day 4: Rest or Light Mobility**
* **Focus:** Foam rolling, 30 min brisk walk, hydration.

**Day 5: Upper Body Sculpt (Home)**
* **Exercises:** Incline Push-ups, Single-Arm Dumbbell Rows, Arnold Press, Lateral Raises, Floor Diamond Push-ups.

**Day 6: Lower Body & Abs (Home)**
* **Exercises:** Dumbbell Sumo Squats, Walking Lunges, Single-Leg Romanian Deadlifts, Bicycle Crunches.

**Day 7: Full Rest & CNS Recovery**`
    },
    {
      id: 'joint_armor',
      title: '🩹 Joint Armor & Low-Impact',
      tagline: 'Knee & Lumbar Spine Protection',
      icon: '🛡️',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      description: 'Zero spinal axial loading and zero plyometric pounding. Uses isometric time-under-tension, slow 4-second eccentrics, and chest-supported positions to protect joints.',
      generatePlan: () => `## 7-Day High-Intensity Workout Plan (Joint Armor & Low-Impact Adaptation)

[Adaptation Note: Joint-protective variant. High mechanical tension achieved through slow 4-second eccentric tempo and isometric pauses without high-impact spinal compression.]

**Day 1: Upper Body Joint-Friendly Strength**
* **Warm-up (6 mins):** Light shoulder dislocates with towel, band pull-aparts, wrist and thoracic rotations.
* **Main Workout:**
  * Incline Dumbbell Press (Neutral Grip, 45° angle to spare rotator cuffs): 3 sets of 10-12 reps
  * Chest-Supported Incline Rows (Zero lumbar shear): 3 sets of 10-12 reps
  * Cable / Band Face Pulls: 3 sets of 15 reps (Rear delt and rotator cuff armor)
  * Dumbbell Floor Press: 3 sets of 10-12 reps (Elbow stops at floor, zero shoulder hyperextension)
  * Preacher / Incline Bicep Curls: 3 sets of 12 reps
  * Cable Triceps Pushdowns: 3 sets of 12-15 reps

**Day 2: Low-Impact Lower Body & Stability**
* **Warm-up (6 mins):** Glute bridge activations, lateral band walks, ankle dorsiflexion rocks.
* **Main Workout:**
  * Dumbbell Box Squats (Sit to bench, knees protected): 3 sets of 10-12 reps
  * Romanian Deadlifts with Dumbbells (Focus on hip hinge, neutral spine): 3 sets of 10-12 reps
  * Reverse Step-back Lunges (Far kinder to knees than forward lunges): 3 sets of 10/leg
  * Elevated Glute Bridges: 3 sets of 15-20 reps with 2-second squeeze at top
  * Deadbug & Bird-Dog Core Stabilizers: 3 sets of 12 per side

**Day 3: Low-Impact Aerobic Flush (Zero Jumps)**
* **Protocol:** Low-impact stationary cycling or brisk 4% incline treadmill walking for 25 mins + 10 mins core plank hold.

**Day 4: Active Restoration & Joint Decompression**
* **Protocol:** Swimming or yoga mobility flow.

**Day 5: Upper Body Hypertrophy (Neutral Angles)**
* **Exercises:** Neutral-Grip Lat Pulldowns, Machine Chest Press, Seated Dumbbell Press, Hammer Curls.

**Day 6: Posterior Chain & Core Focus**
* **Exercises:** Swiss Ball Leg Curls, Hip Thrusts, Cable Pallof Press, Farmer's Carries with neutral dumbbells.

**Day 7: Rest & Parasympathetic Recovery**`
    },
    {
      id: 'metabolic_blast',
      title: '🔥 Metabolic Fat Oxidation',
      tagline: 'Maximum Caloric Burn',
      icon: '🔥',
      badgeColor: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      description: 'Pairs compound muscle building with 45-second high-cadence metabolic finishers between clusters to accelerate visceral fat burning while maintaining lean mass.',
      generatePlan: () => `## 7-Day High-Intensity Workout Plan (Metabolic Fat Oxidation Adaptation)

[Adaptation Note: High-metabolic recomp adaptation. Strategic compound lifts coupled with short aerobic clusters to maximize EPOC (Excess Post-Exercise Oxygen Consumption).]

**Day 1: Upper Body Hypertrophy & Caloric Burn**
* **Warm-up (5 mins):** Jumping jacks, dynamic arm swings, inchworms.
* **Cluster 1:** Barbell Bench Press (3x10) + 45s Shadow Boxing / Fast Mountain Climbers
* **Cluster 2:** Pull-ups / Lat Pulldowns (3x10) + 45s Kettlebell Swings
* **Cluster 3:** Overhead Press (3x10) + 45s High Plank with Shoulder Taps
* **Cluster 4:** Dumbbell Curls & Triceps Dips + 45s Jumping Rope
* **Cooldown:** 5 mins static full body stretch.

**Day 2: Lower Body & Core Furnace**
* **Cluster 1:** Barbell Squats (3x10) + 45s Jump Squats / Fast Air Squats
* **Cluster 2:** Romanian Deadlifts (3x12) + 45s Glute Bridge Pulses
* **Cluster 3:** Walking Lunges (3x12/leg) + 45s Russian Twists
* **Cluster 4:** Hanging Leg Raises (3x12) + 45s Forearm Plank Hold

**Day 3: High-Intensity Interval Conditioning**
* **Tabata Circuit (5 rounds):** Burpees (30s) -> Mountain Climbers (30s) -> Jump Squats (30s) -> Plank (30s) -> Rest (45s).

**Day 4: Active Recovery**
* **Protocol:** 40 min brisk walk outdoors (Zone 2 fat oxidation).

**Day 5: Upper Body Sculpt & Metabolic Flush**
* **Exercises:** Incline Press, T-Bar Rows, Arnold Press, Hammer Curls + Cardio Bursts.

**Day 6: Full Body Density Blast**
* **Exercises:** Front Squats, Bulgarian Split Squats, Hip Thrusts, Wood Chops.

**Day 7: Full Rest & Restoration**`
    }
  ];

  const handleApplyMutation = (mutation: typeof MUTATIONS[0]) => {
    setActiveMutation(mutation.id);
    setJustApplied(mutation.title);
    const newPlan = mutation.generatePlan();
    onMutatePlan(newPlan, mutation.title, mutation.description);
    setTimeout(() => setJustApplied(null), 3500);
  };

  const handleReset = () => {
    setActiveMutation('original');
    setJustApplied('Original Screenshot Plan Restored');
    onResetScreenshotPlan();
    setTimeout(() => setJustApplied(null), 3000);
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Plan Adaptation Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">1-Tap Dynamic Mutators</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            Instant Adaptive Plan Tuning
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Instantly re-synthesize your 7-day program to match current equipment, schedule constraints, or joint sensitivities.
          </p>
        </div>

        {/* Restore Screenshot Plan Button */}
        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 border border-amber-800/60 font-mono text-xs transition-all flex items-center gap-2 shrink-0 shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>📸 Original Screenshot Plan</span>
        </button>
      </div>

      {/* Applied Banner Alert */}
      {justApplied && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-lg shadow-emerald-500/10 animate-fade-in relative z-10">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{justApplied}! View the updated workout schedule below.</span>
        </div>
      )}

      {/* Mutators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {MUTATIONS.map((mut) => {
          const isSelected = activeMutation === mut.id;
          return (
            <div
              key={mut.id}
              onClick={() => handleApplyMutation(mut)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-950/95 border-amber-500/80 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {mut.icon}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      {mut.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      {mut.tagline}
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${mut.badgeColor}`}>
                  {isSelected ? 'Active' : 'Apply'}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {mut.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Immediate 7-Day Adaptation</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Select Preset <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
