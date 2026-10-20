/**
 * compile_full_quran.js
 * Memproses 130,030 baris data morfologi & sintaksis kanonikal Al-Qur'an (The Quranic Arabic Corpus)
 * menjadi basis data terstruktur lengkap 114 Surah & 6,236 Ayat kata per kata.
 */

const fs = require('fs');
const path = require('path');

const RAW_FILE = path.join(__dirname, 'data', 'quran-morphology.txt');
const OUT_DIR = path.join(__dirname, 'app', 'public', 'data', 'quran');
const LOCAL_DATA_DIR = path.join(__dirname, 'data', 'quran');

// Pastikan direktori output ada
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });

// 114 Daftar Surah Lengkap Al-Qur'an
const SURAH_META = [
  { id: 1, name_ar: "الفاتحة", name_id: "Al-Fatihah", ayat_count: 7, type: "Makkiyyah", juz: 1 },
  { id: 2, name_ar: "البقرة", name_id: "Al-Baqarah", ayat_count: 286, type: "Madaniyyah", juz: 1 },
  { id: 3, name_ar: "آل عمران", name_id: "Ali 'Imran", ayat_count: 200, type: "Madaniyyah", juz: 3 },
  { id: 4, name_ar: "النساء", name_id: "An-Nisa'", ayat_count: 176, type: "Madaniyyah", juz: 4 },
  { id: 5, name_ar: "المائدة", name_id: "Al-Ma'idah", ayat_count: 120, type: "Madaniyyah", juz: 6 },
  { id: 6, name_ar: "الأنعام", name_id: "Al-An'am", ayat_count: 165, type: "Makkiyyah", juz: 7 },
  { id: 7, name_ar: "الأعراف", name_id: "Al-A'raf", ayat_count: 206, type: "Makkiyyah", juz: 8 },
  { id: 8, name_ar: "الأنفال", name_id: "Al-Anfal", ayat_count: 75, type: "Madaniyyah", juz: 9 },
  { id: 9, name_ar: "التوبة", name_id: "At-Taubah", ayat_count: 129, type: "Madaniyyah", juz: 10 },
  { id: 10, name_ar: "يونس", name_id: "Yunus", ayat_count: 109, type: "Makkiyyah", juz: 11 },
  { id: 11, name_ar: "هود", name_id: "Hud", ayat_count: 123, type: "Makkiyyah", juz: 11 },
  { id: 12, name_ar: "يوسف", name_id: "Yusuf", ayat_count: 111, type: "Makkiyyah", juz: 12 },
  { id: 13, name_ar: "الرعد", name_id: "Ar-Ra'd", ayat_count: 43, type: "Madaniyyah", juz: 13 },
  { id: 14, name_ar: "إبراهيم", name_id: "Ibrahim", ayat_count: 52, type: "Makkiyyah", juz: 13 },
  { id: 15, name_ar: "الحجر", name_id: "Al-Hijr", ayat_count: 99, type: "Makkiyyah", juz: 14 },
  { id: 16, name_ar: "النحل", name_id: "An-Nahl", ayat_count: 128, type: "Makkiyyah", juz: 14 },
  { id: 17, name_ar: "الإسراء", name_id: "Al-Isra'", ayat_count: 111, type: "Makkiyyah", juz: 15 },
  { id: 18, name_ar: "الكهف", name_id: "Al-Kahf", ayat_count: 110, type: "Makkiyyah", juz: 15 },
  { id: 19, name_ar: "مريم", name_id: "Maryam", ayat_count: 98, type: "Makkiyyah", juz: 16 },
  { id: 20, name_ar: "طه", name_id: "Thaha", ayat_count: 135, type: "Makkiyyah", juz: 16 },
  { id: 21, name_ar: "الأنبياء", name_id: "Al-Anbiya'", ayat_count: 112, type: "Makkiyyah", juz: 17 },
  { id: 22, name_ar: "الحج", name_id: "Al-Hajj", ayat_count: 78, type: "Madaniyyah", juz: 17 },
  { id: 23, name_ar: "المؤمنون", name_id: "Al-Mu'minun", ayat_count: 118, type: "Makkiyyah", juz: 18 },
  { id: 24, name_ar: "النور", name_id: "An-Nur", ayat_count: 64, type: "Madaniyyah", juz: 18 },
  { id: 25, name_ar: "الفرقان", name_id: "Al-Furqan", ayat_count: 77, type: "Makkiyyah", juz: 18 },
  { id: 26, name_ar: "الشعراء", name_id: "Asy-Syu'ara'", ayat_count: 227, type: "Makkiyyah", juz: 19 },
  { id: 27, name_ar: "النمل", name_id: "An-Naml", ayat_count: 93, type: "Makkiyyah", juz: 19 },
  { id: 28, name_ar: "القصص", name_id: "Al-Qashash", ayat_count: 88, type: "Makkiyyah", juz: 20 },
  { id: 29, name_ar: "العنكبوت", name_id: "Al-'Ankabut", ayat_count: 69, type: "Makkiyyah", juz: 20 },
  { id: 30, name_ar: "الروم", name_id: "Ar-Rum", ayat_count: 60, type: "Makkiyyah", juz: 21 },
  { id: 31, name_ar: "لقمان", name_id: "Luqman", ayat_count: 34, type: "Makkiyyah", juz: 21 },
  { id: 32, name_ar: "السجدة", name_id: "As-Sajdah", ayat_count: 30, type: "Makkiyyah", juz: 21 },
  { id: 33, name_ar: "الأحزاب", name_id: "Al-Ahzab", ayat_count: 73, type: "Madaniyyah", juz: 21 },
  { id: 34, name_ar: "سبأ", name_id: "Saba'", ayat_count: 54, type: "Makkiyyah", juz: 22 },
  { id: 35, name_ar: "فاطر", name_id: "Fathir", ayat_count: 45, type: "Makkiyyah", juz: 22 },
  { id: 36, name_ar: "يس", name_id: "Yasin", ayat_count: 83, type: "Makkiyyah", juz: 22 },
  { id: 37, name_ar: "الصافات", name_id: "Ash-Shaffat", ayat_count: 182, type: "Makkiyyah", juz: 23 },
  { id: 38, name_ar: "ص", name_id: "Shad", ayat_count: 88, type: "Makkiyyah", juz: 23 },
  { id: 39, name_ar: "الزمر", name_id: "Az-Zumar", ayat_count: 75, type: "Makkiyyah", juz: 23 },
  { id: 40, name_ar: "غافر", name_id: "Ghafir", ayat_count: 85, type: "Makkiyyah", juz: 24 },
  { id: 41, name_ar: "فصلت", name_id: "Fushshilat", ayat_count: 54, type: "Makkiyyah", juz: 24 },
  { id: 42, name_ar: "الشورى", name_id: "Asy-Syura", ayat_count: 53, type: "Makkiyyah", juz: 25 },
  { id: 43, name_ar: "الزخرف", name_id: "Az-Zukhruf", ayat_count: 89, type: "Makkiyyah", juz: 25 },
  { id: 44, name_ar: "الدخان", name_id: "Ad-Dukhan", ayat_count: 59, type: "Makkiyyah", juz: 25 },
  { id: 45, name_ar: "الجاثية", name_id: "Al-Jatsiyah", ayat_count: 37, type: "Makkiyyah", juz: 25 },
  { id: 46, name_ar: "الأحقاف", name_id: "Al-Ahqaf", ayat_count: 35, type: "Makkiyyah", juz: 26 },
  { id: 47, name_ar: "محمد", name_id: "Muhammad", ayat_count: 38, type: "Madaniyyah", juz: 26 },
  { id: 48, name_ar: "الفتح", name_id: "Al-Fath", ayat_count: 29, type: "Madaniyyah", juz: 26 },
  { id: 49, name_ar: "الحجرات", name_id: "Al-Hujurat", ayat_count: 18, type: "Madaniyyah", juz: 26 },
  { id: 50, name_ar: "ق", name_id: "Qaf", ayat_count: 45, type: "Makkiyyah", juz: 26 },
  { id: 51, name_ar: "الذاريات", name_id: "Adz-Dzariyat", ayat_count: 60, type: "Makkiyyah", juz: 26 },
  { id: 52, name_ar: "الطور", name_id: "Ath-Thur", ayat_count: 49, type: "Makkiyyah", juz: 27 },
  { id: 53, name_ar: "النجم", name_id: "An-Najm", ayat_count: 62, type: "Makkiyyah", juz: 27 },
  { id: 54, name_ar: "القمر", name_id: "Al-Qamar", ayat_count: 55, type: "Makkiyyah", juz: 27 },
  { id: 55, name_ar: "الرحمن", name_id: "Ar-Rahman", ayat_count: 78, type: "Madaniyyah", juz: 27 },
  { id: 56, name_ar: "الواقعة", name_id: "Al-Waqi'ah", ayat_count: 96, type: "Makkiyyah", juz: 27 },
  { id: 57, name_ar: "الحديد", name_id: "Al-Hadid", ayat_count: 29, type: "Madaniyyah", juz: 27 },
  { id: 58, name_ar: "المجادلة", name_id: "Al-Mujadilah", ayat_count: 22, type: "Madaniyyah", juz: 28 },
  { id: 59, name_ar: "الحشر", name_id: "Al-Hasyr", ayat_count: 24, type: "Madaniyyah", juz: 28 },
  { id: 60, name_ar: "الممتحنة", name_id: "Al-Mumtahanah", ayat_count: 13, type: "Madaniyyah", juz: 28 },
  { id: 61, name_ar: "الصف", name_id: "Ash-Shaff", ayat_count: 14, type: "Madaniyyah", juz: 28 },
  { id: 62, name_ar: "الجمعة", name_id: "Al-Jumu'ah", ayat_count: 11, type: "Madaniyyah", juz: 28 },
  { id: 63, name_ar: "المنافقون", name_id: "Al-Munafiqun", ayat_count: 11, type: "Madaniyyah", juz: 28 },
  { id: 64, name_ar: "التغابن", name_id: "At-Taghabun", ayat_count: 18, type: "Madaniyyah", juz: 28 },
  { id: 65, name_ar: "الطلاق", name_id: "Ath-Thalaq", ayat_count: 12, type: "Madaniyyah", juz: 28 },
  { id: 66, name_ar: "التحريم", name_id: "At-Tahrim", ayat_count: 12, type: "Madaniyyah", juz: 28 },
  { id: 67, name_ar: "الملك", name_id: "Al-Mulk", ayat_count: 30, type: "Makkiyyah", juz: 29 },
  { id: 68, name_ar: "القلم", name_id: "Al-Qalam", ayat_count: 52, type: "Makkiyyah", juz: 29 },
  { id: 69, name_ar: "الحاقة", name_id: "Al-Haqqah", ayat_count: 52, type: "Makkiyyah", juz: 29 },
  { id: 70, name_ar: "المعارج", name_id: "Al-Ma'arij", ayat_count: 44, type: "Makkiyyah", juz: 29 },
  { id: 71, name_ar: "نوح", name_id: "Nuh", ayat_count: 28, type: "Makkiyyah", juz: 29 },
  { id: 72, name_ar: "الجن", name_id: "Al-Jinn", ayat_count: 28, type: "Makkiyyah", juz: 29 },
  { id: 73, name_ar: "المزمل", name_id: "Al-Muzzammil", ayat_count: 20, type: "Makkiyyah", juz: 29 },
  { id: 74, name_ar: "المدثر", name_id: "Al-Muddatstsir", ayat_count: 56, type: "Makkiyyah", juz: 29 },
  { id: 75, name_ar: "القيامة", name_id: "Al-Qiyamah", ayat_count: 40, type: "Makkiyyah", juz: 29 },
  { id: 76, name_ar: "الإنسان", name_id: "Al-Insan", ayat_count: 31, type: "Madaniyyah", juz: 29 },
  { id: 77, name_ar: "المرسلات", name_id: "Al-Mursalat", ayat_count: 50, type: "Makkiyyah", juz: 29 },
  { id: 78, name_ar: "النبأ", name_id: "An-Naba'", ayat_count: 40, type: "Makkiyyah", juz: 30 },
  { id: 79, name_ar: "النازعات", name_id: "An-Nazi'at", ayat_count: 46, type: "Makkiyyah", juz: 30 },
  { id: 80, name_ar: "عبس", name_id: "'Abasa", ayat_count: 42, type: "Makkiyyah", juz: 30 },
  { id: 81, name_ar: "التكوير", name_id: "At-Takwir", ayat_count: 29, type: "Makkiyyah", juz: 30 },
  { id: 82, name_ar: "الانفطار", name_id: "Al-Infithar", ayat_count: 19, type: "Makkiyyah", juz: 30 },
  { id: 83, name_ar: "المطففين", name_id: "Al-Muthaffifin", ayat_count: 36, type: "Makkiyyah", juz: 30 },
  { id: 84, name_ar: "الانشقاق", name_id: "Al-Insyiqaq", ayat_count: 25, type: "Makkiyyah", juz: 30 },
  { id: 85, name_ar: "البروج", name_id: "Al-Buruj", ayat_count: 22, type: "Makkiyyah", juz: 30 },
  { id: 86, name_ar: "الطارق", name_id: "Ath-Thariq", ayat_count: 17, type: "Makkiyyah", juz: 30 },
  { id: 87, name_ar: "الأعلى", name_id: "Al-A'la", ayat_count: 19, type: "Makkiyyah", juz: 30 },
  { id: 88, name_ar: "الغاشية", name_id: "Al-Ghasyiyah", ayat_count: 26, type: "Makkiyyah", juz: 30 },
  { id: 89, name_ar: "الفجر", name_id: "Al-Fajr", ayat_count: 30, type: "Makkiyyah", juz: 30 },
  { id: 90, name_ar: "البلد", name_id: "Al-Balad", ayat_count: 20, type: "Makkiyyah", juz: 30 },
  { id: 91, name_ar: "الشمس", name_id: "Asy-Syams", ayat_count: 15, type: "Makkiyyah", juz: 30 },
  { id: 92, name_ar: "الليل", name_id: "Al-Lail", ayat_count: 21, type: "Makkiyyah", juz: 30 },
  { id: 93, name_ar: "الضحى", name_id: "Adh-Dhuha", ayat_count: 11, type: "Makkiyyah", juz: 30 },
  { id: 94, name_ar: "الشرح", name_id: "Asy-Syarh", ayat_count: 8, type: "Makkiyyah", juz: 30 },
  { id: 95, name_ar: "التين", name_id: "At-Tin", ayat_count: 8, type: "Makkiyyah", juz: 30 },
  { id: 96, name_ar: "العلق", name_id: "Al-'Alaq", ayat_count: 19, type: "Makkiyyah", juz: 30 },
  { id: 97, name_ar: "القدر", name_id: "Al-Qadr", ayat_count: 5, type: "Makkiyyah", juz: 30 },
  { id: 98, name_ar: "البينة", name_id: "Al-Bayyinah", ayat_count: 8, type: "Madaniyyah", juz: 30 },
  { id: 99, name_ar: "الزلزلة", name_id: "Az-Zalzalah", ayat_count: 8, type: "Madaniyyah", juz: 30 },
  { id: 100, name_ar: "العاديات", name_id: "Al-'Adiyat", ayat_count: 11, type: "Makkiyyah", juz: 30 },
  { id: 101, name_ar: "القارعة", name_id: "Al-Qari'ah", ayat_count: 11, type: "Makkiyyah", juz: 30 },
  { id: 102, name_ar: "التكاثر", name_id: "At-Takatsur", ayat_count: 8, type: "Makkiyyah", juz: 30 },
  { id: 103, name_ar: "العصر", name_id: "Al-'Ashr", ayat_count: 3, type: "Makkiyyah", juz: 30 },
  { id: 104, name_ar: "الهمزة", name_id: "Al-Humazah", ayat_count: 9, type: "Makkiyyah", juz: 30 },
  { id: 105, name_ar: "الفيل", name_id: "Al-Fil", ayat_count: 5, type: "Makkiyyah", juz: 30 },
  { id: 106, name_ar: "قريش", name_id: "Quraisy", ayat_count: 4, type: "Makkiyyah", juz: 30 },
  { id: 107, name_ar: "الماعون", name_id: "Al-Ma'un", ayat_count: 7, type: "Makkiyyah", juz: 30 },
  { id: 108, name_ar: "الكوثر", name_id: "Al-Kautsar", ayat_count: 3, type: "Makkiyyah", juz: 30 },
  { id: 109, name_ar: "الكافرون", name_id: "Al-Kafirun", ayat_count: 6, type: "Makkiyyah", juz: 30 },
  { id: 110, name_ar: "النصر", name_id: "An-Nasr", ayat_count: 3, type: "Madaniyyah", juz: 30 },
  { id: 111, name_ar: "المسد", name_id: "Al-Lahab", ayat_count: 5, type: "Makkiyyah", juz: 30 },
  { id: 112, name_ar: "الإخلاص", name_id: "Al-Ikhlas", ayat_count: 4, type: "Makkiyyah", juz: 30 },
  { id: 113, name_ar: "الفلق", name_id: "Al-Falaq", ayat_count: 5, type: "Makkiyyah", juz: 30 },
  { id: 114, name_ar: "الناس", name_id: "An-Nas", ayat_count: 6, type: "Makkiyyah", juz: 30 }
];

