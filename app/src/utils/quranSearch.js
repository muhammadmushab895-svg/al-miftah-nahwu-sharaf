/**
 * Utilitas normalisasi teks Arab Al-Qur'an (Uthmani & Imla'i), parsing referensi Surah:Ayat,
 * serta pencocokan kata kunci lintas 114 Surah / 6.236 Ayat.
 */

// Rentang tanda waqaf/tajwid non-huruf & tatweel (tanpa menghapus harakat utama sebelum analisis Uthmani)
const ARABIC_DIACRITICS_RE = /[\u0610-\u061A\u0640\u064B-\u065F\u0674\u06D6-\u06ED]/g;

/**
 * Mengonversi penanda ejaan Uthmani (small yeh ۦ di tengah kata, hamzah mengambang ـٔ,
 * hamzah kasrah ءِ, alif maqshurah + dagger alif + ta marbuthah ىٰة, dll.) ke bentuk Imla'i standar.
 */
function preprocessUthmaniToImlai(text) {
  if (!text) return '';
  return String(text)
    // 1. Small yeh (ۦ) di tengah kata atau setelah ى/ي berfungsi sebagai huruf ي ("إِبْرَٰهِۦم" -> "ابراهيم", "ٱلنَّبِيۦن" -> "النبيين")
    .replace(/\u06E6(?=[\u064B-\u065F\u0653]*[\u0621-\u064A])/g, 'ي')
    .replace(/([ىي][\u064B-\u065F\u0653]*)\u06E6/g, '$1ي')
    // 2. Combining hamza above (ـٔ) tanpa kursi: sesuaikan kursi berdasar harakat/konteks agar cocok dengan أ/ؤ/ئ
    .replace(/\u0640?\u0654(?=[\u064E\u0670]*\u0627|\u064E\u0670)/g, '')
    .replace(/\u0640?\u0654(?=\u064F)/g, 'و')
    .replace(/\u0640?\u0654(?=\u0650)/g, 'ي')
    .replace(/([ي][\u0652\u0653\u064E\u0650]?)\u0640?\u0654/g, '$1ي')
    .replace(/\u0640?\u0654/g, 'ا')
    // 3. Hamzah mandiri di tengah kata berharakat kasrah ("إِسْرَٰٓءِيلَ" -> "اسراييل", "طَآئِفَة") atau sebelum و ("مُسْتَهْزِءُونَ")
    .replace(/\u0621(?=\u0650|\u064E?\u0650|\u0653?\u0650)/g, 'ي')
    // 4. Penulisan Uthmani khusus: ىٰ sebelum ة ("ٱلتَّوْرَىٰةَ" -> "التوراة") & وٰ sebelum ا/ة ("ٱلرِّبَوٰا" -> "الربا", "ٱلصَّلَوٰةَ" -> "الصلاة")
    .replace(/ى[\u064B-\u065F]*\u0670(?=[\u064B-\u065F]*[ةه])/g, 'ا')
    .replace(/و[\u064B-\u065F]*\u0670(?=[\u064B-\u065F]*[ةه])/g, 'ا')
    .replace(/و[\u064B-\u065F]*\u0670\u0627(?![\u0621-\u064A])/g, 'ا');
}

/**
 * Menormalkan aksara Arab agar pencarian tetap cocok meski tanpa/dengan harakat,
 * perbedaan hamzah (أ إ آ ٱ / ءا), alif maqshurah (ى / ي), dan ta marbuthah (ة / ه).
 */
function foldArabicLetters(text, { collapseTaMarbutah = true } = {}) {
  if (!text) return '';
  let out = String(text)
    // Ubah "ءا" Uthmani (mis. بِٱلْءَاخِرَةِ / ءَامَنُوا) menjadi alif tunggal
    .replace(/\u0621\u0627/g, 'ا')
    // Samakan variasi Alif & Hamzah di atas Alif/Waw/Ya
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/[ئى]/g, 'ي')
    .replace(/ء/g, '');

  if (collapseTaMarbutah) {
    out = out.replace(/ة/g, 'ه');
  }

  return out
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mengembalikan bentuk Arab Imla'i bersih (menghapus harakat dan mengonversi dagger alif \u0670).
 * Contoh: "ٱلْعَٰلَمِينَ" -> "العالمين", "ٱلصَّلَوٰةَ" -> "الصلاه", "إِبْرَٰهِۦمَ" -> "ابراهيم".
 */
export function normalizeArabic(text, options = {}) {
  if (!text) return '';
  const pre = preprocessUthmaniToImlai(text);
  const strippedNoDagger = pre.replace(ARABIC_DIACRITICS_RE, '');
  const imlaiExpanded = strippedNoDagger
    // Alif maqshurah + dagger alif tetap dibaca/ditulis sebagai alif maqshurah/ya (علىٰ, موسىٰ)
    .replace(/ى\u0670/g, 'ى')
    // Dagger alif di tengah kata diganti alif agar cocok dengan ketikan Imla'i (عٰلمين -> عالمين, مٰلك -> مالك)
    .replace(/([بتثجحخدذرزسشصضطظعغفقكلمنهوي])\u0670/g, '$1ا')
    .replace(/\u0670/g, '');

  return foldArabicLetters(imlaiExpanded, options);
}

