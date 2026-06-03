import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Fish, Anchor, Waves, Droplets, Shell, Compass, Volume2, VolumeX, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Custom Oceanic SVG Icons ─────────────────────────────────────────────────
const TridentIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="6" x2="12" y2="22" />
    <path d="M8 2 Q8 6 10 7 Q12 8 12 6" />
    <path d="M16 2 Q16 6 14 7 Q12 8 12 6" />
    <line x1="6" y1="2" x2="6" y2="5" />
    <line x1="18" y1="2" x2="18" y2="5" />
    <line x1="9" y1="20" x2="15" y2="20" />
  </svg>
);

const SeaStarIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} opacity="0.9">
    <path d="M12 2l1.8 5.5H20l-4.7 3.4 1.8 5.5L12 13l-5.1 3.4 1.8-5.5L4 7.5h6.2L12 2z" />
    <path d="M12 2l1.2 7.5L20 14l-7.5-1.2L10 20l-1.2-7.5L2 10l7.5 1.2L12 2z" opacity="0.3" />
  </svg>
);

const NautilusIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 12 Q14 8 18 9 Q22 10 21 14 Q20 18 16 19 Q12 20 9 17 Q6 14 7 10 Q8 6 12 5 Q17 4 20 8" />
    <path d="M12 12 Q13 10 15 11 Q17 12 16 14 Q15 16 13 16 Q11 16 11 14 Q11 13 12 12" />
    <line x1="12" y1="12" x2="8" y2="17" />
    <line x1="12" y1="12" x2="7" y2="13" />
    <line x1="12" y1="12" x2="8" y2="9" />
  </svg>
);

const CoralIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22 L12 14" />
    <path d="M12 18 Q9 16 7 18 Q5 20 7 21" />
    <path d="M12 16 Q15 14 17 16 Q19 18 17 20" />
    <path d="M12 14 Q10 10 8 11 Q6 12 7 14" />
    <path d="M12 14 Q14 9 16 10 Q18 11 17 13" />
    <path d="M12 11 Q11 7 9 7 Q7 7 8 9" />
    <path d="M12 10 Q13 6 15 6 Q17 6 16 8" />
  </svg>
);

const JellyfishIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M5 11 Q5 4 12 4 Q19 4 19 11" />
    <path d="M5 11 Q7 13 9 11 Q11 9 12 11 Q13 13 15 11 Q17 9 19 11" />
    <path d="M7 13 Q7 16 8 19 Q8.5 20 9 18" />
    <path d="M10 13 Q10 17 11 20 Q11.5 21 12 19" />
    <path d="M13 13 Q13 17 14 20 Q14.5 21 15 19" />
    <path d="M16 13 Q16 16 17 19 Q17.5 20 18 18" />
  </svg>
);

const WheelIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="9" />
    <line x1="12" y1="15" x2="12" y2="21" />
    <line x1="3" y1="12" x2="9" y2="12" />
    <line x1="15" y1="12" x2="21" y2="12" />
    <line x1="5.6" y1="5.6" x2="9.5" y2="9.5" />
    <line x1="14.5" y1="14.5" x2="18.4" y2="18.4" />
    <line x1="18.4" y1="5.6" x2="14.5" y2="9.5" />
    <line x1="9.5" y1="14.5" x2="5.6" y2="18.4" />
  </svg>
);

