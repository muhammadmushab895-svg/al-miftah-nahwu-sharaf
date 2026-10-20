import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import PwaInstallBanner from './components/PwaInstallBanner';
import TadribatQuranView from './components/TadribatQuranView';
import MateriView from './components/MateriView';
import StudioIrabView from './components/StudioIrabView';
import AsrarIrabView from './components/AsrarIrabView';
import IrabLabView from './components/IrabLabView';
import KuisView from './components/KuisView';
import KamusView from './components/KamusView';
import GlobalSearchModal from './components/GlobalSearchModal';
import BookmarksModal from './components/BookmarksModal';
import { getBookmarks } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('materi'); // Defaulting to Materi & Kaidah on the first page!
  const [fontSize, setFontSize] = useState(28);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [bookmarksModalOpen, setBookmarksModalOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [quranTargetLocation, setQuranTargetLocation] = useState(null);

  // Jump from any view to exact Surah & Ayah in Mushaf
  const handleJumpToQuran = (surahNameOrId, ayahNumber) => {
    setQuranTargetLocation({
      surahNameOrId,
      ayahNumber: parseInt(ayahNumber, 10) || 1
    });
    setActiveTab('quran');
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update bookmark count
  const refreshBookmarks = () => {
    setBookmarkCount(getBookmarks().length);
  };

  useEffect(() => {
    refreshBookmarks();
  }, [bookmarksModalOpen, activeTab]);

  const handleSelectSearchResult = (type, item) => {
    if (type === 'quran') {
      setActiveTab('quran');
    } else if (type === 'materi') {
      setActiveTab('materi');
    } else if (type === 'studio') {
      setActiveTab('studio');
    } else if (type === 'asrar') {
      setActiveTab('asrar');
    } else if (type === 'irab') {
      setActiveTab('irab');
    } else if (type === 'kamus') {
      setActiveTab('kamus');
    }
  };

  const handleSelectBookmark = (b) => {
    if (b.type === 'quran') setActiveTab('quran');
    else if (b.type === 'materi') setActiveTab('materi');
    else if (b.type === 'studio') setActiveTab('studio');
    else if (b.type === 'asrar') setActiveTab('asrar');
    else if (b.type === 'irab') setActiveTab('irab');
    else if (b.type === 'kamus') setActiveTab('kamus');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-800">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenBookmarks={() => setBookmarksModalOpen(true)}
        bookmarkCount={bookmarkCount}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-24 lg:pb-16">
        {activeTab === 'quran' && (
          <TadribatQuranView 
            fontSize={fontSize} 
            onOpenMateri={() => setActiveTab('materi')} 
            targetLocation={quranTargetLocation}
          />
        )}
        {activeTab === 'materi' && (
          <MateriView 
            fontSize={fontSize} 
            onJumpToQuran={handleJumpToQuran}
          />
        )}
        {activeTab === 'studio' && (
          <StudioIrabView 
            fontSize={fontSize} 
            onJumpToQuran={handleJumpToQuran}
          />
        )}
        {activeTab === 'asrar' && (
          <AsrarIrabView 
            fontSize={fontSize} 
            onJumpToQuran={handleJumpToQuran}
          />
        )}
        {activeTab === 'irab' && (
          <IrabLabView fontSize={fontSize} />
        )}
        {activeTab === 'kuis' && (
          <KuisView />
        )}
        {activeTab === 'kamus' && (
          <KamusView fontSize={fontSize} />
        )}
      </main>

      {/* Mobile Bottom Docked Navigation Bar (Android Touch Optimized) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenBookmarks={() => setBookmarksModalOpen(true)}
        bookmarkCount={bookmarkCount}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* PWA Android Install Banner */}
      <PwaInstallBanner />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <BookmarksModal
        isOpen={bookmarksModalOpen}
        onClose={() => {
          setBookmarksModalOpen(false);
          refreshBookmarks();
        }}
        onSelectBookmark={handleSelectBookmark}
      />

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 border-t border-emerald-900/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-extrabold text-lg">
                <span className="w-8 h-8 rounded-lg bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-lg font-arabic">
                  م
                </span>
                <span>Al-Miftah (الْمِفْتَاح فِي النَّحْوِ وَالصَّرْفِ)</span>
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                Karya komprehensif memadukan kepraktisan <span className="text-amber-400 font-semibold">An-Nahwu At-Tathbiqi</span> dan kedalaman ensiklopedis <span className="text-amber-400 font-semibold">Jami'ud Durus Al-'Arabiyyah</span>.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-amber-300 font-bold">
                520 Ayat Al-Qur'an
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold">
                42 Bab Kurikulum
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold">
                149 Sub-Kaidah
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold">
                119 Syahid I'rab
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-amber-300 font-bold">
                80 Soal HOTS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold">
                63 Istilah Mu'jam
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/60 text-center text-xs text-emerald-400/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Al-Miftah • Dirancang untuk santri, asatidz, dan penuntut ilmu gramatika bahasa Arab.</span>
            <span className="font-arabic text-sm text-amber-400/80">وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