/**
 * Mengembalikan varian Arab dengan dagger alif (\u0670) dihapus total tanpa menambah huruf alif.
 * Berguna untuk kata seperti "ٱلرَّحْمَٰنِ" -> "الرحمن", "إِلَٰهَ" -> "اله", "ذَٰلِكَ" -> "ذلك".
 */
export function normalizeArabicCompact(text, options = {}) {
  if (!text) return '';
  const pre = preprocessUthmaniToImlai(text);
  const stripped = pre
    .replace(ARABIC_DIACRITICS_RE, '')
    .replace(/\u0670/g, '');
  return foldArabicLetters(stripped, options);
}

/**
 * Membangun string pencarian gabungan (varian Imla'i + varian Uthmani ringkas + variasi وۥ/لِلْـ/ياَٰ)
 * agar pencarian tetap cocok untuk beragam cara pengetikan kata Al-Qur'an.
 */
export function buildArabicSearchVariants(text) {
  const expanded = normalizeArabic(text);
  const compact = normalizeArabicCompact(text);
  if (!expanded) return '';

  const wordSet = new Set(expanded.split(/\s+/).filter(Boolean));
  const extraTokens = [];
  const addExtra = (tok) => {
    if (tok && !wordSet.has(tok)) {
      wordSet.add(tok);
      extraTokens.push(tok);
    }
  };

  if (compact && compact !== expanded) {
    for (const w of compact.split(/\s+/)) addExtra(w);
  }

  // Varian per-kata dari teks Uthmani mentah
  for (const rawWord of String(text || '').split(/\s+/)) {
    if (!rawWord) continue;
    // 1. Kata nida' bersambung Uthmani: "يَٰٓأَيُّهَا" / "يَٰمُوسَىٰ" / "يَٰبَنِىٓ" -> tambahkan versi terpisah ("يا ايها", "يا موسي", "يا بني")
    if (/^ي[\u064E]?\u0670/.test(rawWord)) {
      const normW = normalizeArabic(rawWord);
      if (normW.startsWith('يا') && normW.length > 3) {
        addExtra('يا');
        addExtra(normW.slice(2));
      }
    }
    // 2. Small waw internal ("دَاوُۥدَ" -> juga cocok dengan "داوود", "يَسْتَوُۥن" -> "يستوون")
    if (/و[\u064B-\u065F]*\u06E5[\u064B-\u065F\u0653]*[\u0621-\u064A]/.test(rawWord)) {
      const doubledWaw = normalizeArabic(
        rawWord.replace(/(و[\u064B-\u065F]*)\u06E5/g, '$1و')
      );
      addExtra(doubledWaw);
    }
    // 3. Hamzah sebelum waw ("مُسْتَهْزِءُونَ" -> juga cocok "مستهزيون"/"مستهزوون")
    if (/\u0621[\u064B-\u065F]*و/.test(rawWord)) {
      addExtra(normalizeArabic(rawWord.replace(/\u0621(?=[\u064B-\u065F]*و)/g, 'ي')));
      addExtra(normalizeArabic(rawWord.replace(/\u0621(?=[\u064B-\u065F]*و)/g, 'و')));
    }
    // 4. Prefiks "لِلْـ" yg menggugurkan alif "الـ" ("لِّلْمُتَّقِينَ" -> "المتقين", "لِلنَّاسِ" -> "الناس")
    if (/^\u0644[\u0650\u0651]*\u0644/.test(rawWord)) {
      const normW = normalizeArabic(rawWord);
      if (normW.startsWith('لل') && normW.length >= 5) {
        addExtra(`ال${normW.slice(2)}`);
      }
    }
  }

  return extraTokens.length > 0 ? `${expanded} ${extraTokens.join(' ')}` : expanded;
}

/**
 * Cek apakah query mengandung karakter huruf Arab.
 */
export function hasArabicChars(text) {
  return /[\u0600-\u06FF]/.test(String(text || ''));
}

/**
 * Menormalkan teks Latin (menghilangkan apostrof tanpa memutus kata & tanda baca menjadi spasi).
 */
