import React from 'react';
import { Bookmark, X, Trash2, ArrowRight } from 'lucide-react';
import { getBookmarks, saveBookmark } from '../utils/storage';

export default function BookmarksModal({ isOpen, onClose, onSelectBookmark }) {
  const [bookmarks, setBookmarks] = React.useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setBookmarks(getBookmarks());
    }
  }, [isOpen]);

  const handleRemove = (item) => {
    const updated = saveBookmark(item);
    setBookmarks(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-current" />
            <h3 className="font-extrabold text-slate-900 text-base">
              Markah Buku Tersimpan ({bookmarks.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm space-y-2">
              <Bookmark className="w-10 h-10 mx-auto text-slate-300" />
              <p>Belum ada markah buku yang disimpan.</p>
              <p className="text-xs text-slate-400">Klik ikon markah buku pada ayat atau kaidah untuk menyimpannya di sini.</p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={`${b.type}-${b.id}`}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/40 transition space-y-2 flex items-start justify-between gap-3"
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectBookmark(b);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase">
                      {b.type}
                    </span>
                    <span className="font-bold text-slate-800">{b.title}</span>
                    <span className="text-slate-400">• {b.subtitle}</span>
                  </div>

                  {b.arab && (
                    <p className="font-arabic text-base text-emerald-950 font-semibold mt-1 text-right line-clamp-1">
                      {b.arab}
                    </p>
                  )}
                  {b.indo && (
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {b.indo}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleRemove(b)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Hapus Markah"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
