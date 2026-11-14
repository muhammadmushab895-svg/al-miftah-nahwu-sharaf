import React from 'react';
import { Lock, Crown } from 'lucide-react';

export default function ProPaywallCard({
  title,
  description,
  features = [
    'Sekali Bayar Selamanya (Tanpa Langganan Bulanan)',
    'Full 62 Tashrif (Mujarrad, Mazid, Ruba\'i) & 20 Kuis',
    'Full 315 Model I\'rab Visual & 119 Dalil Syahid',
    'Full 42 Bab Nahwu-Sharaf & I\'rab 30 Juz Al-Qur\'an',
  ],
  onOpenLicense,
  compact = false,
}) {
  const handleBuy = () => onOpenLicense?.('qris');
  const handleEnterKey = () => onOpenLicense?.('license');

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-2xl p-5 text-white border border-amber-400/35 text-center space-y-3 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[11px] font-black">
          <Lock className="w-3 h-3" />
          <span>KHUSUS AL-MIFTAH PRO</span>
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-white">{title}</h4>
        <p className="text-xs text-emerald-100/85 max-w-md mx-auto leading-relaxed">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={handleBuy}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-xs shadow flex items-center gap-1.5 cursor-pointer transition"
          >
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span>Buka Akses PRO (Rp 49rb)</span>
          </button>
          <button
            onClick={handleEnterKey}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-bold border border-white/20 cursor-pointer transition"
          >
            Masukkan Kode Lisensi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 rounded-3xl p-7 sm:p-10 text-white shadow-xl border border-amber-400/35 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
        <Lock className="w-8 h-8 text-amber-300" />
      </div>

      <div className="space-y-2 max-w-lg mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black">
          <Crown className="w-3.5 h-3.5 fill-current" />
          <span>KONTEN KHUSUS AL-MIFTAH PRO</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">{title}</h3>
        <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        <button
          onClick={handleBuy}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer"
        >
          <Crown className="w-4 h-4 fill-current" />
          <span>Beli Akses PRO (Rp 49.000 Sekali Bayar)</span>
        </button>

        <button
          onClick={handleEnterKey}
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-emerald-100 text-xs font-bold border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Masukkan Kode Lisensi</span>
        </button>
      </div>

      <div className="pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-emerald-300/85">
        {features.map((feat, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            ✓ {feat}
          </span>
        ))}
      </div>
    </div>
  );
}