export function normalizeLatin(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’`]/g, '')
    .replace(/[\-_.,:;!?()"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mengubah huruf Arab Uthmani (dengan harakat) menjadi transliterasi fonetik Latin bervokal
 * agar user dapat mencari ayat populer dengan keyboard Latin (mis. "alhamdulillah", "qul huwallahu", "bismi").
 */
export function transliterateArabicPhonetic(text) {
  if (!text) return '';
  const consMap = {
    'ا': '', 'أ': 'a', 'إ': 'i', 'آ': 'a', 'ٱ': 'a', 'ء': '',
    'ب': 'b', 'ت': 't', 'ث': 'ts', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'dz', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sy', 'ص': 'sh',
    'ض': 'dh', 'ط': 'th', 'ظ': 'zh', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
    'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'ة': 'h', 'و': 'w',
    'ي': 'y', 'ى': 'a', 'ؤ': 'u', 'ئ': 'i'
  };
  const vowelMap = {
    '\u064E': 'a',  // Fatha
    '\u0650': 'i',  // Kasra
    '\u064F': 'u',  // Damma
    '\u0670': 'a',  // Dagger Alif
    '\u064B': 'an', // Fathatan
    '\u064D': 'in', // Kasratan
    '\u064C': 'un'  // Dammatan
  };

  let out = '';
  let lastCons = '';
  const str = String(text);
  const isArabicVowelOrSign = (c) => /[\u064B-\u065F\u0670]/.test(c || '');

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const nextCh = str[i + 1] || '';
    if (ch === ' ') {
      out += ' ';
      lastCons = '';
    } else if (Object.prototype.hasOwnProperty.call(consMap, ch)) {
      const mapped = consMap[ch];
      // Alif / madd pemanjang vokal
      if (ch === 'ا' && lastCons) {
        if (!out.endsWith('a')) out += 'a';
      } else if (ch === 'ى') {
        if (out.endsWith('i') || lastCons === 'f' || lastCons === 'dz' || lastCons === 'l') {
          if (!out.endsWith('i')) out += 'i';
        } else if (!out.endsWith('a')) {
          out += 'a';
        }
      } else if (ch === 'ي' && out.endsWith('i') && (!nextCh || nextCh === ' ' || !isArabicVowelOrSign(nextCh))) {
        // Ya sukun/madd setelah kasrah ("الرَّحِيمِ", "العالمين") tidak menambah 'y'
      } else if (ch === 'و' && out.endsWith('u') && (!nextCh || nextCh === ' ' || !isArabicVowelOrSign(nextCh))) {
        // Waw sukun/madd setelah dhammah ("يُؤْمِنُونَ", "الْقَيُّومُ") tidak menambah 'w'
      } else {
        out += mapped;
      }
      lastCons = mapped;
    } else if (ch === '\u0651') {
      // Syaddah menggandakan konsonan terakhir (hindari tiga huruf sama berturut-turut)
      if (lastCons && lastCons.length === 1 && !out.endsWith(lastCons + lastCons)) {
        out += lastCons;
      }
    } else if (vowelMap[ch]) {
      if (!(lastCons === 'a' && vowelMap[ch] === 'a')) {
        out += vowelMap[ch];
      }
    }
  }

  return out
    .replace(/al([tdszrnsl])\1/g, 'a$1$1')
    .replace(/(.)\1{2,}/g, '$1$1')
    .replace(/aa+/g, 'a')
    .replace(/ii+/g, 'i')
    .replace(/uu+/g, 'u')
    .replace(/\bau\b|\bfia\b/g, (m) => (m === 'fia' ? 'fi' : m))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Mengompakkan transliterasi Latin agar variasi Alif Wasl ("bismi allahi" -> "bismillahi",
 * "huwa allahu" -> "huwallahu") tetap cocok dengan pencarian pengguna.
 */
export function compactPhoneticLatin(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '')
    .replace(/([aiu])all/g, '$1ll');
}

// Alias nama surah populer di Indonesia -> Surah ID
const SURAH_ALIAS_TO_ID = {
  fatihah: 1, alfatihah: 1,
  baqarah: 2, albaqarah: 2, baqoroh: 2,
  imran: 3, aliimran: 3, alimran: 3,
  nisa: 4, annisa: 4,
  maidah: 5, almaidah: 5,
  anam: 6, alanam: 6,
  araf: 7, alaraf: 7,
  anfal: 8, alanfal: 8,
  taubah: 9, attaubah: 9, tawbah: 9,
  yunus: 10,
  hud: 11,
  yusuf: 12,
  rad: 13, arrad: 13,
  ibrahim: 14,
  hijr: 15, alhijr: 15,
  nahl: 16, annahl: 16,
  isra: 17, alisra: 17, baniisrail: 17,
  kahf: 18, kahfi: 18, alkahf: 18, alkahfi: 18,
  maryam: 19,
  thaha: 20, taha: 20, toha: 20,
  anbiya: 21, alanbiya: 21,
  hajj: 22, alhajj: 22, haji: 22,
  muminun: 23, almuminun: 23, mukminun: 23,
  nur: 24, annur: 24,
  furqan: 25, alfurqan: 25,
  syuara: 26, asysyuara: 26,
  naml: 27, annaml: 27,
  qashash: 28, alqashash: 28, qasas: 28,
  ankabut: 29, alankabut: 29,
  rum: 30, arrum: 30,
  luqman: 31, lukman: 31,
  sajdah: 32, assajdah: 32,
  ahzab: 33, alahzab: 33,
  saba: 34,
  fathir: 35, fatir: 35,
  yasin: 36, yaasin: 36,
  shaffat: 37, ashshaffat: 37, saffat: 37,
  shad: 38, sad: 38,
  zumar: 39, azzumar: 39,
  ghafir: 40, almumin: 40, mukmin: 40,
  fushshilat: 41, fussilat: 41,
  syura: 42, asysyura: 42,
  zukhruf: 43, azzukhruf: 43,
  dukhan: 44, addukhan: 44,
  jatsiyah: 45, aljatsiyah: 45, jasiyah: 45,
  ahqaf: 46, alahqaf: 46,
  muhammad: 47,
  fath: 48, alfath: 48,
  hujurat: 49, alhujurat: 49,
  qaf: 50,
  dzariyat: 51, adzdzariyat: 51, zariyat: 51,
  thur: 52, aththur: 52, tur: 52,
  najm: 53, annajm: 53,
  qamar: 54, alqamar: 54, komar: 54,
  rahman: 55, arrahman: 55,
  waqiah: 56, alwaqiah: 56,
  hadid: 57, alhadid: 57,
  mujadilah: 58, almujadilah: 58, mujadalah: 58,
  hasyr: 59, alhasyr: 59,
  mumtahanah: 60, almumtahanah: 60,
  shaff: 61, ashshaff: 61, saf: 61,
  jumuah: 62, aljumuah: 62, jumat: 62,
  munafiqun: 63, almunafiqun: 63,
  taghabun: 64, attaghabun: 64,
  thalaq: 65, aththalaq: 65, talaq: 65, talak: 65,
  tahrim: 66, attahrim: 66,
  mulk: 67, almulk: 67,
  qalam: 68, alqalam: 68,
  haqqah: 69, alhaqqah: 69,
  maarij: 70, almaarij: 70,
  nuh: 71,
  jin: 72, aljin: 72, jinn: 72,
  muzzammil: 73, almuzzammil: 73, muzammil: 73,
  muddatstsir: 74, almuddatstsir: 74, mudassir: 74,
  qiyamah: 75, alqiyamah: 75, kiamat: 75,
  insan: 76, alinsan: 76, dahr: 76, addahr: 76,
  mursalat: 77, almursalat: 77,
  naba: 78, annaba: 78, amma: 78,
  naziat: 79, annaziat: 79,
  abasa: 80,
  takwir: 81, attakwir: 81,
  infithar: 82, alinfithar: 82, infitar: 82,
  muthaffifin: 83, almuthaffifin: 83, mutaffifin: 83,
  insyiqaq: 84, alinsyiqaq: 84,
  buruj: 85, alburuj: 85,
  thariq: 86, aththariq: 86, tariq: 86,
  ala: 87, alala: 87,
  ghasyiyah: 88, alghasyiyah: 88,
  fajr: 89, alfajr: 89,
  balad: 90, albalad: 90,
  syams: 91, asysyams: 91,
  lail: 92, allail: 92,
  dhuha: 93, adhdhuha: 93, duha: 93,
  syarh: 94, asysyarh: 94, insyirah: 94, alinsyirah: 94, alamnasyrah: 94,
  tin: 95, attin: 95,
  alaq: 96, alalaq: 96, iqra: 96,
  qadr: 97, alqadr: 97, qadar: 97,
  bayyinah: 98, albayyinah: 98,
  zalzalah: 99, azzalzalah: 99, zilzal: 99,
  adiyat: 100, aladiyat: 100,
  qariah: 101, alqariah: 101,
  takatsur: 102, attakatsur: 102,
  ashr: 103, alashr: 103, asr: 103, alasr: 103,
  humazah: 104, alhumazah: 104,
  fil: 105, alfil: 105,
  quraisy: 106, quraysh: 106,
  maun: 107, almaun: 107,
  kautsar: 108, alkautsar: 108, kausar: 108,
  kafirun: 109, alkafirun: 109,
  nashr: 110, annashr: 110, nasr: 110,
  lahab: 111, allahab: 111, masad: 111, almasad: 111,
  ikhlas: 112, alikhlas: 112,
  falaq: 113, alfalaq: 113,
  nas: 114, annas: 114
};

// Kata kunci populer yang sering diketik langsung oleh pengguna Indonesia
export const POPULAR_VERSE_SHORTCUTS = [
  { keywords: ['ayat kursi', 'ayatul kursi', 'kursi'], surahId: 2, ayah: 255, label: 'Ayat Kursi (QS. Al-Baqarah: 255)' },
  { keywords: ['amanarrasul', 'amana rasul', 'amanna rasul'], surahId: 2, ayah: 285, label: 'Amanar-Rasul (QS. Al-Baqarah: 285)' },
  { keywords: ['la yukallifullah', 'la yukallifu', 'batas kemampuan'], surahId: 2, ayah: 286, label: 'La Yukallifullahu Nafsan (QS. Al-Baqarah: 286)' },
  { keywords: ['doa sapu jagat', 'rabbana atina fid dunya'], surahId: 2, ayah: 201, label: 'Doa Sapu Jagat (QS. Al-Baqarah: 201)' },
  { keywords: ['inna lillahi', 'innalillahi'], surahId: 2, ayah: 156, label: 'Kalimat Istirja (QS. Al-Baqarah: 156)' },
  { keywords: ['ayat puasa', 'kutiba alaikumus shiyam'], surahId: 2, ayah: 183, label: 'Perintah Puasa (QS. Al-Baqarah: 183)' },
  { keywords: ['hasbunallah', 'hasbunallahu'], surahId: 3, ayah: 173, label: 'Hasbunallahu wa Ni\'mal Wakil (QS. Ali \'Imran: 173)' },
  { keywords: ['la tahzan', 'jangan bersedih'], surahId: 9, ayah: 40, label: 'La Tahzan Innallaha Ma\'ana (QS. At-Taubah: 40)' },
  { keywords: ['kun fayakun'], surahId: 36, ayah: 82, label: 'Kun Fayakun (QS. Yasin: 82)' },
  { keywords: ['ayat seribu dinar', '1000 dinar', 'seribu dinar'], surahId: 65, ayah: 2, label: 'Ayat Seribu Dinar (QS. At-Thalaq: 2-3)' },
  { keywords: ['fabiayyi alai', 'fabiayyi', 'nikmat tuhanmu yang manakah'], surahId: 55, ayah: 13, label: 'Fabi-ayyi Ala-i Rabbikuma (QS. Ar-Rahman: 13)' },
  { keywords: ['qul huwallahu', 'qulhu', 'qul huwallah'], surahId: 112, ayah: 1, label: 'Qul Huwallahu Ahad (QS. Al-Ikhlas: 1)' },
  { keywords: ['alhamdulillah', 'segala puji'], surahId: 1, ayah: 2, label: 'Alhamdulillahi Rabbil \'Alamin (QS. Al-Fatihah: 2)' },
  { keywords: ['bismillah', 'basmalah'], surahId: 1, ayah: 1, label: 'Basmalah (QS. Al-Fatihah: 1)' },
  { keywords: ['alam nasyrah', 'in syirah', 'bersama kesulitan ada kemudahan', 'inna ma al usri yusra'], surahId: 94, ayah: 5, label: 'Fa inna ma\'al \'usri yusra (QS. Asy-Syarh: 5-6)' },
  { keywords: ['iqra', 'bacalah'], surahId: 96, ayah: 1, label: 'Iqra\' Bismi Rabbika (QS. Al-\'Alaq: 1)' },
  { keywords: ['wal asr', 'demi masa'], surahId: 103, ayah: 1, label: 'Wal-\'Ashr (QS. Al-\'Ashr: 1)' }
];

function stripSurahPrefix(compactKey) {
  return compactKey
    .replace(/^(qs|surah|surat)/, '')
    .replace(/^(ash|asy|adz|ath|al|an|ar|as|at|az)/, '');
}

/**
 * Mencocokkan potongan nama surah (Latin maupun Arab) dengan ID Surah 1..114.
 */
export function resolveSurahMatches(nameQuery, surahList = []) {
  if (!nameQuery) return [];

  if (hasArabicChars(nameQuery)) {
    const arClean = normalizeArabic(nameQuery).replace(/^(?:سوره|سورة)\s+/, '').trim();
    if (!arClean) return [];
    const exactAr = [];
    const partialAr = [];
    for (const s of surahList) {
      const sAr = normalizeArabic(s.name_ar);
      const sArBare = sAr.replace(/^ال/, '');
      const qBare = arClean.replace(/^ال/, '');
      if (sAr === arClean || sArBare === qBare) exactAr.push(s);
      else if (arClean.length >= 2 && (sAr.includes(arClean) || sArBare.includes(qBare))) partialAr.push(s);
    }
    return [...exactAr, ...partialAr];
  }

  const clean = normalizeLatin(nameQuery).replace(/\s+/g, '');
  if (!clean) return [];

  const exactMatches = [];
  const prefixMatches = [];
  const partialMatches = [];

  const aliasId = SURAH_ALIAS_TO_ID[clean] || SURAH_ALIAS_TO_ID[stripSurahPrefix(clean)];

  for (const s of surahList) {
    const sKey = normalizeLatin(s.name_id).replace(/\s+/g, '');
    const sNoPrefix = stripSurahPrefix(sKey);
    const qNoPrefix = stripSurahPrefix(clean);

    if (s.id === aliasId || sKey === clean || (qNoPrefix && sNoPrefix === qNoPrefix)) {
      exactMatches.push(s);
    } else if (sKey.startsWith(clean) || (qNoPrefix && sNoPrefix.startsWith(qNoPrefix))) {
      prefixMatches.push(s);
    } else if (clean.length >= 3 && (sKey.includes(clean) || sNoPrefix.includes(qNoPrefix))) {
      partialMatches.push(s);
    }
  }

  return [...exactMatches, ...prefixMatches, ...partialMatches];
}

/**
 * Mengurai input pencarian menjadi target lompatan langsung Surah & Ayat bila cocok.
 * Mendukung format:
 * - "2:255", "2/255", "2 255", "qs 18:10"
 * - "baqarah 255", "al-baqarah:255", "kahfi 10", "yasin 58", "البقرة 255"
 * - Nama surah saja ("al kahfi", "ar rahman", "سورة الكهف") -> ayah: 1
 */
export function parseSurahAyahQuery(rawQuery, surahList = []) {
  const trimmed = String(rawQuery || '').trim();
  if (!trimmed || !surahList.length) return [];

  const results = [];
  const seen = new Set();
  const pushTarget = (surah, ayah = 1, kind = 'ref') => {
    if (!surah) return;
    const validAyah = Math.max(1, Math.min(Number(ayah) || 1, surah.ayat_count || 999));
    const key = `${surah.id}:${validAyah}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({
      surahId: surah.id,
      surahName: surah.name_id,
      surahArab: surah.name_ar,
      juz: surah.juz,
      ayatCount: surah.ayat_count,
      ayah: validAyah,
      kind
    });
  };

  // 1. Pola Numerik "Surah:Ayat" atau "qs 2 255"
  const numRef = trimmed.match(/^(?:qs\.?|surah|surat)?\s*(\d{1,3})\s*[:/\-.\s]\s*(\d{1,3})$/i);
  if (numRef) {
    const sId = parseInt(numRef[1], 10);
    const aId = parseInt(numRef[2], 10);
    const surah = surahList.find((s) => s.id === sId);
    if (surah) {
      pushTarget(surah, aId, 'exact_ref');
      return results;
    }
  }

  // 2. Pola "Nama Surah (Latin/Arab) + Nomor Ayat" (mis. "baqarah 255", "kahfi 10", "البقرة 255")
  const nameNum = trimmed.match(/^(?:qs\.?|surah|surat|سورة|سوره)?\s*(.+?)\s*[:/\-.\s]+\s*(\d{1,3})$/i);
  if (nameNum && !/^\d+$/.test(nameNum[1].trim())) {
    const surahPart = nameNum[1].trim();
    const aId = parseInt(nameNum[2], 10);
    const matches = resolveSurahMatches(surahPart, surahList);
    for (const s of matches.slice(0, 4)) {
      pushTarget(s, aId, 'name_ref');
    }
    if (results.length > 0) return results;
  }

  // 3. Hanya Nama Surah (Latin maupun Arab seperti "سورة الكهف")
  if (!/^\d+$/.test(trimmed)) {
    const strippedQuery = trimmed.replace(/^(?:qs\.?|surah|surat|سورة|سوره)\s+/i, '');
    if (hasArabicChars(trimmed)) {
      const explicitSurahPrefix = /^(?:سورة|سوره)\s+/.test(trimmed);
      const matches = resolveSurahMatches(strippedQuery, surahList);
      if (explicitSurahPrefix || matches.some((s) => normalizeArabic(s.name_ar) === normalizeArabic(strippedQuery))) {
        for (const s of matches.slice(0, 3)) {
          pushTarget(s, 1, 'surah_only');
        }
      }
    } else {
      const matches = resolveSurahMatches(strippedQuery, surahList);
      for (const s of matches.slice(0, 3)) {
        pushTarget(s, 1, 'surah_only');
      }
    }
  }

  return results;
}

