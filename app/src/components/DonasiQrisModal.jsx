import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Download, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';
import qrisImg from '../assets/qris-donasi.jpg';

export default function DonasiQrisModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const nmid = 'ID1026605316029';
  const merchantName = 'BELAJAR FIKIH BARENG, CILNGSI';
  const waNumber = '085179848996';
  const waUrl = `https://wa.me/6285179848996?text=${encodeURIComponent(
    "Assalamu'alaikum Admin Al-Miftah, alhamdulillah saya telah menyalurkan infaq/donasi via QRIS untuk pengembangan aplikasi Al-Miftah..."
  )}`;

  const handleCopyNmid = async () => {
    try {
      await navigator.clipboard.writeText(nmid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = nmid;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

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
                <Heart className="w-6 h-6 fill-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    Infaq & Donasi QRIS
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-emerald-950 rounded-full">
                    GPN Resmi
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Dukung operasional & dakwah ilmu gramatika Arab gratis
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 hover:text-white transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-800/60 text-[11px] text-emerald-200/90 leading-relaxed font-arabic text-right">
            مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ
            <span className="block font-sans text-[11px] text-emerald-300/80 text-left mt-0.5">
              "Barangsiapa menunjuki kepada kebaikan, ia mendapatkan pahala semisal orang yang mengerjakannya." (HR. Muslim)
            </span>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          
          {/* QRIS Display Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
            <div className="max-w-[260px] mx-auto bg-white p-2.5 rounded-2xl border border-slate-200 shadow-md">
              <img 
                src={qrisImg} 
                alt="Kode QRIS Donasi Al-Miftah"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>

            {/* Merchant Details */}
            <div className="mt-3.5 space-y-1">
              <div className="font-extrabold text-sm text-slate-900 flex items-center justify-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{merchantName}</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                NMID: <span className="font-bold text-slate-700">{nmid}</span>
              </div>
            </div>

            {/* Action Buttons: Unduh & Salin NMID */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200">
              <a
                href={qrisImg}
                download="qris-donasi-al-miftah.jpg"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh QRIS</span>
              </a>

              <button
                onClick={handleCopyNmid}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Salin NMID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Supported Methods */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Menerima Seluruh Pembayaran QRIS Nasional</span>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
              Bisa di-scan dari <strong>BCA, Livin' Mandiri, BRImo, BNI, BSI Mobile</strong>, serta E-Wallet seperti <strong>GoPay, OVO, DANA, ShopeePay, LinkAja</strong>, dan seluruh aplikasi bank berstandar QRIS GPN.
            </div>
          </div>

          {/* Quick Guide */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Panduan Donasi (4 Langkah)</span>
            </div>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              <li>Buka aplikasi Mobile Banking atau E-Wallet Anda.</li>
              <li>Pilih menu <strong>Scan QR / Bayar QRIS</strong>.</li>
              <li>Scan kode QR di atas (atau unggah dari galeri HP jika telah mengunduh gambar).</li>
              <li>Masukkan nominal seikhlasnya, pastikan penerima adalah <strong>BELAJAR FIKIH BARENG, CILNGSI</strong>, lalu konfirmasi pembayaran.</li>
            </ol>
          </div>

          {/* WhatsApp Confirmation / Question */}
          <div className="p-3.5 bg-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xs font-bold text-slate-800">Perlu Konfirmasi atau Ada Pertanyaan?</div>
              <div className="text-[11px] text-slate-500">Hubungi langsung via WhatsApp ke <span className="font-semibold text-emerald-700">{waNumber}</span></div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition shrink-0 active:scale-95"
            >
              <span>Chat Admin WA</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Du'a */}
          <div className="text-center p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <p className="font-arabic text-sm text-emerald-950 font-bold">
              جَزَاكُمُ اللهُ خَيْرًا وَبَارَكَ اللهُ فِي أَمْوَالِكُمْ وَأَهْلِيكُمْ
            </p>
            <p className="text-[11px] text-amber-800">
              Semoga Allah menjadikannya amal jariyah yang pahalanya terus mengalir, serta mendatangkan keberkahan berlimpah bagi Anda sekeluarga. Aamiin.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
