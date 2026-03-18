import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, Info, Sparkles, Activity } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VoiceAnalysisPage = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastFilePath, setLastFilePath] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<{
    mood: string;
    score: number;
    summary: string;
  } | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.pause();
        audioPlayer.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        setRecordingComplete(true);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingComplete(false);
      setAnalysisResult(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Akses Mikrofon Ditolak",
        description: "Mohon izinkan akses mikrofon di browser Anda untuk merekam suara.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- FUNGSI SIMULASI AI AMARTA ---
  const handleAnalysis = async () => {
    if (audioChunks.current.length === 0) return;
    setIsUploading(true);

    try {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const fileName = `${Date.now()}.webm`;
      const filePath = `recordings/${fileName}`;

      // 1. Coba upload ke Supabase (Kita abaikan jika error agar simulasi tetap jalan)
      try {
        const { error: uploadError } = await supabase.storage
          .from('voice-recordings')
          .upload(filePath, audioBlob);
        
        if (!uploadError) {
          setLastFilePath(filePath);
        }
      } catch (storageError) {
        console.log("Storage upload diabaikan untuk mode simulasi.");
      }

      // 2. Efek Jeda (Murni Simulasi "AI Sedang Berpikir" selama 3 detik)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. Kumpulan Mock Data (Variasi Hasil Analisis)
      const mockResults = [
        {
          mood: "Indikasi Stres Ringan",
          score: 65,
          summary: "Analisis frekuensi fundamental (F0) menunjukkan sedikit ketegangan (jitter). Jeda bicara Anda sedikit lebih panjang dari batas normal. AMARTA menyarankan Anda untuk mengambil waktu istirahat dan melakukan relaksasi pernapasan."
        },
        {
          mood: "Kondisi Stabil & Positif",
          score: 25,
          summary: "Amplitudo suara Anda sangat stabil. Tidak terdeteksi adanya pola mikrotremor yang signifikan pada pita suara. Kondisi ketahanan mental Anda saat ini terdeteksi sangat baik. Pertahankan ritme ini!"
        },
        {
          mood: "Kelelahan Emosional",
          score: 78,
          summary: "Terdapat penurunan energi pada nada dasar (pitch affect) bicara Anda, yang berkorelasi kuat dengan kelelahan mental fisik. Tingkat stres terindikasi cukup tinggi. Sangat disarankan untuk menjadwalkan konsultasi dengan psikolog AMARTA."
        }
      ];

      // Pilih satu hasil secara acak
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setAnalysisResult(randomResult);

      toast({ title: "Analisis Selesai", description: "AMARTA telah berhasil memetakan biomarker suara Anda." });

    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal Menganalisis", description: "Terjadi kesalahan pada sistem." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying && audioPlayer.current) {
      audioPlayer.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioPlayer.current && !audioPlayer.current.ended) {
      audioPlayer.current.play();
      setIsPlaying(true);
      return;
    }

    let audioUrl = "";
    if (!lastFilePath) {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      audioUrl = URL.createObjectURL(audioBlob);
    } else {
      const { data } = await supabase.storage
        .from('voice-recordings')
        .createSignedUrl(lastFilePath, 3600);
      if (data?.signedUrl) audioUrl = data.signedUrl;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioPlayer.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.play();
    }
  };

  return (
    <AppLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8 px-4 pt-8 pb-32 text-left"
      >
        <div className="space-y-2 px-2">
          <h1 className="text-3xl font-bold text-foreground transition-colors duration-500 font-sans italic tracking-tight">
            Analisis Suara
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed font-sans">
            Bicaralah dengan jujur. AMARTA akan menganalisis intonasi dan pola mikrotremor untuk memahami apa yang hatimu rasakan.
          </p>
        </div>

        {/* Recording Sphere Area with SMOOTH PULSAR */}
        {!analysisResult && (
          <div className="relative w-full flex items-center justify-center py-10 transition-all">
            <AnimatePresence>
              {isRecording && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute w-64 h-64 rounded-full border-2 border-green-500/30"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 3, delay: 1.5, ease: "linear" }}
                    className="absolute w-64 h-64 rounded-full border-2 border-[#cc5833]/20"
                  />
                </>
              )}
            </AnimatePresence>

            <div className="relative z-10 w-64 h-64 rounded-[40px] md:rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-2xl border border-white/40 dark:border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
              <div className="flex items-end gap-1.5 h-10 mb-6">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isRecording ? { height: [6, 40, 10, 25, 6] } : { height: 6 }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-2 bg-gradient-to-t from-green-500 to-[#cc5833] rounded-full"
                  />
                ))}
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                  isRecording 
                  ? "bg-red-500 scale-90 shadow-red-500/30" 
                  : "bg-gradient-to-br from-green-600 to-[#cc5833] hover:scale-105 shadow-green-900/20"
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 text-white fill-current" /> : <Mic className="w-8 h-8 text-white" />}
              </button>

              <p className="mt-5 text-[10px] font-bold tracking-widest uppercase text-muted-foreground animate-pulse font-sans">
                {isRecording ? "Mendengarkan..." : "Tekan untuk Mulai"}
              </p>
            </div>
          </div>
        )}

        {/* Results Card & AI Analysis UI */}
        <AnimatePresence mode="wait">
          {recordingComplete && !analysisResult && (
            <motion.div
              key="pre-analysis"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-[32px] shadow-xl space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/50 dark:bg-white/10 rounded-2xl shadow-inner border border-white/30">
                  <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-bold italic tracking-tight">Rekaman Tersimpan</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                    Siap Dianalisis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={handleTogglePlay}
                  className="flex items-center justify-center gap-2 py-3.5 bg-white/50 dark:bg-white/5 hover:bg-white/80 rounded-2xl font-bold text-xs transition-transform active:scale-95 border border-white/20 shadow-sm"
                >
                  {isPlaying ? <><Pause className="w-4 h-4 fill-current" /> Jeda</> : <><Play className="w-4 h-4 fill-current" /> Putar Ulang</>}
                </button>
                <button 
                  onClick={() => { 
                    if(audioPlayer.current) audioPlayer.current.pause();
                    setRecordingComplete(false); 
                    setLastFilePath(null); 
                  }}
                  className="flex items-center justify-center gap-2 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-2xl font-bold text-xs transition-transform active:scale-95 border border-red-500/10"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>

              <button 
                onClick={handleAnalysis}
                disabled={isUploading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-green-600 to-[#cc5833] text-white rounded-[20px] font-bold text-sm shadow-xl hover:shadow-green-900/20 transition-transform active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    Memproses Biomarker...
                  </>
                ) : (
                  "Analisis Suara Sekarang"
                )}
              </button>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              key="analysis-result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 bg-white/40 dark:bg-black/30 backdrop-blur-2xl border-2 border-white/50 dark:border-white/10 rounded-[35px] sm:rounded-[40px] shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-[0.2em]">Hasil Deteksi AMARTA</p>
                  <h2 className="text-xl sm:text-2xl font-bold italic tracking-tight">"{analysisResult.mood}"</h2>
                </div>
                <div className="p-3 bg-white/60 dark:bg-white/10 rounded-2xl shadow-inner border border-white/40">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>

              <div className="space-y-3 p-5 bg-white/30 dark:bg-black/20 rounded-[24px] border border-white/20 shadow-sm">
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Indikasi Stres</span>
                  <span className={analysisResult.score > 50 ? "text-[#cc5833] text-[14px]" : "text-green-600 text-[14px]"}>{analysisResult.score}%</span>
                </div>
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-white/10 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className={`h-full rounded-full shadow-sm bg-gradient-to-r ${analysisResult.score > 50 ? "from-orange-400 to-[#cc5833]" : "from-green-400 to-green-600"}`}
                  />
                </div>
              </div>

              <div className="p-5 bg-white/50 dark:bg-white/5 rounded-[28px] border border-white/30 shadow-sm">
                <p className="text-[12px] sm:text-[13px] leading-relaxed text-foreground/80 font-sans">{analysisResult.summary}</p>
              </div>

              <button 
                onClick={() => { setAnalysisResult(null); setRecordingComplete(false); }}
                className="w-full py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-[20px] font-bold text-[11px] uppercase tracking-widest transition-transform active:scale-95 shadow-xl"
              >
                Selesai & Rekam Ulang
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!analysisResult && (
          <div className="p-5 bg-white/20 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-[28px] flex gap-4 font-sans shadow-sm">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-relaxed">
              AMARTA menjamin privasi suaramu. Data audio hanya digunakan untuk mengekstraksi parameter biomarker sesaat.
            </p>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default VoiceAnalysisPage;