// Kelompok sinonim ejaan Indonesia populer <-> terjemahan Kemenag
const INDONESIAN_TOKEN_SYNONYMS = [
  ['salat', 'shalat', 'sholat', 'sembahyang'],
  ['takwa', 'taqwa'],
  ['zikir', 'dzikir'],
  ['rezeki', 'rizki', 'rizqi', 'rejeki'],
  ['syaitan', 'setan', 'syaithan', 'syetan'],
  ['mukmin', 'mumin'],
  ['nikmat', 'nimat'],
  ['quran', 'alquran'],
  ['surga', 'jannah', 'syurga'],
  ['neraka', 'jahannam', 'jahanam'],
  ['kakbah', 'kabah'],
  ['doa', 'berdoa']
];

const SYNONYM_LOOKUP = new Map();
for (const group of INDONESIAN_TOKEN_SYNONYMS) {
  for (const term of group) {
    SYNONYM_LOOKUP.set(term, group);
  }
}

/**
 * Mencocokkan query pengguna terhadap entry indeks Al-Qur'an global.
 * Entry format: { s, a, t, q, id, tr, idNorm, trCompact, surahName, nNorm }
 */
export function matchQuranIndexEntry(entry, parsedQuery) {
  const { isArabic, tokensArabic, tokensArabicAlt, tokensLatin, compactLatin } = parsedQuery;

  if (isArabic) {
    const haystackAr = entry.q || '';
    if (tokensArabic.length === 0) return false;
    const matchPrimary = tokensArabic.every((tok) => haystackAr.includes(tok));
    if (matchPrimary) return true;
    return tokensArabicAlt.length > 0 && tokensArabicAlt.every((tok) => haystackAr.includes(tok));
  }

  if (tokensLatin.length === 0) return false;

  const idText = entry.idNorm || '';
  const trText = entry.tr || '';
  const surahText = entry.nNorm || '';

  if (compactLatin.length >= 4 && entry.trCompact && entry.trCompact.includes(compactLatin)) {
    return true;
  }

  const combined = `${idText} ${trText} ${surahText}`;
  return tokensLatin.every((tok) => {
    if (combined.includes(tok)) return true;
    const syns = SYNONYM_LOOKUP.get(tok);
    return Boolean(syns && syns.some((alt) => combined.includes(alt)));
  });
}

