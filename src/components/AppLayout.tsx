import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageCircle, Mic, HeartPulse, Menu, X, ShieldCheck, Settings, LogOut, Sun, Moon, Maximize2, Minimize2, User, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Menerima referensi batas layar dari AppLayout
const ConsultationWidget = ({ dragBoundary }: { dragBoundary: React.RefObject<Element> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "chat">("booking");
  const [hasNotif, setHasNotif] = useState(true);

  useEffect(() => {
    const handleOpenWidget = (e: any) => {
      setIsOpen(true);
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab);
        if (e.detail.tab === "chat") setHasNotif(false);
      }
      if (e.detail?.expand) setIsExpanded(true);
    };

    window.addEventListener("open-consultation", handleOpenWidget);
    return () => window.removeEventListener("open-consultation", handleOpenWidget);
  }, []);

  const handleManualOpen = () => {
    setIsOpen(true);
    if (activeTab === "chat") setHasNotif(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute bottom-32 right-6 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={handleManualOpen}
              // --- PERBAIKAN DRAG ---
              drag
              dragConstraints={dragBoundary} // Menggunakan batas layar penuh
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-16 h-16 bg-gradient-to-br from-green-600 to-[#cc5833] backdrop-blur-xl border border-white/20 rounded-[24px] shadow-xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing transform-gpu will-change-transform"
            >
              <HeartPulse className="w-8 h-8 drop-shadow-md animate-pulse pointer-events-none" />
              {hasNotif && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center pointer-events-none">
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ 
              opacity: 1, scale: 1, y: 0,
              width: isExpanded ? "90vw" : "360px",
              height: isExpanded ? "80vh" : "550px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="pointer-events-auto absolute bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[35px] overflow-hidden flex flex-col transform-gpu will-change-transform max-w-[95vw]"
            style={{ 
              bottom: isExpanded ? "5vh" : "130px", 
              right: isExpanded ? "2.5vw" : "24px" 
            }}
          >
            <div className="p-4 sm:p-5 bg-white/10 dark:bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-green-500/20 flex items-center justify-center border border-white/20">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold italic font-sans tracking-tight">Konsultasi AMARTA</h3>
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Layanan Aktif</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/20 rounded-xl transition-colors hidden sm:block">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col font-sans">
              {activeTab === "booking" ? (
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                  <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Konfirmasi Jadwal Sesi</p>
                  <div className="p-4 sm:p-5 bg-white/30 dark:bg-white/5 rounded-[24px] sm:rounded-[28px] border border-white/20 space-y-4 shadow-sm">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-200 overflow-hidden shadow-inner border border-white/20 shrink-0">
                        <img src="https://i.pravatar.cc/100?u=sarah" alt="Dr" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold italic tracking-tight truncate">dr. Sarah Chen</h4>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase truncate">Psikolog Klinis</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                       <div className="p-2 sm:p-3 bg-white/30 dark:bg-black/20 rounded-xl sm:rounded-2xl border border-white/10">
                         <p className="text-[7px] sm:text-[8px] font-bold opacity-50 uppercase">Tanggal</p>
                         <p className="text-[9px] sm:text-[10px] font-bold italic">Besok, 19 Mar</p>
                       </div>
                       <div className="p-2 sm:p-3 bg-white/30 dark:bg-black/20 rounded-xl sm:rounded-2xl border border-white/10">
                         <p className="text-[7px] sm:text-[8px] font-bold opacity-50 uppercase">Waktu</p>
                         <p className="text-[9px] sm:text-[10px] font-bold italic">14:00 WIB</p>
                       </div>
                    </div>
                    <button className="w-full py-3 sm:py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-[16px] sm:rounded-[20px] text-[9px] sm:text-[10px] font-bold shadow-md active:scale-95 transition-transform">
                      KONFIRMASI BOOKING
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-hidden">
                   <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 scrollbar-hide pb-4">
                     {/* --- PERBAIKAN BENTO/CHAT BUBBLE ADAPTIF --- */}
                     <div className="flex flex-col items-start w-full max-w-[92%] sm:max-w-[85%]">
                       <div className="bg-white/50 dark:bg-white/10 p-3 sm:p-4 rounded-[18px] sm:rounded-[20px] rounded-bl-none border border-white/20 shadow-sm backdrop-blur-md">
                         <p className="leading-relaxed italic text-[11px] sm:text-[12px] break-words">
                           Halo Alifi, dr. Sarah di sini. Ada yang bisa saya bantu terkait hasil analisis suaramu hari ini?
                         </p>
                       </div>
                       <p className="text-[7px] sm:text-[8px] font-bold uppercase text-muted-foreground mt-1.5 ml-2 tracking-widest">Baru saja • dr. Sarah</p>
                     </div>
                   </div>
                   
                   <div className="mt-auto flex gap-2 items-center bg-white/30 dark:bg-black/20 p-1.5 sm:p-2 rounded-[20px] sm:rounded-[24px] border border-white/20 shadow-inner backdrop-blur-lg shrink-0">
                     <input 
                       type="text"
                       placeholder="Ketik balasanmu..."
                       className="flex-1 bg-transparent border-none px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] focus:outline-none placeholder:text-muted-foreground/80 font-sans"
                     />
                     <button className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-600 to-[#cc5833] rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-transform shrink-0">
                       <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                     </button>
                   </div>
                </div>
              )}
            </div>

            <div className="p-2 sm:p-3 flex gap-2 bg-white/5 border-t border-white/10 shrink-0">
              <button 
                onClick={() => setActiveTab("booking")}
                className={`flex-1 py-2.5 sm:py-3 rounded-[16px] sm:rounded-[20px] text-[9px] sm:text-[10px] font-bold transition-colors ${activeTab === "booking" ? "bg-foreground text-background shadow-md" : "hover:bg-white/10"}`}
              >
                BOOKING
              </button>
              <button 
                onClick={() => { setActiveTab("chat"); setHasNotif(false); }}
                className={`flex-1 py-2.5 sm:py-3 rounded-[16px] sm:rounded-[20px] text-[9px] sm:text-[10px] font-bold transition-colors ${activeTab === "chat" ? "bg-foreground text-background shadow-md" : "hover:bg-white/10"}`}
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

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- PERBAIKAN REFERENSI BATAS LAYAR ---
  // Ref ini diletakkan di root div agar mendeteksi lebar dan tinggi layar secara penuh
  const screenRef = useRef(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setIsDark(true);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsSidebarOpen(false);
      navigate("/auth");
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "voice", label: "Suara", icon: Mic, path: "/voice" },
    { id: "consult", label: "Konsul", icon: HeartPulse, path: "/consultation" },
  ];

  return (
    // Memasang screenRef di div paling luar yang mencakup min-h-screen
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col relative overflow-hidden" ref={screenRef}>
      <main className="pt-20 pb-36 px-4 sm:px-6 max-w-2xl mx-auto w-full flex-1 z-10 overflow-y-auto transform-gpu">
        {children}
      </main>

      {/* Melempar screenRef ke widget agar tau batas layarnya */}
      <ConsultationWidget dragBoundary={screenRef} />

      <div className="fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none transform-gpu will-change-transform">
        <nav className="bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[35px] p-2 flex items-center gap-1 shadow-xl pointer-events-auto transition-colors duration-300 max-w-full overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative px-4 sm:px-5 py-3 rounded-[28px] flex items-center gap-2 transition-colors duration-300 shrink-0 ${isActive ? "text-white" : "text-foreground/70 dark:text-white/60 hover:text-foreground"}`}
              >
                {isActive && (
                  <motion.div layoutId="navPill" className="absolute inset-0 bg-gradient-to-r from-green-600 to-[#cc5833] rounded-[28px] z-0" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                )}
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 z-10 ${isActive ? "scale-110 transition-transform" : ""}`} />
                {isActive && (
                  <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="text-[10px] sm:text-[11px] font-bold z-10 whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
          <div className="w-[1px] h-6 bg-foreground/20 dark:bg-white/20 mx-1 shrink-0" />
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 sm:p-3 text-foreground/70 dark:text-white/60 rounded-full transition-colors hover:bg-white/20 shrink-0">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3, ease: "easeOut" }} className="fixed right-0 top-0 bottom-0 w-[85vw] sm:w-80 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-l border-white/20 dark:border-white/10 z-[110] p-5 sm:p-6 shadow-2xl flex flex-col transform-gpu">
              <div className="flex justify-between items-center mb-10 sm:mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-[10px] sm:text-xs italic">A</span>
                  </div>
                  <h2 className="font-bold text-base sm:text-lg italic tracking-tight font-sans">Menu AMARTA</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/30 rounded-full transition-colors">
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 flex-1">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-3 sm:p-4 bg-white/40 dark:bg-white/10 hover:bg-white/50 rounded-[18px] sm:rounded-[20px] transition-colors border border-white/20">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />}
                    <span className="font-bold text-xs sm:text-sm tracking-tight">{isDark ? "Mode Gelap" : "Mode Terang"}</span>
                  </div>
                  <div className={`w-9 h-5 sm:w-10 sm:h-5 rounded-full relative transition-colors ${isDark ? "bg-green-600" : "bg-gray-300"}`}>
                    <motion.div animate={{ x: isDark ? 16 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </button>

                <div className="pt-3 sm:pt-4 space-y-2">
                  <button onClick={() => { navigate("/resilience"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-white/40 dark:hover:bg-white/10 rounded-[18px] sm:rounded-[20px] transition-colors group font-sans">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="font-bold text-xs sm:text-sm tracking-tight">Skor Ketahanan</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 sm:p-4 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-[18px] sm:rounded-[20px] transition-colors text-red-500 group font-sans">
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-bold text-xs sm:text-sm tracking-tight">Keluar Aplikasi</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto p-3 sm:p-4 border-t border-white/20 text-center">
                <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest font-sans font-bold">Amarta AI • Versi 1.0.4</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;