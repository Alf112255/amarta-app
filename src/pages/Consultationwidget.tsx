import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

const FloatingHealthWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Penanda untuk membedakan antara klik biasa dan geser (drag)
  const isDraggingRef = useRef(false);

  return (
    <>
      {/* 1. AREA BATAS LAYAR (CONSTRAINTS) */}
      {/* Div ini membungkus seluruh layar agar tombol tidak bisa diseret keluar dari pandangan */}
      <div 
        id="widget-boundary" 
        className="fixed inset-4 pointer-events-none z-40" 
      />

      {/* 2. TOMBOL FLOATING YANG BISA DIGESER */}
      <motion.button
        drag
        dragConstraints={{
          top: -window.innerHeight + 120,
          left: -window.innerWidth + 100,
          right: 0,
          bottom: 0,
        }}
        dragElastic={0.1} // Efek membal halus saat mentok pinggir layar
        dragMomentum={false} // Tombol langsung berhenti di tempat saat dilepas
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          // Beri jeda 150ms sebelum mengizinkan klik kembali
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 150);
        }}
        onClick={() => {
          // Hanya buka widget jika pengguna benar-benar mengeklik, bukan menggeser
          if (!isDraggingRef.current) {
            setIsOpen(!isOpen);
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, cursor: "grabbing" }}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#2B6947] via-[#669B41] to-[#B6D438] text-white shadow-[0_12px_30px_rgba(43,105,71,0.35)] flex items-center justify-center cursor-grab touch-none border border-white/20"
      >
        <HeartPulse className="w-8 h-8 stroke-[2.2]" />
      </motion.button>

      {/* POP-UP WIDGET KONSULTASI (Jika isOpen === true) */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-black/5">
          <p className="text-sm font-bold text-foreground">Halo dokter Ali, ada yang bisa dibantu?</p>
          {/* Isi konten widget konsultasi Anda di sini */}
        </div>
      )}
    </>
  );
};

export default FloatingHealthWidget;