/**
 * Mengurai query pencarian umum menjadi token Arab dan token Latin yang siap dipakai filter.
 */
export function prepareSearchQuery(rawQuery) {
  const trimmed = String(rawQuery || '').trim();
  const isArabic = hasArabicChars(trimmed);

  if (isArabic) {
    const normPrimary = normalizeArabic(trimmed);
    const normCompact = normalizeArabicCompact(trimmed);
    const tokensPrimary = normPrimary.split(/\s+/).filter(Boolean);
    const tokensCompact = normCompact.split(/\s+/).filter(Boolean);
    return {
      trimmed,
      isArabic: true,
      arabicPrimary: normPrimary,
      arabicCompact: normCompact,
      tokensArabic: tokensPrimary,
      tokensArabicAlt: tokensCompact,
      latin: '',
      tokensLatin: [],
      compactLatin: ''
    };
  }

  const latin = normalizeLatin(trimmed);
  const tokensLatin = latin.split(/\s+/).filter(Boolean);
  return {
    trimmed,
    isArabic: false,
    arabicPrimary: '',
    arabicCompact: '',
    tokensArabic: [],
    tokensArabicAlt: [],
    latin,
    tokensLatin,
    compactLatin: compactPhoneticLatin(latin)
  };
}

let cachedIndexPromise = null;
let cachedHydratedIndex = null;

