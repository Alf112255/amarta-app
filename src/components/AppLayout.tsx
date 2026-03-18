import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, MessageSquare, Star, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

const ConsultationPage = () => {
  const { t } = useLanguage();

  const triggerConsultation = (tab: "booking" | "chat") => {
    const event = new CustomEvent("open-consultation", { 
      detail: { tab: tab } 
    });
    window.dispatchEvent(event);
  };

  const professionals = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Clinical Psychologist",
      rating: 4.9,
      available: true,
      image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Dr. Budi Santoso",
      specialty: "Psychiatrist",
      rating: 4.8,
      available: true,
      image: "https://i.pravatar.cc/150?u=budi"
    },
    {
      name: "Ayu Pertiwi, M.Psi",
      specialty: "Counseling Psychologist",
      rating: 4.7,
      available: false,
      image: "https://i.pravatar.cc/150?u=ayu"
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-10 px-2 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight italic">
            {t("consult.title")}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-sans leading-relaxed max-w-md">
            {t("consult.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: Video, label: "Video Call", color: "from-blue-500/20 to-cyan-400/10", tab: "chat" as const },
            { icon: MessageSquare, label: "Text Chat", color: "from-green-500/20 to-emerald-400/10", tab: "chat" as const },
          ].map((type) => (
            <motion.div
              key={type.label}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerConsultation(type.tab)}
              className="relative overflow-hidden p-4 sm:p-6 md:p-8 rounded-[28px] md:rounded-[40px] border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-2xl shadow-xl cursor-pointer group transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-white/50 dark:bg-black/20 rounded-xl sm:rounded-2xl shadow-inner border border-white/40">
                  <type.icon className="w-6 h-6 sm:w-8 sm:h-8 text-foreground group-hover:text-green-600 transition-colors" />
                </div>
                <p className="text-center text-[9px] sm:text-[10px] md:text-xs font-bold tracking-tight uppercase tracking-widest break-words w-full">{type.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Tenaga Ahli Tersedia</p>
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          </div>

          {professionals.map((prof, i) => (
            <motion.div
              key={prof.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, ease: "easeOut" }}
              className="relative overflow-hidden p-4 sm:p-5 bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-[28px] sm:rounded-[32px] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 group hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-500"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-lg">
                    <img src={prof.image} alt={prof.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {prof.available && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm sm:text-md tracking-tight italic break-words">{prof.name}</p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-tight break-words">{prof.specialty}</p>
                  <div className="flex items-center gap-1.5 mt-2 p-1.5 bg-white/40 dark:bg-white/5 rounded-lg w-fit border border-white/20">
                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                    <span className="text-[9px] sm:text-[10px] font-bold">{prof.rating}</span>
                  </div>
                </div>
              </div>

              <Button
                variant={prof.available ? "default" : "secondary"}
                disabled={!prof.available}
                onClick={() => triggerConsultation("booking")}
                className={`w-full sm:w-auto mt-2 sm:mt-0 rounded-2xl px-6 font-bold text-xs h-12 transition-all duration-500 shrink-0 ${
                  prof.available 
                  ? "bg-gradient-to-r from-green-600 to-[#cc5833] hover:shadow-lg hover:shadow-green-900/20 active:scale-95" 
                  : "opacity-40"
                }`}
              >
                {prof.available ? t("consult.book") : "Penuh"}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="p-5 sm:p-6 bg-muted/20 dark:bg-white/5 border border-border/50 rounded-[28px] sm:rounded-[35px] flex items-start gap-4 transition-all">
          <div className="p-2 bg-white/40 dark:bg-white/10 rounded-xl shrink-0">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed font-sans">
            Sesi konsultasi AMARTA dirancang untuk privasi penuh. Semua data percakapan dienkripsi ujung-ke-ujung sesuai standar HIPAA.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ConsultationPage;