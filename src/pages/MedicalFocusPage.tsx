import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Play, Square, RefreshCw, Zap, 
  Brain, Focus, BarChart3, Clock, CheckCircle2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

// DATA REKOMENDASI KEGIATAN DENGAN GAMBAR UNIK
const recommendations = [
  {
    id: 1,
    title: "Pernapasan Kotak (Box Breathing)",
    duration: "5 Menit",
    icon: Zap,
    // Gambar visualisasi fokus pada pernapasan tenang
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop",
    desc: "Tarik 4s, Tahan 4s, Hembus 4s, Tahan 4s. Teknik andalan Navy SEAL untuk menstabilkan detak jantung saat stres tinggi."
  },
  {
    id: 2,
    title: "Metode Grounding 5-4-3-2-1",
    duration: "3 Menit",
    icon: Focus,
    // Gambar visualisasi koneksi panca indera dengan alam/bumi
    img: "https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=800&q=80",
    desc: "Sebutkan 5 hal dilihat, 4 didengar, 3 disentuh, 2 dicium, 1 dirasa. Membawa pikiran kembali ke masa kini."
  },
  {
    id: 3,
    title: "Pemindaian Tubuh (Body Scan)",
    duration: "7 Menit",
    icon: Brain,
    // Gambar visualisasi relaksasi fisik total
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    desc: "Sadari ketegangan di setiap bagian tubuh dari kepala hingga kaki untuk merilis hormon stres secara alami."
  }
];

// KOMPONEN TIMER
const FocusTimer = () => {
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const totalTime = 300;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      if(interval) clearInterval(interval);
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const percentage = (secondsLeft / totalTime) * 100;

  return (
    <div className="p-8 sm:p-12 bg-gradient-to-br from-[#076653] to-[#0C342C] rounded-[50px] text-white relative overflow-hidden shadow-2xl border border-white/10 mb-12">
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-48 h-48 sm:w-60 sm:h-60 transform -rotate-90 drop-shadow-[0_0_15px_rgba(227,239,38,0.3)]">
            <circle cx="50%" cy="50%" r={90} fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/10" />
            <motion.circle 
              cx="50%" cy="50%" r={90} fill="transparent" stroke="#E3EF26" strokeWidth="12" 
              strokeDasharray={2 * Math.PI * 90}
              animate={{ strokeDashoffset: (1 - percentage / 100) * (2 * Math.PI * 90) }}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center pt-2">
            <span className="text-5xl sm:text-6xl font-black font-sans tracking-tighter text-white leading-none">{formatTime(secondsLeft)}</span>
            <span className="text-[10px] opacity-50 uppercase tracking-[0.3em] font-bold mt-2 text-white">Sisa Waktu</span>
          </div>
          {isActive && <div className="absolute inset-0 bg-[#E3EF26]/5 blur-[60px] rounded-full animate-pulse" />}
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
             <Clock className="w-3.5 h-3.5 text-[#E3EF26]" /> Sesi Aktif
          </div>
          <h2 className="text-4xl sm:text-6xl font-black mb-4 italic tracking-tight leading-none text-white">Tenangkan <br /> Pikiran</h2>
          <p className="text-sm leading-relaxed opacity-70 italic mb-10 max-w-sm text-white">Singkirkan gangguan sejenak. Fokus pada napas dan biarkan sistem AMARTA memandu pemulihan mental Anda.</p>
          <div className="flex gap-4">
            <button onClick={() => setIsActive(!isActive)} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90 ${isActive ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#E3EF26] text-black shadow-[#E3EF26]/20'} shadow-lg`}>
              {isActive ? <Square className="w-6 h-6 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>
            <button onClick={() => { setIsActive(false); setSecondsLeft(totalTime); }} className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 border border-white/20 hover:bg-white/20 active:scale-90 transition-all">
               <RefreshCw className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#E3EF26]/10 blur-[100px] rounded-full" />
    </div>
  );
};

// HALAMAN UTAMA
const MedicalFocusPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto w-full flex flex-col min-h-screen pt-12 pb-44 px-6 sm:px-12 overflow-x-hidden">
        
        {/* Header navigasi */}
        <div className="flex items-center gap-5 mb-10 relative z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="w-11 h-11 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/30 flex items-center justify-center text-foreground hover:bg-white/60 transition-all shadow-sm active:scale-90"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-foreground tracking-tight leading-none">Medical Focus</h1>
            <p className="text-[10px] sm:text-xs uppercase font-bold text-muted-foreground tracking-[0.2em] mt-2">Self-Regulation AMARTA AI</p>
          </div>
        </div>

        {/* Komponen Timer Utama */}
        <FocusTimer />

        {/* Bento Grid Rekomendasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendations.map((rec, i) => (
            <motion.div 
              key={rec.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1, duration: 0.5 }} 
              whileHover={{ y: -8 }}
              className="bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden group flex flex-col h-full"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={rec.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={rec.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-widest border border-white/10">
                   <rec.icon className="w-3 h-3 text-[#E3EF26]" /> {rec.duration}
                </div>
              </div>
              <div className="p-7 flex-1 flex flex-col relative z-10">
                <h4 className="text-base font-bold text-foreground mb-3 group-hover:text-[#076653] dark:group-hover:text-[#E3EF26] transition-colors">{rec.title}</h4>
                <p className="text-xs text-foreground/70 italic leading-relaxed mb-6 flex-1">{rec.desc}</p>
                <button className="w-full py-4 bg-[#076653]/10 border border-[#076653]/20 text-[#076653] dark:text-[#E3EF26] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#076653] hover:text-white transition-all shadow-sm active:scale-95">
                   Mulai Latihan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Footer info */}
        <div className="mt-24 mb-10 flex flex-col items-center gap-4 opacity-30 text-foreground relative z-10">
          <BarChart3 className="w-5 h-5" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Resilience Center</p>
        </div>

      </div>
    </AppLayout>
  );
};

export default MedicalFocusPage;