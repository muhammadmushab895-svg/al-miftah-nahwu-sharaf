import React, { useState } from 'react';
import { QrCode, Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FloatingActionButtons({ onOpenDonasi }) {
  const [minimized, setMinimized] = useState(false);
  const waNumber = '6285179848996';
  const waMessage = encodeURIComponent(
    "Assalamu'alaikum Admin Al-Miftah, saya ingin konsultasi terkait pembelajaran kaidah Nahwu dan Sharaf..."
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <aside 
      aria-label="Aksi Cepat Donasi dan Konsultasi"
      className="fixed right-3.5 sm:right-6 bottom-20 lg:bottom-8 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none"
      style={{
        // Respect mobile safe-area inset
        marginBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* Minimize / Expand Toggle */}
      <div className="flex items-center justify-end w-full">
        <button
          onClick={() => setMinimized(!minimized)}
          className="text-[10px] text-slate-500 hover:text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200 shadow-sm transition flex items-center gap-1 opacity-70 hover:opacity-100"
          title={minimized ? "Tampilkan tombol cepat" : "Sembunyikan tombol"}
          aria-expanded={!minimized}
        >
          {minimized ? (
            <>
              <span className="font-bold">Bantuan & Infaq</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>Tutup</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      </div>

      {!minimized && (
        <div className="flex flex-col items-end gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-200">
          
          {/* 1. Tombol Donasi QRIS */}
          <button
            onClick={onOpenDonasi}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-xs sm:text-sm rounded-full shadow-xl shadow-amber-950/20 border-2 border-white/80 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Infaq & Donasi Pengembangan Al-Miftah via QRIS"
            aria-label="Donasi QRIS"
          >
            <div className="relative flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-emerald-950 text-amber-400 flex items-center justify-center shadow-inner">
                <QrCode className="w-4 h-4" />
              </span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-semibold text-emerald-900 tracking-tight flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" /> Infaq & Wakaf
              </span>
              <span className="font-black text-xs sm:text-sm text-emerald-950 tracking-tight">
                Donasi QRIS
              </span>
            </div>
          </button>

          {/* 2. Tombol Konsultasi WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm rounded-full shadow-xl shadow-emerald-950/25 border-2 border-white/90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Konsultasi Gramatika Arab & Layanan via WhatsApp (0851-7984-8996)"
            aria-label="Konsultasi via WhatsApp ke 085179848996"
          >
            <div className="relative flex items-center justify-center">
              {/* WhatsApp Official Icon SVG */}
              <div className="w-7 h-7 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-sm">
                <svg 
                  className="w-4 h-4 fill-current text-[#25D366]" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-white"></span>
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] font-semibold text-emerald-100 tracking-tight">
                Tanya / Konsultasi
              </span>
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
                WhatsApp Admin
              </span>
            </div>
          </a>

        </div>
      )}
    </aside>
  );
}
