import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Fish, Anchor, Waves, Droplets, ArrowRight, Send, Shell } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a6fa8 0%, #0e92cc 40%, #12a8d9 100%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* God rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[10, 25, 40, 58, 74, 88].map((left, i) => (
          <div key={i} className="absolute top-0 h-full opacity-10"
            style={{ left: `${left}%`, width: "60px", background: "linear-gradient(180deg, #fff 0%, transparent 70%)", transform: `skewX(${(i - 2.5) * 7}deg)` }} />
        ))}
      </div>
      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="animate-bubble absolute bottom-0"
            style={{ left: `${(i / 18) * 100}vw`, width: `${Math.random() * 22 + 8}px`, height: `${Math.random() * 22 + 8}px`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${Math.random() * 8 + 8}s` }} />
        ))}
      </div>
      {/* Seaweed */}
      <div className="absolute bottom-0 left-8 flex gap-5">
        {[100, 80, 120].map((h, i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${i * 0.4}s` }}>
            <svg width="28" height={h} viewBox={`0 0 28 ${h}`} fill="none">
              <path d={`M14 ${h} Q4 ${h * 0.8} 14 ${h * 0.6} Q24 ${h * 0.4} 14 ${h * 0.2} Q4 5 14 0`} stroke="#0d6b3a" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-8 flex gap-5">
        {[80, 110, 70].map((h, i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${i * 0.35 + 0.2}s` }}>
            <svg width="28" height={h} viewBox={`0 0 28 ${h}`} fill="none">
              <path d={`M14 ${h} Q24 ${h * 0.8} 14 ${h * 0.6} Q4 ${h * 0.4} 14 ${h * 0.2} Q24 5 14 0`} stroke="#0d6b3a" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0a5a8a]/60 to-transparent" />

      {/* Bob jumping */}
      <motion.div className="absolute" style={{ bottom: "18%", left: 0 }}
        animate={{ x: ["calc(-160px)", "calc(100vw + 160px)"] }}
        transition={{ duration: 3.2, ease: "linear", delay: 0.3 }}>
        <motion.div
          animate={{ y: [0, -130, 0, -110, 0, -100, 0, -80, 0, -60, 0] }}
          transition={{ duration: 3.2, delay: 0.3, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], ease: "easeInOut" }}>
          <motion.img src="/bob-nobg.png" alt="Bob"
            style={{ width: 130, height: 130, objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))" }}
            animate={{ rotate: [0, -10, 0, -10, 0, -10, 0, -10, 0, -10, 0] }}
            transition={{ duration: 3.2, delay: 0.3, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }} />
        </motion.div>
      </motion.div>

      <motion.div className="relative z-10 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="font-display font-black text-5xl md:text-7xl tracking-wider text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          BOB THE JELLYFISH
        </h1>
        <p className="mt-4 text-white/80 text-lg font-semibold tracking-widest uppercase font-display">diving in...</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Bob Bubbles (emanate from around Bob) ─────────────────────────────────────
function BobBubbles() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = counter.current++;
      setBubbles((prev) => [
        ...prev.slice(-12),
        { id, x: (Math.random() - 0.5) * 120, size: Math.random() * 10 + 5, delay: 0 },
      ]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full"
          style={{
            bottom: "10%",
            left: `calc(50% + ${b.x}px)`,
            width: b.size,
            height: b.size,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2))",
            boxShadow: "inset 0 0 4px rgba(255,255,255,0.6), 0 0 6px rgba(14,146,204,0.4)",
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: -280, opacity: [0, 0.9, 0.7, 0], scale: [0, 1, 1, 0.6], x: [0, b.x * 0.3, -b.x * 0.2, b.x * 0.1] }}
          transition={{ duration: 3.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Alive Bob Component ───────────────────────────────────────────────────────
function AliveBob() {
  const glowControls = useAnimationControls();

  useEffect(() => {
    const pulse = async () => {
      while (true) {
        await glowControls.start({ scale: 1.15, opacity: 0.5, transition: { duration: 2, ease: "easeInOut" } });
        await glowControls.start({ scale: 1, opacity: 0.3, transition: { duration: 2, ease: "easeInOut" } });
      }
    };
    pulse();
  }, [glowControls]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: "min(500px, 90vw)", height: "min(500px, 90vw)" }}>
      {/* Outer glow ring - teal */}
      <motion.div
        animate={glowControls}
        className="absolute rounded-full"
        style={{
          inset: "-12%",
          background: "radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,120,200,0.08) 60%, transparent 80%)",
          filter: "blur(18px)",
        }}
      />

      {/* Orange glow from Bob's body */}
      <motion.div
        className="absolute rounded-full"
        animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          inset: "10% 15% 30% 15%",
          background: "radial-gradient(circle, rgba(255,140,0,0.35) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Caustic light ripples */}
      <motion.div
        className="absolute rounded-full border border-white/10"
        animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
        style={{ inset: "20%", borderRadius: "50%" }}
      />
      <motion.div
        className="absolute rounded-full border border-white/8"
        animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.2 }}
        style={{ inset: "25%", borderRadius: "50%" }}
      />

      {/* Bob himself — alive! */}
      <motion.div
        className="relative z-10"
        style={{ width: "85%", height: "85%" }}
        animate={{
          y: [0, -18, -4, -20, 0],
          rotate: [-1.5, 1.5, -2, 1, -1.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Breathing wrapper */}
        <motion.div
          style={{ width: "100%", height: "100%" }}
          animate={{
            scaleX: [1, 1.04, 0.98, 1.05, 1],
            scaleY: [1, 0.97, 1.03, 0.96, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Brightness pulse = bioluminescent glow */}
          <motion.img
            src="/bob-nobg.png"
            alt="Bob The Jellyfish"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
            animate={{
              filter: [
                "drop-shadow(0 20px 40px rgba(255,140,0,0.4)) drop-shadow(0 0 30px rgba(0,212,255,0.2)) brightness(1)",
                "drop-shadow(0 24px 50px rgba(255,140,0,0.6)) drop-shadow(0 0 40px rgba(0,212,255,0.4)) brightness(1.08)",
                "drop-shadow(0 20px 40px rgba(255,140,0,0.4)) drop-shadow(0 0 30px rgba(0,212,255,0.2)) brightness(1)",
                "drop-shadow(0 22px 45px rgba(255,160,0,0.55)) drop-shadow(0 0 35px rgba(0,212,255,0.35)) brightness(1.05)",
                "drop-shadow(0 20px 40px rgba(255,140,0,0.4)) drop-shadow(0 0 30px rgba(0,212,255,0.2)) brightness(1)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Bubbles popping from below Bob */}
      <BobBubbles />
    </div>
  );
}

// ─── Swimming Fish ─────────────────────────────────────────────────────────────
const FISH_DATA = [
  { top: "22%", size: 30, duration: 18, delay: 2, direction: "ltr", color: "#0a2a50", opacity: 0.45 },
  { top: "38%", size: 20, duration: 26, delay: 6, direction: "rtl", color: "#FF6B35", opacity: 0.65 },
  { top: "62%", size: 42, duration: 22, delay: 0, direction: "ltr", color: "#FFB300", opacity: 0.6 },
  { top: "76%", size: 16, duration: 32, delay: 10, direction: "rtl", color: "#0a3060", opacity: 0.4 },
  { top: "14%", size: 22, duration: 28, delay: 4, direction: "rtl", color: "#FF8C00", opacity: 0.55 },
  { top: "50%", size: 13, duration: 38, delay: 14, direction: "ltr", color: "#1a5a9e", opacity: 0.4 },
  { top: "85%", size: 28, duration: 20, delay: 8, direction: "ltr", color: "#FF6B35", opacity: 0.5 },
  { top: "32%", size: 17, duration: 44, delay: 20, direction: "rtl", color: "#00bfdb", opacity: 0.35 },
];

function SwimmingFish() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {FISH_DATA.map((fish, i) => (
        <div key={i}
          className={fish.direction === "rtl" ? "animate-fish-rtl" : "animate-fish-ltr"}
          style={{ position: "absolute", top: fish.top, animationDuration: `${fish.duration}s`, animationDelay: `${fish.delay}s`, color: fish.color, opacity: fish.opacity }}>
          <Fish size={fish.size} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

// ─── Bubbles ───────────────────────────────────────────────────────────────────
function Bubbles() {
  const [bubbles] = useState(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i / 28) * 100 + Math.random() * 3}vw`,
      size: `${Math.random() * 20 + 6}px`,
      delay: `${Math.random() * 14}s`,
      duration: `${Math.random() * 10 + 12}s`,
    }))
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((b) => (
        <div key={b.id} className="animate-bubble absolute bottom-0"
          style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.duration }} />
      ))}
    </div>
  );
}

