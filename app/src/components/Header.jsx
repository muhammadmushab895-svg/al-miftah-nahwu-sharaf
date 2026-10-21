import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Bookmark, 
  GraduationCap, 
  BookMarked, 
  Layers,
  HelpCircle,
  Menu,
  X,
  Zap,
  Heart,
  MessageCircle
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch, 
  onOpenBookmarks, 
  onOpenDonasi,
  bookmarkCount = 0,
  fontSize,
  setFontSize
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabs = [
    { id: 'materi', label: 'Materi & Kaidah', shortLabel: 'Materi', icon: BookOpen, badge: '42 Bab' },
    { id: 'quran', label: 'Tadribat & Mushaf I\'rab', shortLabel: 'Mushaf & Latihan', icon: Sparkles, badge: '6.236 Ayat (114 Surah)' },
    { id: 'studio', label: 'Studio I\'rab Mandiri', shortLabel: 'Studio I\'rab', icon: Zap, badge: 'Sandbox Nalar' },
    { id: 'asrar', label: 'Rahasia I\'rab & Balaghah', shortLabel: 'Tafsir I\'rab', icon: Sparkles, badge: 'Asrarul Qur\'an' },
    { id: 'irab', label: 'Dalil Syahid', shortLabel: 'Syahid', icon: Layers, badge: '119 Dalil' },
    { id: 'kuis', label: 'Kuis HOTS', shortLabel: 'Kuis', icon: GraduationCap, badge: '80 Soal' },
    { id: 'kamus', label: 'Kamus Istilah', shortLabel: 'Kamus', icon: BookMarked, badge: '63 Mu\'jam' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#064E3B] text-white shadow-lg border-b border-emerald-900/60 backdrop-blur-md">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('materi')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-900/30 text-emerald-950 font-bold text-2xl font-arabic">
              م
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center gap-1.5">
                  Al-Miftah
                  <span className="text-amber-400 font-arabic text-xl font-normal">الْمِفْتَاح</span>
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-semibold bg-emerald-800 text-amber-300 rounded-full border border-amber-400/30">
                  Tathbiqi & Jami' Durus
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 hidden sm:block">
                Ensiklopedia Gramatika Arab & Laboratorium I'rab Al-Qur'an Terpadu
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font Size Adjuster */}
            <div className="hidden lg:flex items-center bg-emerald-900/60 rounded-lg p-1 border border-emerald-700/50 text-xs text-emerald-200">
              <span className="px-2 text-[11px] font-medium text-emerald-300">Teks Arab:</span>
              <button 
                onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
                className="px-2 py-0.5 hover:bg-emerald-800 rounded transition font-bold"
                title="Perkecil Font Arab"
              >
                A-
              </button>
              <span className="px-1 text-[11px] font-mono text-amber-300">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(38, prev + 2))}
                className="px-2 py-0.5 hover:bg-emerald-800 rounded transition font-bold"
                title="Perbesar Font Arab"
              >
                A+
              </button>
            </div>

            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition text-sm shadow-sm"
              title="Pencarian Global (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-xs font-medium">Cari Materi / Ayat...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-emerald-950/60 rounded text-emerald-400 border border-emerald-800">
                ⌘K
              </kbd>
            </button>

            {/* Bookmarks Trigger */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2.5 rounded-lg bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white border border-emerald-700/60 transition shadow-sm"
              title="Markah Buku Tersimpan"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-emerald-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* Donasi QRIS Header Button */}
            <button
              onClick={onOpenDonasi}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-extrabold text-xs shadow-md shadow-amber-950/20 transition active:scale-95 cursor-pointer"
              title="Infaq & Donasi QRIS"
            >
              <Heart className="w-3.5 h-3.5 fill-emerald-950" />
              <span>Donasi QRIS</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-emerald-900/70 text-emerald-200 hover:text-white border border-emerald-700/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 border-t border-emerald-800/60 py-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 shadow-md shadow-amber-900/20 font-bold scale-[1.02]'
                    : 'text-emerald-100/90 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                    isActive
                      ? 'bg-emerald-900/20 text-emerald-950'
                      : 'bg-emerald-900/80 text-amber-300 border border-emerald-700/50'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950/95 border-b border-emerald-800 px-4 py-3 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 font-bold'
                    : 'text-emerald-100 hover:bg-emerald-900/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded ${isActive ? 'bg-emerald-950 text-amber-300' : 'bg-emerald-900 text-amber-300'}`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300 px-1">
            <span>Ukuran Tulisan Arab:</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
                className="px-2.5 py-1 bg-emerald-900 rounded font-bold"
              >
                A-
              </button>
              <span className="font-mono text-amber-300">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(38, prev + 2))}
                className="px-2.5 py-1 bg-emerald-900 rounded font-bold"
              >
                A+
              </button>
            </div>
          </div>

          {/* Donasi & WA in Drawer */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-800/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenDonasi) onOpenDonasi();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-400 text-emerald-950 font-bold text-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-emerald-950" />
              <span>Donasi QRIS</span>
            </button>
            <a
              href={`https://wa.me/6285179848996?text=${encodeURIComponent("Assalamu'alaikum Admin Al-Miftah, saya ingin konsultasi terkait kaidah Nahwu dan Sharaf...")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#25D366] text-white font-bold text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Konsultasi WA</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
