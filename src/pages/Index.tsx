import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold mb-6">Selamat Datang di AMARTA</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Teman setia untuk kesehatan mental dan dukungan emosional Anda.
        </p>
        <Button onClick={() => navigate("/chat")} size="lg">
          Mulai Chat Sekarang
        </Button>
      </div>
    </AppLayout>
  );
};

export default Index;