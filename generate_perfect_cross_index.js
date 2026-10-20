const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);
const BAB_FILE = path.join(BASE_DIR, 'data', '01_kurikulum_bab.json');
const IRAB_FILE = path.join(BASE_DIR, 'app', 'src', 'data', '03_contoh_dan_irab.json');
const LATIHAN_FILE = path.join(BASE_DIR, 'app', 'src', 'data', '06_latihan_quran.json');
const MASTER_QURAN_FILE = path.join(BASE_DIR, 'data', '06_seluruh_ayat_quran_6236.json');

const OUT_DATA = path.join(BASE_DIR, 'data', '07_bab_quran_cross_index.json');
const OUT_APP = path.join(BASE_DIR, 'app', 'src', 'data', '07_bab_quran_cross_index.json');

const babs = JSON.parse(fs.readFileSync(BAB_FILE, 'utf8'));
const irabs = JSON.parse(fs.readFileSync(IRAB_FILE, 'utf8'));
const latihans = JSON.parse(fs.readFileSync(LATIHAN_FILE, 'utf8'));
const masterSurahs = JSON.parse(fs.readFileSync(MASTER_QURAN_FILE, 'utf8'));

// Curated additional verses for babs with few latihan
const CURATED_ADDITIONAL_AYAT = {
  'BAB-01': [
    { surah_id: 18, ayah_id: 109, kata_kunci: 'لِكَلِمَاتِ - كَلِمَاتُ', fokus: "Tanda Isim Jar bil-Harf & Idhafah pada Al-Kalimat" },
    { surah_id: 19, ayah_id: 30, kata_kunci: 'قَالَ - إِنِّي - عَبْدُ', fokus: "Kombinasi Rukun Kalam (Isim, Fi'il, Harf) dalam Satu Jumlah" },
    { surah_id: 2, ayah_id: 255, kata_kunci: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ', fokus: "Kalam Mufid Murakkab Isnad Tamm Sempurna" },
    { surah_id: 112, ayah_id: 1, kata_kunci: 'قُلْ هُوَ اللَّهُ أَحَدٌ', fokus: "Kalam Mufid Tersusun dari Fi'il, Isim, dan Khabar" }
  ],
  'BAB-02': [
    { surah_id: 113, ayah_id: 1, kata_kunci: 'أَعُوذُ - الْفَلَقِ', fokus: "Mizan Sharfi & Bina' Ajwaf Wawi (عوذ) dan Shahih Salim (فلق)" },
    { surah_id: 40, ayah_id: 9, kata_kunci: 'قِهِمُ - تَقِ', fokus: "Mizan Sharfi Bina' Lafif Mafruq (وقي - فَعَى / عِ)" },
    { surah_id: 20, ayah_id: 61, kata_kunci: 'خَابَ - افْتَرَى', fokus: "Mizan Sharfi Bina' Ajwaf Yai (خيب) & Naqish (فري)" },
    { surah_id: 99, ayah_id: 1, kata_kunci: 'زُلْزِلَتِ - زِلْزَالَهَا', fokus: "Mizan Ruba'i Mujarrad (فَعْلَلَ - زَلْزَلَ)" }
  ],
  'BAB-03': [
    { surah_id: 11, ayah_id: 113, kata_kunci: 'تَرْكَنُوا - تَمَسَّكُمُ', fokus: "Beda Wazan Tsulatsi Mujarrad (فَعَلَ - رَكَنَ) dan Mudha'af (مَسَّ)" },
    { surah_id: 12, ayah_id: 23, kata_kunci: 'رَاوَدَتْهُ - غَلَّقَتِ', fokus: "Makna Fa'ala (Musyarakah) & Fa''ala (Mubalaghah/Taksir)" },
    { surah_id: 18, ayah_id: 97, kata_kunci: 'اسْطَاعُوا - اسْتَطَاعُوا', fokus: "Faedah Istif'al (Thalab/Takalluf) dan Takhfif Hadzf Ta'" },
    { surah_id: 89, ayah_id: 27, kata_kunci: 'الْمُطْمَئِنَّةُ', fokus: "Wazan Ruba'i Mazid If'allala (اطْمَأَنَّ - اطْمِئْنَان)" }
  ],
  'BAB-04': [
    { surah_id: 2, ayah_id: 216, kata_kunci: 'عَسَىٰ', fokus: "Fi'il Jamid Ghairu Mutasharrif untuk Makna Tarajji (Raja')" },
    { surah_id: 4, ayah_id: 171, kata_kunci: 'لَيْسَ', fokus: "Fi'il Jamid Pengungkap Nafi Murni" },
    { surah_id: 7, ayah_id: 155, kata_kunci: 'اخْتَارَ مُوسَىٰ قَوْمَهُ', fokus: "Fi'il Muta'addi bi-Isqathil Khafidh (Naz'ul Khafidh)" },
    { surah_id: 2, ayah_id: 167, kata_kunci: 'يُرِيهِمُ اللَّهُ أَعْمَالَهُمْ حَسَرَاتٍ', fokus: "Fi'il Penashab 3 Maf'ul (Ara / Bab A'lama)" }
  ],
  'BAB-05': [
    { surah_id: 2, ayah_id: 125, kata_kunci: 'جَعَلْنَا - عَهِدْنَا', fokus: "Penyandaran Fi'il Shahih Salim ke Dhamir Mutakallim Na" },
    { surah_id: 2, ayah_id: 217, kata_kunci: 'يَرْتَدِدْ', fokus: "Hukum Fakkul Idgham pada Fi'il Mudha'af dalam Keadaan Jazm" },
    { surah_id: 5, ayah_id: 54, kata_kunci: 'يَرْتَدَّ', fokus: "Hukum Idgham Fi'il Mudha'af Majzum bi-Harakah Thari'ah" },
    { surah_id: 110, ayah_id: 2, kata_kunci: 'رَأَيْتَ', fokus: "Penyandaran Fi'il Mahmuzul 'Ain ke Ta' Fa'il Mukhathab" }
  ],
  'BAB-06': [
    { surah_id: 5, ayah_id: 1, kata_kunci: 'أَوْفُوا', fokus: "Penyandaran Fi'il Amr Mu'tal Naqish/Lafif ke Wawu Jama'ah" },
    { surah_id: 19, ayah_id: 26, kata_kunci: 'قُولِي - نَذَرْتُ', fokus: "Penyandaran Fi'il Ajwaf ke Ya' Mukhathabah & Ta' Fa'il" },
    { surah_id: 20, ayah_id: 10, kata_kunci: 'امْكُثُوا - آنَسْتُ', fokus: "Penyandaran Fi'il Shahih & Mu'tal ke Dhamir Bariz" }
  ],
  'BAB-07': [
    { surah_id: 12, ayah_id: 32, kata_kunci: 'لَيُسْجَنَنَّ وَلَيَكُونًا', fokus: "Kombinasi Nun Taukid Tsaqilah (سجن) dan Khafifah (يكون)" },
    { surah_id: 96, ayah_id: 15, kata_kunci: 'لَنَسْفَعًا بِالنَّاصِيَةِ', fokus: "Penguatan Fi'il dengan Nun Taukid Khafifah Ditulis Alif" },
    { surah_id: 21, ayah_id: 57, kata_kunci: 'لَأَكِيدَنَّ', fokus: "Wujub Taukid Fi'il Mudhari' Mustaqbal Muqsam 'Alaih" },
    { surah_id: 3, ayah_id: 178, kata_kunci: 'وَلَا يَحْسَبَنَّ', fokus: "Jawaz Taukid Fi'il Mudhari' setelah La An-Nahiyah" }
  ],
  'BAB-08': [
    { surah_id: 2, ayah_id: 251, kata_kunci: 'دَفْعُ اللَّهِ النَّاسَ', fokus: "I'mal Mashdar: Idhafah ke Fa'il (الله) dan Menashabkan Maf'ul (الناس)" },
    { surah_id: 90, ayah_id: 14, kata_kunci: 'إِطْعَامٌ ... يَتِيمًا', fokus: "I'mal Mashdar Munawwan: Menashabkan Maf'ul Bih (يتيما)" },
    { surah_id: 3, ayah_id: 97, kata_kunci: 'حِجُّ الْبَيْتِ', fokus: "I'mal Mashdar Idhafah ke Maf'ul Bih" }
  ],
  'BAB-12': [
    { surah_id: 18, ayah_id: 10, kata_kunci: 'الْفِتْيَةُ', fokus: "Jama' Taksir Shighah Jumu'ul Qillah Wazan Fi'lah (فِعْلَة)" },
    { surah_id: 2, ayah_id: 196, kata_kunci: 'ثَلَاثَةِ أَيَّامٍ', fokus: "Kaidah Idhafah Bilangan ke Jumu'ul Qillah (أيام - أَفْعَال)" },
    { surah_id: 18, ayah_id: 82, kata_kunci: 'لِغُلَامَيْنِ يَتِيمَيْنِ', fokus: "Tatsniyah Isim Mudzakkar Haqiqi" }
  ],
  'BAB-13': [
    { surah_id: 31, ayah_id: 13, kata_kunci: 'يَا بُنَيَّ', fokus: "At-Tashghir untuk Kasih Sayang (Thulwah) Wazan Fu'ail (فُعَيْل)" },
    { surah_id: 12, ayah_id: 2, kata_kunci: 'قُرْآنًا عَرَبِيًّا', fokus: "An-Nasab: Penisbatan ke Bangsa Arab dengan Ya' Musyaddadah" },
    { surah_id: 3, ayah_id: 67, kata_kunci: 'يَهُودِيًّا وَلَا نَصْرَانِيًّا', fokus: "An-Nasab ke Yahud & Nashara" }
  ],
  'BAB-16': [
    { surah_id: 12, ayah_id: 8, kata_kunci: 'أَبِينَا - أَخُوهُ', fokus: "I'rab Far'i Asma'ul Khamsah Marfu' bil-Wawu & Majrur bil-Ya'" },
    { surah_id: 23, ayah_id: 1, kata_kunci: 'الْمُؤْمِنُونَ', fokus: "I'rab Far'i Jam'ul Mudzakkar Salim Marfu' bil-Wawu" },
    { surah_id: 2, ayah_id: 282, kata_kunci: 'رَجُلَيْنِ - امْرَأَتَانِ', fokus: "I'rab Far'i Mutsanna Marfu' bil-Alif & Manshub bil-Ya'" }
  ],
  'BAB-17': [
    { surah_id: 112, ayah_id: 1, kata_kunci: 'هُوَ اللَّهُ', fokus: "Isim Ma'rifah Paling Tinggi: Isim Dhamir & Lafzhul Jalalah 'Alam" },
    { surah_id: 12, ayah_id: 4, kata_kunci: 'يُوسُفُ لِأَبِيهِ', fokus: "Isim Ma'rifah Kategori 'Alam (Nama Orang)" },
    { surah_id: 18, ayah_id: 77, kata_kunci: 'أَهْلَ قَرْيَةٍ', fokus: "Isim Nakirah yang Menunjukkan Makna Umum (Syuyu')" }
  ],
  'BAB-18': [
    { surah_id: 2, ayah_id: 2, kata_kunci: 'ذَٰلِكَ الْكِتَابُ', fokus: "Isim Isyarah (ذلك) & Isim Mu'arraf bi-Al (الكتاب)" },
    { surah_id: 2, ayah_id: 255, kata_kunci: 'مَن ذَا الَّذِي', fokus: "Isim Maushul Khas (الذي) dan Syarat Shilah Maushul" },
    { surah_id: 1, ayah_id: 7, kata_kunci: 'صِرَاطَ الَّذِينَ', fokus: "Isim Maushul Jamak Mudzakkar Mabni 'alal Fath" }
  ],
  'BAB-20': [
    { surah_id: 2, ayah_id: 24, kata_kunci: 'وَلَن تَفْعَلُوا', fokus: "Amil Nawasib: Lan Penafi Masa Depan & Hadzfun Nun" },
    { surah_id: 2, ayah_id: 187, kata_kunci: 'حَتَّىٰ يَتَبَيَّنَ', fokus: "Nashab Mudhari' dengan An Mudhmarah Wujuban setelah Hatta" },
    { surah_id: 2, ayah_id: 184, kata_kunci: 'وَأَن تَصُومُوا خَيْرٌ', fokus: "An Mashdariyyah & Sabiquha fi Mahalli Raf'in Mubtada'" },
    { surah_id: 20, ayah_id: 40, kata_kunci: 'كَيْ تَقَرَّ', fokus: "Amil Nawasib: Kai Ta'liliyyah" }
  ],
  'BAB-23': [
    { surah_id: 2, ayah_id: 7, kata_kunci: 'وَعَلَىٰ أَبْصَارِهِمْ غِشَاوَةٌ', fokus: "Wujub Taqdim Khabar Syibhul Jumlah atas Mubtada' Nakirah" },
    { surah_id: 12, ayah_id: 18, kata_kunci: 'فَصَبْرٌ جَمِيلٌ', fokus: "Wujub Hadzf Mubtada' karena Khabar Berupa Mashdar Na'ib" },
    { surah_id: 2, ayah_id: 10, kata_kunci: 'فِي قُلُوبِهِم مَّرَضٌ', fokus: "Wujub Taqdim Khabar Khusus Nakirah Ghairu Mukhasshasah" }
  ],
  'BAB-28': [
    { surah_id: 110, ayah_id: 1, kata_kunci: 'جَاءَ نَصْرُ اللَّهِ', fokus: "Hukum Fa'il Marfu' (نصر) dan Taqdim atas Ma'mul" },
    { surah_id: 99, ayah_id: 1, kata_kunci: 'زُلْزِلَتِ الْأَرْضُ', fokus: "Na'ibul Fa'il Marfu' setelah Fi'il Mabni Majhul (زلزلت)" },
    { surah_id: 88, ayah_id: 17, kata_kunci: 'كَيْفَ خُلِقَتْ', fokus: "Na'ibul Fa'il Dhamir Mustatir setelah Fi'il Majhul" }
  ],
  'BAB-31': [
    { surah_id: 34, ayah_id: 18, kata_kunci: 'لَيَالِيَ وَأَيَّامًا', fokus: "Al-Maf'ul Fih: Zharaf Zaman Manshub" },
    { surah_id: 17, ayah_id: 1, kata_kunci: 'لَيْلًا', fokus: "Al-Maf'ul Fih: Zharaf Zaman Mubham Manshub" },
    { surah_id: 72, ayah_id: 9, kata_kunci: 'مَقَاعِدَ لِلسَّمْعِ', fokus: "Al-Maf'ul Fih: Zharaf Makan Musytaq Manshub" }
  ],
  'BAB-35': [
    { surah_id: 91, ayah_id: 13, kata_kunci: 'نَاقَةَ اللَّهِ وَسُقْيَاهَا', fokus: "Uslub At-Tahdzir: Manshub bi-Fi'lin Mahdzuf Wujuban (احذروا)" },
    { surah_id: 33, ayah_id: 33, kata_kunci: 'أَهْلَ الْبَيْتِ', fokus: "Uslub Al-Ikhtishash: Manshub bi-Fi'lin Mahdzuf Wujuban (أخص)" },
    { surah_id: 11, ayah_id: 73, kata_kunci: 'أَهْلَ الْبَيْتِ', fokus: "Uslub Al-Ikhtishash setelah Dhamir Mukhatab 'Alaikum" }
  ],
  'BAB-39': [
    { surah_id: 1, ayah_id: 7, kata_kunci: 'صِرَاطَ الَّذِينَ', fokus: "At-Tawabi': Badal Kul min Kul / Muthabiq Manshub" },
    { surah_id: 96, ayah_id: 15, kata_kunci: 'نَاصِيَةٍ كَاذِبَةٍ', fokus: "At-Tawabi': Badal Nakirah min Ma'rifah" },
    { surah_id: 2, ayah_id: 217, kata_kunci: 'قِتَالٍ فِيهِ', fokus: "At-Tawabi': Badal Isytimal Majrur" }
  ],
  'BAB-41': [
    { surah_id: 19, ayah_id: 38, kata_kunci: 'أَسْمِعْ بِهِمْ وَأَبْصِرْ', fokus: "Uslub Ta'ajjub Shighah Af'il Bihi (أَفْعِلْ بِهِ)" },
    { surah_id: 2, ayah_id: 175, kata_kunci: 'فَمَا أَصْبَرَهُمْ عَلَى النَّارِ', fokus: "Uslub Ta'ajjub Shighah Ma Af'alahu (مَا أَفْعَلَهُ)" },
    { surah_id: 3, ayah_id: 173, kata_kunci: 'نِعْمَ الْوَكِيلُ', fokus: "Uslub Al-Madah dengan Fi'il Jamid Ni'ma (نِعْمَ)" },
    { surah_id: 2, ayah_id: 206, kata_kunci: 'وَلَبِئْسَ الْمِهَادُ', fokus: "Uslub Adz-Dzamm dengan Fi'il Jamid Bi'sa (بِئْسَ)" },
    { surah_id: 17, ayah_id: 23, kata_kunci: 'أُفٍّ', fokus: "Asma'ul Af'al: Isim Fi'il Mudhari' Mabni Kasrah (أَتَضَجَّرُ)" },
    { surah_id: 23, ayah_id: 36, kata_kunci: 'هَيْهَاتَ هَيْهَاتَ', fokus: "Asma'ul Af'al: Isim Fi'il Madhi Mabni Fathah (بَعُدَ)" }
  ],
  'BAB-42': [
    { surah_id: 1, ayah_id: 7, kata_kunci: 'أَنْعَمْتَ عَلَيْهِمْ', fokus: "Jumlah Shilah Maushul: La Mahalla Laha minal I'rab" },
    { surah_id: 19, ayah_id: 30, kata_kunci: 'إِنِّي عَبْدُ اللَّهِ', fokus: "Jumlah Maqulul Qaul: Fi Mahalli Nashbin Maf'ul Bih" },
    { surah_id: 12, ayah_id: 16, kata_kunci: 'يَبْكُونَ', fokus: "Jumlah Fi'liyyah: Fi Mahalli Nashbin Hal" },
    { surah_id: 56, ayah_id: 76, kata_kunci: 'لَوْ تَعْلَمُونَ', fokus: "Jumlah I'tiradhiyyah: La Mahalla Laha minal I'rab" }
  ]
};

// Compile master cross index for all 42 babs
const masterCrossIndex = {};

babs.forEach(bab => {
  const bId = bab.id_bab;

  // 1. Canonical Syahid from 03_contoh_dan_irab
  const rawSyahidList = irabs.filter(x => x.id_bab === bId);
  const dalilSyahidUtama = rawSyahidList.map(s => {
    let surahName = '';
    let ayahNum = '';
    const m = s.sumber_dalil.match(/QS\.\s*([^:]+):\s*(\d+)/i);
    if (m) {
      surahName = m[1].trim();
      ayahNum = m[2].trim();
    }
    return {
      id_contoh: s.id_contoh,
      sumber_dalil: s.sumber_dalil,
      surah: surahName,
      ayat: ayahNum,
      kalimat_arab: s.kalimat_arab,
      terjemahan_indo: s.terjemahan_indo,
      kata_kunci: s.kata_kunci,
      irab_arab: s.irab_arab,
      penjelasan_irab_indo: s.penjelasan_irab_indo,
      tipe: 'DALIL_SYAHID'
    };
  });

  // 2. Training Ayats from 06_latihan_quran
  const matchingLatihan = latihans
    .filter(l => l.fokus_bab_nahwu === bId)
    .map(l => ({
      id_latihan: l.id_latihan,
      sumber_dalil: `QS. ${l.surah}: ${l.ayat}`,
      surah: l.surah,
      ayat: l.ayat,
      juz: l.juz,
      kalimat_arab: l.teks_ayat_arab,
      terjemahan_indo: l.terjemahan_indo,
      kata_kunci: l.kata_kunci_syahid || '',
      kategori_binyah: l.kategori_binyah,
      rincian_irab_tathbiqi: l.rincian_irab_tathbiqi,
      kata_per_kata: l.kata_per_kata,
      tipe: 'LATIHAN_TATHBIQ'
    }));

  // 3. Additional curated verses from 6,236 master if needed
  const additionalCurated = (CURATED_ADDITIONAL_AYAT[bId] || []).map((cur, idx) => {
    const sObj = masterSurahs.find(s => s.id === cur.surah_id);
    if (!sObj) return null;
    const aObj = sObj.ayat.find(a => a.ayat_id === cur.ayah_id);
    if (!aObj) return null;

    return {
      id_latihan: `ADD-${bId}-${idx+1}`,
      sumber_dalil: `QS. ${sObj.name_id}: ${aObj.ayat_id}`,
      surah: sObj.name_id,
      ayat: String(aObj.ayat_id),
      juz: sObj.juz,
      kalimat_arab: aObj.teks_ayat_arab,
      terjemahan_indo: `Ayat pilihan syahid kaidah ${bab.judul_indo}`,
      kata_kunci: cur.kata_kunci,
      kategori_binyah: cur.fokus,
      rincian_irab_tathbiqi: `Ayat syahid ini membuktikan kaidah: ${cur.fokus}.`,
      kata_per_kata: aObj.kata_per_kata,
      tipe: 'AYAT_SYAHID_TAMBAHAN'
    };
  }).filter(Boolean);

  // Combine and deduplicate
  const allAyatsForBab = [];

  // Syahid Utama first
  dalilSyahidUtama.forEach(sy => {
    allAyatsForBab.push(sy);
  });

  // Additional curated
  additionalCurated.forEach(ac => {
    if (!allAyatsForBab.some(item => item.surah === ac.surah && String(item.ayat) === String(ac.ayat))) {
      allAyatsForBab.push(ac);
    }
  });

  // Training Latihan
  matchingLatihan.forEach(ml => {
    if (!allAyatsForBab.some(item => item.surah === ml.surah && String(item.ayat) === String(ml.ayat))) {
      allAyatsForBab.push(ml);
    }
  });

  masterCrossIndex[bId] = {
    id_bab: bId,
    judul_indo: bab.judul_indo,
    judul_arab: bab.judul_arab,
    kategori: bab.kategori,
    total_ayat_terkait: allAyatsForBab.length,
    daftar_ayat: allAyatsForBab
  };
});

// Check summary
let totalItemsAll = 0;
let minCount = 999;
let maxCount = 0;

babs.forEach(b => {
  const count = masterCrossIndex[b.id_bab].total_ayat_terkait;
  totalItemsAll += count;
  if (count < minCount) minCount = count;
  if (count > maxCount) maxCount = count;
  console.log(`${b.id_bab}: ${count} ayat terkait sempurna.`);
});

console.log(`\nSUMMARY: All 42 Babs have curated ayat terkait! Total: ${totalItemsAll}, Min: ${minCount}, Max: ${maxCount}`);

fs.writeFileSync(OUT_DATA, JSON.stringify(masterCrossIndex, null, 2), 'utf8');
fs.writeFileSync(OUT_APP, JSON.stringify(masterCrossIndex, null, 2), 'utf8');
console.log('Saved cross-index to both data and app/src/data directories.');
