import { motion } from "framer-motion";
import { Mic, MessageCircle, BarChart3, AlertTriangle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";

const DashboardPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Friend";

  const cards = [
    {
      title: t("dashboard.voice"),
      desc: t("dashboard.voice.desc"),
      icon: Mic,
      path: "/voice",
      gradient: "gradient-sage",
    },
    {
      title: t("dashboard.chat"),
      desc: t("dashboard.chat.desc"),
      icon: MessageCircle,
      path: "/chat",
      gradient: "gradient-warm",
    },
    {
      title: t("dashboard.resilience"),
      desc: t("dashboard.resilience.desc"),
      icon: BarChart3,
      path: "/resilience",
      gradient: "",
    },
    {
      title: t("dashboard.alerts"),
      desc: t("dashboard.alerts.desc"),
      icon: AlertTriangle,
      path: "/alerts",
      gradient: "",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Hi, {firstName} <span className="inline-block animate-float">🌿</span>
          </h1>
          <p className="text-muted-foreground">{t("dashboard.greeting")}</p>
        </motion.div>

        {/* Quick mood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card"
        >
          <p className="text-sm font-medium text-muted-foreground mb-3">{t("dashboard.greeting")}</p>
          <div className="flex justify-around">
            {["😊", "😐", "😔", "😰", "😡"].map((emoji, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className="text-3xl p-2 rounded-2xl hover:bg-muted transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {cards.map((card, i) => (
            <motion.button
              key={card.path}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              className={`bento-card-hover text-left ${
                i < 2 ? "col-span-1" : "col-span-1"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                  card.gradient || "bg-muted"
                }`}
              >
                <card.icon className={`w-5 h-5 ${card.gradient ? "text-primary-foreground" : "text-primary"}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.desc}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Wellness tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bento-card bg-sage-light/30 border-sage/20"
        >
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Daily Wisdom</p>
              <p className="text-xs text-muted-foreground mt-1">
                "The greatest glory in living lies not in never falling, but in rising every time we fall." — Nelson Mandela
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