/**
 * Mengambil dan menghidrasi indeks 6.236 ayat Al-Qur'an sekali saja lalu di-cache di memori.
 */
export async function loadGlobalQuranIndex(surahList = []) {
  if (cachedHydratedIndex) {
    if (surahList.length > 0 && !cachedHydratedIndex[0]?.surahName) {
      hydrateSurahMeta(cachedHydratedIndex, surahList);
    }
    return cachedHydratedIndex;
  }

  if (!cachedIndexPromise) {
    cachedIndexPromise = fetch('/data/quran/quran_search_index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((raw) => {
        const surahMap = new Map(surahList.map((s) => [s.id, s]));
        const hydrated = raw.map((item) => {
          const meta = surahMap.get(item.s);
          return {
            ...item,
            idNorm: normalizeLatin(item.id),
            trCompact: compactPhoneticLatin(item.tr),
            surahName: meta?.name_id || `Surah ${item.s}`,
            surahArab: meta?.name_ar || '',
            juz: meta?.juz || '',
            nNorm: normalizeLatin(meta?.name_id || '')
          };
        });
        cachedHydratedIndex = hydrated;
        return hydrated;
      })
      .catch((err) => {
        cachedIndexPromise = null;
        throw err;
      });
  }

  const data = await cachedIndexPromise;
  if (surahList.length > 0 && !data[0]?.surahArab) {
    hydrateSurahMeta(data, surahList);
  }
  return data;
}

