import React, { useState, useEffect } from 'react';
import { 
  X, 
  Crown, 
  KeyRound, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  BookOpen, 
  Sparkles, 
  Zap, 
  Award,
  Copy,
  Smartphone,
  QrCode,
  HelpCircle,
  RotateCcw,
  SlidersHorizontal,
  Lock,
  Globe,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { 
  getDeviceId, 
  activateLicense, 
  activateAdminDirect, 
  resetLicense, 
  generateDeviceBoundKey, 
  generateUniversalKey, 
  buildWhatsAppReplyTemplate,
  getLicenseStatus 
} from '../utils/license';

export default function LicenseModal({ isOpen, onClose, onActivated, initialTab = 'qris' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'qris' | 'license' | 'admin'
  const [inputKey, setInputKey] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  // Device ID state
  const [deviceId, setDeviceId] = useState('');
  const [licenseState, setLicenseState] = useState({ isPro: false, isAdmin: false });

  // Admin PIN Gate State
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(null);

  // Admin Generator States
  const [targetDeviceInput, setTargetDeviceInput] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [generatedType, setGeneratedType] = useState('');
  const [targetDevFormatted, setTargetDevFormatted] = useState('');

  // Easter Egg (Klik logo/crown 5x untuk buka mode Admin)
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const dev = getDeviceId();
      setDeviceId(dev);
      const status = getLicenseStatus();
      setLicenseState(status);
      setActiveTab(initialTab || 'qris');

      // Check URL param ?admin=almiftah
      if (typeof window !== 'undefined' && window.location.search.includes('admin=')) {
        activateAdminDirect();
        setLicenseState(getLicenseStatus());
        setActiveTab('admin');
      }
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const waNumber = '6285179848996';
  const cleanDevId = deviceId || getDeviceId();
  const waBuyMessage = encodeURIComponent(
    `Assalamu'alaikum Admin Al-Miftah,\n` +
    `Saya ingin aktivasi Al-Miftah PRO Lifetime (Rp 49.000 Sekali Bayar).\n\n` +
    `📱 ID Perangkat Saya: ${cleanDevId}\n\n` +
    `Mohon info rekening transfer / QRIS dan kirimkan kode lisensi resmi untuk perangkat saya. Terima kasih!`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waBuyMessage}`;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleLogoEasterEgg = () => {
    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);
    if (nextCount >= 5) {
      setLogoClickCount(0);
      activateAdminDirect();
      const updated = getLicenseStatus();
      setLicenseState(updated);
      setActiveTab('admin');
      if (onActivated) onActivated();
    }
  };

  const handleAdminPinSubmit = (e) => {
    e.preventDefault();
    setAdminPinError(null);
    const pin = adminPinInput.trim().toUpperCase();

    // Accepted PINs & Master Keys
    const validPins = [
      '2026', 
      'ADMIN', 
      'ADMIN123', 
      'MFT-VIP-USTADZ-2026', 
      'MFT-OWNER-2026', 
      'ALMIFTAH-ADMIN-VIP', 
      'ADMIN-ALMIFTAH-2026'
    ];

    if (validPins.includes(pin)) {
      activateAdminDirect();
      const updated = getLicenseStatus();
      setLicenseState(updated);
      setAdminPinInput('');
      if (onActivated) onActivated();
    } else {
      setAdminPinError('PIN salah. Masukkan PIN Admin resmi (Default PIN: 2026).');
    }
  };

  const handleActivate = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const result = activateLicense(inputKey);
    if (result.success) {
      setSuccessMessage(result.message);
      const updated = getLicenseStatus();
      setLicenseState(updated);
      if (onActivated) onActivated();
      setTimeout(() => {
        if (updated.isAdmin) {
          setActiveTab('admin');
        } else {
          onClose();
        }
      }, 1400);
    } else {
      setErrorMessage(result.message);
    }

    setIsSubmitting(false);
  };

  // Generator Action: 1 Device 1 Code
  const handleGenerateDeviceBound = () => {
    if (!targetDeviceInput.trim()) {
      alert('Masukkan ID Perangkat Pembeli (misal: DEV-8K2P9M) dari pesan WhatsApp terlebih dahulu!');
      return;
    }
    const key = generateDeviceBoundKey(targetDeviceInput);
    if (!key) {
      alert('Format ID Perangkat tidak valid! Pastikan terdiri dari 6 karakter unik (contoh: DEV-8K2P9M atau 8K2P9M).');
      return;
    }
    const clean = 'DEV-' + targetDeviceInput.trim().toUpperCase().replace('DEV-', '');
    setGeneratedKey(key);
    setTargetDevFormatted(clean);
    setGeneratedType('device');
  };

  // Generator Action: Universal Key
  const handleGenerateUniversal = () => {
    const key = generateUniversalKey();
    setGeneratedKey(key);
    setTargetDevFormatted('Universal (Semua Perangkat)');
    setGeneratedType('universal');
  };

  // Reset License (Testing)
  const handleReset = () => {
    if (window.confirm('Reset lisensi peramban ini kembali ke status GRATIS?')) {
      resetLicense();
      setLicenseState({ isPro: false, isAdmin: false });
      if (onActivated) onActivated();
      onClose();
      window.location.reload();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-5 sm:p-6 border-b border-emerald-800">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLogoEasterEgg}
                title="Al-Miftah PRO (Klik 5x untuk Akses Admin Instan)"
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-emerald-950 flex items-center justify-center shadow-lg shadow-amber-900/40 transform active:scale-95 transition cursor-pointer shrink-0"
              >
                <Crown className="w-6 h-6 fill-emerald-950" />
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    Al-Miftah PRO
                  </h3>
                  {licenseState.isAdmin ? (
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-indigo-500 text-white rounded-full shadow-xs">
                      👑 SUPER ADMIN
                    </span>
                  ) : licenseState.isPro ? (
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-400 text-emerald-950 rounded-full shadow-xs">
                      PRO AKTIF (LIFETIME)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-emerald-950 rounded-full">
                      Sekali Bayar Seumur Hidup
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  Buka 42 Bab Nahwu-Sharaf & 6.236 Ayat I'rab 30 Juz Al-Qur'an Penuh
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

          {/* Navigation Tabs - ALWAYS VISIBLE TO ALL USERS */}
          <div className="mt-4 pt-3 border-t border-emerald-800/60 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('qris')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'qris'
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>1. Pembayaran & QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('license')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition shrink-0 cursor-pointer ${
                activeTab === 'license'
                  ? 'bg-amber-400 text-emerald-950 shadow-md font-black'
                  : 'bg-emerald-900/60 text-emerald-200 hover:bg-emerald-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>2. Masukkan Lisensi</span>
            </button>

            {/* TAB BUAT KODE ADMIN - SELALU MUNCUL DI SINI! */}
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold transition shrink-0 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md font-black ring-2 ring-indigo-300'
                  : 'bg-indigo-950/80 text-amber-300 hover:bg-indigo-900 border border-indigo-700/60'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>3. Buat Kode (Admin)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">

          {/* Device ID Badge Box (Single Device Lock) */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-amber-300/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0 shadow-xs">
                <Smartphone className="w-4 h-4 text-emerald-950" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                  ID Perangkat Anda Saat Ini (1 Device 1 Code):
                </span>
                <span className="font-mono text-base font-extrabold text-emerald-950 tracking-wider">
                  {cleanDevId}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(cleanDevId, 'device')}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              {copiedText === 'device' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText === 'device' ? 'Tersalin!' : 'Salin ID Perangkat'}</span>
            </button>
          </div>

          {/* ============================================================ */}
          {/* TAB 1: PEMBAYARAN & QRIS                                      */}
          {/* ============================================================ */}
          {activeTab === 'qris' && (
            <div className="space-y-4">
              {/* Promo Price Card */}
              <div className="bg-white border-2 border-emerald-600 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="text-xs text-slate-400 line-through">Rp 150.000</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-900">Rp 49.000</span>
                    <span className="text-xs font-semibold text-slate-600">/ Sekali Bayar</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                    ✓ Akses Selamanya • Tanpa Biaya Langganan Bulanan
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="px-2.5 py-1 bg-amber-400 text-emerald-950 rounded-xl text-xs font-black shadow-xs">
                    HEMAT 67%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">1 Perangkat 1 Kode</span>
                </div>
              </div>

              {/* 3 Langkah Cepat Membuka Akses PRO */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  3 Langkah Mudah Mendapatkan Kode Lisensi:
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Klik Tombol WhatsApp di Bawah</strong>
                      <span className="text-slate-600">
                        Chat WhatsApp admin secara otomatis akan memuat teks pemesanan beserta <strong className="text-emerald-900">ID Perangkat Anda ({cleanDevId})</strong>.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Transfer Rp 49.000 (QRIS / Bank)</strong>
                      <span className="text-slate-600">
                        Admin akan memberikan barcode QRIS / Rekening. Kirimkan bukti transfer ke WhatsApp admin.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <span className="w-6 h-6 rounded-lg bg-emerald-900 text-amber-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 block">Terima Kode & Langsung Aktif</strong>
                      <span className="text-slate-600">
                        Admin membalas dengan kode lisensi resmi yang terkunci untuk perangkat Anda. Masukkan di tab <strong>"2. Masukkan Lisensi"</strong>, akun Anda seketika berstatus PRO selamanya!
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 cursor-pointer mt-3"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Beli via WhatsApp (0851-7984-8996)</span>
                </a>
              </div>

              {/* Fitur yang Dibuka */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">42 Bab Lengkap</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Full 30 Juz 6.236 Ayat</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">Studio I'rab Mandiri</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-800">520 Soal & Kuis HOTS</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: INPUT KODE LISENSI                                     */}
          {/* ============================================================ */}
          {activeTab === 'license' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Aktivasi Kode Lisensi Al-Miftah PRO
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Masukkan kode lisensi resmi yang diberikan oleh Admin via WhatsApp:
                  </p>
                </div>

                <form onSubmit={handleActivate} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Masukkan Kode Lisensi (MFT-...)"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl text-sm font-mono font-bold tracking-wider uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                      autoFocus
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold leading-relaxed animate-in fade-in">
                      {errorMessage}
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !inputKey.trim()}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 text-emerald-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Aktifkan Akses PRO Sekarang</span>
                  </button>
                </form>
              </div>

              {/* Callout ke Tab Pembayaran jika belum punya kode */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-slate-800 block">Belum punya kode lisensi?</strong>
                  <span className="text-slate-500">Beli cukup sekali bayar Rp 49.000 seumur hidup.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold shrink-0 transition cursor-pointer"
                >
                  Cara Beli →
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: PANEL ADMIN (GENERATOR LISENSI)                         */}
          {/* ============================================================ */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              
              {/* JIKA BELUM TERVERIFIKASI SEBAGAI ADMIN -> TAMPILKAN PIN GATE */}
              {!licenseState.isAdmin ? (
                <div className="bg-slate-50 border-2 border-indigo-200 rounded-2xl p-6 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Akses Khusus Admin / Pemilik Al-Miftah
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Masukkan PIN Admin untuk membuka generator kode lisensi pembeli:
                    </p>
                  </div>

                  <form onSubmit={handleAdminPinSubmit} className="max-w-xs mx-auto space-y-3">
                    <input
                      type="password"
                      placeholder="Masukkan PIN Admin (Sandi: 2026)"
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-center text-sm font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                      autoFocus
                    />

                    {adminPinError && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-semibold">
                        {adminPinError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>Buka Panel Generator Admin</span>
                    </button>
                  </form>

                  <div className="pt-2 text-[11px] text-slate-400">
                    💡 <em>Petunjuk: PIN default adalah <strong>2026</strong> atau Master Key Anda.</em>
                  </div>
                </div>
              ) : (
                /* JIKA SUDAH ADMIN -> TAMPILKAN GENERATOR PENUH */
                <div className="bg-gradient-to-br from-indigo-50/90 via-slate-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5">
                        <Crown className="w-4 h-4 text-indigo-600" />
                        Panel Generator Lisensi (Khusus Admin / Pemilik)
                      </h4>
                      <p className="text-xs text-indigo-700/80 mt-0.5">
                        Buat kode lisensi terkunci khusus untuk perangkat pembeli (1 Device 1 Code).
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono font-bold text-[10px]">
                      ADMIN AKTIF
                    </span>
                  </div>

                  {/* Input Target Device ID */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-indigo-900">
                      📱 Masukkan ID Perangkat Pembeli (dari WhatsApp):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: DEV-8K2P9M atau 8K2P9M"
                      value={targetDeviceInput}
                      onChange={(e) => setTargetDeviceInput(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-white border border-indigo-300 rounded-xl font-mono text-sm uppercase font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      *Sistem akan mengunci lisensi hanya untuk perangkat tersebut (1 device 1 code).
                    </span>
                  </div>

                  {/* Tombol Buat Kode */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateDeviceBound}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
                    >
                      <Lock className="w-4 h-4" />
                      <span>🔒 Buat Kode Terkunci untuk Siswa</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateUniversal}
                      className="py-3 px-4 rounded-xl bg-white border border-indigo-300 text-indigo-900 hover:bg-indigo-50 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95"
                      title="Buat kode universal tanpa kunci perangkat"
                    >
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span>Kode Bebas</span>
                    </button>
                  </div>

                  {/* Hasil Generate Key & Tombol Copy */}
                  {generatedKey && (
                    <div className="p-4 bg-white border-2 border-indigo-300 rounded-2xl space-y-3 animate-in zoom-in-95 shadow-sm">
                      <div className="text-center space-y-1">
                        <span className="text-[11px] font-extrabold text-indigo-800 uppercase tracking-wider block">
                          {generatedType === 'device' 
                            ? `🔒 Terkunci Khusus untuk: ${targetDevFormatted}` 
                            : '🌐 Kode Bebas (Semua Perangkat)'}
                        </span>
                        <div className="p-3 bg-slate-900 text-amber-300 rounded-xl font-mono font-black text-lg sm:text-2xl tracking-widest select-all border border-slate-700 shadow-inner">
                          {generatedKey}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generatedKey, 'genkey')}
                          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          {copiedText === 'genkey' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedText === 'genkey' ? 'Kode Berhasil Disalin!' : '📋 Salin Kode Saja'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(buildWhatsAppReplyTemplate(generatedKey, targetDevFormatted), 'wa_template')}
                          className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          {copiedText === 'wa_template' ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4 fill-white" />}
                          <span>{copiedText === 'wa_template' ? 'Chat WA Tersalin!' : '💬 Salin Format Chat WA Siswa'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reset Status Lisensi Button */}
                  <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Uji coba gratis (reset lisensi browser):</span>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition cursor-pointer"
                    >
                      Reset ke Gratis
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Al-Miftah Official Lifetime License</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs transition cursor-pointer flex items-center gap-1"
          >
            <Crown className="w-3 h-3" />
            <span>Panel Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
}
