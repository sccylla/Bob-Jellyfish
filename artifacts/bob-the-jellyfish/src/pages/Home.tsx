import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Music, Anchor, Droplets, Waves, Wallet, ArrowRight, Twitter, Send, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Bubbles = () => {
  const [bubbles, setBubbles] = useState<Array<{ id: number; left: string; size: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const generatedBubbles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 30 + 10}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-0 animate-bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
    </div>
  );
};

const Particles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: string; delay: string }>>([]);

  useEffect(() => {
    const generated = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: `${Math.random() * 4 + 1}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const WaveSeparator = ({ invert = false }) => (
  <div className={`w-full overflow-hidden leading-none ${invert ? 'rotate-180' : ''}`}>
    <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-blue-900/20"></path>
    </svg>
  </div>
);

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="relative min-h-screen bg-[#0a1628] text-white selection:bg-[#00D4FF] selection:text-white">
      <Bubbles />
      <Particles />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.5)]">
            <img src="/bob-logo.jpeg" alt="Bob Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-black text-xl tracking-wider text-glow uppercase hidden sm:block">
            BOB THE JELLYFISH
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#00D4FF]">
          <a href="#about" className="hover:text-white hover:text-glow transition-all">About</a>
          <a href="#tokenomics" className="hover:text-white hover:text-glow transition-all">Tokenomics</a>
          <a href="#how-to-buy" className="hover:text-white hover:text-glow transition-all">How to Buy</a>
          <a href="#roadmap" className="hover:text-white hover:text-glow transition-all">Roadmap</a>
        </div>
        <Button className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-bold rounded-full px-6 shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all hover:scale-105 active:scale-95">
          Buy $BOB
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden z-10">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.1)_0%,rgba(10,22,40,1)_70%)]" />
        
        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel w-fit mx-auto lg:mx-0 border-[#FF8C00]/30 text-[#FF8C00]">
              <Zap size={16} className="text-[#FF8C00]" />
              <span className="text-sm font-bold tracking-wide uppercase">The freshest catch on TON</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black leading-tight">
              MEET <span className="text-gradient">BOB</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-blue-100/80 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
              He's deep in the ocean. He's got his TON headphones on. The vibes are immaculate.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-[#00D4FF] hover:bg-[#00D4FF]/80 text-[#0a1628] font-black shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all hover:scale-105">
                Ape In Now <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full glass-panel border-[#00D4FF]/50 text-white hover:bg-[#00D4FF]/10 font-bold transition-all">
                Join Community
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 animate-float z-10">
              <div className="absolute inset-0 rounded-full bg-[#00D4FF]/20 blur-3xl" />
              <div className="absolute inset-0 rounded-full bg-[#FF8C00]/20 blur-2xl animate-pulse" />
              <img 
                src="/bob-logo.jpeg" 
                alt="Bob The Jellyfish" 
                className="w-full h-full object-cover rounded-full border-4 border-[#00D4FF]/50 shadow-[0_0_50px_rgba(0,212,255,0.3)] relative z-10"
              />
            </div>
            
            {/* Seaweed decoration */}
            <div className="absolute -bottom-20 -left-10 w-24 h-48 bg-green-500/10 blur-xl rounded-full mix-blend-screen animate-sway" />
          </motion.div>
        </div>
      </section>

      <WaveSeparator />

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black mb-8 text-glow">
              WHO IS BOB?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-blue-100/80 font-light leading-relaxed mb-12">
              Bob isn't just another fish in the sea. He's a bioluminescent rave king living 3,000 feet deep, powered by the TON blockchain and bass-heavy beats. While the rest of the market is crabbing, Bob is out here grooving.
            </motion.p>
            
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Music, title: "Immaculate Vibes", desc: "Always spinning the best tracks." },
                { icon: Droplets, title: "Deep Liquidity", desc: "As deep as the Mariana Trench." },
                { icon: Flame, title: "Unstoppable", desc: "Bioluminescent energy 24/7." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeIn} className="glass-panel p-8 rounded-3xl flex flex-col items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF] mb-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-blue-100/60 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="py-24 relative z-10 bg-blue-900/10">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-glow mb-4">TOKENOMICS</h2>
            <p className="text-xl text-[#00D4FF] font-medium">Simple. Fair. Deep.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { label: "Total Supply", value: "1,000,000,000", suffix: "$BOB" },
              { label: "Liquidity", value: "Burned", suffix: "Forever" },
              { label: "Taxes", value: "0/0", suffix: "No BS" },
              { label: "Contract", value: "Renounced", suffix: "Safe AF" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-panel p-8 rounded-3xl text-center border-t-2 border-t-[#FF8C00]/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF8C00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-blue-100/60 font-medium mb-2 relative z-10">{stat.label}</p>
                <h4 className="text-3xl font-black text-white relative z-10 mb-1">{stat.value}</h4>
                <p className="text-[#00D4FF] text-sm font-bold uppercase relative z-10">{stat.suffix}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section id="how-to-buy" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-center mb-16 text-glow"
            >
              HOW TO CATCH BOB
            </motion.h2>

            <div className="space-y-6">
              {[
                { step: "1", title: "Get a Wallet", desc: "Download Tonkeeper or any TON-compatible wallet." },
                { step: "2", title: "Get some TON", desc: "Buy TON on an exchange and send it to your wallet." },
                { step: "3", title: "Go to DEX", desc: "Connect to Ston.fi or Dedust." },
                { step: "4", title: "Swap for $BOB", desc: "Enter the contract address and swap your TON for BOB." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-panel p-6 rounded-2xl flex items-center gap-6"
                >
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#00D4FF] text-[#0a1628] font-black text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-blue-100/70">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-24 relative z-10 overflow-hidden">
        <div className="absolute right-0 top-1/2 w-[800px] h-[800px] bg-[#00D4FF]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-center mb-16 text-glow"
          >
            THE DEEP DIVE
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { phase: "Phase 1", title: "The Drop", items: ["Token Launch", "DEX Listings", "Community Setup", "Vibe Check"] },
              { phase: "Phase 2", title: "The Current", items: ["CoinGecko Listing", "Marketing Push", "Meme Contests", "10k Holders"] },
              { phase: "Phase 3", title: "The Tsunami", items: ["CEX Listings", "Bob Merch", "Secret Utility", "Ocean Domination"] }
            ].map((phase, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-panel p-8 rounded-3xl relative"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF8C00]/10 rounded-full blur-xl" />
                <span className="text-[#FF8C00] font-black text-sm uppercase tracking-widest mb-2 block">{phase.phase}</span>
                <h3 className="text-2xl font-bold text-white mb-6">{phase.title}</h3>
                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-blue-100/80">
                      <div className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveSeparator invert />

      {/* Footer / Community */}
      <footer className="py-24 relative z-10 bg-[#070e1a]">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-2xl mx-auto"
          >
            <motion.h2 variants={fadeIn} className="text-4xl md:text-6xl font-black mb-6">
              JOIN THE <span className="text-[#00D4FF]">RAVE</span>
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl text-blue-100/60 mb-10">
              Don't be the fish that missed the wave. Dive in with Bob and the community today.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-4 mb-16">
              <Button size="lg" className="h-14 px-8 rounded-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0a1628] font-black transition-all hover:scale-105">
                <Twitter className="mr-2" /> Twitter
              </Button>
              <Button size="lg" className="h-14 px-8 rounded-full bg-[#2AABEE] hover:bg-[#2AABEE]/90 text-white font-black transition-all hover:scale-105">
                <Send className="mr-2" /> Telegram
              </Button>
            </motion.div>
            
            <motion.div variants={fadeIn} className="pt-12 border-t border-blue-900/30 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/bob-logo.jpeg" alt="Bob" className="w-full h-full object-cover" />
              </div>
              <p className="text-blue-100/40 text-sm font-medium">
                $BOB is a meme coin with no intrinsic value or expectation of financial return. The ocean is deep and risky. Trade responsibly.
              </p>
              <p className="text-blue-100/20 text-xs mt-4">
                © {new Date().getFullYear()} Bob The Jellyfish. All vibes reserved.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
