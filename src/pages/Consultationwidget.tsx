import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Maximize2, Minimize2, Calendar, 
  MessageCircle, User, HeartPulse, Send, ChevronRight 
} from "lucide-react";

const ConsultationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "chat">("booking");

  // LOGIKA PENGENDALI JARAK JAUH
  useEffect(() => {
    const handleOpenWidget = (e: any) => {
      setIsOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
      if (e.detail?.expand) setIsExpanded(true);
    };

    window.addEventListener("open-consultation", handleOpenWidget);
    return () => window.removeEventListener("open-consultation", handleOpenWidget);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Tombol Pemicu Utama (FAB) */}
      <div className="absolute bottom-32 right-6 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              layoutId="widget-container"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-gradient-to-br from-green-600 to-[#cc5833] backdrop-blur-xl border border-white/30 rounded-[24px] shadow-2xl flex items-center justify-center text-white"
            >
              <HeartPulse className="w-8 h-8 drop-shadow-md animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Jendela Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="widget-container"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isExpanded ? "90vw" : "360px",
              height: isExpanded ? "80vh" : "500px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto absolute bg-white/40 dark:bg-black/60 backdrop-blur-[40px] border border-white/40 dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.4)] rounded-[45px] overflow-hidden flex flex-col"
            style={{ 
              bottom: isExpanded ? "10vh" : "130px", 
              right: isExpanded ? "5vw" : "24px" 
            }}
          >
            {/* Header */}
            <div className="p-6 bg-white/20 dark:bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center border border-white/20">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold italic font-sans tracking-tight">Konsultasi AMARTA</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Sesi Aktif</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 font-sans">
              {activeTab === "booking" ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Konfirmasi Jadwal</p>
                  
                  {/* Contoh Item Booking Sesi */}
                  <div className="p-5 bg-white/40 dark:bg-white/5 rounded-[32px] border border-white/20 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200 overflow-hidden shadow-inner">
                        <img src="https://i.pravatar.cc/100?u=sarah" alt="Dr" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-tight italic">dr. Sarah Chen</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Psikolog Klinis • Sesi 60 Menit</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                       <div className="p-3 bg-white/30 rounded-2xl text-center border border-white/10">
                         <p className="text-[8px] font-bold opacity-50 uppercase">Tanggal</p>
                         <p className="text-[10px] font-bold italic">Besok, 19 Mar</p>
                       </div>
                       <div className="p-3 bg-white/30 rounded-2xl text-center border border-white/10">
                         <p className="text-[8px] font-bold opacity-50 uppercase">Waktu</p>
                         <p className="text-[10px] font-bold italic">14:00 WIB</p>
                       </div>
                    </div>

                    <button className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl text-[10px] font-bold shadow-xl active:scale-[0.98] transition-transform">
                      KONFIRMASI BOOKING SESI
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-end gap-3 text-[12px]">
                   <div className="bg-white/60 dark:bg-white/10 p-4 rounded-3xl rounded-bl-none self-start border border-white/20 max-w-[85%]">
                     <p className="leading-relaxed italic">Halo Alifi, ada yang bisa dibantu terkait hasil analisis suaramu hari ini?</p>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Tabs */}
            <div className="p-3 flex gap-2 bg-white/10 border-t border-white/10">
              <button 
                onClick={() => setActiveTab("booking")}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-bold transition-all ${activeTab === "booking" ? "bg-foreground text-background shadow-lg" : "hover:bg-white/20"}`}
              >
                BOOKING
              </button>
              <button 
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-3 rounded-2xl text-[10px] font-bold transition-all ${activeTab === "chat" ? "bg-foreground text-background shadow-lg" : "hover:bg-white/20"}`}
              >
                LIVE CHAT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultationWidget;