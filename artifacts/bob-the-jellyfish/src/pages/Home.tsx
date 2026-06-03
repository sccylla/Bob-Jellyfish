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
      style={{ background: "linear-gradient(180deg, #0a6fa8 0%, #0e92cc 40%, #12a8d9 100%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* God rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[15, 30, 45, 60, 75].map((left, i) => (
          <div key={i} className="absolute top-0 h-full opacity-10"
            style={{ left: `${left}%`, width: "80px", background: "linear-gradient(180deg, #fff 0%, transparent 70%)", transform: `skewX(${(i - 2) * 8}deg)` }} />
        ))}
      </div>

      {/* Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="animate-bubble absolute bottom-0"
            style={{ left: `${(i / 18) * 100}vw`, width: `${Math.random() * 24 + 8}px`, height: `${Math.random() * 24 + 8}px`, animationDelay: `${Math.random() * 4}s`, animationDuration: `${Math.random() * 8 + 8}s` }} />
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

      {/* Sand floor */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0a5a8a]/60 to-transparent" />

      {/* Bob jumping */}
      <motion.div className="absolute" style={{ bottom: "18%", left: 0 }}
        animate={{ x: ["calc(-160px)", "calc(100vw + 160px)"] }}
        transition={{ duration: 3.2, ease: "linear", delay: 0.3 }}>
        <motion.div
          animate={{ y: [0, -130, 0, -110, 0, -100, 0, -80, 0, -60, 0] }}
          transition={{ duration: 3.2, delay: 0.3, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], ease: "easeInOut" }}>
          <motion.img src="/bob-logo.jpeg" alt="Bob"
            className="rounded-full border-4 border-white/60"
            style={{ width: 130, height: 130, objectFit: "cover", boxShadow: "0 0 40px rgba(255,255,255,0.4)" }}
            animate={{ rotate: [0, -8, 0, -8, 0, -8, 0, -8, 0, -8, 0] }}
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