function hydrateSurahMeta(entries, surahList) {
  const surahMap = new Map(surahList.map((s) => [s.id, s]));
  for (const item of entries) {
    const meta = surahMap.get(item.s);
    if (meta) {
      item.surahName = meta.name_id;
      item.surahArab = meta.name_ar;
      item.juz = meta.juz;
      item.nNorm = normalizeLatin(meta.name_id);
    }
  }
}

/**
 * Pencarian & perankingan ayat Al-Qur'an lintas 114 Surah / 6.236 Ayat.
 * Menggabungkan shortcut populer, parsing referensi Surah:Ayat ("2:255", "baqarah 255"),
 * dan pencarian kata kunci Arab (tanpa harakat) maupun terjemahan/transliterasi Indonesia.
 */
export function searchGlobalQuran(index, rawQuery, surahList = [], limit = 30) {
  const trimmed = String(rawQuery || '').trim();
  if (!trimmed) return { directRefs: [], matches: [], totalMatches: 0 };

  const parsed = prepareSearchQuery(trimmed);
  const entryMap = new Map();
  if (Array.isArray(index)) {
    for (const item of index) {
      entryMap.set(`${item.s}:${item.a}`, item);
    }
  }

  // 1. Cek shortcut istilah populer ("ayat kursi", "seribu dinar", "kun fayakun", dll.)
  const directRefs = [];
  const seenKeys = new Set();

  if (!parsed.isArabic && parsed.latin.length >= 3) {
    for (const sc of POPULAR_VERSE_SHORTCUTS) {
      const hit = sc.keywords.some(
        (kw) => parsed.latin.includes(kw) || (parsed.latin.length >= 5 && kw.includes(parsed.latin))
      );
      if (hit) {
        const key = `${sc.surahId}:${sc.ayah}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          const idxItem = entryMap.get(key);
          const meta = surahList.find((s) => s.id === sc.surahId);
          directRefs.push({
            s: sc.surahId,
            a: sc.ayah,
            surahName: meta?.name_id || idxItem?.surahName || `Surah ${sc.surahId}`,
            surahArab: meta?.name_ar || idxItem?.surahArab || '',
            juz: meta?.juz || idxItem?.juz || '',
            t: idxItem?.t || '',
            id: idxItem?.id || '',
            badge: sc.label,
            kind: 'shortcut'
          });
        }
      }
    }
  }

  // 2. Cek referensi eksplisit Surah:Ayat ("2:255", "baqarah 255", "kahfi 10")
  const parsedRefs = parseSurahAyahQuery(trimmed, surahList);
  for (const ref of parsedRefs) {
    const key = `${ref.surahId}:${ref.ayah}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      const idxItem = entryMap.get(key);
      directRefs.push({
        s: ref.surahId,
        a: ref.ayah,
        surahName: ref.surahName,
        surahArab: ref.surahArab,
        juz: ref.juz,
        t: idxItem?.t || '',
        id: idxItem?.id || '',
        badge: ref.kind === 'surah_only' ? `Buka Surah ${ref.surahName}` : `Lompat ke QS. ${ref.surahName}: ${ref.ayah}`,
        kind: ref.kind
      });
    }
  }

  // 3. Pencarian kata kunci di 6.236 ayat (minimal 2 karakter agar hasil relevan & cepat)
  if (!Array.isArray(index) || index.length === 0 || (trimmed.length < 2 && !/^\d+$/.test(trimmed))) {
    return { directRefs, matches: [], totalMatches: 0 };
  }

  // Jika input angka murni di kotak pencarian global tanpa ":", jangan banjiri ribuan nomor ayat acak
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    const numMatches = [];
    // Tawarkan lompatan ke Surah nomor tersebut (1..114) atau ayat ke-N
    const surahMeta = surahList.find((s) => s.id === num);
    if (surahMeta && !seenKeys.has(`${surahMeta.id}:1`)) {
      seenKeys.add(`${surahMeta.id}:1`);
      const idxItem = entryMap.get(`${surahMeta.id}:1`);
      directRefs.unshift({
        s: surahMeta.id,
        a: 1,
        surahName: surahMeta.name_id,
        surahArab: surahMeta.name_ar,
        juz: surahMeta.juz,
        t: idxItem?.t || '',
        id: idxItem?.id || '',
        badge: `Surah ke-${surahMeta.id}: ${surahMeta.name_id} (${surahMeta.ayat_count} Ayat)`,
        kind: 'surah_num'
      });
    }
    for (const item of index) {
      if (item.a === num && !seenKeys.has(`${item.s}:${item.a}`)) {
        numMatches.push(item);
      }
    }
    return {
      directRefs,
      matches: numMatches.slice(0, limit),
      totalMatches: numMatches.length
    };
  }

  const scored = [];
  for (const item of index) {
    const key = `${item.s}:${item.a}`;
    if (seenKeys.has(key)) continue;
    if (!matchQuranIndexEntry(item, parsed)) continue;

    let score = 1;
    if (parsed.isArabic) {
      const qExpanded = parsed.arabicPrimary;
      const qVocative = item.q.replace(/(^|\s)يا(?=[ا-ي]{2,})/g, '$1يا ');
      if (qExpanded && (item.q.includes(qExpanded) || qVocative.includes(qExpanded))) {
        score += 12;
      } else if (parsed.arabicCompact && normalizeArabicCompact(item.t).includes(parsed.arabicCompact)) {
        score += 11;
      }
      // Bonus lebih tinggi untuk ayat yang diawali frasa pencarian
      if (
        (qExpanded && (item.q.startsWith(qExpanded) || qVocative.startsWith(qExpanded))) ||
        (parsed.arabicCompact && normalizeArabicCompact(item.t).startsWith(parsed.arabicCompact))
      ) {
        score += 4;
      }
    } else {
      const syns = parsed.tokensLatin.length === 1 ? SYNONYM_LOOKUP.get(parsed.tokensLatin[0]) : null;
      if (parsed.latin && (item.idNorm.includes(parsed.latin) || (syns && syns.some((alt) => item.idNorm.includes(alt))))) {
        score += 10;
      } else if (parsed.compactLatin && item.trCompact.includes(parsed.compactLatin)) {
        score += 8;
      }
      // Bonus kecocokan batas kata di terjemahan
      if (parsed.latin.length >= 3 && new RegExp(`\\b${parsed.latin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(item.idNorm)) {
        score += 4;
      }
    }
    scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score || a.item.s - b.item.s || a.item.a - b.item.a);
  return {
    directRefs,
    matches: scored.slice(0, limit).map((x) => x.item),
    totalMatches: scored.length
  };
}

/**
 * Mencocokkan query pada teks Arab atau atribut Nahwu/Sharaf suatu ayat (untuk filter di dalam Surah & Latihan).
 */
export function matchArabicText(targetText, parsedQuery) {
  if (!targetText || !parsedQuery?.isArabic) return false;
  const hay = buildArabicSearchVariants(targetText);
  const matchPrimary = parsedQuery.tokensArabic.every((t) => hay.includes(t));
  if (matchPrimary) return true;
  if (parsedQuery.tokensArabicAlt.length > 0 && parsedQuery.tokensArabicAlt.every((t) => hay.includes(t))) {
    return true;
  }
  // Pencocokan akar kata yang dipisah tanda hubung ("ح - م - د" -> "حمد")
  if (String(targetText).includes('-')) {
    const compactHay = normalizeArabic(String(targetText).replace(/[\s\-]+/g, ''));
    const compactQ = parsedQuery.arabicPrimary.replace(/\s+/g, '');
    if (compactQ && compactHay.includes(compactQ)) return true;
  }
  return false;
}
