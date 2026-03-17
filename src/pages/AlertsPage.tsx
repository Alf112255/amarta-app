import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

const AlertsPage = () => {
  const { t } = useLanguage();

  const alerts = [
    {
      level: "info",
      icon: Info,
      title: "Slight voice pattern change",
      desc: "Your pitch variation has increased slightly over the past 3 days. This is worth monitoring.",
      time: "2 hours ago",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("alert.title")}</h1>
        </div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card text-center py-8 border-primary/20"
        >
          <CheckCircle className="w-12 h-12 text-primary mx-auto" />
          <p className="text-foreground font-semibold mt-3">{t("alert.none")}</p>
        </motion.div>

        {/* Alert list */}
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bento-card flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <alert.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.desc}</p>
                <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AlertsPage;
