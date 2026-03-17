import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import amartaLogo from "@/assets/amarta-logo.png";

const LanguageSelectPage = () => {
  const { setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (lang: "en" | "id") => {
    setLanguage(lang);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm text-center space-y-8"
      >
        <motion.img
          src={amartaLogo}
          alt="AMARTA"
          className="w-20 h-20 mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        />
        <div>
          <h1 className="text-3xl font-bold text-foreground">AMARTA</h1>
          <p className="text-muted-foreground mt-2">{t("app.tagline")}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{t("lang.select")}</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-between"
              onClick={() => handleSelect("id")}
            >
              <span className="text-2xl">🇮🇩</span>
              <span className="flex-1">Bahasa Indonesia</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-between"
              onClick={() => handleSelect("en")}
            >
              <span className="text-2xl">🇬🇧</span>
              <span className="flex-1">English</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelectPage;