function getBina(root) {
  if (!root) return '-';
  const chars = Array.from(root);
  const weak = ['و', 'ي', 'ا', 'ى', 'ء'];
  if (chars.length === 3 && chars[1] === chars[2]) return 'Bina\' Mudha\'af (مضاعف)';
  if (chars.includes('أ') || chars.includes('إ') || chars.includes('ء')) return 'Bina\' Mahmuz (مهموز)';
  if (chars.length === 3) {
    const is1 = weak.includes(chars[0]);
    const is2 = weak.includes(chars[1]);
    const is3 = weak.includes(chars[2]);
    if ((is1 && is2) || (is1 && is3) || (is2 && is3)) return 'Bina\' Lafif (لفيف)';
    if (is1) return 'Bina\' Mu\'tal Mitsal (مثال)';
    if (is2) return 'Bina\' Mu\'tal Ajwaf (أجوف)';
    if (is3) return 'Bina\' Mu\'tal Naqis (ناقص)';
  }
  return 'Bina\' Shahih Salim (صحيح سالم)';
}

function getWazanForm(vf) {
  const forms = {
    '1': 'فَعَلَ / فَعِلَ / فَعُلَ (مجرد)',
    '2': 'فَعَّلَ - يُفَعِّلُ (Form II)',
    '3': 'فَاعَلَ - يُفَاعِلُ (Form III)',
    '4': 'أَفْعَلَ - يُفْعِلُ (Form IV)',
    '5': 'تَفَعَّلَ - يَتَفَعَّلُ (Form V)',
    '6': 'تَفَاعَلَ - يَتَفَاعَلُ (Form VI)',
    '7': 'انْفَعَلَ - يَنْفَعِلُ (Form VII)',
    '8': 'افْتَعَلَ - يَفْتَعِلُ (Form VIII)',
    '9': 'افْعَلَّ - يَفْعَلُّ (Form IX)',
    '10': 'اسْتَفْعَلَ - يَسْتَفْعِلُ (Form X)'
  };
  return forms[vf] || null;
}

