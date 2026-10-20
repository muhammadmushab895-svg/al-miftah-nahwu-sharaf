import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Layers, Clock, Zap } from 'lucide-react';

export default function FiilSignsVisualizer() {
  const [activeFiil, setActiveFiil] = useState('madhi'); // 'madhi', 'mudhari', 'amr', 'harf'

  const fiilTypes = [
    {
      id: 'madhi',
      title: '1. Fi\'il Madhi (Masa Lampau)',
      arab: 'الفِعْلُ المَاضِي',
      signs: [
        { name: 'Ta\'ul Fa\'il (تَاءُ الفَاعِلِ)', desc: 'Ta\' berharakat di akhir kata (فَعَلْتُ untuk saya, فَعَلْتَ untuk kamu, فَعَلْتِ untuk kamu wanita).', example: 'كَتَبْـتُ' },
        { name: 'Ta\'ut Ta\'nits as-Sakinah (تَاءُ التَّأْنِيثِ السَّاكِنَةِ)', desc: 'Ta\' sukun di akhir kata untuk pelaku wanita tunggal.', example: 'قَالَتْ، ذَهَبَتْ' }
      ]
    },
    {
      id: 'mudhari',
      title: '2. Fi\'il Mudhari\' (Masa Kini & Depan)',
      arab: 'الفِعْلُ المُضَارِعُ',
      signs: [
        { name: 'Kemasukan Huruf Jazm (لَمْ)', desc: 'Huruf yang mengubah makna menjadi lampau negatif.', example: 'لَمْ يَلِدْ وَلَمْ يُولَدْ' },
        { name: 'Kemasukan Sin (سَـ) & Saufa (سَوْفَ)', desc: 'Menunjukkan perbuatan di masa yang akan datang.', example: 'سَيَقُولُ، سَوْفَ تَعْلَمُونَ' },
        { name: 'Diawali Huruf Mudhara\'ah (أَنَيْتُ)', desc: 'Hamzah (أَقُومُ), Nun (نَقُومُ), Ya\' (يَقُومُ), Ta\' (تَقُومُ).', example: 'نَعْبُدُ وَنَسْتَعِينُ' }
      ]
    },
    {
      id: 'amr',
      title: '3. Fi\'il Amr (Kata Kerja Perintah)',
      arab: 'فِعْلُ الأَمْرِ',
      signs: [
        { name: 'Syarat 1: Makna Tuntutan (Thalab)', desc: 'Bentuk katanya sendiri secara langsung memerintahkan suatu perbuatan.', example: 'اِقْرَأْ، اِرْكَعْ' },
        { name: 'Syarat 2: Menerima Ya\' Mukhatabah', desc: 'Dapat disambung dengan ya\' untuk wanita lawan bicara.', example: 'اِقْرَئِي، قُومِي' },
        { name: 'Atau Menerima Nun Taukid', desc: 'Dapat ditegaskan dengan nun taukid.', example: 'اُكْتُبَنَّ' }
      ]
    },
    {
      id: 'harf',
      title: '4. Ciri-ciri Huruf (Al-Harf)',
      arab: 'عَلَامَةُ الحَرْفِ',
      signs: [
        { name: 'Tanda Negatif (\'Adamiyyah)', desc: 'Harf TIDAK menerima satupun tanda isim (seperti jarr dan tanwin) dan TIDAK menerima tanda fi\'il.', example: 'هَلْ، فِي، لَمْ' },
        { name: 'Tak Punya Makna Mandiri', desc: 'Hanya memiliki makna jelas setelah digabungkan dalam kalimat sempurna.', example: 'فِي الْمَسْجِدِ' }
      ]
    }
  ];

  const current = fiilTypes.find(f => f.id === activeFiil);

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-200/80 shadow-md p-5 sm:p-7 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-900 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-teal-700" />
            Infografis Klasifikasi Morfologi Fi'il & Harf
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Peta Ciri-Ciri 3 Macam Fi'il & Karakteristik Harf
          </h3>
        </div>
      </div>

      {/* Fiil Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {fiilTypes.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFiil(f.id)}
            className={`p-3 rounded-xl border text-center transition ${
              activeFiil === f.id
                ? 'bg-teal-900 text-white font-bold ring-2 ring-amber-400 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span className="font-arabic text-base block font-bold">{f.arab}</span>
            <span className="text-xs font-bold block mt-0.5">{f.title.split('(')[0]}</span>
          </button>
        ))}
      </div>

      {/* Details Box */}
      <div className="bg-teal-50/50 rounded-2xl border border-teal-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-teal-200/60 pb-3">
          <h4 className="text-base font-bold text-teal-950 flex items-center gap-2">
            <span>Tanda-Tanda Penentu: {current.title}</span>
          </h4>
          <span className="font-arabic text-xl font-bold text-teal-900">{current.arab}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {current.signs.map((s, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs space-y-2">
              <span className="text-xs font-bold text-emerald-800 block">{s.name}</span>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center font-arabic text-xl font-bold text-slate-900">
                {s.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
