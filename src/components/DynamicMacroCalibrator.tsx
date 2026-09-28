import React, { useState } from 'react';
import { Flame, Droplet, Sparkles, Plus, Minus, Check, Activity, ShieldCheck, Heart, Apple } from 'lucide-react';

interface Props {
  username: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  intensity: string;
  waterMl: number;
  onUpdateWater: (newAmount: number) => void;
}

export const DynamicMacroCalibrator: React.FC<Props> = ({
  username,
  age,
  weight,
  height,
  goal,
  intensity,
  waterMl,
  onUpdateWater
}) => {
  // Preset adjustment: -500 (cut), -250 (recomp), 0 (maint), +300 (bulk)
  const [calorieAdjustment, setCalorieAdjustment] = useState<number>(-250);
  const [activeStrategy, setActiveStrategy] = useState<'cut' | 'recomp' | 'maintenance' | 'bulk'>('recomp');
  const [proteinMultiplier, setProteinMultiplier] = useState<number>(2.2); // 2.2g per kg

  // Mifflin-St Jeor Formula for BMR (Male default approximation)
  // BMR = 10 * weight (kg) + 6.25 * height (cm) - 5 * age + 5
  const baseBmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);

  // Activity Factor based on intensity
  const activityMultiplier = intensity === 'High' ? 1.6 : intensity === 'Medium' ? 1.4 : 1.25;
  const maintenanceTdee = Math.round(baseBmr * activityMultiplier);

  // Dynamic Calorie Target
  const targetCalories = maintenanceTdee + calorieAdjustment;

  // Dynamic Protein Target: 2.2g/kg
  const targetProteinGrams = Math.round(weight * proteinMultiplier);
  const proteinCalories = targetProteinGrams * 4;

  // Dynamic Fat Target: ~25% of calories
  const fatCalories = Math.round(targetCalories * 0.25);
  const targetFatGrams = Math.round(fatCalories / 9);

  // Dynamic Carb Target: Remaining calories
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbGrams = Math.round(remainingCalories / 4);

  const handleStrategyChange = (strategy: 'cut' | 'recomp' | 'maintenance' | 'bulk') => {
    setActiveStrategy(strategy);
    if (strategy === 'cut') {
      setCalorieAdjustment(-500);
      setProteinMultiplier(2.4); // higher protein to preserve muscle in deficit
    } else if (strategy === 'recomp') {
      setCalorieAdjustment(-250);
      setProteinMultiplier(2.2);
    } else if (strategy === 'maintenance') {
      setCalorieAdjustment(0);
      setProteinMultiplier(2.0);
    } else if (strategy === 'bulk') {
      setCalorieAdjustment(300);
      setProteinMultiplier(2.0);
    }
  };

  const handleAddWater = (amount: number) => {
    onUpdateWater(Math.min(5000, waterMl + amount));
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with strategy badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Dynamic Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">BMR {baseBmr} kcal · TDEE {maintenanceTdee} kcal</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            Daily Bio-Nutritional Targets & Macro HUD
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Dynamic fuel saturation calibrated for <strong className="text-white">{username}</strong> ({weight}kg · {height}cm · {goal})
          </p>
        </div>

        {/* Nutritional Strategy Preset Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => handleStrategyChange('cut')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeStrategy === 'cut'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Cut (-500)
          </button>
          <button
            type="button"
            onClick={() => handleStrategyChange('recomp')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeStrategy === 'recomp'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Recomp (-250)
          </button>
          <button
            type="button"
            onClick={() => handleStrategyChange('maintenance')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeStrategy === 'maintenance'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Maint (0)
          </button>
          <button
            type="button"
            onClick={() => handleStrategyChange('bulk')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              activeStrategy === 'bulk'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Bulk (+300)
          </button>
        </div>
      </div>

      {/* 4 MACRO HUD CARDS WITH CUSTOM LOGOS & TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* 1. PROTEIN LEVEL */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 p-4 hover:border-amber-500/60 transition-all group shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl select-none">🥩</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {proteinMultiplier}g / kg
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Protein Level</span>
              <span className="text-[11px] font-mono text-slate-400">Target: {targetProteinGrams}g</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white font-mono">{targetProteinGrams}</span>
              <span className="text-xs font-bold text-amber-400">g / day</span>
              <span className="text-[11px] text-slate-500 font-mono ml-auto">{proteinCalories} kcal</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((targetProteinGrams / (weight * 2.2)) * 100))}%` }}
              />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Muscle Synthesis:</span>
              <span className="font-semibold text-emerald-400">Peak Anabolic</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🍗 Chicken</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🍳 Eggs</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🥛 Whey</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🐟 Salmon</span>
            </div>
          </div>
        </div>

        {/* 2. CALORIES LEVEL */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-orange-500/30 p-4 hover:border-orange-500/60 transition-all group shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-amber-500 p-0.5 shadow-md shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl select-none">🔥</span>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              calorieAdjustment < 0 ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {calorieAdjustment === 0 ? 'Maintenance' : calorieAdjustment < 0 ? `${calorieAdjustment} Deficit` : `+${calorieAdjustment} Surplus`}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Calories Level</span>
              <span className="text-[11px] font-mono text-slate-400">TDEE: {maintenanceTdee}</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white font-mono">{targetCalories}</span>
              <span className="text-xs font-bold text-orange-400">kcal / day</span>
              <span className="text-[11px] text-slate-500 font-mono ml-auto">BMR: {baseBmr}</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((targetCalories / maintenanceTdee) * 100))}%` }}
              />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Carbs Allocation:</span>
              <span className="font-semibold text-orange-300">{targetCarbGrams}g ({remainingCalories} kcal)</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🍠 Sweet Potato</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🌾 Oats</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🍚 Jasmine Rice</span>
            </div>
          </div>
        </div>

        {/* 3. HEALTHY FATS LEVEL */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-4 hover:border-emerald-500/60 transition-all group shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl select-none">🥑</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              25% Fuel
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Healthy Fats</span>
              <span className="text-[11px] font-mono text-slate-400">Target: {targetFatGrams}g</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white font-mono">{targetFatGrams}</span>
              <span className="text-xs font-bold text-emerald-400">g / day</span>
              <span className="text-[11px] text-slate-500 font-mono ml-auto">{fatCalories} kcal</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: '92%' }} />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Hormone Balance:</span>
              <span className="font-semibold text-emerald-400">Testosterone & Joints</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🥑 Avocado</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🌰 Almonds</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🫒 EVOO</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🐟 Omega-3</span>
            </div>
          </div>
        </div>

        {/* 4. VITAMINS & MINERALS */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-violet-500/30 p-4 hover:border-violet-500/60 transition-all group shadow-lg">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-sky-500 p-0.5 shadow-md shadow-violet-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl select-none">🛡️</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
              Micronutrients
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Vitamins & Minerals</span>
              <span className="text-[11px] font-mono text-slate-400">Daily RDA</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white font-mono">98%</span>
              <span className="text-xs font-bold text-violet-400">RDA Saturation</span>
              <span className="text-[11px] text-slate-500 font-mono ml-auto">A to Zinc</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800/80 h-2 rounded-full mt-2.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-400 rounded-full transition-all duration-500" style={{ width: '98%' }} />
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Cellular Shield:</span>
              <span className="font-semibold text-violet-300">Immune & Recovery</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">☀️ Vit D3 2k IU</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🍊 Vit C 250mg</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">🛡️ Zinc 15mg</span>
              <span className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded">💤 Mg 400mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Innovative Hydration & Electrolyte Rapid Sip Tracker Bar */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-800/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 shrink-0">
            <Droplet className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Intra-Day Hydration & Electrolyte Engine
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {Math.round((waterMl / 3000) * 100)}% of 3.0L Target
              </span>
            </div>
            <div className="w-64 sm:w-80 bg-slate-800 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (waterMl / 3000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-mono font-bold text-cyan-300 mr-2">
            {waterMl} <span className="text-xs text-slate-400">/ 3,000 mL</span>
          </span>
          <button
            type="button"
            onClick={() => handleAddWater(250)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-bold transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> +250 mL
          </button>
          <button
            type="button"
            onClick={() => handleAddWater(500)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 font-mono text-xs font-bold transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> +500 mL
          </button>
        </div>
      </div>
    </div>
  );
};
