import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Maximize2, Minimize2, Calendar, 
  User, HeartPulse, Send, MoreHorizontal, 
  CheckCircle2, AlertCircle 
} from "lucide-react";

const ConsultationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"booking" | "chat">("booking");
  
  const [bookingData, setBookingData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "doctor", text: "Halo Alifi, dr. Sarah di sini. Ada yang bisa saya bantu terkait hasil analisis suaramu hari ini?", time: "Baru saja" }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const loadBookingData = () => {
    const savedDetails = localStorage.getItem("booking_details");
    if (savedDetails) {
      setBookingData(JSON.parse(savedDetails));
    } else {
      setBookingData(null);
    }
  };

  useEffect(() => {
    loadBookingData();
    const handleRemoteControl = (e: any) => {
      setIsOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
      if (e.detail?.expand) setIsExpanded(true);
      loadBookingData();
    };
    window.addEventListener("open-consultation", handleRemoteControl);
    window.addEventListener("booking_status_changed", loadBookingData);
    return () => {
      window.removeEventListener("open-consultation", handleRemoteControl);
      window.removeEventListener("booking_status_changed", loadBookingData);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleConfirmSession = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      localStorage.removeItem("booking_details");
      localStorage.setItem("sarah_booked", "false");
      window.dispatchEvent(new Event("booking_status_changed"));
      loadBookingData();
      setActiveTab("chat");
    }, 2500);
  };

  const handleFinalCancel = () => {
    localStorage.removeItem("booking_details");
    localStorage.removeItem("sarah_booked");
    window.dispatchEvent(new Event("booking_status_changed"));
    loadBookingData();
    setShowCancelPrompt(false);
    setIsOpen(false);
    setTimeout(() => setActiveTab("booking"), 300);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const msg = { id: Date.now(), sender: "user", text: inputValue, time: "Sekarang" };
    setMessages(prev => [...prev, msg]);
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = { id: Date.now() + 1, sender: "doctor", text: "Terima kasih sudah berbagi. Mari kita bahas perlahan.", time: "Sekarang" };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <div className="absolute bottom-32 right-6 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              layoutId="widget-container"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 bg-gradient-to-br from-[#076653] to-[#E3EF26] backdrop-blur-xl border border-white/30 rounded-[24px] shadow-2xl flex items-center justify-center text-white"
            >
              <HeartPulse className="w-8 h-8 animate-pulse" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="widget-container"
            initial={{ opacity: 0, scale: 0.9, y: 50}}
            animate={{ 
              opacity: 1, scale: 1, y: 50,
              width: isExpanded ? "90vw" : "360px",
              height: isExpanded ? "80vh" : "540px",
            }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="pointer-events-auto absolute bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-[40px] border border-black/10 dark:border-white/10 shadow-2xl rounded-[45px] overflow-hidden flex flex-col"
            style={{ bottom: isExpanded ? "10vh" : "130px", right: isExpanded ? "5vw" : "24px" }}
          >
            {/* HEADER - DIPERBAIKI TOTAL */}
            <div className="p-5 bg-white/80 dark:bg-black/40 border-b border-black/5 dark:border-white/10 flex items-center justify-between shrink-0 relative z-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#076653] flex items-center justify-center shadow-lg shadow-[#076653]/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold italic tracking-tight text-foreground">Konsultasi AMARTA</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#076653] dark:text-[#E3EF26]">Layanan Aktif</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="w-10 h-10 flex items-center justify-center bg-green-500/10 hover:bg-green-500/20 text-[#076653] rounded-2xl transition-all border border-green-500/10"
                >
                  {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-2xl transition-all border border-red-500/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col font-sans relative">
              {activeTab === "booking" ? (
                <div className="p-6 overflow-y-auto space-y-4 h-full">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Konfirmasi Jadwal</p>
                  
                  {bookingData ? (
                    <div className="relative p-5 bg-white dark:bg-white/5 rounded-[32px] border border-black/5 dark:border-white/10 space-y-4 shadow-sm overflow-hidden min-h-[300px] flex flex-col justify-between">
                      
                      {/* Konfirmasi Batal */}
                      <AnimatePresence>
                        {showCancelPrompt && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-white dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center p-6">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4"><AlertCircle className="w-6 h-6 text-red-500" /></div>
                            <h4 className="text-xs font-bold mb-4 text-foreground">Apakah anda ingin membatalkan sesi konsultasi?</h4>
                            <div className="flex gap-2 w-full">
                              <button onClick={() => setShowCancelPrompt(false)} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-black/5 text-foreground">KEMBALI</button>
                              <button onClick={handleFinalCancel} className="flex-1 py-3 rounded-2xl text-[9px] font-bold bg-red-500 text-white">BATALKAN</button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Animasi Sukses */}
                      <AnimatePresence>
                        {isConfirming && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-white/95 dark:bg-[#1C1C1E] flex flex-col items-center justify-center text-center px-4">
                            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="w-16 h-16 bg-gradient-to-br from-[#076653] to-[#E3EF26] rounded-full flex items-center justify-center mb-3 shadow-lg shadow-[#076653]/30"><CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} /></motion.div>
                            <h4 className="font-bold text-sm text-foreground">Sesi Terkonfirmasi!</h4>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/100?u=sarah" className="w-12 h-12 rounded-2xl border border-black/5 shadow-inner" alt="Doc" />
                        <div>
                          <h4 className="text-sm font-bold italic tracking-tight text-foreground">dr. Sarah Chen</h4>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Psikolog Klinis</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold italic">
                        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5">
                          <p className="opacity-50 uppercase text-[7px] mb-1">Tanggal</p>
                          <span className="text-foreground">{bookingData.dayName}, {bookingData.date} Mar</span>
                        </div>
                        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5">
                          <p className="opacity-50 uppercase text-[7px] mb-1">Waktu</p>
                          <span className="text-foreground">{bookingData.time} WIB</span>
                        </div>
                      </div>

                      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] font-bold opacity-60 uppercase text-foreground">Antrian</span>
                          <span className="text-xs font-bold text-[#076653] dark:text-[#E3EF26]">{bookingData.queueNumber}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed italic opacity-80 text-foreground line-clamp-2">"{bookingData.complaint}"</p>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setShowCancelPrompt(true)} className="flex-1 py-3.5 rounded-2xl text-[9px] font-bold border border-red-500/30 text-red-500 hover:bg-red-500/10">BATALKAN</button>
                        <button onClick={handleConfirmSession} className="flex-1 py-3.5 bg-[#076653] dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-bold shadow-xl active:scale-95 transition-all">KONFIRMASI</button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center px-8">
                      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4 border border-dashed border-muted-foreground/30"><Calendar className="w-6 h-6 text-muted-foreground/30" /></div>
                      <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">Tidak Ada Jadwal Aktif</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-6 overflow-hidden h-full">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                    {messages.map(msg => (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col w-full ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${msg.sender === "user" ? "bg-[#076653] text-white rounded-br-none" : "bg-black/5 dark:bg-white/10 border border-black/5 rounded-bl-none text-foreground"}`}>
                          <p className="leading-relaxed italic text-[11px]">{msg.text}</p>
                        </div>
                        <p className="text-[7px] font-bold uppercase text-muted-foreground mt-2 tracking-widest">{msg.time}</p>
                      </motion.div>
                    ))}
                    {isTyping && <div className="flex items-center gap-1 bg-black/5 p-3 rounded-2xl w-fit animate-pulse"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></div>}
                  </div>
                  <form onSubmit={handleSendMessage} className="mt-4 flex gap-2 items-center bg-black/5 dark:bg-white/5 p-2 rounded-3xl border border-black/5 shrink-0">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Tulis pesanmu..." className="flex-1 bg-transparent border-none px-4 py-2 text-[11px] focus:outline-none placeholder:text-muted-foreground/60 font-sans text-foreground" />
                    <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 bg-[#076653] rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><Send className="w-4 h-4 ml-0.5" /></button>
                  </form>
                </div>
              )}
            </div>

            {/* Footer Tabs */}
            <div className="p-3 flex gap-2 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10 shrink-0">
              <button onClick={() => setActiveTab("booking")} className={`flex-1 py-3 rounded-2xl text-[10px] font-bold transition-all ${activeTab === "booking" ? "bg-[#076653] text-white shadow-lg shadow-[#076653]/20" : "text-foreground hover:bg-black/5"}`}>BOOKING</button>
              <button onClick={() => setActiveTab("chat")} className={`flex-1 py-3 rounded-2xl text-[10px] font-bold transition-all ${activeTab === "chat" ? "bg-[#076653] text-white shadow-lg shadow-[#076653]/20" : "text-foreground hover:bg-black/5"}`}>LIVE CHAT</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultationWidget;