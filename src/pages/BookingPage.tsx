import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock, FileText, ShieldCheck, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

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
  const [isBookingCancelled, setIsBookingCancelled] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

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

    localStorage.setItem("booking_details", JSON.stringify(bookingData));
    localStorage.setItem("sarah_booked", "true");
    localStorage.setItem("sarah_confirmed", "false"); 
    
    window.dispatchEvent(new Event("booking_status_changed"));

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-consultation", { 
        detail: { tab: "chat" }
      }));
      navigate(-1);
    }, 2000);
  };

  const handleCancelBooking = () => {
    setShowCancelConfirmation(false);
    setIsBookingCancelled(true);

    // Proses pembersihan data dilakukan di sini
    localStorage.removeItem("booking_details");
    localStorage.setItem("sarah_booked", "false");
    window.dispatchEvent(new Event("booking_status_changed"));

    // Navigasi otomatis keluar setelah animasi sukses muncul
    setTimeout(() => {
      setIsBookingCancelled(false);
      navigate(-1);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="flex flex-col min-h-[calc(100vh-6rem)] pt-6 pb-56 relative overflow-x-hidden">
        
        <div className="px-4 mb-6 flex items-center gap-4 relative z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-white/40 dark:bg-black/20 border border-white/20 flex items-center justify-center text-foreground/80 hover:bg-white/60 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight italic font-sans text-foreground truncate">Jadwal Sesi</h1>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5 truncate">dr. Sarah Chen</p>
          </div>
          <button 
            type="button" 
            onClick={() => setShowCancelConfirmation(true)}
            className="px-4 py-2 bg-red-100 text-red-500 rounded-[16px] text-[10px] font-bold tracking-widest uppercase shadow active:scale-95 transition-transform"
          >
            Batal
          </button>
        </div>

        <form onSubmit={handleBooking} className="space-y-8 flex-1">
          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#076653]" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Pilih Tanggal</h2>
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x relative">
              {UPCOMING_DAYS.map((day, idx) => {
                const isSelected = selectedDay === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(idx)}
                    className={`relative snap-start shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-[20px] transition-all duration-300 ${
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
                    <span className={`relative z-10 text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/80' : 'opacity-80 text-foreground'}`}>
                      {day.dayName}
                    </span>
                    <span className={`relative z-10 text-xl font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {day.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#cc5833]" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Pilih Waktu Sesi</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_TIMES.map((time, idx) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`relative py-3 rounded-[16px] text-xs font-bold transition-all duration-300 ${
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
                    <span className={`relative z-10 ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {time} WIB
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 px-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#076653]" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Keluhan Utama</h2>
            </div>
            <textarea
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Ceritakan sedikit apa yang sedang membebani pikiranmu..."
              rows={4}
              className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-[24px] p-5 text-sm focus:outline-none focus:ring-2 focus:ring-[#076653]/50 transition-all resize-none text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="px-4">
            <div className="flex items-start gap-3 p-4 rounded-[20px] bg-green-500/10 border border-green-500/20">
              <ShieldCheck className="w-5 h-5 text-[#076653] shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground font-medium">
                Sesi ini 100% rahasia dan aman. Informasi hanya akan dibaca oleh tenaga ahli bersertifikat.
              </p>
            </div>
          </div>

          <div className="px-4 pt-4 mt-auto">
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

        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.2 }}
                className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[40px] flex flex-col items-center justify-center text-center shadow-2xl border border-white/20 w-full max-w-sm"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#076653] to-[#E3EF26] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#076653]/30">
                  <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">Booking Berhasil</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-6 px-4">
                  Mengalihkan kamu ke asisten konsultasi untuk konfirmasi akhir. Harap tunggu...
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="h-1 bg-gradient-to-r from-[#076653] to-[#E3EF26] rounded-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCancelConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md px-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-[#1C1C1E] p-8 rounded-[36px] flex flex-col items-center text-center shadow-2xl border border-white/20 w-full max-w-xs"
              >
                <AlertCircle className="w-10 h-10 text-red-500 mb-6" strokeWidth={1.5} />
                <h3 className="text-sm font-bold mb-2 text-foreground">Batalkan Pendaftaran?</h3>
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-8 px-2">
                  Apakah kamu yakin ingin membatalkan sesi konsultasi ini? Data yang sudah diisi akan terhapus.
                </p>
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setShowCancelConfirmation(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-[16px] text-[10px] font-bold tracking-widest uppercase active:scale-95 transition-transform"
                  >
                    Tidak
                  </button>
                  <button 
                    onClick={handleCancelBooking}
                    className="flex-1 py-3 bg-red-500 text-white rounded-[16px] text-[10px] font-bold tracking-widest uppercase shadow-md shadow-red-500/20 active:scale-95 transition-transform"
                  >
                    Ya, Batal
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isBookingCancelled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-xl px-6"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div 
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mb-6"
                >
                  <X className="w-12 h-12 text-red-500" strokeWidth={1.5} />
                </motion.div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-1.5">Pembatalan Berhasil</h2>
                <p className="text-[11px] font-medium text-white/70 uppercase tracking-widest">Sesi konsultasi telah dihapus dari sistem.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default BookingPage;