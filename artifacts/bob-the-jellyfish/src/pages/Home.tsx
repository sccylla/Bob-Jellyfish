import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls, useScroll, useTransform } from "framer-motion";
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

// ─── Jellyfish Cursor ─────────────────────────────────────────────────────────
function JellyfishCursor() {
  const jellyRef = useRef<HTMLDivElement>(null);
  const glowRef  = useRef<HTMLDivElement>(null);
  const mouse    = useRef({ x: -300, y: -300 });
  const pos      = useRef({ x: -300, y: -300 });
  const hovering = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      hovering.current = !!el?.closest('a, button, [role="button"], input, textarea, select');
    };
    let raf: number;
    const loop = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.24;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.24;
      // Hotspot = top-center of dome, offset SVG so tip aligns with cursor
      const W = hovering.current ? 58 : 48;
      const H = hovering.current ? 78 : 65;
      // top of dome sits at ~7% of height
      const tx = pos.current.x - W / 2;
      const ty = pos.current.y - H * 0.08;
      if (jellyRef.current) {
        jellyRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        jellyRef.current.style.width  = `${W}px`;
        jellyRef.current.style.height = `${H}px`;
        jellyRef.current.style.filter = hovering.current
          ? "drop-shadow(0 0 10px rgba(255,160,0,0.7)) drop-shadow(0 0 20px rgba(255,100,0,0.4))"
          : "drop-shadow(0 0 8px rgba(0,200,255,0.7)) drop-shadow(0 0 18px rgba(0,150,255,0.35))";
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${pos.current.x - 80}px, ${pos.current.y - 80}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <>
      {/* Cursor glow aura */}
      <div ref={glowRef} className="fixed top-0 left-0 w-40 h-40 rounded-full pointer-events-none z-[9997] hidden md:block"
        style={{ background: "radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)" }} />
      {/* Jellyfish SVG cursor */}
      <div ref={jellyRef} className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block" style={{ willChange: "transform" }}>
        <svg viewBox="0 0 60 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cDome" cx="38%" cy="30%" r="65%">
              <stop offset="0%" stopColor="rgba(200,245,255,0.75)" />
              <stop offset="100%" stopColor="rgba(0,160,230,0.38)" />
            </radialGradient>
            <radialGradient id="cGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(100,220,255,0.18)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Outer glow blob */}
          <ellipse cx="30" cy="28" rx="26" ry="22" fill="url(#cGlow)" />

          {/* Dome body */}
          <path d="M8 30 Q8 6 30 5 Q52 6 52 30 Q52 40 30 44 Q8 40 8 30 Z"
            fill="url(#cDome)" stroke="rgba(0,210,255,0.85)" strokeWidth="1.8" />

          {/* Sheen highlight */}
          <ellipse cx="18" cy="16" rx="8" ry="6"
            fill="rgba(255,255,255,0.28)" transform="rotate(-18,18,16)" />

          {/* Spots */}
          <circle cx="36" cy="14" r="3" fill="rgba(180,240,255,0.25)" />
          <circle cx="40" cy="22" r="2" fill="rgba(180,240,255,0.2)" />

          {/* Eyes — big cartoon whites */}
          <circle cx="20" cy="25" r="5.5" fill="white" opacity="0.96" />
          <circle cx="40" cy="25" r="5.5" fill="white" opacity="0.96" />
          {/* Pupils */}
          <circle cx="21.5" cy="26" r="3.2" fill="rgba(10,20,80,0.88)" />
          <circle cx="41.5" cy="26" r="3.2" fill="rgba(10,20,80,0.88)" />
          {/* Eye shines */}
          <circle cx="22.8" cy="24.2" r="1.2" fill="white" />
          <circle cx="42.8" cy="24.2" r="1.2" fill="white" />

          {/* Smile */}
          <path d="M22 33 Q30 39 38 33"
            stroke="rgba(0,90,180,0.65)" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Bell scallop edge */}
          <path d="M8 40 Q13 45 18 40 Q23 35 28 40 Q33 45 38 40 Q43 35 48 40 Q51 43 52 40"
            stroke="rgba(0,200,255,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Tentacles with animation */}
          <g stroke="rgba(0,200,255,0.75)" fill="none" strokeLinecap="round">
            <path d="M12 43 Q9 54 12 65"  strokeWidth="2.2">
              <animateTransform attributeName="transform" type="rotate" values="0 12 43;4 12 43;0 12 43;-4 12 43;0 12 43" dur="2.1s" repeatCount="indefinite" />
            </path>
            <path d="M20 45 Q17 57 20 68" strokeWidth="1.8">
              <animateTransform attributeName="transform" type="rotate" values="0 20 45;-3 20 45;0 20 45;3 20 45;0 20 45" dur="2.4s" repeatCount="indefinite" />
            </path>
            <path d="M30 46 Q30 58 30 70" strokeWidth="2.2">
              <animateTransform attributeName="transform" type="rotate" values="0 30 46;2 30 46;0 30 46;-2 30 46;0 30 46" dur="1.9s" repeatCount="indefinite" />
            </path>
            <path d="M40 45 Q43 57 40 68" strokeWidth="1.8">
              <animateTransform attributeName="transform" type="rotate" values="0 40 45;3 40 45;0 40 45;-3 40 45;0 40 45" dur="2.3s" repeatCount="indefinite" />
            </path>
            <path d="M48 43 Q51 54 48 65" strokeWidth="2.2">
              <animateTransform attributeName="transform" type="rotate" values="0 48 43;-4 48 43;0 48 43;4 48 43;0 48 43" dur="2.0s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Dome breathe animation */}
          <animateTransform attributeName="transform" type="scale" values="1 1;1.02 0.98;1 1;0.98 1.02;1 1"
            dur="3s" repeatCount="indefinite" additive="sum" />
        </svg>
      </div>
    </>
  );
}

