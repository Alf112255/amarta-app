import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Mic2, HeartPulse, Brain, Zap, 
  Activity, Calendar, TrendingUp, BarChart3, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const CircularProgress = ({ score }: { score: number }) => {
  const [liveScore, setLiveScore] = useState(score);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() * 0.4 - 0.2);
      setLiveScore(parseFloat((score + fluctuation).toFixed(1)));
    }, 3000);
    return () => clearInterval(interval);
  }, [score]);

  const offset = circumference - (liveScore / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-44 h-44 sm:w-72 sm:h-72 transform -rotate-90">
        <circle
          cx="50%" cy="50%" r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          className="text-white/10"
        />
        <motion.circle
          cx="50%" cy="50%" r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            filter: ["drop-shadow(0 0 2px #E3EF26)", "drop-shadow(0 0 8px #E3EF26)", "drop-shadow(0 0 2px #E3EF26)"]
          }}
          transition={{ 
            strokeDashoffset: { duration: 1.5, ease: "easeOut" },
            filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="text-[#E3EF26]"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <div className="flex items-start text-white">
          <motion.span 
            key={liveScore}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className="text-3xl sm:text-5xl font-bold font-sans tracking-tighter"
          >
            {liveScore}
          </motion.span>
          <span className="text-sm sm:text-xl font-bold text-[#E3EF26] mt-1 ml-0.5">%</span>
        </div>
        <div className="flex items-center gap-1 mt-1 sm:mt-2">
          <span className="w-1 h-1 bg-[#E3EF26] rounded-full animate-pulse" />
          <span className="text-[8px] sm:text-[10px] opacity-60 font-bold uppercase tracking-[0.2em] text-white">Indeks</span>
        </div>
      </div>
    </div>
  );
};

const ResilienceCard = ({ title, icon: Icon, children, color, isLive }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-5 sm:p-6 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[35px] shadow-sm relative overflow-hidden"
  >
    <div className="flex items-center justify-between mb-5 relative z-10">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center text-white shadow-md`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="font-bold text-[10px] sm:text-xs tracking-tight font-sans italic uppercase opacity-80 text-foreground">{title}</h3>
      </div>
      {isLive && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
          <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
          <span className="text-[7px] font-black text-red-500 uppercase tracking-tighter">Live Scan</span>
        </div>
      )}
    </div>
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const ResiliencePage = () => {
  const navigate = useNavigate();
  const currentScore = 84;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto w-full flex flex-col min-h-screen pt-8 pb-40 px-5 sm:px-12 overflow-x-hidden">
        
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center text-foreground active:scale-90 transition-transform shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight italic font-sans text-foreground">Dasbor Ketahanan</h1>
            <p className="text-[9px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Status Psikologis Alifi</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 p-8 sm:p-12 bg-gradient-to-br from-[#076653] to-[#0C342C] rounded-[45px] text-white relative overflow-hidden shadow-2xl shadow-[#076653]/30"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
              <div className="px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mb-6 sm:mb-8 text-white">Kondisi Stabil</div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-3 italic tracking-tight text-white">Performa Mental Optimal</h2>
              <p className="text-[11px] sm:text-sm leading-relaxed opacity-70 italic max-w-sm mb-6 text-white">
                Integrasi algoritma AMARTA terus memantau kestabilan emosi kamu berdasarkan parameter vokal terakhir yang terekam.
              </p>
              <div className="h-1.5 w-full max-w-[200px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="h-full bg-[#E3EF26] shadow-[0_0_10px_#E3EF26]"
                />
              </div>
            </div>
            
            <div className="shrink-0 scale-110 sm:scale-125 md:scale-100">
              <CircularProgress score={currentScore} />
            </div>
          </div>
          <div className="absolute top-[-30%] right-[-10%] w-64 h-64 sm:w-96 sm:h-96 bg-[#E3EF26]/10 blur-[80px] sm:blur-[120px] rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          <div className="space-y-6 sm:space-y-8">
            <ResilienceCard title="Tren Mingguan" icon={TrendingUp} color="bg-[#E3EF26] text-black">
              <div className="flex items-end justify-between h-24 sm:h-32 gap-2 px-1 mt-2">
                {[40, 55, 45, 70, 65, 84, 80].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className={`w-full rounded-t-xl shadow-sm ${i === 5 ? 'bg-[#076653]' : 'bg-[#076653]/20'}`}
                    />
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{['S', 'S', 'R', 'K', 'J', 'S', 'M'][i]}</span>
                  </div>
                ))}
              </div>
            </ResilienceCard>

            <ResilienceCard title="Monitoring Vokal AI" icon={Mic2} color="bg-[#076653]" isLive={true}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/30 text-center">
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mb-1">Stabilitas</p>
                    <p className="text-sm sm:text-lg font-bold italic text-[#076653] dark:text-[#E3EF26]">88%</p>
                  </div>
                  <div className="p-4 bg-white/40 dark:bg-white/5 rounded-3xl border border-white/30 text-center">
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mb-1">Stress</p>
                    <p className="text-sm sm:text-lg font-bold italic text-[#076653] dark:text-[#E3EF26]">LOW</p>
                  </div>
                </div>
                {/* Simulasi Waveform */}
                <div className="flex items-center justify-center gap-1 h-6">
                  {[...Array(12)].map((_, i) => (
                    <motion.div key={i} animate={{ height: [4, Math.random() * 16 + 4, 4] }} transition={{ duration: 0.5 + Math.random(), repeat: Infinity }} className="w-1 bg-[#076653]/30 rounded-full" />
                  ))}
                </div>
              </div>
            </ResilienceCard>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <ResilienceCard title="Wawasan dr. Sarah" icon={HeartPulse} color="bg-[#cc5833]">
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/30">
                  <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/100?u=sarah" className="w-10 h-10 rounded-2xl border border-white/40 shadow-sm" alt="Sarah" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground">dr. Sarah Chen</p>
                      <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Update 20 Mar</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30" />
                </div>
                <div className="bg-[#cc5833]/5 p-5 rounded-[30px] border border-dashed border-[#cc5833]/20">
                  <p className="text-[11px] sm:text-sm leading-relaxed text-foreground/80 italic font-medium">
                    "Kurva ketahanan kamu menunjukkan arah positif yang sangat stabil. Pertahankan ritme ini di tengah kepadatan jadwal klinismu."
                  </p>
                </div>
              </div>
            </ResilienceCard>

            <ResilienceCard title="Tindakan Preventif" icon={Brain} color="bg-blue-600">
              <div className="space-y-3">
                <div 
                  onClick={() => navigate("/medical-focus")} 
                  className="flex items-center justify-between p-4 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/30 hover:bg-white/60 transition-all cursor-pointer group text-foreground shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-blue-500 fill-current" />
                    <span className="text-[11px] sm:text-xs font-bold">Latihan Fokus Medis</span>
                  </div>
                  <button className="text-[10px] font-bold text-blue-600 underline uppercase tracking-tighter">Buka</button>
                </div>
              </div>
            </ResilienceCard>
          </div>

        </div>

        <div className="mt-16 sm:mt-24 flex flex-col items-center gap-2 opacity-25 text-foreground">
          <BarChart3 className="w-4 h-4" />
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">AMARTA Resilience Page</p>
        </div>

      </div>
    </AppLayout>
  );
};

export default ResiliencePage;