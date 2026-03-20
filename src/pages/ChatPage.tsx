import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/amarta-chat`;

const ChatPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Halo, aku AMARTA. Senang sekali kamu ada di sini hari ini. Kadang hidup membawa kita ke hari-hari yang tak terduga, ya? Mari kita belajar nrimo ing pandum bersama—menerima setiap rasa yang hadir hari ini dengan ikhlas. Ceritakan apa pun yang sedang membebani hatimu, aku di sini menemanimu."
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fungsi scroll otomatis yang fokus pada kontainer pesan
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages,
          language,
        }),
      });

      if (!resp.ok) throw new Error("Gagal mengambil respon dari server");

      const data = await resp.json();
      let aiText = "";
      
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = data.candidates[0].content.parts[0].text;
      } else if (Array.isArray(data) && data[0]?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = data[0].candidates[0].content.parts[0].text;
      } else if (data.response) {
        aiText = data.response;
      } else if (data.message) {
        aiText = data.message;
      }

      if (aiText) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
      } else {
        throw new Error("Data tidak terduga");
      }

    } catch (err) {
      console.error("Chat error", err);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Maaf, AMARTA sedang mengalami sedikit gangguan membaca sinyal. Mari tarik napas sejenak dan coba sapa lagi." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Wrapper utama menggunakan fixed h-screen untuk mengunci dimensi layar */}
      <div className="fixed inset-0 z-40 bg-background flex justify-center overflow-hidden">
        <div className="w-full max-w-2xl h-full flex flex-col relative">
          
          {/* --- FIXED iOS STYLE HEADER --- */}
          <header className="shrink-0 pt-14 pb-4 px-4 bg-background/80 backdrop-blur-xl border-b border-border/20 flex items-center z-30 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full text-foreground/80 hover:bg-muted/50 w-10 h-10 shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col items-center flex-1 pr-10 text-center">
              <h1 className="text-base font-bold text-foreground tracking-tight">Chat AMARTA</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] text-green-600 dark:text-green-500 font-medium uppercase tracking-widest">
                  {t("chat.title")}
                </p>
              </div>
            </div>
          </header>

          {/* --- SCROLLABLE AREA PESAN --- */}
          <main 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide bg-muted/5"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-[#cc5833] flex items-center justify-center shadow-sm shrink-0 mb-1 border border-white/20">
                      <span className="text-[10px] font-bold text-white italic">A</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-[14px] leading-relaxed break-words whitespace-pre-wrap shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-green-600 to-[#cc5833] text-white rounded-[22px] rounded-br-sm"
                        : "bg-card text-card-foreground border border-border/40 rounded-[22px] rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none text-current dark:prose-invert font-sans">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="font-sans">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex justify-start items-center gap-2 pl-9"
              >
                <div className="bg-card rounded-[20px] rounded-bl-sm px-4 py-2.5 border border-border/40 shadow-sm flex items-center gap-2.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-green-600" />
                  <span className="text-[11px] text-muted-foreground italic">AMARTA sedang mengetik...</span>
                </div>
              </motion.div>
            )}
            {/* Spacer bawah untuk memastikan pesan terakhir tidak tertutup input bar saat di-scroll */}
            <div className="h-10" />
          </main>

          {/* --- FIXED iOS STYLE INPUT BAR --- */}
          <footer className="shrink-0 px-4 pt-3 pb-[110px] bg-background/80 backdrop-blur-xl border-t border-border/20 z-30">
            <div className="flex gap-2.5 items-end max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={t("chat.placeholder")}
                  rows={1}
                  className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30 rounded-[24px] px-5 py-3.5 text-[14px] text-foreground focus:outline-none border border-border/40 resize-none min-h-[48px] max-h-[120px] transition-all scrollbar-hide font-sans"
                />
              </div>
              <Button
                variant="default"
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-full w-12 h-12 flex-shrink-0 mb-0.5 active:scale-90 transition-transform bg-gradient-to-br from-green-600 to-[#cc5833] hover:shadow-lg disabled:opacity-50 border-none"
              >
                <Send className="w-5 h-5 ml-0.5 text-white" />
              </Button>
            </div>
          </footer>

        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;