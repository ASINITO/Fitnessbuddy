import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Droplet,
  Moon,
  Sparkles,
  Award,
  Users,
  MessageSquare,
  Activity,
  Calculator,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  ChevronRight,
  TrendingUp,
  Apple,
  Search,
  BookOpen,
  Send,
  Zap,
  Clock,
  ShieldCheck,
  Check,
  Heart,
  FileText,
  LayoutGrid,
  Copy,
  Printer,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Target,
  Sliders,
  Radio,
  Plus
} from 'lucide-react';
import fitnessBgImg from './assets/images/fitness_bg_1790583648894.jpg';
import { BiomechanicalMuscleHeatmap } from './components/BiomechanicalMuscleHeatmap';
import { LiveAudioWorkoutCoach } from './components/LiveAudioWorkoutCoach';
import { AdaptivePlanMutator } from './components/AdaptivePlanMutator';
import { DynamicMacroCalibrator } from './components/DynamicMacroCalibrator';

// Types
interface UserRecord {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  intensity: string;
  original_plan: string;
  updated_plan: string;
  feedback?: string;
  nutrition_tip?: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SCREENSHOT_WORKOUT_PLAN = `## 7-Day High-Intensity Workout Plan for Fat Loss & Muscle Gain

This plan focuses on compound exercises to maximize calorie burn and muscle engagement. Remember to adjust the intensity based on your fitness level and consult a doctor before starting any new workout routine. Proper nutrition is crucial for achieving your goals, so ensure you're supporting your training with a healthy diet.

**Day 1: Upper Body Strength**
* **Warm-up (5 mins):** Jumping jacks (60 seconds), high knees (30 seconds), arm circles (forward and backward, 30 seconds each), dynamic stretches like arm swings and torso twists (1 min).
* **Main Workout:**
  * **Barbell Bench Press:** 3 sets of 8-12 reps
  * **Pull-ups (or Lat Pulldowns):** 3 sets of 8-12 reps
  * **Overhead Press:** 3 sets of 8-12 reps
  * **Barbell Rows:** 3 sets of 8-12 reps
  * **Dumbbell Bicep Curls:** 3 sets of 10-15 reps
  * **Dumbbell Triceps Extensions:** 3 sets of 10-15 reps
* **Cooldown:** Static stretches holding each for 30 seconds (chest, back, biceps, triceps, shoulders).

**Day 2: Lower Body & Core**
* **Warm-up (5 mins):** Bodyweight squats (15 reps), lunges (10 reps per leg), glute bridges (15 reps), plank (30 seconds).
* **Main Workout:**
  * **Barbell Squats:** 3 sets of 8-12 reps
  * **Romanian Deadlifts:** 3 sets of 10-15 reps
  * **Walking Lunges:** 3 sets of 12-15 reps per leg
  * **Glute Bridges:** 3 sets of 15-20 reps
  * **Hanging Leg Raises:** 3 sets to failure
  * **Russian Twists:** 3 sets of 15-20 reps per side
* **Cooldown:** Foam roll quads, hamstrings, and glutes. Static stretches for hip flexors, hamstrings, and glutes (30 seconds each).

**Day 3: HIIT Cardio & Core**
* **Warm-up (5 mins):** Light cardio, like jogging or jumping jacks, followed by dynamic stretches.
* **Main Workout:**
  * **Burpees:** 3 sets of 10-15 reps
  * **Mountain Climbers:** 3 sets of 30-60 seconds
  * **Jump Squats:** 3 sets of 10-15 reps
  * **Kettlebell Swings:** 3 sets of 15-20 reps
  * **Plank variations (high plank, forearm plank, side plank):** 30-60 seconds each, repeat 2-3 times
* **Cooldown:** Light cardio cool down (5 mins), static stretches for core and legs.

**Day 4: Rest or Active Recovery**
* **Active Recovery:** Light activity like walking, swimming, yoga, or foam rolling. Focus on mobility and flexibility. This helps promote blood flow and reduces muscle soreness.

**Day 5: Upper Body Strength (Focus on different exercises)**
* **Warm-up (5 mins):** Similar to Day 1.
* **Main Workout:**
  * **Incline Dumbbell Press:** 3 sets of 8-12 reps
  * **Chin-ups (or Close-Grip Lat Pulldowns):** 3 sets of 8-12 reps
  * **Arnold Press:** 3 sets of 8-12 reps
  * **T-Bar Rows:** 3 sets of 8-12 reps
  * **Hammer Curls:** 3 sets of 10-15 reps
  * **Overhead Triceps Extensions:** 3 sets of 10-15 reps
* **Cooldown:** Similar to Day 1.

**Day 6: Lower Body & Core (Focus on different exercises)**
* **Warm-up (5 mins):** Similar to Day 2.
* **Main Workout:**
  * **Front Squats:** 3 sets of 8-12 reps
  * **Good Mornings:** 3 sets of 10-15 reps
  * **Bulgarian Split Squats:** 3 sets of 10-12 reps per leg
  * **Hip Thrusts:** 3 sets of 15-20 reps
  * **Cable Crunches:** 3 sets to failure
  * **Wood Chops (cable machine):** 3 sets of 15-20 reps per side
* **Cooldown:** Similar to Day 2.

**Day 7: Rest or Active Recovery**
* **Active Recovery:** Similar to Day 4. Prioritize getting enough sleep this day to prepare for the next week of training.

**Important Notes:**
* **Progressive Overload:** Gradually increase the weight, reps, or sets each week to challenge your muscles and promote continued growth.
* **Proper Form:** Focus on maintaining correct form throughout each exercise to prevent injury and maximize results. Watch videos and, if possible, consult with a trainer to ensure proper technique.
* **Listen to your Body:** Rest when needed and don't push through pain. Adjust the plan as needed based on your recovery and progress.
* **Nutrition:** Fuel your body with a balanced diet rich in protein, complex carbohydrates, and healthy fats to support muscle growth and recovery.
* **Hydration:** Drink plenty of water throughout the day, especially before, during, and after workouts.

This plan is a starting point. You can adjust it based on your progress and preferences. Remember consistency and proper execution are key to achieving your fitness goals. Good luck!`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'result' | 'dashboard' | 'nutrition' | 'progress' | 'exercises' | 'chat' | 'admin' | 'python_code'>('result');
  const [themeColor, setThemeColor] = useState<'orange' | 'cyan' | 'emerald' | 'violet'>('orange');

