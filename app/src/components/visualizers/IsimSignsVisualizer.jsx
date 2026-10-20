import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Tag, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';

export default function IsimSignsVisualizer() {
  const [activeSign, setActiveSign] = useState(1); // 0: Jar, 1: Tanwin, 2: Nida, 3: Al, 4: Isnad
  const [tanwinSubTab, setTanwinSubTab] = useState('tamkin'); // 'tamkin', 'tankir', 'muqabalah', 'iwadh'

  const signs = [
    {
      id: 0,
      badge: 'Tanda 1',
      title: 'Al-Khafadh / Al-Jarru',
      arab: 'الْجَرُّ (الْخَفْضُ)',
      icon: '📉',
      color: 'from-blue-600 to-indigo-700',
      lightBg: 'bg-blue-50 border-blue-200 text-blue-950',
      summary: 'Menerima kasrah atau penggantinya akibat amil jar (huruf jar, idhafah, atau tabi\').',
      examples: [
        { label: 'Jar bi Harfil Jar', arab: 'بِـسْمِ اللهِ', note: 'Huruf Ba menjarrkan kata Isim' },
        { label: 'Jar bil Idhafah', arab: 'كِتَابُ زَيْدٍ', note: 'Lafazh Zaidin majrur karena mudhaf ilaih' },
        { label: 'Jar bit-Tabi\' (Sifat)', arab: 'الرَّحْمَنِ الرَّحِيمِ', note: 'Majrur mengikuti lafzhul jalalah' }
      ]
    },
    {
      id: 1,
      badge: 'Tanda 2 (Spesial)',
      title: 'At-Tanwin',
      arab: 'التَّنْوِينُ',
      icon: '⚡',
      color: 'from-amber-500 to-amber-700',
      lightBg: 'bg-amber-50 border-amber-300 text-amber-950',
      summary: 'Nun sukun tambahan di akhir lafazh isim yang terucap tetapi tidak ditulis dalam huruf.',
      isFeatured: true
    },
    {
      id: 2,
      badge: 'Tanda 3',
      title: 'An-Nida\' (Panggilan)',
      arab: 'النِّدَاءُ',
      icon: '📢',
      color: 'from-emerald-600 to-teal-700',
      lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      summary: 'Dapat dipanggil menggunakan huruf nida\' seperti (يَا). Yang dimaksud adalah kata tersebut berstatus munada.',
      examples: [
        { label: 'Munada Mufrad', arab: 'يَا رَجُلُ', note: 'Panggilan kepada seseorang (isim)' },
        { label: 'Munada Mudhaf', arab: 'يَا عَبْدَ اللهِ', note: 'Memanggil isim mudhaf' }
      ]
    },
    {
      id: 3,
      badge: 'Tanda 4',
      title: 'Dukhul Al (Awalan Al-)',
      arab: 'دُخُولُ (أَلْ)',
      icon: '🔤',
      color: 'from-violet-600 to-purple-800',
      lightBg: 'bg-violet-50 border-violet-200 text-violet-950',
      summary: 'Menerima awalan Alif-Lam ma\'rifah (الـ) untuk mengubah kata umum (nakirah) menjadi khusus.',
      examples: [
        { label: 'Nakirah → Ma\'rifah', arab: 'كِتَابٌ ← الْكِتَابُ', note: 'Kemasukan Al membuktikan ia adalah Isim' },
        { label: 'Al-Jinsiyyah', arab: 'الرَّجُلُ خَيْرٌ مِنَ الْمَرْأَةِ', note: 'Alif-lam penunjuk jenis' }
      ]
    },
    {
      id: 4,
      badge: 'Tanda 5 (Terkuat)',
      title: 'Al-Isnad Ilaih (Subjek)',
      arab: 'الْإِسْنَادُ إِلَيْهِ',
      icon: '👑',
      color: 'from-rose-600 to-red-800',
      lightBg: 'bg-rose-50 border-rose-200 text-rose-950',
      summary: 'Tanda paling agung! Kata tersebut dapat dijadikan subjek yang dihukumi/diberitakan (Fa\'il, Mubtada\', Na\'ibul Fa\'il).',
      examples: [
        { label: 'Bukti Isimnya Dhamir', arab: 'قُمْـتُ', note: 'Huruf Ta\' (تُ) adalah Isim murni karena menjadi Fa\'il, meski tak bisa menerima tanwin atau Al!' },
        { label: 'Sebagai Mubtada\'', arab: 'الصَّبْرُ ضِيَاءٌ', note: 'Kata As-Shabru disandari predikat (musnad ilaih)' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200/80 shadow-md p-5 sm:p-7 space-y-6 overflow-hidden">
      
      {/* Header Visualizer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Infografis Interaktif Kaidah Nahwu
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Peta Konsep 5 Ciri Utama Isim (عَلَامَاتُ الاِسْمِ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Sebagaimana bait nadzam Alfiyyah Ibnu Malik: <span className="font-arabic font-bold text-emerald-800">بِالْجَرِّ وَالتَّنْوِينِ وَالنِّدَا وَأَلْ ... وَمُسْنَدٍ لِلِاسْمِ تَمْيِيزٌ حَصَلْ</span>
          </p>
        </div>
      </div>

      {/* 5 Signs Grid Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {signs.map((s) => {
          const isSelected = activeSign === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSign(s.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-md ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.badge}
                  </span>
                </div>
                <div className={`font-arabic text-base font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-900'}`}>
                  {s.arab}
                </div>
                <div className={`text-xs font-bold mt-0.5 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {s.title}
                </div>
              </div>
              <span className={`text-[10px] mt-2 block font-medium ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>
                Klik untuk bedah detail →
              </span>
            </button>
          );
        })}
      </div>

      {/* DETAILED SIGN VIEWER */}

      {/* 1. KHUSUS TANDA 2: JABARKAN TANWIN LENGKAP! */}
      {activeSign === 1 && (
        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-2xl border-2 border-amber-300 p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-emerald-950 uppercase tracking-wider">
                Pembahasan Mendalam
              </span>
              <h4 className="text-xl font-extrabold text-amber-950 mt-1 flex items-center gap-2">
                <span>Bedah Tuntas 4 Macam Tanwin Khusus Isim</span>
                <span className="font-arabic text-2xl text-amber-800">(أَقْسَامُ التَّنْوِينِ الأَرْبَعَةُ)</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Tanwin adalah nun sukun tambahan di akhir kata isim yang diucapkan tapi tidak digoreskan dalam tulisan. Tanwin terbagi menjadi 4 ragam dengan fungsi filosofis yang berbeda:
              </p>
            </div>
          </div>

          {/* 4 Tanwin Sub-tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'tamkin', title: '1. Tanwin Tamkin', arab: 'تَنْوِين التَّمْكِين', color: 'emerald', tag: 'Isim Munsharif' },
              { id: 'tankir', title: '2. Tanwin Tankir', arab: 'تَنْوِين التَّنْكِير', color: 'blue', tag: 'Pembeda Isim Mabni' },
              { id: 'muqabalah', title: '3. Tanwin Muqabalah', arab: 'تَنْوِين المُقَابَلَة', color: 'purple', tag: 'Jamak Muannats Salim' },
              { id: 'iwadh', title: '4. Tanwin \'Iwadh', arab: 'تَنْوِين العِوَض', color: 'rose', tag: 'Pengganti Kata/Ayat' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTanwinSubTab(tab.id)}
                className={`p-3 rounded-xl border text-center transition ${
                  tanwinSubTab === tab.id
                    ? 'bg-amber-500 text-emerald-950 font-bold border-amber-600 shadow-md ring-2 ring-amber-300'
                    : 'bg-white hover:bg-amber-100/50 text-slate-700 border-amber-200'
                }`}
              >
                <span className="font-arabic text-base block font-bold">{tab.arab}</span>
                <span className="text-xs font-bold block mt-0.5">{tab.title}</span>
                <span className="text-[10px] text-slate-500 block">{tab.tag}</span>
              </button>
            ))}
          </div>

          {/* Sub-tab 1: Tanwin Tamkin */}
          {tanwinSubTab === 'tamkin' && (
            <div className="bg-white rounded-xl p-5 border border-amber-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="font-bold text-emerald-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                  Tanwin Tamkin (تَنْوِينُ التَّمْكِينِ / الأَمْكَنِيَّةِ)
                </h5>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  Kemantapan Isim Asli
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Disebut juga <strong>Tanwin Amkaniyyah</strong> atau <strong>Tanwin Sharaf</strong>. Yaitu tanwin yang masuk pada isim-isim <em>Mu'rab Munsharif</em> (isim yang dapat menerima seluruh harakat dan tanwin). Fungsinya menunjukkan bahwa kata tersebut <strong>sangat kokoh/mantap (mutamakkin amkan)</strong> berada di ranah ke-isim-an; tidak menyerupai fi'il (yang tidak boleh bertanwin) dan tidak menyerupai huruf (yang mabni).
              </p>

              {/* Visual Example Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="font-arabic text-2xl font-bold text-emerald-900 block">رَجُلٌ</span>
                  <span className="text-xs font-bold text-slate-800">Rajulun (Seorang pria)</span>
                  <span className="text-[11px] text-slate-500 block">Isim mufrad mudzakkar munsharif</span>
                </div>
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="font-arabic text-2xl font-bold text-emerald-900 block">كِتَابٌ</span>
                  <span className="text-xs font-bold text-slate-800">Kitaabun (Sebuah buku)</span>
                  <span className="text-[11px] text-slate-500 block">Benda mati mu'rab munsharif</span>
                </div>
                <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="font-arabic text-2xl font-bold text-emerald-900 block">زَيْدٌ</span>
                  <span className="text-xs font-bold text-slate-800">Zaidun (Nama orang)</span>
                  <span className="text-[11px] text-slate-500 block">Nama 'alam munsharif</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Tanwin Tankir */}
          {tanwinSubTab === 'tankir' && (
            <div className="bg-white rounded-xl p-5 border border-amber-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="font-bold text-blue-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  Tanwin Tankir (تَنْوِينُ التَّنْكِيرِ)
                </h5>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Pembeda Ma'rifah vs Nakirah
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Yaitu tanwin yang masuk pada <strong>sebagian Isim Mabni</strong> (seperti nama yang berakhiran <em>-waih</em> atau isim fi'il) dengan tujuan <strong>membedakan antara sosok yang sudah tertentu/terkenal (Ma'rifah)</strong> dengan <strong>sosok umum/siapa saja (Nakirah)</strong>.
              </p>

              {/* High Contrast Comparative Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Tanpa Tanwin = MA'RIFAH
                    </span>
                    <span className="font-arabic text-xl font-bold text-slate-800">سِيبَوَيْهِ</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Artinya: Anda memaksudkan <strong>Imam Sibawaih sang peletak gramatika nahwu yang agung</strong> (sosok spesifik yang sudah dikenal luas).
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                      Bertanwin = NAKIRAH
                    </span>
                    <span className="font-arabic text-xl font-bold text-amber-900">سِيبَوَيْهٍ</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Artinya: Anda memaksudkan <strong>seseorang lain bernama Sibawaih yang tidak dikenal</strong> oleh pendengar.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs text-blue-950">
                <strong>Contoh pada Isim Fi'il:</strong> Mengucapkan <span className="font-arabic font-bold text-sm">صَهْ</span> (tanpa tanwin) berarti <em>"Diamlah dari topik pembicaraan saat ini"</em>, sedangkan mengucapkan <span className="font-arabic font-bold text-sm">صَهٍ</span> (dengan tanwin) berarti <em>"Diamlah total dari segala macam suara dan pembicaraan!"</em>.
              </div>
            </div>
          )}

          {/* Sub-tab 3: Tanwin Muqabalah */}
          {tanwinSubTab === 'muqabalah' && (
            <div className="bg-white rounded-xl p-5 border border-amber-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="font-bold text-purple-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">3</span>
                  Tanwin Muqabalah (تَنْوِينُ المُقَابَلَةِ)
                </h5>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  Tandingan Huruf Nun
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Yaitu tanwin yang masuk pada <strong>Jamak Mu'annats Salim</strong> (seperti <span className="font-arabic font-bold">مُسْلِمَاتٌ</span>, <span className="font-arabic font-bold">مُؤْمِنَاتٌ</span>). Dinamakan <em>Muqabalah</em> (penyetara/tandingan) karena ia hadir untuk <strong>mengimbangi keberadaan huruf Nun</strong> yang berada di akhir Jamak Mudzakkar Salim (<span className="font-arabic font-bold">مُسْلِمُونَ</span>).
              </p>

              {/* Visual Balance Scale */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-900 uppercase">Jamak Mudzakkar Salim:</span>
                  <div className="font-arabic text-3xl font-bold text-purple-950">مُسْلِمُـ<span className="text-amber-600 underline">ونَ</span></div>
                  <span className="text-xs text-slate-500">Memiliki huruf Nun (ن) di akhir</span>
                </div>
                <div className="text-amber-600 font-bold text-xl">⚖️ Ditandingi Oleh ⚖️</div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-900 uppercase">Jamak Mu'annats Salim:</span>
                  <div className="font-arabic text-3xl font-bold text-purple-950">مُسْلِمَا<span className="text-amber-600 underline">تٌ</span></div>
                  <span className="text-xs text-slate-500">Tanwin hadir sebagai penyeimbang huruf Nun</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Tanwin 'Iwadh */}
          {tanwinSubTab === 'iwadh' && (
            <div className="bg-white rounded-xl p-5 border border-amber-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h5 className="font-bold text-rose-950 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs">4</span>
                  Tanwin 'Iwadh (تَنْوِينُ العِوَضِ) - Tanwin Pengganti
                </h5>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900">
                  Ganti Huruf / Kata / Kalimat
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Kata <em>'Iwadh</em> bermakna <strong>ganti rugi / kompensasi</strong>. Tanwin ini bukan tanwin biasa, melainkan menggantikan bagian kata atau kalimat yang dihapus agar lebih ringkas dan balaghah. Terbagi menjadi 3 tingkatan:
              </p>

              {/* 3 Tiers of 'Iwadh */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">a. 'Iwadh 'an Harf (Pengganti Satu Huruf):</span>
                    <span className="font-arabic text-lg font-bold text-emerald-900">قَاضٍ (asalnya: قَاضِيٌ)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Masuk pada isim manqush nakirah saat rafa' dan jar. Tanwin ini menggantikan huruf <strong>Ya'</strong> yang dibuang.
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">b. 'Iwadh 'an Kalimah (Pengganti Satu Kata):</span>
                    <span className="font-arabic text-lg font-bold text-emerald-900">كُلٌّ قَائِمٌ</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Masuk pada kata (كُلٌّ) dan (بَعْضٌ). Tanwin pada (كُلٌّ) menggantikan mudhaf ilaih yang dihapus, takdirnya: <span className="font-arabic font-bold text-emerald-900">كُلُّ إِنْسَانٍ قَائِمٌ</span> (Setiap manusia berdiri).
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900">c. 'Iwadh 'an Jumlah (Pengganti Satu Kalimat Penuh!):</span>
                    <span className="font-arabic text-lg font-bold text-emerald-900">وَأَنْتُمْ حِينَئِذٍ تَنْظُرُونَ</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Masuk pada lafazh (حِينَئِذٍ) dan (يَوْمَئِذٍ). Tanwin kasrah pada (حِينَئِذٍ) menggantikan seluruh kalimat sebelumnya: <em>"Dan kamu ketika itu [ketika nyawa telah sampai di kerongkongan] hanya melihat saja"</em>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PERINGATAN PENTING: KAPAN ISIM HARAM BERTANWIN? */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-900 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Peringatan Emas: 3 Kondisi di Mana Isim DILARANG Bertanwin!
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-slate-800">
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <strong className="text-red-800 block mb-1">1. Kemasukan (الـ):</strong>
                <span>Alif-lam dan tanwin adalah musuh bebuyutan. Tidak boleh berkumpul pada satu kata: <span className="font-arabic text-sm font-bold">الْكِتَابُ</span> (Bukan الكتابٌ).</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <strong className="text-red-800 block mb-1">2. Berstatus Mudhaf:</strong>
                <span>Susunan kata majemuk menggugurkan tanwin: <span className="font-arabic text-sm font-bold">كِتَابُ زَيْدٍ</span> (Bukan كتابٌ زيدٍ).</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-red-200">
                <strong className="text-red-800 block mb-1">3. Isim Ghair Munsharif:</strong>
                <span>Isim yang tercegah dari sharaf (seperti nama wanita, wazan af'alu, shighat muntahal jumuu'): <span className="font-arabic text-sm font-bold">مَسَاجِدُ، أَحْمَدُ</span>.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAMPILAN TANDA LAINNYA (0: Jar, 2: Nida, 3: Al, 4: Isnad) */}
      {activeSign !== 1 && (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100">
                {signs[activeSign].badge}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <span>{signs[activeSign].title}</span>
                <span className="font-arabic text-xl text-emerald-900">({signs[activeSign].arab})</span>
              </h4>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {signs[activeSign].summary}
          </p>

          {/* Contoh-contoh Visual */}
          {signs[activeSign].examples && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Contoh Penerapan Kaidah:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {signs[activeSign].examples.map((ex, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-xs font-bold text-emerald-800 block">{ex.label}</span>
                    <span className="font-arabic text-2xl font-bold text-slate-900 block">{ex.arab}</span>
                    <span className="text-xs text-slate-500 block">{ex.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
