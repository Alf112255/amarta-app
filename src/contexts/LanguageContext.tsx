import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "app.name": { en: "AMARTA", id: "AMARTA" },
  "app.tagline": { en: "Your Mental Health Companion", id: "Pendamping Kesehatan Mental Anda" },
  "app.subtitle": { en: "Detect early depression signals through voice biometrics and receive empathetic AI support", id: "Deteksi sinyal depresi dini melalui biometrik suara dan dapatkan dukungan AI yang empatik" },
  "lang.select": { en: "Select Your Language", id: "Pilih Bahasa Anda" },
  "lang.continue": { en: "Continue", id: "Lanjutkan" },
  "auth.login": { en: "Sign in with Google", id: "Masuk dengan Google" },
  "auth.welcome": { en: "Welcome Back", id: "Selamat Datang Kembali" },
  "auth.subtitle": { en: "Sign in to continue your wellness journey", id: "Masuk untuk melanjutkan perjalanan kesehatan Anda" },
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.voice": { en: "Voice Analysis", id: "Analisis Suara" },
  "nav.chat": { en: "AI Chat", id: "Chat AI" },
  "nav.resilience": { en: "Resilience", id: "Ketahanan" },
  "nav.alerts": { en: "Alerts", id: "Peringatan" },
  "nav.consult": { en: "Consultation", id: "Konsultasi" },
  "dashboard.greeting": { en: "How are you feeling today?", id: "Bagaimana perasaan Anda hari ini?" },
  "dashboard.voice": { en: "Voice Check-in", id: "Cek Suara" },
  "dashboard.voice.desc": { en: "Record your voice to analyze emotional patterns", id: "Rekam suara Anda untuk menganalisis pola emosi" },
  "dashboard.chat": { en: "Talk to AMARTA", id: "Bicara dengan AMARTA" },
  "dashboard.chat.desc": { en: "Get empathetic AI support anytime", id: "Dapatkan dukungan AI empatik kapan saja" },
  "dashboard.resilience": { en: "Resilience Score", id: "Skor Ketahanan" },
  "dashboard.resilience.desc": { en: "Track your mental health progress", id: "Pantau progres kesehatan mental Anda" },
  "dashboard.alerts": { en: "Early Warnings", id: "Peringatan Dini" },
  "dashboard.alerts.desc": { en: "Monitor mental health signals", id: "Pantau sinyal kesehatan mental" },
  "voice.title": { en: "Voice Biometric Analysis", id: "Analisis Biometrik Suara" },
  "voice.subtitle": { en: "Speak naturally for 30 seconds to analyze your emotional state", id: "Berbicaralah secara alami selama 30 detik untuk menganalisis kondisi emosional Anda" },
  "voice.start": { en: "Start Recording", id: "Mulai Rekam" },
  "voice.stop": { en: "Stop Recording", id: "Berhenti Rekam" },
  "voice.analyzing": { en: "Analyzing your voice...", id: "Menganalisis suara Anda..." },
  "voice.pitch": { en: "Pitch Variation", id: "Variasi Nada" },
  "voice.latency": { en: "Speech Latency", id: "Latensi Bicara" },
  "voice.stability": { en: "Tone Stability", id: "Stabilitas Nada" },
  "chat.title": { en: "AMARTA AI", id: "AMARTA AI" },
  "chat.placeholder": { en: "Share how you're feeling...", id: "Ceritakan perasaan Anda..." },
  "chat.send": { en: "Send", id: "Kirim" },
  "chat.welcome": { en: "Hello! I'm AMARTA, your mental health companion. How can I support you today?", id: "Halo! Saya AMARTA, pendamping kesehatan mental Anda. Bagaimana saya bisa membantu Anda hari ini?" },
  "resilience.title": { en: "Resilience Dashboard", id: "Dasbor Ketahanan" },
  "resilience.overall": { en: "Overall Score", id: "Skor Keseluruhan" },
  "resilience.weekly": { en: "Weekly Trend", id: "Tren Mingguan" },
  "alert.title": { en: "Early Warning System", id: "Sistem Peringatan Dini" },
  "alert.none": { en: "No active warnings. Keep up the good work!", id: "Tidak ada peringatan aktif. Pertahankan!" },
  "consult.title": { en: "Professional Consultation", id: "Konsultasi Profesional" },
  "consult.subtitle": { en: "Connect with mental health professionals", id: "Terhubung dengan profesional kesehatan mental" },
  "consult.book": { en: "Book Session", id: "Booking Sesi" },
  "settings.darkmode": { en: "Dark Mode", id: "Mode Gelap" },
  "settings.language": { en: "Language", id: "Bahasa" },
  "settings.logout": { en: "Sign Out", id: "Keluar" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("amarta-language");
    return (saved as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("amarta-language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
