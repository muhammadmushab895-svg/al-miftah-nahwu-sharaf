import React from 'react';
import { 
  FileText, 
  Layers, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle,
  Tag,
  ChevronRight
} from 'lucide-react';

// Helper to format inline Arabic text in parentheses with nice font
export function formatTextWithArabicPills(text) {
  if (!text) return null;

  // Regex to match anything inside parentheses containing Arabic characters
  const parts = text.split(/(\([^)]*[\u0600-\u06FF]+[^)]*\))/g);

  return parts.map((part, idx) => {
    if (part.startsWith('(') && part.endsWith(')')) {
      const inner = part.slice(1, -1);
      return (
        <span 
          key={idx} 
          className="inline-flex items-center px-2 py-0.5 mx-1 rounded-md bg-amber-100/80 border border-amber-300/80 font-arabic text-base font-bold text-emerald-950 align-middle shadow-2xs"
        >
          {inner}
        </span>
      );
    }
    return part;
  });
}

// Parses numbered points (e.g. "1. Judul: Uraian\n2. ...")
export function parseNumberedPoints(text) {
  if (!text) return [];

  const lines = text.split('\n');
  const points = [];
  let currentPoint = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Check if starts with a number like "1.", "2.", "3.", etc.
    const match = trimmed.match(/^(\d+)[\.\)]\s*(.*)/);
    if (match) {
      if (currentPoint) points.push(currentPoint);
      const fullContent = match[2];
      
      // Check if there is a colon separating title and description
      const colonIdx = fullContent.indexOf(':');
      let title = '';
      let desc = fullContent;
      if (colonIdx > 0 && colonIdx < 60) {
        title = fullContent.slice(0, colonIdx).trim();
        desc = fullContent.slice(colonIdx + 1).trim();
      }

      currentPoint = {
        number: match[1],
        title,
        desc,
        subItems: []
      };
    } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^[a-z]\.\s*/i)) {
      if (currentPoint) {
        currentPoint.subItems.push(trimmed.replace(/^[-•]\s*|^[a-z]\.\s*/i, ''));
      } else {
        points.push({
          number: '',
          title: '',
          desc: trimmed,
          subItems: []
        });
      }
    } else {
      if (currentPoint) {
        currentPoint.desc += ' ' + trimmed;
      } else {
        points.push({
          number: '',
          title: '',
          desc: trimmed,
          subItems: []
        });
      }
    }
  });

  if (currentPoint) points.push(currentPoint);
  return points;
}

export default function SmartContentVisualizer({
  penjelasanIndo,
  rincianHukum,
  rumusRingkas,
  tanbihatKhilaf
}) {
  const parsedPoints = parseNumberedPoints(rincianHukum);

  return (
    <div className="space-y-6">
      
      {/* 1. Pengantar / Penjelasan Konseptual Card */}
      {penjelasanIndo && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                Pondasi Konseptual Kaidah (فَهْمُ القَاعِدَةِ)
              </h4>
              <p className="text-[11px] text-slate-500">
                Intisari makna dan penjelasan logis para ulama nahwu
              </p>
            </div>
          </div>

          <div className="text-sm sm:text-base text-slate-700 leading-relaxed space-y-2">
            {penjelasanIndo.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx}>
                {formatTextWithArabicPills(paragraph)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 2. Visual Cards for Rincian Hukum & Syarat */}
      {parsedPoints.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-emerald-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              Rincian Klasifikasi & Syarat-Syarat Hukum ({parsedPoints.length} Poin Utama):
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {parsedPoints.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition p-4 sm:p-5 space-y-2.5"
              >
                <div className="flex items-start gap-3">
                  {item.number && (
                    <span className="w-7 h-7 rounded-lg bg-emerald-900 text-amber-300 flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5">
                      {item.number}
                    </span>
                  )}
                  <div className="flex-1 space-y-1">
                    {item.title && (
                      <h5 className="font-bold text-sm sm:text-base text-emerald-950">
                        {formatTextWithArabicPills(item.title)}
                      </h5>
                    )}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {formatTextWithArabicPills(item.desc)}
                    </div>
                  </div>
                </div>

                {/* Sub-items / bullets if any */}
                {item.subItems.length > 0 && (
                  <div className="pl-10 space-y-1.5 pt-1 border-t border-slate-100">
                    {item.subItems.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-amber-600 font-bold">•</span>
                        <div className="leading-relaxed">
                          {formatTextWithArabicPills(sub)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Rumus Cepat & Kunci Hafalan Banner */}
      {rumusRingkas && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-4 sm:p-5 text-emerald-950 shadow-md space-y-2">
          <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-950" />
            Rumus Cepat & Kata Kunci Hafalan (خُلَاصَةُ الضَّبْطِ)
          </div>
          <div className="bg-white/95 rounded-xl p-3.5 border border-amber-300 shadow-2xs">
            <p className="font-extrabold text-sm sm:text-base text-slate-900 leading-relaxed">
              {formatTextWithArabicPills(rumusRingkas)}
            </p>
          </div>
        </div>
      )}

      {/* 4. Tanbihat Nahwu Tathbiqi & Khilaf Mazhab (Jami'ud Durus) */}
      {tanbihatKhilaf && (
        <div className="bg-teal-50/80 rounded-2xl p-5 border-2 border-teal-200/90 space-y-3">
          <div className="flex items-center gap-2 text-teal-950 font-bold text-xs sm:text-sm uppercase tracking-wide border-b border-teal-200/70 pb-2">
            <HelpCircle className="w-4 h-4 text-teal-700" />
            Tanbihat Kritis & Catatan Khilaf Mazhab (Jami'ud Durus & Tathbiqi)
          </div>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            {tanbihatKhilaf.split('\n\n').map((para, idx) => (
              <p key={idx}>
                {formatTextWithArabicPills(para)}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
