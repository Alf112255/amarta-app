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
  
  // State untuk Hasil Analisis
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
      setAnalysisResult(null); // Reset hasil lama
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Akses Mikrofon Ditolak",
        description: "Mohon izinkan akses mikrofon untuk merekam suara.",
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

 const handleAnalysis = async () => {
  if (audioChunks.current.length === 0) return;
  setIsUploading(true);

  try {
    // Step 1: Upload file dulu seperti biasa
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const fileName = `${Date.now()}.webm`;
    const filePath = `recordings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('voice-recordings')
      .upload(filePath, audioBlob);

    if (uploadError) throw uploadError;
    setLastFilePath(filePath);

    // Step 2: Panggil AI Edge Function
    const { data, error: aiError } = await supabase.functions.invoke('analyze-voice-emotion', {
      body: { filePath: filePath }
    });

    if (aiError) throw aiError;

    // Tampilkan hasil asli dari AI
    setAnalysisResult({
      mood: data.mood,
      score: data.score,
      summary: data.summary
    });

    toast({ title: "Analisis Berhasil", description: "AMARTA telah memetakan emosimu." });

  } catch (error: any) {
    console.error(error);
    toast({ variant: "destructive", title: "AI sedang sibuk", description: "Coba lagi dalam beberapa saat." });
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
          <h1 className="text-3xl font-bold text-foreground transition-colors duration-500 font-sans">
            Analisis Suara
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed font-sans">
            Bicaralah dengan jujur. AMARTA akan menganalisis intonasi dan pola emosimu untuk memahami apa yang hatimu rasakan.
          </p>
        </div>

        {/* Recording Sphere Area */}
        {!analysisResult && (
          <div className="relative w-full flex items-center justify-center py-10 transition-all">
            <AnimatePresence>
              {isRecording && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute w-64 h-64 rounded-full bg-green-500"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.8, opacity: 0.08 }}
                    exit={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 0.5 }}
                    className="absolute w-64 h-64 rounded-full bg-[#cc5833]"
                  />
                </>
              )}
            </AnimatePresence>

            <div className="relative z-10 w-64 h-64 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all duration-500">
              <div className="flex items-end gap-1 h-8 mb-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isRecording ? { height: [4, 30, 8, 20, 4] } : { height: 4 }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1.5 bg-gradient-to-t from-green-500 to-[#cc5833] rounded-full"
                  />
                ))}
              </div>

              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                  isRecording 
                  ? "bg-red-500 scale-90" 
                  : "bg-gradient-to-br from-green-600 to-[#cc5833] hover:scale-105"
                }`}
              >
                {isRecording ? <Square className="w-8 h-8 text-white fill-current" /> : <Mic className="w-8 h-8 text-white" />}
              </button>

              <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground animate-pulse font-sans">
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
              className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[32px] shadow-sm space-y-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">Rekaman Siap</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-sans font-bold italic">
                    {lastFilePath ? "Cloud Sync Aktif" : "Data Lokal"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button 
                  onClick={handleTogglePlay}
                  className="flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl font-bold text-xs transition-transform active:scale-95 dark:text-white font-sans"
                >
                  {isPlaying ? <><Pause className="w-4 h-4 fill-current" /> Pause</> : <><Play className="w-4 h-4 fill-current" /> Putar</>}
                </button>
                <button 
                  onClick={() => { 
                    if(audioPlayer.current) audioPlayer.current.pause();
                    setRecordingComplete(false); 
                    setLastFilePath(null); 
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-bold text-xs transition-transform active:scale-95 font-sans"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>

              <button 
                onClick={handleAnalysis}
                disabled={isUploading}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-[#cc5833] text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-900/10 transition-transform active:scale-[0.98] disabled:opacity-50 font-sans"
              >
                {isUploading ? "Menganalisis..." : "Analisis Sekarang"}
              </button>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              key="analysis-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white dark:bg-gray-800 border-2 border-green-100 dark:border-green-900/30 rounded-[40px] shadow-2xl space-y-6 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest font-sans">Status Emosional</p>
                  <h2 className="text-2xl font-bold text-foreground italic font-sans">"{analysisResult.mood}"</h2>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>

              {/* Stress Meter */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold font-sans">
                  <span>Tingkat Stres</span>
                  <span className={analysisResult.score > 50 ? "text-[#cc5833]" : "text-green-600"}>
                    {analysisResult.score}%
                  </span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.score}%` }}
                    transition={{ duration: 1.2, ease: "circOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      analysisResult.score > 50 
                      ? "from-orange-400 to-[#cc5833]" 
                      : "from-green-400 to-green-600"
                    }`}
                  />
                </div>
              </div>

              {/* Summary Bento */}
              <div className="p-5 bg-muted/30 dark:bg-white/5 rounded-[28px] border border-border/50">
                <p className="text-[13px] leading-relaxed text-foreground/80 font-sans">
                  {analysisResult.summary}
                </p>
              </div>

              <button 
                onClick={() => { setAnalysisResult(null); setRecordingComplete(false); }}
                className="w-full py-4 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-bold text-sm transition-transform active:scale-95 font-sans"
              >
                Selesai & Rekam Ulang
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!analysisResult && (
          <div className="p-5 bg-muted/30 dark:bg-gray-800/20 border border-border/50 rounded-[28px] flex gap-4 font-sans transition-all">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AMARTA menjamin privasi suaramu. Data audio hanya digunakan untuk keperluan analisis emosi sesaat dan tidak akan dibagikan kepada pihak ketiga.
            </p>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default VoiceAnalysisPage;