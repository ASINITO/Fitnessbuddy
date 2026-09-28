import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Check, Dumbbell, Zap, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  currentExerciseName?: string;
  defaultRestSeconds?: number;
  onSetCompleted?: (setNum: number, weightKg: number, reps: number) => void;
}

export const LiveAudioWorkoutCoach: React.FC<Props> = ({
  currentExerciseName = 'Barbell Bench Press',
  defaultRestSeconds = 60,
  onSetCompleted
}) => {
  const [restSeconds, setRestSeconds] = useState<number>(defaultRestSeconds);
  const [totalDuration, setTotalDuration] = useState<number>(defaultRestSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceCueEnabled, setVoiceCueEnabled] = useState<boolean>(true);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [setWeight, setSetWeight] = useState<number>(60);
  const [setReps, setSetReps] = useState<number>(10);
  const [loggedSets, setLoggedSets] = useState<{ set: number; weight: number; reps: number; timestamp: string }[]>([
    { set: 1, weight: 60, reps: 10, timestamp: 'Just now' }
  ]);
  const [binauralDronePlaying, setBinauralDronePlaying] = useState<boolean>(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play short acoustic tick
  const playTick = (freq = 600, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // Play multi-tone chime on rest completion
  const playRestCompleteChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const tones = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 chord
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.6);
      });
    } catch (e) {
      // Ignore
    }
  };

  // Web Speech API Voice Synthesizer
  const speakVoiceCue = (text: string) => {
    if (!voiceCueEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech synthesis error
    }
  };

  // Toggle Binaural 432Hz Athletic Flow Drone
  const toggleBinauralDrone = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (binauralDronePlaying) {
      if (droneOscRef.current) {
        try {
          droneOscRef.current.stop();
          droneOscRef.current.disconnect();
        } catch (e) {}
        droneOscRef.current = null;
      }
      setBinauralDronePlaying(false);
    } else {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        droneOscRef.current = osc;
        droneGainRef.current = gain;
        setBinauralDronePlaying(true);
      } catch (e) {
        // Audio error
      }
    }
  };

  // Countdown Interval Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && restSeconds > 0) {
      interval = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 4 && prev > 1) {
            playTick(800, 0.1);
          } else if (prev === 1) {
            playRestCompleteChime();
            speakVoiceCue('Rest complete! Step up for the next set.');
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, restSeconds, soundEnabled]);

  const handleStartTimer = () => {
    if (restSeconds === 0) setRestSeconds(totalDuration);
    setIsRunning(true);
    playTick(1000, 0.12);
    speakVoiceCue(`Rest timer started. ${totalDuration} seconds on the clock.`);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
    playTick(400, 0.1);
  };

  const handleResetTimer = (newDuration?: number) => {
    setIsRunning(false);
    const dur = newDuration !== undefined ? newDuration : totalDuration;
    setRestSeconds(dur);
    if (newDuration !== undefined) setTotalDuration(newDuration);
    playTick(500, 0.08);
  };

  const handleLogSet = () => {
    const newLog = {
      set: currentSet,
      weight: setWeight,
      reps: setReps,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLoggedSets((prev) => [newLog, ...prev]);
    playRestCompleteChime();
    speakVoiceCue(`Set ${currentSet} logged! ${setReps} reps at ${setWeight} kilos. Take ${totalDuration} seconds rest.`);
    setCurrentSet((prev) => prev + 1);
    setRestSeconds(totalDuration);
    setIsRunning(true);
    if (onSetCompleted) {
      onSetCompleted(currentSet, setWeight, setReps);
    }
  };

  const progressPercentage = Math.max(0, Math.min(100, ((totalDuration - restSeconds) / totalDuration) * 100));

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3" /> Live Audio Coach
            </span>
            <span className="text-xs text-slate-400 font-mono">Web Audio Synthesizer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
            Rest Chronometer & Tactical Cue Engine
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time audio pacing, synthesized countdown interval chimes, and rep logger.
          </p>
        </div>

        {/* Audio Cues & Focus Drone Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleBinauralDrone}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
              binauralDronePlaying
                ? 'bg-violet-950/60 border-violet-500/50 text-violet-300 shadow-lg shadow-violet-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 432Hz Pure Athletic Focus Drone"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>{binauralDronePlaying ? '432Hz Drone On' : '432Hz Focus'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-950 text-orange-400 border-slate-800 hover:bg-slate-900'
                : 'bg-slate-950 text-slate-600 border-slate-800'
            }`}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setVoiceCueEnabled(!voiceCueEnabled)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-colors ${
              voiceCueEnabled
                ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                : 'bg-slate-950 text-slate-600 border-slate-800'
            }`}
            title="Toggle Voice Guidance"
          >
            🎙️ Voice {voiceCueEnabled ? 'On' : 'Muted'}
          </button>
        </div>
      </div>

      {/* Main Grid: Rest Timer Radial + Set Logger */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Rest Timer Radial HUD (6 cols) */}
        <div className="md:col-span-6 bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-5">
          {/* Radial Countdown Display */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-slate-800/80"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-orange-500 transition-all duration-300"
                strokeWidth="7"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * (100 - progressPercentage)) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                {isRunning ? 'Resting...' : restSeconds === 0 ? 'GO TIME!' : 'Rest Interval'}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {[30, 45, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => handleResetTimer(sec)}
                className={`px-2.5 py-1 rounded-lg transition-all border ${
                  totalDuration === sec
                    ? 'bg-orange-500 text-slate-950 font-bold border-orange-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Play / Pause / Reset Action Controls */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            {isRunning ? (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Pause className="w-4 h-4 fill-slate-950" /> Pause
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartTimer}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Rest
              </button>
            )}

            <button
              type="button"
              onClick={() => handleResetTimer()}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Set & Weight Logger (6 cols) */}
        <div className="md:col-span-6 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                Live Exercise Logger
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
                {currentExerciseName}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-orange-400">
              Set #{currentSet}
            </span>
          </div>

          {/* Stepper Inputs for Weight & Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">Weight (kg)</label>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setSetWeight((w) => Math.max(0, w - 2.5))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl font-black text-white font-mono">{setWeight}</span>
                <button
                  type="button"
                  onClick={() => setSetWeight((w) => w + 2.5)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <label className="text-[10px] font-mono text-slate-400 uppercase block">Reps Completed</label>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  onClick={() => setSetReps((r) => Math.max(1, r - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl font-black text-white font-mono">{setReps}</span>
                <button
                  type="button"
                  onClick={() => setSetReps((r) => r + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Log Set Button */}
          <button
            type="button"
            onClick={handleLogSet}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Log Set #{currentSet} & Begin Rest
          </button>

          {/* Quick Voice Cue Trigger */}
          <button
            type="button"
            onClick={() => speakVoiceCue(`Next up: ${currentExerciseName}. 3 sets of 8 to 12 reps. Keep core braced and control the eccentric descent.`)}
            className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 text-xs font-mono rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors"
          >
            <span>🔊 Speak Exercise Cue & Form Checklist</span>
          </button>

          {/* Recent Logged Sets Strip */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Completed Sets for Today:</span>
            <div className="flex flex-wrap gap-2">
              {loggedSets.map((l, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Set {l.set}: {l.weight}kg × {l.reps} reps</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
