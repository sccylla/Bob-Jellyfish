import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      style={{ background: "linear-gradient(180deg, #020d1a 0%, #041e3a 40%, #062c55 100%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Bubbles behind Bob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="animate-bubble absolute bottom-0"
            style={{
              left: `${(i / 18) * 100}vw`,
              width: `${Math.random() * 24 + 8}px`,
              height: `${Math.random() * 24 + 8}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 8 + 8}s`,
            }}
          />
        ))}
      </div>

      {/* Seaweed left */}
      <div className="absolute bottom-0 left-8 flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${i * 0.4}s` }}>
            <svg width="28" height={80 + i * 20} viewBox="0 0 28 100" fill="none">
              <path d="M14 100 Q4 80 14 60 Q24 40 14 20 Q4 5 14 0" stroke="#1a6b3a" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* Seaweed right */}
      <div className="absolute bottom-0 right-8 flex gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-sway" style={{ animationDelay: `${i * 0.3 + 0.2}s` }}>
            <svg width="28" height={70 + i * 20} viewBox="0 0 28 100" fill="none">
              <path d="M14 100 Q24 80 14 60 Q4 40 14 20 Q24 5 14 0" stroke="#1a6b3a" strokeWidth="5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
      </div>

      {/* Sand floor */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1a3a5c] to-transparent" />

      {/* Bob jumping across */}
      <motion.div
        className="absolute"
        style={{ bottom: "18%", left: 0 }}
        animate={{ x: ["calc(-160px)", "calc(100vw + 160px)"] }}
        transition={{ duration: 3.2, ease: "linear", delay: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -130, 0, -110, 0, -100, 0, -80, 0, -60, 0] }}
          transition={{
            duration: 3.2,
            delay: 0.3,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            ease: "easeInOut",
          }}
        >
          <motion.img
            src="/bob-logo.jpeg"
            alt="Bob"
            className="rounded-full border-4 border-[#00D4FF]/60 shadow-[0_0_40px_rgba(0,212,255,0.5)]"
            style={{ width: 130, height: 130, objectFit: "cover" }}
            animate={{ rotate: [0, -8, 0, -8, 0, -8, 0, -8, 0, -8, 0] }}
            transition={{ duration: 3.2, delay: 0.3, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }}
          />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-wider text-white" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 30px rgba(0,212,255,0.6)" }}>
          BOB THE JELLYFISH
        </h1>
        <p className="mt-4 text-[#00D4FF] text-lg font-medium tracking-widest uppercase">diving in...</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Swimming Fish ─────────────────────────────────────────────────────────────
const FISH_DATA = [
  { top: "18%", size: 36, duration: 18, delay: 0, direction: "rtl", color: "#FF8C00", opacity: 0.85 },
  { top: "32%", size: 22, duration: 24, delay: 4, direction: "ltr", color: "#00D4FF", opacity: 0.7 },
  { top: "55%", size: 44, duration: 20, delay: 2, direction: "rtl", color: "#FF6B35", opacity: 0.6 },
  { top: "68%", size: 18, duration: 30, delay: 8, direction: "ltr", color: "#4FC3F7", opacity: 0.75 },
  { top: "80%", size: 28, duration: 22, delay: 5, direction: "rtl", color: "#FFB300", opacity: 0.65 },
  { top: "12%", size: 16, duration: 35, delay: 12, direction: "ltr", color: "#80DEEA", opacity: 0.5 },
  { top: "44%", size: 32, duration: 26, delay: 7, direction: "rtl", color: "#FF7043", opacity: 0.6 },
];

function SwimmingFish() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {FISH_DATA.map((fish, i) => (
        <div
          key={i}
          className={fish.direction === "rtl" ? "animate-fish-rtl" : "animate-fish-ltr"}
          style={{
            position: "absolute",
            top: fish.top,
            animationDuration: `${fish.duration}s`,
            animationDelay: `${fish.delay}s`,
            color: fish.color,
            opacity: fish.opacity,
          }}
        >
          <Fish size={fish.size} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

// ─── Bubbles ───────────────────────────────────────────────────────────────────
function Bubbles() {
  const [bubbles] = useState(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: `${(i / 25) * 100 + Math.random() * 4}vw`,
      size: `${Math.random() * 22 + 8}px`,
      delay: `${Math.random() * 12}s`,
      duration: `${Math.random() * 10 + 12}s`,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="animate-bubble absolute bottom-0"
          style={{ left: b.left, width: b.size, height: b.size, animationDelay: b.delay, animationDuration: b.duration }}
        />
      ))}
    </div>
  );
}

