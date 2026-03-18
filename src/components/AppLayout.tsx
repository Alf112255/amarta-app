import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, MessageCircle, Mic, HeartPulse, Menu, X, ShieldCheck, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Cek tema saat komponen dimuat
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "chat", label: "Chat", icon: MessageCircle, path: "/chat" },
    { id: "voice", label: "Suara", icon: Mic, path: "/voice" },
    { id: "consult", label: "Konsul", icon: HeartPulse, path: "/consultation" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Konten Utama */}
      <main className="pb-36">
        {children}
      </main>

      {/* --- FLOATING BOTTOM NAVIGATION (AMARTA STYLE) --- */}
      <div className="fixed bottom-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="bg-white/10 dark:bg-black/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[35px] py-2 flex items-center gap-1 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] pointer-events-auto transition-all duration-500">
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative px-5 py-3 rounded-[30px] flex items-center gap-2 transition-all duration-500 ${
                  isActive ? "text-white" : "text-foreground/60 hover:text-foreground dark:text-white/50 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-[#cc5833] rounded-[30px] z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 z-10 transition-transform ${isActive ? "scale-110" : "scale-100"}`} />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[11px] font-bold z-10 leading-none whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}

          <div className="w-[1px] h-6 bg-foreground/10 dark:bg-white/10 mx-1" />

          {/* Hamburger Menu */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 text-foreground/60 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Sidebar Overlay (Hamburger Menu) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-background/95 backdrop-blur-md border-l border-border z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <h2 className="font-bold text-lg">Menu AMARTA</h2>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* --- TOGGLE DARK MODE --- */}
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-4 bg-muted/40 dark:bg-white/5 hover:bg-muted rounded-[24px] transition-all border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    {isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                    <span className="font-medium text-sm">{isDark ? "Mode Gelap" : "Mode Terang"}</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? "bg-green-600" : "bg-gray-300"}`}>
                    <motion.div 
                      animate={{ x: isDark ? 20 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </button>

                <div className="pt-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-4">Fitur Utama</p>
                  
                  <button 
                    onClick={() => { navigate("/resilience"); setIsSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-[20px] transition-all group"
                  >
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-sm">Skor Ketahanan</span>
                  </button>

                  <div className="h-[1px] bg-border my-4" />

                  <button className="w-full flex items-center gap-3 p-4 hover:bg-muted rounded-[20px] transition-all">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-sm">Pengaturan</span>
                  </button>

                  <button className="w-full flex items-center gap-3 p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[20px] transition-all text-red-500">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Keluar</span>
                  </button>
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