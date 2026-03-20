import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, MessageCircle, Mic, HeartPulse, Menu, X, ShieldCheck, 
  LogOut, Sun, Moon, Maximize2, Minimize2, User, Send, 
  MoreHorizontal, CheckCircle2, Calendar, AlertCircle, 
  Paperclip, Sparkles, Trash2 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ConsultationWidget = ({ dragBoundary }: { dragBoundary: React.RefObject<Element> }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "chat">("booking");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccessConfirm, setIsSuccessConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  
  const [bookingData, setBookingData] = useState<any>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // State untuk Fitur Chat
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "doctor", text: "Halo Alifi, dr. Sarah di sini. Ada yang bisa saya bantu terkait hasil evaluasi ketahananmu?", time: "Baru saja" }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadBookingData = () => {
    const saved = localStorage.getItem("booking_details");
    const isBooked = localStorage.getItem("sarah_booked") === "true";
    const confirmedStatus = localStorage.getItem("sarah_confirmed") === "true";
    
    setBookingData(saved ? JSON.parse(saved) : null);
    setIsConfirmed(confirmedStatus);

    if (isBooked && !confirmedStatus) {
      setIsOpen(true);
      setActiveTab("booking");
    }
  };

  useEffect(() => {
    loadBookingData();
    const handleRemote = (e: any) => {
      setIsOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
      loadBookingData();
    };
    window.addEventListener("open-consultation", handleRemote);
    window.addEventListener("booking_status_changed", loadBookingData);
    return () => {
      window.removeEventListener("open-consultation", handleRemote);
      window.removeEventListener("booking_status_changed", loadBookingData);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping, activeTab]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newMsg = { 
      id: Date.now(), 
      sender: "user", 
      text: inputValue, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);
    
    setTimeout(() => {
      const doctorReply = { 
        id: Date.now() + 1, 
        sender: "doctor", 
        text: "Terima kasih informasinya. Saya sedang meninjau data terbaru kamu.", 
        time: "Sekarang" 
      };
      setMessages(prev => [...prev, doctorReply]);
      setIsTyping(false);
    }, 2000);
  };

  const handleConfirmSession = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsSuccessConfirm(true); 
      setTimeout(() => {
        setIsSuccessConfirm(false);
        localStorage.setItem("sarah_confirmed", "true");
        setIsConfirmed(true);
        setActiveTab("chat"); 
      }, 1500);
    }, 1000);
  };

  const finalCancel = () => {
    setShowCancelPrompt(false);
    setIsCancelling(true); 
    localStorage.removeItem("sarah_booked");
    localStorage.removeItem("booking_details");
    localStorage.setItem("sarah_confirmed", "false");
    
    setTimeout(() => {
      setIsCancelling(false);
      setIsOpen(false); 
      setBookingData(null);
      setIsConfirmed(false);
      window.dispatchEvent(new Event("booking_status_changed"));
    }, 2000); 
  };

  const handleClearHistory = () => {
    localStorage.removeItem("sarah_booked");
    localStorage.removeItem("booking_details");
    localStorage.setItem("sarah_confirmed", "false");
    setBookingData(null);
    setIsConfirmed(false);
    window.dispatchEvent(new Event("booking_status_changed"));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute bottom-32 right-6 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.button 
              onClick={() => setIsOpen(true)} 
              whileHover={{ scale: 1.05 }}
              className="relative w-14 h-14 bg-gradient-to-br from-[#076653] to-[#E3EF26] backdrop-blur-xl border border-white/20 rounded-[22px] shadow-xl flex items-center justify-center text-white"
            >
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0, width: isExpanded ? "90vw" : "360px", height: isExpanded ? "80vh" : "540px" }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="pointer-events-auto absolute bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/30 dark:border-white/10 shadow-2xl rounded-[35px] overflow-hidden flex flex-col transform-gpu"
            style={{ bottom: isExpanded ? "5vh" : "110px", right: isExpanded ? "2.5vw" : "24px" }}
          >
            <AnimatePresence>
              {isCancelling && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-white/95 dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center p-6">
                  <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                  <h4 className="text-sm font-bold text-foreground italic">Pembatalan Berhasil</h4>
                  <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-widest">Riwayat pendaftaran telah dihapus</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 sm:p-5 bg-white/40 dark:bg-black/40 border-b border-black/5 flex items-center justify-between shrink-0 z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#076653] flex items-center justify-center text-white shadow-lg"><User className="w-5 h-5" /></div>
                <h3 className="text-sm font-bold italic font-sans text-foreground">Konsultasi AMARTA</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsExpanded(!isExpanded)} className="w-9 h-9 flex items-center justify-center hover:bg-black/5 rounded-full transition-all hidden sm:flex">
                  {isExpanded ? <Minimize2 className="w-4 h-4 text-foreground" /> : <Maximize2 className="w-4 h-4 text-foreground" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full transition-all"><X className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col relative">
              <AnimatePresence mode="wait">
                {activeTab === "booking" ? (
                  <motion.div key="booking" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="p-4 sm:p-6 overflow-y-auto h-full">
                    {bookingData ? (
                      <div className="relative p-5 bg-white/50 dark:bg-black/30 rounded-[28px] border border-white/40 space-y-4 shadow-sm overflow-hidden text-foreground">
                        <AnimatePresence>
                          {showCancelPrompt && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-white/95 dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center p-6 rounded-[28px] backdrop-blur-md">
                              <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                              <h4 className="text-xs font-bold mb-4 text-foreground text-center">Batalkan sesi ini?</h4>
                              <div className="flex gap-2 w-full px-2"><button onClick={() => setShowCancelPrompt(false)} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-black/5 text-foreground">KEMBALI</button><button onClick={finalCancel} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-red-500 text-white">YA, BATALKAN</button></div>
                            </motion.div>
                          )}
                          {isSuccessConfirm && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-white/95 dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center p-6 rounded-[28px]">
                              <CheckCircle2 className="w-12 h-12 text-[#076653] mb-3" />
                              <h4 className="text-xs font-bold text-foreground">Konfirmasi Berhasil!</h4>
                              <p className="text-[9px] text-muted-foreground mt-1 uppercase tracking-widest">Membuka Live Chat...</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex items-center gap-3">
                          <img src="https://i.pravatar.cc/100?u=sarah" className="w-10 h-10 rounded-2xl border border-white/40 shadow-sm" alt="Doctor" />
                          <div className="min-w-0"><h4 className="text-xs font-bold italic truncate text-foreground">dr. Sarah Chen</h4><p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Psikolog Klinis</p></div>
                        </div>

                        {isConfirmed ? (
                          <div className="flex gap-2 pt-1">
                            <div className="flex-1 py-3 bg-green-500/10 border border-green-500/20 text-[#076653] rounded-[14px] text-center flex items-center justify-center gap-2 font-bold text-[9px] uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Sesi Selesai</div>
                            <button onClick={handleClearHistory} className="w-12 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-[14px] hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => setShowCancelPrompt(true)} className="flex-1 py-3 rounded-[14px] text-[9px] font-bold border border-red-500/20 text-red-500 hover:bg-red-500/10 uppercase tracking-widest">BATALKAN</button>
                            <button onClick={handleConfirmSession} className="flex-1 py-3 bg-[#076653] text-white rounded-[14px] text-[9px] font-bold shadow-md shadow-[#076653]/20 uppercase tracking-widest">KONFIRMASI</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center opacity-40 py-20 text-foreground"><Calendar className="w-12 h-12 mb-2" /><p className="text-[10px] font-bold uppercase tracking-[0.2em]">Tidak Ada Jadwal</p></div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="chat" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className="flex-1 flex flex-col h-full overflow-hidden">
                    {!isConfirmed ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20"><AlertCircle className="w-8 h-8 text-orange-500" /></div>
                        <div><h4 className="text-sm font-bold text-foreground">Live Chat Terkunci</h4><p className="text-[10px] text-muted-foreground leading-relaxed mt-1 text-center">Harap konfirmasi jadwal konsultasi pada tab Booking untuk memulai obrolan.</p></div>
                        <button onClick={() => setActiveTab("booking")} className="px-6 py-2.5 bg-[#076653] text-white rounded-full text-[9px] font-bold tracking-widest uppercase shadow-lg shadow-[#076653]/20 transition-transform active:scale-95">Buka Tab Booking</button>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* Area Pesan */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide pb-24">
                          {messages.map((msg) => (
                            <motion.div key={msg.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                              <div className={`max-w-[85%] p-3 rounded-[20px] shadow-sm ${msg.sender === "user" ? "bg-[#076653] text-white rounded-br-none" : "bg-white dark:bg-white/10 border border-white/40 rounded-bl-none text-foreground"}`}>
                                <p className="leading-relaxed italic text-[11px] font-medium">{msg.text}</p>
                              </div>
                              <p className="text-[7px] font-bold uppercase text-muted-foreground mt-1.5 px-1 tracking-widest">{msg.time}</p>
                            </motion.div>
                          ))}
                          {isTyping && (
                             <div className="flex items-center gap-1.5 bg-white/40 dark:bg-white/5 p-3 rounded-2xl w-fit"><MoreHorizontal className="w-4 h-4 text-[#076653] animate-pulse" /></div>
                          )}
                        </div>

                        {/* Input Chat Bar */}
                        <div className="p-3 bg-white/40 dark:bg-black/20 border-t border-white/20 absolute bottom-0 left-0 right-0 backdrop-blur-md">
                          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-white/80 dark:bg-white/5 p-1.5 rounded-[22px] border border-white/40 shadow-inner">
                            <button type="button" className="p-2 text-muted-foreground hover:text-[#076653]"><Paperclip className="w-4 h-4" /></button>
                            <input 
                              type="text" 
                              value={inputValue} 
                              onChange={(e) => setInputValue(e.target.value)} 
                              placeholder="Tulis balasan..." 
                              className="flex-1 bg-transparent border-none px-1 text-[11px] focus:outline-none text-foreground placeholder:text-muted-foreground/60" 
                            />
                            <motion.button 
                              whileTap={{ scale: 0.8 }} 
                              type="submit" 
                              disabled={!inputValue.trim()} 
                              className="w-8 h-8 bg-[#076653] rounded-full flex items-center justify-center text-white shadow-md disabled:opacity-50"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </motion.button>
                          </form>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-2 sm:p-3 flex gap-2 bg-white/20 border-t border-white/20 shrink-0 relative">
              <button 
                onClick={() => setActiveTab("booking")} 
                className={`relative flex-1 py-2.5 rounded-[16px] text-[9px] font-bold transition-colors z-10 uppercase tracking-widest ${activeTab === "booking" ? "text-white" : "text-foreground hover:bg-black/5"}`}
              >
                {activeTab === "booking" && (
                  <motion.div layoutId="widget-tab-pill" className="absolute inset-0 bg-[#076653] rounded-[16px] z-[-1]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                Booking
              </button>
              <button 
                onClick={() => setActiveTab("chat")} 
                className={`relative flex-1 py-2.5 rounded-[16px] text-[9px] font-bold transition-colors z-10 uppercase tracking-widest ${activeTab === "chat" ? "text-white" : "text-foreground hover:bg-black/5"}`}
              >
                {activeTab === "chat" && (
                  <motion.div layoutId="widget-tab-pill" className="absolute inset-0 bg-[#076653] rounded-[16px] z-[-1]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                Live Chat
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
    <div className="h-screen w-full bg-background text-foreground transition-colors duration-300 font-sans flex flex-col overflow-hidden relative" ref={screenRef}>
      <main className="flex-1 w-full z-10 overflow-y-auto scroll-smooth flex flex-col pt-safe">
        <div className="flex-1 w-full pt-6 sm:pt-10 pb-32">
          {children}
        </div>
      </main>

      <ConsultationWidget dragBoundary={screenRef} />
      
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center items-center gap-4 sm:gap-6 pointer-events-none transform-gpu">
        <nav className="relative bg-white/40 dark:bg-[#1c1c1e]/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-[32px] px-3 py-2 flex items-center gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto text-foreground">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.id} onClick={() => navigate(item.path)} className={`relative flex flex-col items-center justify-center gap-1 w-[64px] sm:w-[80px] py-2 rounded-[22px] transition-all ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
                {isActive && <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-[20px] bg-gradient-to-r from-[#076653] to-[#E3EF26] z-0" />}
                <item.icon className="w-5 h-5 z-10" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[8px] font-bold z-10 tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button onClick={() => setIsSidebarOpen(true)} className="w-14 h-14 shrink-0 rounded-full bg-white/40 dark:bg-[#1c1c1e]/40 backdrop-blur-2xl border border-white/30 shadow-lg flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"><Menu className="w-6 h-6 text-foreground" /></button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[75vw] sm:w-80 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border-l border-white/20 z-[110] p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2 text-foreground"><div className="w-8 h-8 bg-[#076653] rounded-xl flex items-center justify-center text-white italic font-bold">A</div><h2 className="font-bold text-lg italic tracking-tight">Menu AMARTA</h2></div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-foreground"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 space-y-4">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-[24px] border border-gray-100 dark:border-white/10 text-foreground">
                  <div className="flex items-center gap-3">{isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}<span className="font-bold text-xs">{isDark ? "Dark Mode" : "Light Mode"}</span></div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${isDark ? "bg-[#076653]" : "bg-gray-300"}`}><motion.div animate={{ x: isDark ? 18 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                </button>
                <div className="pt-6 space-y-2">
                  <button onClick={() => { navigate("/resilience"); setIsSidebarOpen(false); }} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-[22px] transition-all group text-foreground"><ShieldCheck className="w-5 h-5 text-[#076653] group-hover:scale-110 transition-transform" /><span className="font-bold text-xs">Resilience Score</span></button>
                  <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red dark:hover:bg-red-500/10 rounded-[22px] transition-all group"><LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" /><span className="font-bold text-xs">Sign Out</span></button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppLayout;