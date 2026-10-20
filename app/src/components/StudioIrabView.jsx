import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Zap, 
  Layers, 
  BookOpen, 
  ShieldCheck,
  Compass,
  Lightbulb,
  Check
} from 'lucide-react';

export default function StudioIrabView({ fontSize = 28, onJumpToQuran }) {
  const challenges = [
    {
      id: 'CH-01',
      title: 'Tantangan 1: Lafazh Basmalah',
      surah: 'Al-Fatihah : 1',
      verseArab: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      verseIndo: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.',
      targetWord: 'بِسْمِ',
      difficulty: 'Pemula',
      wordMeaning: 'Dengan nama',
      steps: [
        {
          question: 'Tahap 1: Apa jenis binyah kata (بِسْمِ) ini?',
          hint: 'Kata ini adalah gabungan dari huruf awalan Ba (بِـ) dan kata Ism (اسْم).',
          options: [
            { text: 'Gabungan Huruf Jar + Kata Benda (Isim)', isCorrect: true, reason: 'Tepat! Terdiri dari huruf jar Ba\' dan isim mufrad Ism.' },
            { text: 'Kata Kerja Masa Lampau (Fi\'il Madhi)', isCorrect: false, reason: 'Kurang tepat. Bism bukan kata kerja.' },
            { text: 'Kata Sambung Murni (Huruf)', isCorrect: false, reason: 'Kurang tepat. Ba memang huruf, tetapi Ism adalah isim.' }
          ]
        },
        {
          question: 'Tahap 2: Siapa yang menjadi \'Amil (faktor penyebab) harakat kata (اسْمِ)?',
          hint: 'Perhatikan huruf yang menempel di depannya.',
          options: [
            { text: 'Huruf Jar Ba\' (بِـ) di depannya', isCorrect: true, reason: 'Mumtaz! Huruf jar Ba\' adalah amil yang mengekasrahkan kata setelahnya.' },
            { text: 'Fi\'il yang tersembunyi di awal', isCorrect: false, reason: 'Fi\'il mahdzuf adalah tempat bergantung (ta\'alluq), bukan amil lafzhi langsung bagi kata ism.' },
            { text: 'Tidak ada amil (berdiri sendiri)', isCorrect: false, reason: 'Kurang tepat. Dalam kaidah Nahwu, setiap kata majrur pasti memiliki amil jar.' }
          ]
        },
        {
          question: 'Tahap 3: Apa status hukum sintaksis (i\'rab) kata (اسْمِ)?',
          hint: 'Karena didahului huruf jar, maka statusnya adalah...',
          options: [
            { text: 'Majrur (الْمَجْرُورُ)', isCorrect: true, reason: 'Benar sekali! Isim yang didahului huruf jar berstatus majrur.' },
            { text: 'Marfu\' (الْمَرْفُوعُ)', isCorrect: false, reason: 'Marfu\' untuk subjek atau fa\'il, bukan isim setelah huruf jar.' },
            { text: 'Manshub (الْمَنْصُوبُ)', isCorrect: false, reason: 'Manshub untuk objek penderita atau maf\'ul.' }
          ]
        },
        {
          question: 'Tahap 4: Apa tanda i\'rabnya dan mengapa?',
          hint: 'Lihat harakat huruf terakhir pada huruf Mim (مِ).',
          options: [
            { text: 'Kasrah Zhahirah (tanda asli) karena Isim Mufrad', isCorrect: true, reason: 'Sempurna! Tanda majrur isim mufrad adalah kasrah tampak di akhir kata.' },
            { text: 'Ya\' karena Jamak Taksir', isCorrect: false, reason: 'Ism bukan jamak, melainkan kata tunggal (mufrad).' },
            { text: 'Fathah karena Ghairu Munsharif', isCorrect: false, reason: 'Kata ism adalah isim munsharif biasa bertanda kasrah.' }
          ]
        }
      ],
      fullClassicalFormula: 'البَاءُ: حَرْفُ جَرٍّ مَبْنِيٌّ عَلَى الكَسْرِ لَا مَحَلَّ لَهُ مِنَ الإِعْرَابِ. اسْمِ: اسْمٌ مَجْرُورٌ بِالبَاءِ وَعَلَامَةُ جَرِّهِ الكَسْرَةُ الظَّاهِرَةُ فِي آخِرِهِ، وَهُوَ مُضَافٌ. وَالجَارُّ وَالمَجْرُورُ شِبْهُ جُمْلَةٍ مُتَعَلِّقَانِ بِمَحْذُوفٍ خَبَرٍ أَوْ فِعْلٍ تَقْدِيرُهُ (أَبْتَدِئُ).'
    },
    {
      id: 'CH-02',
      title: 'Tantangan 2: Surat Al-Baqarah',
      surah: 'Al-Baqarah : 2',
      verseArab: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ',
      verseIndo: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya.',
      targetWord: 'رَيْبَ',
      difficulty: 'Menengah',
      wordMeaning: 'Keraguan',
      steps: [
        {
          question: 'Tahap 1: Apa jenis kata (رَيْبَ) dan amil yang mempengaruhinya?',
          hint: 'Perhatikan huruf penafian (لَا) di depannya.',
          options: [
            { text: 'Isim Nakirah yang dipengaruhi Laa Nafiyah lil Jins', isCorrect: true, reason: 'Tepat! Rayba adalah isim nakirah setelah Laa yang menafikan semua jenis keraguan.' },
            { text: 'Fi\'il Mudhari\' yang dinafikan', isCorrect: false, reason: 'Rayba adalah kata benda (keraguan), bukan kata kerja.' },
            { text: 'Khabar Mubtada\' yang dibalik', isCorrect: false, reason: 'Rayba bukan khabar, melainkan isim Laa.' }
          ]
        },
        {
          question: 'Tahap 2: Bagaimana struktur bentuk isim pada kata (رَيْبَ)?',
          hint: 'Apakah dia tersusun dari dua kata (mudhaf) atau berdiri tunggal?',
          options: [
            { text: 'Mufrad (bukan mudhaf dan bukan syabih bil mudhaf)', isCorrect: true, reason: 'Benar! Rayba berdiri sendiri secara mufrad tanpa mudhaf ilaih.' },
            { text: 'Mudhaf kepada kata Fiihi', isCorrect: false, reason: 'Fiihi adalah jar-majrur khabar Laa, bukan mudhaf ilaih.' },
            { text: 'Syabih bil Mudhaf bertanwin', isCorrect: false, reason: 'Rayba tidak bertanwin dan tidak beramal pada kata setelahnya.' }
          ]
        },
        {
          question: 'Tahap 3: Apa hukum i\'rab Isim Laa yang berbentuk Mufrad?',
          hint: 'Ingat kaidah: Isim Laa Mufrad hukumnya bukan mu\'rab biasa, melainkan...',
          options: [
            { text: 'Mabni di atas fathah pada posisi nashab (مَبْنِيٌّ عَلَى الفَتْحِ فِي مَحَلِّ نَصْبٍ)', isCorrect: true, reason: 'Mumtaz! Isim Laa jika mufrad mabni di atas harakat nashabnya tanpa tanwin.' },
            { text: 'Mu\'rab manshub dengan tanwin (-an)', isCorrect: false, reason: 'Isim Laa mufrad haram bertanwin.' },
            { text: 'Marfu\' dengan dhommah seperti mubtada\'', isCorrect: false, reason: 'Laa menashabkan isimnya, bukan merafa\'kan.' }
          ]
        },
        {
          question: 'Tahap 4: Apa fungsi partikel (لَا) dalam ayat ini secara makna?',
          hint: 'Apakah sekadar meniadakan sebagian keraguan, atau meniadakan seluruhnya?',
          options: [
            { text: 'Penafian mutlak tanpa sisa (Nafyul Jinsi \'alal Istighraq)', isCorrect: true, reason: 'Sempurna! Menafikan segala bentuk keraguan baik besar maupun sekecil atom.' },
            { text: 'Larangan (Nahi) agar jangan ragu', isCorrect: false, reason: 'Ini Laa Nafiyah (peniadaan informasi), bukan Laa Nahiyah (larangan).' },
            { text: 'Pilihan antara dua keraguan', isCorrect: false, reason: 'Bukan pilihan.' }
          ]
        }
      ],
      fullClassicalFormula: 'لَا: نَافِيَةٌ لِلْجِنْسِ تَعْمَلُ عَمَلَ إِنَّ، حَرْفٌ مَبْنِيٌّ عَلَى السُّكُونِ. رَيْبَ: اسْمُ لَا نَافِيَةِ لِلْجِنْسِ مَبْنِيٌّ عَلَى الفَتْحِ فِي مَحَلِّ نَصْبٍ لِأَنَّهُ مُفْرَدٌ. فِيهِ: جَارٌّ وَمَجْرُورٌ شِبْهُ جُمْلَةٍ فِي مَحَلِّ رَفْعٍ خَبَرُ (لَا).'
    },
    {
      id: 'CH-03',
      title: 'Tantangan 3: Rahasia Tauhid Al-Fatihah',
      surah: 'Al-Fatihah : 5',
      verseArab: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      verseIndo: 'Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.',
      targetWord: 'إِيَّاكَ',
      difficulty: 'Mahir',
      wordMeaning: 'Hanya kepada-Mu',
      steps: [
        {
          question: 'Tahap 1: Apa jenis kata (إِيَّاكَ)?',
          hint: 'Kata ini adalah kata ganti terpisah yang khusus untuk objek.',
          options: [
            { text: 'Dhamir Munfashil khusus posisi Nashab (Dhamir Nashab Munfashil)', isCorrect: true, reason: 'Tepat! Iyyaka adalah satu-satunya kata ganti munfashil khusus kedudukan nashab.' },
            { text: 'Huruf Nida\' untuk memanggil', isCorrect: false, reason: 'Iyyaka bukan huruf panggilan (nida).' },
            { text: 'Isim Isyarah penunjuk arah', isCorrect: false, reason: 'Bukan isim isyarah.' }
          ]
        },
        {
          question: 'Tahap 2: Apa kedudukan sintaksis (i\'rab) kata (إِيَّاكَ) dalam kalimat ini?',
          hint: 'Perhatikan kata kerja (نَعْبُدُ = kami menyembah) setelahnya. Siapa objek yang disembah?',
          options: [
            { text: 'Maf\'ul Bih Muqaddam (Objek yang Didahulukan)', isCorrect: true, reason: 'Mumtaz! Menjadi objek sasaran dari kata kerja na\'budu.' },
            { text: 'Mubtada\' Marfu\' di awal kalimat', isCorrect: false, reason: 'Iyyaka bukan dhamir rafa\', tidak bisa menjadi mubtada\'.' },
            { text: 'Fa\'il (Pelaku penyembahan)', isCorrect: false, reason: 'Pelakunya adalah kami (nahnu) yang terkandung di dalam na\'budu.' }
          ]
        },
        {
          question: 'Tahap 3: Apa status hukum dan tanda bina\' kata (إِيَّاكَ)?',
          hint: 'Dhamir termasuk kelompok kata mabni atau mu\'rab?',
          options: [
            { text: 'Mabni di atas fathah pada posisi nashab (فِي مَحَلِّ نَصْبٍ)', isCorrect: true, reason: 'Benar sekali! Seluruh kata ganti (dhamir) hukumnya mabni.' },
            { text: 'Mu\'rab manshub dengan fathah zhahirah', isCorrect: false, reason: 'Dhamir tidak berstatus mu\'rab biasa.' },
            { text: 'Majrur dengan kasrah muqaddarah', isCorrect: false, reason: 'Tidak ada huruf jar yang menjarrkannya.' }
          ]
        },
        {
          question: 'Tahap 4: Mengapa Objek (إِيَّاكَ) ditaruh di depan kata kerja (نَعْبُدُ)?',
          hint: 'Apa rahasia balaghah dan teologi dari pembalikan urutan ini?',
          options: [
            { text: 'Untuk faedah Al-Hashr wal Qashr (Mengunci pengkhususan tauhid: HANYA KEPADA-MU)', isCorrect: true, reason: 'Luar biasa! Mendahulukan ma\'mul mengunci makna tauhid secara mutlak.' },
            { text: 'Sekadar menyamakan rima sajak akhir ayat', isCorrect: false, reason: 'Al-Qur\'an bukan puisi, susunannya memiliki tujuan makna yang agung.' },
            { text: 'Karena kata kerja na\'budu tidak boleh ditaruh di depan', isCorrect: false, reason: 'Boleh di depan (na\'buduka), tetapi maknanya tidak mengunci tauhid.' }
          ]
        }
      ],
      fullClassicalFormula: 'إِيَّا: ضَمِيرٌ مُنْفَصِلٌ مَبْنِيٌّ عَلَى السُّكُونِ فِي مَحَلِّ نَصْبٍ مَفْعُولٌ بِهِ مُقَدَّمٌ، وَالكَافُ حَرْفُ خِطَابٍ مَبْنِيٌّ عَلَى الفَتْحِ لَا مَحَلَّ لَهُ مِنَ الإِعْرَابِ. نَعْبُدُ: فِعْلٌ مُضَارِعٌ مَرْفُوعٌ بِالضَّمَّةِ الظَّاهِرَةِ، وَالفَاعِلُ ضَمِيرٌ مُسْتَتِرٌ وُجُوبًا تَقْدِيرُهُ (نَحْنُ).'
    }
  ];

  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [stepIdx]: optionIdx }
  const [showHint, setShowHint] = useState(false);

  const activeChallenge = challenges[selectedChallengeIdx];
  const currentStep = activeChallenge.steps[currentStepIdx];
  const isAnswered = selectedAnswers[currentStepIdx] !== undefined;
  const currentChoice = isAnswered ? currentStep.options[selectedAnswers[currentStepIdx]] : null;

  const totalSteps = activeChallenge.steps.length;
  const isAllCompleted = Object.keys(selectedAnswers).length === totalSteps && 
    activeChallenge.steps.every((s, idx) => s.options[selectedAnswers[idx]]?.isCorrect);

  const handleSelectOption = (optIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [currentStepIdx]: optIdx }));
  };

  const handleNextStep = () => {
    if (currentStepIdx < totalSteps - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handleResetChallenge = () => {
    setSelectedAnswers({});
    setCurrentStepIdx(0);
    setShowHint(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-indigo-950 text-xs font-extrabold shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Laboratorium Interaktif Step-by-Step
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2 flex items-center gap-2">
              Studio Simulasi Detektif I'rab Mandiri
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-2xl leading-relaxed">
              Latih logika berpikir seorang ahli nahwu! Alih-alih hanya membaca hasil i'rab yang sudah jadi, Anda dipandu membedah ayat langkah demi langkah: dari melacak 'Amil hingga merumuskan i'rab presisinya.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleResetChallenge}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition border border-white/10 text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Latihan
            </button>
          </div>
        </div>

        {/* Challenge Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {challenges.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChallengeIdx(idx);
                handleResetChallenge();
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                selectedChallengeIdx === idx
                  ? 'bg-amber-400 text-indigo-950 border-amber-300 font-extrabold shadow-lg scale-102 ring-2 ring-amber-300/50'
                  : 'bg-indigo-900/40 hover:bg-indigo-800/60 text-white border-indigo-700/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono">{ch.surah}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  selectedChallengeIdx === idx ? 'bg-indigo-950 text-amber-300' : 'bg-indigo-800 text-indigo-200'
                }`}>
                  {ch.difficulty}
                </span>
              </div>
              <h4 className="font-extrabold text-sm">{ch.title}</h4>
              <p className="text-xs opacity-90 truncate mt-0.5 font-arabic text-lg">{ch.verseArab}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Target Ayat & Progress Tracker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Verse Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Analisis: {activeChallenge.surah}
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full">
                Kata Fokus: {activeChallenge.targetWord}
              </span>
            </div>

            {/* Big Verse Arabic */}
            <div className="bg-gradient-to-r from-slate-50 via-amber-50/20 to-slate-50 p-6 rounded-2xl border border-amber-200/70 text-right space-y-2">
              <p 
                className="font-arabic font-extrabold text-slate-900 leading-loose"
                style={{ fontSize: `${fontSize + 2}px` }}
              >
                {activeChallenge.verseArab}
              </p>
              <p className="text-xs text-slate-600 italic text-left pt-2 border-t border-slate-200/60">
                "{activeChallenge.verseIndo}"
              </p>
            </div>

            {/* Target Word Detail */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-900 font-semibold block">Kata yang sedang dibedah:</span>
                <span className="font-arabic text-2xl font-extrabold text-indigo-950">{activeChallenge.targetWord}</span>
              </div>
              <span className="text-xs bg-white text-indigo-950 font-bold px-3 py-1.5 rounded-xl border border-indigo-200 shadow-2xs">
                Arti: {activeChallenge.wordMeaning}
              </span>
            </div>

            {/* Step Progress Pills */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Kemajuan 4 Langkah Nalar:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {activeChallenge.steps.map((st, sIdx) => {
                  const isDone = selectedAnswers[sIdx] !== undefined && st.options[selectedAnswers[sIdx]]?.isCorrect;
                  const isCurrent = currentStepIdx === sIdx;
                  return (
                    <button
                      key={sIdx}
                      onClick={() => setCurrentStepIdx(sIdx)}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        isCurrent
                          ? 'bg-indigo-900 text-amber-300 border-indigo-900 font-extrabold shadow-sm'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      <span className="text-xs block">Tahap {sIdx + 1}</span>
                      <span className="text-[10px] block font-mono">
                        {isDone ? '✓ Mumtaz' : isCurrent ? 'Sedang Uji' : 'Menunggu'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step Question & Reasoning Options */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step Question Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-900 text-amber-300 flex items-center justify-center text-sm font-extrabold">
                  {currentStepIdx + 1}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Langkah {currentStepIdx + 1} dari {totalSteps}
                </span>
              </div>

              {/* Hint Trigger */}
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-semibold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Buka Petunjuk Kaidah'}</span>
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-2.5 animate-in fade-in duration-150">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 fill-amber-400" />
                <div>
                  <strong className="block mb-0.5">Petunjuk Nalar Ulama:</strong>
                  {currentStep.hint}
                </div>
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {currentStep.question}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentStep.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentStepIdx] === optIdx;
                let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';

                if (isSelected) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-500/30';
                  } else {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500/30';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-150 flex items-start gap-3.5 ${btnStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected && opt.isCorrect ? 'bg-emerald-600 text-white' :
                      isSelected && !opt.isCorrect ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <div className="space-y-1">
                      <span className="font-bold text-sm leading-snug block">{opt.text}</span>
                      {isSelected && (
                        <p className={`text-xs leading-relaxed pt-1 border-t ${
                          opt.isCorrect ? 'text-emerald-800 border-emerald-200' : 'text-rose-800 border-rose-200'
                        }`}>
                          {opt.reason}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Pilih salah satu opsi nalar di atas untuk melanjutkan.
              </span>

              {isAnswered && currentChoice?.isCorrect && currentStepIdx < totalSteps - 1 && (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-amber-300 font-extrabold text-xs shadow-md transition"
                >
                  <span>Lanjut ke Tahap {currentStepIdx + 2}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* All Completed Certificate Card */}
          {isAllCompleted && (
            <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-400 space-y-5 animate-in slide-in-from-bottom-3 duration-200">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <h4 className="text-lg font-extrabold text-white">
                    Mumtaz! Sertifikat Analisis I'rab Sempurna
                  </h4>
                </div>
                <span className="text-xs bg-amber-400 text-emerald-950 font-extrabold px-3 py-1 rounded-full">
                  100% Sesuai Kaidah
                </span>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Anda telah berhasil menuntaskan seluruh 4 tahap penalaran sintaksis untuk kata <strong>{activeChallenge.targetWord}</strong>. Berikut adalah redaksi baku I'rab klasiknya sebagaimana diajarkan dalam kitab <em>An-Nahwu At-Tathbiqi</em>:
              </p>

              {/* Classical Formula Box */}
              <div className="bg-emerald-950/80 border border-emerald-600/50 p-5 rounded-2xl text-right">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block text-left mb-2">
                  نَصُّ الإِعْرَابِ التَّطْبِيقِيِّ الكَامِلِ (RUMUS I'RAB BAKU):
                </span>
                <p 
                  className="font-arabic font-bold text-amber-100 leading-loose"
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {activeChallenge.fullClassicalFormula}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-xs text-emerald-300">
                  Coba tantangan ayat lainnya pada tombol pilihan di atas!
                </span>

                {onJumpToQuran && (
                  <button
                    onClick={() => {
                      const parts = activeChallenge.surah.split(':');
                      onJumpToQuran(parts[0].trim(), parseInt(parts[1], 10) || 1);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs shadow-md transition"
                  >
                    <span>Eksplorasi Lengkap di Mushaf I'rab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
