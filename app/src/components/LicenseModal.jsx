import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  KeyRound, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Award,
  Zap
} from 'lucide-react';
import { activateLicense } from '../utils/license';

export default function LicenseModal({ isOpen, onClose, onActivated }) {
  const [inputKey, setInputKey] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const waNumber = '6285179848996';
  const waMessage = encodeURIComponent(
    "Assalamu'alaikum Admin Al-Miftah, saya ingin membeli Kode Lisensi Al-Miftah PRO (Sekali Bayar Seumur Hidup). Mohon info nomor rekening / QRIS pembayaran. Terima kasih!"
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  if (!isOpen) return null;

  const handleActivate = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const result = activateLicense(inputKey);
    if (result.success) {
      setSuccessMessage(result.message);
      if (onActivated) onActivated();
      setTimeout(() => {
        onClose();
      }, 1600);
    } else {
      setErrorMessage(result.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-emerald-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center shadow-lg shadow-amber-900/40">
                <Crown className="w-6 h-6 fill-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    Al-Miftah PRO
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-emerald-950 rounded-full">
                    Akses Seumur Hidup
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Buka seluruh 42 bab & 6.236 ayat I'rab Al-Qur'an (30 Juz)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-800/60 text-[11px] text-emerald-200/90 leading-relaxed font-arabic text-right">
            خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            <span className="block font-sans text-[11px] text-emerald-300/80 text-left mt-0.5">
              "Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya." (HR. Bukhari)
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
          
          {/* Harga Promo Banner */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="text-xs text-slate-400 line-through">Rp 150.000</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-emerald-900">Rp 49.000</span>
                <span className="text-xs font-semibold text-slate-600">/ Sekali Bayar Selamanya</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Tanpa Langganan</span>
            </div>
          </div>

          {/* Manfaat PRO */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Keunggulan Akun PRO:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-800">42 Bab Nahwu & Sharaf Lengkap</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">6.236 Ayat I'rab 30 Juz Penuh</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <Zap className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-slate-800">Studio I'rab & Kuis Evaluasi</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/70">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-slate-800">Update Materi Gratis Selamanya</span>
              </div>
            </div>
          </div>

          {/* Langkah 1: Beli via WhatsApp */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h5 className="font-bold text-sm text-slate-900">Belum Punya Kode Lisensi?</h5>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hubungi Admin via WhatsApp untuk pemesanan instan. Mendukung pembayaran QRIS (BCA, Mandiri, BRI, BSI, GoPay, OVO, ShopeePay) atau Transfer Bank.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Beli via WhatsApp (085179848996)</span>
            </a>
          </div>

          {/* Langkah 2: Masukkan Kode Lisensi */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-emerald-950 text-[11px] font-bold flex items-center justify-center">2</span>
              <h5 className="font-bold text-sm text-slate-900">Sudah Punya Kode Lisensi?</h5>
            </div>
            <form onSubmit={handleActivate} className="space-y-2.5">
              <input
                type="text"
                placeholder="Contoh: MFT-2VE5-UR2M-FD9F"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs sm:text-sm font-mono tracking-wider uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{successMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !inputKey.trim()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-emerald-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Aktifkan Akses PRO Sekarang</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
