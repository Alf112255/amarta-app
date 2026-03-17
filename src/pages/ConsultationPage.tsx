import { motion } from "framer-motion";
import { UserCheck, Calendar, Video, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import AppLayout from "@/components/AppLayout";

const ConsultationPage = () => {
  const { t } = useLanguage();

  const professionals = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Clinical Psychologist",
      rating: 4.9,
      available: true,
    },
    {
      name: "Dr. Budi Santoso",
      specialty: "Psychiatrist",
      rating: 4.8,
      available: true,
    },
    {
      name: "Ayu Pertiwi, M.Psi",
      specialty: "Counseling Psychologist",
      rating: 4.7,
      available: false,
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("consult.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("consult.subtitle")}</p>
        </div>

        {/* Consultation types */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Video, label: "Video Call" },
            { icon: MessageSquare, label: "Text Chat" },
          ].map((type) => (
            <motion.div
              key={type.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bento-card-hover text-center py-6 cursor-pointer"
            >
              <type.icon className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{type.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Professional list */}
        <div className="space-y-3">
          {professionals.map((prof, i) => (
            <motion.div
              key={prof.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bento-card flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl gradient-sage flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{prof.name}</p>
                <p className="text-xs text-muted-foreground">{prof.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs text-muted-foreground">{prof.rating}</span>
                </div>
              </div>
              <Button
                variant={prof.available ? "sage" : "outline"}
                size="sm"
                disabled={!prof.available}
              >
                {prof.available ? t("consult.book") : "Unavailable"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ConsultationPage;