// ─── Mouse-reactive Water Ripples ─────────────────────────────────────────────
function WaterRipples() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const counter   = useRef(0);
  const lastPos   = useRef({ x: 0, y: 0 });
  const lastTime  = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (now - lastTime.current > 180 && dist > 25) {
        lastTime.current = now;
        lastPos.current = { x: e.clientX, y: e.clientY };
        const id = counter.current++;
        setRipples(p => [...p.slice(-10), { id, x: e.clientX, y: e.clientY }]);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden hidden md:block">
      {ripples.map(r => (
        <motion.div key={r.id} className="absolute rounded-full"
          style={{ left: r.x, top: r.y, x: "-50%", y: "-50%",
            border: "1px solid rgba(0,210,255,0.35)",
            boxShadow: "0 0 8px rgba(0,200,255,0.12)" }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 140, height: 140, opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }} />
      ))}
    </div>
  );
}

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
    // Resume immediately — required on mobile Safari and suspended desktop contexts
    ctx.resume().catch(() => {});
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

  const resume = useCallback(() => {
    ctxRef.current?.resume().catch(() => {});
  }, []);

  useEffect(() => () => {
    try { sourceRef.current?.stop(); } catch {}
    try {
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {});
    } catch {}
  }, []);
  return { playing, toggle, resume };
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

