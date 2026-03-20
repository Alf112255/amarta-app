import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, Square, RefreshCw, Zap, 
  Brain, Focus, BarChart3, Clock, BellRing 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

const recommendations = [
  {
    id: 1,
    title: "Pernapasan Kotak (Box Breathing)",
    duration: 5,
    seconds: 300,
    icon: Zap,
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    desc: "Tarik 4 detik, tahan 4 detik, buang 4 detik, tahan 4 detik. Sangat efektif untuk menstabilkan detak jantung."
  },
  {
    id: 2,
    title: "Metode Grounding 5-4-3-2-1",
    duration: 3,
    seconds: 180,
    icon: Focus,
    img: "https://images.unsplash.com/photo-1518241353349-9b5650e2f5d7?auto=format&fit=crop&w=800&q=80",
    desc: "Sebutkan benda di sekitar Anda untuk membawa kesadaran penuh kembali ke masa kini dan meredakan panik."
  },
  {
    id: 3,
    title: "Pemindaian Tubuh (Body Scan)",
    duration: 7,
    seconds: 420,
    icon: Brain,
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    desc: "Relaksasi otot secara progresif dari ujung kaki hingga kepala untuk melepaskan beban stres fisik."
  }
];

const MedicalFocusPage = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(300);
  const [activeTitle, setActiveTitle] = useState("Sesi Fokus");
  const [isFinished, setIsFinished] = useState(false);

  const playCompletionSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Izin audio diperlukan", err));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
      playCompletionSound();
      setTimeout(() => setIsFinished(false), 5000);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const startExercise = (exercise: typeof recommendations[0]) => {
    setIsActive(false);
    setTotalTime(exercise.seconds);
    setSecondsLeft(exercise.seconds);
    setActiveTitle(exercise.title);
    setIsFinished(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setIsActive(true), 500);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const percentage = (secondsLeft / totalTime) * 100;

  return (
    <AppLayout>
      {/* pt-28 memastikan header tidak memotong konten di mobile */}
      <div className="max-w-6xl mx-auto w-full flex flex-col min-h-screen pt-28 pb-44 px-6 sm:px-28 overflow-x-hidden">
        
        <div className="flex items-center gap-5 mb-10 relative z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="w-11 h-11 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center text-foreground hover:bg-white/60 transition-all shadow-sm active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-foreground tracking-tight leading-none">Medical Focus</h1>
            <p className="text-[10px] sm:text-xs uppercase font-bold text-muted-foreground tracking-[0.2em] mt-2">Pusat Regulasi Mandiri Alifi</p>
          </div>
        </div>

        {/* HERO TIMER SECTION - Diberikan padding internal lebih agar lingkaran tidak terpotong */}
        <div className="p-10 sm:p-12 bg-gradient-to-br from-[#076653] to-[#0C342C] rounded-[50px] text-white relative overflow-hidden shadow-2xl border border-white/10 mb-16">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            
            <div className="relative flex items-center justify-center shrink-0">
              {/* Ukuran SVG disesuaikan agar pas di container mobile */}
              <svg className="w-52 h-52 sm:w-64 sm:h-64 transform -rotate-90 drop-shadow-[0_0_20px_rgba(227,239,38,0.2)]">
                <circle cx="50%" cy="50%" r="90" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <motion.circle 
                  cx="50%" cy="50%" r="90" fill="transparent" stroke="#E3EF26" strokeWidth={10} 
                  strokeDasharray={2 * Math.PI * 90}
                  animate={{ strokeDashoffset: (1 - percentage / 100) * (2 * Math.PI * 90) }}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <AnimatePresence mode="wait">
                  {isFinished ? (
                    <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-[#E3EF26]">
                      <BellRing className="w-10 h-10 mb-2 animate-bounce" />
                      <span className="text-xs font-bold uppercase tracking-widest">Selesai</span>
                    </motion.div>
                  ) : (
                    <motion.span key={secondsLeft} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="text-5xl sm:text-7xl font-black font-sans tracking-tighter text-white leading-none">
                      {formatTime(secondsLeft)}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isFinished && <span className="text-[10px] opacity-40 uppercase tracking-[0.3em] font-bold mt-3 text-white">Sisa Waktu</span>}
              </div>
              {isActive && <div className="absolute inset-0 bg-[#E3EF26]/5 blur-[70px] rounded-full animate-pulse" />}
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
              <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 text-white">
                 <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#E3EF26] animate-pulse' : 'bg-white/30'}`} /> {isActive ? "Latihan Sedang Berjalan" : "Siap Memulai"}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-4 italic tracking-tight leading-none text-white">{activeTitle}</h2>
              <p className="text-sm leading-relaxed opacity-70 italic mb-10 max-w-sm text-white text-balance">Ikuti instruksi visual dan pertahankan ritme tubuh Anda hingga sinyal bunyi terdengar.</p>
              
              <div className="flex gap-4">
                <button onClick={() => setIsActive(!isActive)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95 ${isActive ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#E3EF26] text-black shadow-[#E3EF26]/20'} shadow-lg`}>
                  {isActive ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                </button>
                <button onClick={() => { setIsActive(false); setSecondsLeft(totalTime); setIsFinished(false); }} className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 transition-all text-white">
                   <RefreshCw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#E3EF26]/10 blur-[120px] rounded-full pointer-events-none" />
        </div>

        {/* METODE SELECTION SECTION */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 px-1">Pilih Teknik Pemulihan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec, i) => (
              <motion.div 
                key={rec.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }} 
                whileHover={{ y: -10 }}
                className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[45px] shadow-sm overflow-hidden group flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={rec.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={rec.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                     <rec.icon className="w-3.5 h-3.5 text-[#E3EF26]" /> {rec.duration} MENIT
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col relative z-10">
                  <h4 className="text-lg font-bold text-foreground mb-3 group-hover:text-[#076653] dark:group-hover:text-[#E3EF26] transition-colors">{rec.title}</h4>
                  <p className="text-[12px] text-foreground/60 italic leading-relaxed mb-8 flex-1">{rec.desc}</p>
                  <button 
                    onClick={() => startExercise(rec)}
                    className="w-full py-4 bg-[#076653] text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#0C342C] transition-all shadow-lg shadow-[#076653]/20 active:scale-95"
                  >
                     Mulai Latihan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-24 mb-10 flex flex-col items-center gap-4 opacity-20 text-foreground relative z-10">
          <BarChart3 className="w-5 h-5" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Resilience Center v2.5</p>
        </div>

      </div>
    </AppLayout>
  );
};

export default MedicalFocusPage;