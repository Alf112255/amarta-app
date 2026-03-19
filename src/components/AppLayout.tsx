import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageCircle, Mic, HeartPulse, Menu, X, ShieldCheck, LogOut, Sun, Moon, Maximize2, Minimize2, User, Send, MoreHorizontal, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ConsultationWidget = ({ dragBoundary }: { dragBoundary: React.RefObject<Element> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "chat">("booking");
  const [isConfirming, setIsConfirming] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "doctor", text: "Halo Alifi, dr. Sarah di sini. Ada yang bisa saya bantu?", time: "Baru saja" }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadBookingData = () => {
    const saved = localStorage.getItem("booking_details");
    if (saved) {
      setBookingData(JSON.parse(saved));
    } else {
      setBookingData(null);
    }
  };

  useEffect(() => {
    loadBookingData();
    window.addEventListener("booking_status_changed", loadBookingData);
    window.addEventListener("open-consultation", (e: any) => {
      setIsOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    });
    return () => {
      window.removeEventListener("booking_status_changed", loadBookingData);
    };
  }, []);

  const handleConfirmSession = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      localStorage.setItem("sarah_booked", "false"); 
      localStorage.removeItem("booking_details");
      setBookingData(null);
      window.dispatchEvent(new Event("booking_status_changed"));
      setActiveTab("chat"); 
    }, 2500);
  };

  const finalCancel = () => {
    localStorage.removeItem("sarah_booked");
    localStorage.removeItem("booking_details");
    setBookingData(null);
    window.dispatchEvent(new Event("booking_status_changed"));
    setShowCancelPrompt(false);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute bottom-32 right-6 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              drag dragConstraints={dragBoundary} dragMomentum={false} 
              className="relative w-14 h-14 bg-gradient-to-br from-[#076653] to-[#E3EF26] backdrop-blur-xl border border-white/20 rounded-[22px] shadow-xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing"
            >
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              width: isExpanded ? "90vw" : "360px", 
              height: isExpanded ? "80vh" : "540px" 
            }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="pointer-events-auto absolute bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl rounded-[35px] overflow-hidden flex flex-col transform-gpu"
            style={{ 
              bottom: isExpanded ? "5vh" : "110px", 
              right: isExpanded ? "2.5vw" : "24px" 
            }}
          >
            <div className="p-4 sm:p-5 bg-white/20 dark:bg-white/5 border-b border-white/20 flex items-center justify-between shrink-0 relative z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#076653] flex items-center justify-center shadow-lg"><User className="w-5 h-5 text-white" /></div>
                <h3 className="text-xs sm:text-sm font-bold italic font-sans text-foreground">Konsultasi AMARTA</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="w-9 h-9 flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 rounded-full transition-all hidden sm:flex">{isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>
                <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-all"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col font-sans relative">
              {activeTab === "booking" ? (
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 h-full flex flex-col">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-1">Konfirmasi Jadwal Sesi</p>
                  
                  {bookingData ? (
                    <div className="relative p-4 sm:p-5 bg-white/50 dark:bg-black/30 rounded-[28px] border border-white/40 dark:border-white/10 space-y-4 shadow-sm overflow-hidden">
                      <AnimatePresence>
                        {showCancelPrompt && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-white/95 dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center p-6">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4"><AlertCircle className="w-6 h-6 text-red-500" /></div>
                            <h4 className="text-xs font-bold mb-4 text-foreground">Apakah anda ingin membatalkan sesi konsultasi?</h4>
                            <div className="flex gap-2 w-full">
                              <button onClick={() => setShowCancelPrompt(false)} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-black/5 text-foreground">KEMBALI</button>
                              <button onClick={finalCancel} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-red-500 text-white shadow-lg shadow-red-500/20">BATALKAN</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-3">
                        <img src="https://i.pravatar.cc/100?u=sarah" className="w-10 h-10 rounded-2xl border border-white/40 shadow-inner" alt="Doc" />
                        <div className="min-w-0"><h4 className="text-xs sm:text-sm font-bold italic truncate text-foreground">dr. Sarah Chen</h4><p className="text-[9px] text-muted-foreground font-bold uppercase">Psikolog Klinis</p></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-bold">
                        <div className="p-2 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20 text-foreground"><p className="opacity-50 uppercase text-[7px] mb-0.5">Tanggal</p>{bookingData.dayName}, {bookingData.date} Mar</div>
                        <div className="p-2 bg-white/40 dark:bg-white/5 rounded-xl border border-white/20 text-foreground"><p className="opacity-50 uppercase text-[7px] mb-0.5">Waktu</p>{bookingData.time} WIB</div>
                      </div>

                      <div className="bg-white/40 dark:bg-white/5 p-3 rounded-[20px] border border-white/20 space-y-2">
                        <div className="flex justify-between items-center"><span className="text-[8px] font-bold opacity-60 uppercase text-foreground">Antrian</span><span className="text-xs font-bold text-[#076653] dark:text-[#E3EF26]">{bookingData.queueNumber}</span></div>
                        <p className="text-[10px] italic text-foreground/80 line-clamp-2">"{bookingData.complaint}"</p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setShowCancelPrompt(true)} className="flex-1 py-3 rounded-[14px] text-[9px] font-bold border border-red-500/20 text-red-500 hover:bg-red-500/10">BATALKAN</button>
                        <button onClick={handleConfirmSession} className="flex-1 py-3 bg-[#076653] text-white dark:bg-white dark:text-black rounded-[14px] text-[9px] font-bold shadow-md">KONFIRMASI</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                      <div className="w-14 h-14 bg-muted/20 rounded-full flex items-center justify-center mb-4 border border-dashed border-muted-foreground/30"><Calendar className="w-6 h-6 text-muted-foreground/30" /></div>
                      <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest">Tidak Ada Jadwal Aktif</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-4 sm:p-5 overflow-hidden h-full">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide pb-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] p-3 rounded-[18px] shadow-sm ${msg.sender === "user" ? "bg-[#076653] text-white rounded-br-none" : "bg-white/60 dark:bg-white/10 border border-white/30 rounded-bl-none text-foreground"}`}><p className="leading-relaxed italic text-[11px]">{msg.text}</p></div>
                        <p className="text-[7px] font-bold uppercase text-muted-foreground mt-1.5 tracking-widest">{msg.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-2 sm:p-3 flex gap-2 bg-white/20 dark:bg-white/5 border-t border-white/20 shrink-0">
              <button onClick={() => setActiveTab("booking")} className={`flex-1 py-2.5 rounded-[16px] text-[9px] font-bold transition-all ${activeTab === "booking" ? "bg-foreground text-background shadow-md" : "text-foreground hover:bg-black/5"}`}>BOOKING</button>
              <button onClick={() => setActiveTab("chat")} className={`flex-1 py-2.5 rounded-[16px] text-[9px] font-bold transition-all ${activeTab === "chat" ? "bg-foreground text-background shadow-md" : "text-foreground hover:bg-black/5"}`}>LIVE CHAT</button>
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
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "voice", label: "Suara", icon: Mic, path: "/voice" },
    { id: "consult", label: "Konsul", icon: HeartPulse, path: "/consultation" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans flex flex-col relative overflow-hidden" ref={screenRef}>
      <main className="absolute inset-0 w-full z-10 overflow-y-auto transform-gpu flex flex-col">{children}</main>
      
      <ConsultationWidget dragBoundary={screenRef} />
      
      <div className="fixed bottom-5 left-0 right-0 z-50 px-4 flex justify-center items-center gap-3 sm:gap-6 pointer-events-none transform-gpu">
        <nav className="relative bg-white/70 dark:bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[32px] px-3 py-2 flex items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.15)] pointer-events-auto transition-all duration-300">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center gap-1 w-[68px] sm:w-[80px] py-2 rounded-[20px] transition-colors duration-300 ${
                  isActive ? "text-white dark:text-black" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-capsule"
                    className="absolute inset-0 rounded-[20px] z-0 bg-gradient-to-r from-[#076653] to-[#E3EF26] dark:from-[#E3EF26] dark:to-[#E2FBCE]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <item.icon className="w-5 h-5 z-10" fill="none" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-bold tracking-tight z-10 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="w-[56px] h-[56px] shrink-0 rounded-full bg-white/70 dark:bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex items-center justify-center text-gray-700 dark:text-gray-300 pointer-events-auto transition-transform active:scale-90"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 bottom-0 w-[85vw] sm:w-80 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-l border-white/20 z-[110] p-5 flex flex-col">
              <div className="flex justify-between items-center mb-10"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-[#076653] rounded-lg flex items-center justify-center text-white font-bold text-xs italic">A</div><h2 className="font-bold text-base italic tracking-tight font-sans">Menu AMARTA</h2></div><button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-black/5 rounded-full"><X className="w-5 h-5" /></button></div>
              <div className="space-y-3 flex-1">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-[18px] border border-gray-200 shadow-sm"><div className="flex items-center gap-3">{isDark ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-yellow-500" />}<span className="font-bold text-xs">{isDark ? "Mode Gelap" : "Mode Terang"}</span></div><div className={`w-9 h-5 rounded-full relative transition-colors ${isDark ? "bg-[#076653]" : "bg-gray-300"}`}><motion.div animate={{ x: isDark ? 16 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" /></div></button>
                <div className="pt-3 space-y-2"><button onClick={() => { navigate("/resilience"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-[18px] transition-colors"><ShieldCheck className="w-4 h-4 text-[#076653]" /><span className="font-bold text-xs">Skor Ketahanan</span></button><button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-50 rounded-[18px] text-red-500 transition-colors"><LogOut className="w-4 h-4" /><span className="font-bold text-xs">Keluar Aplikasi</span></button></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;