// ─── Animated Wave Divider ─────────────────────────────────────────────────────
const WaveDivider = ({ flip = false, color = "rgba(3,14,38,0.95)" }: { flip?: boolean; color?: string }) => (
  <div className="relative z-10 overflow-hidden" style={{ height: 80, marginTop: flip ? -2 : 0, marginBottom: flip ? 0 : -2 }}>
    <motion.div
      className="absolute inset-0 flex"
      style={{ width: "200%", top: 0, bottom: 0 }}
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>
      {[0, 1].map(k => (
        <svg key={k} viewBox="0 0 1440 80" preserveAspectRatio="none" className="flex-1 h-full"
          style={{ transform: flip ? "scaleY(-1)" : "none", transformOrigin: "center" }}>
          <path d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 C840,80 960,0 1080,40 C1200,80 1320,0 1440,40 L1440,80 L0,80 Z"
            fill={color} />
          <path d="M0,55 C180,75 360,35 540,55 C720,75 900,35 1080,55 C1260,75 1380,45 1440,55 L1440,80 L0,80 Z"
            fill={color} opacity="0.6" />
        </svg>
      ))}
    </motion.div>
  </div>
);

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, sub }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; sub?: string }) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
      <Icon size={18} className="text-white/40" />
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
    </div>
    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white"
      style={{ textShadow: "0 0 40px rgba(14,122,181,0.5)" }}>{title}</h2>
    {sub && <p className="text-white/45 font-sans text-sm tracking-[0.3em] uppercase mt-1">{sub}</p>}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { playing, toggle: toggleSound, resume: resumeSound } = useOceanSound();
  const hasAutoStarted = useRef(false);

  const { scrollY } = useScroll();
  const raysY = useTransform(scrollY, [0, 800], [0, -120]);

  // Auto-play ocean sound — start on first user interaction (required by all browsers)
  useEffect(() => {
    if (!loaded) return;
    // Use closure-local flag so this effect runs once with playing=false captured
    let triggered = false;

    const onInteraction = () => {
      if (triggered) return;
      triggered = true;
      // playing is always false here (first render after loaded=true)
      toggleSound(); // creates AudioContext inside a user-gesture callstack → works on all devices
    };

    const events = ["click", "touchstart", "scroll", "keydown"] as const;
    events.forEach(ev => document.addEventListener(ev, onInteraction, { once: true, passive: true }));

    // Immediate attempt — works on Chrome/Firefox desktop that allow autoplay
    const t = setTimeout(() => {
      if (!triggered) {
        triggered = true;
        try { toggleSound(); } catch {}
      }
    }, 400);

    return () => {
      clearTimeout(t);
      events.forEach(ev => document.removeEventListener(ev, onInteraction));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]); // intentional: capture playing=false, toggleSound stable ref

  return (
    <>
      <JellyfishCursor />
      <WaterRipples />
      <AnimatePresence>{!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div className="relative text-white overflow-x-hidden"
        style={{ background: "linear-gradient(180deg, #071e38 0%, #0a3c6a 20%, #0b5a95 45%, #083470 70%, #041830 100%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.8 }}>

        {/* ── Caustic underwater light shimmer (boosted opacity) ── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="caustic-layer-a absolute inset-0"
            style={{ background: "radial-gradient(ellipse 500px 380px at 20% 30%, rgba(0,160,255,0.13) 0%, transparent 70%)" }} />
          <div className="caustic-layer-b absolute inset-0"
            style={{ background: "radial-gradient(ellipse 420px 550px at 78% 18%, rgba(0,210,255,0.1) 0%, transparent 70%)" }} />
          <div className="caustic-layer-c absolute inset-0"
            style={{ background: "radial-gradient(ellipse 600px 300px at 50% 75%, rgba(0,130,230,0.1) 0%, transparent 70%)" }} />
          {/* Extra shimmer layer */}
          <div className="caustic-layer-a absolute inset-0"
            style={{ background: "radial-gradient(ellipse 300px 400px at 60% 50%, rgba(0,180,255,0.07) 0%, transparent 70%)", animationDelay: "-4s", animationDuration: "16s" }} />
        </div>

        {/* ── Animated water surface shimmer at page top ── */}
        <div className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-[1] overflow-hidden">
          <motion.div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,180,255,0.12) 0%, rgba(0,120,200,0.06) 50%, transparent 100%)" }}
            animate={{ opacity: [0.6, 1, 0.6], scaleX: [1, 1.02, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(120,220,255,0.08) 0%, transparent 60%)" }}
            animate={{ opacity: [1, 0.4, 1], x: ["0%", "2%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} />
        </div>

        <motion.div style={{ y: raysY }} className="pointer-events-none">
          <GodRays />
        </motion.div>
        <Bubbles />
        <SwimmingFish />
        <OceanFloor />

        {/* ── Navbar ─────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 w-full z-50 py-2.5 px-4 md:px-10 flex items-center justify-between"
          style={{ background: "rgba(5,20,45,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <img src="/bob-nobg.png" alt="Bob" className="w-9 h-9 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.5))" }} />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-2xl text-white leading-none">Bob the Jellyfish</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-display text-xl text-white/70">
            {[["Depths", "#tokenomics"], ["How to Buy", "#how-to-buy"], ["Community", "#community"]].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleSound}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ background: playing ? "rgba(14,122,181,0.4)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
              title={playing ? "Mute ocean" : "Play ocean ambience"}
              data-testid="button-sound">
              {playing ? <Volume2 size={15} className="text-[#00bfff]" /> : <VolumeX size={15} className="text-white/50" />}
            </button>
            <Button className="rounded-full px-5 h-9 font-display text-white text-sm"
              style={{ background: "linear-gradient(135deg, #0a4a8a, #0a2050)", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 0 20px rgba(14,100,180,0.3)" }}
              data-testid="button-buy-nav">
              Buy $BOB
            </Button>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative flex items-center pt-14 pb-0 z-10 overflow-hidden px-5 sm:px-8 md:px-12 lg:px-20 min-h-[100svh]">
          <div className="w-full flex flex-col lg:flex-row items-center gap-4 lg:gap-0 py-8 lg:py-0">

            {/* Left */}
            <motion.div className="relative z-10 flex flex-col gap-4 lg:w-1/2"
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -40 }}
              transition={{ duration: 0.8, delay: 0.3 }}>

              <div className="flex items-center gap-2">
                <div className="h-px w-8" style={{ background: "rgba(255,255,255,0.25)" }} />
                <span className="font-sans text-[10px] tracking-[0.4em] text-white/50 uppercase">The TON Ocean</span>
              </div>

              <div className="leading-none">
                <h1 className="font-display leading-none"
                  style={{ fontSize: "clamp(6.5rem,20vw,16rem)", color: "#071e38",
                    WebkitTextStroke: "2px rgba(255,255,255,0.12)",
                    textShadow: "4px 8px 0 rgba(0,0,0,0.3), 0 0 80px rgba(14,122,181,0.25)" }}>
                  BOB
                </h1>
                <h2 className="font-display text-white leading-none"
                  style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)", marginTop: "-0.05em",
                    textShadow: "2px 4px 0 rgba(0,0,0,0.3)" }}>
                  The Jellyfish
                </h2>
              </div>

              <p className="font-sans text-white/70 leading-relaxed max-w-xs sm:max-w-sm text-base sm:text-lg">
                Drifting through the currents of TON.<br />
                Bioluminescent. Uncontrollable. Inevitable.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Button size="lg" className="h-14 px-8 rounded-full font-display text-white text-xl"
                  style={{ background: "linear-gradient(135deg, #0a4a8a 0%, #071e38 100%)", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(14,122,181,0.2)" }}
                  data-testid="button-buy-hero">
                  <TridentIcon size={18} className="mr-2 shrink-0" /> Acquire $BOB
                </Button>
                <Button size="lg" variant="outline"
                  className="h-14 px-8 rounded-full font-display text-xl text-white/80 border-white/20 hover:bg-white/5 hover:text-white"
                  data-testid="button-learn-more">
                  <NautilusIcon size={18} className="mr-2 shrink-0" /> Explore
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                {[{ icon: Send, label: "Telegram" }, { icon: WheelIcon, label: "Twitter" }, { icon: Anchor, label: "TON" }].map(({ icon: Ico, label }, i) => (
                  <button key={i} aria-label={label} data-testid={`social-${label.toLowerCase()}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(7,30,56,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Ico size={15} className="text-white/60" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right — Bob */}
            <motion.div className="relative z-10 flex items-center justify-center lg:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.8, x: 40 }} animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.8, x: loaded ? 0 : 40 }}
              transition={{ duration: 0.9, delay: 0.4 }}>
              <AliveBob />
            </motion.div>
          </div>

          {/* Scroll hint — pinned to bottom of section */}
          <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
            animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <Waves size={15} />
            <span className="text-[8px] tracking-[0.4em] uppercase font-sans">Dive In</span>
          </motion.div>
        </section>

        <WaveDivider color="rgba(3,14,38,0.95)" />

        {/* ── Tokenomics ─────────────────────────────────────────────────── */}
        <section id="tokenomics" className="py-10 relative z-10 px-5 sm:px-8"
          style={{ background: "rgba(3,14,38,0.95)" }}>
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
                  transition={{ delay: i * 0.09, duration: 0.45 }} whileHover={{ y: -6, transition: { duration: 0.18 } }}
                  className="rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
                  style={{ background: "rgba(10,60,110,0.28)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(14px)" }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(14,122,181,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Ico size={19} className="text-white/70" />
                  </div>
                  <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-sans">{label}</p>
                  <p className="font-display text-3xl text-white">{value}</p>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest font-sans">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <WaveDivider flip color="rgba(4,18,45,0.97)" />

        {/* ── How to Buy ─────────────────────────────────────────────────── */}
        <section id="how-to-buy" className="py-10 relative z-10 px-5 sm:px-8"
          style={{ background: "rgba(4,18,45,0.97)" }}>
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto">
            <SectionHeading icon={Compass} title="Chart the Course" sub="How to Acquire $BOB" />
            <div className="space-y-2.5">
              {[
                { icon: JellyfishIcon, step: "I",  title: "Secure a TON Wallet", desc: "Download Tonkeeper to hold your assets." },
                { icon: Droplets,      step: "II", title: "Acquire TON",          desc: "Purchase TON on any major exchange." },
                { icon: Fish,          step: "III",title: "Navigate to a DEX",    desc: "Swim to Ston.fi or Dedust." },
                { icon: TridentIcon,   step: "IV", title: "Claim $BOB",           desc: "Paste the contract address and execute the swap." },
              ].map(({ icon: Ico, step, title, desc }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{ background: "rgba(10,60,110,0.22)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
                  data-testid={`step-${i + 1}`}>
                  <div className="w-13 h-13 shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5 p-3"
                    style={{ background: "rgba(7,30,56,0.9)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <Ico size={18} className="text-white/60" />
                    <span className="font-display text-[11px] text-white/35">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white">{title}</h3>
                    <p className="text-white/55 text-base font-sans leading-snug">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <WaveDivider color="rgba(2,8,22,0.99)" />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer id="community" className="relative z-10 py-10 px-5 sm:px-8 text-center"
          style={{ background: "rgba(2,8,22,0.99)" }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="max-w-lg mx-auto">
            <motion.img src="/bob-nobg.png" alt="Bob" className="w-20 h-20 mx-auto mb-4 object-contain"
              style={{ filter: "drop-shadow(0 8px 24px rgba(255,140,0,0.4))" }}
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />

            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.12)" }} />
              <SeaStarIcon size={14} className="text-white/25" />
              <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>
            <h3 className="font-display text-5xl mb-1 text-white">Join the Current</h3>
            <p className="text-white/40 mb-5 text-sm font-sans tracking-[0.2em] uppercase">Ride the wave or miss the tide</p>

            <div className="flex justify-center gap-3 mb-6">
              <Button size="lg" className="h-13 px-7 rounded-full font-display text-white text-xl"
                style={{ background: "rgba(10,70,130,0.9)", border: "1px solid rgba(255,255,255,0.15)" }} data-testid="button-telegram">
                <Send className="mr-2" size={16} /> Telegram
              </Button>
              <Button size="lg" className="h-13 px-7 rounded-full font-display text-white text-xl"
                style={{ background: "rgba(7,30,56,0.9)", border: "1px solid rgba(255,255,255,0.12)" }} data-testid="button-buy-footer">
                <TridentIcon size={16} className="mr-2" /> Buy $BOB
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-5">
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
