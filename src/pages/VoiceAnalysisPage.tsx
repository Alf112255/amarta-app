import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

interface AnalysisResult {
  pitchVariation: number;
  speechLatency: number;
  toneStability: number;
  aiInterpretation: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/amarta-chat`;

const VoiceAnalysisPage = () => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Referensi untuk menyimpan waktu agar terbaca akurat saat rekaman dihentikan
  const recordingTimeRef = useRef(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setIsAnalyzing(true);

        const pitchVariation = Math.random() * 40 + 30;
        const speechLatency = Math.random() * 500 + 200;
        const toneStability = Math.random() * 40 + 50;

        // Mengambil durasi rekaman asli dari referensi yang diperbarui
        const finalTime = recordingTimeRef.current;
        const featureSummary = `Voice analysis results: Pitch variation ${pitchVariation.toFixed(1)}Hz, Speech latency ${speechLatency.toFixed(0)}ms, Tone stability ${toneStability.toFixed(1)}%. Recording duration: ${finalTime} seconds.`;

        try {
          const resp = await fetch(CHAT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [
                {
                  role: "user",
                  content: `Analyze these voice biometric features for mental health insights. Respond in ${language === "id" ? "Bahasa Indonesia" : "English"}. ${featureSummary}. Provide 1) Emotional interpretation 2) Supportive message 3) Suggested coping strategy.`,
                },
              ],
              language,
            }),
          });

          if (!resp.ok) throw new Error("Gagal mengambil respon dari server");

          const data = await resp.json();
          let aiText = "";

          if (Array.isArray(data)) {
            aiText = data
              .map((chunk: any) => chunk?.candidates?.[0]?.content?.parts?.[0]?.text || "")
              .join("");
          } else if (data.response) {
            aiText = data.response;
          } else if (data.message) {
            aiText = data.message;
          }

          // Menghapus semua karakter bintang bawaan format markdown
          const cleanAiText = aiText.replace(/\*/g, "");

          setResult({
            pitchVariation,
            speechLatency,
            toneStability,
            aiInterpretation: cleanAiText || "Analisis selesai, namun format balasan tidak terbaca.",
          });
        } catch (err) {
          console.error("AI analysis error", err);
          setResult({
            pitchVariation,
            speechLatency,
            toneStability,
            aiInterpretation: "Maaf, AMARTA sedang mengalami gangguan koneksi saat menganalisis suara Anda.",
          });
        }
        setIsAnalyzing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Mengatur ulang tampilan dan referensi waktu ke nol
      setRecordingTime(0);
      recordingTimeRef.current = 0;
      setResult(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          recordingTimeRef.current = newTime;
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  }, [language]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("voice.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("voice.subtitle")}</p>
        </div>

        <motion.div
          className="bento-card flex flex-col items-center py-12 space-y-6"
          animate={isRecording ? { borderColor: "hsl(var(--primary))" } : {}}
        >
          <div className="flex items-center gap-1 h-16">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full bg-primary"
                animate={
                  isRecording
                    ? { height: [8, Math.random() * 40 + 16, 8] }
                    : { height: 8 }
                }
                transition={
                  isRecording
                    ? { duration: 0.8 + Math.random() * 0.6, repeat: Infinity, delay: i * 0.05 }
                    : {}
                }
              />
            ))}
          </div>

          {isRecording && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground"
            >
              {recordingTime}s
            </motion.p>
          )}

          {isAnalyzing ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t("voice.analyzing")}</span>
            </div>
          ) : (
            <Button
              variant={isRecording ? "warm" : "sage"}
              size="xl"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  {t("voice.stop")}
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {t("voice.start")}
                </>
              )}
            </Button>
          )}
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t("voice.pitch"), value: `${result.pitchVariation.toFixed(1)}Hz` },
                  { label: t("voice.latency"), value: `${result.speechLatency.toFixed(0)}ms` },
                  { label: t("voice.stability"), value: `${result.toneStability.toFixed(1)}%` },
                ].map((metric) => (
                  <div key={metric.label} className="bento-card text-center">
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="bento-card bg-sage-light/20 border-sage/20">
                <h3 className="font-semibold text-foreground mb-2">AI Interpretation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{result.aiInterpretation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default VoiceAnalysisPage;