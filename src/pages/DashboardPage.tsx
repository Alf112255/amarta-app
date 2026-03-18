import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Tambahkan AnimatePresence
import { Mic, MessageCircle, BarChart3, AlertTriangle, Heart, Sun, Moon } from "lucide-react"; // Tambahkan Moon
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Friend";

  const completionValue = 75; 
  const chartData = [
    { name: 'Done', value: completionValue },
    { name: 'Remaining', value: 100 - completionValue },
  ];

  const moods = [
    { emoji: "😊", label: "Senang" },
    { emoji: "😐", label: "Biasa" },
    { emoji: "😔", label: "Sedih" },
    { emoji: "😰", label: "Cemas" },
    { emoji: "😡", label: "Marah" },
  ];

  const cards = [
    {
      title: t("dashboard.voice"),
      desc: t("dashboard.voice.desc"),
      icon: Mic,
      path: "/voice",
      gradient: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      title: t("dashboard.chat"),
      desc: t("dashboard.chat.desc"),
      icon: MessageCircle,
      path: "/chat",
      gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      title: "Skor Ketahanan",
      desc: "Pantau progres kesehatan mental Anda",
      icon: BarChart3,
      path: "/resilience",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    },
    {
      title: "Peringatan Dini",
      desc: "Pantau sinyal kesehatan mental",
      icon: AlertTriangle,
      path: "/alerts",
      gradient: "bg-gradient-to-br from-[#cc5833] to-[#8c3d24]",
    },
  ];

  return (
    <AppLayout>
      {/* Animasi Transisi Halaman/Mode */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="max-w-2xl mx-auto space-y-6 pb-10 px-4"
      >
        {/* Greeting */}
        <div className="space-y-1 pt-4 text-left">
          <h1 className="text-2xl font-bold text-foreground transition-colors duration-500">Hi, {firstName} 🌿</h1>
          <p className="text-muted-foreground text-sm transition-colors duration-500">Mari kita jalani hari ini dengan penuh penerimaan.</p>
        </div>

        {/* --- NRIMO TRACKER --- */}
        <div 
          className="rounded-[40px] flex flex-col p-6 relative overflow-hidden min-h-[380px] shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-500"
          style={{ backgroundImage: "url('/nrimo-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-black/15 pointer-events-none transition-opacity duration-500 dark:bg-black/30" />
          <div className="flex justify-between items-start w-full z-20 mb-2">
            <div className="text-left">
              <h2 className="text-white font-bold text-lg drop-shadow-md">Nrimo Tracker</h2>
              <p className="text-white/80 text-[10px] drop-shadow-sm font-medium">Pantau ketenanganmu hari ini</p>
            </div>
            
            {/* Widget Cuaca dengan Animasi Ikon */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2 flex items-center gap-2">
              <div className="relative w-4 h-4">
                <Sun className="w-4 h-4 text-yellow-300 absolute transition-all duration-700 dark:rotate-90 dark:scale-0 dark:opacity-0" />
                <Moon className="w-4 h-4 text-blue-200 absolute transition-all duration-700 rotate-[-90deg] scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
              </div>
              <div className="text-left font-medium text-white">
                <p className="text-[11px] leading-none">28°C</p>
                <p className="text-[8px] leading-none mt-1 opacity-70">Cerah, Jogja</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center relative z-10">
            <div className="h-60 w-60 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="sageGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#008c6b" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#01451a" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} dataKey="value" startAngle={90} endAngle={-270} stroke="none" cornerRadius={12}>
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? "url(#sageGrad)" : "rgba(255,255,255,0.2)"} className="transition-all duration-700" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div className="w-[130px] h-[130px] rounded-full flex flex-col items-center justify-center px-4 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-xl transition-all duration-500">
                  <p className="text-white font-medium text-[10px] leading-tight drop-shadow-md">
                    Teruslah berproses dan kamu akan <br/>
                    <span className="text-green-300 dark:text-green-400 font-bold text-[11px] transition-colors duration-500">bercahaya!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MOOD TRACKER HORIZONTAL --- */}
        <div className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] shadow-sm transition-all duration-500">
          <div className="flex items-center justify-between mb-4 px-1 text-left">
            <p className="text-sm font-semibold text-foreground transition-colors duration-500">Apa perasaanmu?</p>
            <AnimatePresence mode="wait">
              {selectedMood !== null && (
                <motion.span 
                  key={selectedMood}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50 px-3 py-1 rounded-full transition-colors duration-500"
                >
                  {moods[selectedMood].label}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-around gap-1">
            {moods.map((m, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMood(i)}
                className={`relative flex-1 flex flex-col items-center justify-center p-3 rounded-[20px] transition-all duration-500 ${
                  selectedMood === i 
                    ? "bg-green-100/70 dark:bg-green-900/40 border-green-200 dark:border-green-700 shadow-inner" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
                }`}
              >
                <span className="text-3xl z-10 relative mb-1.5">{m.emoji}</span>
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  selectedMood === i ? "bg-green-600 dark:bg-green-400 scale-125" : "bg-gray-200 dark:bg-gray-600"
                }`} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(card.path)} 
              className="p-5 text-left transition-all duration-500 flex flex-col items-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[32px] shadow-sm hover:shadow-md"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${card.gradient}`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-foreground dark:text-gray-100 transition-colors duration-500">{card.title}</h3>
              <p className="text-[10px] text-muted-foreground dark:text-gray-400 mt-1 leading-tight transition-colors duration-500">{card.desc}</p>
            </button>
          ))}
        </div>

        {/* Wellness Tip */}
        <div className="border border-green-100 dark:border-green-900/30 bg-green-50/20 dark:bg-green-900/10 p-5 rounded-[32px] text-left transition-all duration-500">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0 transition-colors duration-500" />
            <div>
              <p className="text-sm font-medium text-foreground dark:text-gray-100 italic transition-colors duration-500">Nrimo ing Pandum</p>
              <p className="text-[11px] text-muted-foreground dark:text-gray-400 mt-1 leading-relaxed transition-colors duration-500">
                "Menerima apa yang ada dengan ikhlas adalah langkah awal menuju ketenangan jiwa."
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default DashboardPage;