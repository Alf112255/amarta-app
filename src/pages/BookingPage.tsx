import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

// Fungsi pembantu untuk daftar hari
const generateUpcomingDays = () => {
  const days = [];
  const dayNames = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    days.push({
      id: i,
      dayName: dayNames[d.getDay()],
      date: d.getDate(),
      fullDate: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    });
  }
  return days;
};

const AVAILABLE_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00", "19:00"];
const UPCOMING_DAYS = generateUpcomingDays();

const BookingPage = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<number | null>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [complaint, setComplaint] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDay === null || !selectedTime || !complaint.trim()) return;
    
    setIsSuccess(true);
    
    const bookingData = {
      isBooked: true,
      dayName: UPCOMING_DAYS[selectedDay].dayName,
      date: UPCOMING_DAYS[selectedDay].date,
      time: selectedTime,
      complaint: complaint,
      queueNumber: "A-" + Math.floor(100 + Math.random() * 900) 
    };

    // Menyimpan data booking dan RESET status konfirmasi
    localStorage.setItem("booking_details", JSON.stringify(bookingData));
    localStorage.setItem("sarah_booked", "true");
    localStorage.setItem("sarah_confirmed", "false"); 
    
    window.dispatchEvent(new Event("booking_status_changed"));

    // LOGIKA OTOMATIS: Tunggu 2 detik lalu pindah & buka widget
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-consultation", { 
        detail: { tab: "booking" } 
      }));
      navigate(-1);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] pt-6 pb-56 relative overflow-x-hidden">
        
        {/* HEADER */}
        <div className="px-4 mb-6 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/40 dark:bg-black/20 border border-white/20 flex items-center justify-center text-foreground/80 hover:bg-white/60 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight italic font-sans">Jadwal Sesi</h1>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">dr. Sarah Chen</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="space-y-8">
          
          {/* PILIH TANGGAL */}
          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#076653]" />
              <h2 className="text-sm font-bold tracking-tight">Pilih Tanggal</h2>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x relative">
              {UPCOMING_DAYS.map((day, idx) => {
                const isSelected = selectedDay === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(idx)}
                    className={`relative snap-start shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-[20px] transition-all ${
                      !isSelected && "bg-white/40 dark:bg-white/5 border border-white/20 text-foreground"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-date-bg"
                        className="absolute inset-0 bg-gradient-to-br from-[#076653] to-[#E3EF26] rounded-[20px] shadow-lg shadow-[#076653]/20"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/80' : 'opacity-80'}`}>
                      {day.dayName}
                    </span>
                    <span className={`relative z-10 text-xl font-bold ${isSelected ? 'text-white' : ''}`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PILIH JAM */}
          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#cc5833]" />
              <h2 className="text-sm font-bold tracking-tight">Pilih Waktu Sesi</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_TIMES.map((time, idx) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`relative py-3 rounded-[16px] text-xs font-bold transition-all ${
                      !isSelected && "bg-white/30 dark:bg-black/20 border border-white/20 text-foreground"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="active-time-bg"
                        className="absolute inset-0 bg-gradient-to-br from-[#cc5833] to-[#e8813a] rounded-[16px] shadow-md shadow-[#cc5833]/30"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 ${isSelected ? 'text-white' : ''}`}>
                      {time} WIB
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* KELUHAN UTAMA */}
          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#076653]" />
              <h2 className="text-sm font-bold tracking-tight">Keluhan Utama</h2>
            </div>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Ceritakan sedikit apa yang sedang membebani pikiranmu..."
              rows={4}
              className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[24px] p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#076653]/50 transition-all resize-none placeholder:text-muted-foreground/60"
            />
          </div>

          {/* PRIVASI INFO */}
          <div className="px-4">
            <div className="flex items-start gap-3 p-4 rounded-[20px] bg-green-500/10 border border-green-500/20">
              <ShieldCheck className="w-5 h-5 text-[#076653] shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                Sesi ini 100% rahasia dan aman. Informasi hanya akan dibaca oleh tenaga ahli bersertifikat.
              </p>
            </div>
          </div>

          {/* TOMBOL SUBMIT */}
          <div className="px-4 pt-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={selectedDay === null || !selectedTime || !complaint.trim() || isSuccess}
              className="w-full py-4 rounded-[24px] font-bold text-sm text-black bg-gradient-to-r from-[#E3EF26] to-[#E2FBCE] shadow-lg shadow-[#E3EF26]/20 disabled:opacity-50 transition-all duration-300"
            >
              {isSuccess ? "Memproses..." : "Konfirmasi Sesi"}
            </motion.button>
          </div>

        </form>

        {/* MODAL SUKSES (TIDAK ADA TOMBOL, OTOMATIS PINDAH) */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[40px] flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 w-full max-w-sm"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#076653] to-[#E3EF26] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#076653]/30">
                  <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Booking Berhasil!</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Jadwal kamu sudah terkonfirmasi. Kamu akan dialihkan ke asisten AMARTA dalam 2 detik...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default BookingPage;