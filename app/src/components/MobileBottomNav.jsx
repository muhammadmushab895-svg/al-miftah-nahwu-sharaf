import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Layers, 
  GraduationCap, 
  BookMarked, 
  Menu, 
  X, 
  Bookmark, 
  Search, 
  Download,
  Sliders
} from 'lucide-react';

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenBookmarks,
  bookmarkCount = 0,
  fontSize,
  setFontSize
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'quran', label: 'Mushaf', icon: Sparkles },
    { id: 'studio', label: 'Studio', icon: Zap },
    { id: 'asrar', label: 'Asrar', icon: Sparkles },
  ];

  const secondaryTabs = [
    { id: 'irab', label: 'Dalil Syahid', desc: '119 Dalil I\'rab Klasik', icon: Layers, badge: '119' },
    { id: 'kuis', label: 'Kuis HOTS', desc: '80 Soal Evaluasi Bertingkat', icon: GraduationCap, badge: '80' },
    { id: 'kamus', label: 'Kamus Mu\'jam', desc: '63 Istilah Nahwu & Sharaf', icon: BookMarked, badge: '63' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Docked Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#064E3B]/95 backdrop-blur-md border-t border-emerald-800/80 shadow-2xl transition-all"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 6px)' }}
      >
        <div className="grid grid-cols-5 items-center h-15 px-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                  isActive ? 'text-amber-400 font-bold' : 'text-emerald-300/70 hover:text-emerald-100'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"></span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
              </button>
            );
          })}

          {/* Lainnya / Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
              ['irab', 'kuis', 'kamus'].includes(activeTab) || drawerOpen
                ? 'text-amber-400 font-bold' 
                : 'text-emerald-300/70 hover:text-emerald-100'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {['irab', 'kuis', 'kamus'].includes(activeTab) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"></span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1">Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay for "Lainnya" */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setDrawerOpen(false)}
        >
          <div 
            className="bg-[#043327] border-t border-emerald-700/80 rounded-t-3xl p-5 text-white shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
          >
            {/* Drawer Handle */}
            <div className="w-12 h-1.5 rounded-full bg-emerald-700 mx-auto mb-4 opacity-60"></div>

            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-400 text-emerald-950 font-bold font-arabic flex items-center justify-center text-sm">
                  م
                </span>
                <h3 className="font-bold text-base text-white">Menu & Fitur Lengkap</h3>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white bg-emerald-900/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 my-4">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenSearch();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-900/50 border border-emerald-700/50 hover:bg-emerald-800 text-left transition"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Cari Global</div>
                  <div className="text-[10px] text-emerald-300">Pencarian cepat</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenBookmarks();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-900/50 border border-emerald-700/50 hover:bg-emerald-800 text-left transition relative"
              >
                <Bookmark className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Markah Saya</div>
                  <div className="text-[10px] text-emerald-300">{bookmarkCount} tersimpan</div>
                </div>
                {bookmarkCount > 0 && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.2 bg-amber-500 text-emerald-950 font-bold text-[9px] rounded-full">
                    {bookmarkCount}
                  </span>
                )}
              </button>
            </div>

            {/* Font Size Adjuster for Mobile */}
            <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-800/60 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-emerald-200">Ukuran Huruf Arab:</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-700/50">
                <button
                  onClick={() => setFontSize(prev => Math.max(18, prev - 2))}
                  className="px-2 py-0.5 font-bold hover:text-amber-300 text-sm"
                >
                  A-
                </button>
                <span className="text-xs font-mono text-amber-400 font-bold">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(prev => Math.min(38, prev + 2))}
                  className="px-2 py-0.5 font-bold hover:text-amber-300 text-sm"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Secondary Modules */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-emerald-400/80 uppercase tracking-wider px-1">
                Laboratorium & Modul Lainnya
              </div>
              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                      isActive 
                        ? 'bg-emerald-800/90 border-amber-400/50 text-white shadow-md' 
                        : 'bg-emerald-900/40 border-emerald-800/50 text-emerald-200 hover:bg-emerald-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-950 text-amber-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white">{tab.label}</div>
                        <div className="text-[10px] text-emerald-300/80">{tab.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-amber-300 font-bold border border-emerald-700/40">
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