// ─── Seaweed + Coral floor ─────────────────────────────────────────────────────
function OceanFloor() {
  const weeds = [
    { h: 95, flip: false, dl: 0 }, { h: 125, flip: true, dl: 0.3 }, { h: 72, flip: false, dl: 0.6 },
    { h: 112, flip: true, dl: 0.15 }, { h: 88, flip: false, dl: 0.5 }, { h: 104, flip: true, dl: 0.8 },
    { h: 135, flip: false, dl: 0.4 }, { h: 78, flip: true, dl: 0.9 }, { h: 98, flip: false, dl: 0.2 },
    { h: 118, flip: true, dl: 0.7 }, { h: 82, flip: false, dl: 1.1 }, { h: 108, flip: true, dl: 0.55 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0">
      {/* Sand gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40"
        style={{ background: "linear-gradient(0deg, #0a4a7a 0%, transparent 100%)" }} />

      {/* Seaweed */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end px-2 overflow-hidden">
        {weeds.map((s, i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${s.dl}s` }}>
            <svg width="22" height={s.h} viewBox={`0 0 22 ${s.h}`} fill="none">
              <path
                d={`M11 ${s.h} Q${s.flip ? 20 : 2} ${s.h * 0.8} 11 ${s.h * 0.6} Q${s.flip ? 2 : 20} ${s.h * 0.4} 11 ${s.h * 0.2} Q${s.flip ? 20 : 2} 4 11 0`}
                stroke="#0a7040" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* Coral SVG at corners */}
      <div className="absolute bottom-0 left-2">
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <path d="M20 70 Q20 40 10 30 Q0 20 15 15 Q20 30 25 20 Q30 10 35 20 Q38 30 30 40 Q40 45 45 30 Q50 15 55 25 Q60 35 50 50 Q55 55 60 45 Q65 35 70 45 Q72 55 65 65 Q70 68 75 62 Q78 70 80 70" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
          <circle cx="10" cy="14" r="5" fill="#e74c3c" opacity="0.7"/>
          <circle cx="35" cy="18" r="4" fill="#e74c3c" opacity="0.65"/>
          <circle cx="55" cy="23" r="5" fill="#ff6b6b" opacity="0.6"/>
          <circle cx="75" cy="60" r="4" fill="#e74c3c" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-2 scale-x-[-1]">
        <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
          <path d="M20 70 Q20 40 10 30 Q0 20 15 15 Q20 30 25 20 Q30 10 35 20 Q38 30 30 40 Q40 45 45 30 Q50 15 55 25 Q60 35 50 50 Q55 55 60 45 Q65 35 70 45 Q72 55 65 65 Q70 68 75 62 Q78 70 80 70" stroke="#8e44ad" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.55"/>
          <circle cx="10" cy="14" r="5" fill="#9b59b6" opacity="0.65"/>
          <circle cx="35" cy="18" r="4" fill="#9b59b6" opacity="0.6"/>
          <circle cx="55" cy="23" r="5" fill="#bb8fce" opacity="0.55"/>
          <circle cx="75" cy="60" r="4" fill="#9b59b6" opacity="0.45"/>
        </svg>
      </div>
    </div>
  );
}

// ─── God Rays ──────────────────────────────────────────────────────────────────
function GodRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[8, 22, 36, 52, 66, 80].map((left, i) => (
        <motion.div key={i}
          className="absolute top-0 h-[75%]"
          style={{ left: `${left}%`, width: "55px", background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, transparent 100%)", transform: `skewX(${(i - 2.5) * 6}deg)` }}
          animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [1, 1.2, 1] }}
          transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <AnimatePresence>{!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}</AnimatePresence>

      <motion.div
        className="relative min-h-screen text-white overflow-x-hidden"
        style={{ background: "linear-gradient(180deg, #0e92cc 0%, #0a70a8 28%, #07508a 55%, #042d5c 80%, #021830 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <GodRays />
        <Bubbles />
        <SwimmingFish />
        <OceanFloor />

        {/* ── Navbar ── */}
        <nav className="fixed top-0 w-full z-50 py-4 px-6 md:px-10 flex items-center justify-between"
          style={{ background: "rgba(8, 90, 140, 0.55)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="flex items-center gap-3">
            <img src="/bob-nobg.png" alt="Bob" className="w-11 h-11 object-contain"
              style={{ filter: "drop-shadow(0 2px 8px rgba(255,140,0,0.5))" }} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-black text-xl text-white tracking-wide leading-tight">BOB</span>
              <span className="font-display font-bold text-xs text-white/70 tracking-widest">THE JELLYFISH</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-display font-bold text-white/90">
            <a href="#" className="hover:text-white border-b-2 border-white pb-0.5 transition-colors">HOME</a>
            <a href="#tokenomics" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">TOKENOMICS</a>
            <a href="#how-to-buy" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">HOW TO BUY</a>
            <a href="#community" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">COMMUNITY</a>
          </div>
          <Button className="rounded-full px-6 font-display font-black text-white"
            style={{ background: "#0a2a50", boxShadow: "0 0 0 2px rgba(255,255,255,0.25)", border: "none" }}
            data-testid="button-buy-nav">
            BUY $BOB
          </Button>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-20 z-10 overflow-hidden">
          <div className="w-full px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

            {/* Left — text */}
            <motion.div
              className="relative z-10 flex flex-col gap-5 lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -50 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="leading-none">
                <h1 className="font-display font-black leading-none"
                  style={{ fontSize: "clamp(5.5rem,16vw,12rem)", color: "#0a2a50", textShadow: "3px 5px 0 rgba(0,0,0,0.18)" }}>
                  BOB
                </h1>
                <h2 className="font-display font-black text-white leading-none"
                  style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)", marginTop: "-0.12em", textShadow: "1px 3px 0 rgba(0,0,0,0.2)" }}>
                  THE JELLYFISH
                </h2>
              </div>

              <p className="font-sans text-lg md:text-xl text-white/85 font-semibold leading-relaxed max-w-md"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                Floating through the waves,<br />dropping good vibes on TON.
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <Button size="lg" className="h-14 px-8 rounded-full font-display font-black text-lg text-white"
                  style={{ background: "#0a2a50", boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }}
                  data-testid="button-buy-hero">
                  <ArrowRight className="mr-2" size={18} /> BUY $BOB
                </Button>
                <Button size="lg" variant="outline"
                  className="h-14 px-8 rounded-full font-display font-black text-lg text-white border-white/60 hover:bg-white/10"
                  data-testid="button-learn-more">
                  LEARN MORE
                </Button>
              </div>

              <div className="flex items-center gap-4 mt-1">
                {[
                  { icon: Send, label: "Telegram" },
                  { icon: Waves, label: "Twitter" },
                  { icon: Anchor, label: "TON" },
                ].map(({ icon: Icon, label }, i) => (
                  <button key={i}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(10,42,80,0.7)", border: "1.5px solid rgba(255,255,255,0.3)" }}
                    aria-label={label} data-testid={`social-${label.toLowerCase()}`}>
                    <Icon size={18} className="text-white" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right — Alive Bob */}
            <motion.div
              className="relative z-10 flex items-center justify-center lg:w-1/2"
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.8, x: loaded ? 0 : 40 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              <AliveBob />
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs tracking-widest uppercase"
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Waves size={18} />
            <span>dive in</span>
          </motion.div>
        </section>

        {/* ── Wave divider ── */}
        <div className="relative z-10 -mt-1 overflow-hidden">
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-16 md:h-20">
            <path d="M0,50 C360,90 1080,10 1440,50 L1440,90 L0,90 Z" fill="rgba(4,30,60,0.85)" />
          </svg>
        </div>

        {/* ── Tokenomics ── */}
        <section id="tokenomics" className="py-20 relative z-10 px-6"
          style={{ background: "linear-gradient(180deg, rgba(4,30,60,0.85) 0%, rgba(3,20,45,0.95) 100%)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Fish size={24} className="text-white/50" />
              <h2 className="font-display font-black text-4xl md:text-5xl text-white">TOKENOMICS</h2>
              <Fish size={24} className="text-white/50 scale-x-[-1]" />
            </div>
            <p className="text-white/50 font-sans mb-12 text-base">Simple. Deep. Fair.</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Droplets, label: "Supply", value: "1B", sub: "$BOB" },
                { icon: Anchor, label: "Liquidity", value: "Burned", sub: "Forever" },
                { icon: Waves, label: "Tax", value: "0 / 0", sub: "No BS" },
                { icon: Shell, label: "Contract", value: "Renounced", sub: "Safe" },
              ].map(({ icon: Icon, label, value, sub }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -6 }}
                  className="rounded-3xl p-6 flex flex-col items-center gap-3"
                  style={{ background: "rgba(14,146,204,0.14)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(14,146,204,0.2)" }}>
                    <Icon size={24} className="text-white/80" />
                  </div>
                  <p className="text-white/45 text-xs uppercase tracking-widest font-sans">{label}</p>
                  <p className="font-display font-black text-2xl text-white">{value}</p>
                  <p className="text-white/60 text-xs font-bold uppercase font-sans">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── How to Buy ── */}
        <section id="how-to-buy" className="py-20 relative z-10 px-6"
          style={{ background: "rgba(2,14,34,0.97)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-14">
              <Anchor size={24} className="text-white/50" />
              <h2 className="font-display font-black text-4xl md:text-5xl text-white text-center">HOW TO CATCH BOB</h2>
            </div>

            <div className="space-y-4">
              {[
                { icon: Waves, step: "01", title: "Get a TON Wallet", desc: "Download Tonkeeper — your gateway to the deep." },
                { icon: Droplets, step: "02", title: "Get some TON", desc: "Buy TON on any exchange and send it to your wallet." },
                { icon: Fish, step: "03", title: "Swim to a DEX", desc: "Head to Ston.fi or Dedust and connect your wallet." },
                { icon: Anchor, step: "04", title: "Grab $BOB", desc: "Paste the contract address and swap TON for BOB." },
              ].map(({ icon: Icon, step, title, desc }, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="rounded-2xl p-5 flex items-center gap-5"
                  style={{ background: "rgba(14,146,204,0.12)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(8px)" }}
                  data-testid={`step-${i + 1}`}>
                  <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center"
                    style={{ background: "#0a6fa8", boxShadow: "0 0 18px rgba(14,146,204,0.35)" }}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white/35 text-xs font-bold tracking-widest font-sans">{step}</span>
                    <h3 className="font-display font-bold text-xl text-white">{title}</h3>
                    <p className="text-white/55 text-sm mt-0.5 font-sans">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer id="community" className="relative z-10 py-16 px-6 text-center"
          style={{ background: "rgba(2,10,24,0.99)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto">
            <motion.img src="/bob-nobg.png" alt="Bob"
              className="w-24 h-24 mx-auto mb-6 object-contain"
              style={{ filter: "drop-shadow(0 8px 24px rgba(255,140,0,0.4))" }}
              animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
            <h3 className="font-display font-black text-3xl mb-3 text-white">JOIN THE OCEAN</h3>
            <p className="text-white/45 mb-8 text-sm font-sans">Don't be the fish that missed the wave.</p>

            <div className="flex justify-center gap-4 mb-10">
              <Button size="lg" className="h-12 px-8 rounded-full font-display font-black text-white"
                style={{ background: "#0a6fa8" }} data-testid="button-telegram">
                <Send className="mr-2" size={16} /> Telegram
              </Button>
              <Button size="lg" className="h-12 px-8 rounded-full font-display font-black text-white"
                style={{ background: "#0a2a50", border: "1.5px solid rgba(255,255,255,0.15)" }} data-testid="button-buy-footer">
                <Fish className="mr-2" size={16} /> Buy $BOB
              </Button>
            </div>

            <p className="text-white/20 text-xs font-sans">$BOB is a meme coin. The ocean is deep and risky. Trade responsibly.</p>
            <p className="text-white/12 text-xs mt-2 font-sans">© {new Date().getFullYear()} Bob The Jellyfish. All vibes reserved.</p>
          </motion.div>
        </footer>
      </motion.div>
    </>
  );
}
