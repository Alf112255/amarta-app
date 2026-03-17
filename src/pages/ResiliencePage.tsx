import { motion } from "framer-motion";
import { TrendingUp, Activity, Brain, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

const ResiliencePage = () => {
  const { t } = useLanguage();

  const weeklyData = [65, 70, 68, 75, 72, 78, 80];
  const maxVal = Math.max(...weeklyData);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const metrics = [
    { label: "Emotional Stability", value: 78, icon: Brain, color: "bg-primary" },
    { label: "Stress Recovery", value: 65, icon: Shield, color: "bg-accent" },
    { label: "Social Connection", value: 82, icon: Activity, color: "bg-sage" },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("resilience.title")}</h1>
        </div>

        {/* Overall score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bento-card text-center py-8"
        >
          <p className="text-sm text-muted-foreground">{t("resilience.overall")}</p>
          <motion.p
            className="text-6xl font-bold text-gradient mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            75
          </motion.p>
          <div className="flex items-center justify-center gap-1 mt-2 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+5% this week</span>
          </div>
        </motion.div>

        {/* Weekly chart */}
        <div className="bento-card">
          <h3 className="font-semibold text-foreground mb-4">{t("resilience.weekly")}</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                <motion.div
                  className="w-full rounded-xl bg-primary/80"
                  initial={{ height: 0 }}
                  animate={{ height: `${(val / maxVal) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                />
                <span className="text-xs text-muted-foreground">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bento-card flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${metric.color}/10`}>
                <metric.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{metric.label}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <motion.div
                    className={`h-2 rounded-full ${metric.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-foreground">{metric.value}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ResiliencePage;