console.log("Membaca data morfologi 130,030 baris...");
const content = fs.readFileSync(RAW_FILE, 'utf-8');
const lines = content.split('\n').filter(Boolean);

// Struktur data bertingkat: surah -> ayah -> word -> segments
const surahsData = {};

lines.forEach(line => {
  const [loc, surface, pos, featStr] = line.split('\t');
  if (!loc || !surface) return;

  const [sStr, aStr, wStr, segStr] = loc.split(':');
  const s = parseInt(sStr, 10);
  const a = parseInt(aStr, 10);
  const w = parseInt(wStr, 10);
  const seg = parseInt(segStr, 10);

  if (!surahsData[s]) surahsData[s] = {};
  if (!surahsData[s][a]) surahsData[s][a] = {};
  if (!surahsData[s][a][w]) surahsData[s][a][w] = [];

  const feats = featStr ? featStr.split('|') : [];
  let root = null;
  let lem = null;
  let vf = null;
  let mood = null;
  let isGen = false;
  let isNom = false;
  let isAcc = false;
  let isJus = false;
  let isSubj = false;
  let isInd = false;
  let isActPcpl = false;
  let isPassPcpl = false;
  let isVn = false;
  let isAdj = false;
  let isPron = false;
  let isPref = false;
  let isSuff = false;

  feats.forEach(f => {
    if (f.startsWith('ROOT:')) root = f.slice(5);
    else if (f.startsWith('LEM:')) lem = f.slice(4);
    else if (f.startsWith('VF:')) vf = f.slice(3);
    else if (f.startsWith('MOOD:')) mood = f.slice(5);
    else if (f === 'GEN') isGen = true;
    else if (f === 'NOM') isNom = true;
    else if (f === 'ACC') isAcc = true;
    else if (f === 'ACT_PCPL') isActPcpl = true;
    else if (f === 'PASS_PCPL') isPassPcpl = true;
    else if (f === 'VN') isVn = true;
    else if (f === 'ADJ') isAdj = true;
    else if (f === 'PRON') isPron = true;
    else if (f === 'PREF') isPref = true;
    else if (f === 'SUFF') isSuff = true;
  });

  surahsData[s][a][w].push({
    seg,
    surface,
    pos,
    root,
    lem,
    vf,
    mood,
    isGen,
    isNom,
    isAcc,
    isActPcpl,
    isPassPcpl,
    isVn,
    isAdj,
    isPron,
    isPref,
    isSuff,
    feats
  });
});

