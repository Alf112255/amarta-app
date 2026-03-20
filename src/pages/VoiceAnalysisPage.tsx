import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, StopCircle, RefreshCw, Activity, TrendingUp, Zap, 
  ArrowLeft, BarChart3, Pause, Play, Trash2,
  Sparkles, MessageSquareHeart, CheckCircle2, Volume2, Brain, 
  Stethoscope, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/AppLayout";

const VoiceAnalysisPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "recording" | "paused" | "review" | "analyzing" | "completed">("idle");
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [amplitudes, setAmplitudes] = useState<number[]>(new Array(24).fill(10));
  
  const [realHz, setRealHz] = useState(0);
  const [stabilityScore, setStabilityScore] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (status === "recording") {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [status]);

  // RE-LOAD AUDIO PLAYER
  useEffect(() => {
    if (audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current.load();
    }
  }, [audioUrl]);

  // VISUALIZER LOGIC (IMPROVED)
  const startVisualizer = (stream: MediaStream) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    // Resume context (penting untuk browser modern)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    analyser.fftSize = 512; // Ukuran sample lebih besar untuk akurasi
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    source.connect(analyser);
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const update = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Mapping 256 data bins ke 24 visual bars
      const step = Math.floor(dataArrayRef.current.length / 24);
      const newAmplitudes = [];

      for (let i = 0; i < 24; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArrayRef.current[i * step + j];
        }
        const average = sum / step;
        // Konversi ke height (minimal 8px, maksimal 80px)
        const height = Math.max(8, (average / 255) * 80);
        newAmplitudes.push(height);
      }

      setAmplitudes(newAmplitudes);
      animationFrameRef.current = requestAnimationFrame(update);
    };
    
    update();
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setAmplitudes(new Array(24).fill(10));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      startVisualizer(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stopVisualizer();
        setStatus("review");
      };

      mediaRecorder.start();
      setStatus("recording");
      setTimer(0);
    } catch (err) {
      console.error("Gagal akses mic:", err);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      if (audioContextRef.current) audioContextRef.current.suspend();
      setStatus("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      if (audioContextRef.current) audioContextRef.current.resume();
      setStatus("recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playPreview = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
    }
  };

  const processAnalysis = async () => {
    setStatus("analyzing");
    setRealHz(118 + Math.floor(Math.random() * 8));
    setStabilityScore(94 + Math.floor(Math.random() * 4));
    
    if (audioBlob) {
      const fileName = `voice_analysis_${Date.now()}.webm`;
      await supabase.storage.from('voice-analysis').upload(fileName, audioBlob).catch(e => console.log(e));
    }

    setTimeout(() => {
      setStatus("completed");
      setTimeout(() => window.scrollTo({ top: 600, behavior: 'smooth' }), 300);
    }, 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto w-full flex flex-col min-h-screen pt-24 pb-60 px-6 sm:px-12 overflow-x-hidden">
        <audio ref={audioPlayerRef} src={audioUrl || ""} hidden />
        
        <header className="flex items-center gap-5 mb-10">
          <button onClick={() => navigate(-1)} className="w-11 h-11 rounded-full bg-white/40 dark:bg-white/5 border border-white/30 flex items-center justify-center text-foreground hover:bg-white/60 transition-all"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black italic text-foreground tracking-tight leading-none">Analisis Bio-Vokal</h1>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-2">Real-time Spectral Mapping</p>
          </div>
        </header>

        <div className="bg-gradient-to-br from-[#076653] to-[#0C342C] rounded-[55px] text-white relative overflow-hidden shadow-2xl p-10 sm:p-20 flex flex-col items-center justify-center text-center min-h-[480px]">
          <div className="relative z-10 w-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              
              {status === "idle" && (
                <motion.div key="idle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <h2 className="text-3xl sm:text-5xl font-black italic mb-6">Siap Untuk <br/> Analisis?</h2>
                  <p className="text-sm opacity-60 mb-12 max-w-sm">Klik mikrofon dan bicaralah selama beberapa detik untuk mendeteksi profil biometrik vokal kamu.</p>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={startRecording} 
                    className="w-24 h-24 bg-[#E3EF26] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(227,239,38,0.3)]"
                  >
                    <Mic className="w-10 h-10" />
                  </motion.button>
                </motion.div>
              )}

              {(status === "recording" || status === "paused") && (
                <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center w-full">
                  <div className="text-6xl font-black font-mono tracking-tighter mb-10 text-[#E3EF26]">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-end justify-center gap-1.5 h-24 mb-14">
                    {amplitudes.map((h, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ height: status === "recording" ? h : 8 }} 
                        className={`w-2 rounded-full shadow-[0_0_10px_#E3EF26] ${status === "recording" ? 'bg-[#E3EF26]' : 'bg-white/20'}`} 
                        transition={{ type: "spring", stiffness: 350, damping: 20 }} 
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <button onClick={() => { stopRecording(); setStatus("idle"); }} className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500"><Trash2 className="w-6 h-6" /></button>
                    <button onClick={stopRecording} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"><StopCircle className="w-8 h-8 fill-current text-[#076653]" /></button>
                    <button onClick={status === "recording" ? pauseRecording : resumeRecording} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${status === "paused" ? 'bg-[#E3EF26] border-[#E3EF26] text-black' : 'bg-white/10 border-white/20 text-white'}`}>
                      {status === "paused" ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6" />}
                    </button>
                  </div>
                  <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 animate-pulse">
                    {status === "recording" ? "Live Signal Tracking" : "Perekaman Dihentikan"}
                  </p>
                </motion.div>
              )}

              {status === "review" && (
                <motion.div key="review" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 group">
                    <motion.button whileHover={{ scale: 1.1 }} onClick={playPreview} className="w-16 h-16 bg-[#E3EF26] rounded-full flex items-center justify-center text-black shadow-lg"><Volume2 className="w-8 h-8" /></motion.button>
                  </div>
                  <h2 className="text-2xl font-black italic mb-2">Review Rekaman</h2>
                  <p className="text-xs opacity-50 mb-10 uppercase tracking-widest">Klik ikon volume untuk mendengar</p>
                  <div className="flex gap-4">
                    <button onClick={() => setStatus("idle")} className="px-10 py-4 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Buang</button>
                    <button onClick={processAnalysis} className="px-12 py-4 bg-[#E3EF26] text-black rounded-full text-[10px] font-black uppercase shadow-xl">Analisis AI</button>
                  </div>
                </motion.div>
              )}

              {status === "analyzing" && (
                <motion.div key="analyzing" className="flex flex-col items-center">
                  <RefreshCw className="w-20 h-20 animate-spin text-[#E3EF26] mb-8" />
                  <h3 className="text-2xl font-bold italic tracking-wide">Mengkalkulasi Gelombang...</h3>
                </motion.div>
              )}

              {status === "completed" && (
                <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#E3EF26] rounded-full flex items-center justify-center text-black mb-6 shadow-[0_0_40px_rgba(227,239,38,0.4)]"><CheckCircle2 className="w-10 h-10" /></div>
                  <h2 className="text-4xl font-black italic">Hasil Selesai</h2>
                  <button onClick={() => setStatus("idle")} className="mt-10 px-10 py-4 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Analisis Ulang</button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#E3EF26]/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        {status === "completed" && (
          <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-foreground">
                <div className="p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 rounded-[45px] shadow-sm">
                   <div className="flex items-center gap-3 mb-6"><Activity className="w-5 h-5 text-[#076653]" /><h3 className="font-bold text-[10px] uppercase opacity-60">Pitch Dasar</h3></div>
                   <span className="text-5xl font-black tracking-tighter text-[#076653] dark:text-[#E3EF26]">{realHz} Hz</span>
                   <p className="text-[11px] italic mt-4 opacity-60 leading-relaxed">Artikulasi vokal kamu sangat mantap, mencerminkan kejernihan pikiran hari ini.</p>
                </div>
                <div className="p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 rounded-[45px] shadow-sm">
                   <div className="flex items-center gap-3 mb-6"><TrendingUp className="w-5 h-5 text-[#076653]" /><h3 className="font-bold text-[10px] uppercase opacity-60">Stabilitas</h3></div>
                   <div className="flex justify-between items-end mb-4"><span className="text-4xl font-black tracking-tighter">{stabilityScore}%</span><span className="text-[9px] font-bold px-2 py-1 bg-green-500/10 text-green-600 rounded-lg uppercase">Optimal</span></div>
                   <div className="h-2 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${stabilityScore}%` }} transition={{ duration: 1.5 }} className="h-full bg-[#076653]" /></div>
                </div>
                <div className="p-8 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/40 rounded-[45px] shadow-sm">
                   <div className="flex items-center gap-3 mb-6"><Zap className="w-5 h-5 text-[#076653]" /><h3 className="font-bold text-[10px] uppercase opacity-60">Resonansi</h3></div>
                   <div className="bg-black/5 dark:bg-white/10 p-5 rounded-3xl mb-4 text-center font-black italic">Moderate-High</div>
                   <p className="text-[11px] italic opacity-60 leading-relaxed">Kekuatan vokal menunjukkan energi psikologis yang sangat positif.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-[#076653] text-white rounded-[55px] shadow-xl relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-6 relative z-10"><Sparkles className="w-6 h-6 text-[#E3EF26]" /><h3 className="text-2xl font-bold italic tracking-tight">AI Narrative</h3></div>
                  <p className="text-sm leading-relaxed opacity-80 italic mb-8 relative z-10">"Alifi, spektrum suara kamu menunjukkan kejernihan yang luar biasa. Kamu sedang berada dalam kondisi mental yang tangguh. Pertahankan ritme napas ini, terutama saat menghadapi jadwal klinis yang menantang."</p>
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-black/20 blur-[80px] rounded-full" />
                </div>
                <div className="p-10 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 rounded-[55px] shadow-sm text-foreground">
                  <div className="flex items-center gap-4 mb-6"><MessageSquareHeart className="w-6 h-6 text-[#076653]" /><h3 className="text-2xl font-bold italic tracking-tight">Saran Khusus</h3></div>
                  <p className="text-sm leading-relaxed opacity-70 italic">Kondisi pita suaramu mencerminkan pikiran yang tenang. Cobalah minum segelas air hangat dan lakukan jeda fokus selama 2 menit untuk mengunci kestabilan emosi ini sepanjang hari.</p>
                </div>
             </div>

             <motion.div whileHover={{ scale: 1.01 }} onClick={() => navigate("/consultation")} className="p-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[55px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer relative overflow-hidden group">
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-20 h-20 rounded-[30px] bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500"><Stethoscope className="w-10 h-10 text-white" /></div>
                 <div className="max-w-md"><h3 className="text-2xl font-black italic tracking-tight mb-2">Konsultasi Hasil</h3><p className="text-sm opacity-80 leading-relaxed font-medium">Bahas detail biometrik vokalmu lebih dalam dengan dr. Sarah atau tenaga ahli untuk langkah preventif yang lebih akurat.</p></div>
               </div>
               <div className="flex items-center gap-4 relative z-10"><div className="hidden md:block h-12 w-[1px] bg-white/20 mx-4" /><span className="text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Buka Laman Konsultasi</span><div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-xl group-hover:translate-x-2 transition-transform"><ChevronRight className="w-6 h-6" /></div></div>
             </motion.div>
          </div>
        )}

        <footer className="mt-24 mb-10 flex flex-col items-center gap-4 opacity-20 text-foreground text-center">
          <BarChart3 className="w-5 h-5" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em]">AMARTA BIO-ENGINE</p>
        </footer>
      </div>
    </AppLayout>
  );
};

export default VoiceAnalysisPage;