// ─── Ambient Ocean Sound ──────────────────────────────────────────────────────
function useOceanSound() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const start = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;
    const sampleRate = ctx.sampleRate;

    // Brown noise buffer (4 seconds, looped)
    const buf = ctx.createBuffer(2, sampleRate * 4, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 4;
      }
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    // Deep underwater lowpass
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 350;
    lpf.Q.value = 0.8;

    // Gentle resonance peak for "whoosh"
    const peaking = ctx.createBiquadFilter();
    peaking.type = "peaking";
    peaking.frequency.value = 80;
    peaking.gain.value = 8;

    // LFO for gentle water movement
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain);
    lfoGain.connect(lpf.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    src.connect(lpf);
    lpf.connect(peaking);
    peaking.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    sourceRef.current = src;

    // Fade in
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 2);
  }, []);

  const toggle = useCallback(() => {
    if (!playing) {
      start();
      setPlaying(true);
    } else {
      const gain = gainRef.current;
      const ctx = ctxRef.current;
      if (gain && ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
          sourceRef.current?.stop();
          ctx.close();
          ctxRef.current = null;
        }, 1100);
      }
      setPlaying(false);
    }
  }, [playing, start]);

  useEffect(() => () => { sourceRef.current?.stop(); ctxRef.current?.close(); }, []);
  return { playing, toggle };
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  // Wake bubbles — emitted along the walk path as Bob passes
  const [wake, setWake] = useState<{ id: number; xVw: number; size: number; drift: number }[]>([]);
  const wakeRef = useRef(0);

  useEffect(() => {
    const WALK_DELAY = 1900;   // ms before Bob starts walking
    const WALK_DUR   = 4200;   // ms Bob takes to cross
    const STEPS      = 18;     // number of wake bursts
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < STEPS; i++) {
      const t = WALK_DELAY + (i / STEPS) * WALK_DUR;
      timers.push(setTimeout(() => {
        const xVw = (i / STEPS) * 110;
        // each burst: 3 small bubbles
        for (let b = 0; b < 3; b++) {
          const id = wakeRef.current++;
          const offset = (Math.random() - 0.5) * 6;
          const size   = Math.random() * 7 + 4;
          const drift  = (Math.random() - 0.5) * 30;
          setWake(p => [...p.slice(-60), { id, xVw: xVw + offset, size, drift }]);
        }
      }, t));
    }

    const done = setTimeout(onDone, 6400);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0a3a6a 0%, #030d1e 60%, #000408 100%)" }}
      exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.9, ease: "easeInOut" }}>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)" }} />

      {/* ── Cinematic letterbox bars ── */}
      <motion.div className="absolute top-0 left-0 right-0 z-20 bg-black"
        initial={{ height: "18vh" }} animate={{ height: "10vh" }} transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 left-0 right-0 z-20 bg-black"
        initial={{ height: "18vh" }} animate={{ height: "10vh" }} transition={{ delay: 1.2, duration: 1.2, ease: "easeInOut" }} />

      {/* ── Animated god rays ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[8, 19, 30, 44, 57, 68, 79, 91].map((l, i) => (
          <motion.div key={i} className="absolute top-0 h-[80%]"
            style={{ left: `${l}%`, width: "44px", background: "linear-gradient(180deg, rgba(100,180,255,0.12) 0%, transparent 100%)", transform: `skewX(${(i - 3.5) * 5}deg)`, transformOrigin: "top center" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: [0, 0.9, 0.5, 0.8, 0.5] }}
            transition={{ delay: 0.3 + i * 0.08, duration: 1.4, ease: "easeOut", opacity: { repeat: Infinity, duration: 4 + i * 0.5, delay: 1.5 } }} />
        ))}
      </div>

      {/* ── Sonar ping rings ── */}
      {[0, 0.5, 1.0].map((d, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/10 pointer-events-none"
          style={{ top: "40%", left: "50%", x: "-50%", y: "-50%", width: 80, height: 80 }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ delay: 0.9 + d, duration: 2.2, ease: "easeOut" }} />
      ))}

      {/* ── Background bubbles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="animate-bubble absolute bottom-0"
            style={{ left: `${(i / 22) * 100}vw`, width: `${Math.random() * 16 + 5}px`, height: `${Math.random() * 16 + 5}px`, animationDelay: `${Math.random() * 6}s`, animationDuration: `${Math.random() * 8 + 10}s` }} />
        ))}
      </div>

      {/* ── Seaweed strips ── */}
      {[{ s: "left", ws: [110, 80, 130, 70] }, { s: "right", ws: [90, 120, 65, 100] }].map(({ s, ws }) => (
        <div key={s} className={`absolute bottom-[10vh] ${s}-4 flex gap-3`}>
          {ws.map((h, i) => (
            <motion.div key={i} className="animate-sway origin-bottom" style={{ animationDelay: `${i * 0.35}s` }}
              initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.12, duration: 0.9, ease: "easeOut" }}>
              <svg width="22" height={h} viewBox={`0 0 22 ${h}`} fill="none">
                <path d={`M11 ${h} Q${s==="left"?2:20} ${h*.78} 11 ${h*.58} Q${s==="right"?2:20} ${h*.38} 11 ${h*.2} Q${s==="left"?2:20} 4 11 0`}
                  stroke="#0a6535" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </svg>
            </motion.div>
          ))}
        </div>
      ))}

      {/* ── Ocean floor ── */}
      <div className="absolute bottom-[10vh] left-0 right-0 h-6 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(4,20,48,0.9) 0%, transparent 100%)" }} />

      {/* ── Wake bubbles (Bob's trail) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ bottom: "10vh" }}>
        {wake.map(b => (
          <motion.div key={b.id} className="absolute rounded-full"
            style={{
              bottom: "12vh", left: `${b.xVw}vw`,
              width: b.size, height: b.size,
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.85), rgba(180,220,255,0.15))",
              boxShadow: "inset 0 0 3px rgba(255,255,255,0.5)",
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{ y: -(80 + Math.random() * 120), x: b.drift, opacity: [0, 0.8, 0.5, 0], scale: [0, 1, 0.8, 0.4] }}
            transition={{ duration: 2.2 + Math.random(), ease: "easeOut" }} />
        ))}
      </div>

      {/* ── Bob WALKING ── */}
      <motion.div className="absolute z-10" style={{ bottom: "11vh" }}
        initial={{ x: "calc(-160px)" }}
        animate={{ x: "calc(110vw)" }}
        transition={{ delay: 1.9, duration: 4.2, ease: "linear" }}>
        {/* Walk cycle wrapper — bounce + lean */}
        <motion.div
          animate={{
            y:       [0, -44, 0, -44, 0, -44, 0, -44, 0, -44, 0, -44, 0, -44, 0],
            rotate:  [9,   0,-9,   0, 9,   0,-9,   0, 9,   0,-9,   0, 9,   0, 9],
            scaleX:  [1, .94, 1, .94, 1, .94, 1, .94, 1, .94, 1, .94, 1, .94, 1],
            scaleY:  [1,1.06, 1,1.06, 1,1.06, 1,1.06, 1,1.06, 1,1.06, 1,1.06, 1],
          }}
          transition={{
            delay: 1.9,
            duration: 4.2,
            times: [0,.071,.143,.214,.286,.357,.429,.5,.571,.643,.714,.786,.857,.929,1],
            ease: "easeInOut",
          }}>
          <motion.img src="/bob-nobg.png" alt="Bob walking"
            style={{ width: 140, height: 140, objectFit: "contain" }}
            animate={{
              filter: [
                "drop-shadow(0 12px 28px rgba(255,140,0,0.55)) brightness(1)",
                "drop-shadow(0 6px 16px rgba(255,140,0,0.35)) brightness(0.95)",
                "drop-shadow(0 12px 28px rgba(255,140,0,0.55)) brightness(1)",
              ]
            }}
            transition={{ delay: 1.9, duration: 0.6, repeat: 7, ease: "easeInOut" }} />
        </motion.div>
      </motion.div>

      {/* ── Title block (centre stage) ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none" style={{ paddingBottom: "8vh" }}>

        {/* Top ornament line */}
        <motion.div className="flex items-center gap-4 mb-5"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}>
          <div className="h-px w-24" style={{ background: "linear-gradient(to right, transparent, rgba(100,180,255,0.5))" }} />
          <JellyfishIcon size={20} className="text-white/40" />
          <div className="h-px w-24" style={{ background: "linear-gradient(to left, transparent, rgba(100,180,255,0.5))" }} />
        </motion.div>

        {/* "BOB" — massive dramatic reveal */}
        <div className="relative overflow-visible">
          <motion.h1
            className="font-display font-black leading-none tracking-[0.25em] select-none"
            style={{ fontSize: "clamp(4.5rem,14vw,11rem)", color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.15)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(140,200,255,0.7) 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
            }}
            initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            BOB
          </motion.h1>
          {/* Dramatic glow bloom behind "BOB" */}
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, rgba(14,122,181,0.35) 0%, transparent 70%)", filter: "blur(30px)", zIndex: -1 }}
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: [0, 1, 0.6], scale: [0.5, 1.3, 1.1] }}
            transition={{ delay: 0.7, duration: 1.4, ease: "easeOut" }} />
        </div>

        {/* "THE JELLYFISH" */}
        <motion.h2
          className="font-display font-semibold tracking-[0.35em] text-white/80 uppercase"
          style={{ fontSize: "clamp(1rem,3.5vw,2.6rem)", letterSpacing: "0.38em" }}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}>
          The Jellyfish
        </motion.h2>

        {/* Divider */}
        <motion.div className="flex items-center gap-3 mt-4 mb-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55, duration: 0.7 }}>
          <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.12)" }} />
          <SeaStarIcon size={10} className="text-white/25" />
          <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.12)" }} />
        </motion.div>

        {/* Tagline */}
        <motion.p className="font-sans text-white/40 tracking-[0.45em] uppercase text-xs"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.9 }}>
          Descending into the deep
        </motion.p>
      </div>

      {/* ── Depth readout (bottom centre) ── */}
      <motion.div className="absolute z-10 left-0 right-0 flex flex-col items-center gap-1"
        style={{ bottom: "11vh" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
        <p className="font-sans text-white/20 text-[10px] tracking-[0.5em] uppercase">
          — 4,200 ft · Below Surface —
        </p>
      </motion.div>

    </motion.div>
  );
}

