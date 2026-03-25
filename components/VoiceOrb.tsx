"use client";

import { motion, AnimatePresence } from "framer-motion";

type OrbState = "idle" | "listening" | "thinking" | "speaking";

const stateConfig: Record<
  OrbState,
  { label: string; color: string; glow: string }
> = {
  idle: {
    label: "Tap to start",
    color: "from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/40",
  },
  listening: {
    label: "Listening...",
    color: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-400/60",
  },
  thinking: {
    label: "Thinking...",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-amber-400/60",
  },
  speaking: {
    label: "Speaking",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-400/60",
  },
};

interface VoiceOrbProps {
  state: OrbState;
  onPressStart: () => void;
  onPressEnd: () => void;
}

export function VoiceOrb({ state, onPressStart, onPressEnd }: VoiceOrbProps) {
  const { label, color, glow } = stateConfig[state];

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.button
        onMouseDown={onPressStart}
        onMouseUp={onPressEnd}
        onMouseLeave={onPressEnd}
        onTouchStart={(e) => { e.preventDefault(); onPressStart(); }}
        onTouchEnd={(e) => { e.preventDefault(); onPressEnd(); }}
        className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${color} shadow-2xl ${glow} cursor-pointer select-none focus:outline-none touch-none`}
        animate={
          state === "idle"
            ? { scale: [1, 1.04, 1] }
            : state === "listening"
            ? { scale: [1, 1.08, 1] }
            : state === "thinking"
            ? { rotate: [0, 360] }
            : { scale: [1, 1.12, 0.96, 1.08, 1] }
        }
        transition={
          state === "thinking"
            ? { duration: 1.4, repeat: Infinity, ease: "linear" }
            : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Inner glow ring */}
        <motion.div
          className={`absolute inset-2 rounded-full bg-gradient-to-br ${color} opacity-60`}
          animate={{ scale: state === "listening" ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {state === "idle" || state === "listening" ? (
            <svg
              className="w-14 h-14 text-white drop-shadow"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 9a1 1 0 0 1 2 0 8 8 0 0 1-7 7.938V20h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-2.062A8 8 0 0 1 4 10a1 1 0 0 1 2 0 6 6 0 0 0 12 0z" />
            </svg>
          ) : state === "thinking" ? (
            <svg
              className="w-14 h-14 text-white drop-shadow"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" />
            </svg>
          ) : (
            <svg
              className="w-14 h-14 text-white drop-shadow"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          )}
        </div>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-white/60 text-sm tracking-widest uppercase"
        >
          {label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
