import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const ConsultationPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [experts, setExperts] = useState([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "CLINICAL PSYCHOLOGIST",
      rating: "4.9",
      image: "https://i.pravatar.cc/150?u=sarah",
      available: true,
      isBooked: localStorage.getItem("sarah_booked") === "true",
    },
    {
      id: 2,
      name: "Dr. Budi Santoso",
      role: "PSYCHIATRIST",
      rating: "4.8",
      image: "https://i.pravatar.cc/150?u=budi",
      available: true,
      isBooked: false,
    },
    {
      id: 3,
      name: "Ayu Pertiwi, M.Psi",
      role: "COUNSELING PSYCHOLOGIST",
      rating: "4.7",
      image: "https://i.pravatar.cc/150?u=ayu",
      available: false,
      isBooked: false,
    },
  ]);

  useEffect(() => {
    const perbaruiStatusBooking = () => {
      const statusSarah = localStorage.getItem("sarah_booked") === "true";
      setExperts((dataLama) =>
        dataLama.map((dokter) =>
          dokter.id === 1 ? { ...dokter, isBooked: statusSarah } : dokter
        )
      );
    };

    window.addEventListener("booking_status_changed", perbaruiStatusBooking);
    window.addEventListener("focus", perbaruiStatusBooking);

    return () => {
      window.removeEventListener("booking_status_changed", perbaruiStatusBooking);
      window.removeEventListener("focus", perbaruiStatusBooking);
    };
  }, []);

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] pt-6 pb-32">
        
        <div className="px-2 mb-6">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2 font-sans">
            Tenaga Ahli Tersedia
          </h2>
        </div>

        <div className="space-y-4 px-2">
          {experts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
              className={`p-4 rounded-[28px] border shadow-sm flex items-center justify-between transition-colors ${
                expert.isBooked 
                  ? "bg-[#076653]/5 border-[#076653]/20 dark:bg-white/5 dark:border-white/10" 
                  : "bg-white dark:bg-black/20 border-border/50"
              }`}
            >
              
              <div className="flex items-center gap-4 min-w-0 pr-2">
                <div className="relative shrink-0">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] object-cover shadow-inner border border-white/20"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                    expert.isBooked ? 'bg-[#076653]' : (expert.available ? 'bg-green-500' : 'bg-gray-400')
                  }`} />
                </div>
                
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-sm sm:text-base italic truncate text-foreground tracking-tight">
                    {expert.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider truncate mt-0.5">
                    {expert.role}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                    <span className="text-xs font-bold text-foreground/80">{expert.rating}</span>
                  </div>
                </div>
              </div>

              {expert.isBooked ? (
                <button
                  disabled
                  className="shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 rounded-[18px] text-[10px] font-bold shadow-sm font-sans bg-[#076653]/10 text-[#076653] dark:bg-white/10 dark:text-white/70 border border-[#076653]/20 dark:border-white/10 cursor-default"
                >
                  Telah Dibooking
                </button>
              ) : (
                <button
                  disabled={!expert.available}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/booking'); 
                  }} 
                  className={`shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 rounded-[18px] text-[11px] font-bold transition-transform active:scale-95 shadow-sm font-sans ${
                    expert.available
                      ? "bg-gradient-to-r from-[#076653] to-[#E3EF26] text-white hover:shadow-md hover:shadow-[#076653]/20"
                      : "bg-gray-400/80 dark:bg-gray-700 text-white cursor-not-allowed"
                  }`}
                >
                  {expert.available ? "Booking Sesi" : "Penuh"}
                </button>
              )}

            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 px-2"
        >
          <div className="p-5 bg-muted/40 dark:bg-white/5 rounded-[28px] border border-border/50 flex gap-4 items-start">
            <div className="p-3 bg-white dark:bg-black/40 rounded-2xl shadow-sm shrink-0">
              <CalendarCheck className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-sans mt-0.5">
              Sesi konsultasi AMARTA dirancang untuk privasi penuh. Semua data percakapan dienkripsi ujung-ke-ujung dan ditangani langsung oleh tenaga ahli bersertifikat.
            </p>
          </div>
        </motion.div>

      </div>
    </AppLayout>
  );
};

export default ConsultationPage;