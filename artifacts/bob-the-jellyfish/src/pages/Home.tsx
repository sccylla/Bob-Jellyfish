import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationControls, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { Fish, Anchor, Waves, Droplets, Shell, Compass, Volume2, VolumeX, ArrowRight, Send, Copy, Check } from "lucide-react";
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
      // Square video — center Bob on the pointer
      const S = hovering.current ? 52 : 42;
      const tx = pos.current.x - S / 2;
      const ty = pos.current.y - S / 2;
      if (jellyRef.current) {
        jellyRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        jellyRef.current.style.width  = `${S}px`;
        jellyRef.current.style.height = `${S}px`;
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
      {/* Bob the jellyfish video cursor */}
      <div ref={jellyRef} className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block" style={{ willChange: "transform" }}>
        <video
          src="/bob-cursor.mp4"
          autoPlay loop muted playsInline
          className="w-full h-full object-contain"
          style={{ display: "block", mixBlendMode: "screen" }}
        />
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
// Strategy:
//   • After loading: create AudioContext + build audio graph immediately.
//     Chrome/Firefox/Android start playing right away.
//     iOS Safari creates a suspended ctx (audio is scheduled but paused).
//   • Gesture listeners (touchstart/click etc.) call ctx.resume() to unpause iOS.
//   • Toggle button: handles both "not started" and "started but suspended" cases.
function useOceanSound() {
  const [playing, setPlaying] = useState(false);
  const ctxRef    = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef   = useRef<GainNode | null>(null);

  // Build the audio graph on the given ctx.
  // Works even if ctx is suspended — audio will play once ctx resumes.
  const buildGraph = useCallback((ctx: AudioContext) => {
    if (gainRef.current) return; // already built
    const sampleRate = ctx.sampleRate;
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
    src.buffer = buf; src.loop = true;

    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass"; lpf.frequency.value = 350; lpf.Q.value = 0.8;

    const peaking = ctx.createBiquadFilter();
    peaking.type = "peaking"; peaking.frequency.value = 80; peaking.gain.value = 8;

    const lfo = ctx.createOscillator();
    lfo.type = "sine"; lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain); lfoGain.connect(lpf.frequency); lfo.start();

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    src.connect(lpf); lpf.connect(peaking); peaking.connect(gain); gain.connect(ctx.destination);
    src.start(); sourceRef.current = src;
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 2);

    // Mark as playing now (Chrome) or when ctx resumes (iOS)
    if (ctx.state === 'running') {
      setPlaying(true);
    } else {
      const onStateChange = () => {
        if (ctx.state === 'running') { setPlaying(true); ctx.removeEventListener('statechange', onStateChange); }
      };
      ctx.addEventListener('statechange', onStateChange);
    }
  }, []);

  // Create ctx + build graph. Chrome: plays immediately. iOS: suspended until gesture.
  const tryAutoplay = useCallback(() => {
    if (gainRef.current) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioCtx();
    }
    const ctx = ctxRef.current;
    ctx.resume().catch(() => {}); // no-op on iOS without gesture; works on Chrome
    buildGraph(ctx);
  }, [buildGraph]);

  // Called from a gesture handler (touchstart/click) — resumes suspended ctx on iOS.
  // Also creates ctx if none exists (e.g. user taps before loading ends).
  const resumeFromGesture = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      tryAutoplay();
      return;
    }
    const ctx = ctxRef.current;
    ctx.resume().catch(() => {});    // key: this IS inside a gesture → iOS unlocks
    if (!gainRef.current) buildGraph(ctx); // build graph if tryAutoplay was skipped
  }, [tryAutoplay, buildGraph]);

  const toggle = useCallback(() => {
    if (!playing) {
      // toggle is always a button click = gesture → resumeFromGesture handles iOS
      resumeFromGesture();
    } else {
      const gain = gainRef.current;
      const ctx  = ctxRef.current;
      if (gain && ctx) {
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => {
          try { sourceRef.current?.stop(); } catch {}
          try { if (ctx.state !== 'closed') ctx.close().catch(() => {}); } catch {}
          ctxRef.current = gainRef.current = sourceRef.current = null;
        }, 1100);
      }
      setPlaying(false);
    }
  }, [playing, resumeFromGesture]);

  useEffect(() => () => {
    try { sourceRef.current?.stop(); } catch {}
    try { const c = ctxRef.current; if (c && c.state !== 'closed') c.close().catch(() => {}); } catch {}
  }, []);

  return { playing, toggle, tryAutoplay, resumeFromGesture };
}