// ─── Seaweed ───────────────────────────────────────────────────────────────────
function Seaweed() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-between px-4 overflow-hidden">
      {[
        { h: 110, side: "left", dl: 0 }, { h: 90, side: "left", dl: 0.3 }, { h: 130, side: "left", dl: 0.6 },
        { h: 100, side: "right", dl: 0.1 }, { h: 120, side: "right", dl: 0.5 }, { h: 85, side: "right", dl: 0.8 },
      ].map((s, i) => (
        <div key={i} className="animate-sway" style={{ animationDelay: `${s.dl}s` }}>
          <svg width="26" height={s.h} viewBox={`0 0 26 ${s.h}`} fill="none">
            <path
              d={`M13 ${s.h} Q${s.side === "left" ? 3 : 23} ${s.h * 0.8} 13 ${s.h * 0.6} Q${s.side === "left" ? 23 : 3} ${s.h * 0.4} 13 ${s.h * 0.2} Q${s.side === "left" ? 3 : 23} 5 13 0`}
              stroke="#1a7a3a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
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
        style={{ background: "linear-gradient(180deg, #020d1a 0%, #041e3a 40%, #052645 70%, #041530 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Bubbles />
        <SwimmingFish />
        <Seaweed />

        {/* Light rays from above */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-40 h-full opacity-5 bg-gradient-to-b from-[#00D4FF] via-transparent to-transparent" style={{ transform: "skewX(-15deg)" }} />
          <div className="absolute top-0 left-1/2 w-24 h-full opacity-5 bg-gradient-to-b from-[#00D4FF] via-transparent to-transparent" style={{ transform: "skewX(-5deg)" }} />
          <div className="absolute top-0 left-3/4 w-32 h-full opacity-5 bg-gradient-to-b from-[#00D4FF] via-transparent to-transparent" style={{ transform: "skewX(10deg)" }} />
        </div>

        {/* ── Navbar ── */}
        <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 py-3 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bob-logo.jpeg" alt="Bob" className="w-11 h-11 rounded-full object-cover border-2 border-[#00D4FF] shadow-[0_0_12px_rgba(0,212,255,0.5)]" />
            <span className="font-black text-lg tracking-widest uppercase hidden sm:block" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 12px rgba(0,212,255,0.4)" }}>
              $BOB
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#00D4FF] font-medium">
            <a href="#tokenomics" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Shell size={14} /> Tokenomics
            </a>
            <a href="#how-to-buy" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Anchor size={14} /> How to Buy
            </a>
          </div>
          <Button
            className="rounded-full px-6 font-bold text-[#0a1628]"
            style={{ background: "linear-gradient(135deg, #00D4FF, #0096b3)", boxShadow: "0 0 20px rgba(0,212,255,0.4)" }}
          >
            Buy $BOB
          </Button>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Bob image */}
            <div className="relative animate-float">
              <div className="absolute inset-0 rounded-full blur-3xl scale-110" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)" }} />
              <div className="absolute inset-0 rounded-full blur-2xl animate-pulse" style={{ background: "radial-gradient(circle, rgba(255,140,0,0.15) 0%, transparent 70%)" }} />
              <img
                src="/bob-logo.jpeg"
                alt="Bob The Jellyfish"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-[#00D4FF]/40"
                style={{ boxShadow: "0 0 60px rgba(0,212,255,0.35), 0 0 120px rgba(0,212,255,0.1)" }}
              />
            </div>

            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 40px rgba(0,212,255,0.4)" }}>
                BOB THE
                <span className="block" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #00D4FF, #FF8C00)", backgroundClip: "text" }}>
                  JELLYFISH
                </span>
              </h1>
              <p className="mt-4 text-blue-100/70 text-xl md:text-2xl font-light max-w-lg mx-auto">
                The deepest vibe on TON. Riding the current.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button
                size="lg"
                className="h-14 px-10 rounded-full font-black text-lg text-[#020d1a]"
                style={{ background: "linear-gradient(135deg, #00D4FF, #0096b3)", boxShadow: "0 0 30px rgba(0,212,255,0.5)" }}
                data-testid="button-ape-in"
              >
                Ape In Now <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 rounded-full font-bold text-lg border-[#00D4FF]/40 text-white hover:bg-[#00D4FF]/10 glass-panel"
                data-testid="button-community"
              >
                <Send className="mr-2" size={18} /> Telegram
              </Button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#00D4FF]/50 text-sm"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Waves size={20} />
            <span className="text-xs tracking-widest uppercase">dive in</span>
          </motion.div>
        </section>

        {/* ── Wave divider ── */}
        <div className="relative z-10 -mt-1 overflow-hidden">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="rgba(0,212,255,0.06)" />
          </svg>
        </div>

        {/* ── Tokenomics ── */}
        <section id="tokenomics" className="py-24 relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Fish size={28} className="text-[#00D4FF]" />
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
                TOKENOMICS
              </h2>
              <Fish size={28} className="text-[#00D4FF] scale-x-[-1]" />
            </div>
            <p className="text-[#00D4FF] mb-14 text-lg">Simple. Deep. Fair.</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Droplets, label: "Supply", value: "1B", sub: "$BOB" },
                { icon: Anchor, label: "Liquidity", value: "Burned", sub: "Forever" },
                { icon: Waves, label: "Tax", value: "0 / 0", sub: "No BS" },
                { icon: Shell, label: "Contract", value: "Renounced", sub: "Safe" },
              ].map(({ icon: Icon, label, value, sub }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="glass-panel rounded-3xl p-6 flex flex-col items-center gap-3 border-t-2 border-t-[#00D4FF]/30"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(0,212,255,0.1)", boxShadow: "0 0 15px rgba(0,212,255,0.2)" }}>
                    <Icon size={24} className="text-[#00D4FF]" />
                  </div>
                  <p className="text-blue-200/60 text-xs uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-black text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{value}</p>
                  <p className="text-[#FF8C00] text-xs font-bold uppercase">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── How to Buy ── */}
        <section id="how-to-buy" className="py-24 relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-3 mb-16 text-center">
              <Anchor size={28} className="text-[#FF8C00]" />
              <h2 className="text-4xl md:text-5xl font-black" style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 20px rgba(255,140,0,0.4)" }}>
                CATCH BOB
              </h2>
            </div>

            <div className="space-y-5">
              {[
                { icon: Waves, step: "01", title: "Get a TON Wallet", desc: "Download Tonkeeper — your gateway to the deep." },
                { icon: Droplets, step: "02", title: "Get some TON", desc: "Buy TON on any exchange and send it to your wallet." },
                { icon: Fish, step: "03", title: "Swim to a DEX", desc: "Head to Ston.fi or Dedust and connect your wallet." },
                { icon: Anchor, step: "04", title: "Grab $BOB", desc: "Paste the contract address and swap TON for BOB." },
              ].map(({ icon: Icon, step, title, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="glass-panel rounded-2xl p-5 flex items-center gap-5"
                  data-testid={`step-${i + 1}`}
                >
                  <div
                    className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center text-[#020d1a] font-black text-sm"
                    style={{ background: "linear-gradient(135deg, #00D4FF, #0096b3)", boxShadow: "0 0 20px rgba(0,212,255,0.4)" }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[#00D4FF]/50 text-xs font-bold tracking-widest">{step}</span>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h3>
                    <p className="text-blue-100/60 text-sm mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative z-10 py-16 px-6 text-center border-t border-[#00D4FF]/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto"
          >
            <img
              src="/bob-logo.jpeg"
              alt="Bob"
              className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-2 border-[#00D4FF]/30 animate-float"
            />
            <h3 className="text-3xl font-black mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              JOIN THE OCEAN
            </h3>
            <p className="text-blue-100/50 mb-8 text-sm">Don't be the fish that missed the wave.</p>

            <div className="flex justify-center gap-4 mb-10">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full font-bold text-[#020d1a]"
                style={{ background: "linear-gradient(135deg, #00D4FF, #0096b3)" }}
                data-testid="button-telegram"
              >
                <Send className="mr-2" size={16} /> Telegram
              </Button>
              <Button
                size="lg"
                className="h-12 px-8 rounded-full font-bold text-white"
                style={{ background: "linear-gradient(135deg, #FF8C00, #e07000)", boxShadow: "0 0 20px rgba(255,140,0,0.3)" }}
                data-testid="button-buy"
              >
                <Fish className="mr-2" size={16} /> Buy $BOB
              </Button>
            </div>

            <p className="text-blue-100/25 text-xs">
              $BOB is a meme coin. The ocean is deep and risky. Trade responsibly.
            </p>
            <p className="text-blue-100/15 text-xs mt-2">
              © {new Date().getFullYear()} Bob The Jellyfish. All vibes reserved.
            </p>
          </motion.div>
        </footer>
      </motion.div>
    </>
  );
}
