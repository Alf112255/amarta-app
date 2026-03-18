import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageCircle, Mic, HeartPulse, Menu, X, ShieldCheck, Settings, LogOut, Sun, Moon, Maximize2, Minimize2, User, ChevronRight, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ConsultationWidget = () => {
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
              layoutId="widget-container"
              onClick={handleManualOpen}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative w-16 h-16 bg-gradient-to-br from-green-600 to-[#cc5833] backdrop-blur-[48px] backdrop-saturate-[180%] border border-white/30 rounded-[24px] shadow-2xl flex items-center justify-center text-white"
            >
              <HeartPulse className="w-8 h-8 drop-shadow-md animate-pulse" />
              {hasNotif && (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                </motion.div>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="widget-container"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ 
              opacity: 1, scale: 1, y: 0,
              width: isExpanded ? "90vw" : "360px",
              height: isExpanded ? "80vh" : "550px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto absolute bg-white/10 dark:bg-black/20 backdrop-blur-[48px] backdrop-saturate-[180%] border border-white/20 dark:border-white/10 shadow-[0_32px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.6)] rounded-[45px] overflow-hidden flex flex-col"
            style={{ 
              bottom: isExpanded ? "10vh" : "130px", 
              right: isExpanded ? "5vw" : "24px" 
            }}
          >
            <div className="p-6 bg-white/10 dark:bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-500/20 flex items-center justify-center border border-white/20">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold italic font-sans tracking-tight">Konsultasi AMARTA</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Layanan Aktif</p>
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

            <div className="flex-1 overflow-hidden flex flex-col font-sans">
              {activeTab === "booking" ? (
                <div className="p-6 overflow-y-auto space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Konfirmasi Jadwal Sesi</p>
                  <div className="p-5 bg-white/20 dark:bg-white/5 rounded-[32px] border border-white/20 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200 overflow-hidden shadow-inner border border-white/20">
                        <img src="https://i.pravatar.cc/100?u=sarah" alt="Dr" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold italic tracking-tight">dr. Sarah Chen</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Psikolog Klinis</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                       <div className="p-3 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/10">
                         <p className="text-[8px] font-bold opacity-50 uppercase">Tanggal</p>
                         <p className="text-[10px] font-bold italic">Besok, 19 Mar</p>
                       </div>
                       <div className="p-3 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/10">
                         <p className="text-[8px] font-bold opacity-50 uppercase">Waktu</p>
                         <p className="text-[10px] font-bold italic">14:00 WIB</p>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-[22px] text-[10px] font-bold shadow-xl active:scale-95 transition-all">
                      KONFIRMASI BOOKING SEKARANG
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                   <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide pb-4">
                     <div className="flex flex-col items-start max-w-[85%]">
                       <div className="bg-white/40 dark:bg-white/10 p-4 rounded-[24px] rounded-bl-none border border-white/30 shadow-sm backdrop-blur-md">
                         <p className="leading-relaxed italic text-[12px]">
                           Halo Alifi, dr. Sarah di sini. Ada yang bisa saya bantu terkait hasil analisis suaramu hari ini?
                         </p>
                       </div>
                       <p className="text-[8px] font-bold uppercase text-muted-foreground mt-2 ml-2 tracking-widest">Baru saja • dr. Sarah</p>
                     </div>
                   </div>
                   <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className="mt-auto flex gap-2 items-center bg-white/20 dark:bg-black/20 p-2 rounded-[28px] border border-white/30 shadow-inner backdrop-blur-xl shrink-0"
                   >
                     <input 
                       type="text"
                       placeholder="Ketik balasanmu..."
                       className="flex-1 bg-transparent border-none px-4 py-2 text-[11px] focus:outline-none placeholder:text-muted-foreground/80 font-sans"
                     />
                     <motion.button 
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       className="w-10 h-10 bg-gradient-to-br from-green-600 to-[#cc5833] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-900/20 shrink-0"
                     >
                       <Send className="w-4 h-4" />
                     </motion.button>
                   </motion.div>
                </div>
              )}
            </div>

            <div className="p-3 flex gap-2 bg-white/5 border-t border-white/10 shrink-0">
              <button 
                onClick={() => setActiveTab("booking")}
                className={`flex-1 py-3.5 rounded-[22px] text-[10px] font-bold transition-all ${activeTab === "booking" ? "bg-foreground text-background shadow-lg" : "hover:bg-white/10"}`}
              >
                BOOKING
              </button>
              <button 
                onClick={() => { setActiveTab("chat"); setHasNotif(false); }}
                className={`flex-1 py-3.5 rounded-[22px] text-[10px] font-bold transition-all ${activeTab === "chat" ? "bg-foreground text-background shadow-lg" : "hover:bg-white/10"}`}
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans flex flex-col relative overflow-hidden">
      <main className="pt-20 pb-36 px-6 max-w-2xl mx-auto w-full flex-1 z-10 overflow-y-auto">
        {children}
      </main>

      <ConsultationWidget />

      <div className="fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="bg-white/10 dark:bg-black/20 backdrop-blur-[48px] backdrop-saturate-[180%] border border-white/20 dark:border-white/10 rounded-[40px] p-2 flex items-center gap-1 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] pointer-events-auto transition-all duration-500">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative px-5 py-3 rounded-[32px] flex items-center gap-2 transition-all duration-500 ${isActive ? "text-white" : "text-foreground/60 dark:text-white/50 hover:text-foreground"}`}
              >
                {isActive && (
                  <motion.div layoutId="navPill" className="absolute inset-0 bg-gradient-to-r from-green-600 to-[#cc5833] rounded-[32px] z-0" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                <item.icon className={`w-5 h-5 z-10 transition-transform ${isActive ? "scale-110" : ""}`} />
                {isActive && (
                  <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-[11px] font-bold z-10 whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
          <div className="w-[1px] h-6 bg-foreground/20 dark:bg-white/20 mx-1" />
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 text-foreground/60 dark:text-white/50 rounded-full transition-all hover:bg-white/10">
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }} className="fixed right-0 top-0 bottom-0 w-80 bg-white/40 dark:bg-black/40 backdrop-blur-[48px] backdrop-saturate-[180%] border-l border-white/20 dark:border-white/10 z-[110] p-6 shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs italic">A</span>
                  </div>
                  <h2 className="font-bold text-lg italic tracking-tight font-sans">Menu AMARTA</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 flex-1">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 bg-white/20 dark:bg-white/5 hover:bg-white/30 rounded-[24px] transition-all border border-white/20">
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <span className="font-bold text-sm tracking-tight">{isDark ? "Mode Gelap" : "Mode Terang"}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? "bg-green-600" : "bg-gray-300"}`}>
                    <motion.div animate={{ x: isDark ? 20 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </button>

                <div className="pt-4 space-y-2">
                  <button onClick={() => { navigate("/resilience"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 p-4 hover:bg-white/30 dark:hover:bg-white/10 rounded-[20px] transition-all group font-sans">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-sm tracking-tight">Skor Ketahanan</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-[20px] transition-all text-red-500 group font-sans">
                    <LogOut className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight">Keluar Aplikasi</span>
                  </button>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-white/20 text-center">
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-sans font-bold">Amarta AI • Versi 1.0.4</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;