// ─── Loading Screen ───────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  // Wake bubbles — emitted along the walk path as Bob passes
  const [wake, setWake] = useState<{ id: number; xVw: number; size: number; drift: number }[]>([]);
  const wakeRef = useRef(0);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

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

    const reveal = setTimeout(() => setReady(true), 3200);
    return () => { timers.forEach(clearTimeout); clearTimeout(reveal); };
  }, [onDone]);

  return (
    <motion.div className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #0a3a6a 0%, #030d1e 60%, #000408 100%)", cursor: ready ? "pointer" : "default" }}
      onClick={() => { if (ready) onDone(); }}
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

        {/* Tap to dive in — entry gate (the tap unlocks ambient sound) */}
        <AnimatePresence>
          {ready && (
            <motion.button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDone(); }}
              className="pointer-events-auto mt-10 px-9 py-3.5 rounded-full font-display font-bold tracking-[0.22em] uppercase text-sm text-white"
              style={{
                background: "linear-gradient(90deg, rgba(0,180,255,0.92) 0%, rgba(0,150,220,0.92) 55%, rgba(255,140,26,0.92) 100%)",
                boxShadow: "0 0 34px rgba(0,200,255,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: reduce ? 0 : [0, -6, 0], filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ opacity: { duration: 0.6 }, filter: { duration: 0.6 }, ...(reduce ? {} : { y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}>
              🪼 Tap to dive in
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sound hint */}
        <AnimatePresence>
          {ready && (
            <motion.p className="pointer-events-none font-sans text-white/35 tracking-[0.3em] uppercase text-[10px] mt-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              🔊 sound on
            </motion.p>
          )}
        </AnimatePresence>
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
function AliveBob({ className = "" }: { className?: string }) {
  const glowCtrl = useAnimationControls();
  useEffect(() => {
    (async () => { for (;;) { await glowCtrl.start({ scale: 1.12, opacity: 0.55, transition: { duration: 2.5, ease: "easeInOut" } }); await glowCtrl.start({ scale: 1, opacity: 0.3, transition: { duration: 2.5, ease: "easeInOut" } }); } })();
  }, [glowCtrl]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ aspectRatio: "1" }}>
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
        animate={{ x: [0, 12, -10, 7, 0], y: [0, -18, -4, -20, 0], rotate: [-1.5, 1.5, -2, 1, -1.5] }}
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
    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl"
      style={{ background: "linear-gradient(135deg, #00e5ff 0%, #ffffff 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 24px rgba(0,220,255,0.4))" }}>{title}</h2>
    {sub && <p className="text-cyan-400/70 font-sans text-sm tracking-[0.3em] uppercase mt-1">{sub}</p>}
  </div>
);

// ─── Project Links & Contract ─────────────────────────────────────────────────
const CONTRACT_ADDRESS = "EQAYzcxoD397mkyG6aUsqNV0VurLVxzkMUEeBF6_OxPRKNn2";
const X_URL  = "https://x.com/JellyfishBobTON";
const TG_URL = "https://t.me/Bob_theJellyfish";
const BUY_URL = `https://app.ston.fi/swap?ft=TON&tt=${CONTRACT_ADDRESS}`;
const TONSCAN_URL = `https://tonscan.org/address/${CONTRACT_ADDRESS}`;

// ─── Copyable Contract Address ─────────────────────────────────────────────────
function ContractAddress({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CONTRACT_ADDRESS; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} data-testid="button-copy-contract"
      className={`group flex items-center gap-2 sm:gap-3 rounded-full pl-4 pr-3 py-2 transition-all hover:scale-[1.02] max-w-full ${className}`}
      style={{ background: "rgba(7,30,56,0.85)", border: "1px solid rgba(0,212,255,0.3)", boxShadow: "0 0 18px rgba(0,200,255,0.12)" }}>
      <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-cyan-400/70 shrink-0 hidden sm:inline">CA</span>
      <span className="font-mono text-[11px] sm:text-xs text-cyan-100/90 truncate">{CONTRACT_ADDRESS}</span>
      <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: copied ? "rgba(0,220,150,0.2)" : "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}>
        {copied ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} className="text-cyan-300" />}
      </span>
    </button>
  );
}