// ─── Swimming Fish ─────────────────────────────────────────────────────────────
const FISH_DATA = [
  { top: "22%", size: 30, duration: 18, delay: 2, direction: "ltr", color: "#1a3a6e", opacity: 0.5 },
  { top: "38%", size: 20, duration: 26, delay: 6, direction: "rtl", color: "#FF6B35", opacity: 0.7 },
  { top: "60%", size: 38, duration: 22, delay: 0, direction: "ltr", color: "#FFB300", opacity: 0.65 },
  { top: "75%", size: 16, duration: 32, delay: 10, direction: "rtl", color: "#1a3a6e", opacity: 0.4 },
  { top: "14%", size: 22, duration: 28, delay: 4, direction: "rtl", color: "#FF8C00", opacity: 0.6 },
  { top: "50%", size: 14, duration: 38, delay: 14, direction: "ltr", color: "#1a5a9e", opacity: 0.45 },
  { top: "85%", size: 26, duration: 20, delay: 8, direction: "ltr", color: "#FF6B35", opacity: 0.55 },
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
      delay: `${Math.random() * 12}s`,
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

// ─── Seaweed strip at bottom ───────────────────────────────────────────────────
function SeaweedStrip() {
  const items = [
    { h: 90, flip: false, dl: 0 }, { h: 120, flip: true, dl: 0.3 }, { h: 70, flip: false, dl: 0.6 },
    { h: 110, flip: true, dl: 0.15 }, { h: 85, flip: false, dl: 0.5 }, { h: 100, flip: true, dl: 0.8 },
    { h: 130, flip: false, dl: 0.4 }, { h: 75, flip: true, dl: 0.9 }, { h: 95, flip: false, dl: 0.2 },
    { h: 115, flip: true, dl: 0.7 },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 flex justify-around items-end px-4 overflow-hidden">
      {items.map((s, i) => (
        <div key={i} className="animate-sway" style={{ animationDelay: `${s.dl}s` }}>
          <svg width="24" height={s.h} viewBox={`0 0 24 ${s.h}`} fill="none">
            <path
              d={`M12 ${s.h} Q${s.flip ? 22 : 2} ${s.h * 0.8} 12 ${s.h * 0.6} Q${s.flip ? 2 : 22} ${s.h * 0.4} 12 ${s.h * 0.2} Q${s.flip ? 22 : 2} 4 12 0`}
              stroke="#0a6b35" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── God rays ────────────────────────────────────────────────────────────────
function GodRays() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[10, 25, 38, 55, 70, 82].map((left, i) => (
        <div key={i} className="absolute top-0 h-[70%] opacity-[0.07]"
          style={{ left: `${left}%`, width: "60px", background: "linear-gradient(180deg, #fff 0%, transparent 100%)", transform: `skewX(${(i - 2.5) * 6}deg)`, animationDelay: `${i * 0.5}s` }} />
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
        style={{ background: "linear-gradient(180deg, #0e92cc 0%, #0a70a8 30%, #085a8a 60%, #063d64 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <GodRays />
        <Bubbles />
        <SwimmingFish />
        <SeaweedStrip />

        {/* ── Navbar ── */}
        <nav className="fixed top-0 w-full z-50 py-4 px-6 md:px-10 flex items-center justify-between"
          style={{ background: "rgba(10, 100, 160, 0.55)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div className="flex items-center gap-3">
            <img src="/bob-logo.jpeg" alt="Bob" className="w-11 h-11 rounded-full object-cover border-2 border-white/60" style={{ boxShadow: "0 0 10px rgba(255,255,255,0.3)" }} />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-black text-xl text-white tracking-wide leading-tight">BOB</span>
              <span className="font-display font-bold text-xs text-white/80 tracking-widest">THE JELLYFISH</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-display font-bold text-white/90">
            <a href="#" className="hover:text-white border-b-2 border-white pb-0.5 transition-colors">HOME</a>
            <a href="#tokenomics" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">TOKENOMICS</a>
            <a href="#how-to-buy" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">HOW TO BUY</a>
            <a href="#community" className="hover:text-white border-b-2 border-transparent hover:border-white pb-0.5 transition-all">COMMUNITY</a>
          </div>
          <Button
            className="rounded-full px-6 font-display font-black text-white"
            style={{ background: "#0a2a50", boxShadow: "0 0 0 2px rgba(255,255,255,0.3)", border: "none" }}
            data-testid="button-buy-nav"
          >
            BUY $BOB
          </Button>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-20 z-10 px-6 md:px-12 lg:px-20 overflow-hidden">

          {/* Left — text */}
          <motion.div
            className="relative z-10 flex flex-col gap-5 max-w-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Big "BOB" */}
            <div className="leading-none">
              <h1 className="font-display font-black text-[clamp(6rem,18vw,13rem)] leading-none"
                style={{ color: "#0a2a50", textShadow: "2px 4px 0 rgba(0,0,0,0.15)" }}>
                BOB
              </h1>
              <h2 className="font-display font-black text-[clamp(2.2rem,6vw,5rem)] leading-none text-white"
                style={{ textShadow: "1px 2px 0 rgba(0,0,0,0.2)", marginTop: "-0.15em" }}>
                THE JELLYFISH
              </h2>
            </div>

            <p className="font-sans text-xl md:text-2xl text-white/85 font-semibold leading-relaxed max-w-md"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              Floating through the waves,<br />dropping good vibes on TON.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Button
                size="lg"
                className="h-14 px-8 rounded-full font-display font-black text-lg text-white"
                style={{ background: "#0a2a50", boxShadow: "0 6px 24px rgba(0,0,0,0.35)" }}
                data-testid="button-buy-hero"
              >
                <ArrowRight className="mr-2" size={18} /> BUY $BOB
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-full font-display font-black text-lg text-white border-white/60 hover:bg-white/10"
                data-testid="button-learn-more"
              >
                LEARN MORE
              </Button>
            </div>

            {/* Social row */}
            <div className="flex items-center gap-4 mt-2">
              {[
                { icon: Send, label: "Telegram" },
                { icon: Waves, label: "Twitter" },
                { icon: Anchor, label: "TON" },
              ].map(({ icon: Icon, label }, i) => (
                <button key={i}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(10,42,80,0.7)", border: "1.5px solid rgba(255,255,255,0.3)" }}
                  data-testid={`social-${label.toLowerCase()}`}
                  aria-label={label}>
                  <Icon size={18} className="text-white" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — Bob illustration */}
          <motion.div
            className="absolute right-0 bottom-0 top-0 flex items-end justify-center pointer-events-none"
            style={{ width: "55%", right: "-2%" }}
            initial={{ opacity: 0, scale: 0.85, x: 60 }}
            animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.85, x: loaded ? 0 : 60 }}
            transition={{ duration: 0.9, delay: 0.35 }}
          >
            <motion.img
              src="/bob-logo.jpeg"
              alt="Bob The Jellyfish"
              animate={{ y: [0, -22, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              style={{
                width: "min(540px, 88%)",
                height: "auto",
                objectFit: "contain",
                borderRadius: "40%",
                filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.35))",
                marginBottom: "2%",
              }}
            />
          </motion.div>
        </section>

        {/* ── Wave divider ── */}
        <div className="relative z-10 overflow-hidden" style={{ marginTop: "-2px" }}>
          <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="w-full h-16 md:h-20">
            <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,90 L0,90 Z" fill="rgba(6,50,90,0.8)" />
          </svg>
        </div>

        {/* ── Tokenomics ── */}
        <section id="tokenomics" className="py-20 relative z-10 px-6"
          style={{ background: "linear-gradient(180deg, rgba(6,50,90,0.8) 0%, rgba(4,32,58,0.9) 100%)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Fish size={26} className="text-white/60" />
              <h2 className="font-display font-black text-4xl md:text-5xl text-white">TOKENOMICS</h2>
              <Fish size={26} className="text-white/60 scale-x-[-1]" />
            </div>
            <p className="text-white/60 font-sans mb-12 text-lg">Simple. Deep. Fair.</p>

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
                  style={{ background: "rgba(14,146,204,0.18)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.12)", boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-sans">{label}</p>
                  <p className="font-display font-black text-2xl text-white">{value}</p>
                  <p className="text-white/70 text-xs font-bold uppercase font-sans">{sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── How to Buy ── */}
        <section id="how-to-buy" className="py-20 relative z-10 px-6"
          style={{ background: "rgba(4,28,52,0.95)" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-14">
              <Anchor size={26} className="text-white/60" />
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
                  style={{ background: "rgba(14,146,204,0.15)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
                  data-testid={`step-${i + 1}`}>
                  <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center font-display font-black text-sm"
                    style={{ background: "#0a6fa8", boxShadow: "0 0 20px rgba(14,146,204,0.4)" }}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-white/40 text-xs font-bold tracking-widest font-sans">{step}</span>
                    <h3 className="font-display font-bold text-xl text-white">{title}</h3>
                    <p className="text-white/60 text-sm mt-0.5 font-sans">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer id="community" className="relative z-10 py-16 px-6 text-center"
          style={{ background: "rgba(4,20,40,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto">
            <motion.img src="/bob-logo.jpeg" alt="Bob"
              className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-2 border-white/20"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <h3 className="font-display font-black text-3xl mb-3 text-white">JOIN THE OCEAN</h3>
            <p className="text-white/50 mb-8 text-sm font-sans">Don't be the fish that missed the wave.</p>

            <div className="flex justify-center gap-4 mb-10">
              <Button size="lg" className="h-12 px-8 rounded-full font-display font-black text-white"
                style={{ background: "#0a6fa8" }} data-testid="button-telegram">
                <Send className="mr-2" size={16} /> Telegram
              </Button>
              <Button size="lg" className="h-12 px-8 rounded-full font-display font-black text-white"
                style={{ background: "#0a2a50", border: "1.5px solid rgba(255,255,255,0.2)" }} data-testid="button-buy-footer">
                <Fish className="mr-2" size={16} /> Buy $BOB
              </Button>
            </div>

            <p className="text-white/25 text-xs font-sans">$BOB is a meme coin. The ocean is deep and risky. Trade responsibly.</p>
            <p className="text-white/15 text-xs mt-2 font-sans">© {new Date().getFullYear()} Bob The Jellyfish. All vibes reserved.</p>
          </motion.div>
        </footer>
      </motion.div>
    </>
  );
}