console.log("Menyusun ayat dan kata menjadi format ramah-aplikasi...");

// Proses per-Surah
let totalWordsGlobal = 0;
let totalAyahsGlobal = 0;

for (let sId = 1; sId <= 114; sId++) {
  const meta = SURAH_META[sId - 1];
  const sData = surahsData[sId] || {};
  const ayahsList = [];

  const ayahKeys = Object.keys(sData).map(Number).sort((a, b) => a - b);

  for (const aNum of ayahKeys) {
    totalAyahsGlobal++;
    const wData = sData[aNum] || {};
    const wordKeys = Object.keys(wData).map(Number).sort((a, b) => a - b);
    const wordsInAyah = [];

    for (const wNum of wordKeys) {
      totalWordsGlobal++;
      const segments = wData[wNum];
      
      // Gabungkan surface token kata
      const wordSurface = segments.map(s => s.surface).join('');

      // Tentukan peran utama kata
      const mainStem = segments.find(s => !s.isPref && !s.isSuff) || segments[0];
      const hasPrefix = segments.some(s => s.isPref);
      const hasSuffix = segments.some(s => s.isSuff);

      // Status I'rab
      let statusHukum = "Mabni";
      let tandaIrab = "Mabni";
      let kedudukanArab = "";
      let kedudukanIndo = "";

      if (segments.some(s => s.isNom || s.mood === 'IND')) {
        statusHukum = "Marfu'";
        tandaIrab = "Dhammah / Tsubutun Nun (Marfu')";
      } else if (segments.some(s => s.isAcc || s.mood === 'SUB')) {
        statusHukum = "Manshub";
        tandaIrab = "Fathah / Ya' / Hadzfun Nun (Manshub)";
      } else if (segments.some(s => s.isGen)) {
        statusHukum = "Majrur";
        tandaIrab = "Kasrah / Ya' (Majrur/Khafadh)";
      } else if (segments.some(s => s.mood === 'JUS')) {
        statusHukum = "Majzum";
        tandaIrab = "Sukun / Hadzfun Nun (Majzum)";
      }

      // Sharaf & Binyah
      let jenisSharaf = "Isim";
      let wazanSharaf = null;
      let rootSharaf = mainStem.root ? Array.from(mainStem.root).join(' - ') : '-';
      let binaSharaf = getBina(mainStem.root);
      let lemma = mainStem.lem || wordSurface;

      if (mainStem.pos === 'V') {
        if (mainStem.feats.includes('IMPV')) {
          jenisSharaf = "Fi'il Amr (فعل أمر)";
          statusHukum = "Mabni";
          tandaIrab = "Mabni 'ala Sukun / Hadzf";
        } else if (mainStem.feats.includes('PERF')) {
          jenisSharaf = "Fi'il Madhi (فعل ماض)";
          statusHukum = "Mabni";
          tandaIrab = "Mabni 'alal Fath / Sukun";
        } else {
          jenisSharaf = "Fi'il Mudhari' (فعل مضارع)";
        }
        wazanSharaf = getWazanForm(mainStem.vf) || "Wazan Fi'il";
      } else if (mainStem.isActPcpl) {
        jenisSharaf = "Isim Fa'il (اسم فاعل)";
        wazanSharaf = mainStem.vf ? getWazanForm(mainStem.vf) : "فَاعِلٌ";
      } else if (mainStem.isPassPcpl) {
        jenisSharaf = "Isim Maf'ul (اسم مفعول)";
        wazanSharaf = mainStem.vf ? getWazanForm(mainStem.vf) : "مَفْعُولٌ";
      } else if (mainStem.isVn) {
        jenisSharaf = "Mashdar Sharih (مصدر)";
        wazanSharaf = "مَصْدَرٌ";
      } else if (mainStem.isAdj) {
        jenisSharaf = "Isim Sifat / Na'at (صفة)";
      } else if (mainStem.isPron || mainStem.pos === 'PRON') {
        jenisSharaf = "Isim Dhamir (ضمير)";
        statusHukum = "Mabni";
      } else if (mainStem.pos === 'REL') {
        jenisSharaf = "Isim Maushul (اسم موصول)";
        statusHukum = "Mabni";
      } else if (mainStem.pos === 'DEM') {
        jenisSharaf = "Isim Isyarah (اسم إشارة)";
        statusHukum = "Mabni";
      } else if (mainStem.pos === 'P') {
        jenisSharaf = "Huruf (حرف)";
        statusHukum = "Mabni";
      }

      // Keterangan segmen
      const segKeterangan = segments.map(sg => {
        let label = sg.surface;
        if (sg.isPref) label += " [Prefiks]";
        if (sg.isSuff) label += " [Sufiks]";
        if (sg.root) label += ` (Akar: ${sg.root})`;
        return label;
      }).join(' + ');

      wordsInAyah.push({
        id_kata: `${sId}:${aNum}:${wNum}`,
        kata_arab: wordSurface,
        status_hukum: statusHukum,
        kedudukan_irab: `${jenisSharaf} - ${statusHukum} (${tandaIrab})`,
        kedudukan_indo: `${jenisSharaf} dalam susunan kalimat`,
        tanda_irab: tandaIrab,
        jenis_kata_sharaf: jenisSharaf,
        wazan_sharaf: wazanSharaf || (mainStem.pos === 'V' ? 'فَعَلَ' : 'اسم'),
        akar_kata: rootSharaf,
        jenis_bina: binaSharaf,
        lemma: lemma,
        rincian_segmen: segKeterangan
      });
    }

    const fullAyahText = wordsInAyah.map(w => w.kata_arab).join(' ');

    ayahsList.push({
      surah_id: sId,
      surah_name: meta.name_id,
      surah_arab: meta.name_ar,
      ayat_id: aNum,
      teks_ayat_arab: fullAyahText,
      total_kata: wordsInAyah.length,
      kata_per_kata: wordsInAyah
    });
  }

  const surahPayload = {
    ...meta,
    total_ayat_valid: ayahsList.length,
    ayat: ayahsList
  };

  // Simpan JSON per Surah di public/data/quran/surah_${id}.json
  fs.writeFileSync(path.join(OUT_DIR, `surah_${sId}.json`), JSON.stringify(surahPayload, null, 2), 'utf-8');
  // Simpan juga di data/quran/surah_${id}.json
  fs.writeFileSync(path.join(LOCAL_DATA_DIR, `surah_${sId}.json`), JSON.stringify(surahPayload, null, 2), 'utf-8');

  process.stdout.write(`.` );
  if (sId % 20 === 0) console.log(` [Surah ${sId}/114 selesai]`);
}

console.log("\nSelesai memproses 114 Surah!");
console.log(`Total Ayat: ${totalAyahsGlobal}`);
console.log(`Total Kata: ${totalWordsGlobal}`);

// Tulis juga surah_list.json
fs.writeFileSync(path.join(OUT_DIR, 'surah_list.json'), JSON.stringify(SURAH_META, null, 2), 'utf-8');
fs.writeFileSync(path.join(LOCAL_DATA_DIR, 'surah_list.json'), JSON.stringify(SURAH_META, null, 2), 'utf-8');

console.log("File surah_list.json berhasil dibuat di: " + path.join(OUT_DIR, 'surah_list.json'));