// ─── Bob Bubbles ──────────────────────────────────────────────────────────────
function BobBubbles() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number }[]>([]);
  const counter = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      const id = counter.current++;
      setBubbles(p => [...p.slice(-10), { id, x: (Math.random() - 0.5) * 110, size: Math.random() * 9 + 4 }]);
    }, 800);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map(b => (
        <motion.div key={b.id} className="absolute rounded-full"
          style={{ bottom: "8%", left: `calc(50% + ${b.x}px)`, width: b.size, height: b.size, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.15))", boxShadow: "inset 0 0 3px rgba(255,255,255,0.6)" }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -260, opacity: [0, 0.85, 0.6, 0], scale: [0, 1, 0.9, 0.5], x: [0, b.x * .25, -b.x * .15] }}
          transition={{ duration: 3.2, ease: "easeOut" }} />
      ))}
    </div>
  );
}

// ─── Alive Bob ────────────────────────────────────────────────────────────────
function AliveBob() {
  const glowCtrl = useAnimationControls();
  useEffect(() => {
    (async () => { for (;;) { await glowCtrl.start({ scale: 1.12, opacity: 0.55, transition: { duration: 2.5, ease: "easeInOut" } }); await glowCtrl.start({ scale: 1, opacity: 0.3, transition: { duration: 2.5, ease: "easeInOut" } }); } })();
  }, [glowCtrl]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: "min(460px, 85vw)", height: "min(460px, 85vw)" }}>
      <motion.div animate={glowCtrl} className="absolute rounded-full pointer-events-none"
        style={{ inset: "-10%", background: "radial-gradient(circle, rgba(0,180,255,0.2) 0%, rgba(0,100,200,0.06) 60%, transparent 80%)", filter: "blur(20px)" }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        animate={{ scale: [1, 1.09, 1], opacity: [0.22, 0.4, 0.22] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ inset: "8% 14% 28% 14%", background: "radial-gradient(circle, rgba(255,140,0,0.3) 0%, transparent 70%)", filter: "blur(18px)" }} />
      {[1, 1.7].map((d, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/10 pointer-events-none"
          animate={{ scale: [1, 2.1], opacity: [0.28, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: d }}
          style={{ inset: "22%" }} />
      ))}
      <motion.div className="relative z-10" style={{ width: "85%", height: "85%" }}
        animate={{ y: [0, -18, -4, -20, 0], rotate: [-1.5, 1.5, -2, 1, -1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <motion.div style={{ width: "100%", height: "100%" }}
          animate={{ scaleX: [1, 1.04, 0.98, 1.05, 1], scaleY: [1, 0.97, 1.03, 0.96, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <motion.img src="/bob-nobg.png" alt="Bob The Jellyfish"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            animate={{ filter: ["drop-shadow(0 20px 40px rgba(255,140,0,0.45)) drop-shadow(0 0 28px rgba(0,180,255,0.2)) brightness(1)", "drop-shadow(0 24px 52px rgba(255,160,0,0.65)) drop-shadow(0 0 40px rgba(0,200,255,0.4)) brightness(1.09)", "drop-shadow(0 20px 40px rgba(255,140,0,0.45)) drop-shadow(0 0 28px rgba(0,180,255,0.2)) brightness(1)"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
      </motion.div>
      <BobBubbles />
    </div>
  );
}

// ─── Swimming Fish ────────────────────────────────────────────────────────────
const FISH = [
  { top: "20%", size: 28, dur: 20, delay: 2, dir: "ltr", color: "#0a2a50", op: 0.4 },
  { top: "36%", size: 18, dur: 28, delay: 6, dir: "rtl", color: "#c0392b", op: 0.55 },
  { top: "58%", size: 36, dur: 22, delay: 0, dir: "ltr", color: "#d4a200", op: 0.5 },
  { top: "74%", size: 14, dur: 34, delay: 10, dir: "rtl", color: "#0a3060", op: 0.35 },
  { top: "13%", size: 20, dur: 30, delay: 4, dir: "rtl", color: "#e07000", op: 0.45 },
  { top: "48%", size: 12, dur: 42, delay: 15, dir: "ltr", color: "#1a5a9e", op: 0.35 },
  { top: "84%", size: 24, dur: 24, delay: 8, dir: "ltr", color: "#b03020", op: 0.4 },
];
function SwimmingFish() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {FISH.map((f, i) => (
        <div key={i} className={f.dir === "rtl" ? "animate-fish-rtl" : "animate-fish-ltr"}
          style={{ position: "absolute", top: f.top, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s`, color: f.color, opacity: f.op }}>
          <Fish size={f.size} strokeWidth={1.4} />
        </div>
      ))}
    </div>
  );
}

// ─── Background Bubbles ───────────────────────────────────────────────────────
function Bubbles() {
  const [b] = useState(() => Array.from({ length: 26 }, (_, i) => ({ id: i, left: `${(i / 26) * 100 + Math.random() * 3}vw`, size: `${Math.random() * 18 + 5}px`, delay: `${Math.random() * 14}s`, dur: `${Math.random() * 10 + 12}s` })));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {b.map(x => <div key={x.id} className="animate-bubble absolute bottom-0" style={{ left: x.left, width: x.size, height: x.size, animationDelay: x.delay, animationDuration: x.dur }} />)}
    </div>
  );
}

// ─── Ocean Floor ─────────────────────────────────────────────────────────────
function OceanFloor() {
  const weeds = [95, 125, 72, 112, 88, 104, 135, 78, 98, 118, 82, 108, 65, 92, 115];
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0">
      <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30" style={{ background: "linear-gradient(0deg, #041830 0%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end px-1 overflow-hidden">
        {weeds.map((h, i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${(i * 0.3) % 2}s` }}>
            <svg width="20" height={h} viewBox={`0 0 20 ${h}`} fill="none">
              <path d={`M10 ${h} Q${i % 2 === 0 ? 1 : 19} ${h * .8} 10 ${h * .6} Q${i % 2 === 0 ? 19 : 1} ${h * .4} 10 ${h * .2} Q${i % 2 === 0 ? 1 : 19} 3 10 0`} stroke="#0a6535" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>
      {/* Coral left */}
      <div className="absolute bottom-0 left-3">
        <svg width="100" height="75" viewBox="0 0 100 75" fill="none">
          <path d="M20 75 Q20 45 10 32 Q0 20 14 14 Q19 30 24 19 Q29 8 34 19 Q38 30 30 42 Q40 46 44 30 Q49 14 54 24 Q59 34 50 50 Q56 54 61 44 Q66 33 71 43 Q73 54 66 65" stroke="#8e1e1e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.65" />
          {[{ cx: 9, cy: 13 }, { cx: 34, cy: 17 }, { cx: 54, cy: 22 }].map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r="5" fill="#c0392b" opacity="0.7" />)}
        </svg>
      </div>
      {/* Coral right */}
      <div className="absolute bottom-0 right-3 scale-x-[-1]">
        <svg width="100" height="75" viewBox="0 0 100 75" fill="none">
          <path d="M20 75 Q20 45 10 32 Q0 20 14 14 Q19 30 24 19 Q29 8 34 19 Q38 30 30 42 Q40 46 44 30 Q49 14 54 24 Q59 34 50 50 Q56 54 61 44 Q66 33 71 43 Q73 54 66 65" stroke="#5b2c8e" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.55" />
          {[{ cx: 9, cy: 13 }, { cx: 34, cy: 17 }, { cx: 54, cy: 22 }].map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r="5" fill="#8e44ad" opacity="0.65" />)}
        </svg>
      </div>
    </div>
  );
}

// ─── God Rays ─────────────────────────────────────────────────────────────────
function GodRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[8, 22, 36, 52, 66, 80].map((left, i) => (
        <motion.div key={i} className="absolute top-0 h-[70%]"
          style={{ left: `${left}%`, width: "50px", background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)", transform: `skewX(${(i - 2.5) * 6}deg)` }}
          animate={{ opacity: [0.4, 0.85, 0.4], scaleX: [1, 1.18, 1] }}
          transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }} />
      ))}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
const OceanDivider = ({ flip = false }) => (
  <div className={`relative z-10 overflow-hidden ${flip ? "rotate-180" : ""}`}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12">
      <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="rgba(3,16,40,0.9)" />
    </svg>
  </div>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, sub }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; sub?: string }) => (
  <div className="text-center mb-10">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
      <Icon size={18} className="text-white/40" />
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
    </div>
    <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-[0.15em] uppercase"
      style={{ textShadow: "0 0 30px rgba(14,122,181,0.4)" }}>{title}</h2>
    {sub && <p className="text-white/40 font-sans text-xs tracking-[0.3em] uppercase mt-2">{sub}</p>}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { playing, toggle: toggleSound } = useOceanSound();

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div className="relative min-h-screen text-white overflow-x-hidden"
        style={{ background: "linear-gradient(180deg, #071e38 0%, #0a3c6a 20%, #0b5a95 45%, #083470 70%, #041830 100%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.8 }}>

        <GodRays />
        <Bubbles />
        <SwimmingFish />
        <OceanFloor />

        {/* ── Navbar ─────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex items-center justify-between"
          style={{ background: "rgba(5,20,45,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-3">
            <img src="/bob-nobg.png" alt="Bob" className="w-10 h-10 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.5))" }} />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display font-bold text-base text-white tracking-[0.18em] uppercase leading-none">Bob</span>
              <span className="font-sans text-[9px] text-white/45 tracking-[0.35em] uppercase">The Jellyfish</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-[11px] font-display font-semibold text-white/70 tracking-[0.2em] uppercase">
            {[["Depths", "#tokenomics"], ["Navigate", "#how-to-buy"], ["Current", "#community"]].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white transition-colors hover:tracking-[0.25em]">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleSound}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: playing ? "rgba(14,122,181,0.4)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
              title={playing ? "Mute ocean" : "Play ocean ambience"}
              data-testid="button-sound">
              {playing ? <Volume2 size={15} className="text-[#00bfff]" /> : <VolumeX size={15} className="text-white/50" />}
            </button>
            <Button className="rounded-full px-5 h-9 font-display font-semibold text-white text-xs tracking-[0.15em] uppercase"
              style={{ background: "linear-gradient(135deg, #0a4a8a, #0a2050)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 0 20px rgba(14,100,180,0.3)" }}
              data-testid="button-buy-nav">
              Buy $BOB
            </Button>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-16 z-10 overflow-hidden px-6 md:px-12 lg:px-20">
          <div className="w-full flex flex-col lg:flex-row items-center gap-6 lg:gap-0">

            {/* Left */}
            <motion.div className="relative z-10 flex flex-col gap-5 lg:w-1/2"
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -40 }}
              transition={{ duration: 0.8, delay: 0.3 }}>

              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.25)" }} />
                <span className="font-sans text-[10px] tracking-[0.45em] text-white/50 uppercase">The TON Ocean</span>
              </div>

              <div className="leading-none">
                <h1 className="font-display font-black leading-none" style={{ fontSize: "clamp(5rem,15vw,11rem)", color: "#071e38", WebkitTextStroke: "1px rgba(255,255,255,0.1)", textShadow: "3px 6px 0 rgba(0,0,0,0.25), 0 0 60px rgba(14,122,181,0.2)" }}>
                  BOB
                </h1>
                <h2 className="font-display font-semibold text-white leading-none tracking-[0.12em]"
                  style={{ fontSize: "clamp(1.6rem,4.5vw,3.8rem)", marginTop: "-0.08em", textShadow: "1px 3px 0 rgba(0,0,0,0.25)" }}>
                  The Jellyfish
                </h2>
              </div>

              <p className="font-sans text-white/65 font-light leading-relaxed max-w-sm text-sm md:text-base tracking-wide">
                Drifting through the currents of TON.<br />
                Bioluminescent. Uncontrollable. Inevitable.
              </p>

              <div className="flex flex-wrap gap-3 mt-1">
                <Button size="lg" className="h-12 px-7 rounded-full font-display font-semibold text-white text-sm tracking-[0.12em] uppercase"
                  style={{ background: "linear-gradient(135deg, #0a4a8a 0%, #071e38 100%)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(14,122,181,0.2)" }}
                  data-testid="button-buy-hero">
                  <TridentIcon size={16} className="mr-2 shrink-0" /> Acquire $BOB
                </Button>
                <Button size="lg" variant="outline"
                  className="h-12 px-7 rounded-full font-display font-semibold text-sm tracking-[0.12em] uppercase text-white/80 border-white/20 hover:bg-white/5 hover:text-white"
                  data-testid="button-learn-more">
                  <NautilusIcon size={16} className="mr-2 shrink-0" /> Explore
                </Button>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-3 mt-1">
                {[{ icon: Send, label: "Telegram" }, { icon: WheelIcon, label: "Twitter" }, { icon: Anchor, label: "TON" }].map(({ icon: Ico, label }, i) => (
                  <button key={i} aria-label={label} data-testid={`social-${label.toLowerCase()}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:border-white/40"
                    style={{ background: "rgba(7,30,56,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Ico size={15} className="text-white/60" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right — Bob */}
            <motion.div className="relative z-10 flex items-center justify-center lg:w-1/2"
              initial={{ opacity: 0, scale: 0.8, x: 40 }} animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.8, x: loaded ? 0 : 40 }}
              transition={{ duration: 0.9, delay: 0.4 }}>
              <AliveBob />
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
            animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <Waves size={16} />
            <span className="text-[9px] tracking-[0.4em] uppercase font-sans">Dive In</span>
          </motion.div>
        </section>

        <OceanDivider />

        {/* ── Tokenomics ─────────────────────────────────────────────────── */}
        <section id="tokenomics" className="py-14 relative z-10 px-6"
          style={{ background: "rgba(3,14,38,0.9)" }}>
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto">
            <SectionHeading icon={NautilusIcon} title="Depths of $BOB" sub="Token Distribution" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Droplets, label: "Total Supply", value: "1 Billion", sub: "$BOB" },
                { icon: CoralIcon, label: "Liquidity", value: "Burned", sub: "Forever Locked" },
                { icon: TridentIcon, label: "Taxes", value: "0 / 0", sub: "Zero Tax" },
                { icon: SeaStarIcon, label: "Contract", value: "Renounced", sub: "Fully Safe" },
              ].map(({ icon: Ico, label, value, sub }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.45 }} whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="rounded-2xl p-5 flex flex-col items-center gap-2.5 text-center"
                  style={{ background: "rgba(10,60,110,0.25)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(14,122,181,0.18)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Ico size={20} className="text-white/70" />
                  </div>
                  <p className="text-white/35 text-[10px] uppercase tracking-[0.25em] font-sans">{label}</p>
                  <p className="font-display font-bold text-xl text-white">{value}</p>
                  <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest font-sans">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <OceanDivider flip />

        {/* ── How to Buy ─────────────────────────────────────────────────── */}
        <section id="how-to-buy" className="py-14 relative z-10 px-6"
          style={{ background: "rgba(4,18,45,0.95)" }}>
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto">
            <SectionHeading icon={Compass} title="Chart the Course" sub="How to Acquire $BOB" />
            <div className="space-y-3">
              {[
                { icon: JellyfishIcon, step: "I", title: "Secure a TON Wallet", desc: "Download Tonkeeper to hold your assets." },
                { icon: Droplets, step: "II", title: "Acquire TON", desc: "Purchase TON on any major exchange." },
                { icon: Fish, step: "III", title: "Navigate to a DEX", desc: "Swim to Ston.fi or Dedust." },
                { icon: TridentIcon, step: "IV", title: "Claim $BOB", desc: "Paste the contract address and execute the swap." },
              ].map(({ icon: Ico, step, title, desc }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: "rgba(10,60,110,0.2)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)" }}
                  data-testid={`step-${i + 1}`}>
                  <div className="w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5"
                    style={{ background: "rgba(7,30,56,0.9)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <Ico size={18} className="text-white/60" />
                    <span className="font-display text-[9px] text-white/30 tracking-widest">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-white tracking-wide">{title}</h3>
                    <p className="text-white/45 text-xs mt-0.5 font-sans leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <OceanDivider />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer id="community" className="relative z-10 py-12 px-6 text-center"
          style={{ background: "rgba(2,8,22,0.99)" }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="max-w-lg mx-auto">
            <motion.img src="/bob-nobg.png" alt="Bob" className="w-20 h-20 mx-auto mb-5 object-contain"
              style={{ filter: "drop-shadow(0 8px 24px rgba(255,140,0,0.4))" }}
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.12)" }} />
              <SeaStarIcon size={14} className="text-white/25" />
              <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>
            <h3 className="font-display font-bold text-2xl mb-1.5 text-white tracking-[0.15em] uppercase">Join the Current</h3>
            <p className="text-white/35 mb-7 text-xs font-sans tracking-[0.2em] uppercase">Ride the wave or miss the tide</p>

            <div className="flex justify-center gap-3 mb-8">
              <Button size="lg" className="h-11 px-7 rounded-full font-display font-semibold text-white text-xs tracking-[0.15em] uppercase"
                style={{ background: "rgba(10,70,130,0.9)", border: "1px solid rgba(255,255,255,0.15)" }} data-testid="button-telegram">
                <Send className="mr-2" size={14} /> Telegram
              </Button>
              <Button size="lg" className="h-11 px-7 rounded-full font-display font-semibold text-white text-xs tracking-[0.15em] uppercase"
                style={{ background: "rgba(7,30,56,0.9)", border: "1px solid rgba(255,255,255,0.12)" }} data-testid="button-buy-footer">
                <TridentIcon size={14} className="mr-2" /> Buy $BOB
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-6">
              {[Anchor, CoralIcon, WheelIcon, JellyfishIcon, SeaStarIcon].map((Ico, i) => (
                <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Ico size={13} className="text-white/25" />
                </div>
              ))}
            </div>

            <p className="text-white/18 text-[10px] font-sans leading-relaxed max-w-sm mx-auto">
              $BOB is a meme coin with no intrinsic value or expectation of financial return. The ocean is deep and unpredictable. Trade responsibly.
            </p>
            <p className="text-white/10 text-[10px] mt-3 font-sans tracking-widest">
              © {new Date().getFullYear()} BOB THE JELLYFISH — ALL VIBES RESERVED
            </p>
          </motion.div>
        </footer>
      </motion.div>
    </>
  );
}