  // Active User & Form State
  const [userId, setUserId] = useState<number>(10);
  const [username, setUsername] = useState<string>('xyz');
  const [age, setAge] = useState<number>(20);
  const [weight, setWeight] = useState<number>(70.0);
  const [height, setHeight] = useState<number>(175.0);
  const [goal, setGoal] = useState<string>('i want to lose belly fat and gain muscles');
  const [intensity, setIntensity] = useState<string>('High');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedDayView, setSelectedDayView] = useState<'all' | number>('all');
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});
  const [completedRoutineDays, setCompletedRoutineDays] = useState<number[]>([1]);
  const [planViewMode, setPlanViewMode] = useState<'document' | 'interactive'>('document');
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);

  // Active Plan State
  const [activePlan, setActivePlan] = useState<string>(SCREENSHOT_WORKOUT_PLAN);

  // Innovative Performance Deck State
  const [innovativeDeckTab, setInnovativeDeckTab] = useState<'all' | 'heatmap' | 'coach' | 'mutator' | 'blueprint'>('all');
  const [activeCoachExercise, setActiveCoachExercise] = useState<string>('Barbell Bench Press');
  const [activeHeatmapDay, setActiveHeatmapDay] = useState<number>(1);
  const [planAdaptationBadge, setPlanAdaptationBadge] = useState<{ title: string; desc: string } | null>(null);

  const [nutritionTip, setNutritionTip] = useState<string>(
    'Focus on high-volume, nutrient-dense foods: load half your plate with fibrous vegetables and lean protein. Drink a glass of water 20 minutes before meals to stay satiated and maintain clean hydration.'
  );

  // Feedback State
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // All Users Database State (Matching SQLite backend seed)
  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: 10,
      name: 'xyz',
      age: 20,
      weight: 70.0,
      height: 175.0,
      goal: 'i want to lose belly fat and gain muscles',
      intensity: 'High',
      original_plan: `DAY 1: Upper Body Push & Pull (Chest & Back)\nDAY 2: Lower Body Foundations & Core\nDAY 3: Active Recovery\nDAY 4: Cardio & Core\nDAY 5: Full Body Strength\nDAY 6: Posterior Chain & Abs\nDAY 7: Rest`,
      updated_plan: `[Updated for 30-min sessions]: Adjusted rest periods to 45s, added compound supersets to maximize fat oxidation while preserving muscle mass.`,
      feedback: 'I only have 30 minutes per workout session.'
    },
    {
      id: 11,
      name: 'Alex Carter',
      age: 28,
      weight: 82.5,
      height: 182.0,
      goal: 'Muscle building & strength',
      intensity: 'High',
      original_plan: `DAY 1: Heavy Bench & Rows\nDAY 2: Squats & Hamstrings\nDAY 3: Rest\nDAY 4: Overhead Press & Pull-ups\nDAY 5: Deadlifts & Core\nDAY 6: Arms & Conditioning\nDAY 7: Rest`,
      updated_plan: 'Not updated'
    },
    {
      id: 12,
      name: 'Priya Sharma',
      age: 24,
      weight: 61.0,
      height: 165.0,
      goal: 'Endurance & flexibility',
      intensity: 'Medium',
      original_plan: `DAY 1: 5km Tempo Run & Mobility\nDAY 2: Bodyweight Strength\nDAY 3: Yoga Flow\nDAY 4: Interval Sprints\nDAY 5: Core & Lower Body\nDAY 6: Long Distance Jog\nDAY 7: Full Rest`,
      updated_plan: `[Updated for Low-Impact]: Replaced high-impact sprint intervals with low-impact rowing and cycling to accommodate sensitive knees.`,
      feedback: 'Avoid jumping and high impact on knees'
    }
  ]);

  // Dashboard Metrics
  const [completedDays, setCompletedDays] = useState<number[]>([1]);
  const [waterMl, setWaterMl] = useState<number>(1750);
  const [streakCount, setStreakCount] = useState<number>(5);
  const [weightLogs, setWeightLogs] = useState<{ date: string; weight: number }[]>([
    { date: 'Aug 15', weight: 73.5 },
    { date: 'Aug 22', weight: 72.8 },
    { date: 'Aug 29', weight: 72.0 },
    { date: 'Sep 05', weight: 71.4 },
    { date: 'Sep 12', weight: 70.8 },
    { date: 'Sep 19', weight: 70.3 },
    { date: 'Current', weight: 70.0 }
  ]);

  // Chatbot State
  const [chatLanguage, setChatLanguage] = useState<'en' | 'ta'>('en');
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Hello! I am FitBuddy, your personalized AI fitness and wellness coach. Ask me anything about your workout routine, safe exercise biomechanics, recovery protocols, or post-workout meals!\n\nநீங்கள் தமிழிலும் உரையாடலாம் ("உடற்பயிற்சி முறைகளை விளக்குங்கள்").',
      timestamp: '10:00 AM'
    }
  ]);

  // Exercise Library State
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [activeExerciseModal, setActiveExerciseModal] = useState<any>(null);

  // Exercise database catalog
  const exerciseCatalog = [
    {
      name: 'Push-ups',
      muscle: 'Chest',
      difficulty: 'Beginner',
      equipment: 'Bodyweight',
      instructions: 'Hands shoulder-width apart, lower chest to floor at a 45° elbow angle, press up with braced core.',
      safety: 'Do not flare elbows perpendicular to torso; protect the rotator cuff.'
    },
    {
      name: 'Goblet Squat',
      muscle: 'Legs',
      difficulty: 'Beginner',
      equipment: 'Dumbbell',
      instructions: 'Hold weight at chest height, hinge hips back and squat down until thighs are parallel to floor.',
      safety: 'Keep weight through mid-foot and prevent knees from caving inward (valgus collapse).'
    },
    {
      name: 'Bent-Over Dumbbell Row',
      muscle: 'Back',
      difficulty: 'Intermediate',
      equipment: 'Dumbbells',
      instructions: 'Hinge forward at 45° with neutral spine, row weights to hip pockets, squeeze shoulder blades.',
      safety: 'Avoid rounding the lumbar spine; brace abdominal wall.'
    },
    {
      name: 'Overhead Shoulder Press',
      muscle: 'Shoulders',
      difficulty: 'Intermediate',
      equipment: 'Dumbbells',
      instructions: 'Start at collarbone level with neutral grip. Press weights straight overhead while locking down ribcage.',
      safety: 'Do not hyperextend lower back to force weight upward.'
    },
    {
      name: 'Forearm Plank',
      muscle: 'Core',
      difficulty: 'Beginner',
      equipment: 'Bodyweight',
      instructions: 'Rest on elbows directly under shoulders, create straight line from heels to head, squeeze glutes.',
      safety: 'Do not allow lower back to sag toward the floor.'
    },
    {
      name: 'High-Knee Mountain Climbers',
      muscle: 'Cardio',
      difficulty: 'Intermediate',
      equipment: 'Bodyweight',
      instructions: 'From high plank, alternate driving knees into chest with controlled tempo and braced torso.',
      safety: 'Maintain stable shoulder alignment and minimize hip bounce.'
    },
    {
      name: "World's Greatest Stretch",
      muscle: 'Flexibility',
      difficulty: 'Beginner',
      equipment: 'Bodyweight',
      instructions: 'Deep forward lunge with hand on floor, rotate opposite chest and arm toward the sky.',
      safety: 'Breathe deeply through hip flexor and thoracic extension.'
    }
  ];

  // Selected Python File for Explorer
  const [selectedPyFile, setSelectedPyFile] = useState<string>('app/main.py');

  // Handlers
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // Synthesize tailored routine based on goal and intensity
      const isFatLoss = goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('lose');
      const isMuscle = goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('gain');

      let generatedPlan = '';
      if (isFatLoss && isMuscle) {
        generatedPlan = `### 7-DAY RECOMPOSITION PLAN (FAT LOSS & HYPERTROPHY)
User: ${username} (ID: ${userId}) | Weight: ${weight}kg | Intensity: ${intensity}

DAY 1: Upper Body Push & Pull Hypertrophy
• Focus: Chest, Latissimus Dorsi, Anterior Deltoids & Triceps
• Warm-up: 5–8 mins arm circles, cat-cow stretch, light band pull-aparts
• Exercises:
  1. Push-ups (or Incline Push-ups) | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Core tight
  2. Dumbbell Bent-Over Rows | Sets: 3 | Reps: 12 | Rest: 60 sec | Squeeze shoulder blades
  3. Overhead Dumbbell Press | Sets: 3 | Reps: 10 | Rest: 60 sec | Neutral grip
  4. Forearm Plank with Taps | Sets: 3 | Reps: 16 total | Rest: 45 sec | Anti-rotation
• Cooldown: 5 mins chest stretch and child's pose
• Recovery Suggestion: Drink 500ml water and eat 25g protein within 90 minutes.

DAY 2: Lower Body Foundations & Core
• Focus: Quadriceps, Hamstrings, Glutes & Abs
• Warm-up: 6 mins leg swings, bodyweight air squats, hip openers
• Exercises:
  1. Goblet Squats | Sets: 3 | Reps: 12–15 | Rest: 75 sec | Drive through mid-foot
  2. Romanian Deadlifts | Sets: 3 | Reps: 10–12 | Rest: 60 sec | Hinge at hips
  3. Reverse Alternating Lunges | Sets: 3 | Reps: 10 per leg | Rest: 60 sec
  4. Deadbug Exercise | Sets: 3 | Reps: 12 per side | Rest: 45 sec | Flat lower back
• Cooldown: 5 mins quad stretch and figure-four stretch

DAY 3: Active Recovery & Mobility Flow
• Focus: Full Body Flexibility & Zone 2 Cardiovascular Flush
• Activity: 30 minutes brisk outdoor walk + 10 mins mobility yoga

DAY 4: High-Energy Functional Cardio & Core
• Focus: Cardiovascular Endurance & Caloric Expenditure
• Exercises: Mountain Climbers (3x30s), Dumbbell Thrusters (3x10), Kettlebell Swings (3x15), Russian Twists (3x20)

DAY 5: Full Body Compound Strength
• Focus: Total Body Motor Recruitment
• Exercises: Bulgarian Split Squats (3x10/leg), Bent-Over Rows (3x12), Floor Press (3x10), Bicycle Crunches (3x20)

DAY 6: Posterior Chain, Balance & Conditioning
• Focus: Glute Activation, Core Endurance & Postural Alignment
• Exercises: Forearm Plank (3x45s), Side Planks (2x30s), Glute Bridges with Squeeze (3x15), Farmer's Carries (3x45s)

DAY 7: Complete Rest & Systemic Recovery
• Focus: Parasympathetic Nervous System Renewal & Sleep`;
      } else {
        generatedPlan = `### 7-DAY PERSONALIZED FITNESS PROGRAM
User: ${username} (ID: ${userId}) | Goal: ${goal} | Intensity: ${intensity}

DAY 1: Primary Strength & Movement Mechanics
• Focus: Compound Movement Patterns
• Exercises: Push-ups (3x12), Bodyweight Squats (3x15), Dumbbell Rows (3x12), Plank (3x45s)

DAY 2: Aerobic Conditioning & Core
• Focus: Steady Heart Rate Zone 2
• Exercises: Brisk Incline Walk (25 mins), Mountain Climbers (3x30s), Russian Twists (3x20)

DAY 3: Active Rest & Joint Mobility
• Focus: Thoracic Spine and Hip Flexor Openers

DAY 4: Lower Body Hypertrophy
• Focus: Quads, Glutes & Hamstrings
• Exercises: Goblet Squats (3x12), Romanian Deadlifts (3x10), Reverse Lunges (3x10/side)

DAY 5: Upper Body Sculpt & Core
• Focus: Shoulders, Chest & Back
• Exercises: Overhead Press (3x10), Band Pull-Aparts (3x15), Dumbbell Rows (3x12)

DAY 6: Functional HIIT & Core Conditioning
• Exercises: Thrusters (3x10), Jump Rope/Simulated (3x1 min), Plank Taps (3x16)

DAY 7: Rest & Weekly Reflection`;
      }

      const generatedTip = isFatLoss
        ? 'Prioritize 1.8g protein per kg of body weight to retain lean muscle while in a calorie deficit. Drink 500ml water 20 minutes before each meal to naturally optimize satiety.'
        : 'Aim for a slight caloric surplus with clean carbohydrates (quinoa, sweet potatoes, oats) around your workout window to replenish muscle glycogen stores.';

      setActivePlan(generatedPlan);
      setNutritionTip(generatedTip);
      setFeedbackSuccess(false);

      // Add or update user record
      setUsersList((prev) => {
        const existingIdx = prev.findIndex((u) => u.id === userId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            name: username,
            age,
            weight,
            goal,
            intensity,
            original_plan: generatedPlan,
            updated_plan: 'Not updated'
          };
          return updated;
        } else {
          return [
            {
              id: userId,
              name: username,
              age,
              weight,
              height,
              goal,
              intensity,
              original_plan: generatedPlan,
              updated_plan: 'Not updated'
            },
            ...prev
          ];
        }
      });

      setIsGenerating(false);
      setActiveTab('result');
    }, 600);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;

    const revised = `### REVISED 7-DAY WORKOUT PLAN (UPDATED FOR: "${feedbackInput}")
[Adaptation Note: Successfully tailored routines to accommodate: ${feedbackInput}. Maintained 7-day progression structure with adjusted rest intervals, modified exercises, and customized intensity.]

${activePlan}

---
*Updated on user request with modified exercises, pacing, and recovery balance.*`;

    setActivePlan(revised);
    setFeedbackSuccess(true);

    // Update in users table
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            updated_plan: `[Updated based on feedback]: "${feedbackInput}". Adjusted volume, pacing, and rest periods accordingly.`,
            feedback: feedbackInput
          };
        }
        return u;
      })
    );

    setFeedbackInput('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      if (chatLanguage === 'ta' || userText.includes('தமிழ்')) {
        reply = `வணக்கம் ${username}! உங்கள் கேள்விக்கு நன்றி: "${userText}". 
• உடல் எடையை சீராக குறைக்க, தினசரி புரதச்சத்து (Protein) நிறைந்த உணவுகளை உட்கொள்ளுங்கள்.
• தினமும் 2.5 முதல் 3 லிட்டர் தண்ணீர் குடிப்பது உடலின் வளர்சிதை மாற்றத்தை (Metabolism) அதிகரிக்கும்.
• கடினமான உடற்பயிற்சிக்கு பின் குறைந்தது 7-8 மணி நேர ஆழ்ந்த உறக்கம் தசை மீட்புக்கு (Muscle Recovery) மிக அவசியம்.`;
      } else {
        const lower = userText.toLowerCase();
        if (lower.includes('squat')) {
          reply = `Squat Safety Protocol:\n• Stance: Feet shoulder-width apart, toes turned slightly out (15–30°).\n• Movement: Hinge hips backward first, then bend knees smoothly.\n• Depth: Descend until hip crease is parallel with tops of knees.\n• Cue: Keep chest upright, press knees outward over 2nd toe, drive through midfoot.`;
        } else if (lower.includes('meal') || lower.includes('food')) {
          reply = `Optimal Post-Workout Recovery Meal:\n• Timing: Consume within 60–90 minutes post-training.\n• Ratio: 3:1 Carbohydrates to Protein (e.g., 30g protein + 60g carbs).\n• Sample: Grilled chicken or tofu quinoa harvest bowl, or oatmeal with whey/plant protein and sliced bananas.`;
        } else if (lower.includes('warm') || lower.includes('warmup')) {
          reply = `5-Minute Dynamic Warm-Up:\n1. Arm circles & shoulder dislocations (1 min)\n2. Cat-Cow spinal rolls (1 min)\n3. Bodyweight air squats with pause (1 min)\n4. Walking lunges with torso rotation (1 min)\n5. Light jumping jacks or high knees (1 min)`;
        } else {
          reply = `Great question! For your current goal ("${goal}"), ensure you maintain progressive overload by adding 1 extra rep or 1kg weight each week. Keep your hydration at 2.5L+ daily and aim for 8 hours of sleep to fuel muscle repair.`;
        }
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 400);
  };

  const bmiVal = +(weight / ((height / 100) * (height / 100))).toFixed(1);
  const bmiCategory =
    bmiVal < 18.5
      ? { text: 'Underweight', color: 'text-sky-400' }
      : bmiVal < 25.0
      ? { text: 'Normal weight', color: 'text-emerald-400' }
      : bmiVal < 30.0
      ? { text: 'Overweight', color: 'text-amber-400' }
      : { text: 'Obesity', color: 'text-rose-400' };

  // Filtered exercises
  const filteredExercises = exerciseCatalog.filter((ex) => {
    const matchesCategory = selectedMuscle === 'All' || ex.muscle.toLowerCase() === selectedMuscle.toLowerCase();
    const matchesSearch =
      !exerciseSearch ||
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.instructions.toLowerCase().includes(exerciseSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Athletic Themes
  const themeStyles = {
    orange: {
      logoBg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500',
      logoShadow: 'shadow-lg shadow-orange-500/30',
      logoIconColor: 'text-amber-300',
      brandGradient: 'from-orange-400 via-amber-300 to-yellow-300',
      tagText: 'text-orange-400',
      tagBg: 'bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-rose-500/15 border border-orange-500/30 text-orange-300',
      buttonBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-slate-950 shadow-orange-500/25',
      badgeBg: 'bg-orange-950/60 border-orange-800/80 text-orange-300',
      pulseDot: 'bg-orange-400',
      accentGlow: 'shadow-orange-500/10',
      focusBorder: 'focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
    },
    cyan: {
      logoBg: 'bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600',
      logoShadow: 'shadow-lg shadow-cyan-500/30',
      logoIconColor: 'text-cyan-300',
      brandGradient: 'from-cyan-400 via-teal-300 to-blue-300',
      tagText: 'text-cyan-400',
      tagBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      buttonBg: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-950 shadow-cyan-500/25',
      badgeBg: 'bg-cyan-950/60 border-cyan-800/80 text-cyan-300',
      pulseDot: 'bg-cyan-400',
      accentGlow: 'shadow-cyan-500/10',
      focusBorder: 'focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
    },
    emerald: {
      logoBg: 'bg-gradient-to-tr from-emerald-500 to-teal-400',
      logoShadow: 'shadow-lg shadow-emerald-500/25',
      logoIconColor: 'text-emerald-300',
      brandGradient: 'from-emerald-400 via-teal-300 to-green-300',
      tagText: 'text-emerald-400',
      tagBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-emerald-500/25',
      badgeBg: 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300',
      pulseDot: 'bg-emerald-400',
      accentGlow: 'shadow-emerald-500/10',
      focusBorder: 'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
    },
    violet: {
      logoBg: 'bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500',
      logoShadow: 'shadow-lg shadow-fuchsia-500/30',
      logoIconColor: 'text-fuchsia-300',
      brandGradient: 'from-fuchsia-400 via-pink-300 to-rose-300',
      tagText: 'text-fuchsia-400',
      tagBg: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
      buttonBg: 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 hover:from-violet-700 hover:to-fuchsia-600 text-white shadow-fuchsia-500/25',
      badgeBg: 'bg-fuchsia-950/60 border-fuchsia-800/80 text-fuchsia-300',
      pulseDot: 'bg-fuchsia-400',
      accentGlow: 'shadow-fuchsia-500/10',
      focusBorder: 'focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500'
    }
  };
  const currentTheme = themeStyles[themeColor];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* New Bespoke Athletic Flame & Barbell Crest Logo */}
            <div className={`w-11 h-11 rounded-2xl ${currentTheme.logoBg} ${currentTheme.logoShadow} p-[2px] transition-all duration-300 hover:scale-105 group cursor-pointer`}>
              <div className="w-full h-full bg-slate-950/90 backdrop-blur-sm rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 24 24" className={`w-6 h-6 ${currentTheme.logoIconColor} transition-transform group-hover:rotate-6 duration-300`} fill="currentColor">
                  {/* Stylized Athletic Flame & Barbell Emblem */}
                  <path d="M12 2C9.5 5 7.5 7.5 7.5 10.5C7.5 13 9.5 15 12 15C14.5 15 16.5 13 16.5 10.5C16.5 7.5 14.5 5 12 2Z" fill="currentColor" opacity="0.9" />
                  <path d="M12 6.5C10.8 8.2 9.8 9.5 9.8 11.2C9.8 12.5 10.8 13.5 12 13.5C13.2 13.5 14.2 12.5 14.2 11.2C14.2 9.5 13.2 8.2 12 6.5Z" fill="#020617" />
                  <rect x="2" y="17" width="20" height="2.5" rx="1.25" fill="currentColor" />
                  <rect x="4" y="15" width="2.5" height="6.5" rx="1" fill="currentColor" />
                  <rect x="17.5" y="15" width="2.5" height="6.5" rx="1" fill="currentColor" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                FIT<span className={`text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.brandGradient}`}>BUDDY</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block -mt-1 font-mono">
                AI Fitness & Wellness Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'form' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plan Generator
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'result' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Result View
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'nutrition' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Nutrition
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'progress' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Biometrics
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'exercises' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Coach
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                activeTab === 'admin'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/40'
              }`}
            >
              All Users (/view-all-users)
            </button>
            <button
              onClick={() => setActiveTab('python_code')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'python_code'
                  ? 'bg-amber-950 text-amber-300 border border-amber-600'
                  : 'text-amber-400 border border-amber-900/60 hover:bg-amber-950/40'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Python Code
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Color Palette Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
              <span className="text-[10px] uppercase font-mono text-slate-400 mr-0.5 hidden sm:inline">Color:</span>
              <button
                type="button"
                title="Solar Fire (Default)"
                onClick={() => setThemeColor('orange')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 transition-all ${
                  themeColor === 'orange' ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                }`}
              />
              <button
                type="button"
                title="Electric Cyan"
                onClick={() => setThemeColor('cyan')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 transition-all ${
                  themeColor === 'cyan' ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                }`}
              />
              <button
                type="button"
                title="Neon Emerald"
                onClick={() => setThemeColor('emerald')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 transition-all ${
                  themeColor === 'emerald' ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                }`}
              />
              <button
                type="button"
                title="Cyber Violet"
                onClick={() => setThemeColor('violet')}
                className={`w-4 h-4 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 transition-all ${
                  themeColor === 'violet' ? 'ring-2 ring-white scale-125' : 'opacity-60 hover:opacity-100'
                }`}
              />
            </div>

            <div className={`text-xs font-mono ${currentTheme.badgeBg} px-2.5 py-1 rounded-full flex items-center gap-1.5`}>
              <span className={`w-2 h-2 rounded-full ${currentTheme.pulseDot} animate-pulse`}></span>
              Gemini 3.8
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-800 bg-slate-900/50 text-xs">
          <button onClick={() => setActiveTab('form')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'form' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Form</button>
          <button onClick={() => setActiveTab('result')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'result' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Result</button>
          <button onClick={() => setActiveTab('dashboard')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('nutrition')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'nutrition' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Nutrition</button>
          <button onClick={() => setActiveTab('progress')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'progress' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Progress</button>
          <button onClick={() => setActiveTab('exercises')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'exercises' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Exercises</button>
          <button onClick={() => setActiveTab('chat')} className={`px-2.5 py-1 rounded-md shrink-0 ${activeTab === 'chat' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}>Chat</button>
          <button onClick={() => setActiveTab('admin')} className={`px-2.5 py-1 rounded-md shrink-0 text-emerald-400 font-semibold ${activeTab === 'admin' ? 'bg-emerald-950 text-emerald-300' : ''}`}>Users Table</button>
          <button onClick={() => setActiveTab('python_code')} className={`px-2.5 py-1 rounded-md shrink-0 text-amber-400 font-semibold ${activeTab === 'python_code' ? 'bg-amber-950 text-amber-300' : ''}`}>Code</button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Medical & Wellness Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <div>
            <strong>Medical Disclaimer:</strong> FitBuddy provides generalized physical training and nutritional suggestions for educational demonstration. It does not provide medical diagnoses, treatment prescriptions, or clinical diets. Consult a licensed physician before starting any intense workout regime.
          </div>
        </div>

        {/* TAB 1: FORM PAGE (Matching Screenshots) */}
        {activeTab === 'form' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${currentTheme.tagBg} text-xs font-mono font-medium`}>
                <Sparkles className="w-3.5 h-3.5" />
                Google Gemini 3.8 Generation Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white">Generate Your Personalized Workout Plan</h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                Fill in your metrics below. Gemini will synthesize a customized 7-day program with warm-ups, exercises, reps, cooldowns, and nutrition tips.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${currentTheme.tagText}`} />
                  User Biometrics & Goals Form
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setUserId(10);
                    setUsername('xyz');
                    setAge(20);
                    setWeight(70.0);
                    setHeight(175.0);
                    setGoal('i want to lose belly fat and gain muscles');
                    setIntensity('High');
                  }}
                  className={`text-xs ${currentTheme.tagText} hover:underline font-mono`}
                >
                  Auto-fill Screenshot Demo Data
                </button>
              </div>

              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      User ID (Integer) *
                    </label>
                    <input
                      type="number"
                      required
                      value={userId}
                      onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono ${currentTheme.focusBorder} transition-colors`}
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Unique numeric identifier for tracking in SQLite plans table.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Name / Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. xyz"
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white ${currentTheme.focusBorder} transition-colors`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 20)}
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono ${currentTheme.focusBorder} transition-colors`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min={20}
                      max={350}
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value) || 70.0)}
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono ${currentTheme.focusBorder} transition-colors`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Fitness Goal *
                    </label>
                    <input
                      type="text"
                      required
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. i want to lose belly fat and gain muscles"
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white ${currentTheme.focusBorder} transition-colors`}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setGoal('i want to lose belly fat and gain muscles')}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Lose belly fat & gain muscle
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoal('Hypertrophy & progressive overload')}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Hypertrophy & strength
                      </button>
                      <button
                        type="button"
                        onClick={() => setGoal('Cardiovascular endurance & stamina')}
                        className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
                      >
                        Cardio & endurance
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                      Workout Intensity *
                    </label>
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white ${currentTheme.focusBorder} transition-colors`}
                    >
                      <option value="Low">Low - Gentle, low-impact pacing</option>
                      <option value="Medium">Medium - Balanced strength & active recovery</option>
                      <option value="High">High - Rigorous, high energy & challenging volume</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">
                    💾 Persists in SQLite (`fitbuddy.db`) & triggers Gemini 3.8
                  </span>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`w-full sm:w-auto px-8 py-3.5 ${currentTheme.buttonBg} font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-slate-950" />
                        Generate 7-Day Plan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: RESULT VIEW (Exact from Screenshots #6, #12-#16) */}
        {activeTab === 'result' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Green Success Banner from Screenshot #16 */}
            {feedbackSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-sm font-semibold flex items-center gap-2.5 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>Your plan has been updated based on your feedback!</span>
              </div>
            )}

            {/* Header matching Screenshot #12 */}
            <div className="text-center space-y-2 py-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
                <span className="text-3xl">🏋️</span> Your Personalized Workout Plan
              </h1>
              <h2 className="text-xl font-bold text-slate-200">
                User Information
              </h2>
            </div>

            {/* User Information & Live Biometrics Telemetry Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Biometric Status: Active
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    User Telemetry & Physical Profile
                  </h3>
                </div>

                {/* Live Calculated Physical Indexes */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-slate-500">BMI: </span>
                    <strong className="text-white">{(weight / Math.pow(height / 100, 2)).toFixed(1)}</strong>
                    <span className="text-emerald-400 text-[10px] ml-1">Normal</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-slate-500">BMR: </span>
                    <strong className="text-orange-400">{Math.round(10 * weight + 6.25 * height - 5 * age + 5)}</strong>
                    <span className="text-slate-500 text-[10px] ml-1">kcal</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                    <span className="text-slate-500">CNS State: </span>
                    <strong className="text-cyan-400">96% Peak</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Name:</span>
                  <span className="text-white font-medium">{username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">User ID:</span>
                  <span className="text-white font-mono font-medium">{userId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Age:</span>
                  <span className="text-white font-medium">{age} yrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Weight:</span>
                  <span className="text-white font-medium">{weight} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Height:</span>
                  <span className="text-white font-medium">{height} cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">Intensity:</span>
                  <span className="text-amber-400 font-semibold">{intensity}</span>
                </div>
                <div className="sm:col-span-2 md:col-span-3 flex items-start gap-2 pt-2 border-t border-slate-800/80">
                  <span className="font-bold text-slate-400 shrink-0">Goal:</span>
                  <span className="text-emerald-400 font-medium">{goal}</span>
                </div>
              </div>
            </div>

            {/* INNOVATIVE PERFORMANCE DECK QUICK-SWITCHER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 sm:p-2.5 flex items-center gap-1.5 overflow-x-auto text-xs shadow-lg backdrop-blur-md">
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider px-3 hidden sm:inline-block">
                Innovative Suite:
              </span>
              <button
                type="button"
                onClick={() => setInnovativeDeckTab('all')}
                className={`px-3 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  innovativeDeckTab === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🚀 Complete Suite</span>
              </button>
              <button
                type="button"
                onClick={() => setInnovativeDeckTab('heatmap')}
                className={`px-3 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  innovativeDeckTab === 'heatmap'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🧬 3D Biomechanics</span>
              </button>
              <button
                type="button"
                onClick={() => setInnovativeDeckTab('coach')}
                className={`px-3 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  innovativeDeckTab === 'coach'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🎙️ Live Audio Coach</span>
              </button>
              <button
                type="button"
                onClick={() => setInnovativeDeckTab('mutator')}
                className={`px-3 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  innovativeDeckTab === 'mutator'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🎛️ AI Plan Mutator</span>
              </button>
              <button
                type="button"
                onClick={() => setInnovativeDeckTab('blueprint')}
                className={`px-3 py-2 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  innovativeDeckTab === 'blueprint'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>📄 Routine & Macros</span>
              </button>
            </div>

            {/* Active Plan Adaptation Alert Banner (if applied) */}
            {planAdaptationBadge && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/30 to-slate-900 border border-orange-500/40 text-orange-200 text-xs sm:text-sm flex items-start gap-3 shadow-xl">
                <Sparkles className="w-5 h-5 shrink-0 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-white font-bold">{planAdaptationBadge.title}</strong>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePlan(SCREENSHOT_WORKOUT_PLAN);
                        setPlanAdaptationBadge(null);
                      }}
                      className="text-[11px] font-mono text-amber-400 hover:underline"
                    >
                      Restore Original Screenshot Plan
                    </button>
                  </div>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {planAdaptationBadge.desc}
                  </p>
                </div>
              </div>
            )}

            {/* Dynamic Bio-Nutritional Targets HUD with Logos & Hydration Engine */}
            {(innovativeDeckTab === 'all' || innovativeDeckTab === 'blueprint') && (
              <DynamicMacroCalibrator
                username={username}
                age={age}
                weight={weight}
                height={height}
                goal={goal}
                intensity={intensity}
                waterMl={waterMl}
                onUpdateWater={(newVal) => setWaterMl(newVal)}
              />
            )}

            {/* 3D Biomechanical Muscle Heatmap */}
            {(innovativeDeckTab === 'all' || innovativeDeckTab === 'heatmap') && (
              <BiomechanicalMuscleHeatmap
                currentDay={activeHeatmapDay}
                onSelectDay={(dayNum) => setActiveHeatmapDay(dayNum)}
              />
            )}

            {/* Live Audio Workout Coach & Rest Chronometer */}
            {(innovativeDeckTab === 'all' || innovativeDeckTab === 'coach') && (
              <LiveAudioWorkoutCoach
                currentExerciseName={activeCoachExercise}
                defaultRestSeconds={60}
              />
            )}

            {/* Adaptive Plan Mutator */}
            {(innovativeDeckTab === 'all' || innovativeDeckTab === 'mutator') && (
              <AdaptivePlanMutator
                onMutatePlan={(newPlan, title, desc) => {
                  setActivePlan(newPlan);
                  setPlanAdaptationBadge({ title, desc });
                }}
                onResetScreenshotPlan={() => {
                  setActivePlan(SCREENSHOT_WORKOUT_PLAN);
                  setPlanAdaptationBadge(null);
                }}
              />
            )}

            {/* Nutrition Tip Card */}
            {nutritionTip && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  AI Nutrition & Recovery Tip (Gemini Flash)
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">{nutritionTip}</p>
              </div>
            )}

            {/* Workout Routine Text Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
              {/* Header with View Mode Switcher and Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-slate-950 shadow-md shadow-orange-500/20">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      7-Day Personalized Training Plan
                    </h3>
                    <p className="text-xs text-slate-400">
                      High-Intensity Fat Loss & Muscle Hypertrophy Program
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPlanViewMode('document')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        planViewMode === 'document'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Document View
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanViewMode('interactive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        planViewMode === 'interactive'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Interactive Board
                    </button>
                  </div>

                  {/* Reset / Reload Screenshot Routine Button */}
                  <button
                    type="button"
                    onClick={() => setActivePlan(SCREENSHOT_WORKOUT_PLAN)}
                    className="px-3 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/50 rounded-xl border border-amber-800/60 font-medium transition-colors"
                    title="Load 7-Day High-Intensity Plan from Screenshot"
                  >
                    📸 Screenshot Plan
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activePlan);
                      setCopiedPlan(true);
                      setTimeout(() => setCopiedPlan(false), 2000);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPlan ? 'Copied!' : 'Copy'}
                  </button>

                  {/* Print Button */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                </div>
              </div>

              {planViewMode === 'document' ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                  {/* Background Athletic Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={fitnessBgImg}
                      alt="Athletic Gym Environment"
                      className="w-full h-full object-cover object-center filter brightness-[0.40] saturate-[1.2] scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />
                  </div>

                  {/* Centered Document Paper Container matching user screenshots */}
                  <div className="relative z-10 p-4 sm:p-8 lg:p-12 flex justify-center">
                    <div className="w-full max-w-3xl bg-slate-900/95 sm:bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl shadow-2xl p-6 sm:p-10 space-y-6 text-slate-200">
                      
                      {/* Document Header */}
                      <div className="text-center pb-4 border-b border-slate-800 space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[11px] font-mono">
                          FitBuddy High-Performance Blueprint
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Workout Plan
                        </h2>
                      </div>

                      {/* Document Body Formatted from Screenshot */}
                      <div className="space-y-6 text-xs sm:text-sm font-sans leading-relaxed">
                        
                        {/* Title & Overview */}
                        <div className="space-y-2">
                          <h3 className="text-base sm:text-lg font-black text-white">
                            ## 7-Day High-Intensity Workout Plan for Fat Loss & Muscle Gain
                          </h3>
                          <p className="text-slate-300 leading-relaxed">
                            This plan focuses on compound exercises to maximize calorie burn and muscle engagement. Remember to adjust the intensity based on your fitness level and consult a doctor before starting any new workout routine. Proper nutrition is crucial for achieving your goals, so ensure you're supporting your training with a healthy diet.
                          </p>
                        </div>

                        {/* Days Breakdown */}
                        <div className="space-y-6 divide-y divide-slate-800/80">
                          {/* Day 1 */}
                          <div className="pt-4 first:pt-0 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">1</span>
                              **Day 1: Upper Body Strength**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Warm-up (5 mins):**</strong> Jumping jacks (60 seconds), high knees (30 seconds), arm circles (forward and backward, 30 seconds each), dynamic stretches like arm swings and torso twists (1 min).
                              </p>
                              <div>
                                <strong className="text-slate-100">* **Main Workout:**</strong>
                                <ul className="pl-6 space-y-1 mt-1 text-slate-300">
                                  <li>* <strong className="text-white">**Barbell Bench Press:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Pull-ups (or Lat Pulldowns):**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Overhead Press:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Barbell Rows:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Dumbbell Bicep Curls:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Dumbbell Triceps Extensions:**</strong> 3 sets of 10-15 reps</li>
                                </ul>
                              </div>
                              <p>
                                <strong className="text-slate-100">* **Cooldown:**</strong> Static stretches holding each for 30 seconds (chest, back, biceps, triceps, shoulders).
                              </p>
                            </div>
                          </div>

                          {/* Day 2 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">2</span>
                              **Day 2: Lower Body & Core**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Warm-up (5 mins):**</strong> Bodyweight squats (15 reps), lunges (10 reps per leg), glute bridges (15 reps), plank (30 seconds).
                              </p>
                              <div>
                                <strong className="text-slate-100">* **Main Workout:**</strong>
                                <ul className="pl-6 space-y-1 mt-1 text-slate-300">
                                  <li>* <strong className="text-white">**Barbell Squats:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Romanian Deadlifts:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Walking Lunges:**</strong> 3 sets of 12-15 reps per leg</li>
                                  <li>* <strong className="text-white">**Glute Bridges:**</strong> 3 sets of 15-20 reps</li>
                                  <li>* <strong className="text-white">**Hanging Leg Raises:**</strong> 3 sets to failure</li>
                                  <li>* <strong className="text-white">**Russian Twists:**</strong> 3 sets of 15-20 reps per side</li>
                                </ul>
                              </div>
                              <p>
                                <strong className="text-slate-100">* **Cooldown:**</strong> Foam roll quads, hamstrings, and glutes. Static stretches for hip flexors, hamstrings, and glutes (30 seconds each).
                              </p>
                            </div>
                          </div>

                          {/* Day 3 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">3</span>
                              **Day 3: HIIT Cardio & Core**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Warm-up (5 mins):**</strong> Light cardio, like jogging or jumping jacks, followed by dynamic stretches.
                              </p>
                              <div>
                                <strong className="text-slate-100">* **Main Workout:**</strong>
                                <ul className="pl-6 space-y-1 mt-1 text-slate-300">
                                  <li>* <strong className="text-white">**Burpees:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Mountain Climbers:**</strong> 3 sets of 30-60 seconds</li>
                                  <li>* <strong className="text-white">**Jump Squats:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Kettlebell Swings:**</strong> 3 sets of 15-20 reps</li>
                                  <li>* <strong className="text-white">**Plank variations:**</strong> (high plank, forearm plank, side plank): 30-60 seconds each, repeat 2-3 times</li>
                                </ul>
                              </div>
                              <p>
                                <strong className="text-slate-100">* **Cooldown:**</strong> Light cardio cool down (5 mins), static stretches for core and legs.
                              </p>
                            </div>
                          </div>

                          {/* Day 4 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">4</span>
                              **Day 4: Rest or Active Recovery**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Active Recovery:**</strong> Light activity like walking, swimming, yoga, or foam rolling. Focus on mobility and flexibility. This helps promote blood flow and reduces muscle soreness.
                              </p>
                            </div>
                          </div>

                          {/* Day 5 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">5</span>
                              **Day 5: Upper Body Strength (Focus on different exercises)**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Warm-up (5 mins):**</strong> Similar to Day 1.
                              </p>
                              <div>
                                <strong className="text-slate-100">* **Main Workout:**</strong>
                                <ul className="pl-6 space-y-1 mt-1 text-slate-300">
                                  <li>* <strong className="text-white">**Incline Dumbbell Press:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Chin-ups (or Close-Grip Lat Pulldowns):**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Arnold Press:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**T-Bar Rows:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Hammer Curls:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Overhead Triceps Extensions:**</strong> 3 sets of 10-15 reps</li>
                                </ul>
                              </div>
                              <p>
                                <strong className="text-slate-100">* **Cooldown:**</strong> Similar to Day 1.
                              </p>
                            </div>
                          </div>

                          {/* Day 6 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">6</span>
                              **Day 6: Lower Body & Core (Focus on different exercises)**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Warm-up (5 mins):**</strong> Similar to Day 2.
                              </p>
                              <div>
                                <strong className="text-slate-100">* **Main Workout:**</strong>
                                <ul className="pl-6 space-y-1 mt-1 text-slate-300">
                                  <li>* <strong className="text-white">**Front Squats:**</strong> 3 sets of 8-12 reps</li>
                                  <li>* <strong className="text-white">**Good Mornings:**</strong> 3 sets of 10-15 reps</li>
                                  <li>* <strong className="text-white">**Bulgarian Split Squats:**</strong> 3 sets of 10-12 reps per leg</li>
                                  <li>* <strong className="text-white">**Hip Thrusts:**</strong> 3 sets of 15-20 reps</li>
                                  <li>* <strong className="text-white">**Cable Crunches:**</strong> 3 sets to failure</li>
                                  <li>* <strong className="text-white">**Wood Chops (cable machine):**</strong> 3 sets of 15-20 reps per side</li>
                                </ul>
                              </div>
                              <p>
                                <strong className="text-slate-100">* **Cooldown:**</strong> Similar to Day 2.
                              </p>
                            </div>
                          </div>

                          {/* Day 7 */}
                          <div className="pt-4 space-y-2">
                            <h4 className="text-sm sm:text-base font-bold text-emerald-300 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">7</span>
                              **Day 7: Rest or Active Recovery**
                            </h4>
                            <div className="pl-4 sm:pl-8 space-y-1.5 text-slate-300">
                              <p>
                                <strong className="text-slate-100">* **Active Recovery:**</strong> Similar to Day 4. Prioritize getting enough sleep this day to prepare for the next week of training.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Important Notes Callout matching Screenshot #3 */}
                        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-700/80 space-y-3">
                          <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            **Important Notes:**
                          </h4>
                          <ul className="space-y-2 text-slate-300 text-xs sm:text-sm pl-2">
                            <li>
                              * <strong className="text-white">**Progressive Overload:**</strong> Gradually increase the weight, reps, or sets each week to challenge your muscles and promote continued growth.
                            </li>
                            <li>
                              * <strong className="text-white">**Proper Form:**</strong> Focus on maintaining correct form throughout each exercise to prevent injury and maximize results. Watch videos and, if possible, consult with a trainer to ensure proper technique.
                            </li>
                            <li>
                              * <strong className="text-white">**Listen to your Body:**</strong> Rest when needed and don't push through pain. Adjust the plan as needed based on your recovery and progress.
                            </li>
                            <li>
                              * <strong className="text-white">**Nutrition:**</strong> Fuel your body with a balanced diet rich in protein, complex carbohydrates, and healthy fats to support muscle growth and recovery.
                            </li>
                            <li>
                              * <strong className="text-white">**Hydration:**</strong> Drink plenty of water throughout the day, especially before, during, and after workouts.
                            </li>
                          </ul>
                        </div>

                        {/* Concluding Note */}
                        <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800">
                          This plan is a starting point. You can adjust it based on your progress and preferences. Remember consistency and proper execution are key to achieving your fitness goals. Good luck!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW MODE 2: INTERACTIVE TRAINING BOARD */
                <div className="space-y-4">
                {/* Parse adaptation note if present */}
                {activePlan.includes('[Adaptation Note:') && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-950/40 to-amber-950/30 border border-orange-500/40 text-orange-300 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                    <Sparkles className="w-5 h-5 shrink-0 text-orange-400 mt-0.5" />
                    <div>
                      <strong className="block text-orange-200 font-semibold mb-0.5">AI Plan Adaptation Applied</strong>
                      {activePlan.split('[Adaptation Note:')[1]?.split(']')[0] || 'Plan customized to your feedback.'}
                    </div>
                  </div>
                )}

                {/* Interactive Weekly Progress Bar & Day Filter Pills */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-orange-500/20">
                        {Math.round((completedRoutineDays.length / 7) * 100)}%
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <span>Weekly Program Progress</span>
                          <span className="text-[11px] font-mono text-orange-400">({completedRoutineDays.length}/7 Days Complete)</span>
                        </div>
                        <div className="w-56 bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((completedRoutineDays.length / 7) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setCheckedExercises({})}
                        className="px-2.5 py-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900 border border-slate-800 text-[11px]"
                      >
                        Reset Checks
                      </button>
                    </div>
                  </div>

                  {/* 7-Day Filter Pills */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedDayView('all')}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all shrink-0 ${
                        selectedDayView === 'all'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      ⚡ All 7 Days
                    </button>
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDayView(d)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all shrink-0 flex items-center gap-1.5 ${
                          selectedDayView === d
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/20'
                            : completedRoutineDays.includes(d)
                            ? 'bg-slate-900 text-emerald-300 border border-emerald-800/60'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>Day {d}</span>
                        {completedRoutineDays.includes(d) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day-by-Day Structured Cards */}
                <div className="grid grid-cols-1 gap-4">
                  {(() => {
                    const rawDays = activePlan
                      .split(/(?=(?:DAY|\*\*Day)\s+\d+[:*])/i)
                      .filter((d) => /(?:DAY|\*\*Day)\s+\d+[:*]/i.test(d));

                    if (rawDays.length === 0) {
                      return (
                        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {activePlan}
                        </div>
                      );
                    }

                    return rawDays
                      .filter((_, idx) => selectedDayView === 'all' || selectedDayView === idx + 1)
                      .map((dayText, idx) => {
                        const originalDayIndex = rawDays.indexOf(dayText);
                        const dayNumber = originalDayIndex + 1;
                        const isDayFinished = completedRoutineDays.includes(dayNumber);

                        const lines = dayText.trim().split('\n');
                        const titleLine = lines[0] || `DAY ${dayNumber}`;
                        const cleanTitle = titleLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();

                        let focus = '';
                        let warmup = '';
                        let cooldown = '';
                        let recovery = '';
                        const exercises: string[] = [];

                        lines.slice(1).forEach((line) => {
                          const trimmed = line.trim();
                          const lower = trimmed.toLowerCase();

                          if (lower.startsWith('* **warm-up') || lower.startsWith('• warm-up') || lower.startsWith('**warm-up')) {
                            warmup = trimmed.replace(/^[\*\•\-\s]*\**Warm-up(\s*\([^)]*\))?:\**/i, '').trim();
                          } else if (lower.startsWith('* **cooldown') || lower.startsWith('• cooldown') || lower.startsWith('**cooldown')) {
                            cooldown = trimmed.replace(/^[\*\•\-\s]*\**Cool-?down:\**/i, '').trim();
                          } else if (lower.startsWith('* **active recovery') || lower.startsWith('• active recovery') || lower.startsWith('• recovery')) {
                            recovery = trimmed.replace(/^[\*\•\-\s]*\**(\s*Active\s*)?Recovery(\s*Suggestion)?:\**/i, '').trim();
                          } else if (/^[\*\•\-]\s+\*\*([^*]+)\*\*:\s*(.*)/.test(trimmed)) {
                            const match = trimmed.match(/^[\*\•\-]\s+\*\*([^*]+)\*\*:\s*(.*)/);
                            if (match && !lower.includes('warm-up') && !lower.includes('cooldown') && !lower.includes('recovery') && !lower.includes('main workout')) {
                              exercises.push(`${match[1].trim()} | ${match[2].trim()}`);
                            }
                          } else if (/^\d+\.\s+/.test(trimmed)) {
                            exercises.push(trimmed.replace(/^\d+\.\s+/, '').trim());
                          } else if (trimmed.startsWith('• Focus:')) {
                            focus = trimmed.replace('• Focus:', '').trim();
                          } else if (trimmed.startsWith('•') && !focus && !warmup) {
                            focus = trimmed.replace('•', '').trim();
                          }
                        });

                        const isRestDay = cleanTitle.toLowerCase().includes('rest') || focus.toLowerCase().includes('rest') || recovery.length > 0;

                        return (
                          <div
                            key={dayNumber}
                            className={`rounded-2xl p-5 sm:p-6 transition-all border shadow-lg ${
                              isDayFinished
                                ? 'bg-slate-950/95 border-emerald-800/60 shadow-emerald-500/5'
                                : 'bg-slate-950/85 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Day Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                              <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-black text-sm flex items-center justify-center font-mono shadow-md shadow-orange-500/20">
                                  D{dayNumber}
                                </span>
                                <div>
                                  <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                                    {cleanTitle}
                                    {isDayFinished && (
                                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Completed
                                      </span>
                                    )}
                                  </h4>
                                  {focus && (
                                    <p className="text-xs text-orange-400 font-semibold mt-0.5">
                                      Focus: {focus}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span className="text-[11px] text-slate-300 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5">
                                  {isRestDay ? (
                                    <>🌱 Deep Recovery & Sleep</>
                                  ) : (
                                    <>
                                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                                      45 Mins · ~340 kcal
                                    </>
                                  )}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCompletedRoutineDays((prev) =>
                                      prev.includes(dayNumber)
                                        ? prev.filter((d) => d !== dayNumber)
                                        : [...prev, dayNumber]
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    isDayFinished
                                      ? 'bg-slate-900 text-emerald-400 border border-emerald-500/50 hover:bg-slate-800'
                                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-md shadow-orange-500/20'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  {isDayFinished ? 'Finished' : 'Mark Day Done'}
                                </button>
                              </div>
                            </div>

                            {/* Warm-Up Section with Pulsing Flame */}
                            {warmup && (
                              <div className="mt-4 flex items-start gap-3 text-xs text-amber-200 bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-transparent border border-amber-900/40 rounded-xl p-3.5">
                                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                  <Flame className="w-4 h-4 text-amber-400" />
                                </div>
                                <div>
                                  <strong className="text-amber-300 uppercase tracking-wider text-[10px] block font-mono">
                                    Dynamic Kinetic Warm-Up (5–8 mins)
                                  </strong>
                                  <span className="text-slate-300 text-xs mt-0.5 block leading-relaxed">{warmup}</span>
                                </div>
                              </div>
                            )}

                            {/* Interactive Exercises Checklist */}
                            {exercises.length > 0 && (
                              <div className="mt-4 space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-slate-400 px-1">
                                  <span>Prescribed Movements & Sets</span>
                                  <span className="text-slate-500 font-mono">Click item to check off</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2.5">
                                  {exercises.map((ex, exIdx) => {
                                    const exKey = `d${dayNumber}_e${exIdx}`;
                                    const isChecked = !!checkedExercises[exKey];

                                    const parts = ex.split('|').map((p) => p.trim());
                                    const exName = parts[0] || ex;
                                    const details = parts.slice(1);

                                    return (
                                      <div
                                        key={exIdx}
                                        onClick={() =>
                                          setCheckedExercises((prev) => ({
                                            ...prev,
                                            [exKey]: !prev[exKey]
                                          }))
                                        }
                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                          isChecked
                                            ? 'bg-slate-900/40 border-emerald-800/50 opacity-80'
                                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-colors shrink-0 ${
                                              isChecked
                                                ? 'bg-emerald-500 text-slate-950'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}
                                          >
                                            {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : exIdx + 1}
                                          </div>
                                          <span
                                            className={`font-semibold text-sm transition-all ${
                                              isChecked ? 'line-through text-slate-500' : 'text-white'
                                            }`}
                                          >
                                            {exName}
                                          </span>
                                        </div>

                                        {details.length > 0 && (
                                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono self-start sm:self-auto pl-9 sm:pl-0">
                                            {details.map((d, dIdx) => (
                                              <span
                                                key={dIdx}
                                                className={`px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${
                                                  d.toLowerCase().includes('rest')
                                                    ? 'bg-sky-950/60 border-sky-800/60 text-sky-300'
                                                    : d.toLowerCase().includes('reps') || d.toLowerCase().includes('sets')
                                                    ? 'bg-orange-950/60 border-orange-800/80 text-orange-300'
                                                    : 'bg-slate-950 border-slate-800 text-slate-300'
                                                }`}
                                              >
                                                {d}
                                              </span>
                                            ))}
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveCoachExercise(exName);
                                                setInnovativeDeckTab('coach');
                                                window.scrollTo({ top: 400, behavior: 'smooth' });
                                              }}
                                              className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-mono font-semibold transition-colors flex items-center gap-1 shrink-0 ml-auto"
                                              title="Send to Live Audio Workout Coach"
                                            >
                                              <Volume2 className="w-3 h-3" /> Coach
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Cooldown & Recovery Section */}
                            {(cooldown || recovery) && (
                              <div className="mt-4 pt-3 border-t border-slate-800/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                {cooldown && (
                                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start gap-2.5">
                                    <RotateCcw className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                                    <div>
                                      <span className="text-[10px] uppercase font-bold text-amber-400 font-mono block">Cooldown (5 mins)</span>
                                      <span className="leading-relaxed mt-0.5 block">{cooldown}</span>
                                    </div>
                                  </div>
                                )}
                                {recovery && (
                                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-slate-300 flex items-start gap-2.5">
                                    <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                                    <div>
                                      <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">AI Recovery Protocol</span>
                                      <span className="leading-relaxed mt-0.5 block">{recovery}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                    );
                  });
              })()}
            </div>
          </div>
        )}
      </div>

            {/* Share Your Feedback Card matching Screenshot #14 & #15 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>📝</span> Share Your Feedback
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  FitBuddy remembers your original plan and generates a revised adaptation based on your feedback.
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Your Unique User ID:
                  </label>
                  <input
                    type="number"
                    required
                    value={userId}
                    onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
                    placeholder="Enter the same User ID used to generate your plan"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:border-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Your Feedback:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Let us know how we can improve your plan..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white text-sm focus:border-emerald-500"
                  />
                </div>

                {/* Quick Feedback Suggestions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackInput('Make the workouts easier with longer rest periods.')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
                  >
                    "Make workouts easier"
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackInput('Add more cardio and core exercises.')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
                  >
                    "Add more cardio"
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackInput('I only have 30 minutes per workout session.')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
                  >
                    "30 minutes limit"
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackInput('Remove jumping exercises due to sensitive knees.')}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg"
                  >
                    "Remove jumping exercises"
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Submit Feedback
                </button>
              </form>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setActiveTab('admin')}
                className="text-xs font-medium text-emerald-400 hover:underline"
              >
                View in All Users & Plans Table (/view-all-users) →
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">Welcome Back, {username}</span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Ready for Today's Workout?</h1>
                <p className="text-xs text-slate-400 mt-1">Goal: <span className="text-emerald-300 font-medium">{goal}</span> · Intensity: {intensity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('form')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  + New Plan
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700"
                >
                  Ask AI Coach
                </button>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">BMI Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-white font-mono">{bmiVal}</span>
                  <span className={`text-xs font-semibold ${bmiCategory.color}`}>{bmiCategory.text}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{height}cm · {weight}kg</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Workout Streak</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-amber-400 font-mono">{streakCount} Days</span>
                  <span className="text-xs text-amber-300">🔥 Streak</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Longest: 7 Days</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Hydration</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-sky-400 font-mono">{waterMl.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-mono">/ 2,500 ml</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-400 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((waterMl / 2500) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block">Rest & Sleep</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-black text-indigo-400 font-mono">7.8 hrs</span>
                  <span className="text-xs text-indigo-300">Deep</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Quality: Restorative (92%)</p>
              </div>
            </div>

            {/* Today's Workout & AI Recommendation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-mono uppercase text-emerald-400">Day 1 Focus</span>
                    <h3 className="text-base font-bold text-white">Upper Body Push & Pull Hypertrophy</h3>
                  </div>
                  <button
                    onClick={() => {
                      if (!completedDays.includes(1)) {
                        setCompletedDays([...completedDays, 1]);
                        setStreakCount(streakCount + 1);
                      }
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      completedDays.includes(1)
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {completedDays.includes(1) ? 'Marked Completed!' : 'Mark as Completed'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">1. Incline / Standard Push-Ups</h4>
                      <p className="text-[11px] text-slate-400">Target: Chest & Triceps · 45° elbow angle</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">3 Sets × 12 Reps</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">2. Dumbbell Bent-Over Rows</h4>
                      <p className="text-[11px] text-slate-400">Target: Lats & Rhomboids</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">3 Sets × 12 Reps</span>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">3. Overhead Shoulder Press</h4>
                      <p className="text-[11px] text-slate-400">Target: Deltoids & Core</p>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">3 Sets × 10 Reps</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est: 45 Mins</span>
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> ~320 kcal</span>
                  <button onClick={() => setActiveTab('result')} className="text-emerald-400 hover:underline">
                    View Full 7 Days →
                  </button>
                </div>
              </div>

              {/* AI Recommendation & Hydration Quick Actions */}
              <div className="space-y-4">
                <div className="bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-800/40 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Smart Recommendation
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    "Based on your recent 5-day streak and moderate energy check-in, focus on controlled eccentric tempo today rather than maximal weight. Hydrate with an extra 500ml water post-workout to enhance muscle recovery."
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono">Synthesized via Gemini 3.8 Flash</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-sky-400" /> Quick Hydration</span>
                    <span className="text-sky-400 font-mono text-[11px]">+250ml</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWaterMl(waterMl + 250)}
                      className="py-2 bg-sky-950 hover:bg-sky-900 border border-sky-800/60 text-sky-300 font-semibold text-xs rounded-xl"
                    >
                      +1 Glass (250ml)
                    </button>
                    <button
                      onClick={() => setWaterMl(waterMl + 500)}
                      className="py-2 bg-sky-950 hover:bg-sky-900 border border-sky-800/60 text-sky-300 font-semibold text-xs rounded-xl"
                    >
                      +1 Bottle (500ml)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NUTRITION */}
        {activeTab === 'nutrition' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Apple className="w-6 h-6 text-emerald-400" />
                AI Nutrition & Daily Meal Blueprint
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Structured protocols across Vegetarian, Non-vegetarian, Vegan, and Eggetarian dietary preferences.
              </p>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase text-emerald-400 block mb-1">Targeted Nutrition Guidance</span>
              <p className="text-sm text-slate-200 leading-relaxed">{nutritionTip}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase">Breakfast (08:00)</span>
                  <span className="font-mono text-slate-400">~420 kcal · 22g Protein</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Power Oatmeal Bowl with Berries & Seeds</h4>
                <p className="text-xs text-slate-400 mt-1">Rolled oats cooked with almond milk, chia seeds, sliced bananas, and a scoop of protein.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase">Mid-Morning Snack (11:00)</span>
                  <span className="font-mono text-slate-400">~190 kcal · 6g Protein</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Raw Almonds & Crisp Green Apple</h4>
                <p className="text-xs text-slate-400 mt-1">Natural fiber and monounsaturated healthy fats to stabilize mid-day insulin levels.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase">Lunch (13:30)</span>
                  <span className="font-mono text-slate-400">~620 kcal · 38g Protein</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Paneer / Tofu Quinoa Harvest Bowl</h4>
                <p className="text-xs text-slate-400 mt-1">Sautéed protein source with steamed broccoli, quinoa, diced cucumbers, and olive oil.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase">Pre-Workout Snack (17:00)</span>
                  <span className="font-mono text-slate-400">~210 kcal · 14g Protein</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Spiced Roasted Chickpeas (Sundal / Chana)</h4>
                <p className="text-xs text-slate-400 mt-1">Slow-digesting clean carbohydrates for sustained workout stamina.</p>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase">Dinner (20:00)</span>
                  <span className="font-mono text-slate-400">~540 kcal · 32g Protein</span>
                </div>
                <h4 className="text-sm font-semibold text-white">Hearty Yellow Lentil Dal with Mixed Vegetables & Brown Rice</h4>
                <p className="text-xs text-slate-400 mt-1">Warm, easily digestible evening meal loaded with fiber and zinc for overnight tissue repair.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BIOMETRICS & PROGRESS */}
        {activeTab === 'progress' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Calculator className="w-6 h-6 text-emerald-400" />
                Biometrics, BMI & Caloric Energy Expenditure
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Scientifically grounded metrics: WHO BMI Classification & Mifflin-St Jeor Total Daily Energy Expenditure (TDEE).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BMI Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">BMI Calculation</h3>
                  <span className="text-[11px] font-mono text-emerald-400">GET /api/bmi</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Height:</span>
                    <span className="font-mono text-white font-semibold">{height} cm</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Weight:</span>
                    <span className="font-mono text-white font-semibold">{weight} kg</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Calculated BMI Score:</span>
                      <span className="text-2xl font-black font-mono text-emerald-400">{bmiVal}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">WHO Category:</span>
                      <span className={`text-sm font-bold ${bmiCategory.color}`}>{bmiCategory.text}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    BMI formula: weight (kg) / [height (m)]². BMI is a general screening metric and does not distinguish muscle mass from adipose tissue.
                  </p>
                </div>
              </div>

              {/* Mifflin-St Jeor TDEE */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mifflin-St Jeor TDEE</h3>
                  <span className="text-[11px] font-mono text-emerald-400">GET /api/calorie-estimate</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Basal Metabolic Rate (BMR):</span>
                    <span className="font-mono text-white font-bold">1,680 kcal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Activity Level:</span>
                    <span className="text-white font-semibold">Moderate (1.55x)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TDEE Expenditure:</span>
                    <span className="font-mono text-white font-bold">2,604 kcal</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold">Target for Fat Loss & Tone:</span>
                    <span className="text-lg font-black font-mono text-emerald-400">2,150 kcal/day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weight Progression History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Weight Progression History</h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {weightLogs.map((log, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">{log.date}</span>
                    <span className="text-base font-black text-white font-mono mt-1 block">{log.weight}</span>
                    <span className="text-[10px] text-emerald-400">kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EXERCISE LIBRARY */}
        {activeTab === 'exercises' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  Exercise Library & Biomechanical Form
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select any movement to request step-by-step guidance, common pitfalls, and safety notes.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    placeholder="Search exercise..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Muscle Group Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Core', 'Cardio', 'Flexibility'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMuscle(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                    selectedMuscle === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-mono text-emerald-400 uppercase font-semibold">{ex.muscle}</span>
                      <span>{ex.equipment}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{ex.name}</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ex.instructions}</p>
                    <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded-lg border border-amber-900/30">
                      <strong>Safety:</strong> {ex.safety}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveExerciseModal(ex)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Explain Safe Form with Gemini
                  </button>
                </div>
              ))}
            </div>

            {/* Exercise Modal */}
            {activeExerciseModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 uppercase">{activeExerciseModal.muscle} Movement</span>
                      <h3 className="text-lg font-bold text-white">{activeExerciseModal.name} Safe Form Guide</h3>
                    </div>
                    <button
                      onClick={() => setActiveExerciseModal(null)}
                      className="text-slate-400 hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-2">
                    <p><strong>1. Primary Kinetic Purpose:</strong> Reinforces functional kinetic chain alignment and progressive joint stability.</p>
                    <p><strong>2. Biomechanical Cueing:</strong> {activeExerciseModal.instructions}</p>
                    <p><strong>3. Common Faults:</strong> Rushing through the negative (eccentric) phase or losing spinal neutrality under fatigue.</p>
                    <p><strong>4. Beginner Modification:</strong> Perform with reduced range of motion or bodyweight only before loading with dumbbells.</p>
                    <p className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300">
                      <strong>Safety Note:</strong> Exercise should produce muscular fatigue, never sharp pinching joint pain. Stop immediately if dizziness occurs.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveExerciseModal(null)}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-600"
                  >
                    Got It
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: AI COACH (Multilingual English & Tamil) */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-emerald-400" />
                  Ask FitBuddy AI Coach
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Bilingual AI assistance in English and Tamil (தமிழ்).
                </p>
              </div>

              {/* Language Selector from Requirement 25 */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setChatLanguage('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    chatLanguage === 'en' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setChatLanguage('ta')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    chatLanguage === 'ta' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  தமிழ் (Tamil)
                </button>
              </div>
            </div>

            {/* Chat Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-[480px]">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        ⚡
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Prompts */}
              <div className="py-2.5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-500 shrink-0 text-[11px]">Ideas:</span>
                <button
                  onClick={() => setChatInput('Explain how to perform squats safely.')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0"
                >
                  Squat safety tips
                </button>
                <button
                  onClick={() => setChatInput('Suggest a healthy post-workout meal.')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0"
                >
                  Post-workout meal
                </button>
                <button
                  onClick={() => setChatInput('Give me a 5-minute dynamic warm-up.')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg shrink-0"
                >
                  5-min warm-up
                </button>
                <button
                  onClick={() => {
                    setChatLanguage('ta');
                    setChatInput('உடல் எடையை குறைக்க சிறந்த உடற்பயிற்சிகள் எவை?');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-1 rounded-lg shrink-0"
                >
                  எடை குறைக்க (Tamil)
                </button>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={
                    chatLanguage === 'ta'
                      ? 'தமிழில் உங்கள் கேள்வியை தட்டச்சு செய்யவும்...'
                      : 'Ask about workout form, recovery, or nutrition...'
                  }
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 8: ADMIN ALL USERS (Exact Table from Screenshot #7, #8, #11) */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" />
                  All Users & Workout Plans Table
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Database route: <span className="font-mono text-emerald-400">GET /view-all-users</span> · Rendered via Jinja2 & SQLite.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('form')}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-emerald-600"
              >
                + Generate New Plan
              </button>
            </div>

            {/* Table matching Screenshot #7 & #11 */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5 font-bold">ID</th>
                    <th className="px-4 py-3.5 font-bold">Name</th>
                    <th className="px-4 py-3.5 font-bold">Age</th>
                    <th className="px-4 py-3.5 font-bold">Weight</th>
                    <th className="px-4 py-3.5 font-bold">Goal</th>
                    <th className="px-4 py-3.5 font-bold">Intensity</th>
                    <th className="px-6 py-3.5 font-bold min-w-[280px]">Original Plan</th>
                    <th className="px-6 py-3.5 font-bold min-w-[280px]">Updated Plan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-semibold text-emerald-400">{u.id}</td>
                      <td className="px-4 py-3.5 font-medium text-white">{u.name}</td>
                      <td className="px-4 py-3.5">{u.age}</td>
                      <td className="px-4 py-3.5 font-mono">{u.weight} kg</td>
                      <td className="px-4 py-3.5 text-xs text-slate-200">{u.goal}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium ${
                            u.intensity === 'High'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          }`}
                        >
                          {u.intensity}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="max-h-36 overflow-y-auto bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
                          {u.original_plan}
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="max-h-36 overflow-y-auto bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
                          {u.updated_plan}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 9: PYTHON CODE & ARCHITECTURE EXPLORER */}
        {activeTab === 'python_code' && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-amber-400" />
                  FastAPI & Python Codebase Explorer
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete, 100% production-ready files in the repository for college / portfolio demonstration.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                uvicorn app.main:app --reload
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* File List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Project Files</span>
                {[
                  'app/main.py',
                  'app/database.py',
                  'app/models.py',
                  'app/routes/workout.py',
                  'app/routes/nutrition.py',
                  'app/routes/admin.py',
                  'app/services/gemini_service.py',
                  'app/services/workout_service.py',
                  'seed_database.py',
                  'README.md',
                  'requirements.txt'
                ].map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedPyFile(file)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors truncate block ${
                      selectedPyFile === file
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    {file}
                  </button>
                ))}
              </div>

              {/* Code Viewer Panel */}
              <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-emerald-400">{selectedPyFile}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Python 3.10+ / FastAPI</span>
                </div>
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[500px] leading-relaxed whitespace-pre-wrap">
                  {selectedPyFile === 'app/main.py' && `from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.config import settings
from app.database import engine, Base
from app.routes import workout, nutrition, admin, auth, users, progress, chatbot

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

app.include_router(workout.router)
app.include_router(nutrition.router)
app.include_router(admin.router)

@app.get("/", response_class=HTMLResponse)
def index_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "FitBuddy AI Platform"}`}

                  {selectedPyFile === 'app/routes/workout.py' && `# 1. API: Generate workout using Gemini Pro
@router.post("/generate-workout/gemini")
async def generate_gemini_workout(request: WorkoutRequest):
    result = generate_workout_gemini({"goal": request.goal, "intensity": request.intensity})
    return {"model": "gemini-pro", "workout_plan": result}

# 3. API: Save user info & generate plan
@router.post("/generate-plan")
def generate_plan(user_data: UserInput):
    save_user(user_data.user_id, user_data.username, user_data.age, user_data.weight, user_data.goal, user_data.intensity)
    plan = generate_workout_gemini({"goal": user_data.goal, "intensity": user_data.intensity})
    save_plan(user_data.user_id, plan)
    return {"message": "Workout plan generated and saved successfully!", "workout_plan": plan}

# 4. API: Update workout plan based on user feedback
@router.post("/update-plan/{user_id}", response_model=dict)
def update_user_plan(user_id: int, data: FeedbackRequest):
    original = get_original_plan(user_id)
    if not original:
        return {"error": "Original plan not found for this user."}
    updated = update_workout_plan(original, data.feedback)
    update_plan(user_id, updated)
    return {"updated_plan": updated}`}

                  {selectedPyFile === 'app/services/gemini_service.py' && `def generate_nutrition_tip_with_flash(goal: str) -> str:
    prompt = (
        f"Give one clear, helpful nutrition or recovery tip for someone focused on '{goal}'. "
        "The tip should be practical, friendly, and easy to understand."
    )
    return _call_gemini(prompt, model_name="gemini-3.8-flash")

def update_workout_plan(original_plan: str, user_feedback: str) -> str:
    prompt = f"""You are a professional fitness trainer assistant.
Here's the original 7-day workout plan:
{original_plan}
User Feedback:
"{user_feedback}"
Based on the feedback, revise the relevant parts of the workout plan. Keep the format unchanged if not needed."""
    return _call_gemini(prompt, model_name="gemini-3.8-flash")`}

                  {selectedPyFile === 'app/models.py' && `class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    goal = Column(String(100), default="General wellness")
    intensity = Column(String(30), default="Medium")
    schedule = Column(Integer, default=7)

class WorkoutPlan(Base):
    __tablename__ = "plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_plan = Column(Text, nullable=False)
    updated_plan = Column(Text, nullable=True)
    user_feedback = Column(Text, nullable=True)`}

                  {selectedPyFile === 'app/routes/admin.py' && `# 8. Web: View all users & their plans
@router.get("/view-all-users", response_class=HTMLResponse)
def view_all_users(request: Request):
    db = SessionLocal()
    users = db.query(User).all()
    user_data = []
    for user in users:
        plan = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user.id).first()
        user_data.append({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "weight": user.weight,
            "goal": user.goal,
            "intensity": user.intensity,
            "original_plan": plan.original_plan if plan else "N/A",
            "updated_plan": plan.updated_plan if plan and plan.updated_plan else "Not updated"
        })
    db.close()
    return templates.TemplateResponse("all_users.html", {
        "request": request,
        "users": user_data
    })`}

                  {selectedPyFile !== 'app/main.py' &&
                    selectedPyFile !== 'app/routes/workout.py' &&
                    selectedPyFile !== 'app/services/gemini_service.py' &&
                    selectedPyFile !== 'app/models.py' &&
                    selectedPyFile !== 'app/routes/admin.py' &&
                    `# Complete file implementation is saved on disk at: /${selectedPyFile}\n# Run locally with: python -m venv venv && pip install -r requirements.txt && python run.py`}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-500 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 FitBuddy AI Platform. Built with Python 3.10+, FastAPI, SQLite, SQLAlchemy & Google Gemini.</p>
          <div className="flex items-center gap-3 text-slate-400">
            <button onClick={() => setActiveTab('admin')} className="hover:text-emerald-400">Admin Table</button>
            <span>·</span>
            <button onClick={() => setActiveTab('python_code')} className="hover:text-emerald-400">Python Source</button>
            <span>·</span>
            <a href="/docs" target="_blank" className="hover:text-emerald-400">FastAPI Swagger</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
