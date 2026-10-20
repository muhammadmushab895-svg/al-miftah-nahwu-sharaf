import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

export default function SyntaxColorExplorer() {
  const sentenceSamples = [
    {
      title: 'Kalimat Fi\'liyyah 1: Fi\'il + Fa\'il + Maf\'ul Bih',
      arabicFull: 'نَصَرَ اللهُ الْمُؤْمِنِينَ',
      translation: 'Allah telah menolong orang-orang beriman.',
      parts: [
        { word: 'نَصَرَ', label: 'Tindakan (Fi\'il)', role: 'Fi\'il Madhi mabni \'alal fath', color: 'bg-sky-100 text-sky-950 border-sky-400', badge: '🟦 Predikat / Kata Kerja', question: 'Apa pekerjaannya?' },
        { word: 'اللهُ', label: 'Pelaku (Fa\'il)', role: 'Fa\'il marfu\' dengan dhommah', color: 'bg-emerald-100 text-emerald-950 border-emerald-400', badge: '🟩 Subjek / Si Pelaku', question: 'Siapa yang menolong?' },
        { word: 'الْمُؤْمِنِينَ', label: 'Korban (Maf\'ul Bih)', role: 'Maf\'ul bih manshub dengan huruf Ya\'', color: 'bg-purple-100 text-purple-950 border-purple-400', badge: '🟪 Objek Penderita', question: 'Siapa yang ditolong?' }
      ]
    },
    {
      title: 'Kalimat Ismiyyah: Mubtada\' + Khabar + Jar-Majrur',
      arabicFull: 'الطَّالِبُ مُجْتَهِدٌ فِي الفَصْلِ',
      translation: 'Mahasiswa itu bersungguh-sungguh di dalam kelas.',
      parts: [
        { word: 'الطَّالِبُ', label: 'Topik (Mubtada\')', role: 'Mubtada\' marfu\' dengan dhommah', color: 'bg-emerald-100 text-emerald-950 border-emerald-400', badge: '🟩 Subjek Utama', question: 'Siapa yang sedang dibicarakan?' },
        { word: 'مُجْتَهِدٌ', label: 'Info (Khabar)', role: 'Khabar marfu\' dengan dhommah (tanwin)', color: 'bg-amber-100 text-amber-950 border-amber-400', badge: '🟨 Informasi / Predikat', question: 'Ada apa dengan mahasiswa itu?' },
        { word: 'فِي الفَصْلِ', label: 'Keterangan Tempat', role: 'Jar-majrur syibhul jumlah', color: 'bg-teal-100 text-teal-950 border-teal-400', badge: '🟦 Keterangan Tempat', question: 'Di mana lokasinya?' }
      ]
    },
    {
      title: 'Dari Al-Qur\'an (QS. Al-Baqarah : 255)',
      arabicFull: 'لَا تَأْخُذُهُ سِنَةٌ',
      translation: 'Dia tidak ditimpa oleh rasa kantuk.',
      parts: [
        { word: 'لَا تَأْخُذُ', label: 'Peniadaan + Fi\'il', role: 'Laa nafiyah + fi\'il mudhari\' marfu\'', color: 'bg-sky-100 text-sky-950 border-sky-400', badge: '🟦 Tindakan Terlarang / Nafi', question: 'Apa tindakannya?' },
        { word: 'ـهُ', label: 'Objek (Maf\'ul Bih Didahulukan)', role: 'Dhamir muttashil mabni fi mahalli nashb', color: 'bg-purple-100 text-purple-950 border-purple-400', badge: '🟪 Sasaran (Objek)', question: 'Siapa yang terkena sasaran?' },
        { word: 'سِنَةٌ', label: 'Pelaku Ditunda (Fa\'il Mu\'akhkhar)', role: 'Fa\'il marfu\' dengan dhommah (tanwin)', color: 'bg-emerald-100 text-emerald-950 border-emerald-400', badge: '🟩 Pelaku Sebenarnya', question: 'Apa yang menimpa? Kantuk!' }
      ]
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const current = sentenceSamples[activeIdx];

  return (
    <div className="bg-white rounded-2xl border-2 border-indigo-200/90 shadow-md p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            Anatomi Kalimat Bahasa Arab (Color-Coded Puzzle)
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Bedah Balok Warna: Cara Cepat Orang Awam Memahami Struktur Kalimat
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Orang awam sering bingung karena urutan kata Arab bisa fleksibel. Blok warna ini memetakan fungsinya dengan instan!
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          {sentenceSamples.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                activeIdx === idx
                  ? 'bg-indigo-900 text-amber-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contoh {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Sentence Display */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{current.title}</span>
          <span className="text-xs text-slate-400 italic">Terjemahan: "{current.translation}"</span>
        </div>

        {/* Visual Puzzle Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {current.parts.map((p, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-2xl border-2 shadow-xs space-y-2 transition-transform hover:scale-[1.02] ${p.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                  {p.badge}
                </span>
                <span className="text-[11px] font-mono text-slate-500">#{idx + 1}</span>
              </div>

              <div className="text-center py-2">
                <span className="font-arabic text-3xl font-extrabold block">
                  {p.word}
                </span>
                <span className="text-xs font-bold block mt-1">
                  {p.label}
                </span>
              </div>

              <div className="bg-white/90 p-2.5 rounded-xl border border-black/5 text-xs space-y-1">
                <div className="text-[11px] text-slate-500 font-semibold">
                  ❓ {p.question}
                </div>
                <div className="font-mono text-[11px] text-emerald-950 font-bold">
                  {p.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