// ─── Cinematic Scroll Reveal ───────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
function Reveal({
  children, className = "", y = 44, delay = 0, duration = 0.85, amount = 0.25,
}: {
  children: React.ReactNode; className?: string; y?: number; delay?: number; duration?: number; amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(10px)" }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.3 : duration, delay: reduce ? 0 : delay, ease: EASE_OUT }}>
      {children}
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { playing, toggle: toggleSound, tryAutoplay, resumeFromGesture } = useOceanSound();

  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const raysY = useTransform(scrollY, [0, 800], [0, -120]);
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  // ── After loading: try autoplay (Chrome/Firefox/Android play; iOS suspends)
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(tryAutoplay, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // ── Start sound on the very first user interaction of ANY kind.
  // Browsers block audio autoplay without a gesture, so we listen broadly
  // (mouse move, scroll, click, touch, key) — one fires almost immediately.
  useEffect(() => {
    let fired = false;
    const EVENTS = ["pointerdown", "mousedown", "mousemove", "touchstart", "touchend", "wheel", "scroll", "keydown"] as const;
    const onGesture = () => {
      if (fired) return;
      fired = true;
      EVENTS.forEach(ev => window.removeEventListener(ev, onGesture));
      resumeFromGesture(); // creates/resumes ctx inside the gesture → unlocks audio everywhere
    };
    EVENTS.forEach(ev => window.addEventListener(ev, onGesture, { passive: true }));
    return () => EVENTS.forEach(ev => window.removeEventListener(ev, onGesture));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <JellyfishCursor />
      <WaterRipples />
      <AnimatePresence>{!loaded && <LoadingScreen onDone={() => { resumeFromGesture(); setLoaded(true); }} />}</AnimatePresence>

      <motion.div className="relative text-white overflow-x-hidden"
        style={{ background: "linear-gradient(180deg, #071e38 0%, #0a3c6a 20%, #0b5a95 45%, #083470 70%, #041830 100%)" }}
        initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.8 }}>

        {/* ── Scroll progress indicator ── */}
        <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
          style={{ scaleX: progressScale, background: "linear-gradient(90deg, #00d4ff 0%, #00e5ff 45%, #ff8c1a 100%)", boxShadow: "0 0 12px rgba(0,200,255,0.6)" }} />

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
        <nav className="fixed top-0 w-full z-50 py-2.5 px-3 sm:px-5 md:px-10 flex items-center justify-between gap-2"
          style={{ background: "rgba(5,20,45,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <img src="/bob-nobg.png" alt="Bob" className="w-9 h-9 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.5))" }} />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-2xl text-white leading-none">Bob the Jellyfish</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-display text-lg text-white/70">
            {[["Depths", "#tokenomics"], ["How to Buy", "#how-to-buy"], ["Community", "#community"]].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button onClick={toggleSound}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 shrink-0"
              style={{ background: playing ? "rgba(14,122,181,0.4)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)" }}
              title={playing ? "Mute ocean" : "Play ocean ambience"}
              data-testid="button-sound">
              {playing ? <Volume2 size={14} className="text-[#00bfff]" /> : <VolumeX size={14} className="text-white/50" />}
            </button>
            <a href={BUY_URL} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-3 sm:px-5 h-8 sm:h-9 font-display text-white text-xs sm:text-sm whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #ff8c1a, #e05a00)", border: "none", boxShadow: "0 3px 0 rgba(0,0,0,0.3)" }}
                data-testid="button-buy-nav">
                Buy $BOB
              </Button>
            </a>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-20 pt-20 pb-8 lg:pt-0 lg:pb-0 lg:min-h-screen lg:flex lg:items-center">
          <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-0 lg:py-24">

            {/* Text — bottom on mobile, left on desktop */}
            <motion.div className="relative z-10 flex flex-col items-center lg:items-start gap-4 w-full lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}>

              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.25)" }} />
                <span className="font-sans text-[10px] tracking-[0.4em] text-white/50 uppercase">The TON Ocean</span>
                <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.25)" }} />
              </div>

              <div className="leading-none">
                <h1 className="font-display leading-none"
                  style={{ fontSize: "clamp(5rem,16vw,16rem)",
                    background: "linear-gradient(160deg, #ffffff 0%, #a8f0ff 50%, #00d4ff 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 4px 0 rgba(0,0,0,0.4)) drop-shadow(0 0 40px rgba(0,200,255,0.5))" }}>
                  BOB
                </h1>
                <h2 className="font-display leading-none"
                  style={{ fontSize: "clamp(1.8rem,6vw,6.5rem)", marginTop: "-0.05em",
                    color: "#ff9a3c",
                    textShadow: "0 3px 0 rgba(0,0,0,0.5), 0 0 30px rgba(255,140,50,0.4)" }}>
                  The Jellyfish
                </h2>
              </div>

              <p className="font-sans text-cyan-100/75 leading-relaxed max-w-xs text-sm sm:text-base">
                Drifting through the currents of TON.<br />
                Bioluminescent. Uncontrollable. Inevitable.
              </p>

              <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                <a href={BUY_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full font-display text-white text-lg sm:text-xl"
                    style={{ background: "linear-gradient(135deg, #ff8c1a 0%, #e05a00 100%)", border: "none", boxShadow: "0 5px 0 rgba(0,0,0,0.35), 0 0 28px rgba(255,140,0,0.35)" }}
                    data-testid="button-buy-hero">
                    <TridentIcon size={17} className="mr-2 shrink-0" /> Acquire $BOB
                  </Button>
                </a>
                <Button size="lg" variant="outline"
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-full font-display text-lg sm:text-xl text-cyan-300 hover:text-white"
                  style={{ border: "2px solid #00d4ff", background: "rgba(0,212,255,0.08)", boxShadow: "0 0 18px rgba(0,200,255,0.2)" }}
                  data-testid="button-learn-more">
                  <NautilusIcon size={17} className="mr-2 shrink-0" /> Explore
                </Button>
              </div>

              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                {[{ icon: Send, label: "Telegram", href: TG_URL }, { icon: WheelIcon, label: "Twitter", href: X_URL }, { icon: Anchor, label: "TON", href: TONSCAN_URL }].map(({ icon: Ico, label, href }, i) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-testid={`social-${label.toLowerCase()}`}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(7,30,56,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <Ico size={14} className="text-white/60" />
                  </a>
                ))}
              </div>

              <ContractAddress className="mt-1 w-full sm:w-auto" />
            </motion.div>

            {/* Bob — top on mobile, right on desktop. Swims in from the left. */}
            <motion.div className="relative z-10 flex items-center justify-center w-full lg:w-1/2"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -200, y: 30, rotate: -12, scale: 0.78 }}
              animate={loaded
                ? (reduce
                    ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                    : { opacity: 1, x: 0, y: [30, -18, 6, 0], rotate: [-12, 6, -3, 0], scale: 1 })
                : (reduce ? { opacity: 0 } : { opacity: 0, x: -200, scale: 0.78 })}
              transition={{ duration: reduce ? 0.5 : 1.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
              <AliveBob className="w-[min(260px,68vw)] sm:w-[min(340px,60vw)] lg:w-[min(460px,46vw)]" />
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hidden lg:flex"
            animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <Waves size={15} />
            <span className="text-[8px] tracking-[0.4em] uppercase font-sans">Dive In</span>
          </motion.div>
        </section>

        <WaveDivider color="rgba(3,14,38,0.95)" />

        {/* ── Tokenomics ─────────────────────────────────────────────────── */}
        <section id="tokenomics" className="py-10 relative z-10 px-5 sm:px-8"
          style={{ background: "rgba(3,14,38,0.95)" }}>
          <Reveal className="max-w-4xl mx-auto">
            <SectionHeading icon={NautilusIcon} title="Depths of $BOB" sub="Token Distribution" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: Droplets, label: "Total Supply", value: "1 Billion", sub: "$BOB" },
                { icon: CoralIcon, label: "Liquidity", value: "Burned", sub: "Forever Locked" },
                { icon: TridentIcon, label: "Taxes", value: "0 / 0", sub: "Zero Tax" },
                { icon: SeaStarIcon, label: "Contract", value: "Renounced", sub: "Fully Safe" },
              ].map(({ icon: Ico, label, value, sub }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_OUT }} whileHover={{ y: -6, transition: { duration: 0.18 } }}
                  className="rounded-2xl p-5 flex flex-col items-center gap-2 text-center"
                  style={{ background: "rgba(10,60,110,0.28)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(14px)" }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(0,180,255,0.35), rgba(0,100,200,0.2))", border: "1.5px solid rgba(0,212,255,0.35)" }}>
                    <Ico size={19} className="text-cyan-300" />
                  </div>
                  <p className="text-cyan-400/60 text-[10px] uppercase tracking-[0.2em] font-sans">{label}</p>
                  <p className="font-display text-2xl sm:text-3xl" style={{ color: "#00e5ff", textShadow: "0 0 12px rgba(0,220,255,0.4)" }}>{value}</p>
                  <p className="text-orange-300/80 text-xs font-bold uppercase tracking-widest font-sans">{sub}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </section>

        <WaveDivider flip color="rgba(4,18,45,0.97)" />

        {/* ── How to Buy ─────────────────────────────────────────────────── */}
        <section id="how-to-buy" className="py-10 relative z-10 px-5 sm:px-8"
          style={{ background: "rgba(4,18,45,0.97)" }}>
          <Reveal className="max-w-2xl mx-auto">
            <SectionHeading icon={Compass} title="Chart the Course" sub="How to Acquire $BOB" />
            <div className="space-y-2.5">
              {[
                { icon: JellyfishIcon, step: "I",  title: "Secure a TON Wallet", desc: "Download Tonkeeper to hold your assets." },
                { icon: Droplets,      step: "II", title: "Acquire TON",          desc: "Purchase TON on any major exchange." },
                { icon: Fish,          step: "III",title: "Navigate to a DEX",    desc: "Swim to Ston.fi or Dedust." },
                { icon: TridentIcon,   step: "IV", title: "Claim $BOB",           desc: "Paste the contract address and execute the swap." },
              ].map(({ icon: Ico, step, title, desc }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -36, filter: "blur(6px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: EASE_OUT }}
                  className="rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                  style={{ background: "rgba(10,60,110,0.22)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}
                  data-testid={`step-${i + 1}`}>
                  <div className="w-12 h-12 shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5 p-2.5"
                    style={{ background: "linear-gradient(135deg, #ff8c1a22, #ff6a0011)", border: "1.5px solid rgba(255,140,30,0.4)" }}>
                    <Ico size={18} className="text-orange-300" />
                    <span className="font-display text-[11px] text-orange-400/70">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-white">{title}</h3>
                    <p className="text-cyan-100/60 text-sm sm:text-base font-sans leading-snug">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </section>

        <WaveDivider color="rgba(2,8,22,0.99)" />

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <footer id="community" className="relative z-10 py-10 px-5 sm:px-8 text-center"
          style={{ background: "rgba(2,8,22,0.99)" }}>
          <Reveal className="max-w-lg mx-auto" y={50} duration={0.95} amount={0.2}>
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

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <a href={TG_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-12 px-7 rounded-full font-display text-white text-lg sm:text-xl"
                  style={{ background: "linear-gradient(135deg, #ff8c1a 0%, #e05a00 100%)", border: "none", boxShadow: "0 5px 0 rgba(0,0,0,0.3), 0 0 24px rgba(255,140,0,0.3)" }} data-testid="button-telegram">
                  <Send className="mr-2" size={16} /> Telegram
                </Button>
              </a>
              <a href={BUY_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="h-12 px-7 rounded-full font-display text-cyan-300 text-lg sm:text-xl"
                  style={{ background: "rgba(0,212,255,0.08)", border: "2px solid #00d4ff", boxShadow: "0 0 18px rgba(0,200,255,0.2)" }} data-testid="button-buy-footer">
                  <TridentIcon size={16} className="mr-2" /> Buy $BOB
                </Button>
              </a>
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
          </Reveal>
        </footer>
      </motion.div>
    </>
  );
}
