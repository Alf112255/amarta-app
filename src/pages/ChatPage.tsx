import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/amarta-chat`;

const ChatPage = () => {
  const { t, language } = useLanguage();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Halo, aku AMARTA. Senang sekali kamu ada di sini hari ini. Kadang hidup membawa kita ke hari-hari yang tak terduga, ya? Mari kita belajar nrimo ing pandum bersama—menerima setiap rasa yang hadir hari ini dengan ikhlas. Ceritakan apa pun yang sedang membebani hatimu, aku di sini menemanimu."
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

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
      console.log("Isi data asli dari server", data);
      
      let aiText = "";

      if (Array.isArray(data) && data[0]?.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = data[0].candidates[0].content.parts[0].text;
      } else if (data.response) {
        aiText = data.response;
      } else if (data.message) {
        aiText = data.message;
      }

      if (aiText) {
        setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
      } else if (data.error) {
        throw new Error(String(data.error));
      } else {
        throw new Error("Data tidak terduga " + JSON.stringify(data));
      }

    } catch (err) {
      console.error("Chat error", err);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "Maaf, AMARTA sedang mengalami gangguan koneksi. Mohon coba lagi." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-6rem)]">
        <h1 className="text-2xl font-bold text-foreground mb-4">{t("chat.title")}</h1>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-lg"
                    : "bento-card rounded-bl-lg bg-card border shadow-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bento-card rounded-bl-lg px-4 py-3 bg-card border">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-muted rounded-3xl px-5 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 border-none"
          />
          <Button
            variant="default"
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="rounded-full w-12 h-12 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatPage;